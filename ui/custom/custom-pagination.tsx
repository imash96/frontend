'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    itemsPerPageOptions?: number[];
    variant?: 'default' | 'simple' | 'compact';
    showFirstLast?: boolean;
    showItemsPerPage?: boolean;
    showTotalItems?: boolean;
    maxPageButtons?: number;
    disabled?: boolean;
    className?: string;
    getPageUrl?: (page: number) => string;
    ariaLabel?: string;
}

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48];

// Memoized icon components
const PrevIcon = () => <ChevronLeft size={18} strokeWidth={2} />;

const NextIcon = () => <ChevronRight size={18} strokeWidth={2} />;

const FirstIcon = () => <ChevronsLeft size={18} strokeWidth={2} />;

const LastIcon = () => <ChevronsRight size={18} strokeWidth={2} />;

const EllipsisIcon = () => <MoreHorizontal size={18} strokeWidth={2} />;

// Page button component
const PageButton = ({ page, isActive, onClick, disabled, href }: {
    page: number;
    isActive: boolean;
    onClick: (page: number) => void;
    disabled?: boolean;
    href?: string;
}) => {
    const handleClick = (e: React.MouseEvent) => {
        if (disabled) return;
        if (!href) e.preventDefault();
        onClick(page);
    };

    const baseClasses = `min-w-[40px] h-10 px-3 flex items-center justify-center rounded-lg font-heading font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-focus-ring/20`;

    const variantClasses = isActive ? 'bg-primary text-primary-foreground shadow-sm' : disabled ? 'text-text-disabled cursor-not-allowed' : 'text-text-secondary hover:bg-muted hover:text-text-primary';

    if (href && !disabled) {
        return (
            <a
                href={href}
                onClick={handleClick}
                className={`${baseClasses} ${variantClasses}`}
                aria-label={`Page ${page}`}
                aria-current={isActive ? 'page' : undefined}
            >
                {page}
            </a>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses}`}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
        >
            {page}
        </button>
    );
};

// Navigation button component
const NavButton = ({ onClick, disabled, icon, label, href }: {
    onClick: () => void;
    disabled?: boolean;
    icon: React.ReactNode;
    label: string;
    href?: string;
}) => {
    const handleClick = (e: React.MouseEvent) => {
        if (disabled) return;
        if (!href) e.preventDefault();
        onClick();
    };

    const baseClasses = `h-10 px-3 flex items-center justify-center gap-2 rounded-lg font-body font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-focus-ring/20 ${disabled ? 'text-text-disabled cursor-not-allowed opacity-50' : 'text-text-secondary hover:bg-muted hover:text-text-primary'}`;

    if (href && !disabled) {
        return (
            <a
                href={href}
                onClick={handleClick}
                className={baseClasses}
                aria-label={label}
                rel={label.toLowerCase().includes('prev') ? 'prev' : label.toLowerCase().includes('next') ? 'next' : undefined}
            >
                {icon}
                <span className="hidden sm:inline">{label}</span>
            </a>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={baseClasses}
            aria-label={label}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
};

// Items per page selector
const ItemsPerPageSelector = ({ value, options, onChange, disabled }: {
    value: number;
    options: number[];
    onChange: (value: number) => void;
    disabled?: boolean;
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(Number(e.target.value));
    };

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm text-text-secondary font-body whitespace-nowrap">
                Items per page:
            </label>
            <select
                id="items-per-page"
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className="
                    h-10 px-3 rounded-lg border border-border
                    bg-surface text-text-primary text-sm font-body
                    transition-all duration-200
                    hover:border-primary
                    focus:outline-none focus:border-primary focus:ring-4 focus:ring-focus-ring/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                "
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Generate page numbers with ellipsis
const generatePageNumbers = (currentPage: number, totalPages: number, maxButtons: number) => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= maxButtons) {
        // Show all pages if total is less than max
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Always show first page
        pages.push(1);

        const startPage = Math.max(2, currentPage - Math.floor((maxButtons - 3) / 2));
        const endPage = Math.min(totalPages - 1, startPage + maxButtons - 4);

        // Add ellipsis after first page if needed
        if (startPage > 2) {
            pages.push('ellipsis');
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            pages.push('ellipsis');
        }

        // Always show last page
        pages.push(totalPages);
    }

    return pages;
};

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage = 12,
    onItemsPerPageChange,
    itemsPerPageOptions = ITEMS_PER_PAGE_OPTIONS,
    variant = 'default',
    showFirstLast = true,
    showItemsPerPage = false,
    showTotalItems = true,
    maxPageButtons = 7,
    disabled = false,
    className = '',
    getPageUrl,
    ariaLabel = 'Pagination',
}: PaginationProps) {
    // Handlers
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage && !disabled) {
            onPageChange(page);
        }
    };

    const handlePrevious = () => {
        handlePageChange(currentPage - 1);
    };

    const handleNext = () => {
        handlePageChange(currentPage + 1);
    };

    const handleFirst = () => {
        handlePageChange(1);
    };

    const handleLast = () => {
        handlePageChange(totalPages);
    };

    // Generate page numbers
    const pageNumbers = generatePageNumbers(currentPage, totalPages, maxPageButtons);

    // Calculate items range
    const itemsRange = () => {
        if (!totalItems) return null;
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        return { start, end };
    };

    // Early return if no pages
    if (totalPages <= 1 && variant !== 'default') return null;

    return (
        <nav
            className={`flex flex-col gap-4 ${className}`}
            aria-label={ariaLabel}
            role="navigation"
        >
            {/* Top section: Items info and per-page selector */}
            {variant === 'default' && (showTotalItems || showItemsPerPage) && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {showTotalItems && totalItems && itemsRange && (
                        <p className="text-sm text-text-secondary font-body">
                            Showing{' '}
                            <span className="font-semibold text-text-primary">{itemsRange()?.start}</span>
                            {' '}to{' '}
                            <span className="font-semibold text-text-primary">{itemsRange()?.end}</span>
                            {' '}of{' '}
                            <span className="font-semibold text-text-primary">{totalItems}</span>
                            {' '}results
                        </p>
                    )}

                    {showItemsPerPage && onItemsPerPageChange && (
                        <ItemsPerPageSelector
                            value={itemsPerPage}
                            options={itemsPerPageOptions}
                            onChange={onItemsPerPageChange}
                            disabled={disabled}
                        />
                    )}
                </div>
            )}

            {/* Main pagination controls */}
            <div className="flex items-center justify-center">
                <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1 shadow-sm">
                    {/* First page button */}
                    {showFirstLast && variant !== 'simple' && (
                        <NavButton
                            onClick={handleFirst}
                            disabled={currentPage === 1 || disabled}
                            icon={<FirstIcon />}
                            label="First"
                            href={getPageUrl?.(1)}
                        />
                    )}

                    {/* Previous button */}
                    <NavButton
                        onClick={handlePrevious}
                        disabled={currentPage === 1 || disabled}
                        icon={<PrevIcon />}
                        label="Previous"
                        href={getPageUrl?.(currentPage - 1)}
                    />

                    {/* Page numbers */}
                    {variant !== 'simple' && (
                        <div className="flex items-center gap-1 px-2">
                            {pageNumbers.map((page, index) => {
                                if (page === 'ellipsis') {
                                    return (
                                        <div
                                            key={`ellipsis-${index}`}
                                            className="min-w-10 h-10 flex items-center justify-center text-text-tertiary"
                                            aria-hidden="true"
                                        >
                                            <EllipsisIcon />
                                        </div>
                                    );
                                }

                                return (
                                    <PageButton
                                        key={page}
                                        page={page}
                                        isActive={page === currentPage}
                                        onClick={handlePageChange}
                                        disabled={disabled}
                                        href={getPageUrl?.(page)}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Current page indicator for simple variant */}
                    {variant === 'simple' && (
                        <div className="px-4 text-sm font-heading text-text-primary">
                            <span className="font-semibold">{currentPage}</span>
                            <span className="text-text-secondary"> / {totalPages}</span>
                        </div>
                    )}

                    {/* Next button */}
                    <NavButton
                        onClick={handleNext}
                        disabled={currentPage === totalPages || disabled}
                        icon={<NextIcon />}
                        label="Next"
                        href={getPageUrl?.(currentPage + 1)}
                    />

                    {/* Last page button */}
                    {showFirstLast && variant !== 'simple' && (
                        <NavButton
                            onClick={handleLast}
                            disabled={currentPage === totalPages || disabled}
                            icon={<LastIcon />}
                            label="Last"
                            href={getPageUrl?.(totalPages)}
                        />
                    )}
                </div>
            </div>

            {/* Compact variant info */}
            {variant === 'compact' && totalItems && itemsRange && (
                <p className="text-xs text-center text-text-tertiary font-body">
                    {itemsRange()?.start}-{itemsRange()?.end} of {totalItems}
                </p>
            )}
        </nav>
    );
};