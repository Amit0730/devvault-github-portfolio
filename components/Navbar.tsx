"use client";

import React, { useState } from "react";
import {
  Code2,
  Search,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Activity,
  Layers,
  ShieldCheck,
} from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import { RateLimitInfo } from "@/types/github";

interface NavbarProps {
  currentUsername: string;
  onUsernameChange: (username: string) => void;
  isLoading: boolean;
  rateLimit: RateLimitInfo;
}

export default function Navbar({
  currentUsername,
  onUsernameChange,
  isLoading,
  rateLimit,
}: NavbarProps) {
  const [inputVal, setInputVal] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (trimmed) {
      onUsernameChange(trimmed);
      setInputVal("");
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const PRESETS = ["Amit0730", "shadcn", "leerob", "torvalds"];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Dev<span className="text-indigo-400">Vault</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  v2.0
                </span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wide">
                GitHub Portfolio
              </span>
            </div>
          </a>

          {/* Quick User Badge */}
          <div className="hidden md:flex items-center gap-1.5 ml-3 pl-3 border-l border-white/10">
            <span className="text-xs text-slate-400">Active Profile:</span>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 hover:text-white transition-all"
              title="Click to switch profile"
            >
              <GithubIcon className="w-3.5 h-3.5 text-indigo-400" />
              @{currentUsername}
              <span className="text-[10px] text-slate-400 underline decoration-indigo-400/50 ml-1">
                switch
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <a
            href="#overview"
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            Overview
          </a>
          <a
            href="#featured"
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Featured
          </a>
          <a
            href="#projects"
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Projects
          </a>
          <a
            href="#activity"
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Activity
          </a>
        </nav>

        {/* Right Section: Switcher & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Profile Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 transition-all"
            aria-label="Search GitHub Username"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search user...</span>
          </button>

          {/* Rate limit status indicator */}
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono border border-white/10 bg-black/40 text-slate-400"
            title={`Public GitHub API quota: ${rateLimit.remaining}/${rateLimit.limit} remaining this hour`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{rateLimit.remaining} left</span>
          </div>

          {/* GitHub Profile External Link */}
          <a
            href={`https://github.com/${currentUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-sm shadow-indigo-600/30 transition-all"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Floating Username Switcher Modal / Bar */}
      {isSearchOpen && (
        <div className="border-t border-white/[0.08] bg-[#0c111d] px-4 py-3 shadow-2xl animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter any GitHub username (e.g. Amit0730, torvalds, vercel)..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputVal.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {isLoading ? "Fetching..." : "Load Portfolio"}
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {/* Presets */}
            <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-400">
              <span>Quick switch:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      onUsernameChange(preset);
                      setIsSearchOpen(false);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                      currentUsername.toLowerCase() === preset.toLowerCase()
                        ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300"
                        : "bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    @{preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#090d16]/95 backdrop-blur-2xl px-4 py-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="text-xs text-slate-400">Active Profile:</span>
            <span className="text-xs font-mono font-semibold text-indigo-400">
              @{currentUsername}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <a
              href="#overview"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/[0.05]"
            >
              Overview
            </a>
            <a
              href="#featured"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/[0.05] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Featured Projects
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/[0.05] flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              All Projects & Filters
            </a>
            <a
              href="#activity"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/[0.05] flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              Activity & Commits
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
