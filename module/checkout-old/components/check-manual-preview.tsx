import { Clock } from "lucide-react"
import CheckPaymentContainer from "./check-payment-container"

export default function CheckManualPreview() {
  return (
    <CheckPaymentContainer>
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
        <h3 className="text-base sm:text-lg font-semibold">Pay Later</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
          Place your order now and complete your payment later using your
          preferred method. We&apos;ll send you payment instructions after your
          order is confirmed.
        </p>
      </div>
    </CheckPaymentContainer>
  )
}
