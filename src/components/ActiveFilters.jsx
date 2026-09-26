import Link from "next/link";
import { findBudget } from "@/lib/facets";
import { hrefWith } from "@/lib/listing";
import { Icon } from "./Icon";

export function ActiveFilters({ filters, brands }) {
  const brandName = brands.find((b) => b.slug === filters.brand)?.name ?? filters.brand;
  const chips = [
    filters.q && { key: "q", label: `Search: ${filters.q}` },
    filters.budget && { key: "budget", label: findBudget(filters.budget)?.label ?? filters.budget },
    filters.brand && { key: "brand", label: brandName },
    filters.bodyType && { key: "bodyType", label: filters.bodyType },
    filters.fuel && { key: "fuel", label: filters.fuel },
    filters.transmission && { key: "transmission", label: filters.transmission },
    filters.seats && { key: "seats", label: `${filters.seats} seats` },
  ].filter(Boolean);

  if (chips.length === 0) return null;

  return (
    <div className="active-filters" aria-label="Active filters">
      <ul>
        {chips.map((chip) => (
          <li key={chip.key}>
            <Link href={hrefWith(filters, { [chip.key]: "" })} className="chip chip--removable" scroll={false}>
              {chip.label}
              <Icon name="x" size={14} />
              <span className="visually-hidden"> (remove filter)</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/cars" className="text-link">
        Clear all
      </Link>
    </div>
  );
}
