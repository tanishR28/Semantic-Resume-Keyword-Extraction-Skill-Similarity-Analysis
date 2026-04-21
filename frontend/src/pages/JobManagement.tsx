import React, { useEffect, useState } from 'react';
import { createJob, fetchJobs } from '../api';
import { TALENT_DATA } from '../data';

const AXES = [
  { key: 'semantic_similarity', label: 'SEMANTIC SIMILARITY' },
  { key: 'skills_match', label: 'SKILLS' },
  { key: 'experience_match', label: 'EXPERIENCE' },
  { key: 'education_match', label: 'EDUCATION' },
  { key: 'projects_relevance', label: 'PROJECTS' },
  { key: 'job_classification', label: 'JOB CLASSIFICATION' },
] as const;

const JobManagement = () => {
  const job = TALENT_DATA.jobs[0];
  const [jobTitle, setJobTitle] = useState(job.title);
  const [jobDescription, setJobDescription] = useState('We are looking for a senior level engineer with deep expertise in distributed systems and cloud infrastructure...');
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [apiMode, setApiMode] = useState<'connected' | 'fallback'>('fallback');
  
  const [weights, setWeights] = useState({
    semantic_similarity: job.weights.semantic_similarity * 100,
    skills_match: job.weights.skills_match * 100,
    experience_match: job.weights.experience_match * 100,
    education_match: job.weights.education_match * 100,
    projects_relevance: job.weights.projects_relevance * 100,
    job_classification: job.weights.job_classification * 100,
  });

  const [activeAxis, setActiveAxis] = useState<keyof typeof weights | null>(null);

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const getAxisPoint = (axisIndex: number, value: number) => {
    const angle = (Math.PI * 2 * axisIndex) / AXES.length - Math.PI / 2;
    const radius = (value / 100) * 36;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    return { x, y };
  };

  const getOuterPoint = (axisIndex: number) => {
    const angle = (Math.PI * 2 * axisIndex) / AXES.length - Math.PI / 2;
    const radius = 40;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    return { x, y };
  };

  const getLabelPoint = (axisIndex: number) => {
    const angle = (Math.PI * 2 * axisIndex) / AXES.length - Math.PI / 2;
    const radius = 48;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    return { x, y };
  };

  const getPolygonPoints = () => {
    return AXES.map((axis, i) => {
      const p = getAxisPoint(i, weights[axis.key]);
      return `${p.x},${p.y}`;
    }).join(' ');
  };

  const updateWeightFromPointer = (clientX: number, clientY: number) => {
    if (!activeAxis) return;
    const svg = document.getElementById('weight-radar-svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const axisIndex = AXES.findIndex((a) => a.key === activeAxis);
    const { x: ox, y: oy } = getOuterPoint(axisIndex);
    const cx = 50;
    const cy = 50;
    const vx = ox - cx;
    const vy = oy - cy;
    const wx = x - cx;
    const wy = y - cy;
    const vv = vx * vx + vy * vy;
    const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / vv));

    handleWeightChange(activeAxis, Math.round(t * 100));
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!activeAxis) return;
    updateWeightFromPointer(e.clientX, e.clientY);
  };

  const onPointerUp = () => {
    setActiveAxis(null);
  };

  useEffect(() => {
    const loadLatestJob = async () => {
      try {
        const jobs = await fetchJobs();
        if (jobs.length > 0) {
          const latest = jobs[0];
          setJobTitle(latest.title);
          setJobDescription(latest.description);
          setWeights({
            semantic_similarity: latest.weights.semantic_similarity * 100,
            skills_match: latest.weights.skills_match * 100,
            experience_match: latest.weights.experience_match * 100,
            education_match: latest.weights.education_match * 100,
            projects_relevance: latest.weights.projects_relevance * 100,
            job_classification: latest.weights.job_classification * 100,
          });
          setApiMode('connected');
        }
      } catch {
        setApiMode('fallback');
      }
    };

    void loadLatestJob();
  }, []);

  const onSaveJob = async () => {
    if (!jobTitle.trim() || jobDescription.trim().length < 20) {
      setSaveStatus('Please provide a valid job title and detailed description.');
      return;
    }

    setIsSaving(true);
    setSaveStatus('Saving job...');

    try {
      await createJob({
        title: jobTitle.trim(),
        description: jobDescription.trim(),
        weights: {
          semantic_similarity: weights.semantic_similarity / 100,
          skills_match: weights.skills_match / 100,
          experience_match: weights.experience_match / 100,
          education_match: weights.education_match / 100,
          projects_relevance: weights.projects_relevance / 100,
          job_classification: weights.job_classification / 100,
        },
      });
      setSaveStatus('Job saved to backend successfully.');
      setApiMode('connected');
    } catch {
      setSaveStatus('Backend unavailable. Job was not persisted.');
      setApiMode('fallback');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 min-h-full">
      {/* Page Header Section */}
      <section className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface">Job Management</h2>
          <p className="text-on-surface-variant font-medium mt-2">Architecting the future of your talent pipeline with AI precision.</p>
        </div>
      </section>

      {/* Bento Layout Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch flex-grow">
        {/* Left: Job Description Form Area */}
        <div className="col-span-1 md:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 flex flex-col gap-6 h-full shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
                Job Description
              </h3>
              <span className="px-3 py-1 rounded-full bg-surface-container-low text-[10px] font-bold font-label uppercase tracking-widest text-on-surface-variant">Lab Input v2.4</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Data Source: {apiMode === 'connected' ? 'Live FastAPI' : 'Local Fallback'}
            </p>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold font-label uppercase tracking-widest text-on-surface-variant/70 px-1">Job Title</label>
              <input
                className="w-full bg-surface-container-low border-none outline-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 text-on-surface font-body text-sm"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter job title"
              />

              <label className="text-[10px] font-bold font-label uppercase tracking-widest text-on-surface-variant/70 px-1">Paste Job Description</label>
              <textarea 
                className="w-full bg-surface-container-low border-none outline-none rounded-lg px-4 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface font-body text-sm leading-relaxed min-h-[340px] resize-none" 
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right: Weight Configuration Panel (The Lab Environment) */}
        <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 flex flex-col gap-8 h-full shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                Weight Synthesis
              </h3>
              <button 
                onClick={() => setWeights({
                  semantic_similarity: 50, skills_match: 50, experience_match: 50, education_match: 50, projects_relevance: 50, job_classification: 50
                })}
                className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
                title="Reset Weights"
              >
                <span className="material-symbols-outlined text-on-surface-variant">refresh</span>
              </button>
            </div>
            
            {/* Interactive Radar Weight Controller */}
            <div className="relative w-full aspect-square flex items-center justify-center radar-grid rounded-full border border-outline-variant/20 p-4 shrink-0 mx-auto max-w-[280px]">
              <svg
                id="weight-radar-svg"
                className="w-full h-full drop-shadow-xl overflow-visible touch-none"
                viewBox="0 0 100 100"
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              >
                {[10, 20, 30, 40].map((r) => (
                  <polygon
                    key={r}
                    points={AXES.map((_, i) => {
                      const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
                      return `${50 + Math.cos(angle) * r},${50 + Math.sin(angle) * r}`;
                    }).join(' ')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-outline-variant/50"
                  />
                ))}

                {AXES.map((axis, i) => {
                  const out = getOuterPoint(i);
                  return (
                    <line
                      key={axis.key}
                      x1={50}
                      y1={50}
                      x2={out.x}
                      y2={out.y}
                      stroke="currentColor"
                      strokeWidth="0.4"
                      className="text-outline-variant/50"
                    />
                  );
                })}

                <polygon
                  points={getPolygonPoints()}
                  fill="rgba(70, 72, 212, 0.22)"
                  stroke="#4648d4"
                  strokeWidth="1.6"
                  className="transition-all duration-150"
                />

                {AXES.map((axis, i) => {
                  const p = getAxisPoint(i, weights[axis.key]);
                  const labelPos = getLabelPoint(i);
                  return (
                    <g key={axis.key}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="2.1"
                        fill="#00b7ff"
                        className="cursor-grab active:cursor-grabbing"
                        onPointerDown={(e) => {
                          e.currentTarget.setPointerCapture(e.pointerId);
                          setActiveAxis(axis.key);
                        }}
                      />
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="3.2"
                        fill="currentColor"
                        className="text-on-surface-variant select-none"
                      >
                        {axis.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold font-label uppercase tracking-widest text-on-surface-variant">
              {AXES.map((axis) => (
                <div key={axis.key} className="flex items-center justify-between rounded-md bg-surface-container-low px-2 py-1">
                  <span>{axis.label}</span>
                  <span className="text-primary">{Math.round(weights[axis.key])}%</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={onSaveJob}
              disabled={isSaving}
              className="w-full mt-4 px-8 py-4 bg-primary text-white font-bold rounded-md hover:shadow-[0px_24px_48px_-12px_rgba(70,72,212,0.3)] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <span className="material-symbols-outlined">save</span>
              {isSaving ? 'Saving...' : 'Save Job Configuration'}
            </button>
            {saveStatus && <p className="text-xs text-on-surface-variant">{saveStatus}</p>}
            
          </div>
        </div>
      </div>

    </div>
  );
};

export default JobManagement;
