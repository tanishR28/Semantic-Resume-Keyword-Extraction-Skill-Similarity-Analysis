"use client";

interface ConfidenceScoreRingProps {
  score: number;
  size?: number;
  showTooltip?: boolean;
  diagnostic?: {
    pros: string;
    cons: string;
    insight: string;
  };
}

export default function ConfidenceScoreRing({
  score,
  size = 56,
  showTooltip = false,
  diagnostic,
}: ConfidenceScoreRingProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-tertiary-fixed";
    if (s >= 50) return "text-amber-400";
    return "text-error";
  };

  return (
    <div className={`relative group/score cursor-help`} style={{ width: size, height: size }}>
      <svg className="match-score-ring w-full h-full" viewBox="0 0 36 36">
        <path
          className="text-surface-container stroke-current"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeWidth="4"
        />
        <path
          className={`${getScoreColor(score)} stroke-current aura-glow`}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeDasharray={`${score}, 100`}
          strokeLinecap="round"
          strokeWidth="6"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-extrabold text-on-tertiary-fixed-variant">
          {score}%
        </span>
      </div>

      {showTooltip && diagnostic && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-64 p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl opacity-0 group-hover/score:opacity-100 transition-opacity z-50 pointer-events-none ring-1 ring-outline-variant/20">
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
            AI Diagnostic
          </p>
          <div className="space-y-2">
            <p className="text-xs">
              <strong>Pros:</strong> {diagnostic.pros}
            </p>
            <p className="text-xs text-on-surface-variant">
              <strong>Cons:</strong> {diagnostic.cons}
            </p>
            <div className="pt-2 mt-2 border-t border-surface-container">
              <p className="text-xs italic text-on-surface">
                &quot;{diagnostic.insight}&quot;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
