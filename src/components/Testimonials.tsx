'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface Testimonial {
    name: string
    location: string
    rating: number
    text: string
}

const testimonials: Testimonial[] = [
    {
        name: 'Sarah M.',
        location: 'Bozeman, MT',
        rating: 5,
        text: 'The views of the Mission Mountains from 400 feet were absolutely incredible!',
    },
    {
        name: 'Mike & Jenny T.',
        location: 'Denver, CO',
        rating: 5,
        text: 'Best thing we did on our Montana vacation. The crew was professional and fun!',
    },
    {
        name: 'David R.',
        location: 'Seattle, WA',
        rating: 5,
        text: 'Flathead Lake is gorgeous from up there. Worth every penny!',
    },
    {
        name: 'The Wilson Family',
        location: 'Missoula, MT',
        rating: 5,
        text: 'Our kids loved it! The crew made everyone feel safe and excited.',
    },
    {
        name: 'Chris B.',
        location: 'Phoenix, AZ',
        rating: 5,
        text: "We've parasailed in Florida and Hawaii - Flathead Lake beats them all for scenery.",
    },
]

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Star
                        className={`h-5 w-5 ${i < rating
                            ? 'fill-[#fbbb45] text-[#fbbb45]'
                            : 'text-[#564240]'
                            }`}
                    />
                </motion.div>
            ))}
        </div>
    )
}

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const paginate = (newDirection: number) => {
        setDirection(newDirection)
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection
            if (nextIndex < 0) nextIndex = testimonials.length - 1
            if (nextIndex >= testimonials.length) nextIndex = 0
            return nextIndex
        })
    }

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1)
        }, 7000)
        return () => clearInterval(timer)
    }, [currentIndex])

    return (
        <div className="py-28 bg-[#28180d] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-[0.03]">
                <Quote className="absolute top-20 left-10 h-64 w-64 text-[#ffb3ad]" />
                <Quote className="absolute bottom-20 right-10 h-64 w-64 text-[#fbbb45] rotate-180" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-headline)] font-black uppercase tracking-tighter text-[#fbddca] mb-4">
                        What Our Guests Say
                    </h2>
                    <p className="text-xl md:text-2xl text-[#a58b88] max-w-3xl mx-auto">
                        Don&apos;t just take our word for it. Hear from the adventurers who&apos;ve soared above Flathead Lake.
                    </p>
                </motion.div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Testimonial Cards */}
                    <div className="relative h-[400px] md:h-[350px] flex items-center justify-center">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x)

                                    if (swipe < -swipeConfidenceThreshold) {
                                        paginate(1)
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        paginate(-1)
                                    }
                                }}
                                className="absolute w-full"
                            >
                                <div className="bg-[#2c1c11] rounded-xl p-8 md:p-12 shadow-2xl">
                                    <Quote className="h-12 w-12 text-[#fbbb45] mb-6 opacity-50" />

                                    <p className="text-lg md:text-xl text-[#ddc0bd] mb-8 leading-relaxed italic">
                                        &ldquo;{testimonials[currentIndex].text}&rdquo;
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-xl text-[#fbddca]">
                                                {testimonials[currentIndex].name}
                                            </p>
                                            <p className="text-[#a58b88]">
                                                {testimonials[currentIndex].location}
                                            </p>
                                        </div>
                                        <StarRating rating={testimonials[currentIndex].rating} />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => paginate(-1)}
                            className="p-3 rounded-full bg-[#433124] shadow-lg hover:shadow-xl transition-shadow"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="h-6 w-6 text-[#fbddca]" />
                        </motion.button>

                        {/* Dots indicator */}
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > currentIndex ? 1 : -1)
                                        setCurrentIndex(index)
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'w-8 bg-[#ffb3ad]'
                                        : 'w-2 bg-[#564240]'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => paginate(1)}
                            className="p-3 rounded-full bg-[#433124] shadow-lg hover:shadow-xl transition-shadow"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="h-6 w-6 text-[#fbddca]" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    )
}
