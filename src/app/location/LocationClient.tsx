'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChatCTA } from '@/components/ChatCTA'
import { MapPin, Navigation, Anchor, Mountain, TreePine, ExternalLink, Clock, Phone, Mail, Fuel, Ship, UtensilsCrossed, Beer, Store, CheckCircle, Plane, CloudSun } from 'lucide-react'
import { motion } from 'framer-motion'
import { BUSINESS_INFO, getMapLink } from '@/config/business'
import Image from 'next/image'

const SUPABASE_BASE = 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/'

const attractions = [
    {
        title: 'Glacier National Park',
        description: 'Experience the majestic mountains, pristine forests, and alpine meadows in this crown jewel of the National Park System.',
        distance: '40 miles north',
        image: `${SUPABASE_BASE}/glacierPark.jpg`,
    },
    {
        title: 'Wild Horse Island',
        description: 'Visit the largest island on Flathead Lake, home to wild horses, bighorn sheep, and pristine hiking trails.',
        distance: 'Short boat ride from marina',
        image: `${SUPABASE_BASE}/wildHorse.jpg`,
    },
    {
        title: 'Bigfork',
        description: 'Explore this charming village known for its galleries, fine dining, and summer theater.',
        distance: '20 minutes by car',
        image: `${SUPABASE_BASE}/bigFork.jpg`,
    },
    {
        title: 'Whitefish',
        description: 'Enjoy year-round activities including hiking, mountain biking, and scenic lift rides at Whitefish Mountain Resort.',
        distance: '35 minutes by car',
        image: `${SUPABASE_BASE}/whiteFish.jpg`,
    },
]

const marinaServices = [
    { label: 'Seasonal slip rentals', icon: <Ship className="w-4 h-4" /> },
    { label: 'Boat rentals', icon: <Anchor className="w-4 h-4" /> },
    { label: 'Fuel dock', icon: <Fuel className="w-4 h-4" /> },
    { label: 'Boat tours', icon: <Navigation className="w-4 h-4" /> },
]

