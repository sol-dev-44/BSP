import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer.tsx";
import SEO from "../Components/Seo.tsx";

const charterPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Big Sky Parasail Charter Services",
  "description": "Premium charter services including private tubing, Wild Horse Island tours, and 4th of July fireworks charters on Flathead Lake, Montana.",
  "provider": {
    "@type": "Organization",
    "name": "Big Sky Parasail",
    "telephone": "(406) 270-6256",
    "email": "bigskyparasailing@gmail.com"
  },
  "areaServed": "Flathead Lake, Montana",
  "availableChannel": {
    "@type": "ServiceChannel",
    "servicePhone": "(406) 270-6256",
    "serviceUrl": "https://www.montanaparasail.com/charters"
  }
};

// Image configuration
const images = {
  tubingHero: "/tubing.jpg",
  wildHorseHero: "/wildHorseIsland.jpeg", 
  fireworksHero: "/fourthJuly.jpg",
  chartergallery1: "/WhiteFishSmiles.jpg",
  chartergallery2: "/DaytonaImage.png",
  chartergallery3: "/FlatheadWithShadow.jpg"
};

type CharterCardProps = {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  pricing: string;
  duration: string;
  season: string;
  image: string;
  gradient: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  icon: string;
  delay?: number;
};

const CharterCard: React.FC<CharterCardProps> = ({
  title,
  subtitle,
  description,
  features,
  pricing,
  duration,
  season,
  image,
  gradient,
  borderColor,
  bgColor,
  textColor,
  icon,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-3 ${borderColor} border-t-8 flex flex-col h-full`}
    >
      {/* Card Header with Image */}
      <div className="relative h-64 overflow-hidden">
        <div className={`absolute inset-0 ${gradient} opacity-20 z-10`}></div>
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 z-20">
          <div className={`${bgColor} rounded-full p-3 shadow-lg`}>
            <span className="text-3xl">{icon}</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 z-20">
          <span className={`${bgColor} ${textColor} px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
            {season}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className={`text-lg font-semibold ${textColor} mb-4`}>{subtitle}</p>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>

        {/* Features */}
        <div className="mb-6 flex-grow">
          <h4 className="font-bold text-gray-900 mb-3">What's Included:</h4>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="flex items-center"
              >
                <svg className={`w-5 h-5 ${textColor} mr-3 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
          <div className={`${bgColor} p-4 rounded-xl text-center`}>
            <p className={`text-2xl font-bold ${textColor}`}>{pricing}</p>
            <p className="text-sm text-gray-600">Starting From</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-gray-900">{duration}</p>
            <p className="text-sm text-gray-600">Duration</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="tel:(406) 270-6256"
            className={`flex-1 px-6 py-3 ${gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center flex items-center justify-center`}
          >
            <span className="mr-2">📞</span>
            Call Now
          </a>
          <a
            href="mailto:bigskyparasailing@gmail.com?subject=Charter%20Inquiry%20-%20${title}"
            className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center flex items-center justify-center"
          >
            <span className="mr-2">✉️</span>
            Email
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const ChartersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tubing' | 'island' | 'fireworks'>('tubing');

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

  const charterData = [
    {
      title: "Private Tubing",
      subtitle: "Fun-Filled Water Adventures",
      description: "Experience the excitement of tubing behind our powerful Ocean Pro 31 on Flathead Lake's pristine waters. $500/hour with 3-hour minimum. Perfect for all ages and skill levels!",
      features: [
        "Private group experience (up to 12 guests)",
        "Professional tubing equipment provided",
        "3 hour minimum booking",
        "All safety gear included",
        "Professional captain & crew",
        "Scenic lake cruise included",
        "Multiple tubing sessions for everyone"
      ],
      pricing: "$500/hr",
      duration: "3 Hr Min",
      season: "May - September",
      image: images.tubingHero,
      gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
      borderColor: "border-cyan-500",
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-600",
      icon: "🛟"
    },
    {
      title: "Wild Horse Island Adventure",
      subtitle: "Montana's Hidden Wilderness Paradise",
      description: "Journey to the largest island in Flathead Lake! Choose from morning (8am-12pm) or afternoon (12:15pm-4:15pm) trips to this 2,160-acre state park home to wild horses, bighorn sheep, and pristine hiking trails.",
      features: [
        "Private group experience (up to 12 guests)",
        "Round-trip boat transportation",
        "Wildlife viewing opportunities",
        "Hiking trail access",
        "Swimming and beach time",
        "Snacks and beverages included",
        "Room for your provisions",
        "Professional captain & crew"
      ],
      pricing: "$2,000",
      duration: "4 Hours",
      season: "May - September", 
      image: images.wildHorseHero,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
      borderColor: "border-amber-500",
      bgColor: "bg-amber-100", 
      textColor: "text-amber-600",
      icon: "🏝️"
    },
    {
      title: "4th of July Fireworks Charter",
      subtitle: "Premium Patriotic Celebration",
      description: "Watch Flathead Lake's spectacular fireworks display from the best seats in the house! Our exclusive evening charter (up to 10 passengers) offers unobstructed views and a magical atmosphere.",
      features: [
        "Private group experience (up to 10 guests)",
        "Premium fireworks viewing position",
        "Evening cruise before the show",
        "Appetizers, snacks & beverages included",
        "Patriotic music playlist",
        "Comfortable seating for all guests",
        "4 hour evening experience",
        "Professional captain & crew"
      ],
      pricing: "$4,000",
      duration: "4 Hours",
      season: "July 4th Only",
      image: images.fireworksHero,
      gradient: "bg-gradient-to-br from-red-500 to-pink-600",
      borderColor: "border-red-500", 
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      icon: "🎆"
    }
  ];

  const itineraryData = {
    tubing: {
      title: "Tubing Adventure Timeline",
      steps: [
        { time: "7:45 AM", activity: "Meet at Flathead Harbor Marina", details: "Safety briefing & equipment fitting" },
        { time: "8:15 AM", activity: "Departure & Lake Tour", details: "Scenic cruise to perfect tubing waters" },
        { time: "8:30 AM", activity: "Tubing Sessions Begin", details: "Individual and group tubing runs for all ages" },
        { time: "11:00 AM", activity: "Return to Marina", details: "Final group photos & departure" }
      ]
    },
    island: {
      title: "Wild Horse Island Expedition",
      steps: [
        { time: "8:00 AM", activity: "Morning Departure", details: "Captain's briefing & journey begins (OR 12:15 PM afternoon trip)" },
        { time: "9:00 AM", activity: "Island Arrival", details: "Dock at Wild Horse Island pier" },
        { time: "9:15 AM", activity: "Island Exploration", details: "1.5 hours of wildlife viewing & hiking" },
        { time: "10:30 AM", activity: "Swimming & Provisions", details: "Beach time & enjoy your provisions" },
        { time: "11:00 AM", activity: "Return Journey", details: "Scenic cruise back to marina by 12:00 PM" },
        { time: "12:00 PM", activity: "Return to Marina", details: "Final group photos & departure" }
      ]
    },
    fireworks: {
      title: "4th of July Fireworks Experience",
      steps: [
        { time: "7:45 PM", activity: "Departure from Marina", details: "Evening cruise begins with safety briefing" },
        { time: "8:00 PM", activity: "Dinner & Socializing", details: "Enjoy appetizers, snacks & beverages" },
        { time: "10:00 PM", activity: "Find Fireworks Viewing Spot", details: "Cruise to prime viewing location on the lake" },
        { time: "10:30 PM", activity: "Anchor & Settle In", details: "Get comfortable for the show" },
        { time: "11:00 PM", activity: "Fireworks Spectacular", details: "Front row seats to the show" },
        { time: "11:45 PM", activity: "Return to Marina", details: "Peaceful evening cruise home" }
      ]
    }
  };

  return (
    <>
      <SEO
        title="Charter Services - Big Sky Parasail | Flathead Lake Montana"
        description="Premium charter services on Flathead Lake: private tubing, Wild Horse Island tours, and exclusive 4th of July fireworks charters. Book your custom adventure today!"
        keywords="charter services Montana, Flathead Lake charters, private tubing, Wild Horse Island tours, 4th of July fireworks charter"
        canonicalUrl="https://www.montanaparasail.com/charters"
        ogImage="https://www.montanaparasail.com/HighAerial.jpeg"
        structuredData={charterPageStructuredData}
      />

      <div className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 text-white">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute w-full h-full bg-black opacity-30"></div>
            <img
              src={images.wildHorseHero}
              alt="Charter services on Flathead Lake"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-full h-full"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />
            </div>
          </div>

          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <span className="inline-block bg-gray-900 bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-bold tracking-wide text-yellow-300 shadow-2xl border-2 border-yellow-400">
                  ⭐ EXCLUSIVE EXPERIENCES ⭐
                </span>
              </motion.div>
              
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
              >
                Premium <span className="text-yellow-300">Charter</span>
                <br />
                Adventures
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl mb-8 text-orange-100 leading-relaxed"
              >
                Escape the ordinary with our exclusive charter services. Private tubing, 
                island expeditions, and unforgettable fireworks experiences await!
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <a
                  href="tel:(406) 270-6256"
                  className="px-10 py-5 bg-white hover:bg-gray-100 text-orange-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-2 flex items-center justify-center"
                >
                  <span className="mr-3 text-2xl">📞</span>
                  Call (406) 270-6256
                </a>
                <a
                  href="mailto:bigskyparasailing@gmail.com?subject=Charter%20Inquiry"
                  className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-2 flex items-center justify-center"
                >
                  <span className="mr-3 text-2xl">✉️</span>
                  Email for Quote
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 1440 120"
              animate={{
                x: [-50, 50, -50],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              />
            </motion.svg>
          </div>
        </div>

        {/* Charter Cards Section */}
        <div className="py-24 bg-gray-50">
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
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
              >
                Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Adventure</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-700 max-w-3xl mx-auto"
              >
                Each charter is a custom experience designed around your group's interests and schedule. 
                Book by phone or email for personalized service and pricing.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {charterData.map((charter, index) => (
                <CharterCard
                  key={index}
                  {...charter}
                  delay={index * 0.2}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Itinerary Section */}
        <div className="py-24 bg-white">
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
                className="text-4xl font-bold mb-6 text-gray-900"
              >
                Sample <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Itineraries</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-700 max-w-2xl mx-auto"
              >
                Get a preview of what your charter adventure could look like. All itineraries are fully customizable!
              </motion.p>
            </motion.div>

            {/* Itinerary Tabs */}
            <div className="flex flex-wrap justify-center mb-12 gap-4">
              {Object.entries(itineraryData).map(([key, data]) => (
                <motion.button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:-translate-y-1 ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xl'
                      : 'bg-white text-gray-700 shadow-lg hover:shadow-xl border-2 border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {key === 'tubing' && '🛟 Tubing'}
                  {key === 'island' && '🏝️ Island Adventure'}  
                  {key === 'fireworks' && '🎆 Fireworks'}
                </motion.button>
              ))}
            </div>

            {/* Itinerary Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-2xl">
                <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">
                  {itineraryData[activeTab].title}
                </h3>
                
                <div className="space-y-6">
                  {itineraryData[activeTab].steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start space-x-6 group"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-shadow">
                          {step.time.split(' ')[0]}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{step.activity}</h4>
                        <p className="text-gray-700">{step.details}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Why Choose Our Charters Section */}
        <div className="py-24 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
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
                className="text-4xl font-bold mb-6 text-gray-900"
              >
                Why Charter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Big Sky?</span>
              </motion.h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎯",
                  title: "100% Customizable",
                  description: "Every charter is tailored to your group's preferences, schedule, and adventure level. Your day, your way!",
                  gradient: "from-amber-500 to-orange-600"
                },
                {
                  icon: "👨‍✈️", 
                  title: "Expert Captains",
                  description: "USCG certified captains with 15+ years of local knowledge ensure safe, memorable experiences every time.",
                  gradient: "from-cyan-500 to-blue-600"
                },
                {
                  icon: "🏆",
                  title: "Premium Equipment",
                  description: "Cloud Dancer is the gold standard of charter vessels - commercial-grade safety and luxury comfort.",
                  gradient: "from-pink-500 to-red-600"
                },
                {
                  icon: "📸",
                  title: "Photo Packages",
                  description: "Professional photography available to capture every magical moment of your charter adventure.",
                  gradient: "from-green-500 to-teal-600"
                },
                {
                  icon: "🎁",
                  title: "All-Inclusive Options",
                  description: "We can arrange everything from catering to decorations for special occasions and celebrations.",
                  gradient: "from-purple-500 to-indigo-600"
                },
                {
                  icon: "⭐",
                  title: "VIP Treatment",
                  description: "From arrival to departure, expect 5-star service that exceeds expectations every single time.",
                  gradient: "from-yellow-500 to-orange-600"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-700 text-center leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking CTA Section */}
        <div className="py-24 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="mb-8">
                <span className="text-6xl">🚤</span>
              </motion.div>
              
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold mb-6 text-white"
              >
                Ready to Create <span className="text-yellow-300">Epic Memories?</span>
              </motion.h2>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl mb-10 text-orange-100 leading-relaxed"
              >
                Our charter calendar fills up fast, especially for prime summer dates and holidays. 
                Contact us today to secure your perfect day on Flathead Lake!
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6 justify-center mb-8"
              >
                <a
                  href="tel:(406) 270-6256"
                  className="px-12 py-6 bg-white hover:bg-gray-100 text-orange-600 font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-2 flex items-center justify-center"
                >
                  <span className="mr-3 text-2xl">📞</span>
                  Call (406) 270-6256
                </a>
                <a
                  href="mailto:bigskyparasailing@gmail.com?subject=Charter%20Booking%20Inquiry"
                  className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-2 flex items-center justify-center"
                >
                  <span className="mr-3 text-2xl">✉️</span>
                  Email Us
                </a>
              </motion.div>
              
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
              >
                <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border-2 border-white border-opacity-30">
                  <p className="text-2xl font-bold text-yellow-300 mb-2">24-48 Hours</p>
                  <p className="text-white font-semibold">Quote Response Time</p>
                </div>
                <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border-2 border-white border-opacity-30">
                  <p className="text-2xl font-bold text-yellow-300 mb-2">May - September</p>
                  <p className="text-white font-semibold">Charter Season</p>
                </div>
                <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border-2 border-white border-opacity-30">
                  <p className="text-2xl font-bold text-yellow-300 mb-2">10-12</p>
                  <p className="text-white font-semibold">Max Passengers</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ChartersPage;