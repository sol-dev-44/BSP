'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChatCTA } from '@/components/ChatCTA'
import { motion } from 'framer-motion'
import {
    Anchor,
    Laptop,
    Users,
    Zap,
    Sun,
    Star,
    ChevronRight,
    Check,
    Mail,
} from 'lucide-react'

const ROLES = [
    {
        icon: Users,
        title: 'Dock Sales',
        color: 'from-[#D4605A] to-[#E5A832]',
        border: 'border-[#D4605A]/30 hover:border-[#D4605A]/60',
        what: [
            'Be the face of Big Sky Parasail at the marina',
            'Convert curious visitors into booked riders',
            'Manage the daily schedule & reservations',
            'Create 5-star experiences before the boat leaves the dock',
        ],
    },
    {
        icon: Anchor,
        title: 'Boat Crew',
        color: 'from-[#6B4226] to-[#D4605A]',
        border: 'border-[#6B4226]/30 hover:border-[#6B4226]/60',
        what: [
            'Crew aboard Cloud Dancer on Flathead Lake',
            'Assist with launches, landings & guest safety',
            'Work directly under a USCG-licensed captain',
            'Learn professional maritime operations hands-on',
        ],
    },
    {
        icon: Laptop,
        title: 'Code Intern',
        color: 'from-[#E5A832] to-[#3B6BA5]',
        border: 'border-[#E5A832]/30 hover:border-[#E5A832]/60',
        what: [
            'Shadow real software projects that run the business',
            'Learn fundamentals and ship actual features',
            'Zero experience required -- just curiosity & drive',
            'Your boss literally built this site & the booking system',
        ],
    },
]

const PERKS = [
    { icon: Sun, text: 'Best summer in Montana, on the lake every day' },
    { icon: Star, text: 'Real skills -- sales, maritime ops, and coding' },
    { icon: Zap, text: 'Fast-paced, never the same day twice' },
    { icon: Users, text: 'Small team, big impact -- your work matters' },
]

const LOOKING_FOR = [
    'Tons of energy -- this job moves fast and you love that',
    'Genuine people skills -- guests feel it immediately',
    'Physical fitness for active, hands-on boat work',
    'Curiosity & self-motivation -- no hand-holding needed',
    'Availability for weekends, holidays & peak days',
    'Comfortable around water (swimming ability preferred)',
]

export default function JobsClient() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero */}
            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4605A]/10 via-[#E5A832]/5 to-[#FDF6E3]" />

                {/* Animated blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4605A]/15 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E5A832]/15 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white px-6 py-3 rounded-full mb-6 shadow-lg"
                    >
                        <Zap className="h-5 w-5" />
                        <span className="font-bold">Dream Job Alert -- Season 2026</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Not Your Average{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4605A] to-[#E5A832]">
                            Summer Job
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto leading-relaxed"
                    >
                        Spend your summer on Flathead Lake -- soaring guests 400 feet above Montana&apos;s biggest lake,
                        closing sales, and <strong>learning to build real software</strong>. From one job.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-4 text-foreground/50 font-medium"
                    >
                        Lakeside, Montana &nbsp;&middot;&nbsp; May 1 - September 30
                    </motion.div>

                    <motion.a
                        href="mailto:bigskyparasailing@gmail.com"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.55 }}
                        className="inline-flex items-center gap-2 mt-10 px-10 py-4 rounded-full bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white font-black text-lg shadow-xl hover:shadow-[#D4605A]/40 hover:scale-105 transition-all duration-300"
                    >
                        Apply Now <ChevronRight className="w-5 h-5" />
                    </motion.a>
                </div>
            </div>

            {/* Three Roles */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[#6B4226]/5 dark:bg-[#FDF6E3]/5">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Three Roles,{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4605A] to-[#E5A832]">
                                One Season
                            </span>
                        </h2>
                        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                            Most crew members touch all three. You won&apos;t look back.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {ROLES.map((role, i) => (
                            <motion.div
                                key={role.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.12 }}
                                className={`bg-white rounded-3xl p-8 shadow-xl border-2 ${role.border} transition-all duration-300 group`}
                            >
                                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${role.color} shadow-lg mb-6 group-hover:shadow-xl transition-shadow`}>
                                    <role.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-black mb-5">{role.title}</h3>
                                <ul className="space-y-3">
                                    {role.what.map((item, j) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-[#3B6BA5]/15 text-[#3B6BA5] flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="text-foreground/70 text-sm leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Who We're Looking For + Perks */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                    {/* Who */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 text-[#D4605A] font-bold mb-4">
                            <Star className="w-5 h-5" />
                            <span>Who We&apos;re Looking For</span>
                        </div>
                        <h2 className="text-4xl font-black mb-8 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                            You figure things out --{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4605A] to-[#E5A832]">
                                then do them better.
                            </span>
                        </h2>
                        <ul className="space-y-4">
                            {LOOKING_FOR.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-foreground/80">
                                    <div className="w-6 h-6 rounded-full bg-[#D4605A]/10 text-[#D4605A] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 text-foreground/50 text-sm italic">
                            Prior sales, customer service, or maritime experience is a plus -- not required.
                        </p>
                    </motion.div>

                    {/* Perks + Walk Away With */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#E5A832]/20">
                            <h3 className="text-2xl font-black mb-6">Why This Job Hits Different</h3>
                            <div className="space-y-5">
                                {PERKS.map((perk, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#D4605A]/10 to-[#E5A832]/10 text-[#D4605A] flex-shrink-0">
                                            <perk.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-foreground/80 font-medium">{perk.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#D4605A]/10 to-[#E5A832]/10 rounded-3xl p-8 border border-[#D4605A]/20">
                            <h3 className="text-xl font-black mb-4">By End of Season You&apos;ll Have...</h3>
                            <ul className="space-y-3 text-foreground/80 text-sm">
                                {[
                                    'Logged real hours on a commercial parasail operation',
                                    'Genuine sales & guest experience skills',
                                    'Foundational coding knowledge + real project exposure',
                                    'A summer you\'ll actually remember',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-[#D4605A] font-bold mt-0.5">&rarr;</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Apply CTA */}
            <div className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-[#D4605A]/10 to-[#E5A832]/10 rounded-[2rem] p-10 md:p-14 border border-[#D4605A]/20 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4605A]/15 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                        <h2 className="text-4xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Sound Like You?</h2>
                        <p className="text-xl text-foreground/70 mb-8 max-w-xl mx-auto leading-relaxed">
                            Skip the boring cover letter. Send us a short note -- tell us who you are, why this caught your eye,
                            and why you&apos;re the right fit for a job that&apos;s anything but ordinary.
                        </p>

                        <a
                            href="mailto:bigskyparasailing@gmail.com"
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white font-black text-xl shadow-2xl hover:shadow-[#D4605A]/40 hover:scale-105 transition-all duration-300"
                        >
                            <Mail className="w-6 h-6" />
                            bigskyparasailing@gmail.com
                        </a>

                        <p className="mt-8 text-sm text-foreground/40">
                            Big Sky Parasail is an equal opportunity employer. We&apos;re looking for the best person -- full stop.
                        </p>
                    </motion.div>
                </div>
            </div>

            <Footer />
            <ChatCTA />
        </main>
    )
}
