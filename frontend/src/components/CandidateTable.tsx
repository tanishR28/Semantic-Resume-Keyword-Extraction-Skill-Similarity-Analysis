"use client";

import { Candidate } from "@/lib/mockData";
import ConfidenceScoreRing from "./ConfidenceScoreRing";

interface CandidateTableProps {
  candidates: Candidate[];
  onViewResume: (candidate: Candidate) => void;
  onShortlist: (candidateId: string) => void;
  onRowClick: (candidate: Candidate) => void;
}

export default function CandidateTable({
  candidates,
  onViewResume,
  onShortlist,
  onRowClick,
}: CandidateTableProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl ring-1 ring-outline-variant/15 overflow-hidden animate-fade-in">
      <div className="px-8 py-6 flex justify-between items-center bg-white border-b border-surface-container">
        <h2 className="text-xl font-bold text-on-surface font-[family-name:var(--font-headline)]">
          Top Recommended Candidates
        </h2>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">
              filter_list
            </span>
          </button>
          <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">
              more_vert
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low text-[0.7rem] uppercase tracking-[0.1em] font-bold text-on-secondary-container">
            <tr>
              <th className="px-8 py-4">Candidate</th>
              <th className="px-8 py-4">Confidence Score</th>
              <th className="px-8 py-4">Skills Match</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container/50">
            {candidates.map((candidate) => (
              <tr
                key={candidate.id}
                className="group hover:bg-surface-container-low transition-colors cursor-pointer"
                onClick={() => onRowClick(candidate)}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        alt={candidate.name}
                        className="w-12 h-12 rounded-full bg-indigo-50 object-cover"
                        src={candidate.avatarUrl}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary-fixed border-2 border-white rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-on-surface">
                        {candidate.name}
                      </h4>
                      <p className="text-sm text-on-surface-variant">
                        {candidate.role}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <ConfidenceScoreRing
                    score={candidate.confidenceScore}
                    showTooltip
                    diagnostic={candidate.aiDiagnostic}
                  />
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-wider"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewResume(candidate);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-primary border border-primary/20 hover:bg-primary/5 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">
                        visibility
                      </span>
                      View Resume
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShortlist(candidate.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-container transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">
                        check_circle
                      </span>
                      Shortlist
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-4 bg-surface-container-low flex justify-between items-center">
        <span className="text-xs text-on-surface-variant font-medium">
          Showing 1 to {candidates.length} of 24 candidates
        </span>
        <div className="flex gap-2">
          <button className="p-2 border border-outline-variant/30 rounded-lg hover:bg-white transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="p-2 border border-outline-variant/30 rounded-lg bg-white shadow-sm font-bold text-xs px-4">
            1
          </button>
          <button className="p-2 border border-outline-variant/30 rounded-lg hover:bg-white transition-colors font-bold text-xs px-4">
            2
          </button>
          <button className="p-2 border border-outline-variant/30 rounded-lg hover:bg-white transition-colors font-bold text-xs px-4">
            3
          </button>
          <button className="p-2 border border-outline-variant/30 rounded-lg hover:bg-white transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}
