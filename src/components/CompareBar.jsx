"use client";

import Link from "next/link";
import { useCompare } from "@/lib/compare-store";
import { Icon } from "./Icon";

/** Sticky tray shown once the visitor has picked cars to compare. */
export function CompareBar() {
  const { items, remove, clear } = useCompare();
  if (items.length === 0) return null;

  const href = `/compare?cars=${items.map((i) => i.slug).join(",")}`;

  return (
    <aside className="compare-bar" aria-label="Cars selected for comparison">
      <div className="container compare-bar__inner">
        <ul className="compare-bar__list">
          {items.map((item) => (
            <li key={item.slug} className="compare-bar__chip">
              <span>{item.title}</span>
              <button type="button" onClick={() => remove(item.slug)} aria-label={`Remove ${item.title} from comparison`}>
                <Icon name="x" size={14} />
              </button>
            </li>
          ))}
        </ul>
        <div className="compare-bar__actions">
          <button type="button" className="text-button" onClick={clear}>
            Clear
          </button>
          {items.length >= 2 ? (
            <Link href={href} className="btn btn--primary btn--sm">
              Compare {items.length} cars
            </Link>
          ) : (
            <span className="compare-bar__hint">Add one more car to compare</span>
          )}
        </div>
      </div>
    </aside>
  );
}
