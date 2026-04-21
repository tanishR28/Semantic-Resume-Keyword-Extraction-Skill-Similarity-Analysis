import { createContext, useContext, useState, type ReactNode } from 'react';

export type ResumeEntry = {
  id: string;
  name: string;
  score: number;
};

type ATSContextValue = {
  resumeList: ResumeEntry[];
  setResumeList: (list: ResumeEntry[]) => void;
  selectedResumeId: string;
  setSelectedResumeId: (id: string) => void;
  analysisDone: boolean;
  setAnalysisDone: (v: boolean) => void;
};

const ATSContext = createContext<ATSContextValue | null>(null);

export const ATSProvider = ({ children }: { children: ReactNode }) => {
  const [resumeList, setResumeList] = useState<ResumeEntry[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [analysisDone, setAnalysisDone] = useState(false);

  return (
    <ATSContext.Provider value={{ resumeList, setResumeList, selectedResumeId, setSelectedResumeId, analysisDone, setAnalysisDone }}>
      {children}
    </ATSContext.Provider>
  );
};

export const useATSContext = () => {
  const ctx = useContext(ATSContext);
  if (!ctx) throw new Error('useATSContext must be used within ATSProvider');
  return ctx;
};
