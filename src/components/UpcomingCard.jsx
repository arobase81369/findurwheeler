import Image from "next/image";
import { Icon } from "./Icon";

/** Upcoming cars have no detail page yet, so this card is not a link. Same look as CarCard. */
export function UpcomingCard({ car }) {
  const facts = [
    { icon: "car", label: "Body type", value: car.bodyType },
    { icon: "fuel", label: "Fuel", value: car.fuels.join(" / ") },
    { icon: "calendar", label: "Expected launch", value: car.launchDate },
  ];

  return (
    <article className="cc">
      <div className="cc__media">
        {car.image ? (
          <Image
            src={car.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="cc__img"
          />
        ) : (
          <span className="cc__placeholder">Image not available</span>
        )}
        <span className="cc__pill cc__pill--left cc__pill--accent">{car.launchStatusLabel || "Upcoming"}</span>
        {car.modelYear ? (
          <span className="cc__pill cc__pill--right">
            <Icon name="calendar" size={14} />
            {car.modelYear}
          </span>
        ) : null}
      </div>

      <div className="cc__body">
        <h3 className="cc__title">{car.title}</h3>
        {car.startPriceLabel ? (
          <>
            <p className="cc__price">{car.startPriceLabel}</p>
            <p className="cc__note">Expected price{car.maxPriceLabel ? ` · up to ${car.maxPriceLabel}` : ""}</p>
          </>
        ) : (
          <p className="cc__price cc__price--missing">Price not announced</p>
        )}

        <ul className="cc__facts">
          {facts.map((fact) => (
            <li key={fact.label} className="cc__fact">
              <Icon name={fact.icon} size={20} />
              <span className="visually-hidden">{fact.label}: </span>
              <span className="cc__fact-value">{fact.value || "Not announced"}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
