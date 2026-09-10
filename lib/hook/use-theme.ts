import { useState, useEffect } from "react";

type ColorMode = "light" | "dark";

export function useTheme(initialTheme: ColorMode = "light") {
    const [theme, setTheme] = useState<ColorMode>(initialTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.cookie = `__theme=${theme}; path=/`;
    }, [theme]);

    const toggleTheme = () => setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

    return { theme, toggleTheme };
}