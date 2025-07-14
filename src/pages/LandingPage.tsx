import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer.tsx";
import SEO from "../Components/Seo.tsx";
import TipComponent from "../Components/Tip.tsx";
import CanadianWelcomeBanner from "../Components/CanadianWelcomeBanner.tsx";

const landingPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Big Sky Parasail",
  "description":
    "Experience Montana's premier parasailing adventure on Flathead Lake. Safe, thrilling parasail rides with breathtaking mountain views.",
  "image": "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//WhiteFishSmiles.jpg",
  "url": "https://www.montanaparasail.com",
  "telephone": "(406) 270-6256",
  "email": "bigskyparasailing@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Flathead Harbor Marina",
    "addressLocality": "Lakeside",
    "addressRegion": "MT",
    "postalCode": "59922",
    "addressCountry": "US",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 48.0411,
    "longitude": -114.2298,
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      "opens": "09:00",
      "closes": "19:00",
      "validFrom": "2025-05-01",
      "validThrough": "2025-09-30",
    },
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "USD",
    "price": "89.00",
    "validFrom": "2025-05-01",
    "url": "https://www.montanaparasail.com/reservations",
  },
};

// Image configuration - using best images from gallery
const images = {
  // Hero images for carousel
  heroImages: [
    {
      src: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//colorfulChute.jpg",
      alt: "Parasailing high above Flathead Lake",
      title: "Soar 500 Feet Above Montana"
    },
    {
      src: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//threeKids.jpg",
      alt: "Group parasailing adventure",
      title: "Create Unforgettable Memories"
    },
    {
      src: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//cloudDancerInclineDock.jpg",
      alt: "State of the art Parasailing Vessel",
      title: "Dance with the Clouds"
    },
    {
      src: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfSunset.JPG",
      alt: "Golden hour parasailing",
      title: "Magical Sunset Flights"
    }
  ],
  // Other images
  heroLogo: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//JerryBearLogo.png",
  feature1: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//cloudDancerInclineDock.jpg",
  safetyImage: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//WhiteFishSmiles.jpg",
  dipImages: [
    "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfdip1.JPG",
    "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfdip2.JPG",
    "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfdip3.JPG"
  ],
  customerImages: [
    "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfladies2.JPG",
    "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//tripFam.JPG",
"https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//colorfulChute.jpg"  ],
  sceneryImages: [
    "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//FlatheadWithShadow.jpg",
    "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wildHorseIsland.jpeg",
    "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//fourthJuly.jpg"
  ]
};

type TestimonialProps = {
  quote: string;
  author: string;
  location?: string;
  featured?: boolean;
  image?: string;
};

const Testimonial: React.FC<TestimonialProps> = (
  { quote, author, location, featured = false, image },
) => (
  <div
    className={`${
      featured ? "bg-white/95 backdrop-blur-lg p-8 shadow-2xl border border-white/20" : "bg-white/90 backdrop-blur-md p-6 shadow-xl border border-white/10"
    } rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden`}
  >
    {image && (
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <img src={image} alt="" className="w-full h-full object-cover rounded-bl-2xl" />
      </div>
    )}
    <div className="flex mb-4 justify-center relative z-10">
      {[...Array(5)].map((_, i) => (
        <motion.svg
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`${
            featured ? "w-6 h-6" : "w-5 h-5"
          } text-amber-500 fill-current`}
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </motion.svg>
      ))}
    </div>
    <p
      className={`italic text-gray-700 mb-4 relative z-10 ${
        featured ? "text-xl text-center font-medium" : "text-center"
      }`}
    >
      "{quote}"
    </p>
    <p
      className={`${
        featured
          ? "text-center font-semibold text-blue-600"
          : "text-sm font-semibold text-center"
      } relative z-10`}
    >
      — {author}
      {location && `, ${location}`}
    </p>
  </div>
);

