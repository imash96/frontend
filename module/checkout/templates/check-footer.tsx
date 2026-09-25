import Image from "next/image"
import Container from "@/ui/container"

const YEAR = new Date().getFullYear()

export default async function CheckFooter() {
  return (
    <footer
      aria-labelledby="check-footer-heading"
      className="border-t border-border bg-primary text-primary-foreground"
    >
      <h2 id="check-footer-heading" className="sr-only">
        Footer
      </h2>
      <Container>
        <div className="flex flex-col gap-y-3 md:flex-row-reverse py-3 sm:py-4 text-center items-center justify-between">
          <Image
            className="h-10 sm:h-12 w-auto"
            height={100}
            width={200}
            loading="lazy"
            aria-hidden="true"
            src="/storefront/images/contents/StripeBadge.png"
            alt="Stripe Payment Secure"
          />
          <p className="text-xs sm:text-sm">
            &copy; {YEAR} Velle Hide
          </p>
        </div>
      </Container>
    </footer>
  )
}
