import type {
    StoreCart,
    StoreCartShippingOption,
    StoreCustomer,
    StorePaymentProvider,
    StoreProduct,
    StoreRegion,
} from "@medusajs/types"
import type { ProductReviewStats, StoreProductReview, StoreProductWithReviews } from "@/types/product"

export const PREVIEW_REGION: StoreRegion = {
    id: "reg_preview_us",
    name: "North America & International",
    currency_code: "usd",
    automatic_taxes: true,
    countries: [
        {
            iso_2: "us",
            iso_3: "usa",
            num_code: "840",
            name: "UNITED STATES",
            display_name: "United States",
            region_id: "reg_preview_us",
        },
        {
            iso_2: "ca",
            iso_3: "can",
            num_code: "124",
            name: "CANADA",
            display_name: "Canada",
            region_id: "reg_preview_us",
        },
        {
            iso_2: "gb",
            iso_3: "gbr",
            num_code: "826",
            name: "UNITED KINGDOM",
            display_name: "United Kingdom",
            region_id: "reg_preview_us",
        },
        {
            iso_2: "in",
            iso_3: "ind",
            num_code: "356",
            name: "INDIA",
            display_name: "India",
            region_id: "reg_preview_us",
        },
        {
            iso_2: "de",
            iso_3: "DEU",
            num_code: "276",
            name: "GERMANY",
            display_name: "Germany",
            region_id: "reg_preview_us",
        },
        {
            iso_2: "it",
            iso_3: "ita",
            num_code: "380",
            name: "ITALY",
            display_name: "Italy",
            region_id: "reg_preview_us",
        },
        {
            iso_2: "au",
            iso_3: "aus",
            num_code: "036",
            name: "AUSTRALIA",
            display_name: "Australia",
            region_id: "reg_preview_us",
        },
    ],
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    deleted_at: null,
} as unknown as StoreRegion

export const PREVIEW_PAYMENT_PROVIDERS: StorePaymentProvider[] = [
    { id: "pp_paypal_paypal" },
    { id: "pp_paypal_card" },
    { id: "pp_system_default" },
    { id: "pp_payu_payu" },
] as StorePaymentProvider[]

export const PREVIEW_SHIPPING_METHODS: StoreCartShippingOption[] = [
    {
        id: "so_standard_atelier",
        name: "Standard Atelier Insured Courier",
        price_type: "flat",
        service_zone_id: "sz_preview",
        shipping_profile_id: "sp_preview",
        provider_id: "manual_manual",
        amount: 0,
        calculated_price: {
            id: "cp_ship_1",
            calculated_amount: 0,
            original_amount: 0,
            currency_code: "usd",
        },
        data: {},
        type: {
            id: "st_standard",
            label: "Standard Delivery",
            description: "4–6 business days · Signature dust bag & tracking",
            code: "standard",
        },
        rules: [],
        insufficient_inventory: false,
    } as unknown as StoreCartShippingOption,
    {
        id: "so_express_dhl",
        name: "DHL Express Priority Air",
        price_type: "flat",
        service_zone_id: "sz_preview",
        shipping_profile_id: "sp_preview",
        provider_id: "manual_manual",
        amount: 25,
        calculated_price: {
            id: "cp_ship_2",
            calculated_amount: 25,
            original_amount: 25,
            currency_code: "usd",
        },
        data: {},
        type: {
            id: "st_express",
            label: "Express Delivery",
            description: "1–3 business days · Priority air dispatch & full insurance",
            code: "expedite",
        },
        rules: [],
        insufficient_inventory: false,
    } as unknown as StoreCartShippingOption,
    {
        id: "so_white_glove",
        name: "White-Glove Bespoke Concierge",
        price_type: "flat",
        service_zone_id: "sz_preview",
        shipping_profile_id: "sp_preview",
        provider_id: "manual_manual",
        amount: 45,
        calculated_price: {
            id: "cp_ship_3",
            calculated_amount: 45,
            original_amount: 45,
            currency_code: "usd",
        },
        data: {},
        type: {
            id: "st_white_glove",
            label: "White-Glove Delivery",
            description: "Next-day priority · Cedar hanger, garment trunk & leather balm",
            code: "expedite",
        },
        rules: [],
        insufficient_inventory: false,
    } as unknown as StoreCartShippingOption,
]

