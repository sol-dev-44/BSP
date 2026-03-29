'use client'

import Link from 'next/link'
import { Facebook, Instagram, Star, MapPin as TripAdvisorIcon, Phone, Mail, ExternalLink, MapPinned } from 'lucide-react'
import { BUSINESS_INFO } from '@/config/business'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-[#0a0a14] text-[#e0f0ff] relative overflow-hidden cyber-grid" id="about">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#00f0ff] rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#ff00ff] rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 text-center md:text-left">

                    {/* Brand */}
                    <div>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter font-[family-name:var(--font-headline)] text-[#00f0ff] mb-6 pb-1 leading-normal">
                            Big Sky Parasail
                        </h3>
                        <p className="text-[#b0c4de] text-base sm:text-lg md:text-xl leading-relaxed mb-6">
                            Making memories on Flathead Lake since 2022. Safe, fun, and family-friendly parasailing adventures in Montana.
                        </p>
                        <p className="text-[#ff00ff] font-bold text-lg">
                            Season: May &ndash; September
                        </p>

                        {/* Sister Sites */}
                        <div className="mt-6 space-y-2">
                            <p className="text-sm text-[#5a6a8a] font-[family-name:var(--font-headline)] font-bold uppercase tracking-widest">Sister Site</p>
                            <div className="flex flex-col gap-2">
                                <a
                                    href={BUSINESS_INFO.sisterSite.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#e0f0ff] hover:text-[#ff00ff] transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    {BUSINESS_INFO.sisterSite.name}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter font-[family-name:var(--font-headline)] text-[#e0f0ff] mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-[#b0c4de] text-base sm:text-lg md:text-xl">
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <TripAdvisorIcon className="h-6 w-6 text-[#00f0ff] flex-shrink-0 mt-1" />
                                <div>
                                    <div className="font-bold text-[#e0f0ff]">{BUSINESS_INFO.address.name}</div>
                                    <div className="text-[#5a6a8a]">{BUSINESS_INFO.address.street}</div>
                                    <div className="text-[#5a6a8a]">{BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.stateCode} {BUSINESS_INFO.address.zip}</div>
                                </div>
                            </li>
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <Phone className="h-6 w-6 text-[#00f0ff] flex-shrink-0 mt-1" />
                                <div className="flex flex-col items-start">
                                    <a href={`tel:${BUSINESS_INFO.phone.replace(/-/g, '')}`} className="hover:text-[#ff00ff] transition-colors font-bold text-base sm:text-lg md:text-xl leading-none">
                                        {BUSINESS_INFO.displayPhone}
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <Mail className="h-6 w-6 text-[#00f0ff] flex-shrink-0" />
                                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-[#ff00ff] transition-colors">
                                    {BUSINESS_INFO.email}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social & CTA */}
                    <div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter font-[family-name:var(--font-headline)] text-[#e0f0ff] mb-6">Follow Us</h3>
                        <div className="flex justify-center md:justify-start space-x-4 mb-8">
                            <a
                                href={BUSINESS_INFO.social.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-[#111128] border border-[#00f0ff]/10 hover:bg-[#0099bb] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                                title="Follow us on Facebook"
                            >
                                <Facebook className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                            </a>
                            <a
                                href={BUSINESS_INFO.social.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-[#111128] border border-[#00f0ff]/10 hover:bg-[#0099bb] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300 hover:scale-110"
                                aria-label="Instagram"
                                title="Follow us on Instagram"
                            >
                                <Instagram className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                            </a>
                            <a
                                href={BUSINESS_INFO.social.yelp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-[#111128] border border-[#00f0ff]/10 hover:bg-[#0099bb] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300 hover:scale-110"
                                aria-label="Yelp"
                                title="Review us on Yelp"
                            >
                                <Star className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                            </a>
                            <a
                                href={BUSINESS_INFO.social.tripadvisor}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-[#111128] border border-[#00f0ff]/10 hover:bg-[#0099bb] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300 hover:scale-110"
                                aria-label="TripAdvisor"
                                title="Review us on TripAdvisor"
                            >
                                <TripAdvisorIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                            </a>
                            <a
                                href={BUSINESS_INFO.social.google}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-[#111128] border border-[#00f0ff]/10 hover:bg-[#0099bb] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300 hover:scale-110"
                                aria-label="Google Maps"
                                title="Find us on Google Maps"
                            >
                                <MapPinned className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                            </a>
                        </div>
                        <div className="mt-8">
                            <Link
                                href="/book"
                                className="inline-block px-8 py-3 text-base sm:px-10 sm:py-4 sm:text-lg md:px-12 md:py-5 md:text-2xl font-bold rounded-full bg-[#00f0ff] text-[#050510] shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] transition-all duration-300 hover:scale-105 uppercase tracking-widest font-[family-name:var(--font-headline)]"
                            >
                                Book Your Adventure
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 sm:mt-16 sm:pt-8 border-t border-[#00f0ff]/10">
                    <p className="text-center text-[#5a6a8a] text-sm sm:text-base md:text-xl">
                        &copy; {currentYear} Big Sky Parasail. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
