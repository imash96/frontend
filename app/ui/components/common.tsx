export type Tabs = 'colors' | 'components' | 'ecommerce' | 'fonts' | 'input' | 'button' | 'extra' | 'drawer' | 'pagination' | 'custom';

export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="border-b border-divider pb-3 sm:pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">
                {title}
            </h2>
            <p className="text-text-secondary text-sm sm:text-base">{subtitle}</p>
        </div>
    );
}

export function AlertComponent({ type, title, message, icon }: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    icon: React.ReactNode;
}) {
    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-success-subtle border-success text-success';
            case 'error':
                return 'bg-destructive-subtle border-destructive text-destructive';
            case 'warning':
                return 'bg-warning-subtle border-warning text-warning';
            case 'info':
                return 'bg-info-subtle border-info text-info';
        }
    };

    return (
        <div className={`${getStyles()} border rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3 transition-all hover:shadow-md`}>
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div className="flex-1">
                <h4 className="font-semibold mb-1 text-sm sm:text-base">{title}</h4>
                <p className="text-xs sm:text-sm opacity-90">{message}</p>
            </div>
        </div>
    );
}