'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { useState, useMemo } from 'react'
import Link from 'next/link'

interface FAQItem {
    question: string
    answer: string
    category: string
}

const PARASAILING_FAQS: FAQItem[] = [
    {
        question: 'How high do you go?',
        answer: 'We fly at heights up to 400 feet above Flathead Lake, giving you incredible panoramic views of the Mission Mountains, Swan Range, and the surrounding Montana landscape.',
        category: 'The Experience',
    },
    {
        question: 'How long is the parasail flight?',
        answer: 'Each parasail flight lasts approximately 8-12 minutes in the air. The entire boat trip, including travel to the flight area and back, is about 45 minutes to 1 hour.',
        category: 'The Experience',
    },
    {
        question: 'Is parasailing safe?',
        answer: 'Absolutely! Safety is our top priority. Our vessel is USCG inspected, our captain is USCG licensed, and we maintain a 100% safety record. We use professional-grade equipment and follow strict safety protocols.',
        category: 'Safety',
    },
    {
        question: 'What is the age and weight requirement?',
        answer: 'There is no minimum age, but passengers must meet a minimum weight requirement for safe flight. Single flyers should be at least 130 lbs. Lighter passengers can fly tandem or triple. Maximum combined weight varies by wind conditions.',
        category: 'Requirements',
    },
    {
        question: 'What should I wear?',
        answer: 'Wear comfortable clothing and shoes that can get wet (sandals or water shoes are great). Bring sunglasses with a strap and sunscreen. We recommend layers as it can be cooler on the water.',
        category: 'Requirements',
    },
    {
        question: 'Do I get wet?',
        answer: 'Getting wet is optional! You can choose a "dry" landing where you stay above the water, or request a "dip" where the captain lowers you for a fun splash in Flathead Lake.',
        category: 'The Experience',
    },
    {
        question: 'What happens if the weather is bad?',
        answer: 'Safety always comes first. If weather conditions are not suitable for flying, we will work with you to reschedule or provide a full refund. We monitor conditions closely and communicate any changes.',
        category: 'Safety',
    },
    {
        question: 'When is your season?',
        answer: 'Our season runs from May through September, taking advantage of Montana\'s beautiful summer weather on Flathead Lake.',
        category: 'Booking',
    },
    {
        question: 'How do I book?',
        answer: 'You can book online through our website, or call us at (406) 270-6256. We recommend booking in advance as spots fill up quickly during peak summer months.',
        category: 'Booking',
    },
    {
        question: 'Can I bring my phone or camera?',
        answer: 'Yes, but at your own risk! We recommend a waterproof case with a secure strap. We also offer photo packages so you can focus on enjoying the experience.',
        category: 'The Experience',
    },
]

function getFAQsByCategory(): Map<string, FAQItem[]> {
    const map = new Map<string, FAQItem[]>()
    PARASAILING_FAQS.forEach(faq => {
        const existing = map.get(faq.category) || []
        existing.push(faq)
        map.set(faq.category, existing)
    })
    return map
}

export function FAQ() {
    const [searchTerm, setSearchTerm] = useState('')
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const categories = useMemo(() => getFAQsByCategory(), [])
    const categoryNames = useMemo(() => Array.from(categories.keys()), [categories])

    const filteredFAQs = useMemo(() => {
        let faqs = PARASAILING_FAQS
        if (selectedCategory) {
            faqs = faqs.filter(faq => faq.category === selectedCategory)
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            faqs = faqs.filter(
                faq =>
                    faq.question.toLowerCase().includes(term) ||
                    faq.answer.toLowerCase().includes(term)
            )
        }
        return faqs
    }, [searchTerm, selectedCategory])

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4605A] to-[#6B4226] text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                        <HelpCircle className="h-5 w-5" />
                        <span className="font-bold">Got Questions?</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6">
                        Frequently Asked{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4605A] to-[#E5A832]">
                            Questions
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Everything you need to know about parasailing on Flathead Lake
                    </p>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#E5A832]/30 dark:border-[#6B4226] bg-[#FDF6E3] dark:bg-[#2A1F17] text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4605A] focus:border-transparent text-lg"
                        />
                    </div>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2 mb-8 justify-center"
                >
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!selectedCategory
                                ? 'bg-[#D4605A] text-white shadow-lg'
                                : 'bg-[#FDF6E3] dark:bg-[#2A1F17] text-foreground/70 hover:bg-[#E5A832]/20 dark:hover:bg-[#6B4226]/50'
                            }`}
                    >
                        All
                    </button>
                    {categoryNames.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === category
                                    ? 'bg-[#D4605A] text-white shadow-lg'
                                    : 'bg-[#FDF6E3] dark:bg-[#2A1F17] text-foreground/70 hover:bg-[#E5A832]/20 dark:hover:bg-[#6B4226]/50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => {
                        const globalIndex = PARASAILING_FAQS.indexOf(faq)
                        const isOpen = openIndex === globalIndex

                        return (
                            <motion.div
                                key={globalIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[#FDF6E3] dark:bg-[#2A1F17] rounded-2xl border border-[#E5A832]/20 dark:border-[#6B4226] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                                >
                                    <span className="text-lg font-bold text-foreground">
                                        {faq.question}
                                    </span>
                                    {isOpen ? (
                                        <ChevronUp className="w-5 h-5 text-[#D4605A] flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-[#E5A832]/10 dark:border-[#6B4226] pt-4">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>

                {filteredFAQs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-xl text-gray-500">No matching questions found.</p>
                        <p className="text-gray-400 mt-2">Try a different search term or category.</p>
                    </motion.div>
                )}

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center bg-gradient-to-r from-[#D4605A] to-[#6B4226] rounded-3xl p-10 text-white"
                >
                    <h3 className="text-3xl font-black mb-4">Still Have Questions?</h3>
                    <p className="text-lg mb-6 text-[#FDF6E3]/80">
                        Our team is here to help you plan your perfect parasailing adventure on Flathead Lake!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/book"
                            className="px-8 py-4 bg-[#FDF6E3] text-[#D4605A] rounded-full font-bold text-lg hover:bg-white transition-colors shadow-xl"
                        >
                            Book Now
                        </Link>
                        <a
                            href="tel:4062706256"
                            className="px-8 py-4 bg-[#6B4226] text-white rounded-full font-bold text-lg hover:bg-[#3D2B1F] transition-colors shadow-xl border border-[#E5A832]/30"
                        >
                            Call (406) 270-6256
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
