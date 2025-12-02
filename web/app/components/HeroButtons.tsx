"use client";

import React, { useState, useEffect } from 'react';
import { Download, Github } from 'lucide-react';

export default function HeroButtons() {
    const [os, setOs] = useState<'mac' | 'linux'>('mac');

    useEffect(() => {
        if (navigator.userAgent.indexOf('Linux') !== -1) setOs('linux');
    }, []);

    return (
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
                href="https://github.com/theabhayprajapati/hostmaster/releases"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
                <Download className="w-5 h-5" />
                Download for {os === 'mac' ? 'macOS' : 'Linux'}
            </a>
            <a
                href="https://github.com/theabhayprajapati/hostmaster"
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
                <Github className="w-5 h-5" />
                View Source
            </a>
        </div>
    );
}
