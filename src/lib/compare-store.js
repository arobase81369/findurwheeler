"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/** Up to 3 cars the visitor picked to compare, kept in localStorage (this browser only). */
const KEY = "fuw-compare";
export const MAX_COMPARE = 3;
const listeners = new Set();

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

const getServerSnapshot = () => "[]";

function write(items) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable (private mode): ignore */
  }
  listeners.forEach((listener) => listener());
}

export function useCompare() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const items = useMemo(() => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((i) => i && typeof i.slug === "string").slice(0, MAX_COMPARE)
        : [];
    } catch {
      return [];
    }
  }, [raw]);

  const has = useCallback((slug) => items.some((i) => i.slug === slug), [items]);

  const toggle = useCallback(
    (item) => {
      if (items.some((i) => i.slug === item.slug)) {
        write(items.filter((i) => i.slug !== item.slug));
      } else if (items.length < MAX_COMPARE) {
        write([...items, { slug: item.slug, title: item.title }]);
      }
    },
    [items],
  );

  const remove = useCallback((slug) => write(items.filter((i) => i.slug !== slug)), [items]);
  const clear = useCallback(() => write([]), []);

  return { items, has, toggle, remove, clear, isFull: items.length >= MAX_COMPARE };
}
