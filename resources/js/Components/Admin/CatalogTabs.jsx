import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Layers, Box, Tag } from 'lucide-react';

const CatalogTabs = () => {
    const { url } = usePage();
    const currentPath = url.split("?")[0];

    const tabs = [
        { label: "Categories", path: "/admin/categories", icon: LayoutGrid },
        { label: "Subcategories", path: "/admin/subcategories", icon: Layers },
        { label: "Products", path: "/admin/products", icon: Box },
        { label: "Variants", path: "/admin/variants", icon: Tag },
    ];

    return (
        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl w-fit mb-8 border border-slate-200">
            {tabs.map((tab) => {
                const isActive = currentPath.startsWith(tab.path);
                const Icon = tab.icon;
                
                return (
                    <Link
                        key={tab.path}
                        href={tab.path}
                        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-200 ${
                            isActive 
                                ? 'bg-white text-[#ef4a23] shadow-sm ring-1 ring-slate-200' 
                                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                        }`}
                    >
                        <Icon size={16} className={isActive ? 'text-[#ef4a23]' : 'text-slate-400'} />
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
};

export default CatalogTabs;
