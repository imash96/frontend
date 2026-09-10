import { SVGAttributes } from "react";

export default function YouTube({ fill = "currentColor", ...props }: SVGAttributes<SVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill={fill}  {...props}>
            <path d="M22.55 6.4a2.75 2.75 0 0 0-1.95-1.95C18.9 4 12 4 12 4s-6.9 0-8.6.45A2.75 2.75 0 0 0 1.45 6.4C1 8.1 1 11.7 1 11.7s0 3.6.45 5.3a2.75 2.75 0 0 0 1.95 1.95c1.7.45 8.6.45 8.6.45s6.9 0 8.6-.45A2.75 2.75 0 0 0 22.55 17c.45-1.7.45-5.3.45-5.3s0-3.6-.45-5.3M9.8 15V8.4l5.7 3.3Z" />
        </svg>
    )
}