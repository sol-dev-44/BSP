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
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14]/30 via-[#0a0a14]/60 to-[#0a0a14]" />
                {/* Cyberpunk color tint overlay */}
                <div className="absolute inset-0 bg-[#0a0a14]/40 mix-blend-multiply" />
            </motion.div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pb-16 sm:pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-start"
                >
                    <h1
                        className="font-[family-name:var(--font-headline)] text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-[0.9] text-[#e0f0ff] mb-6 text-shadow-hero"
                    >
                        Soar Above
                        <br />
                        <span className="text-[#00f0ff]">Flathead Lake</span>
                    </h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-lg sm:text-xl md:text-2xl text-[#b0c4de] max-w-2xl mb-2"
                    >
                        400+ Feet Above Montana's Largest Natural Freshwater Lake
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="text-base sm:text-lg text-[#5a6a8a] mb-10"
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
                        className="w-full sm:w-auto text-center px-10 py-4 rounded-full bg-[#00f0ff] text-[#050510] font-bold text-base sm:text-lg shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] hover:bg-[#00f0ff] transform hover:scale-105 transition-all duration-300 inline-block"
                    >
                        Book Your Flight
                    </Link>
                    <Link
                        href="#about"
                        className="w-full sm:w-auto text-center px-10 py-4 rounded-full border border-[#ff00ff]/40 bg-[#ff00ff]/5 backdrop-blur-sm text-[#ff00ff] font-bold text-base sm:text-lg hover:bg-[#ff00ff]/15 hover:border-[#ff00ff]/70 hover:shadow-[0_0_30px_rgba(255,0,255,0.3)] transform hover:scale-105 transition-all duration-300 inline-block"
                    >
                        Learn More
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
