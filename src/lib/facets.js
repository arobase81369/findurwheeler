/** Budget bands are UI categories (not car data). Counts are computed from real cars. */
export const BUDGETS = [
  { slug: "under-5-lakh", label: "Under ₹5 Lakh", min: null, max: 500000 },
  { slug: "5-10-lakh", label: "₹5 – 10 Lakh", min: 500000, max: 1000000 },
  { slug: "10-15-lakh", label: "₹10 – 15 Lakh", min: 1000000, max: 1500000 },
  { slug: "15-20-lakh", label: "₹15 – 20 Lakh", min: 1500000, max: 2000000 },
  { slug: "20-30-lakh", label: "₹20 – 30 Lakh", min: 2000000, max: 3000000 },
  { slug: "above-30-lakh", label: "Above ₹30 Lakh", min: 3000000, max: null },
];

export const findBudget = (slug) => BUDGETS.find((band) => band.slug === slug) ?? null;

/** A car matches a band when its price range overlaps the band (same rule the API uses). */
export function inBudget(car, band) {
  if (car.priceMin == null && car.priceMax == null) return false;
  const lo = car.priceMin ?? car.priceMax;
  const hi = car.priceMax ?? car.priceMin;
  return (band.min == null || hi >= band.min) && (band.max == null || lo <= band.max);
}

/** [{ value, count }] sorted by count desc, then alphabetically. */
export function countBy(cars, getValues) {
  const counts = new Map();
  for (const car of cars) {
    for (const value of new Set(getValues(car))) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

/** All filter options, derived from the cars actually in the API. */
export function buildFacets(cars) {
  return {
    fuels: countBy(cars, (c) => c.fuels),
    bodyTypes: countBy(cars, (c) => (c.bodyType ? [c.bodyType] : [])),
    transmissions: countBy(cars, (c) => c.transmissions),
    seats: countBy(cars, (c) => (c.seats ? [String(c.seats)] : [])).sort(
      (a, b) => Number(a.value) - Number(b.value),
    ),
    budgets: BUDGETS.map((band) => ({ ...band, count: cars.filter((c) => inBudget(c, band)).length })),
  };
}
