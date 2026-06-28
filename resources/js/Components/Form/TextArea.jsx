import * as React from "react";
import { cn } from "@/lib/utils";

const TextArea = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[100px] w-full rounded-[4px] border border-[#d1d1d1] bg-white px-3 py-2 text-[12px] text-[#202223] placeholder:text-[#bababa] focus:outline-none focus:border-[#008060] focus:ring-1 focus:ring-[#008060] transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

TextArea.displayName = "TextArea";

export default TextArea;
