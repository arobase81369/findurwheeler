import Link from "next/link";
import { getBrands } from "@/lib/cars";
import { NAV_LINKS, SITE } from "@/lib/site";

export async function Footer() {
  // Footer brand links come from the API; if it is unavailable the column is simply omitted.
  const brands = await getBrands().catch(() => []);

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__about">
          <p className="site-footer__brand">{SITE.name}</p>
          <p className="site-footer__text">{SITE.description}</p>
        </div>

        <nav aria-label="Explore" className="site-footer__col">
          <h2 className="site-footer__heading">Explore</h2>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {brands.length > 0 ? (
          <nav aria-label="Brands" className="site-footer__col">
            <h2 className="site-footer__heading">Brands</h2>
            <ul>
              {brands.slice(0, 6).map((brand) => (
                <li key={brand.slug}>
                  <Link href={`/brands/${brand.slug}`}>{brand.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>

      <div className="container site-footer__legal">
        <p>
          &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
