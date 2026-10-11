"use client"

import { Component, type ReactNode } from "react"

type Props = { children: ReactNode; fallback: ReactNode }

/**
 * PayPal's React components throw during render/effects when the SDK can't initialise (wrong
 * components, unsupported currency, blocked script...). Without a boundary that error takes down
 * the whole checkout; with it the customer keeps the page and can pick another payment method.
 */
export default class ProviderErrorBoundary extends Component<Props, { failed: boolean }> {
    state = { failed: false }

    static getDerivedStateFromError() {
        return { failed: true }
    }

    componentDidCatch(error: unknown) {
        console.error("[payment provider] crashed:", error)
    }

    render() {
        return this.state.failed ? this.props.fallback : this.props.children
    }
}