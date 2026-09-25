import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { SortOptions } from "@/types/common"

/* ─── Types ──────────────────────────────────────────────────────────── */

export interface FilterState {
    /** Current sort option */
    sort: SortOptions
    /** Current page (1-indexed) */
    page: number
    /** Min price filter (empty = unset) */
    minPrice: string
    /** Max price filter (empty = unset) */
    maxPrice: string
    /** Selected option value IDs (MedusaJS v2 option_value_id) */
    optionValueIds: string[]
    /** Free-text search query within the category */
    query: string
}

export interface FilterActions {
    setSort: (sort: SortOptions) => void
    setPage: (page: number) => void
    setMinPrice: (price: string) => void
    setMaxPrice: (price: string) => void
    toggleOptionValue: (id: string) => void
    setOptionValues: (ids: string[]) => void
    setQuery: (query: string) => void
    /** Reset all filters to their defaults (keeps sort) */
    clearAll: () => void
    /** Hydrate state from URL search params */
    hydrate: (params: URLSearchParams | Record<string, string | string[] | undefined>) => void
}

export type FilterStore = FilterState & FilterActions

/* ─── Defaults ───────────────────────────────────────────────────────── */

const DEFAULT_STATE: FilterState = {
    sort: "created_at",
    page: 1,
    minPrice: "",
    maxPrice: "",
    optionValueIds: [],
    query: "",
}

/* ─── Store ──────────────────────────────────────────────────────────── */

export const useFilterStore = create<FilterStore>()(
    devtools(
        (set, get) => ({
            ...DEFAULT_STATE,

            setSort: (sort) =>
                set({ sort, page: 1 }, false, "filter/setSort"),

            setPage: (page) =>
                set({ page: Math.max(1, page) }, false, "filter/setPage"),

            setMinPrice: (minPrice) =>
                set({ minPrice, page: 1 }, false, "filter/setMinPrice"),

            setMaxPrice: (maxPrice) =>
                set({ maxPrice, page: 1 }, false, "filter/setMaxPrice"),

            toggleOptionValue: (id) =>
                set(
                    (state) => {
                        const next = state.optionValueIds.includes(id)
                            ? state.optionValueIds.filter((v) => v !== id)
                            : [...state.optionValueIds, id]
                        return { optionValueIds: next, page: 1 }
                    },
                    false,
                    `filter/toggleOption:${id}`,
                ),

            setOptionValues: (ids) =>
                set({ optionValueIds: ids, page: 1 }, false, "filter/setOptionValues"),

            setQuery: (query) =>
                set({ query, page: 1 }, false, "filter/setQuery"),

            clearAll: () =>
                set(
                    {
                        minPrice: "",
                        maxPrice: "",
                        optionValueIds: [],
                        query: "",
                        page: 1,
                    },
                    false,
                    "filter/clearAll",
                ),

            hydrate: (params) => {
                const get_val = (key: string): string | undefined => {
                    if (typeof (params as URLSearchParams).get === "function") {
                        return (params as URLSearchParams).get(key) ?? undefined
                    }
                    const v = (params as Record<string, string | string[] | undefined>)[key]
                    return Array.isArray(v) ? v[0] : v
                }

                const get_all = (key: string): string[] => {
                    if (typeof (params as URLSearchParams).getAll === "function") {
                        return (params as URLSearchParams).getAll(key)
                    }
                    const v = (params as Record<string, string | string[] | undefined>)[key]
                    if (!v) return []
                    return Array.isArray(v) ? v : [v]
                }

                const sort = (get_val("sort") as SortOptions) || "created_at"
                const page = Math.max(1, parseInt(get_val("page") ?? "1", 10))
                const minPrice = get_val("minPrice") ?? ""
                const maxPrice = get_val("maxPrice") ?? ""
                const optionValueIds = get_all("optionValueIds").filter(Boolean)
                const query = get_val("q") ?? ""

                set(
                    { sort, page, minPrice, maxPrice, optionValueIds, query },
                    false,
                    "filter/hydrate",
                )
            },


        }),
        {
            name: "FilterStore",
            enabled: process.env.NODE_ENV === "development",
        },
    ),
)

/* ─── URL Builder ────────────────────────────────────────────────────── */

/**
 * Builds a URLSearchParams string from the current filter state.
 * Only includes non-default values to keep URLs clean.
 */
export function buildFilterParams(state: FilterState): URLSearchParams {
    const params = new URLSearchParams()

    if (state.sort && state.sort !== "created_at") {
        params.set("sort", state.sort)
    }
    if (state.page > 1) {
        params.set("page", String(state.page))
    }
    if (state.minPrice) {
        params.set("minPrice", state.minPrice)
    }
    if (state.maxPrice) {
        params.set("maxPrice", state.maxPrice)
    }
    for (const id of state.optionValueIds) {
        params.append("optionValueIds", id)
    }
    if (state.query) {
        params.set("q", state.query)
    }

    return params
}

/* ─── Selectors ──────────────────────────────────────────────────────── */

export const useActiveFilterCount = () => useFilterStore((s) => {
    let count = 0
    if (s.minPrice || s.maxPrice) count += 1
    count += s.optionValueIds.length
    if (s.query) count += 1
    return count
})
