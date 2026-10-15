"use client"; // Client Component: uses state, effects and event handlers.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  calculatePercent, calculateTotals, filterPendingStudents, formatINR,
  searchByName, sortByPending, withPending,
} from "@/lib/feeCalculations.js";
import SummaryCards from "./SummaryCards.jsx";
import Controls from "./Controls.jsx";
import StudentTable from "./StudentTable.jsx";

export default function Dashboard() {
  const [rawStudents, setRawStudents] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "ready"
  const [errorMessage, setErrorMessage] = useState("");

  const [query, setQuery] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  const [sortDirection, setSortDirection] = useState("none");

  // Frontend -> backend: GET /api/students, with loading and error handling.
  const loadStudents = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/students");
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${response.status})`);
      }
      const data = await response.json();
      setRawStudents(data.students);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const students = useMemo(() => withPending(rawStudents), [rawStudents]);
  const totals = useMemo(() => calculateTotals(students), [students]);
  const collectedPercent = calculatePercent(totals.totalCollected, totals.totalFees);

  const visibleStudents = useMemo(() => {
    let list = searchByName(students, query);
    if (onlyPending) list = filterPendingStudents(list);
    return sortByPending(list, sortDirection);
  }, [students, query, onlyPending, sortDirection]);

  const cycleSort = () =>
    setSortDirection((d) => (d === "none" ? "desc" : d === "desc" ? "asc" : "none"));

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <div>
            <h1>Student Fee Management</h1>
            <p>Who has paid, and who still owes.</p>
          </div>
          <div className="meter" role="img" aria-label={`${collectedPercent}% of fees collected`}>
            <p className="meter-text">
              <strong>{collectedPercent}%</strong> collected
              <span>{formatINR(totals.totalCollected)} of {formatINR(totals.totalFees)}</span>
            </p>
            <div className="meter-bar"><span style={{ width: `${collectedPercent}%` }} /></div>
          </div>
        </div>
      </header>

      <main className="page">
        {status === "loading" && <div className="state" role="status">Loading students…</div>}

        {status === "error" && (
          <div className="state error" role="alert">
            <p>{errorMessage}</p>
            <button type="button" className="btn" onClick={loadStudents}>Try again</button>
          </div>
        )}

        {status === "ready" && (
          <>
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
          </>
        )}
      </main>
    </>
  );
}
