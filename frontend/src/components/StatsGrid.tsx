"use client";

import { DashboardStats as DashboardStatsType } from "@/lib/mockData";

interface StatsGridProps {
  stats: DashboardStatsType;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    {
      icon: "trending_up",
      value: stats.totalResumesParsed,
      label: "Total Resumes Parsed",
      variant: "primary" as const,
    },
    {
      icon: "bolt",
      value: stats.highConfidenceMatches,
      label: "High-Confidence Matches",
      variant: "default" as const,
      iconFill: true,
    },
    {
      icon: "timer",
      value: stats.avgAnalysisTime,
      label: "Avg. Analysis Time",
      variant: "default" as const,
    },
    {
      icon: "group_add",
      value: stats.interviewsScheduled,
      label: "Interviews Scheduled",
      variant: "default" as const,
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`p-6 rounded-xl ${
            card.variant === "primary"
              ? "bg-indigo-600 text-white"
              : "bg-white ring-1 ring-outline-variant/15"
          }`}
        >
          <span
            className={`material-symbols-outlined ${
              card.variant === "primary"
                ? "text-indigo-200"
                : index === 1
                ? "text-primary"
                : index === 2
                ? "text-tertiary-container"
                : "text-on-error-container"
            }`}
            style={
              card.iconFill
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            {card.icon}
          </span>
          <h4
            className={`mt-4 text-3xl font-bold ${
              card.variant === "primary" ? "" : "text-on-surface"
            }`}
          >
            {card.value}
          </h4>
          <p
            className={`text-xs font-medium uppercase tracking-wider mt-1 ${
              card.variant === "primary"
                ? "text-indigo-100"
                : "text-on-surface-variant"
            }`}
          >
            {card.label}
          </p>
        </div>
      ))}
    </section>
  );
}
