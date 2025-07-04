import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer.tsx";
import SEO from "../Components/Seo.tsx";

// Enhanced structured data with more comprehensive FAQ items
const faqPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is parasailing safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, parasailing with Big Sky Parasail is extremely safe. We maintain a perfect safety record with over 15,000 successful flights and employ USCG certified captains with 15+ years of experience. Our equipment exceeds industry safety standards with daily inspections."
      }
    },
    {
      "@type": "Question", 
      "name": "How long is the actual flight time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your actual parasailing flight time is 10-12 minutes in the air, which is the industry standard for optimal enjoyment and safety. The total experience takes about 1.5 hours including boat ride, safety briefing, and boarding."
      }
    },
    {
      "@type": "Question",
      "name": "How many people can parasail at once?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "Our boat accommodates up to 10 passengers total. We offer solo, tandem (2 people), and triple flights depending on combined weight limits. Additional guests can ride along as observers to enjoy the experience."
      }
    },
    {
      "@type": "Question",
      "name": "What are the weight restrictions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Minimum weight is 40 lbs for children (must fly with adult). Maximum combined weight for multiple flyers is 450 lbs. Solo flights require minimum 90 lbs for optimal performance and safety."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to know how to swim?", 
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Swimming ability is recommended but not required. All parasailers wear USCG-approved life jackets. Our dry launch and landing system means you typically won't get wet unless you choose an optional water dip."
      }
    }
  ]
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

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

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  priority: number;
}

// Enhanced FAQ Item Component with better animations
const FAQItem = ({ faq, isSearchResult = false }: { faq: FAQ; isSearchResult?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 ${isSearchResult ? 'ring-2 ring-blue-200' : ''}`}
    >
      <button
        className="flex justify-between items-center w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <span className="font-semibold text-lg text-gray-900 pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-answer-${faq.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
              {faq.category === 'safety' && (
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium">Safety Certified</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Search component with debouncing
const SearchBar = ({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (term: string) => void }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localSearchTerm, setSearchTerm]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search frequently asked questions..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
        />
        {localSearchTerm && (
          <button
            onClick={() => {
              setLocalSearchTerm('');
              setSearchTerm('');
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Category filter component
const CategoryFilter = ({ categories, activeCategory, setActiveCategory }: {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <button
        onClick={() => setActiveCategory('all')}
        className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
          activeCategory === 'all'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        }`}
      >
        All Questions
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-200 capitalize ${
            activeCategory === category
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          {category.replace('_', ' ')}
        </button>
      ))}
    </div>
  );
};

