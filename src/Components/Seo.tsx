// Components/SEO.tsx
import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string;
  structuredData?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl = "https://www.montanaparasail.com", // Updated with your actual domain
  ogImage = "https://www.montanaparasail.com/FlatheadWithShadow.jpg", // Using your existing image
  ogType = "website",
  keywords = "parasailing, Flathead Lake, Montana parasailing, Big Sky Parasail, water sports, adventure",
  structuredData,
}) => {
  const siteTitle = `${title} | Big Sky Parasail`;
  
  // Default structured data for your business
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "Big Sky Parasail",
    "description": "Montana's premier parasailing adventure on the breathtaking Flathead Lake",
    "image": "https://www.montanaparasail.com/WhiteFishSmiles.jpg",
    "url": "https://www.montanaparasail.com",
    "@id": "https://www.montanaparasail.com",
    "telephone": "+1-406-123-4567", // Update with your actual phone
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Dock Location", // Update with actual address
      "addressLocality": "Flathead Lake",
      "addressRegion": "MT",
      "postalCode": "59901", // Update with actual zip
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.0456, // Update with actual coordinates for your dock
      "longitude": -114.0618
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ]
  };
  
  // Use either the provided structured data or the default
  const finalStructuredData = structuredData || defaultStructuredData;
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      
      Twitter
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;