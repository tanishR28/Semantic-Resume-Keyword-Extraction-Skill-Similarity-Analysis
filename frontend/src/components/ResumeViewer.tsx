"use client";

import { Candidate } from "@/lib/mockData";
import { useEffect, useState } from "react";

interface ResumeViewerProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onShortlist: (candidateId: string) => void;
  onReject: (candidateId: string) => void;
}

export default function ResumeViewer({
  candidate,
  isOpen,
  onClose,
  onShortlist,
  onReject,
}: ResumeViewerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen || !candidate) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-on-surface/40 backdrop-blur-sm h-screen w-screen overflow-hidden ${
        isVisible ? "animate-fade-in-overlay" : ""
      }`}
    >
      {/* Top Navigation Bar */}
      <header className="bg-surface-container-lowest flex items-center justify-between px-8 py-4 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">
              close
            </span>
          </button>
          <div className="flex flex-col">
            <h1 className="text-[1.75rem] font-bold text-on-surface leading-none tracking-tight font-[family-name:var(--font-headline)]">
              {candidate.name}
            </h1>
            <span className="text-[0.75rem] font-medium text-secondary tracking-wider uppercase mt-1">
              {candidate.role} • {candidate.location}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-tertiary-fixed/20 px-3 py-1.5 rounded-full mr-4">
            <span
              className="material-symbols-outlined text-on-tertiary-fixed-variant text-sm mr-2"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="text-on-tertiary-fixed-variant font-bold text-xs uppercase tracking-widest">
              {candidate.confidenceScore}% Match
            </span>
          </div>
          <button
            onClick={() => onReject(candidate.id)}
            className="px-6 py-2.5 rounded-lg border border-outline-variant/30 text-error font-semibold hover:bg-error-container/20 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => onShortlist(candidate.id)}
            className="px-8 py-2.5 rounded-lg bg-gradient-to-br from-primary to-primary-container text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            Shortlist
          </button>
          <div className="h-8 w-px bg-outline-variant/30 mx-2" />
          <div className="flex gap-2">
            <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">
                share
              </span>
            </button>
            <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">
                download
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Modal Body */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Resume Preview (70%) */}
        <section className="w-[70%] bg-surface-container overflow-y-auto px-16 py-12">
          <div className="max-w-[850px] mx-auto bg-white shadow-2xl rounded-sm min-h-[1100px] p-10 flex flex-col gap-8 text-on-surface-variant">
            {/* Resume Header */}
            <div className="border-b border-surface-container-high pb-8">
              <h2 className="text-4xl font-extrabold text-on-surface mb-2 tracking-tight font-[family-name:var(--font-headline)]">
                {candidate.name}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  {candidate.email}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">link</span>
                  {candidate.linkedin}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">public</span>
                  {candidate.website}
                </span>
              </div>
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/10 pb-2">
                Experience
              </h3>
              {candidate.experience.map((exp, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-bold text-on-surface">
                      {exp.title} • {exp.company}
                    </h4>
                    <span className="text-sm font-medium italic">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="list-disc ml-4 space-y-2 text-[0.9375rem] leading-relaxed mt-2">
                    {exp.bullets.map((bullet, bIndex) => (
                      <li key={bIndex}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/10 pb-2">
                Education
              </h3>
              {candidate.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-baseline">
                  <div>
                    <h4 className="text-lg font-bold text-on-surface">
                      {edu.degree}
                    </h4>
                    <p className="text-sm">{edu.school}</p>
                  </div>
                  <span className="text-sm font-medium italic">{edu.period}</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-6 opacity-40">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-surface-container-high pb-2">
                Skills &amp; Certifications
              </h3>
              <p className="text-[0.9375rem]">{candidate.certifications}</p>
            </div>
          </div>
        </section>

        {/* Right: AI Smart Summary (30%) */}
        <aside className="w-[30%] bg-surface-container-low border-l border-outline-variant/10 flex flex-col">
          <div className="p-8 h-full overflow-y-auto">
            {/* AI Status Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-lg">
                  AI Smart Summary
                </h3>
                <p className="text-[0.75rem] font-medium text-secondary uppercase tracking-widest">
                  Analysis Complete
                </p>
              </div>
            </div>

            {/* Top Achievements */}
            <div className="mb-10">
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">
                Top Achievements
              </h4>
              <div className="space-y-4">
                {candidate.topAchievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="glass-panel p-4 rounded-xl border border-white/50"
                  >
                    <p
                      className="text-sm leading-relaxed font-medium text-on-surface"
                      dangerouslySetInnerHTML={{ __html: achievement }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Highlight */}
            <div className="mb-10">
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">
                Skills Highlight
              </h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skillsHighlight.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Aura Insight */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">
                Aura Insight
              </h4>
              <div className="bg-tertiary-container/5 rounded-xl p-5 border border-tertiary/10 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-5">
                  <span
                    className="material-symbols-outlined text-[100px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    psychology
                  </span>
                </div>
                <p className="text-sm text-on-tertiary-fixed-variant leading-relaxed italic relative z-10">
                  {candidate.auraInsight}
                </p>
              </div>
            </div>

            {/* Quick Card */}
            <div className="mt-auto pt-6 border-t border-outline-variant/10 flex items-center gap-4">
              <img
                alt={candidate.name}
                className="w-14 h-14 rounded-full object-cover grayscale-[20%]"
                src={candidate.avatarUrl}
              />
              <div>
                <p className="text-sm font-bold text-on-surface">
                  {candidate.name}
                </p>
                <p className="text-xs text-secondary">
                  Added {candidate.appliedDate}
                </p>
              </div>
              <button className="ml-auto p-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
