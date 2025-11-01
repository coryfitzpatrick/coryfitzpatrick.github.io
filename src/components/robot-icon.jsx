import React from 'react';

export default function RobotIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img" aria-label="Chatbot robot head icon">
            <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f6d88b"/>
                    <stop offset="60%" stopColor="#d4aa4a"/>
                    <stop offset="100%" stopColor="#b8852b"/>
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f8e5b7"/>
                    <stop offset="100%" stopColor="#d2a84a"/>
                </linearGradient>
                <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35"/>
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.06"/>
                </linearGradient>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.18"/>
                </filter>
            </defs>

            <rect width="100%" height="100%" fill="none"/>

            <g transform="translate(32,20)">
                {/* dome */}
                <path d="M96 8c44 0 80 36 80 80v24H16V88c0-44 36-80 80-80z"
                      fill="url(#g1)" stroke="#222" strokeWidth="8" strokeLinejoin="round" filter="url(#shadow)"/>
                {/* dome highlight */}
                <path d="M40 40c20-28 46-40 56-40 18 0 38 8 60 36" fill="none" stroke="url(#g3)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>

                {/* horizontal band (face separator) */}
                <rect x="12" y="112" width="168" height="18" rx="6" fill="url(#g2)" stroke="#222" strokeWidth="6"/>

                {/* neck / connector */}
                <g transform="translate(48,130)">
                    <rect x="0" y="0" width="112" height="42" rx="18" fill="url(#g1)" stroke="#222" strokeWidth="6"/>
                    {/* rivets */}
                    <circle cx="22" cy="22" r="4" fill="#222"/>
                    <circle cx="56" cy="22" r="4" fill="#222"/>
                    <circle cx="90" cy="22" r="4" fill="#222"/>
                    {/* lower band */}
                    <rect x="8" y="28" width="96" height="8" rx="4" fill="#f0d49a" opacity="0.6"/>
                </g>

                {/* right eye (prominent, facing right) */}
                <g transform="translate(108,54)">
                    <circle cx="28" cy="28" r="32" fill="#f4e0a8" stroke="#222" strokeWidth="8"/>
                    <circle cx="28" cy="28" r="16" fill="#222"/>
                    {/* ring highlight */}
                    <circle cx="28" cy="28" r="32" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="4"/>
                </g>

                {/* left small eye / ear piece (subtle) */}
                <g transform="translate(10,70)">
                    <circle cx="22" cy="18" r="18" fill="#f4e0a8" stroke="#222" strokeWidth="8"/>
                    <circle cx="22" cy="18" r="8" fill="#222"/>
                </g>

                {/* rivet dots on dome */}
                <circle cx="142" cy="52" r="4" fill="#222"/>
                <circle cx="156" cy="58" r="4" fill="#222"/>
                <circle cx="68" cy="48" r="4" fill="#222"/>

                {/* antenna (top-right) */}
                <g transform="translate(156,-6)">
                    <rect x="10" y="0" width="18" height="32" rx="6" fill="url(#g1)" stroke="#222" strokeWidth="6"/>
                    <ellipse cx="19" cy="-4" rx="12" ry="8" fill="url(#g2)" stroke="#222" strokeWidth="5"/>
                </g>

                {/* subtle shadow under band */}
                <ellipse cx="96" cy="136" rx="70" ry="6" fill="rgba(0,0,0,0.06)"/>
            </g>
        </svg>
    );
}
