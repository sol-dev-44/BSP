import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CanadianWelcomeBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden"
    >
      {/* Main Banner */}
      <div className="bg-gradient-to-r from-red-600 via-white to-red-600 p-1 rounded-2xl shadow-2xl">
        <div className="bg-gradient-to-br from-slate-900/95 to-red-900/95 rounded-xl p-6 relative overflow-hidden">
          {/* Maple leaf background pattern */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-6xl"
                animate={{
                  y: [-50, 300],
                  rotate: [0, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "linear"
                }}
                style={{
                  left: `${i * 20}%`,
                  top: '-50px'
                }}
              >
                🍁
              </motion.div>
            ))}
          </div>
          
          <div className="relative z-10">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {/* Canadian Flag */}
                <motion.div
                  animate={{ 
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="text-5xl"
                >
                  🇨🇦
                </motion.div>
                
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white">
                    Hey There, Canadian Friends!
                  </h3>
                  <motion.p 
                    className="text-amber-400 font-bold text-lg md:text-xl"
                    animate={{ 
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    🚁 100% TARIFF-FREE ZONE! 🚁
                  </motion.p>
                </div>
              </div>
              
              {/* Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-3xl text-white hover:text-amber-400 transition-colors"
              >
                {isExpanded ? '🍁' : '📣'}
              </motion.button>
            </div>
            
            {/* Collapsible Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-3 text-white">
                    <p className="text-lg font-medium">
                      🏔️ While others add tariffs, we're adding altitude:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <p className="font-bold text-amber-400 mb-1">✅ 0% Import Fees</p>
                        <p className="text-sm">Your Canadian spirit flies free!</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <p className="font-bold text-amber-400 mb-1">✅ 100% Pure Montana Fun</p>
                        <p className="text-sm">No paperwork, just parasailing!</p>
                      </div>
                    </div>
                    <p className="text-center text-lg font-semibold pt-2">
                      🤝 The only thing we're raising is you - 500 feet up!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Quick Stats Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center space-x-2 text-white">
                <span className="text-2xl">🏒</span>
                <span>Trade your stick for a harness</span>
              </div>
              <div className="text-amber-400 font-bold">•</div>
              <div className="flex items-center space-x-2 text-white">
                <span className="text-2xl">🚫</span>
                <span>Zero tariffs, max thrills</span>
              </div>
              <div className="text-amber-400 font-bold">•</div>
              <div className="flex items-center space-x-2 text-white">
                <span className="text-2xl">🍁</span>
                <span>Border-crossing approved!</span>
              </div>
            </div>
          </div>
          
          {/* Floating Maple Leaves Animation */}
          <motion.div
            className="absolute -bottom-2 -right-2 text-8xl opacity-20"
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🍁
          </motion.div>
        </div>
      </div>
      
    </motion.div>
  );
};

export default CanadianWelcomeBanner;