export const PREVIEW_REVIEWS: StoreProductReview[] = [
    {
        id: "rev_01",
        name: "Alexander Vance",
        email: "alex.vance@example.com",
        rating: 5,
        title: "Unmatched leather quality and tailoring" as any,
        content:
            "The lambskin on this jacket feels like butter right out of the garment box, yet has serious weight and structure. The antique brass YKK zippers glide effortlessly, and the shoulder articulation makes it feel bespoke.",
        images: [
            { id: "rev_img_1", url: "/images/about-us/man-black-biker.jpg" },
            { id: "rev_img_2", url: "/images/about-us/man-dark-blazer.jpg" },
        ],
        order_line_item_id: "oli_01",
        product_id: "prod_milano_biker",
        order_id: "ord_01",
        response: {
            content:
                "Thank you, Alexander! Our Florentine artisans take great pride in our 47-step vegetable-tanned finishing process. Wear it in good health!",
        },
        status: "approved",
        verified: true,
        created_at: "2026-09-18T14:30:00.000Z",
        updated_at: "2026-09-18T14:30:00.000Z",
        deleted_at: null,
    },
    {
        id: "rev_02",
        name: "Elena Rostova",
        email: "elena.r@example.com",
        rating: 5,
        title: "Worth every penny — better than $2,500 designer brands" as any,
        content:
            "I ordered the Cognac Brown with the Mulberry Silk lining and interior monogram. The stitching is immaculate — not a single loose thread. Already developing a gorgeous rich patina after three weeks of wear.",
        images: [{ id: "rev_img_3", url: "/images/about-us/woman-cognac-urban.jpg" }],
        order_line_item_id: "oli_02",
        product_id: "prod_milano_biker",
        order_id: "ord_02",
        response: null,
        status: "approved",
        verified: true,
        created_at: "2026-09-04T09:15:00.000Z",
        updated_at: "2026-09-04T09:15:00.000Z",
        deleted_at: null,
    },
    {
        id: "rev_03",
        name: "Marcus Thorne",
        email: "m.thorne@example.com",
        rating: 4,
        title: "Impressive fit and fast express delivery" as any,
        content:
            "Ordered a Medium based on the interactive size guide (I'm 6'0\", 178 lbs, 40\" chest) and it fits like a second skin over a light sweater. Packaging with the dust bag and authenticity card was top tier.",
        images: [],
        order_line_item_id: "oli_03",
        product_id: "prod_milano_biker",
        order_id: "ord_03",
        response: null,
        status: "approved",
        verified: true,
        created_at: "2026-08-22T19:45:00.000Z",
        updated_at: "2026-08-22T19:45:00.000Z",
        deleted_at: null,
    },
]

export const PREVIEW_REVIEW_STATS: ProductReviewStats = {
    id: "rstat_01",
    product_id: "prod_milano_biker",
    average_rating: 4.9,
    review_count: 128,
    rating_count_5: 114,
    rating_count_4: 11,
    rating_count_3: 2,
    rating_count_2: 1,
    rating_count_1: 0,
}

function formatHandleToTitle(handle: string): string {
    if (!handle || handle === "milano-heritage-biker-jacket" || handle === "classic-biker-jacket") {
        return "The Milano Full-Grain Heritage Biker Jacket"
    }
    return handle
        .split("-")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
}

