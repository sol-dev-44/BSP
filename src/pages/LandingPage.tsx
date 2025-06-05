import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer.tsx";
import SEO from "../Components/Seo.tsx";

const landingPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Big Sky Parasail",
  "description":
    "Experience Montana's premier parasailing adventure on Flathead Lake. Safe, thrilling parasail rides with breathtaking mountain views.",
  "image": "https://www.montanaparasail.com/WhiteFishSmiles.jpg",
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
  heroLogo: "/JerryBearLogo.png",
  feature1: "/FlatheadAerial.jpg",
  feature2: "/cloudDancerInclineDock.jpg",
  feature3: "/DaytonaImage.png",
  flatheadImage: "/FlatheadWithShadow.jpg",
  safetyImage: "/WhiteFishSmiles.jpg",
};

type TestimonialProps = {
  quote: string;
  author: string;
  location?: string;
  featured?: boolean;
};

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, location, featured = false }) => (
  <div className={`${featured ? 'bg-white p-8 shadow-xl' : 'bg-white p-6 shadow-lg'} rounded-2xl hover:shadow-xl transition-shadow`}>
    <div className="flex mb-4 justify-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${featured ? 'w-6 h-6' : 'w-5 h-5'} text-amber-500 fill-current`}
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
    <p className={`italic text-gray-700 mb-4 ${featured ? 'text-xl text-center' : 'text-center'}`}>"{quote}"</p>
    <p className={`${featured ? 'text-center font-semibold text-blue-600' : 'text-sm font-semibold text-center'}`}>
      — {author}{location && `, ${location}`}
    </p>
  </div>
);

