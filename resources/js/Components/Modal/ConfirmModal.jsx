import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';

const ConfirmModal = ({ show, onClose, onConfirm, title, message, processing, type = 'warning', confirmText = 'Confirm' }) => {
    
    const isWarning = type === 'warning';
    
    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
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
                                    onClick={onClose}
                                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors p-1 z-10"
                                >
                                    <X size={18} />
                                </button>

                                <div className="bg-white px-4 pt-5 pb-4 sm:p-7 sm:pb-5">
                                    <div className="sm:flex sm:items-start">
                                        <div className={`mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-11 sm:w-11 ring-8 ${isWarning ? 'bg-amber-100 ring-amber-50' : 'bg-blue-100 ring-blue-50'}`}>
                                            {isWarning ? (
                                                <AlertTriangle className="h-6 w-6 text-amber-600" strokeWidth={2} />
                                            ) : (
                                                <CheckCircle className="h-6 w-6 text-blue-600" strokeWidth={2} />
                                            )}
                                        </div>

                                        <div className="mt-4 text-center sm:mt-0 sm:ml-5 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg font-bold text-slate-900">
                                                {title}
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-[14px] text-slate-500 leading-relaxed">
                                                    {message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-7 gap-3 border-t border-[#ebebeb]">
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={onConfirm}
                                        className={`inline-flex w-full h-[36px] justify-center items-center rounded-[4px] px-5 text-[12px] font-bold text-white shadow-lg sm:w-auto transition-all active:scale-[0.98] disabled:opacity-50 flex gap-2 ${isWarning ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                                    >
                                        {processing ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <span>{confirmText}</span>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 inline-flex w-full h-[36px] justify-center items-center rounded-[4px] bg-white px-5 text-[12px] font-bold text-slate-700 shadow-sm border border-[#d1d1d1] hover:bg-slate-50 sm:mt-0 sm:w-auto transition-all active:scale-[0.98]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ConfirmModal;
