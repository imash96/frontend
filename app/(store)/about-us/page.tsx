import { ArrowRight, Calendar, CheckCircle, Clock, Crown, Eye, Globe, Heart, Quote, Scissors, Shield, Star, Users, } from "lucide-react"
import { div as Div } from "motion/react-client"
import Image from "next/image"
import Button from "@/ui/button"
import Badge from "@/ui/custom/custom-badge"
import Card, { CardContent } from "@/ui/custom/custom-card"

export default function Page() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-x-hidden bg-linear-to-br from-primary/5 via-background to-accent/10 py-24 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        {/* Badges */}
                        <div className="flex justify-center gap-4 mb-8 flex-wrap">
                            <Badge variant="outline" className="flex items-center text-sm font-medium px-4 py-2">
                                <Clock className="h-4 w-4 mr-2" />
                                Est. 2009
                            </Badge>
                            <Badge variant="outline" className="flex items-center text-sm font-medium px-4 py-2">
                                <Crown className="h-4 w-4 mr-2" />
                                Premium Leather
                            </Badge>
                            <Badge variant="outline" className="flex items-center text-sm font-medium px-4 py-2">
                                <Shield className="h-4 w-4 mr-2" />
                                Craftsmanship
                            </Badge>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                            Velle Hide - <span className="text-primary">Where Leather Lives</span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                            Handcrafted jackets, bags, and accessories designed to last a lifetime. Every stitch, every cut, every
                            detail is made for those who value heritage and timeless style.
                        </p>

                        {/* CTAs */}
                        <Div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                                Discover Our Story
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary/5 px-8 py-4 text-lg"
                            >
                                Shop Collection
                            </Button>
                        </Div>
                    </Div>
                </div>

                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-20 left-20 w-40 h-40 bg-primary rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-60 h-60 bg-accent rounded-full blur-3xl" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 overflow-x-hidden md:py-20 bg-card/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <Div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="text-center group"
                            >
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="text-primary">{stat.icon}</div>
                                    <div className="text-4xl md:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                                        {stat.number}
                                    </div>
                                </div>
                                <p className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</p>
                            </Div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Showcase + Testimonial */}
            <section className="py-20 overflow-x-hidden md:py-28 bg-linear-to-br from-background to-card/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                        {/* Left Content */}
                        <Div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <Badge variant="outline" className="mb-4">
                                Stories That Wear In, Not Out
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Leather that <span className="text-primary">ages beautifully</span>
                            </h2>
                            <div className="space-y-6 text-muted-foreground">
                                <p>
                                    From rugged adventures to city streets, Velle Hide leather is built to grow with you. The more you
                                    wear it, the better it becomes.
                                </p>
                                <p>
                                    Our customers turn jackets and bags into heirlooms, each piece gaining character unique to its owner.
                                </p>
                            </div>

                            {/* Testimonial */}
                            <Card className="border-l-4 border-l-primary bg-card/50">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <Quote className="h-8 w-8 text-primary shrink-0 mt-1" />
                                        <div>
                                            <p className="font-medium mb-3 italic">
                                                "My Velle Hide jacket feels like a second skin. It's not just fashion - it's part of my life."
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_) => (
                                                        <Star key={_} className="h-4 w-4 fill-current" />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-muted-foreground">- Alex R., Los Angeles</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Div>

                        {/* Right Mosaic Grid */}
                        <Div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-12 grid-rows-12 gap-3 h-150 md:h-175"
                        >
                            {customerShowcase.map((c, i) => (
                                <ShowcaseImage key={c.name} {...c} layout={layouts[i]} />
                            ))}
                        </Div>
                    </div>
                </div>
            </section>


            {/* Our Story */}
            <section className="py-20 overflow-x-hidden md:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
                        <Div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <Badge variant="outline" className="mb-4">
                                Our Story
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                From Workshop to <span className="text-primary">World</span>
                            </h2>
                            <p className="text-muted-foreground">
                                In 2009, master craftsman James Morrison transformed his passion for leather into Velle Hide. What
                                began as a small Portland workshop has evolved into a globally recognized brand.
                            </p>
                            <p className="text-muted-foreground">
                                Our philosophy is simple: in a world of mass production, handcrafted excellence still matters. Every
                                stitch, every cut, every finish reflects our commitment to creating pieces that last generations.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Feature icon={<Scissors />} text="Hand Cut" />
                                <Feature icon={<Eye />} text="Quality Inspected" />
                                <Feature icon={<Heart />} text="Made with Love" />
                            </div>
                        </Div>

                        {/* Story Image */}
                        <div className="relative w-full h-125">
                            <Image
                                src="/images/about-us/leather-craftsman-working-in-workshop.jpg"
                                alt="Master craftsman working on leather jacket"
                                fill
                                className="rounded-2xl shadow-2xl object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                                <div className="text-2xl font-bold">15+</div>
                                <div className="text-sm opacity-90">Years Experience</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >


            {/* Craft Process */}
            < section className="py-20 overflow-x-hidden md:py-28 bg-card/30" >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4">
                            Our Process
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Handcrafted <span className="text-primary">Excellence</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Every piece follows our time-tested process, ensuring the highest quality and attention to detail.
                        </p>
                    </div>
                    <Div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {craftProcess.map((process) => (
                            <div key={process.step} className="text-center group">
                                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                                    <div className="text-primary">{process.icon}</div>
                                </div>
                                <h3 className="text-lg font-semibold mb-3">{process.title}</h3>
                                <p className="text-sm text-muted-foreground">{process.description}</p>
                            </div>
                        ))}
                    </Div>
                </div>
            </section >
        </>
    )
}