export function getPreviewProduct(handle: string): StoreProductWithReviews {
    const title = formatHandleToTitle(handle)
    const colors = [
        {
            name: "Obsidian Black",
            thumb: "/images/col_thumb/col_mens_1.webp",
            images: [
                { id: "img_blk_1", url: "/images/col_thumb/col_mens_1.webp" },
                { id: "img_blk_2", url: "/images/about-us/man-black-biker.jpg" },
                { id: "img_blk_3", url: "/images/col_thumb/col_mens_2.webp" },
                { id: "img_blk_4", url: "/images/about-us/man-dark-blazer.jpg" },
                { id: "img_blk_5", url: "/images/about-us/leather-craftsman-working-in-workshop.jpg" },
            ],
        },
        {
            name: "Cognac Espresso",
            thumb: "/images/col_thumb/col_mens_3.webp",
            images: [
                { id: "img_cog_1", url: "/images/col_thumb/col_mens_3.webp" },
                { id: "img_cog_2", url: "/images/about-us/woman-cognac-urban.jpg" },
                { id: "img_cog_3", url: "/images/col_thumb/col_mens_4.webp" },
                { id: "img_cog_4", url: "/images/about-us/woman-brown-jacket.jpg" },
                { id: "img_cog_5", url: "/images/about-us/leather-craftsman-working-in-workshop.jpg" },
            ],
        },
        {
            name: "Burnished Saddle Tan",
            thumb: "/images/about-us/woman-tan-bomber.jpg",
            images: [
                { id: "img_tan_1", url: "/images/about-us/woman-tan-bomber.jpg" },
                { id: "img_tan_2", url: "/images/col_thumb/col_celebrity_2.webp" },
                { id: "img_tan_3", url: "/images/col_thumb/col_celebrity_3.webp" },
                { id: "img_tan_4", url: "/images/about-us/leather-craftsman-working-in-workshop.jpg" },
            ],
        },
    ]

    const sizes = ["XS", "S", "M", "L", "XL", "2XL"]

    let rank = 1
    const variants = colors.flatMap((color, cIdx) =>
        sizes.map((size, sIdx) => {
            const isOut = cIdx === 2 && size === "2XL"
            const qty = isOut ? 0 : sIdx === 0 ? 3 : 14
            const variantId = `var_${cIdx}_${size.toLowerCase()}`
            return {
                id: variantId,
                title: `${color.name} / ${size}`,
                sku: `VH-MLN-${color.name.slice(0, 3).toUpperCase()}-${size}`,
                ean: `8901234567${String(rank).padStart(3, "0")}`,
                allow_backorder: false,
                manage_inventory: true,
                inventory_quantity: qty,
                variant_rank: rank++,
                thumbnail: color.thumb,
                images: color.images,
                calculated_price: {
                    id: `cp_${variantId}`,
                    calculated_amount: 420,
                    original_amount: 560,
                    currency_code: "usd",
                    calculated_price: {
                        price_list_type: "sale",
                    },
                },
                options: [
                    {
                        id: `optval_color_${cIdx}`,
                        option_id: "opt_color",
                        value: color.name,
                        option: { id: "opt_color", title: "Color" },
                    },
                    {
                        id: `optval_size_${sIdx}`,
                        option_id: "opt_size",
                        value: size,
                        option: { id: "opt_size", title: "Size" },
                    },
                ],
            }
        })
    )

    return {
        id: "prod_milano_biker",
        title,
        handle: handle || "milano-heritage-biker-jacket",
        subtitle:
            "Hand-cut from 1.1mm full-grain Italian lambskin, vegetable-tanned in Tuscany & saddle-stitched with waxed linen thread.",
        description:
            "Crafted in our Florentine atelier through 47 meticulous stages, the Milano Full-Grain Heritage Jacket balances rugged architectural poise with buttery-soft suppleness.\n\n• 100% Full-Grain Vegetable-Tanned Italian Lambskin (1.1mm–1.2mm gauge)\n• Custom antique-finished YKK Excella Japanese zippers tested to 10,000+ cycles\n• Articulated bi-swing shoulder gussets for unrestricted movement\n• Breathable Bemberg cupro satin lining with two interior welt pockets\n• Hand-burnished seams and reinforced stress points that develop a rich, personal patina over decades of wear.",
        thumbnail: "/images/col_thumb/col_mens_1.webp",
        material: "100% Full-Grain Italian Lambskin Leather",
        origin_country: "IT",
        weight: 1450,
        mid_code: "VH-ATELIER-047",
        collection_id: "col_heritage",
        collection: {
            id: "col_heritage",
            title: "Atelier Heritage Reserve",
            handle: "heritage",
        },
        type: {
            id: "ptype_jacket",
            value: "Full-Grain Leather Jacket",
        },
        categories: [
            { id: "cat_men", name: "Leather Outerwear", handle: "men" },
            { id: "cat_biker", name: "Biker & Moto Jackets", handle: "biker-jackets" },
        ],
        tags: [
            { id: "tag_1", value: "Full-Grain Leather" },
            { id: "tag_2", value: "Handcrafted in Italy" },
            { id: "tag_3", value: "Vegetable Tanned" },
            { id: "tag_4", value: "Lifetime Warranty" },
        ],
        images: [
            ...colors[0].images,
            { id: "img_extra_1", url: "/images/col_thumb/col_mens_3.webp" },
            { id: "img_extra_2", url: "/images/about-us/woman-tan-bomber.jpg" },
        ],
        options: [
            {
                id: "opt_color",
                title: "Color",
                product_id: "prod_milano_biker",
                values: colors.map((c, idx) => ({
                    id: `optval_color_${idx}`,
                    value: c.name,
                    option_id: "opt_color",
                    rank: idx,
                })),
            },
            {
                id: "opt_size",
                title: "Size",
                product_id: "prod_milano_biker",
                values: sizes.map((s, idx) => ({
                    id: `optval_size_${idx}`,
                    value: s,
                    option_id: "opt_size",
                    rank: idx,
                })),
            },
        ],
        variants,
        review_stats: PREVIEW_REVIEW_STATS,
        product_review: PREVIEW_REVIEWS,
        metadata: {
            leather_grade: "Full-Grain Aniline Lambskin",
            tanning_method: "30-Day Tuscan Vegetable Tanning",
            hardware: "YKK Excella Heavy Gauge",
            lining: "100% Breathable Bemberg Cupro",
            fit_profile: "Tailored Architectural Fit",
            craft_hours: "18 Hours per Garment",
        },
    } as unknown as StoreProductWithReviews
}

