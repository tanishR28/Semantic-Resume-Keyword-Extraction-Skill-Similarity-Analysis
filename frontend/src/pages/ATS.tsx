import { useEffect, useMemo, useState } from 'react';
import { analyzeResumes, fetchJobs } from '../api';

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

const FALLBACK_PDF = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

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

const ATS = () => {
  const [jobs, setJobs] = useState<Array<{ id: string; title: string; description?: string; weights: any }>>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [apiMode, setApiMode] = useState<'connected' | 'fallback'>('fallback');
  const [apiError, setApiError] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [analysisDone, setAnalysisDone] = useState(false);

  const [results, setResults] = useState<ResumeRecord[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

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
    <div className="relative flex gap-8 min-h-full">
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

        {analysisDone && results.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 xl:col-span-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-4 shadow-sm h-[76vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline font-bold text-base">Ranked Resumes</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Name + Score</span>
              </div>
              <div className="flex flex-col gap-2">
                {results.map((resume) => (
                  <button
                    key={resume.id}
                    onClick={() => setSelectedResumeId(resume.id)}
                    className={`w-full text-left rounded-lg border px-3 py-3 transition-all ${selectedResume?.id === resume.id ? 'border-primary bg-primary/5' : 'border-outline-variant/15 hover:bg-surface-bright'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold truncate">{resume.name}</span>
                      <span className="text-sm font-black text-primary">{resume.score}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-4 shadow-sm h-[76vh]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline font-bold text-base">Resume Viewer</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">PDF</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-outline-variant/20 h-[calc(76vh-56px)] bg-surface">
                <iframe
                  title={`resume-main-${selectedResume?.id ?? 'none'}`}
                  src={(selectedResume?.resume_url || FALLBACK_PDF)}
                  className="w-full h-full"
                />
              </div>
            </div>
          </section>
        )}
      </div>

      <aside className={`w-[420px] shrink-0 hidden xl:flex flex-col gap-6 sticky top-0 h-screen py-2 transition-all duration-200 ${isAnalyzing ? 'blur-xl pointer-events-none select-none saturate-50 opacity-70' : ''}`}>
        {!selectedResume && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 shadow-sm">
            <h4 className="font-headline font-bold">Resume Details</h4>
            <p className="text-sm text-on-surface-variant mt-2">Select a ranked resume to preview PDF and analysis details.</p>
          </div>
        )}

        {selectedResume && (
          <>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-headline font-bold text-lg">Resume Preview</h4>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">PDF Viewer</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-outline-variant/20 h-[280px] bg-surface">
                <iframe
                  title={`resume-${selectedResume.id}`}
                  src={selectedResume.resume_url || FALLBACK_PDF}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5 shadow-sm flex flex-col gap-5">
              <div>
                <h4 className="font-headline font-bold text-lg">{selectedResume.name}</h4>
                <p className="text-sm text-on-surface-variant">{selectedResume.role}</p>
                <p className="text-xs text-on-surface-variant mt-1">{selectedResume.location}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">JD Match Radar</h5>
                  <span className="font-black text-primary">{selectedResume.score}%</span>
                </div>
                <div className="w-full max-w-[300px] mx-auto">
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

                    {['SEMANTIC', 'SKILLS', 'EXP', 'EDU', 'PROJECTS', 'ALIGN'].map((label, i) => {
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
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Semantic</span><span>{toPercent(selectedResume.breakdown.semantic)}</span></div>
                <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Skills</span><span>{toPercent(selectedResume.breakdown.skills)}</span></div>
                <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Experience</span><span>{toPercent(selectedResume.breakdown.experience)}</span></div>
                <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Education</span><span>{toPercent(selectedResume.breakdown.education)}</span></div>
                <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Projects</span><span>{toPercent(selectedResume.breakdown.projects)}</span></div>
                <div className="rounded-md bg-surface-container px-2 py-1 flex justify-between"><span>Alignment</span><span>{toPercent(selectedResume.breakdown.alignment)}</span></div>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Explainable AI</h5>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-bold text-secondary">Strengths</p>
                    <ul className="text-xs text-on-surface-variant list-disc pl-4 mt-1 space-y-1">
                      {(selectedResume.xai_insights?.strengths ?? []).map((item, i) => (
                        <li key={`s-${i}`}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-error">Gaps</p>
                    <ul className="text-xs text-on-surface-variant list-disc pl-4 mt-1 space-y-1">
                      {(selectedResume.xai_insights?.gaps ?? []).map((item, i) => (
                        <li key={`g-${i}`}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-md bg-surface-container px-3 py-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Verdict</p>
                    <p className="text-xs text-on-surface-variant">{selectedResume.xai_insights?.verdict ?? 'Awaiting backend explainability details.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

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