// Enhanced floating CTA button
const FloatingCTA: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-[40]"
          style={{ zIndex: 40 }}
        >
          <motion.button
            onClick={() => window.location.href = '/reservations'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-lg hover:shadow-amber-500/25 transition-all duration-300 flex items-center space-x-2"
          >
            <span>🎯 Book Now</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LandingPage: React.FC = () => {
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  // Show floating CTA after scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCTA(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle through hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % images.heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced testimonials data with images
  const featuredTestimonial = {
    quote:
      "Absolutely incredible! The views of Flathead Lake and the surrounding mountains were breathtaking. Our captain was so professional and made us feel completely safe. This was the highlight of our Montana vacation!",
    author: "Jennifer & Mike T.",
    location: "Missoula, MT",
    image: images.safetyImage
  };

  const testimonials = [
    {
      quote:
        "My kids loved it! Even my husband with his fear of heights had a blast. We'll be back next year!",
      author: "Sarah J.",
      location: "Bozeman, MT",
    },
    {
      quote:
        "The most amazing experience of our vacation! Views were incredible and the staff made us feel completely safe.",
      author: "Mark R.",
      location: "Seattle, WA",
    },
    {
      quote:
        "Worth every penny! The photo package captured memories we'll treasure forever.",
      author: "Lisa M.",
      location: "Denver, CO",
    },
    {
      quote:
        "Professional, safe, and absolutely thrilling. Can't wait to bring friends back!",
      author: "David K.",
      location: "Spokane, WA",
    },
  ];

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

  return (
    <>
      <SEO
        title="Big Sky Parasail - Flathead Lake, Montana"
        description="Experience the thrill of parasailing on Flathead Lake in Montana. Safe, breathtaking adventures with stunning mountain views. Book your parasail ride today!"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(landingPageStructuredData),
        }}
      />
      <style>{`
        /* Ensure tip modal has highest z-index */
        [class*="tip"], [id*="tip"], [data-testid*="tip"] {
          z-index: 9999 !important;
        }
        .tip-modal, .tip-component, .modal {
          z-index: 9999 !important;
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden">
        {/* HERO SECTION WITH IMAGE CAROUSEL */}
        <div className="relative min-h-screen">
          {/* Hero Image Carousel Background */}
          <div className="absolute inset-0 w-full h-full">
            <AnimatePresence mode="wait">
              {images.heroImages.map((image, index) => (
                currentHeroImage === index && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Hero Content */}
          <motion.div 
            className="relative z-10 min-h-screen flex items-center justify-center pt-20"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerChildren}
                className="max-w-5xl mx-auto"
              >
                {/* Dynamic headline based on current image */}
                <motion.h1
                  key={currentHeroImage}
                  variants={fadeInUp}
                  className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentHeroImage}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="block"
                    >
                      {images.heroImages[currentHeroImage].title}
                    </motion.span>
                  </AnimatePresence>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  variants={fadeInUp}
                  className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto font-medium"
                >
                  Parasailing Adventures on Flathead Lake
                  <span className="text-amber-400 font-bold block mt-2">
                    NOW ONLY $89 (Was $99) • Group Rate: $75/person
                  </span>
                </motion.p>

                {/* Image carousel indicators */}
                <motion.div
                  variants={fadeInUp}
                  className="flex justify-center gap-2 mb-8"
                >
                  {images.heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentHeroImage(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentHeroImage === index 
                          ? 'bg-amber-400 w-8' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </motion.div>

                {/* Social proof badges */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10 text-white"
                >
                  <div className="text-center">
                    <div className="text-xl md:text-3xl font-bold text-amber-400">5,000+</div>
                    <div className="text-xs md:text-sm">Happy Flyers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-3xl font-bold text-amber-400">100%</div>
                    <div className="text-xs md:text-sm">Safety Record</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-3xl font-bold text-amber-400">5.0★</div>
                    <div className="text-xs md:text-sm">Google Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-3xl font-bold text-amber-400">20</div>
                    <div className="text-xs md:text-sm">Years Experience</div>
                  </div>
                </motion.div>

                {/* Enhanced CTA buttons */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                >
                  <motion.button
                    onClick={() => window.location.href = '/reservations'}
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 193, 7, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      🚁 BOOK YOUR FLIGHT NOW
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="ml-2"
                      >
                        →
                      </motion.span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white font-semibold text-lg rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300"
                    onClick={() => {
                      document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    📸 See The Experience
                  </motion.button>
                </motion.div>

                {/* Logo */}
                <motion.div
                  variants={fadeInUp}
                  className="relative"
                >
                  <motion.img
                    src={images.heroLogo}
                    alt="Big Sky Parasail"
                    className="max-w-xs md:max-w-md mx-auto opacity-90"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* VISUAL EXPERIENCE SECTION */}
        <section id="experience" className="relative z-10 py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-black text-gray-900 mb-6"
              >
                Your <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Adventure</span> Awaits
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                From takeoff to landing, every moment is picture-perfect. Here's what you'll experience!
              </motion.p>
            </motion.div>

            {/* Experience Steps with Images */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="relative h-64 mb-6 rounded-2xl overflow-hidden shadow-xl group">
                  <img 
                    src={images.feature1} 
                    alt="Cloud Dancer boat"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white text-left w-full">
                      <h3 className="text-2xl font-bold mb-2">1. Board Cloud Dancer</h3>
                      <p className="text-sm">Your adventure begins at the marina</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="relative h-64 mb-6 rounded-2xl overflow-hidden shadow-xl group">
                  <img 
                    src={images.heroImages[0].src} 
                    alt="Parasailing high"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white text-left w-full">
                      <h3 className="text-2xl font-bold mb-2">2. Soar 500 Feet High</h3>
                      <p className="text-sm">Experience breathtaking views</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="relative h-64 mb-6 rounded-2xl overflow-hidden shadow-xl group">
                  <img 
                    src={images.safetyImage} 
                    alt="Happy customers"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white text-left w-full">
                      <h3 className="text-2xl font-bold mb-2">3. Land With Smiles</h3>
                      <p className="text-sm">Memories to last a lifetime</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Optional Dips Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12"
            >
              <motion.h3
                variants={fadeInUp}
                className="text-3xl font-bold text-center mb-8 text-gray-900"
              >
                Want Some Extra Thrills? Try Our Optional Dips! 💦
              </motion.h3>
              <div className="grid md:grid-cols-3 gap-6">
                {images.dipImages.map((img, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-xl overflow-hidden shadow-lg"
                  >
                    <img 
                      src={img} 
                      alt={`Water dip ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <motion.p
                variants={fadeInUp}
                className="text-center mt-6 text-gray-700 text-lg"
              >
                Ask your captain about adding some splashes to your flight!
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* CUSTOMER GALLERY SECTION */}
        <section className="relative z-10 py-24 bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-cyan-900/95">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-black text-white mb-6"
              >
                Join Our <span className="text-amber-400">Happy Flyers</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-blue-200 max-w-3xl mx-auto"
              >
                Every day, we create new memories and capture incredible moments
              </motion.p>
            </motion.div>

            {/* Customer Image Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {images.customerImages.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: [-1, 1, -1] }}
                  className="relative group"
                >
                  <div className="rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src={img} 
                      alt={`Happy customers ${index + 1}`}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-6 text-white">
                        <p className="text-lg font-semibold">Another Amazing Adventure!</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              variants={fadeInUp}
              className="text-center"
            >
              <p className="text-xl text-white mb-6">Ready to be our next happy flyer?</p>
              <button
                onClick={() => window.location.href = '/reservations'}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
              >
                Book Your Adventure Today
              </button>
            </motion.div>
          </div>
        </section>

        {/* SIMPLIFIED PRICING SECTION WITH IMAGES */}
        <section id="pricing" className="relative z-10 py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-black text-gray-900 mb-6"
              >
                <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">LIMITED TIME</span> Pricing
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                💥 Special pricing ends soon! Book now and save!
              </motion.p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              {/* Main Pricing Card with Image Background */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl"
              >
                <img 
                  src={images.heroImages[2].src}
                  alt="Parasailing pricing"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-cyan-900/90"></div>
                
                <div className="relative z-10 p-12 text-white">
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full font-bold text-lg animate-pulse mb-6">
                      SAVE $10+ PER PERSON!
                    </div>
                    
                    <h3 className="text-4xl font-bold mb-6">Parasailing Adventure</h3>
                    
                    <div className="flex justify-center items-center gap-8 mb-8">
                      <div>
                        <p className="text-gray-300 line-through text-2xl">$99</p>
                        <p className="text-6xl font-bold text-amber-400">$89</p>
                        <p className="text-xl">single rider</p>
                      </div>
                      
                      <div className="text-3xl">OR</div>
                      
                      <div>
                        <p className="text-6xl font-bold text-green-400">$75</p>
                        <p className="text-xl">per person</p>
                        <p className="text-lg text-green-300">2+ riders</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-8">
                      {[
                        "10-12 minute flight time",
                        "Up to 500ft altitude",
                        "Professional captain & crew",
                        "All safety equipment",
                        "Boat transportation",
                        "Unforgettable views"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                      onClick={() => window.location.href = '/reservations'}
                    >
                      🚁 BOOK NOW & SAVE
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Add-ons Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">📸 Capture Package</h3>
                    <span className="text-3xl font-bold text-purple-600">$30</span>
                  </div>
                  <p className="text-gray-700 mb-4">Choose Photo OR GoPro package to capture your adventure!</p>
                  <button onClick={() => window.location.href = '/reservations'} className="text-purple-600 font-semibold hover:text-purple-700">
                    Add to Booking →
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">🚤 Ride-Along</h3>
                    <span className="text-3xl font-bold text-blue-600">$30</span>
                  </div>
                  <p className="text-gray-700 mb-4">Enjoy the boat ride without parasailing. Great for photographers!</p>
                  <a href="tel:+14062706256" className="text-blue-600 font-semibold hover:text-blue-700">
                    Call to Book →
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* SCENIC MONTANA SECTION */}
        <section className="relative z-10 py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-black text-gray-900 mb-6"
              >
                Montana's Most <span className="text-blue-600">Spectacular Views</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                From Glacier National Park vistas to Wild Horse Island, experience Montana like never before
              </motion.p>
            </motion.div>

            {/* Scenery Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {images.sceneryImages.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative group rounded-2xl overflow-hidden shadow-xl"
                >
                  <img 
                    src={img} 
                    alt={`Montana scenery ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CANADIAN WELCOME BANNER */}
        <section className="relative z-10 py-16 bg-gradient-to-br from-blue-900/95 via-slate-900/95 to-blue-900/95">
          <div className="container mx-auto px-4 max-w-4xl">
            <CanadianWelcomeBanner />
          </div>
        </section>

        {/* ENHANCED STATS SECTION */}
        <section className="relative z-10 py-16 md:py-20 bg-white overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center"
            >
              {[
                { number: "5,000+", label: "Happy Flyers", icon: "🎈", image: images.safetyImage },
                { number: "100%", label: "Safety Record", icon: "🛡️", image: images.feature1 },
                { number: "5.0★", label: "Google • Yelp • Facebook", icon: "⭐", image: images.heroImages[1].src },
                { number: "20", label: "Years Experience", icon: "🏆", image: images.sceneryImages[0] }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  className="relative bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-10">
                    <img src={stat.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative z-10">
                    <div className="text-2xl md:text-4xl mb-1 md:mb-2">{stat.icon}</div>
                    <div className="text-2xl md:text-4xl font-black text-blue-600 mb-1 md:mb-2">{stat.number}</div>
                    <div className="text-xs md:text-base text-gray-700 font-semibold leading-tight">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ENHANCED TESTIMONIALS WITH IMAGES */}
        <section className="relative z-10 py-24 bg-gradient-to-br from-cyan-600/90 via-blue-600/90 to-purple-600/90">
          <div className="absolute inset-0 opacity-20">
            <img src={images.heroImages[3].src} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  What Our <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Adventurers</span> Say
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Join thousands of thrill-seekers who've experienced the magic of Montana from above
                </p>
              </motion.div>

              {/* Featured testimonial */}
              <motion.div variants={fadeInUp} className="mb-12">
                <Testimonial
                  quote={featuredTestimonial.quote}
                  author={featuredTestimonial.author}
                  location={featuredTestimonial.location}
                  featured={true}
                  image={featuredTestimonial.image}
                />
              </motion.div>

              {/* Grid of testimonials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    whileInView={{ opacity: [0, 1], y: [40, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Testimonial
                      quote={testimonial.quote}
                      author={testimonial.author}
                      location={testimonial.location}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FINAL CTA SECTION WITH IMAGE */}
        <section className="relative z-[50] py-24" style={{ zIndex: 50 }}>
          <div className="absolute inset-0">
            <img 
              src={"https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//alignedAerial.jpg"}
              alt="Book your adventure"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-red-500/90"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-black text-white mb-6"
              >
                Ready for <span className="text-yellow-300">Takeoff?</span>
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-medium"
              >
                Experience Montana's most breathtaking adventure over Flathead Lake's crystal waters.
                <span className="block mt-2 text-yellow-300 font-bold">Book your parasailing flight today!</span>
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
              >
                <motion.button
                  onClick={() => window.location.href = '/reservations'}
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-12 py-6 bg-white text-orange-500 font-black text-2xl rounded-2xl shadow-2xl hover:bg-yellow-100 transition-all duration-300 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    🚁 BOOK YOUR FLIGHT NOW
                    <motion.span
                      animate={{ x: [0, 8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="ml-3 text-3xl"
                    >
                      →
                    </motion.span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>

                <div className="text-white text-center">
                  <div className="text-sm opacity-80">Questions? Call us:</div>
                  <a href="tel:+14062706256" className="text-2xl font-bold hover:text-yellow-300 transition-colors">
                    (406) 270-6256
                  </a>
                </div>
              </motion.div>

              {/* Tip Your Crew Section */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto relative z-[9999]"
                style={{ zIndex: 9999 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  🙌 Show Your Appreciation
                </h3>
                <p className="text-white/90 mb-6">
                  Love your experience? Our crew works hard to make your adventure unforgettable.
                </p>
                <div className="relative z-[9999]" style={{ zIndex: 9999 }}>
                  <TipComponent mode="standalone" className="inline-block relative z-[9999]" />
                </div>
                <p className="text-white/70 text-sm mt-4">
                  🚤 Tips go directly to our hardworking crew members
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FLOATING CTA BUTTON */}
        <FloatingCTA isVisible={showFloatingCTA} />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;