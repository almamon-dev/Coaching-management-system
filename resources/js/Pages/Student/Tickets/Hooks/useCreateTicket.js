import { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Custom Hook: useCreateTicket
 * 
 * Manages form state, validation, stepper transitions, 
 * drag-and-drop file attachments, and submission logic.
 */
export const useCreateTicket = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        category: '', // Will be set in Step 1 (Choose Department)
        priority: 'low',
        message: '',
        attachments: [],
        agreeTerms: false,
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [filePreviews, setFilePreviews] = useState([]);

    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        
        // Enforce max 3 files limit
        if (data.attachments.length + files.length > 3) {
            alert("You can upload a maximum of 3 attachments.");
            return;
        }

        const newAttachments = [...data.attachments, ...files];
        setData('attachments', newAttachments);

        const newPreviews = files.map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type,
            url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));
        
        setFilePreviews(prev => [...prev, ...newPreviews]);
    }, [data.attachments, setData]);

    const removeFile = useCallback((index) => {
        const updatedAttachments = data.attachments.filter((_, i) => i !== index);
        setData('attachments', updatedAttachments);
        
        setFilePreviews(prev => prev.filter((_, i) => i !== index));
    }, [data.attachments, setData]);

    const selectDepartment = useCallback((dept) => {
        setData('category', dept);
        setCurrentStep(2); // Auto advance to Step 2 on department selection
    }, [setData]);

    const isStepValid = useCallback((step) => {
        switch (step) {
            case 1:
                return !!data.category;
            case 2:
                return data.subject.trim().length >= 4;
            case 3:
                return data.message.trim().length > 0 && data.message.trim() !== '<p><br></p>';
            case 4:
                return data.agreeTerms;
            default:
                return false;
        }
    }, [data]);

    const goToNextStep = useCallback(() => {
        if (isStepValid(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep, isStepValid]);

    const goToPrevStep = useCallback(() => {
        setCurrentStep(prev => Math.max(1, prev - 1));
    }, []);

    const handleSubmit = useCallback((e) => {
        if (e) e.preventDefault();
        if (!isStepValid(4)) return;

        post(route('dashboard.tickets.store'), {
            forceFormData: true, // Crucial for file uploads
            onSuccess: () => {
                reset();
                setFilePreviews([]);
                setCurrentStep(1);
            }
        });
    }, [post, reset, isStepValid]);

    return {
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
    };
};
