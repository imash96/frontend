"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border md:border-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="useful-link flex w-full items-center justify-between py-4 text-left md:pointer-events-none md:py-0 md:mb-5"
                aria-expanded={isOpen}
            >
                <h3 className="font-heading text-lg font-semibold text-card uppercase tracking-widest">
                    {title}
                </h3>
                <ChevronDown
                    className={`size-4 text-foreground-tertiary transition-transform duration-200 md:hidden ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={1.5}
                />
            </button>
            <div className={`overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100 md:pb-0 ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </div>
    );
}