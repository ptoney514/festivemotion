import type { CatalogOptionGroup, CatalogProduct } from "@/lib/types";

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
  {
    slug: "skulltronix-skull",
    name: "SkullTronix Skull",
    shortDescription:
      "The flagship programmable skull performer for haunted attractions, escape rooms, and trade show demos.",
    description:
      "The SkullTronix Skull is a commercial-grade animatronic centerpiece with lifelike motion, glowing eyes, and swappable character finishes. It keeps the current FestiveMotion product logic but presents it in a cleaner Apple-style configuration flow.",
    basePriceCents: 139500,
    imageUrl:
      "https://festivemotion.com/wp-content/uploads/2025/08/SkullTronix-Trunk-or-Treat-Skull-2-600x900.webp",
    active: true,
    metadata: {
      category: "Arts & Entertainment",
      heroEyebrow: "Flagship Performer",
      heroSummary:
        "Build the signature SkullTronix rig with the right finish, base, and show-control extras for your attraction.",
      gallery: [
        {
          type: "image",
          src: "https://festivemotion.com/wp-content/uploads/2025/08/SkullTronix-Trunk-or-Treat-Skull-2-600x900.webp",
          alt: "Front hero view of the SkullTronix Skull animatronic.",
        },
        {
          type: "image",
          src: "https://festivemotion.com/wp-content/uploads/2025/08/DSC_8232-Edit.webp",
          alt: "Close detail shot of the SkullTronix Skull.",
        },
        {
          type: "image",
          src: "https://festivemotion.com/wp-content/uploads/2025/08/DSC_8115.webp",
          alt: "Display photo showing the SkullTronix Skull in a production setting.",
        },
      ],
      featureCards: [
        {
          eyebrow: "Performance",
          title: "Lifelike motion",
          description:
            "Jaw and articulated neck movement turn the skull into a true performer rather than a static prop.",
        },
        {
          eyebrow: "Show impact",
          title: "Character-ready finishes",
          description:
            "Swap between clean skull and themed paint variants without changing the purchase flow.",
        },
        {
          eyebrow: "Operations",
          title: "Built for repeat use",
          description:
            "Pre-calibrated, durable, and easy to integrate into queue lines, trade shows, or permanent attractions.",
        },
      ],
      specs: [
        "3D-printed commercial construction",
        "Moving jaw and fully articulated neck",
        "LED eyes with power control module and speaker included",
        "Approx. 8 x 8 x 11.5 inches / 6.28 lbs",
      ],
      inTheBox: [
        "SkullTronix Skull prop",
        "Wood block base by default",
        "Power control module",
        "Speaker and standard routine pack",
      ],
      note: "If you need the included routines swapped for custom selections, the team can handle that as an offline request.",
      leadTime: "Configured for commercial venues and trade show demos",
      shippingNote: "Product total only at checkout for MVP. Shipping is coordinated after purchase.",
      supportItems: commonSupportItems,
      relatedProductSlugs: [
        "skulltronix-skullkin",
        "skulltronix-trunk-or-treat-skull",
        "skulltronix-dancing-pumpkins-trio",
      ],
      pricing: {
        variantGroups: ["style", "base"],
        variants: [
          {
            match: { style: "basic", base: "wood-block" },
            priceCents: 139500,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/SkullTronix-Trunk-or-Treat-Skull-2-600x900.webp",
          },
          {
            match: { style: "basic", base: "black-wood-base" },
            priceCents: 147000,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/SkullTronix-Trunk-or-Treat-Skull-2-600x900.webp",
          },
          {
            match: { style: "basic", base: "3d-trophy-base" },
            priceCents: 147000,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/SkullTronix-Trunk-or-Treat-Skull-2-600x900.webp",
          },
          {
            match: { style: "basic", base: "skeleton-torso" },
            priceCents: 147000,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/SkullTronix-Trunk-or-Treat-Skull-2-600x900.webp",
          },
          {
            match: { style: "painted", base: "wood-block" },
            priceCents: 149500,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Painted.webp",
          },
          {
            match: { style: "painted", base: "black-wood-base" },
            priceCents: 155500,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Painted.webp",
          },
          {
            match: { style: "painted", base: "3d-trophy-base" },
            priceCents: 157000,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Painted.webp",
          },
          {
            match: { style: "painted", base: "skeleton-torso" },
            priceCents: 157000,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Painted.webp",
          },
          {
            match: { style: "witch", base: "wood-block" },
            priceCents: 149500,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Witch-scaled.webp",
          },
          {
            match: { style: "witch", base: "black-wood-base" },
            priceCents: 155500,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Witch-scaled.webp",
          },
          {
            match: { style: "witch", base: "3d-trophy-base" },
            priceCents: 157000,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Witch-scaled.webp",
          },
          {
            match: { style: "witch", base: "skeleton-torso" },
            priceCents: 157000,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Witch-scaled.webp",
          },
          {
            match: { style: "pirate", base: "wood-block" },
            priceCents: 149500,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Pirates.webp",
          },
          {
            match: { style: "pirate", base: "black-wood-base" },
            priceCents: 155500,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Pirates.webp",
          },
          {
            match: { style: "pirate", base: "3d-trophy-base" },
            priceCents: 157000,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Pirates.webp",
          },
          {
            match: { style: "pirate", base: "skeleton-torso" },
            priceCents: 157000,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Pirates.webp",
          },
          {
            match: { style: "clown", base: "wood-block" },
            priceCents: 149500,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Clown-600x900.webp",
          },
          {
            match: { style: "clown", base: "black-wood-base" },
            priceCents: 155500,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Clown-600x900.webp",
          },
          {
            match: { style: "clown", base: "3d-trophy-base" },
            priceCents: 157000,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Clown-600x900.webp",
          },
          {
            match: { style: "clown", base: "skeleton-torso" },
            priceCents: 157000,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Clown-600x900.webp",
          },
          {
            match: { style: "scarecrow", base: "wood-block" },
            priceCents: 149500,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Scarecrows-1-600x900.webp",
          },
          {
            match: { style: "scarecrow", base: "black-wood-base" },
            priceCents: 155500,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Scarecrows-1-600x900.webp",
          },
          {
            match: { style: "scarecrow", base: "3d-trophy-base" },
            priceCents: 157000,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Scarecrows-1-600x900.webp",
          },
          {
            match: { style: "scarecrow", base: "skeleton-torso" },
            priceCents: 157000,
            imageUrl:
              "https://festivemotion.com/wp-content/uploads/2025/08/Scarecrows-1-600x900.webp",
          },
          {
            match: { style: "vampire", base: "wood-block" },
            priceCents: 149500,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Vampires.png",
          },
          {
            match: { style: "vampire", base: "black-wood-base" },
            priceCents: 155500,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Vampires.png",
          },
          {
            match: { style: "vampire", base: "3d-trophy-base" },
            priceCents: 157000,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Vampires.png",
          },
          {
            match: { style: "vampire", base: "skeleton-torso" },
            priceCents: 157000,
            imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/Vampires.png",
          },
        ],
      },
    },
    optionGroups: [
      {
        slug: "style",
        name: "Style",
        description: "Choose the character finish that fits your attraction.",
        required: true,
        selectionType: "single",
        sortOrder: 10,
        metadata: {
          helperText: "SkullTronix supports a clean skull or themed painted characters.",
          whyItMatters:
            "This choice drives the personality of the piece and changes the hero image on the configurator.",
        },
        options: [
          { slug: "basic", label: "Basic", priceDeltaCents: 0, sortOrder: 10, isDefault: true },
          { slug: "painted", label: "Painted", priceDeltaCents: 0, sortOrder: 20 },
          { slug: "witch", label: "Witch", priceDeltaCents: 0, sortOrder: 30 },
          { slug: "pirate", label: "Pirate", priceDeltaCents: 0, sortOrder: 40 },
          { slug: "clown", label: "Clown", priceDeltaCents: 0, sortOrder: 50 },
          { slug: "scarecrow", label: "Scarecrow", priceDeltaCents: 0, sortOrder: 60 },
          { slug: "vampire", label: "Vampire", priceDeltaCents: 0, sortOrder: 70 },
        ],
      },
      {
        slug: "base",
        name: "Base",
        description: "Pick the display base that matches the installation.",
        required: true,
        selectionType: "single",
        sortOrder: 20,
        metadata: {
          helperText:
            "Wood block is the standard display base. The others are better suited to themed scenes or premium staging.",
          whyItMatters:
            "This changes how the prop sits in the environment and slightly affects the final configured price.",
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
            slug: "black-wood-base",
            label: "Black Wood Base",
            priceDeltaCents: 0,
            sortOrder: 20,
          },
          {
            slug: "3d-trophy-base",
            label: "3D Trophy Base",
            priceDeltaCents: 0,
            sortOrder: 30,
          },
          {
            slug: "skeleton-torso",
            label: "Skeleton Torso",
            priceDeltaCents: 0,
            sortOrder: 40,
          },
        ],
      },
      ...createCommonSkullGroups(),
    ],
  },
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
      heroEyebrow: "Creature Build",
      heroSummary:
        "Choose the display base, keep the included routines, and add the control extras your show actually needs.",
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
        "skulltronix-skull",
        "skulltronix-trunk-or-treat-skull",
        "skulltronix-dancing-pumpkin",
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
      "A trade show-friendly animatronic pumpkin with a cleaner Apple-style build path and optional show-control upgrades.",
    description:
      "The Dancing Pumpkin uses the Figma-led PDP structure as a polished modern configurator while keeping the live product and price point from the current store. It is the clearest example of where the rebuild is headed.",
    basePriceCents: 149500,
    imageUrl: "/figma/pdp/pumpkin-main.png",
    active: true,
    metadata: {
      category: "Magic & Novelties",
      heroEyebrow: "Trade Show Favorite",
      heroSummary:
        "Configure the motion controller, add extra themed audio, and choose the setup extras you need for transport or outdoor installs.",
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
