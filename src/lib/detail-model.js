import { MILEAGE_UNIT, formatInrShort, humanize } from "./format.js";

/**
 * Tolerant adapters for GET /cars/{id}. The response shape has not been confirmed, so this
 * reads the keys mentioned in the API plan (variants, features_by_category, faqs) and renders
 * whatever fields are present, without inventing any. Missing sections simply return empty.
 */

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isPrimitive = (v) => ["string", "number", "boolean"].includes(typeof v);
const toSnake = (key) => key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
const clean = (v) => (typeof v === "string" ? v.trim() : v);

const HIDDEN_KEYS = new Set([
  "id", "car_id", "slug", "created_at", "updated_at", "status", "sort_order", "position",
]);
const TITLE_KEYS = ["name", "variant_name", "title", "variant"];

function formatValue(key, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    const items = value.filter(isPrimitive).map(String);
    return items.length ? items.join(", ") : "—";
  }
  if (isObject(value)) return "—";
  if (/price|showroom|on_?road|mrp|cost/i.test(toSnake(key)) && Number.isFinite(Number(value)) && Number(value) > 0) {
    return formatInrShort(Number(value));
  }
  return String(value).trim() || "—";
}

/**
 * Variants, following the real GET /cars/{id} shape:
 *   variant: name, fuel_type, transmission_type, drive_type, seating_capacity, delivery_status
 *   nested objects: engine, performance, dimensions, weights, wheels, chassis, safety, adas,
 *                   exterior, comfort, infotainment, seating   (any may be null)
 *   prices: [{ price_type, price, city, is_current, ... }]
 *   features / features_by_category (currently empty arrays)
 * Values are strings ("998.00", "1", "0"), so numbers, units and yes/no flags are converted here.
 */
const NUMERIC = /^\d+(\.\d+)?$/;
const META_KEYS = new Set(["id", "variant_id", "created_at", "updated_at"]);

/** Nested objects shown as groups, in display order. */
const GROUPS = [
  ["engine", "Engine"],
  ["performance", "Performance"],
  ["dimensions", "Dimensions"],
  ["weights", "Weights"],
  ["wheels", "Wheels and tyres"],
  ["chassis", "Suspension, brakes and steering"],
  ["safety", "Safety"],
  ["adas", "ADAS"],
  ["exterior", "Exterior"],
  ["comfort", "Comfort"],
  ["infotainment", "Infotainment"],
  ["seating", "Seating"],
];

/** Keys already shown in the main columns, so they are not repeated inside a group. */
const CONSUMED = {
  engine: new Set(["displacement_cc", "power_value", "power_unit", "torque_value", "torque_unit", "fuel_type"]),
  performance: new Set(["claimed_mileage", "mileage_unit"]),
};

const UNIT_SUFFIXES = [
  [/_mm$/, "mm"], [/_kg$/, "kg"], [/_litres$/, "L"], [/_kmph$/, "km/h"], [/_sec$/, "s"],
  [/_kwh$/, "kWh"], [/_kw$/, "kW"], [/_km$/, "km"], [/_m$/, "m"], [/_inch$/, "inch"],
  [/_hours$/, "h"], [/_cc$/, "cc"], [/_nm$/, "Nm"],
];
/** Keys where "0"/"1" is a number, not a yes/no flag. */
const COUNT_KEY = /airbag|count|speaker|cylinder|valve|layout/;

const num = (value) => {
  const text = plain(value);
  return NUMERIC.test(text) ? Number(text) : null;
};

function plain(value) {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.filter(isPrimitive).map(String).join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return isPrimitive(value) ? String(value).trim() : "";
}

const WORDS = {
  abs: "ABS", ebd: "EBD", esc: "ESC", tpms: "TPMS", led: "LED", drl: "DRL", orvm: "ORVM", irvm: "IRVM",
  usb: "USB", adas: "ADAS", isofix: "ISOFIX", carplay: "CarPlay", ac: "AC", gps: "GPS", rpm: "RPM",
};
const prettyLabel = (text) => text.split(" ").map((word) => WORDS[word.toLowerCase()] ?? word).join(" ");

