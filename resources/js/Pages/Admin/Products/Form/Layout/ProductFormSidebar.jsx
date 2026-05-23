import React from 'react';
import { ChevronRight } from 'lucide-react';

const ProductFormSidebar = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="lg:col-span-3 space-y-1">
            <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-sm overflow-hidden sticky top-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between px-6 py-2.5 text-[13px] font-bold border-b border-[#f6f6f7] last:border-0 ${activeTab === tab.id
                            ? 'bg-[#f4f6f8] text-[#008060] border-l-[3px] border-l-[#008060]'
                            : 'text-[#6d7175] hover:bg-[#f6f6f7] hover:text-[#202223] border-l-[3px] border-l-transparent'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <tab.icon size={16} className={activeTab === tab.id ? 'text-[#008060]' : 'text-[#6d7175]'} />
                            {tab.label}
                        </div>
                        {activeTab === tab.id && <ChevronRight size={14} className="text-[#008060]" />}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductFormSidebar;
