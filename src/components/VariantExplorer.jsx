"use client";

import { Fragment, useId, useMemo, useState } from "react";
import { CarTabs } from "./CarTabs";
import { Icon } from "./Icon";
import { OnRoadPrice } from "./OnRoadPrice";

const STAT_COLUMNS = [
  ["engine", "Engine"],
  ["mileage", "Mileage"],
  ["price", "Price"],
];
const MAX_COMPARE = 3;

const hasDetails = (variant) => variant.groups.some((g) => g.rows.some((r) => r.bool !== false));
const findRow = (variant, group, label) => variant.groups.find((g) => g.name === group)?.rows.find((r) => r.label === label);

/**
 * Variants grouped by fuel type (tabs) and filterable by transmission, each row expandable
 * with a checkbox to select up to 3 for comparison, and an on-road price estimate per variant.
 * @param {{ title: string, variants: ReturnType<typeof import("@/lib/detail-model.js").toVariants> }} props
 */
export function VariantExplorer({ title, variants }) {
  const uid = useId();
  const [openId, setOpenId] = useState(() => variants.find(hasDetails)?.id ?? null);
  const [transmission, setTransmission] = useState("all");
  const [selected, setSelected] = useState(() => variants.slice(0, 2).map((v) => v.id));
  const [onlyDiff, setOnlyDiff] = useState(false);

  const exShowroom = variants.every((v) => !v.priceType || v.priceType === "ex_showroom") && variants.some((v) => v.priceType);
  const priceLabel = exShowroom ? "Price (ex-showroom)" : "Price";
  const priceCities = [...new Set(variants.map((v) => v.priceCity).filter(Boolean))];
  const priceCityNote = priceCities.length === 1 ? priceCities[0] : priceCities.length > 1 ? "varies by variant" : "";

  const columns = STAT_COLUMNS.filter(([key]) => variants.some((v) => v[key]));

  const transmissions = [...new Set(variants.map((v) => v.transmission).filter(Boolean))];
  const fuels = [...new Set(variants.map((v) => v.fuel).filter(Boolean))];
  const withoutFuel = variants.filter((v) => !v.fuel);
  const fuelGroups =
    fuels.length > 0
      ? [
          ...fuels.map((fuel) => ({ key: fuel, label: fuel, items: variants.filter((v) => v.fuel === fuel) })),
          ...(withoutFuel.length ? [{ key: "other", label: "Other", items: withoutFuel }] : []),
        ]
      : [{ key: "all", label: "All variants", items: variants }];

  function toggleSelected(id) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }

  function renderList(items) {
    const shown = transmission === "all" ? items : items.filter((v) => v.transmission === transmission);

    if (shown.length === 0) {
      return <p className="variants__empty">No variants match this filter.</p>;
    }

    return (
      <div
        className={`variants__card${columns.length === 0 ? " variants__card--plain" : ""}`}
        style={{ "--cols": Math.max(columns.length, 1) }}
      >
        <div className="variants__head" aria-hidden="true">
          <span className="variants__head-check" />
          <span>Variant</span>
          {columns.map(([key, label]) => (
            <span key={key}>{label}</span>
          ))}
          <span>Compare</span>
          <span />
        </div>

        <ul>
          {shown.map((variant) => {
            const expanded = openId === variant.id;
            const checked = selected.includes(variant.id);
            const disabled = !checked && selected.length >= MAX_COMPARE;
            const detailsId = `${uid}-details-${variant.id}`;
            const checkboxId = `${uid}-check-${variant.id}`;
            const meta = [variant.transmission, variant.power, variant.torque].filter(Boolean).join(" · ");

            return (
              <li key={variant.id} className="variants__item">
                <div className="variants__row">
                  <div className="variants__check">
                    <input
                      type="checkbox"
                      id={checkboxId}
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleSelected(variant.id)}
                    />
                  </div>

                  <div className="variants__name-block">
                    <label htmlFor={checkboxId} className="variants__name">
                      {variant.name}
                    </label>
                    {meta ? <p className="variants__meta">{meta}</p> : null}
                  </div>

                  {columns.length > 0 ? (
                    <div className="variants__stats">
                      {columns.map(([key, label]) => (
                        <div key={key} className={`variants__cell${key === "price" ? " variants__cell--price" : ""}`}>
                          <span className="variants__cell-label">{label}</span>
                          <span className="variants__cell-value">{variant[key] || "—"}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="variants__compare-cell">
                    <button
                      type="button"
                      className={`variants__compare-btn${checked ? " is-checked" : ""}`}
                      aria-pressed={checked}
                      disabled={disabled}
                      onClick={() => toggleSelected(variant.id)}
                      title={disabled ? `You can compare up to ${MAX_COMPARE} variants` : undefined}
                    >
                      <Icon name={checked ? "check" : "plus"} size={14} />
                      {checked ? "Added" : "Compare"}
                    </button>
                  </div>

                  {hasDetails(variant) || variant.priceValue ? (
                    <button
                      type="button"
                      className="variants__more"
                      aria-expanded={expanded}
                      aria-controls={detailsId}
                      onClick={() => setOpenId(expanded ? null : variant.id)}
                    >
                      {expanded ? "Hide" : "Details"}
                      <span className="visually-hidden"> {variant.name}</span>
                    </button>
                  ) : null}
                </div>

                {hasDetails(variant) || variant.priceValue ? (
                  <div id={detailsId} hidden={!expanded} className="variants__details">
                    {variant.groups.map((group) => {
                      const visible = group.rows.filter((row) => row.bool !== false);
                      if (visible.length === 0) return null;
                      return (
                        <section key={group.name} className="variants__group">
                          <h4 className="variants__group-title">{group.name}</h4>
                          <ul className="variants__features">
                            {visible.map((row) =>
                              row.bool === true ? (
                                <li key={row.label}>
                                  <Icon name="check" size={16} />
                                  <span>{row.label}</span>
                                </li>
                              ) : (
                                <li key={row.label} className="variants__extra">
                                  <span>{row.label}:</span> <strong>{row.value}</strong>
                                </li>
                              ),
                            )}
                          </ul>
                        </section>
                      );
                    })}

                    {variant.priceValue ? (
                      <section className="variants__group variants__group--onroad">
                        <OnRoadPrice exShowroom={variant.priceValue} priceCity={variant.priceCity} />
                      </section>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // ---- comparison (driven by the checkboxes above) ----
  const compareVariants = selected.map((id) => variants.find((v) => v.id === id)).filter(Boolean);

  const mainRows = useMemo(() => {
    if (compareVariants.length < 2) return [];
    const specs = [
      [priceLabel, (v) => v.price, true],
      ["Fuel type", (v) => v.fuel],
      ["Transmission", (v) => v.transmission],
      ["Engine", (v) => v.engine],
      ["Power", (v) => v.power],
      ["Torque", (v) => v.torque],
      ["Mileage", (v) => v.mileage],
    ];
    return specs
      .map(([label, get, isPrice]) => ({ label, values: compareVariants.map((v) => get(v) || ""), isPrice: Boolean(isPrice) }))
      .filter((row) => row.values.some(Boolean));
  }, [compareVariants, priceLabel]);

  const groupRows = useMemo(() => {
    if (compareVariants.length < 2) return [];
    const names = [...new Set(compareVariants.flatMap((v) => v.groups.map((g) => g.name)))];
    return names
      .map((name) => {
        const labels = [...new Set(compareVariants.flatMap((v) => v.groups.find((g) => g.name === name)?.rows.map((r) => r.label) ?? []))];
        const rows = labels.map((label) => ({
          label,
          values: compareVariants.map((v) => findRow(v, name, label)?.value ?? ""),
        }));
        return { name, rows: rows.filter((r) => r.values.some(Boolean)) };
      })
      .filter((g) => g.rows.length > 0);
  }, [compareVariants]);

  const differs = (values) => new Set(values.map((v) => v || "—")).size > 1;
  const keep = (values) => !onlyDiff || differs(values);
  const shownMain = mainRows.filter((row) => keep(row.values));
  const shownGroups = groupRows.map((g) => ({ ...g, rows: g.rows.filter((row) => keep(row.values)) })).filter((g) => g.rows.length > 0);

  return (
    <div className="variants">
      <p className="pill-label">Variants &amp; prices</p>
      <h2 id="variants-title" className="variants__title">
        {title} Variants
      </h2>
      <p className="variants__sub">
        Select a fuel type to see every variant, its specifications and {exShowroom ? "ex-showroom " : ""}price
        {priceCityNote ? ` (listed for ${priceCityNote})` : ""}.
      </p>

      {fuels.length > 0 ? (
        <CarTabs
          label="Fuel type"
          tabs={fuelGroups.map((group) => ({
            key: group.key,
            label: (
              <>
                <Icon name="fuel" size={16} />
                {group.label}
              </>
            ),
            content: renderList(group.items),
          }))}
        />
      ) : null}

      {transmissions.length > 1 ? (
        <div className="variants__transmission" role="radiogroup" aria-label="Transmission">
          {["all", ...transmissions].map((option) => (
            <label key={option} className={`radio-pill${transmission === option ? " is-selected" : ""}`}>
              <input
                type="radio"
                name={`${uid}-transmission`}
                value={option}
                checked={transmission === option}
                onChange={() => setTransmission(option)}
              />
              {option === "all" ? "All" : option}
            </label>
          ))}
        </div>
      ) : null}

      {fuels.length === 0 ? renderList(fuelGroups[0].items) : null}

      <div className="variant-compare">
        <div className="variant-compare__header">
          <h3 className="variant-compare__title">Compare variants</h3>
          <p className="variant-compare__hint">
            {compareVariants.length === 0
              ? `Select up to ${MAX_COMPARE} variants above using their checkbox or Compare button.`
              : `${compareVariants.length} of ${MAX_COMPARE} selected.`}
          </p>
        </div>

        {compareVariants.length < 2 ? (
          <p className="variants__empty">Select at least 2 variants to compare them.</p>
        ) : (
          <>
            <button
              type="button"
              className="btn btn--secondary btn--sm variant-compare__toggle"
              aria-pressed={onlyDiff}
              onClick={() => setOnlyDiff((v) => !v)}
            >
              <Icon name={onlyDiff ? "check" : "sliders"} size={16} />
              {onlyDiff ? "Showing differences only" : "Show differences only"}
            </button>

            <div className="spec-table-wrap" role="region" aria-label="Variant comparison" tabIndex={0}>
              <table className="spec-table">
                <thead>
                  <tr>
                    <th scope="col">Specification</th>
                    {compareVariants.map((v) => (
                      <th key={v.id} scope="col">
                        {v.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shownMain.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {row.values.map((value, i) => (
                        <td key={compareVariants[i].id} className={row.isPrice ? "spec-table__price" : undefined}>
                          {value || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {shownGroups.map((group) => (
                    <Fragment key={group.name}>
                      <tr className="spec-table__group">
                        <th scope="colgroup" colSpan={compareVariants.length + 1}>
                          {group.name}
                        </th>
                      </tr>
                      {group.rows.map((row) => (
                        <tr key={`${group.name}-${row.label}`}>
                          <th scope="row">{row.label}</th>
                          {row.values.map((value, i) => (
                            <td key={compareVariants[i].id}>{value || "—"}</td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                  {shownMain.length === 0 && shownGroups.length === 0 ? (
                    <tr>
                      <td colSpan={compareVariants.length + 1}>These variants have the same values in every row.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
