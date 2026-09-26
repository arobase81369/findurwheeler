"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Icon } from "./Icon";

/**
 * Global search with live suggestions (cars and brands) from /api/search,
 * which proxies the WordPress /search endpoint. Keyboard: arrows, Enter, Escape.
 */
export function SearchBox({ variant = "header", placeholder = "Search cars or brands" }) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [data, setData] = useState({ q: "", cars: [], brands: [] });

  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed.length < 2) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const json = await response.json();
        setData({ q: trimmed, cars: json.cars ?? [], brands: json.brands ?? [] });
      } catch {
        if (!controller.signal.aborted) setData({ q: trimmed, cars: [], brands: [] });
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [trimmed]);

  const ready = trimmed.length >= 2 && data.q === trimmed;
  const options = ready
    ? [
        ...data.cars.map((car) => ({ key: `car-${car.slug}`, group: "Cars", label: car.title, href: `/cars/${car.slug}` })),
        ...data.brands.map((brand) => ({ key: `brand-${brand.slug}`, group: "Brands", label: brand.name, href: `/brands/${brand.slug}` })),
      ]
    : [];
  const showPanel = open && trimmed.length >= 2;

  function onKeyDown(event) {
    if (event.key === "ArrowDown" && options.length) {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % options.length);
    } else if (event.key === "ArrowUp" && options.length) {
      event.preventDefault();
      setActive((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
    } else if (event.key === "Enter" && active >= 0 && options[active]) {
      event.preventDefault();
      setOpen(false);
      router.push(options[active].href);
    }
  }

  let lastGroup = "";
  return (
    <div
      className={`search-box search-box--${variant}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <form action="/cars" method="get" role="search" className="search-box__form">
        <label htmlFor={`${listId}-input`} className="visually-hidden">
          Search cars or brands
        </label>
        <Icon name="search" size={20} className="search-box__icon" />
        <input
          id={`${listId}-input`}
          name="q"
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          className="search-box__input"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {variant === "hero" ? (
          <button type="submit" className="btn btn--primary search-box__submit">
            Search
          </button>
        ) : null}
      </form>

      {showPanel ? (
        <div className="search-box__panel">
          {!ready ? (
            <p className="search-box__status" role="status">
              Searching…
            </p>
          ) : options.length === 0 ? (
            <p className="search-box__status" role="status">
              {`No matches for “${trimmed}”. Try another name.`}
            </p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Suggestions">
              {options.map((option, index) => {
                const heading = option.group !== lastGroup ? option.group : null;
                lastGroup = option.group;
                return (
                  <li key={option.key} role="presentation">
                    {heading ? <p className="search-box__group">{heading}</p> : null}
                    <div
                      role="option"
                      id={`${listId}-${index}`}
                      aria-selected={index === active}
                      className={`search-box__option${index === active ? " is-active" : ""}`}
                    >
                      <Link href={option.href} tabIndex={-1} onClick={() => setOpen(false)}>
                        {option.label}
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <Link href={`/cars?q=${encodeURIComponent(trimmed)}`} className="search-box__all" onClick={() => setOpen(false)}>
            {`See all results for “${trimmed}”`}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
