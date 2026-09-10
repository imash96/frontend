'use client';

import { useState } from 'react';
import CustomModal, { AlertModal, ModalButton } from '@/ui/custom/custom-modal';
import { CustomAccordion, FAQAccordion, ProductDetailsAccordion, } from '@/ui/custom/custom-accordion';
import { ActionsMenu, CustomDropdownMenu, FilterMenu, UserMenu, } from '@/ui/custom/custom-dropdown';
import CustomInput from '@/ui/custom/custom-input';

// FAQ data
const faqItems = [
    {
        question: 'What materials are your leather products made from?',
        answer: (
            <div className="space-y-2">
                <p>Our leather goods are crafted from premium full-grain leather sourced from the finest tanneries in Italy. Each piece is selected for its exceptional quality, durability, and natural beauty.</p>
                <p>We use vegetable-tanned leather for most products, which is environmentally friendly and develops a beautiful patina over time.</p>
            </div>
        ),
    },
    {
        question: 'How should I care for my leather items?',
        answer: (
            <div className="space-y-2">
                <p>To maintain the beauty of your leather:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Clean with a soft, dry cloth regularly</li>
                    <li>Apply leather conditioner every 3-6 months</li>
                    <li>Avoid direct sunlight and heat sources</li>
                    <li>Store in a cool, dry place with proper ventilation</li>
                </ul>
            </div>
        ),
    },
    {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for all unworn and unused items in their original condition. Returns are free for all domestic orders.',
    },
    {
        question: 'Do you offer international shipping?',
        answer: 'Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days.',
    },
    {
        question: 'How can I track my order?',
        answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order by logging into your account.',
    },
];

// Product details data
const productDetails = [
    {
        title: 'Description',
        content: (
            <div className="space-y-3">
                <p>This premium leather jacket is handcrafted from full-grain Italian leather, featuring a classic silhouette with modern refinements.</p>
                <p>Features include brass hardware, quilted lining, and hand-stitched details throughout.</p>
            </div>
        ),
    },
    {
        title: 'Specifications',
        content: (
            <ul className="space-y-2">
                <li><strong>Material:</strong> Full-grain Italian leather</li>
                <li><strong>Lining:</strong> 100% quilted polyester</li>
                <li><strong>Hardware:</strong> Antique brass zippers and buttons</li>
                <li><strong>Pockets:</strong> 2 exterior, 2 interior</li>
            </ul>
        ),
    },
    {
        title: 'Sizing Guide',
        content: (
            <div className="space-y-3">
                <p>Our jackets run true to size. For the best fit, compare to our size chart:</p>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="py-2 text-left">Size</th>
                                <th className="py-2 text-left">Chest</th>
                                <th className="py-2 text-left">Length</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border"><td className="py-2">S</td><td>{`36-38"`}</td><td>{`17"`}</td><td>{`25"`}</td></tr>
                            <tr className="border-b border-border"><td className="py-2">M</td><td>{`38-40"`}</td><td>{`18"`}</td><td>{`26"`}</td></tr>
                            <tr className="border-b border-border"><td className="py-2">L</td><td>{`40-42"`}</td><td>{`19"`}</td><td>{`27"`}</td></tr>
                            <tr><td className="py-2">XL</td><td>{`42-44"`}</td><td>{`20"`}</td><td>{`28"`}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        ),
    },
    {
        title: 'Shipping & Returns',
        content: (
            <div className="space-y-3">
                <p><strong>Shipping:</strong> Free standard shipping on orders over $200. Express available for $25.</p>
                <p><strong>Returns:</strong> 30-day return policy. Items must be unworn and in original condition.</p>
            </div>
        ),
    },
];

