import Link from "next/link";
import { activeFilterCount, hrefWith } from "@/lib/listing";
import { Icon } from "./Icon";

function Group({ title, options, filters, filterKey }) {
  if (options.length === 0) return null;
  return (
    <section className="filter-group" aria-label={title}>
      <h3 className="filter-group__title">{title}</h3>
      <ul>
        {options.map((option) => {
          const selected = filters[filterKey] === option.value;
          return (
            <li key={option.value}>
              <Link
                href={hrefWith(filters, { [filterKey]: selected ? "" : option.value })}
                className={`filter-option${selected ? " is-selected" : ""}`}
                aria-current={selected ? "true" : undefined}
                scroll={false}
              >
                <span className="filter-option__box" aria-hidden="true">
                  {selected ? <Icon name="check" size={14} /> : null}
                </span>
                <span className="filter-option__label">{option.label}</span>
                <span className="filter-option__count">{option.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Filter links (no client JS). On mobile it collapses behind a Filters button
 * using a hidden checkbox, so it works without JavaScript too.
 */
export function FilterPanel({ filters, facets, brands }) {
  const count = activeFilterCount(filters);

  const brandOptions = brands
    .filter((b) => b.carCount > 0 || filters.brand === b.slug)
    .map((b) => ({ value: b.slug, label: b.name, count: b.carCount }));

  return (
    <div className="filters">
      <input type="checkbox" id="filters-toggle" className="filters__checkbox visually-hidden" />
      <label htmlFor="filters-toggle" className="filters__button">
        <Icon name="sliders" size={18} />
        Filters{count > 0 ? ` (${count})` : ""}
      </label>

      <div className="filters__panel">
        <Group
          title="Budget"
          filterKey="budget"
          filters={filters}
          options={facets.budgets
            .filter((b) => b.count > 0 || filters.budget === b.slug)
            .map((b) => ({ value: b.slug, label: b.label, count: b.count }))}
        />
        <Group title="Brand" filterKey="brand" filters={filters} options={brandOptions} />
        <Group
          title="Body type"
          filterKey="bodyType"
          filters={filters}
          options={facets.bodyTypes.map((o) => ({ value: o.value, label: o.value, count: o.count }))}
        />
        <Group
          title="Fuel type"
          filterKey="fuel"
          filters={filters}
          options={facets.fuels.map((o) => ({ value: o.value, label: o.value, count: o.count }))}
        />
        <Group
          title="Transmission"
          filterKey="transmission"
          filters={filters}
          options={facets.transmissions.map((o) => ({ value: o.value, label: o.value, count: o.count }))}
        />
        <Group
          title="Seating capacity"
          filterKey="seats"
          filters={filters}
          options={facets.seats.map((o) => ({ value: o.value, label: `${o.value} seats`, count: o.count }))}
        />
        <p className="filters__note">Counts show all cars in each group.</p>
      </div>
    </div>
  );
}
