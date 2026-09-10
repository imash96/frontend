/* ─── Types ──────────────────────────────────────────────────────────
   Matches Medusa v2 StoreProductCategory shape.
   In production these come from the store API; the mock below is used
   as fallback / dev seed.
───────────────────────────────────────────────────────────────────── */

import { StoreProductCategory } from "@medusajs/types"


/* ─── Size logic ─────────────────────────────────────────────────────
   Returns the correct size array for a given category handle, or null
   when sizing does not apply (bags, accessories, etc.)
───────────────────────────────────────────────────────────────────── */
export function getSizesForHandle(handle: string): string[] | null {
    const h = handle.toLowerCase()

    const ALPHA_PATTERNS = [
        "outerwear", "jacket", "coat", "blazer", "bomber",
        "tops", "shirt", "blouse", "vest", "knit",
    ]
    const NUMERIC_PATTERNS = [
        "bottoms", "pant", "trouser", "skirt", "short", "jean", "denim",
    ]
    const DIMENSION_PATTERNS = [
        "home-decor", "home_decor", "homedecor",
        "cushion", "pillow", "throw", "blanket", "wall-art", "runner",
    ]

    if (ALPHA_PATTERNS.some((p) => h.includes(p))) {
        return ["XS", "S", "M", "L", "XL", "XXL"]
    }
    if (NUMERIC_PATTERNS.some((p) => h.includes(p))) {
        return ["28", "30", "32", "34", "36", "38", "40"]
    }
    if (DIMENSION_PATTERNS.some((p) => h.includes(p))) {
        return ["20x20", "20x24", "24x24", "24x30", "30x30", "36x36"]
    }
    // bags, luggage, accessories → no size dimension filter
    return null
}
/* ─── Helpers ────────────────────────────────────────────────────── */

/** Flat list of all leaf categories (no children). */
export function getLeafCategories(cats: StoreProductCategory[]): StoreProductCategory[] {
    return cats.flatMap((c) => c.category_children?.length ? getLeafCategories(c.category_children) : [c])
}

/** Find a category by handle anywhere in the tree. */
export function findByHandle(handle: string, cats: StoreProductCategory[]): StoreProductCategory | undefined {
    for (const c of cats) {
        if (c.handle === handle) return c
        if (c.category_children?.length) {
            const found = findByHandle(handle, c.category_children)
            if (found) return found
        }
    }
    return undefined
}

export function getCategoryImage(handle: string): string {
    // Direct match
    if (imagePool[handle]) return imagePool[handle];
    // Match last segment
    const lastSegment = handle.split("/").pop() || "";
    if (imagePool[lastSegment]) return imagePool[lastSegment];
    // Pattern matching
    const h = handle.toLowerCase();
    if (h.includes("biker") || h.includes("motorcycle")) return imagePool["biker"];
    if (h.includes("cafe-racer") || h.includes("racer")) return imagePool["cafe-racer"];
    if (h.includes("bomber") || h.includes("flight")) return imagePool["bomber"];
    if (h.includes("quilted") || h.includes("padded")) return imagePool["quilted"];
    if (h.includes("hooded") || h.includes("sweatshirt")) return imagePool["hooded"];
    if (h.includes("trench")) return imagePool["trench"];
    if (h.includes("overcoat")) return imagePool["overcoat"];
    if (h.includes("car")) return imagePool["car-coat"];
    if (h.includes("duster")) return imagePool["duster"];
    if (h.includes("pea")) return imagePool["pea-coat"];
    if (h.includes("blazer")) return imagePool["blazer"];
    if (h.includes("shirt") && !h.includes("t-shirt")) return imagePool["shirt"];
    if (h.includes("t-shirt") || h.includes("tee")) return imagePool["t-shirt"];
    if (h.includes("vest") || h.includes("waistcoat")) return imagePool["vest"];
    if (h.includes("pant") || h.includes("trouser")) return imagePool["pants"];
    if (h.includes("short")) return imagePool["shorts"];
    if (h.includes("skirt")) return imagePool["skirt"];
    if (h.includes("dress")) return imagePool["dress"];
    if (h.includes("backpack")) return imagePool["backpack"];
    if (h.includes("briefcase") || h.includes("portfolio")) return imagePool["briefcase"];
    if (h.includes("duffel") || h.includes("travel")) return imagePool["duffel"];
    if (h.includes("handbag") || h.includes("tote")) return imagePool["handbag"];
    if (h.includes("messenger")) return imagePool["messenger"];
    if (h.includes("chelsea")) return imagePool["chelsea"];
    if (h.includes("chukka") || h.includes("desert")) return imagePool["chukka"];
    if (h.includes("combat") || h.includes("work")) return imagePool["combat"];
    if (h.includes("western") || h.includes("cowboy")) return imagePool["western"];
    if (h.includes("loafer") || h.includes("slip")) return imagePool["loafer"];
    if (h.includes("casual")) return imagePool["casual-shoe"];
    if (h.includes("wallet")) return imagePool["wallet"];
    if (h.includes("belt")) return imagePool["belt"];
    if (h.includes("glove")) return imagePool["gloves"];
    if (h.includes("pillow")) return imagePool["pillow"];
    if (h.includes("accent") || h.includes("decor")) return imagePool["accents"];
    if (h.includes("boys") || h.includes("girls") || h.includes("kids")) return imagePool["kids-jacket"];
    if (h.includes("jacket")) return imagePool["biker"];
    if (h.includes("coat")) return imagePool["overcoat"];
    if (h.includes("boot")) return imagePool["chelsea"];
    if (h.includes("shoe") || h.includes("dress")) return imagePool["dress-shoe"];
    if (h.includes("bag")) return imagePool["handbag"];
    // Fallback
    return imagePool["men"];
}

