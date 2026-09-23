import {
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
  GitHubCommitDetail,
  RepoLanguages,
  ProjectCategory,
  RateLimitInfo,
} from "@/types/github";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Language color mapping matching GitHub's official linguist colors
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Rust: "#dea584",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Java: "#b07219",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  Solidity: "#AA6746",
};

export function getLanguageColor(language: string | null): string {
  if (!language) return "#64748b";
  return LANGUAGE_COLORS[language] || "#38bdf8";
}

// Memory cache for runtime
const memoryCache = new Map<string, { timestamp: number; data: unknown }>();

function getCached<T>(key: string): T | null {
  if (typeof window === "undefined") {
    const item = memoryCache.get(key);
    if (item && Date.now() - item.timestamp < CACHE_TTL_MS) {
      return item.data as T;
    }
    return null;
  }

  // Check window memory cache first
  const mem = memoryCache.get(key);
  if (mem && Date.now() - mem.timestamp < CACHE_TTL_MS) {
    return mem.data as T;
  }

  // Check sessionStorage
  try {
    const raw = sessionStorage.getItem(`devvault_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        memoryCache.set(key, parsed);
        return parsed.data as T;
      }
    }
  } catch {
    // SessionStorage may fail in restricted/private modes
  }

  return null;
}

function setCache<T>(key: string, data: T): void {
  const payload = { timestamp: Date.now(), data };
  memoryCache.set(key, payload);

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(`devvault_${key}`, JSON.stringify(payload));
    } catch {
      // Ignore quota exceeded
    }
  }
}

// Helper to extract rate limit headers
let lastRateLimit: RateLimitInfo = {
  remaining: 60,
  limit: 60,
  reset: Math.floor(Date.now() / 1000) + 3600,
};

export function getRateLimitInfo(): RateLimitInfo {
  return lastRateLimit;
}

function updateRateLimit(res: Response): void {
  const remaining = res.headers.get("x-ratelimit-remaining");
  const limit = res.headers.get("x-ratelimit-limit");
  const reset = res.headers.get("x-ratelimit-reset");

  if (remaining !== null && limit !== null && reset !== null) {
    lastRateLimit = {
      remaining: parseInt(remaining, 10),
      limit: parseInt(limit, 10),
      reset: parseInt(reset, 10),
    };
  }
}

/**
 * Categorize a repository based on topics, language, name, and description
 */
export function categorizeRepository(repo: GitHubRepo): ProjectCategory {
  const text = [
    repo.name,
    repo.description || "",
    ...(repo.topics || []),
    repo.language || "",
  ]
    .join(" ")
    .toLowerCase();

  // AI / ML
  if (
    text.includes("ai") ||
    text.includes("ml") ||
    text.includes("machine-learning") ||
    text.includes("gemini") ||
    text.includes("gpt") ||
    text.includes("llm") ||
    text.includes("deep-learning") ||
    text.includes("clustering") ||
    text.includes("dbscan") ||
    text.includes("nlp") ||
    text.includes("intelligence")
  ) {
    return "AI/ML";
  }

  // Cybersecurity
  if (
    text.includes("cyber") ||
    text.includes("security") ||
    text.includes("phishing") ||
    text.includes("malware") ||
    text.includes("vulnerability") ||
    text.includes("cybershield") ||
    text.includes("auth") ||
    text.includes("firewall")
  ) {
    return "Cybersecurity";
  }

  // Full Stack
  if (
    text.includes("fullstack") ||
    text.includes("full-stack") ||
    text.includes("nextjs") ||
    text.includes("mern") ||
    text.includes("monaco-editor") ||
    (repo.topics &&
      repo.topics.includes("nextjs") &&
      (repo.topics.includes("react") || repo.topics.includes("typescript")))
  ) {
    return "Full Stack";
  }

  // Frontend
  if (
    repo.language === "HTML" ||
    repo.language === "CSS" ||
    text.includes("frontend") ||
    text.includes("ui") ||
    text.includes("tailwind") ||
    text.includes("checklist") ||
    text.includes("clock-app") ||
    text.includes("cv") ||
    text.includes("portfolio")
  ) {
    return "Frontend";
  }

  // Backend
  if (
    repo.language === "Python" ||
    repo.language === "Go" ||
    repo.language === "Java" ||
    repo.language === "Rust" ||
    repo.language === "C++" ||
    text.includes("backend") ||
    text.includes("api") ||
    text.includes("server") ||
    text.includes("database")
  ) {
    return "Backend";
  }

  return "Other";
}

/**
 * Fetch GitHub User Profile
 */
export async function fetchUserProfile(username: string): Promise<GitHubUser> {
  const cacheKey = `user_${username.toLowerCase()}`;
  const cached = getCached<GitHubUser>(cacheKey);
  if (cached) return cached;

  const url = `https://api.github.com/users/${encodeURIComponent(username)}`;
  const res = await fetch(url);
  updateRateLimit(res);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`GitHub user "${username}" was not found.`);
    }
    if (res.status === 403) {
      throw new Error(
        "GitHub API rate limit reached (60 req/hr). Please wait a few moments or try again."
      );
    }
    throw new Error(`Failed to fetch user (${res.status} ${res.statusText})`);
  }

  const data: GitHubUser = await res.json();
  setCache(cacheKey, data);
  return data;
}

