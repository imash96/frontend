"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const announcerRef = useRef<HTMLParagraphElement>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const main = document.querySelector("main");
        if (main) {
            if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
            main.focus({ preventScroll: false });
        }

        if (announcerRef.current) {
            announcerRef.current.textContent = `Navigated to ${document.title}`;
        }
    }, [pathname]);

    return (
        <>
            <p ref={announcerRef} role="status" aria-live="polite" className="sr-only" />
            {children}
        </>
    );
}