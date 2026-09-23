"use client";

import React, { useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  FolderGit2,
  XCircle,
  SlidersHorizontal,
} from "lucide-react";
import { GitHubRepo, ProjectCategory, SortOption } from "@/types/github";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
  repos: GitHubRepo[];
  featuredNames: Set<string>;
  activeCategory: ProjectCategory;
  onCategoryChange: (cat: ProjectCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSelectRepo: (repo: GitHubRepo) => void;
  onTogglePin: (repoName: string) => void;
  isLoading: boolean;
}

const CATEGORIES: ProjectCategory[] = [
  "All",
  "AI/ML",
  "Full Stack",
  "Frontend",
  "Backend",
  "Cybersecurity",
  "Other",
];

export default function ProjectGrid({
  repos,
  featuredNames,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onSelectRepo,
  onTogglePin,
  isLoading,
}: ProjectGridProps) {
  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: repos.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== "All") counts[cat] = 0;
    });

    repos.forEach((r) => {
      const cat = r.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return counts;
  }, [repos]);

  // Filtered & Sorted repositories
  const filteredRepos = useMemo(() => {
    let result = [...repos];

    // Filter by Category
    if (activeCategory !== "All") {
      result = result.filter((r) => r.category === activeCategory);
    }

    // Filter by Search Query (name, description, topics, language)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((r) => {
        const nameMatch = r.name.toLowerCase().includes(q);
        const descMatch = (r.description || "").toLowerCase().includes(q);
        const langMatch = (r.language || "").toLowerCase().includes(q);
        const topicMatch = (r.topics || []).some((t) =>
          t.toLowerCase().includes(q)
        );
        return nameMatch || descMatch || langMatch || topicMatch;
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        case "updated":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "forks":
          return (b.forks_count || 0) - (a.forks_count || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [repos, activeCategory, searchQuery, sortBy]);

  return (
    <section id="projects" className="py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Repository Showcase
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse, filter, and inspect open-source projects powered directly by GitHub
          </p>
        </div>

        {/* Counter */}
        <div className="text-xs font-mono text-slate-400 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 shrink-0 self-start md:self-auto">
          Showing <span className="text-indigo-400 font-semibold">{filteredRepos.length}</span> of{" "}
          <span className="text-white font-semibold">{repos.length}</span> repos
        </div>
      </div>

      {/* Control Bar: Category Tabs + Search + Sort */}
      <div className="glass-panel rounded-xl p-4 border border-white/[0.08] mb-8 space-y-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1 hidden sm:block" />
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, description, topic, or language..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-black/40 border border-white/10 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="appearance-none bg-black/40 border border-white/10 rounded-lg px-3 py-2 pr-8 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="stars">Stars (High to Low)</option>
                <option value="updated">Recently Updated</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="forks">Most Forks</option>
              </select>
              <ArrowUpDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content / Skeletons / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-5 border border-white/[0.06] h-60 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-36 h-5 rounded-md skeleton-shimmer" />
                  <div className="w-16 h-4 rounded-full skeleton-shimmer" />
                </div>
                <div className="w-full h-10 rounded-md skeleton-shimmer" />
                <div className="flex gap-2">
                  <div className="w-16 h-4 rounded skeleton-shimmer" />
                  <div className="w-16 h-4 rounded skeleton-shimmer" />
                </div>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex justify-between">
                <div className="w-20 h-4 rounded skeleton-shimmer" />
                <div className="w-16 h-4 rounded skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/[0.08] max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            No Repositories Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6">
            We couldn’t find any repositories matching &quot;{searchQuery}&quot; under the &quot;{activeCategory}&quot; category.
          </p>
          <button
            onClick={() => {
              onCategoryChange("All");
              onSearchChange("");
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRepos.map((repo) => (
            <ProjectCard
              key={repo.id}
              repo={repo}
              isFeatured={featuredNames.has(repo.name)}
              onSelect={onSelectRepo}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      )}
    </section>
  );
}
