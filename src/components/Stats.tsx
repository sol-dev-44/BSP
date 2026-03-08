'use client'

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Award, Users, Calendar, Star } from 'lucide-react'

interface StatProps {
    value: number
    label: string
    suffix?: string
    icon: React.ElementType
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, { duration: 3000 })
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    useEffect(() => {
        if (isInView) {
            motionValue.set(value)
        }
    }, [motionValue, isInView, value])

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString() + suffix
            }
        })
    }, [springValue, suffix])

    return <span ref={ref}>0{suffix}</span>
}

function StatCard({ value, label, suffix, icon: Icon }: StatProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative group h-full"
        >
            <div className="relative bg-gradient-to-br from-[#FDF6E3]/90 to-[#FDF6E3]/70 dark:from-[#2A1F17]/90 dark:to-[#1A0F0A]/70 backdrop-blur-lg p-5 rounded-2xl shadow-xl border border-[#E5A832]/20 dark:border-[#6B4226]/30 h-full">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4605A]/10 via-[#E5A832]/10 to-[#3B6BA5]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className="relative mb-3 flex justify-center">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#D4605A] to-[#6B4226] shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                </div>

                {/* Value */}
                <div className="relative text-center">
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#D4605A] via-[#E5A832] to-[#3B6BA5] bg-clip-text text-transparent mb-1 w-full break-words px-1">
                        <AnimatedCounter value={value} suffix={suffix} />
                    </div>
                    <p className="text-sm md:text-base font-semibold text-foreground/80 px-2">
                        {label}
                    </p>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#E5A832]/20 to-transparent rounded-bl-full" />
            </div>
        </motion.div>
    )
}

export function Stats() {
    const stats: StatProps[] = [
        {
            value: 25000,
            label: 'Flights Completed',
            suffix: '+',
            icon: Users,
        },
        {
            value: 20,
            label: 'Years Experience',
            suffix: '+',
            icon: Calendar,
        },
        {
            value: 5,
            label: 'Star Rating',
            suffix: '',
            icon: Star,
        },
        {
            value: 100,
            label: 'Safety Record',
            suffix: '%',
            icon: Award,
        },
    ]

    return (
        <div className="py-12 bg-gradient-to-b from-[#FDF6E3]/5 to-background relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
                <motion.div
                    className="absolute top-10 left-10 w-64 h-64 bg-[#D4605A] rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ repeat: Infinity, duration: 8 }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 w-64 h-64 bg-[#E5A832] rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{ repeat: Infinity, duration: 8 }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4">
                        Trusted by Thousands
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Montana's trusted parasailing team. Experience the difference that comes with expertise.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl mx-auto">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* USCG Certifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
                >
                    <div className="flex items-center gap-3 bg-[#FDF6E3]/90 dark:bg-[#2A1F17]/90 backdrop-blur-lg px-6 py-4 rounded-full shadow-lg border border-[#D4605A]/20">
                        <Award className="h-6 w-6 text-[#D4605A]" />
                        <span className="font-bold text-foreground">USCG Licensed Captain</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#FDF6E3]/90 dark:bg-[#2A1F17]/90 backdrop-blur-lg px-6 py-4 rounded-full shadow-lg border border-[#D4605A]/20">
                        <Award className="h-6 w-6 text-[#D4605A]" />
                        <span className="font-bold text-foreground">USCG Inspected Passenger Vessel</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