/**
 * Fetch Public Repositories for a User
 */
export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const cacheKey = `repos_${username.toLowerCase()}`;
  const cached = getCached<GitHubRepo[]>(cacheKey);
  if (cached) return cached;

  const url = `https://api.github.com/users/${encodeURIComponent(
    username
  )}/repos?per_page=100&sort=updated`;
  const res = await fetch(url);
  updateRateLimit(res);

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error(
        "GitHub API rate limit reached. Displaying cached repository data if available."
      );
    }
    throw new Error(`Failed to fetch repositories (${res.status})`);
  }

  const rawRepos: GitHubRepo[] = await res.json();

  // Enrich repos with category and clean defaults
  const enriched = rawRepos
    .filter((repo) => !repo.fork) // Prioritize original source repos
    .concat(rawRepos.filter((repo) => repo.fork))
    .map((repo) => ({
      ...repo,
      category: categorizeRepository(repo),
    }));

  setCache(cacheKey, enriched);
  return enriched;
}

/**
 * Fetch Recent Public Events / Activity for a User
 */
export async function fetchUserEvents(
  username: string
): Promise<GitHubEvent[]> {
  const cacheKey = `events_${username.toLowerCase()}`;
  const cached = getCached<GitHubEvent[]>(cacheKey);
  if (cached) return cached;

  const url = `https://api.github.com/users/${encodeURIComponent(
    username
  )}/events/public?per_page=30`;
  const res = await fetch(url);
  updateRateLimit(res);

  if (!res.ok) {
    if (res.status === 403) return [];
    return [];
  }

  const events: GitHubEvent[] = await res.json();
  setCache(cacheKey, events);
  return events;
}

/**
 * Fetch Languages Breakdown for a specific repo
 */
export async function fetchRepoLanguages(
  owner: string,
  repo: string
): Promise<RepoLanguages> {
  const cacheKey = `langs_${owner.toLowerCase()}_${repo.toLowerCase()}`;
  const cached = getCached<RepoLanguages>(cacheKey);
  if (cached) return cached;

  const url = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(repo)}/languages`;
  const res = await fetch(url);
  updateRateLimit(res);

  if (!res.ok) return {};

  const langs: RepoLanguages = await res.json();
  setCache(cacheKey, langs);
  return langs;
}

/**
 * Fetch Recent Commits for a specific repo
 */
export async function fetchRepoCommits(
  owner: string,
  repo: string
): Promise<GitHubCommitDetail[]> {
  const cacheKey = `commits_${owner.toLowerCase()}_${repo.toLowerCase()}`;
  const cached = getCached<GitHubCommitDetail[]>(cacheKey);
  if (cached) return cached;

  const url = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(repo)}/commits?per_page=8`;
  const res = await fetch(url);
  updateRateLimit(res);

  if (!res.ok) return [];

  const commits: GitHubCommitDetail[] = await res.json();
  setCache(cacheKey, commits);
  return commits;
}

/**
 * Fetch and decode README content for a repo
 */
