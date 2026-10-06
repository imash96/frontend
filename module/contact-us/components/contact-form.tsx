"use client";

import { AlertTriangle, CheckCircle2, Mail, Send } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { type ContactFormState, submitContactMessage, } from "@/lib/action/contact";
import Button from "@/ui/button";
import CustomSelect from "@/ui/custom/custom-select";
import Textarea from "@/ui/textarea";
import CustomInput from "@/ui/input";

const TOPIC_OPTIONS = [
    { value: "order", label: "An existing order" },
    { value: "sizing", label: "Sizing & fit" },
    { value: "bespoke", label: "Bespoke / made to measure" },
    { value: "returns", label: "Returns, exchanges or a repair" },
    { value: "wholesale", label: "Wholesale & stockists" },
    { value: "other", label: "Something else" },
];

const SUPPORT_EMAIL = "contact@vellehide.com";

// Kept here rather than exported from the action: a "use server" module may
// only export async functions, so a shared const would arrive as `undefined`.
const INITIAL_STATE: ContactFormState = {
    ok: false,
    error: null,
    configured: true,
    fields: {},
};

export default function ContactForm() {
    const [state, formAction, isPending] = useActionState(
        submitContactMessage,
        INITIAL_STATE,
    );
    // Bumping the key remounts the form so every input clears after a send.
    const [resetKey, setResetKey] = useState(0);
    const [sent, setSent] = useState(false);

    // `submitContactMessage` returns a fresh object every time it resolves, so
    // `state` identity is a reliable "a submit just finished" signal.
    useEffect(() => {
        if (state.ok) {
            setSent(true);
            setResetKey((k) => k + 1);
        }
    }, [state]);

    if (sent) {
        return (
            // <output> carries an implicit role="status", so the confirmation is
            // announced to assistive tech without a redundant ARIA role.
            <output className="bg-success-subtle border-success/30 flex flex-col items-start gap-4 rounded-xl border p-8">
                <CheckCircle2
                    className="text-success size-8"
                    strokeWidth={1.5}
                    aria-hidden="true"
                />
                <div>
                    <h3 className="font-heading text-lg font-semibold tracking-tight">
                        Message sent
                    </h3>
                    <p className="text-foreground-secondary mt-2 text-sm leading-relaxed">
                        Thank you - your note is with our team. We reply to every enquiry
                        within one working day, and bespoke commissions within two.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSent(false)}
                    className="mt-2"
                >
                    Send another message
                </Button>
            </output>
        );
    }

    return (
        <div className="space-y-6">
            {state.error && (
                <p
                    role="alert"
                    className="bg-error-subtle text-error border-error/30 flex items-start gap-3 rounded-lg border p-4 text-sm"
                >
                    <AlertTriangle
                        className="mt-px size-4 shrink-0"
                        strokeWidth={1.75}
                        aria-hidden="true"
                    />
                    {state.error}
                </p>
            )}

            {!state.configured && (
                <p
                    role="alert"
                    className="bg-warning-subtle text-warning border-warning/30 flex items-start gap-3 rounded-lg border p-4 text-sm"
                >
                    <AlertTriangle
                        className="mt-px size-4 shrink-0"
                        strokeWidth={1.75}
                        aria-hidden="true"
                    />
                    <span>
                        Online messaging isn&apos;t wired up on this server yet. Please
                        reach us at{" "}
                        <a
                            href={`mailto:${SUPPORT_EMAIL}`}
                            className="font-semibold underline underline-offset-2"
                        >
                            {SUPPORT_EMAIL}
                        </a>{" "}
                        and we&apos;ll pick it up there.
                    </span>
                </p>
            )}

            <form key={resetKey} action={formAction} className="space-y-5" noValidate>
                {/* Honeypot — hidden from people, irresistible to bots. */}
                <div className="sr-only" aria-hidden="true">
                    <label htmlFor="contact-company">Company</label>
                    <input
                        id="contact-company"
                        name="company"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <CustomInput
                        label="First Name"
                        name="firstName"
                        autoComplete="given-name"
                        required
                        error={state.fields.firstName}
                    />
                    <CustomInput
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        error={state.fields.lastName}
                    />
                </div>

                <CustomInput
                    label="Email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    error={state.fields.email}
                />

                <CustomSelect
                    label="What is this about?"
                    name="topic"
                    options={TOPIC_OPTIONS}
                    defaultValue="order"
                    fullWidth
                />

                <CustomInput
                    label="Order Number"
                    name="orderNumber"
                    helperText="Optional — helps us find your order faster."
                    autoComplete="off"
                />

                <Textarea
                    label="Message"
                    name="message"
                    required
                    rows={6}
                    error={state.fields.message}
                    helperText="Include measurements, photos of the piece, or the reference you like — the more detail, the better our first answer."
                />

                <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    isLoading={isPending}
                    icon={<Send className="size-4" />}
                    iconPosition="right"
                >
                    {isPending ? "Sending…" : "Send message"}
                </Button>

                <p className="text-foreground-tertiary flex items-center gap-2 text-xs">
                    <Mail
                        className="size-3.5 shrink-0"
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                    Prefer email? Write to{" "}
                    <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="text-link hover:text-link-hover underline underline-offset-2 transition-colors"
                    >
                        {SUPPORT_EMAIL}
                    </a>
                </p>
            </form>
        </div>
    );
}