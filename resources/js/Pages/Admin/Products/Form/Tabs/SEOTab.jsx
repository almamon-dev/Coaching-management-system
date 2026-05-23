import React from 'react';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import TagInput from '@/Components/TagInput';
import { Globe } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';

const SEOTab = ({ data, setData }) => {
    return (
        <div className="space-y-6 ">
            {/* Standard Header Section */}
            <div className="border-b border-[#f6f6f7] pb-3">
                <h3 className="text-[14px] font-bold text-[#202223] mb-1">SEO & Search Tags</h3>
                <p className="text-[12px] text-[#6d7175]">Optimize how your product appears in search engine results and local search.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <InputLabel value="Meta Title" className="mb-0" />
                        <span className={`text-[10px] font-bold ${data.meta_title.length > 60 ? 'text-rose-500' : 'text-slate-400'}`}>
                            {data.meta_title.length}/60
                        </span>
                    </div>
                    <TextInput
                        type="text"
                        value={data.meta_title}
                        onChange={e => setData("meta_title", e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <InputLabel value="Meta Description" className="mb-0" />
                        <span className={`text-[10px] font-bold ${data.meta_description.length > 160 ? 'text-rose-500' : 'text-slate-400'}`}>
                            {data.meta_description.length}/160
                        </span>
                    </div>
                    <TextArea
                        value={data.meta_description}
                        onChange={e => setData("meta_description", e.target.value)}
                        rows="4"
                        className="w-full"
                    />
                </div>

                <div className="space-y-1">
                    <InputLabel value="Tags / Keywords" />
                    <TagInput
                        value={data.tags}
                        onChange={val => setData("tags", val)}
                        placeholder="e.g. ryzen, desktop, gaming"
                    />
                </div>
            </div>
        </div>
    );
};

export default SEOTab;
