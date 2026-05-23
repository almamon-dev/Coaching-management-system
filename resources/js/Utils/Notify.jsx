import React from 'react';
import { toast } from "@/Hooks/use-toast";

/**
 * Premium Notification Utility - Shadcn UI Powered
 */
const Notify = {
    success: (title, message) => {
        toast({
            title: title,
            description: message,
            variant: "success",
        });
    },

    error: (title, message) => {
        toast({
            title: title,
            description: message,
            variant: "destructive",
        });
    },

    info: (title, message) => {
        toast({
            title: title,
            description: message,
        });
    }
};

export default Notify;
