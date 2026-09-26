import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CompareSelector } from "@/components/CompareSelector";
import { Icon } from "@/components/Icon";
import { RefreshButton } from "@/components/RefreshButton";
import { StateMessage } from "@/components/StateMessage";
import { getCars } from "@/lib/cars";

export const metadata = {
  title: "Compare Cars — Price, Mileage, Fuel & Transmission",
  description: "Compare up to three cars side by side and see exactly where they differ.",
  alternates: { canonical: "/compare" },
};

/** Fields available from the cars API. More rows can be added once detail specs are confirmed. */
const ROWS = [
  ["Price range", (c) => c.priceLabel],
  ["Mileage", (c) => c.mileageLabel],
  ["Fuel types", (c) => c.fuels.join(", ")],
  ["Transmission", (c) => c.transmissions.join(", ")],
  ["Body type", (c) => c.bodyType],
  ["Segment", (c) => c.segment],
  ["Seating capacity", (c) => (c.seats ? `${c.seats} seats` : "")],
  ["Model year", (c) => c.modelYear],
  ["Launch status", (c) => c.launchStatusLabel],
  ["Availability", (c) => c.statusLabel],
];

const first = (v) => (Array.isArray(v) ? v[0] : v);

export default async function ComparePage({ searchParams }) {
  const sp = await searchParams;
  const slugs = [...new Set(String(first(sp?.cars) ?? "").split(",").map((s) => s.trim()).filter(Boolean))].slice(0, 3);
  const onlyDiff = first(sp?.diff) === "1";

  let cars;
  try {
    cars = await getCars();
  } catch {
    return (
      <section className="container page-section">
        <StateMessage title="Something went wrong while loading cars." text="Please try again in a moment." action={<RefreshButton />} />
      </section>
    );
  }

  const selected = slugs.map((slug) => cars.find((c) => c.slug === slug)).filter(Boolean);
  const ready = selected.length >= 2;

  const rows = ROWS.map(([label, get]) => {
    const values = selected.map((c) => get(c) || "");
    return { label, values, differs: new Set(values).size > 1 };
  });
  const visibleRows = onlyDiff ? rows.filter((r) => r.differs) : rows;

  const base = `/compare?cars=${selected.map((c) => c.slug).join(",")}`;

  return (
    <section className="container page-section">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
      <div className="section-header">
        <h1 className="section-header__title">Compare cars</h1>
        <p className="section-header__text">
          Pick two or three cars. Rows that differ are marked; no car is ranked above another.
        </p>
      </div>

      <CompareSelector key={slugs.join(",")} cars={cars} selected={selected.map((c) => c.slug)} slots={3} variant="light" />

      {!ready ? (
        <div className="results">
          <StateMessage
            title="Choose at least two cars"
            text="Select cars above, or use the Compare button on any car card."
            action={<Link href="/cars" className="btn btn--secondary">Browse cars</Link>}
          />
        </div>
      ) : (
        <div className="results">
          <div className="compare-tools">
            <Link
              href={onlyDiff ? base : `${base}&diff=1`}
              className="btn btn--secondary btn--sm"
              scroll={false}
            >
              <Icon name={onlyDiff ? "check" : "sliders"} size={16} />
              {onlyDiff ? "Showing differences only" : "Show differences only"}
            </Link>
          </div>

          <div className="table-scroll" role="region" aria-label="Comparison table" tabIndex={0}>
            <table className="data-table compare-table">
              <caption className="visually-hidden">Comparison of {selected.map((c) => c.title).join(", ")}</caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="visually-hidden">Specification</span>
                  </th>
                  {selected.map((car) => (
                    <th key={car.slug} scope="col" className="compare-table__car">
                      <span className="compare-table__media">
                        {car.image ? <Image src={car.image} alt="" fill sizes="240px" className="car-card__img" /> : null}
                      </span>
                      <Link href={`/cars/${car.slug}`} className="compare-table__title">
                        {car.title}
                      </Link>
                      <Link
                        href={`/compare?cars=${selected.filter((c) => c.slug !== car.slug).map((c) => c.slug).join(",")}`}
                        className="text-link compare-table__remove"
                      >
                        Remove<span className="visually-hidden"> {car.title}</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={selected.length + 1}>These cars have the same values in every row shown.</td>
                  </tr>
                ) : (
                  visibleRows.map((row) => (
                    <tr key={row.label} className={row.differs ? "is-different" : undefined}>
                      <th scope="row">
                        {row.label}
                        {row.differs ? <span className="tag">Differs</span> : null}
                      </th>
                      {row.values.map((value, i) => (
                        <td key={selected[i].slug}>{value || <span className="facts__missing">Not available</span>}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
