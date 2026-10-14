import { useMemo, useState } from "react";
import { students as rawStudents } from "./data/students.js";
import {
  calculateTotals, filterPendingStudents, searchByName, sortByPending, withPending,
} from "./utils/feeCalculations.js";
import SummaryCards from "./components/SummaryCards.jsx";
import Controls from "./components/Controls.jsx";
import StudentTable from "./components/StudentTable.jsx";

export default function App() {
  const [query, setQuery] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  const [sortDirection, setSortDirection] = useState("none");

  const students = useMemo(() => withPending(rawStudents), []);
  const totals = useMemo(() => calculateTotals(students), [students]);

  const visibleStudents = useMemo(() => {
    let list = searchByName(students, query);
    if (onlyPending) list = filterPendingStudents(list);
    return sortByPending(list, sortDirection);
  }, [students, query, onlyPending, sortDirection]);

  const cycleSort = () =>
    setSortDirection((d) => (d === "none" ? "desc" : d === "desc" ? "asc" : "none"));

  return (
    <main className="page">
      <header className="page-header">
        <h1>Student fees</h1>
        <p>Who has paid, and who still owes.</p>
      </header>

      <SummaryCards totals={totals} />

      <Controls
        query={query}
        onQueryChange={setQuery}
        onlyPending={onlyPending}
        onOnlyPendingChange={setOnlyPending}
        sortDirection={sortDirection}
        onSortToggle={cycleSort}
      />

      <StudentTable
        students={visibleStudents}
        onClearFilters={() => { setQuery(""); setOnlyPending(false); }}
      />
    </main>
  );
}
