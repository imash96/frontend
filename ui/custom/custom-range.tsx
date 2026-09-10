'use client';

import { useState } from 'react';

export interface RangeSliderProps {
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: [number, number];
    value?: [number, number];
    onChange?: (value: [number, number]) => void;
    formatLabel?: (value: number) => string;
    showLabels?: boolean;
    showValues?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
};

export function RangeSlider({
    min = 0,
    max = 100,
    step = 1,
    defaultValue = [min, max],
    value: controlledValue,
    onChange,
    formatLabel = (val) => val.toString(),
    showLabels = true,
    showValues = false,
    size = 'md',
    className = '',
}: RangeSliderProps) {
    const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
    const value = controlledValue || internalValue;

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = Math.min(Number(e.target.value), value[1] - step);
        const newValue: [number, number] = [newMin, value[1]];
        setInternalValue(newValue);
        onChange?.(newValue);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Math.max(Number(e.target.value), value[0] + step);
        const newValue: [number, number] = [value[0], newMax];
        setInternalValue(newValue);
        onChange?.(newValue);
    };

    const minPercent = ((value[0] - min) / (max - min)) * 100;
    const maxPercent = ((value[1] - min) / (max - min)) * 100;

    return (
        <div className={`w-full ${className}`}>
            {showValues && (
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm font-medium text-text-primary">
                        {formatLabel(value[0])}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-text-primary">
                        {formatLabel(value[1])}
                    </span>
                </div>
            )}

            <div className="relative pt-2 pb-6">
                {/* Track */}
                <div className={`absolute w-full bg-muted rounded-full ${sizeClasses[size]}`} style={{ top: '8px' }} />

                {/* Active Range */}
                <div
                    className={`absolute bg-primary rounded-full ${sizeClasses[size]}`}
                    style={{
                        top: '8px',
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                    }}
                />

                {/* Min Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value[0]}
                    onChange={handleMinChange}
                    className="absolute w-full appearance-none bg-transparent pointer-events-none range-slider-thumb"
                    style={{ zIndex: value[0] > max - (max - min) / 5 ? 5 : 4 }}
                />

                {/* Max Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value[1]}
                    onChange={handleMaxChange}
                    className="absolute w-full appearance-none bg-transparent pointer-events-none range-slider-thumb"
                    style={{ zIndex: 4 }}
                />
            </div>

            {showLabels && (
                <div className="flex items-center justify-between text-xs sm:text-sm text-text-secondary">
                    <span>{formatLabel(min)}</span>
                    <span>{formatLabel(max)}</span>
                </div>
            )}

            <style jsx>{`
                .range-slider-thumb::-webkit-slider-thumb {
                    appearance: none;
                    pointer-events: all;
                    ${size === 'sm' ? 'width: 16px; height: 16px;' : size === 'lg' ? 'width: 24px; height: 24px;' : 'width: 20px; height: 20px;'}
                    border-radius: 50%;
                    background: var(--primary);
                    border: 2px solid var(--surface);
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .range-slider-thumb::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 0 4px var(--primary-subtle);
                }

                .range-slider-thumb::-moz-range-thumb {
                    pointer-events: all;
                    ${size === 'sm' ? 'width: 16px; height: 16px;' : size === 'lg' ? 'width: 24px; height: 24px;' : 'width: 20px; height: 20px;'}
                    border-radius: 50%;
                    background: var(--primary);
                    border: 2px solid var(--surface);
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .range-slider-thumb::-moz-range-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 0 4px var(--primary-subtle);
                }
            `}</style>
        </div>
    );
}

export interface PriceRangeSliderProps {
    min?: number;
    max?: number;
    defaultValue?: [number, number];
    value?: [number, number];
    onChange?: (value: [number, number]) => void;
    currency?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function PriceRangeSlider({
    currency = '$',
    ...props
}: PriceRangeSliderProps) {
    return (
        <RangeSlider
            {...props}
            formatLabel={(val) => `${currency}${val}`}
            showValues
        />
    );
}

export default RangeSlider;