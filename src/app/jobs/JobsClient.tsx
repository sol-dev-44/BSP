'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChatCTA } from '@/components/ChatCTA'
import { motion } from 'framer-motion'
import {
    Anchor,
    Clock,
    MapPin,
    Shield,
    Sun,
    Users,
    Zap,
    ChevronRight,
    Check,
    Mail,
    Calendar,
} from 'lucide-react'

const RESPONSIBILITIES = [
    { icon: Anchor, text: 'Help rig, launch, and land the parasail chute from the boat deck' },
    { icon: Shield, text: 'Fit guests with harnesses and life jackets, run safety briefings' },
    { icon: Users, text: 'Welcome guests at the dock, answer questions, and keep the energy high' },
    { icon: Zap, text: 'Operate the winch under captain direction during flights' },
    { icon: Sun, text: 'Keep the boat clean, organized, and ready between trips' },
    { icon: MapPin, text: 'Assist with docking, line handling, and marina etiquette' },
]

const PERKS = [
    'Your office is a boat on Montana\'s biggest lake',
    'Learn real maritime skills under a USCG-licensed captain',
    'Tips on top of hourly pay -- guests are generous',
    'Free parasailing flights (yes, really)',
    'Small crew, zero corporate nonsense',
    'Sunsets from the water, every single shift',
]

const QUALIFICATIONS = [
    'High energy and a genuine smile -- guests feel it',
    'Comfortable on the water (swimming ability required)',
    'Physical fitness -- you\'ll be lifting, pulling, and on your feet all day',
    'Reliable and punctual -- a 10-person boat doesn\'t wait',
    'Must be 18+ with valid ID',
    'No experience needed -- we\'ll train you on everything',
]

