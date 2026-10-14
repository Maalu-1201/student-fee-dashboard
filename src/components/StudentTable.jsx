import { formatINR } from "../utils/feeCalculations.js";

function StatusBadge({ pending }) {
  return pending === 0
    ? <span className="badge paid">Fully paid</span>
    : <span className="badge pending">Pending</span>;
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className={s.pending === 0 ? "row-paid" : "row-pending"}>
              <td data-label="Student">{s.name}</td>
              <td data-label="Class">{s.className}</td>
              <td data-label="Total fee" className="num">{formatINR(s.totalFee)}</td>
              <td data-label="Paid" className="num">{formatINR(s.paid)}</td>
              <td data-label="Pending" className="num strong">{formatINR(s.pending)}</td>
              <td data-label="Status"><StatusBadge pending={s.pending} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
