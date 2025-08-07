import Link from 'next/link';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    backHref?: string;
}

export default function PageHeader({
    title,
    subtitle,
    showBackButton = true,
    backHref = "/"
}: PageHeaderProps) {
    return (
        <div className="glass backdrop-blur-sm border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <div className="flex items-center">
                        {showBackButton && (
                            <Link
                                href={backHref}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                        )}
                        <div className={showBackButton ? "ml-4" : ""}>
                            <h1 className="text-2xl font-bold text-white">{title}</h1>
                            {subtitle && (
                                <p className="text-white/70 text-sm mt-1">{subtitle}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 