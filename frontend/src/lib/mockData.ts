// Mock data types and data for the Aura ATS dashboard

export interface Candidate {
  id: string;
  name: string;
  role: string;
  location: string;
  email: string;
  linkedin: string;
  website: string;
  avatarUrl: string;
  confidenceScore: number;
  skills: string[];
  appliedDate: string;
  isShortlisted: boolean;
  aiDiagnostic: {
    pros: string;
    cons: string;
    insight: string;
  };
  competencyProfile: {
    technical: number;
    experience: number;
    education: number;
    leadership: number;
    culture: number;
  };
  executiveSummary: string;
  highlights: string[];
  topAchievements: string[];
  skillsHighlight: string[];
  auraInsight: string;
  experience: {
    title: string;
    company: string;
    period: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    school: string;
    period: string;
  }[];
  certifications: string;
}

export interface DashboardStats {
  totalResumesParsed: number;
  highConfidenceMatches: number;
  avgAnalysisTime: string;
  interviewsScheduled: number;
  activeJobs: number;
  applications: number;
  applicationsGrowth: string;
  interviews: number;
  nextInterview: string;
}

export interface PipelineHealth {
  sourcing: number;
  interviewing: number;
}

export const dashboardStats: DashboardStats = {
  totalResumesParsed: 128,
  highConfidenceMatches: 18,
  avgAnalysisTime: "2.4m",
  interviewsScheduled: 5,
  activeJobs: 12,
  applications: 348,
  applicationsGrowth: "+14% this week",
  interviews: 24,
  nextInterview: "Next scheduled: 2:00 PM",
};

export const pipelineHealth: PipelineHealth = {
  sourcing: 45,
  interviewing: 30,
};

