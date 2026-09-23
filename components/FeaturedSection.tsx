"use client";

import React from "react";
import { Sparkles, Pin } from "lucide-react";
import { GitHubRepo } from "@/types/github";
import ProjectCard from "./ProjectCard";

interface FeaturedSectionProps {
  featuredRepos: GitHubRepo[];
  onSelectRepo: (repo: GitHubRepo) => void;
  onTogglePin: (repoName: string) => void;
}

export default function FeaturedSection({
  featuredRepos,
  onSelectRepo,
  onTogglePin,
}: FeaturedSectionProps) {
  if (featuredRepos.length === 0) return null;

  return (
    <section id="featured" className="py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Spotlight & Pinned</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Featured Projects
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Pin className="w-3.5 h-3.5 text-indigo-400" />
          <span>Curated high-impact repositories</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {featuredRepos.map((repo) => (
          <ProjectCard
            key={repo.id}
            repo={repo}
            isFeatured={true}
            onSelect={onSelectRepo}
            onTogglePin={onTogglePin}
          />
        ))}
      </div>
    </section>
  );
}
