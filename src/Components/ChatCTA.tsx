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
                className="fixed bottom-6 right-6 z-40 group"
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
                            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#3D2B1F] dark:bg-[#2A1F17] text-[#FDF6E3] px-4 py-2 rounded-lg shadow-xl"
                        >
                            <span className="font-semibold">Ask us anything!</span>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-[#3D2B1F] dark:border-l-[#2A1F17]" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat Button */}
                <div className="relative">
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4605A] to-[#E5A832] opacity-75"
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

                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-[#D4605A] to-[#E5A832] shadow-2xl flex items-center justify-center cursor-pointer hover:shadow-[#D4605A]/50 transition-shadow duration-300">
                        <MessageCircle className="w-8 h-8 text-white" strokeWidth={2.5} />

                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#3B6BA5] rounded-full border-2 border-white dark:border-[#1A0F0A] animate-pulse" />
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
