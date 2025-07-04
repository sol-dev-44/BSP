import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer.tsx";
import SEO from "../Components/Seo.tsx";

const locationPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Big Sky Parasail at Flathead Lake",
  "description":
    "Find us at Flathead Harbor Marina in Lakeside, MT. Directions and information about our parasailing location on Flathead Lake.",
  "url": "https://www.montanaparasail.com/location",
  "telephone": "(406) 270-6256",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Flathead Harbor Marina",
    "addressLocality": "Lakeside",
    "addressRegion": "MT",
    "postalCode": "59922",
    "addressCountry": "US",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 48.0411,
    "longitude": -114.2298,
  },
  "hasMap": "https://maps.google.com/?q=Flathead+Harbor+Marina,+Lakeside,+MT",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      "opens": "09:00",
      "closes": "19:00",
      "validFrom": "2025-05-01",
      "validThrough": "2025-09-30",
    },
  ],
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

interface Attraction {
  title: string;
  description: string;
  distance: string;
  image: string;
}

// Nearby Attraction Card
const AttractionCard = ({
  title,
  description,
  distance,
  image,
}: Attraction) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-lg shadow-lg overflow-hidden"
  >
    <div className="h-40 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-5">
      <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-blue-600 font-medium mb-2">{distance}</p>
      <p className="text-gray-700 text-sm h-20 overflow-y-auto">
        {description}
      </p>
    </div>
  </motion.div>
);

