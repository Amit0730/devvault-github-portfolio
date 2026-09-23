import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DevVault — Developer Project Portfolio",
  description:
    "A modern developer portfolio powered by GitHub projects and activity.",
  keywords: [
    "portfolio",
    "github",
    "developer portfolio",
    "open source",
    "software engineer",
    "nextjs",
    "react",
    "typescript",
  ],
  authors: [{ name: "Amit Kumar Singh", url: "https://github.com/Amit0730" }],
  creator: "Amit0730",
  openGraph: {
    title: "DevVault — Developer Project Portfolio",
    description:
      "A modern developer portfolio powered by GitHub projects and activity.",
    type: "website",
    locale: "en_US",
    siteName: "DevVault",
    url: "https://devvault-github-portfolio.vercel.app",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/177955021?v=4",
        width: 1200,
        height: 630,
        alt: "DevVault — Developer Project Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevVault — Developer Project Portfolio",
    description:
      "A modern developer portfolio powered by GitHub projects and activity.",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='16 18 22 12 16 6'/><polyline points='8 6 2 12 8 18'/></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-[#07090e] text-slate-100 selection:bg-indigo-500/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
