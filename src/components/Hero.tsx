'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

export function Hero() {
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 500], [0, 150])

    return (
        <div className="relative min-h-screen flex items-end overflow-hidden">
            {/* Hero Background Video with Parallax */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 w-full h-full"
            >
                {/* Landing page video - full width */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-[40%_center] sm:object-center"
                >
                    <source src="https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//ownBusiness.mp4" type="video/mp4" />
                    {/* Fallback image if video doesn't load */}
                    <img
                        src="https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//FlatheadWithShadow.jpg"
                        alt="Parasailing over Flathead Lake with mountain views"
                        className="absolute inset-0 w-full h-full object-cover object-[40%_center] sm:object-center"
                    />
                </video>

                {/* Gradient overlay - top transparent to bottom solid */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1e1006]/40 to-[#1e1006]" />
            </motion.div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pb-16 sm:pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-start"
                >
                    <h1
                        className="font-[family-name:var(--font-headline)] text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] text-[#fbddca] mb-6"
                    >
                        Soar Above
                        <br />
                        Flathead Lake
                    </h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-lg sm:text-xl md:text-2xl text-[#ddc0bd] max-w-2xl mb-2"
                    >
                        400+ Feet Above Montana's Largest Natural Freshwater Lake
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="text-base sm:text-lg text-[#a58b88] mb-10"
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
                        className="px-10 py-4 rounded-full bg-[#e46c65] text-white font-bold text-lg shadow-lg hover:shadow-[#e46c65]/30 hover:bg-[#ffb3ad] hover:text-[#190b03] transform hover:scale-105 transition-all duration-300 inline-block"
                    >
                        Book Your Flight
                    </Link>
                    <Link
                        href="#about"
                        className="px-10 py-4 rounded-full border border-[#fbddca]/30 bg-white/5 backdrop-blur-sm text-[#fbddca] font-bold text-lg hover:bg-white/10 hover:border-[#fbddca]/50 transform hover:scale-105 transition-all duration-300 inline-block"
                    >
                        Learn More
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
