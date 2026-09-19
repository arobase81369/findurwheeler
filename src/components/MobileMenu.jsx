"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * Menu is "open" only for the pathname it was opened on, so it closes
 * automatically after navigating, without needing an effect.
 */
export function MobileMenu({ links }) {
  const pathname = usePathname();
  const [openedAt, setOpenedAt] = useState(null);
  const open = openedAt === pathname;

  return (
    <div
      className="mobile-menu"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpenedAt(null);
      }}
    >
      <button
        type="button"
        className="mobile-menu__toggle"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpenedAt(open ? null : pathname)}
      >
        <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
        <span className="mobile-menu__icon" aria-hidden="true" />
      </button>

      <nav
        id="mobile-menu-panel"
        aria-label="Mobile"
        className="mobile-menu__panel"
        hidden={!open}
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="mobile-menu__link">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
