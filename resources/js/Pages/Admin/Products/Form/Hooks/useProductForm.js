import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import Notify from '@/Utils/Notify';
import axios from 'axios';

/**
 * Custom Hook: useProductForm
 * 
 * Manages the state and logic for product creation and editing.
 * Handles form validation, draft persistence, media uploads,
 * attribute fetching, and quick-add actions for brands/categories.
 */
export const useProductForm = (initialBrands, initialCategories, warehouses) => {
    // Memoize initial sorting to avoid re-sorting on every render
    const memoizedBrands = useMemo(() => (initialBrands || []).sort((a, b) => a.name.localeCompare(b.name)), [initialBrands]);
    const memoizedCategories = useMemo(() => (initialCategories || []).sort((a, b) => a.name.localeCompare(b.name)), [initialCategories]);

    const [localBrands, setLocalBrands] = useState(memoizedBrands);
    const [localCategories, setLocalCategories] = useState(memoizedCategories);

    const [isAddingBrand, setIsAddingBrand] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newBrandName, setNewBrandName] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [isSavingQuick, setIsSavingQuick] = useState(false);

    const { data, setData, post, processing, errors } = useForm('CreateProduct', {
        name: '',
        slug: '',
        sku: '',
        brand_id: '',
        category_id: '',
        sub_category_id: '',
        sub_sub_category_id: '',
        status: 1,
        stock: 0,
        warranty: '',
        is_featured: 0,
        price: '',
        discount_price: '',
        has_emi: false,
        emi_monthly: '',
        emi_duration: '',
        description: '',
        benefits: '',
        side_effects: '',
        formula: '',
        attributes: [],
        meta_title: '',
        meta_description: '',
        tags: '',
        thumbnail: null,
        gallery: [],
        warehouse_stocks: warehouses.map(w => ({
            warehouse_id: w.id,
            name: w.name,
            quantity: 0,
            low_stock_threshold: 5,
        }))
    });

    const [previews, setPreviews] = useState({
        thumbnail: null,
        gallery: []
    });

    // SKU Generator
    const generateSKU = useCallback(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'SKU-';
        for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
        return result;
    }, []);

    // Slug Generator - Optimized to only run when name changes and is non-empty
    useEffect(() => {
        if (!data.name) return;
        const slug = data.name.toLowerCase().trim().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
        if (slug !== data.slug) {
            setData("slug", slug);
        }
    }, [data.name]);

    // Persistence Logic - Optimized draft loading
    useEffect(() => {
        const savedData = localStorage.getItem('product_form_draft');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const newData = { ...parsed };
                delete newData.thumbnail;
                delete newData.gallery;
                
                // Only set warehouse stocks if they exist and match current warehouses
                if (!parsed.warehouse_stocks || parsed.warehouse_stocks.length === 0) {
                    newData.warehouse_stocks = warehouses.map(w => ({
                        warehouse_id: w.id, name: w.name, quantity: 0, low_stock_threshold: 5,
                    }));
                }
                
                Object.keys(newData).forEach(key => setData(key, newData[key]));
            } catch (e) { console.error("Draft error", e); }
        }
    }, []); // Only run once on mount

    // Debounced Draft Saving
    useEffect(() => {
        const timeout = setTimeout(() => {
            const { thumbnail, gallery, ...rest } = data;
            localStorage.setItem('product_form_draft', JSON.stringify(rest));
        }, 2000); // Increased debounce to 2s for better performance
        return () => clearTimeout(timeout);
    }, [data]);

    // Attribute Fetching - Optimized with useCallback
    const fetchAttributes = useCallback(async () => {
        const deepestCategoryId = data.sub_sub_category_id || data.sub_category_id || data.category_id;
        if (!deepestCategoryId) return;

        try {
            const response = await axios.get(route('admin.categories.attributes'), {
                params: { category_ids: [deepestCategoryId] }
            });
            const attributes = response.data;
            const newAttrs = attributes.map(attr => {
                const existing = data.attributes.find(a => a.id === attr.id);
                return {
                    id: attr.id, name: attr.name, type: attr.type, is_required: attr.is_required,
                    value: existing ? existing.value : '', options: attr.values || [],
                    unit: attr.unit || '', placeholder: attr.placeholder || ''
                };
            });
            setData('attributes', newAttrs);
        } catch (err) {
            console.error('Attr error', err);
        }
    }, [data.category_id, data.sub_category_id, data.sub_sub_category_id]);

    useEffect(() => { fetchAttributes(); }, [data.category_id, data.sub_category_id, data.sub_sub_category_id]);

    // Media Logic
    const handleThumbnailChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { Notify.warning('File too large!'); return; }
            setData("thumbnail", file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviews(prev => ({ ...prev, thumbnail: reader.result }));
            reader.readAsDataURL(file);
        }
    }, [setData]);

    const handleGalleryChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        setData("gallery", [...data.gallery, ...files]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setPreviews(prev => ({ ...prev, gallery: [...prev.gallery, reader.result] }));
            reader.readAsDataURL(file);
        });
    }, [data.gallery, setData]);

    const removeGalleryImage = useCallback((index) => {
        setData("gallery", data.gallery.filter((_, i) => i !== index));
        setPreviews(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
    }, [data.gallery, setData]);

    // Form Validation - Optimized
    const isFormValid = useMemo(() => {
        const requiredFields = ['name', 'slug', 'sku', 'category_id', 'price'];
        const hasBaseFields = requiredFields.every(field => !!data[field]);
        const hasRequiredAttributes = data.attributes.every(attr => {
            if (attr.is_required) {
                if (Array.isArray(attr.value)) return attr.value.length > 0;
                return !!attr.value;
            }
            return true;
        });
        return hasBaseFields && hasRequiredAttributes;
    }, [data]);

    // Quick Add
    const handleQuickAddBrand = useCallback(async () => {
        if (!newBrandName) return;
        setIsSavingQuick(true);
        try {
            const response = await axios.post(route('admin.brands.store'), {
                name: newBrandName, slug: newBrandName.toLowerCase().trim().replace(/[^\w ]+/g, "").replace(/ +/g, "-"), status: 'active'
            }, { headers: { 'Accept': 'application/json' } });
            if (response.data.brand) {
                setLocalBrands(prev => [...prev, response.data.brand].sort((a, b) => a.name.localeCompare(b.name)));
                setData('brand_id', response.data.brand.id);
                setIsAddingBrand(false); setNewBrandName(''); Notify.success('Brand Added!');
            }
        } catch (err) { Notify.error('Action Failed!'); } finally { setIsSavingQuick(false); }
    }, [newBrandName, setData]);

    const handleSubmit = useCallback((e) => {
        if (e) e.preventDefault();
        post(route('admin.products.store'), {
            onSuccess: () => {
                localStorage.removeItem('product_form_draft');
                Notify.success('Product Published!');
            },
            onError: () => Notify.error('Submission Failed!')
        });
    }, [post]);

    return {
        data, setData, post, processing, errors,
        localBrands, localCategories,
        isAddingBrand, setIsAddingBrand,
        isAddingCategory, setIsAddingCategory,
        newBrandName, setNewBrandName,
        newCategoryName, setNewCategoryName,
        parentCategoryId, setParentCategoryId,
        isSavingQuick, previews,
        handleThumbnailChange, handleGalleryChange, removeGalleryImage,
        handleQuickAddBrand, generateSKU, fetchAttributes,
        canPublish: isFormValid, handleSubmit
    };
};

