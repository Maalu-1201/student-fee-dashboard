import { formatINR } from "../utils/feeCalculations.js";

function Stat({ label, value, tone }) {
  return (
    <div className={`stat ${tone ?? ""}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function SummaryCards({ totals }) {
  return (
    <dl className="stats">
      <Stat label="Students" value={totals.totalStudents} />
      <Stat label="Total fees" value={formatINR(totals.totalFees)} />
      <Stat label="Collected" value={formatINR(totals.totalCollected)} tone="paid" />
      <Stat label="Pending" value={formatINR(totals.totalPending)} tone="pending" />
    </dl>
  );
}
