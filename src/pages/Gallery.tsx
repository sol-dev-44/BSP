import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";

const galleryPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Big Sky Parasail Photo & Video Gallery",
  "description":
    "Browse stunning photos and videos from parasailing adventures on Flathead Lake, Montana. See breathtaking aerial views and happy customers.",
  "url": "https://www.montanaparasail.com/gallery",
  "image":
    "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//WhiteFishSmiles.jpg",
  "provider": {
    "@type": "Organization",
    "name": "Big Sky Parasail",
    "telephone": "(406) 270-6256",
  },
};

// Gallery item types
interface GalleryItem {
  id: string;
  type: "image" | "video" | "youtube" | "instagram" | "facebook";
  src: string;
  thumbnail?: string;
  title: string;
  description?: string;
  category: string;
  featured?: boolean;
  youtubeId?: string;
  instagramId?: string;
  facebookId?: string;
}

// Sample gallery data - replace with your actual content
const galleryItems: GalleryItem[] = [
  // Featured Items
  {
    id: "0",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//threeKids.jpg",
    title: "Smile for the camera… or scream into the void. Either works! 📸🪂",
    description: `Parasailing: where friendship meets fear at 500 feet.
#BigSkyParasail #AltitudeAttitude #MontanaAirMoments #flatheadlake`,
    category: "aerial",
    featured: true,
  },
  {
    id: "1",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//HighAerial.jpeg",
    title: "Soaring Above Flathead Lake",
    description:
      "Breathtaking aerial view of parasailers high above the crystal waters",
    category: "aerial",
    featured: true,
  },
  {
    id: "2",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//WhiteFishSmiles.jpg",
    title: "Happy Adventurers",
    description: "Smiling faces after an incredible parasailing experience",
    category: "customers",
    featured: true,
  },
  {
    id: "3",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//cloudDancerInclineDock.jpg",
    title: "Cloud Dancer at Marina",
    description: "Our professional parasail vessel ready for adventure",
    category: "boat",
    featured: true,
  },

  // Regular Gallery Items
  {
    id: "3c",
    type: "image",
    src: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//leroyDock.jpg",
    title: "After an extensive background check (he's a good boy), Leroy has been appointed Chief of Dock Security. Current threat level: YELLOW (a leaf blew by).",
    category: "boat"
  },
  {
    id: "4",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//FlatheadWithShadow.jpg",
    title: "Mountain Shadows on Flathead Lake",
    category: "scenery",
  },
  {
    id: "5",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//FlatheadAerial.jpg",
    title: "Aerial Lake View",
    category: "aerial",
  },
  {
    id: "6",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//DaytonaImage.png",
    title: "Perfect Parasailing Weather",
    category: "customers",
  },
  {
    id: "7",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//fourthJuly.jpg",
    title: "4th of July Celebration",
    category: "events",
  },
  {
    id: "8",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wildHorseIsland.jpeg",
    title: "Wild Horse Island Adventure",
    category: "scenery",
  },

  {
    id: "9",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//girlwake.jpeg",
    title: "Wakeboarding Fun",
    category: "watersports",
  },
  {
    id: "10",
    type: "video",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//ownBusiness.mp4",
    thumbnail:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//ownBusiness.mp4",
    title: "Parasailing Adventure Video",
    description:
      "Amazing first-person view of parasailing high above Flathead Lake",
    category: "videos",
  },

  // YouTube Examples
  {
    id: "11",
    type: "youtube",
    src: "",
    youtubeId: "MRdWd5ANohY", // Replace with actual YouTube video ID
    title: "Parasailing Safety Video",
    description:
      "Learn about our top-notch safety measures and equipment for a secure parasailing experience.",
    category: "videos",
  },

  //   {
  //     id: '13',
  //     type: 'facebook',
  //     src: '',
  //     facebookId: '10153231379946729', // Replace with actual Facebook post ID
  //     title: 'Facebook Post Example',
  //     category: 'social'
  //   },

  // Instagram Examples
  //   {
  //     id: '12',
  //     type: 'instagram',
  //     src: '',
  //     instagramId: 'CExample123', // Replace with actual Instagram post ID
  //     title: 'Latest Instagram Post',
  //     category: 'social'
  //   }
  {
    id: "14",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfdip1.JPG",
    title: "Dips are optional and fun!",
    description: "A little splash never hurt anyone.",
    category: "customers",
  },
  {
    id: "15",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfdip2.JPG",
    title: "How low can you go?",
    description: "Getting close to the water surface.",
    category: "customers",
  },
  {
    id: "16",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfdip3.JPG",
    title: "Making a splash!",
    description: "Enjoying the thrill of parasailing with a fun dip.",
    category: "customers",
  },
  {
    id: "17",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfladies2.JPG",
    title: "Ladies Day Out",
    description:
      "A group of friends enjoying a sunny day parasailing in Montana.",
    category: "customers",
  },
  {
    id: "19",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//tripFam.JPG",
    title: "Three People, One Adventure",
    description:
      "A trio of parasailers taking in the stunning views of Flathead Lake.",
    category: "customers",
  },
  {
    id: "20",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfLineView.JPG",
    title: "I walk the line",
    description:
      "Parasailors enjoying the serene views while being towed by the boat.",
    category: "customers",
  },
  {
    id: "21",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfTripFar.JPG",
    title: "Far and Wide",
    description:
      "A group of parasailers exploring the vast expanse of the Lake from above.",
    category: "customers",
  },
  {
    id: "22",
    type: "image",
    src:
      "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfSunset.JPG",
    title: "Golden Hour Flight",
    description:
      "Soaring high during the golden hour, capturing the beauty of Flathead Lake at sunset.",
    category: "scenery",
  },
  {
    id: "23",
    type: "image",
    src: "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//DeadLogo.png",
    title: "Keep on Truckin",
    description: "Ripple in still water, When there is no pebble tossed, Nor wind to blow ",
    category: "scenery",
  }
  // {
  //     id: '23',
  //     type: 'image',
  //     src: '/wfSunset3.JPG',
  //     title: 'Evening Elegance',
  //     description: 'A parasailer silhouetted against the vibrant colors of a Flathead Lake sunset.',
  //     category: 'scenery'
  // }
];

