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
        <section className="relative py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden bg-[#1e1006]">
            {/* Subtle ambient glow */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                <motion.div
                    className="absolute top-20 right-20 w-96 h-96 bg-[#ffb3ad] rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ repeat: Infinity, duration: 8 }}
                />
                <motion.div
                    className="absolute bottom-20 left-20 w-96 h-96 bg-[#fbbb45] rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{ repeat: Infinity, duration: 8 }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Editorial Header: title left, label right */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 sm:mb-12 md:mb-16"
                >
                    <div>
                        <h2 className="font-[family-name:var(--font-headline)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter uppercase text-[#fbddca]">
                            The Cloud Dancer
                        </h2>
                        <p className="text-lg md:text-xl text-[#a58b88] max-w-2xl mt-4">
                            Your adventure begins aboard our Ocean Pro 31 &mdash; a USCG certified parasailing vessel
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[#f4ba96] shrink-0">
                        <Anchor className="h-5 w-5" />
                        <span className="font-[family-name:var(--font-headline)] text-sm font-bold uppercase tracking-wider">Meet Our Vessel</span>
                    </div>
                </motion.div>

                {/* Bento Grid: main image spanning 2 cols, feature cards alongside */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Cloud Dancer image - spans 2 cols */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2 lg:row-span-2 group relative rounded-xl overflow-hidden"
                    >
                        <img
                            src={`${IMAGE_BASE}cloudDancerInclineDock.jpg`}
                            alt="Cloud Dancer vessel docked at Flathead Harbor Marina"
                            className="w-full h-full object-cover min-h-[250px] sm:min-h-[300px] md:min-h-[400px] group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Text overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#190b03]/90 via-[#190b03]/60 to-transparent p-6 md:p-8">
                            <p className="text-[#fbddca] text-lg md:text-xl font-medium leading-relaxed">
                                The <span className="font-bold text-[#fbbb45]">Cloud Dancer</span> &mdash; our 31-foot Ocean Pro commercial parasail vessel, powered by Volvo Penta diesel with a professional hydraulic winch system.
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature highlight cards in right column */}
                    {highlights.slice(0, 2).map((highlight, index) => {
                        const Icon = highlight.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                                className="bg-[#433124] rounded-xl p-5 sm:p-6 md:p-8"
                            >
                                <div className="mb-4">
                                    <Icon className="h-8 w-8 text-[#ffb3ad]" />
                                </div>
                                <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold text-[#fbddca] mb-2 uppercase tracking-tight">
                                    {highlight.title}
                                </h3>
                                <p className="text-[#a58b88] leading-relaxed">
                                    {highlight.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Second row: remaining feature cards + Leroy + specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {/* Remaining 2 highlight cards */}
                    {highlights.slice(2).map((highlight, index) => {
                        const Icon = highlight.icon
                        return (
                            <motion.div
                                key={index + 2}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                className="bg-[#433124] rounded-xl p-5 sm:p-6 md:p-8"
                            >
                                <div className="mb-4">
                                    <Icon className="h-8 w-8 text-[#fbbb45]" />
                                </div>
                                <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold text-[#fbddca] mb-2 uppercase tracking-tight">
                                    {highlight.title}
                                </h3>
                                <p className="text-[#a58b88] leading-relaxed">
                                    {highlight.description}
                                </p>
                            </motion.div>
                        )
                    })}

                    {/* Leroy image card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="group relative rounded-xl overflow-hidden"
                    >
                        <img
                            src={`${IMAGE_BASE}leroyDock.jpg`}
                            alt="Leroy the dog mascot at the dock"
                            className="w-full h-full object-cover min-h-[250px] group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#190b03]/90 to-transparent p-4">
                            <p className="text-[#fbddca] font-bold text-lg">
                                Meet <span className="text-[#fbbb45]">Leroy</span>
                            </p>
                            <p className="text-[#ddc0bd] text-sm">Our official dock mascot</p>
                        </div>
                    </motion.div>

                    {/* Vessel Specs card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-[#433124] rounded-xl p-5 sm:p-6 md:p-8"
                    >
                        <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold text-[#fbddca] mb-4 flex items-center gap-2 uppercase tracking-tight">
                            <Gauge className="h-5 w-5 text-[#ffb3ad]" />
                            Vessel Specs
                        </h3>
                        <ul className="space-y-2">
                            {specs.map((spec, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-[#ddc0bd]">
                                    <CheckCircle className="h-4 w-4 text-[#f4ba96] flex-shrink-0" />
                                    {spec}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom safety badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-10 sm:mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-3 bg-[#433124] px-4 py-3 sm:px-6 sm:py-4 md:px-8 rounded-xl">
                        <Shield className="h-6 w-6 text-[#f4ba96]" />
                        <p className="text-sm sm:text-base md:text-lg font-bold text-[#fbddca]">
                            Safety-First Operations Since Day One
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
