import { useState } from "react";
import Form from "./components/Form";
import Results from "./components/Results";

const API_URL = "http://localhost:8000/match";

export default function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMatch(payload) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "Unable to reach backend");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">ATS Resume Matcher</h1>
        <p className="mt-2 text-slate-600">Paste your resume and job description to quickly see match quality.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <Form onSubmit={handleMatch} loading={loading} />
        <Results data={results} loading={loading} error={error} />
      </section>
    </main>
  );
}
