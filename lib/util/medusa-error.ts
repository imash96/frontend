export default function medusaError(error: any): never {
    // Medusa JS SDK FetchError shape: { status, statusText, message, ... }
    if (typeof error === "object" && error !== null) {
        const message: string = error.message || error.body?.message || error.statusText || "An unknown error occurred"

        if (process.env.NODE_ENV === "development") {
            console.error("[medusaError]", {
                status: error.status,
                statusText: error.statusText,
                message,
            })
        }

        throw new Error(message.charAt(0).toUpperCase() + message.slice(1) + (message.endsWith(".") ? "" : "."))
    }

    throw new Error(String(error))
}