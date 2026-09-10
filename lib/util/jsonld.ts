export default function buildJsonLd(data: object) {
    return {
        'script:ld+json': JSON.stringify(data),
    }
}