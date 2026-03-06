export type Accessory = {
  slug: string;
  label: string;
  description: string;
  priceCents: number;
  imageUrl: string;
};

export const accessories: Accessory[] = [
  {
    slug: "power-control-module",
    label: "Power & Control Module (PCM)",
    description:
      "Central hub that powers the prop and manages all input/output signals. Required for standalone operation without an external controller.",
    priceCents: 19500,
    imageUrl: "/images/accessories/pcm.webp",
  },
  {
    slug: "motion-sensor-pir",
    label: "PIR Motion Sensor",
    description:
      "Passive infrared sensor that triggers the prop when guests walk into range. Adjustable sensitivity and delay.",
    priceCents: 3500,
    imageUrl: "/images/accessories/pir-sensor.webp",
  },
  {
    slug: "three-channel-dmx-controller",
    label: "3 Channel DMX Relay Controller",
    description:
      "Route prop triggers into a larger DMX lighting or show-control rig. Three independently addressable relay channels.",
    priceCents: 7500,
    imageUrl: "/images/accessories/dmx-controller.webp",
  },
  {
    slug: "dmx-light",
    label: "DMX Light",
    description:
      "Sync lighting cues with the performance. Mounts directly to the prop or nearby rigging.",
    priceCents: 3500,
    imageUrl: "/images/accessories/dmx-light.webp",
  },
  {
    slug: "two-channel-remote",
    label: "2 Channel Remote",
    description:
      "Simple handheld trigger control. Press a button, the prop fires. Great for queue-line scare actors.",
    priceCents: 3500,
    imageUrl: "/images/accessories/2ch-remote.webp",
  },
  {
    slug: "four-channel-remote",
    label: "4 Channel Remote",
    description:
      "Expanded remote control for show operators. Four independent channels for multi-prop setups.",
    priceCents: 4500,
    imageUrl: "/images/accessories/4ch-remote.webp",
  },
];

export function getAccessoryBySlug(slug: string): Accessory | undefined {
  return accessories.find((a) => a.slug === slug);
}