const marinaAmenities = [
    { label: 'Harbor Grille restaurant', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { label: 'Anchor Bar', icon: <Beer className="w-4 h-4" /> },
    { label: 'Convenience store', icon: <Store className="w-4 h-4" /> },
    { label: 'Public restrooms', icon: <CheckCircle className="w-4 h-4" /> },
]

const keyDistances = [
    { place: 'Kalispell', detail: 'Nearest major town', distance: '15 miles' },
    { place: 'Glacier Park Int\'l Airport', detail: 'FCA', distance: '30 miles' },
    { place: 'Glacier National Park', detail: 'West Entrance', distance: '40 miles' },
    { place: 'Whitefish', detail: 'Resort town', distance: '25 miles' },
]

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

export default function LocationClient() {
    return (
        <main className="min-h-screen bg-[#1e1006] text-[#fbddca] overflow-x-hidden">
            <Navbar />

            {/* Hero with Marina Aerial */}
            <div className="relative pt-24 pb-0 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={`${SUPABASE_BASE}/FlatheadMarinaAerial.jpg`}
                        alt="Aerial view of Flathead Harbor Marina"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1e1006]/70 via-[#1e1006]/50 to-[#1e1006]" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10 py-20 md:py-32 px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffb3ad] to-[#fbbb45] text-[#640c0f] px-6 py-3 rounded-full mb-6 shadow-lg"
                    >
                        <MapPin className="h-5 w-5" />
                        <span className="font-bold tracking-widest text-sm uppercase">Find Us Here</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-[family-name:var(--font-headline)] text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-[#fbddca] mb-6 drop-shadow-lg"
                    >
                        Our Location
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-[#ddc0bd] max-w-3xl mx-auto drop-shadow"
                    >
                        Experience the thrill of parasailing at the beautiful Flathead Harbor Marina
                    </motion.p>
                </div>
            </div>

            {/* Address Card + Map Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-[#2c1c11] rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left: Contact Info */}
                            <div className="p-8 md:p-10">
                                <h2 className="font-[family-name:var(--font-headline)] text-3xl font-black uppercase tracking-tighter text-[#fbddca] mb-2">
                                    Our Marina Location
                                </h2>
                                <p className="text-[#ddc0bd] mb-6">
                                    We&apos;re located at the beautiful Flathead Harbor Marina in Lakeside, Montana. Find us at Slip E4 and get ready for an unforgettable parasailing adventure!
                                </p>

                                {/* Address Block */}
                                <div className="bg-[#38261a] p-5 rounded-xl mb-6">
                                    <h3 className="text-lg font-bold text-[#ffb3ad] mb-2">Address:</h3>
                                    <p className="text-[#fbddca] font-semibold">
                                        Big Sky Parasail<br />
                                        Flathead Harbor Marina - Slip E4<br />
                                        7007 US Highway 93 S<br />
                                        Lakeside, MT 59922
                                    </p>
                                </div>

                                {/* Contact Details */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-[#ffb3ad]/10 p-2 rounded-full shrink-0">
                                            <Phone className="w-5 h-5 text-[#ffb3ad]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#fbddca]">Phone</p>
                                            <a href={`tel:${BUSINESS_INFO.phone}`} className="text-[#ffb3ad] font-bold hover:underline">
                                                {BUSINESS_INFO.displayPhone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="bg-[#ffb3ad]/10 p-2 rounded-full shrink-0">
                                            <Mail className="w-5 h-5 text-[#ffb3ad]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#fbddca]">Email</p>
                                            <a href={`mailto:${BUSINESS_INFO.email}`} className="text-[#ffb3ad] font-bold hover:underline">
                                                {BUSINESS_INFO.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="bg-[#ffb3ad]/10 p-2 rounded-full shrink-0">
                                            <Clock className="w-5 h-5 text-[#ffb3ad]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#fbddca]">Operating Hours</p>
                                            <p className="text-[#ddc0bd]">May - September: 9:00 AM - 7:00 PM</p>
                                            <p className="text-[#a58b88] text-sm">Weather permitting</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Google Maps Embed */}
                            <div className="h-[400px] lg:h-auto min-h-[350px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2113.085907832769!2d-114.2284145!3d48.0237004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5367ab5d58967335%3A0xb96203ac02aea1f4!2sFlathead%20Harbor%20Marina!5e1!3m2!1sen!2sus!4v1683225409729!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Flathead Harbor Marina Map"
                                />
                            </div>
                        </div>

                        {/* Action Buttons Bar */}
                        <div className="bg-[#38261a] p-6 flex flex-wrap justify-center gap-4">
                            <a
                                href={getMapLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-[#ffb3ad] hover:bg-[#ffb3ad]/80 text-[#640c0f] font-bold rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
                            >
                                <MapPin className="w-5 h-5" />
                                Get Directions
                            </a>
                            <a
                                href={`tel:${BUSINESS_INFO.phone}`}
                                className="px-6 py-3 bg-[#fbbb45] hover:bg-[#fbbb45]/80 text-[#640c0f] font-bold rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
                            >
                                <Phone className="w-5 h-5" />
                                Call Now
                            </a>
                            <a
                                href="https://www.flatheadharbor.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-[#564240] hover:bg-[#564240]/80 text-[#fbddca] font-bold rounded-xl transition-all inline-flex items-center gap-2"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Visit Marina Website
                            </a>
                            <a
                                href="https://weather.com/weather/today/l/912c192e9edb73daba6c77c580cc41bad61ec696c76cc2ba7247573bf7d67e38"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-[#564240] hover:bg-[#564240]/80 text-[#ffb3ad] font-bold rounded-xl transition-all inline-flex items-center gap-2"
                            >
                                <CloudSun className="w-5 h-5" />
                                Check Weather
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Getting Here Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#28180d]">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="font-[family-name:var(--font-headline)] text-4xl font-black uppercase tracking-tighter text-center text-[#fbddca] mb-12"
                    >
                        Getting Here
                    </motion.h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Driving Directions */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-[#2c1c11] p-8 rounded-xl shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-[#ffb3ad]/10 w-12 h-12 rounded-xl flex items-center justify-center">
                                    <Navigation className="w-6 h-6 text-[#ffb3ad]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#fbddca]">Driving Directions</h3>
                            </div>

                            <p className="text-[#ddc0bd] mb-6">
                                Flathead Harbor Marina is easily accessible via US Highway 93, which runs along the western shore of Flathead Lake.
                            </p>

                            <div className="space-y-4">
                                <DirectionCard
                                    from="From Kalispell"
                                    detail="Head south on US-93 S for approximately 15 miles. Flathead Harbor will be on your left in Lakeside."
                                />
                                <DirectionCard
                                    from="From Whitefish"
                                    detail="Head south on US-93 S through Kalispell, continue south for about 35 minutes total."
                                />
                                <DirectionCard
                                    from="From Glacier National Park"
                                    detail="Head southwest on US-2 W, then south on US-93 S. The marina is on the left in Lakeside."
                                />
                                <DirectionCard
                                    from="From Missoula"
                                    detail="Head north on US-93 N for approximately 2 hours. Flathead Harbor will be on your right as you enter Lakeside."
                                />
                            </div>
                        </motion.div>

                        {/* Key Distances */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-[#2c1c11] p-8 rounded-xl shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-[#fbbb45]/10 w-12 h-12 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-[#fbbb45]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#fbddca]">Key Distances</h3>
                            </div>

                            <div className="space-y-3">
                                {keyDistances.map((item) => (
                                    <div key={item.place} className="flex justify-between items-center bg-[#ffb3ad]/10 p-4 rounded-xl">
                                        <div>
                                            <p className="font-bold text-[#fbddca]">{item.place}</p>
                                            <p className="text-sm text-[#a58b88]">{item.detail}</p>
                                        </div>
                                        <div className="bg-[#ffb3ad]/10 px-4 py-1.5 rounded-full">
                                            <p className="font-bold text-[#ffb3ad] text-sm">{item.distance}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 bg-[#38261a] p-4 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Plane className="w-5 h-5 text-[#ffb3ad]" />
                                    <p className="font-bold text-[#fbddca]">Flying In?</p>
                                </div>
                                <p className="text-sm text-[#ddc0bd]">
                                    Glacier Park International Airport (FCA) is just 30 miles away in Kalispell, with service from major airlines.
                                </p>
                            </div>

                            <div className="mt-4 bg-[#fbbb45]/10 p-4 rounded-xl">
                                <p className="text-[#ddc0bd] text-sm">
                                    <span className="font-bold text-[#ffb3ad]">Pro Tip:</span> Look for the Flathead Harbor sign on Highway 93. The marina entrance is well-marked and there&apos;s plenty of free parking available. Arrive 15 minutes early to park and check in.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* About The Marina Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1e1006]">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="font-[family-name:var(--font-headline)] text-4xl font-black uppercase tracking-tighter text-center text-[#fbddca] mb-4"
                    >
                        About Flathead Harbor Marina
                    </motion.h2>
                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center text-[#ddc0bd] max-w-3xl mx-auto mb-12 text-lg"
                    >
                        Flathead Harbor Marina offers a full-service facility on the western shore of Flathead Lake with seasonal slip rentals, boat services, and easy lake access.
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Marina Services */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-[#2c1c11] p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
                        >
                            <div className="bg-[#ffb3ad]/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                                <Anchor className="w-7 h-7 text-[#ffb3ad]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#fbddca] mb-4">Marina Services</h3>
                            <ul className="space-y-3">
                                {marinaServices.map((s) => (
                                    <li key={s.label} className="flex items-center gap-3 text-[#ddc0bd]">
                                        <span className="text-[#fbbb45]">{s.icon}</span>
                                        <span>{s.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Marina Amenities */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-[#2c1c11] p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
                        >
                            <div className="bg-[#fbbb45]/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                                <UtensilsCrossed className="w-7 h-7 text-[#fbbb45]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#fbddca] mb-4">Marina Amenities</h3>
                            <ul className="space-y-3">
                                {marinaAmenities.map((a) => (
                                    <li key={a.label} className="flex items-center gap-3 text-[#ddc0bd]">
                                        <span className="text-[#fbbb45]">{a.icon}</span>
                                        <span>{a.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Why We're Here */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-[#2c1c11] p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
                        >
                            <div className="bg-[#564240]/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                                <Mountain className="w-7 h-7 text-[#f4ba96]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#fbddca] mb-4">Why We&apos;re Here</h3>
                            <p className="text-[#ddc0bd] mb-4 text-sm">
                                We chose Flathead Harbor Marina for our parasailing operation because it offers:
                            </p>
                            <ul className="space-y-3">
                                {['Easy lake access for safe takeoffs', 'Stunning mountain views', 'Great amenities for our customers', 'Central location on Flathead Lake'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-[#ddc0bd]">
                                        <CheckCircle className="w-4 h-4 text-[#ffb3ad] shrink-0" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Nearby Attractions with Images */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#28180d]">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="font-[family-name:var(--font-headline)] text-4xl font-black uppercase tracking-tighter text-center text-[#fbddca] mb-4"
                    >
                        Explore Nearby Attractions
                    </motion.h2>
                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center text-[#ddc0bd] max-w-3xl mx-auto mb-12 text-lg"
                    >
                        Flathead Lake and the surrounding area offer countless adventures beyond parasailing. Here are some must-visit attractions nearby.
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerChildren}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {attractions.map((attraction, index) => (
                            <motion.div
                                key={attraction.title}
                                variants={fadeInUp}
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.3 }}
                                className="bg-[#2c1c11] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
                            >
                                <div className="h-44 overflow-hidden relative">
                                    <Image
                                        src={attraction.image}
                                        alt={attraction.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-[#ffb3ad] text-[#640c0f] text-xs font-bold px-3 py-1 rounded-full shadow">
                                        {attraction.distance}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-[#fbddca] mb-2">{attraction.title}</h3>
                                    <p className="text-[#ddc0bd] text-sm leading-relaxed">{attraction.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Additional Attractions (no images) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
                    >
                        <div className="bg-[#2c1c11] p-5 rounded-xl shadow flex items-center gap-4">
                            <div className="bg-[#fbbb45]/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                                <MapPin className="w-6 h-6 text-[#fbbb45]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#fbddca]">Kalispell</h4>
                                <p className="text-sm text-[#a58b88]">15 miles -- Shopping, dining, and gateway to Glacier</p>
                            </div>
                        </div>
                        <div className="bg-[#2c1c11] p-5 rounded-xl shadow flex items-center gap-4">
                            <div className="bg-[#ffb3ad]/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                                <Plane className="w-6 h-6 text-[#ffb3ad]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#fbddca]">Glacier Park Int&apos;l Airport</h4>
                                <p className="text-sm text-[#a58b88]">30 miles -- Major airline service (FCA)</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#ffb3ad]">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerChildren}
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="font-[family-name:var(--font-headline)] text-4xl font-black uppercase tracking-tighter mb-6 text-[#640c0f]"
                        >
                            Ready to Soar Above Flathead Lake?
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-lg mb-8 text-[#640c0f]/80 max-w-2xl mx-auto"
                        >
                            Make parasailing the highlight of your Flathead Lake vacation! Contact us today to book your adventure at Flathead Harbor Marina.
                        </motion.p>
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-wrap justify-center gap-4"
                        >
                            <a
                                href={`tel:${BUSINESS_INFO.phone}`}
                                className="px-8 py-4 bg-[#640c0f] text-[#ffb3ad] hover:bg-[#640c0f]/80 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                            >
                                <Phone className="w-5 h-5" />
                                {BUSINESS_INFO.displayPhone}
                            </a>
                            <a
                                href={`mailto:${BUSINESS_INFO.email}`}
                                className="px-8 py-4 bg-[#190b03] hover:bg-[#190b03]/80 text-[#fbddca] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                            >
                                <Mail className="w-5 h-5" />
                                Send Email
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer />
            <ChatCTA />
        </main>
    )
}

function DirectionCard({ from, detail }: { from: string; detail: string }) {
    return (
        <div className="bg-[#38261a] p-4 rounded-xl">
            <p className="font-bold text-[#ffb3ad] mb-1">{from}</p>
            <p className="text-sm text-[#ddc0bd]">{detail}</p>
        </div>
    )
}
