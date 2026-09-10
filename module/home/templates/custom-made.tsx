"use client"

import Button from "@/ui/button"
import Container from "@/ui/container"
import { ArrowRightIcon } from "lucide-react"

export default function CustomMadeBanner() {
    return (
        <Container size="full" className="relative py-20 md:py-28 lg:py-32">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center" style={{
                backgroundImage:
                    "url(https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1920&q=80)"
            }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-black/90 via-black/70 to-black/50" />

            {/* Content */}
            <div className="flex flex-col items-center justify-center text-center relative z-10 mx-auto max-w-2xl">

                {/* Label */}
                <span className="inline-block mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-accent">
                    Limited Edition
                </span>

                {/* Title */}
                <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] text-text-inverse mb-4">
                    Custom Made,{" "}
                    <span className="italic text-accent">
                        Just for You
                    </span>
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base leading-relaxed text-primary-foreground mb-8">
                    Experience the luxury of a leather jacket tailored to your exact measurements.
                    Choose your leather, color, lining, and hardware for a truly one-of-a-kind piece.
                </p>

                {/* CTA */}
                <Button
                    href="#"
                    variant="secondary"
                    size="lg"
                    shape="rounded"
                    icon={<ArrowRightIcon />}
                    iconPosition="right"
                >
                    Start Customizing
                </Button>

            </div>
        </Container>
    )
}