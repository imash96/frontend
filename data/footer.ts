import { Clock, Mail, MessageCircleQuestionMark } from "lucide-react";
import Facebook from "@/icon/icon-facebok";
import Instagram from "@/icon/icon-instagram";
import Pinterest from "@/icon/icon-pinterest";
import TikTok from "@/icon/icon-tiktok";
import Info from "@/icon/info";

export const footerLinks = {
    "Shop": [
        { name: "Profile", href: "/account" },
        { name: "Best Sellers", href: "#" },
        { name: "Collections", href: "#" },
        { name: "Gift Cards", href: "#" },
        { name: "Sale", href: "#" },
    ],
    "Support": [
        { name: "Contact Us", href: "/contact-us#" },
        { name: "Shipping & Returns", href: "/policy" },
        { name: "Size Guide", href: "/guides/size-guide" },
        { name: "FAQs", href: "/faqs" },
        { name: 'Blogs', href: '/blogs' },
    ],
    "Social": [
        { name: 'About us', href: '/about-us', icon: Info },
        { name: 'Facebook', href: '#', icon: Facebook },
        { name: 'Instagram', href: '#', icon: Instagram },
        { name: 'Tiktok', href: '#', icon: TikTok },
        { name: 'Pinterest', href: '#', icon: Pinterest },
    ],
};

export const contactInfo = [
    {
        icon: Clock,
        title: "Our Timing",
        content: "Mon to Sat - 11:00 AM to 7:30 PM",
    },
    {
        icon: MessageCircleQuestionMark,
        title: "Order Query",
        content: "Contact: 986-777-2418",
    },
    {
        icon: Mail,
        title: "Email Us",
        content: "contact@vellehide.com",
    },
];

export const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Tiktok', href: '#', icon: TikTok },
    { name: 'Pinterest', href: '#', icon: Pinterest },
]