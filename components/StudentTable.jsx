import { formatINR } from "@/lib/feeCalculations.js";

const getInitials = (name) =>
  name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

function StatusBadge({ pending }) {
  return pending === 0
    ? <span className="badge paid">Fully paid</span>
    : <span className="badge pending">Pending</span>;
}

function ProgressBar({ percent, isPaid }) {
  return (
    <div className="progress" role="img" aria-label={`${percent}% paid`}>
      <div className="progress-track">
        <span className={isPaid ? "fill paid" : "fill pending"} style={{ width: `${percent}%` }} />
      </div>
      <small>{percent}%</small>
    </div>
  );
}

export default function StudentTable({ students, onClearFilters }) {
  if (students.length === 0) {
    return (
      <div className="empty" role="status">
        <p>No students match your search or filter.</p>
        <button type="button" className="btn" onClick={onClearFilters}>Clear filters</button>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th className="num">Total fee</th>
            <th className="num">Paid</th>
            <th className="num">Pending</th>
            <th>Progress</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => {
            const isPaid = s.pending === 0;
            return (
              <tr key={s.id} className={isPaid ? "row-paid" : "row-pending"}>
                <td data-label="Student">
                  <span className="student">
                    <span className={`avatar ${isPaid ? "paid" : "pending"}`}>{getInitials(s.name)}</span>
                    {s.name}
                  </span>
                </td>
                <td data-label="Class">Class {s.className}</td>
                <td data-label="Total fee" className="num">{formatINR(s.totalFee)}</td>
                <td data-label="Paid" className="num">{formatINR(s.paid)}</td>
                <td data-label="Pending" className="num strong">{formatINR(s.pending)}</td>
                <td data-label="Progress"><ProgressBar percent={s.percentPaid} isPaid={isPaid} /></td>
                <td data-label="Status"><StatusBadge pending={s.pending} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
