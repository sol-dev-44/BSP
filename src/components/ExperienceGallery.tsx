'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const IMAGE_BASE = 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/'

interface GalleryImage {
    src: string
    alt: string
    category: string
    span?: 'wide' | 'tall' | 'large'
}

const images: GalleryImage[] = [
    {
        src: `${IMAGE_BASE}WhiteFishSmiles.jpg`,
        alt: 'Happy customers over Flathead Lake',
        category: 'Happy Customers',
        span: 'large',
    },
    {
        src: `${IMAGE_BASE}threeKids.jpg`,
        alt: 'Kids enjoying parasailing',
        category: 'Family Fun',
        span: 'tall',
    },
    {
        src: `${IMAGE_BASE}HighAerial.jpeg`,
        alt: 'Aerial view from 400 feet',
        category: 'Aerial Views',
    },
    {
        src: `${IMAGE_BASE}cloudDancerInclineDock.jpg`,
        alt: 'Cloud Dancer at the dock',
        category: 'The Boat',
        span: 'wide',
    },
    {
        src: `${IMAGE_BASE}wfSunset.JPG`,
        alt: 'Sunset over Flathead Lake',
        category: 'Scenic',
        span: 'tall',
    },
    {
        src: `${IMAGE_BASE}wfdip1.JPG`,
        alt: 'Water dip experience',
        category: 'Adventures',
    },
    {
        src: `${IMAGE_BASE}tripFam.JPG`,
        alt: 'Family parasailing adventure',
        category: 'Family Fun',
        span: 'wide',
    },
    {
        src: `${IMAGE_BASE}FlatheadAerial.jpg`,
        alt: 'Flathead Lake from above',
        category: 'Aerial Views',
    },
    {
        src: `${IMAGE_BASE}girlwake.jpeg`,
        alt: 'Flying over the wake',
        category: 'Adventures',
        span: 'wide',
    },
    {
        src: `${IMAGE_BASE}fourthJuly.jpg`,
        alt: '4th of July celebration',
        category: 'Events',
        span: 'tall',
    },
    {
        src: `${IMAGE_BASE}wildHorseIsland.jpeg`,
        alt: 'Wild Horse Island views',
        category: 'Scenic',
    },
    {
        src: `${IMAGE_BASE}alignedAerial.jpg`,
        alt: 'Aerial parasail shot',
        category: 'Aerial Views',
    },
]

export function ExperienceGallery() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null)

    const getGridSpan = (span?: string) => {
        switch (span) {
            case 'wide':
                return 'md:col-span-2'
            case 'tall':
                return 'md:row-span-2'
            case 'large':
                return 'md:col-span-2 md:row-span-2'
            default:
                return ''
        }
    }

    const navigateImage = (direction: number) => {
        if (selectedImage === null) return
        const newIndex = (selectedImage + direction + images.length) % images.length
        setSelectedImage(newIndex)
    }

    return (
        <div className="py-24 bg-gradient-to-b from-[#FDF6E3]/10 to-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4">
                        Experience the Adventure
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        See what awaits you high above Flathead Lake's pristine waters.
                    </p>
                </motion.div>

                {/* Bento Grid Gallery */}
                <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[250px] gap-3 md:gap-4">
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, zIndex: 10 }}
                            className={`relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ${getGridSpan(
                                image.span
                            )}`}
                            onClick={() => setSelectedImage(index)}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/50 via-[#1A0F0A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
                                    <p className="text-[9px] md:text-xs font-semibold text-[#E5A832] mb-0.5 md:mb-1 uppercase tracking-wide">
                                        {image.category}
                                    </p>
                                    <p className="text-[#FDF6E3] font-bold text-[11px] leading-tight md:text-lg md:leading-normal">{image.alt}</p>
                                </div>
                            </div>

                            {/* Gradient border on hover */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E5A832]/50 rounded-2xl transition-colors duration-300 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <Link href="/gallery" className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                        View Full Gallery
                    </Link>
                </motion.div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-[#1A0F0A]/95 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                        aria-label="Close lightbox"
                    >
                        <X className="h-6 w-6 text-white" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigateImage(-1)
                        }}
                        className="absolute left-4 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-8 w-8 text-white" />
                    </button>

                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="max-w-6xl max-h-[90vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[selectedImage].src}
                            alt={images[selectedImage].alt}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A0F0A]/80 to-transparent p-6 rounded-b-lg">
                            <p className="text-[#E5A832] font-semibold text-sm mb-1 uppercase">
                                {images[selectedImage].category}
                            </p>
                            <p className="text-white text-xl font-bold">
                                {images[selectedImage].alt}
                            </p>
                        </div>
                    </motion.div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigateImage(1)
                        }}
                        className="absolute right-4 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-8 w-8 text-white" />
                    </button>
                </motion.div>
            )}
        </div>
    )
}
