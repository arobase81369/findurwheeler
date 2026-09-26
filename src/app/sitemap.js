import { getBrands, getCars } from "@/lib/cars";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
  const pages = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/cars`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/brands`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/upcoming-cars`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/compare`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [cars, brands] = await Promise.all([getCars().catch(() => []), getBrands().catch(() => [])]);

  return [
    ...pages,
    ...brands.map((brand) => ({ url: `${SITE.url}/brands/${brand.slug}` })),
    ...cars.map((car) => ({ url: `${SITE.url}/cars/${car.slug}` })),
  ];
}