export const PREVIEW_PRODUCT: StoreProductWithReviews = getPreviewProduct("milano-heritage-biker-jacket")

export const PREVIEW_RELATED_PRODUCTS: StoreProductWithReviews[] = [
    {
        id: "prod_rel_1",
        title: "The Florentine Café Racer",
        handle: "florentine-cafe-racer",
        thumbnail: "/images/col_thumb/col_mens_2.webp",
        images: [
            { id: "rel_1_a", url: "/images/col_thumb/col_mens_2.webp" },
            { id: "rel_1_b", url: "/images/about-us/man-dark-blazer.jpg" },
        ],
        categories: [{ id: "cat_men", name: "Moto Jackets", handle: "men" }],
        variants: [
            {
                id: "var_rel_1",
                title: "Obsidian Black / M",
                calculated_price: {
                    id: "cp_rel_1",
                    calculated_amount: 395,
                    original_amount: 495,
                    currency_code: "usd",
                    calculated_price: { price_list_type: "sale" },
                },
            },
        ],
    },
    {
        id: "prod_rel_2",
        title: "The Siena Cognac Moto Jacket",
        handle: "siena-cognac-moto-jacket",
        thumbnail: "/images/col_thumb/col_mens_3.webp",
        images: [
            { id: "rel_2_a", url: "/images/col_thumb/col_mens_3.webp" },
            { id: "rel_2_b", url: "/images/about-us/woman-cognac-urban.jpg" },
        ],
        categories: [{ id: "cat_men", name: "Heritage Leather", handle: "men" }],
        variants: [
            {
                id: "var_rel_2",
                title: "Cognac / L",
                calculated_price: {
                    id: "cp_rel_2",
                    calculated_amount: 440,
                    original_amount: 550,
                    currency_code: "usd",
                    calculated_price: { price_list_type: "sale" },
                },
            },
        ],
    },
    {
        id: "prod_rel_3",
        title: "The Roma Shearling Aviator Bomber",
        handle: "roma-shearling-aviator-bomber",
        thumbnail: "/images/about-us/woman-tan-bomber.jpg",
        images: [
            { id: "rel_3_a", url: "/images/about-us/woman-tan-bomber.jpg" },
            { id: "rel_3_b", url: "/images/about-us/woman-brown-jacket.jpg" },
        ],
        categories: [{ id: "cat_women", name: "Bomber Jackets", handle: "women" }],
        variants: [
            {
                id: "var_rel_3",
                title: "Saddle Tan / M",
                calculated_price: {
                    id: "cp_rel_3",
                    calculated_amount: 480,
                    original_amount: 600,
                    currency_code: "usd",
                    calculated_price: { price_list_type: "sale" },
                },
            },
        ],
    },
    {
        id: "prod_rel_4",
        title: "The Weekender Full-Grain Duffle",
        handle: "weekender-full-grain-duffle",
        thumbnail: "/images/col_thumb/col_travelessentials_1.png",
        images: [
            { id: "rel_4_a", url: "/images/col_thumb/col_travelessentials_1.png" },
            { id: "rel_4_b", url: "/images/col_thumb/col_travelessentials_3.png" },
        ],
        categories: [{ id: "cat_bags", name: "Travel Bags", handle: "bags-luggage" }],
        variants: [
            {
                id: "var_rel_4",
                title: "Cognac / One Size",
                calculated_price: {
                    id: "cp_rel_4",
                    calculated_amount: 340,
                    original_amount: 420,
                    currency_code: "usd",
                    calculated_price: { price_list_type: "sale" },
                },
            },
        ],
    },
] as unknown as StoreProductWithReviews[]

