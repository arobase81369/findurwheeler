import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const EXPLORE = [
  {
    href: "/cars",
    title: "New cars",
    text: "Browse cars with prices, variants, specifications and mileage.",
  },
  {
    href: "/upcoming-cars",
    title: "Upcoming cars",
    text: "See launches that are expected, and when they are confirmed.",
  },
  {
    href: "/brands",
    title: "Brands",
    text: "Start from a brand and see every model it sells in India.",
  },
  {
    href: "/compare",
    title: "Compare cars",
    text: "Put two cars side by side and see exactly where they differ.",
  },
  {
    href: "/news",
    title: "News",
    text: "Launches, reviews and market stories from the car world.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <h1 id="hero-title" className="hero__title">
            Find the right car for you
          </h1>
          <p className="hero__text">
            Discover cars in India with prices, variants, specifications and upcoming launches in
            one place.
          </p>

          <form action="/cars" method="get" role="search" className="search">
            <label htmlFor="hero-search" className="visually-hidden">
              Search by car name or brand
            </label>
            <input
              id="hero-search"
              name="q"
              type="search"
              className="search__input"
              placeholder="Search by car name or brand"
              autoComplete="off"
            />
            <button type="submit" className="btn btn--primary">
              Search cars
            </button>
          </form>
        </div>
      </section>

      <section className="container page-section" aria-labelledby="explore-title">
        <div className="section-header">
          <h2 id="explore-title" className="section-header__title">
            Start exploring
          </h2>
        </div>

        <ul className="explore-grid">
          {EXPLORE.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="explore-card">
                <h3 className="explore-card__title">{item.title}</h3>
                <p className="explore-card__text">{item.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
