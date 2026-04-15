"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import JobSpecification from "@/components/JobSpecification";
import CandidateTable from "@/components/CandidateTable";
import StatsGrid from "@/components/StatsGrid";
import SkillsDrawer from "@/components/SkillsDrawer";
import ResumeViewer from "@/components/ResumeViewer";
import { candidates, dashboardStats, Candidate } from "@/lib/mockData";

export default function DashboardPage() {
  // Flow: "jobSpec" (landing) → "dashboard" (after save)
  const [currentView, setCurrentView] = useState<"jobSpec" | "dashboard">("jobSpec");
  const [isEditingJD, setIsEditingJD] = useState(false);
  const [savedJobData, setSavedJobData] = useState<{
    jobDescription: string;
  } | null>(null);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [resumeCandidate, setResumeCandidate] = useState<Candidate | null>(null);

  const handleRowClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDrawerOpen(true);
  };

  const handleViewResume = (candidate: Candidate) => {
    setResumeCandidate(candidate);
    setIsResumeOpen(true);
  };

  const handleShortlist = (candidateId: string) => {
    console.log("Shortlisted candidate:", candidateId);
    // Will connect to backend later
  };

  const handleReject = (candidateId: string) => {
    console.log("Rejected candidate:", candidateId);
    // Will connect to backend later
  };

  const handleAnalyze = (files: File[]) => {
    console.log("Analyzing files:", files);
    // Will connect to backend later
  };

  const handleEditJD = () => {
    setIsEditingJD(true);
  };

  const handleSaveJob = (jobDescription: string) => {
    console.log("Saving job:", { jobDescription });
    setSavedJobData({ jobDescription });
    // Transition to dashboard after saving
    if (currentView === "jobSpec") {
      setCurrentView("dashboard");
    } else {
      // Coming from Edit JD modal
      setIsEditingJD(false);
    }
  };

  return (
    <>
      <Sidebar activeItem="Dashboard" currentView={currentView} onEditJD={handleEditJD} isEditingJD={isEditingJD} />

      <main className="ml-64 flex-1 flex flex-col h-screen overflow-y-auto">
        <TopNavBar currentView={currentView} />

        <div className="p-8 space-y-8">
          {currentView === "jobSpec" && !isEditingJD ? (
            /* Landing: Job Specification Page */
            <JobSpecification onSave={handleSaveJob} initialJobDescription={savedJobData?.jobDescription} />
          ) : (
            /* After Save: Full Dashboard */
            <>
              <HeroSection onAnalyze={handleAnalyze} />

              <CandidateTable
                candidates={candidates}
                onViewResume={handleViewResume}
                onShortlist={handleShortlist}
                onRowClick={handleRowClick}
              />
            </>
          )}
        </div>

        {/* Edit JD Modal Overlay */}
        {isEditingJD && currentView === "dashboard" && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-on-surface">Edit Job Description</h2>
                <button
                  onClick={() => setIsEditingJD(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <JobSpecification onSave={handleSaveJob} initialJobDescription={savedJobData?.jobDescription} />
            </div>
          </div>
        )}
      </main>

      {/* Skills Analysis Drawer */}
      <SkillsDrawer
        candidate={selectedCandidate}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Resume Viewer Modal */}
      <ResumeViewer
        candidate={resumeCandidate}
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        onShortlist={handleShortlist}
        onReject={handleReject}
      />
    </>
  );
}
