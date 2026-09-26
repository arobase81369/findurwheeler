import Link from "next/link";
import { initials } from "@/lib/format";

/**
 * variant "tile": centred round logo with the name underneath (home page).
 * default: logo beside name and model count (brands page).
 */
export function BrandCard({ brand, variant = "row" }) {
  const logo = (
    <span className="brand-card__logo" aria-hidden="true">
      {brand.logo ? (
        // Logo host is not known yet, so a plain <img> avoids next/image host configuration.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={brand.logo} alt="" loading="lazy" />
      ) : (
        initials(brand.name)
      )}
    </span>
  );

  if (variant === "tile") {
    return (
      <Link href={`/brands/${brand.slug}`} className="brand-tile">
        {logo}
        <span className="brand-tile__name">{brand.name}</span>
      </Link>
    );
  }

  return (
    <Link href={`/brands/${brand.slug}`} className="brand-card">
      {logo}
      <span className="brand-card__text">
        <span className="brand-card__name">{brand.name}</span>
        <span className="brand-card__meta">
          {brand.carCount} {brand.carCount === 1 ? "model" : "models"}
          {brand.country ? ` · ${brand.country}` : ""}
        </span>
      </span>
    </Link>
  );
}
