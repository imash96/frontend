'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown, Plus } from 'lucide-react';

import "@/css/accordion.css"

export interface AccordionItemData {
    id?: string;
    value: string;
    title: string;
    content: React.ReactNode;
    disabled?: boolean;
}

export interface CustomAccordionProps {
    items: AccordionItemData[];
    type?: 'single' | 'multiple';
    defaultValue?: string | string[];
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    collapsible?: boolean;
    variant?: 'default' | 'bordered' | 'separated';
    className?: string;
}

const variantClasses = {
    default: 'accordion-default',
    bordered: 'accordion-bordered',
    separated: 'accordion-separated',
};

const AccordionItemComponent = ({ value, title, content, disabled }: AccordionItemData) => (
    <AccordionPrimitive.Item value={value} disabled={disabled} className="accordion-item">
        <AccordionPrimitive.Header className="accordion-header">
            <AccordionPrimitive.Trigger className="accordion-trigger">
                <span className="accordion-trigger-text text-sm sm:text-base">{title}</span>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="accordion-content">
            <div className="accordion-content-inner text-sm sm:text-base">{content}</div>
        </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
);

export function CustomAccordion({
    items,
    type = 'single',
    defaultValue,
    value,
    onValueChange,
    collapsible = true,
    variant = 'default',
    className = '',
}: CustomAccordionProps) {
    const rootProps = type === 'single'
        ? {
            type: 'single' as const,
            collapsible,
            defaultValue: defaultValue as string,
            value: value as string,
            onValueChange: onValueChange as (value: string) => void,
        }
        : {
            type: 'multiple' as const,
            defaultValue: defaultValue as string[],
            value: value as string[],
            onValueChange: onValueChange as (value: string[]) => void,
        };

    return (
        <AccordionPrimitive.Root {...rootProps} className={`accordion-root ${variantClasses[variant]} ${className}`}>
            {items.map((item) => (
                <AccordionItemComponent
                    key={item.id || item.value}
                    value={item.value}
                    title={item.title}
                    content={item.content}
                    disabled={item.disabled}
                />
            ))}
        </AccordionPrimitive.Root>
    );
};

// Convenience component for FAQ-style accordions
export interface FAQItem {
    question: string;
    answer: React.ReactNode;
}

export interface FAQAccordionProps {
    items: FAQItem[];
    variant?: 'default' | 'bordered' | 'separated';
    className?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
    items,
    variant = 'separated',
    className = '',
}) => {
    const accordionItems: AccordionItemData[] = items.map((item, index) => ({
        id: `faq-${index}`,
        value: `faq-${index}`,
        title: item.question,
        content: typeof item.answer === 'string'
            ? <p className="text-text-primary leading-relaxed text-sm sm:text-base">{item.answer}</p>
            : item.answer,
    }));

    return (
        <div className={className}>
            <CustomAccordion items={accordionItems} type="single" collapsible variant={variant} />
        </div>
    );
};

// ProductDetailsAccordion Component
export interface ProductDetailsSection {
    title: string;
    content: React.ReactNode;
}

export interface ProductDetailsAccordionProps {
    sections: ProductDetailsSection[];
    className?: string;
}

export const ProductDetailsAccordion: React.FC<ProductDetailsAccordionProps> = ({
    sections,
    className = '',
}) => {
    const accordionItems: AccordionItemData[] = sections.map((section, index) => ({
        id: `section-${index}`,
        value: `section-${index}`,
        title: section.title,
        content: section.content,
    }));

    return (
        <CustomAccordion
            items={accordionItems}
            type="multiple"
            variant="default"
            className={className}
        />
    );
};

// Single Accordion Item for more granular control
export interface AccordionItemProps {
    value: string;
    title: string;
    className: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
    value,
    title,
    children,
    disabled,
    className
}) => {
    return (
        <AccordionPrimitive.Item value={value} disabled={disabled} className={`accordion-item ${className}`}>
            <AccordionPrimitive.Header className="accordion-header">
                <AccordionPrimitive.Trigger className="accordion-trigger">
                    <span className="accordion-trigger-text text-sm sm:text-base">{title}</span>
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="accordion-content">
                <div className="accordion-content-inner text-sm sm:text-base">{children}</div>
            </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
    );
};

export function AccordionContent({
    className,
    children,
    ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
    return (
        <AccordionPrimitive.Content
            className={`accordion-content ${className ?? ""}`}
            {...props}
        >
            {children}
        </AccordionPrimitive.Content>
    );
}

export function AccordionItemT({
    className,
    children,
    ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
    return (
        <AccordionPrimitive.Item
            className={`transition ${className ?? ""}`}
            {...props}
        >
            {children}
        </AccordionPrimitive.Item>
    );
}

export function AccordionTrigger({
    className,
    children,
    ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
    return (
        <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
                className={`group flex items-center justify-between w-full transition ${className ?? ""}`}
                {...props}
            >
                {children}
                <Plus className="h-5 w-5 transition-transform duration-200 ease-in group-data-[state=open]:rotate-45" />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

export function Accordion({
    className,
    children,
    ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>) {
    return (
        <AccordionPrimitive.Root className={`${className ?? ""}`} {...props}>
            {children}
        </AccordionPrimitive.Root>
    );
}