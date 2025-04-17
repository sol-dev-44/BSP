import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "react-router-dom";

// Define our color constants
const YELLOW = "#FFD700"; // Bright yellow for primary brand color
const TEAL = "#40E0D0"; // Vibrant teal for water theme
const LIGHT_TEAL = "#7FFFD4"; // Lighter teal (Aquamarine)
const WHITE = "#FFFFFF"; // White for text and contrast
const SAND = "#F5F5DC"; // Light sand color for subtle elements

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const slideUp = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
};

const slideLeft = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideRight = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

const LearnMorePage: React.FC = () => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200]);
  const parallaxY1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  
  // References for sections to check if they're in view
  const experienceRef = useRef<HTMLDivElement>(null);
  const safetyRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  
  const experienceInView = useInView(experienceRef, { once: true, amount: 0.3 });
  const safetyInView = useInView(safetyRef, { once: true, amount: 0.3 });
  const locationInView = useInView(locationRef, { once: true, amount: 0.3 });
  const testimonialInView = useInView(testimonialRef, { once: true, amount: 0.3 });

  const [activeTab, setActiveTab] = useState<string>("experience");

  // Auto-scroll to the appropriate section on load based on URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const section = hash.substring(1); // remove the # from the hash
      if (section === 'experience' && experienceRef.current) {
        setActiveTab('experience');
        experienceRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (section === 'safety' && safetyRef.current) {
        setActiveTab('safety');
        safetyRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (section === 'location' && locationRef.current) {
        setActiveTab('location');
        locationRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (section === 'testimonials' && testimonialRef.current) {
        setActiveTab('testimonial');
        testimonialRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-900 text-white">
      {/* Parallax Hero Section */}
      <motion.div 
        className="fixed top-0 left-0 right-0 bottom-0 -z-10"
        style={{ y: backgroundY }}
      >
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("/FlatheadAerial1.jpg")',
            filter: 'brightness(0.8)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      </motion.div>

      {/* Hero Content - Reduced Height */}
      <div className="relative h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div 
          className="z-10"
          style={{ y: parallaxY1, opacity }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4 tracking-wider"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            THE <span style={{ color: YELLOW }}>PARASAILING</span> EXPERIENCE
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8"
            style={{ color: SAND }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Soar above Montana's most beautiful lake
          </motion.p>
        </motion.div>
        
        <motion.div
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div 
            className="animate-bounce bg-white bg-opacity-30 p-2 rounded-full"
            initial={{ y: -10 }}
            animate={{ y: 10 }}
            transition={{ 
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5
            }}
          >
            <span className="block text-white">↓</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-black bg-opacity-70 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3 no-scrollbar">
            <button 
              className={`px-6 py-2 mr-2 rounded-full whitespace-nowrap transition-all ${activeTab === 'experience' ? `bg-yellow-400 text-black font-bold` : 'bg-transparent text-white'}`}
              onClick={() => {
                setActiveTab('experience');
                experienceRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              The Experience
            </button>
            <button 
              className={`px-6 py-2 mr-2 rounded-full whitespace-nowrap transition-all ${activeTab === 'safety' ? `bg-yellow-400 text-black font-bold` : 'bg-transparent text-white'}`}
              onClick={() => {
                setActiveTab('safety');
                safetyRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Safety & Requirements
            </button>
            <button 
              className={`px-6 py-2 mr-2 rounded-full whitespace-nowrap transition-all ${activeTab === 'location' ? `bg-yellow-400 text-black font-bold` : 'bg-transparent text-white'}`}
              onClick={() => {
                setActiveTab('location');
                locationRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Our Location
            </button>
            <button 
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${activeTab === 'testimonial' ? `bg-yellow-400 text-black font-bold` : 'bg-transparent text-white'}`}
              onClick={() => {
                setActiveTab('testimonial');
                testimonialRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Guest Experiences
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-transparent to-black">
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
                    staggerChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              animate={experienceInView ? "visible" : "hidden"}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={slideRight}>
                <h2 className="text-4xl font-bold mb-6 tracking-wide" style={{ color: YELLOW }}>
                  THE ULTIMATE AERIAL ADVENTURE
                </h2>
                <p className="text-lg mb-6">
                  Experience the thrill of soaring up to 500 feet above the crystal-clear waters of Flathead Lake. Our state-of-the-art parasailing equipment provides a smooth, exhilarating ride with breathtaking 360° views of Montana's stunning landscape.
                </p>
                <p className="text-lg mb-8">
                  Whether you're seeking adventure or tranquil moments above the water, our experienced crew will customize your parasailing experience to your comfort level.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full mr-3" style={{ backgroundColor: LIGHT_TEAL }}></span>
                    <span>15-20 minute flight time</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full mr-3" style={{ backgroundColor: LIGHT_TEAL }}></span>
                    <span>Solo, tandem, or triple flights available</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full mr-3" style={{ backgroundColor: LIGHT_TEAL }}></span>
                    <span>Dry takeoffs and landings from our custom boat</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full mr-3" style={{ backgroundColor: LIGHT_TEAL }}></span>
                    <span>Optional GoPro photo/video package</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                variants={slideLeft}
                className="relative h-96 md:h-full rounded-lg overflow-hidden"
              >
                <img 
                  src="/FlatheadAerial1.jpg" 
                  alt="Parasailing over Flathead Lake" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                <motion.div 
                  className="absolute bottom-6 right-6 p-4 rounded-lg"
                  style={{ backgroundColor: `rgba(0, 0, 0, 0.7)` }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <p className="text-2xl font-bold mb-1" style={{ color: YELLOW }}>From $99</p>
                  <p className="text-sm text-gray-300">Per person</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </section>
          
          {/* Safety Section */}
          <section 
            ref={safetyRef}
            className="py-16 px-4 min-h-screen flex flex-col justify-center bg-black bg-opacity-50"
            id="safety"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              animate={safetyInView ? "visible" : "hidden"}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <motion.div 
                variants={slideRight}
                className="order-2 md:order-1 relative h-96 md:h-full rounded-lg overflow-hidden"
              >
                <img 
                  src="/FlatheadAerial1.jpg"
                  alt="Parasailing safety equipment" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </motion.div>
              
              <motion.div variants={slideLeft} className="order-1 md:order-2">
                <h2 className="text-4xl font-bold mb-6 tracking-wide" style={{ color: YELLOW }}>
                  SAFETY FIRST, ALWAYS
                </h2>
                <p className="text-lg mb-6">
                  Your safety is our top priority. Our USCG-certified captains and highly trained crew follow strict safety protocols and use only top-quality equipment that's inspected daily.
                </p>
                
                <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-4" style={{ color: LIGHT_TEAL }}>Requirements</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-6 h-6 mr-2 flex-shrink-0 text-yellow-400">•</div>
                      <span>Weight: 40-450 lbs combined weight for groups</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 mr-2 flex-shrink-0 text-yellow-400">•</div>
                      <span>Age: 6+ years (children under 12 must fly with an adult)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 mr-2 flex-shrink-0 text-yellow-400">•</div>
                      <span>Health: Not recommended for pregnant women or those with certain medical conditions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 mr-2 flex-shrink-0 text-yellow-400">•</div>
                      <span>Swimming ability: Not required (life vests provided)</span>
                    </li>
                  </ul>
                </div>
                
                <motion.div 
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link 
                    to="/safety-policy" 
                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium"
                    style={{ backgroundColor: LIGHT_TEAL, color: "black" }}
                  >
                    View Full Safety Policy
                    <span className="ml-2">→</span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </section>
          
          {/* Location Section */}
          <section 
            ref={locationRef}
            className="py-16 px-4 min-h-screen flex flex-col justify-center"
            id="location"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              animate={locationInView ? "visible" : "hidden"}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={slideRight}>
                <h2 className="text-4xl font-bold mb-6 tracking-wide" style={{ color: YELLOW }}>
                  OUR FLATHEAD LAKE LOCATION
                </h2>
                <p className="text-lg mb-6">
                  We operate from the scenic Lakeside Marina on the western shore of Flathead Lake, Montana's largest natural freshwater lake and one of the cleanest in the world.
                </p>
                <p className="text-lg mb-8">
                  From the air, you'll enjoy spectacular views of the Mission and Swan mountain ranges, Wild Horse Island, and the crystal-clear waters that make Flathead Lake famous.
                </p>
                
                <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-4" style={{ color: LIGHT_TEAL }}>Find Us Here</h3>
                  <p className="mb-2">Lakeside Marina</p>
                  <p className="mb-2">7220 Highway 93 S</p>
                  <p className="mb-2">Lakeside, MT 59922</p>
                  <p className="mb-4">Free parking available</p>
                  
                  <p className="text-sm text-gray-300">
                    Just 15 minutes south of Kalispell<br />
                    30 minutes from Glacier Park International Airport
                  </p>
                </div>
                
                <motion.div 
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link 
                    to="/directions" 
                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium"
                    style={{ backgroundColor: LIGHT_TEAL, color: "black" }}
                  >
                    Get Directions
                    <span className="ml-2">→</span>
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                variants={slideLeft}
                className="relative h-96 md:h-full rounded-lg overflow-hidden"
              >
                <img 
                  src="/FlatheadAerial1.jpg"
                  alt="Map of Flathead Lake" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5
                  }}
                >
                  <div className="h-16 w-16 rounded-full" style={{ backgroundColor: YELLOW }}></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white"></div>
                </motion.div>
              </motion.div>
            </motion.div>
          </section>
          
          {/* Testimonials Section */}
          <section 
            ref={testimonialRef}
            className="py-16 px-4 min-h-screen flex flex-col justify-center bg-black bg-opacity-50"
            id="testimonials"
          >
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={testimonialInView ? "visible" : "hidden"}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6 tracking-wide" style={{ color: YELLOW }}>
                GUEST EXPERIENCES
              </h2>
              <p className="text-lg max-w-3xl mx-auto">
                Don't just take our word for it. Here's what our guests have to say about their parasailing adventures above Flathead Lake.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah M.",
                  location: "Seattle, WA",
                  quote: "Absolutely breathtaking! The views of the mountains and lake were spectacular, and the crew made us feel safe the entire time. Worth every penny!",
                  rating: 5
                },
                {
                  name: "Mike T.",
                  location: "Missoula, MT",
                  quote: "Been parasailing in many places but this was by far the most scenic. The water is so clear you can see to the bottom from 400 feet up! Amazing experience.",
                  rating: 5
                },
                {
                  name: "Jordan & Emily",
                  location: "Denver, CO",
                  quote: "We did the tandem flight for our anniversary and it was magical. The staff were professional, fun and made us feel comfortable even though I was nervous at first.",
                  rating: 5
                }
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
                        duration: 0.8
                      }
                    }
                  }}
                  className="bg-gray-900 bg-opacity-60 p-8 rounded-lg"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 mr-1">★</span>
                    ))}
                  </div>
                  <p className="italic mb-6 text-gray-300">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium" style={{ color: LIGHT_TEAL }}>{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              variants={slideUp}
              className="mt-16 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg font-bold text-black"
                style={{ backgroundColor: YELLOW }}
              >
                BOOK YOUR ADVENTURE
              </motion.button>
              <p className="mt-4 text-sm text-gray-400">Reservations recommended • Limited daily availability</p>
            </motion.div>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>MELLOW MONTANA WATERSPORTS</h3>
              <p className="text-gray-400 mb-4">Providing unforgettable aerial adventures over Montana's most beautiful lake since 2022.</p>
              <p className="text-gray-400">© 2025 Mellow Montana Co. All rights reserved.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>CONTACT US</h3>
              <p className="text-gray-400 mb-2">Email: info@mellowmontana.com</p>
              <p className="text-gray-400 mb-2">Phone: (406) 555-1234</p>
              <p className="text-gray-400">Lakeside Marina, Flathead Lake, MT</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>FOLLOW US</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: LIGHT_TEAL }}>
                  <span className="text-black font-bold">IG</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: LIGHT_TEAL }}>
                  <span className="text-black font-bold">FB</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: LIGHT_TEAL }}>
                  <span className="text-black font-bold">TW</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearnMorePage;