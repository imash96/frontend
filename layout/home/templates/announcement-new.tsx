import { Fragment } from "react";

export default function AnnouncementBar({ items }: { items: string[] }) {

    const repeated = [...items, ...items];

    return (
        <div role="marquee" aria-label="Store announcements" className="bg-primary text-primary-foreground py-2.5 overflow-hidden select-none motion-reduce:overflow-x-auto">
            <div className="flex gap-x-14 whitespace-nowrap w-max will-change-transform animate-marquee backface-hidden motion-reduce:hidden">
                {repeated.map((t, i) => (
                    <Fragment key={i}>
                        <span className="font-body text-[11px] md:text-xs tracking-[0.2em] uppercase font-medium opacity-90">
                            {t}
                        </span>
                        <span className="font-body text-[11px] md:text-xs tracking-[0.2em] uppercase font-medium opacity-90">
                            {"✦"}
                        </span>
                    </Fragment>
                ))}
            </div>
        </div>
    );
}