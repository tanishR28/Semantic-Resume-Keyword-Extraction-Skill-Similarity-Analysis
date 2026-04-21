import React from 'react';
import { useLocation } from 'react-router-dom';
import { TALENT_DATA } from '../data';

const Header = () => {
  const location = useLocation();
  const currentJob = TALENT_DATA.jobs[0];

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex justify-between items-center h-20 px-10 shadow-[0px_24px_48px_-12px_rgba(99,102,241,0.08)]">
      <div className="flex items-center gap-8">
        {/* Only show search on Candidate/Results/AI pages */}
        {location.pathname !== '/job-management' && location.pathname !== '/' && (
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined text-lg">search</span>
            <input 
              type="text" 
              placeholder="Global search..." 
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-xs w-64 focus:ring-1 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all outline-none" 
            />
          </div>
        )}

        {/* Global Navigation */}
        <nav className="flex gap-6">
          <a href="#" className="text-slate-400 hover:text-indigo-500 font-medium text-sm transition-colors">Analytics</a>
          <a href="#" className="text-slate-400 hover:text-indigo-500 font-medium text-sm transition-colors">Reports</a>
          <a href="#" className="text-slate-400 hover:text-indigo-500 font-medium text-sm transition-colors">Pipelines</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Active Job Context */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-[11px] font-bold font-label tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          {currentJob.title}
        </div>
        
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>

        <button className="px-5 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-md text-xs font-bold tracking-wide hover:translate-y-[-1px] shadow-lg shadow-indigo-200 transition-transform flex items-center gap-2">
          Export
          <span className="material-symbols-outlined text-sm">ios_share</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
