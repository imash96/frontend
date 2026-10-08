import { ExternalLink, Shield } from "lucide-react";
import ProviderContainer from "../componenets/provider-container";
import BrowserWireframe from "@/icon/browser-wireframe";

export default function PayuDefault() {
    return (
        <ProviderContainer>
            <BrowserWireframe className="w-40 sm:w-48 lg:w-64" />
            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
                    After clicking &quot;Pay with PayU&quot;, you will be redirected to PayU&apos;s secure payment gateway to complete your purchase. Pay with UPI, Net Banking, Credit/Debit Cards, or Wallets.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                    <ExternalLink className="w-3 h-3" />
                    <span>Secure redirect to PayU payment gateway</span>
                </div>
            </div>
        </ProviderContainer>
    )
}