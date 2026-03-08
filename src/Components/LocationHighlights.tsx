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
        <div className="py-24 bg-gradient-to-b from-background to-[#FDF6E3]/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4">
                        Why Flathead Lake?
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
                            className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                            {/* Background Image */}
                            <div className="relative h-[350px]">
                                <img
                                    src={highlight.image}
                                    alt={highlight.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/90 via-[#1A0F0A]/50 to-transparent" />

                                {/* Content overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-[#D4605A] to-[#6B4226] shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                                <highlight.icon className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#FDF6E3] mb-2 group-hover:text-[#E5A832] transition-colors">
                                                {highlight.title}
                                            </h3>
                                            <p className="text-gray-300 leading-relaxed">
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
                    className="text-center mt-12"
                >
                    <a
                        href="/location"
                        className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                        Learn More About Our Location
                    </a>
                </motion.div>
            </div>
        </div>
    )
}
