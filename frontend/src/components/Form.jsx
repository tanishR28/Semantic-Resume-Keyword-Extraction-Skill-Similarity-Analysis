import { useState } from "react";

const INITIAL_STATE = {
  resume_text: "",
  jd_text: "",
};

export default function Form({ onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL_STATE);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 shadow-panel sm:p-6">
      <h2 className="text-xl font-semibold text-slate-900">Input</h2>

      <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="resume_text">
        Resume Text
      </label>
      <textarea
        id="resume_text"
        name="resume_text"
        value={form.resume_text}
        onChange={handleChange}
        required
        placeholder="Paste resume text..."
        className="mt-2 h-48 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
      />

      <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="jd_text">
        Job Description
      </label>
      <textarea
        id="jd_text"
        name="jd_text"
        value={form.jd_text}
        onChange={handleChange}
        required
        placeholder="Paste job description text..."
        className="mt-2 h-48 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Matching..." : "Match Resume"}
      </button>
    </form>
  );
}
