import { Clock } from "lucide-react"
import ProviderPanel, { ProviderInfo } from "../componenets/provider-panel"

// The Place Order button lives in componenets/place-order-button.tsx.
export default function SystemDefault() {
    return (
        <ProviderPanel>
            <ProviderInfo
                title="Pay Later"
                icon={<Clock className="size-10 text-accent" aria-hidden="true" />}
            >
                Place your order now and complete your payment later using your preferred method. We&apos;ll send you
                payment instructions after your order is confirmed.
            </ProviderInfo>
        </ProviderPanel>
    )
}