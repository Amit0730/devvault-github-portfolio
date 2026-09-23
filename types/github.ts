export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
  } | null;
  topics: string[];
  default_branch: string;
  archived: boolean;
  // Computed / client-side properties
  category?: ProjectCategory;
  isFeatured?: boolean;
}

export interface GitHubEventCommit {
  sha: string;
  message: string;
  url: string;
}

export interface GitHubEventPayload {
  action?: string;
  ref?: string;
  ref_type?: string;
  commits?: GitHubEventCommit[];
  head?: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: GitHubEventPayload;
  public: boolean;
  created_at: string;
}

export interface GitHubCommitDetail {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
      email?: string;
    };
    message: string;
  };
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

export type RepoLanguages = Record<string, number>;

export type ProjectCategory =
  | "All"
  | "AI/ML"
  | "Full Stack"
  | "Frontend"
  | "Backend"
  | "Cybersecurity"
  | "Other";

export type SortOption = "stars" | "updated" | "alphabetical" | "forks";

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  reset: number; // unix timestamp in seconds
}
