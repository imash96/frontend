"use client"

import type { HttpTypes } from "@medusajs/types"
import {
    BookmarkCheck,
    Building2,
    Check,
    CheckCircle2,
    Edit3,
    Mail,
    MapPin,
    Phone,
    Plus,
    User,
} from "lucide-react"
import { useEffect, useState } from "react"
import { setCheckAddresses } from "@/lib/action/checkout"
import { usePreviewFlowStore } from "@/lib/store/preview-flow-store"
import Button from "@/ui/button"
import Input from "@/ui/input"
import NativeSelect from "@/ui/native-select"

const COUNTRY_OPTIONS = [
    { code: "us", label: "United States" },
    { code: "gb", label: "United Kingdom" },
    { code: "ca", label: "Canada" },
    { code: "de", label: "Germany" },
    { code: "fr", label: "France" },
    { code: "it", label: "Italy" },
    { code: "au", label: "Australia" },
]

export default function CheckoutAddressStep() {
    const cart = usePreviewFlowStore((s) => s.cart)
    const customer = usePreviewFlowStore((s) => s.customer)
    const activeStep = usePreviewFlowStore((s) => s.activeStep)
    const viewMode = usePreviewFlowStore((s) => s.viewMode)
    const sameAsBilling = usePreviewFlowStore((s) => s.sameAsBilling)
    const setSameAsBilling = usePreviewFlowStore((s) => s.setSameAsBilling)
    const setActiveStep = usePreviewFlowStore((s) => s.setActiveStep)
    const saveAddresses = usePreviewFlowStore((s) => s.saveAddresses)

    const isOpen = viewMode === "single" || activeStep === "address"
    const isCompleted = Boolean(
        cart.shipping_address?.first_name &&
            cart.shipping_address?.address_1 &&
            cart.shipping_address?.city &&
            cart.shipping_address?.postal_code &&
            cart.email,
    )

    const savedAddresses = customer?.addresses ?? []
    const [selectedSavedId, setSelectedSavedId] = useState<string | "new">(
        savedAddresses[0]?.id ?? "new",
    )

    const [form, setForm] = useState({
        email: cart.email || customer?.email || "alexander.vane@vellehide.com",
        first_name: cart.shipping_address?.first_name || "Alexander",
        last_name: cart.shipping_address?.last_name || "Vane",
        company: cart.shipping_address?.company || "Vane Capital Partners",
        address_1: cart.shipping_address?.address_1 || "450 Park Avenue",
        address_2: cart.shipping_address?.address_2 || "Suite 2200",
        city: cart.shipping_address?.city || "New York",
        province: cart.shipping_address?.province || "NY",
        postal_code: cart.shipping_address?.postal_code || "10022",
        country_code: cart.shipping_address?.country_code || "us",
        phone: cart.shipping_address?.phone || "+1 (212) 555-0194",
    })

    const [billing, setBilling] = useState({
        first_name: cart.billing_address?.first_name || "Alexander",
        last_name: cart.billing_address?.last_name || "Vane",
        company: cart.billing_address?.company || "",
        address_1: cart.billing_address?.address_1 || "450 Park Avenue",
        address_2: cart.billing_address?.address_2 || "Suite 2200",
        city: cart.billing_address?.city || "New York",
        province: cart.billing_address?.province || "NY",
        postal_code: cart.billing_address?.postal_code || "10022",
        country_code: cart.billing_address?.country_code || "us",
        phone: cart.billing_address?.phone || "+1 (212) 555-0194",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [saving, setSaving] = useState(false)
    const [savedToast, setSavedToast] = useState(false)

    // Keep local form synced if cart shipping address changes externally
    useEffect(() => {
        if (cart.shipping_address) {
            setForm((prev) => ({
                ...prev,
                email: cart.email || prev.email,
                first_name: cart.shipping_address?.first_name || prev.first_name,
                last_name: cart.shipping_address?.last_name || prev.last_name,
                company: cart.shipping_address?.company ?? prev.company,
                address_1: cart.shipping_address?.address_1 || prev.address_1,
                address_2: cart.shipping_address?.address_2 ?? prev.address_2,
                city: cart.shipping_address?.city || prev.city,
                province: cart.shipping_address?.province || prev.province,
                postal_code: cart.shipping_address?.postal_code || prev.postal_code,
                country_code:
                    cart.shipping_address?.country_code || prev.country_code,
                phone: cart.shipping_address?.phone || prev.phone,
            }))
        }
    }, [cart.shipping_address, cart.email])

    const applySavedAddress = (addr: HttpTypes.StoreCustomerAddress) => {
        setSelectedSavedId(addr.id)
        setErrors({})
        setForm((prev) => ({
            ...prev,
            first_name: addr.first_name || prev.first_name,
            last_name: addr.last_name || prev.last_name,
            company: addr.company || "",
            address_1: addr.address_1 || "",
            address_2: addr.address_2 || "",
            city: addr.city || "",
            province: addr.province || "",
            postal_code: addr.postal_code || "",
            country_code: addr.country_code || "us",
            phone: addr.phone || prev.phone,
        }))
    }

    const validateForm = () => {
        const nextErrors: Record<string, string> = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
            nextErrors.email = "Please enter a valid email address"
        }
        if (!form.first_name.trim()) nextErrors.first_name = "First name is required"
        if (!form.last_name.trim()) nextErrors.last_name = "Last name is required"
        if (!form.address_1.trim())
            nextErrors.address_1 = "Street address is required"
        if (!form.city.trim()) nextErrors.city = "City is required"
        if (!form.province.trim())
            nextErrors.province = "State / Province is required"
        if (!form.postal_code.trim())
            nextErrors.postal_code = "Postal / ZIP code is required"
        if (!form.phone.trim()) nextErrors.phone = "Phone number is required"

        if (!sameAsBilling) {
            if (!billing.first_name.trim())
                nextErrors.billing_first_name = "Billing first name is required"
            if (!billing.last_name.trim())
                nextErrors.billing_last_name = "Billing last name is required"
            if (!billing.address_1.trim())
                nextErrors.billing_address_1 = "Billing street address is required"
            if (!billing.city.trim())
                nextErrors.billing_city = "Billing city is required"
            if (!billing.postal_code.trim())
                nextErrors.billing_postal_code = "Billing postal code is required"
        }

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const handleSaveAndContinue = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setSaving(true)
        try {
            const shippingPayload: HttpTypes.StoreCartAddress = {
                id: cart.shipping_address?.id || "addr_ship_preview",
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                company: form.company.trim() || undefined,
                address_1: form.address_1.trim(),
                address_2: form.address_2.trim() || undefined,
                city: form.city.trim(),
                province: form.province.trim(),
                postal_code: form.postal_code.trim(),
                country_code: form.country_code,
                phone: form.phone.trim(),
                metadata: undefined,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            const billingPayload: HttpTypes.StoreCartAddress = sameAsBilling
                ? shippingPayload
                : {
                      id: cart.billing_address?.id || "addr_bill_preview",
                      first_name: billing.first_name.trim(),
                      last_name: billing.last_name.trim(),
                      company: billing.company.trim() || undefined,
                      address_1: billing.address_1.trim(),
                      address_2: billing.address_2.trim() || undefined,
                      city: billing.city.trim(),
                      province: billing.province.trim(),
                      postal_code: billing.postal_code.trim(),
                      country_code: billing.country_code,
                      phone: billing.phone.trim(),
                      metadata: undefined,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                  }

            // Update preview flow store immediately
            saveAddresses({
                email: form.email.trim(),
                shippingAddress: shippingPayload,
                billingAddress: billingPayload,
                sameAsBilling,
            })

            // Also attempt live Medusa cart update if a real cart cookie exists
            if (cart.id && !cart.id.startsWith("cart_preview_")) {
                const fd = new FormData()
                fd.set("email", form.email.trim())
                fd.set("shipping_address.first_name", shippingPayload.first_name || "")
                fd.set("shipping_address.last_name", shippingPayload.last_name || "")
                fd.set("shipping_address.company", shippingPayload.company || "")
                fd.set("shipping_address.address_1", shippingPayload.address_1 || "")
                fd.set("shipping_address.address_2", shippingPayload.address_2 || "")
                fd.set("shipping_address.city", shippingPayload.city || "")
                fd.set("shipping_address.province", shippingPayload.province || "")
                fd.set(
                    "shipping_address.postal_code",
                    shippingPayload.postal_code || "",
                )
                fd.set(
                    "shipping_address.country_code",
                    shippingPayload.country_code || "us",
                )
                fd.set("shipping_address.phone", shippingPayload.phone || "")
                if (sameAsBilling) fd.set("same_as_billing", "on")
                await setCheckAddresses(null, fd).catch(() => null)
            }

            setSavedToast(true)
            window.setTimeout(() => setSavedToast(false), 2000)
        } finally {
            setSaving(false)
        }
    }

    return (
        <section
            aria-labelledby="checkout-step-address"
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs transition-all"
        >
            {/* Step Header */}
            <div className="flex items-center justify-between border-b border-divider bg-background-secondary/40 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <span
                        className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                            isCompleted && !isOpen
                                ? "bg-success text-success-foreground"
                                : "bg-primary text-primary-foreground"
                        }`}
                    >
                        {isCompleted && !isOpen ? (
                            <Check className="size-4" strokeWidth={2.5} />
                        ) : (
                            "1"
                        )}
                    </span>
                    <div>
                        <h2
                            id="checkout-step-address"
                            className="font-heading text-base font-bold text-text-primary sm:text-lg"
                        >
                            Contact & Delivery Address
                        </h2>
                        <p className="text-xs text-text-secondary">
                            Where should our courier deliver your handcrafted garment?
                        </p>
                    </div>
                </div>

                {!isOpen && isCompleted && (
                    <button
                        type="button"
                        onClick={() => setActiveStep("address")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-muted"
                    >
                        <Edit3 className="size-3.5" />
                        <span>Edit</span>
                    </button>
                )}
            </div>

            {/* Collapsed Summary */}
            {!isOpen && isCompleted && (
                <div className="grid grid-cols-1 gap-4 p-5 text-xs sm:grid-cols-3 sm:px-6">
                    <div>
                        <p className="font-semibold uppercase tracking-wider text-text-tertiary">
                            Recipient
                        </p>
                        <p className="mt-1 font-medium text-text-primary">
                            {cart.shipping_address?.first_name}{" "}
                            {cart.shipping_address?.last_name}
                        </p>
                        <p className="text-text-secondary">{cart.email}</p>
                        <p className="text-text-secondary">
                            {cart.shipping_address?.phone}
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold uppercase tracking-wider text-text-tertiary">
                            Shipping Destination
                        </p>
                        <p className="mt-1 font-medium text-text-primary">
                            {cart.shipping_address?.address_1}
                            {cart.shipping_address?.address_2
                                ? `, ${cart.shipping_address.address_2}`
                                : ""}
                        </p>
                        <p className="text-text-secondary">
                            {cart.shipping_address?.city},{" "}
                            {cart.shipping_address?.province}{" "}
                            {cart.shipping_address?.postal_code} (
                            {cart.shipping_address?.country_code?.toUpperCase()})
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold uppercase tracking-wider text-text-tertiary">
                            Billing Address
                        </p>
                        <p className="mt-1 font-medium text-text-primary">
                            {sameAsBilling
                                ? "Same as shipping address"
                                : `${cart.billing_address?.address_1}, ${cart.billing_address?.city}`}
                        </p>
                    </div>
                </div>
            )}

            {/* Expanded Form */}
            {isOpen && (
                <form
                    onSubmit={handleSaveAndContinue}
                    noValidate
                    className="space-y-6 p-5 sm:p-6"
                >
                    {/* Saved Address Book Selector */}
                    {savedAddresses.length > 0 && (
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                    <BookmarkCheck className="size-3.5 text-accent" />
                                    Saved Atelier Address Book
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedSavedId("new")
                                        setForm((prev) => ({
                                            ...prev,
                                            company: "",
                                            address_1: "",
                                            address_2: "",
                                            city: "",
                                            province: "",
                                            postal_code: "",
                                        }))
                                    }}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-link hover:underline"
                                >
                                    <Plus className="size-3.5" />
                                    <span>New Address</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {savedAddresses.map((addr) => {
                                    const active = selectedSavedId === addr.id
                                    return (
                                        <button
                                            key={addr.id}
                                            type="button"
                                            onClick={() => applySavedAddress(addr)}
                                            className={`flex items-start justify-between rounded-xl border p-3.5 text-left transition-all ${
                                                active
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                    : "border-border bg-background/50 hover:border-border-strong"
                                            }`}
                                        >
                                            <div className="space-y-0.5 text-xs">
                                                <p className="font-semibold text-text-primary">
                                                    {addr.first_name} {addr.last_name}
                                                    {addr.company ? ` — ${addr.company}` : ""}
                                                </p>
                                                <p className="text-text-secondary">
                                                    {addr.address_1}
                                                    {addr.address_2 ? `, ${addr.address_2}` : ""}
                                                </p>
                                                <p className="text-text-tertiary">
                                                    {addr.city}, {addr.province}{" "}
                                                    {addr.postal_code}
                                                </p>
                                            </div>
                                            <span
                                                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                                                    active
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-border-strong"
                                                }`}
                                            >
                                                {active && (
                                                    <Check
                                                        className="size-2.5"
                                                        strokeWidth={3}
                                                    />
                                                )}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Email for Order & Tracking"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, email: e.target.value }))
                            }
                            error={errors.email}
                        />
                        <Input
                            label="Courier Contact Phone"
                            name="phone"
                            type="tel"
                            required
                            value={form.phone}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, phone: e.target.value }))
                            }
                            error={errors.phone}
                        />
                    </div>

                    {/* Shipping Address Fields */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="First Name"
                            name="first_name"
                            required
                            value={form.first_name}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, first_name: e.target.value }))
                            }
                            error={errors.first_name}
                        />
                        <Input
                            label="Last Name"
                            name="last_name"
                            required
                            value={form.last_name}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, last_name: e.target.value }))
                            }
                            error={errors.last_name}
                        />
                        <Input
                            label="Street Address"
                            name="address_1"
                            required
                            value={form.address_1}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, address_1: e.target.value }))
                            }
                            error={errors.address_1}
                        />
                        <Input
                            label="Apartment, Suite, Unit (Optional)"
                            name="address_2"
                            value={form.address_2}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, address_2: e.target.value }))
                            }
                        />
                        <Input
                            label="Company (Optional)"
                            name="company"
                            value={form.company}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, company: e.target.value }))
                            }
                        />
                        <Input
                            label="City"
                            name="city"
                            required
                            value={form.city}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, city: e.target.value }))
                            }
                            error={errors.city}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="State / Province"
                                name="province"
                                required
                                value={form.province}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, province: e.target.value }))
                                }
                                error={errors.province}
                            />
                            <Input
                                label="ZIP / Postal"
                                name="postal_code"
                                required
                                value={form.postal_code}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        postal_code: e.target.value,
                                    }))
                                }
                                error={errors.postal_code}
                            />
                        </div>
                        <NativeSelect
                            label="Country / Region"
                            name="country_code"
                            required
                            value={form.country_code}
                            options={COUNTRY_OPTIONS.map((c) => ({
                                value: c.code,
                                label: c.label,
                            }))}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, country_code: e.target.value }))
                            }
                        />
                    </div>

                    {/* Billing Address Toggle */}
                    <div className="rounded-xl border border-border bg-background-secondary/40 p-4">
                        <label className="flex cursor-pointer items-center gap-3">
                            <input
                                type="checkbox"
                                checked={sameAsBilling}
                                onChange={(e) => setSameAsBilling(e.target.checked)}
                                className="size-4 rounded border-border accent-primary"
                            />
                            <span className="text-xs font-medium text-text-primary sm:text-sm">
                                Billing address is the same as my delivery address
                            </span>
                        </label>

                        {!sameAsBilling && (
                            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-divider pt-4 sm:grid-cols-2">
                                <Input
                                    label="Billing First Name"
                                    name="billing_first_name"
                                    required
                                    value={billing.first_name}
                                    onChange={(e) =>
                                        setBilling((b) => ({
                                            ...b,
                                            first_name: e.target.value,
                                        }))
                                    }
                                    error={errors.billing_first_name}
                                />
                                <Input
                                    label="Billing Last Name"
                                    name="billing_last_name"
                                    required
                                    value={billing.last_name}
                                    onChange={(e) =>
                                        setBilling((b) => ({
                                            ...b,
                                            last_name: e.target.value,
                                        }))
                                    }
                                    error={errors.billing_last_name}
                                />
                                <Input
                                    label="Billing Street Address"
                                    name="billing_address_1"
                                    required
                                    value={billing.address_1}
                                    onChange={(e) =>
                                        setBilling((b) => ({
                                            ...b,
                                            address_1: e.target.value,
                                        }))
                                    }
                                    error={errors.billing_address_1}
                                />
                                <Input
                                    label="Billing City"
                                    name="billing_city"
                                    required
                                    value={billing.city}
                                    onChange={(e) =>
                                        setBilling((b) => ({
                                            ...b,
                                            city: e.target.value,
                                        }))
                                    }
                                    error={errors.billing_city}
                                />
                                <Input
                                    label="Billing State / Province"
                                    name="billing_province"
                                    value={billing.province}
                                    onChange={(e) =>
                                        setBilling((b) => ({
                                            ...b,
                                            province: e.target.value,
                                        }))
                                    }
                                />
                                <Input
                                    label="Billing ZIP / Postal"
                                    name="billing_postal_code"
                                    required
                                    value={billing.postal_code}
                                    onChange={(e) =>
                                        setBilling((b) => ({
                                            ...b,
                                            postal_code: e.target.value,
                                        }))
                                    }
                                    error={errors.billing_postal_code}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        {savedToast ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                                <CheckCircle2 className="size-4" />
                                Address verified & saved
                            </span>
                        ) : (
                            <span className="text-xs text-text-tertiary">
                                Signature required upon delivery for full insurance coverage.
                            </span>
                        )}

                        <Button
                            type="submit"
                            isLoading={saving}
                            variant="primary"
                            size="lg"
                            className="rounded-xl px-6 text-xs font-semibold uppercase tracking-wider"
                            data-testid="save-address-button"
                        >
                            {viewMode === "stepped"
                                ? "Continue to Shipping Method"
                                : "Save Delivery Address"}
                        </Button>
                    </div>
                </form>
            )}
        </section>
    )
}
