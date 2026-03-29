'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChatCTA } from '@/components/ChatCTA'
import { motion } from 'framer-motion'
import { Check, Camera, Video, Users, Package, Eye, Sparkles, Shield, HelpCircle, ArrowRight, Sun, Anchor, Ship, MapPin, Flame } from 'lucide-react'
import Link from 'next/link'
import { BUSINESS_INFO } from '@/config/business'

const iconMap: Record<string, any> = {
    'earlybird': Sparkles,
    'parasail': Users,
    'sunset': Sun,
    'combo': Package,
    'gopro': Video,
    'photos': Camera,
    'observer': Eye,
}

const charterIconMap: Record<string, any> = {
    'tubing': Ship,
    'wild-horse-island': MapPin,
    'fireworks': Flame,
}

const packages = BUSINESS_INFO.services.map(service => ({
    ...service,
    icon: iconMap[service.id || ''] || Users,
}))

const charters = BUSINESS_INFO.charters.map(charter => ({
    ...charter,
    icon: charterIconMap[charter.id || ''] || Anchor,
}))

export default function ServicesClient() {
    return (
        <main className="min-h-screen bg-[#0a0a14] text-[#e0f0ff]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a14] to-[#0a0a14]" />

                {/* Subtle background glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#00f0ff]/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ff00ff]/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="inline-flex items-center gap-2 bg-[#1a1a3e] text-[#ff00ff] px-6 py-3 rounded-full mb-6 border border-[#2a2a4a]/30"
                    >
                        <Sparkles className="h-5 w-5" />
                        <span className="font-bold">2026 Season Packages</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-headline)] font-black uppercase tracking-tighter text-[#e0f0ff] mb-6 leading-tight"
                    >
                        Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] to-[#ff00ff]">Adventure</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-3xl text-[#b0c4de] max-w-3xl mx-auto font-medium"
                    >
                        Whether you want to fly high, ride along, or capture the moment, we have the perfect package for you.
                    </motion.p>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="py-12 px-4 sm:px-6 lg:px-8" id="packages">
                <div className="max-w-7xl mx-auto">
                    {/* Section heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-black uppercase tracking-tighter mb-4 text-[#e0f0ff]">
                            Parasailing <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] to-[#ff00ff]">Packages</span>
                        </h2>
                        <p className="text-xl text-[#5a6a8a] max-w-2xl mx-auto">
                            From early morning calm to golden hour sunsets -- pick the flight that fits your style
                        </p>
                    </motion.div>

                    {/* First row - 3 main flight packages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        {packages.slice(0, 3).map((pkg, index) => (
                            <PackageCard key={pkg.name} pkg={pkg} index={index} />
                        ))}
                    </div>

                    {/* Second row - add-ons & extras */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {packages.slice(3).map((pkg, index) => (
                            <PackageCard key={pkg.name} pkg={pkg} index={index + 3} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Charters Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8" id="charters">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 bg-[#1a1a3e] text-[#b8ff00] px-6 py-3 rounded-full mb-6 border border-[#2a2a4a]/30">
                            <Anchor className="h-5 w-5" />
                            <span className="font-bold">Private Charters</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-black uppercase tracking-tighter mb-4 text-[#e0f0ff]">
                            Charter <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] to-[#ff00ff]">Experiences</span>
                        </h2>
                        <p className="text-xl text-[#5a6a8a] max-w-2xl mx-auto">
                            Private adventures on Flathead Lake for groups, families, and special occasions
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {charters.map((charter, index) => (
                            <CharterCard key={charter.name} charter={charter} index={index} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Safety & Info Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 text-[#00f0ff] font-bold mb-4">
                                <Shield className="w-6 h-6" />
                                <span>Safety First</span>
                            </div>
                            <h2 className="text-4xl font-[family-name:var(--font-headline)] font-black uppercase tracking-tighter mb-6 text-[#e0f0ff]">Why Fly With Us?</h2>
                            <ul className="space-y-4">
                                {[
                                    'Perfect Safety Record',
                                    'USCG Certified Captain & Crew',
                                    'Top-of-the-line Equipment',
                                    'Family Friendly Service'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg text-[#b0c4de]">
                                        <div className="w-6 h-6 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/faq" className="inline-flex items-center gap-2 mt-8 text-[#00f0ff] font-bold hover:underline group">
                                Read our FAQ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-[#111128] p-8 rounded-2xl"
                        >
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#e0f0ff]">
                                <HelpCircle className="w-6 h-6 text-[#ff00ff]" />
                                Know Before You Go
                            </h3>
                            <p className="text-[#b0c4de] mb-6">
                                Please arrive 15 minutes early -- we&apos;ll check you in at the dock. Wear comfortable clothing (swimwear recommended!). We fly from the boat, so you stay dry unless you want a dip in Flathead Lake!
                            </p>
                            <div className="bg-[#1a1a3e] p-4 rounded-xl">
                                <p className="text-sm text-[#e0f0ff] font-medium text-center">
                                    Observers ride for ${BUSINESS_INFO.pricing.observer} per person, subject to availability.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Camera Equipment Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 bg-[#1a1a3e] text-[#ff00ff] px-6 py-3 rounded-full mb-6 border border-[#2a2a4a]/30">
                            <Camera className="h-5 w-5" />
                            <span className="font-bold">Professional Equipment</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-black uppercase tracking-tighter mb-4 text-[#e0f0ff]">
                            Capture Every <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] to-[#ff00ff]">Moment</span>
                        </h2>
                        <p className="text-xl text-[#5a6a8a] max-w-2xl mx-auto">
                            We use top-of-the-line equipment to ensure your memories are crystal clear
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Photo Package Camera */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#111128] rounded-xl p-8 transition-all duration-300 group hover:-translate-y-2"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] shadow-lg group-hover:shadow-xl transition-shadow">
                                    <Camera className="h-8 w-8 text-[#050510]" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-[#00f0ff]">Photo Package</h3>
                                    <p className="text-sm text-[#5a6a8a]">Professional Stills -- ${BUSINESS_INFO.pricing.photos}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-[#00f0ff] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-lg text-[#e0f0ff]">HD crew-shot photos</p>
                                        <p className="text-sm text-[#5a6a8a]">Professional photos captured by our crew from the boat</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-[#00f0ff] flex-shrink-0 mt-0.5" />
                                    <p className="text-[#b0c4de]">Multiple angles of your flight</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-[#00f0ff] flex-shrink-0 mt-0.5" />
                                    <p className="text-[#b0c4de]">Keep the SD card</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* GoPro Package Camera */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#111128] rounded-xl p-8 transition-all duration-300 group hover:-translate-y-2"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#ff00ff] to-[#b8ff00] shadow-lg group-hover:shadow-xl transition-shadow">
                                    <Video className="h-8 w-8 text-[#050510]" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-[#ff00ff]">GoPro Package</h3>
                                    <p className="text-sm text-[#5a6a8a]">Immersive Video -- ${BUSINESS_INFO.pricing.gopro}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-[#00f0ff] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-lg text-[#e0f0ff]">GoPro aerial footage</p>
                                        <p className="text-sm text-[#5a6a8a]">Immersive video capture of your flight over Flathead Lake</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-[#00f0ff] flex-shrink-0 mt-0.5" />
                                    <p className="text-[#b0c4de]">Superior stabilization</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-[#00f0ff] flex-shrink-0 mt-0.5" />
                                    <p className="text-[#b0c4de]">Keep the SD card</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#00f0ff] rounded-3xl p-8 md:p-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff00ff]/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />

                        <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-headline)] font-black uppercase tracking-tighter text-center mb-8 text-[#050510] relative z-10">
                            Ready to Soar Above Flathead Lake?
                        </h2>
                        <p className="text-xl md:text-2xl text-center text-[#050510]/70 mb-8 leading-relaxed relative z-10">
                            Book online for instant confirmation. <span className="font-bold text-[#001a1f]">Early bird flights start at ${BUSINESS_INFO.pricing.earlyBird}!</span>
                        </p>
                        <div className="text-center relative z-10">
                            <Link
                                href="/book"
                                className="inline-block px-12 py-5 rounded-full bg-[#050510] text-[#00f0ff] font-black text-2xl uppercase shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                Book Your Flight
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
            <ChatCTA />
        </main>
    )
}

function PackageCard({ pkg, index }: { pkg: typeof packages[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col h-full relative bg-[#111128] rounded-xl shadow-xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
        >
            {/* Badge */}
            {pkg.popular && (
                <div className="absolute top-4 right-4 z-20 bg-[#ff00ff] text-[#3a2600] px-4 py-1.5 rounded-full font-bold text-xs shadow-lg uppercase tracking-wider">
                    Most Popular
                </div>
            )}
            {pkg.highlight && !pkg.popular && (
                <div className="absolute top-4 right-4 z-20 bg-[#1a1a3e] text-[#ff00ff] px-4 py-1.5 rounded-full font-bold text-xs shadow-lg uppercase tracking-wider border border-[#2a2a4a]/30">
                    {pkg.highlight}
                </div>
            )}

            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-[#050510]/30 group-hover:bg-[#050510]/10 transition-colors z-10" />
                <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Icon overlay */}
                <div className="absolute bottom-4 left-4 z-20">
                    <div className="p-3.5 rounded-2xl bg-[#111128]/90 backdrop-blur-md shadow-lg">
                        <pkg.icon className="h-6 w-6 text-[#00f0ff]" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow">
                {/* Title & Price */}
                <div className="mb-4">
                    <h3 className="text-2xl font-black text-[#e0f0ff] mb-1 leading-tight">
                        {pkg.name}
                    </h3>
                    <p className="text-[#5a6a8a] text-sm font-medium mb-2 min-h-[1.25rem]">
                        {pkg.tagline}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-[#00f0ff]">
                            ${pkg.price}
                        </span>
                        <span className="text-[#5a6a8a] font-medium">
                            {pkg.id === 'parasail' || pkg.id === 'earlybird' ? '/person' : ''}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-[#5a6a8a] text-sm leading-relaxed mb-5">
                    {pkg.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                    {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3" />
                            </div>
                            <span className="text-[#b0c4de] text-sm leading-relaxed">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto">
                    <Link
                        href="/book"
                        className="block w-full text-center px-6 py-4 rounded-full font-bold uppercase shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-[#00f0ff] text-[#001a1f]"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

function CharterCard({ charter, index }: { charter: typeof charters[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.1 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="flex flex-col h-full relative bg-[#111128] rounded-xl shadow-xl overflow-hidden group hover:-translate-y-2 transition-all duration-300"
        >
            {/* Content */}
            <div className="p-8 flex flex-col flex-grow">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#ff00ff] shadow-lg flex-shrink-0">
                        <charter.icon className="h-7 w-7 text-[#050510]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-[#e0f0ff] leading-tight">
                            {charter.name}
                        </h3>
                        <p className="text-[#b8ff00] text-sm font-medium mt-1">
                            {charter.tagline}
                        </p>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-[#2a2a4a]/30">
                    <span className="text-3xl font-black text-[#00f0ff]">
                        ${charter.price.toLocaleString()}
                    </span>
                    <span className="text-[#5a6a8a] font-medium text-sm">
                        {charter.priceUnit}
                    </span>
                </div>

                {/* Description */}
                <p className="text-[#5a6a8a] text-sm leading-relaxed mb-5">
                    {charter.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                    {charter.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3" />
                            </div>
                            <span className="text-[#b0c4de] text-sm leading-relaxed">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto">
                    <Link
                        href="/book"
                        className="block w-full text-center px-6 py-4 rounded-full font-bold uppercase shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-[#00f0ff] text-[#001a1f]"
                    >
                        Inquire Now
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
