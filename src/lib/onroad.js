/**
 * Illustrative on-road price estimate for Hyderabad (Telangana), for a private four-wheeler.
 * This is a generic estimate, not data from the cars API — same status as the EMI calculator.
 *
 * Road tax slabs and the Road Safety Cess are Telangana's published life-tax structure as of
 * 2026 (source: state RTO tax tables). Insurance is a rough first-year comprehensive estimate
 * and is adjustable, since real premiums vary by insurer, city zone and add-ons.
 */

export const CITY = "Hyderabad";

/** Telangana one-time life (road) tax slabs, applied to the ex-showroom price. */
const ROAD_TAX_SLABS = [
  { max: 500000, rate: 0.13 },
  { max: 1000000, rate: 0.14 },
  { max: 2000000, rate: 0.17 },
  { max: Infinity, rate: 0.18 },
];

/** One-time Road Safety Cess added at registration (introduced March 2026). */
export const ROAD_SAFETY_CESS = 5000;

/** Flat registration fee and smart card (HSRP) charge, not tied to the vehicle's price. */
export const REGISTRATION_FLAT_FEE = 1500;

/** Reasonable starting point for a first-year comprehensive insurance estimate. Adjustable. */
export const DEFAULT_INSURANCE_PERCENT = 4;

function roadTaxRate(exShowroom) {
  return ROAD_TAX_SLABS.find((slab) => exShowroom <= slab.max)?.rate ?? ROAD_TAX_SLABS[ROAD_TAX_SLABS.length - 1].rate;
}

/**
 * @param {{ exShowroom: number, insurancePercent?: number, othersFlat?: number }} input
 * @returns {{ exShowroom: number, roadTaxRate: number, roadTax: number, cess: number,
 *   registrationFee: number, registrationTotal: number, insurance: number, others: number,
 *   onRoad: number }}
 */
export function calculateOnRoadPrice({ exShowroom, insurancePercent = DEFAULT_INSURANCE_PERCENT, othersFlat = 0 }) {
  const price = Math.max(0, Number(exShowroom) || 0);
  const rate = roadTaxRate(price);
  const roadTax = price * rate;
  const registrationTotal = roadTax + ROAD_SAFETY_CESS + REGISTRATION_FLAT_FEE;
  const insurance = price * (Math.max(0, insurancePercent) / 100);
  const others = Math.max(0, othersFlat);

  return {
    exShowroom: price,
    roadTaxRate: rate,
    roadTax,
    cess: ROAD_SAFETY_CESS,
    registrationFee: REGISTRATION_FLAT_FEE,
    registrationTotal,
    insurance,
    others,
    onRoad: price + registrationTotal + insurance + others,
  };
}
