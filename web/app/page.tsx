"use client";

import React, { useState, useEffect } from 'react';
import { Download, Terminal, Shield, Zap, Moon, Github, Command, Check } from 'lucide-react';
import Image from 'next/image';

// --- Components ---

// 1. The "Hero App" - 3D Container for the screenshot
const AppPreview = () => (
  <div className="relative group perspective-1000">
    <div className="relative w-[600px] h-[400px] bg-[#1C1C1E] rounded-xl border border-[#38383A] shadow-2xl overflow-hidden transform transition-all duration-700 hover:rotate-x-2 hover:rotate-y-2 hover:scale-[1.02] rotate-x-6 rotate-y-[-10deg] shadow-blue-500/10">



      {/* Body - Actual Screenshot */}
      <div className="relative w-full h-full bg-[#1C1C1E]">
        <Image
          src="/dark-mode-app.png"
          alt="HostMaster App Interface"
          fill
          className="object-cover object-top opacity-90"
        />
        {/* Overlay gradient to blend bottom if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-transparent to-transparent opacity-20"></div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none z-30"></div>
    </div>
  </div>
);

export default function LandingPage() {
  const [os, setOs] = useState<'mac' | 'linux'>('mac');

  useEffect(() => {
    if (navigator.userAgent.indexOf('Linux') !== -1) setOs('linux');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">

      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 bg-black/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-tight text-lg">
            <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-blue-500 rounded-md"></div>
            HostMaster
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="https://github.com/theabhayprajapati/hostmaster" className="hover:text-white transition-colors flex items-center gap-2">
              <Github size={16} /> GitHub
            </a>
            <a
              href="https://github.com/theabhayprajapati/hostmaster/releases"
              className="bg-white text-black px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Text Content */}
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              v0.1.0 Now Available
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              The Hosts File. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                Reimagined.
              </span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed max-w-md">
              The native macOS and Linux utility for developers who are tired of editing text files with sudo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="https://github.com/theabhayprajapati/hostmaster/releases"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                Download for macOS
              </a>
              <a
                href="https://github.com/theabhayprajapati/hostmaster"
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Github className="w-5 h-5" />
                View Source
              </a>
            </div>

            <p className="text-xs text-gray-500 pt-2">
              Open Source • Rust Core • 5MB Download
            </p>
          </div>

          {/* Graphic Content */}
          <div className="relative hidden lg:block perspective-container">
            {/* Abstract background blobs */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-600/20 rounded-full blur-[100px]"></div>

            <AppPreview />
          </div>
        </div>
      </section>

      {/* Features Grid (Bento Style) */}
      <section id="features" className="py-24 px-6 bg-[#050505] relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Everything you need. Nothing you don't.</h2>
            <p className="text-gray-400">Built for speed, safety, and simplicity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Safety */}
            <div className="col-span-1 md:col-span-2 bg-[#111] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield size={120} />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold">Safety First Architecture</h3>
                <p className="text-gray-400 max-w-sm">
                  We never write directly to /etc/hosts until you hit save. Automatic backups are created before every write operation, so you never break your network config.
                </p>
              </div>
            </div>

            {/* Card 2: Speed */}
            <div className="bg-[#111] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold">Rust Powered</h3>
                <p className="text-gray-400">
                  Built with Tauri and Rust. The app binary is 95% smaller than Electron alternatives and uses 10x less RAM.
                </p>
              </div>
            </div>

            {/* Card 3: Dark Mode */}
            <div className="bg-[#111] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Moon size={24} />
                </div>
                <h3 className="text-xl font-bold">Native Dark Mode</h3>
                <p className="text-gray-400">
                  Looks beautiful at 3 AM. Automatically syncs with your system preferences.
                </p>
              </div>
            </div>

            {/* Card 4: Shortcuts */}
            <div className="col-span-1 md:col-span-2 bg-[#111] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden flex items-center justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400">
                  <Command size={24} />
                </div>
                <h3 className="text-xl font-bold">Keyboard First</h3>
                <p className="text-gray-400">
                  Cmd+N to add. Cmd+S to save. Arrow keys to navigate.
                </p>
              </div>
              <div className="hidden sm:flex gap-2 opacity-50">
                <kbd className="bg-[#222] border border-[#333] rounded px-2 py-1 font-mono text-sm">⌘ N</kbd>
                <kbd className="bg-[#222] border border-[#333] rounded px-2 py-1 font-mono text-sm">⌘ S</kbd>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 bg-black relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm">
            © 2025 HostMaster. Open Source (MIT).
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            <a href="https://github.com/theabhayprajapati/hostmaster" className="text-gray-400 hover:text-white">GitHub</a>
          </div>
        </div>
      </footer>


    </div>
  );
}
