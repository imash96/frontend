"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { FAQS } from "@/data/faq";
import useDebounce from "@/lib/hook/use-debounce";
import Button from "@/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItemT,
  AccordionTrigger,
} from "@/ui/custom/custom-accordion";
import CustomInput from "@/ui/input";

export default function FAQSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.toLowerCase(), 300);

  const filteredFAQs = FAQS.filter(({ question, answer }) => {
    if (!debouncedQuery) return true;
    const q = question.toLowerCase();
    const a = typeof answer === "string" ? answer.toLowerCase() : "";
    return q.includes(debouncedQuery) || a.includes(debouncedQuery);
  });

  return (
    <>
      <CustomInput
        className="mt-6 relative max-w-xl mx-auto"
        type="text"
        value={query}
        autoFocus
        onChange={(e) => setQuery(e.target.value)}
        label="Search for questions..."
      />

      <section className="space-y-6">
        {/* <h2 className="text-2xl font-semibold">All FAQs</h2> */}
        {filteredFAQs.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="border-t overflow-hidden"
          >
            {filteredFAQs.map((faq, idx) => (
              <AccordionItemT
                key={faq.question}
                value={`faq-${idx}`}
                className="border-b"
              >
                <AccordionTrigger className="text-left p-6 hover:bg-surface-elevated">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-hidden no-scrollbar">
                    <div className="text-sm text-foreground-tertiary max-w-none px-6 pb-6">
                      {typeof faq.answer === "string" ? (
                        <p>{faq.answer}</p>
                      ) : (
                        faq.answer
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItemT>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Sparkles className="mx-auto h-10 w-10" />
            <h3 className="mt-2 text-lg font-medium">No Questions Found</h3>
            <p className="mt-1 text-sm text-foreground-tertiary mb-4">
              Your search for "<span className="font-medium">{query}</span>" did
              not return any results.
            </p>
            <Button href="/contact-us" variant="outline">
              Contact our support team
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
