'use client'

import { motion } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'

const REVIEW_PLATFORMS = [
    {
        name: 'Google',
        icon: '',
        url: '',
        color: 'from-blue-500 to-blue-600',
        description: 'Leave a Google review'
    },
    {
        name: 'Yelp',
        icon: '',
        url: '',
        color: 'from-red-500 to-red-600',
        description: 'Review us on Yelp'
    },
    {
        name: 'TripAdvisor',
        icon: '',
        url: '',
        color: 'from-green-500 to-green-600',
        description: 'Share on TripAdvisor'
    }
]

export function ReviewCTA() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4605A] to-[#6B4226] text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                        <Star className="h-5 w-5 fill-current" />
                        <span className="font-bold">We Value Your Feedback</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6">
                        Loved Your{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4605A] to-[#E5A832]">
                            Experience?
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
                        Your review helps other adventurers discover the magic of parasailing over Flathead Lake!
                    </p>

                    {/* Social Proof */}
                    <div className="flex items-center justify-center gap-1 mb-12">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-8 h-8 text-[#E5A832] fill-current" />
                        ))}
                        <span className="ml-3 text-2xl font-bold text-foreground">
                            5.0
                        </span>
                        <span className="text-gray-500 ml-1">
                            (100+ reviews)
                        </span>
                    </div>
                </motion.div>

                {/* Review Platforms */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {REVIEW_PLATFORMS.map((platform, index) => (
                        <motion.a
                            key={platform.name}
                            href={platform.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="group bg-[#FDF6E3] dark:bg-[#2A1F17] rounded-2xl p-8 border border-[#E5A832]/20 dark:border-[#6B4226] hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <div className="text-5xl mb-4">{platform.icon}</div>
                            <h3 className="text-2xl font-bold mb-2">{platform.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{platform.description}</p>
                            <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${platform.color} text-white font-bold group-hover:shadow-lg transition-shadow`}>
                                <ExternalLink className="w-4 h-4" />
                                Leave Review
                            </span>
                        </motion.a>
                    ))}
                </div>

                {/* Thank You Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-500 dark:text-gray-400 text-lg"
                >
                    Thank you for choosing Big Sky Parasail -- your support means the world to us!
                </motion.p>
            </div>
        </section>
    )
}