export default function JobsClient() {
    return (
        <main className="min-h-screen bg-[#FFF8EE] text-[#2D1600]">
            <Navbar />

            {/* Hero */}
            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF9500]/10 via-[#FFD700]/5 to-[#FFF8EE]" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF9500]/15 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FFD700]/15 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF9500] to-[#FFD700] text-[#FFFFFF] px-6 py-3 rounded-full mb-6 shadow-lg"
                    >
                        <Zap className="h-5 w-5" />
                        <span className="font-bold">Now Hiring -- Season 2026</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-6 leading-tight font-[family-name:var(--font-headline)]"
                    >
                        Parasail Crew{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9500] to-[#FFD700]">
                            Member
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-[#614020] max-w-2xl mx-auto leading-relaxed"
                    >
                        Get paid to work on a boat, launch people into the sky, and have
                        the best summer of your life on Flathead Lake.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[#8B6914] font-medium"
                    >
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Lakeside, Montana</span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> May 23 - September 30</span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Full or Part Time</span>
                    </motion.div>

                    <motion.a
                        href="mailto:bigskyparasailing@gmail.com?subject=Crew Member Application"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.55 }}
                        className="inline-flex items-center gap-2 mt-10 px-10 py-4 rounded-full bg-[#FF9500] text-[#FFFFFF] font-black text-lg shadow-xl hover:shadow-[#FF9500]/40 hover:scale-105 transition-all duration-300"
                    >
                        Apply Now <ChevronRight className="w-5 h-5" />
                    </motion.a>
                </div>
            </div>

            {/* The Job */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFF0D6]">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 font-[family-name:var(--font-headline)]">
                            What You&apos;ll{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9500] to-[#FFD700]">
                                Actually Do
                            </span>
                        </h2>
                        <p className="text-lg text-[#614020] max-w-2xl mx-auto">
                            You&apos;re part of a small crew running parasail flights on a 31-foot commercial boat.
                            Every guest gets the ride of their life -- you make that happen.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {RESPONSIBILITIES.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="bg-[#FFEACC] rounded-xl p-6 shadow-lg group hover:shadow-xl transition-shadow"
                            >
                                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-[#FF9500] to-[#FFD700] shadow-md mb-4 group-hover:shadow-lg transition-shadow">
                                    <item.icon className="h-6 w-6 text-[#FFFFFF]" />
                                </div>
                                <p className="text-[#614020] leading-relaxed">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Schedule + Qualifications + Perks */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFF8EE]">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left: Schedule + Qualifications */}
                    <div className="space-y-8">
                        {/* Schedule Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-[#FFEACC] rounded-xl p-8 shadow-xl"
                        >
                            <div className="inline-flex items-center gap-2 text-[#FF9500] font-bold mb-4">
                                <Clock className="w-5 h-5" />
                                <span>Schedule &amp; Hours</span>
                            </div>
                            <p className="text-[#614020] mb-4">
                                We operate <strong>7 days a week</strong> from May 23 through September 30.
                                Full-time and part-time schedules available -- we&apos;ll work with you.
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-[#FF9500]/10">
                                    <span className="font-bold text-[#2D1600]">Saturday &amp; Sunday</span>
                                    <span className="text-[#614020] font-mono">10:00 AM - Sunset</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-bold text-[#2D1600]">Monday - Friday</span>
                                    <span className="text-[#614020] font-mono">3:00 PM - Sunset</span>
                                </div>
                            </div>
                            <p className="text-xs text-[#8B6914] mt-4 italic">
                                Weekends and holidays are the busiest -- availability on those days is important.
                            </p>
                        </motion.div>

                        {/* Qualifications */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            <h3 className="text-3xl font-black uppercase tracking-tight mb-6 font-[family-name:var(--font-headline)]">
                                What We&apos;re{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9500] to-[#FFD700]">
                                    Looking For
                                </span>
                            </h3>
                            <ul className="space-y-4">
                                {QUALIFICATIONS.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[#614020]">
                                        <div className="w-6 h-6 rounded-full bg-[#FF9500]/10 text-[#FF9500] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right: Perks */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="space-y-6"
                    >
                        <div className="bg-[#FFEACC] rounded-xl p-8 shadow-xl">
                            <h3 className="text-2xl font-black mb-6 text-[#2D1600]">Why This Job Hits Different</h3>
                            <div className="space-y-4">
                                {PERKS.map((perk, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="text-[#FF9500] font-bold text-lg mt-0.5">&rarr;</span>
                                        <span className="text-[#614020] font-medium">{perk}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#FFEACC] rounded-xl p-8 shadow-xl">
                            <h3 className="text-xl font-black mb-4 text-[#2D1600]">The Details</h3>
                            <div className="space-y-3 text-sm text-[#614020]">
                                <div className="flex justify-between">
                                    <span className="font-bold">Position</span>
                                    <span>Parasail Crew Member</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">Type</span>
                                    <span>Full-time or Part-time</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">Season</span>
                                    <span>May 23 - Sep 30, 2026</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">Location</span>
                                    <span>Flathead Harbor Marina, Lakeside MT</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">Compensation</span>
                                    <span>Hourly + Tips</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">Experience</span>
                                    <span>None required -- will train</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Apply CTA */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFF0D6]">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#FFEACC] rounded-[2rem] p-10 md:p-14 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF9500]/15 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                        <h2 className="text-4xl font-black uppercase tracking-tight mb-4 font-[family-name:var(--font-headline)]">Sound Like You?</h2>
                        <p className="text-xl text-[#614020] mb-8 max-w-xl mx-auto leading-relaxed">
                            No formal resume needed. Just shoot us a quick email -- who you are,
                            when you&apos;re available, and why a summer on the lake sounds like your kind of thing.
                        </p>

                        <a
                            href="mailto:bigskyparasailing@gmail.com?subject=Crew Member Application"
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#FF9500] text-[#FFFFFF] font-black text-xl shadow-2xl hover:shadow-[#FF9500]/40 hover:scale-105 transition-all duration-300"
                        >
                            <Mail className="w-6 h-6" />
                            bigskyparasailing@gmail.com
                        </a>

                        <p className="mt-8 text-sm text-[#8B6914]">
                            Big Sky Parasail is an equal opportunity employer.
                        </p>
                    </motion.div>
                </div>
            </div>

            <Footer />
            <ChatCTA />
        </main>
    )
}
