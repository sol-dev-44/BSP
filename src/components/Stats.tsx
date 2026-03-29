'use client'

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

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

function StarRating() {
    return (
        <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-[#ff00ff] fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
            ))}
        </div>
    )
}

export function Stats() {
    const stats = [
        { value: 25000, suffix: '+', label: 'Flights Completed' },
        { value: 100, suffix: '%', label: 'Safety Record' },
        { value: 5, suffix: '.0', label: 'Star Rating', showStars: true },
        { value: 20, suffix: '+', label: 'Years Experience' },
    ]

    return (
        <div className="py-16 bg-[#111128] relative cyber-grid border-y border-[#00f0ff]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="font-[family-name:var(--font-headline)] text-sm font-black uppercase tracking-widest sm:tracking-[0.3em] text-[#5a6a8a] text-center mb-6 sm:mb-10"
                >
                    Trusted by Thousands
                </motion.p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="font-[family-name:var(--font-headline)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#00f0ff] text-glow">
                                {stat.suffix === '.0' ? (
                                    <span>
                                        <AnimatedCounter value={stat.value} suffix="" />.0
                                    </span>
                                ) : (
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                )}
                            </div>
                            {stat.showStars && <StarRating />}
                            <p className="text-sm text-[#5a6a8a] mt-2 uppercase tracking-wider font-medium">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
