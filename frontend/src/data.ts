export const TALENT_DATA = {
  jobs: [
    {
      id: "job_001",
      title: "Senior Fullstack Engineer",
      weights: {
        semantic_similarity: 0.3,
        skills_match: 0.25,
        experience_match: 0.15,
        education_match: 0.1,
        projects_relevance: 0.1,
        job_classification: 0.1,
      },
    },
    {
      id: "job_002",
      title: "Senior Product Designer",
      weights: {
        semantic_similarity: 0.4,
        skills_match: 0.3,
        experience_match: 0.1,
        education_match: 0.1,
        projects_relevance: 0.05,
        job_classification: 0.05,
      },
    }
  ],
  candidates: [
    {
      id: "cand_101",
      name: "Alex Rivera",
      score: 92,
      integrity: "Genuine",
      role: "Senior Systems Architect @ CloudScale Inc.",
      location: "SF, CA",
      skills: ["Distributed Systems", "Kubernetes", "Rust"],
      insights: [
        "Strong alignment in React/Node.js ecosystem.",
        "Previous experience at Tier-1 tech companies.",
        "Project portfolio matches JD requirements by 95%.",
      ],
      breakdown: {
        semantic: 37.26,
        skills: 71.43,
        experience: 0.0,
        education: 100.0,
        projects: 36.53,
        alignment: 65.22,
      },
      xai_insights: {
        strengths: [
          "Education Match is perfect; candidate holds the exact Master's degree specified.",
          "High Skills Match (71%) driven by strong proficiency in React and AWS.",
          "Job Classification Alignment suggests the candidate's career trajectory fits this Senior role.",
        ],
        gaps: [
          "Experience Match is 0% because the candidate's past titles (e.g., 'Intern') do not meet the 'Senior' threshold.",
          "Project Relevance is low as listed projects are academic rather than enterprise-scale.",
        ],
        verdict:
          "Strong academic candidate with high technical skill, but lacks the professional seniority required for this specific JD.",
      },
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd-kaQ0pE1R0xtDqin6YvvVZOM3v-WbjLq1Qf1wouVfCPXiOXJ9sw-f97n184gCb7rO1sMjPze4ARth0E8Kxn4IadyXnOwdRz89ga1zZXyOGiWQfSj9qxlINfI9EBmWiqFXhjjtWxCDZgtW1xWoG4WFzuGT-1ah_lkWY_L0MyslK2w_xxhLXQIPwyzdI7Tv6llYi5N_iODj_N6u1gUowQwQsnHd1gjPRmUPtB0DDhYDu60ccO46vIDsT8OHrMAv8nu8Ce6UlFWPk1v",
      resume_url: "mock_path_to_pdf",
    },
    {
      id: "cand_102",
      name: "Sarah Chen",
      score: 88,
      integrity: "Genuine",
      role: "Principal DevOps Lead @ DataNode",
      location: "Austin, TX",
      skills: ["Infrastructure as Code", "AWS/GCP"],
      insights: [
        "exceptional infrastructure reliability track record. High soft-skill score for team leadership."
      ],
      breakdown: {
        semantic: 85.0,
        skills: 90.0,
        experience: 95.0,
        education: 100.0,
        projects: 80.0,
        alignment: 88.0,
      },
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAu8z-MeuDJAxWUaOR488tNkpG9GVi2jMkFtpiJJgjZCcnwNjvrZv6K_6tvKgYdC-eLkUHQoZjMkRIib5pYSnSaeTeaBu1eV71TussD0BLPNraVi64wir1r_Vz_pOrcdrzMEZJ15b0_Oh8dytuaSFXIUd7ddqhygh5yr8LOdgy1MYh1H85WLEPFEZpeVlrNU4yFUZWYCOdaqnXBzW0Wru8eLvF6etoMIRZtlux3Yv9LEPWsCCObQwfPoM5ZkEjrlPT_H21YNDOJbwRx",
      resume_url: "mock_path_to_pdf",
    },
    {
      id: "cand_103",
      name: "Marcus Thorne",
      score: 74,
      integrity: "Pending Verification",
      role: "Infrastructure Engineer @ Stealth AI",
      location: "Remote / London",
      skills: ["Golang", "Terraform"],
      insights: [
        "Rapid growth profile. Strong technical acumen but limited experience in high-scale traffic."
      ],
      breakdown: {
        semantic: 70.0,
        skills: 80.0,
        experience: 60.0,
        education: 100.0,
        projects: 70.0,
        alignment: 65.0,
      },
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiPojxN4F6TB5wgZNO7jp6Zbr5vH2RV5teqaatrxTQYUJ-HfYcFMerwu0bc-4hLgJQFxZvh2ZH-EhTYFDgfcdYZS0oueNXPaO4DMDtW3A7fHDrdyufE7K4ZS_YIuwJeF1xz4JUpsUD2WmcZzYyIMxH9NpunOkMCJHTX3mpsUDPfHEhHiLKA7wzvFONbEHU7tH8cHnkSGhenm2K8a7kX8qkehhunek3Vng4i8MvEN6PvDz-ddNfkrqKtRBzdlny9CvtxXvXGxHoKaQM",
      resume_url: "mock_path_to_pdf",
    },
    {
      id: "cand_104",
      name: "Jordan Smith",
      score: 74,
      integrity: "Suspicious",
      role: "Full Stack Engineer",
      location: "Remote",
      skills: ["React", "Node", "Python"],
      insights: [
        "Skillset matches, but tenure dates overlap across 3 companies.",
        "LinkedIn CSV data contradicts resume graduation year.",
      ],
      breakdown: {
        semantic: 75.0,
        skills: 80.0,
        experience: 40.0,
        education: 60.0,
        projects: 70.0,
        alignment: 50.0,
      },
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDz5do2BIXuCdUZcG1Bm30kyVi2ccHqt578zqwV9mOvKHCKMYlZNLfkdyy7M7sp6yc4eCdb804p6AY_qejQI9lCQ0YjTolj60X4rAE_aYxZxLGHZGvKYtHjwmpDhHEuSho1qft42r2ozw2LxCYCx9NnFgndL9mnrklR53hva8htgYIJr4jkd6D-DQ8ik79QYHSX-1Xh4MPUW7gidef3QFaIBcyzZpngMXPLX-ofn6XeiuRN9Ca6KwKz9MIUxdQPLRNP4psJBLuGcSzP",
      resume_url: "mock_path_to_pdf",
    },
  ],
};
