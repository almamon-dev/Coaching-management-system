import SchoolLogo from '@/Components/SchoolLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 font-sans">
            <div className="mb-6 text-center">
                <Link href="/" className="inline-block">
                    <SchoolLogo variant="wide" className="h-10 sm:h-12 w-auto mx-auto" />
                </Link>
            </div>

            <div className="w-full sm:max-w-[450px] bg-white px-7 py-8 shadow-xs rounded-[4px] border border-slate-200">
                {children}
            </div>
        </div>
    );
}
