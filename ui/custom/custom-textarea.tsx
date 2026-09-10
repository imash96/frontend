import { useId } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helperText?: string;
    error?: string;
    fullWidth?: boolean;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export default function Textarea({
    label,
    helperText,
    error,
    fullWidth = false,
    resize = 'vertical',
    className = '',
    disabled,
    ...props
}: TextareaProps) {
    const id = useId();
    const textareaId = props.id || id;

    return (
        <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block font-medium text-text-primary text-sm sm:text-base mb-1.5 sm:mb-2"
                >
                    {label}
                </label>
            )}

            {/* Textarea */}
            <textarea
                id={textareaId}
                disabled={disabled}
                className={`
                    w-full px-3 py-2 rounded-lg border-2 transition-all
                    bg-input-background text-input-text text-sm sm:text-base
                    placeholder:text-input-placeholder
                    min-h-25
                    ${resize === 'none' ? 'resize-none' : resize === 'vertical' ? 'resize-y' : resize === 'horizontal' ? 'resize-x' : 'resize'}
                    ${error
                        ? 'border-error focus:border-error focus:ring-4 focus:ring-error/20'
                        : 'border-input-border hover:border-input-border-hover focus:border-input-border-focus focus:ring-4 focus:ring-input-focus/20'
                    }
                    ${disabled
                        ? 'bg-input-disabled-background text-input-disabled-text border-input-disabled-border cursor-not-allowed'
                        : ''
                    }
                    focus:outline-none
                `}
                {...props}
            />

            {/* Helper Text or Error */}
            {(helperText || error) && (
                <p className={`mt-1 sm:mt-1.5 text-xs sm:text-sm ${error ? 'text-error' : 'text-text-secondary'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
}