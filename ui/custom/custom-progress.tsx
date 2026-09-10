'use client';

export interface ProgressBarProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'error';
    showLabel?: boolean;
    label?: string;
    className?: string;
}

const sizeClasses = {
    sm: 'h-1.5 sm:h-2',
    md: 'h-2 sm:h-2.5',
    lg: 'h-3 sm:h-4',
};

const variantClasses = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
};

export function ProgressBar({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = false,
    label,
    className = '',
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={`w-full ${className}`}>
            {(showLabel || label) && (
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-xs sm:text-sm font-medium text-text-primary">
                        {label || `${percentage.toFixed(0)}%`}
                    </span>
                    {showLabel && <span className="text-xs sm:text-sm text-text-secondary">{percentage.toFixed(0)}%</span>}
                </div>
            )}
            <div className={`w-full bg-muted rounded-full overflow-hidden ${sizeClasses[size]}`}>
                <div
                    className={`h-full ${variantClasses[variant]} transition-all duration-300 ease-out rounded-full`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                />
            </div>
        </div>
    );
};

// Stepped Progress (for checkout, multi-step forms)
export interface Step {
    label: string;
    description?: string;
}

export interface SteppedProgressProps {
    steps: Step[];
    currentStep: number;
    completed?: number[];
    variant?: 'dots' | 'lines' | 'numbers';
    className?: string;
}

export const SteppedProgress: React.FC<SteppedProgressProps> = ({
    steps,
    currentStep,
    completed = [],
    variant = 'numbers',
    className = '',
}) => {

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = completed.includes(index) || index < currentStep;;
                    const isCurrent = index === currentStep;
                    return (
                        <div key={index} className="flex-1 flex items-center">
                            {/* Step Circle/Number */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                                    flex items-center justify-center
                                    w-10 h-10 rounded-full
                                    font-semibold text-sm
                                    transition-all duration-300
                                    ${isCompleted ? 'bg-primary text-primary-foreground' : isCurrent ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-muted text-text-secondary'}
                                `}
                                >
                                    {variant === 'numbers' && <span>{index + 1}</span>}
                                    {variant === 'dots' && (
                                        <span className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-primary-foreground' : 'bg-text-secondary'}`} />
                                    )}
                                    {variant === 'lines' && isCompleted && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>

                                {/* Step Label */}
                                <div className="mt-2 text-center max-w-25">
                                    <div
                                        className={`
                                        text-xs font-medium
                                        ${isCurrent ? 'text-text-primary' : 'text-text-secondary'}
                                    `}
                                    >
                                        {step.label}
                                    </div>
                                    {step.description && (
                                        <div className="text-xs text-text-tertiary mt-0.5">
                                            {step.description}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-2 mb-6">
                                    <div
                                        className={`
                                        h-full transition-all duration-500
                                        ${isCompleted ? 'bg-primary' : 'bg-muted'}
                                    `}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

// Circular Progress
export interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    variant?: 'default' | 'success' | 'warning' | 'error';
    showLabel?: boolean;
    className?: string;
}

export function CircularProgress({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    variant = 'default',
    showLabel = true,
    className = '',
}: CircularProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const colorMap = {
        default: 'text-primary',
        success: 'text-success',
        warning: 'text-warning',
        error: 'text-error',
    };

    return (
        <div className={`inline-flex items-center justify-center relative ${className}`}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    className="stroke-muted fill-none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`fill-none transition-all duration-300 ${colorMap[variant]}`}
                    style={{ stroke: 'currentColor' }}
                />
            </svg>
            {showLabel && (
                <span
                    className={`absolute text-lg sm:text-xl font-bold ${colorMap[variant]}`}
                    style={{ fontSize: size / 5 }}
                >
                    {percentage.toFixed(0)}%
                </span>
            )}
        </div>
    );
}