/** One spec row: { label, value, bool } where bool is true/false for yes/no flags, else null. */
function specRow(key, raw) {
  const text = plain(raw);
  if (!text) return null;

  const unit = UNIT_SUFFIXES.find(([pattern]) => pattern.test(key));
  const label = prettyLabel(humanize(unit ? key.replace(unit[0], "") : key));

  if ((text === "0" || text === "1") && !unit && !COUNT_KEY.test(key)) {
    return { label, value: text === "1" ? "Yes" : "No", bool: text === "1" };
  }
  if (NUMERIC.test(text)) {
    return { label, value: `${Number(text)}${unit ? ` ${unit[1]}` : ""}`, bool: null };
  }
  return { label, value: text, bool: null };
}

function rowsOf(object, consumed) {
  if (!isObject(object)) return [];
  return Object.entries(object)
    .filter(([key, value]) => !META_KEYS.has(key) && !consumed?.has(key) && !isObject(value) && !Array.isArray(value))
    .map(([key, value]) => specRow(key, value))
    .filter(Boolean);
}

/** "km/l" -> "kmpl" (matches the rest of the site); other units are kept as given. */
const mileageUnit = (unit) => (/^km\s*\/?\s*l(itres?)?$/i.test(unit) ? "kmpl" : unit || MILEAGE_UNIT);

function choosePrice(prices) {
  const list = (Array.isArray(prices) ? prices : []).filter(isObject).filter((p) => num(p.price) > 0);
  const rank = (p) =>
    (String(p.is_current) === "1" ? 0 : 4) + (p.price_type === "ex_showroom" ? 0 : 2) + (p.city ? 1 : 0);
  const sorted = [...list].sort((a, b) => rank(a) - rank(b));
  return { chosen: sorted[0], others: sorted.slice(1).filter((p) => String(p.is_current) === "1") };
}

/** variants -> [{ id, name, fuel, transmission, engine, power, torque, mileage, price, priceType, groups }] */
export function toVariants(variants) {
  if (!Array.isArray(variants)) return [];

  return variants.filter(isObject).map((row, index) => {
    const engine = isObject(row.engine) ? row.engine : {};
    const performance = isObject(row.performance) ? row.performance : {};

    const cc = num(engine.displacement_cc);
    const kwh = num(engine.battery_capacity_kwh);
    const motorKw = num(engine.motor_power_kw);
    const powerValue = num(engine.power_value);
    const torqueValue = num(engine.torque_value);
    const mileageValue = num(performance.claimed_mileage);
    const range = num(performance.range_km) ?? num(engine.range_km);

    const { chosen, others } = choosePrice(row.prices);

    const groups = [];
    const general = ["drive_type", "seating_capacity", "delivery_status", "variant_code"]
      .map((key) => specRow(key, row[key]))
      .filter(Boolean);
    if (general.length) groups.push({ name: "General", rows: general });

    GROUPS.forEach(([key, name]) => {
      const rows = rowsOf(row[key], CONSUMED[key]);
      if (rows.length) groups.push({ name, rows });
    });

    const extraPrices = others.map((p) => ({
      label: `${humanize(p.price_type)}${p.city ? ` – ${p.city}` : ""}`,
      value: formatInrShort(num(p.price)),
      bool: null,
    }));
    if (extraPrices.length) groups.push({ name: "Other prices", rows: extraPrices });

    const flatFeatures = featureLabels(row.features);
    if (flatFeatures.length) {
      groups.push({ name: "Features", rows: flatFeatures.map((label) => ({ label: prettyLabel(label), value: "Yes", bool: true })) });
    }
    toFeatureGroups(row.features_by_category).forEach((group) =>
      groups.push({ name: group.name, rows: group.items.map((label) => ({ label: prettyLabel(label), value: "Yes", bool: true })) }),
    );

    return {
      id: String(index),
      name: plain(row.name) || `Variant ${index + 1}`,
      fuel: plain(row.fuel_type) || plain(engine.fuel_type),
      transmission: plain(row.transmission_type),
      engine: cc ? `${cc} cc` : kwh ? `${kwh} kWh battery` : motorKw ? `${motorKw} kW motor` : plain(engine.engine_name),
      power: powerValue ? `${powerValue}${plain(engine.power_unit) ? ` ${plain(engine.power_unit)}` : ""}` : "",
      torque: torqueValue ? `${torqueValue}${plain(engine.torque_unit) ? ` ${plain(engine.torque_unit)}` : ""}` : "",
      mileage: mileageValue
        ? `${mileageValue} ${mileageUnit(plain(performance.mileage_unit))}`
        : range
          ? `${range} km range`
          : "",
      price: chosen ? formatInrShort(num(chosen.price)) : "",
      priceType: chosen ? plain(chosen.price_type) : "",
      groups,
    };
  });
}

