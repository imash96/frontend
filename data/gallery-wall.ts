export type MarqueeImage = {
    id: string;
    src: string;
    alt: string;
    customerName?: string; // Optional: customer name shown on hover 
    tag?: string; //Optional: product tag shown on hover 
}

// Top row — forward (left)
export const topImages: MarqueeImage[] = [
    {
        id: "1",
        src: "/images/marquee/t1.jpg",
        alt: "Customer wearing a black leather biker jacket",
        customerName: "James M.",
        tag: "Moto Classic",
    },
    {
        id: "2",
        src: "/images/marquee/t2.jpg",
        alt: "Customer in cognac leather jacket on city street",
        customerName: "Priya S.",
        tag: "Cognac Racer",
    },
    {
        id: "3",
        src: "/images/marquee/t3.jpg",
        alt: "Model in dark brown leather jacket",
        customerName: "Lena K.",
        tag: "Heritage Bomber",
    },
    {
        id: "4",
        src: "/images/marquee/t4.jpg",
        alt: "Woman wearing a distressed leather jacket",
        customerName: "Sofia R.",
        tag: "Distressed Edit",
    },
    {
        id: "5",
        src: "/images/marquee/t5.jpg",
        alt: "Man in slim-fit black leather jacket",
        customerName: "Marcus T.",
        tag: "Slim Rider",
    },
    {
        id: "6",
        src: "/images/marquee/t6.jpg",
        alt: "Customer in olive leather jacket",
        customerName: "Hana W.",
        tag: "Field Jacket",
    },
    {
        id: "7",
        src: "/images/marquee/t7.jpg",
        alt: "Person in vintage-style leather jacket",
        customerName: "Tom A.",
        tag: "Vintage Biker",
    },
    {
        id: "8",
        src: "/images/marquee/t8.jpg",
        alt: "Model wearing oversized leather jacket",
        customerName: "Nour E.",
        tag: "Oversized Moto",
    },
]

// Bottom row — reverse (right)
export const bottomImages: MarqueeImage[] = [
    {
        id: "11",
        src: "/images/marquee/b1.jpg",
        alt: "Customer in slim brown leather jacket",
        customerName: "Elena V.",
        tag: "Café Racer",
    },
    {
        id: "12",
        src: "/images/marquee/b2.jpg",
        alt: "Man in black leather jacket outdoor shoot",
        customerName: "Carlos D.",
        tag: "Moto Classic",
    },
    {
        id: "13",
        src: "/images/marquee/b3.jpg",
        alt: "Woman in tan leather jacket",
        customerName: "Maya L.",
        tag: "Tan Rider",
    },
    {
        id: "14",
        src: "/images/marquee/b4.jpg",
        alt: "Customer in burgundy leather jacket",
        customerName: "Zara P.",
        tag: "Burgundy Biker",
    },
    {
        id: "15",
        src: "/images/marquee/b5.jpg",
        alt: "Man in double-rider leather jacket",
        customerName: "Kai F.",
        tag: "Double Rider",
    },
    {
        id: "16",
        src: "/images/marquee/b6.jpg",
        alt: "Customer in tailored leather blazer",
        customerName: "Leo B.",
        tag: "Leather Blazer",
    },
    {
        id: "17",
        src: "/images/marquee/b7.jpg",
        alt: "Woman in black moto jacket",
        customerName: "Aria N.",
        tag: "Moto Edit",
    },
    {
        id: "18",
        src: "/images/marquee/b8.jpg",
        alt: "Customer wearing premium leather jacket",
        customerName: "Sara M.",
        tag: "Heritage Slim",
    },
]