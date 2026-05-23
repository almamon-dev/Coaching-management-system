import React from 'react';
import RichTextEditor from '@/Components/RichTextEditor';

const ContentTab = ({ data, setData }) => {
    return (
        <div className="space-y-6 ">


            {/* Full Description Section with Editor */}
            <div className="space-y-1">
                <div className="border-b border-[#f6f6f7] pb-3 mb-4">
                    <h3 className="text-[14px] font-bold text-[#202223] mb-1">Full Description</h3>
                    <p className="text-[12px] text-[#6d7175]">Write a detailed marketing description.</p>
                </div>
                <div className="pt-1">
                    <RichTextEditor
                        value={data.description}
                        onChange={val => setData("description", val)}
                        placeholder="Detailed product description..."
                    />
                </div>
            </div>
        </div>
    );
};

export default ContentTab;
