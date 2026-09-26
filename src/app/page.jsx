import Image from "next/image";
import Link from "next/link";
import { BrandCard } from "@/components/BrandCard";
import { CompareSelector } from "@/components/CompareSelector";
import { Icon } from "@/components/Icon";
import { RefreshButton } from "@/components/RefreshButton";
import { SearchBox } from "@/components/SearchBox";
import { SectionHeader } from "@/components/SectionHeader";
import { StateMessage } from "@/components/StateMessage";
import { TabbedCars } from "@/components/TabbedCars";
import { UpcomingCard } from "@/components/UpcomingCard";
import { getBrands, getCars, getUpcomingCars } from "@/lib/cars";
import { BUDGETS, buildFacets, inBudget } from "@/lib/facets";
import { hrefWith } from "@/lib/listing";

export const revalidate = 300;

export const metadata = {
  alternates: { canonical: "/" },
};

const NO_FILTERS = {};

const WHY = [
  { icon: "sliders", title: "Filters that fit how you shop", text: "Narrow cars by budget, brand, fuel, transmission, body type and seating." },
  { icon: "compare", title: "Side-by-side comparison", text: "Compare up to three cars and see exactly where they differ." },
  { icon: "rupee", title: "Prices at a glance", text: "Every car shows its price range in rupees, with lakh and crore formatting." },
  { icon: "gauge", title: "Mileage on every card", text: "See the mileage range next to the price before you open a car." },
  { icon: "calendar", title: "Upcoming launches", text: "Launch dates and prices are labelled as expected until they are announced." },
  { icon: "building", title: "Built for India", text: "Made for the Indian market, with an EMI estimate on every car page." },
];

