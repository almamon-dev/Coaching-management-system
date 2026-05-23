import React from 'react';

const QuestionStats = ({ stats, activeTab = 'all', onTabChange }) => {
    const tabs = [
        { key: 'all',       label: 'All Questions',     count: stats.total },
        { key: 'pending',   label: 'Pending Reply',    count: stats.pending },
        { key: 'answered',  label: 'Answered',          count: stats.answered },
        { key: 'today',     label: 'Asked Today',       count: stats.today },
    ];

    return (
        <div className="flex items-center gap-4 mb-0 px-2 overflow-x-auto border-b border-[#ebebeb] bg-white">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange && onTabChange(tab.key)}
                        className={`pt-3 pb-2 px-1 text-[13px] font-semibold transition-all relative whitespace-nowrap flex-shrink-0 flex items-center gap-2 group ${isActive
                                ? 'text-[#202223]'
                                : 'text-[#6d7175] hover:text-[#202223]'
                            }`}
                    >
                        <span>{tab.label}</span>
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-[10px] transition-colors ${isActive
                                ? 'bg-[#ebebeb] text-[#202223]'
                                : 'bg-[#f6f6f7] text-[#6d7175] group-hover:bg-[#ebebeb]'
                            }`}>
                            {tab.count ?? 0}
                        </span>
                        {isActive && (
                            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#008060] rounded-t-[3px]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default QuestionStats;
