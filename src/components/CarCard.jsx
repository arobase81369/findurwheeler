import Image from "next/image";
import Link from "next/link";
import { CompareToggle } from "./CompareToggle";
import { Icon } from "./Icon";

/** @param {{ car: ReturnType<typeof import("@/lib/car-model.js").toCar>, headingLevel?: "h2" | "h3" }} props */
export function CarCard({ car, headingLevel: Heading = "h3" }) {
  const notLaunched = car.launchStatus && car.launchStatus !== "launched";

  return (
    <article className="car-card">
      <div className="car-card__media">
        {car.image ? (
          <Image
            src={car.image}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="car-card__img"
          />
        ) : (
          <span className="car-card__placeholder">Image not available</span>
        )}
        {notLaunched ? <span className="car-card__badge">{car.launchStatusLabel}</span> : null}
      </div>

      <div className="car-card__body">
        {car.brand ? <p className="car-card__brand">{car.brand}</p> : null}
        <Heading className="car-card__title">
          <Link href={`/cars/${car.slug}`} className="car-card__link">
            {car.title}
          </Link>
        </Heading>

        <p className="car-card__price">{car.priceLabel ?? "Price unavailable"}</p>

        <ul className="car-card__facts">
          {car.mileageLabel ? (
            <li>
              <Icon name="gauge" size={16} />
              {car.mileageLabel}
            </li>
          ) : null}
          {car.seats ? (
            <li>
              <Icon name="users" size={16} />
              {car.seats} seats
            </li>
          ) : null}
          {car.bodyType ? (
            <li>
              <Icon name="car" size={16} />
              {car.bodyType}
            </li>
          ) : null}
        </ul>

        {car.fuels.length > 0 ? (
          <ul className="chips" aria-label="Fuel types">
            {car.fuels.map((fuel) => (
              <li key={fuel} className="chip">
                {fuel}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="car-card__footer">
          <span className="car-card__cta" aria-hidden="true">
            View details <Icon name="arrow" size={16} />
          </span>
          <CompareToggle slug={car.slug} title={car.title} />
        </div>
      </div>
    </article>
  );
}
