import type { Metadata } from "next"
import CheckHeader from "@/module/checkout/templates/check-header"
import CheckFooter from "@/module/checkout/templates/check-footer"
import Container from "@/ui/container"

export default function CheckLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <CheckHeader />
      <Container
        as="main"
        size="lg"
        className="grid grid-cols-1 gap-x-8 lg:gap-x-14 gap-y-4 sm:gap-y-6 lg:gap-y-8 lg:grid-cols-10 py-4 sm:py-6 md:py-10 lg:py-14"
      >
        {children}
      </Container>
      <CheckFooter />
    </>
  )
}

export const metadata: Metadata = {
  title: "Secure Checkout | Velle Hide Store",
  description:
    "Complete your purchase securely at Velle Hide Store. Pay with credit card, PayPal, or choose Pay Later.",
}
