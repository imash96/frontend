"use client"

import { liteClient as algoliasearch } from "algoliasearch/lite"
import { useCallback, useEffect, useRef, useState } from "react"

export type AlgoliaHit = {
  objectID: string
  id: string
  title: string
  handle: string
  thumbnail?: string
  description?: string
  categories?: { id: string; name: string; handle: string }[]
  tags?: { id: string; value: string }[]
  _highlightResult?: Record<string, { value: string; matchLevel: string }>
}

/* ─────────────────────────────────────────────
   Algolia lite client (search-only, no writes)
   Singleton — created once, reused across renders.
   ───────────────────────────────────────────── */
const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? ""
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ?? ""
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX ?? "products-dev"

const client = algoliasearch(APP_ID, SEARCH_KEY)

/**
 * Queries Algolia directly from the browser using the search-only API key.
 * Debounces input and cancels stale requests via AbortController.
 */
export function useAlgoliaSearch(query: string, debounceMs = 250) {
  const [hits, setHits] = useState<AlgoliaHit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalHits, setTotalHits] = useState(0)
  const requestIdRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const search = useCallback(async (q: string, requestId: number) => {
    const trimmed = q.trim()
    if (trimmed.length < 2) {
      setHits([])
      setTotalHits(0)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const { results } = await client.search({
        requests: [
          {
            indexName: INDEX_NAME,
            query: trimmed,
            hitsPerPage: 8,
            attributesToHighlight: ["title"],
          },
        ],
      })

      // Discard if a newer request has been fired
      if (requestId !== requestIdRef.current) return

      const firstResult = results[0]
      if ("hits" in firstResult) {
        setHits(firstResult.hits as AlgoliaHit[])
        setTotalHits(firstResult.nbHits ?? firstResult.hits.length)
      }
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return
      console.error("Algolia search error:", err)
      setHits([])
      setTotalHits(0)
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setHits([])
      setTotalHits(0)
      setIsLoading(false)
      return
    }

    // Show loading feedback immediately
    setIsLoading(true)

    // Increment request ID to invalidate any in-flight request
    const id = ++requestIdRef.current

    timerRef.current = setTimeout(() => {
      search(query, id)
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [query, debounceMs, search])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      requestIdRef.current++
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { hits, isLoading, totalHits }
}
