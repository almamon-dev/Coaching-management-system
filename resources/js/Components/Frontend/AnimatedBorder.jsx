import React from 'react';

const AnimatedBorder = () => {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 rounded-md" xmlns="http://www.w3.org/2000/svg">
            <rect 
                x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeDasharray="10 10" 
                className="animate-marching-ants opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                rx="6" ry="6"
            />
        </svg>
    );
};

export default AnimatedBorder;
