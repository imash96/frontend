export function buildQuery(params: any = {}) {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            search.set(key, String(value))
        }
    })
    return search.size ? `?${search.toString()}` : ""
}