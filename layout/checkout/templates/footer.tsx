import Container from "@/ui/container";
import Image from "next/image";

export default async function CheckoutFooter() {
  return (
    <footer
      aria-labelledby="footer-heading"
      className="footer border-t border-border bg-primary text-primary-foreground"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <Container>
        <div className="flex flex-col gap-y-4 md:flex-row-reverse py-4 text-center items-center justify-between">
          <Image
            className="h-12 w-auto"
            height={100}
            width={200}
            loading="lazy"
            aria-hidden="true"
            src="/storefront/images/contents/StripeBadge.png"
            alt="Stripe Payment Secure"
          />
          <p>&copy; {new Date().getFullYear()} Velle Hide</p>
        </div>
      </Container>
    </footer>
  );
}