// Floating Action Button
const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3"
          >
            <a
              href="tel:406-270-6256"
              className="flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">Call Now</span>
            </a>
            <Link
              to="/reservations"
              className="flex items-center gap-3 bg-amber-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 6v6m-5-6h10m-9 4h8" />
              </svg>
              <span className="font-medium">Book Now</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <motion.svg
          animate={{ rotate: isOpen ? 45 : 0 }}
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </motion.svg>
      </motion.button>
    </div>
  );
};

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Enhanced FAQ data with better categorization and content optimization
  const faqs: FAQ[] = [
    // Safety & Experience (Most Important)
    {
      id: 'safety-1',
      question: 'Is parasailing safe?',
      answer: 'Absolutely! Big Sky Parasail maintains a perfect safety record with over 15,000 successful flights. Our USCG-certified captains have 15+ years of experience, and all equipment exceeds industry standards with daily inspections. We follow strict WSIA (Water Sports Industry Association) safety protocols and maintain comprehensive insurance coverage.',
      category: 'safety',
      tags: ['safety', 'experience', 'certification', 'insurance'],
      priority: 1
    },
    {
      id: 'experience-1', 
      question: 'How long is the actual flight time?',
      answer: 'Your parasailing flight time is 10-12 minutes in the air, which provides the optimal balance of enjoyment and safety. The complete experience takes approximately 1 hour total, including check-in, safety briefing, boat ride to the parasailing area, your flight, and return to dock.',
      category: 'experience',
      tags: ['flight time', 'duration', 'experience'],
      priority: 2
    },
    {
      id: 'capacity-1',
      question: 'How many people can go on the boat?',
      answer: 'Our custom 31-foot parasail boat accommodates up to 10 passengers total. We offer solo, tandem (2 people), and triple flights based on combined weight limits. Non-flying guests can enjoy the boat ride as observers, taking photos and sharing the excitement from the water.',
      category: 'experience', 
      tags: ['capacity', 'boat', 'passengers', 'observers'],
      priority: 3
    },
    {
      id: 'weight-1',
      question: 'What are the weight restrictions?',
      answer: 'Our weight requirements ensure optimal safety and flight performance. Minimum weight is 40 lbs for children (must fly with an adult). Solo flights require minimum 90 lbs. Maximum combined weight for tandem or triple flights is 450 lbs. These limits are based on equipment specifications and wind conditions.',
      category: 'safety',
      tags: ['weight', 'restrictions', 'children', 'safety'],
      priority: 4
    },
    {
      id: 'swimming-1',
      question: 'Do I need to know how to swim?',
      answer: 'While swimming ability is recommended, it\'s not required. All parasailers wear USCG-approved life jackets throughout the experience. Our dry launch and landing system means you typically won\'t get wet unless you choose an optional water dip during your flight.',
      category: 'safety',
      tags: ['swimming', 'life jacket', 'water', 'safety'],
      priority: 5
    },
    {
      id: 'scary-1',
      question: 'Is parasailing scary or does it feel like a roller coaster?',
      answer: 'Most guests find parasailing surprisingly peaceful and serene! Unlike roller coasters, there are no sudden drops or jarring movements. The takeoff and landing are smooth and gentle. Once airborne, you\'ll experience a floating sensation with breathtaking 360° views of Flathead Lake and surrounding mountains.',
      category: 'experience',
      tags: ['scary', 'peaceful', 'roller coaster', 'floating'],
      priority: 6
    },
    {
      id: 'age-1', 
      question: 'What\'s the minimum age for parasailing?',
      answer: 'Children must be at least 6 years old and weigh minimum 40 lbs. Children under 12 must fly tandem with an adult. There\'s no maximum age limit - we\'ve had guests in their 80s enjoy parasailing! Our gentle takeoff and landing system makes it suitable for most fitness levels.',
      category: 'safety',
      tags: ['age', 'children', 'minimum', 'senior'],
      priority: 7
    },
    {
      id: 'tandem-1',
      question: 'Can two or three people fly together?',
      answer: 'Yes! We offer tandem (2 people) and triple (3 people) flights based on combined weight limits up to 450 lbs. Flying together is perfect for couples, friends, or families. It\'s especially great for children or nervous first-timers who want to share the experience with someone.',
      category: 'experience',
      tags: ['tandem', 'triple', 'together', 'couples', 'family'],
      priority: 8
    },
    {
      id: 'water-1',
      question: 'Will I get wet? Do you land in the water?',
      answer: 'Our standard flights feature dry takeoffs and landings directly from the boat deck using our winch system. You typically stay dry unless you request an optional "dip" where we can lower you to touch the crystal-clear waters of Flathead Lake for a refreshing experience.',
      category: 'experience',
      tags: ['water', 'wet', 'dip', 'landing', 'takeoff'],
      priority: 9
    },
    {
      id: 'views-1',
      question: 'What will I see while parasailing?',
      answer: 'You\'ll enjoy spectacular 360° views from 300-500 feet above Flathead Lake! On clear days, see the Mission Mountains, Swan Range, Wild Horse Island, and even glimpses of Glacier National Park. The pristine lake waters and surrounding wilderness create unforgettable photo opportunities.',
      category: 'experience',
      tags: ['views', 'scenery', 'mountains', 'lake', 'photos'],
      priority: 10
    },

    // Booking & Logistics
    {
      id: 'booking-1',
      question: 'Do I need reservations?',
      answer: 'Reservations are strongly recommended, especially during peak season (June-August). While we occasionally accommodate walk-ins, booking ahead guarantees your preferred date and time. Reserve online at our website, call (406) 270-6256, or email bigskyparasailing@gmail.com.',
      category: 'booking',
      tags: ['reservations', 'booking', 'walk-in', 'peak season'],
      priority: 11
    },
    {
      id: 'advance-1',
      question: 'How far in advance should I book?',
      answer: 'For peak summer (late June-August), book 1-2 weeks ahead, especially for weekends. Holiday periods need 3-4 weeks notice. Spring and fall seasons (May-June, September-October) typically need only a few days notice. Earlier booking ensures better time slot selection.',
      category: 'booking',
      tags: ['advance booking', 'peak season', 'holidays', 'weekends'],
      priority: 12
    },
    {
      id: 'weather-1',
      question: 'What\'s your weather and cancellation policy?',
      answer: 'We require 24-hour notice for cancellations without penalty. Weather-related cancellations (determined by safety conditions) can be rescheduled at no cost or receive full refunds. We monitor conditions closely and notify you early if weather affects your reservation.',
      category: 'booking',
      tags: ['weather', 'cancellation', 'refund', 'reschedule', 'safety'],
      priority: 13
    },
    {
      id: 'wear-1',
      question: 'What should I wear?',
      answer: 'Wear comfortable, weather-appropriate clothing. Swimwear underneath is recommended if you want a water dip. Secure footwear or bare feet work best. Essential items: sunscreen, hat, and sunglasses with strap. Bring a light jacket for cooler days or wind protection.',
      category: 'preparation',
      tags: ['clothing', 'wear', 'swimwear', 'sunscreen', 'preparation'],
      priority: 14
    },
    {
      id: 'bring-1',
      question: 'What should I bring?',
      answer: 'Bring sunscreen, sunglasses with strap, hat, towel, and change of clothes. Leave valuables secured or with non-flying companions. Phones and cameras can be brought but must be secured with straps. We provide all safety equipment including USCG-approved life jackets.',
      category: 'preparation',
      tags: ['bring', 'valuables', 'phone', 'camera', 'towel'],
      priority: 15
    },
    {
      id: 'observers-1',
      question: 'Can friends and family come along as observers?',
      answer: 'Absolutely! We offer discounted observer rates for non-flying guests who want to enjoy the boat ride and take photos. Observers share in the excitement, enjoy scenic boat tours of Flathead Lake, and create lasting memories while their companions fly.',
      category: 'experience',
      tags: ['observers', 'friends', 'family', 'photos', 'boat ride'],
      priority: 16
    },
    {
      id: 'certified-1',
      question: 'Are your captains licensed and experienced?',
      answer: 'Yes! All our captains hold USCG licenses with 15+ years of parasailing experience. Our crew is trained in CPR, first aid, and water rescue. Our equipment exceeds industry standards with daily safety inspections and regular maintenance by certified technicians.',
      category: 'safety',
      tags: ['captain', 'licensed', 'USCG', 'experienced', 'CPR', 'certified'],
      priority: 17
    },
    {
      id: 'private-1',
      question: 'Do you offer private charters for special occasions?',
      answer: 'Yes! We offer private boat charters perfect for birthdays, anniversaries, bachelor/bachelorette parties, corporate events, and family reunions. We can accommodate special requests like decorations, catering arrangements, and customized experiences. Contact us to discuss your event needs.',
      category: 'booking',
      tags: ['private', 'charter', 'special occasions', 'birthday', 'corporate'],
      priority: 18
    },
    {
      id: 'proposal-1', 
      question: 'Can you help with wedding proposals?',
      answer: 'Absolutely! We love helping create unforgettable proposal moments. We can coordinate special banners visible from the air, arrange photography, or create other romantic touches. Contact us in advance to plan your perfect moment while maintaining complete discretion.',
      category: 'booking',
      tags: ['proposal', 'wedding', 'romantic', 'banner', 'photography'],
      priority: 19
    },
    {
      id: 'timing-1',
      question: 'When should I schedule parasailing during my vacation?',
      answer: 'Schedule parasailing early in your vacation for flexibility with weather rescheduling. Morning flights typically offer calmer conditions, while afternoon flights provide excellent lighting for photos. Choose a day when you can be flexible with timing in case of weather delays.',
      category: 'planning',
      tags: ['vacation', 'timing', 'morning', 'afternoon', 'flexibility'],
      priority: 20
    }
  ];

  // Filter and search functionality
  const filteredFAQs = useMemo(() => {
    let filtered = faqs;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by priority
    return filtered.sort((a, b) => a.priority - b.priority);
  }, [searchTerm, activeCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(faqs.map(faq => faq.category)));
  }, []);

  return (
    <>
      <SEO
        title="Parasailing FAQs | Big Sky Parasail Montana"
        description="Find answers to frequently asked questions about parasailing with Big Sky Parasail on Flathead Lake. Safety information, what to expect, booking details, and more."
        keywords="parasailing FAQ, Montana parasail questions, Flathead Lake parasailing information, parasailing safety, what to expect parasailing, 10 passenger boat, 12 minute flight"
        canonicalUrl="https://www.montanaparasail.com/faq"
        ogImage="https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/WhiteFishSmiles.jpg"
        structuredData={faqPageStructuredData}
      />

      <div className="min-h-screen overflow-hidden">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute w-full h-full bg-black opacity-30"></div>
            <img
              src="https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/WFishHappyFar.jpg"
              alt="Parasailing over Flathead Lake"
              className="w-full h-full object-cover"
            />
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

          <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-5xl mx-auto text-center"
            >
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-amber-400 font-bold tracking-widest">GOT QUESTIONS?</span>
              </motion.div>
              
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
              >
                Everything You Need to Know
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl mb-8 text-blue-50 max-w-3xl mx-auto"
              >
                Get instant answers about your Flathead Lake parasailing adventure. From safety to booking, we've got you covered.
              </motion.p>

              {/* Trust signals */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-6 mb-8"
              >
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium">USCG Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">15,000+ Safe Flights</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">10-12 Min Flights</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              />
            </svg>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              
              <div className="mt-8">
                <CategoryFilter 
                  categories={categories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              </div>

              {/* Results counter */}
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  {searchTerm ? `Found ${filteredFAQs.length} result${filteredFAQs.length !== 1 ? 's' : ''} for "${searchTerm}"` : 
                   `Showing ${filteredFAQs.length} question${filteredFAQs.length !== 1 ? 's' : ''}`}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                {filteredFAQs.length > 0 ? (
                  <motion.div
                    key={`${activeCategory}-${searchTerm}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {filteredFAQs.map((faq) => (
                      <FAQItem 
                        key={faq.id} 
                        faq={faq} 
                        isSearchResult={!!searchTerm.trim()}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search terms or browse all categories.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setActiveCategory('all');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Show all questions
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Enhanced Contact Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold mb-6 text-gray-900"
              >
                Still Have Questions?
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-lg mb-8 text-gray-700"
              >
                Our friendly team is here to help! Get in touch and we'll answer any questions about your Flathead Lake parasailing adventure.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <a
                  href="tel:406-270-6256"
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                  <p className="text-green-600 font-medium">(406) 270-6256</p>
                  <p className="text-sm text-gray-500 mt-1">Quick answers by phone</p>
                </a>

                <a
                  href="mailto:bigskyparasailing@gmail.com"
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-blue-600 font-medium text-sm">bigskyparasailing@gmail.com</p>
                  <p className="text-sm text-gray-500 mt-1">Detailed inquiries</p>
                </a>

                <Link
                  to="/reservations"
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 6v6m-5-6h10m-9 4h8" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Book Online</h3>
                  <p className="text-amber-600 font-medium">Reserve Your Spot</p>
                  <p className="text-sm text-gray-500 mt-1">Instant confirmation</p>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl font-bold mb-6"
              >
                Ready for Your Adventure?
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
              >
                Join thousands of satisfied customers who've experienced the magic of parasailing on Flathead Lake!
              </motion.p>
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link
                  to="/reservations"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 6v6m-5-6h10m-9 4h8" />
                  </svg>
                  Book Your Flight Now
                </Link>
                <a
                  href="tel:406-270-6256"
                  className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (406) 270-6256
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Footer />
        <FloatingActionButton />
      </div>
    </>
  );
};

export default FAQPage;