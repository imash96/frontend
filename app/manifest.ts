import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Velle Hide — Premium Leather Goods",
        short_name: "Velle Hide",
        description: "Handcrafted genuine leather jackets, coats, bags, and accessories.",
        start_url: "/",
        display: "standalone",
        background_color: "#F9F6F3",
        theme_color: "#452817",
        icons: [
            { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
            // TODO:
            // Drop real /icon-192.png + /icon-512.png in /public and list them
            // here for full "Add to Home Screen" installability.
        ],
    };
}