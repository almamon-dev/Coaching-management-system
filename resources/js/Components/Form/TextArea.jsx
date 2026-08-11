import * as React from "react";
import { cn } from "@/lib/utils";

const TextArea = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[90px] w-full rounded-[3px] border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 transition-colors shadow-none disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

TextArea.displayName = "TextArea";

export default TextArea;
