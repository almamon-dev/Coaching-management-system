import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    Apple, Milk, Wheat, Droplets, 
    Egg, Coffee, Leaf, Flame, 
    Baby, ShoppingBag
} from 'lucide-react';

const getCategoryIcon = (name) => {
    const term = name.toLowerCase();
    if (term.includes('fruit') || term.includes('vegetable')) return <Apple size={26} />;
    if (term.includes('milk') || term.includes('dairy')) return <Milk size={26} />;
    if (term.includes('meat') || term.includes('chicken') || term.includes('fish')) return <Egg size={26} />;
    if (term.includes('rice') || term.includes('flour') || term.includes('wheat')) return <Wheat size={26} />;
    if (term.includes('oil') || term.includes('water')) return <Droplets size={26} />;
    if (term.includes('egg')) return <Egg size={26} />;
    if (term.includes('tea') || term.includes('coffee') || term.includes('beverage')) return <Coffee size={26} />;
    if (term.includes('spice') || term.includes('salt')) return <Flame size={26} />;
    if (term.includes('organic') || term.includes('herb')) return <Leaf size={26} />;
    if (term.includes('baby')) return <Baby size={26} />;
    return <ShoppingBag size={26} />;
};

export default function CategoryGrid({ categories = [] }) {
    const mainCategories = categories.filter(cat => !cat.parent_id && cat.status === 1).slice(0, 16);

    const displayCategories = mainCategories.length > 0 ? mainCategories : [
        { name: 'Fresh Fruits', slug: 'fresh-fruits' },
        { name: 'Vegetables', slug: 'vegetables' },
        { name: 'Meat & Chicken', slug: 'meat' },
        { name: 'Fish & Seafood', slug: 'fish' },
        { name: 'Dairy & Eggs', slug: 'dairy-eggs' },
        { name: 'Rice & Flour', slug: 'rice-flour' },
        { name: 'Oil & Ghee', slug: 'oil' },
        { name: 'Spices', slug: 'spices' },
        { name: 'Snacks', slug: 'snacks' },
        { name: 'Beverages', slug: 'beverages' },
        { name: 'Baby Care', slug: 'baby-care' },
        { name: 'Personal Care', slug: 'personal-care' }
    ];

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#081621] mb-1 font-inter">Featured Categories</h2>
                <p className="text-sm text-slate-500 font-medium font-inter">Get your everyday essentials from top categories</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {displayCategories.map((cat, i) => (
                    <Link 
                        key={i} 
                        href={cat.slug ? route('frontend.url', cat.slug) : '#'} 
                        className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-[#16a34a]/30 transition-all duration-300 group cursor-pointer"
                    >
                        <div className="w-14 h-14 rounded-full bg-[#f3f4f7] flex items-center justify-center text-slate-500 group-hover:bg-[#16a34a] group-hover:text-white transition-all duration-300 overflow-hidden shrink-0">
                            {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                                getCategoryIcon(cat.name)
                            )}
                        </div>
                        <span className="text-[12px] md:text-[13px] font-bold text-[#081621] text-center line-clamp-2 leading-tight group-hover:text-[#16a34a] transition-colors">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
