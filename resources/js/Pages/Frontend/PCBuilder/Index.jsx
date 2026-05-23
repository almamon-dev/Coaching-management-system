import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { useFrontend } from '@/Contexts/FrontendContext';
import PCBuilderRow from './Partials/PCBuilderRow';
import { 
    ShoppingCart,
    Save,
    Printer,
    RefreshCw,
    Check,
    Share2,
    Copy
} from 'lucide-react';

export default function Index({ slots = [], sharedBuild = null }) {
    const { addToCart } = useFrontend();
    const [selections, setSelections] = useState({});
    const [hideUnconfigured, setHideUnconfigured] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [showCpuWarning, setShowCpuWarning] = useState(false);

    const handleChoose = (slotId) => {
        if (slotId !== 'processor' && !selections.processor) {
            setShowCpuWarning(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setShowCpuWarning(false);
        router.visit(route('pc-builder.choose', { slotId }) + '?' + getQueryString(slotId));
    };

    // Group slots by slot.group
    const groupedSlots = slots.reduce((acc, slot) => {
        const groupName = slot.group || 'Core Components';
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(slot);
        return acc;
    }, {});

    // Load initial selections (from shared build or localStorage)
    useEffect(() => {
        if (sharedBuild && sharedBuild.components) {
            setSelections(sharedBuild.components);
        } else {
            const saved = localStorage.getItem('pc_builder_selections');
            if (saved) {
                try {
                    setSelections(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse saved build', e);
                }
            }
        }
    }, [sharedBuild]);

    // Save to localStorage when selections change
    useEffect(() => {
        if (!sharedBuild) {
            localStorage.setItem('pc_builder_selections', JSON.stringify(selections));
        }
    }, [selections, sharedBuild]);

    const handleRemove = (slotId) => {
        const updated = { ...selections };
        delete updated[slotId];
        setSelections(updated);
        if (shareUrl) setShareUrl('');
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear your current build?')) {
            setSelections({});
            localStorage.removeItem('pc_builder_selections');
            setShareUrl('');
            if (sharedBuild) {
                router.visit(route('pc-builder.index'));
            }
        }
    };

    // Calculate Estimated Wattage
    const calculateEstimatedWattage = () => {
        let cpuTdp = 0;
        let gpuTdp = 0;
        let baseWatts = 65;

        if (selections.processor) {
            const cpuName = selections.processor.name.toLowerCase();
            if (cpuName.includes('i9') || cpuName.includes('ryzen 9')) cpuTdp = 125;
            else if (cpuName.includes('i7') || cpuName.includes('ryzen 7')) cpuTdp = 105;
            else if (cpuName.includes('i5') || cpuName.includes('ryzen 5')) cpuTdp = 65;
            else cpuTdp = 65;
        }

        if (selections['graphics-card']) {
            const gpuName = selections['graphics-card'].name.toLowerCase();
            if (gpuName.includes('3090') || gpuName.includes('4090')) gpuTdp = 350;
            else if (gpuName.includes('3080') || gpuName.includes('4080')) gpuTdp = 320;
            else if (gpuName.includes('3070') || gpuName.includes('4070')) gpuTdp = 220;
            else if (gpuName.includes('3060') || gpuName.includes('4060')) gpuTdp = 170;
            else if (gpuName.includes('1650') || gpuName.includes('1660')) gpuTdp = 120;
            else gpuTdp = 150;
        }

        if (selections.ram) baseWatts += 10;
        if (selections.storage) baseWatts += 10;
        if (selections['cpu-cooler']) baseWatts += 15;

        const total = cpuTdp + gpuTdp + baseWatts;
        return selections.processor || selections['graphics-card'] ? total : 0;
    };

    // Calculate Total Price
    const calculateTotalPrice = () => {
        return Object.values(selections).reduce((total, product) => {
            const price = product.discount_price || product.price || 0;
            return total + price;
        }, 0);
    };

    // Save build configuration
    const handleSaveBuild = async () => {
        if (Object.keys(selections).length === 0) {
            alert('Please select at least one component to save your build.');
            return;
        }

        setIsSaving(true);
        const componentIds = {};
        Object.entries(selections).forEach(([slotId, product]) => {
            componentIds[slotId] = product.id;
        });

        try {
            const response = await fetch(route('pc-builder.save'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    components: componentIds,
                    total_price: calculateTotalPrice(),
                })
            });

            const data = await response.json();
            if (data.status === 'success') {
                setShareUrl(data.url);
            } else {
                alert('Failed to save build configuration.');
            }
        } catch (e) {
            console.error('Error saving build', e);
            alert('An error occurred while saving.');
        } finally {
            setIsSaving(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Add to cart
    const handleAddAllToCart = () => {
        const items = Object.values(selections);
        if (items.length === 0) {
            alert('Your build is empty. Choose components first.');
            return;
        }

        items.forEach(product => {
            addToCart(product, 1);
        });
        
        alert('All components have been added to your shopping cart!');
    };

    const handlePrint = () => {
        window.print();
    };

    const totalItems = Object.keys(selections).length;
    const totalPrice = calculateTotalPrice();
    const wattage = calculateEstimatedWattage();

    const getQueryString = (currentSlotId) => {
        const params = new URLSearchParams();
        Object.entries(selections).forEach(([slotId, product]) => {
            if (slotId !== currentSlotId) {
                params.append(slotId, product.id.toString());
            }
        });
        return params.toString();
    };

    return (
        <>
            <Head title="PC Builder - Build Your Own Computer" />

            <div className="bg-[#f4f7f9] min-h-screen pb-12 print:bg-white print:pb-0">
                <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                        header, footer, nav, aside, button, .print-hide {
                            display: none !important;
                        }
                        .print-container {
                            width: 100% !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            box-shadow: none !important;
                            border: none !important;
                        }
                    }
                `}} />

                <div className="container mx-auto px-4 py-8 print-container max-w-7xl">
                    {/* Warning Alert Banner */}
                    {showCpuWarning && (
                        <div className="bg-[#ebf5ec] border border-[#d0eed4] text-[#1e4620] px-4 py-3 rounded relative mb-4 flex items-center justify-between text-sm transition-all" role="alert">
                            <span className="flex items-center gap-1.5 font-semibold">
                                <span className="font-bold text-[#1b5e20]">Warning!</span> Please select a CPU first
                            </span>
                            <button 
                                type="button" 
                                onClick={() => setShowCpuWarning(false)}
                                className="text-[#1b5e20] hover:text-[#0b1c0d] font-bold text-lg leading-none shrink-0"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden mb-6">
                        
                        {/* Header Panel */}
                        <div className="border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print-hide bg-[#081621]">
                            <div>
                                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                                    PC Builder
                                </h1>
                                <p className="text-[11px] text-slate-300 mt-1">Select components to configure your custom computer build</p>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                <button 
                                    onClick={handleAddAllToCart}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#3749bb] hover:bg-[#253285] text-white text-[12px] font-bold rounded transition-colors"
                                    disabled={totalItems === 0}
                                >
                                    Add to Cart
                                </button>
                                
                                <button 
                                    onClick={handleSaveBuild}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded transition-colors"
                                    disabled={totalItems === 0 || isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save PC'}
                                </button>

                                <button 
                                    onClick={handlePrint}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-[12px] font-bold rounded transition-colors"
                                    disabled={totalItems === 0}
                                >
                                    Print
                                </button>

                                <button 
                                    onClick={handleClear}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[12px] font-bold rounded transition-colors"
                                    disabled={totalItems === 0}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Build Metrics */}
                        <div className="grid grid-cols-3 gap-6 px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                            <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider leading-none">Estimated Wattage</span>
                                <span className="text-xl font-black text-slate-700 mt-1 block leading-none">{wattage}W</span>
                            </div>

                            <div className="border-l border-slate-200 pl-6">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none">Configured Slots</span>
                                <span className="text-xl font-black text-slate-700 mt-1 leading-none">{totalItems} / {slots.length}</span>
                            </div>

                            <div className="border-l border-slate-200 pl-6">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none">Subtotal</span>
                                <span className="text-xl font-black text-[#3749bb] mt-1 leading-none">{totalPrice.toLocaleString()}৳</span>
                            </div>
                        </div>

                        {/* Share URL Box */}
                        {shareUrl && (
                            <div className="px-6 py-3.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between gap-4 print-hide">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-emerald-500 rounded text-white shrink-0">
                                        <Share2 size={14} />
                                    </div>
                                    <div>
                                        <h4 className="text-[12px] font-bold text-slate-800 leading-none">Build Link Ready</h4>
                                        <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Copy link to share configuration</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 max-w-sm w-full">
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={shareUrl} 
                                        className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none"
                                    />
                                    <button 
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded transition-colors shrink-0"
                                    >
                                        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Filters */}
                        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between print-hide bg-white">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                                <input 
                                    type="checkbox" 
                                    checked={hideUnconfigured}
                                    onChange={(e) => setHideUnconfigured(e.target.checked)}
                                    className="rounded border-slate-300 text-[#3749bb] focus:ring-[#3749bb] h-4 w-4"
                                />
                                Hide Unconfigured Components
                            </label>
                        </div>

                        {/* Grouped Configurator rows */}
                        <div className="bg-white">
                            {Object.entries(groupedSlots).map(([groupName, groupSlots]) => {
                                const visibleSlots = groupSlots.filter(slot => !hideUnconfigured || selections[slot.id]);
                                if (visibleSlots.length === 0) return null;

                                return (
                                    <div key={groupName}>
                                        <div className="bg-[#5e6f7c] text-white px-6 py-2 text-[12px] font-bold uppercase tracking-wider">
                                            {groupName}
                                        </div>
                                        <div className="divide-y divide-slate-100">
                                            {visibleSlots.map((slot) => (
                                                <PCBuilderRow 
                                                    key={slot.id}
                                                    slot={slot}
                                                    product={selections[slot.id]}
                                                    onRemove={handleRemove}
                                                    getQueryString={getQueryString}
                                                    onChoose={handleChoose}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

Index.layout = page => <FrontendLayout children={page} categories={page.props.categories} brands={page.props.brands} />;
