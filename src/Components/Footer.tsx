import React from 'react';

// Theme colors
const YELLOW = "#FFD700"; // Bright yellow for primary brand color
const TEAL = "#40E0D0"; // Vibrant teal
const LIGHT_TEAL = "#7FFFD4"; // Lighter teal (Aquamarine)
const DARK_TEAL = "#20B2AA"; // Dark teal (LightSeaGreen)
const DEEP_TEAL = "#008080"; // Deep teal (Teal)
const WHITE = "#FFFFFF"; // White for text and contrast
const SAND = "#F5F5DC"; // Light sand color for subtle elements
const OFF_WHITE = "#F0F0F0"; // Off-white for text on darker backgrounds

interface ParasailFooterProps {
  companyName?: string;
  email?: string;
  location?: string;
  locationUrl?: string;
  showSocialIcons?: boolean;
}

const ParasailFooter: React.FC<ParasailFooterProps> = ({
  companyName = "BIG SKY PARASAIL",
  email = "info@mellowmontana.com",
  location = "Flathead Harbor Marina, Lakeside, MT",
  locationUrl = "https://maps.google.com/?q=Flathead+Harbor+Marina,+7007+U.S.+93+S,+Lakeside,+MT+59922",
  showSocialIcons = false
}) => {
  return (
    <footer
      style={{ 
        backgroundColor: DEEP_TEAL
      }}
      className="py-12 px-4 border-t border-teal-700"
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info Section */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>
              {companyName}
            </h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Providing unforgettable aerial adventures over Montana's most
              beautiful lake since 2022. Our mission is to create safe,
              thrilling experiences that showcase the natural beauty of
              Flathead Lake and the surrounding wilderness.
            </p>
            
            {showSocialIcons && (
              <div className="flex space-x-4 mb-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: LIGHT_TEAL }}
                  aria-label="Instagram"
                >
                  <span className="text-black font-bold">IG</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: LIGHT_TEAL }}
                  aria-label="Facebook"
                >
                  <span className="text-black font-bold">FB</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: LIGHT_TEAL }}
                  aria-label="Twitter"
                >
                  <span className="text-black font-bold">TW</span>
                </a>
              </div>
            )}
            
            {/* <p className="text-gray-400">
              © {new Date().getFullYear()} BIG SKY PARASAIL Co. All rights reserved.
            </p> */}
          </div>

          {/* Quick Links Section - Preserving original navigation */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>
              QUICK LINKS
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about#experience"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  The Experience
                </a>
              </li>
              <li>
                <a
                  href="/about#safety"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Safety
                </a>
              </li>
              <li>
                <a
                  href="/about#location"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Location
                </a>
              </li>
              <li>
                <a
                  href="/about#testimonials"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Reviews
                </a>
              </li>
              <li>
                <a
                  href="/booking"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Book Now
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold mb-4" style={{ color: YELLOW }}>
              CONTACT US
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300 mb-2 flex items-center group">
                <span className="mr-2 text-xl">📧</span>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white group-hover:underline"
                >
                  {email}
                </a>
              </p>
              
              <p className="text-gray-300 mb-6 flex items-start group">
                <span className="mr-2 text-xl mt-1">📍</span>
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
                <h4
                  className="text-md font-semibold mb-2"
                  style={{ color: LIGHT_TEAL }}
                >
                  HOURS
                </h4>
                <p className="text-gray-300 mb-1">May-September: Daily 9am-7pm</p>
                <p className="text-gray-300">October: Fri-Sun 10am-5pm</p>
              </div>
              

            </div>
          </div>
        </div>
        

      </div>
    </footer>
  );
};

export default ParasailFooter;