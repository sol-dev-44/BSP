import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Image configuration for easy updates
const images = {
  heroLogo: "/JerryBearLogo.png", // Hero section logo
  feature1: "/FlatheadAerial.jpg",
  feature2: "/WhiteFishSmiles.jpg", // Safe & Fun feature image
  feature3: "/DaytonaImage.png", // Photo Packages feature image 
};

type TestimonialProps = {
  quote: string;
  author: string;
};

const Testimonial: React.FC<TestimonialProps> = ({ quote, author }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
    <p className="italic text-gray-700 mb-3">"{quote}"</p>
    <p className="text-sm font-semibold">{author}</p>
  </div>
);

// Feature Card Component
type FeatureCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  bgColor: string;
  delay?: number;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  imageSrc, 
  imageAlt, 
  bgColor,
  delay = 0
}) => (
  <motion.div 
    whileInView={{ opacity: [0, 1], y: [60, 0] }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white"
  >
    <div className={`h-48 ${bgColor} flex items-center justify-center relative overflow-hidden`}>
      <img 
        src={imageSrc} 
        alt={imageAlt} 
        className="object-cover w-full h-full" 
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

const LandingPage: React.FC = () => {
  // Testimonials data
  const testimonials = [
    {
      quote: "The most amazing experience of our vacation! Views were incredible and the staff made us feel completely safe.",
      author: "Sarah J."
    },
    {
      quote: "My kids loved it! Even my husband with his fear of heights had a blast. We'll be back next year!",
      author: "Mike T."
    },
  ];

  // Feature data
  const features = [
    {
      title: "Breathtaking Views",
      description: "Soar 300 feet above Flathead Lake's crystal waters and experience panoramic mountain views.",
      imageSrc: images.feature1,
      imageAlt: "Aerial view from parasail",
      bgColor: "bg-blue-600",
      delay: 0
    },
    {
      title: "Safe & Fun",
      description: "Our experienced captains and state-of-the-art equipment ensure a safe and exhilarating adventure.",
      imageSrc: images.feature2,
      imageAlt: "Safety equipment and happy parasailers",
      bgColor: "bg-amber-500",
      delay: 0.1
    },
    {
      title: "Photo Packages",
      description: "Capture your incredible parasailing experience with our high-quality photo packages.",
      imageSrc: images.feature3,
      imageAlt: "Parasailing photo package example",
      bgColor: "bg-cyan-500",
      delay: 0.2
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
  
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute w-full h-full bg-black opacity-30"></div>
          {/* Background pattern */}
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
                  Experience breathtaking views from 300 feet above Montana's crystal waters on our safe, thrilling parasailing adventures.
                </motion.p>
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                  <Link 
                    to="/book" 
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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-20 blur-2xl"></div>
                <motion.img 
                  src={images.heroLogo}
                  alt="Big Sky Parasail" 
                  className="relative z-10 max-w-sm md:max-w-md"
                  animate={{
                    y: [0, -15, 0],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <p className="text-gray-800 font-semibold">Trusted by 5,000+ adventurers</p>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-700">4.9/5 (350+ reviews)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
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
              Why Fly With Us
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-gray-600"
            >
              Experience Montana's premier parasailing adventure with unmatched views and safety.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                imageSrc={feature.imageSrc}
                imageAlt={feature.imageAlt}
                bgColor={feature.bgColor}
                delay={feature.delay}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-white">
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
              What Our Adventurers Say
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-gray-600"
            >
              Don't just take our word for it, hear from our happy customers.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            whileInView={{ opacity: [0, 1], y: [20, 0] }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-10"
          >
            <Link 
              to="/about#testimonials" 
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              See more reviews
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
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
              Ready for Takeoff?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="max-w-2xl mx-auto mb-8 text-lg"
            >
              Book your parasailing adventure today and create memories that will last a lifetime.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link 
                to="/book" 
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-block"
              >
                Book Your Flight
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;