export default async function HomePage() {
  const [carsResult, brandsResult, upcomingResult] = await Promise.allSettled([
    getCars(),
    getBrands(),
    getUpcomingCars(),
  ]);

  const cars = carsResult.status === "fulfilled" ? carsResult.value : null;
  const brands = brandsResult.status === "fulfilled" ? brandsResult.value : null;
  const upcoming = upcomingResult.status === "fulfilled" ? upcomingResult.value : { ok: false, cars: [] };

  const facets = cars ? buildFacets(cars) : null;
  const featured = cars?.[0] ?? null;

  const bodyGroups = facets
    ? facets.bodyTypes.map((o) => ({
        key: o.value,
        label: o.value,
        href: hrefWith(NO_FILTERS, { bodyType: o.value }),
        cars: cars.filter((c) => c.bodyType === o.value),
      }))
    : [];
  const fuelGroups = facets
    ? facets.fuels.map((o) => ({
        key: o.value,
        label: o.value,
        href: hrefWith(NO_FILTERS, { fuel: o.value }),
        cars: cars.filter((c) => c.fuels.includes(o.value)),
      }))
    : [];
  const budgetGroups = cars
    ? BUDGETS.map((band) => ({
        key: band.slug,
        label: band.label,
        href: hrefWith(NO_FILTERS, { budget: band.slug }),
        cars: cars.filter((c) => inBudget(c, band)),
      }))
    : [];

  const quick = facets
    ? [
        ...facets.budgets.filter((b) => b.count > 0).slice(0, 2).map((b) => ({ label: b.label, href: hrefWith(NO_FILTERS, { budget: b.slug }) })),
        ...facets.bodyTypes.slice(0, 1).map((o) => ({ label: o.value, href: hrefWith(NO_FILTERS, { bodyType: o.value }) })),
        ...facets.fuels.slice(0, 1).map((o) => ({ label: o.value, href: hrefWith(NO_FILTERS, { fuel: o.value }) })),
      ]
    : [];

  return (
    <>
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1 id="hero-title" className="hero__title">
              Find the <span>right car</span> for you
            </h1>
            <p className="hero__text">
              Search cars in India, filter by budget and fuel, compare side by side and estimate your EMI.
            </p>

            <div className="hero__search">
              <SearchBox variant="hero" placeholder="Search by car name or brand" />
            </div>

            {quick.length > 0 ? (
              <ul className="quick-links" aria-label="Popular searches">
                {quick.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="quick-links__item">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            {cars ? (
              <dl className="stats">
                <div>
                  <dt>Cars</dt>
                  <dd>{cars.length}</dd>
                </div>
                {brands ? (
                  <div>
                    <dt>Brands</dt>
                    <dd>{brands.length}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Body types</dt>
                  <dd>{facets.bodyTypes.length}</dd>
                </div>
                <div>
                  <dt>Fuel types</dt>
                  <dd>{facets.fuels.length}</dd>
                </div>
              </dl>
            ) : null}
          </div>

          {featured ? (
            <Link href={`/cars/${featured.slug}`} className="hero__feature">
              <span className="hero__feature-tag">Latest added</span>
              <span className="hero__feature-media">
                {featured.image ? (
                  <Image src={featured.image} alt="" fill sizes="(min-width: 1024px) 480px, 100vw" className="car-card__img" />
                ) : null}
              </span>
              <span className="hero__feature-body">
                <span className="hero__feature-title">{featured.title}</span>
                <span className="hero__feature-price">{featured.priceLabel ?? "Price unavailable"}</span>
              </span>
            </Link>
          ) : null}
        </div>
      </section>

      {/* Cars by body type / fuel type / budget: tabs on top, cars underneath */}
      {cars === null ? (
        <section className="page-section" aria-label="Cars">
          <div className="container">
            <StateMessage
              title="Something went wrong while loading cars."
              text="Please try again in a moment."
              action={<RefreshButton />}
            />
          </div>
        </section>
      ) : cars.length === 0 ? (
        <section className="page-section" aria-label="Cars">
          <div className="container">
            <StateMessage title="No cars found" text="No cars are available right now. Please check back soon." />
          </div>
        </section>
      ) : (
        <>
          <TabbedCars
            id="body-title"
            title="Browse cars by body type"
            text="Prices, mileage and fuel options for popular models on sale in India."
            href="/cars"
            linkLabel="View all cars"
            tabsLabel="Body type"
            groups={bodyGroups}
            tone="light"
          />
          <TabbedCars
            id="fuel-title"
            title="Browse cars by fuel type"
            text="Petrol, diesel, CNG and more, with mileage and pricing at a glance."
            href="/cars"
            linkLabel="All fuel types"
            tabsLabel="Fuel type"
            groups={fuelGroups}
            tone="white"
          />
          <TabbedCars
            id="budget-title"
            title="Browse cars by budget"
            text="Pick a price band and see every car whose price range fits."
            href="/cars"
            linkLabel="All budgets"
            tabsLabel="Budget"
            groups={budgetGroups}
            tone="light"
          />
        </>
      )}

      {/* Upcoming */}
      <section className="page-section page-section--alt" aria-labelledby="upcoming-title">
        <div className="container">
        <SectionHeader
          id="upcoming-title"
          title="Upcoming cars"
          text="Launch dates and prices stay marked as expected until they are announced."
          href="/upcoming-cars"
          linkLabel="All upcoming cars"
        />
        {!upcoming.ok ? (
          <StateMessage title="Upcoming cars are unavailable right now." text="Please try again in a moment." action={<RefreshButton />} />
        ) : upcoming.cars.length === 0 ? (
          <StateMessage title="No upcoming cars available" text="No launches have been added yet. Browse the cars on sale instead." action={<Link href="/cars" className="btn btn--secondary">Browse cars</Link>} />
        ) : (
          <ul className="car-grid car-grid--three">
            {upcoming.cars.slice(0, 3).map((car) => (
              <li key={car.id || car.slug}>
                <UpcomingCard car={car} />
              </li>
            ))}
          </ul>
        )}
        </div>
      </section>

      {/* Brands */}
      {brands && brands.length > 0 ? (
        <section className="page-section" aria-labelledby="brands-title">
          <div className="container">
            <SectionHeader
              id="brands-title"
              title="Popular car brands"
              text="Browse models, prices and specifications brand by brand."
              href="/brands"
              linkLabel="All brands"
            />
            <ul className="brand-tiles">
              {brands.slice(0, 12).map((brand) => (
                <li key={brand.slug}>
                  <BrandCard brand={brand} variant="tile" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Compare */}
      {cars && cars.length >= 2 ? (
        <section className="container page-section page-section--tight" aria-labelledby="compare-title">
          <div className="compare-panel">
            <div className="compare-panel__copy">
              <h2 id="compare-title" className="compare-panel__title">
                Compare cars side by side
              </h2>
              <p className="compare-panel__text">
                Choose two or three cars to see price, mileage, fuel, transmission and seating together. Differences are highlighted.
              </p>
            </div>
            <CompareSelector cars={cars} slots={2} variant="dark" />
          </div>
        </section>
      ) : null}

      {/* Why */}
      <section className="page-section page-section--alt" aria-labelledby="why-title">
        <div className="container">
          <SectionHeader id="why-title" title="Why FindUrWheeler" />
          <ul className="why-grid">
            {WHY.map((item) => (
              <li key={item.title} className="why-card">
                <span className="why-card__icon">
                  <Icon name={item.icon} size={22} />
                </span>
                <h3 className="why-card__title">{item.title}</h3>
                <p className="why-card__text">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
