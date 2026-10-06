"use client"

import { ExternalLink, Shield } from "lucide-react"
import CheckPaymentContainer from "./check-payment-container"

export default function CheckPayUPreview() {
  return (
    <CheckPaymentContainer>
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold">
          PayU Secure Checkout
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
          You will be redirected to PayU&apos;s secure payment page to complete
          your purchase. Pay with UPI, Net Banking, Credit/Debit Cards, or
          Wallets.
        </p>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
          <ExternalLink className="w-3 h-3" />
          <span>Secure redirect to PayU payment gateway</span>
        </div>
      </div>
    </CheckPaymentContainer>
  )
}
