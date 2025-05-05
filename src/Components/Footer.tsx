import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Theme colors - matching your existing color scheme
const YELLOW = "#FFD700"; // Bright yellow for primary brand color
const DEEP_TEAL = "#008080"; // Deep teal
const LIGHT_TEAL = "#7FFFD4"; // Lighter teal

interface FooterProps {
  companyName?: string;
  companyTagline?: string;
  email?: string;
  phone?: string;
  location?: string;
  locationUrl?: string;
  showSocialIcons?: boolean;
  currentYear?: number;
  showNewsletter?: boolean;
}

const ParasailFooter: React.FC<FooterProps> = ({
  companyName = "BIG SKY PARASAIL CO.",
  companyTagline =
    "Providing unforgettable aerial adventures over Montana's most beautiful lake since 2022.",
  email = "bigskyparasailing@gmail.com",
  phone = "(406) 270-6256",
  location = "Flathead Harbor Marina, Lakeside, MT",
  locationUrl =
    "https://maps.google.com/?q=Flathead+Harbor+Marina,+Lakeside,+MT",
  showSocialIcons = false,
  showNewsletter = false,
}) => {
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() !== "") {
      setIsSubscribed(true);
      setEmailInput("");
      // In a real app, you would send this to your backend
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  // Track scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition((window as any).scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants - consistent with your landing page
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-t border-teal-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full bg-amber-500 blur-3xl"
          style={{
            top: "20%",
            left: "10%",
            transform: `translateY(${scrollPosition * 0.02}px)`,
          }}
        >
        </div>
        <div
          className="absolute w-64 h-64 rounded-full bg-blue-300 blur-3xl"
          style={{
            top: "60%",
            right: "15%",
            transform: `translateY(${scrollPosition * -0.01}px)`,
          }}
        >
        </div>
      </div>

      {/* Wave separator - matching your landing page style */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="fill-white"
        >
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z">
          </path>
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-8 pb-12 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="grid md:grid-cols-4 gap-8"
        >
          {/* Company Info Section */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-2"
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: YELLOW }}>
              {companyName}
            </h3>
            <p className="text-blue-50 mb-6 max-w-md">
              {companyTagline}{" "}
              Our mission is to create safe, thrilling experiences that showcase
              the natural beauty of Flathead Lake and the surrounding
              wilderness.
            </p>

            {showSocialIcons && (
              <div className="flex space-x-4 mb-6">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 transition-all transform hover:scale-110 shadow-md"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5 text-white fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 transition-all transform hover:scale-110 shadow-md"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5 text-white fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 transition-all transform hover:scale-110 shadow-md"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5 text-white fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            )}
          </motion.div>

          {/* Quick Links Section */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>
              QUICK LINKS
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-blue-50 hover:text-white transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    >
                    </path>
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-blue-50 hover:text-white transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    >
                    </path>
                  </svg>
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-blue-50 hover:text-white transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    >
                    </path>
                  </svg>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/location"
                  className="text-blue-50 hover:text-white transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    >
                    </path>
                  </svg>
                  Location
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-blue-50 hover:text-white transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    >
                    </path>
                  </svg>
                  Book
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>
              CONTACT US
            </h3>
            <div className="space-y-4">
              <p className="text-blue-50 flex items-center group">
                <span className="mr-3 text-amber-400">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z">
                    </path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z">
                    </path>
                  </svg>
                </span>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white group-hover:underline"
                >
                  {email}
                </a>
              </p>

              <p className="text-blue-50 flex items-center group">
                <span className="mr-3 text-amber-400">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z">
                    </path>
                  </svg>
                </span>
                <a
                  href={`tel:${phone}`}
                  className="hover:text-white group-hover:underline"
                >
                  {phone}
                </a>
              </p>

              <p className="text-blue-50 flex items-start group">
                <span className="mr-3 text-amber-400 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    >
                    </path>
                  </svg>
                </span>
                <a
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white group-hover:underline"
                >
                  {location}
                </a>
              </p>

              <div>
                <h4 className="text-md font-semibold mb-2 text-amber-400">
                  HOURS
                </h4>
                <p className="text-blue-50 mb-1">
                  May-September: Daily 9am-7pm
                </p>
                {/* <p className="text-blue-50">October: Fri-Sun 10am-5pm</p> */}
              </div>

              {showNewsletter && (
                <div className="mt-6 pt-6 border-t border-blue-400">
                  <h4 className="text-md font-semibold mb-3 text-amber-400">
                    GET UPDATES
                  </h4>
                  {isSubscribed
                    ? (
                      <div className="px-4 py-3 bg-green-500 bg-opacity-20 rounded-lg border border-green-300 text-white">
                        Thanks for subscribing!
                      </div>
                    )
                    : (
                      <form
                        onSubmit={handleSubscribe}
                        className="flex flex-col space-y-2"
                      >
                        <div className="relative">
                          <input
                            type="email"
                            value={emailInput}
                            onChange={(e:any) => setEmailInput(e.target.value)}
                            placeholder="Your email address"
                            className="w-full px-4 py-2 rounded-lg bg-blue-700 bg-opacity-30 border border-blue-300 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors transform hover:-translate-y-1 hover:shadow-lg"
                        >
                          Subscribe
                        </button>
                      </form>
                    )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Weather widget */}
        <motion.div
          variants={fadeInUp}
          className="mt-10 bg-blue-700 bg-opacity-30 rounded-lg p-6 border border-blue-400"
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>
            PERFECT PARASAILING CONDITIONS
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-600 bg-opacity-30 p-4 rounded-lg">
              <div className="text-amber-400 text-3xl mb-2">☀️</div>
              <div className="text-white font-medium">Sunny Days</div>
            </div>
            <div className="bg-blue-600 bg-opacity-30 p-4 rounded-lg">
              <div className="text-amber-400 text-3xl mb-2">💨</div>
              <div className="text-white font-medium">Light Winds</div>
            </div>
            <div className="bg-blue-600 bg-opacity-30 p-4 rounded-lg">
              <div className="text-amber-400 text-3xl mb-2">🌊</div>
              <div className="text-white font-medium">Calm Waters</div>
            </div>
          </div>
          <div className="mt-4 text-blue-50 text-center">
            Check the <Link target="_blank" to="https://weather.com/weather/today/l/912c192e9edb73daba6c77c580cc41bad61ec696c76cc2ba7247573bf7d67e38" className="text-amber-400 hover:underline" > current conditions </Link>
            for today's forecast
          </div>
        </motion.div>

        {/* Copyright */}
        {/* <motion.div
          variants={fadeInUp}
          className="mt-12 pt-6 border-t border-blue-400 text-center text-blue-50"
        >
          <p>© {currentYear} {companyName}. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-4 text-sm">
            <Link to="/privacy" className="hover:text-white hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white hover:underline">
              Terms of Service
            </Link>
            <Link
              to="/accessibility"
              className="hover:text-white hover:underline"
            >
              Accessibility
            </Link>
          </div>
        </motion.div> */}
      </div>

      {/* Back to top button */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => (window as any).scrollTo({ top: 0, behavior: "smooth" })}
          className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg hover:bg-amber-600 transition-colors transform hover:-translate-y-1"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 15l7-7 7 7"
            >
            </path>
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default ParasailFooter;
