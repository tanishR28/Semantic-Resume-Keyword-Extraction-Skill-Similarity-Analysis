"use client";

import { useState, useCallback } from "react";

interface UploadedFile {
  name: string;
  size: number;
  status: "pending" | "processing" | "complete";
}

interface HeroSectionProps {
  onAnalyze: (files: File[]) => void;
}

export default function HeroSection({ onAnalyze }: HeroSectionProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      const newFiles = files.map((f) => ({
        name: f.name,
        size: f.size,
        status: "pending" as const,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    },
    []
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        const newFiles = files.map((f) => ({
          name: f.name,
          size: f.size,
          status: "pending" as const,
        }));
        setUploadedFiles((prev) => [...prev, ...newFiles]);
      }
    },
    []
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* CTA Card */}
      <div className="lg:col-span-1 bg-surface-container-lowest p-8 rounded-xl ring-1 ring-outline-variant/15 flex flex-col justify-between h-64">
        <div>
          <h2 className="text-2xl font-bold text-on-surface font-[family-name:var(--font-headline)] leading-tight">
            Identify the best talent instantly.
          </h2>
          <p className="text-on-surface-variant mt-2 text-sm">
            Upload resumes to get immediate AI-driven compatibility scores and
            skill gap analysis.
          </p>
        </div>
        <div className="space-y-2 flex flex-col">
          <button
            onClick={() => onAnalyze([])}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            Analyze Resumes
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`lg:col-span-2 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center group transition-all cursor-pointer ${
          isDragging
            ? "border-primary/50 bg-white"
            : "border-outline-variant/30 bg-surface-container-low hover:bg-white hover:border-primary/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload-input")?.click()}
      >
        <input
          id="file-upload-input"
          type="file"
          multiple
          accept=".pdf,.docx,.doc"
          className="hidden"
          onChange={handleFileInput}
        />
        {uploadedFiles.length === 0 ? (
          <>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-3xl">
                cloud_upload
              </span>
            </div>
            <h3 className="text-lg font-bold text-on-surface font-[family-name:var(--font-headline)]">
              Bulk Upload Zone
            </h3>
            <p className="text-on-surface-variant text-sm mt-1 max-w-xs mx-auto">
              Drag and drop candidate resumes (PDF, DOCX) to begin automated
              processing
            </p>
            <span className="mt-4 text-xs font-bold text-primary uppercase tracking-widest">
              Supported up to 50 files
            </span>
          </>
        ) : (
          <div className="w-full space-y-2 max-h-48 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-2 bg-white rounded-lg ring-1 ring-outline-variant/15"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">
                    description
                  </span>
                  <span className="text-sm font-medium text-on-surface truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  {file.status}
                </span>
              </div>
            ))}
            <p className="text-xs text-primary font-bold mt-2">
              + Drop more files or click to add
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
