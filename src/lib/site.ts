export const SITE = {
  name: "FindUrWheeler",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://findurwheeler.com",
  tagline: "Find the right car for you",
  description:
    "Explore new cars in India: prices, variants, specifications, mileage, fuel types, upcoming launches and side-by-side comparisons.",
} as const;

export type NavLink = { label: string; href: string };

export const NAV_LINKS: readonly NavLink[] = [
  { label: "New Cars", href: "/cars" },
  { label: "Upcoming Cars", href: "/upcoming-cars" },
  { label: "Brands", href: "/brands" },
  { label: "Compare", href: "/compare" },
  { label: "News", href: "/news" },
];
