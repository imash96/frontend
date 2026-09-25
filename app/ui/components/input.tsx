'use client';

import { useState } from 'react';
import CustomCheckbox, { CheckboxGroup } from '@/ui/custom/custom-checkbox';
import CustomRadio, { RadioGroup } from '@/ui/custom/custom-radio';
import CustomSelect from '@/ui/custom/custom-select';
import CustomInput from '@/ui/input';

export default function InputTab() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        country: '',
        size: '',
        shippingMethod: 'standard',
        notifications: [] as string[],
        agreeTerms: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        const newErrors: Record<string, string> = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.country) newErrors.country = 'Please select a country';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Form submitted:', formData);
            alert('Form submitted successfully! Check console for data.');
        }
    };

    const countryOptions = [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
        { value: 'au', label: 'Australia' },
        { value: 'de', label: 'Germany' },
        { value: 'fr', label: 'France' },
        { value: 'it', label: 'Italy' },
        { value: 'es', label: 'Spain' },
        { value: 'jp', label: 'Japan' },
    ];

    const sizeOptions = [
        { value: 'xs', label: 'Extra Small (XS)' },
        { value: 's', label: 'Small (S)' },
        { value: 'm', label: 'Medium (M)' },
        { value: 'l', label: 'Large (L)' },
        { value: 'xl', label: 'Extra Large (XL)' },
        { value: 'xxl', label: 'XXL' },
    ];

    return (
        <div className="min-h-screen bg-leather-50">
            {/* Header */}
            <header className="bg-leather-900 text-leather-50 py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <h1
                        className="text-4xl md:text-5xl font-display font-bold mb-3"
                    >
                        Premium Form Components
                    </h1>
                    <p
                        className="text-lg text-leather-200 font-body"
                    >
                        A custom form component system for luxury eCommerce
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                <form onSubmit={handleSubmit} className="space-y-16">

                    {/* Section 1: Text Inputs */}
                    <section className="bg-white rounded-xl shadow-md p-8">
                        <h2
                            className="text-2xl font-display font-bold text-leather-900 mb-6"
                        >
                            Text Inputs
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                error={errors.firstName}
                                fullWidth
                            />

                            <CustomInput
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                fullWidth
                            />

                            <CustomInput
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={errors.email}
                                helperText="We'll never share your email"
                                fullWidth
                            />

                            <CustomInput
                                label="Phone Number"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                helperText="Optional - for order updates"
                                fullWidth
                            />

                            <CustomInput
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                error={errors.password}
                                helperText="Must be at least 8 characters"
                                fullWidth
                            />

                            <CustomInput
                                label="Disabled Input"
                                disabled
                                fullWidth
                            />
                        </div>

                        {/* Input Sizes Demo */}
                        <div className="mt-8">
                            <h3 className="text-lg font-display font-semibold text-leather-900 mb-4">
                                Input Sizes
                            </h3>
                            <div className="space-y-4">
                                <CustomInput
                                    label="Input default"
                                    variant='default'
                                    fullWidth
                                />
                                <CustomInput
                                    label="Input filled"
                                    variant='filled'
                                    fullWidth
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Select Dropdowns */}
                    <section className="bg-white rounded-xl shadow-md p-8">
                        <h2
                            className="text-2xl font-display font-bold text-leather-900 mb-6"
                        >
                            Select Dropdowns
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomSelect
                                label="Shipping Country"
                                options={countryOptions}
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                error={errors.country}
                                fullWidth
                            />

                            <CustomSelect
                                label="Size"
                                options={sizeOptions}
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                helperText="Check our size guide for accurate measurements"
                                fullWidth
                            />

                            <CustomSelect
                                label="Disabled Select"
                                options={[]}
                                disabled
                                fullWidth
                            />
                        </div>

                        {/* Select Sizes Demo */}
                        <div className="mt-8">
                            <h3 className="text-lg font-display font-semibold text-leather-900 mb-4">
                                Select Sizes
                            </h3>
                            <div className="space-y-4">
                                <CustomSelect
                                    label="Small Select"
                                    selectSize="sm"
                                    options={[
                                        { value: '1', label: 'Option 1' },
                                        { value: '2', label: 'Option 2' },
                                    ]}
                                    fullWidth
                                />
                                <CustomSelect
                                    label="Medium Select (Default)"
                                    selectSize="md"
                                    options={[
                                        { value: '1', label: 'Option 1' },
                                        { value: '2', label: 'Option 2' },
                                    ]}
                                    fullWidth
                                />
                                <CustomSelect
                                    label="Large Select"
                                    selectSize="lg"
                                    options={[
                                        { value: '1', label: 'Option 1' },
                                        { value: '2', label: 'Option 2' },
                                    ]}
                                    fullWidth
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Radio Buttons */}
                    <section className="bg-white rounded-xl shadow-md p-8">
                        <h2
                            className="text-2xl font-display font-bold text-leather-900 mb-6"
                        >
                            Radio Buttons
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-base font-body font-semibold text-leather-900 mb-4">
                                    Shipping Method
                                </h3>
                                <RadioGroup
                                    name="shipping"
                                    value={formData.shippingMethod}
                                    onChange={(value) => setFormData({ ...formData, shippingMethod: value })}
                                >
                                    <CustomRadio
                                        value="standard"
                                        label="Standard Shipping"
                                        description="Delivery in 5-7 business days • Free"
                                    />
                                    <CustomRadio
                                        value="express"
                                        label="Express Shipping"
                                        description="Delivery in 2-3 business days • $15.00"
                                    />
                                    <CustomRadio
                                        value="overnight"
                                        label="Overnight Shipping"
                                        description="Next day delivery • $35.00"
                                    />
                                    <CustomRadio
                                        value="disabled"
                                        label="International (Currently Unavailable)"
                                        description="Estimated 10-14 business days"
                                        disabled
                                    />
                                </RadioGroup>
                            </div>

                            {/* Radio Sizes */}
                            <div>
                                <h3 className="text-base font-body font-semibold text-leather-900 mb-4">
                                    Radio Sizes
                                </h3>
                                <div className="space-y-4">
                                    <CustomRadio
                                        name="size-demo"
                                        value="small"
                                        label="Small Radio"
                                        radioSize="sm"
                                    />
                                    <CustomRadio
                                        name="size-demo"
                                        value="medium"
                                        label="Medium Radio (Default)"
                                        radioSize="md"
                                    />
                                    <CustomRadio
                                        name="size-demo"
                                        value="large"
                                        label="Large Radio"
                                        radioSize="lg"
                                    />
                                </div>
                            </div>

                            {/* Horizontal Layout */}
                            <div>
                                <h3 className="text-base font-body font-semibold text-leather-900 mb-4">
                                    Horizontal Layout
                                </h3>
                                <RadioGroup
                                    name="color"
                                    layout="horizontal"
                                >
                                    <CustomRadio value="black" label="Black" />
                                    <CustomRadio value="brown" label="Brown" />
                                    <CustomRadio value="tan" label="Tan" />
                                </RadioGroup>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Checkboxes */}
                    <section className="bg-white rounded-xl shadow-md p-8">
                        <h2
                            className="text-2xl font-display font-bold text-leather-900 mb-6"
                        >
                            Checkboxes
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-base font-body font-semibold text-leather-900 mb-4">
                                    Notification Preferences
                                </h3>
                                <CheckboxGroup
                                    value={formData.notifications}
                                    onChange={(value) => setFormData({ ...formData, notifications: value })}
                                >
                                    <CustomCheckbox
                                        value="email"
                                        label="Email Notifications"
                                        description="Receive updates about your orders via email"
                                    />
                                    <CustomCheckbox
                                        value="sms"
                                        label="SMS Notifications"
                                        description="Get text messages for order status updates"
                                    />
                                    <CustomCheckbox
                                        value="push"
                                        label="Push Notifications"
                                        description="Browser notifications for special offers"
                                    />
                                    <CustomCheckbox
                                        value="disabled"
                                        label="Newsletter (Coming Soon)"
                                        description="Weekly updates about new products"
                                        disabled
                                    />
                                </CheckboxGroup>
                            </div>

                            {/* Single Checkbox */}
                            <div>
                                <CustomCheckbox
                                    checked={formData.agreeTerms}
                                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                    label="I agree to the Terms and Conditions"
                                    description="By checking this box, you agree to our terms of service and privacy policy"
                                />
                            </div>

                            {/* Checkbox Sizes */}
                            <div>
                                <h3 className="text-base font-body font-semibold text-leather-900 mb-4">
                                    Checkbox Sizes
                                </h3>
                                <div className="space-y-4">
                                    <CustomCheckbox
                                        value="small"
                                        label="Small Checkbox"
                                        checkboxSize="sm"
                                    />
                                    <CustomCheckbox
                                        value="medium"
                                        label="Medium Checkbox (Default)"
                                        checkboxSize="md"
                                    />
                                    <CustomCheckbox
                                        value="large"
                                        label="Large Checkbox"
                                        checkboxSize="lg"
                                    />
                                </div>
                            </div>

                            {/* Indeterminate State */}
                            <div>
                                <h3 className="text-base font-body font-semibold text-leather-900 mb-4">
                                    Indeterminate State
                                </h3>
                                <CustomCheckbox
                                    value="indeterminate"
                                    label="Select All (Partial Selection)"
                                    description="Some items are selected"
                                    indeterminate
                                />
                            </div>

                            {/* Horizontal Layout */}
                            <div>
                                <h3 className="text-base font-body font-semibold text-leather-900 mb-4">
                                    Horizontal Layout
                                </h3>
                                <CheckboxGroup layout="horizontal">
                                    <CustomCheckbox value="mon" label="Monday" />
                                    <CustomCheckbox value="wed" label="Wednesday" />
                                    <CustomCheckbox value="fri" label="Friday" />
                                </CheckboxGroup>
                            </div>
                        </div>
                    </section>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className={`px-8 py-3.5 bg-gold-600 text-white font-body font-semibold text-base rounded-lg transition-all hover:bg-gold-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gold-500/30 active:scale-95`}
                        >
                            Submit Order
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}