import { type RefObject, useEffect, useState } from "react";

export const useIntersection = (
    element: RefObject<HTMLDivElement | null>,
    rootMargin: string = "0px",
) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const el = element.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.boundingClientRect.top < 0),
            { rootMargin, threshold: [0, 0.5, 1] },
        );

        observer.observe(el);

        // Cleanup the observer when the component unmounts or dependencies change
        return () => observer.disconnect();
    }, [element, rootMargin]);

    return isVisible;
};
