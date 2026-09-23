"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  X,
  ExternalLink,
  Star,
  GitFork,
  Eye,
  AlertCircle,
  Calendar,
  Clock,
  BookOpen,
  GitCommit,
  Copy,
  Check,
  Code2,
  FileText,
  Shield,
  Tag,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import {
  GitHubRepo,
  RepoLanguages,
  GitHubCommitDetail,
} from "@/types/github";
import {
  fetchRepoReadme,
  fetchRepoLanguages,
  fetchRepoCommits,
  getLanguageColor,
} from "@/lib/github";

interface ProjectModalProps {
  repo: GitHubRepo | null;
  onClose: () => void;
}

export default function ProjectModal({ repo, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "readme" | "commits">(
    "overview"
  );
  const [readme, setReadme] = useState<string | null>(null);
  const [languages, setLanguages] = useState<RepoLanguages>({});
  const [commits, setCommits] = useState<GitHubCommitDetail[]>([]);
  const [isLoadingReadme, setIsLoadingReadme] = useState(false);
  const [isLoadingLangs, setIsLoadingLangs] = useState(false);
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Fetch detailed info when repo changes
  useEffect(() => {
    if (!repo) return;

    setActiveTab("overview");
    const [owner, name] = repo.full_name
      ? repo.full_name.split("/")
      : ["Amit0730", repo.name];

    // Fetch Readme
    setIsLoadingReadme(true);
    fetchRepoReadme(owner, name)
      .then((data) => setReadme(data))
      .catch(() => setReadme(null))
      .finally(() => setIsLoadingReadme(false));

    // Fetch Languages
    setIsLoadingLangs(true);
    fetchRepoLanguages(owner, name)
      .then((data) => setLanguages(data))
      .catch(() => setLanguages({}))
      .finally(() => setIsLoadingLangs(false));

    // Fetch Commits
    setIsLoadingCommits(true);
    fetchRepoCommits(owner, name)
      .then((data) => setCommits(data))
      .catch(() => setCommits([]))
      .finally(() => setIsLoadingCommits(false));
  }, [repo]);

  if (!repo) return null;

  // Language percentage calculation
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const languageList = Object.entries(languages).map(([lang, bytes]) => ({
    name: lang,
    bytes,
    percentage: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : "0",
    color: getLanguageColor(lang),
  }));

  const copyCloneCommand = () => {
    navigator.clipboard.writeText(`git clone ${repo.html_url}.git`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden bg-[#090d16]/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                {repo.name}
              </h2>
              {repo.category && (
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {repo.category}
                </span>
              )}
              {repo.archived && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Archived
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
              {repo.description || "No description provided."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-white/[0.08] bg-black/20 text-xs font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "overview"
                ? "border-indigo-500 text-white font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Overview & Stats</span>
          </button>
          <button
            onClick={() => setActiveTab("readme")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "readme"
                ? "border-indigo-500 text-white font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>README Preview</span>
            {readme && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("commits")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "commits"
                ? "border-indigo-500 text-white font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Recent Commits</span>
            {commits.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
                {commits.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Action Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Repository Quick Access
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs sm:max-w-md">
                      {repo.html_url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Launch Live Demo</span>
                    </a>
                  )}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/10 transition-all"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>View on GitHub</span>
                  </a>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-card p-3 rounded-xl border border-white/[0.06]">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs">Stars</span>
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-lg font-bold text-white font-mono">
                    {repo.stargazers_count}
                  </div>
                </div>
                <div className="glass-card p-3 rounded-xl border border-white/[0.06]">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs">Forks</span>
                    <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-lg font-bold text-white font-mono">
                    {repo.forks_count}
                  </div>
                </div>
                <div className="glass-card p-3 rounded-xl border border-white/[0.06]">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs">Watchers</span>
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-lg font-bold text-white font-mono">
                    {repo.watchers_count}
                  </div>
                </div>
                <div className="glass-card p-3 rounded-xl border border-white/[0.06]">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs">Open Issues</span>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="text-lg font-bold text-white font-mono">
                    {repo.open_issues_count}
                  </div>
                </div>
              </div>

              {/* Language Distribution Breakdown */}
              <div className="glass-panel p-4 rounded-xl border border-white/[0.08] space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Languages Breakdown</span>
                </h4>

                {isLoadingLangs ? (
                  <div className="w-full h-3 rounded-full skeleton-shimmer" />
                ) : languageList.length > 0 ? (
                  <div className="space-y-3">
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-white/[0.05]">
                      {languageList.map((l) => (
                        <div
                          key={l.name}
                          style={{
                            width: `${l.percentage}%`,
                            backgroundColor: l.color,
                          }}
                          className="h-full transition-all"
                          title={`${l.name}: ${l.percentage}%`}
                        />
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                      {languageList.map((l) => (
                        <div key={l.name} className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: l.color }}
                          />
                          <span className="font-medium text-slate-200">
                            {l.name}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            {l.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Primary: {repo.language || "Not specified"}
                  </p>
                )}
              </div>

              {/* Topics */}
              {repo.topics && repo.topics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Repository Topics</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {repo.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.05] border border-white/10 text-slate-200"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Git Clone Box */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400">
                  Clone with Git
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-slate-300">
                  <span className="truncate mr-2">
                    git clone {repo.html_url}.git
                  </span>
                  <button
                    onClick={copyCloneCommand}
                    className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                    title="Copy command"
                  >
                    {copiedClone ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Metadata Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/[0.06] text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Created: {formatDate(repo.created_at)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Updated: {formatDate(repo.updated_at)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>License: {repo.license?.name || "None"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "readme" && (
            <div>
              {isLoadingReadme ? (
                <div className="space-y-3 py-6">
                  <div className="w-48 h-6 rounded skeleton-shimmer" />
                  <div className="w-full h-16 rounded skeleton-shimmer" />
                  <div className="w-3/4 h-24 rounded skeleton-shimmer" />
                </div>
              ) : readme ? (
                <div className="markdown-body p-4 rounded-xl bg-black/30 border border-white/[0.06] overflow-x-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {readme}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p>No README.md file found in default branch.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "commits" && (
            <div>
              {isLoadingCommits ? (
                <div className="space-y-2 py-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-14 rounded-lg skeleton-shimmer"
                    />
                  ))}
                </div>
              ) : commits.length > 0 ? (
                <div className="space-y-2.5">
                  {commits.map((c) => (
                    <div
                      key={c.sha}
                      className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <p className="font-mono text-slate-200 line-clamp-1">
                          {c.commit.message}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{c.commit.author.name}</span>
                          <span>•</span>
                          <span>
                            {new Date(c.commit.author.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <a
                        href={c.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded bg-black/40 hover:bg-white/10 font-mono text-[11px] text-indigo-400 hover:text-indigo-300 border border-white/10 shrink-0"
                      >
                        {c.sha.slice(0, 7)}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No recent commit history retrieved.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-white/[0.08] bg-black/40 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-mono">
            Default Branch: {repo.default_branch || "main"}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
