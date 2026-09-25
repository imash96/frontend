import { cacheLife } from "next/cache"

export default async function getYear() {
    'use cache'
    cacheLife('max')
    return new Date().getFullYear()
}