import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import JobManagement from './pages/JobManagement';
import ATS from './pages/ATS';
import ExplainableAI from './pages/ExplainableAI';

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed((prev) => !prev)} />
      <main className={`custom-scrollbar h-screen overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-10 max-w-[1600px] mx-auto flex flex-col gap-10 relative">
          {children}
        </div>
      </main>
      
      {/* Background Decorators */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-secondary/5 blur-[150px] rounded-full"></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ATS />} />
          <Route path="/ats" element={<ATS />} />
          <Route path="/job-management" element={<JobManagement />} />
          <Route path="/candidate/:id" element={<ExplainableAI />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
