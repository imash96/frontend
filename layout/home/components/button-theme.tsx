"use client";

import { useTheme } from "@/lib/hook/use-theme";
import { Moon, Sun } from "lucide-react";

type ThemeProviderProps = {
    initialTheme: "light" | "dark"
    className: string
}

export default function ThemeButton({ className = "", initialTheme }: ThemeProviderProps) {
    const { theme, toggleTheme } = useTheme(initialTheme);

    return (
        <button onClick={toggleTheme} className={className} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} >
            {theme === "light" ? (
                <Moon className="size-5" strokeWidth={1.5} aria-hidden />
            ) : (
                <Sun className="size-5" strokeWidth={1.5} aria-hidden />
            )}
            <span className="sr-only">Theme Toggle</span>
        </button>
    );
}
