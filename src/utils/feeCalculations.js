// Pure functions only: no React here, so they are easy to test and reuse.

/**
 * Problem 1: pending = total - paid.
 * Edge cases: invalid numbers throw; overpayment is clamped to 0
 * (the extra amount is a credit, see getOverpaid).
 */
export function calculatePending(totalFee, paid) {
  if (!Number.isFinite(totalFee) || !Number.isFinite(paid) || totalFee < 0 || paid < 0) {
    throw new Error("totalFee and paid must be non-negative numbers");
  }
  return Math.max(totalFee - paid, 0);
}

export function getOverpaid(totalFee, paid) {
  return Math.max(paid - totalFee, 0);
}

export function withPending(students) {
  return students.map((s) => ({ ...s, pending: calculatePending(s.totalFee, s.paid) }));
}

/** Problem 2: only students who still owe money. */
export function filterPendingStudents(students) {
  return students.filter((s) => calculatePending(s.totalFee, s.paid) > 0);
}

/** Problem 3: totals across all students. */
export function calculateTotals(students) {
  return students.reduce(
    (totals, s) => {
      totals.totalFees += s.totalFee;
      totals.totalCollected += s.paid;
      totals.totalPending += calculatePending(s.totalFee, s.paid);
      return totals;
    },
    { totalStudents: students.length, totalFees: 0, totalCollected: 0, totalPending: 0 }
  );
}

/** Problem 4: student with the highest pending fee (null for empty list). */
export function findHighestPending(students) {
  if (students.length === 0) return null;
  return students.reduce((top, s) =>
    calculatePending(s.totalFee, s.paid) > calculatePending(top.totalFee, top.paid) ? s : top
  );
}

export function searchByName(students, query) {
  const q = query.trim().toLowerCase();
  return q ? students.filter((s) => s.name.toLowerCase().includes(q)) : students;
}

/** direction: "asc" | "desc" | "none". Returns a new array. */
export function sortByPending(students, direction) {
  if (direction === "none") return students;
  const factor = direction === "asc" ? 1 : -1;
  return [...students].sort((a, b) => (a.pending - b.pending) * factor);
}

export const formatINR = (amount) => "₹" + amount.toLocaleString("en-IN");
