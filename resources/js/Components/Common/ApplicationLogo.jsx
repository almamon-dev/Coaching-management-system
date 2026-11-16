export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            {...props}
            src="/images/Logo.png"
            alt="Logo"
            className={`object-contain ${className}`.trim()}
        />
    );
}
