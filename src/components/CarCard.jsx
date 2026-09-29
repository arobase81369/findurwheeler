import Image from "next/image";
import Link from "next/link";
import { CompareToggle } from "./CompareToggle";
import { Icon } from "./Icon";

const join = (values) => (values.length ? values.join(" / ") : "");

/**
 * Car card: photo with floating pills and a compare button, then title, starting price,
 * three key facts (mileage, fuel, transmission) and a details button.
 * Only real API fields are shown; anything missing shows a dash.
 * @param {{ car: ReturnType<typeof import("@/lib/car-model.js").toCar>, headingLevel?: "h2" | "h3" }} props
 */
export function CarCard({ car, headingLevel: Heading = "h3" }) {
  const notLaunched = car.launchStatus && car.launchStatus !== "launched";

  const facts = [
    { icon: "gauge", label: "Mileage", value: car.mileageLabel },
    { icon: "fuel", label: "Fuel", value: join(car.fuels) },
    { icon: "sliders", label: "Transmission", value: join(car.transmissions) },
  ];

  return (
    <article className="cc">
      <div className="cc__media">
        {car.image ? (
          <Image
            src={car.image}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="cc__img"
          />
        ) : (
          <span className="cc__placeholder">Image not available</span>
        )}

        {notLaunched ? (
          <span className="cc__pill cc__pill--left cc__pill--accent">{car.launchStatusLabel}</span>
        ) : car.bodyType ? (
          <span className="cc__pill cc__pill--left">{car.bodyType}</span>
        ) : null}

        {car.modelYear ? (
          <span className="cc__pill cc__pill--right">
            <Icon name="calendar" size={14} />
            {car.modelYear}
          </span>
        ) : null}

        <div className="cc__compare">
          <CompareToggle slug={car.slug} title={car.title} size="float" />
        </div>
      </div>

      <div className="cc__body">
        <Heading className="cc__title">
          <Link href={`/cars/${car.slug}`} className="cc__link">
            {car.title}
          </Link>
        </Heading>

        {car.startPriceLabel ? (
          <>
            <p className="cc__price">{car.startPriceLabel}</p>
            <p className="cc__note">Starting price{car.maxPriceLabel ? ` · up to ${car.maxPriceLabel}` : ""}</p>
          </>
        ) : (
          <p className="cc__price cc__price--missing">Price unavailable</p>
        )}

        <ul className="cc__facts">
          {facts.map((fact) => (
            <li key={fact.label} className="cc__fact">
              <Icon name={fact.icon} size={20} />
              <span className="visually-hidden">{fact.label}: </span>
              <span className="cc__fact-value">{fact.value || "—"}</span>
            </li>
          ))}
        </ul>

        <span className="cc__cta" aria-hidden="true">
          View details
        </span>
      </div>
    </article>
  );
}
