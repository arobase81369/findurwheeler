import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CarCard } from "@/components/CarCard";
import { CompareToggle } from "@/components/CompareToggle";
import { FaqList, FeatureGroups, SpecGroups } from "@/components/DetailSections";
import { EmiCalculator } from "@/components/EmiCalculator";
import { Icon } from "@/components/Icon";
import { PricePosition } from "@/components/PricePosition";
import { ShareButton } from "@/components/ShareButton";
import { StateMessage } from "@/components/StateMessage";
import { VariantExplorer } from "@/components/VariantExplorer";
import { getBrands, getCarDetail, getCars } from "@/lib/cars";
import { toDetail } from "@/lib/detail-model";
import { SITE } from "@/lib/site";

async function loadCar(slug) {
  const cars = await getCars();
  return { cars, car: cars.find((c) => c.slug === slug) ?? null };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  let car;
  try {
    car = (await loadCar(slug)).car;
  } catch {
    return { title: "Car details" };
  }
  if (!car) return { title: "Car not found", robots: { index: false } };

  const year = car.modelYear ? ` ${car.modelYear}` : "";
  const title = `${car.title}${year} — Price, Mileage & Details in India`;
  const facts = [
    car.priceLabel ? `Price range ${car.priceLabel}` : null,
    car.mileageLabel ? `mileage ${car.mileageLabel}` : null,
    car.fuels.length ? `fuel: ${car.fuels.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join(", ");
  const description = `${car.title}${year}${car.bodyType ? ` ${car.bodyType}` : ""} in India.${facts ? ` ${facts}.` : ""}`;

  return {
    title,
    description,
    alternates: { canonical: `/cars/${car.slug}` },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "en_IN",
      title,
      description,
      url: `/cars/${car.slug}`,
      images: car.image ? [{ url: car.image, alt: car.title }] : undefined,
    },
  };
}

function Fact({ icon, label, children }) {
  return (
    <div className="facts__item">
      <dt>
        <Icon name={icon} size={16} />
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

const Missing = () => <span className="facts__missing">Not available</span>;

export default async function CarDetailPage({ params }) {
  const { slug } = await params;
  const { cars, car } = await loadCar(slug);
  if (!car) notFound();

  const [rawDetail, brands] = await Promise.all([getCarDetail(car.id), getBrands().catch(() => [])]);
  const detail = toDetail(rawDetail);
  const brand = brands.find((b) => b.slug === car.brandSlug) ?? null;

  const sameBody = car.bodyType ? cars.filter((c) => c.slug !== car.slug && c.bodyType === car.bodyType) : [];
  const similar = (sameBody.length ? sameBody : cars.filter((c) => c.slug !== car.slug && car.brandSlug && c.brandSlug === car.brandSlug)).slice(0, 4);

  const hasExtras = Boolean(detail.variants.length || detail.specs.length || detail.features.length || detail.faqs.length);

  const sections = [
    { id: "overview", label: "Overview", show: true },
    { id: "price", label: "Price and EMI", show: car.priceMin != null },
    { id: "variants", label: "Variants", show: detail.variants.length > 0 },
    { id: "specs", label: "Specifications", show: detail.specs.length > 0 },
    { id: "features", label: "Features", show: detail.features.length > 0 },
    { id: "faqs", label: "FAQs", show: detail.faqs.length > 0 },
    { id: "similar", label: "Similar cars", show: similar.length > 0 },
  ].filter((s) => s.show);

  return (
    <>
      <div className="container detail-top">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "New Cars", href: "/cars" }, { label: car.title }]} />

        <div className="detail">
          <div className="detail__media">
            {car.image ? (
              <Image src={car.image} alt={car.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="detail__img" />
            ) : (
              <span className="car-card__placeholder">Image not available</span>
            )}
          </div>

          <div className="detail__summary">
            {car.brand ? (
              <p className="detail__brand">
                {car.brandSlug ? <Link href={`/brands/${car.brandSlug}`}>{car.brand}</Link> : car.brand}
              </p>
            ) : null}
            <h1 className="detail__title">
              {car.title}
              {car.modelYear ? <span className="detail__year"> {car.modelYear}</span> : null}
            </h1>

            <ul className="badges">
              {car.bodyType ? <li className="badge">{car.bodyType}</li> : null}
              {car.segment ? <li className="badge">{car.segment}</li> : null}
              {car.launchStatusLabel ? <li className="badge badge--accent">{car.launchStatusLabel}</li> : null}
              {car.statusLabel ? <li className="badge">{car.statusLabel}</li> : null}
            </ul>

            <p className="detail__price">{car.priceLabel ?? "Price unavailable"}</p>
            <p className="detail__label">Price range</p>

            <dl className="detail__specs">
              <div>
                <dt><Icon name="gauge" size={16} /> Mileage</dt>
                <dd>{car.mileageLabel ?? "Not available"}</dd>
              </div>
              <div>
                <dt><Icon name="users" size={16} /> Seating</dt>
                <dd>{car.seats ? `${car.seats} seats` : "Not available"}</dd>
              </div>
              <div>
                <dt><Icon name="fuel" size={16} /> Fuel</dt>
                <dd>{car.fuels.length ? car.fuels.join(", ") : "Not available"}</dd>
              </div>
              <div>
                <dt><Icon name="gear" size={16} /> Transmission</dt>
                <dd>{car.transmissions.length ? car.transmissions.join(", ") : "Not available"}</dd>
              </div>
            </dl>

            <div className="detail__actions">
              <CompareToggle slug={car.slug} title={car.title} size="lg" />
              <ShareButton title={car.title} />
            </div>
          </div>
        </div>
      </div>

      <nav className="subnav" aria-label="On this page">
        <ul className="container subnav__list">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="subnav__link">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container detail-body">
        <section id="overview" className="detail-section" aria-labelledby="overview-title">
          <h2 id="overview-title" className="section-header__title">Overview</h2>
          {detail.description ? <p className="detail__description">{detail.description}</p> : null}
          <dl className="facts">
            <Fact icon="rupee" label="Price range">{car.priceLabel ?? <Missing />}</Fact>
            <Fact icon="gauge" label="Mileage">{car.mileageLabel ?? <Missing />}</Fact>
            <Fact icon="fuel" label="Fuel types">{car.fuels.length ? car.fuels.join(", ") : <Missing />}</Fact>
            <Fact icon="gear" label="Transmission">{car.transmissions.length ? car.transmissions.join(", ") : <Missing />}</Fact>
            <Fact icon="car" label="Body type">{car.bodyType || <Missing />}</Fact>
            <Fact icon="car" label="Segment">{car.segment || <Missing />}</Fact>
            <Fact icon="users" label="Seating capacity">{car.seats ? `${car.seats} seats` : <Missing />}</Fact>
            <Fact icon="calendar" label="Model year">{car.modelYear || <Missing />}</Fact>
            <Fact icon="calendar" label="Launch status">{car.launchStatusLabel || <Missing />}</Fact>
            <Fact icon="calendar" label="Launch date">{car.launchDate || <Missing />}</Fact>
            <Fact icon="check" label="Availability">{car.statusLabel || <Missing />}</Fact>
            {brand?.country ? <Fact icon="building" label="Brand origin">{brand.country}</Fact> : null}
          </dl>
        </section>

        {car.priceMin != null ? (
          <section id="price" className="detail-section" aria-labelledby="price-title">
            <h2 id="price-title" className="section-header__title">Price and EMI</h2>
            <PricePosition car={car} cars={cars} />
            <EmiCalculator defaultPrice={car.priceMin} />
          </section>
        ) : null}

        {detail.variants.length > 0 ? (
          <section id="variants" className="detail-section" aria-labelledby="variants-title">
            <VariantExplorer title={car.title} variants={detail.variants} />
          </section>
        ) : null}

        {detail.specs.length > 0 ? (
          <section id="specs" className="detail-section" aria-labelledby="specs-title">
            <h2 id="specs-title" className="section-header__title">Specifications</h2>
            <SpecGroups groups={detail.specs} />
          </section>
        ) : null}

        {detail.features.length > 0 ? (
          <section id="features" className="detail-section" aria-labelledby="features-title">
            <h2 id="features-title" className="section-header__title">Features</h2>
            <FeatureGroups groups={detail.features} />
          </section>
        ) : null}

        {detail.faqs.length > 0 ? (
          <section id="faqs" className="detail-section" aria-labelledby="faqs-title">
            <h2 id="faqs-title" className="section-header__title">Frequently asked questions</h2>
            <FaqList faqs={detail.faqs} />
          </section>
        ) : null}

        {!hasExtras ? (
          <section className="detail-section">
            <StateMessage
              title="Variants, specifications and features"
              text="These details are not available for this car yet. They will appear here once they are added."
            />
          </section>
        ) : null}

        {brand ? (
          <section className="detail-section" aria-label={`About ${brand.name}`}>
            <div className="brand-strip">
              <div>
                <p className="brand-strip__name">{brand.name}</p>
                <p className="brand-strip__meta">
                  {brand.carCount} {brand.carCount === 1 ? "model" : "models"} on FindUrWheeler
                  {brand.country ? ` · ${brand.country}` : ""}
                </p>
              </div>
              <div className="brand-strip__actions">
                <Link href={`/brands/${brand.slug}`} className="btn btn--secondary btn--sm">
                  View all {brand.name} cars
                </Link>
                {brand.website ? (
                  <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-link">
                    Brand website <Icon name="external" size={16} />
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {similar.length > 0 ? (
          <section id="similar" className="detail-section" aria-labelledby="similar-title">
            <h2 id="similar-title" className="section-header__title">
              {sameBody.length ? `More ${car.bodyType} cars` : `More from ${car.brand}`}
            </h2>
            <ul className="car-grid">
              {similar.map((c) => (
                <li key={c.id || c.slug}>
                  <CarCard car={c} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
