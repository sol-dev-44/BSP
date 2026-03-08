'use client'

import { motion } from 'framer-motion'
import { Shield, Anchor, Users, Waves, Gauge, CheckCircle } from 'lucide-react'

const IMAGE_BASE = 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/'

export function VesselShowcase() {
    const highlights = [
        {
            icon: Shield,
            title: 'USCG Certified',
            description: 'Inspected passenger vessel with licensed captain'
        },
        {
            icon: Users,
            title: '10-Person Capacity',
            description: 'Spacious 31-foot vessel for groups and families'
        },
        {
            icon: Anchor,
            title: 'Ocean Pro 31',
            description: 'Commercial parasail vessel with Volvo Penta diesel'
        },
        {
            icon: Waves,
            title: 'Hydraulic Winch',
            description: 'Professional-grade hydraulic winch system for smooth flights'
        },
    ]

    const specs = [
        'Cloud Dancer - Ocean Pro 31',
        "31' commercial vessel",
        'Volvo Penta diesel engine',
        'Hydraulic winch system',
        '10-person capacity',
        'Daily safety inspections',
    ]

    return (
        <div className="relative py-24 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6E3]/5 via-[#D4605A]/5 to-background" />

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <motion.div
                    className="absolute top-20 right-20 w-96 h-96 bg-[#D4605A] rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ repeat: Infinity, duration: 8 }}
                />
                <motion.div
                    className="absolute bottom-20 left-20 w-96 h-96 bg-[#E5A832] rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{ repeat: Infinity, duration: 8 }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4605A] to-[#6B4226] text-white px-6 py-2 rounded-full mb-6 shadow-lg"
                    >
                        <Anchor className="h-5 w-5" />
                        <span className="font-bold">Meet Our Vessel</span>
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-6">
                        The Cloud Dancer
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Your adventure begins aboard our Ocean Pro 31 &mdash; a USCG certified parasailing vessel
                    </p>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {highlights.map((highlight, index) => {
                        const Icon = highlight.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative"
                            >
                                <div className="relative h-full bg-[#FDF6E3]/90 dark:bg-[#2A1F17]/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-[#E5A832]/20 dark:border-[#6B4226]/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#D4605A]/50">
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4605A]/5 to-[#E5A832]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Icon */}
                                    <div className="relative mb-4">
                                        <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-[#D4605A] to-[#6B4226] shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative">
                                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#D4605A] transition-colors duration-300">
                                            {highlight.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {highlight.description}
                                        </p>
                                    </div>

                                    {/* Bottom accent */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4605A] via-[#E5A832] to-[#3B6BA5] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Boat Photo - Main */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-16"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Cloud Dancer image */}
                        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={`${IMAGE_BASE}cloudDancerInclineDock.jpg`}
                                alt="Cloud Dancer vessel docked at Flathead Harbor Marina"
                                className="w-full h-full object-cover min-h-[350px]"
                            />
                            {/* Caption overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A0F0A]/90 via-[#1A0F0A]/70 to-transparent p-6 md:p-8">
                                <div className="max-w-4xl mx-auto">
                                    <p className="text-[#FDF6E3] text-lg md:text-xl font-medium leading-relaxed">
                                        The <span className="font-bold text-[#E5A832]">Cloud Dancer</span> &mdash; our 31-foot Ocean Pro commercial parasail vessel, powered by Volvo Penta diesel with a professional hydraulic winch system.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Leroy + Specs */}
                        <div className="flex flex-col gap-6">
                            {/* Leroy image */}
                            <div className="relative rounded-2xl overflow-hidden shadow-xl flex-1">
                                <img
                                    src={`${IMAGE_BASE}leroyDock.jpg`}
                                    alt="Leroy the dog mascot at the dock"
                                    className="w-full h-full object-cover min-h-[200px]"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A0F0A]/80 to-transparent p-4">
                                    <p className="text-[#FDF6E3] font-bold text-lg">
                                        Meet <span className="text-[#E5A832]">Leroy</span>
                                    </p>
                                    <p className="text-gray-300 text-sm">Our official dock mascot</p>
                                </div>
                            </div>

                            {/* Vessel Specs */}
                            <div className="bg-[#FDF6E3]/90 dark:bg-[#2A1F17]/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#E5A832]/20 dark:border-[#6B4226]/50">
                                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Gauge className="h-5 w-5 text-[#D4605A]" />
                                    Vessel Specs
                                </h3>
                                <ul className="space-y-2">
                                    {specs.map((spec, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <CheckCircle className="h-4 w-4 text-[#3B6BA5] flex-shrink-0" />
                                            {spec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3B6BA5]/10 to-[#D4605A]/10 px-8 py-4 rounded-full border border-[#3B6BA5]/20">
                        <Shield className="h-6 w-6 text-[#3B6BA5] dark:text-[#3B6BA5]" />
                        <p className="text-lg font-bold text-foreground">
                            Safety-First Operations Since Day One
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
