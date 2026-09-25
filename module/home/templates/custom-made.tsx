"use client"

import { ArrowRightIcon, Scissors } from "lucide-react"
import Button from "@/ui/button"
import Container from "@/ui/container"

export default function CustomMadeBanner() {
    return (
        <Container size="full" className="relative py-24 md:py-32 lg:py-40">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center" style={{
                backgroundImage:
                    "url(https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1920&q=80)"
            }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-black/95 via-black/80 to-black/40" />

            {/* Content */}
            <div className="flex flex-col items-center justify-center text-center relative z-10 mx-auto max-w-3xl px-4">

                {/* Decorative Icon */}
                <div className="mb-6 inline-flex items-center justify-center size-12 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-sm text-accent">
                    <Scissors className="size-5" />
                </div>

                {/* Label */}
                <span className="inline-block mb-4 text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-accent">
                    The Bespoke Experience
                </span>

                {/* Title */}
                <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] text-white mb-6">
                    Masterfully Crafted,{" "}
                    <br className="hidden sm:block" />
                    <span className="italic font-light text-accent/90">
                        Exclusively Yours.
                    </span>
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base lg:text-lg leading-relaxed text-white/70 max-w-2xl mb-10">
                    Step into our bespoke studio. Select from our reserve of full-grain hides, customize every detail—from the hardware down to the stitching—and let our master artisans build a legacy piece tailored precisely to you.
                </p>

                {/* CTA */}
                <Button
                    href="/guides/bespoke-order"
                    variant="secondary"
                    size="lg"
                    shape="rounded"
                    icon={<ArrowRightIcon className="size-4" />}
                    iconPosition="right"
                    className="font-medium tracking-wide shadow-2xl transition-transform duration-300 hover:scale-105"
                >
                    Design Your Own
                </Button>
            </div>
        </Container>
    )
}