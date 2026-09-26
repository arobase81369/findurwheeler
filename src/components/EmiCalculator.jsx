"use client";

import { useMemo, useState } from "react";
import { calculateEmi } from "@/lib/emi";
import { formatInr } from "@/lib/format";

/** Illustrative EMI estimate. Defaults are generic loan settings, not car data: edit them freely. */
export function EmiCalculator({ defaultPrice }) {
  const [price, setPrice] = useState(defaultPrice);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(5);

  const result = useMemo(
    () =>
      calculateEmi({
        price: Number(price) || 0,
        downPaymentPercent: down,
        annualRatePercent: rate,
        years,
      }),
    [price, down, rate, years],
  );

  return (
    <div className="emi">
      <div className="emi__inputs">
        <label className="field">
          <span className="field__label">Car price (₹)</span>
          <input
            className="field__control"
            type="number"
            inputMode="numeric"
            min="0"
            step="10000"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">
            Down payment <output className="field__value">{down}%</output>
          </span>
          <input type="range" min="0" max="50" step="5" value={down} onChange={(e) => setDown(Number(e.target.value))} />
        </label>

        <label className="field">
          <span className="field__label">
            Interest rate <output className="field__value">{rate}% a year</output>
          </span>
          <input type="range" min="5" max="20" step="0.25" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>

        <label className="field">
          <span className="field__label">
            Loan tenure <output className="field__value">{years} {years === 1 ? "year" : "years"}</output>
          </span>
          <input type="range" min="1" max="8" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        </label>
      </div>

      <div className="emi__result" aria-live="polite">
        <p className="emi__label">Estimated monthly EMI</p>
        <p className="emi__amount">{formatInr(result.emi)}</p>
        <dl className="emi__rows">
          <div><dt>Loan amount</dt><dd>{formatInr(result.principal)}</dd></div>
          <div><dt>Total interest</dt><dd>{formatInr(result.totalInterest)}</dd></div>
          <div><dt>Total payable</dt><dd>{formatInr(result.totalPayable)}</dd></div>
        </dl>
        <p className="emi__note">
          Illustrative estimate only. Enter the rate your lender offers. On-road price, insurance and fees are not included.
        </p>
      </div>
    </div>
  );
}
