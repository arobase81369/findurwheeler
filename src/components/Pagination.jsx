import Link from "next/link";
import { Icon } from "./Icon";

function pageWindow(page, pages) {
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const numbers = [...set].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out = [];
  numbers.forEach((n, i) => {
    if (i > 0 && n - numbers[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

/** @param {{ page: number, pages: number, hrefFor: (page: number) => string }} props */
export function Pagination({ page, pages, hrefFor }) {
  if (pages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="pagination">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="pagination__step" rel="prev">
          Previous
        </Link>
      ) : null}
      <ul className="pagination__list">
        {pageWindow(page, pages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} className="pagination__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                className={`pagination__page${item === page ? " is-current" : ""}`}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>
      {page < pages ? (
        <Link href={hrefFor(page + 1)} className="pagination__step" rel="next">
          Next <Icon name="arrow" size={16} />
        </Link>
      ) : null}
    </nav>
  );
}
