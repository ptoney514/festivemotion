import type {
  CatalogOptionGroup,
  CatalogProduct,
  ProductCapability,
} from "@/lib/types";

const commonSupportItems = [
  { title: "Warranty", subtitle: "2 years of coverage" },
  { title: "Trade Show Ready", subtitle: "Pre-calibrated before shipping" },
  { title: "Support", subtitle: "Direct help from the FestiveMotion team" },
];

const commonRoutineDefaults = [
  "witches-witches-witches",
  "tiptoe-through-the-graveyard",
  "spooky-scary-skeletons",
  "i-like-nightmares",
];

const skullLineupFamily = "skulltronix-skull-lineup";
const whiteSkullImage =
  "https://festivemotion.com/wp-content/uploads/2025/08/SkullTronix-Trunk-or-Treat-Skull-2-600x900.webp";

const skullStyleImages = {
  basic: whiteSkullImage,
  painted: "https://festivemotion.com/wp-content/uploads/2025/08/Painted.webp",
  witch: "https://festivemotion.com/wp-content/uploads/2025/08/Witch-scaled.webp",
  pirate: "https://festivemotion.com/wp-content/uploads/2025/08/Pirates.webp",
  clown: "https://festivemotion.com/wp-content/uploads/2025/08/Clown-600x900.webp",
  scarecrow: "https://festivemotion.com/wp-content/uploads/2025/08/Scarecrows-1-600x900.webp",
  vampire: "https://festivemotion.com/wp-content/uploads/2025/08/Vampires.png",
} as const;

const skullGallery = [
  {
    type: "image" as const,
    src: whiteSkullImage,
    alt: "Front hero view of the SkullTronix Skull animatronic.",
  },
  {
    type: "image" as const,
    src: "https://festivemotion.com/wp-content/uploads/2025/08/DSC_8232-Edit.webp",
    alt: "Close detail shot of the SkullTronix Skull.",
  },
  {
    type: "image" as const,
    src: "https://festivemotion.com/wp-content/uploads/2025/08/DSC_8115.webp",
    alt: "Display photo showing the SkullTronix Skull in a production setting.",
  },
];

type SkullTierKey = "bare-bones" | "plus" | "pro";

const skullTierCapabilities: Record<SkullTierKey, ProductCapability[]> = {
  "bare-bones": [
    { label: "Jaw movement", included: true },
    { label: "Glowing eyes", included: true },
    { label: "Eye movement", included: false },
    { label: "Head movement", included: false },
  ],
  plus: [
    { label: "Jaw movement", included: true },
    { label: "Glowing eyes", included: true },
    { label: "Eye movement", included: true },
    { label: "Head movement", included: false },
  ],
  pro: [
    { label: "Jaw movement", included: true },
    { label: "Glowing eyes", included: true },
    { label: "Eye movement", included: true },
    { label: "Head movement", included: true },
  ],
};

const skullTierSlugs = [
  "skulltronix-skull-bare-bones",
  "skulltronix-skull-plus",
  "skulltronix-skull",
];

const skullVariantOffsets: Record<string, Record<string, number>> = {
  basic: {
    "wood-block": 0,
    "black-wood-base": 7500,
    "3d-trophy-base": 7500,
    "skeleton-torso": 7500,
  },
  painted: {
    "wood-block": 10000,
    "black-wood-base": 16000,
    "3d-trophy-base": 17500,
    "skeleton-torso": 17500,
  },
  witch: {
    "wood-block": 10000,
    "black-wood-base": 16000,
    "3d-trophy-base": 17500,
    "skeleton-torso": 17500,
  },
  pirate: {
    "wood-block": 10000,
    "black-wood-base": 16000,
    "3d-trophy-base": 17500,
    "skeleton-torso": 17500,
  },
  clown: {
    "wood-block": 10000,
    "black-wood-base": 16000,
    "3d-trophy-base": 17500,
    "skeleton-torso": 17500,
  },
  scarecrow: {
    "wood-block": 10000,
    "black-wood-base": 16000,
    "3d-trophy-base": 17500,
    "skeleton-torso": 17500,
  },
  vampire: {
    "wood-block": 10000,
    "black-wood-base": 16000,
    "3d-trophy-base": 17500,
    "skeleton-torso": 17500,
  },
};

