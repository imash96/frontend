"use client"

import { accordions } from "@/data/accordion";
import { StoreProduct } from "@medusajs/types";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Accordion({ product }: { product: StoreProduct }) {
    const [openId, setOpenId] = useState<string | null>(accordions[0]?.id || null);

    return (
        <div className="divide-y divide-divider border-y border-divider">
            {accordions.map((item) => (
                <AccordionRow
                    key={item.id}
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                />
            ))}
        </div>
    );
}

function AccordionRow({ item, isOpen, onToggle, }: AccordionRow) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        }
    }, [isOpen]);

    return (
        <div>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 text-left group"
                aria-expanded={isOpen}
            >
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                    {item.title}
                </span>
                <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "rotate-180 bg-primary text-primary-foreground" : "bg-muted text-foreground-secondary"}`}
                >
                    <ChevronDown className="w-3.5 h-3.5" />
                </span>
            </button>
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: isOpen ? `${height}px` : "0px" }}
            >
                <div ref={contentRef} className="pb-4 text-sm text-foreground-secondary leading-relaxed">
                    {item.content}
                </div>
            </div>
        </div>
    );
}

export interface AccordionItem {
    id: string;
    title: string;
    content: string;
}

export interface AccordionRow {
    item: AccordionItem;
    isOpen: boolean;
    onToggle: () => void;
}