export type WeightConfig = {
  semantic_similarity: number;
  skills_match: number;
  experience_match: number;
  education_match: number;
  projects_relevance: number;
  job_classification: number;
};

export type JobPayload = {
  title: string;
  description: string;
  weights: WeightConfig;
};

export type JobResponse = JobPayload & { id: string };

export type ResumeApiRecord = {
  id: string;
  name: string;
  score: number;
  integrity: string;
  role: string;
  location: string;
  skills: string[];
  insights: string[];
  breakdown: {
    semantic: number;
    skills: number;
    experience: number;
    education: number;
    projects: number;
    alignment: number;
  };
  xai_insights: {
    strengths: string[];
    gaps: string[];
    verdict: string;
  };
  resume_url: string;
  source: string;
};

export type AnalysisResponse = {
  job_id: string;
  resumes: ResumeApiRecord[];
};

export type StoredResumeAnalysis = {
  file_id: string;
  original_filename: string;
  analysis: ResumeApiRecord;
};

export type AnalysisRunRecord = {
  id: string;
  job_id: string;
  created_at: string;
  resumes: StoredResumeAnalysis[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchJobs(): Promise<JobResponse[]> {
  const res = await fetch(`${API_BASE_URL}/api/jobs`);
  return parseJson<JobResponse[]>(res);
}

export async function createJob(payload: JobPayload): Promise<JobResponse> {
  const res = await fetch(`${API_BASE_URL}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseJson<JobResponse>(res);
}

export async function analyzeResumes(jobId: string, files: File[]): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('job_id', jobId);
  files.forEach((f) => formData.append('files', f));

  const res = await fetch(`${API_BASE_URL}/api/analysis/run`, {
    method: 'POST',
    body: formData,
  });

  return parseJson<AnalysisResponse>(res);
}

export async function fetchJobAnalysisHistory(jobId: string): Promise<AnalysisRunRecord[]> {
  const res = await fetch(`${API_BASE_URL}/api/analysis/history/${jobId}`);
  return parseJson<AnalysisRunRecord[]>(res);
}

export function getStoredResumePdfUrl(fileId: string): string {
  return `${API_BASE_URL}/api/analysis/resume/${fileId}`;
}