function createSkullCharacterGroup(): CatalogOptionGroup {
  return {
    slug: "style",
    name: "Character",
    description: "Choose the character configuration for your skull.",
    required: true,
    selectionType: "single",
    sortOrder: 10,
    metadata: {
      helperText: "Every skull model supports the same white and themed character finishes.",
      whyItMatters:
        "Character changes the look on stage, while Bare Bones, Plus, and Pro determine how much motion the skull can perform.",
    },
    options: [
      {
        slug: "basic",
        label: "Classic White",
        priceDeltaCents: 0,
        sortOrder: 10,
        isDefault: true,
        description: "Clean white skull finish.",
      },
      {
        slug: "painted",
        label: "Painted",
        priceDeltaCents: 0,
        sortOrder: 20,
        description: "Weathered painted finish for a more aged look.",
      },
      {
        slug: "witch",
        label: "Witch",
        priceDeltaCents: 0,
        sortOrder: 30,
        description: "Witch character finish with seasonal styling.",
      },
      {
        slug: "pirate",
        label: "Pirate",
        priceDeltaCents: 0,
        sortOrder: 40,
        description: "Pirate character finish for nautical scenes.",
      },
      {
        slug: "clown",
        label: "Clown",
        priceDeltaCents: 0,
        sortOrder: 50,
        description: "Clown finish for carnival and freakshow sets.",
      },
      {
        slug: "scarecrow",
        label: "Scarecrow",
        priceDeltaCents: 0,
        sortOrder: 60,
        description: "Harvest horror styling with rustic texture.",
      },
      {
        slug: "vampire",
        label: "Vampire",
        priceDeltaCents: 0,
        sortOrder: 70,
        description: "Vampire finish for gothic and castle scenes.",
      },
    ],
  };
}

function createSkullBaseGroup(): CatalogOptionGroup {
  return {
    slug: "base",
    name: "Base",
    description: "Pick the display base that matches the installation.",
    required: true,
    selectionType: "single",
    sortOrder: 20,
    metadata: {
      helperText:
        "The same mounting options stay available across Bare Bones, Plus, and Pro builds.",
      whyItMatters:
        "The motion package sets the performance level. The base changes how the final piece presents in your scene or booth.",
    },
    options: [
      {
        slug: "wood-block",
        label: "Wood Block",
        priceDeltaCents: 0,
        sortOrder: 10,
        isDefault: true,
        description: "Standard tabletop presentation.",
      },
      {
        slug: "black-wood-base",
        label: "Black Wood Base",
        priceDeltaCents: 0,
        sortOrder: 20,
        description: "A cleaner pedestal look for polished installs.",
      },
      {
        slug: "3d-trophy-base",
        label: "3D Trophy Base",
        priceDeltaCents: 0,
        sortOrder: 30,
        description: "Decorative display base with more visual presence.",
      },
      {
        slug: "skeleton-torso",
        label: "Skeleton Torso",
        priceDeltaCents: 0,
        sortOrder: 40,
        description: "Theatrical mount for fuller scene dressing.",
      },
    ],
  };
}

function createSkullPricing(basePriceCents: number) {
  return {
    variantGroups: ["style", "base"],
    variants: Object.entries(skullVariantOffsets).flatMap(([style, baseOffsets]) =>
      Object.entries(baseOffsets).map(([base, priceOffset]) => ({
        match: { style, base },
        priceCents: basePriceCents + priceOffset,
        imageUrl: skullStyleImages[style as keyof typeof skullStyleImages],
      })),
    ),
  };
}

function createSkullRelatedProductSlugs(currentSlug: string) {
  return [...skullTierSlugs.filter((slug) => slug !== currentSlug), "skulltronix-skullkin"];
}

function createSkullTierProduct({
  slug,
  name,
  tier,
  tierRank,
  basePriceCents,
  shortDescription,
  description,
  heroSummary,
  leadTime,
  featureCards,
  specs,
}: {
  slug: string;
  name: string;
  tier: string;
  tierRank: number;
  basePriceCents: number;
  shortDescription: string;
  description: string;
  heroSummary: string;
  leadTime: string;
  featureCards: CatalogProduct["metadata"]["featureCards"];
  specs: string[];
}) {
  const tierKey = slug.includes("bare-bones")
    ? "bare-bones"
    : slug.includes("plus")
      ? "plus"
      : "pro";

  return {
    slug,
    name,
    shortDescription,
    description,
    basePriceCents,
    imageUrl: whiteSkullImage,
    active: true,
    metadata: {
      capabilities: skullTierCapabilities[tierKey],
      category: "Skull Models",
      family: skullLineupFamily,
      gallery: skullGallery,
      heroEyebrow: "Skull Model",
      heroSummary,
      leadTime,
      note: "This page locks the motion package. If you need a different movement level, switch to the other skull models above instead of changing it inside the configurator.",
      pricing: createSkullPricing(basePriceCents),
      relatedProductSlugs: createSkullRelatedProductSlugs(slug),
      shippingNote: "Product total only at checkout for MVP. Shipping is coordinated after purchase.",
      specs,
      supportItems: commonSupportItems,
      featureCards,
      inTheBox: [
        `${name} prop`,
        "Wood block base by default",
        "Power control module",
        "Speaker and standard routine pack",
      ],
      tier,
      tierRank,
    },
    optionGroups: [createSkullCharacterGroup(), createSkullBaseGroup(), ...createCommonSkullGroups()],
  };
}

