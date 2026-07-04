'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function Hero() {
    const [hasScrolled, setHasScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setHasScrolled(window.scrollY > 80)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div className="relative min-h-screen flex items-end overflow-hidden">
            {/* Hero Background Video (parallax removed — caused mobile scroll flicker) */}
            <div className="absolute inset-0 w-full h-full">
                {/* Landing page video - full width */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-x-0 w-full object-cover -top-[350px] h-[calc(100%+350px)] sm:inset-0 sm:h-full"
                >
                    <source src="https://qcohcaavhwujvagmpbdp.supabase.co/storage/v1/object/public/bsp-images//ownBusiness.mp4" type="video/mp4" />
                    {/* Fallback image if video doesn't load */}
                    <img
                        src="https://qcohcaavhwujvagmpbdp.supabase.co/storage/v1/object/public/bsp-images//FlatheadWithShadow.jpg"
                        alt="Parasailing over Flathead Lake with mountain views"
                        className="absolute inset-x-0 w-full object-cover -top-[350px] h-[calc(100%+350px)] sm:inset-0 sm:h-full"
                    />
                </video>

                {/* Gradient overlay - warm fade to cream */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#3D1C00]/30 via-[#3D1C00]/60 to-[#FFF8EE]" />
                {/* Warm color tint overlay — mix-blend gated to desktop to avoid expensive mobile repaints */}
                <div className="absolute inset-0 bg-[#FF9500]/15 md:mix-blend-multiply" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pb-16 sm:pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-start"
                >
                    <h1
                        className="font-[family-name:var(--font-headline)] text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight leading-[0.9] text-white mb-6 text-shadow-hero"
                    >
                        Soar Above
                        <br />
                        <span className="text-[#FFD700]">Flathead Lake</span>
                    </h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mb-2"
                    >
                        400+ Feet Above Montana's Largest Natural Freshwater Lake
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="text-base sm:text-lg text-white/60 mb-10"
                    >
                        Up to 10 passengers per trip
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="flex flex-col sm:flex-row items-start gap-4"
                >
                    <Link
                        href="/book"
                        className="w-full sm:w-auto text-center px-10 py-4 rounded-full bg-[#FF9500] text-white font-bold text-base sm:text-lg shadow-[0_4px_20px_rgba(255,149,0,0.4)] hover:shadow-[0_6px_30px_rgba(255,149,0,0.6)] hover:bg-[#FFa520] transform hover:scale-105 transition-all duration-300 inline-block"
                    >
                        Book Your Flight
                    </Link>
                    <Link
                        href="#about"
                        className="w-full sm:w-auto text-center px-10 py-4 rounded-full border-2 border-[#FFD700]/60 bg-[#FFD700]/10 backdrop-blur-sm text-[#FFD700] font-bold text-base sm:text-lg hover:bg-[#FFD700]/25 hover:border-[#FFD700] hover:shadow-[0_4px_20px_rgba(255,215,0,0.3)] transform hover:scale-105 transition-all duration-300 inline-block"
                    >
                        Learn More
                    </Link>
                </motion.div>
            </div>

            {/* Scroll cue */}
            <motion.button
                type="button"
                aria-label="Scroll to explore"
                onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
                initial={{ opacity: 0 }}
                animate={{ opacity: hasScrolled ? 0 : 1 }}
                transition={{ duration: 0.4, delay: hasScrolled ? 0 : 1.6 }}
                className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden sm:block text-white/70 hover:text-white transition-colors ${hasScrolled ? 'pointer-events-none' : ''}`}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <ChevronDown className="w-8 h-8" />
                </motion.div>
            </motion.button>
        </div>
    )
}
