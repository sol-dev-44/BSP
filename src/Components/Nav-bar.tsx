import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  }, [location.pathname]);

  // Navigation links - simplified to 5 main links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Location", path: "/location" },
    // { name: "Gallery", path: "/gallery" },
    // { name: "Contact", path: "/contact" },
  ];

  // Animation variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const mobileMenuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const logoAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={logoAnimation}
          >
            <Link to="/" className="flex items-center">
              <img 
                src="/JerryBearLogo.png"
                alt="Big Sky Parasail Logo" 
                className={`h-12 mr-3 transition-all ${scrolled ? "filter-none" : "brightness-[1.15]"}`} 
              />
              <span className={`font-bold text-xl tracking-wider transition-colors ${
                scrolled ? "text-blue-600" : "text-white"
              }`}>
                BIG SKY PARASAIL
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <nav className="flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 mx-1 rounded-lg font-medium transition-all ${
                    scrolled 
                      ? isActive(link.path) 
                        ? "text-blue-600" 
                        : "text-gray-800 hover:text-blue-600" 
                      : isActive(link.path) 
                        ? "text-amber-400" 
                        : "text-white hover:text-amber-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            {/* Book Now Button */}
            <Link 
              to="/book" 
              className={`ml-4 px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                scrolled 
                  ? "bg-amber-500 hover:bg-amber-600 text-white" 
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center p-2 rounded-lg transition-colors ${
                scrolled 
                  ? "text-gray-800 hover:bg-gray-100" 
                  : "text-white hover:bg-blue-800 hover:bg-opacity-30"
              }`}
              aria-label="Toggle menu"
            >
              {!isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden fixed top-0 right-0 w-4/5 h-screen bg-gradient-to-b from-blue-700 to-blue-900 z-50"
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white p-2 hover:bg-blue-800 hover:bg-opacity-50 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex justify-center my-8">
              <img 
                src="/JerryBearLogo.png"
                alt="Big Sky Parasail Logo" 
                className="h-20" 
              />
            </div>
            
            <div className="px-4 py-2">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    variants={mobileMenuItemVariants}
                    className="border-b border-blue-600 last:border-b-0"
                  >
                    <Link
                      to={link.path}
                      className={`block px-4 py-4 text-white hover:bg-blue-800 hover:bg-opacity-50 rounded-lg transition-colors ${
                        isActive(link.path) ? "font-semibold" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div variants={mobileMenuItemVariants} className="mt-4">
                  <Link 
                    to="/book" 
                    className="block w-full text-center px-4 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Book Your Flight
                  </Link>
                </motion.div>
              </nav>
            </div>
            
            <motion.div
              variants={mobileMenuItemVariants}
              className="absolute bottom-0 left-0 right-0 p-6 text-center text-blue-200 text-sm"
            >
              <p>© 2025 Big Sky Parasail Co.</p>
              <div className="flex justify-center mt-4 space-x-4">
                <a href="#" className="text-white hover:text-amber-300 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-amber-300 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;