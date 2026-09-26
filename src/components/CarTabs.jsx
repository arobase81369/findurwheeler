"use client";

import { useId, useRef, useState } from "react";

/**
 * Accessible tabs (WAI-ARIA tabs pattern): arrow keys, Home and End move between tabs.
 * Panel content is rendered on the server and passed in, so every panel is in the HTML.
 * @param {{ label: string, defaultIndex?: number, tabs: { key: string, label: string, content: import("react").ReactNode }[] }} props
 */
export function CarTabs({ label, tabs, defaultIndex = 0 }) {
  const baseId = useId();
  const [selected, setSelected] = useState(defaultIndex);
  const tabRefs = useRef([]);

  function onKeyDown(event) {
    const last = tabs.length - 1;
    let next = null;
    if (event.key === "ArrowRight") next = selected === last ? 0 : selected + 1;
    else if (event.key === "ArrowLeft") next = selected === 0 ? last : selected - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;

    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tabs__list" onKeyDown={onKeyDown}>
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={selected === index}
            aria-controls={`${baseId}-panel-${index}`}
            tabIndex={selected === index ? 0 : -1}
            className={`tabs__tab${selected === index ? " is-active" : ""}`}
            onClick={() => setSelected(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={selected !== index}
          className="tabs__panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
