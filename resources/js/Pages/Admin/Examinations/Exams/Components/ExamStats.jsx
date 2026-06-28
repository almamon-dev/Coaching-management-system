import React from 'react';

const ExamStats = ({ stats, currentFilter, onFilterChange }) => {
    const tabs = [
        { id: 'all', label: 'All Exams', count: stats?.all || 0 },
        { id: 'upcoming', label: 'Upcoming', count: stats?.upcoming || 0 },
        { id: 'ongoing', label: 'Ongoing', count: stats?.ongoing || 0 },
        { id: 'completed', label: 'Completed', count: stats?.completed || 0 },
        { id: 'published', label: 'Published', count: stats?.published || 0 },
    ];

    return (
        <div className="flex items-center gap-6 px-4 pt-4 pb-0 bg-white border-b border-[#ebebeb] overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onFilterChange(tab.id === 'all' ? '' : tab.id)}
                    className={`flex items-center gap-2 pb-3 px-1 border-b-[2.5px] transition-all whitespace-nowrap outline-none ${
                        (currentFilter === tab.id || (!currentFilter && tab.id === 'all'))
                            ? 'border-[#008060] text-[#008060] font-bold'
                            : 'border-transparent text-slate-500 font-medium hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <span className="text-[13px]">{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        (currentFilter === tab.id || (!currentFilter && tab.id === 'all'))
                            ? 'bg-[#e4f1ef] text-[#008060]'
                            : 'bg-slate-100 text-slate-500'
                    }`}>
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default ExamStats;