function featureLabels(value) {
  if (Array.isArray(value)) return value.map(itemLabel).filter(Boolean);
  if (isObject(value)) {
    return Object.entries(value).flatMap(([key, v]) => {
      if (Array.isArray(v)) return v.map(itemLabel).filter(Boolean);
      if (v === true || v === "1") return [humanize(key)];
      return [];
    });
  }
  if (typeof value === "string") return value.split(/[\n,;]+/).map((t) => t.trim()).filter(Boolean);
  return [];
}

function itemLabel(item) {
  if (isPrimitive(item)) return String(item).trim();
  if (!isObject(item)) return "";
  const name = ["name", "label", "title", "feature", "feature_name"].map((k) => item[k]).find(isPrimitive);
  if (name === undefined) return "";
  const value = isPrimitive(item.value) && item.value !== "" ? `: ${item.value}` : "";
  return `${String(name).trim()}${value}`;
}

/** features_by_category -> [{ name, items: string[] }] */
export function toFeatureGroups(features) {
  const groups = [];
  const push = (name, items) => {
    const labels = (Array.isArray(items) ? items : []).map(itemLabel).filter(Boolean);
    if (labels.length) groups.push({ name: humanize(name), items: labels });
  };

  if (Array.isArray(features)) {
    features.filter(isObject).forEach((group, i) =>
      push(group.category ?? group.name ?? group.title ?? `Group ${i + 1}`, group.items ?? group.features),
    );
  } else if (isObject(features)) {
    Object.entries(features).forEach(([name, items]) => push(name, items));
  }
  return groups;
}

/** faqs -> [{ question, answer }] */
export function toFaqs(faqs) {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .filter(isObject)
    .map((faq) => ({
      question: String(clean(faq.question ?? faq.q) ?? ""),
      answer: String(clean(faq.answer ?? faq.a) ?? ""),
    }))
    .filter((faq) => faq.question && faq.answer);
}

/** specifications -> [{ name, rows: [label, value][] }] (only if present in the response) */
export function toSpecGroups(specs) {
  const groups = [];
  const rowsFrom = (source) =>
    Object.entries(source)
      .filter(([, v]) => isPrimitive(v) || Array.isArray(v))
      .map(([k, v]) => [humanize(k), formatValue(k, v)])
      .filter(([, v]) => v !== "—");

  if (isObject(specs)) {
    const general = [];
    for (const [key, value] of Object.entries(specs)) {
      if (isObject(value)) {
        const rows = rowsFrom(value);
        if (rows.length) groups.push({ name: humanize(key), rows });
      } else if (isPrimitive(value) || Array.isArray(value)) {
        const v = formatValue(key, value);
        if (v !== "—") general.push([humanize(key), v]);
      }
    }
    if (general.length) groups.unshift({ name: "General", rows: general });
  } else if (Array.isArray(specs)) {
    specs.filter(isObject).forEach((group, i) => {
      const items = group.items ?? group.specs ?? group.specifications;
      const rows = Array.isArray(items)
        ? items
            .filter(isObject)
            .map((it) => [String(it.label ?? it.name ?? "").trim(), formatValue("value", it.value)])
            .filter(([label, v]) => label && v !== "—")
        : [];
      if (rows.length) groups.push({ name: humanize(group.category ?? group.name ?? group.title ?? `Group ${i + 1}`), rows });
    });
  }
  return groups;
}

/** Everything the detail page can show from GET /cars/{id}. */
export function toDetail(raw) {
  if (!isObject(raw)) {
    return { description: "", variants: [], features: [], faqs: [], specs: [] };
  }
  return {
    description: typeof raw.description === "string" ? raw.description.trim() : "",
    variants: toVariants(raw.variants),
    features: toFeatureGroups(raw.features_by_category ?? raw.features),
    faqs: toFaqs(raw.faqs),
    specs: toSpecGroups(raw.specifications ?? raw.specs),
  };
}
