import type { StoreAddAddress } from "@medusajs/types"

const FIELDS: (keyof StoreAddAddress)[] = [
    "first_name",
    "last_name",
    "address_1",
    "company",
    "postal_code",
    "city",
    "country_code",
    "province",
    "phone",
]

function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    return keys.reduce((acc, key) => {
        acc[key] = obj[key]
        return acc
    }, {} as Pick<T, K>)
}

function isEqual<T extends object>(obj1: T, obj2: T): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export default function compareAddresses(address1: StoreAddAddress, address2: StoreAddAddress): boolean {
    return isEqual(pick(address1, FIELDS), pick(address2, FIELDS))
}
