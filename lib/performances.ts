export type PerformanceVideo = {
  slug: string;
  title: string;
  eyebrow: string;
  shortDescription: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  duration: string;
  comingSoon?: boolean;
};

export const performances: PerformanceVideo[] = [
  {
    slug: "czar-of-bizarre",
    title: "Czar of Bizarre",
    eyebrow: "Clown Freakshow",
    shortDescription: "A choreographed clown routine with full jaw and head articulation.",
    description:
      "Watch SkullTronix bring the Clown Freakshow to life with synchronized jaw movement, head tracking, and expressive LED sequences — all choreographed to a custom audio track.",
    videoUrl: "https://assets.smallhr.app/festivemotion/videos/czar-of-bizarre.mp4",
    posterUrl: "https://assets.smallhr.app/festivemotion/videos/czar-of-bizarre-poster.webp",
    duration: "2:54",
  },
  {
    slug: "midnight-marionette",
    title: "Midnight Marionette",
    eyebrow: "Gothic Theater",
    shortDescription: "Haunting Victorian puppet choreography under blacklight.",
    description: "",
    videoUrl: "",
    posterUrl: "",
    duration: "3:10",
    comingSoon: true,
  },
  {
    slug: "bone-brigade",
    title: "Bone Brigade",
    eyebrow: "Skeleton Crew",
    shortDescription: "Multi-skull synchronized dance sequence.",
    description: "",
    videoUrl: "",
    posterUrl: "",
    duration: "4:22",
    comingSoon: true,
  },
];
