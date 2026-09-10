import { product_categories } from "./category";

export const MEGA_MENU = ["Men", "Women",] as const
export type MegaMenu = typeof MEGA_MENU[number]

export function getMegaCategories() {
    return product_categories.filter(c => (MEGA_MENU as readonly string[]).includes(c.name));
}

export type MenuSection = {
    id: string;
    name: string;
    handle: string;
    thumbnail: string;
    alt: string;
};

export const features: Record<MegaMenu, MenuSection[]> = {
    "Men": [
        {
            id: 'men-co1-01',
            name: 'New Arrivals',
            handle: 'new-arrivals-men',
            thumbnail: '/images/col_thumb/col_selling.webp',
            alt: 'Drawstring top with elastic loop closure and textured interior padding.',
        },
        {
            id: 'men-co1-02',
            name: 'Best Sellers',
            handle: 'best-sellers-men',
            thumbnail: '/images/col_thumb/col_summer.webp',
            alt: 'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
        }
    ],

    "Women": [
        {
            id: 'women-col-01',
            name: 'New Arrivals',
            handle: 'new-arrivals-women',
            thumbnail: '/images/col_thumb/col_trending.webp',
            alt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
            id: 'women-col-02',
            name: 'Best Sellers',
            handle: 'best-sellers-women',
            thumbnail: '/images/col_thumb/col_winter.webp',
            alt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        }
    ],
}

export const navLinks = [
    {
        label: 'Kids',
        href: '/category/kids',
    },
    {
        label: 'Accessories',
        href: '/category/accessories',
    },
    {
        label: 'Home Decor',
        href: '/category/home-decor',
        badge: "New"
    },
    {
        label: 'Gifting',
        href: '/category/gifting',
    },
];