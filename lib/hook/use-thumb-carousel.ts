import { useCallback, useEffect, useMemo, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import type { EmblaOptionsType } from "embla-carousel"

type UseCarouselOptions = {
    // autoplay?: boolean
    // thumb?: boolean
    // autoplayDelay?: number
    options?: EmblaOptionsType
    thumbOptions?: EmblaOptionsType
}

export function useThumbCarousel({ thumbOptions, options }: UseCarouselOptions = {}) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const [mainRef, mainApi] = useEmblaCarousel(
        options
    );

    const [thumbsRef, thumbsApi] = useEmblaCarousel(
        thumbOptions
    );

    const onThumbClick = useCallback((index: number) => mainApi?.goTo(index), [mainApi]);

    const scrollTo = useCallback((index: number) => mainApi?.goTo(index), [mainApi])

    const scrollPrev = useCallback(() => mainApi?.goToPrev(), [mainApi]);

    const scrollNext = useCallback(() => mainApi?.goToNext(), [mainApi]);

    useEffect(() => {
        if (!mainApi) return
        const onSelect = () => {
            const selected = mainApi.selectedSnap()
            setSelectedIndex(selected)
            thumbsApi?.goTo(selected)
        };
        onSelect();
        mainApi.on("select", onSelect);
        mainApi.on("reinit", onSelect);
        return () => {
            mainApi.off("select", onSelect);
            mainApi.off("reinit", onSelect);
        }
    }, [mainApi, thumbsApi]);

    return {
        mainRef,
        mainApi,
        selectedIndex,
        scrollTo,
        scrollPrev,
        scrollNext,
        thumbsRef,
        thumbsApi,
        onThumbClick
    }
}