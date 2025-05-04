import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Image configuration for easy updates
const images = {
  historyImage: "/HighAerial.jpeg", // History section image
  flatheadImage: "/FlatheadAerial.jpg", // Flathead Lake image
  safetyImage: "/WhiteFishSmiles.jpg", // Safety image
  commitmentImage: "/DaytonaImage.png", // Commitment image
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    } 
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.6 } 
  }
};

const AboutPage = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute w-full h-full bg-black opacity-30"></div>
          {/* Background image */}
          <img 
            src={images.historyImage} 
            alt="Parasailing over Flathead Lake" 
            className="w-full h-full object-cover"
          />
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="10" fill="currentColor" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
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
              ESTABLISHED 2022
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
            >
              About Big Sky Parasail
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl mb-8 text-blue-50"
            >
              Montana's premier parasailing adventure on the breathtaking Flathead Lake
            </motion.p>
          </motion.div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Our History Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="order-2 md:order-1"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl font-bold mb-6 text-gray-900"
              >
                The Birth of Big Sky Parasail
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-gray-700 mb-4"
              >
                Established in 2022, Big Sky Parasail emerged from a vision to showcase Montana's magnificent landscapes from a truly unique perspective. Our founders recognized the untapped potential of Flathead Lake as the perfect setting for world-class parasailing adventures.
              </motion.p>
              <motion.p 
                variants={fadeInUp}
                className="text-gray-700 mb-4"
              >
                With extensive experience in water sports and a deep appreciation for Montana's natural beauty, our team carefully developed an operation centered around safety, accessibility, and unforgettable experiences. We're proud to be the premier parasailing adventure on Montana's largest natural freshwater lake.
              </motion.p>
              <motion.div variants={fadeInUp} className="bg-gray-50 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-blue-600">Guided By Experience</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>USCG certified captains with 15+ years of experience</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Water Sports Industry Association (WSIA) certification</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Perfect safety record from day one</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Montana-based operation, deeply connected to the local community</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl h-full">
                <img 
                  src={images.historyImage} 
                  alt="Big Sky Parasail boat on Flathead Lake" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flathead Lake Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold mb-4 text-gray-900"
            >
              Flathead Lake: Nature's Perfect Stage
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-gray-600 max-w-3xl mx-auto"
            >
              Discover why our unique location offers one of the most spectacular parasailing experiences in the country.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={images.flatheadImage} 
                  alt="Aerial view of Flathead Lake" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 mb-6 shadow-lg">
                <h3 className="text-xl font-bold mb-2 text-blue-600">Montana's Crown Jewel</h3>
                <p className="text-gray-700">
                  Nestled in the heart of northwest Montana, Flathead Lake spans an impressive 197 square miles, making it the largest natural freshwater lake west of the Mississippi. With crystal-clear waters reaching depths of up to 370 feet, this glacial wonder provides the ideal backdrop for your parasailing adventure.
                </p>
              </motion.div>
              <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 mb-6 shadow-lg">
                <h3 className="text-xl font-bold mb-2 text-blue-600">Perfect Flying Conditions</h3>
                <p className="text-gray-700">
                  The lake's pristine waters, consistent summer breezes, and relatively protected position create perfect flying conditions for parasailing adventures. From above, you might spot Wild Horse Island, ancient shorelines, and on clear days, even glimpses of Glacier National Park in the distance.
                </p>
              </motion.div>
              <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-2 text-blue-600">Seasonal Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-amber-500">Spring (May-June)</p>
                    <p className="text-sm text-gray-600">Snowcapped peaks, vibrant green landscapes</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-amber-500">Summer (July-August)</p>
                    <p className="text-sm text-gray-600">Warm temperatures, perfect visibility</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-amber-500">Fall (September-October)</p>
                    <p className="text-sm text-gray-600">Spectacular autumn foliage, peaceful conditions</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeIn} className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>
            <motion.h2 
              variants={fadeIn}
              className="text-3xl font-bold mb-6 text-gray-900 text-center"
            >
              Safety: Our Highest Priority
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-gray-700 mb-8 text-center"
            >
              At Big Sky Parasail, safety isn't just a priority—it's our foundation. Our operation adheres to rigorous industry standards and employs best practices developed from decades of parasailing experience.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={fadeIn} className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3 text-blue-600">Equipment Excellence</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Custom 31' parasail boat designed for Flathead Lake</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>State-of-the-art hydraulic winch system</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Premium harnesses with additional back support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Marine-grade parasail canopies inspected daily</span>
                  </li>
                </ul>
              </motion.div>
              <motion.div variants={fadeIn} className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3 text-blue-600">Professional Standards</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>USCG certified captains with extensive training</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Comprehensive pre-flight safety briefings</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Constant weather monitoring systems</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>CPR and first aid certified crew members</span>
                  </li>
                </ul>
              </motion.div>
            </div>
            
            <motion.div 
              variants={fadeIn}
              className="mt-8 flex justify-center"
            >
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-gray-50 p-4 rounded-lg shadow">
                  <p className="text-2xl font-bold text-amber-500">100%</p>
                  <p className="text-sm text-gray-600">Safety Record</p>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg shadow">
                  <p className="text-2xl font-bold text-amber-500">15+</p>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg shadow">
                  <p className="text-2xl font-bold text-amber-500">Daily</p>
                  <p className="text-sm text-gray-600">Inspections</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold mb-4 text-gray-900"
            >
              Our Commitment to You
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-gray-600 max-w-3xl mx-auto"
            >
              Beyond thrilling adventures, we're dedicated to creating memorable experiences through exceptional service and environmental stewardship.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">Service Excellence</h3>
              <p className="text-gray-700 mb-4 text-center">
                We believe in creating more than just a thrill—we're crafting lasting memories. From your first contact with us to the final landing, our team is dedicated to exceeding your expectations.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">Environmental Stewardship</h3>
              <p className="text-gray-700 mb-4 text-center">
                Flathead Lake's pristine waters and surrounding wilderness are treasures we're committed to preserving. Our operations are designed to minimize environmental impact while promoting appreciation for this unique ecosystem.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">Community Connection</h3>
              <p className="text-gray-700 mb-4 text-center">
                As a Montana-based business, we're proud to be part of the Flathead Valley community. We work closely with local businesses and organizations to create a positive impact beyond our parasailing operations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial Highlight */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto bg-blue-600 text-white rounded-xl p-8 shadow-xl"
          >
            <div className="mb-4 flex justify-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-amber-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-xl italic mb-6 text-center">
              "The most breathtaking experience of our Montana vacation. The views of the mountains and lake were spectacular, and the crew made us feel safe the entire time. Worth every penny!"
            </p>
            <p className="font-semibold text-amber-400 text-center">— Countless Happy Adventurers</p>
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
              Ready to Experience the Thrill?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg mb-8 max-w-2xl mx-auto"
            >
              Book your parasailing adventure today and see Flathead Lake from a perspective few ever will.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link 
                to="/book" 
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-block"
              >
                Book Your Flight
              </Link>
              <p className="mt-4 text-sm text-blue-50">
                Reservations recommended • Limited daily availability
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;