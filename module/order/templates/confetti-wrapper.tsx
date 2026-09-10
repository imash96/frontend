"use client"

import confetti from "canvas-confetti";
import { useEffect } from "react";

let duration = 3 * 1000;
let end = Date.now() + duration;

export default function ConfettiWarapper({ children }: React.PropsWithChildren) {

    function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
        });

        if (Date.now() < end) requestAnimationFrame(frame);
    };

    useEffect(() => {
        frame();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <>{children}</>
    )
}