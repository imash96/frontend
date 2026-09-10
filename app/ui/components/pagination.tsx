'use client';

import { useState } from 'react';
import Pagination from '@/ui/custom/custom-pagination';

function DemoSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-2xl font-heading font-semibold text-text-primary mb-2">
                    {title}
                </h2>
                <p className="text-text-secondary text-sm">{description}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 md:p-8">
                {children}
            </div>
        </section>
    )
};

function CodeBlock({ code }: { code: string }) {
    return (
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
            <code>{code}</code>
        </pre>
    )
};

export default function PaginationTab() {
    // State for different demos
    const [defaultPage, setDefaultPage] = useState(1);
    const [simplePage, setSimplePage] = useState(1);
    const [compactPage, setCompactPage] = useState(1);
    const [productPage, setProductPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-primary text-primary-foreground py-12 px-6 border-b border-primary-foreground/10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
                        Pagination Component
                    </h1>
                    <p className="text-lg text-primary-foreground/80 font-body">
                        SEO-friendly, accessible, and beautiful pagination for your eCommerce store
                    </p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
                {/* Features Overview */}
                <section className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-surface border border-border rounded-xl">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="font-heading font-semibold text-lg mb-2">SEO Optimized</h3>
                        <p className="text-sm text-text-secondary">
                            Uses actual links with proper rel attributes for search engine crawlability
                        </p>
                    </div>

                    <div className="p-6 bg-surface border border-border rounded-xl">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <h3 className="font-heading font-semibold text-lg mb-2">Fully Customizable</h3>
                        <p className="text-sm text-text-secondary">
                            Multiple variants, items per page selector, and flexible configuration
                        </p>
                    </div>

                    <div className="p-6 bg-surface border border-border rounded-xl">
                        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="font-heading font-semibold text-lg mb-2">Accessible</h3>
                        <p className="text-sm text-text-secondary">
                            WCAG 2.1 AA compliant with keyboard navigation and screen reader support
                        </p>
                    </div>
                </section>

                {/* Default Variant */}
                <DemoSection
                    title="Default Variant"
                    description="Full-featured pagination with page numbers, navigation controls, and item count display."
                >
                    <div className="space-y-6">
                        <Pagination
                            currentPage={defaultPage}
                            totalPages={20}
                            onPageChange={setDefaultPage}
                            totalItems={240}
                            itemsPerPage={12}
                            showTotalItems
                            showFirstLast
                        />

                        <CodeBlock
                            code={`<Pagination
    currentPage={1}
    totalPages={20}
    onPageChange={(page) => setPage(page)}
    totalItems={240}
    itemsPerPage={12}
    showTotalItems
    showFirstLast
/>`}
                        />
                    </div>
                </DemoSection>

                {/* Simple Variant */}
                <DemoSection
                    title="Simple Variant"
                    description="Compact pagination showing only previous/next with page counter."
                >
                    <div className="space-y-6">
                        <Pagination
                            currentPage={simplePage}
                            totalPages={10}
                            onPageChange={setSimplePage}
                            variant="simple"
                            showFirstLast={false}
                        />

                        <CodeBlock
                            code={`<Pagination
    currentPage={1}
    totalPages={10}
    onPageChange={(page) => setPage(page)}
    variant="simple"
    showFirstLast={false}
/>`}
                        />
                    </div>
                </DemoSection>

                {/* Compact Variant */}
                <DemoSection
                    title="Compact Variant"
                    description="Space-efficient pagination ideal for mobile or sidebar placement."
                >
                    <div className="space-y-6">
                        <Pagination
                            currentPage={compactPage}
                            totalPages={15}
                            onPageChange={setCompactPage}
                            variant="compact"
                            totalItems={180}
                            itemsPerPage={12}
                        />

                        <CodeBlock
                            code={`<Pagination
    currentPage={1}
    totalPages={15}
    onPageChange={(page) => setPage(page)}
    variant="compact"
    totalItems={180}
    itemsPerPage={12}
/>`}
                        />
                    </div>
                </DemoSection>

                {/* With Items Per Page */}
                <DemoSection
                    title="With Items Per Page Selector"
                    description="Allow users to change how many items are displayed per page."
                >
                    <div className="space-y-6">
                        <Pagination
                            currentPage={productPage}
                            totalPages={Math.ceil(240 / itemsPerPage)}
                            onPageChange={setProductPage}
                            totalItems={240}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={(value) => {
                                setItemsPerPage(value);
                                setProductPage(1);
                            }}
                            itemsPerPageOptions={[12, 24, 36, 48]}
                            showItemsPerPage
                            showTotalItems
                        />

                        <CodeBlock
                            code={`<Pagination
    currentPage={page}
    totalPages={Math.ceil(totalItems / itemsPerPage)}
    onPageChange={setPage}
    totalItems={240}
    itemsPerPage={itemsPerPage}
    onItemsPerPageChange={(value) => {
        setItemsPerPage(value);
        setPage(1);
    }}
    itemsPerPageOptions={[12, 24, 36, 48]}
    showItemsPerPage
    showTotalItems
/>`}
                        />
                    </div>
                </DemoSection>

                {/* SEO-Friendly with URLs */}
                <DemoSection
                    title="SEO-Friendly with URL Generation"
                    description="Generate proper URLs for each page for better search engine crawling."
                >
                    <div className="space-y-6">
                        <Pagination
                            currentPage={1}
                            totalPages={10}
                            onPageChange={(page) => console.log('Navigate to page:', page)}
                            getPageUrl={(page) => `/products?page=${page}`}
                            showTotalItems
                            totalItems={120}
                            itemsPerPage={12}
                        />

                        <CodeBlock
                            code={`<Pagination
    currentPage={currentPage}
    totalPages={10}
    onPageChange={(page) => router.push(\`/products?page=\${page}\`)}
    getPageUrl={(page) => \`/products?page=\${page}\`}
    showTotalItems
    totalItems={120}
/>`}
                        />
                    </div>
                </DemoSection>

                {/* Usage Examples */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-heading font-bold text-text-primary">
                        Usage Examples
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-surface border border-border rounded-xl p-6">
                            <h3 className="font-heading font-semibold text-lg mb-3">Product Collection Page</h3>
                            <CodeBlock
                                code={`// app/collections/[handle]/page.tsx
'use client';

import Pagination from '@/module/common/custom-pagination';

export default function CollectionPage({ searchParams }) {
    const page = Number(searchParams.page) || 1;
    const itemsPerPage = Number(searchParams.limit) || 12;

    // Fetch products based on page and limit
    const { products, total } = useProducts(page, itemsPerPage);

    return (
        <div>
        <ProductGrid products={products} />
        
        <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / itemsPerPage)}
            onPageChange={(p) => router.push(\`?page=\${p}&limit=\${itemsPerPage}\`)}
            getPageUrl={(p) => \`?page=\${p}&limit=\${itemsPerPage}\`}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(limit) => router.push(\`?page=1&limit=\${limit}\`)}
            showItemsPerPage
            showTotalItems
        />
        </div>
    );
}`}
                            />
                        </div>

                        <div className="bg-surface border border-border rounded-xl p-6">
                            <h3 className="font-heading font-semibold text-lg mb-3">Search Results Page</h3>
                            <CodeBlock
                                code={`// app/search/page.tsx
'use client';

import Pagination from '@/module/common/custom-pagination';

export default function SearchPage({ searchParams }) {
    const query = searchParams.q;
    const page = Number(searchParams.page) || 1;

    const { results, totalResults } = useSearch(query, page);

    return (
        <div>
        <SearchResults results={results} />
        
        <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalResults / 12)}
            onPageChange={(p) => router.push(\`/search?q=\${query}&page=\${p}\`)}
            getPageUrl={(p) => \`/search?q=\${query}&page=\${p}\`}
            totalItems={totalResults}
            itemsPerPage={12}
            showTotalItems
            ariaLabel="Search results pagination"
        />
        </div>
    );
}`}
                            />
                        </div>
                    </div>
                </section>

                {/* API Reference */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-heading font-bold text-text-primary">
                        API Reference
                    </h2>

                    <div className="bg-surface border border-border rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left p-4 font-heading font-semibold text-sm">Prop</th>
                                    <th className="text-left p-4 font-heading font-semibold text-sm">Type</th>
                                    <th className="text-left p-4 font-heading font-semibold text-sm">Default</th>
                                    <th className="text-left p-4 font-heading font-semibold text-sm">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-sm">
                                <tr>
                                    <td className="p-4 font-mono text-primary">currentPage</td>
                                    <td className="p-4 text-text-secondary">number</td>
                                    <td className="p-4 text-text-tertiary">required</td>
                                    <td className="p-4">Current active page number</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-primary">totalPages</td>
                                    <td className="p-4 text-text-secondary">number</td>
                                    <td className="p-4 text-text-tertiary">required</td>
                                    <td className="p-4">Total number of pages</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-primary">onPageChange</td>
                                    <td className="p-4 text-text-secondary">(page) =&gt; void</td>
                                    <td className="p-4 text-text-tertiary">required</td>
                                    <td className="p-4">Callback when page changes</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-primary">variant</td>
                                    <td className="p-4 text-text-secondary">{"'default' | 'simple' | 'compact'"}</td>
                                    <td className="p-4 text-text-tertiary">{"'default'"}</td>
                                    <td className="p-4">Visual style variant</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-primary">totalItems</td>
                                    <td className="p-4 text-text-secondary">number</td>
                                    <td className="p-4 text-text-tertiary">-</td>
                                    <td className="p-4">Total number of items (for display)</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-primary">itemsPerPage</td>
                                    <td className="p-4 text-text-secondary">number</td>
                                    <td className="p-4 text-text-tertiary">12</td>
                                    <td className="p-4">Number of items per page</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-primary">showItemsPerPage</td>
                                    <td className="p-4 text-text-secondary">boolean</td>
                                    <td className="p-4 text-text-tertiary">false</td>
                                    <td className="p-4">Show items per page selector</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-primary">showTotalItems</td>
                                    <td className="p-4 text-text-secondary">boolean</td>
                                    <td className="p-4 text-text-tertiary">true</td>
                                    <td className="p-4">Show total items count</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-primary">showFirstLast</td>
                                    <td className="p-4 text-text-secondary">boolean</td>
                                    <td className="p-4 text-text-tertiary">true</td>
                                    <td className="p-4">Show first/last page buttons</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-primary">getPageUrl</td>
                                    <td className="p-4 text-text-secondary">(page) =&gt; string</td>
                                    <td className="p-4 text-text-tertiary">-</td>
                                    <td className="p-4">Generate URL for SEO-friendly links</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Best Practices */}
                <section className="bg-accent/5 border border-accent/20 rounded-xl p-6 md:p-8">
                    <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">
                        Best Practices for SEO
                    </h2>
                    <ul className="space-y-3 text-text-secondary">
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Always provide <code className="px-2 py-0.5 bg-muted rounded text-primary">getPageUrl</code> prop for search engine crawlability</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Use URL query parameters (e.g., <code className="px-2 py-0.5 bg-muted rounded text-primary">?page=2</code>) for proper indexing</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Add canonical tags to handle duplicate content from pagination</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Include proper meta tags with page numbers in titles and descriptions</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>The component automatically adds <code className="px-2 py-0.5 bg-muted rounded text-primary">{`rel="prev"`}</code> and <code className="px-2 py-0.5 bg-muted rounded text-primary">{`rel="next"`}</code> attributes</span>
                        </li>
                    </ul>
                </section>
            </main>
        </div>
    );
}