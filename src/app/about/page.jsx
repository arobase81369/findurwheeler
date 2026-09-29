import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "About Us",
  description: `About ${SITE.name}, an India-focused car discovery platform.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="container page-section prose-page">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
      <h1 className="section-header__title">About {SITE.name}</h1>
      <p className="section-header__text">
        {SITE.name} helps people in India explore new cars, compare prices and specifications,
        and keep track of upcoming launches, all in one place.
      </p>
      <p className="prose-page__note">
        This page is a placeholder. Replace this copy with your company&rsquo;s own About Us content.
      </p>
    </section>
  );
}
