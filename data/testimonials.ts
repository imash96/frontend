export const testimonials: Testimonial[] = [
    {
        id: 1,
        star: 5,
        name: "Sarah Mitchell",
        review:
            "The Velle Hide biker jacket is a game-changer! The genuine leather is so soft yet durable, and it fits like a glove. I've gotten compliments everywhere-worth every penny for the quality.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        product: "Classic Biker Jacket",
        location: "New York, USA",
        date: "March 2025",
        verified: true,
    },
    {
        id: 2,
        star: 5,
        name: "Marcus Johnson",
        review:
            "These Chelsea boots are incredible! Comfortable right out of the box, and the leather quality shines through. Velle Hide delivers on style and longevity-my go-to for fall.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        product: "Heritage Chelsea Boots",
        location: "Chicago, USA",
        date: "February 2025",
        verified: true,
    },
    {
        id: 3,
        star: 5,
        name: "Aisha Patel",
        review:
            "My new leather wallet from Velle Hide is sleek and functional. Love the RFID protection and how the leather feels premium. It's already my everyday essential-highly recommend!",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80",
        product: "Slim Bifold Wallet",
        location: "London, UK",
        date: "April 2025",
        verified: true,
    },
    {
        id: 4,
        star: 4,
        name: "David Ramirez",
        review:
            "Bought the leather messenger bag for work, and it's perfect. Spacious, stylish, and holds up great after daily use. The stitching is top-notch-Velle Hide nailed it!",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        product: "Executive Messenger Bag",
        location: "Los Angeles, USA",
        date: "January 2025",
        verified: true,
    },
    {
        id: 5,
        star: 5,
        name: "Elena Vasquez",
        review:
            "The trench coat exceeded my expectations. Elegant fit, weather-resistant, and the leather has that beautiful patina starting to show. Velle Hide is my new favorite brand!",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
        product: "Leather Trench Coat",
        location: "Madrid, Spain",
        date: "March 2025",
        verified: true,
    },
    {
        id: 6,
        star: 5,
        name: "Liam O'Connor",
        review:
            "Picked up leather pants and they're fantastic-stretchy yet structured, perfect for casual outings. The craftsmanship from Velle Hide is evident; feels like an investment piece.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
        product: "Tailored Leather Trousers",
        location: "Dublin, Ireland",
        date: "February 2025",
        verified: true,
    },
    {
        id: 7,
        star: 5,
        name: "Jasmine Lee",
        review:
            "This leather belt transformed my outfits! Adjustable, high-quality buckle, and the leather molds perfectly over time. Velle Hide's attention to detail is unmatched-love it!",
        image: "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=200&auto=format&fit=crop&q=80",
        product: "Artisan Leather Belt",
        location: "Toronto, Canada",
        date: "April 2025",
        verified: true,
    },
    {
        id: 8,
        star: 4,
        name: "Carlos Mendoza",
        review:
            "The driving gloves are a solid buy-supple leather, great grip, and stylish for road trips. They run a tad snug at first, but break in nicely. Thanks, Velle Hide!",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
        product: "Heritage Driving Gloves",
        location: "Mexico City, MX",
        date: "January 2025",
        verified: true,
    },
    {
        id: 9,
        star: 5,
        name: "Mia Thompson",
        review:
            "Obsessed with my new leather vest! Adds edge to any look, and the quality is outstanding-soft, ethical leather that feels luxurious. Velle Hide has won me over completely.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        product: "Moto Leather Vest",
        location: "Sydney, Australia",
        date: "March 2025",
        verified: true,
    },
    {
        id: 10,
        star: 5,
        name: "Israel Perez",
        review:
            "The loafers are comfortable and sharp-genuine leather that polishes up beautifully. Perfect for office or weekends. Velle Hide's sizing was spot-on; will buy again soon!",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        product: "Classic Leather Loafers",
        location: "Miami, USA",
        date: "February 2025",
        verified: true,
    },
];

export const overallStats = {
    averageRating: 4.8,
    totalReviews: 2847,
    breakdown: [
        { stars: 5, percentage: 82 },
        { stars: 4, percentage: 12 },
        { stars: 3, percentage: 4 },
        { stars: 2, percentage: 1 },
        { stars: 1, percentage: 1 },
    ],
};

export interface Testimonial {
    id: number;
    star: number;
    name: string;
    review: string;
    image: string;
    product?: string;
    location?: string;
    verified?: boolean;
    date?: string;
}