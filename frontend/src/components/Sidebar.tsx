"use client";

import { recruiterProfile } from "@/lib/mockData";

interface SidebarProps {
  activeItem?: string;
  currentView?: "jobSpec" | "dashboard";
  onEditJD?: () => void;
  isEditingJD?: boolean;
}

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/" },
];

export default function Sidebar({ activeItem = "Dashboard", currentView = "dashboard", onEditJD, isEditingJD }: SidebarProps) {
  const displayLabel = currentView === "jobSpec" ? "Input JD" : "Dashboard";
  return (
    <aside className="bg-slate-900 h-screen w-64 fixed left-0 top-0 flex flex-col py-6 z-50">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold tracking-tight text-white font-[family-name:var(--font-headline)]">
          Aura ATS
        </h1>
        <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mt-1">
          Intelligent Workspace
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        <a
          href="/"
          className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 text-white bg-indigo-600/20 border-r-4 border-indigo-500 active:scale-[0.98]`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-medium">{displayLabel}</span>
        </a>
        {currentView === "dashboard" && onEditJD && (
          <button
            onClick={onEditJD}
            className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all duration-200"
          >
            <span className="material-symbols-outlined">edit</span>
            <span className="font-medium">Edit JD</span>
          </button>
        )}
      </nav>

      <div className="px-4 mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
          <img
            alt={recruiterProfile.name}
            className="w-8 h-8 rounded-full bg-slate-700 object-cover"
            src={recruiterProfile.avatarUrl}
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              {recruiterProfile.name}
            </span>
            <span className="text-[10px] uppercase tracking-tighter">
              {recruiterProfile.role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
