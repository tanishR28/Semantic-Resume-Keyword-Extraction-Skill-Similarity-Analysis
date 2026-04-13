function ScoreCard({ score }) {
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
      <p className="text-sm font-medium text-slate-700">Overall Score</p>
      <p className="mt-1 text-4xl font-bold tracking-tight text-sky-700">{score.toFixed(1)}</p>
    </div>
  );
}

function MatchedRequirements({ items }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-lg font-semibold text-slate-900">Matched Requirements</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-600">No matched requirements yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((item, idx) => (
            <li key={`${item.requirement}-${idx}`} className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-sm font-semibold text-slate-800">{item.requirement}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Matched Text</p>
              <p className="mt-1 rounded-md bg-emerald-50 px-2 py-1 text-sm text-emerald-800">{item.matched_text || "No close match found"}</p>
              <p className="mt-2 text-sm font-medium text-slate-700">Score: <span className="text-slate-900">{item.score}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SimpleList({ title, items, emptyText, tone }) {
  const toneClass = tone === "warn" ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200";

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-600">{emptyText}</p>
      ) : (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {items.map((item, idx) => (
            <li key={`${title}-${idx}`}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Results({ data, loading, error }) {
  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-panel">
        <p className="text-slate-600">Running match analysis...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-panel">
        <p className="font-medium text-rose-700">{error}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-panel">
        <p className="text-slate-600">Results will appear here after matching.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-5 shadow-panel sm:p-6">
      <ScoreCard score={Number(data.score || 0)} />
      <MatchedRequirements items={data.matched_requirements || []} />
      <SimpleList
        title="Missing Skills"
        items={data.missing_skills || []}
        emptyText="No missing skills detected."
        tone="warn"
      />
      <SimpleList title="Flags" items={data.flags || []} emptyText="No flags." />
    </section>
  );
}
