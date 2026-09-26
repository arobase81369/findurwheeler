/** Unit shown next to mileage values. Change here if the API's mileage unit differs. */
export const MILEAGE_UNIT = "kmpl";

/** Parses API numeric strings ("1090700.00"). Returns null for missing/zero/invalid values. */
export function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function splitInr(amount) {
  if (amount >= 1e7) return { text: (amount / 1e7).toFixed(2), unit: "Crore" };
  if (amount >= 1e5) return { text: (amount / 1e5).toFixed(2), unit: "Lakh" };
  return { text: amount.toLocaleString("en-IN"), unit: "" };
}

/** Compact single amount: 1090700 -> "₹10.91 Lakh". */
export function formatInrShort(amount) {
  if (amount == null) return null;
  const part = splitInr(amount);
  return `₹${part.text}${part.unit ? ` ${part.unit}` : ""}`;
}

/** Full amount in Indian grouping: 1090700 -> "₹10,90,700". */
export function formatInr(amount) {
  if (amount == null || !Number.isFinite(amount)) return "—";
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/** 740000, 1116000 -> "₹7.40 – 11.16 Lakh". Returns null when there is no price. */
export function formatPriceRange(min, max) {
  const lo = min ?? max;
  const hi = max ?? min;
  if (lo == null || hi == null) return null;

  const a = splitInr(Math.min(lo, hi));
  const b = splitInr(Math.max(lo, hi));
  const withUnit = (part) => `₹${part.text}${part.unit ? ` ${part.unit}` : ""}`;

  if (Math.min(lo, hi) === Math.max(lo, hi)) return withUnit(a);
  if (a.unit === b.unit && a.unit) return `₹${a.text} – ${b.text} ${a.unit}`;
  return `${withUnit(a)} – ${withUnit(b)}`;
}

/** 17.40, 21.80, "kmpl" -> "17.4 – 21.8 kmpl". Returns null when there is no value. */
export function formatNumberRange(min, max, unit = "") {
  const lo = min ?? max;
  const hi = max ?? min;
  if (lo == null || hi == null) return null;

  const a = Math.min(lo, hi);
  const b = Math.max(lo, hi);
  const suffix = unit ? ` ${unit}` : "";
  return a === b ? `${a}${suffix}` : `${a} – ${b}${suffix}`;
}

/** "coming_soon" -> "Coming soon" */
export function humanize(value) {
  const text = String(value ?? "").replace(/[_-]+/g, " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

/** "2026-10-12" -> "12 Oct 2026". Returns the input unchanged if it is not a date. */
export function formatDate(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const date = new Date(text.length <= 10 ? `${text}T00:00:00Z` : text);
  if (Number.isNaN(date.getTime())) return text;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Two-letter initials for logo placeholders: "Maruti Suzuki" -> "MS". */
export function initials(name) {
  const words = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
