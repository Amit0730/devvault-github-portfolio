"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Users,
  Star,
  GitFork,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import { GitHubUser, GitHubRepo } from "@/types/github";

interface ProfileHeroProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  isLoading: boolean;
  onRefresh: () => void;
  onUsernameChange: (username: string) => void;
}

export default function ProfileHero({
  user,
  repos,
  isLoading,
  onRefresh,
  onUsernameChange,
}: ProfileHeroProps) {
  const [inlineUsername, setInlineUsername] = useState("");
  const [isEditingUser, setIsEditingUser] = useState(false);

  // Compute aggregate stats across repos
  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

  // Compute top languages
  const langCount: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) {
      langCount[r.language] = (langCount[r.language] || 0) + 1;
    }
  });
  const topLanguages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([lang]) => lang);

  const formattedJoinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inlineUsername.trim()) {
      onUsernameChange(inlineUsername.trim());
      setIsEditingUser(false);
      setInlineUsername("");
    }
  };

  return (
    <section id="overview" className="relative pt-8 pb-12 sm:pb-16">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/[0.08] relative overflow-hidden shadow-2xl">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left: Avatar & Identity Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar with animated glowing ring */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-[2px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 shadow-xl shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
                <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-slate-900">
                  <Image
                    src={user.avatar_url}
                    alt={user.name || user.login}
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              {/* Online / Active status pulse */}
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#07090e] border-2 border-emerald-500 flex items-center justify-center shadow-lg"
                title="Active GitHub Developer"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {user.name || user.login}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  <GithubIcon className="w-3 h-3" />
                  @{user.login}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>

              {/* Bio */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {user.bio ||
                  "Passionate software engineer and open-source contributor building high-impact web apps, AI systems, and developer infrastructure."}
              </p>

              {/* Meta details: location, blog, joined */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-slate-400">
                {user.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.blog && (
                  <a
                    href={
                      user.blog.startsWith("http")
                        ? user.blog
                        : `https://${user.blog}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-indigo-300 transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="truncate max-w-[200px]">
                      {user.blog.replace(/^https?:\/\//, "")}
                    </span>
                  </a>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Joined {formattedJoinedDate}</span>
                </div>
              </div>

              {/* Top Tech Badges */}
              {topLanguages.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Core Languages:
                  </span>
                  {topLanguages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.05] border border-white/10 text-slate-200"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick Actions & Switch User Form */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-semibold tracking-wide transition-all shadow-sm"
              >
                <GithubIcon className="w-4 h-4 text-indigo-400" />
                View GitHub
              </a>
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-all disabled:opacity-50"
                title="Refresh latest GitHub data"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-400" : ""}`}
                />
              </button>
            </div>

            {/* Quick Switch Username Form */}
            {isEditingUser ? (
              <form
                onSubmit={handleInlineSubmit}
                className="flex items-center gap-1.5 w-full sm:w-auto"
              >
                <input
                  type="text"
                  placeholder="Username..."
                  value={inlineUsername}
                  onChange={(e) => setInlineUsername(e.target.value)}
                  className="px-3 py-1.5 bg-black/60 border border-indigo-500/50 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inlineUsername.trim()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingUser(false)}
                  className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingUser(true)}
                className="text-xs text-slate-400 hover:text-indigo-300 flex items-center justify-end gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Switch to different GitHub profile
              </button>
            )}
          </div>
        </div>

        {/* Bottom Key Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/[0.08]">
          {/* Repositories */}
          <div className="glass-card rounded-xl p-3.5 sm:p-4 border border-white/[0.06]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Public Repos</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {user.public_repos}
            </div>
            <span className="text-[11px] text-slate-400">Total repositories</span>
          </div>

          {/* Stars */}
          <div className="glass-card rounded-xl p-3.5 sm:p-4 border border-white/[0.06]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Stars Earned</span>
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {totalStars}
            </div>
            <span className="text-[11px] text-slate-400">Across all repos</span>
          </div>

          {/* Forks */}
          <div className="glass-card rounded-xl p-3.5 sm:p-4 border border-white/[0.06]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Forks</span>
              <GitFork className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {totalForks}
            </div>
            <span className="text-[11px] text-slate-400">Community forks</span>
          </div>

          {/* Followers */}
          <div className="glass-card rounded-xl p-3.5 sm:p-4 border border-white/[0.06]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Followers</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {user.followers}
            </div>
            <span className="text-[11px] text-slate-400">Following {user.following}</span>
          </div>

          {/* Activity Status */}
          <div className="col-span-2 sm:col-span-1 glass-card rounded-xl p-3.5 sm:p-4 border border-white/[0.06]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Portfolio Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">
              Active
            </div>
            <span className="text-[11px] text-slate-400">Live API sync</span>
          </div>
        </div>
      </div>
    </section>
  );
}
