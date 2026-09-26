import { ApiError, apiGet, buildQuery } from "./api.js";
import { toBrand, toCar } from "./car-model.js";
import { PAGE_SIZE, toApiParams } from "./listing.js";

const MAX_PAGES = 20;

function rowsOf(payload) {
  if (!payload || payload.success === false || !Array.isArray(payload.data)) {
    throw new Error("Unexpected response from the API");
  }
  return payload.data;
}

const isUsable = (car) => Boolean(car.slug && car.title);

/**
 * Every car (all pages). Used for facets, counts, similar cars and compare.
 * The API is paginated ({ page, per_page, total, pages, data }).
 */
export async function getCars() {
  const first = await apiGet("/cars");
  const pages = Math.min(Number(first?.pages) || 1, MAX_PAGES);
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) => apiGet(`/cars?page=${i + 2}`)),
  );
  return [first, ...rest].flatMap(rowsOf).map(toCar).filter(isUsable);
}

function matchesText(car, query) {
  const haystack = [car.title, car.brand, car.bodyType, car.segment, ...car.fuels].join(" ").toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

/**
 * One filtered, sorted, paginated page of cars, using the API's own filters:
 * brand, fuel, transmission, body_type, seats, min_price, max_price, sort, page, per_page.
 * The text `search` parameter is not confirmed; the API echoes what it applied in `filters`,
 * and if the echo does not match, the text filter is applied here on the returned page instead.
 */
export async function getCarsPage(filters) {
  const payload = await apiGet(`/cars${buildQuery(toApiParams(filters))}`);
  let cars = rowsOf(payload).map(toCar).filter(isUsable);

  let total = Number(payload.total);
  let pages = Number(payload.pages) || 1;

  const searchApplied = !filters.q || payload?.filters?.search === filters.q;
  if (!searchApplied) {
    cars = cars.filter((car) => matchesText(car, filters.q));
    total = cars.length;
    pages = 1;
  }

  return {
    cars,
    total: Number.isFinite(total) ? total : cars.length,
    page: Number(payload.page) || 1,
    pages,
    perPage: Number(payload.per_page) || PAGE_SIZE,
  };
}

/** GET /cars/{id}. Extra details are optional, so any failure returns null. */
export async function getCarDetail(id) {
  if (!id) return null;
  try {
    const payload = await apiGet(`/cars/${encodeURIComponent(id)}`);
    if (!payload || payload.success === false) return null;
    return payload.data ?? null;
  } catch {
    return null;
  }
}

/** GET /brands */
export async function getBrands() {
  const payload = await apiGet("/brands");
  return rowsOf(payload).map(toBrand).filter((brand) => brand.slug && brand.name);
}

/** GET /brands/{slug}. Returns null when the brand does not exist. */
export async function getBrand(slug) {
  try {
    const payload = await apiGet(`/brands/${encodeURIComponent(slug)}`);
    if (!payload || payload.success === false || !payload.data) return null;
    return toBrand(payload.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * GET /upcoming-cars. The response shape has not been confirmed yet: it is assumed to be
 * { success, data: [...] } with the same fields as /cars. Never throws.
 */
export async function getUpcomingCars() {
  try {
    const payload = await apiGet("/upcoming-cars");
    return { ok: true, cars: rowsOf(payload).map(toCar).filter(isUsable) };
  } catch {
    return { ok: false, cars: [] };
  }
}