function ModalSection() {
    const [basicModalOpen, setBasicModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleFormSubmit = () => {
        console.log('Form submitted:', formData);
        setFormModalOpen(false);
        alert('Form submitted successfully!');
    };

    return (
        <section className="bg-surface rounded-xl shadow-sm p-6 md:p-8 border border-border">
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">Modals</h2>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-3">Basic Modal</h3>
                    <p className="text-sm text-text-secondary mb-4">
                        A standard modal with title, description, and content area.
                    </p>

                    <CustomModal
                        open={basicModalOpen}
                        onOpenChange={setBasicModalOpen}
                        trigger={
                            <button className="px-4 py-2.5 bg-button-primary text-button-primary-foreground rounded-lg hover:bg-button-primary-hover transition-all font-semibold">
                                Open Basic Modal
                            </button>
                        }
                        title="Welcome to Our Store"
                        description="Discover premium leather goods crafted with exceptional quality"
                        size="md"
                        footer={
                            <>
                                <ModalButton variant="outline" onClick={() => setBasicModalOpen(false)}>Cancel</ModalButton>
                                <ModalButton variant="primary" onClick={() => setBasicModalOpen(false)}>Got It</ModalButton>
                            </>
                        }
                    >
                        <div className="space-y-4">
                            <p className="text-text-primary">Our collection features handcrafted leather jackets, coats, and accessories made from the finest materials.</p>
                            <p className="text-text-primary">Explore our catalog to find your perfect leather companion.</p>
                        </div>
                    </CustomModal>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-3">Form Modal</h3>
                    <p className="text-sm text-text-secondary mb-4">Modal with form inputs for collecting user data.</p>

                    <CustomModal
                        open={formModalOpen}
                        onOpenChange={setFormModalOpen}
                        trigger={
                            <button className="px-4 py-2.5 bg-button-secondary text-button-secondary-foreground rounded-lg hover:bg-button-secondary-hover transition-all font-semibold">
                                Open Form Modal
                            </button>
                        }
                        title="Join Our Newsletter"
                        description="Get exclusive offers and updates on new arrivals"
                        size="md"
                        footer={
                            <>
                                <ModalButton variant="ghost" onClick={() => setFormModalOpen(false)}>Maybe Later</ModalButton>
                                <ModalButton variant="primary" onClick={handleFormSubmit}>Subscribe</ModalButton>
                            </>
                        }
                    >
                        <div className="space-y-4">
                            <CustomInput
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                fullWidth
                            />
                            <CustomInput
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                fullWidth
                            />
                        </div>
                    </CustomModal>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-3">Alert Modals</h3>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => setAlertModalOpen(true)} className="px-4 py-2.5 bg-info text-info-foreground rounded-lg hover:bg-info-hover transition-all font-semibold">
                            Info Alert
                        </button>

                        <AlertModal
                            open={alertModalOpen}
                            onOpenChange={setAlertModalOpen}
                            title="Order Confirmation"
                            description="Your order has been successfully placed and will be shipped within 2-3 business days."
                            confirmLabel="View Order"
                            cancelLabel="Close"
                            variant="info"
                        />

                        <button onClick={() => setDeleteAlertOpen(true)} className="px-4 py-2.5 bg-error text-error-foreground rounded-lg hover:bg-error-hover transition-all font-semibold">
                            Danger Alert
                        </button>

                        <AlertModal
                            open={deleteAlertOpen}
                            onOpenChange={setDeleteAlertOpen}
                            title="Delete Account"
                            description="This action cannot be undone. All your data will be permanently deleted."
                            confirmLabel="Delete Account"
                            cancelLabel="Cancel"
                            variant="danger"
                            onConfirm={() => console.log('Account deleted')}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-3">Modal Sizes</h3>
                    <div className="flex flex-wrap gap-3">
                        {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                            <CustomModal
                                key={size}
                                trigger={
                                    <button className="px-4 py-2 border-2 border-border text-text-primary rounded-lg hover:border-primary transition-all font-semibold">
                                        {size.toUpperCase()} Modal
                                    </button>
                                }
                                title={`${size.toUpperCase()} Size Modal`}
                                description="This modal demonstrates different size options"
                                size={size}
                            >
                                <p className="text-text-primary">This is a {size} sized modal. Content adapts to the available space.</p>
                            </CustomModal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function AccordionSection() {
    return (
        <section className="bg-surface rounded-xl shadow-sm p-6 md:p-8 border border-border">
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">Accordions</h2>

            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">FAQ Accordion</h3>
                    <FAQAccordion items={faqItems} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Product Details Accordion</h3>
                    <ProductDetailsAccordion sections={productDetails} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Accordion Variants</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-text-secondary mb-3">Default Variant</p>
                            <CustomAccordion
                                items={[
                                    { value: '1', title: 'Free Shipping', content: 'On orders over $200' },
                                    { value: '2', title: 'Easy Returns', content: '30-day return policy' },
                                    { value: '3', title: 'Secure Payment', content: 'SSL encrypted checkout' },
                                ]}
                                variant="default"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-text-secondary mb-3">Separated Variant</p>
                            <CustomAccordion
                                items={[
                                    { value: '1', title: 'Craftsmanship', content: 'Handmade by skilled velles' },
                                    { value: '2', title: 'Materials', content: 'Premium full-grain leather' },
                                    { value: '3', title: 'Sustainability', content: 'Ethically sourced materials' },
                                ]}
                                variant="separated"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-text-secondary mb-3">Bordered Variant</p>
                            <CustomAccordion
                                items={[
                                    { value: '1', title: 'Lifetime Guarantee', content: 'We stand behind our products' },
                                    { value: '2', title: 'Expert Support', content: '24/7 customer service' },
                                    { value: '3', title: 'Gift Wrapping', content: 'Complimentary for all orders' },
                                ]}
                                variant="bordered"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

function DropdownSection() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [accordionValue, setAccordionValue] = useState('');

    return (
        <section className="bg-surface rounded-xl shadow-sm p-6 md:p-8 border border-border">
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">Dropdown Menus</h2>

            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">User Menu</h3>
                    <UserMenu
                        userName="John Smith"
                        userEmail="john@example.com"
                        onProfile={() => console.log('Profile')}
                        onSettings={() => console.log('Settings')}
                        onBilling={() => console.log('Billing')}
                        onSupport={() => console.log('Support')}
                        onSignOut={() => console.log('Sign out')}
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Actions Menu</h3>
                    <ActionsMenu
                        actions={[
                            { label: 'Edit', onSelect: () => console.log('Edit') },
                            { label: 'Duplicate', onSelect: () => console.log('Duplicate') },
                            { label: 'Archive', onSelect: () => console.log('Archive') },
                            { label: 'Delete', onSelect: () => console.log('Delete'), variant: 'danger' },
                        ]}
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Filter Menu</h3>
                    <div className="flex items-center gap-4">
                        <FilterMenu
                            selectedFilters={selectedFilters}
                            onFiltersChange={setSelectedFilters}
                            filters={[
                                { value: 'jackets', label: 'Jackets' },
                                { value: 'coats', label: 'Coats' },
                                { value: 'blazers', label: 'Blazers' },
                                { value: 'accessories', label: 'Accessories' },
                            ]}
                        />
                        {selectedFilters.length > 0 && (
                            <p className="text-sm text-text-secondary">Selected: {selectedFilters.join(', ')}</p>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Custom Dropdown</h3>
                    <CustomDropdownMenu
                        trigger={
                            <button className="px-4 py-2 bg-button-primary text-button-primary-foreground rounded-lg hover:bg-button-primary-hover transition-all font-semibold">
                                Custom Menu
                            </button>
                        }
                        items={[
                            { type: 'label', label: 'Categories' },
                            { type: 'item', label: 'All Products', onSelect: () => console.log('All') },
                            { type: 'item', label: 'New Arrivals', onSelect: () => console.log('New') },
                            { type: 'separator' },
                            { type: 'label', label: 'Sort By' },
                            {
                                type: 'radio-group',
                                value: accordionValue,
                                onValueChange: setAccordionValue,
                                items: [
                                    { value: 'newest', label: 'Newest First' },
                                    { value: 'price-low', label: 'Price: Low to High' },
                                    { value: 'price-high', label: 'Price: High to Low' },
                                ],
                            },
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};

export default function ExtraTab() {
    return (
        <div className="min-h-screen bg-background">
            <header className="bg-primary text-primary-foreground py-12 px-6 border-b border-primary-foreground/10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">Advanced Components</h1>
                    <p className="text-lg text-primary-foreground/80 font-body">
                        Modals, Accordions, and Dropdown Menus powered by Radix UI
                    </p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12 space-y-12 md:space-y-16">
                <ModalSection />
                <AccordionSection />
                <DropdownSection />
            </main>
        </div>
    );
}