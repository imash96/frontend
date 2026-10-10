import Container from "@/ui/container"
import CheckHeader from "@/layout/checkout/templates/header"
import CheckoutProgress from "@/module/checkout/templates/progress"

export default function CheckLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <CheckHeader />
      <CheckoutProgress />
      <Container
        as="main"
        size="xl"
        className="grid grid-cols-1 gap-x-8 lg:gap-x-14 gap-y-4 sm:gap-y-6 lg:gap-y-8 lg:grid-cols-10 py-4 sm:py-6 md:py-10 lg:py-14 outline-none"
        tabIndex={-1}
      >
        {children}
      </Container>
    </>
  )
}
