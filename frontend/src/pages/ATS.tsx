import { useEffect, useMemo, useState, useRef } from 'react';
import { analyzeResumes, fetchJobs } from '../api';
import { useATSContext } from '../context/ATSContext';

type Breakdown = {
  semantic: number;
  skills: number;
  experience: number;
  education: number;
  projects: number;
  alignment: number;
};

type ResumeRecord = {
  id: string;
  name: string;
  score: number;
  integrity: string;
  role: string;
  location: string;
  skills: string[];
  insights: string[];
  breakdown: Breakdown;
  xai_insights?: {
    strengths: string[];
    gaps: string[];
    verdict: string;
  };
  avatar?: string;
  resume_url: string;
  source: 'api' | 'upload';
};

type PipelineStep = {
  key: string;
  label: string;
  icon: string;
};

const PIPELINE_STEPS: PipelineStep[] = [
  { key: 'extract', label: 'Extract PDF Text', icon: 'description' },
  { key: 'ner', label: 'Run NER Structuring', icon: 'psychology' },
  { key: 'classify', label: 'Classify Resume', icon: 'category' },
  { key: 'match', label: 'Compute JD Match Score', icon: 'query_stats' },
//   { key: 'integrity', label: 'Run LinkedIn Integrity Check', icon: 'verified_user' },
  { key: 'xai', label: 'Generate Explainable AI', icon: 'lightbulb' },
];

const FALLBACK_PDF = 'about:blank';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toPercent = (v: number) => `${v.toFixed(0)}%`;

const toPolygonPoints = (breakdown: Breakdown): string => {
  const values = [
    breakdown.semantic,
    breakdown.skills,
    breakdown.experience,
    breakdown.education,
    breakdown.projects,
    breakdown.alignment,
  ];

  return values
    .map((value, i) => {
      const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
      const radius = (Math.max(0, Math.min(100, value)) / 100) * 36;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      return `${x},${y}`;
    })
    .join(' ');
};

const getOuterPoint = (axisIndex: number, total = 6) => {
  const angle = (Math.PI * 2 * axisIndex) / total - Math.PI / 2;
  const radius = 40;
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
  };
};

const getLabelPoint = (axisIndex: number, total = 6) => {
  const angle = (Math.PI * 2 * axisIndex) / total - Math.PI / 2;
  const radius = 48;
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
  };
};

/* ─── Score ring component ─── */
const ScoreRing = ({ score }: { score: number }) => {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-slate-100" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text x="50" y="46" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="800" fill="currentColor" className="text-on-surface">{score}</text>
      <text x="50" y="60" textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="700" className="fill-current text-on-surface-variant" letterSpacing="2">SCORE</text>
    </svg>
  );
};

