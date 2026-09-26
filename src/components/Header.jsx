import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";
import { Icon } from "./Icon";
import { MobileMenu } from "./MobileMenu";
import { SearchBox } from "./SearchBox";

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="logo" aria-label="FindUrWheeler home">
          <span className="logo__mark" aria-hidden="true">
            FW
          </span>
          <span className="logo__text">
            FindUr<span>Wheeler</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__search">
          <SearchBox variant="header" />
        </div>

        <div className="site-header__actions">
          <Link href="/compare" className="btn btn--secondary btn--sm site-header__cta">
            <Icon name="compare" size={16} />
            Compare
          </Link>
          <MobileMenu links={NAV_LINKS}>
            <SearchBox variant="menu" />
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
