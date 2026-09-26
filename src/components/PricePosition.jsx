import { formatInrShort } from "@/lib/format";

/** Where this car's price range sits among all listed cars. Facts only, no ranking language. */
export function PricePosition({ car, cars }) {
  const priced = cars.filter((c) => c.priceMin != null);
  if (car.priceMin == null || priced.length < 2) return null;

  const carMax = car.priceMax ?? car.priceMin;
  const low = Math.min(...priced.map((c) => c.priceMin));
  const high = Math.max(...priced.map((c) => c.priceMax ?? c.priceMin));
  const span = high - low;
  if (span <= 0) return null;

  const left = ((car.priceMin - low) / span) * 100;
  const width = Math.max(2, ((carMax - car.priceMin) / span) * 100);
  const others = priced.filter((c) => c.slug !== car.slug);
  const cheaperThan = others.filter((c) => c.priceMin > car.priceMin).length;

  return (
    <div className="position">
      <div
        className="position__track"
        role="img"
        aria-label={`Price range ${formatInrShort(car.priceMin)} to ${formatInrShort(carMax)} within listed cars from ${formatInrShort(low)} to ${formatInrShort(high)}`}
      >
        <span className="position__fill" style={{ left: `${left}%`, width: `${Math.min(width, 100 - left)}%` }} />
      </div>
      <div className="position__scale">
        <span>{formatInrShort(low)}</span>
        <span>{formatInrShort(high)}</span>
      </div>
      <p className="position__text">
        Starting price is lower than {cheaperThan} of the {others.length} other cars listed on FindUrWheeler.
      </p>
    </div>
  );
}
