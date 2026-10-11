import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Logo from "@/icon/logo"
import ThemeButton from "@/layout/home/components/button-theme"
import { getInitialTheme } from "@/lib/util/get-initial-theme"
import Container from "@/ui/container"

export default async function CheckHeader() {
  const initialTheme = await getInitialTheme()
  return (
    <header className="sticky top-0 z-40 bg-muted/80 backdrop-blur-lg border-b border-border shadow-sm">
      <Container
        as="nav"
        size="xl"
        aria-label="Checkout navigation"
        className="flex items-center justify-between h-14 sm:h-16 lg:h-18"
      >
        <Link
          href="/cart"
          className="flex items-center gap-1.5 text-foreground-tertiary hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline text-sm font-medium">Back to Cart</span>
        </Link>
        <Link href="/" aria-label="Go to homepage">
          <Logo className="h-6 sm:h-7 lg:h-8 w-auto" />
        </Link>
        <ThemeButton
          initialTheme={initialTheme}
          className="rounded-md border p-1.5 sm:p-2 border-border hover:text-accent-foreground hover:bg-accent transition-colors"
        />
      </Container>
    </header>
  )
}
