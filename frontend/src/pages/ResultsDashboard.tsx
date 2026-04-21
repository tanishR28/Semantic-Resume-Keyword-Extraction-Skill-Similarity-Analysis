import { useNavigate } from 'react-router-dom';
import { TALENT_DATA } from '../data';

const ResultsDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-x-10 min-h-full">
      {/* Results Content */}
      <div className="flex-1 flex flex-col gap-y-10">
        
        {/* Overview Stats (Atmospheric Data Grid) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm group hover:translate-y-[-4px] transition-transform duration-500">
            <div className="flex justify-between items-start mb-4">
              <span className="font-headline text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/60 font-bold">System Confidence</span>
              <div className="p-2 bg-primary/5 rounded-lg text-primary">
                <span className="material-symbols-outlined text-sm">bolt</span>
              </div>
            </div>
            <div className="flex items-baseline gap-x-2">
              <h2 className="font-headline text-4xl font-bold tracking-tighter text-on-surface">98.4%</h2>
              <span className="text-secondary text-xs font-bold">+1.2%</span>
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-2">Aggregated reliability score across 4 neural models.</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm hover:translate-y-[-4px] transition-transform duration-500">
            <div className="flex justify-between items-start mb-4">
              <span className="font-headline text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/60 font-bold">Total Scanned</span>
              <div className="p-2 bg-secondary/5 rounded-lg text-secondary">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>groups</span>
              </div>
            </div>
            <div className="flex items-baseline gap-x-2">
              <h2 className="font-headline text-4xl font-bold tracking-tighter text-on-surface">1,402</h2>
              <span className="text-secondary text-xs font-bold">New</span>
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-2">Active candidates processed from LinkedIn and internal ATS.</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm hover:translate-y-[-4px] transition-transform duration-500">
            <div className="flex justify-between items-start mb-4">
              <span className="font-headline text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/60 font-bold">Market Pulse</span>
              <div className="p-2 bg-tertiary/5 rounded-lg text-tertiary">
                <span className="material-symbols-outlined text-sm">trending_up</span>
              </div>
            </div>
            <div className="flex items-baseline gap-x-2">
              <h2 className="font-headline text-4xl font-bold tracking-tighter text-on-surface">Stable</h2>
              <span className="text-on-surface-variant/40 text-xs font-bold">Q4 Index</span>
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-2">Salary expectations for 'Senior Engineering' remain within ±3%.</p>
          </div>
        </section>

        {/* Ranked Feed Header */}
        <div className="flex justify-between items-center px-2">
          <h3 className="font-headline text-lg font-extrabold tracking-tight text-on-surface flex items-center gap-x-3">
            Top Candidates
            <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant">RANKED BY SCORE</span>
          </h3>
          <div className="flex gap-x-4">
            <button className="flex items-center gap-x-2 text-xs font-bold text-on-surface-variant/60 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">tune</span> Filter
            </button>
            <button className="flex items-center gap-x-2 text-xs font-bold text-on-surface-variant/60 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">swap_vert</span> Sort
            </button>
          </div>
        </div>

        {/* Vertical Feed of Candidate Cards */}
        <div className="flex flex-col gap-y-6 pb-20">
          {TALENT_DATA.candidates.map((cand) => (
            <div 
              key={cand.id} 
              onClick={() => navigate(`/candidate/${cand.id}`)}
              className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm group rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-x-8 gap-y-4 hover:bg-surface-bright transition-all duration-300 cursor-pointer"
            >
              {/* Left: Avatar & Badge */}
              <div className="relative shrink-0 hidden md:block">
                <img src={cand.avatar} alt={cand.name} className="w-24 h-24 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ring-4 ring-background" />
                <div className={`absolute -bottom-2 -right-2 ${cand.integrity === 'Genuine' ? 'bg-secondary' : cand.integrity === 'Suspicious' ? 'bg-error' : 'bg-surface-variant'} text-white p-1 rounded-lg shadow-xl`}>
                  <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>
                    {cand.integrity === 'Genuine' ? 'verified' : cand.integrity === 'Suspicious' ? 'warning' : 'pending'}
                  </span>
                </div>
              </div>

              {/* Center: Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-x-4 mb-1">
                  <h4 className="font-headline text-2xl font-bold tracking-tight">{cand.name}</h4>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                    cand.integrity === 'Genuine' ? 'bg-secondary-container/30 text-secondary border-secondary/10' :
                    cand.integrity === 'Suspicious' ? 'bg-error-container/30 text-error border-error/10' :
                    'bg-surface-variant text-on-surface-variant border-surface-dim'
                  }`}>
                    {cand.integrity}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant/70 mb-4 flex items-center gap-x-2">
                  {cand.role.split(' @ ')[0]} @ <span className="font-bold">{cand.role.split(' @ ')[1] || cand.role}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  {cand.location}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cand.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-surface-container rounded-full text-[10px] font-bold text-on-surface-variant font-headline uppercase tracking-tighter">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Insights & Score */}
              <div className="flex items-center gap-x-8 lg:gap-x-12 shrink-0">
                <div className="hidden sm:flex sm:flex-col sm:gap-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">AI Summary</span>
                  <p className="text-xs max-w-[200px] leading-relaxed text-on-surface/80 line-clamp-3">
                    {cand.insights[0]}
                  </p>
                </div>
                
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="36" fill="none" strokeWidth="6" className="text-surface-container stroke-current"></circle>
                    <circle cx="40" cy="40" r="36" fill="none" strokeWidth="6" strokeDasharray="226" strokeDashoffset={226 - (226 * cand.score) / 100} className="text-primary stroke-current transition-all duration-1000"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline text-xl font-black text-on-surface">{cand.score}</span>
                    <span className="text-[8px] font-bold uppercase text-on-surface-variant/50">Score</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Panel: Market Pulse & Context */}
      <aside className="w-80 shrink-0 hidden xl:flex flex-col gap-y-8">
        {/* Contextual Insight Card */}
        <div className="bg-primary p-8 rounded-2xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl" style={{fontVariationSettings: "'FILL' 1"}}>lightbulb</span>
          </div>
          <h5 className="font-headline font-bold text-lg mb-2 relative z-10">Quick Context</h5>
          <p className="text-xs text-primary-fixed/80 leading-relaxed mb-6 relative z-10">
            We found {TALENT_DATA.candidates.length} candidates that matched your criteria perfectly. The market is competitive; average response time is <span className="font-bold text-white">4 hours</span>.
          </p>
          <button className="w-full bg-white text-primary font-bold text-[10px] uppercase tracking-widest py-3 rounded-lg hover:bg-opacity-90 transition-all font-headline">
            Optimize Strategy
          </button>
        </div>

        {/* Market Pulse Bento Section */}
        <div className="bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-2xl flex flex-col gap-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h5 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">Market Pulse</h5>
            <span className="material-symbols-outlined text-on-surface-variant/40 text-sm">more_horiz</span>
          </div>
          
          <div className="space-y-4">
            <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant/5">
              <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">Salary Benchmarking</p>
              <div className="h-12 w-full bg-surface-container rounded-lg overflow-hidden flex items-end px-2 gap-1">
                <div className="flex-1 bg-primary/20 h-[30%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/30 h-[45%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/40 h-[60%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/60 h-[85%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary h-[100%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/60 h-[70%] rounded-t-sm"></div>
                <div className="flex-1 bg-primary/30 h-[40%] rounded-t-sm"></div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold text-on-surface">
                <span>$140k</span>
                <span>$210k</span>
              </div>
            </div>

            <div className="bg-surface-bright p-4 rounded-xl flex items-center justify-between border border-outline-variant/5">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">Hiring Velocity</p>
                <p className="text-sm font-bold mt-1 text-on-surface">High Intensity</p>
              </div>
              <div className="text-error">
                <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>speed</span>
              </div>
            </div>

            <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant/5">
              <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">Skill Demand</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-[9px] font-black uppercase text-on-tertiary-fixed">Kubernetes</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-[9px] font-black uppercase text-on-surface-variant">Go</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-[9px] font-black uppercase text-on-surface-variant">IaC</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-[9px] font-black uppercase text-on-surface-variant">MLOps</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Global Floating Action */}
      <div className="fixed bottom-10 right-10 flex gap-x-4 z-50">
        <button className="bg-surface-container-lowest text-primary p-4 rounded-full shadow-lg hover:-translate-y-1 transition-all border border-outline-variant/20 group">
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">chat_bubble</span>
        </button>
        <button onClick={() => navigate('/job-management')} className="bg-primary text-white flex items-center gap-x-2 px-6 py-4 rounded-full shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all outline-none">
          <span className="material-symbols-outlined">add</span>
          <span className="font-headline font-bold text-sm uppercase tracking-widest">New Search</span>
        </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
