import {
  MILEAGE_UNIT,
  formatDate,
  formatNumberRange,
  formatPriceRange,
  humanize,
  toNumber,
} from "./format.js";

const text = (value) => (value === null || value === undefined ? "" : String(value).trim());
const list = (value) => (Array.isArray(value) ? value.map(text).filter(Boolean) : []);

/** The API is inconsistent ("Creta" vs "Maruti Suzuki Brezza"): never repeat the brand. */
export function toCarTitle(name, brand) {
  const n = text(name);
  const b = text(brand);
  return b && n && !n.toLowerCase().startsWith(b.toLowerCase()) ? `${b} ${n}` : n;
}

/**
 * Converts one item from GET /cars (or /upcoming-cars, which is assumed to share the same
 * fields) into the shape the UI uses. Anything missing stays empty/null so the UI can show
 * an "unavailable" state instead of an invented value.
 */
export function toCar(raw) {
  const brand = text(raw?.brand);
  const name = text(raw?.name);

  const priceMin = toNumber(raw?.min_price ?? raw?.expected_price_min);
  const priceMax = toNumber(raw?.max_price ?? raw?.expected_price_max);
  const mileageMin = toNumber(raw?.min_mileage);
  const mileageMax = toNumber(raw?.max_mileage);

  return {
    id: text(raw?.id),
    slug: text(raw?.slug),
    name,
    brand,
    brandSlug: text(raw?.brand_slug),
    title: toCarTitle(name, brand),
    bodyType: text(raw?.body_type),
    segment: text(raw?.segment),
    modelYear: text(raw?.model_year),
    seats: toNumber(raw?.seating_capacity),
    fuels: list(raw?.fuel_types),
    transmissions: list(raw?.transmission_types),
    statusLabel: humanize(raw?.availability_status),
    launchStatus: text(raw?.launch_status).toLowerCase(),
    launchStatusLabel: humanize(raw?.launch_status),
    launchDate: formatDate(raw?.expected_launch_date || raw?.launch_date),
    priceMin,
    priceMax,
    priceLabel: formatPriceRange(priceMin, priceMax),
    mileageMin,
    mileageMax,
    mileageLabel: formatNumberRange(mileageMin, mileageMax, MILEAGE_UNIT),
    image: text(raw?.image) || null,
  };
}

/** GET /brands and /brands/{slug} */
export function toBrand(raw) {
  return {
    id: text(raw?.id),
    slug: text(raw?.slug),
    name: text(raw?.name),
    country: text(raw?.country),
    logo: text(raw?.logo_url) || null,
    website: text(raw?.website_url) || null,
    carCount: Number(raw?.car_count) || 0,
  };
}
