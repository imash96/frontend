import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel"

type UseCarouselOptions = {
    autoplay?: boolean
    autoplayDelay?: number
    options?: EmblaOptionsType
}

export function useCarousel({ autoplay = false, autoplayDelay = 4500, options }: UseCarouselOptions = {}) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const autoplayPlugin = useMemo(() => {
        if (!autoplay) return null

        return Autoplay({
            delay: autoplayDelay,
            instant: false,
            defaultInteraction: false,
            stopOnLastSnap: false
        })
    }, [autoplay, autoplayDelay])

    const [emblaRef, emblaApi] = useEmblaCarousel(
        options,
        autoplayPlugin ? [autoplayPlugin] : [],
    )

    const scrollTo = useCallback((index: number) => {
        emblaApi?.goTo(index);
        autoplayPlugin?.reset();
    }, [emblaApi])


    const scrollPrev = useCallback(() => {
        emblaApi?.goToPrev();
        autoplayPlugin?.reset();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        emblaApi?.goToNext();
        autoplayPlugin?.reset();
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = (api: EmblaCarouselType) => setSelectedIndex(api.selectedSnap())
        emblaApi.on("select", onSelect)
        onSelect(emblaApi)
        return () => { emblaApi.off("select", onSelect) }
    }, [emblaApi])

    return {
        emblaRef,
        emblaApi,
        selectedIndex,
        scrollTo,
        scrollPrev,
        scrollNext,
    }
}