const LandingPage: React.FC = () => {
  // Enhanced testimonials data
  const featuredTestimonial = {
    quote: "Absolutely incredible! The views of Flathead Lake and the surrounding mountains were breathtaking. Our captain was so professional and made us feel completely safe. This was the highlight of our Montana vacation!",
    author: "Jennifer & Mike T.",
    location: "Missoula, MT",
  };

  const testimonials = [
    {
      quote: "My kids loved it! Even my husband with his fear of heights had a blast. We'll be back next year!",
      author: "Sarah J.",
      location: "Bozeman, MT",
    },
    {
      quote: "The most amazing experience of our vacation! Views were incredible and the staff made us feel completely safe.",
      author: "Mark R.",
      location: "Seattle, WA",
    },
    {
      quote: "Worth every penny! The photo package captured memories we'll treasure forever.",
      author: "Lisa M.",
      location: "Denver, CO",
    },
    {
      quote: "Professional, safe, and absolutely thrilling. Can't wait to bring friends back!",
      author: "David K.",
      location: "Spokane, WA",
    }
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
        keywords="parasailing Montana, Flathead Lake parasailing, Montana water sports, parasail adventure, Lakeside Montana"
        canonicalUrl="https://www.montanaparasail.com"
        ogImage="https://www.montanaparasail.com/WhiteFishSmiles.jpg"
        structuredData={landingPageStructuredData}
      />
      <div className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute w-full h-full bg-black opacity-30"></div>
            <img
              src={"/HighAerial.jpeg"}
              alt="Parasailing over Flathead Lake"
              className="w-full h-full object-cover"
            />
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
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerChildren}
                  className="max-w-xl"
                >
                  <motion.p
                    variants={fadeInUp}
                    className="text-amber-400 font-bold tracking-widest mb-2"
                  >
                    BIG SKY PARASAIL CO.
                  </motion.p>
                  <motion.h1
                    variants={fadeInUp}
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
                  >
                    Soar Above <br />
                    <span className="text-amber-400">Flathead Lake</span>
                  </motion.h1>
                  <motion.p
                    variants={fadeInUp}
                    className="text-lg md:text-xl mb-8 text-blue-50"
                  >
                    Experience breathtaking views from 300 feet above Montana's
                    crystal waters on our safe, thrilling parasailing
                    adventures.
                  </motion.p>
                  <motion.div
                    variants={fadeInUp}
                    className="flex flex-wrap gap-4"
                  >
                    <Link
                      to="/reservations"
                      className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                      Book Your Flight
                    </Link>
                    <Link
                      to="/about"
                      className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all"
                    >
                      Learn More
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-20 blur-2xl">
                  </div>
                  <motion.img
                    src={images.heroLogo}
                    alt="Big Sky Parasail"
                    className="relative z-10 max-w-sm md:max-w-md"
                    animate={{
                      y: [0, -15, 0],
                      transition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>

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

        {/* Stats Section - NEW */}
        <div className="py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              <motion.div variants={fadeInUp} className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-3xl font-bold text-amber-500">5,000+</p>
                <p className="text-gray-600">Happy Flyers</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-3xl font-bold text-blue-600">300ft</p>
                <p className="text-gray-600">Max Height</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-3xl font-bold text-amber-500">100%</p>
                <p className="text-gray-600">Safety Record</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-3xl font-bold text-blue-600">Since 2022</p>
                <p className="text-gray-600">Serving Montana</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="py-20 bg-gray-50">
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
                className="text-3xl font-bold mb-4 text-gray-900"
              >
                The Ultimate Parasailing Experience
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="max-w-2xl mx-auto text-gray-600"
              >
                Discover why Big Sky Parasail offers Montana's most breathtaking and safest aerial adventures.
              </motion.p>
            </motion.div>

            {/* Feature 1 - Breathtaking Views */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
            >
              <motion.div variants={fadeInUp} className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={images.feature1} alt="Breathtaking aerial views" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Breathtaking 360° Views</h3>
                <p className="text-gray-700 mb-6">
                  Soar 300 feet above Flathead Lake's crystal waters and experience panoramic mountain views that stretch for miles. On clear days, you can see all the way to Glacier National Park's majestic peaks!
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-blue-800 font-semibold">✨ Perfect for photography enthusiasts and Instagram content!</p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>197 square miles of pristine lake views</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Panoramic mountain ranges in every direction</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>

            {/* Feature 2 - Cloud Dancer */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
            >
              <motion.div variants={fadeInUp} className="order-2 md:order-1">
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Meet Cloud Dancer</h3>
                <p className="text-gray-700 mb-6">
                  Our state-of-the-art Ocean Pro 31 - the heavyweight champion of parasail vessels. Built specifically for commercial parasailing with unmatched reliability, safety features, and comfort.
                </p>
                <div className="bg-amber-50 p-4 rounded-lg mb-6">
                  <p className="text-amber-800 font-semibold">🚤 The gold standard in parasailing vessels!</p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Hydraulic winch system for the smoothest flights</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>USCG certified captains with 15+ years experience</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Commercial-grade safety equipment throughout</span>
                  </li>
                </ul>
              </motion.div>
              <motion.div variants={fadeInUp} className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-2xl">
                <img src={images.feature2} alt="Cloud Dancer parasail boat" className="w-full h-full object-cover" />
              </motion.div>
            </motion.div>

            {/* Feature 3 - Photo Packages */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={fadeInUp} className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={images.feature3} alt="Professional photo packages" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Capture Every Moment</h3>
                <p className="text-gray-700 mb-6">
                  Don't just experience the thrill - take it home with you! Our professional photo packages capture your incredible parasailing adventure with high-quality images you'll treasure forever.
                </p>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-green-800 font-semibold">📸 Professional photos included with every flight!</p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>High-resolution digital photos</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Multiple angles and perspectives</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Instant digital delivery</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Flathead Lake Experience Section - NEW */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Montana's Crown Jewel</h2>
                <p className="text-gray-700 mb-6">
                  Flathead Lake is the largest natural freshwater lake west of the Mississippi, spanning 197 square miles of crystal-clear waters. From 300 feet up, you'll witness views that few people ever get to see - a perspective that transforms your understanding of Montana's raw beauty.
                </p>
                <p className="text-gray-700 mb-6">
                  Our unique location offers unparalleled flying conditions with consistent summer breezes, protected waters, and some of the most spectacular mountain backdrops in North America.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="font-bold text-blue-600">197 sq miles</p>
                    <p className="text-sm text-gray-600">Lake surface area</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="font-bold text-blue-600">370 feet</p>
                    <p className="text-sm text-gray-600">Maximum depth</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="font-bold text-blue-600">300 feet</p>
                    <p className="text-sm text-gray-600">Your flight height</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="font-bold text-blue-600">Glacier Views</p>
                    <p className="text-sm text-gray-600">On clear days</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="rounded-2xl overflow-hidden shadow-2xl"
              >
                <img src={images.flatheadImage} alt="Flathead Lake aerial view" className="w-full h-full object-cover" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Why Choose Us Section - NEW */}
        <div className="py-20 bg-gray-50">
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
                className="text-3xl font-bold mb-4 text-gray-900"
              >
                Why Choose Big Sky Parasail?
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                We're not just another water sports company - we're Montana's premier parasailing experts with an unwavering commitment to your safety and experience.
              </motion.p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 text-center">Unmatched Safety Record</h3>
                <p className="text-gray-700 text-center mb-4">
                  100% perfect safety record since day one. Our USCG certified captains have 15+ years of parasailing experience and adhere to the highest industry standards.
                </p>
                <div className="text-center">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Perfect Safety Record</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="rounded-full bg-amber-100 w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 text-center">Premium Equipment</h3>
                <p className="text-gray-700 text-center mb-4">
                  Our Ocean Pro 31 "Cloud Dancer" is the heavyweight champion of parasail vessels, featuring state-of-the-art hydraulic systems and commercial-grade safety equipment.
                </p>
                <div className="text-center">
                  <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">Commercial Grade</span>
                </div>
              </motion.div>

       <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="rounded-full bg-cyan-100 w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm-2 5V6a2 2 0 114 0v1H8zm5 3a1 1 0 11-2 0 1 1 0 012 0zM7 10a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 text-center">Exceptional Service</h3>
                <p className="text-gray-700 text-center mb-4">
                  From booking to landing, we're dedicated to exceeding expectations. Personalized attention, flexible scheduling, and a commitment to making your adventure unforgettable.
                </p>
                <div className="text-center">
                  <span className="inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-semibold">5-Star Service</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Testimonials Section */}
        <div className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">What Our Adventurers Say</h2>
                <p className="text-blue-100 max-w-2xl mx-auto">
                  Don't just take our word for it - hear from the thousands of guests who've experienced the magic of parasailing over Flathead Lake.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* CTA Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-bold mb-6 text-gray-900"
              >
                Ready for Takeoff?
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="max-w-2xl mx-auto mb-8 text-lg text-gray-700"
              >
                Book your parasailing adventure today and create memories that
                will last a lifetime. Experience Montana like never before!
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/reservations"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-block"
                >
                  Book Your Flight
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-block"
                >
                  Learn More About Us
                </Link>
              </motion.div>
              <motion.p variants={fadeInUp} className="mt-6 text-sm text-gray-500">
                📞 (406) 270-6256 | May-September: Daily 9am-7pm | Reservations recommended
              </motion.p>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;