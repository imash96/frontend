"use server";

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT MESSAGE
   Medusa v2 has no first-party "contact form" endpoint, so this action is the
   single seam between the storefront form and wherever you want enquiries to
   land.

   Set CONTACT_FORM_ENDPOINT in the storefront's server environment to any URL
   that accepts a JSON POST — a Medusa custom API route, a Formspree/Web3Forms
   bucket, or an internal webhook:

     CONTACT_FORM_ENDPOINT="https://admin.vellehide.com/hooks/contact"

   When it is unset the action reports `configured: false` instead of
   pretending the message went anywhere, and the form falls back to a mailto
   link so the visitor is never left with a dead end.
   ──────────────────────────────────────────────────────────────────────────── */

export type ContactTopic = "order" | "sizing" | "bespoke" | "returns" | "wholesale" | "other";

export type ContactFormState = {
    /** The message reached the delivery endpoint and it answered 2xx. */
    ok: boolean;
    /** Human-readable validation or delivery failure. */
    error: string | null;
    /** True when no delivery endpoint is configured on the server. */
    configured: boolean;
    /** Per-field errors, keyed by input name. */
    fields: Record<string, string>;
};

const MAX_MESSAGE = 2000;
const MIN_MESSAGE = 20;

const TOPICS: ContactTopic[] = [
    "order",
    "sizing",
    "bespoke",
    "returns",
    "wholesale",
    "other",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// A "use server" module may only export async functions, so this stays
// module-local — the client component owns its own initial state literal.
const EMPTY: ContactFormState = {
    ok: false,
    error: null,
    configured: true,
    fields: {},
};

function str(value: FormDataEntryValue | null, max = 200): string {
    return (typeof value === "string" ? value : "").trim().slice(0, max);
}

export async function submitContactMessage(
    _prevState: ContactFormState | null,
    formData: FormData,
): Promise<ContactFormState> {
    const fields: Record<string, string> = {};

    // Honeypot: real browsers never fill this hidden field, most bots do.
    // Answer as if everything worked so the bot gets no signal.
    if (str(formData.get("company"))) {
        return { ...EMPTY, ok: true };
    }

    const firstName = str(formData.get("firstName"), 80);
    const lastName = str(formData.get("lastName"), 80);
    const email = str(formData.get("email"), 254);
    const orderNumber = str(formData.get("orderNumber"), 60);
    const message = str(formData.get("message"), MAX_MESSAGE);
    const topicRaw = str(formData.get("topic"), 32);
    const topic: ContactTopic = TOPICS.includes(topicRaw as ContactTopic)
        ? (topicRaw as ContactTopic)
        : "other";

    if (!firstName) fields.firstName = "Please tell us your first name.";
    if (!email) fields.email = "An email address is required so we can reply.";
    else if (!EMAIL_RE.test(email))
        fields.email = "That email address doesn't look right.";
    if (!message) fields.message = "Please add a message.";
    else if (message.length < MIN_MESSAGE)
        fields.message = `A little more detail helps — ${MIN_MESSAGE} characters minimum.`;

    if (Object.keys(fields).length > 0) {
        return {
            ok: false,
            error: "Please check the highlighted fields.",
            configured: true,
            fields,
        };
    }

    const endpoint = process.env.CONTACT_FORM_ENDPOINT;

    if (!endpoint) {
        return {
            ok: false,
            error: null,
            configured: false,
            fields: {},
        };
    }

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email,
                order_number: orderNumber || null,
                topic,
                message,
                submitted_at: new Date().toISOString(),
                source: "storefront:/contact-us",
            }),
            signal: AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
            return {
                ok: false,
                error: `We couldn't send that just now (status ${response.status}). Please email contact@vellehide.com instead.`,
                configured: true,
                fields: {},
            };
        }

        return { ok: true, error: null, configured: true, fields: {} };
    } catch (error) {
        const timedOut = error instanceof Error && error.name === "TimeoutError";

        return {
            ok: false,
            error: timedOut
                ? "Our message service timed out. Please email contact@vellehide.com instead."
                : "Something went wrong sending your message. Please email contact@vellehide.com instead.",
            configured: true,
            fields: {},
        };
    }
}