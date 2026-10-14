// Data layer. The API route calls getStudents() only.
// To use a real database later, replace the body of getStudents() with a query
// (e.g. SELECT ... FROM students LEFT JOIN payments ... from sql/schema_and_queries.sql).
export const students = [
  { id: 1, name: "Aman Sharma", className: "10", totalFee: 5000, paid: 3000 },
  { id: 2, name: "Priya Verma", className: "9", totalFee: 4000, paid: 4000 },
  { id: 3, name: "Rahul Patel", className: "10", totalFee: 6000, paid: 2500 },
  { id: 4, name: "Neha Singh", className: "8", totalFee: 3000, paid: 0 },
  { id: 5, name: "Rohan Das", className: "9", totalFee: 5500, paid: 2000 },
];

export async function getStudents() {
  return students;
}
