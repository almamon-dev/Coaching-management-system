import * as React from "react";
import { cn } from "@/lib/utils";

const TextInput = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-[32px] w-full rounded-[3px] border border-[#d1d1d1] bg-white px-3 py-1.5 text-[12px] font-medium text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:border-[#008060] focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 shadow-none",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

TextInput.displayName = "TextInput";

export default TextInput;
