import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    Cpu, Laptop, Monitor, Smartphone, 
    Tablet, Printer, Camera, Shield, 
    Wifi, Terminal, Zap, Gamepad, 
    Tv, Wind, Keyboard, Boxes, HardDrive
} from 'lucide-react';

// Maps category names dynamically to high-fidelity tech icons
const getCategoryIcon = (name) => {
    const term = name.toLowerCase();
    if (term.includes('laptop')) return <Laptop size={26} />;
    if (term.includes('desktop')) return <Cpu size={26} />;
    if (term.includes('component')) return <Cpu size={26} />;
    if (term.includes('monitor')) return <Monitor size={26} />;
    if (term.includes('power')) return <Zap size={26} />;
    if (term.includes('phone')) return <Smartphone size={26} />;
    if (term.includes('tablet')) return <Tablet size={26} />;
    if (term.includes('office') || term.includes('printer')) return <Printer size={26} />;
    if (term.includes('camera')) return <Camera size={26} />;
    if (term.includes('security')) return <Shield size={26} />;
    if (term.includes('networking') || term.includes('router')) return <Wifi size={26} />;
    if (term.includes('software')) return <Terminal size={26} />;
    if (term.includes('server') || term.includes('storage')) return <HardDrive size={26} />;
    if (term.includes('accessories')) return <Keyboard size={26} />;
    if (term.includes('gaming')) return <Gamepad size={26} />;
    if (term.includes('tv') || term.includes('television')) return <Tv size={26} />;
    if (term.includes('appliance') || term.includes('ac')) return <Wind size={26} />;
    return <Boxes size={26} />;
};

export default function CategoryGrid({ categories = [] }) {
    // Filter to show only top-level active categories
    const mainCategories = categories.filter(cat => !cat.parent_id && cat.status === 1).slice(0, 16);

    // Fallback if no categories are provided from the database
    const displayCategories = mainCategories.length > 0 ? mainCategories : [
        { name: 'Desktop', slug: 'desktop' },
        { name: 'Laptop', slug: 'laptop' },
        { name: 'Component', slug: 'component' },
        { name: 'Monitor', slug: 'monitor' },
        { name: 'Power', slug: 'power' },
        { name: 'Phone', slug: 'phone' },
        { name: 'Tablet', slug: 'tablet' },
        { name: 'Office Equipment', slug: 'office-equipment' },
        { name: 'Camera', slug: 'camera' },
        { name: 'Security', slug: 'security' },
        { name: 'Networking', slug: 'networking' },
        { name: 'Software', slug: 'software' },
        { name: 'Server & Storage', slug: 'server-storage' },
        { name: 'Accessories', slug: 'accessories' },
        { name: 'Gaming', slug: 'gaming' },
        { name: 'TV', slug: 'tv' }
    ];

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#081621] mb-1 font-inter">Featured Category</h2>
                <p className="text-sm text-slate-500 font-medium font-inter">Get Your Desired Product from Featured Category!</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {displayCategories.map((cat, i) => (
                    <Link 
                        key={i} 
                        href={cat.slug ? route('frontend.url', cat.slug) : '#'} 
                        className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-[#4f46e5]/30 transition-all duration-300 group cursor-pointer"
                    >
                        <div className="w-14 h-14 rounded-full bg-[#f2f4f8] flex items-center justify-center text-slate-500 group-hover:bg-[#4f46e5] group-hover:text-white transition-all duration-300 overflow-hidden shrink-0">
                            {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                                getCategoryIcon(cat.name)
                            )}
                        </div>
                        <span className="text-[12px] md:text-[13px] font-bold text-[#081621] text-center line-clamp-2 leading-tight group-hover:text-[#4f46e5] transition-colors">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
