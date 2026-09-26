"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Pick 2–3 cars, then go to /compare?cars=slug1,slug2. */
export function CompareSelector({ cars, selected = [], slots = 3, variant = "light" }) {
  const router = useRouter();
  const [values, setValues] = useState(() => Array.from({ length: slots }, (_, i) => selected[i] ?? ""));
  const chosen = values.filter(Boolean);

  function submit(event) {
    event.preventDefault();
    if (chosen.length >= 2) router.push(`/compare?cars=${chosen.join(",")}`);
  }

  return (
    <form className={`compare-form compare-form--${variant}`} onSubmit={submit}>
      {values.map((value, index) => (
        <label key={index} className="field">
          <span className="field__label">
            Car {index + 1}
            {index >= 2 ? " (optional)" : ""}
          </span>
          <select
            className="field__control"
            value={value}
            onChange={(event) => setValues((prev) => prev.map((v, i) => (i === index ? event.target.value : v)))}
          >
            <option value="">Select a car</option>
            {cars
              .filter((car) => car.slug === value || !values.includes(car.slug))
              .map((car) => (
                <option key={car.slug} value={car.slug}>
                  {car.title}
                </option>
              ))}
          </select>
        </label>
      ))}
      <button type="submit" className="btn btn--primary" disabled={chosen.length < 2}>
        Compare cars
      </button>
    </form>
  );
}
