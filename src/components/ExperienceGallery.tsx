'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const IMAGE_BASE = 'https://qcohcaavhwujvagmpbdp.supabase.co/storage/v1/object/public/bsp-images/'

interface GalleryImage {
    src: string
    alt: string
    category: string
    span?: 'wide' | 'tall' | 'large'
}

const images: GalleryImage[] = [
    { src: `${IMAGE_BASE}WhiteFishSmiles.jpg`, alt: 'Smiling parasailers over Flathead Lake', category: 'Happy Customers', span: 'large' },
    { src: `${IMAGE_BASE}wfdip3.JPG`, alt: 'Skimming the water for a thrilling dip', category: 'Adventures', span: 'tall' },
    { src: `${IMAGE_BASE}HighAerial.jpeg`, alt: '400 feet above Flathead Lake', category: 'Aerial Views' },
    { src: `${IMAGE_BASE}tubing.jpg`, alt: 'Tubing fun on Flathead Lake', category: 'Adventures', span: 'wide' },
    { src: `${IMAGE_BASE}wfSunset.JPG`, alt: 'Golden sunset parasailing', category: 'Scenic', span: 'tall' },
    { src: `${IMAGE_BASE}colorfulChute.jpg`, alt: 'Colorful chute against blue Montana sky', category: 'Adventures' },
    { src: `${IMAGE_BASE}threeKids.jpg`, alt: 'Three kids having the time of their lives', category: 'Family Fun', span: 'wide' },
    { src: `${IMAGE_BASE}leroyDock.jpg`, alt: 'Leroy the dock dog ready to greet you', category: 'The Boat' },
    { src: `${IMAGE_BASE}WFishHappyFar.jpg`, alt: 'Soaring high above Flathead Lake', category: 'Aerial Views', span: 'wide' },
    { src: `${IMAGE_BASE}fourthJuly.jpg`, alt: '4th of July fireworks over the lake', category: 'Events', span: 'tall' },
    { src: `${IMAGE_BASE}waitingAreaAnchorBar.jpg`, alt: 'The Anchor Bar at Flathead Harbor', category: 'The Marina' },
    { src: `${IMAGE_BASE}DaytonaImage.png`, alt: 'Our crew capturing every moment', category: 'Behind the Scenes' },
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
        <section className="py-16 sm:py-20 md:py-28 lg:py-32 bg-[#FFF0D6] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Editorial section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 sm:mb-12 md:mb-16"
                >
                    <h2 className="font-[family-name:var(--font-headline)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight uppercase text-[#2D1600]">
                        Experience the<br /><span className="text-[#FF9500]">Adventure</span>
                    </h2>
                    <p className="text-lg md:text-xl text-[#8B6914] max-w-2xl mt-4">
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
                            className={`relative group cursor-pointer rounded-xl overflow-hidden border border-[#FF9500]/10 hover:border-[#FF9500]/40 hover:shadow-[0_4px_20px_rgba(255,149,0,0.15)] transition-all duration-500 ${getGridSpan(
                                image.span
                            )}`}
                            onClick={() => setSelectedImage(index)}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            {/* Hover overlay with gradient from bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3D1C00]/80 via-[#3D1C00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
                                    <p className="text-[9px] md:text-xs font-semibold text-[#FFD700] mb-0.5 md:mb-1 uppercase tracking-wide">
                                        {image.category}
                                    </p>
                                    <p className="text-white font-bold text-[11px] leading-tight md:text-lg md:leading-normal">{image.alt}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center mt-10 sm:mt-16"
                >
                    <Link href="/gallery" className="inline-block px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg rounded-xl bg-[#FF9500] text-white font-bold hover:bg-[#E07B00] hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(255,149,0,0.3)] hover:shadow-[0_6px_30px_rgba(255,149,0,0.5)]">
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
                    className="fixed inset-0 bg-[#3D1C00]/95 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                        aria-label="Close lightbox"
                    >
                        <X className="h-6 w-6 text-white" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigateImage(-1)
                        }}
                        className="absolute left-4 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
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
                            className="max-w-full max-h-[90vh] object-contain rounded-xl"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#3D1C00]/90 to-transparent p-6 rounded-b-xl">
                            <p className="text-[#FFD700] font-semibold text-sm mb-1 uppercase">
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
                        className="absolute right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-8 w-8 text-white" />
                    </button>
                </motion.div>
            )}
        </section>
    )
}
