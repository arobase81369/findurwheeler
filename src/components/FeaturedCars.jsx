import Link from "next/link";
import { getCars } from "@/lib/cars";
import { CarCard } from "./CarCard";
import { RefreshButton } from "./RefreshButton";
import { StateMessage } from "./StateMessage";

export async function FeaturedCars({ limit = 8 }) {
  let cars;
  try {
    cars = await getCars();
  } catch {
    return (
      <StateMessage
        title="Something went wrong while loading cars."
        text="Please try again in a moment."
        action={<RefreshButton />}
      />
    );
  }

  if (cars.length === 0) {
    return (
      <StateMessage title="No cars found" text="No cars are available right now. Please check back soon." />
    );
  }

  const shown = cars.slice(0, limit);

  return (
    <>
      <ul className="car-grid">
        {shown.map((car) => (
          <li key={car.id || car.slug}>
            <CarCard car={car} />
          </li>
        ))}
      </ul>
      {cars.length > shown.length ? (
        <p className="section-footer">
          <Link href="/cars" className="btn btn--secondary">
            View all {cars.length} cars
          </Link>
        </p>
      ) : null}
    </>
  );
}
