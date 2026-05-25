/**
 * ProductEditPage Component
 * 
 * Main entry point for the product editing workflow.
 * Shares common form components with ProductCreatePage.
 */
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// Icons
import {
    ShieldCheck, Layers, DollarSign, FileText, 
    Image as ImageIcon, Settings, ListChecks, Globe, Package
} from 'lucide-react';

// Form Components & Layout
import ProductFormHeader from '../Form/Layout/ProductFormHeader';
import ProductFormSidebar from '../Form/Layout/ProductFormSidebar';

// Form Tabs
import GeneralTab from '../Form/Tabs/GeneralTab';
import ClassificationTab from '../Form/Tabs/ClassificationTab';
import PricingTab from '../Form/Tabs/PricingTab';
import ContentTab from '../Form/Tabs/ContentTab';
import DetailsTab from '../Form/Tabs/DetailsTab';
import MediaTab from '../Form/Tabs/MediaTab';
import VariantsTab from '../Form/Tabs/VariantsTab';
import SEOTab from '../Form/Tabs/SEOTab';
import InventoryTab from '../Form/Tabs/InventoryTab';

// Hooks
import { useProductEdit } from '../Form/Hooks/useProductEdit';

const ProductEditPage = ({ auth, product, categories: initialCategories, brands: initialBrands, warehouses = [], global_variants = [] }) => {
    const [activeTab, setActiveTab] = useState('general');

    const form = useProductEdit(product, initialBrands, initialCategories, warehouses);
    const { data, setData, processing, errors, handleSubmit } = form;

    const tabs = [
        { id: 'general', label: 'General Info', icon: ShieldCheck },
        { id: 'classification', label: 'Brand & Category', icon: Layers },
        { id: 'pricing', label: 'Pricing', icon: DollarSign },
        { id: 'inventory', label: 'Inventory / Stocks', icon: Package },
        { id: 'content', label: 'Description', icon: FileText },
        { id: 'details', label: 'Extra Details', icon: ListChecks },
        { id: 'media', label: 'Images / Media', icon: ImageIcon },
        { id: 'variants', label: 'Variants (Size/Weight)', icon: Settings },
        { id: 'seo', label: 'SEO & Tags', icon: Globe },
    ];

    return (
        <AdminLayout user={auth?.user}>
            <Head title={`Edit Product: ${product.name}`} />

            <div className="min-h-screen">
                <ProductFormHeader
                    title="Edit Product"
                    subTitle={product.name}
                    processing={processing}
                    onSaveDraft={() => { setData('status', 0); handleSubmit(); }}
                    onUpdate={() => { setData('status', 1); handleSubmit(); }}
                    isEdit={true}
                />

                <form id="product-edit-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                    <ProductFormSidebar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                    <div className="lg:col-span-9 space-y-6">
                        <div className="bg-white rounded-[4px] border border-[#ebebeb] shadow-sm h-auto relative overflow-visible">
                            <div className="p-6">
                                {activeTab === 'general' && (
                                    <GeneralTab data={data} setData={setData} errors={errors} />
                                )}

                                {activeTab === 'classification' && (
                                    <ClassificationTab
                                        data={data} setData={setData}
                                        brands={form.localBrands} categories={form.localCategories}
                                        isAddingBrand={form.isAddingBrand} setIsAddingBrand={form.setIsAddingBrand}
                                        isAddingCategory={form.isAddingCategory} setIsAddingCategory={form.setIsAddingCategory}
                                        newBrandName={form.newBrandName} setNewBrandName={form.setNewBrandName}
                                        newCategoryName={form.newCategoryName} setNewCategoryName={form.setNewCategoryName}
                                        parentCategoryId={form.parentCategoryId} setParentCategoryId={form.setParentCategoryId}
                                        handleQuickAddBrand={form.handleQuickAddBrand} handleQuickAddCategory={form.handleQuickAddCategory}
                                        isSavingQuick={form.isSavingQuick}
                                    />
                                )}

                                {activeTab === 'pricing' && <PricingTab data={data} setData={setData} />}

                                {activeTab === 'inventory' && (
                                    <InventoryTab data={data} setData={setData} isEdit={true} />
                                )}

                                {activeTab === 'content' && (
                                    <ContentTab
                                        data={data} setData={setData}
                                    />
                                )}

                                {activeTab === 'details' && (
                                    <DetailsTab data={data} setData={setData} />
                                )}




                                {activeTab === 'variants' && (
                                    <VariantsTab data={data} setData={setData} globalVariants={global_variants} />
                                )}

                                {activeTab === 'media' && (
                                    <MediaTab
                                        data={data} setData={setData} previews={form.previews}
                                        handleThumbnailChange={form.handleThumbnailChange}
                                        removeThumbnail={form.removeThumbnail}
                                        handleGalleryChange={form.handleGalleryChange}
                                        removeGalleryImage={form.removeGalleryImage}
                                    />
                                )}

                                {activeTab === 'seo' && (
                                    <SEOTab data={data} setData={setData} />
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default ProductEditPage;
