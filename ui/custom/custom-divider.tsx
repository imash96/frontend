'use client';

export interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    variant?: 'default' | 'strong' | 'dashed' | 'dotted';
    spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    label?: string;
    className?: string;
}

const spacingClasses = {
    horizontal: {
        none: '',
        sm: 'my-2',
        md: 'my-4',
        lg: 'my-6 sm:my-8',
        xl: 'my-8 sm:my-12',
    },
    vertical: {
        none: '',
        sm: 'mx-2',
        md: 'mx-4',
        lg: 'mx-6 sm:mx-8',
        xl: 'mx-8 sm:mx-12',
    },
};

const variantClasses = {
    default: 'border-divider',
    strong: 'border-divider-strong',
    dashed: 'border-divider border-dashed',
    dotted: 'border-divider border-dotted',
};

export default function Divider({
    orientation = 'horizontal',
    variant = 'default',
    spacing = 'md',
    label,
    className = '',
}: DividerProps) {
    if (label) {
        return (
            <div className={`flex items-center ${spacingClasses.horizontal[spacing]} ${className}`}>
                <div className={`flex-1 border-t ${variantClasses[variant]}`} />
                <span className="px-3 sm:px-4 text-xs sm:text-sm text-text-secondary whitespace-nowrap">{label}</span>
                <div className={`flex-1 border-t ${variantClasses[variant]}`} />
            </div>
        );
    }

    if (orientation === 'vertical') {
        return (
            <div
                className={`
                    inline-block h-full border-l
                    ${variantClasses[variant]}
                    ${spacingClasses.vertical[spacing]}
                    ${className}
                `}
            />
        );
    }

    return (
        <hr
            className={`
                w-full border-t
                ${variantClasses[variant]}
                ${spacingClasses.horizontal[spacing]}
                ${className}
            `}
        />
    );
}

// Section Divider (with gradient)
export interface SectionDividerProps {
    spacing?: 'sm' | 'md' | 'lg';
    gradient?: boolean;
    className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
    spacing = 'md',
    gradient = false,
    className = '',
}) => {
    const spacingMap = {
        sm: 'my-6 sm:my-8',
        md: 'my-8 sm:my-12',
        lg: 'my-12 sm:my-16',
    };

    return (
        <div className={`${spacingMap[spacing]} ${className}`}>
            {gradient ? (
                <div className="h-px bg-linear-to-r from-transparent via-divider to-transparent" />
            ) : (
                <hr className="border-t border-divider" />
            )}
        </div>
    );
};

// Content Divider (with icon or ornament)
export interface ContentDividerProps {
    icon?: React.ReactNode;
    spacing?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const ContentDivider: React.FC<ContentDividerProps> = ({
    icon,
    spacing = 'md',
    className = '',
}) => {
    const spacingMap = {
        sm: 'my-6 sm:my-8',
        md: 'my-8 sm:my-12',
        lg: 'my-12 sm:my-16',
    };

    const defaultIcon = (
        <svg
            className="w-4 h-4 text-text-tertiary"
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <circle cx="10" cy="10" r="2" />
            <circle cx="4" cy="10" r="1" />
            <circle cx="16" cy="10" r="1" />
        </svg>
    );

    return (
        <div className={`flex items-center ${spacingMap[spacing]} ${className}`}>
            <div className="flex-1 h-px bg-divider" />
            <span className="bg-background px-3 sm:px-4 text-xs sm:text-sm text-text-secondary flex items-center gap-2">{icon || defaultIcon}</span>
            <div className="flex-1 h-px bg-divider" />
        </div>
    );
};