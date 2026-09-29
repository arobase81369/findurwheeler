"use client";

import { useMemo, useState } from "react";
import { CITY, DEFAULT_INSURANCE_PERCENT, calculateOnRoadPrice } from "@/lib/onroad";
import { formatInr } from "@/lib/format";

/**
 * Estimated on-road price for one variant, in Hyderabad. This is an illustrative estimate
 * (road tax slab + a flat cess and registration fee + an adjustable insurance percentage),
 * not a figure from the cars API. Insurance and other charges are editable because real
 * premiums and dealer handling fees vary.
 */
export function OnRoadPrice({ exShowroom, priceCity }) {
  const [insurancePercent, setInsurancePercent] = useState(DEFAULT_INSURANCE_PERCENT);
  const [othersFlat, setOthersFlat] = useState(0);

  const result = useMemo(
    () => calculateOnRoadPrice({ exShowroom, insurancePercent, othersFlat }),
    [exShowroom, insurancePercent, othersFlat],
  );

  const rows = [
    ["Ex-showroom price", formatInr(result.exShowroom)],
    [`Registration charges (road tax, ${Math.round(result.roadTaxRate * 100)}% + cess)`, formatInr(result.registrationTotal)],
    ["Insurance (estimate)", formatInr(result.insurance)],
    ["Other charges", formatInr(result.others)],
  ];

  return (
    <div className="onroad">
      <div className="onroad__header">
        <p className="onroad__city">Estimated on-road price in {CITY}</p>
        <p className="onroad__amount">{formatInr(result.onRoad)}</p>
      </div>

      <dl className="onroad__rows">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="onroad__inputs">
        <label className="field">
          <span className="field__label">
            Insurance <output className="field__value">{insurancePercent}% of ex-showroom</output>
          </span>
          <input
            type="range"
            min="2"
            max="8"
            step="0.5"
            value={insurancePercent}
            onChange={(event) => setInsurancePercent(Number(event.target.value))}
          />
        </label>

        <label className="field">
          <span className="field__label">Other charges (dealer handling, accessories, FASTag)</span>
          <input
            className="field__control"
            type="number"
            inputMode="numeric"
            min="0"
            step="500"
            value={othersFlat}
            onChange={(event) => setOthersFlat(Number(event.target.value) || 0)}
          />
        </label>
      </div>

      <p className="onroad__note">
        Estimate only, for {CITY} (Telangana). Uses Telangana&rsquo;s road tax slabs and the Road
        Safety Cess; insurance and other charges are adjustable, since actual premiums, RTO fees
        and dealer charges vary.
        {priceCity && priceCity.toLowerCase() !== CITY.toLowerCase()
          ? ` The ex-showroom price above is the one listed for ${priceCity}, which can differ slightly from the Telangana ex-showroom price.`
          : ""}{" "}
        Confirm the exact figure with your dealer or the RTO before buying.
      </p>
    </div>
  );
}
