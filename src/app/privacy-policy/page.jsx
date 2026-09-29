import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} handles your information.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="container page-section prose-page">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 className="section-header__title">Privacy Policy</h1>
      <p className="prose-page__note">
        This page is a placeholder. Replace this copy with your real privacy policy before launch,
        including what data the search box, compare feature and newsletter form collect.
      </p>
    </section>
  );
}