function createCommonSkullGroups(): CatalogOptionGroup[] {
  return [
    {
      slug: "add-ons",
      name: "Add-ons",
      description: "Upgrade triggering and control with attraction-friendly accessories.",
      required: false,
      selectionType: "multi",
      sortOrder: 30,
      metadata: {
        helperText:
          "Optional hardware that helps your skull integrate into a haunt, queue line, or trade show loop.",
        whyItMatters:
          "These add-ons make the prop easier to trigger, sync, and control in a professional setup.",
      },
      options: [
        {
          slug: "motion-sensor-pir",
          label: "Motion Sensor (PIR)",
          priceDeltaCents: 3500,
          sortOrder: 10,
          description: "Trigger the prop when guests approach.",
        },
        {
          slug: "dmx-light",
          label: "DMX Light",
          priceDeltaCents: 3500,
          sortOrder: 20,
          description: "Sync lighting cues with the performance.",
        },
        {
          slug: "two-channel-remote",
          label: "2 Channel Remote",
          priceDeltaCents: 3500,
          sortOrder: 30,
          description: "Simple handheld trigger control.",
        },
        {
          slug: "four-channel-remote",
          label: "4 Channel Remote",
          priceDeltaCents: 4500,
          sortOrder: 40,
          description: "Expanded remote control for show operators.",
        },
        {
          slug: "three-channel-dmx-controller",
          label: "3-Channel DMX Controller",
          priceDeltaCents: 7500,
          sortOrder: 50,
          description: "Route motion into a larger lighting show.",
        },
      ],
    },
    {
      slug: "included-routines",
      name: "Included routines",
      description: "These four routines ship with every skull.",
      required: false,
      selectionType: "multi",
      sortOrder: 40,
      metadata: {
        display: "included-list",
        helperText: "Included with your prop at no extra charge.",
      },
      options: [
        {
          slug: "witches-witches-witches",
          label: "Witches Witches Witches",
          priceDeltaCents: 0,
          sortOrder: 10,
          isDefault: true,
        },
        {
          slug: "tiptoe-through-the-graveyard",
          label: "Tiptoe Through The Graveyard",
          priceDeltaCents: 0,
          sortOrder: 20,
          isDefault: true,
        },
        {
          slug: "spooky-scary-skeletons",
          label: "Spooky Scary Skeletons",
          priceDeltaCents: 0,
          sortOrder: 30,
          isDefault: true,
        },
        {
          slug: "i-like-nightmares",
          label: "I Like Nightmares",
          priceDeltaCents: 0,
          sortOrder: 40,
          isDefault: true,
        },
      ],
    },
    {
      slug: "premium-routines",
      name: "Premium routines",
      description: "Add more themed performance tracks to match your scene.",
      required: false,
      selectionType: "multi",
      sortOrder: 50,
      metadata: {
        helperText:
          "Premium routines are added to the included set. If you need substitutions, the team can handle that offline.",
        whyItMatters:
          "This is where the Apple-style configurator becomes genuinely useful: buyers can tailor content without losing price control.",
      },
      options: [
        {
          slug: "crazy-clown",
          label: "Crazy Clown",
          priceDeltaCents: 7500,
          sortOrder: 10,
        },
        {
          slug: "clown-freakshow",
          label: "Clown Freakshow",
          priceDeltaCents: 7500,
          sortOrder: 20,
        },
        {
          slug: "killer-clowns",
          label: "Killer Clowns",
          priceDeltaCents: 7500,
          sortOrder: 30,
        },
        {
          slug: "swamp-witch",
          label: "Swamp Witch",
          priceDeltaCents: 0,
          sortOrder: 40,
        },
        {
          slug: "grimsley-ghosts",
          label: "Grimsley Ghosts",
          priceDeltaCents: 7500,
          sortOrder: 50,
        },
        {
          slug: "seance",
          label: "Seance",
          priceDeltaCents: 7500,
          sortOrder: 60,
        },
        {
          slug: "girl-in-white",
          label: "Girl In White",
          priceDeltaCents: 7500,
          sortOrder: 70,
        },
        {
          slug: "madman",
          label: "Madman",
          priceDeltaCents: 7500,
          sortOrder: 80,
        },
        {
          slug: "caged-creep",
          label: "Caged Creep",
          priceDeltaCents: 7500,
          sortOrder: 90,
        },
        {
          slug: "mad-scientist",
          label: "Mad Scientist",
          priceDeltaCents: 7500,
          sortOrder: 100,
        },
        {
          slug: "cannibal-buffet",
          label: "Cannibal Buffet",
          priceDeltaCents: 7500,
          sortOrder: 110,
        },
        {
          slug: "house-of-pain",
          label: "House of Pain",
          priceDeltaCents: 7500,
          sortOrder: 120,
        },
        {
          slug: "the-haunting",
          label: "The Haunting",
          priceDeltaCents: 7500,
          sortOrder: 130,
        },
        {
          slug: "asylum-patient",
          label: "Asylum Patient",
          priceDeltaCents: 7500,
          sortOrder: 140,
        },
        {
          slug: "straight-ahead",
          label: "Straight Ahead",
          priceDeltaCents: 7500,
          sortOrder: 150,
        },
        {
          slug: "three-skull-rules",
          label: "3 Skull Rules",
          priceDeltaCents: 7500,
          sortOrder: 160,
        },
        {
          slug: "day-of-the-dead",
          label: "Day Of The Dead",
          priceDeltaCents: 7500,
          sortOrder: 170,
        },
        {
          slug: "skeleton-jokes",
          label: "Skeleton Jokes",
          priceDeltaCents: 7500,
          sortOrder: 180,
        },
      ],
    },
  ];
}