// ── Image pool for category thumbnails ────────────────────────────────
const imagePool: Record<string, string> = {
    // Jackets
    "biker": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&q=80",
    "cafe-racer": "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=400&fit=crop&q=80",
    "bomber": "https://images.unsplash.com/photo-1557418669-b282597d47c2?w=400&h=400&fit=crop&q=80",
    "quilted": "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop&q=80",
    "hooded": "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400&h=400&fit=crop&q=80",
    // Coats
    "trench": "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=400&fit=crop&q=80",
    "overcoat": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop&q=80",
    "car-coat": "https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=400&h=400&fit=crop&q=80",
    "duster": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
    "pea-coat": "https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?w=400&h=400&fit=crop&q=80",
    // Tops
    "blazer": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=400&fit=crop&q=80",
    "shirt": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&q=80",
    "t-shirt": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop&q=80",
    "vest": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop&q=80",
    // Bottoms
    "pants": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop&q=80",
    "shorts": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop&q=80",
    "skirt": "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop&q=80",
    // Dresses
    "dress": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&q=80",
    // Bags
    "backpack": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80",
    "briefcase": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&q=80",
    "duffel": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop&q=80",
    "handbag": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&q=80",
    "messenger": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=400&fit=crop&q=80",
    // Footwear
    "chelsea": "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&h=400&fit=crop&q=80",
    "chukka": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80",
    "combat": "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=400&h=400&fit=crop&q=80",
    "western": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop&q=80",
    "dress-shoe": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=400&fit=crop&q=80",
    "loafer": "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=400&fit=crop&q=80",
    "casual-shoe": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&q=80",
    // Accessories
    "wallet": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop&q=80",
    "belt": "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&h=400&fit=crop&q=80",
    "gloves": "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=400&h=400&fit=crop&q=80",
    // Home
    "pillow": "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=400&h=400&fit=crop&q=80",
    "accents": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop&q=80",
    // Kids
    "kids-jacket": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop&q=80",
    // Parents
    "men": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=80",
    "women": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop&q=80",
    "bags-luggage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop&q=80",
    "footwear": "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=800&fit=crop&q=80",
    "accessories": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=800&fit=crop&q=80",
    "home-decor": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=800&fit=crop&q=80",
    "kids": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop&q=80",
    // Sub-parents
    "outerwear": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=80",
    "tops": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop&q=80",
    "bottoms": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop&q=80",
    "dresses": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop&q=80",
    "jackets": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=80",
    "coats": "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop&q=80",
    "boots": "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=800&fit=crop&q=80",
    "shoes": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&h=800&fit=crop&q=80",
};