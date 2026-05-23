import React, { useState, useRef } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, router } from '@inertiajs/react';
import { Plus, ShieldCheck } from 'lucide-react';
import PaymentCard from './Partials/PaymentCard';
import PaymentModal from './Partials/PaymentModal';

const PaymentMethods = ({ auth, cards }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        holder: '',
        number: '',
        expiry: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});

    // Refs for auto-focusing
    const expiryRef = useRef(null);
    const cvvRef = useRef(null);

    const validateLuhn = (number) => {
        let sum = 0;
        let shouldDouble = false;
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i));
            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10) === 0;
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.holder.trim()) newErrors.holder = "Cardholder name is required";

        const cleanNumber = formData.number.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cleanNumber)) {
            newErrors.number = "Invalid card number (16 digits required)";
        } else if (!validateLuhn(cleanNumber)) {
            newErrors.number = "Invalid card number (Luhn check failed)";
        }

        // Expiry Date Validation
        const expiryMatch = formData.expiry.match(/^(\d{2})\/(\d{2})$/);
        if (!expiryMatch) {
            newErrors.expiry = "Use MM/YY format";
        } else {
            const month = parseInt(expiryMatch[1]);
            const year = parseInt(`20${expiryMatch[2]}`);
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            if (month < 1 || month > 12) {
                newErrors.expiry = "Invalid month (01-12)";
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                newErrors.expiry = "Card has expired";
            }
        }

        if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = "Invalid CVV (3 digits required)";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            router.post(route('user.payment-methods.store'), formData, {
                onSuccess: () => {
                    setShowModal(false);
                    setFormData({ holder: '', number: '', expiry: '', cvv: '' });
                    setErrors({});
                },
                onError: (errs) => {
                    setErrors(errs);
                }
            });
        }
    };

    const handleInputChange = (field, value) => {
        let formattedValue = value;
        let fieldError = '';

        if (field === 'number') {
            const digits = value.replace(/\D/g, '').substring(0, 16);
            formattedValue = digits.match(/.{1,4}/g)?.join(' ') || digits;

            // Auto-focus expiry if 16 digits reached
            if (digits.length === 16) {
                setTimeout(() => expiryRef.current?.focus(), 10);
            }
        }

        if (field === 'expiry') {
            const digits = value.replace(/\D/g, '').substring(0, 4);

            // Prevent invalid month input (only check if 2 digits are entered)
            if (digits.length >= 2) {
                const month = parseInt(digits.substring(0, 2));
                if (month < 1 || month > 12) {
                    return; // Ignore input
                }
            }

            if (digits.length > 2) {
                formattedValue = `${digits.substring(0, 2)}/${digits.substring(2)}`;
            } else {
                formattedValue = digits;
            }

            // Real-time validation for expired date
            if (digits.length === 4) {
                const month = parseInt(digits.substring(0, 2));
                const year = parseInt(`20${digits.substring(2)}`);
                const now = new Date();
                const currentMonth = now.getMonth() + 1;
                const currentYear = now.getFullYear();

                if (year < currentYear || (year === currentYear && month < currentMonth)) {
                    fieldError = "Card has expired";
                } else {
                    setTimeout(() => cvvRef.current?.focus(), 10);
                }
            }
        }

        if (field === 'cvv') {
            formattedValue = value.replace(/\D/g, '').substring(0, 3);
        }

        setFormData(prev => ({ ...prev, [field]: formattedValue }));

        // Update errors in real-time
        setErrors(prev => {
            const newErrs = { ...prev };
            if (fieldError) {
                newErrs[field] = fieldError;
            } else {
                delete newErrs[field];
            }
            return newErrs;
        });
    };

    return (
        <UserLayout user={auth.user}>
            <Head title="Payment Methods" />
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-[1px] border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#081621] tracking-tight">Payment Methods</h1>
                        <p className="text-slate-400 text-[11px] font-medium mt-1">Manage your saved cards and payment preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(cards.data || []).map((card) => (
                        <PaymentCard key={card.id} card={card} />
                    ))}

                    {/* Add New Card Placeholder */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="h-48 border-2 border-dashed border-slate-200 rounded-[1px] flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-[#008060] hover:border-[#008060]/30 transition-all bg-white/50 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#008060]/10 transition-colors">
                            <Plus size={24} className="group-hover:text-[#008060]" />
                        </div>
                        <span className="text-[12px] font-bold">Add New Card</span>
                    </button>
                </div>

                {/* Security Note */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-[1px] flex items-start gap-4">
                    <ShieldCheck className="text-blue-500 shrink-0" size={20} />
                    <div>
                        <h4 className="text-[13px] font-bold text-blue-900">Secure Payment Processing</h4>
                        <p className="text-[11px] text-blue-700 mt-0.5">Your card information is encrypted and stored securely. We do not store your full card details on our servers to ensure maximum safety.</p>
                    </div>
                </div>
            </div>

            {/* Add Card Modal */}
            <PaymentModal 
                show={showModal}
                onClose={() => setShowModal(false)}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                errors={errors}
                expiryRef={expiryRef}
                cvvRef={cvvRef}
            />
        </UserLayout>
    );
};

export default PaymentMethods;
