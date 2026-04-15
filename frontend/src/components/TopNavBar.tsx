"use client";

import { useState } from "react";

interface TopNavBarProps {
  currentView: "jobSpec" | "dashboard";
}

export default function TopNavBar({ currentView }: TopNavBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Show search talent only during dashboard view (candidate review phase)
  const showSearchTalent = currentView === "dashboard";

  return (
    <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center w-full px-8 py-4 border-b border-[#eceef0]">
      <div className="flex items-center gap-4">
        {showSearchTalent && (
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              className="bg-white border-none ring-1 ring-[#c7c4d8]/20 rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-[#3525cd] focus:ring-2 transition-all outline-none"
              placeholder="Search talent..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3"></div>
    </header>
  );
}
