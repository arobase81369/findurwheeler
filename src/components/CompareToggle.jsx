"use client";

import { useCompare } from "@/lib/compare-store";
import { Icon } from "./Icon";

/** size: "sm" | "lg" (text button) | "float" (round icon button that sits on a card image). */
export function CompareToggle({ slug, title, size = "sm" }) {
  const { has, toggle, isFull } = useCompare();
  const active = has(slug);
  const disabled = !active && isFull;

  if (size === "float") {
    return (
      <button
        type="button"
        className={`compare-toggle compare-toggle--float${active ? " is-active" : ""}`}
        aria-pressed={active}
        disabled={disabled}
        title={disabled ? "You can compare up to 3 cars" : active ? "Remove from compare" : "Add to compare"}
        onClick={() => toggle({ slug, title })}
      >
        <Icon name={active ? "check" : "compare"} size={18} />
        <span className="visually-hidden">
          {active ? "Remove from compare" : "Add to compare"}: {title}
        </span>
      </button>
    );
  }

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
