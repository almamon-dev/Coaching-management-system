import React from 'react';

export default function SchoolLogo({ variant = 'wide', className = '', theme = 'default' }) {
    const src = '/images/Logo.png';
    const filterClass = theme === 'white' ? 'brightness-0 invert' : '';

    if (variant === 'sidebar-icon' || variant === 'icon') {
        return (
            <div className={`flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden shrink-0 ${className}`.trim()}>
                <img
                    src={src}
                    alt="Coaching Logo"
                    className={`w-full h-full object-cover object-left ${filterClass}`}
                />
            </div>
        );
    }

    if (variant === 'sidebar') {
        return (
            <div className={`flex items-center ${className}`.trim()}>
                <img
                    src={src}
                    alt="Coaching Logo"
                    className={`h-8 w-auto max-w-[160px] object-contain ${filterClass}`}
                />
            </div>
        );
    }

    return (
        <div className={`flex items-center ${className}`.trim()}>
            <img
                src={src}
                alt="Coaching Logo"
                className={`h-10 w-auto object-contain ${filterClass}`}
            />
        </div>
    );
}
