"use client";

import { Candidate } from "@/lib/mockData";
import { useEffect, useState } from "react";

interface SkillsDrawerProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

function RadarChart({
  data,
}: {
  data: { technical: number; experience: number; education: number; leadership: number; culture: number };
}) {
  // Pentagon radar chart using SVG
  const cx = 150, cy = 150, r = 120;
  const labels = [
    { key: "technical" as const, label: "Technical", angle: -90 },
    { key: "education" as const, label: "Education", angle: -90 + 72 },
    { key: "culture" as const, label: "Culture", angle: -90 + 144 },
    { key: "leadership" as const, label: "Leadership", angle: -90 + 216 },
    { key: "experience" as const, label: "Experience", angle: -90 + 288 },
  ];

  const getPoint = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const dataPoints = labels.map((l) => {
    const value = data[l.key] / 100;
    return getPoint(l.angle, r * value);
  });

  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Grid */}
        {gridLevels.map((level) => {
          const points = labels
            .map((l) => getPoint(l.angle, r * level))
            .map((p) => `${p.x},${p.y}`)
            .join(" ");
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="#c7c4d8"
              strokeWidth="0.5"
              opacity="0.4"
            />
          );
        })}

        {/* Axis Lines */}
        {labels.map((l) => {
          const end = getPoint(l.angle, r);
          return (
            <line
              key={l.key}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="#c7c4d8"
              strokeWidth="0.5"
              opacity="0.3"
            />
          );
        })}

        {/* Data Shape */}
        <polygon
          points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(79, 70, 229, 0.2)"
          stroke="#4f46e5"
          strokeWidth="2"
        />

        {/* Data Points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#4f46e5" />
        ))}
      </svg>

      {/* Labels */}
      {labels.map((l) => {
        const labelPoint = getPoint(l.angle, r + 30);
        const value = data[l.key];
        return (
          <div
            key={l.key}
            className="absolute text-[10px] font-bold uppercase tracking-tighter bg-surface-container-lowest px-2 py-0.5 rounded whitespace-nowrap"
            style={{
              left: `${(labelPoint.x / 300) * 100}%`,
              top: `${(labelPoint.y / 300) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {l.label} ({value})
          </div>
        );
      })}
    </div>
  );
}

export default function SkillsDrawer({
  candidate,
  isOpen,
  onClose,
}: SkillsDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen || !candidate) return null;

  return (
    <>
      {/* Dimming Overlay */}
      <div
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 animate-fade-in-overlay"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[400px] bg-surface-container-lowest/80 backdrop-blur-3xl z-[60] shadow-2xl flex flex-col border-l border-outline-variant/10 ${
          isAnimating ? "animate-slide-in-right" : ""
        }`}
      >
        {/* Header */}
        <div className="p-8 pb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white ring-4 ring-tertiary-fixed/30">
                <img
                  className="w-full h-full object-cover"
                  src={candidate.avatarUrl}
                  alt={candidate.name}
                />
              </div>
              {candidate.confidenceScore >= 90 && (
                <div className="absolute -bottom-1 -right-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                  TOP
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-[family-name:var(--font-headline)] font-bold text-on-surface leading-tight">
                {candidate.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="material-symbols-outlined text-tertiary-fixed text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="text-sm font-bold text-tertiary-container">
                  {candidate.confidenceScore}% Match Score
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              close
            </span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-10">
          {/* Radar Chart */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">
              Competency Profile
            </h3>
            <RadarChart data={candidate.competencyProfile} />
          </section>

          {/* Executive Summary */}
          <section className="bg-surface-container-low p-6 rounded-xl relative">
            <div className="absolute top-0 left-6 transform -translate-y-1/2">
              <span
                className="material-symbols-outlined bg-primary text-white p-2 rounded-lg text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                psychology
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-headline)] font-bold text-on-surface mb-3 mt-2">
              Executive Summary
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
              Overall fit is{" "}
              <span className="text-primary font-bold">
                {candidate.confidenceScore - 2}%
              </span>{" "}
              based on technical overlap. {candidate.executiveSummary.split(". ").slice(1).join(". ")}
            </p>
          </section>

          {/* Highlights */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
              Highlights
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.highlights.map((highlight, index) => (
                <span
                  key={index}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    index === candidate.highlights.length - 1
                      ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                      : "bg-secondary-container text-on-secondary-container"
                  }`}
                >
                  {highlight}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-surface-container-lowest border-t border-surface-container flex gap-4">
          <button className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">mail</span>
            Invite to Interview
          </button>
          <button className="w-14 h-14 border border-outline-variant/30 rounded-xl flex items-center justify-center hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">
              bookmark
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
