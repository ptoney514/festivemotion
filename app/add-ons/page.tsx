import { AccessoryCard } from "@/components/accessory-card";
import { RoutineCard } from "@/components/routine-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { accessories } from "@/lib/accessories";
import { getRoutineCategories, getRoutinesByCategory } from "@/lib/routines";

export const metadata = {
  title: "Add-ons | FestiveMotion",
  description:
    "Standalone accessories, sensors, remotes, DMX controllers, and audio routine previews for FestiveMotion animatronics.",
};

export default function AddOnsPage() {
  const categories = getRoutineCategories();
  const routinesByCategory = getRoutinesByCategory();

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

        {/* ─── Audio Routines ─── */}
        <section className="mt-16 rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
            Performance Library
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-white">
            Audio routines
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/65">
            Every FestiveMotion animatronic ships with four included routines.
            Preview the full library below — premium routines can be added
            during product configuration for $75 each.
          </p>
        </section>

        {categories.map((category) => {
          const categoryRoutines = routinesByCategory[category.slug];
          if (!categoryRoutines?.length) return null;
          return (
            <section key={category.slug} className="mt-8">
              <div className="mb-4">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-white/45">
                  {category.description}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categoryRoutines.map((routine) => (
                  <RoutineCard key={routine.slug} routine={routine} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <SiteFooter />
    </>
  );
}
