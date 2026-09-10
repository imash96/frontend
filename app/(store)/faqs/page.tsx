"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FAQS } from "@/data/faq";
import AccountFooter from "@/layout/account/components/account-footer";
import useDebounce from "@/lib/hook/use-debounce";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItemT,
} from "@/ui/custom/custom-accordion";
import Button from "@/ui/button";
import CustomInput from "@/ui/input";
import Container from "@/ui/container";

export default function Page() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.toLowerCase(), 300);

  const popularFAQs = FAQS.filter((f) => f.popular).slice(0, 4);

  const filteredFAQs = FAQS.filter(({ question, answer }) => {
    if (!debouncedQuery) return true;
    const q = question.toLowerCase();
    const a = typeof answer === "string" ? answer.toLowerCase() : "";
    return q.includes(debouncedQuery) || a.includes(debouncedQuery);
  });

  return (
    <Container size="lg" className="py-16 sm:py-24 min-h-dvh space-y-16">
      {/* Header */}
      <header className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Help Center
        </h1>
        <p className="max-w-prose mx-auto text-lg text-foreground-muted">
          Find answers to your questions. If you can't find what you're looking
          for, feel free to{" "}
          <Link
            href="/contact-us"
            className="font-medium text-link hover:underline"
          >
            contact our support team
          </Link>
          .
        </p>
        <CustomInput
          className="mt-6 relative max-w-xl mx-auto"
          type="text"
          value={query}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
          label="Search for questions..."
        />
      </header>

      {/* Popular Questions */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">Popular Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularFAQs.map(({ question, answer }) => (
            <div
              key={question}
              className="border rounded-lg p-6 bg-background-elevated hover:shadow-md hover:border-accent transition-all hover:scale-[1.01]"
            >
              <h3 className="font-semibold mb-2">{question}</h3>
              <p className="text-sm text-foreground-muted line-clamp-3">
                {answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* All Questions */}
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
                <AccordionTrigger className="text-left p-6 hover:bg-background-elevated">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-hidden no-scrollbar">
                    <div className="text-sm text-foreground-muted max-w-none px-6 pb-6">
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
            <p className="mt-1 text-sm text-foreground-muted mb-4">
              Your search for "<span className="font-medium">{query}</span>" did
              not return any results.
            </p>
            <Button href="/contact-us" variant="outline">
              Contact our support team
            </Button>
          </div>
        )}
      </section>
      <AccountFooter />
    </Container>
  );
}
