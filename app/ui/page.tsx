/**
 * Interactive Design System Showcase - Premium Leather Brand
 * 
 * A comprehensive, interactive demonstration of all color tokens, components,
 * and states with live hover, active, and focus demonstrations.
 */

"use client";

import { useState } from 'react';
import { LightbulbOff, Lightbulb, Menu } from 'lucide-react';
import ColorTab from './components/color';
import { Tabs } from './components/common';
import ComponentTab from './components/component';
import EcommerceTab from './components/ecommerce';
import FontTab from './components/font';
import InputTab from './components/input';
import ButtonTab from './components/button';
import ExtraTab from './components/extra';
import DrawerTab from './components/drawer';
import PaginationTab from './components/pagination';
import CustomTab from './components/custom';
import Container from '@/ui/container';

export default function InteractiveTestPage() {
    const [activeTab, setActiveTab] = useState<Tabs>('colors');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    return (
        <main className="bg-background min-h-screen">
            {/* Sticky Navigation */}
            <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border shadow-sm">
                <Container>
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-text-primary hover:bg-muted rounded-md transition-colors"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex gap-2">
                            <NavButton activeTab={activeTab} currentTab='colors' onClick={() => setActiveTab('colors')} name='Colors' />
                            <NavButton activeTab={activeTab} currentTab='components' onClick={() => setActiveTab('components')} name='Components' />
                            <NavButton activeTab={activeTab} currentTab='ecommerce' onClick={() => setActiveTab('ecommerce')} name='E-Commerce' />
                            <NavButton activeTab={activeTab} currentTab='fonts' onClick={() => setActiveTab('fonts')} name='Fonts' />
                            <NavButton activeTab={activeTab} currentTab='button' onClick={() => setActiveTab('button')} name='Button' />
                            <NavButton activeTab={activeTab} currentTab='input' onClick={() => setActiveTab('input')} name='Input' />
                            <NavButton activeTab={activeTab} currentTab='extra' onClick={() => setActiveTab('extra')} name='Extra' />
                            <NavButton activeTab={activeTab} currentTab='drawer' onClick={() => setActiveTab('drawer')} name='Drawer' />
                            <NavButton activeTab={activeTab} currentTab='pagination' onClick={() => setActiveTab('pagination')} name='Pagination' />
                            <NavButton activeTab={activeTab} currentTab='custom' onClick={() => setActiveTab('custom')} name='Custom' />
                        </div>
                        <button onClick={() => {
                            setTheme((prevTheme) => {
                                const toggleTheme = prevTheme === "light" ? "dark" : "light"
                                document.documentElement.dataset.theme = toggleTheme;
                                return toggleTheme
                            });
                        }} className='rounded-md border p-2 border-border hover:text-accent-foreground hover:bg-accent transition-colors'>
                            {theme === "light" ? (
                                <LightbulbOff className="h-5 w-5" />
                            ) : (
                                <Lightbulb className="h-5 w-5" />
                            )}
                            <span className="sr-only">Theme Toggle</span>
                        </button>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
                            <TabButton activeTab={activeTab} currentTab='colors' onClick={() => { setActiveTab('colors'); setMobileMenuOpen(false); }} name='Colors' />
                            <TabButton activeTab={activeTab} currentTab='components' onClick={() => { setActiveTab('components'); setMobileMenuOpen(false); }} name='Components' />
                            <TabButton activeTab={activeTab} currentTab='ecommerce' onClick={() => { setActiveTab('ecommerce'); setMobileMenuOpen(false); }} name='E-Commerce' />
                            <TabButton activeTab={activeTab} currentTab='fonts' onClick={() => { setActiveTab('fonts'); setMobileMenuOpen(false); }} name='Fonts' />
                            <TabButton activeTab={activeTab} currentTab='button' onClick={() => { setActiveTab('button'); setMobileMenuOpen(false); }} name='Button' />
                            <TabButton activeTab={activeTab} currentTab='input' onClick={() => { setActiveTab('input'); setMobileMenuOpen(false); }} name='Input' />
                            <TabButton activeTab={activeTab} currentTab='extra' onClick={() => { setActiveTab('extra'); setMobileMenuOpen(false); }} name='Extra' />
                            <TabButton activeTab={activeTab} currentTab='drawer' onClick={() => { setActiveTab('drawer'); setMobileMenuOpen(false); }} name='Drawer' />
                            <TabButton activeTab={activeTab} currentTab='pagination' onClick={() => { setActiveTab('pagination'); setMobileMenuOpen(false); }} name='Pagination' />
                            <TabButton activeTab={activeTab} currentTab='custom' onClick={() => { setActiveTab('custom'); setMobileMenuOpen(false); }} name='Custom' />
                        </div>
                    )}
                </Container>
            </nav>
            <Container as='section' className="py-8 sm:py-12 md:py-16 space-y-12 sm:space-y-14 md:space-y-16">
                {/* Header */}
                <header className="text-center space-y-3 sm:space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary px-4">
                        Interactive Design System
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto px-4">
                        Explore all colors, components, and interactive states. Hover, click, and interact with elements to see them in action.
                    </p>
                </header>

                {/* Color Palette Tab */}
                {activeTab === 'colors' && (<ColorTab />)}

                {/* Components Tab */}
                {activeTab === 'components' && (<ComponentTab />)}

                {/* E-Commerce Components Tab */}
                {activeTab === 'ecommerce' && (<EcommerceTab />)}

                {/* Fonts Tab Component - Typography Showcase */}
                {activeTab === 'fonts' && (<FontTab />)}

                {/* Input Tab */}
                {activeTab === 'input' && (<InputTab />)}

                {/* Input Tab */}
                {activeTab === 'button' && (<ButtonTab />)}

                {/* Extra Tab */}
                {activeTab === 'extra' && (<ExtraTab />)}

                {/* Drawer Tab */}
                {activeTab === 'drawer' && (<DrawerTab />)}

                {/* Drawer Tab */}
                {activeTab === 'pagination' && (<PaginationTab />)}

                {/* Drawer Tab */}
                {activeTab === 'custom' && (<CustomTab />)}
            </Container>
        </main>
    )

}

type TabButtonProps = {
    activeTab: Tabs,
    currentTab: Tabs,
    name: string,
} & React.ButtonHTMLAttributes<HTMLButtonElement>

function TabButton({ activeTab, currentTab, name, className = '', ...props }: TabButtonProps) {
    return (
        <button className={`w-full px-4 py-3 rounded-md font-medium transition-all text-left ${activeTab === currentTab ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:text-text-primary hover:bg-muted'} ${className}`} {...props}>
            {name}
        </button>
    )
}

function NavButton({ activeTab, currentTab, name, className = '', ...props }: TabButtonProps) {
    return (
        <button
            className={`px-4 py-2 rounded-md font-medium transition-all text-sm lg:text-base ${activeTab === currentTab ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:text-text-primary hover:bg-muted'} ${className}`} {...props}
        >
            {name}
        </button>
    )
}