import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock useLocation hook for demo - replace with real react-router-dom import
const useLocation = () => ({ pathname: window.location.pathname });

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll position for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as Element).closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Streamlined main navigation - only essential links
  const mainNavLinks = [
    { name: "Home", path: "/", icon: "🏠", highlight: false },
    { name: "Gallery", path: "/gallery", icon: "📸", highlight: true }, // FEATURED!
    { name: "About", path: "/about", icon: "🪂", highlight: false },
    { name: "Location", path: "/location", icon: "📍", highlight: false },
  ];

  // Secondary links in dropdown menu
  const dropdownLinks = [
    { name: "Charters", path: "/charters", icon: "🚤", highlight: false },
    { name: "FAQ", path: "/faq", icon: "❓", highlight: false },
    { name: "Careers", path: "/careers", icon: "💼", highlight: false },
  ];

  // All links for mobile menu
  const allNavLinks = [...mainNavLinks, ...dropdownLinks];

  // Enhanced Animation variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const mobileMenuItemVariants = {
    closed: { 
      opacity: 0, 
      x: 30,
      y: 10
    },
    open: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const logoAnimation = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { 
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const navItemHover = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  // Check if a link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-xl shadow-blue-500/10 py-2" 
        : "bg-gradient-to-b from-black/30 to-transparent py-4"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={logoAnimation}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="cursor-pointer"
          >
            <a href="/" className="flex items-center group">
              <motion.img 
                src="/JerryBearLogo.png"
                alt="Big Sky Parasail Logo" 
                className={`h-12 mr-3 transition-all duration-300 ${
                  scrolled ? "filter-none" : "brightness-[1.2] drop-shadow-lg"
                }`}
                whileHover={{ 
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.6 }
                }}
              />
              <span className={`font-bold text-xl tracking-wider transition-all duration-300 ${
                scrolled 
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500" 
                  : "text-white drop-shadow-lg"
              }`}>
                BIG SKY PARASAIL
              </span>
            </a>
          </motion.div>

          {/* Streamlined Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            <nav className="flex items-center space-x-1">
              {/* Main Navigation Links */}
              {mainNavLinks.map((link) => (
                <motion.div
                  key={link.name}
                  variants={navItemHover}
                  whileHover="hover"
                  className="relative"
                >
                  <a
                    href={link.path}
                    className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 relative group flex items-center ${
                      scrolled 
                        ? isActive(link.path) 
                          ? link.highlight
                            ? "text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30" 
                            : "text-blue-600 bg-blue-50"
                          : link.highlight
                            ? "text-orange-600 hover:text-white hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:shadow-lg hover:shadow-amber-500/30"
                            : "text-gray-700 hover:text-blue-600 hover:bg-blue-50" 
                        : isActive(link.path) 
                          ? link.highlight
                            ? "text-black bg-gradient-to-r from-amber-400 to-orange-400 shadow-lg"
                            : "text-amber-400 bg-white/20 backdrop-blur-sm"
                          : link.highlight
                            ? "text-amber-300 hover:text-black hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-400 hover:shadow-lg"
                            : "text-white/90 hover:text-amber-300 hover:bg-white/20 hover:backdrop-blur-sm"
                    }`}
                  >
                    <span className="mr-2 text-lg">{link.icon}</span>
                    {link.name}
                    {link.highlight && (
                      <motion.span 
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        NEW
                      </motion.span>
                    )}
                  </a>
                </motion.div>
              ))}

              {/* More Dropdown */}
              <div className="relative dropdown-container">
                <motion.button
                  variants={navItemHover}
                  whileHover="hover"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                    scrolled 
                      ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50" 
                      : "text-white/90 hover:text-amber-300 hover:bg-white/20 hover:backdrop-blur-sm"
                  }`}
                >
                  <span className="mr-2 text-lg">⋯</span>
                  More
                  <motion.svg 
                    className="w-4 h-4 ml-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      {dropdownLinks.map((link) => (
                        <motion.a
                          key={link.name}
                          href={link.path}
                          whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                          className="block px-4 py-3 text-gray-700 hover:text-blue-600 transition-colors flex items-center"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="mr-3 text-lg">{link.icon}</span>
                          {link.name}
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
            
            {/* Fixed Book Now Button - Same Pattern as Other Buttons */}
            <motion.div
              variants={navItemHover}
              whileHover="hover"
              className="ml-6"
            >
              <a
                href="/reservations"
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center ${
                  scrolled 
                    ? "text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-red-500 shadow-lg hover:shadow-xl" 
                    : "text-white bg-gradient-to-r from-amber-400 to-orange-400 hover:from-orange-400 hover:to-red-400 shadow-lg hover:shadow-xl"
                }`}
              >
                <span className="mr-2 text-lg">🪂</span>
                Book Now
              </a>
            </motion.div>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                scrolled 
                  ? "text-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white" 
                  : "text-white hover:bg-white/20 backdrop-blur-sm"
              } shadow-lg`}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {!isOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="lg:hidden fixed top-0 right-0 w-80 h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 z-50 shadow-2xl"
            >
              {/* Close Button */}
              <div className="flex justify-end p-6">
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white p-3 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </motion.button>
              </div>
              
              {/* Logo */}
              <motion.div 
                variants={mobileMenuItemVariants}
                className="flex justify-center my-8"
              >
                <motion.img 
                  src="/JerryBearLogo.png"
                  alt="Big Sky Parasail Logo" 
                  className="h-20 filter brightness-110" 
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.6 }
                  }}
                />
              </motion.div>
              
              {/* Navigation */}
              <div className="px-6 py-2">
                <nav className="flex flex-col space-y-2">
                  {allNavLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      variants={mobileMenuItemVariants}
                      whileHover={{ x: 10, scale: 1.02 }}
                      className="relative"
                    >
                      <a
                        href={link.path}
                        className={`block px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                          isActive(link.path) 
                            ? link.highlight
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg"
                              : "bg-white/20 text-white font-semibold backdrop-blur-sm"
                            : link.highlight
                              ? "text-amber-300 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white"
                              : "text-white hover:bg-white/20 hover:backdrop-blur-sm"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ scale: 1.02 }}
                        />
                        <span className="relative z-10 flex items-center">
                          <span className="mr-3 text-xl">{link.icon}</span>
                          {link.name}
                          {link.highlight && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              HOT
                            </span>
                          )}
                        </span>
                      </a>
                    </motion.div>
                  ))}
                  
                  {/* Mobile Book Button */}
                  <motion.div 
                    variants={mobileMenuItemVariants} 
                    className="mt-6"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <a 
                      href="/reservations" 
                      className="block w-full text-center px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      />
                      <span className="relative z-10 flex items-center justify-center">
                        <span className="mr-2 text-xl">🪂</span>
                        Book Your Flight
                        <span className="ml-2 text-xl">✨</span>
                      </span>
                    </a>
                  </motion.div>
                </nav>
              </div>
              
              {/* Footer */}
              <motion.div
                variants={mobileMenuItemVariants}
                className="absolute bottom-0 left-0 right-0 p-6 text-center text-blue-200 text-sm"
              >
                <p className="mb-4">🌟 Montana's Premier Parasailing 🌟</p>
                <div className="flex justify-center space-x-6">
                  <motion.a 
                    href="#" 
                    className="text-white hover:text-amber-300 transition-colors"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="text-white hover:text-amber-300 transition-colors"
                    whileHover={{ scale: 1.2, rotate: -5 }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;