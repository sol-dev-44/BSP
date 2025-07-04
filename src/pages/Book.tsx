import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer.tsx";
import SEO from "../Components/Seo.tsx";

const bookingPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Parasailing Experience Booking",
  "description":
    "Book your parasailing adventure on Flathead Lake. Experience Montana from above with breathtaking views of the lake and surrounding mountains.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Big Sky Parasail",
    "telephone": "(406) 270-6256",
    "email": "bigskyparasailing@gmail.com",
  },
  "offers": {
    "@type": "Offer",
    "price": "139.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://www.montanaparasail.com/reservations",
  },
  "areaServed": {
    "@type": "Place",
    "name": "Flathead Lake",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lakeside",
      "addressRegion": "MT",
      "addressCountry": "US",
    },
  },
};

// Image configuration for easy updates
const images = {
  heroImage: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//HighAerial.jpeg", // Hero section background image
  phoneIcon: "/phone-icon.svg", // Replace with actual phone icon path
  emailIcon: "/email-icon.svg", // Replace with actual email icon path
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const BookNowPage = () => {
  return (
    <>
      <SEO
        title="Book Your Parasailing Adventure | Flathead Lake Montana"
        description="Reserve your parasailing experience on Flathead Lake. Easy online booking for Montana's premier parasailing adventure with breathtaking mountain views."
        keywords="book parasailing, Flathead Lake parasail reservations, Montana parasailing tickets, parasail booking, parasail adventure reservation"
        canonicalUrl="https://www.montanaparasail.com/reservations"
        ogImage="https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//WhiteFishSmiles.jpg"
        structuredData={bookingPageStructuredData}
      />
      <div className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute w-full h-full bg-black opacity-30"></div>
            {/* Background image */}
            <img
              src={images.heroImage}
              alt="Parasailing over Flathead Lake"
              className="w-full h-full object-cover"
            />
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <pattern
                  id="pattern-circles"
                  x="0"
                  y="0"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                  patternContentUnits="userSpaceOnUse"
                >
                  <circle cx="25" cy="25" r="10" fill="currentColor" />
                </pattern>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#pattern-circles)"
                />
              </svg>
            </div>
          </div>

          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.p
                variants={fadeInUp}
                className="text-amber-400 font-bold tracking-widest mb-2"
              >
                LET'S GET YOU BOOKED
              </motion.p>
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
              >
                Reserve Your Parasailing Adventure
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl mb-8 text-blue-50"
              >
                Book your incredible Flathead Lake parasailing experience by
                phone or email
              </motion.p>
            </motion.div>
          </div>

          {/* Wave separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              >
              </path>
            </svg>
          </div>
        </div>

        {/* Contact Cards Section */}
        <section className="py-16 -mt-10 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Phone Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Book by Phone
                  </h3>
                  <p className="text-gray-600 mb-4">
                    For immediate assistance and booking, give us a call
                    directly. We're ready to get you scheduled for an
                    unforgettable adventure!
                  </p>
                  <a
                    href="tel:406-270-6256"
                    className="text-2xl font-bold text-amber-500 hover:text-amber-600 transition-colors mb-4"
                  >
                    (406) 270-6256
                  </a>
                  <p className="text-sm text-gray-500 mb-6">
                    Available 8am - 8pm Mountain Time
                  </p>
                  <a
                    href="tel:406-270-6256"
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Call Now
                  </a>
                </div>
              </motion.div>

              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Book by Email
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Send us your details and preferred dates, and we'll get back
                    to you promptly with availability and confirmation.
                  </p>
                  <a
                    href="mailto:bigskyparasailing@gmail.com"
                    className="text-lg font-semibold text-amber-500 hover:text-amber-600 transition-colors mb-4 break-all"
                  >
                    bigskyparasailing@gmail.com
                  </a>
                  <p className="text-sm text-gray-500 mb-6">
                    We typically respond within 24 hours
                  </p>
                  <a
                    href="mailto:bigskyparasailing@gmail.com"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Send Email
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Booking Information Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="max-w-3xl mx-auto"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-bold mb-8 text-gray-900 text-center"
              >
                Booking Information
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  variants={fadeIn}
                  className="bg-gray-50 p-6 rounded-xl shadow-md"
                >
                  <h3 className="text-xl font-bold mb-4 text-blue-600">
                    What To Bring
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Swimwear (under clothing)</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Sunscreen</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Sunglasses with strap</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Towel</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Camera (optional)</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="bg-gray-50 p-6 rounded-xl shadow-md"
                >
                  <h3 className="text-xl font-bold mb-4 text-blue-600">
                    Good To Know
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Arrive 15 minutes before your scheduled time</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Weight limits: 40-450 lbs combined</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Age minimum: 6+ years (under 12 with adult)</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Photo packages available for purchase</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Weather-dependent activity (rescheduling available)
                      </span>
                    </li>
                  </ul>
                </motion.div>
              </div>

              {/* New Pricing Section with Cards */}
              <motion.div
                variants={fadeIn}
                className="mt-8"
              >
                <h3 className="text-xl font-bold mb-6 text-blue-600">
                  Pricing Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Parasail Flight */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-blue-600 h-2"></div>
                    <div className="p-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Parasail Flight
                      </h4>
                      <div className="text-3xl font-bold text-amber-500 mb-3">
                        $99
                      </div>
                      <p className="text-gray-600 text-sm">
                        10-12 minute parasailing experience high above Flathead
                        Lake
                      </p>
                    </div>
                  </div>

                  {/* Photo Package */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-amber-500 h-2"></div>
                    <div className="p-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Photo Package
                      </h4>
                      <div className="text-3xl font-bold text-amber-500 mb-3">
                        $30
                      </div>
                      <p className="text-gray-600 text-sm">
                        Professional photos of your flight delivered digitally
                      </p>
                    </div>
                  </div>

                  {/* GoPro Package */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-green-500 h-2"></div>
                    <div className="p-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        GoPro Package
                      </h4>
                      <div className="text-3xl font-bold text-amber-500 mb-3">
                        $30
                      </div>
                      <p className="text-gray-600 text-sm">
                        High-definition video of your entire parasailing
                        experience
                      </p>
                    </div>
                  </div>

                  {/* Observer (Ride Along) */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-purple-500 h-2"></div>
                    <div className="p-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Observer
                      </h4>
                      <div className="text-3xl font-bold text-amber-500 mb-3">
                        $30
                      </div>
                      <p className="text-gray-600 text-sm">
                        Ride along on the boat without parasailing
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg text-center text-gray-600 text-sm">
                  <p>
                    All prices are per person. Discounts available for groups of
                    6 or more.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.h2
                variants={fadeInUp}
                className="text-2xl font-bold mb-6 text-gray-900"
              >
                Have Questions?
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-gray-700 mb-8 max-w-2xl mx-auto"
              >
                Visit our FAQ page for answers to commonly asked questions, or
                contact us directly.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link
                  to="/faq"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all inline-block"
                >
                  View FAQ
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-bold mb-6"
              >
                Ready to Reserve Your Spot?
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg mb-8 max-w-2xl mx-auto"
              >
                Contact us today to secure your parasailing adventure on
                beautiful Flathead Lake.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-4"
              >
                <a
                  href="tel:406-270-6256"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  (406) 270-6256
                </a>
                <a
                  href="mailto:bigskyparasailing@gmail.com"
                  className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Send Email
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default BookNowPage;
