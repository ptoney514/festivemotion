import { AccessoryCard } from "@/components/accessory-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { accessories } from "@/lib/accessories";

export const metadata = {
  title: "Add-ons | FestiveMotion",
  description:
    "Standalone accessories for FestiveMotion animatronics — sensors, remotes, DMX controllers, and more.",
};

export default function AddOnsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
            Standalone accessories
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
            Add-ons &amp; accessories
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-white/65">
            Power modules, sensors, remotes, and DMX controllers that work with
            any FestiveMotion animatronic. Buy them standalone or add them during
            product configuration.
          </p>
        </section>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {accessories.map((accessory) => (
            <AccessoryCard key={accessory.slug} accessory={accessory} />
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
