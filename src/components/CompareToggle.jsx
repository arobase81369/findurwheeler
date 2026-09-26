"use client";

import { useCompare } from "@/lib/compare-store";
import { Icon } from "./Icon";

export function CompareToggle({ slug, title, size = "sm" }) {
  const { has, toggle, isFull } = useCompare();
  const active = has(slug);
  const disabled = !active && isFull;

  return (
    <button
      type="button"
      className={`compare-toggle compare-toggle--${size}${active ? " is-active" : ""}`}
      aria-pressed={active}
      disabled={disabled}
      title={disabled ? "You can compare up to 3 cars" : undefined}
      onClick={() => toggle({ slug, title })}
    >
      <Icon name={active ? "check" : "compare"} size={16} />
      <span>{active ? "Added to compare" : "Compare"}</span>
      <span className="visually-hidden"> {title}</span>
    </button>
  );
}