export const PREVIEW_CUSTOMER: StoreCustomer = {
    id: "cus_preview_01",
    email: "julian.sterling@vellehide.com",
    first_name: "Julian",
    last_name: "Sterling",
    phone: "+1 (212) 555-0194",
    has_account: true,
    addresses: [
        {
            id: "addr_saved_1",
            address_name: "Manhattan Residence",
            first_name: "Julian",
            last_name: "Sterling",
            company: "Sterling Architectural Studio",
            address_1: "450 Broome Street",
            address_2: "Penthouse 4B",
            city: "New York",
            province: "NY",
            postal_code: "10013",
            country_code: "us",
            phone: "+1 (212) 555-0194",
            is_default_shipping: true,
            is_default_billing: true,
        },
        {
            id: "addr_saved_2",
            address_name: "Milan Design Office",
            first_name: "Julian",
            last_name: "Sterling",
            company: "Atelier Sterling SRL",
            address_1: "Via Monte Napoleone 18",
            address_2: "Floor 3",
            city: "Milano",
            province: "MI",
            postal_code: "20121",
            country_code: "it",
            phone: "+39 02 5550 1920",
            is_default_shipping: false,
            is_default_billing: false,
        },
    ],
    created_at: "2026-01-15T00:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
    deleted_at: null,
} as unknown as StoreCustomer

