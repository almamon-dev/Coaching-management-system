import React from 'react';

const DiscountBadge = ({ percent }) => {
    if (!percent || percent <= 0) return null;

    return (
        <div className="absolute top-1 left-1 z-10 w-11 h-11 flex items-center justify-center drop-shadow-sm">
            {/* Spinning Star Background */}
            <div 
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#10b981] to-[#059669] animate-[spin_15s_linear_infinite]" 
                style={{ clipPath: 'polygon(50% 0%, 61% 20%, 83% 17%, 86% 38%, 100% 50%, 86% 62%, 83% 83%, 61% 80%, 50% 100%, 39% 80%, 17% 83%, 20% 62%, 0% 50%, 20% 38%, 17% 17%, 39% 20%)' }}
            ></div>
            
            {/* Static Text */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="text-[13px] font-black text-white leading-none tracking-tighter">{percent}%</span>
            </div>
        </div>
    );
};

export default DiscountBadge;
