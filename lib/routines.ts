export type RoutineCategory = {
  slug: string;
  name: string;
  description: string;
};

export type Routine = {
  slug: string;
  label: string;
  categorySlug: string;
  included: boolean;
  priceCents: number;
  audioUrl: string;
};

export const routineCategories: RoutineCategory[] = [
  {
    slug: "clowns",
    name: "Clowns",
    description: "Circus-inspired frights with unhinged carnival energy.",
  },
  {
    slug: "supernatural",
    name: "Supernatural",
    description: "Ethereal hauntings and otherworldly encounters.",
  },
  {
    slug: "horror",
    name: "Horror",
    description: "Visceral terror and psychological dread.",
  },
  {
    slug: "haunted-locations",
    name: "Haunted Locations",
    description: "Atmosphere inspired by cursed places.",
  },
  {
    slug: "ambient",
    name: "Ambient",
    description: "Mood-setting soundscapes and playful performances.",
  },
  {
    slug: "nightmares",
    name: "Nightmares",
    description: "Dark, surreal dreamscapes brought to life.",
  },
];

export const routines: Routine[] = [
  // ── Clowns ──
  { slug: "crazy-clown", label: "Crazy Clown", categorySlug: "clowns", included: false, priceCents: 7500, audioUrl: "/audio/routines/crazy-clown.mp3" },
  { slug: "clown-freakshow", label: "Clown Freakshow", categorySlug: "clowns", included: false, priceCents: 7500, audioUrl: "/audio/routines/clown-freakshow.mp3" },
  { slug: "killer-clowns", label: "Killer Clowns", categorySlug: "clowns", included: false, priceCents: 7500, audioUrl: "/audio/routines/killer-clowns.mp3" },

  // ── Supernatural ──
  { slug: "swamp-witch", label: "Swamp Witch", categorySlug: "supernatural", included: false, priceCents: 7500, audioUrl: "/audio/routines/swamp-witch.mp3" },
  { slug: "grimsley-ghosts", label: "Grimsley Ghosts", categorySlug: "supernatural", included: false, priceCents: 7500, audioUrl: "/audio/routines/grimsley-ghosts.mp3" },
  { slug: "seance", label: "Seance", categorySlug: "supernatural", included: false, priceCents: 7500, audioUrl: "/audio/routines/seance.mp3" },
  { slug: "girl-in-white", label: "Girl In White", categorySlug: "supernatural", included: false, priceCents: 7500, audioUrl: "/audio/routines/girl-in-white.mp3" },

  // ── Horror ──
  { slug: "madman", label: "Madman", categorySlug: "horror", included: false, priceCents: 7500, audioUrl: "/audio/routines/madman.mp3" },
  { slug: "caged-creep", label: "Caged Creep", categorySlug: "horror", included: false, priceCents: 7500, audioUrl: "/audio/routines/caged-creep.mp3" },
  { slug: "mad-scientist", label: "Mad Scientist", categorySlug: "horror", included: false, priceCents: 7500, audioUrl: "/audio/routines/mad-scientist.mp3" },
  { slug: "cannibal-buffet", label: "Cannibal Buffet", categorySlug: "horror", included: false, priceCents: 7500, audioUrl: "/audio/routines/cannibal-buffet.mp3" },

  // ── Haunted Locations ──
  { slug: "house-of-pain", label: "House of Pain", categorySlug: "haunted-locations", included: false, priceCents: 7500, audioUrl: "/audio/routines/house-of-pain.mp3" },
  { slug: "the-haunting", label: "The Haunting", categorySlug: "haunted-locations", included: false, priceCents: 7500, audioUrl: "/audio/routines/the-haunting.mp3" },
  { slug: "asylum-patient", label: "Asylum Patient", categorySlug: "haunted-locations", included: false, priceCents: 7500, audioUrl: "/audio/routines/asylum-patient.mp3" },

  // ── Ambient ──
  { slug: "witches-witches-witches", label: "Witches Witches Witches", categorySlug: "ambient", included: true, priceCents: 0, audioUrl: "/audio/routines/witches-witches-witches.mp3" },
  { slug: "tiptoe-through-the-graveyard", label: "Tiptoe Through The Graveyard", categorySlug: "ambient", included: true, priceCents: 0, audioUrl: "/audio/routines/tiptoe-through-the-graveyard.mp3" },
  { slug: "spooky-scary-skeletons", label: "Spooky Scary Skeletons", categorySlug: "ambient", included: true, priceCents: 0, audioUrl: "/audio/routines/spooky-scary-skeletons.mp3" },
  { slug: "straight-ahead", label: "Straight Ahead", categorySlug: "ambient", included: false, priceCents: 7500, audioUrl: "/audio/routines/straight-ahead.mp3" },
  { slug: "three-skull-rules", label: "3 Skull Rules", categorySlug: "ambient", included: false, priceCents: 7500, audioUrl: "/audio/routines/three-skull-rules.mp3" },
  { slug: "day-of-the-dead", label: "Day Of The Dead", categorySlug: "ambient", included: false, priceCents: 7500, audioUrl: "/audio/routines/day-of-the-dead.mp3" },
  { slug: "skeleton-jokes", label: "Skeleton Jokes", categorySlug: "ambient", included: false, priceCents: 7500, audioUrl: "/audio/routines/skeleton-jokes.mp3" },

  // ── Nightmares ──
  { slug: "i-like-nightmares", label: "I Like Nightmares", categorySlug: "nightmares", included: true, priceCents: 0, audioUrl: "/audio/routines/i-like-nightmares.mp3" },
];

export function getRoutinesByCategory(): Record<string, Routine[]> {
  const grouped: Record<string, Routine[]> = {};
  for (const cat of routineCategories) {
    grouped[cat.slug] = routines.filter((r) => r.categorySlug === cat.slug);
  }
  return grouped;
}

export function getRoutineCategories(): RoutineCategory[] {
  return routineCategories;
}
