import type { EmblaOptionsType } from "embla-carousel"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState } from "react"

type UseCarouselOptions = {
    autoplay?: boolean
    autoplayDelay?: number
    options?: EmblaOptionsType
}

export function useCarousel({ autoplay = false, autoplayDelay = 300, options }: UseCarouselOptions = {}) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const [emblaRef, emblaApi] = useEmblaCarousel(
        options,
        autoplay ? [Autoplay({
            delay: autoplayDelay,
            instant: false,
            defaultInteraction: true,
            stopOnLastSnap: false,
        })] : [],
    );

    const scrollTo = useCallback((index: number) => {
        emblaApi?.goTo(index);
        emblaApi?.plugins()?.autoplay?.reset()
    }, [emblaApi])

    const scrollPrev = useCallback(() => {
        emblaApi?.goToPrev();
        emblaApi?.plugins()?.autoplay?.reset()
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        emblaApi?.goToNext();
        emblaApi?.plugins()?.autoplay?.reset()
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return
        if (autoplay) emblaApi.plugins().autoplay?.play()
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