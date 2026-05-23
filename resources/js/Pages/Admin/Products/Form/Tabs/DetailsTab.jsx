import React from 'react';
import RichTextEditor from '@/Components/RichTextEditor';

const DetailsTab = ({ data, setData }) => {
    return (
        <div className="space-y-6 ">
            {/* Benefits Section */}
            <div className="space-y-1">
                <div className="border-b border-[#f6f6f7] pb-3 mb-4">
                    <h3 className="text-[14px] font-bold text-[#202223] mb-1">Benefits (উপকারিতা)</h3>
                    <p className="text-[12px] text-[#6d7175]">Highlight the benefits of using this product.</p>
                </div>
                <div className="pt-1">
                    <RichTextEditor
                        value={data.benefits || ''}
                        onChange={val => setData("benefits", val)}
                        placeholder="Write the benefits here..."
                    />
                </div>
            </div>

            {/* Side Effects Section */}
            <div className="space-y-1">
                <div className="border-b border-[#f6f6f7] pb-3 mb-4 mt-6">
                    <h3 className="text-[14px] font-bold text-[#202223] mb-1">Side Effects (পার্শ্বপ্রতিক্রিয়া)</h3>
                    <p className="text-[12px] text-[#6d7175]">Any known side effects or warnings.</p>
                </div>
                <div className="pt-1">
                    <RichTextEditor
                        value={data.side_effects || ''}
                        onChange={val => setData("side_effects", val)}
                        placeholder="Write any side effects or warnings here..."
                    />
                </div>
            </div>

            {/* Formula / Ingredients Section */}
            <div className="space-y-1">
                <div className="border-b border-[#f6f6f7] pb-3 mb-4 mt-6">
                    <h3 className="text-[14px] font-bold text-[#202223] mb-1">Formula / Ingredients</h3>
                    <p className="text-[12px] text-[#6d7175]">List of ingredients or the formula used.</p>
                </div>
                <div className="pt-1">
                    <RichTextEditor
                        value={data.formula || ''}
                        onChange={val => setData("formula", val)}
                        placeholder="Write the formula or ingredients here..."
                    />
                </div>
            </div>
        </div>
    );
};

export default DetailsTab;
