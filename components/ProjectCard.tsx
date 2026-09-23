"use client";

import React from "react";
import {
  ExternalLink,
  Star,
  GitFork,
  Clock,
  Pin,
  Maximize2,
  FolderGit2,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import { GitHubRepo } from "@/types/github";
import { getLanguageColor } from "@/lib/github";

interface ProjectCardProps {
  repo: GitHubRepo;
  isFeatured?: boolean;
  onSelect: (repo: GitHubRepo) => void;
  onTogglePin?: (repoName: string) => void;
}

export default function ProjectCard({
  repo,
  isFeatured = false,
  onSelect,
  onTogglePin,
}: ProjectCardProps) {
  const languageColor = getLanguageColor(repo.language);

  // Format relative updated date
  const formatTimeAgo = (dateString: string) => {
    try {
      const now = new Date();
      const updated = new Date(dateString);
      const diffInSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      if (diffInSeconds < 31536000)
        return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
      return `${Math.floor(diffInSeconds / 31536000)}y ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <article
      onClick={() => onSelect(repo)}
      className={`group relative rounded-xl p-5 flex flex-col justify-between cursor-pointer ${
        isFeatured ? "glass-card-featured" : "glass-card-interactive"
      }`}
    >
      <div>
        {/* Top Header: Title, Category Badge, Pin Button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors truncate">
              {repo.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Category Pill */}
            {repo.category && (
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/10">
                {repo.category}
              </span>
            )}

            {/* Quick Pin Toggle */}
            {onTogglePin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(repo.name);
                }}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  isFeatured
                    ? "text-indigo-400 hover:text-indigo-300 bg-indigo-500/15"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]"
                }`}
                title={isFeatured ? "Unpin from Featured" : "Pin to Featured"}
              >
                <Pin className={`w-3.5 h-3.5 ${isFeatured ? "fill-indigo-400" : ""}`} />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem]">
          {repo.description || "No public description provided for this repository."}
        </p>

        {/* Topics / Tags */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {repo.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.06] group-hover:border-indigo-500/20 group-hover:text-slate-300 transition-colors"
              >
                #{topic}
              </span>
            ))}
            {repo.topics.length > 4 && (
              <span className="text-[10px] font-mono text-slate-500 px-1 py-0.5">
                +{repo.topics.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Metrics & Actions */}
      <div className="pt-3 border-t border-white/[0.06] mt-auto">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
          {/* Language & Updated */}
          <div className="flex items-center gap-3">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: languageColor }}
                />
                <span className="font-medium text-slate-200">{repo.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(repo.updated_at)}</span>
            </div>
          </div>

          {/* Stars & Forks */}
          <div className="flex items-center gap-2.5 font-mono text-[11px]">
            <span
              className="flex items-center gap-1 text-amber-400/90"
              title={`${repo.stargazers_count} stars`}
            >
              <Star className="w-3 h-3 fill-amber-400/30" />
              {repo.stargazers_count}
            </span>
            <span
              className="flex items-center gap-1 text-slate-400"
              title={`${repo.forks_count} forks`}
            >
              <GitFork className="w-3 h-3" />
              {repo.forks_count}
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/[0.04]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(repo);
            }}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Details</span>
          </button>

          <div className="flex items-center gap-2">
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all shadow-sm"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Open GitHub Repository"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
