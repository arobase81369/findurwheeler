import { BrandCard } from "@/components/BrandCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RefreshButton } from "@/components/RefreshButton";
import { StateMessage } from "@/components/StateMessage";
import { getBrands } from "@/lib/cars";

export const revalidate = 300;

export const metadata = {
  title: "Car Brands in India — Browse Models by Brand",
  description: "Browse car brands available in India and see every model each brand offers.",
  alternates: { canonical: "/brands" },
};

export default async function BrandsPage() {
  let brands = null;
  try {
    brands = await getBrands();
  } catch {
    brands = null;
  }

  return (
    <section className="container page-section">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Brands" }]} />
      <div className="section-header">
        <h1 className="section-header__title">Car brands</h1>
        <p className="section-header__text">Choose a brand to see all of its models.</p>
      </div>

      {brands === null ? (
        <StateMessage title="Something went wrong while loading brands." text="Please try again in a moment." action={<RefreshButton />} />
      ) : brands.length === 0 ? (
        <StateMessage title="No brands found" text="No brands are available right now." />
      ) : (
        <ul className="brand-grid brand-grid--page">
          {brands.map((brand) => (
            <li key={brand.slug}>
              <BrandCard brand={brand} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
