import React from 'react';
import { router } from '@inertiajs/react';
import CustomDropdown from '@/Components/Frontend/CustomDropdown';

/**
 * IndexToolbar Component
 * Renders the product listing toolbar with sorting and limit controls.
 */
const IndexToolbar = ({ title, filters, category, brand }) => {
    
    const handleFilterChange = (key, value) => {
        const path = category?.path || brand?.slug || '#';
        const nextFilters = { ...filters, [key]: value };
        delete nextFilters.page;
        router.get(route('frontend.url', path), nextFilters, { preserveState: true });
    };

    return (
        <div className="bg-white rounded-md border border-slate-200 px-5 py-3 mb-5 flex items-center justify-between shadow-sm">
            <h2 className="text-[16px] font-bold text-[#081621]">{title}</h2>
            <div className="flex items-center gap-8">
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
