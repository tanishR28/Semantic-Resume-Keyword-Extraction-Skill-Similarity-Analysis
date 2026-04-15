"use client";

import { useState } from "react";

interface JobSpecificationProps {
  onSave: (jobDescription: string) => void;
  initialJobDescription?: string;
}

export default function JobSpecification({ onSave, initialJobDescription = "" }: JobSpecificationProps) {
  const [jobDescription, setJobDescription] = useState(initialJobDescription);

  return (
    <section className="bg-surface-container-lowest p-8 rounded-xl ring-1 ring-outline-variant/15 animate-fade-in">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-on-surface font-[family-name:var(--font-headline)]">
            Job Specification
          </h2>
          <p className="text-on-surface-variant mt-1 text-sm">
            Define the requirements and automation settings for this role.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              className="block text-sm font-bold text-on-surface mb-2"
              htmlFor="job-description"
            >
              Job Description
            </label>
            <textarea
              className="w-full h-64 bg-surface-container-low border-none ring-1 ring-outline-variant/20 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary transition-all outline-none resize-y"
              id="job-description"
              placeholder="Paste the full job description here, including responsibilities, requirements, and benefits..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => onSave(jobDescription)}
              className="bg-primary text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-primary-container transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Save &amp; Process
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
