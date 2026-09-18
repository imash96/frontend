"use client"

import { Accordion, AccordionContent, AccordionItemT, AccordionTrigger } from "@/ui/custom/custom-accordion"
import { StoreProduct } from "@medusajs/types"
import { accordions } from "@/data/accordion"
import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

export default function ProductAccordion({ product }: { product: StoreProduct }) {
    const details = product.description?.trim() || accordions.find((a) => a.id === "details")?.content || ""

    return (
        <Accordion type="single" collapsible defaultValue="details" className="mt-2 divide-y divide-divider border-y border-divider">
            {accordions.map((item) => (
                <AccordionItemT key={item.id} value={item.id} className="accordion-item">
                    <AccordionTrigger className="py-4 text-left text-sm font-semibold uppercase tracking-wider text-text-primary hover:text-primary">
                        {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pb-4 text-sm leading-relaxed text-text-secondary">
                            {item.id === "details" ? (
                                <p className="whitespace-pre-wrap">{details}</p>
                            ) : (
                                <p>{item.content}</p>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItemT>
            ))}
        </Accordion>
    )
}

export function AccordionProduct({ product }: { product: StoreProduct }) {
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