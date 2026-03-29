'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    return (
        <nav
            className="fixed w-full z-50 bg-[#0a0a14]/80 backdrop-blur-xl border-b border-[#00f0ff]/10 shadow-[0_0_30px_rgba(0,240,255,0.05)] transition-all duration-300"
        >
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between h-16 sm:h-20 lg:h-28">
                    <Link href="/" className="flex items-center space-x-4">
                        <img
                            src="/bsplogo.png"
                            alt="Big Sky Parasail logo"
                            className="h-10 sm:h-14 lg:h-20 w-auto"
                        />
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-black tracking-widest font-[family-name:var(--font-headline)] text-[#e0f0ff] hover:scale-105 transition-transform duration-200 whitespace-nowrap uppercase">
                            Big Sky Parasail
                        </h1>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:block">
                        <div className="ml-8 flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`${link.cta
                                        ? 'bg-[#00f0ff] text-[#050510] px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 font-[family-name:var(--font-headline)] shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]'
                                        : `font-[family-name:var(--font-headline)] tracking-widest uppercase text-sm font-bold transition-all duration-200 px-4 py-2.5 ${isActive(link.href)
                                            ? 'text-[#00f0ff]'
                                            : 'text-[#e0f0ff] hover:text-[#ff00ff]'
                                        }`
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center space-x-4">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-[#e0f0ff] hover:text-[#ff00ff] focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-[#0a0a14]/95 backdrop-blur-xl"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`block px-3 py-2 rounded-md text-base font-[family-name:var(--font-headline)] uppercase tracking-widest font-bold ${link.cta
                                        ? 'bg-[#00f0ff] text-[#050510]'
                                        : isActive(link.href)
                                            ? 'text-[#00f0ff] bg-[#111128]'
                                            : 'text-[#e0f0ff] hover:text-[#ff00ff] hover:bg-[#111128]'
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
