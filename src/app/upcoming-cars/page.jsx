import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RefreshButton } from "@/components/RefreshButton";
import { StateMessage } from "@/components/StateMessage";
import { UpcomingCard } from "@/components/UpcomingCard";
import { getUpcomingCars } from "@/lib/cars";

export const revalidate = 300;

export const metadata = {
  title: "Upcoming Cars in India — Expected Launches & Prices",
  description:
    "Upcoming car launches in India. Launch dates and prices are shown as expected until they are announced.",
  alternates: { canonical: "/upcoming-cars" },
};

export default async function UpcomingCarsPage() {
  const { ok, cars } = await getUpcomingCars();

  return (
    <section className="container page-section">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Upcoming Cars" }]} />
      <div className="section-header">
        <h1 className="section-header__title">Upcoming cars in India</h1>
        <p className="section-header__text">
          Launch dates and prices stay marked as expected until they are announced.
        </p>
      </div>

      {!ok ? (
        <StateMessage title="Something went wrong while loading upcoming cars." text="Please try again in a moment." action={<RefreshButton />} />
      ) : cars.length === 0 ? (
        <StateMessage
          title="No upcoming cars available"
          text="No launches have been added yet. Browse the cars on sale instead."
          action={<Link href="/cars" className="btn btn--secondary">Browse cars</Link>}
        />
      ) : (
        <ul className="car-grid">
          {cars.map((car) => (
            <li key={car.id || car.slug}>
              <UpcomingCard car={car} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