const ATS = () => {
  const atsCtx = useATSContext();
  const [jobs, setJobs] = useState<Array<{ id: string; title: string; description?: string; weights: any }>>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [apiMode, setApiMode] = useState<'connected' | 'fallback'>('fallback');
  const [apiError, setApiError] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [analysisDone, setLocalAnalysisDone] = useState(false);
  const [analysisDuration, setAnalysisDuration] = useState(0);

  const [results, setResults] = useState<ResumeRecord[]>([]);
  const selectedResumeId = atsCtx.selectedResumeId;
  const setSelectedResumeId = atsCtx.setSelectedResumeId;
  const analysisStartRef = useRef(0);

  // Sync local analysisDone → context
  const setAnalysisDone = (v: boolean) => {
    setLocalAnalysisDone(v);
    atsCtx.setAnalysisDone(v);
  };

  // Sync results → context whenever results change
  useEffect(() => {
    atsCtx.setResumeList(results.map(r => ({ id: r.id, name: r.name, score: r.score })));
  }, [results]);

  const selectedJob = useMemo(() => jobs.find((j) => j.id === selectedJobId), [jobs, selectedJobId]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const remoteJobs = await fetchJobs();
        if (remoteJobs.length > 0) {
          setJobs(remoteJobs as Array<{ id: string; title: string; description?: string; weights: any }>);
          setSelectedJobId(remoteJobs[0].id);
          setApiMode('connected');
          setApiError('');
        } else {
          setApiMode('fallback');
          setApiError('No jobs found in backend. Please create a job first in Job Management.');
        }
      } catch {
        setApiMode('fallback');
        setApiError('Could not connect to backend API. Start FastAPI and MongoDB.');
      }
    };
    void loadJobs();
  }, []);

  const selectedResume = useMemo(
    () => results.find((r) => r.id === selectedResumeId) ?? results[0],
    [results, selectedResumeId]
  );

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeUploadedFile = (name: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const runAnalysis = async () => {
    if (!selectedJob) {
      setApiError('Please select a valid job from backend first.');
      return;
    }
    if (uploadedFiles.length === 0) {
      setApiError('Please upload at least one resume PDF before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisDone(false);
    setActiveStep(-1);
    analysisStartRef.current = Date.now();

    for (let i = 0; i < PIPELINE_STEPS.length; i += 1) {
      setActiveStep(i);
      await sleep(700);
    }

    try {
      const analysis = await analyzeResumes(selectedJob.id, uploadedFiles);
      const fileUrlMap = new Map(uploadedFiles.map((f) => [f.name, URL.createObjectURL(f)]));
      const merged: ResumeRecord[] = analysis.resumes.map((r) => ({
        ...r,
        avatar: '',
        resume_url: fileUrlMap.get(r.resume_url) || fileUrlMap.get(`${r.name}.pdf`) || FALLBACK_PDF,
        source: 'api',
      }));
      setApiMode('connected');
      setApiError('');

      const sorted = merged
        .filter((r) => r.score >= 0)
        .sort((a, b) => b.score - a.score);

      setResults(sorted);
      setSelectedResumeId(sorted[0]?.id ?? '');
      setAnalysisDuration(((Date.now() - analysisStartRef.current) / 1000));
      setAnalysisDone(true);
    } catch {
      setApiMode('fallback');
      setApiError('Analysis API failed. Verify backend server and request payload.');
      setResults([]);
      setSelectedResumeId('');
      setAnalysisDone(false);
    } finally {
      setIsAnalyzing(false);
    }
  };



  return (
    <div className="relative flex flex-col min-h-full">
      {/* ─── PRE-ANALYSIS: Upload Section ─── */}
      <div className={`flex-1 flex flex-col gap-6 pb-10 transition-all duration-200 ${isAnalyzing ? 'blur-xl pointer-events-none select-none saturate-50 opacity-70' : ''}`}>
        {!analysisDone && (
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Select Job</label>
                  <select
                    className="mt-2 w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-sm"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Selected Job Context</p>
                  <p className="text-sm font-bold text-on-surface">{selectedJob?.title ?? 'N/A'}</p>
                  <p className="text-[10px] mt-2 font-bold uppercase tracking-widest text-on-surface-variant">
                    Data Source: {apiMode === 'connected' ? 'Live FastAPI' : 'Local Fallback'}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-2">
                    Job description and weights are sourced from Job Management. ATS analysis uses that saved job config.
                  </p>
                </div>
                {apiError && <p className="text-xs text-error font-medium">{apiError}</p>}
              </div>

              <div className="flex flex-col gap-4">
                <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-6 bg-surface-bright/60">
                  <h3 className="font-headline font-bold text-lg mb-2">Upload Resumes (PDF only)</h3>
                  <p className="text-sm text-on-surface-variant mb-4">No candidate profiles. Upload one or multiple resume PDFs.</p>
                  <label className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-outline-variant/30 text-primary font-bold text-sm cursor-pointer hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined mr-2">upload_file</span>
                    Choose PDFs
                    <input type="file" accept="application/pdf,.pdf" multiple className="hidden" onChange={handleUpload} />
                  </label>

                  <div className="mt-4 flex flex-col gap-2 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                    {uploadedFiles.length === 0 && (
                      <p className="text-xs text-on-surface-variant">No uploaded files yet.</p>
                    )}
                    {uploadedFiles.map((file) => (
                      <div key={file.name} className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-outline-variant/20">
                        <span className="text-xs truncate max-w-[240px]">{file.name}</span>
                        <button
                          onClick={() => removeUploadedFile(file.name)}
                          className="text-xs text-error hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="w-full px-6 py-4 rounded-xl bg-primary text-white font-bold hover:opacity-95 disabled:opacity-50 transition-all"
                >
                  {isAnalyzing ? 'Running Pipeline...' : 'Analyze Resumes'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ─── POST-ANALYSIS: Full-bleed split view ─── */}
        {analysisDone && results.length > 0 && (
          <section className="flex flex-col -mx-10 -mb-10" style={{ minHeight: 'calc(100vh - 40px)' }}>
            <div className="flex flex-1 h-0 min-h-0" style={{ height: 'calc(100vh - 80px)' }}>
              {/* ── LEFT 70%: PDF Preview (edge-to-edge, no box) ── */}
              <div className="flex-[7] flex flex-col min-w-0 bg-[#525659]">
                <iframe
                  key={selectedResume?.id ?? 'empty'}
                  title={`resume-viewer-${selectedResume?.id ?? 'none'}`}
                  src={selectedResume?.resume_url || FALLBACK_PDF}
                  className="w-full flex-1"
                  style={{ border: 'none' }}
                />
              </div>

              {/* ── RIGHT 30%: Analysis panel ── */}
              <aside className="flex-[3] flex flex-col border-l border-outline-variant/15 bg-surface-container-lowest overflow-y-auto custom-scrollbar min-w-[320px] max-w-[440px]">



                {selectedResume && (
                  <>
                    {/* Candidate header + score ring */}
                    <div className="px-5 pt-5 pb-4 border-b border-outline-variant/10">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 shrink-0">
                          <ScoreRing score={selectedResume.score} />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h2 className="font-headline text-lg font-bold tracking-tight text-on-surface truncate">{selectedResume.name}</h2>
                          <p className="text-sm text-on-surface-variant truncate">{selectedResume.role}</p>
                          <p className="text-xs text-on-surface-variant/60 mt-0.5">{selectedResume.location}</p>
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase mt-2 border ${
                            selectedResume.integrity === 'Genuine' ? 'bg-green-50 text-green-700 border-green-200' :
                            selectedResume.integrity === 'Suspicious' ? 'bg-red-50 text-red-600 border-red-200' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 1"}}>
                              {selectedResume.integrity === 'Genuine' ? 'verified' : selectedResume.integrity === 'Suspicious' ? 'warning' : 'pending'}
                            </span>
                            {selectedResume.integrity}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Radar chart */}
                    <div className="px-5 py-4 border-b border-outline-variant/10">
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">JD Match Radar</h5>
                      <div className="w-full max-w-[220px] mx-auto">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {[10, 20, 30, 40].map((r) => (
                            <polygon
                              key={r}
                              points={Array.from({ length: 6 }).map((_, i) => {
                                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                                return `${50 + Math.cos(angle) * r},${50 + Math.sin(angle) * r}`;
                              }).join(' ')}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                              className="text-outline-variant/50"
                            />
                          ))}

                          {Array.from({ length: 6 }).map((_, i) => {
                            const out = getOuterPoint(i, 6);
                            return (
                              <line
                                key={i}
                                x1={50}
                                y1={50}
                                x2={out.x}
                                y2={out.y}
                                stroke="currentColor"
                                strokeWidth="0.45"
                                className="text-outline-variant/40"
                              />
                            );
                          })}

                          <polygon
                            points={toPolygonPoints(selectedResume.breakdown)}
                            fill="rgba(70, 72, 212, 0.2)"
                            stroke="#4648d4"
                            strokeWidth="1.5"
                          />

                          {['SEM', 'SKILL', 'EXP', 'EDU', 'PROJ', 'ALIGN'].map((label, i) => {
                            const p = getLabelPoint(i, 6);
                            return (
                              <text
                                key={label}
                                x={p.x}
                                y={p.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="3"
                                className="fill-current text-on-surface-variant"
                              >
                                {label}
                              </text>
                            );
                          })}
                        </svg>
                      </div>

                      {/* Breakdown grid */}
                      <div className="grid grid-cols-2 gap-1.5 mt-3 text-[10px] font-bold">
                        <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Semantic</span><span>{toPercent(selectedResume.breakdown.semantic)}</span></div>
                        <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Skills</span><span>{toPercent(selectedResume.breakdown.skills)}</span></div>
                        <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Experience</span><span>{toPercent(selectedResume.breakdown.experience)}</span></div>
                        <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Education</span><span>{toPercent(selectedResume.breakdown.education)}</span></div>
                        <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Projects</span><span>{toPercent(selectedResume.breakdown.projects)}</span></div>
                        <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Alignment</span><span>{toPercent(selectedResume.breakdown.alignment)}</span></div>
                      </div>
                    </div>

                    {/* Explainable AI */}
                    <div className="px-5 py-4 flex-1">
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-indigo-500 text-sm">psychology</span>
                        Explainable AI
                      </h5>

                      <div className="space-y-4">
                        {/* Strengths */}
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-green-600 mb-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">add_circle</span> Strengths
                          </p>
                          <ul className="space-y-2">
                            {(selectedResume.xai_insights?.strengths ?? []).map((item, i) => (
                              <li key={`s-${i}`} className="flex items-start gap-2 text-xs text-on-surface-variant leading-relaxed">
                                <span className="w-1 h-1 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Gaps */}
                        <div>
                          <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1 ${selectedResume.integrity === 'Suspicious' ? 'text-red-500' : 'text-amber-500'}`}>
                            <span className="material-symbols-outlined text-[12px]">do_not_disturb_on</span> Gaps
                          </p>
                          <ul className="space-y-2">
                            {(selectedResume.xai_insights?.gaps ?? []).map((item, i) => (
                              <li key={`g-${i}`} className="flex items-start gap-2 text-xs text-on-surface-variant leading-relaxed">
                                <span className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${selectedResume.integrity === 'Suspicious' ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Verdict */}
                        <div className="rounded-lg bg-surface-container-high/30 px-3 py-2.5 border border-outline-variant/10">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">AI Verdict</p>
                          <p className="text-xs text-on-surface leading-relaxed font-medium">
                            {selectedResume.xai_insights?.verdict ?? 'Awaiting backend explainability details.'}
                          </p>
                        </div>
                      </div>

                      {/* Skills tags */}
                      {selectedResume.skills.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedResume.skills.map((skill, i) => (
                              <span key={i} className="bg-primary/5 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-primary/10">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </aside>
            </div>

            {/* ── Bottom bar: Analysis time ── */}
            <div className="flex items-center justify-between px-6 py-3 bg-surface-container-low border-t border-outline-variant/15 shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <span className="text-xs font-medium text-on-surface-variant">
                  Analyzed <strong className="text-on-surface">{results.length} resume{results.length !== 1 ? 's' : ''}</strong> in{' '}
                  <strong className="text-on-surface">{analysisDuration.toFixed(1)}s</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                  Job: {selectedJob?.title ?? 'N/A'}
                </span>
                <button
                  onClick={() => { setAnalysisDone(false); setResults([]); setUploadedFiles([]); setSelectedResumeId(''); atsCtx.setResumeList([]); }}
                  className="text-xs text-primary font-bold hover:underline underline-offset-2 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  New Analysis
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ─── Pipeline loading overlay ─── */}
      {isAnalyzing && (
        <div className="absolute inset-0 z-[60] bg-black/15 backdrop-blur-xl flex items-center justify-center p-6 rounded-2xl">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 shadow-xl">
            <h3 className="font-headline text-lg font-bold mb-1">Analyzing Resumes</h3>
            <p className="text-xs text-on-surface-variant mb-4">{selectedJob?.title ?? 'N/A'}</p>

            <div className="flex flex-col gap-2">
              {PIPELINE_STEPS.map((step, idx) => {
                const completed = idx < activeStep;
                const running = idx === activeStep;
                return (
                  <div key={step.key} className={`flex items-center justify-between rounded-md px-3 py-2 border ${completed ? 'bg-secondary-container/30 border-secondary/30' : running ? 'bg-primary/10 border-primary/30' : 'bg-surface border-outline-variant/20'}`}>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">{completed ? 'check_circle' : running ? 'progress_activity' : step.icon}</span>
                      <span className="text-xs font-medium">{step.label}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {completed ? 'Done' : running ? 'Running' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATS;