export const PREVIEW_DEFAULT_CART: StoreCart = {
    id: "cart_preview_vellehide_01",
    currency_code: "usd",
    email: "julian.sterling@vellehide.com",
    region_id: "reg_preview_us",
    region: PREVIEW_REGION,
    subtotal: 760,
    discount_total: 0,
    gift_card_total: 0,
    shipping_subtotal: 0,
    shipping_total: 0,
    tax_total: 60.8,
    total: 820.8,
    promotions: [],
    shipping_address: {
        id: "saddr_preview_1",
        first_name: "Julian",
        last_name: "Sterling",
        company: "Sterling Architectural Studio",
        address_1: "450 Broome Street",
        address_2: "Penthouse 4B",
        city: "New York",
        province: "NY",
        postal_code: "10013",
        country_code: "us",
        phone: "+1 (212) 555-0194",
    },
    billing_address: {
        id: "baddr_preview_1",
        first_name: "Julian",
        last_name: "Sterling",
        company: "Sterling Architectural Studio",
        address_1: "450 Broome Street",
        address_2: "Penthouse 4B",
        city: "New York",
        province: "NY",
        postal_code: "10013",
        country_code: "us",
        phone: "+1 (212) 555-0194",
    },
    shipping_methods: [
        {
            id: "sm_preview_1",
            name: "Standard Atelier Insured Courier",
            amount: 0,
            shipping_option_id: "so_standard_atelier",
            shipping_option: PREVIEW_SHIPPING_METHODS[0],
        } as any,
    ],
    payment_collection: {
        id: "paycol_preview_01",
        amount: 820.8,
        currency_code: "usd",
        payment_sessions: [
            {
                id: "paysess_preview_01",
                provider_id: "pp_paypal_card",
                status: "pending",
                amount: 820.8,
                currency_code: "usd",
                data: {
                    id: "pp_order_demo_01",
                    paymentUrl: "https://test.payu.in/_payment",
                    form_data: {
                        key: "gtKFFx",
                        txnid: "VH_TXN_20261007_001",
                        amount: "820.80",
                        productinfo: "Velle Hide Handcrafted Leather Goods",
                        firstname: "Julian",
                        email: "julian.sterling@vellehide.com",
                        phone: "+12125550194",
                        surl: "http://localhost:3000/checkout-preview?status=success",
                        furl: "http://localhost:3000/checkout-preview?status=failure",
                        hash: "demo_verified_sha512_payu_hash_token_2026",
                    },
                },
            },
        ],
    } as any,
    items: [
        {
            id: "item_preview_1",
            title: "The Milano Full-Grain Heritage Biker Jacket",
            subtitle: "Full-Grain Italian Lambskin",
            thumbnail: "/images/col_thumb/col_mens_1.webp",
            product_id: "prod_milano_biker",
            product_title: "The Milano Full-Grain Heritage Biker Jacket",
            product_handle: "milano-heritage-biker-jacket",
            variant_id: "var_0_m",
            variant_sku: "VH-MLN-OBS-M",
            variant_title: "Obsidian Black / M",
            quantity: 1,
            unit_price: 420,
            subtotal: 420,
            total: 420,
            original_total: 560,
            adjustments: [],
            variant: {
                id: "var_0_m",
                title: "Obsidian Black / M",
                sku: "VH-MLN-OBS-M",
            },
            product: {
                id: "prod_milano_biker",
                title: "The Milano Full-Grain Heritage Biker Jacket",
                handle: "milano-heritage-biker-jacket",
            },
            metadata: {
                lining: "Mulberry Silk Lining",
                zipper: "Antique Brass YKK",
                monogram: "J.S. — MMXXVI",
            },
        },
        {
            id: "item_preview_2",
            title: "The Weekender Full-Grain Leather Duffle",
            subtitle: "Vegetable-Tanned Tuscan Calfskin",
            thumbnail: "/images/col_thumb/col_travelessentials_1.png",
            product_id: "prod_rel_4",
            product_title: "The Weekender Full-Grain Leather Duffle",
            product_handle: "weekender-full-grain-duffle",
            variant_id: "var_rel_4",
            variant_sku: "VH-WKD-COG-OS",
            variant_title: "Cognac Espresso / One Size",
            quantity: 1,
            unit_price: 340,
            subtotal: 340,
            total: 340,
            original_total: 420,
            adjustments: [],
            variant: {
                id: "var_rel_4",
                title: "Cognac Espresso / One Size",
                sku: "VH-WKD-COG-OS",
            },
            product: {
                id: "prod_rel_4",
                title: "The Weekender Full-Grain Leather Duffle",
                handle: "weekender-full-grain-duffle",
            },
            metadata: {},
        },
    ] as any,
} as unknown as StoreCart
