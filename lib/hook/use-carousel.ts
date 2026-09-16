import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import type { EmblaOptionsType } from "embla-carousel"

type UseCarouselOptions = {
    autoplay?: boolean
    autoplayDelay?: number
    options?: EmblaOptionsType
}

export function useCarousel({ autoplay = false, autoplayDelay = 4500, options }: UseCarouselOptions = {}) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const autoplayPlugin = useMemo(() => (
        autoplay ? Autoplay({
            delay: autoplayDelay,
            instant: false,
            defaultInteraction: false,
            stopOnLastSnap: false,
        }) : null
    ), [autoplay, autoplayDelay]);

    const [emblaRef, emblaApi] = useEmblaCarousel(
        options,
        autoplayPlugin ? [autoplayPlugin] : [],
    );

    const scrollTo = useCallback((index: number) => {
        emblaApi?.goTo(index);
        autoplayPlugin?.reset()
    }, [emblaApi])

    const scrollPrev = useCallback(() => {
        emblaApi?.goToPrev();
        autoplayPlugin?.reset()
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        emblaApi?.goToNext();
        autoplayPlugin?.reset()
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => setSelectedIndex(emblaApi.selectedSnap());
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reinit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reinit", onSelect);
        }
    }, [emblaApi]);

    return {
        emblaRef,
        emblaApi,
        selectedIndex,
        scrollTo,
        scrollPrev,
        scrollNext,
    }
}