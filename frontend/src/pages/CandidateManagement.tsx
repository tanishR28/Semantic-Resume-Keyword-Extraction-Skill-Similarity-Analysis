import { useNavigate } from 'react-router-dom';
import { TALENT_DATA } from '../data';

const CandidateManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full pb-12">
      {/* Hero Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">Candidate Management</h1>
        <p className="text-on-surface-variant mt-1 font-body">Ingest, analyze, and map talent intelligence across your galactic network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT: Upload & Processing */}
        <div className="col-span-1 md:col-span-8 flex flex-col gap-8">
          
          {/* Upload Zone */}
          <div className="bg-surface-container-lowest p-1 rounded-[1rem] shadow-sm border border-outline-variant/10 relative overflow-hidden">
            <div className="border-2 border-dashed border-outline-variant/40 rounded-[0.75rem] p-10 flex flex-col items-center justify-center bg-surface-bright/50 hover:bg-surface-bright transition-colors group cursor-pointer relative z-10 m-1">
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <span className="material-symbols-outlined text-indigo-600 text-3xl">upload_file</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Ingest Talent Intelligence</h3>
              <p className="text-on-surface-variant text-sm font-body text-center max-w-md">Drag and drop PDF resumes here for automated neural processing. Supports batch uploads up to 50 files.</p>
              <div className="mt-6 flex gap-x-4">
                <button className="px-6 py-2 border border-outline-variant/30 rounded-lg font-headline text-sm font-bold text-primary hover:bg-white bg-surface-container-lowest shadow-sm transition-all">Browse System</button>
                <button className="px-6 py-2 bg-surface-container-high hover:bg-surface-container-high/80 rounded-lg font-headline text-sm font-bold text-on-surface-variant transition-colors">Cloud Import</button>
              </div>
            </div>
          </div>

          {/* Processing State */}
          <div className="bg-surface-container-lowest p-8 rounded-[1rem] shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-x-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(70,72,212,0.6)]"></div>
                <h3 className="font-headline text-lg font-bold">Neural Engine Status</h3>
              </div>
              <span className="font-headline text-xs font-bold tracking-widest text-indigo-600 uppercase bg-primary-fixed/50 px-3 py-1 rounded-full border border-primary/10">Analyzing 12 Resumes...</span>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-headline font-bold text-on-surface-variant/60 uppercase tracking-tighter">
                  <span>Batch Alpha-09 Extraction</span>
                  <span>68% Complete</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{width: '68%'}}></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border border-outline-variant/10">
                  <div className="flex items-center gap-x-3">
                    <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                    <div>
                      <p className="font-headline text-xs font-bold uppercase tracking-tight">NER Extraction</p>
                      <p className="text-[10px] text-on-surface-variant">Entity recognition stable</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-secondary">ACTIVE</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border border-outline-variant/10">
                  <div className="flex items-center gap-x-3">
                    <span className="material-symbols-outlined text-primary-container animate-spin text-[20px]">sync</span>
                    <div>
                      <p className="font-headline text-xs font-bold uppercase tracking-tight">Semantic Mapping</p>
                      <p className="text-[10px] text-on-surface-variant">Contextual alignment...</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">PROCESSING</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Processed Grid */}
          <div>
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="font-headline text-xl font-bold">Recently Processed</h3>
              <button 
                onClick={() => navigate('/results')}
                className="text-primary font-headline text-sm font-bold flex items-center gap-1 hover:underline underline-offset-4"
              >
                View Pipeline Dashboard
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TALENT_DATA.candidates.slice(0, 2).map((cand, idx) => (
                <div key={cand.id} onClick={() => navigate('/results')} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-x-3">
                      <img src={cand.avatar} alt={cand.name} className="w-10 h-10 rounded-lg object-cover ring-1 ring-outline-variant/20" />
                      <div>
                        <h4 className="font-headline font-bold text-sm text-on-surface">{cand.name}</h4>
                        <p className="text-xs text-on-surface-variant truncate max-w-[120px]" title={cand.role}>{cand.role}</p>
                      </div>
                    </div>
                    <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-secondary/10">Matched</span>
                  </div>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
                    {cand.skills.map((skill, i) => (
                      <span key={i} className="bg-surface-container text-on-surface-variant text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-surface-container-low flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-indigo-600" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                      <span className="font-headline font-black text-sm">{cand.score}%</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter ml-1">Suitability</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-medium uppercase">{idx + 2} mins ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Side Stats & Intelligence */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-8">
          {/* Intelligence Card */}
          <div className="bg-primary-container p-6 rounded-[1rem] text-on-primary-container relative overflow-hidden shadow-lg shadow-primary-container/20">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <span className="material-symbols-outlined text-3xl mb-4" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
              <h3 className="font-headline text-xl font-black tracking-tight mb-2">Talent Pulse AI Insights</h3>
              <p className="text-sm font-medium text-white/80 leading-relaxed mb-6">We've identified a 15% increase in high-suitability candidates for your current job context in the last 24 hours.</p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-headline font-bold text-sm tracking-tight active:scale-95 hover:bg-white/90 transition-all shadow-md">
                Generate Market Report
              </button>
            </div>
          </div>

          {/* Active Pipeline Stats */}
          <div className="bg-surface-container-lowest p-6 rounded-[1rem] space-y-6 shadow-sm border border-outline-variant/10">
            <h4 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">Current Pipeline Health</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface-bright rounded-xl border border-outline-variant/5">
                <div className="flex items-center gap-x-3">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-xs font-bold font-headline uppercase text-on-surface-variant">Highly Compatible</span>
                </div>
                <span className="font-headline font-black text-lg">24</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-bright rounded-xl border border-outline-variant/5">
                <div className="flex items-center gap-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary-container"></div>
                  <span className="text-xs font-bold font-headline uppercase text-on-surface-variant">Under Review</span>
                </div>
                <span className="font-headline font-black text-lg">118</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-bright rounded-xl border border-outline-variant/5">
                <div className="flex items-center gap-x-3">
                  <div className="w-2 h-2 rounded-full bg-tertiary-container"></div>
                  <span className="text-xs font-bold font-headline uppercase text-on-surface-variant">Waitlisted</span>
                </div>
                <span className="font-headline font-black text-lg">45</span>
              </div>
            </div>
            
            <div className="p-4 border border-outline-variant/20 rounded-xl bg-surface-bright">
              <div className="flex items-center gap-x-2 mb-2">
                <span className="material-symbols-outlined text-indigo-600 text-sm">trending_up</span>
                <span className="text-[10px] font-bold font-headline uppercase text-indigo-600 tracking-widest">Growth Vector</span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium">Candidate intake speed has increased by 12% since implementing Automated NER.</p>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="flex flex-col gap-y-4">
            <h4 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant px-1">Audit Trail</h4>
            <div className="space-y-5 relative mt-2 pl-2">
              <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-outline-variant/30"></div>
              
              <div className="flex gap-x-4 relative items-start">
                <div className="w-6 h-6 rounded-full bg-surface-container border-2 border-background z-10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-on-surface-variant">cloud_done</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Bulk Ingest Complete</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">42 profiles updated for "Backend Dev"</p>
                </div>
              </div>
              
              <div className="flex gap-x-4 relative items-start">
                <div className="w-6 h-6 rounded-full bg-primary-container border-2 border-background z-10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-white">person_add</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">New Top Match</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Alex Rivera reached 92% alignment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateManagement;
