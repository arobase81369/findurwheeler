import Link from "next/link";
import { getBrands } from "@/lib/cars";
import { COMPANY_LINKS, FOOTER_COLUMNS, SITE, SOCIAL_LINKS } from "@/lib/site";
import { Icon } from "./Icon";
import { NewsletterForm } from "./NewsletterForm";

function LinkColumn({ title, links }) {
  return (
    <nav aria-label={title} className="site-footer__col">
      <h2 className="site-footer__heading">{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export async function Footer() {
  // The brands column comes from the API; if it is unavailable the column is simply omitted.
  const brands = await getBrands().catch(() => []);

  return (
    <footer className="site-footer">
      <section className="newsletter" aria-labelledby="newsletter-title">
        <div className="container newsletter__inner">
          <h2 id="newsletter-title" className="newsletter__title">
            Stay Updated With the Latest Cars
          </h2>
          <p className="newsletter__text">
            Get the latest car launches, prices, comparisons and automotive updates delivered to you.
          </p>
          <NewsletterForm />
          <p className="newsletter__note">
            No spam. Unsubscribe any time. By subscribing you agree to receive emails from {SITE.name}.
          </p>
        </div>
      </section>

      <div className="container site-footer__main">
        <div className="site-footer__about">
          <Link href="/" className="logo logo--footer" aria-label={`${SITE.name} home`}>
            <span className="logo__mark" aria-hidden="true">
              FW
            </span>
            <span className="logo__text">
              FindUr<span>Wheeler</span>
            </span>
          </Link>
          <p className="site-footer__text">{SITE.footerText}</p>

          {SOCIAL_LINKS.length > 0 ? (
            <ul className="social" aria-label="Social media">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a href={social.href} className="social__link" target="_blank" rel="noopener noreferrer">
                    <Icon name={social.icon} size={20} />
                    <span className="visually-hidden">
                      {social.name} (opens in a new tab)
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="site-footer__cols">
          {FOOTER_COLUMNS.map((column) => (
            <LinkColumn key={column.title} title={column.title} links={column.links} />
          ))}
          {brands.length > 0 ? (
            <LinkColumn
              title="Brands"
              links={brands.slice(0, 5).map((brand) => ({ label: brand.name, href: `/brands/${brand.slug}` }))}
            />
          ) : null}
          <LinkColumn title="Company" links={COMPANY_LINKS} />
        </div>
      </div>

      <div className="site-footer__legal">
        <p>
          &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
