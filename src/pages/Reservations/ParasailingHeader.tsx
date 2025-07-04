// components/ParasailingHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ParasailingHeaderProps {
  title: string;
  subtitle?: string;
  compact?: boolean; // For smaller version on sub-pages
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
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

const ParasailingHeader: React.FC<ParasailingHeaderProps> = ({ 
  title, 
  subtitle,
  compact = false
}) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-full h-full bg-black opacity-30"></div>
        {/* Background image */}
        <img
          src="https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//cloudDancerInclineDock.jpg"
          alt="Parasailing on Flathead Lake"
          className="w-full h-full object-cover"
        />
        {/* Pattern overlay */}
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

      <div className={`container mx-auto px-4 ${compact ? 'py-10' : 'py-20 md:py-28'} relative z-10`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className={`${compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-extrabold mb-4`}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              variants={fadeInUp}
              className={`${compact ? 'text-base md:text-lg' : 'text-lg md:text-xl'} text-blue-50 max-w-3xl mx-auto`}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Wave separator */}
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
  );
};

export default ParasailingHeader;