import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${SITE.name} team.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="container page-section prose-page">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="section-header__title">Contact us</h1>
      <p className="section-header__text">
        Have a question about a car, a brand, or something on {SITE.name}? We&rsquo;d like to hear from you.
      </p>
      <p className="prose-page__note">
        This page is a placeholder. Add your real contact email, phone number, or a contact form here.
      </p>
    </section>
  );
}
