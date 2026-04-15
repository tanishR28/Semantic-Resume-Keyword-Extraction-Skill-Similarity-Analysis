# Design Specification: AI-Powered Recruitment ATS
## 1. Project Overview
**Name:** Aura ATS (Advanced Talent Scanner)  
**Objective:** A professional web-based dashboard for recruiters to bulk-upload resumes, analyze them using AI, and visualize candidate fit through confidence scores and radar graphs.
---
## 2. Visual Identity & Design System
* **Theme:** Modern SaaS / Corporate Professional / Clean.
* **Color Palette:**
    * **Primary:** `#1E293B` (Slate Blue/Deep Navy) - Sidebar and text.
    * **Accent:** `#4F46E5` (Indigo) - Primary buttons and "Analyze" action.
    * **Success:** `#10B981` (Emerald) - High match scores (80-100%).
    * **Warning:** `#F59E0B` (Amber) - Medium match scores (50-79%).
    * **Background:** `#F8FAFC` (Off-white/Cool Gray) - Page background.
* **Typography:** `Inter` or `Roboto` (Sans-serif). Focus on weight hierarchy (Bold for names, Regular for insights).
---
## 3. Layout Architecture (SPA)
### A. The Global Sidebar
* **Navigation Links:** Dashboard (Active), Job Postings, Talent Pool, Settings.
* **Bottom Section:** Recruiter Profile & Logout.
### B. Header / Action Bar
* **Bulk Upload Zone:** A dashed-border drop-zone at the top. 
    * *Interaction:* On file drop, show a list of file names with "Pending" status.
* **Primary Action:** A large "Analyze Resumes" button with a sparkle (✨) icon.
### C. Candidate Data Grid (The Main View)
A clean table displaying the hardcoded data:
1.  **Candidate Column:** Avatar + Name + Current Role.
2.  **Confidence Score:** A color-coded circular progress ring (SVG).
3.  **Skills Match:** Horizontal list of "Pill" tags (e.g., React, Node.js).
4.  **Quick Actions:** Icons for "View Resume" and "Shortlist".
---
## 4. Key Interactive Components
### I. AI Explainability (Hover Tooltip)
* **Trigger:** Hover over the **Confidence Score**.
* **UI:** A sleek popover with a subtle drop shadow.
* **Content:** * "**Pros:** Strong React background, worked at Tier-1 companies."
    * "**Cons:** Lacks Python experience requested in JD."
    * "**AI Insight:** Candidate's growth trajectory is excellent."
### II. Radar Graph Drawer
* **Trigger:** Clicking on a candidate's row.
* **UI:** A **Slide-over Panel** (Drawer) from the right (width: 400px).
* **Content:**
    * **Header:** Candidate Name & Photo.
    * **Visualization:** A Radar Chart (Spider Chart) showing 5 metrics: Technical Skill, Experience Level, Cultural Fit, Leadership, and Education.
    * **Summary:** A text block: "Overall fit is 92% based on technical overlap."
### III. Resume Viewer
* **UI:** A full-screen Modal.
* **Layout:** * **Left (70%):** PDF viewer (Iframe/Embed).
    * **Right (30%):** "AI Smart Summary" – bullet points of top achievements extracted from the text.
---
## 5. UI/UX States
* **Empty State:** "Upload resumes to begin analysis" illustration.
* **Loading State:** Shimmer/Skeleton screen while clicking "Analyze".
* **Hover State:** Row background changes to light gray (`#F1F5F9`).
---
## 6. Prompt for Google Stitch / Design AI
> "Design a high-fidelity web-based UI for an AI Resume ATS. Style: Clean, professional, SaaS. Palette: Slate Navy, White, and Indigo. Features: 1. A top-section drag-and-drop file uploader. 2. A main data table with circular progress bars for 'Confidence Scores'. 3. An 'AI Explainability' popover that appears on hover over scores. 4. A right-side slide-out drawer containing a Radar Chart for candidate skills. 5. A split-screen resume previewer. Use modern icons and ample white space."