function ShowcaseImage({ name, location, image, product, layout }: (typeof customerShowcase)[number] & { layout: string }) {
    return (
        <Div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`${layout} relative group overflow-x-hidden no-scrollbar rounded-2xl`}
        >
            <Image
                src={image || "/placeholder.svg"}
                alt={`${name} wearing ${product}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs opacity-90">{location}</p>
            </div>
        </Div>
    )
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-card rounded-lg">
            <div className="text-primary">{icon}</div>
            <span className="text-sm font-medium">{text}</span>
        </div>
    )
}


const layouts = [
    "col-span-7 row-span-6",
    "col-span-5 row-span-5",
    "col-span-5 row-span-4",
    "col-span-7 row-span-5",
    "col-span-5 row-span-3",
]

const customerShowcase = [
    { name: "Sophia Lee", location: "New York", image: "/images/about-us/woman-brown-jacket.jpg", product: "Heritage Rider Jacket" },
    { name: "Daniel Carter", location: "California", image: "/images/about-us/man-black-biker.jpg", product: "Vintage Biker" },
    { name: "Emily Stone", location: "Texas", image: "/images/about-us/woman-tan-bomber.jpg", product: "Classic Bomber" },
    { name: "James Park", location: "Seattle", image: "/images/about-us/man-dark-blazer.jpg", product: "Executive Blazer" },
    { name: "Olivia Green", location: "Chicago", image: "/images/about-us/woman-cognac-urban.jpg", product: "Urban Leather" },
]

const stats = [
    { number: "15+", label: "Years Crafting Leather", icon: <Calendar className="h-6 w-6" /> },
    { number: "50K+", label: "Happy Owners Worldwide", icon: <Users className="h-6 w-6" /> },
    { number: "30+", label: "Countries Worn In", icon: <Globe className="h-6 w-6" /> },
    { number: "99.8%", label: "Customer Love", icon: <Star className="h-6 w-6" /> },
]

const craftProcess = [
    { step: "01", title: "Premium Leather Selection", description: "We source only the finest full-grain leather from certified tanneries worldwide.", icon: <Eye className="h-6 w-6" /> },
    { step: "02", title: "Master Craftsmanship", description: "Each piece is hand-cut and stitched by our skilled artisans with 15+ years experience.", icon: <Scissors className="h-6 w-6" /> },
    { step: "03", title: "Quality Assurance", description: "Every item undergoes rigorous quality checks before leaving our workshop.", icon: <CheckCircle className="h-6 w-6" /> },
    { step: "04", title: "Lifetime Support", description: "We provide ongoing care instructions and repair services for life.", icon: <Heart className="h-6 w-6" /> },
]
