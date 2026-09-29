export const SITE = {
  name: "FindUrWheeler",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://findurwheeler.com",
  tagline: "Find the right car for you",
  description:
    "Explore new cars in India: prices, variants, specifications, mileage, fuel types, upcoming launches and side-by-side comparisons.",
  footerText:
    "Your destination for car prices, specifications, comparisons, upcoming cars and automotive news.",
};

/** @type {{ label: string, href: string }[]} */
export const NAV_LINKS = [
  { label: "New Cars", href: "/cars" },
  { label: "Upcoming Cars", href: "/upcoming-cars" },
  { label: "Brands", href: "/brands" },
  { label: "Compare", href: "/compare" },
  { label: "News", href: "/news" },
];

/** Footer link columns. Every href points at a page that exists. */
export const FOOTER_COLUMNS = [
  {
    title: "Cars",
    links: [
      { label: "New Cars", href: "/cars" },
      { label: "Upcoming Cars", href: "/upcoming-cars" },
      { label: "Cars by Budget", href: "/#budget-title" },
      { label: "Compare Cars", href: "/compare" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Brands", href: "/brands" },
      { label: "Body Types", href: "/#body-title" },
      { label: "Fuel Types", href: "/#fuel-title" },
      { label: "Car News", href: "/news" },
    ],
  },
];

export const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

/**
 * Social profiles come from environment variables, never hardcoded. A profile is shown in the
 * footer only when its URL is set (must start with http:// or https://).
 */
export const SOCIAL_LINKS = [
  { name: "Facebook", icon: "facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL },
  { name: "Instagram", icon: "instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { name: "YouTube", icon: "youtube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL },
  { name: "LinkedIn", icon: "linkedin", href: process.env.NEXT_PUBLIC_LINKEDIN_URL },
].filter((link) => typeof link.href === "string" && /^https?:\/\//.test(link.href));
