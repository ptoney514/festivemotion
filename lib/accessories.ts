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
    imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/DSC_8182-Edit.webp",
  },
  {
    slug: "motion-sensor-pir",
    label: "PIR Motion Sensor",
    description:
      "Passive infrared sensor that triggers the prop when guests walk into range. Adjustable sensitivity and delay.",
    priceCents: 3500,
    imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/DSC_8115.webp",
  },
  {
    slug: "three-channel-dmx-controller",
    label: "3 Channel DMX Relay Controller",
    description:
      "Route prop triggers into a larger DMX lighting or show-control rig. Three independently addressable relay channels.",
    priceCents: 7500,
    imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/IMG_3207-scaled.jpg",
  },
  {
    slug: "dmx-light",
    label: "DMX Light",
    description:
      "Sync lighting cues with the performance. Mounts directly to the prop or nearby rigging.",
    priceCents: 3500,
    imageUrl: "https://festivemotion.com/wp-content/uploads/2025/08/DSC_8205-Edit.webp",
  },
  {
    slug: "two-channel-remote",
    label: "2 Channel Remote",
    description:
      "Simple handheld trigger control. Press a button, the prop fires. Great for queue-line scare actors.",
    priceCents: 3500,
    imageUrl: "https://festivemotion.com/wp-content/uploads/2025/09/2-ch_wireless_remote-scaled.jpg",
  },
  {
    slug: "four-channel-remote",
    label: "4 Channel Remote",
    description:
      "Expanded remote control for show operators. Four independent channels for multi-prop setups.",
    priceCents: 4500,
    imageUrl: "https://festivemotion.com/wp-content/uploads/2025/09/4-ch_wirelessremote-scaled.jpg",
  },
];

export function getAccessoryBySlug(slug: string): Accessory | undefined {
  return accessories.find((a) => a.slug === slug);
}
