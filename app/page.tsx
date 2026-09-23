"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
  ProjectCategory,
  SortOption,
  RateLimitInfo,
} from "@/types/github";
import {
  fetchUserProfile,
  fetchUserRepos,
  fetchUserEvents,
  getRateLimitInfo,
  AMIT0730_FALLBACK_USER,
  AMIT0730_FALLBACK_REPOS,
} from "@/lib/github";
import AmbientBackground from "@/components/AmbientBackground";
import Navbar from "@/components/Navbar";
import ProfileHero from "@/components/ProfileHero";
import FeaturedSection from "@/components/FeaturedSection";
import ProjectGrid from "@/components/ProjectGrid";
import ActivitySection from "@/components/ActivitySection";
import ProjectModal from "@/components/ProjectModal";
import Footer from "@/components/Footer";
import { AlertTriangle, RefreshCw } from "lucide-react";

const DEFAULT_USERNAME = "Amit0730";
const INITIAL_FEATURED = [
  "codelens-ai",
  "cybershield-url-analyzer",
  "resumeai-analyzer",
  "raceplan-f1-strategy-simulator",
  "studyforge-ai-planner",
];

export default function Home() {
  const [username, setUsername] = useState<string>(DEFAULT_USERNAME);
  const [user, setUser] = useState<GitHubUser>(AMIT0730_FALLBACK_USER);
  const [repos, setRepos] = useState<GitHubRepo[]>(AMIT0730_FALLBACK_REPOS);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({
    remaining: 60,
    limit: 60,
    reset: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);

  // Local interactive pinned featured repos with lazy state initializer
  const [featuredNames, setFeaturedNames] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("devvault_featured");
        if (stored) {
          const arr = JSON.parse(stored);
          if (Array.isArray(arr) && arr.length > 0) {
            return new Set(arr);
          }
        }
      } catch {
        // Ignore localStorage error
      }
    }
    return new Set(INITIAL_FEATURED);
  });

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("updated");

  // Selected project for modal
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  // Toggle pin
  const handleTogglePin = useCallback((repoName: string) => {
    setFeaturedNames((prev) => {
      const next = new Set(prev);
      if (next.has(repoName)) {
        next.delete(repoName);
      } else {
        next.add(repoName);
      }
      try {
        localStorage.setItem(
          "devvault_featured",
          JSON.stringify(Array.from(next))
        );
      } catch {
        // Ignore storage issues
      }
      return next;
    });
  }, []);

  // Fetch all data for current username
  const loadPortfolioData = useCallback(async (targetUser: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Fetch user profile & repos concurrently
      const [fetchedUser, fetchedRepos] = await Promise.all([
        fetchUserProfile(targetUser),
        fetchUserRepos(targetUser),
      ]);

      setUser(fetchedUser);
      setRepos(fetchedRepos);
      setIsUsingFallback(false);

      // Fetch public events (non-critical, fail gracefully)
      fetchUserEvents(targetUser)
        .then((fetchedEvents) => setEvents(fetchedEvents))
        .catch(() => setEvents([]));

      setRateLimit(getRateLimitInfo());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load GitHub data.";
      setErrorMessage(msg);

      // If it's the default user and request failed, fallback gracefully to snapshot
      if (targetUser.toLowerCase() === DEFAULT_USERNAME.toLowerCase()) {
        setUser(AMIT0730_FALLBACK_USER);
        setRepos(AMIT0730_FALLBACK_REPOS);
        setIsUsingFallback(true);
      }
    } finally {
      setIsLoading(false);
      setRateLimit(getRateLimitInfo());
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPortfolioData(username);
  }, [username, loadPortfolioData]);

  // Handle switching username
  const handleUsernameChange = (newUsername: string) => {
    if (newUsername.trim() && newUsername.trim() !== username) {
      const clean = newUsername.trim();
      setUsername(clean);
      setActiveCategory("All");
      setSearchQuery("");
    }
  };

  // Compute featured repo list
  const featuredRepos = useMemo(() => {
    return repos.filter((r) => featuredNames.has(r.name));
  }, [repos, featuredNames]);

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-white">
      {/* Dynamic Ambient Background */}
      <AmbientBackground />

      {/* Top Navigation */}
      <Navbar
        currentUsername={username}
        onUsernameChange={handleUsernameChange}
        isLoading={isLoading}
        rateLimit={rateLimit}
      />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 pb-16">
        {/* Error / Rate limit Notice Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-semibold">Notice: </span>
                <span>{errorMessage}</span>
                {isUsingFallback && (
                  <span className="block sm:inline text-xs text-amber-300/80 sm:ml-1 font-mono">
                    (Showing verified portfolio snapshot for @{username})
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => loadPortfolioData(username)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-semibold text-amber-100 transition-colors flex items-center gap-1.5 self-end sm:self-auto shrink-0"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Developer Profile Hero */}
        <ProfileHero
          user={user}
          repos={repos}
          isLoading={isLoading}
          onRefresh={() => loadPortfolioData(username)}
          onUsernameChange={handleUsernameChange}
        />

        {/* Featured Projects Spotlight */}
        <FeaturedSection
          featuredRepos={featuredRepos}
          onSelectRepo={setSelectedRepo}
          onTogglePin={handleTogglePin}
        />

        {/* Main Repository Grid with Category Filters & Search */}
        <ProjectGrid
          repos={repos}
          featuredNames={featuredNames}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onSelectRepo={setSelectedRepo}
          onTogglePin={handleTogglePin}
          isLoading={isLoading}
        />

        {/* GitHub Activity, Commits & Heatmap */}
        <ActivitySection
          events={events}
          repos={repos}
          username={username}
          isLoading={isLoading}
        />
      </main>

      {/* Project Details Modal */}
      <ProjectModal
        repo={selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />

      {/* Footer */}
      <Footer username={username} />
    </div>
  );
}
