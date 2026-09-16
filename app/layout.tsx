import { cookies } from "next/headers";
import { use } from "react";
import { Bricolage_Grotesque, Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

import "@/css/globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const theme = use(cookies()).get('__theme')?.value
  return (
    <html lang="en" data-theme={theme ? theme : "light"} className={`${inter.variable} ${bricolage.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body>
        {children}
      </body>
    </html>
  );
}
