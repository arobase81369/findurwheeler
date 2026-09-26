import Link from "next/link";
import { CarCard } from "./CarCard";
import { CarTabs } from "./CarTabs";
import { Icon } from "./Icon";
import { SectionHeader } from "./SectionHeader";

const PER_TAB = 8;

/**
 * Section with a heading, a row of tabs, and the cars for the selected tab underneath.
 * @param {{
 *   id: string, title: string, text: string, href: string, linkLabel: string, tabsLabel: string,
 *   groups: { key: string, label: string, href: string, cars: object[] }[],
 *   tone?: "light" | "white"
 * }} props
 */
export function TabbedCars({ id, title, text, href, linkLabel, tabsLabel, groups, tone = "light" }) {
  if (groups.length === 0) return null;

  const tabs = groups.map((group) => ({
    key: group.key,
    label: group.label,
    content:
      group.cars.length === 0 ? (
        <p className="tabs__empty">
          No cars in {group.label} yet.{" "}
          <Link href="/cars" className="text-link">
            Browse all cars
          </Link>
        </p>
      ) : (
        <>
          <ul className="car-grid">
            {group.cars.slice(0, PER_TAB).map((car) => (
              <li key={car.id || car.slug}>
                <CarCard car={car} />
              </li>
            ))}
          </ul>
          <p className="section-footer">
            <Link href={group.href} className="text-link">
              See all {group.cars.length} {group.cars.length === 1 ? "car" : "cars"}
              <span className="visually-hidden"> in {group.label}</span>
              <Icon name="arrow" size={16} />
            </Link>
          </p>
        </>
      ),
  }));

  const firstWithCars = groups.findIndex((group) => group.cars.length > 0);

  return (
    <section className={`page-section${tone === "white" ? " page-section--alt" : ""}`} aria-labelledby={id}>
      <div className="container">
        <SectionHeader id={id} title={title} text={text} href={href} linkLabel={linkLabel} />
        <CarTabs label={tabsLabel} tabs={tabs} defaultIndex={Math.max(0, firstWithCars)} />
      </div>
    </section>
  );
}
