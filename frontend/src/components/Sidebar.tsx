import { Link, useLocation } from 'react-router-dom';
import { useATSContext } from '../context/ATSContext';

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { resumeList, selectedResumeId, setSelectedResumeId, analysisDone } = useATSContext();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isATSPage = isActive('/ats') || isActive('/') || isActive('/candidate');
  const showResumeList = isATSPage && analysisDone && resumeList.length > 0 && !collapsed;

  return (
    <aside className={`h-screen fixed left-0 top-0 overflow-y-auto bg-[#f7f9fb] border-r border-slate-200 flex flex-col py-6 px-3 gap-y-6 z-50 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="px-1 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-xl font-bold tracking-tighter text-indigo-600 font-headline uppercase">TalentPulse AI</h1>
        )}
        <button
          onClick={onToggle}
          className="w-9 h-9 rounded-lg hover:bg-white text-slate-600 border border-slate-200 flex items-center justify-center transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-symbols-outlined">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
        </button>
      </div>

      <nav className="flex flex-col gap-y-2 mt-4">
        <Link
          to="/ats"
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 font-headline text-sm rounded-md transition-all duration-300 ${
            isATSPage
              ? 'text-indigo-600 font-bold bg-white shadow-sm'
              : 'text-slate-500 hover:text-indigo-500 hover:bg-white/70'
          }`}
          title="ATS"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isATSPage ? "'FILL' 1" : "'FILL' 0" }}>groups</span>
          {!collapsed && <span>ATS</span>}
        </Link>

        {/* ── Resume list under ATS nav item ── */}
        {showResumeList && (
          <div className="flex flex-col gap-0.5 ml-2 mr-1 max-h-[calc(100vh-380px)] overflow-y-auto custom-scrollbar pr-1">
            <div className="flex items-center justify-between px-3 py-1.5 mb-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Ranked Results</span>
              <span className="text-[9px] font-bold text-slate-400">{resumeList.length}</span>
            </div>
            {resumeList.map((resume, idx) => {
              const active = selectedResumeId === resume.id;
              const scoreColor =
                resume.score >= 80 ? 'text-green-600' :
                resume.score >= 60 ? 'text-amber-500' :
                'text-red-500';
              return (
                <button
                  key={resume.id}
                  onClick={() => setSelectedResumeId(resume.id)}
                  className={`w-full text-left rounded-md px-3 py-2 transition-all duration-150 flex items-center gap-2.5 group ${
                    active
                      ? 'bg-indigo-50 border border-indigo-200 shadow-sm'
                      : 'border border-transparent hover:bg-white hover:border-slate-200'
                  }`}
                  title={`${resume.name} — ${resume.score}%`}
                >
                  {/* Rank number */}
                  <span className={`text-[9px] font-black w-4 text-center shrink-0 ${active ? 'text-indigo-500' : 'text-slate-300'}`}>
                    {idx + 1}
                  </span>
                  {/* Name */}
                  <span className={`text-xs truncate flex-1 ${active ? 'font-bold text-indigo-700' : 'font-medium text-slate-600'}`}>
                    {resume.name}
                  </span>
                  {/* Score */}
                  <span className={`text-xs font-black tabular-nums shrink-0 ${active ? 'text-indigo-600' : scoreColor}`}>
                    {resume.score}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <Link
          to="/job-management"
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 font-headline text-sm rounded-md transition-all duration-300 ${
            isActive('/job-management')
              ? 'text-indigo-600 font-bold bg-white shadow-sm'
              : 'text-slate-500 hover:text-indigo-500 hover:bg-white/70'
          }`}
          title="Job Management"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/job-management') ? "'FILL' 1" : "'FILL' 0" }}>work</span>
          {!collapsed && <span>Job Management</span>}
        </Link>
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-200 flex flex-col gap-y-2">
        <a href="#" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-slate-500 hover:text-indigo-500 hover:bg-white/70 transition-all duration-300 font-headline text-sm`} title="Settings">
          <span className="material-symbols-outlined">settings</span>
          {!collapsed && <span>Settings</span>}
        </a>
        <a href="#" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-slate-500 hover:text-indigo-500 hover:bg-white/70 transition-all duration-300 font-headline text-sm`} title="Help">
          <span className="material-symbols-outlined">help</span>
          {!collapsed && <span>Help</span>}
        </a>
        
        {!collapsed && (
          <div className="mt-6 p-4 rounded-xl bg-surface-container-high/40 flex items-center gap-3 relative overflow-hidden group hover:bg-surface-container-high/60 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Recruiter Admin</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
