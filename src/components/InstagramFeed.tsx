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
        <div className="py-16 sm:py-20 md:py-28 bg-[#0a0a14]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8 sm:mb-12 md:mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-[#1e1e45] text-[#00f0ff] px-4 py-2 mb-4 sm:px-6 sm:py-3 sm:mb-6 rounded-full border border-[#00f0ff]/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                        <Instagram className="h-5 w-5" />
                        <span className="font-bold uppercase tracking-widest text-sm">Follow Our Adventures</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-[family-name:var(--font-headline)] font-black uppercase tracking-tighter text-[#e0f0ff] mb-6">
                        See It On Instagram
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#5a6a8a] max-w-3xl mx-auto">
                        Daily adventures, customer photos, and stunning Flathead Lake views
                    </p>
                </motion.div>

                {/* Instagram Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 sm:mb-12">
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
                            className="group relative aspect-square rounded-xl overflow-hidden border border-[#ff00ff]/5 hover:border-[#ff00ff]/30 hover:shadow-[0_0_15px_rgba(255,0,255,0.1)] transition-all duration-500"
                        >
                            <img
                                src={post.image}
                                alt={post.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-[#050510]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="flex items-center gap-2 text-white">
                                    <svg className="w-6 h-6 fill-[#00f0ff]" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <span className="font-semibold text-[#e0f0ff] text-lg">{post.likes}</span>
                                </div>
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
                        className="inline-flex items-center gap-3 bg-[#00f0ff] text-[#001a1f] rounded-full font-bold uppercase tracking-widest px-6 py-3 text-sm sm:px-8 sm:text-base md:text-lg shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] hover:scale-105 transition-all duration-300"
                    >
                        <Instagram className="w-5 h-5" />
                        Follow @bigskyparasail
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        </div>
    )
}
