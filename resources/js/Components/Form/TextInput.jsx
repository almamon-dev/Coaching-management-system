import * as React from "react";
import { cn } from "@/lib/utils";

const TextInput = React.forwardRef(({ className, type = "text", isFocused = false, ...props }, ref) => {
    const localRef = React.useRef(null);

    React.useImperativeHandle(ref, () => localRef.current);

    React.useEffect(() => {
        if (isFocused && localRef.current) {
            localRef.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            type={type}
            className={cn(
                "flex h-[34px] w-full rounded-[3px] border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-none",
                className
            )}
            ref={localRef}
            {...props}
        />
    );
});

TextInput.displayName = "TextInput";

export default TextInput;
