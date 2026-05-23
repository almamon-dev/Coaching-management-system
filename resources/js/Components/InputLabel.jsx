export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-[12px] font-bold text-[#2f3344] leading-[20px] mb-[5px] ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
