import React from 'react';

/**
 * SchoolLogo - Renders the school wordmark logo inline.
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} theme - 'default' | 'white' (for dark backgrounds)
 */
export default function SchoolLogo({ size = 'md', theme = 'default' }) {
    const sizes = {
        sm: { icon: 32, title: '11px', sub: '10px', gap: '8px' },
        md: { icon: 44, title: '14px', sub: '12px', gap: '10px' },
        lg: { icon: 56, title: '18px', sub: '14px', gap: '12px' },
    };

    const s = sizes[size] || sizes.md;
    const titleColor = theme === 'white' ? '#ffffff' : '#1a2a5e';
    const subColor   = theme === 'white' ? '#86efac' : '#166534';
    const iconColor  = theme === 'white' ? '#86efac' : '#166534';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: s.gap, lineHeight: 1 }}>
            {/* Book + Leaf SVG Icon */}
            <svg
                width={s.icon}
                height={s.icon}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Open Book */}
                <path
                    d="M10 75 Q50 65 50 65 Q90 65 90 75 L90 30 Q90 20 50 25 Q10 20 10 30 Z"
                    fill={iconColor}
                    opacity="0.15"
                />
                <path
                    d="M50 65 L50 25"
                    stroke={iconColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                {/* Left page */}
                <path
                    d="M50 25 Q30 20 10 28 L10 72 Q30 64 50 68 Z"
                    fill={iconColor}
                    opacity="0.9"
                />
                {/* Right page */}
                <path
                    d="M50 25 Q70 20 90 28 L90 72 Q70 64 50 68 Z"
                    fill={iconColor}
                    opacity="0.7"
                />
                {/* Leaf stem */}
                <path
                    d="M50 25 Q50 10 50 5"
                    stroke={iconColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                {/* Left leaf */}
                <path
                    d="M50 18 Q38 8 32 12 Q36 20 50 18 Z"
                    fill={iconColor}
                />
                {/* Right leaf */}
                <path
                    d="M50 12 Q62 2 68 6 Q64 15 50 12 Z"
                    fill={iconColor}
                />
            </svg>

            {/* Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{
                    fontSize: s.title,
                    fontWeight: 800,
                    color: titleColor,
                    letterSpacing: '0.02em',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    lineHeight: 1.2,
                    textTransform: 'uppercase',
                }}>
                    Kirtonia Yousob Ali Bhuyan
                </span>
                <span style={{
                    fontSize: s.sub,
                    fontWeight: 700,
                    color: subColor,
                    letterSpacing: '0.08em',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    lineHeight: 1.2,
                    textTransform: 'uppercase',
                }}>
                    High School
                </span>
            </div>
        </div>
    );
}
