import { create } from "zustand"
import { devtools } from "zustand/middleware";

export type UIElement = "menu" | "cart" | "filter" | "search" | 'megamenu'

interface UIState {
    active: UIElement | null
    open: (element: UIElement) => void
    close: () => void
    toggle: (element: UIElement) => void
}

export const useUIStore = create<UIState>()(
    devtools((set) => ({
        active: null,

        open: (element) => set((state) => (state.active === element ? state : { active: element }),
            false,
            `ui/open:${element}`
        ),

        close: () => set((state) => (state.active === null ? state : { active: null }),
            false,
            "ui/close"
        ),

        toggle: (element) => set((state) => ({ active: state.active === element ? null : element, }),
            false,
            `ui/toggle:${element}`
        ),
    }), {
        name: "UIStore",
        enabled: process.env.NODE_ENV === "development",
    }),
)

// ── Side Effects (Scroll Lock) ────────────────────────────────────
// Instead of mutating the DOM inside the state updater, we subscribe 
// to state changes. This is SSR-safe and keeps reducers pure.
if (typeof window !== "undefined") {
    useUIStore.subscribe((state, prevState) => {
        if (state.active !== prevState.active) {
            const isAnyOpen = state.active !== null
            document.body.style.overflow = isAnyOpen ? "hidden" : ""
        }
    })
}

// ── Granular Selectors ────────────────────────────────────────────
// Use these custom hooks in your components to prevent over-rendering

export const useIsUIOpen = (element: UIElement) => useUIStore((state) => state.active === element)

export const useIsAnyUIOpen = () => useUIStore((state) => state.active !== null)