export const catalogSeed: CatalogProduct[] = [
  createSkullTierProduct({
    slug: "skulltronix-skull-bare-bones",
    name: "SkullTronix Skull Bare Bones",
    tier: "Bare Bones",
    tierRank: 1,
    basePriceCents: 54900,
    shortDescription:
      "Entry-level skull build with jaw movement and glowing eyes for budget-conscious installs.",
    description:
      "Bare Bones is the entry point into the SkullTronix skull lineup. It keeps the animated jaw, glowing eyes, and the full character, base, routine, and add-on menu, but skips eye and neck articulation.",
    heroSummary:
      "Start with the most affordable SkullTronix motion package, then choose your character, base, routines, and control extras.",
    leadTime: "Entry-level skull build for haunts, counters, and compact demos",
    featureCards: [
      {
        eyebrow: "Motion package",
        title: "Jaw movement and glowing eyes",
        description:
          "This model delivers the animated mouth and lit eye presence that make the skull feel alive without adding moving eye or head mechanics.",
      },
      {
        eyebrow: "Character lineup",
        title: "Same finishes as the higher tiers",
        description:
          "Pirate, Vampire, Witch, Clown, Scarecrow, and the clean white skull are all still available here.",
      },
      {
        eyebrow: "Show control",
        title: "Same add-ons and routines",
        description:
          "Control extras, included routines, premium routines, and base options stay identical across the full skull lineup.",
      },
    ],
    specs: [
      "3D-printed commercial skull construction",
      "Jaw movement with glowing LED eyes",
      "Fixed head and fixed eye position",
      "Approx. 8 x 8 x 11.5 inches / 6.28 lbs",
    ],
  }),
  createSkullTierProduct({
    slug: "skulltronix-skull-plus",
    name: "SkullTronix Skull Plus",
    tier: "Plus",
    tierRank: 2,
    basePriceCents: 64900,
    shortDescription:
      "Mid-tier skull build that adds left-right and up-down eye movement while the head stays fixed.",
    description:
      "Skull Plus keeps everything in Bare Bones and adds moving eyes for more expression. It is the middle ground for buyers who want stronger performance without stepping all the way up to the full-motion neck assembly.",
    heroSummary:
      "Choose Plus when you want animated eye movement in addition to the jaw and glowing eyes, then configure the same finishes and accessories as the rest of the lineup.",
    leadTime: "Balanced skull build for scenes that need more expression without head motion",
    featureCards: [
      {
        eyebrow: "Motion package",
        title: "Animated eyes without neck movement",
        description:
          "Plus adds left-right and up-down eye movement, which gives the performer more personality while keeping the head stationary.",
      },
      {
        eyebrow: "Character lineup",
        title: "Built on the same skull shell",
        description:
          "You still get the same character finishes and the same white-skull foundation shown throughout the lineup.",
      },
      {
        eyebrow: "Show control",
        title: "Same add-ons and routines",
        description:
          "The motion upgrade does not change the accessory stack, base options, or routine catalog buyers can add below.",
      },
    ],
    specs: [
      "3D-printed commercial skull construction",
      "Jaw movement with glowing LED eyes",
      "Eye movement: left/right and up/down",
      "Fixed head position",
    ],
  }),
  createSkullTierProduct({
    slug: "skulltronix-skull",
    name: "SkullTronix Skull Pro",
    tier: "Pro",
    tierRank: 3,
    basePriceCents: 119900,
    shortDescription:
      "Full-motion SkullTronix skull with jaw, glowing eyes, moving eyes, and complete head articulation.",
    description:
      "Pro is the full-motion version that was previously shown on the site as the default white SkullTronix skull. It combines jaw movement, glowing eyes, animated eyes, and full head movement for the most expressive performance package in the lineup.",
    heroSummary:
      "Build the full-motion SkullTronix rig with the right character finish, base, routines, and show-control extras for your attraction.",
    leadTime: "Full-motion flagship skull for haunted attractions and premium demos",
    featureCards: [
      {
        eyebrow: "Motion package",
        title: "Full eye and head articulation",
        description:
          "Jaw movement, glowing eyes, full eye movement, and left-right, up-down, plus side-to-side head motion make this the most lifelike skull build.",
      },
      {
        eyebrow: "Character lineup",
        title: "Same finishes, maximum performance",
        description:
          "Use the white skull or swap to Pirate, Vampire, Witch, Clown, Scarecrow, and more without leaving the Pro motion tier.",
      },
      {
        eyebrow: "Operations",
        title: "Built for repeat nightly use",
        description:
          "Pre-calibrated, durable, and easy to integrate into queue lines, trade shows, or permanent attractions.",
      },
    ],
    specs: [
      "3D-printed commercial construction",
      "Jaw movement and full head articulation",
      "Glowing LED eyes with left/right and up/down eye movement",
      "Approx. 8 x 8 x 11.5 inches / 6.28 lbs",
    ],
  }),
  {
    slug: "skulltronix-skullkin",
    name: "SkullTronix Skullkin",
    shortDescription:
      "A skull-pumpkin hybrid animatronic built for eerie displays and memorable trade show moments.",
    description:
      "The SkullTronix Skullkin keeps the same commercial-grade motion package but wraps it in a more character-driven Halloween shell. It is ideal for buyers who want a premium centerpiece without configuring a full themed finish matrix.",
    basePriceCents: 154500,
    imageUrl:
      "https://festivemotion.com/wp-content/uploads/2025/08/skullkinvertical-600x900.webp",
    active: true,
    metadata: {
      category: "Arts & Entertainment",
      heroCtaLabel: "Build Your Skullkin",
      heroEyebrow: "Creature Build",
      heroHighlights: [
        "Orange Skullkin shell",
        "Commercial motion platform",
        "Show-ready control options",
      ],
      heroSummary:
        "Choose the display base, keep the included routines, and add the control extras your show actually needs.",
      heroTagline: "Orange shell. Skull stare. Built to stop people cold.",
      gallery: [
        {
          type: "image",
          src: "https://festivemotion.com/wp-content/uploads/2025/08/skullkinvertical-600x900.webp",
          alt: "Front view of the SkullTronix Skullkin animatronic.",
        },
        {
          type: "image",
          src: "https://festivemotion.com/wp-content/uploads/2025/08/skullkinvertical.webp",
          alt: "Tall product image for the SkullTronix Skullkin.",
        },
      ],
      featureCards: [
        {
          eyebrow: "Character",
          title: "Skull-meets-pumpkin silhouette",
          description:
            "A more stylized horror prop for buyers who want something less literal than a standard skull.",
        },
        {
          eyebrow: "Motion",
          title: "Same commercial control foundation",
          description:
            "It inherits the same trigger, remote, and DMX upgrade path as the flagship skull platform.",
        },
      ],
      specs: [
        "3D-printed skull-pumpkin hybrid construction",
        "Twitching jaw and twisting neck motion",
        "LED eyes with included power control module and speaker",
        "Approx. 8 x 7 x 16 inches / 6.92 lbs",
      ],
      inTheBox: [
        "SkullTronix Skullkin prop",
        "Wood block base by default",
        "Power control module",
        "Speaker and standard routine pack",
      ],
      note: "All Skullkin builds ship with the four included routines already loaded.",
      leadTime: "A character-driven skull build for haunts and seasonal installations",
      shippingNote: "Product total only at checkout for MVP. Shipping is coordinated after purchase.",
      supportItems: commonSupportItems,
      relatedProductSlugs: [
        "skulltronix-skull-bare-bones",
        "skulltronix-skull-plus",
        "skulltronix-skull",
      ],
    },
    optionGroups: [
      {
        slug: "base",
        name: "Base",
        description: "Pick the mounting style for your Skullkin.",
        required: true,
        selectionType: "single",
        sortOrder: 10,
        metadata: {
          helperText: "Wood block is the simpler tabletop presentation. Skeleton torso makes it more theatrical.",
        },
        options: [
          {
            slug: "wood-block",
            label: "Wood Block",
            priceDeltaCents: 0,
            sortOrder: 10,
            isDefault: true,
          },
          {
            slug: "skeleton-torso",
            label: "Skeleton Torso",
            priceDeltaCents: 6000,
            sortOrder: 20,
          },
        ],
      },
      ...createCommonSkullGroups(),
    ],
  },
  {
    slug: "skulltronix-trunk-or-treat-skull",
    name: "SkullTronix Trunk or Treat Skull",
    shortDescription:
      "A high-impact Halloween tailgate centerpiece with the same customizable motion platform behind it.",
    description:
      "The Trunk or Treat Skull is a simpler single-step themed build: pick the finish, then layer in show-control extras and additional routines. It fits the MVP perfectly because it stays easy to browse on mobile while still proving the pricing engine.",
    basePriceCents: 149500,
    imageUrl:
      "https://festivemotion.com/wp-content/uploads/2025/08/SkullTronix-Trunk-or-Treat-Skull-1.webp",
    active: true,
    metadata: {
      category: "Magic & Novelties",
      heroEyebrow: "Tailgate Hero",
      heroSummary:
        "Choose the finish, add operator-friendly control gear, and take the same SkullTronix performance into a more seasonal event format.",
      gallery: [
        {
          type: "image",
          src: "https://festivemotion.com/wp-content/uploads/2025/08/SkullTronix-Trunk-or-Treat-Skull-1.webp",
          alt: "SkullTronix Trunk or Treat Skull in a front-facing setup.",
        },
        {
          type: "image",
          src: "https://festivemotion.com/wp-content/uploads/2025/08/SkullTronix-Trunk-or-Treat-Skull.webp",
          alt: "Alternate angle of the Trunk or Treat Skull.",
        },
      ],
      featureCards: [
        {
          eyebrow: "Events",
          title: "Made for fast seasonal setups",
          description:
            "A better fit for trunk-or-treats, temporary installs, and quick-hit seasonal activations.",
        },
        {
          eyebrow: "Flexibility",
          title: "Shared SkullTronix accessory path",
          description:
            "Still supports the same add-on stack, so the buying journey remains consistent across products.",
        },
      ],
      specs: [
        "Mounted on a skeleton torso display",
        "Event-friendly Halloween presentation",
        "Compatible with the same trigger and control accessories as other skulls",
      ],
      inTheBox: [
        "Trunk or Treat Skull prop",
        "Mounted display assembly",
        "Power control module and speaker",
        "Included standard routine pack",
      ],
      supportItems: commonSupportItems,
      relatedProductSlugs: [
        "skulltronix-skull",
        "skulltronix-skullkin",
        "skulltronix-dancing-pumpkin",
      ],
    },
    optionGroups: [
      {
        slug: "style",
        name: "Style",
        description: "Pick the themed finish for your seasonal build.",
        required: true,
        selectionType: "single",
        sortOrder: 10,
        metadata: {
          helperText: "Basic is the cleanest setup. Specialty characters increase the total immediately.",
        },
        options: [
          {
            slug: "basic",
            label: "Basic",
            priceDeltaCents: 0,
            sortOrder: 10,
            isDefault: true,
            metadata: {
              imageUrl:
                "https://festivemotion.com/wp-content/uploads/2025/08/SkullTronix-Trunk-or-Treat-Skull-2-600x900.webp",
            },
          },
          {
            slug: "painted",
            label: "Painted",
            priceDeltaCents: 10000,
            sortOrder: 20,
            metadata: {
              imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Painted.webp",
            },
          },
          {
            slug: "witch",
            label: "Witch",
            priceDeltaCents: 10000,
            sortOrder: 30,
            metadata: {
              imageUrl:
                "https://festivemotion.com/wp-content/uploads/2025/08/Witch-scaled.webp",
            },
          },
          {
            slug: "pirate",
            label: "Pirate",
            priceDeltaCents: 10000,
            sortOrder: 40,
            metadata: {
              imageUrl:
                "https://festivemotion.com/wp-content/uploads/2025/08/Pirates-1-600x900.webp",
            },
          },
          {
            slug: "clown",
            label: "Clown",
            priceDeltaCents: 10000,
            sortOrder: 50,
            metadata: {
              imageUrl:
                "https://festivemotion.com/wp-content/uploads/2025/08/Clown-600x900.webp",
            },
          },
          {
            slug: "scarecrow",
            label: "Scarecrow",
            priceDeltaCents: 10000,
            sortOrder: 60,
            metadata: {
              imageUrl:
                "https://festivemotion.com/wp-content/uploads/2025/08/Scarecrows-1-600x900.webp",
            },
          },
          {
            slug: "vampire",
            label: "Vampire",
            priceDeltaCents: 10000,
            sortOrder: 70,
            metadata: {
              imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Vampires.png",
            },
          },
          {
            slug: "skullkin",
            label: "Skullkin",
            priceDeltaCents: 15000,
            sortOrder: 80,
            metadata: {
              imageUrl:
                "https://festivemotion.com/wp-content/uploads/2025/08/skullkinvertical-600x900.webp",
            },
          },
        ],
      },
      ...createCommonSkullGroups(),
    ],
  },
  {
    slug: "skulltronix-dancing-pumpkin",
    name: "SkullTronix Dancing Pumpkin",
    shortDescription:
      "A high-energy animatronic pumpkin with internal glow effects, articulated dancing movement, and four included routines.",
    description:
      "The SkullTronix Dancing Pumpkin is built to stop traffic at haunted attractions, party installs, and trade show booths. It pairs a playful dancing motion with internal multi-color lighting and an easy-to-demo setup that can still scale up with show-control accessories.",
    basePriceCents: 149500,
    imageUrl: "/products/dancing-pumpkin-hero.webp",
    active: true,
    metadata: {
      category: "Magic & Novelties",
      heroEyebrow: "Featured Animatronic",
      heroHighlights: [
        "4 routines included",
        "Internal multi-color glow",
        "Trade show and haunt ready",
      ],
      heroImageUrl: "/products/dancing-pumpkin-hero.webp",
      heroSummary:
        "A playful, high-energy animatronic with articulated movement, glowing personality, and a compact setup that is easy to demo. Every pumpkin ships with a black wood base, speaker, power control module, and four included routines.",
      heroTagline: "Born to boogie.",
      gallery: [
        {
          type: "image",
          src: "/figma/pdp/pumpkin-main.png",
          alt: "Front hero view of the Dancing Pumpkin animatronic.",
        },
        {
          type: "image",
          src: "/figma/pdp/pumpkin-detail.png",
          alt: "Close-up detail of the Dancing Pumpkin face and glow effects.",
        },
        {
          type: "image",
          src: "/figma/pdp/pumpkin-side.png",
          alt: "Side profile of the Dancing Pumpkin animatronic.",
        },
      ],
      featureCards: [
        {
          eyebrow: "Motion",
          title: "Fluid dancing movement",
          description:
            "Articulated movement gives the prop personality on a trade show floor or in a haunt scene.",
        },
        {
          eyebrow: "Presence",
          title: "Internal glow effects",
          description:
            "Lighting and motion combine to make the pumpkin readable from across the booth or attraction.",
        },
        {
          eyebrow: "Deployment",
          title: "Easy to demo",
          description:
            "The controller and accessory set can stay simple for a demo rig or expand for a larger installation.",
        },
      ],
      specs: [
        "Smooth dancing motion with internal glow effects",
        "Standalone controller setup with optional DMX integration",
        "Outdoor-rated extension available as an add-on",
      ],
      inTheBox: [
        "Dancing Pumpkin animatronic",
        "Standard 3-channel controller",
        "Power cabling and setup guide",
      ],
      supportItems: commonSupportItems,
      relatedProductSlugs: [
        "skulltronix-dancing-pumpkins-trio",
        "skulltronix-skullkin",
        "skulltronix-skull",
      ],
    },
    optionGroups: [
      {
        slug: "controller",
        name: "Controller",
        description: "Choose the control package for the install.",
        required: true,
        selectionType: "single",
        sortOrder: 10,
        metadata: {
          helperText: "The standard controller is enough for demos. DMX is better for coordinated scenes.",
          whyItMatters:
            "This mirrors the Apple-style primary configuration decision: simple buyer language, clear upgrade value, and immediate pricing feedback.",
        },
        options: [
          {
            slug: "standard-3-channel-controller",
            label: "Standard 3-Channel Controller",
            description: "Basic motion loops and standalone operation",
            priceDeltaCents: 0,
            sortOrder: 10,
            isDefault: true,
          },
          {
            slug: "pro-dmx-interface",
            label: "Pro DMX Interface",
            description: "Sync with lighting, fog, and external triggers",
            priceDeltaCents: 12500,
            sortOrder: 20,
          },
        ],
      },
      {
        slug: "included-routines",
        name: "Included routine",
        description: "Your default performance track.",
        required: false,
        selectionType: "multi",
        sortOrder: 20,
        metadata: {
          display: "included-list",
          helperText: "Included at no extra charge.",
        },
        options: [
          {
            slug: "witches-witches-witches",
            label: "Witches Witches Witches",
            priceDeltaCents: 0,
            sortOrder: 10,
            isDefault: true,
          },
        ],
      },
      {
        slug: "premium-audio",
        name: "Additional audio packs",
        description: "Add extra themed content to your pumpkin build.",
        required: false,
        selectionType: "multi",
        sortOrder: 30,
        metadata: {
          helperText: "Use these to tailor the prop for different seasonal moments or demos.",
        },
        options: [
          {
            slug: "killer-cinema-tunes",
            label: "Killer Cinema Tunes",
            priceDeltaCents: 7500,
            sortOrder: 10,
          },
          {
            slug: "swamp-witch-ambience",
            label: "Swamp Witch Ambience",
            priceDeltaCents: 7500,
            sortOrder: 20,
          },
        ],
      },
      {
        slug: "setup-extras",
        name: "Setup extras",
        description: "Pick the transport or install accessories you need.",
        required: false,
        selectionType: "multi",
        sortOrder: 40,
        metadata: {
          helperText: "Useful for outdoor use, road cases, and repeated setup/teardown.",
        },
        options: [
          {
            slug: "50ft-extension",
            label: "50ft Extension",
            description: "Outdoor rated",
            priceDeltaCents: 4500,
            sortOrder: 10,
          },
          {
            slug: "storage-case",
            label: "Storage Case",
            description: "Hard shell flight case",
            priceDeltaCents: 29900,
            sortOrder: 20,
          },
        ],
      },
    ],
  },
  {
    slug: "skulltronix-dancing-pumpkins-trio",
    name: "SkullTronix Dancing Pumpkins Trio",
    shortDescription:
      "A synchronized triple-pumpkin setup for buyers who want more spectacle per install.",
    description:
      "The trio takes the same visual idea as the single Dancing Pumpkin and stretches it into a larger scene piece. For MVP it stays intentionally simple: choose the show-control package and the transport extras, then check out.",
    basePriceCents: 377500,
    imageUrl:
      "https://festivemotion.com/wp-content/uploads/2025/08/Pumpkin-Trio.webp",
    active: true,
    metadata: {
      category: "Arts & Entertainment",
      heroEyebrow: "Large Format Display",
      heroSummary:
        "A synchronized trio for windows, entry moments, and trade show backdrops where one prop is not enough.",
      gallery: [
        {
          type: "image",
          src: "https://festivemotion.com/wp-content/uploads/2025/08/Pumpkin-Trio.webp",
          alt: "Three dancing pumpkins moving together as a synchronized trio.",
        },
        {
          type: "image",
          src: "https://festivemotion.com/wp-content/uploads/2025/08/Pumpkin-Trio-2.webp",
          alt: "Alternate view of the Dancing Pumpkins Trio setup.",
        },
      ],
      featureCards: [
        {
          eyebrow: "Scale",
          title: "More visual impact",
          description:
            "A better fit for buyers who need a centerpiece display with more footprint and spectacle.",
        },
        {
          eyebrow: "Control",
          title: "Synchronized performance",
          description:
            "The upgraded control option makes it easier to coordinate a full scene for a booth or attraction.",
        },
      ],
      specs: [
        "Triple synchronized pumpkin rig",
        "Large-format seasonal display piece",
        "Optional DMX-ready show controller",
      ],
      inTheBox: [
        "Three-pumpkin synchronized animatronic set",
        "Standard sync controller",
        "Power cabling and setup guide",
      ],
      supportItems: commonSupportItems,
      relatedProductSlugs: [
        "skulltronix-dancing-pumpkin",
        "skulltronix-skullkin",
        "skulltronix-skull",
      ],
    },
    optionGroups: [
      {
        slug: "show-control",
        name: "Show control",
        description: "Pick the controller package for the trio.",
        required: true,
        selectionType: "single",
        sortOrder: 10,
        metadata: {
          helperText: "The standard package is suitable for standalone installs. DMX is better for coordinated scenes.",
        },
        options: [
          {
            slug: "standard-sync-controller",
            label: "Standard Sync Controller",
            priceDeltaCents: 0,
            sortOrder: 10,
            isDefault: true,
          },
          {
            slug: "dmx-show-controller",
            label: "DMX Show Controller",
            priceDeltaCents: 19500,
            sortOrder: 20,
          },
        ],
      },
      {
        slug: "transport-extras",
        name: "Transport extras",
        description: "Add support gear for repeat seasonal setup.",
        required: false,
        selectionType: "multi",
        sortOrder: 20,
        metadata: {
          helperText: "These are the most practical upgrades for teams moving the trio between installs.",
        },
        options: [
          {
            slug: "weatherproof-extension-kit",
            label: "Weatherproof Extension Kit",
            priceDeltaCents: 6500,
            sortOrder: 10,
          },
          {
            slug: "rolling-road-case",
            label: "Rolling Road Case",
            priceDeltaCents: 49900,
            sortOrder: 20,
          },
          {
            slug: "spare-lighting-module",
            label: "Spare Lighting Module",
            priceDeltaCents: 8500,
            sortOrder: 30,
          },
        ],
      },
    ],
  },
];

export function getDefaultRoutineSlugs() {
  return commonRoutineDefaults;
}
