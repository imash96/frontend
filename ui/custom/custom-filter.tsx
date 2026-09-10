'use client';

import { useState } from 'react';

export interface FilterOption {
    label: string;
    value: string;
    count?: number;
}

export interface FilterSection {
    id: string;
    title: string;
    type: 'checkbox' | 'radio' | 'range' | 'color';
    options?: FilterOption[];
    min?: number;
    max?: number;
    colors?: Array<{ name: string; hex: string; value: string }>;
}

export interface FilterPanelProps {
    sections: FilterSection[];
    values: Record<string, any>;
    onChange: (sectionId: string, value: any) => void;
    onReset?: () => void;
    showReset?: boolean;
    variant?: 'sidebar' | 'horizontal';
    className?: string;
}

export function FilterPanel({
    sections,
    values,
    onChange,
    onReset,
    showReset = true,
    className = '',
}: FilterPanelProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(sections.map((s) => s.id))
    );

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
            }
            return next;
        });
    };

    const handleCheckboxChange = (sectionId: string, optionValue: string) => {
        const currentValues = values[sectionId] || [];
        const newValues = currentValues.includes(optionValue)
            ? currentValues.filter((v: string) => v !== optionValue)
            : [...currentValues, optionValue];
        onChange(sectionId, newValues);
    };

    return (
        <div className={`${className}`}>
            {/* Header */}
            {showReset && (
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary">Filters</h3>
                    {onReset && (
                        <button
                            onClick={onReset}
                            className="text-xs sm:text-sm text-primary hover:text-primary-hover font-semibold min-h-11 sm:min-h-0 px-2"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            )}

            {/* Sections */}
            <div className="space-y-4 sm:space-y-6">
                {sections.map((section) => {
                    const isExpanded = expandedSections.has(section.id);

                    return (
                        <div key={section.id} className="border-b border-border last:border-b-0 pb-4 sm:pb-6">
                            {/* Section Header */}
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full flex items-center justify-between py-2 text-left min-h-11 sm:min-h-0"
                            >
                                <span className="font-semibold text-sm sm:text-base text-text-primary">{section.title}</span>
                                <svg
                                    className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Section Content */}
                            {isExpanded && (
                                <div className="pt-3 sm:pt-4">
                                    {section.type === 'checkbox' && section.options && (
                                        <div className="space-y-2 sm:space-y-3">
                                            {section.options.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-h-11 sm:min-h-0"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={(values[section.id] || []).includes(option.value)}
                                                        onChange={() => handleCheckboxChange(section.id, option.value)}
                                                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                                                    />
                                                    <span className="flex-1 text-xs sm:text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                                        {option.label}
                                                    </span>
                                                    {option.count !== undefined && (
                                                        <span className="text-xs text-text-tertiary">
                                                            ({option.count})
                                                        </span>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {section.type === 'radio' && section.options && (
                                        <div className="space-y-2 sm:space-y-3">
                                            {section.options.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-h-11 sm:min-h-0"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={section.id}
                                                        checked={values[section.id] === option.value}
                                                        onChange={() => onChange(section.id, option.value)}
                                                        className="w-4 h-4 border-border text-primary focus:ring-2 focus:ring-primary/20"
                                                    />
                                                    <span className="flex-1 text-xs sm:text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                                        {option.label}
                                                    </span>
                                                    {option.count !== undefined && (
                                                        <span className="text-xs text-text-tertiary">
                                                            ({option.count})
                                                        </span>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {section.type === 'color' && section.colors && (
                                        <div className="flex flex-wrap gap-2 sm:gap-3">
                                            {section.colors.map((color) => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => {
                                                        const currentValues = values[section.id] || [];
                                                        const newValues = currentValues.includes(color.value)
                                                            ? currentValues.filter((v: string) => v !== color.value)
                                                            : [...currentValues, color.value];
                                                        onChange(section.id, newValues);
                                                    }}
                                                    className={`
                                                        relative w-8 h-8 sm:w-10 sm:h-10 rounded-full
                                                        border-2 transition-all
                                                        ${(values[section.id] || []).includes(color.value)
                                                            ? 'border-primary ring-4 ring-primary/20'
                                                            : 'border-border hover:border-primary'
                                                        }
                                                    `}
                                                    title={color.name}
                                                    aria-label={color.name}
                                                >
                                                    <span
                                                        className="absolute inset-1 rounded-full"
                                                        style={{ backgroundColor: color.hex }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {section.type === 'range' && section.min !== undefined && section.max !== undefined && (
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                                <span className="text-text-secondary">
                                                    ${values[section.id]?.[0] || section.min}
                                                </span>
                                                <span className="text-text-secondary">
                                                    ${values[section.id]?.[1] || section.max}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={section.min}
                                                max={section.max}
                                                value={values[section.id]?.[1] || section.max}
                                                onChange={(e) =>
                                                    onChange(section.id, [
                                                        values[section.id]?.[0] || section.min,
                                                        Number(e.target.value),
                                                    ])
                                                }
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export interface ActiveFiltersProps {
    filters: Record<string, any>;
    sections: FilterSection[];
    onRemove: (sectionId: string, value?: any) => void;
    onClearAll?: () => void;
    className?: string;
}

export function ActiveFilters({
    filters,
    sections,
    onRemove,
    onClearAll,
    className = '',
}: ActiveFiltersProps) {
    const activeFilters: Array<{ sectionId: string; label: string; value: any }> = [];

    sections.forEach((section) => {
        const sectionValues = filters[section.id];
        if (!sectionValues) return;

        if (Array.isArray(sectionValues) && sectionValues.length > 0) {
            sectionValues.forEach((value) => {
                const option = section.options?.find((opt) => opt.value === value) ||
                    section.colors?.find((col) => col.value === value);
                if (option) {
                    activeFilters.push({
                        sectionId: section.id,
                        label: 'label' in option ? option.label : option.name,
                        value,
                    });
                }
            });
        } else if (sectionValues && !Array.isArray(sectionValues)) {
            const option = section.options?.find((opt) => opt.value === sectionValues);
            if (option) {
                activeFilters.push({
                    sectionId: section.id,
                    label: option.label,
                    value: sectionValues,
                });
            }
        }
    });

    if (activeFilters.length === 0) return null;

    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
            <span className="text-xs sm:text-sm text-text-secondary whitespace-nowrap">Active filters:</span>
            {activeFilters.map((filter, index) => (
                <button
                    key={`${filter.sectionId}-${filter.value}-${index}`}
                    onClick={() => onRemove(filter.sectionId, filter.value)}
                    className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 bg-primary-subtle text-primary rounded-full text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors min-h-8"
                >
                    <span>{filter.label}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            ))}
            {onClearAll && (
                <button
                    onClick={onClearAll}
                    className="text-xs sm:text-sm text-error hover:text-error-hover font-semibold min-h-8 px-2"
                >
                    Clear All
                </button>
            )}
        </div>
    );
}

export default FilterPanel;