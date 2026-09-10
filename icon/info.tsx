import { SVGAttributes } from "react";

export default function Info({ ...props }: SVGAttributes<SVGElement>) {
    return (
        <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx={12} cy={12} r={10} />
            <path d="M12 16v-4m0-4h.01" />
        </svg>
    )
};