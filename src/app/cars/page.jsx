import Link from "next/link";
import { Suspense } from "react";
import { ActiveFilters } from "@/components/ActiveFilters";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CarCard } from "@/components/CarCard";
import { CarGridSkeleton } from "@/components/CarSkeleton";
import { FilterPanel } from "@/components/FilterPanel";
import { Icon } from "@/components/Icon";
import { Pagination } from "@/components/Pagination";
import { RefreshButton } from "@/components/RefreshButton";
import { StateMessage } from "@/components/StateMessage";
import { getBrands, getCars, getCarsPage } from "@/lib/cars";
import { buildFacets } from "@/lib/facets";
import { SORTS, hrefWith, readFilters } from "@/lib/listing";

export const metadata = {
  title: "New Cars in India — Price Range, Mileage & Fuel Options",
  description:
    "Browse new cars in India. Filter by budget, brand, body type, fuel, transmission and seating, and sort by price or mileage.",
  alternates: { canonical: "/cars" },
};

async function Results({ filters }) {
  let data;
  try {
    data = await getCarsPage(filters);
  } catch {
    return (
      <StateMessage
        title="Something went wrong while loading cars."
        text="Please try again in a moment."
        action={<RefreshButton />}
      />
    );
  }

  if (data.cars.length === 0) {
    return (
      <StateMessage
        title="No cars found"
        text="No cars match these filters. Remove a filter or start a new search."
        action={
          <Link href="/cars" className="btn btn--secondary">
            Clear filters
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="results__bar">
        <p className="result-count" aria-live="polite">
          {data.total} {data.total === 1 ? "car" : "cars"}
          {data.pages > 1 ? ` · page ${data.page} of ${data.pages}` : ""}
        </p>
        <nav className="sort" aria-label="Sort cars">
          <span className="sort__label">Sort by</span>
          <ul>
            {SORTS.map((sort) => (
              <li key={sort.value || "default"}>
                <Link
                  href={hrefWith(filters, { sort: sort.value })}
                  className={`sort__option${filters.sort === sort.value ? " is-current" : ""}`}
                  aria-current={filters.sort === sort.value ? "true" : undefined}
                  scroll={false}
                >
                  {sort.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <ul className="car-grid car-grid--listing">
        {data.cars.map((car) => (
          <li key={car.id || car.slug}>
            <CarCard car={car} headingLevel="h2" />
          </li>
        ))}
      </ul>

      <Pagination page={data.page} pages={data.pages} hrefFor={(page) => hrefWith(filters, { page })} />
    </>
  );
}

export default async function CarsPage({ searchParams }) {
  const filters = readFilters(await searchParams);

  let allCars;
  let brands;
  try {
    [allCars, brands] = await Promise.all([getCars(), getBrands().catch(() => [])]);
  } catch {
    return (
      <section className="container page-section">
        <StateMessage
          title="Something went wrong while loading cars."
          text="Please try again in a moment."
          action={<RefreshButton />}
        />
      </section>
    );
  }

  const facets = buildFacets(allCars);
  const key = JSON.stringify(filters);

  return (
    <section className="container page-section">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "New Cars" }]} />

      <div className="listing-head">
        <div>
          <h1 className="section-header__title">New cars in India</h1>
          <p className="section-header__text">Filter by budget, brand, fuel and more. Open a car for full details.</p>
        </div>

        <form action="/cars" method="get" role="search" className="listing-search">
          <label htmlFor="cars-search" className="visually-hidden">
            Search by car name or brand
          </label>
          <Icon name="search" size={18} className="listing-search__icon" />
          <input
            id="cars-search"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Search by car name or brand"
            autoComplete="off"
            className="listing-search__input"
          />
          {["brand", "fuel", "transmission", "body_type", "seats", "budget", "sort"].map((name) => {
            const value = { body_type: filters.bodyType }[name] ?? filters[name];
            return value ? <input key={name} type="hidden" name={name} value={value} /> : null;
          })}
          <button type="submit" className="btn btn--primary btn--sm">
            Search
          </button>
        </form>
      </div>

      <div className="listing">
        <aside className="listing__filters" aria-label="Filters">
          <FilterPanel filters={filters} facets={facets} brands={brands} />
        </aside>

        <div className="listing__results">
          <ActiveFilters filters={filters} brands={brands} />
          <Suspense key={key} fallback={<CarGridSkeleton count={6} />}>
            <Results filters={filters} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
