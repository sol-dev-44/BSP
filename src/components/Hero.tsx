'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

export function Hero() {
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 500], [0, 150])

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
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

                {/* Overlay pattern for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

                {/* Animated floating elements */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <motion.div
                        className="absolute top-20 left-10 w-32 h-32 bg-[#D4605A] rounded-full blur-3xl"
                        animate={{
                            y: [0, 30, 0],
                            x: [0, 20, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-10 w-40 h-40 bg-[#E5A832] rounded-full blur-3xl"
                        animate={{
                            y: [0, -40, 0],
                            x: [0, -30, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                    />
                </div>

                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#3D2B1F]/50 via-transparent to-[#3D2B1F]/70" />
            </motion.div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10 mt-auto pb-12 sm:pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <motion.h1
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-[#FDF6E3] via-[#E5A832] to-[#D4605A] bg-clip-text text-transparent drop-shadow-2xl mb-6"
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        style={{ backgroundSize: '200% 200%' }}
                    >
                        Soar Above Flathead Lake
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-xl sm:text-2xl md:text-3xl text-[#FDF6E3] font-semibold mb-2 drop-shadow-lg"
                    >
                        400+ Feet Above Montana's Largest Natural Freshwater Lake
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="text-base sm:text-lg text-[#FDF6E3]/90 drop-shadow-lg"
                    >
                        Up to 10 passengers per trip
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="mt-8"
                >
                    <Link
                        href="/book"
                        className="group px-10 sm:px-12 py-5 sm:py-6 rounded-full bg-gradient-to-r from-[#D4605A] to-[#8B4513] text-white font-black text-xl sm:text-2xl shadow-2xl hover:shadow-[#D4605A]/50 transform hover:scale-110 transition-all duration-300 hover:rotate-1 inline-block"
                    >
                        <span className="flex items-center justify-center gap-2">
                            Book Your Flight
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </span>
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
