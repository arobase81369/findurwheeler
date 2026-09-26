import Link from "next/link";
import { SITE } from "@/lib/site";
import { Icon } from "./Icon";

/**
 * Breadcrumb trail with separators, a home icon, and BreadcrumbList structured data.
 * The last item is the current page: it is not a link and gets aria-current="page".
 * @param {{ items: { label: string, href?: string }[] }} props
 */
export function Breadcrumb({ items }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      // The current page (last item) may omit `item`.
      ...(item.href ? { item: `${SITE.url}${item.href === "/" ? "" : item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${index}-${item.label}`} className="breadcrumb__item">
              {index > 0 ? <Icon name="chevronRight" size={14} className="breadcrumb__sep" /> : null}
              {isLast || !item.href ? (
                <span className="breadcrumb__current" aria-current={isLast ? "page" : undefined} title={item.label}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="breadcrumb__link">
                  {index === 0 && item.label === "Home" ? <Icon name="home" size={16} /> : null}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </nav>
  );
}
