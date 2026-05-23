import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Search, 
    RotateCcw, 
    MessageSquare, 
    Eye,
    ChevronDown,
    X,
    ClipboardList,
    Filter,
    Box
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ColumnManager from './Components/ColumnManager';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel';
import OrderPagination from '../Orders/Components/OrderPagination';

const statusTemplates = {
    pending: [
        { id: 'pending_default', name: 'Default Pending Note', text: 'We are currently reviewing your return request. We will update you shortly.' }
    ],
    approved: [
        { id: 'approved_default', name: 'Default Approval Note', text: 'Your return request has been approved. Please pack the item securely and ship it to our warehouse. Once we receive it, we will process the next steps.' },
        { id: 'approved_shipping_label', name: 'Approval with Shipping Instructions', text: 'Your return request is approved. Please ship the item back to our main warehouse: 123 Warehouse St, City. Please include the return ID on the box.' }
    ],
    received: [
        { id: 'received_default', name: 'Default Received Note', text: 'We have received your returned item at our warehouse. We are inspecting the item condition and will update you shortly.' },
        { id: 'received_inspection', name: 'Under Inspection Note', text: 'Returned item is received and currently undergoing technical inspection to verify the reported issue.' }
    ],
    refunded: [
        { id: 'refunded_default', name: 'Default Refunded Note', text: 'Your refund has been processed. The amount has been returned to your original payment method. It may take 3-5 business days to reflect in your account.' },
        { id: 'refunded_wallet', name: 'Refunded to Wallet/Store Credit', text: 'Your return is complete. The refund amount has been added as store credit/wallet balance to your account.' }
    ],
    exchanged: [
        { id: 'exchanged_default', name: 'Default Exchange Note', text: 'Your exchange request is complete. The replacement product has been shipped to your address. Tracking details will be shared soon.' },
        { id: 'exchanged_handover', name: 'Exchange Handover Complete', text: 'The exchange item has been prepared and handed over to the courier partner for delivery.' }
    ],
    rejected: [
        { id: 'rejected_default', name: 'Default Rejection Note', text: 'We regret to inform you that your return request has been rejected because the returned item does not meet our return policy guidelines.' },
        { id: 'rejected_physical_damage', name: 'Rejection due to Physical Damage', text: 'Your return request is rejected because the item showed signs of physical damage/misuse that are not covered under our warranty/return policy.' }
    ]
};

