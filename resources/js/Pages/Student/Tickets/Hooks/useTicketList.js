import { useCallback } from 'react';

/**
 * Custom Hook: useTicketList
 * 
 * Manages presentation helper utility functions, badge classes, and formatting 
 * logic for the support ticket listings.
 */
export const useTicketList = () => {
    // Priority badges colors matching the sharp bento tag fill
    const getPriorityBadgeClass = useCallback((level) => {
        switch (level) {
            case "urgent":
                return "bg-rose-50 text-rose-700 border-rose-100 font-bold";
            case "high":
                return "bg-amber-50 text-amber-700 border-amber-100";
            case "medium":
                return "bg-sky-50 text-sky-700 border-sky-100";
            case "low":
            default:
                return "bg-slate-50 text-slate-600 border-slate-100";
        }
    }, []);

    // Status badges colors
    const getStatusBadgeClass = useCallback((statusState) => {
        switch (statusState) {
            case "open":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "in_progress":
                return "bg-yellow-50 text-yellow-800 border-yellow-100";
            case "resolved":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "closed":
            default:
                return "bg-slate-100 text-slate-500 border-slate-200";
        }
    }, []);

    // Format ISO dates into user-friendly localized strings
    const formatTicketDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    return {
        getPriorityBadgeClass,
        getStatusBadgeClass,
        formatTicketDate
    };
};
