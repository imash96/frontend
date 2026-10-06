"use client"

import "./styles.css"
import {
    useKeenSlider,
    KeenSliderPlugin,
    KeenSliderInstance,
} from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

export default function Page() {
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        initial: 0,
        loop: true,
    })
    const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
        {
            initial: 0,
            loop: true,
            slides: {
                perView: 4,
                spacing: 10,
            },
            breakpoints: {
                "(min-width: 400px)": {
                    slides: { perView: 2, spacing: 5 },
                },
                "(min-width: 1000px)": {
                    slides: { perView: 3, spacing: 10 },
                },
                "(min-width: 1024px)": {
                    vertical: true
                }
            },

        },
        [ThumbnailPlugin(instanceRef)]
    )
    console.log(instanceRef)

    return (
        <>
            <div ref={sliderRef} className="keen-slider">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={"keen-slider__slide number-slide flex justify-center text-5xl text-white font-medium h-52 max-h-dvh"}>{i + 1}</div>
                ))}
            </div>
            <div ref={thumbnailRef} className="keen-slider">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={"keen-slider__slide number-slide flex justify-center text-5xl text-white font-medium h-52 max-h-dvh"}>{i + 1}</div>
                ))}
            </div>
        </>
    )
}


function ThumbnailPlugin(
    mainRef: React.RefObject<KeenSliderInstance | null>
): KeenSliderPlugin {
    return (slider) => {
        function removeActive() {
            slider.slides.forEach((slide) => {
                slide.classList.remove("active")
            })
        }
        function addActive(idx: number) {
            slider.slides[idx].classList.add("active")
        }

        function addClickEvents() {
            slider.slides.forEach((slide, idx) => {
                slide.addEventListener("click", () => {
                    if (mainRef.current) mainRef.current.moveToIdx(idx)
                })
            })
        }

        slider.on("created", () => {
            if (!mainRef.current) return
            addActive(slider.track.details.rel)
            addClickEvents()
            mainRef.current.on("animationStarted", (main) => {
                removeActive()
                const next = main.animator.targetIdx || 0
                addActive(main.track.absToRel(next))
                slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
            })
        })
    }
}