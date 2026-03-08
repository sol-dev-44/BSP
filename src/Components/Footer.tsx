'use client'

import Link from 'next/link'
import { Facebook, Instagram, Star, MapPin as TripAdvisorIcon, Phone, Mail, ExternalLink } from 'lucide-react'
import { BUSINESS_INFO } from '@/config/business'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-[#1A0F0A] text-[#FDF6E3] relative overflow-hidden" id="about">
            {/* Gradient accent at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4605A] via-[#E5A832] to-[#3B6BA5]" />

            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#D4605A] rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#E5A832] rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

                    {/* Brand */}
                    <div>
                        <h3 className="text-5xl font-black bg-gradient-to-r from-[#D4605A] to-[#E5A832] bg-clip-text text-transparent mb-6">
                            Big Sky Parasail
                        </h3>
                        <p className="text-gray-300 text-xl leading-relaxed mb-6">
                            Making memories on Flathead Lake since 2022. Safe, fun, and family-friendly parasailing adventures in Montana.
                        </p>
                        <p className="text-[#E5A832] font-bold text-lg">
                            Season: May &ndash; September
                        </p>

                        {/* Sister Sites */}
                        <div className="mt-6 space-y-2">
                            <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Sister Site</p>
                            <div className="flex flex-col gap-2">
                                <a
                                    href={BUSINESS_INFO.sisterSite.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#FDF6E3] hover:text-[#E5A832] transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    {BUSINESS_INFO.sisterSite.name}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-gray-300 text-xl">
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <TripAdvisorIcon className="h-6 w-6 text-[#D4605A] flex-shrink-0 mt-1" />
                                <div>
                                    <div className="font-bold text-white">{BUSINESS_INFO.address.name}</div>
                                    <div className="text-gray-400">{BUSINESS_INFO.address.street}</div>
                                    <div className="text-gray-400">{BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.stateCode} {BUSINESS_INFO.address.zip}</div>
                                </div>
                            </li>
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <Phone className="h-6 w-6 text-[#D4605A] flex-shrink-0 mt-1" />
                                <div className="flex flex-col items-start">
                                    <a href={`tel:${BUSINESS_INFO.phone.replace(/-/g, '')}`} className="hover:text-[#E5A832] transition-colors font-bold text-xl leading-none">
                                        {BUSINESS_INFO.displayPhone}
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <Mail className="h-6 w-6 text-[#D4605A] flex-shrink-0" />
                                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-[#E5A832] transition-colors">
                                    {BUSINESS_INFO.email}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social & CTA */}
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-6">Follow Us</h3>
                        <div className="flex justify-center md:justify-start space-x-4 mb-8">
                            <a
                                href={BUSINESS_INFO.social.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-[#D4605A] hover:to-[#E5A832] transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                                title="Follow us on Facebook"
                            >
                                <Facebook className="h-7 w-7" />
                            </a>
                            <a
                                href={BUSINESS_INFO.social.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-[#D4605A] hover:to-[#E5A832] transition-all duration-300 hover:scale-110"
                                aria-label="Instagram"
                                title="Follow us on Instagram"
                            >
                                <Instagram className="h-7 w-7" />
                            </a>
                            <a
                                href={BUSINESS_INFO.social.yelp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-[#D4605A] hover:to-[#E5A832] transition-all duration-300 hover:scale-110"
                                aria-label="Yelp"
                                title="Review us on Yelp"
                            >
                                <Star className="h-7 w-7" />
                            </a>
                            <a
                                href={BUSINESS_INFO.social.tripadvisor}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-[#D4605A] hover:to-[#E5A832] transition-all duration-300 hover:scale-110"
                                aria-label="TripAdvisor"
                                title="Review us on TripAdvisor"
                            >
                                <TripAdvisorIcon className="h-7 w-7" />
                            </a>
                        </div>
                        <div className="mt-8">
                            <Link
                                href="/book"
                                className="inline-block px-12 py-5 text-2xl font-bold rounded-full bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white hover:shadow-2xl hover:shadow-[#D4605A]/50 transition-all duration-300 hover:scale-105"
                            >
                                Book Your Adventure
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 border-t border-[#6B4226]/50">
                    <p className="text-center text-gray-400 text-xl">
                        &copy; {currentYear} Big Sky Parasail. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
