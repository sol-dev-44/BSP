import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

// Updated color constants with more teal dark colors
const YELLOW = "#FFD700"; // Bright yellow for primary brand color
const TEAL = "#40E0D0"; // Vibrant teal
const LIGHT_TEAL = "#7FFFD4"; // Lighter teal (Aquamarine)
const DARK_TEAL = "#20B2AA"; // Dark teal (LightSeaGreen)
const DEEP_TEAL = "#008080"; // Deep teal (Teal)
const WHITE = "#FFFFFF"; // White for text and contrast
const SAND = "#F5F5DC"; // Light sand color for subtle elements
const OFF_WHITE = "#F0F0F0"; // Off-white for text on darker backgrounds

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const slideUp = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
};

const slideLeft = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const slideRight = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

// Added subtle animation for buttons and interactive elements
const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity },
};

const LearnMorePage = () => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200]);
  const parallaxY1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  // References for sections to check if they're in view
  const experienceRef = useRef(null);
  const safetyRef = useRef(null);
  const locationRef = useRef(null);
  const testimonialRef = useRef(null);

  const experienceInView = useInView(experienceRef, {
    once: true,
    amount: 0.3,
  });
  const safetyInView = useInView(safetyRef, { once: true, amount: 0.3 });
  const locationInView = useInView(locationRef, { once: true, amount: 0.3 });
  const testimonialInView = useInView(testimonialRef, {
    once: true,
    amount: 0.3,
  });

  const [activeTab, setActiveTab] = useState("experience");

  // Auto-scroll to the appropriate section on load based on URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const section = hash.substring(1); // remove the # from the hash
      if (section === "experience" && experienceRef.current) {
        setActiveTab("experience");
        experienceRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (section === "safety" && safetyRef.current) {
        setActiveTab("safety");
        safetyRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (section === "location" && locationRef.current) {
        setActiveTab("location");
        locationRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (section === "testimonials" && testimonialRef.current) {
        setActiveTab("testimonial");
        testimonialRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-900 to-teal-900 text-white">
      {/* Parallax Hero Section */}
      <motion.div
        className="fixed top-0 left-0 right-0 bottom-0 -z-10"
        style={{ y: backgroundY }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url("/FlatheadAerial1.jpg")',
            filter: "brightness(0.8)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-teal-900 to-black opacity-50">
          </div>
        </div>
      </motion.div>

      {/* Hero Content - Enhanced with more dramatic text effects */}
      <div className="relative h-[60vh] flex flex-col items-center justify-center text-center px-2">
        <motion.div
          className="z-10"
          style={{ y: parallaxY1, opacity }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-wider"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            THE{" "}
            <span
              style={{
                color: YELLOW,
                textShadow: "0px 0px 15px rgba(255, 215, 0, 0.5)",
              }}
            >
              PARASAILING
            </span>{" "}
            EXPERIENCE
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-2"
            style={{ color: SAND }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Soar above Montana's most beautiful lake
          </motion.p>
          {/* Added CTA button in hero section */}
          <motion.button
            className="mt-8 px-6 py-3 text-lg font-bold rounded-full transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: YELLOW, color: "#000" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            BOOK YOUR ADVENTURE
          </motion.button>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div
            className="bg-white bg-opacity-30 p-2 rounded-full"
            initial={{ y: -10 }}
            animate={{ y: 10 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
            }}
          >
            <span className="block text-white">↓</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation Tabs - Enhanced with better contrast and interaction states */}
      <div
        className="sticky top-0 z-50"
        style={{
          backgroundColor: `rgba(0, 64, 64, 0.9)`,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3 no-scrollbar">
            <button
              className={`px-6 py-2 mr-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === "experience"
                  ? `bg-yellow-400 text-black font-bold shadow-md`
                  : "bg-transparent text-white hover:bg-teal-800"
              }`}
              onClick={() => {
                setActiveTab("experience");
                experienceRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              The Experience
            </button>
            <button
              className={`px-6 py-2 mr-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === "safety"
                  ? `bg-yellow-400 text-black font-bold shadow-md`
                  : "bg-transparent text-white hover:bg-teal-800"
              }`}
              onClick={() => {
                setActiveTab("safety");
                safetyRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Safety & Requirements
            </button>
            <button
              className={`px-6 py-2 mr-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === "location"
                  ? `bg-yellow-400 text-black font-bold shadow-md`
                  : "bg-transparent text-white hover:bg-teal-800"
              }`}
              onClick={() => {
                setActiveTab("location");
                locationRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Our Location
            </button>
            <button
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === "testimonial"
                  ? `bg-yellow-400 text-black font-bold shadow-md`
                  : "bg-transparent text-white hover:bg-teal-800"
              }`}
              onClick={() => {
                setActiveTab("testimonial");
                testimonialRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Guest Experiences
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-transparent to-teal-900">
        <div className="container mx-auto">
          {/* The Experience Section */}
          <section
            ref={experienceRef}
            className="py-16 px-4 min-h-screen flex flex-col justify-center"
            id="experience"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              initial="hidden"
              animate={experienceInView ? "visible" : "hidden"}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={slideRight}>
                <h2
                  className="text-4xl font-bold mb-6 tracking-wide"
                  style={{
                    color: YELLOW,
                    textShadow: "0px 0px 10px rgba(255, 215, 0, 0.3)",
                  }}
                >
                  THE ULTIMATE AERIAL ADVENTURE
                </h2>
                <p className="text-lg mb-6">
                  Experience the thrill of soaring up to 500 feet above the
                  crystal-clear waters of Flathead Lake, Montana's largest
                  natural freshwater lake. Our state-of-the-art parasailing
                  equipment provides a smooth, exhilarating ride with
                  breathtaking 360° panoramic views of the Mission Mountains,
                  Wild Horse Island, and the surrounding pristine wilderness.
                </p>
                <p className="text-lg mb-6">
                  Whether you're seeking an adrenaline-pumping adventure or
                  peaceful moments suspended above the sapphire waters, our
                  highly-trained crew will customize your parasailing experience
                  to your desired comfort level. With over 15 years of
                  experience and a perfect safety record, we ensure every flight
                  delivers unforgettable memories.
                </p>
                <p className="text-lg mb-8">
                  No experience necessary! Our professional instructors provide
                  comprehensive pre-flight training and handle all technical
                  aspects, allowing you to simply relax and enjoy the incredible
                  sensation of flight. All ages welcome—we've safely flown
                  adventurers from 6 to 86 years old!
                </p>
                <div className="flex flex-col md:flex-row md:space-x-6 mb-8">
                  <div className="md:w-1/2">
                    <h3
                      className="text-2xl font-semibold mb-4"
                      style={{ color: TEAL }}
                    >
                      Flight Highlights
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <span
                          className="inline-block w-6 h-6 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: TEAL }}
                        >
                        </span>
                        <span>10+ minute flight time</span>
                      </li>
                      <li className="flex items-center">
                        <span
                          className="inline-block w-6 h-6 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: TEAL }}
                        >
                        </span>
                        <span>
                          Solo, tandem, or triple flights available (up to 450
                          lbs combined)
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span
                          className="inline-block w-6 h-6 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: TEAL }}
                        >
                        </span>
                        <span>
                          Dry takeoffs and landings from our custom 31' parasail
                          boat
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span
                          className="inline-block w-6 h-6 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: TEAL }}
                        >
                        </span>
                        <span>
                          Optional GoPro photo/video package with digital
                          delivery
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="md:w-1/2 mt-6 md:mt-0">
                    <h3
                      className="text-2xl font-semibold mb-4"
                      style={{ color: TEAL }}
                    >
                      Premium Features
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <span
                          className="inline-block w-6 h-6 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: TEAL }}
                        >
                        </span>
                        <span>
                          USCG certified captain and trained crew members
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span
                          className="inline-block w-6 h-6 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: TEAL }}
                        >
                        </span>
                        <span>
                          Custom-designed harnesses with additional back support
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span
                          className="inline-block w-6 h-6 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: TEAL }}
                        >
                        </span>
                        <span>
                          Optional water dips available for thrill-seekers
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span
                          className="inline-block w-6 h-6 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: TEAL }}
                        >
                        </span>
                        <span>
                          Complimentary bottled water and light snacks onboard
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bg-teal-900 bg-opacity-70 p-6 rounded-lg mb-8 shadow-lg border border-teal-800">
                  <h3
                    className="text-2xl font-semibold mb-4"
                    style={{ color: YELLOW }}
                  >
                    Seasonal Highlights
                  </h3>
                  <p className="text-lg mb-4 text-white">
                    <span
                      className="font-semibold"
                      style={{ color: LIGHT_TEAL }}
                    >
                      Spring (May-June):
                    </span>{" "}
                    Experience the snowcapped mountains and vibrant green
                    landscapes during our early season flights.
                  </p>
                  <p className="text-lg mb-4 text-white">
                    <span
                      className="font-semibold"
                      style={{ color: LIGHT_TEAL }}
                    >
                      Summer (July-August):
                    </span>{" "}
                    Enjoy perfect flying conditions with warm temperatures and
                    crystal-clear visibility.
                  </p>
                  <p className="text-lg text-white">
                    <span
                      className="font-semibold"
                      style={{ color: LIGHT_TEAL }}
                    >
                      Fall (September-October):
                    </span>{" "}
                    Witness the spectacular autumn foliage transforming the
                    surrounding mountains.
                  </p>
                </div>
                <div className="flex justify-center">
                  <motion.button
                    className="px-8 py-4 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
                    style={{ backgroundColor: YELLOW, color: "#000" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={pulseAnimation}
                  >
                    BOOK YOUR FLIGHT TODAY
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                variants={slideLeft}
                className="relative h-96 md:h-full rounded-lg overflow-hidden shadow-2xl"
              >
                <img
                  src="/FlatheadAerial1.jpg"
                  alt="Parasailing over Flathead Lake"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-transparent to-transparent opacity-60">
                </div>

                <motion.div
                  className="absolute bottom-6 right-6 p-4 rounded-lg shadow-lg"
                  style={{ backgroundColor: `rgba(0, 96, 96, 0.9)` }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <p
                    className="text-2xl font-bold mb-1"
                    style={{ color: YELLOW }}
                  >
                    From $99
                  </p>
                  <p className="text-sm text-gray-200">Per person</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </section>

          {/* Safety Section - Enhanced with better visuals and organization */}
          <section
            ref={safetyRef}
            className="py-16 px-4 min-h-screen flex flex-col justify-center"
            style={{ backgroundColor: `rgba(0, 96, 96, 0.2)` }}
            id="safety"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              initial="hidden"
              animate={safetyInView ? "visible" : "hidden"}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <motion.div
                variants={slideRight}
                className="order-2 md:order-1 relative h-96 md:h-full rounded-lg overflow-hidden shadow-2xl"
              >
                <img
                  src="/FlatheadAerial1.jpg"
                  alt="Parasailing safety equipment"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-transparent to-transparent opacity-60">
                </div>

                {/* Added safety certification badge */}
                <div className="absolute top-6 left-6 w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-xs font-bold text-teal-800">
                      CERTIFIED
                    </div>
                    <div className="text-lg font-bold text-teal-900">
                      SAFETY
                    </div>
                    <div className="text-xs font-bold text-teal-800">
                      STANDARD
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div variants={slideLeft} className="order-1 md:order-2">
                <h2
                  className="text-4xl font-bold mb-6 tracking-wide"
                  style={{
                    color: YELLOW,
                    textShadow: "0px 0px 10px rgba(255, 215, 0, 0.3)",
                  }}
                >
                  SAFETY FIRST, ALWAYS
                </h2>
                <p className="text-lg mb-6">
                  Your safety is our top priority. Our USCG-certified captains
                  and highly trained crew follow strict safety protocols and use
                  only top-quality equipment that's inspected daily. Every
                  component of our parasailing system exceeds industry safety
                  standards and is regularly maintained by certified
                  professionals.
                </p>

                <div
                  style={{ backgroundColor: `rgba(0, 64, 64, 0.7)` }}
                  className="p-6 rounded-lg mb-8 border border-teal-700 shadow-lg"
                >
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ color: LIGHT_TEAL }}
                  >
                    Requirements For Your Adventure
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div
                        className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: TEAL }}
                      >
                        <span className="text-teal-900 font-bold">✓</span>
                      </div>
                      <span>
                        Weight: 40-450 lbs combined weight for groups (per
                        flight)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div
                        className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: TEAL }}
                      >
                        <span className="text-teal-900 font-bold">✓</span>
                      </div>
                      <span>
                        Age: 6+ years (children under 12 must fly with an adult)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div
                        className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: TEAL }}
                      >
                        <span className="text-teal-900 font-bold">✓</span>
                      </div>
                      <span>
                        Health: Not recommended for pregnant women or those with
                        certain medical conditions (heart problems, severe back
                        issues)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div
                        className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: TEAL }}
                      >
                        <span className="text-teal-900 font-bold">✓</span>
                      </div>
                      <span>
                        Swimming ability: Not required (life vests provided and
                        worn at all times)
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Updated safety statistics with improved layout */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg text-center shadow-md border border-teal-700 hover:bg-teal-700 hover:bg-opacity-40 transition-all duration-300">
                    <p className="text-3xl font-bold" style={{ color: YELLOW }}>
                      100%
                    </p>
                    <p className="text-sm">Safety Record</p>
                  </div>
                  <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg text-center shadow-md border border-teal-700 hover:bg-teal-700 hover:bg-opacity-40 transition-all duration-300">
                    <p className="text-3xl font-bold" style={{ color: YELLOW }}>
                      15+
                    </p>
                    <p className="text-sm">Years Experience</p>
                  </div>
                  <div className="bg-teal-800 bg-opacity-50 p-4 rounded-lg text-center shadow-md border border-teal-700 hover:bg-teal-700 hover:bg-opacity-40 transition-all duration-300">
                    <p className="text-3xl font-bold" style={{ color: YELLOW }}>
                      Daily
                    </p>
                    <p className="text-sm">Inspections</p>
                  </div>
                </div>

                {/* Safety Video Section */}
                <div className="mb-8">
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ color: LIGHT_TEAL }}
                  >
                    See Our Safety Procedures In Action
                  </h3>

                  <div
                    className="relative rounded-lg overflow-hidden shadow-xl border border-teal-700"
                    style={{ paddingTop: "56.25%" }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/MRdWd5ANohY?rel=0"
                      title="Parasailing Safety Procedures"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    >
                    </iframe>
                  </div>

                  <p className="mt-4 text-sm text-center text-gray-300 italic">
                    Watch how our professional team ensures your safety from
                    preparation to landing
                  </p>
                </div>

                {/* Additional Safety Information */}
                <div className="bg-teal-900 bg-opacity-40 p-6 rounded-lg mb-8 shadow-lg border border-teal-800">
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: YELLOW }}
                  >
                    Our Safety Commitment
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="text-yellow-400 mr-2">•</div>
                      <span>
                        Regular equipment inspection & maintenance by certified
                        technicians
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-yellow-400 mr-2">•</div>
                      <span>
                        Comprehensive weather monitoring before and during each
                        flight
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-yellow-400 mr-2">•</div>
                      <span>
                        All staff trained in CPR, First Aid, and water rescue
                        techniques
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-yellow-400 mr-2">•</div>
                      <span>
                        Full compliance with all USCG and industry safety
                        regulations
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* Location Section - Enhanced with better visuals and information organization */}
          <section
            ref={locationRef}
            className="py-16 px-4 min-h-screen flex flex-col justify-center"
            id="location"
          >
            <motion.div variants={slideRight}>
              <h2
                className="text-4xl font-bold mb-6 tracking-wide"
                style={{
                  color: YELLOW,
                  textShadow: "0px 0px 10px rgba(255, 215, 0, 0.3)",
                }}
              >
                OUR FLATHEAD LAKE LOCATION
              </h2>
              <p className="text-lg mb-6">
                We operate from the scenic Flathead Harbor Marina (Slip E4) on
                the western shore of Flathead Lake, Montana's largest natural
                freshwater lake and one of the cleanest in the world. Surrounded
                by four ranges of the Rocky Mountains and just 40 miles from
                Glacier National Park, our location offers the perfect base for
                your Montana adventure.
              </p>
              <p className="text-lg mb-6">
                From the air, you'll enjoy spectacular views of the Mission
                Mountains to the east, the Swan Range to the northeast, the
                Salish Mountains to the west, and the crystal-clear waters that
                make Flathead Lake famous. On clear days, you might even catch a
                glimpse of Glacier National Park in the distance!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-teal-900 bg-opacity-50 p-6 rounded-lg shadow-lg border border-teal-800">
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: YELLOW }}
                  >
                    FLATHEAD HARBOR AMENITIES
                  </h3>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                    <div className="flex items-start">
                      <div
                        className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: TEAL }}
                      >
                        <span className="text-teal-900 font-bold">🍽️</span>
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: LIGHT_TEAL }}
                        >
                          Harbor Grille
                        </p>
                        <p className="text-sm">Waterfront dining</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div
                        className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: TEAL }}
                      >
                        <span className="text-teal-900 font-bold">🏨</span>
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: LIGHT_TEAL }}
                        >
                          Lodging
                        </p>
                        <p className="text-sm">Cabins & RV park</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div
                        className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: TEAL }}
                      >
                        <span className="text-teal-900 font-bold">🎵</span>
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: LIGHT_TEAL }}
                        >
                          Live Music
                        </p>
                        <p className="text-sm">At Anchor Bar</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div
                        className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: TEAL }}
                      >
                        <span className="text-teal-900 font-bold">⛽</span>
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: LIGHT_TEAL }}
                        >
                          Marina Services
                        </p>
                        <p className="text-sm">Fuel & boat parking</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div
                        className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: TEAL }}
                      >
                        <span className="text-teal-900 font-bold">🚣</span>
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: LIGHT_TEAL }}
                        >
                          Boat Tours
                        </p>
                        <p className="text-sm">Scenic lake cruises</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div
                        className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: TEAL }}
                      >
                        <span className="text-teal-900 font-bold">🅿️</span>
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: LIGHT_TEAL }}
                        >
                          Parking
                        </p>
                        <p className="text-sm">Ample & free</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-900 bg-opacity-50 p-6 rounded-lg shadow-lg border border-teal-800">
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: YELLOW }}
                  >
                    HARBOR GRILLE
                  </h3>
                  <p
                    className="italic mb-3 text-white text-center"
                    style={{ color: LIGHT_TEAL }}
                  >
                    "The only thing better than the view, is the food!"
                  </p>
                  <p className="mb-4">
                    Make a day of your parasailing adventure by enjoying
                    waterfront dining at Harbor Grille. Offering casual American
                    cuisine, cocktails, and unbeatable lake views from their
                    large patio.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: LIGHT_TEAL }}
                      >
                        Hours:
                      </p>
                      <p className="text-sm">Sun-Thu: 11am-8pm</p>
                      <p className="text-sm">Fri-Sat: 11am-9pm</p>
                    </div>
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: LIGHT_TEAL }}
                      >
                        Features:
                      </p>
                      <p className="text-sm">• Anchor Bar</p>
                      <p className="text-sm">• 6 TV screens</p>
                      <p className="text-sm">• Free Wi-Fi</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <a
                      href="#"
                      className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm"
                      style={{ backgroundColor: TEAL, color: "black" }}
                    >
                      View Menu
                      <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: LIGHT_TEAL }}
                >
                  NEARBY ATTRACTIONS
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-teal-800 bg-opacity-40 p-4 rounded-lg text-center">
                    <p className="font-bold" style={{ color: YELLOW }}>
                      Glacier National Park
                    </p>
                    <p className="text-sm">40 miles north</p>
                  </div>
                  <div className="bg-teal-800 bg-opacity-40 p-4 rounded-lg text-center">
                    <p className="font-bold" style={{ color: YELLOW }}>
                      Bigfork
                    </p>
                    <p className="text-sm">Charming village (20 min)</p>
                  </div>
                  <div className="bg-teal-800 bg-opacity-40 p-4 rounded-lg text-center">
                    <p className="font-bold" style={{ color: YELLOW }}>
                      Wild Horse Island
                    </p>
                    <p className="text-sm">State park with wildlife</p>
                  </div>
                  <div className="bg-teal-800 bg-opacity-40 p-4 rounded-lg text-center">
                    <p className="font-bold" style={{ color: YELLOW }}>
                      Somers
                    </p>
                    <p className="text-sm">Historic village (10 min)</p>
                  </div>
                </div>
              </div>

              <div
                style={{ backgroundColor: `rgba(0, 64, 64, 0.7)` }}
                className="p-6 rounded-lg mb-8 border border-teal-700 shadow-lg"
              >
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: LIGHT_TEAL }}
                >
                  FIND US HERE
                </h3>
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: YELLOW }}
                    >
                      <span className="text-teal-900 font-bold">📍</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">
                      Flathead Harbor Marina - Slip E4
                    </p>
                    <p className="mb-1">7007 U.S. 93 S</p>
                    <p className="mb-1">Lakeside, MT 59922</p>
                    <p className="mb-4 italic">Free parking available</p>

                    <p className="text-sm text-gray-300">
                      • 15 minutes south of Kalispell<br />
                      • 30 minutes from Glacier Park International Airport<br />
                      • 25 minutes from Whitefish<br />
                      • 20 minutes from Bigfork
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <a
                    href="https://maps.google.com/?q=Flathead+Harbor+Marina,+7007+U.S.+93+S,+Lakeside,+MT+59922"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium shadow-md"
                    style={{ backgroundColor: TEAL, color: "black" }}
                  >
                    Get Directions
                    <span className="ml-2">→</span>
                  </a>
                </div>
              </div>

              <div className="p-6 bg-teal-900 bg-opacity-40 rounded-lg shadow-lg border border-teal-800 text-center">
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: YELLOW }}
                >
                  MAKE IT A FULL DAY AT FLATHEAD HARBOR
                </h3>
                <p className="mb-4">
                  Experience all that Flathead Harbor has to offer! From
                  parasailing with us to dining, boating, fishing, and
                  entertainment - everything you need for a perfect Montana day
                  is right here.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 font-bold rounded-lg shadow-md"
                  style={{ backgroundColor: YELLOW, color: "#000" }}
                >
                  BOOK YOUR ADVENTURE NOW
                </motion.button>
              </div>
            </motion.div>
          </section>

          {/* Testimonials Section - Enhanced with better visuals and layout */}
          <section
            ref={testimonialRef}
            className="py-16 px-4 min-h-screen flex flex-col justify-center"
            style={{ backgroundColor: `rgba(0, 96, 96, 0.2)` }}
            id="testimonials"
          >
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={testimonialInView ? "visible" : "hidden"}
              className="text-center mb-16"
            >
              <h2
                className="text-4xl font-bold mb-6 tracking-wide"
                style={{
                  color: YELLOW,
                  textShadow: "0px 0px 10px rgba(255, 215, 0, 0.3)",
                }}
              >
                GUEST EXPERIENCES
              </h2>
              <p className="text-lg max-w-3xl mx-auto">
                Don't just take our word for it. Here's what our guests have to
                say about their parasailing adventures above Flathead Lake.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah M.",
                  location: "Seattle, WA",
                  quote:
                    "Absolutely breathtaking! The views of the mountains and lake were spectacular, and the crew made us feel safe the entire time. Worth every penny!",
                  rating: 5,
                  image: "/FlatheadAerial1.jpg", // Placeholder, would be replaced with actual testimonial images
                },
                {
                  name: "Mike T.",
                  location: "Missoula, MT",
                  quote:
                    "Been parasailing in many places but this was by far the most scenic. The water is so clear you can see to the bottom from 400 feet up! Amazing experience.",
                  rating: 5,
                  image: "/FlatheadAerial1.jpg", // Placeholder
                },
                {
                  name: "Jordan & Emily",
                  location: "Denver, CO",
                  quote:
                    "We did the tandem flight for our anniversary and it was magical. The staff were professional, fun and made us feel comfortable even though I was nervous at first.",
                  rating: 5,
                  image: "/FlatheadAerial1.jpg", // Placeholder
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.2,
                        duration: 0.8,
                      },
                    },
                  }}
                  className="bg-teal-900 bg-opacity-70 p-8 rounded-lg shadow-lg border border-teal-800 flex flex-col h-full"
                >
                  {/* Added testimonial images */}
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4 mx-auto ring-2 ring-yellow-400">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex mb-4 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 mr-1 text-xl">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="italic mb-6 text-gray-200 flex-grow">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-center mt-auto">
                    <p
                      className="font-medium text-lg"
                      style={{ color: LIGHT_TEAL }}
                    >
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-300">
                      {testimonial.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Added review platforms section */}
            <div className="mt-12 bg-teal-800 bg-opacity-50 p-6 rounded-lg text-center">
              <p className="text-lg mb-4">
                We're proud of our 5-star ratings across all platforms
              </p>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: YELLOW }}>
                    5.0
                  </div>
                  <div className="text-sm">Google</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: YELLOW }}>
                    5.0
                  </div>
                  <div className="text-sm">Yelp</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: YELLOW }}>
                    5.0
                  </div>
                  <div className="text-sm">FaceBook</div>
                </div>
              </div>
            </div>

            <motion.div
              variants={slideUp}
              className="mt-16 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg font-bold text-black shadow-xl"
                style={{ backgroundColor: YELLOW }}
                animate={pulseAnimation}
              >
                BOOK YOUR ADVENTURE
              </motion.button>
              <p className="mt-4 text-sm text-gray-300">
                Reservations recommended • Limited daily availability
              </p>
            </motion.div>
          </section>
        </div>
      </div>

      {/* Enhanced footer with more information and better organization */}
      <footer
        style={{ backgroundColor: DEEP_TEAL }}
        className="py-12 px-4 border-t border-teal-700"
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>
                MELLOW MONTANA WATERSPORTS
              </h3>
              <p className="text-gray-300 mb-4 max-w-md">
                Providing unforgettable aerial adventures over Montana's most
                beautiful lake since 2022. Our mission is to create safe,
                thrilling experiences that showcase the natural beauty of
                Flathead Lake and the surrounding wilderness.
              </p>
              <div className="flex space-x-4 mb-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: LIGHT_TEAL }}
                >
                  <span className="text-black font-bold">IG</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: LIGHT_TEAL }}
                >
                  <span className="text-black font-bold">FB</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: LIGHT_TEAL }}
                >
                  <span className="text-black font-bold">TW</span>
                </a>
              </div>
              <p className="text-gray-400">
                © 2025 Mellow Montana Co. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>
                QUICK LINKS
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#experience"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    The Experience
                  </a>
                </li>
                <li>
                  <a
                    href="#safety"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Safety
                  </a>
                </li>
                <li>
                  <a
                    href="#location"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Location
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Reviews
                  </a>
                </li>
                <li>
                  <a
                    href="/booking"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Book Now
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>
                CONTACT US
              </h3>
              <p className="text-gray-300 mb-2 flex items-center">
                <span className="mr-2">📧</span> info@mellowmontana.com
              </p>
              <p className="text-gray-300 mb-2 flex items-center">
                <span className="mr-2">📱</span> (406) 555-1234
              </p>
              <p className="text-gray-300 mb-6 flex items-center">
                <span className="mr-2">📍</span>{" "}
                Lakeside Marina, Flathead Lake, MT
              </p>

              <h4
                className="text-md font-semibold mb-2"
                style={{ color: LIGHT_TEAL }}
              >
                HOURS
              </h4>
              <p className="text-gray-300 mb-1">May-September: Daily 9am-7pm</p>
              <p className="text-gray-300">October: Fri-Sun 10am-5pm</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearnMorePage;
