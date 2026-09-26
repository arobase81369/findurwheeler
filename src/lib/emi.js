/**
 * Standard reducing-balance EMI.
 * @param {{ price: number, downPaymentPercent: number, annualRatePercent: number, years: number }} input
 */
export function calculateEmi({ price, downPaymentPercent, annualRatePercent, years }) {
  const months = Math.max(1, Math.round(years * 12));
  const principal = Math.max(0, price * (1 - downPaymentPercent / 100));
  const monthlyRate = annualRatePercent / 12 / 100;

  const emi =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);

  const totalPayable = emi * months;
  return { principal, emi, totalPayable, totalInterest: totalPayable - principal, months };
}
