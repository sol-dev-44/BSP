'use client'

import { MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

export function ChatCTA() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <Link href="/bsp-chat">
            <motion.div
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Tooltip */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#111128] text-[#00f0ff] px-4 py-2 rounded-lg shadow-xl border border-[#00f0ff]/20"
                        >
                            <span className="font-semibold">Ask us anything!</span>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-[#111128]" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat Button */}
                <div className="relative">
                    <motion.div
                        className="absolute inset-0 rounded-full bg-[#00f0ff] opacity-75"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.75, 0.5, 0.75],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-center cursor-pointer hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] transition-shadow duration-300">
                        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#050510]" strokeWidth={2.5} />

                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#b8ff00] rounded-full border-2 border-[#050510] animate-pulse" />
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
