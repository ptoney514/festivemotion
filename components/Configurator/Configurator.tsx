"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useState, useTransition } from "react";
import { formatCurrency } from "@/lib/format";
import { buildDefaultSelections, calculatePrice, getConfiguredImage } from "@/lib/pricing";
import { useCart } from "@/lib/cart-context";
import type { CatalogProduct, PricedConfiguration, SelectionMap } from "@/lib/types";
import { OptionGroup } from "@/components/Configurator/OptionGroup";
import { SummaryCard } from "@/components/Configurator/SummaryCard";
import { SkullModelCard } from "@/components/skull-model-card";

function buildGallery(product: CatalogProduct, selections: SelectionMap) {
  const configuredImage = getConfiguredImage(product, selections);
  const firstImage = {
    type: "image" as const,
    src: configuredImage,
    alt: `${product.name} configured view`,
  };

  return [
    firstImage,
    ...product.metadata.gallery.filter((item) => item.src !== configuredImage),
  ];
}

export function Configurator({
  product,
  modelLineup = [],
}: {
  product: CatalogProduct;
  modelLineup?: CatalogProduct[];
}) {
  const initialSelections = buildDefaultSelections(product);
  const [selections, setSelections] = useState<SelectionMap>(initialSelections);
  const [serverPrice, setServerPrice] = useState<PricedConfiguration>(
    calculatePrice(product, initialSelections),
  );
  const { addConfiguredItem, openCart } = useCart();
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPricingSyncing, startPricingTransition] = useTransition();

  const optimisticPrice = calculatePrice(product, selections);
  const displayPrice = serverPrice ?? optimisticPrice;
  const deferredSelections = useDeferredValue(selections);
  const gallery = buildGallery(product, selections);
  const activeMedia = gallery[activeMediaIndex] ?? gallery[0];

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      try {
        const response = await fetch("/api/price", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productSlug: product.slug,
            selections: deferredSelections,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const nextPrice = (await response.json()) as PricedConfiguration;

        if (!controller.signal.aborted) {
          startPricingTransition(() => {
            setServerPrice(nextPrice);
          });
        }
      } catch {
        if (!controller.signal.aborted) {
          startPricingTransition(() => {
            setServerPrice(optimisticPrice);
          });
        }
      }
    })();

    return () => controller.abort();
  }, [deferredSelections, optimisticPrice, product.slug]);

  function handleToggle(groupSlug: string, optionSlug: string) {
    setSelections((currentSelections) => {
      const group = product.optionGroups.find((candidate) => candidate.slug === groupSlug);

      if (!group) {
        return currentSelections;
      }

      if (group.selectionType === "single") {
        return {
          ...currentSelections,
          [groupSlug]: optionSlug,
        };
      }

      const existing = currentSelections[groupSlug];
      const values = Array.isArray(existing)
        ? existing
        : typeof existing === "string"
          ? [existing]
          : [];

      const nextValues = values.includes(optionSlug)
        ? values.filter((value) => value !== optionSlug)
        : [...values, optionSlug];

      return {
        ...currentSelections,
        [groupSlug]: nextValues,
      };
    });
  }

  function handleAddToCart() {
    addConfiguredItem({
      productSlug: product.slug,
      productName: product.name,
      productImageUrl: product.imageUrl,
      selections,
      lineItems: displayPrice.lineItems,
      selectedOptions: displayPrice.selectedOptions,
      totalCents: displayPrice.totalCents,
    });
    openCart();
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  }

  return (
    <div className="pb-28 lg:pb-0">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/45">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="transition hover:text-white">
            Products
          </Link>
          <span>/</span>
          <span className="text-white/70">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] xl:grid-cols-[minmax(0,0.9fr)_minmax(0,0.95fr)_360px]">
          <section className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.16),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(0,0,0,0.12))]">
              <div className="relative aspect-[4/5]">
                <Image
                  src={activeMedia.src}
                  alt={activeMedia.alt}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1280px) 100vw, 45vw"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((item, index) => (
                <button
                  key={`${item.src}-${index}`}
                  type="button"
                  onClick={() => setActiveMediaIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border ${
                    index === activeMediaIndex
                      ? "border-[#ff5a1f]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                {product.metadata.heroEyebrow ?? "Configure"}
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
                {product.metadata.heroSummary ?? product.description}
              </p>
              {product.metadata.capabilities?.length ? (
                <div className="mt-6 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
                  {product.metadata.capabilities.map((capability) => (
                    <div
                      key={capability.label}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                    >
                      <p className="text-sm font-medium text-white">{capability.label}</p>
                      <p
                        className={`mt-2 text-xs uppercase tracking-[0.16em] ${
                          capability.included ? "text-[#ffb089]" : "text-white/40"
                        }`}
                      >
                        {capability.included ? "Included In This Model" : "Not Included"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="mt-6 flex flex-wrap items-end gap-6 border-t border-white/10 pt-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">From</p>
                  <p className="text-3xl font-semibold text-white">
                    {formatCurrency(product.basePriceCents)}
                  </p>
                </div>
                {product.metadata.leadTime ? (
                  <p className="max-w-sm text-sm text-white/50">{product.metadata.leadTime}</p>
                ) : null}
              </div>
            </div>

            {modelLineup.length > 1 ? (
              <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                  Skull lineup
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                  Choose your motion package first.
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60">
                  Bare Bones, Plus, and Pro are separate products. This page keeps you on{" "}
                  {product.metadata.tier ?? product.name}; if you need a different movement
                  package, switch models here before you configure the base, routines, and
                  add-ons below.
                </p>

                <div className="mt-5 grid gap-3">
                  {modelLineup.map((model) => (
                    <SkullModelCard
                      key={model.slug}
                      product={model}
                      current={model.slug === product.slug}
                      compact
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <div className="xl:hidden">
              <SummaryCard
                actionLabel={addedFeedback ? "Added!" : "Add to Cart"}
                busy={addedFeedback}
                disabled={isPricingSyncing}
                onAction={handleAddToCart}
                price={displayPrice}
              />
            </div>

            {product.optionGroups.map((group) => {
              const rawSelection = selections[group.slug];
              const selectedValues = Array.isArray(rawSelection)
                ? rawSelection
                : typeof rawSelection === "string"
                  ? [rawSelection]
                  : [];

              return (
                <OptionGroup
                  key={group.slug}
                  group={group}
                  selectedValues={selectedValues}
                  onToggle={handleToggle}
                />
              );
            })}

            {product.metadata.note ? (
              <div className="rounded-[26px] border border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-white/55">
                {product.metadata.note}
              </div>
            ) : null}
          </section>

          <aside className="hidden xl:block xl:sticky xl:top-28 xl:self-start">
            <SummaryCard
              actionLabel={addedFeedback ? "Added!" : "Add to Cart"}
              busy={addedFeedback}
              disabled={isPricingSyncing}
              onAction={handleAddToCart}
              price={displayPrice}
            />
          </aside>
        </div>

        {product.metadata.featureCards?.length ? (
          <section className="mt-16">
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Product Highlights
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                Why this product works on the floor
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {product.metadata.featureCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
                >
                  {card.eyebrow ? (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ffb089]">
                      {card.eyebrow}
                    </p>
                  ) : null}
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{card.description}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
              Details
            </p>
            <div className="mt-5 space-y-3">
              <details className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3" open>
                <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                  Technical specs
                </summary>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-white/55">
                  {product.metadata.specs?.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </details>
              <details className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                  What’s in the box
                </summary>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-white/55">
                  {product.metadata.inTheBox?.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </details>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {(product.metadata.supportItems ?? []).map((item) => (
              <article
                key={item.title}
                className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                  Support
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.subtitle}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[rgba(8,8,8,0.96)] p-4 backdrop-blur-xl xl:hidden">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(true)}
            className="text-left"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-white/45">Configured total</p>
            <p className="text-lg font-semibold text-white">
              {formatCurrency(displayPrice.totalCents)}
            </p>
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addedFeedback || isPricingSyncing || !displayPrice.valid}
            className="button-light inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed"
          >
            {addedFeedback ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>

      {mobileSummaryOpen ? (
        <div className="fixed inset-0 z-[60] bg-black/70 px-4 py-8 xl:hidden">
          <div className="mx-auto max-w-[640px]">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileSummaryOpen(false)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white"
              >
                Close
              </button>
            </div>
            <SummaryCard
              actionLabel={addedFeedback ? "Added!" : "Add to Cart"}
              busy={addedFeedback}
              disabled={isPricingSyncing}
              onAction={handleAddToCart}
              price={displayPrice}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
