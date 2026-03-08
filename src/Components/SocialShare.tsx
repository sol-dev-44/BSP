'use client'

import { motion } from 'framer-motion'
import { Facebook, Twitter, Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'

interface SocialShareProps {
    url?: string
    title?: string
    description?: string
}

export function SocialShare({
    url = 'https://bigskyparasail.com',
    title = 'Check out Big Sky Parasail!',
    description = 'Amazing parasailing experience on Flathead Lake, Montana'
}: SocialShareProps) {
    const [copied, setCopied] = useState(false)

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <div className="bg-gradient-to-br from-[#D4605A]/5 to-[#E5A832]/5 rounded-2xl p-8 border border-[#E5A832]/20 dark:border-[#6B4226]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
            >
                <h3 className="text-2xl font-black text-foreground mb-4">
                    Share Your Experience
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Let your friends know about your Montana adventure!
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    {/* Facebook */}
                    <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1877F2] hover:bg-[#0d65d9] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <Facebook className="w-5 h-5" />
                        Facebook
                    </a>

                    {/* Twitter */}
                    <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1DA1F2] hover:bg-[#0d8bd9] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <Twitter className="w-5 h-5" />
                        Twitter
                    </a>

                    {/* Copy Link */}
                    <button
                        onClick={copyToClipboard}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#6B4226] hover:bg-[#3D2B1F] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        {copied ? (
                            <>
                                <Check className="w-5 h-5" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <LinkIcon className="w-5 h-5" />
                                Copy Link
                            </>
                        )}
                    </button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Tag us <span className="font-bold text-[#D4605A]">@bigskyparasail</span> in your posts!
                </p>
            </motion.div>
        </div>
    )
}
