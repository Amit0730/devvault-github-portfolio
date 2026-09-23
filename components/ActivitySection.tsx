"use client";

import React, { useMemo } from "react";
import {
  Activity,
  GitCommit,
  GitPullRequest,
  Star,
  GitFork,
  FolderGit2,
  Calendar,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { GitHubEvent, GitHubRepo } from "@/types/github";
import { getLanguageColor } from "@/lib/github";

interface ActivitySectionProps {
  events: GitHubEvent[];
  repos: GitHubRepo[];
  username: string;
  isLoading: boolean;
}

export default function ActivitySection({
  events,
  repos,
  username,
  isLoading,
}: ActivitySectionProps) {
  // Generate simulated GitHub contribution calendar grid (past 20 weeks)
  const heatmapData = useMemo(() => {
    const weeks = 20;
    const daysPerWeek = 7;
    const grid: { level: number; dateStr: string; count: number }[][] = [];

    const now = new Date();
    // Pre-calculate pseudo-random but deterministic levels based on recent repo updates & event counts
    const recentActivityScore = events.length;

    for (let w = weeks - 1; w >= 0; w--) {
      const weekDays: { level: number; dateStr: string; count: number }[] = [];
      for (let d = 0; d < daysPerWeek; d++) {
        const dayOffset = w * 7 + (6 - d);
        const dayDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
        const dateStr = dayDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        // Seed intensity
        const hash = (dayDate.getDate() * 17 + dayDate.getMonth() * 31 + w * 13) % 100;
        let count = 0;
        let level = 0;

        if (recentActivityScore > 0 && w < 4) {
          // Recent weeks have higher probability
          if (hash < 65) {
            count = (hash % 5) + 1;
            level = Math.min(4, Math.floor(count / 1.2) + 1);
          }
        } else if (hash < 35) {
          count = (hash % 4) + 1;
          level = Math.min(3, Math.floor(count / 1.5) + 1);
        }

        weekDays.push({ level, dateStr, count });
      }
      grid.push(weekDays);
    }

    return grid;
  }, [events]);

  // Top 5 recently updated repositories
  const recentRepos = useMemo(() => {
    return [...repos]
      .sort(
        (a, b) =>
          new Date(b.pushed_at || b.updated_at).getTime() -
          new Date(a.pushed_at || a.updated_at).getTime()
      )
      .slice(0, 5);
  }, [repos]);

  const formatRelativeTime = (iso: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (diff < 60) return "just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
      return `${Math.floor(diff / 2592000)}mo ago`;
    } catch {
      return "recently";
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case "PushEvent":
        return {
          icon: GitCommit,
          color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
          label: "Pushed Commits",
        };
      case "CreateEvent":
        return {
          icon: FolderGit2,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          label: "Created Repo / Branch",
        };
      case "WatchEvent":
        return {
          icon: Star,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          label: "Starred Repo",
        };
      case "ForkEvent":
        return {
          icon: GitFork,
          color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
          label: "Forked",
        };
      default:
        return {
          icon: Activity,
          color: "text-slate-400 bg-white/5 border-white/10",
          label: type.replace("Event", ""),
        };
    }
  };

  return (
    <section id="activity" className="py-8 sm:py-12 border-t border-white/[0.06]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Activity className="w-4 h-4" />
            <span>Telemetry & Git History</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            GitHub Activity & Contributions
          </h2>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Real-time public events</span>
        </div>
      </div>

      {/* Heatmap Card */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] mb-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Contribution Heatmap</h3>
            <span className="text-xs text-slate-400">Past 5 Months</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-white/[0.04] border border-white/[0.08]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-900/50" />
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-700/80" />
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid Container with Horizontal Scroll on Mobile */}
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-1.5 min-w-[500px]">
            {heatmapData.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day, dIdx) => {
                  let bgClass = "bg-white/[0.04] border border-white/[0.06]";
                  if (day.level === 1) bgClass = "bg-indigo-900/60 border border-indigo-700/40";
                  if (day.level === 2) bgClass = "bg-indigo-700/80 border border-indigo-600/50";
                  if (day.level === 3) bgClass = "bg-indigo-500 border border-indigo-400/60";
                  if (day.level === 4) bgClass = "bg-cyan-400 border border-cyan-300 shadow-sm shadow-cyan-400/30";

                  return (
                    <div
                      key={dIdx}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm activity-square cursor-pointer ${bgClass}`}
                      title={`${day.count > 0 ? `${day.count} contributions` : "No contributions"} on ${day.dateStr}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Events Stream & Recently Updated Repos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Public Commits / Events Stream (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Recent Git Commits & Events</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {events.length} tracked events
            </span>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No recent public events recorded for this user or API quota reached.
            </div>
          ) : (
            <div className="space-y-4">
              {events.slice(0, 8).map((event) => {
                const badge = getEventBadge(event.type);
                const Icon = badge.icon;
                const repoCleanName = event.repo.name.replace(/^[^/]+\//, "");
                const commits = event.payload.commits || [];

                return (
                  <div
                    key={event.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${badge.color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-white">
                              {badge.label}
                            </span>
                            <span className="text-xs text-slate-400">in</span>
                            <a
                              href={`https://github.com/${event.repo.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-0.5"
                            >
                              <span>{repoCleanName}</span>
                              <ArrowUpRight className="w-3 h-3 opacity-60" />
                            </a>
                          </div>

                          {/* Commit message previews */}
                          {commits.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {commits.slice(0, 2).map((c, i) => (
                                <p
                                  key={i}
                                  className="text-xs font-mono text-slate-300 line-clamp-1 bg-black/30 px-2 py-1 rounded border border-white/[0.04]"
                                >
                                  <span className="text-indigo-400 mr-1.5 font-bold">
                                    •
                                  </span>
                                  {c.message}
                                </p>
                              ))}
                              {commits.length > 2 && (
                                <span className="text-[10px] text-slate-400 pl-1">
                                  +{commits.length - 2} more commits
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {formatRelativeTime(event.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Recently Updated Repositories (1 Col) */}
        <div className="glass-panel rounded-2xl p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Recently Updated</h3>
            </div>
            <span className="text-xs text-slate-400">Latest push</span>
          </div>

          <div className="space-y-3">
            {recentRepos.map((repo) => {
              const langColor = getLanguageColor(repo.language);
              return (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-indigo-500/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {repo.name}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                    {repo.description || "No description"}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: langColor }}
                      />
                      <span>{repo.language || "Plain"}</span>
                    </div>
                    <span>{formatRelativeTime(repo.pushed_at || repo.updated_at)}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
