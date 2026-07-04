import React from 'react';
import logoSrc from '../../images/logo.png';

export default function SchoolLogo({ variant = 'wide', className = '', theme = 'default' }) {
    const src = logoSrc;

    const filterClass = theme === 'white' ? 'brightness-0 invert' : '';

    if (variant === 'icon') {
        return (
            <div className={`relative overflow-hidden flex items-center justify-center h-[50px] w-[50px] rounded ${className}`.trim()}>
                <img src={src} className={`absolute w-[120px] h-auto max-w-none ${filterClass}`} alt="School Logo" />
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden flex items-center justify-center h-[60px] w-[220px] ${className}`.trim()}>
            <img
                src={src}
                alt="School Logo"
                className={`absolute w-[240px] h-auto max-w-none ${filterClass}`}
            />
        </div>
    );
}
