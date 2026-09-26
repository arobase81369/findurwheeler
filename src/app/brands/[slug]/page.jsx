import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CarCard } from "@/components/CarCard";
import { Icon } from "@/components/Icon";
import { StateMessage } from "@/components/StateMessage";
import { getBrand, getCars } from "@/lib/cars";
import { countBy } from "@/lib/facets";
import { initials } from "@/lib/format";
import { hrefWith } from "@/lib/listing";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const brand = await getBrand(slug);
    if (!brand) return { title: "Brand not found", robots: { index: false } };
    const title = `${brand.name} Cars in India — Models, Prices & Mileage`;
    const description = `Explore ${brand.carCount} ${brand.name} ${brand.carCount === 1 ? "model" : "models"} in India with price range, mileage and fuel options.`;
    return {
      title,
      description,
      alternates: { canonical: `/brands/${brand.slug}` },
      openGraph: { title, description, url: `/brands/${brand.slug}`, type: "website", locale: "en_IN" },
    };
  } catch {
    return { title: "Brand" };
  }
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  let cars = null;
  try {
    cars = (await getCars()).filter((car) => car.brandSlug === brand.slug);
  } catch {
    cars = null;
  }

  const fuels = cars ? countBy(cars, (c) => c.fuels) : [];
  const bodyTypes = cars ? countBy(cars, (c) => (c.bodyType ? [c.bodyType] : [])) : [];

  return (
    <section className="container page-section">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Brands", href: "/brands" }, { label: brand.name }]} />

      <header className="brand-hero">
        <span className="brand-hero__logo" aria-hidden="true">
          {brand.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logo} alt="" />
          ) : (
            initials(brand.name)
          )}
        </span>
        <div>
          <h1 className="section-header__title">{brand.name} cars in India</h1>
          <p className="section-header__text">
            {brand.carCount} {brand.carCount === 1 ? "model" : "models"}
            {brand.country ? ` · ${brand.country}` : ""}
          </p>
        </div>
        {brand.website ? (
          <a href={brand.website} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--sm brand-hero__site">
            Brand website <Icon name="external" size={16} />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        ) : null}
      </header>

      {cars === null ? (
        <StateMessage title="Something went wrong while loading cars." text="Please try again in a moment." />
      ) : cars.length === 0 ? (
        <StateMessage
          title="No cars found"
          text={`There are no ${brand.name} cars available right now.`}
          action={<Link href="/cars" className="btn btn--secondary">Browse all cars</Link>}
        />
      ) : (
        <>
          {fuels.length > 0 || bodyTypes.length > 0 ? (
            <div className="brand-filters">
              {fuels.length > 0 ? (
                <div>
                  <h2 className="explore__title">Cars by fuel type</h2>
                  <ul className="chips chips--links">
                    {fuels.map((o) => (
                      <li key={o.value}>
                        <Link className="chip chip--link" href={hrefWith({}, { brand: brand.slug, fuel: o.value })}>
                          {o.value} <span className="chip__count">{o.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {bodyTypes.length > 0 ? (
                <div>
                  <h2 className="explore__title">Cars by body type</h2>
                  <ul className="chips chips--links">
                    {bodyTypes.map((o) => (
                      <li key={o.value}>
                        <Link className="chip chip--link" href={hrefWith({}, { brand: brand.slug, bodyType: o.value })}>
                          {o.value} <span className="chip__count">{o.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          <h2 className="section-header__title brand-models-title">All {brand.name} models</h2>
          <ul className="car-grid">
            {cars.map((car) => (
              <li key={car.id || car.slug}>
                <CarCard car={car} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
