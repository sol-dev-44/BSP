'use client'

import { motion } from 'framer-motion'
import { Droplets, Mountain, TreePine, MapPin } from 'lucide-react'

const IMAGE_BASE = 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/'

const highlights = [
    {
        icon: Droplets,
        title: 'Flathead Lake',
        description: 'Parasail above the largest natural freshwater lake west of the Mississippi. Crystal-clear waters stretching nearly 200 square miles.',
        image: `${IMAGE_BASE}FlatheadWithShadow.jpg`,
    },
    {
        icon: Mountain,
        title: 'Glacier National Park',
        description: "Just a short drive from the Crown of the Continent. Combine your parasailing adventure with a visit to one of America's most stunning national parks.",
        image: `${IMAGE_BASE}glacierPark.jpg`,
    },
    {
        icon: TreePine,
        title: 'Wild Horse Island',
        description: 'Soar above Flathead Lake and spot Wild Horse Island below -- home to bighorn sheep, wild horses, and stunning natural beauty.',
        image: `${IMAGE_BASE}wildHorse.jpg`,
    },
    {
        icon: MapPin,
        title: 'Flathead Harbor Marina',
        description: 'Launching from Lakeside, Montana. Easy to reach from Kalispell, Whitefish, Bigfork, and Polson.',
        image: `${IMAGE_BASE}FlatheadMarinaAerial.jpg`,
    },
]

export function LocationHighlights() {
    return (
        <div className="py-16 sm:py-20 md:py-28 lg:py-32 bg-[#111128] relative overflow-hidden cyber-grid">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8 sm:mb-12 md:mb-16"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-[family-name:var(--font-headline)] font-black uppercase tracking-tighter text-[#e0f0ff] mb-4">
                        Why Flathead Lake?
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#5a6a8a] max-w-3xl mx-auto">
                        The perfect combination of natural beauty and ideal conditions for parasailing.
                    </p>
                </motion.div>

                {/* Location Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {highlights.map((highlight, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            whileHover={{ y: -5 }}
                            className="group relative rounded-xl overflow-hidden border border-[#00f0ff]/10 hover:border-[#00f0ff]/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.08)] transition-all duration-500"
                        >
                            {/* Background Image */}
                            <div className="relative h-[250px] sm:h-[300px] md:h-[350px]">
                                <img
                                    src={highlight.image}
                                    alt={highlight.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/50 to-transparent" />

                                {/* Content overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="bg-[#00f0ff] text-[#001a1f] p-3 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all duration-300 group-hover:scale-110">
                                                <highlight.icon className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-[family-name:var(--font-headline)] font-black uppercase tracking-tighter text-[#e0f0ff] mb-2 group-hover:text-[#ff00ff] transition-colors">
                                                {highlight.title}
                                            </h3>
                                            <p className="text-[#b0c4de] leading-relaxed">
                                                {highlight.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-center mt-10 sm:mt-16"
                >
                    <a
                        href="/location"
                        className="inline-block bg-[#00f0ff] text-[#001a1f] rounded-full font-bold uppercase tracking-widest px-6 py-3 text-base sm:px-8 sm:text-lg shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] hover:scale-105 transition-all duration-300"
                    >
                        Learn More About Our Location
                    </a>
                </motion.div>
            </div>
        </div>
    )
}
