import { cookies } from "next/headers"

export async function getInitialTheme(): Promise<"light" | "dark"> {
    const cookieStore = await cookies()
    return (cookieStore.get('__theme')?.value || "light") as "light" | "dark"
}