const categories = [
  { id: "all", name: "All", icon: "🌟" },
  { id: "aerial", name: "Aerial Views", icon: "🪂" },
  { id: "customers", name: "Happy Customers", icon: "😊" },
  { id: "boat", name: "Cloud Dancer", icon: "🚤" },
  { id: "scenery", name: "Scenery", icon: "🏔️" },
  //   { id: 'watersports', name: 'Water Sports', icon: '🏄‍♂️' },
  { id: "events", name: "Special Events", icon: "🎆" },
  { id: "videos", name: "Videos", icon: "🎥" },
  //   { id: 'social', name: 'Social Media', icon: '📱' }
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

// Gallery Item Component
const GalleryItemComponent: React.FC<
  { item: GalleryItem; onClick: () => void }
> = ({ item, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  // Reset states when item changes
  useEffect(() => {
    setImageLoaded(false);
    setThumbnailError(false);
  }, [item.id]);

  const getItemContent = () => {
    switch (item.type) {
      case "image":
        return (
          <div className="relative w-full h-full bg-gray-100">
            <img
              src={item.src}
              alt={item.title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.error(`Failed to load image: ${item.src}`);
                setImageLoaded(true);
              }}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2">
                  </div>
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              </div>
            )}
          </div>
        );

      case "video":
        return (
          <div className="relative w-full h-full bg-gray-900">
            {/* Show thumbnail if provided and not errored */}
            {item.thumbnail && !thumbnailError
              ? (
                <>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      console.log(
                        "✅ Thumbnail loaded successfully:",
                        item.thumbnail,
                      );
                      setImageLoaded(true);
                    }}
                    onError={(e) => {
                      console.log(
                        "❌ Thumbnail failed to load:",
                        item.thumbnail,
                      );
                      setThumbnailError(true);
                    }}
                  />
                  {/* Loading state for thumbnail */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2">
                        </div>
                        <p className="text-sm">Loading thumbnail...</p>
                      </div>
                    </div>
                  )}
                </>
              )
              : (
                /* Fallback: Try video preview or show placeholder */
                <>
                  {!thumbnailError && item.src
                    ? (
                      <video
                        src={item.src}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        onLoadedData={() => {
                          console.log("✅ Video preview loaded:", item.src);
                          setImageLoaded(true);
                        }}
                        onError={() => {
                          console.log("❌ Video preview failed:", item.src);
                          setThumbnailError(true);
                        }}
                      />
                    )
                    : (
                      /* Final fallback placeholder */
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <p className="font-semibold">Video</p>
                          <p className="text-sm text-gray-300">Click to play</p>
                        </div>
                      </div>
                    )}
                </>
              )}

            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        );

      case "youtube":
        return (
          <div className="relative w-full h-full bg-black">
            <img
              src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`}
              alt={item.title}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                // Try standard quality thumbnail if maxres fails
                const img = document.createElement("img");
                img.src =
                  `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
                img.onload = () => setImageLoaded(true);
                img.onerror = () => setImageLoaded(true);
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="bg-red-600 rounded-full p-4 hover:bg-red-700 transition-all duration-200 transform hover:scale-110">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
            </div>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2">
                  </div>
                  <p className="text-sm">Loading video...</p>
                </div>
              </div>
            )}
          </div>
        );

      case "instagram":
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <div className="bg-white rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <p className="font-bold text-lg mb-2">Instagram Post</p>
              <p className="text-sm opacity-90">Click to view on Instagram</p>
            </div>
          </div>
        );

      case "facebook":
        return (
          <div className="relative w-full h-full bg-blue-600 flex items-center justify-center">
            <div className="bg-white rounded-full p-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      variants={scaleIn}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group ${
        item.featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <div
        className={`relative ${
          item.featured ? "h-80 md:h-full" : "h-64"
        } overflow-hidden`}
      >
        {getItemContent()}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
          <h3 className="font-bold text-lg mb-1 text-white drop-shadow-lg">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm text-gray-100 drop-shadow-md">
              {item.description}
            </p>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            {categories.find((cat) => cat.id === item.category)?.name ||
              item.category}
          </span>
        </div>

        {/* Featured badge */}
        {item.featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Lightbox Modal Component
const LightboxModal: React.FC<
  { item: GalleryItem | null; onClose: () => void }
> = ({ item, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (item) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose, item]);

  // Pause video when modal closes
  useEffect(() => {
    if (!item && videoRef.current) {
      videoRef.current.pause();
    }
  }, [item]);

  if (!item) return null;

  const renderContent = () => {
    switch (item.type) {
      case "image":
        return (
          <img
            src={item.src}
            alt={item.title}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        );

      case "video":
        return (
          <div className="relative w-full max-w-5xl">
            <video
              ref={videoRef}
              src={item.src}
              controls
              autoPlay
              className="w-full h-auto min-h-[60vh] max-h-[80vh] rounded-lg shadow-2xl bg-black"
              style={{ minWidth: "800px" }}
              onError={(e) => {
                console.error(`Failed to load video: ${item.src}`);
              }}
            >
              <p className="text-white text-center p-4">
                Your browser doesn't support video playback.
                <a href={item.src} className="text-blue-400 underline ml-2">
                  Download video
                </a>
              </p>
            </video>
          </div>
        );

      case "youtube":
        return (
          <div className="relative w-full max-w-5xl">
            <div
              className="aspect-video"
              style={{ minWidth: "800px", minHeight: "450px" }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
                className="w-full h-full rounded-lg shadow-2xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={item.title}
              />
            </div>
          </div>
        );

      case "instagram":
        return (
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-300 mb-6">View this post on Instagram</p>
            </div>
            <a
              href={`https://www.instagram.com/p/${item.instagramId}/`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 inline mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z" />
              </svg>
              Open in Instagram
            </a>
          </div>
        );

      case "facebook":
        return (
          <div className="text-center">
            <p className="text-white mb-4">View this post on Facebook</p>
            <a
              href={`https://www.facebook.com/${item.facebookId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Open in Facebook
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-7xl max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-50"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {renderContent()}

            {/* Title and description for videos - below the video, not overlapping */}
            {(item.title || item.description) &&
              (item.type === "video" || item.type === "youtube") && (
              <div className="text-center max-w-2xl px-4">
                <h3 className="text-white text-xl font-bold mb-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-gray-300">{item.description}</p>
                )}
              </div>
            )}
          </div>

          {/* Title and description for images - overlay style */}
          {(item.title || item.description) && item.type === "image" && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h3 className="text-white text-xl font-bold mb-2">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-gray-300">{item.description}</p>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Gallery Component
const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const navigate = useNavigate();

  const filteredItems = selectedCategory === "all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <>
      <div className="w-full">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <div className="absolute inset-0 z-0">
            <div className="absolute w-full h-full bg-black opacity-40"></div>
            <img
              src="https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//HighAerial.jpeg"
              alt="Parasailing gallery hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />
            </div>
          </div>

          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <span className="inline-block bg-amber-500 text-white px-6 py-3 rounded-full text-lg font-bold tracking-wide shadow-2xl">
                  📸 GALLERY 🎥
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
              >
                Capture the <span className="text-amber-300">Adventure</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed"
              >
                Browse stunning photos and videos from our parasailing
                adventures. See the world from 300 feet above Flathead Lake!
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <button
                  onClick={() => navigate("/reservations/book/time")}
                  className="px-10 py-5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-2 flex items-center justify-center"
                >
                  <span className="mr-3 text-2xl">🪂</span>
                  Book Your Adventure
                </button>
                <a
                  href="#gallery"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("gallery")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="px-10 py-5 bg-black bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-2 flex items-center justify-center border-2 border-white border-opacity-30"
                >
                  <span className="mr-3 text-2xl">📷</span>
                  View Gallery Below
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Wave separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 120"
              animate={{
                x: [-50, 50, -50],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              />
            </motion.svg>
          </div>
        </div>

        {/* Gallery Section */}
        <section id="gallery" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Category filters */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="mb-12"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-bold text-center mb-8 text-gray-900"
              >
                Browse by Category
              </motion.h2>

              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    variants={fadeInUp}
                    onClick={() => setSelectedCategory(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white transform -translate-y-1"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Gallery grid */}
            <motion.div
              key={selectedCategory}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max"
            >
              <AnimatePresence mode="wait">
                {filteredItems.map((item) => (
                  <GalleryItemComponent
                    key={`${selectedCategory}-${item.id}`}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* No results message */}
            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600">
                  Try selecting a different category
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Photo Package Information Section */}
        <section className="py-16 bg-white">
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
                Capture Your Adventure Forever
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto"
              >
                Don't let your once-in-a-lifetime parasailing experience become
                just a memory. Take home professional photos and videos to share
                with family and friends!
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  variants={fadeInUp}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Photo Package
                  </h3>
                  <div className="text-4xl font-bold text-blue-600 mb-4">
                    $30
                  </div>
                  <p className="text-gray-700 mb-6">
                    Our crew member captures your entire parasailing experience
                    from the boat, getting amazing shots of you flying high
                    above Flathead Lake.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Professional photos from boat
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Mini SD card with adapter included
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Multiple angles and perspectives
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Ready to share immediately
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="bg-amber-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    GoPro Package
                  </h3>
                  <div className="text-4xl font-bold text-amber-500 mb-4">
                    $30
                  </div>
                  <p className="text-gray-700 mb-6">
                    Take a GoPro camera up with you in the parachute for an
                    incredible first-person perspective of your flight high
                    above the lake!
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        GoPro camera goes up with you
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        First-person perspective video
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        SD card with adapter included
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Unique aerial footage
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                variants={fadeInUp}
                className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-8 rounded-2xl shadow-xl"
              >
                <h3 className="text-2xl font-bold mb-4">
                  📸 Why Choose Our Photo Packages?
                </h3>
                <p className="text-lg text-blue-100 mb-6">
                  Your parasailing adventure happens once - make sure you can
                  relive it forever! Our photo and video packages ensure you'll
                  have stunning memories to share.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl mb-2">📱</div>
                    <p className="font-semibold">Instant Access</p>
                    <p className="text-sm text-blue-200">
                      Take your memories home immediately
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">🎥</div>
                    <p className="font-semibold">Professional Quality</p>
                    <p className="text-sm text-blue-200">
                      High-resolution photos and HD video
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">💝</div>
                    <p className="font-semibold">Perfect Gifts</p>
                    <p className="text-sm text-blue-200">
                      Share with family and friends
                    </p>
                  </div>
                </div>
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
                Ready to Create Your Own Memories?
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg mb-8 max-w-2xl mx-auto"
              >
                Book your parasailing adventure today and become part of our
                gallery! Professional photos and videos available to capture
                your experience.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  onClick={() => navigate("/reservations/book/time")}
                >
                  Book Your Adventure
                </button>
                <a
                  href="tel:406-270-6256"
                  className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Call (406) 270-6256
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
};

export default GalleryPage;
