'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import RetroStripes from './RetroStripes'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

const navLinks: { name: string; href: string; cta?: boolean }[] = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Location', href: '/location' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Chat', href: '/bsp-chat' },
    { name: 'Book Now', href: '/book', cta: true },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { theme, systemTheme } = useTheme()

    const currentTheme = theme === 'system' ? systemTheme : theme

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    return (
        <nav
            className="fixed w-full z-50 backdrop-blur-md border-b shadow-sm transition-all duration-300"
            style={{
                backgroundColor: '#3D2B1F',
                borderColor: '#6B4226'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    <Link href="/" className="flex items-center space-x-3">
                        <img
                            src="/MM-Logo-1.png"
                            alt="Big Sky Parasail logo"
                            className="h-16 w-auto"
                        />
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-[#D4605A] to-[#E5A832] bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 whitespace-nowrap">
                            Big Sky Parasail
                        </h1>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-6 flex items-center space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${link.cta
                                        ? 'bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white hover:shadow-lg shadow-[#D4605A]/50 transform hover:-translate-y-0.5'
                                        : isActive(link.href)
                                            ? 'text-[#D4605A] border-b-2 border-[#D4605A]'
                                            : 'text-[#FDF6E3] hover:text-[#E5A832]'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-[#FDF6E3] hover:text-[#E5A832] focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Retro Stripes Bottom Border */}
            <RetroStripes orientation="horizontal" className="w-full" />

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden"
                        style={{
                            backgroundColor: '#3D2B1F'
                        }}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${link.cta
                                        ? 'bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white'
                                        : isActive(link.href)
                                            ? 'text-[#D4605A] bg-[#2A1F17]'
                                            : 'text-[#FDF6E3] hover:text-[#E5A832] hover:bg-[#2A1F17]'
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
