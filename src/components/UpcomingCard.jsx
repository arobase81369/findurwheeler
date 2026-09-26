import Image from "next/image";
import { Icon } from "./Icon";

/** Upcoming cars have no detail page yet, so this card is not a link. */
export function UpcomingCard({ car }) {
  return (
    <article className="car-card car-card--upcoming">
      <div className="car-card__media">
        {car.image ? (
          <Image
            src={car.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="car-card__img"
          />
        ) : (
          <span className="car-card__placeholder">Image not available</span>
        )}
        <span className="car-card__badge">{car.launchStatusLabel || "Upcoming"}</span>
      </div>
      <div className="car-card__body">
        {car.brand ? <p className="car-card__brand">{car.brand}</p> : null}
        <h3 className="car-card__title">{car.title}</h3>
        <p className="car-card__price">{car.priceLabel ? `Expected ${car.priceLabel}` : "Price not announced"}</p>
        <ul className="car-card__facts">
          <li>
            <Icon name="calendar" size={16} />
            {car.launchDate ? `Expected ${car.launchDate}` : "Launch date not announced"}
          </li>
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
      </div>
    </article>
  );
}
