import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Logo from "@/icon/logo";
import ThemeButton from "@/layout/home/components/button-theme";
import { getInitialTheme } from "@/lib/util/get-initial-theme";
import Container from "@/ui/container";

export default async function CheckoutHeader() {
  const initialTheme = await getInitialTheme();
  return (
    <>
      <header className="sticky top-0 z-40 bg-background-muted border-b border-border shadow-sm">
        <Container
          as="nav"
          aria-label="Checkout navigation"
          className="flex items-center justify-between h-18 px-4 sm:px-6 lg:px-8"
        >
          <Link
            href="/cart"
            className="flex items-center text-foreground-muted hover:text-foreground-disabled transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Back to Cart</span>
          </Link>
          <Link href={"/"} aria-label="Go to homepage">
            <Logo className="h-8 w-auto" />
          </Link>
          <ThemeButton
            initialTheme={initialTheme}
            className="rounded-md border p-2 border-border hover:text-accent-foreground hover:bg-accent transition-colors"
          />
        </Container>
      </header>
    </>
  );
}
