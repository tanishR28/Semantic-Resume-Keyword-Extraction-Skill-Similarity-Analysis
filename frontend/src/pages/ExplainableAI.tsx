import { useParams, useNavigate } from 'react-router-dom';
import { TALENT_DATA } from '../data';

const ExplainableAI = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Ensure we fall back to the first candidate if ID doesn't match
  const cand = TALENT_DATA.candidates.find(c => c.id === id) || TALENT_DATA.candidates[0];
  const xai = cand.xai_insights ?? {
    strengths: ['No explainable strengths available.'],
    gaps: ['No explainable gaps available.'],
    verdict: 'Explainability details are unavailable for this candidate.',
  };

  return (
    <div className="flex h-full gap-0 -m-10 min-h-[calc(100vh-80px)]">
      {/* Left/Center: PDF Resume Viewer (Mocked) */}
      <section className="flex-1 overflow-y-auto p-10 bg-surface-container-low custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span onClick={() => navigate('/results')} className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors p-2 -ml-2 rounded-full hover:bg-white/50">arrow_back</span>
              <h1 className="font-headline text-2xl font-bold tracking-tight">Candidate Profile View</h1>
            </div>
            <div className="flex gap-3">
              <button className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:bg-surface-bright transition-colors">
                <span className="material-symbols-outlined text-slate-600">zoom_in</span>
              </button>
              <button className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:bg-surface-bright transition-colors">
                <span className="material-symbols-outlined text-slate-600">file_download</span>
              </button>
            </div>
          </div>

          {/* Resume Canvas */}
          <div className="bg-white p-12 shadow-sm rounded-xl min-h-[1100px] relative overflow-hidden border border-outline-variant/20">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-1">{cand.name}</h2>
                <p className="text-indigo-600 font-medium">{cand.role}</p>
              </div>
              <div className="text-right text-sm text-slate-400 leading-relaxed font-body">
                <p>{cand.name.toLowerCase().replace(' ', '.')}@email.com</p>
                <p>+1 (555) 012-3456</p>
                <p>{cand.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-12">
              <div className="col-span-1 border-r border-slate-100 pr-8">
                <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Core Skills</h3>
                <ul className="space-y-2 text-sm text-slate-600 font-body">
                  {cand.skills.map((s, i) => <li key={i}>{s}</li>)}
                  <li>Product Strategy</li>
                  <li>Design Systems</li>
                  <li>Stakeholder Management</li>
                </ul>

                <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400 mt-8 mb-4">Education</h3>
                <p className="text-sm font-bold text-slate-800">State University</p>
                <p className="text-xs text-slate-500">BS Computer Science</p>
              </div>
              
              <div className="col-span-2">
                <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Experience</h3>
                <div className="mb-8">
                  <div className="flex justify-between mb-1">
                    <h4 className="text-sm font-bold text-slate-900">{cand.role}</h4>
                    <span className="text-xs text-slate-400 italic">2019 — Present</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pioneered the architecture of core enterprise systems resulting in a 40% increase in performance. 
                    Managed a cross-functional team and mentored junior engineers. Integrated AI-generative workflows.
                  </p>
                </div>
                
                <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400 mt-12 mb-4">Summary</h3>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "Passionate about creating technical systems that scale. I believe in data-driven design and the power of collaborative problem solving."
                </p>
              </div>
            </div>

            {/* AI Overlay Simulation */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[340px] left-[320px] px-2 py-1 bg-indigo-100/40 border-l-2 border-indigo-600/50 backdrop-blur-[1px] shadow-sm rounded-r-md">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">High Relevance: Technical Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Sidebar: Analysis Panel */}
      <aside className="w-[420px] h-full bg-surface-container-lowest border-l border-outline-variant/10 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 custom-scrollbar overflow-y-auto">
        
        {/* Header Section */}
        <div className="p-8 border-b border-surface-container-low shrink-0">
          <div className="flex items-center gap-4">
            <img src={cand.avatar} alt={cand.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-background shadow-sm" />
            <div>
              <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface">{cand.name}</h2>
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase mt-1 border ${
                cand.integrity === 'Genuine' ? 'bg-secondary-container/30 text-secondary border-secondary/10' :
                cand.integrity === 'Suspicious' ? 'bg-error-container/30 text-error border-error/10' :
                'bg-surface-variant text-on-surface-variant border-outline-variant/20'
              }`}>
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>
                  {cand.integrity === 'Genuine' ? 'verified' : cand.integrity === 'Suspicious' ? 'warning' : 'pending'}
                </span>
                {cand.integrity} Integrity
              </div>
            </div>
          </div>
        </div>

        {/* Section A: Radar & Bars */}
        <div className="p-8 space-y-8 border-b border-surface-container-low">
          <div className="flex items-center gap-6">
            {/* Radar Visualization */}
            <div className="w-32 h-32 relative radar-grid rounded-full border border-outline-variant/20 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <polygon points="48,10 80,30 75,70 48,80 20,70 15,30" fill="rgba(70, 72, 212, 0.15)" stroke="#4648d4" strokeWidth="2"></polygon>
                </svg>
              </div>
              <span className="text-[8px] absolute top-2 font-bold uppercase text-on-surface-variant/50 tracking-widest">Tech</span>
              <span className="text-[8px] absolute bottom-2 font-bold uppercase text-on-surface-variant/50 tracking-widest">Exp</span>
            </div>

            {/* Progress Bars */}
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                  <span>Semantic</span>
                  <span className="text-primary">{cand.breakdown.semantic.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{width: `${cand.breakdown.semantic}%`}}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                  <span>Skills</span>
                  <span className="text-primary">{cand.breakdown.skills.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{width: `${cand.breakdown.skills}%`}}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                  <span>Alignment</span>
                  <span className="text-primary">{cand.breakdown.alignment.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{width: `${cand.breakdown.alignment}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Bars */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-on-surface-variant/70 uppercase">
                <span>Education</span>
                <span>{cand.breakdown.education.toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-on-surface-variant/50 w-[74%]" style={{width: `${cand.breakdown.education}%`}}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-on-surface-variant/70 uppercase">
                <span>Projects</span>
                <span>{cand.breakdown.projects.toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-on-surface-variant/50" style={{width: `${cand.breakdown.projects}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Insight Box */}
        <div className="p-8 flex-grow">
          <div className="glass-panel p-6 rounded-xl border border-outline-variant/20 shadow-md relative overflow-hidden">
            {cand.integrity === 'Suspicious' && (
              <div className="absolute top-0 left-0 w-full bg-error text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest">
                Data Conflict Detected
              </div>
            )}
            <h3 className={`font-headline text-sm font-bold text-on-surface flex items-center gap-2 ${cand.integrity === 'Suspicious' ? 'mb-4 mt-4' : 'mb-6'}`}>
              <span className="material-symbols-outlined text-indigo-600 text-lg">psychology</span>
              Why this Candidate?
            </h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">add_circle</span> Strengths
                </p>
                <ul className="space-y-3">
                  {xai.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0"></span>
                      <span className="leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-2">
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1 ${cand.integrity === 'Suspicious' ? 'text-error' : 'text-tertiary'}`}>
                  <span className="material-symbols-outlined text-[14px]">do_not_disturb_on</span> Potential Gaps
                </p>
                <ul className="space-y-3">
                  {xai.gaps.map((gap, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${cand.integrity === 'Suspicious' ? 'bg-error animate-pulse' : 'bg-tertiary/70'}`}></span>
                      <span className="leading-relaxed">{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-outline-variant/10 mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">AI Verdict</p>
                <p className="text-xs text-on-surface font-medium leading-relaxed bg-surface-container-high/30 p-3 rounded-lg border border-outline-variant/10">
                  {xai.verdict}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section C: Actions */}
        <div className="p-8 bg-surface-container-low shrink-0 space-y-3 mt-auto">
          <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold font-headline text-sm flex items-center justify-center gap-2 hover:shadow-[0_8px_16px_rgba(70,72,212,0.2)] hover:-translate-y-0.5 transition-all duration-300">
            <span className="material-symbols-outlined text-lg">analytics</span>
            Download Analysis Report
          </button>
          <button className="w-full py-4 bg-surface-container-lowest border border-outline-variant/30 text-indigo-600 rounded-xl font-bold font-headline text-sm flex items-center justify-center gap-2 hover:bg-surface-bright transition-colors shadow-sm">
            <span className="material-symbols-outlined text-lg">link</span>
            Compare with LinkedIn Data
          </button>
        </div>
      </aside>
    </div>
  );
};

export default ExplainableAI;
