'use client'

import { Shield, Eye, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export function Features() {
    const features = [
        {
            name: 'Safety First',
            description: 'USCG certified vessel and licensed captain with a 100% safety record. Your adventure is both thrilling and secure.',
            icon: Shield,
        },
        {
            name: 'Breathtaking Montana Views',
            description: 'Soar up to 400 feet above Flathead Lake with panoramic views of the Mission Mountains and Swan Range.',
            icon: Eye,
        },
        {
            name: 'Expert Montana Crew',
            description: 'Our professional team brings 15+ years of parasailing experience, making every moment smooth and unforgettable.',
            icon: Users,
        },
    ]

    return (
        <div className="py-24 bg-gradient-to-b from-[#FFF8EE] to-[#FFEACC]/30" id="services">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-[#2D1600] mb-6 font-[family-name:var(--font-headline)] uppercase tracking-tight">
                        Why Choose Us
                    </h2>
                    <p className="text-xl md:text-2xl text-[#614020] max-w-3xl mx-auto">
                        Experience the perfect blend of adventure and safety with Flathead Lake's premier parasailing service.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="relative group"
                        >
                            {/* Image Placeholder - Circular with gradient */}
                            <div className="flex justify-center mb-6">
                                <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-2xl group-hover:shadow-[#FF9500]/30 transition-shadow duration-300">
                                    {/* Gradient placeholder simulating feature image */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${index === 0 ? 'from-[#FF9500] via-[#FFD700] to-[#E07B00]' :
                                        index === 1 ? 'from-[#FFD700] via-[#FF9500] to-[#B8860B]' :
                                            'from-[#FF9500] via-[#FFD700] to-[#CD853F]'
                                        } opacity-80`} />

                                    {/* Overlay pattern */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_70%)]" />

                                    {/* Icon overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <feature.icon className="h-20 w-20 text-white drop-shadow-lg" aria-hidden="true" />
                                    </div>

                                    {/* Animated ring on hover */}
                                    <div className="absolute inset-0 rounded-full border-4 border-white/30 group-hover:border-white/60 transition-all duration-300 group-hover:scale-110" />
                                </div>
                            </div>

                            {/* Card content */}
                            <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:shadow-[#FF9500]/15 transition-all duration-300 border border-[#FF9500]/15">
                                {/* Gradient accent on top */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9500] via-[#FFD700] to-[#FF9500] rounded-t-2xl" />

                                <h3 className="text-2xl font-bold text-[#2D1600] text-center mb-4 group-hover:text-[#FF9500] transition-colors duration-300">
                                    {feature.name}
                                </h3>
                                <p className="text-lg text-[#614020] text-center leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Decorative bottom accent */}
                                <div className="mt-6 flex justify-center">
                                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