export async function fetchRepoReadme(
  owner: string,
  repo: string
): Promise<string | null> {
  const cacheKey = `readme_${owner.toLowerCase()}_${repo.toLowerCase()}`;
  const cached = getCached<string>(cacheKey);
  if (cached !== null) return cached;

  const url = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(repo)}/readme`;
  const res = await fetch(url);
  updateRateLimit(res);

  if (!res.ok) {
    setCache(cacheKey, "");
    return null;
  }

  const data = await res.json();
  if (!data.content) return null;

  try {
    // Base64 decode handles UTF-8 characters safely
    const cleanBase64 = data.content.replace(/\s/g, "");
    const decoded = decodeURIComponent(
      atob(cleanBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    setCache(cacheKey, decoded);
    return decoded;
  } catch {
    try {
      const fallbackDecoded = atob(data.content.replace(/\s/g, ""));
      setCache(cacheKey, fallbackDecoded);
      return fallbackDecoded;
    } catch {
      return null;
    }
  }
}

/**
 * Pre-seeded snapshot for fallback in case of rate limits or offline inspection
 */
export const AMIT0730_FALLBACK_USER: GitHubUser = {
  login: "Amit0730",
  id: 177955021,
  avatar_url: "https://avatars.githubusercontent.com/u/177955021?v=4",
  html_url: "https://github.com/Amit0730",
  name: "Amit Kumar Singh",
  company: null,
  blog: "https://github.com/Amit0730",
  location: "India",
  email: "amitkumarsingh24688@gmail.com",
  bio: "Full Stack Engineer & AI Enthusiast building modern developer tools and intelligent web applications.",
  twitter_username: null,
  public_repos: 13,
  public_gists: 0,
  followers: 1,
  following: 4,
  created_at: "2024-08-09T15:16:42Z",
  updated_at: "2026-09-22T21:22:19Z",
};

export const AMIT0730_FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: "codelens-ai",
    full_name: "Amit0730/codelens-ai",
    private: false,
    html_url: "https://github.com/Amit0730/codelens-ai",
    description:
      "AI-powered code review assistant for detecting bugs, security issues, performance problems, and code-quality improvements.",
    fork: false,
    url: "https://api.github.com/repos/Amit0730/codelens-ai",
    created_at: "2026-09-22T21:20:48Z",
    updated_at: "2026-09-22T21:22:19Z",
    pushed_at: "2026-09-22T21:22:16Z",
    homepage: "https://codelens-ai.vercel.app",
    size: 450,
    stargazers_count: 5,
    watchers_count: 5,
    language: "TypeScript",
    forks_count: 1,
    open_issues_count: 0,
    license: { key: "mit", name: "MIT License", spdx_id: "MIT", url: null },
    topics: [
      "ai",
      "code-review",
      "developer-tools",
      "monaco-editor",
      "nextjs",
      "typescript",
    ],
    default_branch: "main",
    archived: false,
    category: "AI/ML",
  },
  {
    id: 2,
    name: "cybershield-url-analyzer",
    full_name: "Amit0730/cybershield-url-analyzer",
    private: false,
    html_url: "https://github.com/Amit0730/cybershield-url-analyzer",
    description:
      "CyberShield - Instant URL Security & Phishing Risk Intelligence scanner.",
    fork: false,
    url: "https://api.github.com/repos/Amit0730/cybershield-url-analyzer",
    created_at: "2026-09-20T21:26:46Z",
    updated_at: "2026-09-20T21:28:09Z",
    pushed_at: "2026-09-20T21:28:09Z",
    homepage: "https://cybershield-url-analyzer-three.vercel.app",
    size: 320,
    stargazers_count: 4,
    watchers_count: 4,
    language: "TypeScript",
    forks_count: 0,
    open_issues_count: 0,
    license: { key: "mit", name: "MIT License", spdx_id: "MIT", url: null },
    topics: ["cybersecurity", "phishing", "nextjs", "security", "threat-intelligence"],
    default_branch: "main",
    archived: false,
    category: "Cybersecurity",
  },
  {
    id: 3,
    name: "resumeai-analyzer",
    full_name: "Amit0730/resumeai-analyzer",
    private: false,
    html_url: "https://github.com/Amit0730/resumeai-analyzer",
    description:
      "Production-quality modern ATS Resume Analyzer & AI Optimization web application built with Next.js, TypeScript, and Tailwind CSS.",
    fork: false,
    url: "https://api.github.com/repos/Amit0730/resumeai-analyzer",
    created_at: "2026-09-20T21:00:09Z",
    updated_at: "2026-09-20T21:24:07Z",
    pushed_at: "2026-09-20T21:23:54Z",
    homepage: "https://resumeai-analyzer-ten.vercel.app",
    size: 512,
    stargazers_count: 3,
    watchers_count: 3,
    language: "TypeScript",
    forks_count: 0,
    open_issues_count: 0,
    license: { key: "mit", name: "MIT License", spdx_id: "MIT", url: null },
    topics: ["ai", "resume-analyzer", "ats", "nextjs", "career", "productivity"],
    default_branch: "main",
    archived: false,
    category: "AI/ML",
  },
  {
    id: 4,
    name: "studyforge-ai-planner",
    full_name: "Amit0730/studyforge-ai-planner",
    private: false,
    html_url: "https://github.com/Amit0730/studyforge-ai-planner",
    description:
      "AI-powered personalized study planner and curriculum generator built with Next.js and TypeScript.",
    fork: false,
    url: "https://api.github.com/repos/Amit0730/studyforge-ai-planner",
    created_at: "2026-09-22T16:10:28Z",
    updated_at: "2026-09-22T16:10:38Z",
    pushed_at: "2026-09-22T16:10:38Z",
    homepage: null,
    size: 280,
    stargazers_count: 2,
    watchers_count: 2,
    language: "TypeScript",
    forks_count: 0,
    open_issues_count: 0,
    license: null,
    topics: ["ai", "education", "nextjs", "productivity", "react", "study-planner"],
    default_branch: "main",
    archived: false,
    category: "Full Stack",
  },
  {
    id: 5,
    name: "raceplan-f1-strategy-simulator",
    full_name: "Amit0730/raceplan-f1-strategy-simulator",
    private: false,
    html_url: "https://github.com/Amit0730/raceplan-f1-strategy-simulator",
    description:
      "Interactive Formula 1 race strategy simulator with tire degradation curves, pit window calculations, and telemetry built with Next.js.",
    fork: false,
    url: "https://api.github.com/repos/Amit0730/raceplan-f1-strategy-simulator",
    created_at: "2026-09-21T19:53:57Z",
    updated_at: "2026-09-21T19:57:59Z",
    pushed_at: "2026-09-21T19:57:56Z",
    homepage: null,
    size: 340,
    stargazers_count: 2,
    watchers_count: 2,
    language: "TypeScript",
    forks_count: 0,
    open_issues_count: 0,
    license: null,
    topics: ["f1", "formula1", "motorsport", "nextjs", "race-strategy", "simulation"],
    default_branch: "main",
    archived: false,
    category: "Full Stack",
  },
  {
    id: 6,
    name: "minimal-checklist",
    full_name: "Amit0730/minimal-checklist",
    private: false,
    html_url: "https://github.com/Amit0730/minimal-checklist",
    description:
      "A simple minimalist dynamic checklist with sound effects and priority filters built with Next.js and TypeScript.",
    fork: false,
    url: "https://api.github.com/repos/Amit0730/minimal-checklist",
    created_at: "2026-09-21T17:41:32Z",
    updated_at: "2026-09-21T17:41:43Z",
    pushed_at: "2026-09-21T17:41:43Z",
    homepage: null,
    size: 190,
    stargazers_count: 1,
    watchers_count: 1,
    language: "TypeScript",
    forks_count: 0,
    open_issues_count: 0,
    license: null,
    topics: ["checklist", "nextjs", "productivity", "react", "tailwindcss", "todo"],
    default_branch: "main",
    archived: false,
    category: "Frontend",
  },
  {
    id: 7,
    name: "campus-energy-intelligence-and-anomaly-detection",
    full_name: "Amit0730/campus-energy-intelligence-and-anomaly-detection",
    private: false,
    html_url: "https://github.com/Amit0730/campus-energy-intelligence-and-anomaly-detection",
    description:
      "Campus Energy Consumption Intelligence & Anomaly Detection system analyzing IoT power meters for university facilities.",
    fork: false,
    url: "https://api.github.com/repos/Amit0730/campus-energy-intelligence-and-anomaly-detection",
    created_at: "2026-09-11T17:20:00Z",
    updated_at: "2026-09-11T17:26:37Z",
    pushed_at: "2026-09-11T17:26:37Z",
    homepage: "https://campus-energy-intelligence.streamlit.app",
    size: 890,
    stargazers_count: 2,
    watchers_count: 2,
    language: "Python",
    forks_count: 0,
    open_issues_count: 0,
    license: null,
    topics: ["python", "energy", "anomaly-detection", "data-science", "iot"],
    default_branch: "main",
    archived: false,
    category: "Backend",
  },
  {
    id: 8,
    name: "dbscan-disaster-hotspot-intelligence",
    full_name: "Amit0730/dbscan-disaster-hotspot-intelligence",
    private: false,
    html_url: "https://github.com/Amit0730/dbscan-disaster-hotspot-intelligence",
    description:
      "DBSCAN-Based Hotspot Clustering of Drone-Survey Thermal and Visual Signals for Disaster Response Prioritization (SIH26030).",
    fork: false,
    url: "https://api.github.com/repos/Amit0730/dbscan-disaster-hotspot-intelligence",
    created_at: "2026-09-01T17:25:00Z",
    updated_at: "2026-09-01T17:27:09Z",
    pushed_at: "2026-09-01T17:27:09Z",
    homepage: null,
    size: 420,
    stargazers_count: 1,
    watchers_count: 1,
    language: "JavaScript",
    forks_count: 0,
    open_issues_count: 0,
    license: null,
    topics: ["clustering", "drone", "thermal-imaging", "disaster-response"],
    default_branch: "main",
    archived: false,
    category: "AI/ML",
  },
];
