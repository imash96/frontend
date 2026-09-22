import type { Metadata } from "next";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/ui/button";
import Google from "@/icon/icon-google";
import Logo from "@/icon/logo";
import { googleLogin, appleLogin } from "@/lib/action/customer";

export const metadata: Metadata = {
  title: "Sign In | Velle Hide",
  description:
    "Sign in or create an account to access your Velle Hide dashboard, track orders, manage addresses, and enjoy a personalized leather shopping experience.",
  robots: { index: false, follow: false },
};

export default async function Layout({ children }: LayoutProps<"/auth">) {
  return (
    <main className="flex min-h-dvh" id="main-content" tabIndex={-1}>
      {/* Left Banner */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-8 xl:p-12">
        <div className="absolute inset-0">
          <Image
            src="https://images.artisanhide.com/storefront/images/banner/auth.webp"
            alt="Leather product promotional banner"
            fill
            quality={80}
            sizes="(min-width: 1024px) 50vw, 0vw"
            className="object-cover object-top"
            placeholder="empty"
            priority
          />
          {/* Gradient overlay for text contrast */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/10" />
        </div>

        <Button
          href="/"
          variant="outline"
          icon={<Home className="w-4 h-4" />}
          className="relative z-10 w-fit gap-2"
        >
          Home
        </Button>

        <div className="relative z-10 animate-fade-in-up">
          <h1 className="text-3xl xl:text-4xl text-white font-extrabold leading-snug mb-4 font-heading">
            Crafted Elegance,
            <br />
            Timeless Style
          </h1>
          <p className="max-w-md text-white/80 text-sm xl:text-base leading-relaxed">
            Discover premium leather essentials that combine rugged
            craftsmanship with refined detail.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="max-w-sm mx-auto flex flex-col w-full lg:w-1/2 justify-center items-center overflow-auto no-scrollbar px-5 sm:px-8 md:px-12">
        {/* Mobile-only brand banner */}
        <div className="lg:hidden w-full py-6 text-center animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-3">
            <Logo className="w-28" />
          </Link>
          <p className="mt-2 text-xs text-muted-foreground max-w-xs mx-auto">
            Premium leather essentials — crafted with care.
          </p>
        </div>

        {/* Desktop logo */}
        <div className="hidden lg:flex justify-center pt-6 lg:pt-10 xl:pt-20">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="w-32" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center md:p-8 md:pt-0 w-full">
          <div className="w-full max-w-xs sm:max-w-sm p-4 sm:p-6 relative animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {/* Auth Form */}
            {children}

            {/* Divider */}
            <div className="relative my-6" role="separator">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full h-px bg-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-xs text-muted-foreground uppercase tracking-wider">
                  or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              role="group"
              aria-label="Social login options"
            >
              <form action={googleLogin}>
                <Button
                  icon={<Google className="h-4 w-4" />}
                  variant="outline"
                  type="submit"
                  className="w-full py-2.5"
                >
                  <span className="text-sm font-medium">Google</span>
                </Button>
              </form>
              <form action={appleLogin}>
                <Button
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 lucide lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 3.25S10 8 9 7.5s-2-2-2-3.25S8 2 10 2Z" /></svg>}
                  variant="outline"
                  type="submit"
                  className="w-full py-2.5"
                >
                  <span className="text-sm font-medium">Apple</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
