import { useCallback, useEffect, useState } from "react"

export type StateType = {
    state: boolean
    open: () => void
    close: () => void
    toggle: () => void
}

export const useToggleState = (initialState = false): StateType => {
    const [state, setState] = useState(initialState)

    useEffect(() => {
        const handle = (e: KeyboardEvent) => (e.key === "Escape") && setState(false)
        if (state) window.addEventListener("keydown", handle)

        return () => window.removeEventListener("keydown", handle)
    }, [state])

    const open = useCallback(() => setState(true), [])
    const close = useCallback(() => setState(false), [])
    const toggle = useCallback(() => setState((o) => !o), [])

    return { state, open, close, toggle }
}