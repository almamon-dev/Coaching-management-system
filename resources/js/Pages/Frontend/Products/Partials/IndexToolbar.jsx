import React from 'react';
import { router } from '@inertiajs/react';
import CustomDropdown from '@/Components/Frontend/CustomDropdown';
import { Filter } from 'lucide-react';

/**
 * IndexToolbar Component
 * Renders the product listing toolbar with sorting and limit controls.
 */
const IndexToolbar = ({ title, filters, category, brand, onFilterClick }) => {
    
    const handleFilterChange = (key, value) => {
        const path = category?.path || brand?.slug || '#';
        const nextFilters = { ...filters, [key]: value };
        delete nextFilters.page;
        router.get(route('frontend.url', path), nextFilters, { preserveState: true });
    };

    return (
        <div className="bg-white rounded-md border border-slate-200 px-3 md:px-5 py-3 mb-5 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-3">
            <div className="flex items-center justify-between w-full md:w-auto">
                <h2 className="text-[16px] font-bold text-[#081621]">{title}</h2>
                <button 
                    onClick={onFilterClick}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#f3f4f7] rounded text-slate-700 text-sm font-semibold hover:text-[#16a34a] hover:bg-green-50 transition-colors"
                >
                    <Filter size={16} />
                    <span>Filter</span>
                </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-8 justify-between md:justify-end">
                {/* Show Limit Dropdown */}
                <CustomDropdown 
                    label="Show"
                    value={filters.limit || 20}
                    options={[
                        { label: '20', value: '20' },
                        { label: '40', value: '40' },
                        { label: '60', value: '60' }
                    ]}
                    onChange={(val) => handleFilterChange('limit', val)}
                />

                {/* Sort By Dropdown */}
                <CustomDropdown 
                    label="Sort By"
                    value={filters.sort || 'default'}
                    options={[
                        { label: 'Default', value: 'default' },
                        { label: 'Price (Low > High)', value: 'price_low' },
                        { label: 'Price (High > Low)', value: 'price_high' },
                        { label: 'Name (A > Z)', value: 'name_az' }
                    ]}
                    onChange={(val) => handleFilterChange('sort', val)}
                />
            </div>
        </div>
    );
};

export default IndexToolbar;