const LocationPage = () => {
  // Nearby attractions data
  const attractions = [
    {
      title: "Glacier National Park",
      description:
        "Experience the majestic mountains, pristine forests, and alpine meadows in this crown jewel of the National Park System.",
      distance: "40 miles north",
      image: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//glacierPark.jpg",
    },
    {
      title: "Wild Horse Island",
      description:
        "Visit the largest island on Flathead Lake, home to wild horses, bighorn sheep, and pristine hiking trails.",
      distance: "Short boat ride from marina",
      image: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wildHorse.jpg",
    },
    {
      title: "Bigfork",
      description:
        "Explore this charming village known for its galleries, fine dining, and summer theater.",
      distance: "20 minutes by car",
      image: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//bigFork.jpg", // Replace with actual image
    },
    {
      title: "Whitefish",
      description:
        "Enjoy year-round activities including hiking, mountain biking, and scenic lift rides.",
      distance: "35 minutes by car",
      image: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//whiteFish.jpg", // Replace with actual image
    },
  ];

  return (
    <>
      <SEO
        title="Parasailing Location on Flathead Lake, Montana"
        description="Located at Flathead Harbor Marina in Lakeside, MT. Find directions to Big Sky Parasail on Flathead Lake and information about our stunning parasailing location."
        keywords="Flathead Lake parasailing location, Lakeside MT parasailing, Flathead Harbor Marina, directions to parasailing Montana"
        canonicalUrl="https://www.montanaparasail.com/location"
        ogImage="https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//FlatheadWithShadow.jpg"
        structuredData={locationPageStructuredData}
      />
      <div className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute w-full h-full bg-black opacity-30"></div>
            {/* Background image */}
            <img
              src="https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//FlatheadMarinaAerial.jpg"
              alt="Flathead Harbor Marina"
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

          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
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
                FIND US HERE
              </motion.p>
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
              >
                Our Location
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl mb-8 text-blue-50"
              >
                Experience the thrill of parasailing at the beautiful Flathead
                Harbor Marina
              </motion.p>
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

        {/* Address Card Section */}
        <section className="py-16 -mt-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 md:p-10">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Our Marina Location
                    </h2>
                    <p className="text-gray-700 mb-6">
                      We're located at the beautiful Flathead Harbor Marina in
                      Lakeside, Montana. Find us at slip E4 and get ready for an
                      unforgettable parasailing adventure!
                    </p>

                    <div className="bg-gray-50 p-5 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">
                        Address:
                      </h3>
                      <p className="text-gray-800 font-medium">
                        Big Sky Parasail<br />
                        Flathead Harbor Marina - Slip E4<br />
                        7007 US Highway 93 S<br />
                        Lakeside, MT 59922
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            >
                            </path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Phone
                          </p>
                          <a
                            href="tel:406-270-6256"
                            className="text-blue-600 font-medium"
                          >
                            (406) 270-6256
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            >
                            </path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Email
                          </p>
                          <a
                            href="mailto:bigskyparasailing@gmail.com"
                            className="text-blue-600 font-medium"
                          >
                            bigskyparasailing@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            >
                            </path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Operating Hours
                          </p>
                          <p className="text-gray-700">
                            May - September: 9:00 AM - 7:00 PM
                          </p>
                          <p className="text-gray-700">Weather permitting</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/2">
                    <div className="rounded-lg overflow-hidden shadow-lg h-full">
                      {/* Embed Google Maps iframe */}
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2113.085907832769!2d-114.2284145!3d48.0237004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5367ab5d58967335%3A0xb96203ac02aea1f4!2sFlathead%20Harbor%20Marina!5e1!3m2!1sen!2sus!4v1683225409729!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0, minHeight: "300px" }}
                        //   allowFullScreen=
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Flathead Harbor Marina Map"
                      >
                      </iframe>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 flex flex-wrap justify-center gap-4">
                <a
                  href="https://www.google.com/maps/place/Flathead+Harbor+Marina/@48.0237004,-114.2284145,792m/data=!3m1!1e3!4m14!1m7!3m6!1s0x5367ab5d58967335:0xb96203ac02aea1f4!2sFlathead+Harbor+Marina!8m2!3d48.0237004!4d-114.2258396!16s%2Fg%2F11q8cbvqc6!3m5!1s0x5367ab5d58967335:0xb96203ac02aea1f4!8m2!3d48.0237004!4d-114.2258396!16s%2Fg%2F11q8cbvqc6?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    >
                    </path>
                  </svg>
                  Get Directions
                </a>

                <a
                  href="tel:406-270-6256"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z">
                    </path>
                  </svg>
                  Call Now
                </a>

                <a
                  href="https://www.flatheadharbor.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-all inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                      clipRule="evenodd"
                    >
                    </path>
                  </svg>
                  Visit Marina Website
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Driving Directions */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="max-w-4xl mx-auto"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-bold mb-8 text-center text-gray-900"
              >
                Getting Here
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <motion.div
                  variants={fadeIn}
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V8a1 1 0 00-1-1h-3.9L11.1 3.6A1 1 0 0010.3 3H4a1 1 0 00-1 1zm1 3V5h4.48l1.71 3H5zm7 4v2h-3v-2h3zM7 16.5a.5.5 0 100-1 .5.5 0 000 1zm7 0a.5.5 0 100-1 .5.5 0 000 1z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">By Car</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Flathead Harbor Marina is easily accessible via US Highway
                    93, which runs along the western shore of Flathead Lake.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold text-blue-600">
                        From Kalispell (15 miles)
                      </p>
                      <p className="text-sm text-gray-700">
                        Take US-93 S for approximately 15 miles. Flathead Harbor
                        will be on your left in Lakeside.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold text-blue-600">
                        From Missoula (90 miles)
                      </p>
                      <p className="text-sm text-gray-700">
                        Take US-93 N for approximately 90 miles. Flathead Harbor
                        will be on your right as you enter Lakeside.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Key Distances
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">Kalispell</p>
                        <p className="text-sm text-gray-700">
                          Nearest major town
                        </p>
                      </div>
                      <div className="bg-blue-100 px-3 py-1 rounded-full">
                        <p className="font-semibold text-blue-800">15 miles</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Glacier Park Int'l Airport
                        </p>
                        <p className="text-sm text-gray-700">FCA</p>
                      </div>
                      <div className="bg-blue-100 px-3 py-1 rounded-full">
                        <p className="font-semibold text-blue-800">30 miles</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Glacier National Park
                        </p>
                        <p className="text-sm text-gray-700">West Entrance</p>
                      </div>
                      <div className="bg-blue-100 px-3 py-1 rounded-full">
                        <p className="font-semibold text-blue-800">40 miles</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">Whitefish</p>
                        <p className="text-sm text-gray-700">Resort town</p>
                      </div>
                      <div className="bg-blue-100 px-3 py-1 rounded-full">
                        <p className="font-semibold text-blue-800">25 miles</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                variants={fadeIn}
                className="bg-white p-6 rounded-xl shadow-md text-center"
              >
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Pro Tip:</span>{" "}
                  Look for the Flathead Harbor sign on Highway 93. The marina
                  entrance is well-marked and there's plenty of free parking
                  available.
                </p>
                <a
                  href="https://www.google.com/maps/place/Flathead+Harbor+Marina/@48.0237004,-114.2284145,792m/data=!3m1!1e3!4m14!1m7!3m6!1s0x5367ab5d58967335:0xb96203ac02aea1f4!2sFlathead+Harbor+Marina!8m2!3d48.0237004!4d-114.2258396!16s%2Fg%2F11q8cbvqc6!3m5!1s0x5367ab5d58967335:0xb96203ac02aea1f4!8m2!3d48.0237004!4d-114.2258396!16s%2Fg%2F11q8cbvqc6?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  View in Google Maps
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    >
                    </path>
                  </svg>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About The Marina */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="max-w-4xl mx-auto"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-bold mb-6 text-center text-gray-900"
              >
                About Flathead Harbor Marina
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-gray-700 text-center mb-12 max-w-3xl mx-auto"
              >
                Flathead Harbor Marina offers a full-service facility on the
                western shore of Flathead Lake with seasonal slip rentals, boat
                services, and easy lake access.
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div
                  variants={fadeIn}
                  className="bg-gray-50 p-5 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Marina Services
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Seasonal slip rentals</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Boat rentals</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Fuel dock</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Boat tours</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="bg-gray-50 p-5 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Marina Amenities
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Harbor Grille restaurant</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Anchor Bar</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Convenience store</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Public restrooms</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="bg-gray-50 p-5 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Why We're Here
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    We chose Flathead Harbor Marina for our parasailing
                    operation because it offers:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Easy lake access for safe takeoffs</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Stunning mountain views</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Great amenities for our customers</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                      <span>Central location on Flathead Lake</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Nearby Attractions */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="max-w-5xl mx-auto"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-bold mb-6 text-center text-gray-900"
              >
                Explore Nearby Attractions
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-gray-700 text-center mb-12 max-w-3xl mx-auto"
              >
                Flathead Lake and the surrounding area offer countless
                adventures beyond parasailing. Here are some must-visit
                attractions nearby.
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {attractions.map((attraction, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AttractionCard
                      title={attraction.title}
                      description={attraction.description}
                      distance={attraction.distance}
                      image={attraction.image}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div
                variants={fadeIn}
                className="mt-12 text-center"
              >
                <Link
                  to="/book"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-block"
                >
                  Book Your Adventure
                </Link>
                <p className="mt-4 text-sm text-gray-600">
                  Make parasailing the highlight of your Flathead Lake vacation!
                </p>
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
                Ready to Soar Above Flathead Lake?
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg mb-8 max-w-2xl mx-auto"
              >
                Contact us today to book your parasailing adventure at Flathead
                Harbor Marina!
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-4"
              >
                <a
                  href="tel:406-270-6256"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  (406) 270-6256
                </a>
                <a
                  href="mailto:bigskyparasailing@gmail.com"
                  className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Send Email
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default LocationPage;
