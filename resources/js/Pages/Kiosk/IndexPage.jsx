import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Wrench, Smartphone, ArrowLeft, Clock } from 'lucide-react';
import axios from 'axios';

// Import Modular Kiosk Views
import HomeView from './Components/HomeView';
import QueueSuccessView from './Components/QueueSuccessView';
import QuickTokenView from './Components/QuickTokenView';
import PreRegisterView from './Components/PreRegisterView';
import StatusCheckerView from './Components/StatusCheckerView';
import WarrantyCheckerView from './Components/WarrantyCheckerView';
import ProductsCatalogView from './Components/ProductsCatalogView';
import ThermalInvoiceView from './Components/ThermalInvoiceView';
import QueueBoardView from './Components/QueueBoardView';

const IndexPage = () => {
    // Kiosk Modes: 'home', 'token', 'pre-register', 'status', 'warranty', 'products', 'invoice', 'queue-board'
    const [mode, setMode] = useState('home');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Kiosk Ticket receipt/token details
    const [ticketDetails, setTicketDetails] = useState(null);
    const [countdown, setCountdown] = useState(15);

    // Pre-Register Repair Form Fields
    const [deviceType, setDeviceType] = useState('Smartphone');
    const [brand, setBrand] = useState('');
    const [modelName, setModelName] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [customerNotes, setCustomerNotes] = useState('');

    // Status Checker / Invoice State
    const [searchQuery, setSearchQuery] = useState('');
    const [foundTickets, setFoundTickets] = useState([]);
    const [searching, setSearching] = useState(false);
    const [activeInvoice, setActiveInvoice] = useState(null);

    // Warranty Checker State
    const [warrantyDetails, setWarrantyDetails] = useState(null);

    // Product Browser State
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Live serving counters preview
    const [activeServing, setActiveServing] = useState([]);

    const fetchActiveServing = async () => {
        try {
            const response = await axios.get(route('kiosk.queue-state'));
            if (response.data.success) {
                setActiveServing(response.data.serving);
            }
        } catch (err) {
            console.error('Error fetching live serving preview:', err);
        }
    };

    // Refresh serving preview on home load & every 10 seconds
    useEffect(() => {
        if (mode === 'home') {
            fetchActiveServing();
            const interval = setInterval(fetchActiveServing, 10000);
            return () => clearInterval(interval);
        }
    }, [mode]);

    // Auto-reset back to Home splash screen after showing token receipt
    useEffect(() => {
        let timer;
        if (ticketDetails && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (ticketDetails && countdown === 0) {
            handleGoHome();
        }
        return () => clearTimeout(timer);
    }, [ticketDetails, countdown]);

    const handleGoHome = () => {
        setMode('home');
        setName('');
        setPhone('');
        setTicketDetails(null);
        setError('');
        setCountdown(15);
        setDeviceType('Smartphone');
        setBrand('');
        setModelName('');
        setSerialNumber('');
        setCustomerNotes('');
        setSearchQuery('');
        setFoundTickets([]);
        setActiveInvoice(null);
        setWarrantyDetails(null);
    };

    // 1. Generate Walk-in Quick Queue Token
    const handleJoinQueueSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            setError('Please enter both your name and phone number.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await axios.post(route('kiosk.join'), { name, phone });
            if (response.data.success) {
                setTicketDetails(response.data);
            } else {
                setError('Something went wrong. Please ask the desk receptionist.');
            }
        } catch (err) {
            setError('Could not connect to counter service. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 2. Pre-Register Custom Repair Ticket
    const handlePreRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim() || !brand.trim() || !modelName.trim()) {
            setError('Please fill in all required fields marked with *');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await axios.post(route('kiosk.pre-register'), {
                name,
                phone,
                device_type: deviceType,
                brand,
                model_name: modelName,
                serial_number: serialNumber,
                customer_notes: customerNotes
            });

            if (response.data.success) {
                setTicketDetails(response.data);
            } else {
                setError('Failed to pre-register. Please try again.');
            }
        } catch (err) {
            setError('Server connection error. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. Search Service Status
    const handleStatusQuery = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        setError('');
        setFoundTickets([]);

        try {
            const response = await axios.get(route('kiosk.check-status'), {
                params: { query: searchQuery }
            });
            if (response.data.success) {
                setFoundTickets(response.data.repairs);
                if (response.data.repairs.length === 0) {
                    setError('No records found. Try checking your ticket or phone number.');
                }
            }
        } catch (err) {
            setError('Error loading ticket status.');
        } finally {
            setSearching(false);
        }
    };

    // 4. Check Warranty by Serial Number
    const handleWarrantyQuery = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        setError('');
        setWarrantyDetails(null);

        try {
            const response = await axios.get(route('kiosk.check-warranty'), {
                params: { query: searchQuery }
            });
            if (response.data.success) {
                setWarrantyDetails(response.data);
            } else {
                setError(response.data.message || 'No record found.');
            }
        } catch (err) {
            setError('Error matching serial number.');
        } finally {
            setSearching(false);
        }
    };

    // 5. Load Products Catalog
    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await axios.get(route('kiosk.products'));
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setError('');
        setSearchQuery('');
        setFoundTickets([]);
        setWarrantyDetails(null);
        setActiveInvoice(null);
        if (newMode === 'products') {
            fetchProducts();
        }
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#f6f6f7] text-[#202223] flex flex-col justify-between p-4 sm:p-6 select-none relative overflow-hidden font-sans print:bg-white print:text-black print:p-0">
            <Head title="Self-Service Shop Kiosk" />

            {/* --- Kiosk Header (Integrated into light style) --- */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebebeb] pb-4 relative z-10 print:hidden">
                <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://www.startech.com.bd/image/catalog/logo.png"
                            alt="Star Tech Logo"
                            className="h-8 sm:h-9 w-auto"
                        />
                        <div className="border-l border-[#ebebeb] pl-3.5">
                            <h1 className="text-[14px] sm:text-[15px] font-extrabold tracking-tight text-[#202223] leading-none">Service Hub</h1>
                            <p className="text-[#008060] text-[9px] sm:text-[9.5px] font-extrabold tracking-wider mt-1">Self-Service Touchscreen Kiosk</p>
                        </div>
                    </div>
                    
                    {/* Time (visible on mobile in header bar) */}
                    <div className="sm:hidden text-[11px] text-[#6d7175] font-bold bg-white px-2.5 py-1 rounded-[6px] flex items-center gap-1 border border-[#ebebeb]">
                        <Clock size={12} className="text-[#008060]" />
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    {mode !== 'home' && (
                        <button
                            onClick={handleGoHome}
                            className="h-[34px] sm:h-[36px] px-3.5 rounded-[6px] bg-white hover:bg-[#f4f6f8] border border-[#babfc3] text-[11.5px] sm:text-[12px] font-bold flex items-center gap-1.5 text-[#202223] transition-all active:scale-[0.98]"
                        >
                            <ArrowLeft size={13} />
                            Back to Home
                        </button>
                    )}
                    <div className="hidden sm:flex text-[12px] text-[#6d7175] font-bold bg-white px-3 py-1.5 rounded-[6px] items-center gap-1.5 border border-[#ebebeb]">
                        <Clock size={13} className="text-[#008060]" />
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </header>

            {/* --- Main Workspace --- */}
            <main className="flex-1 flex items-center justify-center w-full relative z-10 py-8 print:py-0 print:block">
                {ticketDetails ? (
                    <QueueSuccessView
                        ticketDetails={ticketDetails}
                        countdown={countdown}
                        handleGoHome={handleGoHome}
                    />
                ) : (
                    <>
                        {mode === 'home' && (
                            <HomeView 
                                handleModeChange={handleModeChange} 
                                activeServing={activeServing} 
                            />
                        )}

                        {mode === 'token' && (
                            <QuickTokenView
                                name={name}
                                setName={setName}
                                phone={phone}
                                setPhone={setPhone}
                                error={error}
                                isSubmitting={isSubmitting}
                                handleSubmit={handleJoinQueueSubmit}
                            />
                        )}

                        {mode === 'pre-register' && (
                            <PreRegisterView
                                name={name}
                                setName={setName}
                                phone={phone}
                                setPhone={setPhone}
                                deviceType={deviceType}
                                setDeviceType={setDeviceType}
                                brand={brand}
                                setBrand={setBrand}
                                modelName={modelName}
                                setModelName={setModelName}
                                serialNumber={serialNumber}
                                setSerialNumber={setSerialNumber}
                                customerNotes={customerNotes}
                                setCustomerNotes={setCustomerNotes}
                                error={error}
                                isSubmitting={isSubmitting}
                                handleSubmit={handlePreRegisterSubmit}
                            />
                        )}

                        {mode === 'status' && (
                            <StatusCheckerView
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                foundTickets={foundTickets}
                                searching={searching}
                                error={error}
                                handleSubmit={handleStatusQuery}
                            />
                        )}

                        {mode === 'warranty' && (
                            <WarrantyCheckerView
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                warrantyDetails={warrantyDetails}
                                searching={searching}
                                error={error}
                                handleSubmit={handleWarrantyQuery}
                            />
                        )}

                        {mode === 'products' && (
                            <ProductsCatalogView
                                products={products}
                                loadingProducts={loadingProducts}
                            />
                        )}

                        {mode === 'invoice' && (
                            <ThermalInvoiceView
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                foundTickets={foundTickets}
                                activeInvoice={activeInvoice}
                                setActiveInvoice={setActiveInvoice}
                                searching={searching}
                                error={error}
                                handleSubmit={handleStatusQuery}
                                handlePrintInvoice={handlePrintInvoice}
                            />
                        )}

                        {mode === 'queue-board' && (
                            <QueueBoardView />
                        )}
                    </>
                )}
            </main>

            {/* --- Kiosk Footer --- */}
            <footer className="text-center text-[11.5px] text-[#6d7175] border-t border-[#ebebeb] pt-4 relative z-10 flex flex-col md:flex-row md:justify-between items-center gap-2 print:hidden">
                <p>© {new Date().getFullYear()} Gadget Repair & Service Labs. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[#008060] font-semibold"><Smartphone size={12} /> Fast Check-In</span>
                    <span className="flex items-center gap-1.5 text-[#008060] font-semibold"><Wrench size={12} /> Instant Diagnostics</span>
                </div>
            </footer>
        </div>
    );
};

export default IndexPage;
