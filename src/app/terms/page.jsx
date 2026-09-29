import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions for using ${SITE.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="container page-section prose-page">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} />
      <h1 className="section-header__title">Terms &amp; Conditions</h1>
      <p className="prose-page__note">
        This page is a placeholder. Replace this copy with your real terms of use before launch.
      </p>
    </section>
  );
}
