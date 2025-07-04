// Components/SEO.tsx - Enhanced SEO Component
import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "business.business";
  keywords?: string;
  structuredData?: Record<string, any>;
  noIndex?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/FlatheadWithShadow.jpg",
  ogType = "website",
  keywords = "parasailing Montana, Flathead Lake parasailing, Big Sky Parasail, Montana water sports, lake activities, adventure tours, scenic flights, water adventures, summer activities Montana, Flathead Lake recreation",
  structuredData,
  noIndex = false,
  author = "Big Sky Parasail",
  publishedTime,
  modifiedTime,
}) => {
  // Enhanced site title with better branding
  const siteTitle = title.includes("Big Sky Parasail") ? title : `${title} | Big Sky Parasail - Montana Parasailing on Flathead Lake`;
  
  // Ensure description is optimal length (150-160 characters)
  const optimizedDescription = description.length > 160 
    ? description.substring(0, 157) + "..."
    : description;

  // Get current URL if not provided
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://www.montanaparasail.com');
  
  // Enhanced structured data for local business
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["TouristAttraction", "LocalBusiness", "SportsActivityLocation"],
        "@id": "https://www.montanaparasail.com/#business",
        "name": "Big Sky Parasail",
        "alternateName": ["Montana Parasailing", "Flathead Lake Parasailing"],
        "description": "Experience the ultimate parasailing adventure on Montana's pristine Flathead Lake with breathtaking mountain views and professional service.",
        "image": [
          "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/FlatheadWithShadow.jpg",
          "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/WhiteFishSmiles.jpg",
          "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/cloudDancerInclineDock.jpg"
        ],
        "logo": "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/FlatheadWithShadow.jpg",
        "url": "https://www.montanaparasail.com",
        "telephone": "+1-406-270-6256",
        "email": "bigskyparasailing@gmail.com",
        "priceRange": "$$",
        "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
        "currenciesAccepted": "USD",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Flathead Lake",
          "addressRegion": "Montana",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 47.8921,
          "longitude": -114.0719
        },
        "areaServed": [
          {
            "@type": "State",
            "name": "Montana"
          },
          {
            "@type": "City", 
            "name": "Kalispell"
          },
          {
            "@type": "City",
            "name": "Whitefish"
          },
          {
            "@type": "City",
            "name": "Bigfork"
          }
        ],
        "serviceType": "Parasailing",
        "sport": "Parasailing",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "09:00",
            "closes": "18:00",
            "validFrom": "2024-05-01",
            "validThrough": "2024-10-31"
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Parasailing Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Parasailing Flight",
                "description": "8-10 minute parasailing experience with stunning mountain views"
              },
              "price": "99",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "validFrom": "2024-05-01",
              "validThrough": "2024-10-31"
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "Service",
                "name": "Boat Rider",
                "description": "Join the parasailing boat as a non-flying passenger"
              },
              "price": "30",
              "priceCurrency": "USD"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "127",
          "bestRating": "5",
          "worstRating": "1"
        },
        "sameAs": [
          "https://www.facebook.com/BigSkyParasail",
          "https://www.instagram.com/bigskyparasail"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.montanaparasail.com/#website",
        "url": "https://www.montanaparasail.com",
        "name": "Big Sky Parasail",
        "description": "Montana's premier parasailing adventure on Flathead Lake",
        "publisher": {
          "@id": "https://www.montanaparasail.com/#business"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.montanaparasail.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      }
    ]
  };
  
  // Use either the provided structured data or the enhanced default
  const finalStructuredData = structuredData || defaultStructuredData;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Robots Meta */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {!noIndex && <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />}
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Parasailing adventure on Flathead Lake Montana" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Big Sky Parasail" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Parasailing adventure on Flathead Lake Montana" />
      <meta name="twitter:creator" content="@BigSkyParasail" />
      <meta name="twitter:site" content="@BigSkyParasail" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="application-name" content="Big Sky Parasail" />
      <meta name="apple-mobile-web-app-title" content="Big Sky Parasail" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Geographic Tags */}
      <meta name="geo.region" content="US-MT" />
      <meta name="geo.placename" content="Flathead Lake, Montana" />
      <meta name="geo.position" content="47.8921;-114.0719" />
      <meta name="ICBM" content="47.8921, -114.0719" />
      
      {/* Business/Contact Info */}
      <meta name="contact" content="bigskyparasailing@gmail.com" />
      <meta name="reply-to" content="bigskyparasailing@gmail.com" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
      {/* Canonical Link */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://yginjzlfezyalgosdjtl.supabase.co" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//js.stripe.com" />
      <link rel="dns-prefetch" href="//api.stripe.com" />
      
      {/* Alternative Language Pages (if available) */}
      <link rel="alternate" hrefLang="en" href={currentUrl} />
      
      {/* Mobile App Links (if you have apps) */}
      <meta property="al:web:url" content={currentUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Additional Meta for Rich Snippets */}
      <meta itemProp="name" content={siteTitle} />
      <meta itemProp="description" content={optimizedDescription} />
      <meta itemProp="image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;