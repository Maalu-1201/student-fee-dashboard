const sortLabels = {
  none: "Sort by pending",
  desc: "Pending: high to low",
  asc: "Pending: low to high",
};

export default function Controls({
  query, onQueryChange, onlyPending, onOnlyPendingChange, sortDirection, onSortToggle,
}) {
  return (
    <section className="controls" aria-label="Table controls">
      <label className="field">
        <span className="visually-hidden">Search by name</span>
        <input
          type="search"
          placeholder="Search by student name"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </label>

      <label className="check">
        <input
          type="checkbox"
          checked={onlyPending}
          onChange={(e) => onOnlyPendingChange(e.target.checked)}
        />
        Pending only
      </label>

      <button type="button" className="btn" onClick={onSortToggle}>
        {sortLabels[sortDirection]}
      </button>
    </section>
  );
}
