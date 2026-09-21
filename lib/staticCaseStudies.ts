export type StaticCaseStudy = {
  slug: string;
  title: string;
  summary: string;
  meta: { label: string; value: string }[];
  cover: string;
  coverAlt: string;
  listingImage: string;
  industry: string;
  year: string;
};

/** Registry of static case-study pages (not CMS-driven). Add future entries here. */
export const staticCaseStudies: StaticCaseStudy[] = [
  {
    slug: "wellme",
    title: "Wellme",
    summary:
      "An AI well-being coach for people who don't have anyone to talk to.",
    meta: [
      { label: "Client", value: "Personal" },
      { label: "Year", value: "2024" },
      { label: "Role", value: "UI/UX Designer" },
    ],
    cover: "/images/wellme/Frame 2085668825.png",
    coverAlt: "Wellme home screen on a phone",
    listingImage: "/images/wellme/Frame 2085668825.png",
    industry: "Healthcare & Wellness",
    year: "2024",
  },
];

export function getStaticCaseStudy(slug: string) {
  return staticCaseStudies.find((study) => study.slug === slug) ?? null;
}

export function wellmeAsset(filename: string) {
  return `/images/wellme/${encodeURIComponent(filename)}`;
}