const ReturnListPage = ({ auth, returns, filters, stats }) => {
    const [search, setSearch] = useState(filters?.search || '');
    const [statusTab, setStatusTab] = useState(filters?.status || 'all');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const allColumns = [
        { id: 'return_id', label: 'Return ID' },
        { id: 'order_number', label: 'Order #' },
        { id: 'customer', label: 'Customer' },
        { id: 'product', label: 'Product / Qty' },
        { id: 'reason', label: 'Reason' },
        { id: 'status', label: 'Status' },
    ];
    const [visibleColumns, setVisibleColumns] = useState([
        'return_id', 'order_number', 'customer', 'product', 'reason', 'status'
    ]);

    const toggleColumn = (id) => {
        setVisibleColumns(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const activeFilterCount = [
        filters?.reason && filters.reason !== 'all',
        filters?.status && filters.status !== 'all',
    ].filter(Boolean).length;

    const activeColCount = visibleColumns.length + 1;
    
    // Status Modal State
    const [statusModal, setStatusModal] = useState({
        show: false,
        returnItem: null,
        status: '',
        admin_note: ''
    });

    const [selectedTemplateId, setSelectedTemplateId] = useState('');

    useEffect(() => {
        if (statusModal.status) {
            const templates = statusTemplates[statusModal.status] || [];
            if (templates.length > 0) {
                const allTemplateTexts = Object.values(statusTemplates).flat().map(t => t.text);
                if (!statusModal.admin_note || allTemplateTexts.includes(statusModal.admin_note)) {
                    setStatusModal(prev => ({ ...prev, admin_note: templates[0].text }));
                    setSelectedTemplateId(templates[0].id);
                }
            } else {
                setSelectedTemplateId('');
            }
        } else {
            setSelectedTemplateId('');
        }
    }, [statusModal.status]);

    useEffect(() => {
        const start = () => setIsProcessing(true);
        const finish = () => setIsProcessing(false);
        const unbindStart = router.on('start', start);
        const unbindFinish = router.on('finish', finish);
        return () => {
            unbindStart();
            unbindFinish();
        };
    }, []);

    // Handle filter changes with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        router.get(route('admin.logistics.returns.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleTabChange = (status) => {
        setStatusTab(status);
        const newFilters = { ...filters, status: status === 'all' ? undefined : status, page: 1 };
        router.get(route('admin.logistics.returns.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatusTab('all');
        router.get(route('admin.logistics.returns.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handlePerPageChange = (e) => {
        handleFilterChange('per_page', e.target.value);
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const handleOpenStatusModal = (item) => {
        setStatusModal({
            show: true,
            returnItem: item,
            status: item.status,
            admin_note: item.admin_note || ''
        });
    };

    const handleUpdateStatusSubmit = (e) => {
        e.preventDefault();
        router.patch(route('admin.logistics.returns.update', statusModal.returnItem.id), {
            status: statusModal.status,
            admin_note: statusModal.admin_note
        }, {
            onSuccess: () => {
                setStatusModal({ show: false, returnItem: null, status: '', admin_note: '' });
            }
        });
    };

    const tabs = [
        { key: 'all', label: 'All Requests', count: stats.total },
        { key: 'pending', label: 'Pending', count: stats.pending },
        { key: 'approved', label: 'Approved', count: stats.approved },
        { key: 'received', label: 'Received', count: stats.received },
        { key: 'refunded', label: 'Refunded', count: stats.refunded },
        { key: 'exchanged', label: 'Exchanged', count: stats.exchanged },
    ];

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Returns & Refunds Management" />

            {/* Header Section: Matches OrderListPage Layout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Returns & Refunds</h1>
                    <p className="text-[#6d7175] text-[13px] mt-0.5 font-medium">Process and audit customer product return requests</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="h-[36px] px-4 bg-white border border-[#d1d1d1] text-[#202223] rounded-[4px] font-bold text-[12px] hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <RotateCcw size={14} className="text-[#008060]" /> Reset Filters
                    </button>
                </div>
            </div>

            {/* Outer Container matching OrderListPage */}
            <div className="bg-white rounded-[8px] border border-[#ebebeb] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                
                {/* Stats Overview Tabs matching OrderStats */}
                <div className="flex items-center border-b border-[#ebebeb] px-2 overflow-x-auto scrollbar-hide bg-white">
                    {tabs.map((tab) => {
                        const isActive = statusTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                className={cn(
                                    "relative py-3 px-2 text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 min-w-fit",
                                    isActive
                                        ? 'text-[#008060] font-bold'
                                        : 'text-[#6d7175] hover:text-[#202223] hover:bg-[#f6f6f7]'
                                )}
                            >
                                <span>{tab.label}</span>
                                <span className={cn(
                                    "text-[11px] px-1.5 py-0.5 rounded-full font-bold",
                                    isActive ? "bg-[#e4f1ef] text-[#008060]" : "bg-[#f1f1f1] text-[#6d7175]"
                                )}>
                                    {tab.count ?? 0}
                                </span>
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008060] rounded-t-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Toolbar matching OrderToolbar */}
                <div className="border-b border-[#ebebeb] bg-white relative z-30">
                    <div className="p-3 flex items-center justify-between gap-4">
                        {/* --- Search Box --- */}
                        <div className="relative w-[320px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" size={14} />
                            <TextInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search order #, customer..."
                                className="pl-9 pr-9"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#008060] transition-colors">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* --- Filters & Actions Group --- */}
                        <div className="flex items-center gap-2">
                            {/* Filters Toggle */}
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className={cn(
                                    "h-[36px] px-3 rounded-[4px] border text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-sm",
                                    showAdvanced || activeFilterCount > 0
                                        ? "bg-[#f1f1f1] border-[#d1d1d1] text-[#202223]"
                                        : "bg-white border-[#d1d1d1] text-[#202223] hover:bg-[#f6f6f7]"
                                )}
                            >
                                <Filter size={14} className="text-[#6d7175]" />
                                More Filters
                                {activeFilterCount > 0 && (
                                    <span className="bg-[#ebebeb] text-[#202223] w-4 h-4 text-[10px] rounded-full flex items-center justify-center ml-1 font-bold border border-[#d1d1d1]">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            <button onClick={handleReset} className="h-[36px] w-[36px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[4px] hover:bg-[#f6f6f7] transition-all group shadow-sm" title="Reset Filters">
                                <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                            </button>

                            <ColumnManager
                                columns={allColumns}
                                visibleColumns={visibleColumns}
                                toggleColumn={toggleColumn}
                            />
                        </div>
                    </div>

                    {/* Advanced Filters Drawer */}
                    {showAdvanced && (
                        <div className="px-3 pb-3 pt-1 bg-[#f9fafb] border-t border-[#ebebeb]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                <div className="col-span-1">
                                    <label className="text-[10px] font-bold text-[#6d7175] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Filter size={11} />
                                        Return Reason
                                    </label>
                                    <SelectInput
                                        value={filters?.reason || 'all'}
                                        onChange={(e) => handleFilterChange('reason', e.target.value)}
                                        options={[
                                            { id: 'all', name: 'All Reasons' },
                                            { id: 'Defective', name: 'Defective' },
                                            { id: 'Damaged', name: 'Damaged' },
                                            { id: 'Incorrect Item', name: 'Incorrect Item' },
                                            { id: 'Wrong Size', name: 'Wrong Size' },
                                            { id: 'Not as Described', name: 'Not as Described' }
                                        ]}
                                        className="bg-white shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table matching OrderTable structure */}
                <div className="overflow-x-auto custom-scrollbar relative">
                    <table className="w-full text-left border-collapse min-w-[1100px] table-fixed">
                        <thead className="bg-[#f7f7f7] text-[#303030] text-[12px] font-semibold border-b border-[#ebebeb]">
                            <tr>
                                {visibleColumns.includes('return_id') && <th className="px-4 py-2 w-[120px]">Return ID</th>}
                                {visibleColumns.includes('order_number') && <th className="px-4 py-2 w-[130px]">Order #</th>}
                                {visibleColumns.includes('customer') && <th className="px-4 py-2 w-[220px]">Customer</th>}
                                {visibleColumns.includes('product') && <th className="px-4 py-2 w-[280px]">Product / Qty</th>}
                                {visibleColumns.includes('reason') && <th className="px-4 py-2 w-[220px]">Reason</th>}
                                {visibleColumns.includes('status') && <th className="px-4 py-2 w-[150px]">Status</th>}
                                <th className="px-6 py-2 w-[180px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebebeb] bg-white">
                            {returns.data.length === 0 ? (
                                <tr>
                                    <td colSpan={activeColCount} className="px-7 py-24 text-center">
                                        <ClipboardList size={40} className="mx-auto mb-4 text-[#c3c4ca]" />
                                        <p className="text-[16px] font-bold text-[#202223]">No return requests found</p>
                                        <p className="text-[13px] text-[#6d7175] mt-1">Try refining your search or filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                returns.data.map((item) => (
                                    <tr key={item.id} className="group bg-white hover:bg-[#f8f9fa] transition-colors border-b border-[#ebebeb] last:border-0 h-[48px]">
                                        {visibleColumns.includes('return_id') && (
                                            <td className="px-4 py-2 text-[12px] font-semibold text-[#202223] align-middle">
                                                RET-{item.id}
                                            </td>
                                        )}
                                        {visibleColumns.includes('order_number') && (
                                            <td className="px-4 py-2 align-middle">
                                                <span className="text-[12px] font-bold text-[#202223]">#{item.order?.order_number || 'N/A'}</span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('customer') && (
                                            <td className="px-4 py-2 align-middle">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[12px] font-bold text-[#005bd3] truncate">
                                                        {item.user?.name || 'N/A'}
                                                    </span>
                                                    <span className="text-[11px] text-[#6d7175] font-normal truncate">
                                                        {item.user?.email || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.includes('product') && (
                                            <td className="px-4 py-2 align-middle">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    {/* Product Image */}
                                                    <div className="w-8 h-8 rounded bg-[#f6f6f7] border border-[#ebebeb] flex items-center justify-center shrink-0 overflow-hidden">
                                                        {item.product?.primary_image?.full_url || item.product?.primaryImage?.full_url ? (
                                                            <img 
                                                                src={item.product?.primary_image?.full_url || item.product?.primaryImage?.full_url} 
                                                                alt={item.item?.product_name || item.product?.name} 
                                                                className="w-full h-full object-contain"
                                                            />
                                                        ) : (
                                                            <Box size={14} className="text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[12px] font-bold text-[#202223] truncate" title={item.item?.product_name || item.product?.name}>
                                                            {item.item?.product_name || item.product?.name || 'Product Info'}
                                                        </span>
                                                        <span className="text-[11px] text-[#6d7175] font-medium">Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.includes('reason') && (
                                            <td className="px-4 py-2 align-middle">
                                                <span className="text-[12px] text-[#202223] font-medium block truncate" title={item.reason}>{item.reason}</span>
                                                {item.details && (
                                                    <span className="text-[10px] text-[#6d7175] font-normal italic block truncate" title={item.details}>"{item.details}"</span>
                                                )}
                                            </td>
                                        )}
                                        {visibleColumns.includes('status') && (
                                            <td className="px-4 py-2 align-middle">
                                                <span className={cn(
                                                    "inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold tracking-tight uppercase border",
                                                    item.status === 'pending' ? 'bg-[#fff4e5] text-[#b98900] border-[#ffe2b5]' :
                                                    item.status === 'approved' ? 'bg-[#f0f1f7] text-[#5c6ac4] border-[#e1e3ea]' :
                                                    item.status === 'received' ? 'bg-[#e4f1ef] text-[#005bd3] border-[#a2c1f9]' :
                                                    item.status === 'refunded' ? 'bg-[#e4f1ef] text-[#008060] border-[#aee9d1]' :
                                                    item.status === 'exchanged' ? 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]' :
                                                    'bg-[#fbeae5] text-[#bf0711] border-[#f9d3d0]'
                                                )}>
                                                    {item.status}
                                                </span>
                                                {item.admin_note && (
                                                    <span className="block text-[9.5px] text-[#008060] font-semibold mt-0.5 flex items-center gap-0.5">
                                                        <MessageSquare size={9} /> Note logged
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                        <td className="px-6 py-2 text-right align-middle">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link 
                                                    href={item.order ? route('admin.orders.show', item.order.id) : '#'} 
                                                    className="h-[26px] w-[26px] flex items-center justify-center bg-[#8c8c8c] text-white rounded-[2px] hover:bg-[#595959] transition-all"
                                                    title="View Order Details"
                                                >
                                                    <Eye size={12} />
                                                </Link>
                                                <button
                                                    onClick={() => handleOpenStatusModal(item)}
                                                    className="h-[26px] px-2.5 flex items-center justify-center text-[11.5px] font-bold text-white bg-[#008060] hover:bg-[#006e52] rounded-[2px] transition-all shadow-sm shadow-[#008060]/10"
                                                >
                                                    Update Status
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Reused OrderPagination Component directly for unified layout and styling */}
                <OrderPagination
                    orders={returns}
                    filters={filters}
                    handlePerPageChange={handlePerPageChange}
                    handlePageChange={handlePageChange}
                />
            </div>

            {/* Modal rewritten with headlessui Dialog to match DeleteConfirmModal and project standard */}
            <Transition show={statusModal.show} as={Fragment}>
                <Dialog as="div" className="relative z-[1000]" onClose={() => setStatusModal({ show: false, returnItem: null, status: '', admin_note: '' })}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px]" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setStatusModal({ show: false, returnItem: null, status: '', admin_note: '' })}
                                        className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 transition-colors p-1 z-10"
                                    >
                                        <X size={18} />
                                    </button>

                                    <form onSubmit={handleUpdateStatusSubmit}>
                                        <div className="bg-white px-4 pt-5 pb-4 sm:p-7 sm:pb-5">
                                            <Dialog.Title as="h3" className="text-[16px] font-bold text-slate-900 border-b border-[#ebebeb] pb-3 mb-4">
                                                Update Return Request Status
                                            </Dialog.Title>

                                            <div className="space-y-4">
                                                <div>
                                                    <InputLabel value="Select Status" className="mb-1.5" />
                                                    <SelectInput
                                                        value={statusModal.status}
                                                        onChange={(e) => setStatusModal(prev => ({ ...prev, status: e.target.value }))}
                                                        options={[
                                                            { id: 'pending', name: 'Pending Review' },
                                                            { id: 'approved', name: 'Approved (Awaiting Return Shipment)' },
                                                            { id: 'received', name: 'Received (Item Received at Warehouse)' },
                                                            { id: 'refunded', name: 'Refunded (Amount Returned to Customer)' },
                                                            { id: 'exchanged', name: 'Exchanged (Replacement Shipped to Customer)' },
                                                            { id: 'rejected', name: 'Rejected' }
                                                        ]}
                                                        showSearch={false}
                                                        placeholder="Select Status"
                                                        className="w-full"
                                                    />
                                                </div>

                                                {statusModal.status && (statusTemplates[statusModal.status] || []).length > 0 && (
                                                    <div>
                                                        <InputLabel value="Select Message Template" className="mb-1.5" />
                                                        <SelectInput
                                                            value={selectedTemplateId}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setSelectedTemplateId(val);
                                                                const tpl = (statusTemplates[statusModal.status] || []).find(t => t.id === val);
                                                                if (tpl) {
                                                                    setStatusModal(prev => ({ ...prev, admin_note: tpl.text }));
                                                                }
                                                            }}
                                                            options={statusTemplates[statusModal.status] || []}
                                                            showSearch={false}
                                                            placeholder="Select Template"
                                                            className="w-full"
                                                        />
                                                    </div>
                                                )}

                                                <div>
                                                    <InputLabel value="Admin Processing Note" className="mb-1.5" />
                                                    <TextArea
                                                        rows={4}
                                                        placeholder="Add notes about decision, refund transaction info, or return shipping labels..."
                                                        value={statusModal.admin_note}
                                                        onChange={(e) => setStatusModal(prev => ({ ...prev, admin_note: e.target.value }))}
                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-7 gap-3 border-t border-[#ebebeb]">
                                            <button
                                                type="submit"
                                                className="inline-flex w-full h-[36px] justify-center items-center rounded-[4px] bg-[#008060] hover:bg-[#006e52] px-5 text-[12px] font-bold text-white shadow-md sm:w-auto transition-all active:scale-[0.98]"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setStatusModal({ show: false, returnItem: null, status: '', admin_note: '' })}
                                                className="mt-3 inline-flex w-full h-[36px] justify-center items-center rounded-[4px] bg-white px-5 text-[12px] font-bold text-slate-700 shadow-sm border border-[#d1d1d1] hover:bg-slate-50 sm:mt-0 sm:w-auto transition-all active:scale-[0.98]"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AdminLayout>
    );
};

export default ReturnListPage;
