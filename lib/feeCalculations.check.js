// Run with: npm run test:logic  (no test framework needed)
import assert from "node:assert";
import { students } from "../data/students.js";
import * as f from "./feeCalculations.js";

assert.equal(f.calculatePending(5000, 3000), 2000);
assert.equal(f.calculatePending(4000, 4000), 0);
assert.equal(f.calculatePending(4000, 4500), 0); // overpayment clamped
assert.throws(() => f.calculatePending(-1, 0));
assert.equal(f.calculatePercent(1, 0), 0);
assert.equal(f.filterPendingStudents(students).length, 4);
assert.deepEqual(f.calculateTotals(students), {
  totalStudents: 5, totalFees: 23500, totalCollected: 11500, totalPending: 12000,
});
assert.equal(f.findHighestPending(students).name, "Rahul Patel");
assert.equal(f.findHighestPending([]), null);
console.log("All logic checks passed ✅");
