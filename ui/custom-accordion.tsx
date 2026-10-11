"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export function Accordion({
  className = "",
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root className={`${className}`} {...props}>
      {children}
    </AccordionPrimitive.Root>
  );
}

export function AccordionItem({
  className = "",
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={`transition ${className}`}
      {...props}
    >
      {children}
    </AccordionPrimitive.Item>
  );
}

export function AccordionTrigger({
  className = "",
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        className={`group flex items-center justify-between w-full transition ${className}`}
        {...props}
      >
        {children}
        <Plus className="h-5 w-5 transition-transform duration-200 ease-in group-data-[state=open]:rotate-45" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={`overflow-hidden no-scrollbar pb-4 pt-1 px-2 text-sm leading-relaxed transition-[height] duration-300 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down ${className}`}
      {...props}
    >
      {children}
    </AccordionPrimitive.Content>
  );
}
