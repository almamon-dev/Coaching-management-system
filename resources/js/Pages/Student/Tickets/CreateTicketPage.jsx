import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { ArrowLeft } from 'lucide-react';

// Custom Hooks
import { useCreateTicket } from './Hooks/useCreateTicket';

// Partials
import TicketForm from './Partials/TicketForm';

/**
 * Page Component: CreateTicketPage
 * 
 * High-density layout orchestrating support ticket creation.
 * Follows premium architecture by separating state/business logic (useCreateTicket hook)
 * from direct rendering components (TicketForm partial).
 */
const CreateTicketPage = ({ auth }) => {
    const {
        data,
        setData,
        processing,
        errors,
        currentStep,
        setCurrentStep,
        selectDepartment,
        goToNextStep,
        goToPrevStep,
        isStepValid,
        filePreviews,
        handleFileChange,
        removeFile,
        handleSubmit
    } = useCreateTicket();

    return (
        <UserLayout user={auth?.user}>
            <Head title="Open Support Ticket" />

            <div className="max-w-full mx-auto space-y-6">
                {/* --- Back Shortcut Header --- */}
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-[20px] font-bold text-[#202223] tracking-tight">Open Support Ticket</h1>
                        <p className="text-[#6d7175] text-[13px] font-medium mt-0.5">Submit a new customer service ticket for support.</p>
                    </div>
                </div>

                {/* --- Form Box --- */}
                <TicketForm
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    selectDepartment={selectDepartment}
                    goToNextStep={goToNextStep}
                    goToPrevStep={goToPrevStep}
                    isStepValid={isStepValid}
                    filePreviews={filePreviews}
                    handleFileChange={handleFileChange}
                    removeFile={removeFile}
                    handleSubmit={handleSubmit}
                />
            </div>
        </UserLayout>
    );
};

export default CreateTicketPage;
