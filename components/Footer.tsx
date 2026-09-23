"use client";

import React from "react";
import { Code2, Heart, ArrowUp, Sparkles, Layers } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";

interface FooterProps {
  username: string;
}

export default function Footer({ username }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#07090e]/90 backdrop-blur-xl mt-16 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/[0.06]">
          {/* Left Brand */}
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#090d16] rounded-[7px] flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Dev<span className="text-indigo-400">Vault</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A modern, high-performance developer portfolio automatically synced
              with GitHub repositories, commits, and activity.
            </p>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a href="#overview" className="hover:text-white transition-colors">
              Overview
            </a>
            <a href="#featured" className="hover:text-white transition-colors">
              Featured
            </a>
            <a href="#projects" className="hover:text-white transition-colors">
              Repositories
            </a>
            <a href="#activity" className="hover:text-white transition-colors">
              Activity Heatmap
            </a>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>@{username}</span>
            </a>
          </div>

          {/* Right Scroll to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-300 hover:text-white transition-all self-start md:self-auto"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
          </button>
        </div>

        {/* Bottom Credits & Built with */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>Built for developers with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using Next.js 16, TypeScript & Tailwind CSS</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://github.com/${username}/devvault-github-portfolio`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors underline decoration-slate-700 underline-offset-4"
            >
              devvault-github-portfolio
            </a>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
