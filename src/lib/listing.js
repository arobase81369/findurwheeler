import { findBudget } from "./facets.js";

export const PAGE_SIZE = 12;

/** `value` is sent to the API as ?sort=. "" leaves the API default (recently updated). */
export const SORTS = [
  { value: "", label: "Recently updated" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "mileage_desc", label: "Mileage: high to low" },
];

const first = (value) => (Array.isArray(value) ? value[0] : value);

/** URL search params -> filter object. */
export function readFilters(searchParams) {
  const get = (key) => String(first(searchParams?.[key]) ?? "").trim();
  return {
    q: get("q"),
    brand: get("brand"),
    fuel: get("fuel"),
    transmission: get("transmission"),
    bodyType: get("body_type"),
    seats: get("seats"),
    budget: get("budget"),
    sort: get("sort"),
    page: Math.max(1, parseInt(get("page"), 10) || 1),
  };
}

const PARAM_NAMES = {
  q: "q",
  brand: "brand",
  fuel: "fuel",
  transmission: "transmission",
  bodyType: "body_type",
  seats: "seats",
  budget: "budget",
  sort: "sort",
  page: "page",
};

/** Builds a /cars URL from the current filters plus changes. Changing a filter resets the page. */
export function hrefWith(filters, changes = {}) {
  const next = { ...filters, page: 1, ...changes };
  const params = new URLSearchParams();
  for (const [key, param] of Object.entries(PARAM_NAMES)) {
    const value = next[key];
    if (value === "" || value === null || value === undefined) continue;
    if (key === "page" && Number(value) <= 1) continue;
    params.set(param, String(value));
  }
  const query = params.toString();
  return query ? `/cars?${query}` : "/cars";
}

/** Filter object -> API query params (names as returned in the API's own `filters` echo). */
export function toApiParams(filters) {
  const band = findBudget(filters.budget);
  return {
    search: filters.q,
    brand: filters.brand,
    fuel: filters.fuel,
    transmission: filters.transmission,
    body_type: filters.bodyType,
    seats: filters.seats,
    min_price: band?.min,
    max_price: band?.max,
    sort: filters.sort,
    page: filters.page,
    per_page: PAGE_SIZE,
  };
}

/** Number of facet filters in use (not counting text search, sort or page). */
export function activeFilterCount(filters) {
  return ["brand", "fuel", "transmission", "bodyType", "seats", "budget"].filter((k) => filters[k]).length;
}
