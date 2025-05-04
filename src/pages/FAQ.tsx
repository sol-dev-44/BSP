import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
      staggerChildren: 0.1
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

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-4 border-b border-gray-200 pb-4"
    >
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-lg text-gray-900 py-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg 
          className={`w-5 h-5 text-blue-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen py-3' : 'max-h-0'}`}
      >
        <p className="text-gray-700">{answer}</p>
      </div>
    </motion.div>
  );
};

const FAQPage = () => {
  // FAQ data
  const faqs = [
    {
      question: "Is parasailing scary?",
      answer: "Most people find parasailing surprisingly peaceful and relaxing, not scary! The takeoff and landing are smooth and gentle. Once you're in the air, the experience is serene with amazing views. The sensation is more like floating than a thrill ride, allowing you to enjoy the scenery in a tranquil setting high above the water."
    },
    {
      question: "Do I need to have any experience to parasail?",
      answer: "Absolutely no experience is necessary! Our professional crew handles all the technical aspects of the flight. You'll receive a brief safety instruction before takeoff, but there's no training required. Simply sit back, relax, and enjoy the incredible views while our experienced team does all the work."
    },
    {
      question: "Are there any age or weight restrictions?",
      answer: "Yes, we have some basic safety requirements. Participants must be at least 6 years old (children under 12 must fly with an adult). For weight, the minimum is 40 lbs and we can accommodate up to 450 lbs for combined weight on tandem or triple flights. These restrictions are in place for your safety and optimal flight experience."
    },
    {
      question: "Can two or three people go at the same time?",
      answer: "Yes! We offer solo, tandem (2 people), and triple flights, depending on the combined weight of the participants. Flying together is a great way to share the experience with friends and family, and it's especially helpful for children or those who might be a bit nervous about going alone."
    },
    {
      question: "Do you take-off from or land in the water?",
      answer: "We offer dry takeoffs and landings directly from our custom 31' parasail boat. You'll be securely seated on the flight deck at the back of the boat for takeoff, and our winch system will gently lift you into the air. You'll return the same way, landing smoothly back on the boat. No swimming required!"
    },
    {
      question: "Do I ever touch the water?",
      answer: `While our standard flights feature dry takeoffs and landings, we do offer optional "dips" for those who want to touch the water. Just let your captain know if you'd like to experience a refreshing toe dip in Flathead Lake during your flight, and they'll be happy to accommodate if conditions permit.`
    },
    {
      question: "What can I expect to see parasailing?",
      answer: "You'll enjoy breathtaking 360° panoramic views of Flathead Lake and the surrounding mountain ranges. On clear days, you can see the Mission Mountains to the east, the Swan Range to the northeast, Wild Horse Island, and sometimes even glimpses of Glacier National Park in the distance. The crystal-clear waters of Flathead Lake are also amazing from above!"
    },
    {
      question: "Can we fly higher than your standard ride?",
      answer: "Our standard flight altitude is approximately 300-500 feet above the water, which provides the optimal balance of amazing views and safety. Due to FAA regulations and safety protocols, we maintain consistent flight altitudes for all our parasailing experiences. Rest assured, even at our standard height, the views are absolutely spectacular!"
    },
    {
      question: "What should I wear?",
      answer: "We recommend comfortable, weather-appropriate clothing. Swimwear beneath your clothes is a good idea (especially if you'd like to do a water dip). Secure footwear (or bare feet) is best for the boat. Don't forget sun protection: sunscreen, a hat, and sunglasses with a strap. A light jacket or windbreaker can be helpful on cooler days."
    },
    {
      question: "Can I go along just to watch?",
      answer: "Yes! We offer observer rates for friends and family who want to enjoy the boat ride without parasailing. Observers can take photos, enjoy the scenery, and share in the experience from the boat. It's a great option for those who prefer to stay on the water while their companions take to the sky."
    },
    {
      question: "How long does the excursion take?",
      answer: "The entire experience typically takes about 1.5 hours from check-in to return. This includes check-in procedures, safety briefing, boat ride to and from the parasailing area, and the flight itself. Actual flight time is approximately 10-12 minutes per group, which is the optimal duration for enjoying the experience."
    },
    {
      question: "Is your company specially trained, experienced and or licensed?",
      answer: "Absolutely! Our captains are USCG certified with 15+ years of parasailing experience. We maintain WSIA (Water Sports Industry Association) certification, which is the gold standard in parasailing safety. All of our equipment meets or exceeds industry safety standards with daily inspections, and our crew is trained in CPR, first aid, and water rescue techniques."
    },
    {
      question: "Are reservations required?",
      answer: "While we sometimes can accommodate walk-ins, reservations are strongly recommended, especially during peak season (June-August). Booking in advance ensures you get your preferred date and time slot. You can make reservations by calling us at (406) 270-6256 or emailing bigskyparasailing@gmail.com."
    },
    {
      question: "How far in advance should I make a reservation?",
      answer: "For peak summer season (late June through August), we recommend booking 1-2 weeks in advance, especially for weekend slots or if you have a specific time preference. For holidays and special events, 3-4 weeks notice is ideal. In the shoulder seasons (May-June and September-October), a few days' notice is usually sufficient."
    },
    {
      question: "What if I want to do something special with my family and friends for a birthday, anniversary, or wedding party?",
      answer: "We love helping you celebrate special occasions! We offer private charters where you can book the entire boat for your group. This option is perfect for birthdays, bachelor/bachelorette parties, corporate events, or family reunions. Contact us directly to discuss your specific needs and we'll work with you to create a memorable experience."
    },
    {
      question: "Can you do wedding proposals quietly and discreetly?",
      answer: "Absolutely! We've helped orchestrate many successful and memorable proposals. We can work with you to plan the perfect moment, whether it's with a special banner visible from the air, a coordinated photo opportunity, or another creative idea. Contact us in advance to discuss your plans and we'll help make your special moment unforgettable while maintaining discretion."
    },
    {
      question: "What part of our vacation should we plan parasailing for?",
      answer: "We recommend scheduling parasailing earlier in your vacation if possible. This allows flexibility for rescheduling in case of weather cancellations. Morning flights typically offer calmer waters and winds, while afternoon flights often provide the best lighting for photos. Consider your itinerary and schedule parasailing on a day when you can be flexible with timing."
    },
    {
      question: "What is your cancellation policy?",
      answer: "We understand plans can change. Our standard policy requires 24-hour notice for cancellations or rescheduling without penalty. For weather-related cancellations (which we determine based on safety conditions), we're happy to reschedule your flight at no additional cost or provide a full refund if rescheduling isn't possible. We monitor conditions closely and will notify you as early as possible if weather will affect your reservation."
    }
  ];

  // Group FAQs into categories for better organization
  const experienceQuestions = faqs.slice(0, 9);
  const bookingQuestions = faqs.slice(9);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute w-full h-full bg-black opacity-30"></div>
          {/* Background image */}
          <img 
            src="/HighAerial.jpeg" 
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

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
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
              GOT QUESTIONS?
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl mb-8 text-blue-50"
            >
              Everything you need to know about your parasailing adventure
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

      {/* Quick Navigation */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#experience" className="px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium rounded-full transition-colors">
              About the Experience
            </a>
            <a href="#booking" className="px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium rounded-full transition-colors">
              Booking & Logistics
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* About the Experience */}
            <div id="experience" className="mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold mb-8 pb-2 border-b-2 border-blue-600 inline-block text-gray-900"
              >
                About the Experience
              </motion.h2>
              
              {experienceQuestions.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            {/* Booking & Logistics */}
            <div id="booking" className="mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold mb-8 pb-2 border-b-2 border-blue-600 inline-block text-gray-900"
              >
                Booking & Logistics
              </motion.h2>
              
              {bookingQuestions.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold mb-6 text-gray-900"
            >
              Still Have Questions?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg mb-8 text-gray-700"
            >
              We're happy to help! Contact us directly for any questions not covered here.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <a 
                href="tel:406-270-6256" 
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call Us
              </a>
              <a 
                href="mailto:bigskyparasailing@gmail.com" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email Us
              </a>
            </motion.div>
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
              Book your parasailing adventure today and create unforgettable memories on Flathead Lake!
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
      </section>
    </div>
  );
};

export default FAQPage;