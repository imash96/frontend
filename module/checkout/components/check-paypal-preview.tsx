import BrowserWireframe from "@/icon/browser-wireframe"
import CheckPaymentContainer from "./check-payment-container"

export default function CheckPayPalPreview() {
  return (
    <CheckPaymentContainer>
      <BrowserWireframe className="w-40 sm:w-48 lg:w-64" />
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
        After clicking &quot;Pay with PayPal&quot;, you will be redirected to
        PayPal to complete your purchase securely.
      </p>
    </CheckPaymentContainer>
  )
}