export const candidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Senior Frontend Engineer",
    location: "New York, NY",
    email: "sarah.j@example.com",
    linkedin: "linkedin.com/in/sarahjenkins",
    website: "sarahjenkins.design",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuChX9fq65xlI9iRMgy12dExAnlpC0oFl97_3aYWdyTUeVoEU04GQvHiyX3YvHJc3fSrzmsrk5AZFEFgsoxr-OVZt3PjRU8vVR0fR0yu7G1JLDbPSAlkXmC2pEHJAMGDENb3Kh1LzMX4HeGnknofwG_jnVJckV7zfGpRiEc3ZJqBNRU2uzkINLdkAo3o5nWQNcER-PuMi6VkLpg9QqEpTBiVE-ELAC0BUbuuGzOcStdiwSmg52V9NluW-3qyKUL6OIDiaJ0Dt8JQDWF8",
    confidenceScore: 94,
    skills: ["React", "Node.js", "TypeScript", "Tailwind"],
    appliedDate: "2 days ago",
    isShortlisted: false,
    aiDiagnostic: {
      pros: "Strong React, Tier-1 experience.",
      cons: "Lacks Python.",
      insight: "AI Insight: High growth trajectory.",
    },
    competencyProfile: {
      technical: 95,
      experience: 90,
      education: 90,
      leadership: 80,
      culture: 85,
    },
    executiveSummary:
      'Overall fit is 92% based on technical overlap. Candidate demonstrates exceptional proficiency in modern JavaScript frameworks. Cultural alignment is high with previous experience in high-growth startups.',
    highlights: ["TypeScript Expert", "Remote Ready", "Strong Communicator"],
    topAchievements: [
      "Reduced dev cycles by <strong class='text-primary font-bold'>20%</strong> through the implementation of a comprehensive enterprise design system.",
      "Managed UX for platforms reaching <strong class='text-primary font-bold'>1.2M monthly users</strong>, demonstrating high-scale experience.",
      "Directly influenced <strong class='text-primary font-bold'>35% engagement growth</strong> at FinStream via strategic UX overhaul.",
    ],
    skillsHighlight: [
      "Design Systems",
      "B2B SaaS",
      "Leadership",
      "Figma Expert",
      "User Research",
      "Product Strategy",
    ],
    auraInsight:
      '"Sarah demonstrates a rare balance of high-level design leadership and technical system architecture. Her tenure at CloudBase indicates strong stability and growth within complex organizations."',
    experience: [
      {
        title: "Senior Product Designer",
        company: "FinStream Solutions",
        period: "2020 – Present",
        bullets: [
          "Led the design of a B2B wealth management platform, resulting in a 35% increase in user engagement across quarterly active users.",
          "Established a cross-functional design system used by 40+ engineers, reducing front-end development cycles by 20%.",
          "Mentored 3 junior designers and introduced collaborative design sprint methodologies.",
        ],
      },
      {
        title: "Product Designer",
        company: "CloudBase Inc",
        period: "2017 – 2020",
        bullets: [
          "Shipped mobile-first features for cloud storage administration, used by 1.2M monthly active users.",
          "Conducted 50+ user research sessions, translating qualitative insights into product roadmaps.",
          "Collaborated with product managers to define MVP requirements for the 'Teams' feature vertical.",
        ],
      },
    ],
    education: [
      {
        degree: "BFA in Graphic Design",
        school: "Rhode Island School of Design (RISD)",
        period: "2013 – 2017",
      },
    ],
    certifications:
      "Interaction Design, Prototyping (Figma/Protopie), User Research, HTML/CSS, WCAG Accessibility, Typography, Design Leadership, Strategic Planning...",
  },
  {
    id: "2",
    name: "Marcus Chen",
    role: "Full Stack Developer",
    location: "San Francisco, CA",
    email: "marcus.c@example.com",
    linkedin: "linkedin.com/in/marcuschen",
    website: "marcuschen.dev",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoLgRrHnspxnwe-_bpx5eapsOyMlbyTCMpFYbBc6b3cUcQBOQW5mbAQ9oqderoxK2hMpLuGfBf7OB6hW36UjO1DDt1NsUrSdElSgyJLc9Wr8aHmwDGambEqp8uu-GIMYP3p90RtTrUXSmaS9lkbLXxXl_Qw37cecIC-Mxg4ExZJhLbMLLlApWLABBEz2gnmxN3qiBQZF96GH5bX_xVJ8iMuryUuA6QmQxKk3e4tGjmMa8F-3nyM8SQqJg0Lu5kFl01dJfDpp4zJxvf",
    confidenceScore: 82,
    skills: ["Next.js", "GraphQL", "AWS"],
    appliedDate: "3 days ago",
    isShortlisted: false,
    aiDiagnostic: {
      pros: "Strong full-stack experience, cloud expertise.",
      cons: "Limited UI design skills.",
      insight: "AI Insight: Excellent system architecture skills.",
    },
    competencyProfile: {
      technical: 88,
      experience: 82,
      education: 85,
      leadership: 70,
      culture: 78,
    },
    executiveSummary:
      "Overall fit is 82% based on technical overlap. Strong backend capabilities with modern cloud infrastructure. Would benefit from pairing with senior designers.",
    highlights: ["Cloud Expert", "System Architecture", "Fast Learner"],
    topAchievements: [
      "Built microservices architecture handling <strong class='text-primary font-bold'>50K requests/sec</strong> at peak load.",
      "Reduced infrastructure costs by <strong class='text-primary font-bold'>35%</strong> through AWS optimization.",
      "Led migration of legacy monolith to <strong class='text-primary font-bold'>Next.js + GraphQL</strong> stack.",
    ],
    skillsHighlight: [
      "Next.js",
      "GraphQL",
      "AWS",
      "Docker",
      "PostgreSQL",
      "Redis",
    ],
    auraInsight:
      '"Marcus shows strong technical depth particularly in cloud infrastructure and API design. His experience at scale-ups positions him well for senior engineering roles."',
    experience: [
      {
        title: "Senior Full Stack Developer",
        company: "DataFlow Systems",
        period: "2019 – Present",
        bullets: [
          "Designed and implemented microservices architecture using Node.js, GraphQL, and AWS Lambda.",
          "Reduced infrastructure costs by 35% through optimized cloud resource management.",
          "Led a team of 4 developers in migrating legacy systems to modern stack.",
        ],
      },
      {
        title: "Full Stack Developer",
        company: "WebCraft Studios",
        period: "2016 – 2019",
        bullets: [
          "Built responsive web applications using React and Next.js framework.",
          "Implemented CI/CD pipelines reducing deployment time by 60%.",
          "Collaborated with cross-functional teams to deliver 15+ client projects.",
        ],
      },
    ],
    education: [
      {
        degree: "BS in Computer Science",
        school: "UC Berkeley",
        period: "2012 – 2016",
      },
    ],
    certifications:
      "AWS Solutions Architect, Docker, Kubernetes, GraphQL, PostgreSQL, Redis, CI/CD...",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "UX Research Lead",
    location: "Austin, TX",
    email: "emily.r@example.com",
    linkedin: "linkedin.com/in/emilyrodriguez",
    website: "emilyux.com",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ-PSEmnpZnJGtJxBgsU9SOXzRkGeMlDZVRBZasSDRNpJ9Ac4IlH0FktPjE30-LsDz2c-0KDTtVuBvSsZvgdP5gZmFsdOgdkAsJ7wWwvW4-ARaoyyElZBljQVXHwro-66NMbfl-_d6RF58UEpGbZr7d80fzpS0DJD7C-3Q5xj6JWkXafzxi_oUew-8yS8kgEOrODSllo2rjaoXx4dPxydE1cethn6VgppTgFox_zjER6bH6qAi6rDa4R_ogM1d8BZAQjR7CSJUzo7D",
    confidenceScore: 78,
    skills: ["Figma", "User Research", "Data Analysis", "A/B Testing"],
    appliedDate: "5 days ago",
    isShortlisted: false,
    aiDiagnostic: {
      pros: "Deep research methodology knowledge.",
      cons: "Less technical implementation experience.",
      insight: "AI Insight: Strong qualitative analysis background.",
    },
    competencyProfile: {
      technical: 70,
      experience: 85,
      education: 92,
      leadership: 88,
      culture: 90,
    },
    executiveSummary:
      "Strong research leader with extensive experience in qualitative and quantitative methods. Cultural fit is excellent with demonstrated leadership capabilities.",
    highlights: ["Research Expert", "Team Leader", "Data-Driven"],
    topAchievements: [
      "Established research practice that influenced <strong class='text-primary font-bold'>$2M</strong> in product decisions.",
      "Conducted <strong class='text-primary font-bold'>200+</strong> user interviews across 3 product lines.",
      "Increased NPS by <strong class='text-primary font-bold'>15 points</strong> through research-driven UX improvements.",
    ],
    skillsHighlight: [
      "User Research",
      "Figma",
      "Data Analysis",
      "A/B Testing",
      "Workshop Facilitation",
      "Accessibility",
    ],
    auraInsight:
      '"Emily brings a methodical, data-driven approach to UX that complements product strategy. Her leadership experience makes her ideal for building research teams."',
    experience: [
      {
        title: "UX Research Lead",
        company: "InsightTech Corp",
        period: "2020 – Present",
        bullets: [
          "Led UX research team of 5, establishing research practice from ground up.",
          "Conducted 200+ user interviews informing product roadmap decisions.",
          "Implemented A/B testing framework that increased conversion by 23%.",
        ],
      },
    ],
    education: [
      {
        degree: "MA in Human-Computer Interaction",
        school: "Carnegie Mellon University",
        period: "2016 – 2018",
      },
    ],
    certifications:
      "User Research, Figma, Data Analysis, A/B Testing, Workshop Facilitation, WCAG Accessibility...",
  },
  {
    id: "4",
    name: "James Park",
    role: "DevOps Engineer",
    location: "Seattle, WA",
    email: "james.p@example.com",
    linkedin: "linkedin.com/in/jamespark",
    website: "jamespark.dev",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBx_xro_4c_-ZKaaNj650PvEd_2gRcpoazaBrfcI2tCdwwqihg6j8pigV_ep6ZL-Sz5zjnRm-fHa_8DIM7DPuH-qzPafIvx3idAPaEkfdv4p-xnhg_wD4Odhv5Pg-7JefzVyU5rYrE2SoyyIeWdkWm1pZ6Hd9R_4aXl2yr5Fb2gJyMKKeeVKqLyKIA6YudGBiwQGLNkaSLunWIQaLZlBlZJokvoyPBGplrcXSh05tb7uogTFnl-AJ-Phxe6Et0E24zo15-W0IgXmBR9",
    confidenceScore: 71,
    skills: ["Docker", "Kubernetes", "Terraform", "Python"],
    appliedDate: "1 week ago",
    isShortlisted: false,
    aiDiagnostic: {
      pros: "Expert in container orchestration.",
      cons: "Limited frontend experience.",
      insight: "AI Insight: Ideal for infrastructure-heavy roles.",
    },
    competencyProfile: {
      technical: 92,
      experience: 78,
      education: 75,
      leadership: 65,
      culture: 72,
    },
    executiveSummary:
      "Strong infrastructure and DevOps background. Technical skills are top-tier but may need additional mentoring in collaborative team dynamics.",
    highlights: ["Infrastructure Expert", "Automation Specialist", "Security Focused"],
    topAchievements: [
      "Automated deployment pipelines reducing release time by <strong class='text-primary font-bold'>80%</strong>.",
      "Managed infrastructure for <strong class='text-primary font-bold'>99.99%</strong> uptime SLA.",
      "Reduced cloud costs by <strong class='text-primary font-bold'>$500K/year</strong> through optimization.",
    ],
    skillsHighlight: [
      "Docker",
      "Kubernetes",
      "Terraform",
      "Python",
      "CI/CD",
      "Security",
    ],
    auraInsight:
      '"James has deep infrastructure expertise and a security-first mindset. Best suited for senior DevOps or platform engineering roles."',
    experience: [
      {
        title: "Senior DevOps Engineer",
        company: "CloudScale Inc",
        period: "2019 – Present",
        bullets: [
          "Managed Kubernetes clusters handling 10K+ pods across multiple regions.",
          "Implemented GitOps workflow reducing deployment failures by 90%.",
          "Led security audit and compliance initiatives for SOC2 certification.",
        ],
      },
    ],
    education: [
      {
        degree: "BS in Information Systems",
        school: "University of Washington",
        period: "2013 – 2017",
      },
    ],
    certifications:
      "Docker, Kubernetes, Terraform, AWS, GCP, Python, CI/CD, SOC2 Compliance...",
  },
];

export const recruiterProfile = {
  name: "Alex Rivera",
  role: "Recruiter Profile",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDyuOOVjACWiPrVC2e0ZPJo5ZyU9U_AS7Z6KkXnq8D2DHnhlhOpleslIvxTstIQ1vTSzk-srRMAr_MBitMxb221e0XppHG2cWqjAHBxEgpHHgQJdzWnZc4PfLCQ_ST6AmECRjLX1OJODB6hqPcZjdHnniXEe9v3Gm019aEo83jNKjr6dnVvMd3M0TKeaRPQhpf1Rt2Mq1QSZ3FajZX_PG28j7rjiud7qo0WOthOM20PqufoVirW_F48AsRF3lmMkqkQTefUrvJ0Fwwx",
};
