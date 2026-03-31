'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChatCTA } from '@/components/ChatCTA'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Camera, Sparkles, Play } from 'lucide-react'

interface GalleryImage {
    src: string
    webmSrc?: string
    alt: string
    category: string
    orientation: 'landscape' | 'portrait' | 'square'
    isVideo?: boolean
}

const IMAGE_BASE = 'https://qcohcaavhwujvagmpbdp.supabase.co/storage/v1/object/public/bsp-images/'

const images: GalleryImage[] = [
    { src: `${IMAGE_BASE}WhiteFishSmiles.jpg`, alt: 'Smiling parasailers soaring over Flathead Lake', category: 'Adventures', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}HighAerial.jpeg`, alt: '400 feet above crystal-clear Flathead Lake', category: 'Aerial Views', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}wfdip1.JPG`, alt: 'Touching down for a refreshing lake dip', category: 'Adventures', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}wfdip2.JPG`, alt: 'Coming in for a splash on Flathead Lake', category: 'Adventures', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}wfdip3.JPG`, alt: 'Skimming the water with mountain views', category: 'Adventures', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}girlwake.jpeg`, alt: 'Wake surfing on Flathead Lake', category: 'Adventures', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}colorfulChute.jpg`, alt: 'Colorful parasail chute against blue sky', category: 'Adventures', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}tubing.jpg`, alt: 'Tubing fun on Flathead Lake', category: 'Adventures', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}wfLadies1.JPG`, alt: 'Ladies day out parasailing over the lake', category: 'Adventures', orientation: 'portrait' as const },
    { src: `${IMAGE_BASE}wfladies2.JPG`, alt: 'Best friends adventure above Flathead Lake', category: 'Adventures', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}threeKids.jpg`, alt: 'Three kids having the time of their lives', category: 'Family Fun', orientation: 'portrait' as const },
    { src: `${IMAGE_BASE}tripFam.JPG`, alt: 'Family parasailing adventure', category: 'Family Fun', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}FlatheadAerial.jpg`, alt: 'Panoramic aerial view of Flathead Lake', category: 'Aerial Views', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}alignedAerial.jpg`, alt: 'Parasail boat cutting through crystal waters', category: 'Aerial Views', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}WFishHappyFar.jpg`, alt: 'Soaring high with mountain views', category: 'Aerial Views', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}wfTripFar.JPG`, alt: 'Parasailing against the Mission Mountains', category: 'Aerial Views', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}wfLineView.JPG`, alt: 'View from the boat as guests fly high', category: 'Aerial Views', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}FlatheadWithShadow.jpg`, alt: 'Parasail shadow over crystal-clear water', category: 'The Lake', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}wfSunset.JPG`, alt: 'Golden sunset parasailing on Flathead Lake', category: 'The Lake', orientation: 'portrait' as const },
    { src: `${IMAGE_BASE}wildHorseIsland.jpeg`, alt: 'Wild Horse Island from above', category: 'The Lake', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}fourthJuly.jpg`, alt: '4th of July fireworks over the lake', category: 'The Lake', orientation: 'portrait' as const },
    { src: `${IMAGE_BASE}glacierPark.jpg`, alt: 'Glacier National Park — just a short drive away', category: 'The Lake', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}wildHorse.jpg`, alt: 'Wild horses on Wild Horse Island', category: 'The Lake', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}cloudDancerInclineDock.jpg`, alt: 'Cloud Dancer docked at Flathead Harbor Marina', category: 'The Boat', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}cloudDancerTransom.png`, alt: 'Cloud Dancer — our Ocean Pro 31 parasail vessel', category: 'The Boat', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}leroyDock.jpg`, alt: 'Leroy the dock dog ready to greet you', category: 'The Boat', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}thumbAction.png`, alt: 'Action shot from the parasail boat', category: 'The Boat', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}DaytonaImage.png`, alt: 'Our crew capturing every moment', category: 'The Boat', orientation: 'portrait' as const },
    { src: `${IMAGE_BASE}FlatheadMarinaAerial.jpg`, alt: 'Flathead Harbor Marina from the air', category: 'The Marina', orientation: 'landscape' as const },
    { src: `${IMAGE_BASE}waitingAreaAnchorBar.jpg`, alt: 'The Anchor Bar at Flathead Harbor Marina', category: 'The Marina', orientation: 'landscape' as const },
    { src: '/JerryBearLogo.png', alt: 'Big Sky Parasail — Jerry Bear Logo', category: 'Our Brand', orientation: 'square' as const },
    { src: '/noirlogo.png', alt: 'Big Sky Parasail — Noir Logo', category: 'Our Brand', orientation: 'square' as const },
]

const categories = ['All', 'Adventures', 'Family Fun', 'Aerial Views', 'The Lake', 'The Boat', 'The Marina', 'Our Brand']

export default function GalleryClient() {
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedImage, setSelectedImage] = useState<number | null>(null)

    const filteredImages = selectedCategory === 'All'
        ? images
        : images.filter(img => img.category === selectedCategory)

    const navigateImage = (direction: number) => {
        if (selectedImage === null) return
        const newIndex = (selectedImage + direction + filteredImages.length) % filteredImages.length
        setSelectedImage(newIndex)
    }

    return (
        <main className="min-h-screen bg-[#FFF8EE] text-[#2D1600]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF9500]/10 via-[#FFD700]/5 to-[#FFF8EE]" />

                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                    <motion.div
                        className="absolute top-20 right-20 w-96 h-96 bg-[#FF9500] rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ repeat: Infinity, duration: 8 }}
                    />
                    <motion.div
                        className="absolute bottom-20 left-20 w-96 h-96 bg-[#FFD700] rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.5, 0.3, 0.5],
                        }}
                        transition={{ repeat: Infinity, duration: 8 }}
                    />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF9500] to-[#FFD700] text-[#FFFFFF] px-6 py-3 rounded-full mb-6 shadow-lg"
                    >
                        <Camera className="h-5 w-5" />
                        <span className="font-bold">Photo Gallery</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-[family-name:var(--font-headline)] text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#2D1600] mb-6"
                    >
                        Captured Moments
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-3xl text-[#614020] max-w-3xl mx-auto font-semibold"
                    >
                        Adventures. Mountains. Memories.
                    </motion.p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-wrap justify-center gap-3"
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-[#FF9500] text-[#FFFFFF] shadow-lg scale-110'
                                    : 'bg-[#FFD699] text-[#614020] hover:scale-105 hover:shadow-md'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {filteredImages.map((image, index) => (
                                <motion.div
                                    key={image.src + index}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                    className="break-inside-avoid mb-6"
                                >
                                    <div
                                        className="relative group cursor-pointer rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        {image.isVideo ? (
                                            <video
                                                muted
                                                loop
                                                playsInline
                                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                                onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play()}
                                                onMouseLeave={e => { (e.currentTarget as HTMLVideoElement).pause(); (e.currentTarget as HTMLVideoElement).currentTime = 0; }}
                                            >
                                                {image.webmSrc && <source src={image.webmSrc} type="video/webm" />}
                                                <source src={image.src} type="video/mp4" />
                                            </video>
                                        ) : (
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        )}
                                        {image.isVideo && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="bg-black/40 backdrop-blur-sm rounded-full p-4 group-hover:bg-black/20 transition-colors">
                                                    <Play className="h-10 w-10 text-white fill-white" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(61,28,0,0.8)] via-[rgba(61,28,0,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Sparkles className="h-4 w-4 text-[#FFD700]" />
                                                    <span className="text-xs font-semibold text-[#FFD700] uppercase tracking-wide">
                                                        {image.category}
                                                    </span>
                                                </div>
                                                <p className="text-[#FFFFFF] font-bold text-lg">{image.alt}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredImages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <Camera className="h-16 w-16 text-[#8B6914] mx-auto mb-4" />
                            <p className="text-xl text-[#8B6914]">
                                No images in this category yet
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#3D1C00]/95 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors z-10"
                            aria-label="Close"
                        >
                            <X className="h-6 w-6 text-[#FFFFFF]" />
                        </button>

                        {/* Previous Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                navigateImage(-1)
                            }}
                            className="absolute left-4 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors z-10"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="h-8 w-8 text-[#FFFFFF]" />
                        </button>

                        {/* Image */}
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="max-w-6xl max-h-[90vh] relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {filteredImages[selectedImage].isVideo ? (
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    controls
                                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                >
                                    {filteredImages[selectedImage].webmSrc && (
                                        <source src={filteredImages[selectedImage].webmSrc} type="video/webm" />
                                    )}
                                    <source src={filteredImages[selectedImage].src} type="video/mp4" />
                                </video>
                            ) : (
                                <img
                                    src={filteredImages[selectedImage].src}
                                    alt={filteredImages[selectedImage].alt}
                                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                />
                            )}

                            {/* Image Info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#3D1C00]/90 to-transparent p-6 rounded-b-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-5 w-5 text-[#FFD700]" />
                                    <span className="text-[#FFD700] font-semibold text-sm uppercase tracking-wide">
                                        {filteredImages[selectedImage].category}
                                    </span>
                                </div>
                                <p className="text-[#FFFFFF] text-xl font-bold">
                                    {filteredImages[selectedImage].alt}
                                </p>
                                <p className="text-[#FFFFFF]/60 text-sm mt-2">
                                    {selectedImage + 1} of {filteredImages.length}
                                </p>
                            </div>
                        </motion.div>

                        {/* Next Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                navigateImage(1)
                            }}
                            className="absolute right-4 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors z-10"
                            aria-label="Next"
                        >
                            <ChevronRight className="h-8 w-8 text-[#FFFFFF]" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
            <ChatCTA />
        </main>
    )
}
