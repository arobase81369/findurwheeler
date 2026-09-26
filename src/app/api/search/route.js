import { apiGet, buildQuery } from "@/lib/api";
import { toCarTitle } from "@/lib/car-model";

const EMPTY = { cars: [], brands: [] };

/**
 * GET /api/search?q=creta
 * Proxies the WordPress /search endpoint ({ data: { cars: [...], brands: [...] } }) and
 * returns only what the suggestion list needs.
 */
export async function GET(request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim().slice(0, 60);
  if (q.length < 2) return Response.json(EMPTY);

  try {
    const payload = await apiGet(`/search${buildQuery({ q })}`, { revalidate: 60 });
    const data = payload?.data ?? {};

    const cars = (Array.isArray(data.cars) ? data.cars : [])
      .filter((car) => car?.slug)
      .slice(0, 6)
      .map((car) => ({ slug: String(car.slug), title: toCarTitle(car.name, car.brand) }));

    const brands = (Array.isArray(data.brands) ? data.brands : [])
      .filter((brand) => brand?.slug && brand?.name)
      .slice(0, 4)
      .map((brand) => ({ slug: String(brand.slug), name: String(brand.name) }));

    return Response.json({ cars, brands });
  } catch {
    return Response.json(EMPTY);
  }
}
