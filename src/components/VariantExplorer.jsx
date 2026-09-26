"use client";

import { Fragment, useId, useState } from "react";
import { CarTabs } from "./CarTabs";
import { Icon } from "./Icon";

const STAT_COLUMNS = [
  ["engine", "Engine"],
  ["mileage", "Mileage"],
  ["price", "Price"],
];

const hasDetails = (variant) => variant.groups.some((g) => g.rows.some((r) => r.bool !== false));
const findRow = (variant, group, label) => variant.groups.find((g) => g.name === group)?.rows.find((r) => r.label === label);

/**
 * Variants grouped by fuel type (tabs), expandable rows, and a two-variant comparison.
 * @param {{ title: string, variants: ReturnType<typeof import("@/lib/detail-model.js").toVariants> }} props
 */
export function VariantExplorer({ title, variants }) {
  const uid = useId();
  const [openId, setOpenId] = useState(() => variants.find(hasDetails)?.id ?? null);
  const [firstId, setFirstId] = useState(variants[0].id);
  const [secondId, setSecondId] = useState(variants[variants.length - 1].id);
  const [onlyDiff, setOnlyDiff] = useState(false);

  // Say "ex-showroom" only when the API says the prices are ex-showroom.
  const exShowroom = variants.every((v) => !v.priceType || v.priceType === "ex_showroom") && variants.some((v) => v.priceType);
  const priceLabel = exShowroom ? "Price (ex-showroom)" : "Price";

  const columns = STAT_COLUMNS.filter(([key]) => variants.some((v) => v[key]));

  const fuels = [...new Set(variants.map((v) => v.fuel).filter(Boolean))];
  const withoutFuel = variants.filter((v) => !v.fuel);
  const fuelGroups =
    fuels.length > 0
      ? [
          ...fuels.map((fuel) => ({ key: fuel, label: fuel, items: variants.filter((v) => v.fuel === fuel) })),
          ...(withoutFuel.length ? [{ key: "other", label: "Other", items: withoutFuel }] : []),
        ]
      : [{ key: "all", label: "All variants", items: variants }];

  function renderList(items) {
    return (
      <div
        className={`variants__card${columns.length === 0 ? " variants__card--plain" : ""}`}
        style={{ "--cols": Math.max(columns.length, 1) }}
      >
        <div className="variants__head" aria-hidden="true">
          <span>Variant</span>
          {columns.map(([key, label]) => (
            <span key={key}>{label}</span>
          ))}
          <span />
        </div>

        <ul>
          {items.map((variant) => {
            const expanded = openId === variant.id;
            const detailsId = `${uid}-details-${variant.id}`;
            const meta = [variant.transmission, variant.power, variant.torque].filter(Boolean).join(" · ");

            return (
              <li key={variant.id} className="variants__item">
                <div className="variants__row">
                  <div className="variants__name-block">
                    <p className="variants__name">{variant.name}</p>
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

                  {hasDetails(variant) ? (
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

                {hasDetails(variant) ? (
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
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // ---- comparison ----
  const first = variants.find((v) => v.id === firstId) ?? variants[0];
  const second = variants.find((v) => v.id === secondId) ?? variants[variants.length - 1];

  const mainRows = [
    [priceLabel, first.price, second.price, true],
    ["Fuel type", first.fuel, second.fuel],
    ["Transmission", first.transmission, second.transmission],
    ["Engine", first.engine, second.engine],
    ["Power", first.power, second.power],
    ["Torque", first.torque, second.torque],
    ["Mileage", first.mileage, second.mileage],
  ]
    .filter(([, a, b]) => a || b)
    .map(([label, a, b, isPrice]) => ({ label, a: a || "—", b: b || "—", isPrice: Boolean(isPrice) }));

  const groupNames = [...new Set([...first.groups, ...second.groups].map((g) => g.name))];
  const groupRows = groupNames
    .map((name) => {
      const labels = [
        ...new Set(
          [first, second].flatMap((v) => v.groups.find((g) => g.name === name)?.rows.map((r) => r.label) ?? []),
        ),
      ];
      const rows = labels.map((label) => ({
        label,
        a: findRow(first, name, label)?.value ?? "—",
        b: findRow(second, name, label)?.value ?? "—",
        isPrice: false,
      }));
      return { name, rows };
    })
    .filter((g) => g.rows.length > 0);

  const keep = (row) => !onlyDiff || row.a !== row.b;
  const shownMain = mainRows.filter(keep);
  const shownGroups = groupRows.map((g) => ({ ...g, rows: g.rows.filter(keep) })).filter((g) => g.rows.length > 0);

  const options = variants.map((v) => (
    <option key={v.id} value={v.id}>
      {v.price ? `${v.name} — ${v.price}` : v.name}
    </option>
  ));

  return (
    <div className="variants">
      <p className="pill-label">Variants &amp; prices</p>
      <h2 id="variants-title" className="variants__title">
        {title} Variants
      </h2>
      <p className="variants__sub">
        Select a fuel type to see every variant, its specifications and {exShowroom ? "ex-showroom " : ""}price.
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
      ) : (
        renderList(fuelGroups[0].items)
      )}

      {variants.length >= 2 ? (
        <div className="variant-compare">
          <h3 className="variant-compare__title">Compare variants</h3>

          <div className="variant-compare__pickers">
            <label className="field">
              <span className="field__label">Variant 1</span>
              <select className="field__control field__control--pill" value={firstId} onChange={(e) => setFirstId(e.target.value)}>
                {options}
              </select>
            </label>
            <span className="variant-compare__vs" aria-hidden="true">
              VS
            </span>
            <label className="field">
              <span className="field__label">Variant 2</span>
              <select className="field__control field__control--pill" value={secondId} onChange={(e) => setSecondId(e.target.value)}>
                {options}
              </select>
            </label>
          </div>

          <button type="button" className="btn btn--secondary btn--sm variant-compare__toggle" aria-pressed={onlyDiff} onClick={() => setOnlyDiff((v) => !v)}>
            <Icon name={onlyDiff ? "check" : "sliders"} size={16} />
            {onlyDiff ? "Showing differences only" : "Show differences only"}
          </button>

          <div className="spec-table-wrap" role="region" aria-label="Variant comparison" tabIndex={0}>
            <table className="spec-table">
              <thead>
                <tr>
                  <th scope="col">Specification</th>
                  <th scope="col">{first.name}</th>
                  <th scope="col">{second.name}</th>
                </tr>
              </thead>
              <tbody>
                {shownMain.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td className={row.isPrice ? "spec-table__price" : undefined}>{row.a}</td>
                    <td className={row.isPrice ? "spec-table__price" : undefined}>{row.b}</td>
                  </tr>
                ))}
                {shownGroups.map((group) => (
                  <Fragment key={group.name}>
                    <tr className="spec-table__group">
                      <th scope="colgroup" colSpan={3}>
                        {group.name}
                      </th>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={`${group.name}-${row.label}`}>
                        <th scope="row">{row.label}</th>
                        <td>{row.a}</td>
                        <td>{row.b}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
                {shownMain.length === 0 && shownGroups.length === 0 ? (
                  <tr>
                    <td colSpan={3}>These variants have the same values in every row.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
