import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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
    "price": "139.00",
    "validFrom": "2025-05-01",
    "url": "https://www.montanaparasail.com/reservations",
  },
};

// Image configuration for easy updates
const images = {
  heroLogo: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//noiredancingbear.png",
  feature1: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//FlatheadAerial.jpg",
  feature2: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//cloudDancerInclineDock.jpg",
  feature3: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//DaytonaImage.png",
  flatheadImage: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//FlatheadWithShadow.jpg",
  safetyImage: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//WhiteFishSmiles.jpg",
};

type TestimonialProps = {
  quote: string;
  author: string;
  location?: string;
  featured?: boolean;
};

const Testimonial: React.FC<TestimonialProps> = (
  { quote, author, location, featured = false },
) => (
  <div
    className={`${
      featured ? "bg-white/95 backdrop-blur-lg p-8 shadow-2xl border border-white/20" : "bg-white/90 backdrop-blur-md p-6 shadow-xl border border-white/10"
    } rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
  >
    <div className="flex mb-4 justify-center">
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
      className={`italic text-gray-700 mb-4 ${
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
      }`}
    >
      — {author}
      {location && `, ${location}`}
    </p>
  </div>
);

// Enhanced floating CTA button
const FloatingCTA: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const navigate = useNavigate();
  
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
            onClick={() => navigate('/reservations')}
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
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle video autoplay with proven mobile technique
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set video loaded when metadata is ready
    const handleLoadedMetadata = () => {
      setIsVideoLoaded(true);
    };

    // Track play/pause state
    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);

    // Attempt autoplay
    const attemptAutoplay = async () => {
      try {
        // Always mute first for mobile compatibility
        video.muted = true;
        video.playsInline = true;
        
        await video.play();
        setIsVideoPlaying(true);
      } catch (error) {
        console.log("Autoplay prevented:", error);
        setIsVideoPlaying(false);
      }
    };

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Try autoplay when ready
    if (video.readyState >= 1) {
      handleLoadedMetadata();
      attemptAutoplay();
    } else {
      video.addEventListener('loadeddata', () => {
        attemptAutoplay();
      });
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // Manual play function for mobile - simplified and more reliable
  const handleManualPlay = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const video = videoRef.current;
    if (!video) return;

    try {
      // Ensure video is muted and inline for mobile
      video.muted = true;
      video.playsInline = true;
      
      // Remove controls to prevent double UI
      video.controls = false;
      
      // Play the video
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsVideoPlaying(true);
      }
    } catch (error) {
      console.error("Manual play failed:", error);
      // As a last resort, show native controls
      if (video) {
        video.controls = true;
      }
    }
  };

  // Show floating CTA after scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCTA(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced testimonials data
  const featuredTestimonial = {
    quote:
      "Absolutely incredible! The views of Flathead Lake and the surrounding mountains were breathtaking. Our captain was so professional and made us feel completely safe. This was the highlight of our Montana vacation!",
    author: "Jennifer & Mike T.",
    location: "Missoula, MT",
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
        {/* VIDEO BACKGROUND CONTAINER */}
        <div className="fixed inset-0 w-full h-full z-0">
          {/* Video Background - Replace src with your video file */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover object-center"
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            poster={images.flatheadImage}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          >
            {/* Replace with your actual video file */}
            <source src="https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//ownBusiness.mp4" type="video/mp4" />
            {/* <source src="/your-badass-video.webm" type="video/webm" /> */}
            {/* Fallback for browsers that don't support video */}
          </video>
          
          {/* Beautiful Loading Placeholder */}
          <AnimatePresence>
            {!isVideoLoaded && (
              <motion.div 
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Background image placeholder */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('${images.flatheadImage}')`,
                  }}
                ></div>
                
                {/* Overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 pointer-events-none"></div>
                
                {/* Animated loading indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    {/* Floating parasail animation */}
                    <motion.div
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-8xl mb-6"
                    >
                      🪂
                    </motion.div>
                    
                    {/* Loading text */}
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-3xl font-bold text-white mb-4"
                    >
                      Preparing Your Adventure...
                    </motion.h3>
                    
                    {/* Animated dots */}
                    <div className="flex justify-center space-x-2">
                      {[0, 1, 2].map((index) => (
                        <motion.div
                          key={index}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: index * 0.2,
                          }}
                          className="w-3 h-3 bg-amber-400 rounded-full"
                        />
                      ))}
                    </div>
                    
                    {/* Subtle tagline */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-blue-100 mt-6 text-lg"
                    >
                      Get ready to soar above Flathead Lake
                    </motion.p>
                  </div>
                </div>
                
                {/* Floating elements for ambiance */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-2xl opacity-20"
                      animate={{
                        y: [100, -50],
                        x: [0, Math.sin(i) * 30],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: Math.random() * 10 + 8,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5,
                      }}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${100 + Math.random() * 20}%`,
                      }}
                    >
                      {['🎈', '☁️', '🏔️', '🌊'][Math.floor(Math.random() * 4)]}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 pointer-events-none" style={{ zIndex: 30 }}></div>
          
          {/* Animated particles overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 31 }}>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                animate={{
                  y: [-20, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Mobile Play Button Overlay - MOVED OUTSIDE VIDEO CONTAINER */}
        {isVideoLoaded && !isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/30 cursor-pointer z-[100]"
            onClick={handleManualPlay}
          >
            <motion.button
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-md rounded-full p-6 md:p-8 border-4 border-white/40 shadow-2xl"
              aria-label="Play video"
            >
              <svg 
                className="w-16 h-16 md:w-20 md:h-20 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.button>
            {isMobile && (
              <p className="absolute bottom-10 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                Tap to play video
              </p>
            )}
          </motion.div>
        )}

        {/* HERO SECTION WITH ENHANCED ENGAGEMENT */}
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
              {/* Main headline with dynamic text */}
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  SOAR
                </span>
                <br />
                <span className="text-white">500 FEET ABOVE</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  MONTANA
                </span>
              </motion.h1>

              {/* Subheadline with value proposition */}
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto font-medium"
              >
                Experience the ULTIMATE adrenaline rush over Flathead Lake's crystal waters. 
                <span className="text-amber-400 font-bold"> Safe. Thrilling. Unforgettable.</span>
              </motion.p>

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
                  onClick={() => navigate('/reservations')}
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
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  📋 View Packages
                </motion.button>
              </motion.div>

              {/* Enhanced logo with animation */}
              <motion.div
                variants={fadeInUp}
                className="relative"
              >
                <motion.img
                  src={images.heroLogo}
                  alt="Big Sky Parasail"
                  className="max-w-xs md:max-w-md mx-auto opacity-90"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl opacity-50"></div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* SIMPLIFIED PRICING SECTION */}
        <section id="pricing" className="relative z-10 py-24 bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-cyan-900/95 backdrop-blur-lg">
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
                Simple <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Pricing</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-blue-200 max-w-3xl mx-auto"
              >
                Straightforward pricing for an unforgettable parasailing experience
              </motion.p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Parasailing Flight */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative p-8 rounded-2xl backdrop-blur-lg border bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50 shadow-2xl shadow-amber-500/25"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">🎈 Parasailing Flight</h3>
                    <div className="text-5xl font-extrabold text-amber-400 mb-2">$99</div>
                    <p className="text-blue-200 text-lg">per person</p>
                    <p className="text-blue-200 text-sm">10-12 minutes flight time</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      "Up to 500ft maximum altitude",
                      "Professional captain & crew",
                      "Complete safety briefing",
                      "All safety equipment provided",
                      "Boat transportation included",
                      "Unforgettable mountain views"
                    ].map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-white"
                      >
                        <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="text-center">
                    <Link to="/reservations">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                      >
                        🚁 Book Your Flight
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>

                {/* Photo/GoPro Add-On */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative p-8 rounded-2xl backdrop-blur-lg border bg-white/10 border-white/20 shadow-xl"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">📸 Capture the Moment</h3>
                    <div className="text-5xl font-extrabold text-amber-400 mb-2">$30</div>
                    <p className="text-blue-200 text-lg">add-on option</p>
                  </div>
                  
                  <div className="space-y-6 mb-8">
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <h4 className="text-white font-semibold mb-2">📷 Photo Package</h4>
                      <p className="text-blue-200 text-sm">Professional photos of your entire flight experience</p>
                    </div>
                    
                    <div className="text-center text-amber-400 font-bold">OR</div>
                    
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <h4 className="text-white font-semibold mb-2">🎬 GoPro Video</h4>
                      <p className="text-blue-200 text-sm">HD action footage of your aerial adventure</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Link to="/reservations">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-8 py-4 bg-white/20 text-white border border-white/30 hover:bg-white/30 font-bold text-lg rounded-xl transition-all duration-300"
                      >
                        Add to Booking
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>

                {/* Ride-Along Option */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative p-8 rounded-2xl backdrop-blur-lg border bg-white/10 border-white/20 shadow-xl"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">🚤 Ride-Along</h3>
                    <div className="text-5xl font-extrabold text-amber-400 mb-2">$30</div>
                    <p className="text-blue-200 text-lg">per passenger</p>
                    <p className="text-blue-200 text-sm">boat ride only</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      "Come along for the boat ride",
                      "Watch others parasail from deck",
                      "Enjoy the lake scenery",
                      "Perfect for non-flyers",
                      "All ages welcome",
                      "Great for photographers"
                    ].map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (index * 0.1) }}
                        className="flex items-center text-white"
                      >
                        <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="bg-amber-500/20 rounded-lg p-4 border border-amber-500/30 mb-6">
                    <p className="text-amber-200 text-center font-semibold text-sm">
                      ⚠️ Must book by phone or email
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <a 
                      href="tel:+14062706256"
                      className="w-full text-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                    >
                      📞 Call (406) 270-6256
                    </a>
                    <a 
                      href="mailto:bigskyparasailing@gmail.com"
                      className="w-full text-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                    >
                      ✉️ Email Us
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CANADIAN WELCOME BANNER */}
        <section className="relative z-10 py-16 bg-gradient-to-br from-blue-900/95 via-slate-900/95 to-blue-900/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 max-w-4xl">
            <CanadianWelcomeBanner />
          </div>
        </section>

        {/* CHARTER SERVICES CTA SECTION */}
        <section className="relative z-10 py-24 bg-gradient-to-br from-purple-600/90 via-indigo-600/90 to-blue-600/90 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Want Something <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Extra Special?</span>
                </h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  Take your adventure to the next level with our premium charter services
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Private Tubing */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl text-center"
                >
                  <div className="text-5xl mb-4">🏄‍♂️</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Private Tubing</h3>
                  <p className="text-blue-200 mb-4">
                    Exclusive boat charter for your group's tubing adventure
                  </p>
                  <div className="text-3xl font-bold text-amber-400 mb-2">Starting at $1,600</div>
                  <p className="text-blue-200 text-sm">4 hours • Up to 12 guests</p>
                </motion.div>

                {/* Wild Horse Island */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl text-center"
                >
                  <div className="text-5xl mb-4">🏝️</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Wild Horse Island</h3>
                  <p className="text-blue-200 mb-4">
                    Private tours to Montana's famous Wild Horse Island
                  </p>
                  <div className="text-3xl font-bold text-amber-400 mb-2">$2,000</div>
                  <p className="text-blue-200 text-sm">4 hours • Up to 12 guests</p>
                </motion.div>

                {/* Fireworks Charter */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl text-center"
                >
                  <div className="text-5xl mb-4">🎆</div>
                  <h3 className="text-2xl font-bold text-white mb-4">July 4th Fireworks</h3>
                  <p className="text-blue-200 mb-4">
                    Premium fireworks viewing from the best seats on the lake
                  </p>
                  <div className="text-3xl font-bold text-amber-400 mb-2">$4,000</div>
                  <p className="text-blue-200 text-sm">4 hours • Up to 10 guests</p>
                </motion.div>
              </div>

              <motion.div variants={fadeInUp} className="text-center">
                <Link to="/charters">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-12 py-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-2xl rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 relative overflow-hidden mb-6"
                  >
                    <span className="relative z-10 flex items-center">
                      🛥️ EXPLORE CHARTER OPTIONS
                      <motion.span
                        animate={{ x: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="ml-3 text-3xl"
                      >
                        →
                      </motion.span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </Link>
                
                <p className="text-blue-200 max-w-2xl mx-auto">
                  All charters are fully customizable and include professional crew, safety equipment, and unforgettable memories. 
                  <span className="text-amber-400 font-semibold"> Contact us for custom quotes!</span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ENHANCED STATS SECTION WITH ANIMATION */}
        <section className="relative z-10 py-16 md:py-20 bg-white/95 backdrop-blur-lg overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center"
            >
              {[
                { number: "5,000+", label: "Happy Flyers", icon: "🎈" },
                { number: "100%", label: "Safety Record", icon: "🛡️" },
                { number: "5.0★", label: "Google • Yelp • Facebook", icon: "⭐" },
                { number: "20", label: "Years Experience", icon: "🏆" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100"
                >
                  <div className="text-2xl md:text-4xl mb-1 md:mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-4xl font-black text-blue-600 mb-1 md:mb-2">{stat.number}</div>
                  <div className="text-xs md:text-base text-gray-700 font-semibold leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ENHANCED TESTIMONIALS WITH BETTER DESIGN */}
        <section className="relative z-10 py-24 bg-gradient-to-br from-cyan-600/90 via-blue-600/90 to-purple-600/90 backdrop-blur-lg">
          <div className="container mx-auto px-4">
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

        {/* FINAL CTA SECTION */}
        <section className="relative z-[50] py-24 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" style={{ zIndex: 50 }}>
          <div className="container mx-auto px-4 text-center">
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
                  onClick={() => navigate('/reservations')}
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