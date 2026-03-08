'use client'

import { motion } from 'framer-motion'
import { Instagram, ExternalLink } from 'lucide-react'

const IMAGE_BASE = 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/'

const INSTAGRAM_POSTS = [
    {
        id: 1,
        image: `${IMAGE_BASE}wfladies2.JPG`,
        alt: 'Ladies day out parasailing over Flathead Lake',
        likes: 187,
        url: 'https://www.instagram.com/bigskyparasail/'
    },
    {
        id: 2,
        image: `${IMAGE_BASE}threeKids.jpg`,
        alt: 'Kids having the time of their lives parasailing',
        likes: 221,
        url: 'https://www.instagram.com/bigskyparasail/'
    },
    {
        id: 3,
        image: `${IMAGE_BASE}wfSunset.JPG`,
        alt: 'Golden sunset over Flathead Lake',
        likes: 203,
        url: 'https://www.instagram.com/bigskyparasail/'
    },
    {
        id: 4,
        image: `${IMAGE_BASE}leroyDock.jpg`,
        alt: 'Leroy the dog mascot at the dock',
        likes: 256,
        url: 'https://www.instagram.com/bigskyparasail/'
    },
    {
        id: 5,
        image: `${IMAGE_BASE}FlatheadWithShadow.jpg`,
        alt: 'Parasail shadow over crystal clear Flathead Lake',
        likes: 198,
        url: 'https://www.instagram.com/bigskyparasail/'
    },
    {
        id: 6,
        image: `${IMAGE_BASE}HighAerial.jpeg`,
        alt: 'High above Flathead Lake with mountain views',
        likes: 178,
        url: 'https://www.instagram.com/bigskyparasail/'
    },
    {
        id: 7,
        image: `${IMAGE_BASE}wfdip2.JPG`,
        alt: 'Splashing down for a water dip',
        likes: 192,
        url: 'https://www.instagram.com/bigskyparasail/'
    },
    {
        id: 8,
        image: `${IMAGE_BASE}fourthJuly.jpg`,
        alt: '4th of July parasailing celebration',
        likes: 167,
        url: 'https://www.instagram.com/bigskyparasail/'
    },
    {
        id: 9,
        image: `${IMAGE_BASE}tripFam.JPG`,
        alt: 'Family adventure on Flathead Lake',
        likes: 145,
        url: 'https://www.instagram.com/bigskyparasail/'
    }
]

export function InstagramFeed() {
    return (
        <div className="py-20 bg-gradient-to-b from-background to-[#FDF6E3]/10 dark:to-[#1A0F0A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                        <Instagram className="h-5 w-5" />
                        <span className="font-bold">Follow Our Adventures</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
                        See It On <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4605A] to-[#E5A832]">Instagram</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Daily adventures, customer photos, and stunning Flathead Lake views
                    </p>
                </motion.div>

                {/* Instagram Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {INSTAGRAM_POSTS.map((post, index) => (
                        <motion.a
                            key={post.id}
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            <img
                                src={post.image}
                                alt={post.alt}
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/80 via-[#1A0F0A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                                <div className="flex items-center gap-2 text-white">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <span className="font-semibold">{post.likes}</span>
                                </div>
                                <Instagram className="w-6 h-6 text-white" />
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Follow CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <a
                        href="https://www.instagram.com/bigskyparasail/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                        <Instagram className="w-6 h-6" />
                        Follow @bigskyparasail
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </motion.div>
            </div>
        </div>
    )
}
