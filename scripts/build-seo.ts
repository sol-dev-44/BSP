// scripts/build-seo.ts - Enhanced SEO Build Script

import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

// Define constants
const PUBLIC_DIR = "./public";
const ROUTES_FILE = "./src/RoutesIndex.tsx";
const SITE_URL = "https://www.montanaparasail.com";
const BUSINESS_NAME = "Big Sky Parasail";

// Interface for page data with enhanced metadata
interface Page {
  path: string;
  priority: string;
  changefreq: string;
  title: string;
  description: string;
  keywords: string[];
  lastmod: string;
}

// Enhanced route categories for better SEO optimization
const ROUTE_CATEGORIES = {
  home: {
    paths: ["/"],
    priority: "1.0",
    changefreq: "weekly",
    keywords: ["parasailing Montana", "Flathead Lake", "water sports", "adventure tours"]
  },
  reservations: {
    paths: ["/reservations", "/reservations/book/time", "/reservations/book/info", "/reservations/book/payment", "/reservations/book/confirmation"],
    priority: "0.9",
    changefreq: "daily",
    keywords: ["book parasailing", "reservations", "schedule", "online booking"]
  },
  services: {
    paths: ["/about", "/theboat", "/charters", "/gallery"],
    priority: "0.8",
    changefreq: "monthly",
    keywords: ["parasailing services", "boat tours", "Flathead Lake activities", "Montana adventures"]
  },
  information: {
    paths: ["/location", "/faq", "/careers"],
    priority: "0.7",
    changefreq: "monthly",
    keywords: ["location", "information", "frequently asked questions", "careers"]
  }
};

// Routes to exclude from SEO (admin, dynamic, etc.)
const EXCLUDED_ROUTES = [
  "/management-console",
  "/management-console-login",
  "*", // wildcard routes
  ":id", // dynamic routes
  "edit", // edit routes
  "create", // create routes
];

// Function to ensure the public directory exists
async function ensurePublicDir() {
  try {
    await Deno.stat(PUBLIC_DIR);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.mkdir(PUBLIC_DIR, { recursive: true });
      console.log(`📁 Created directory: ${PUBLIC_DIR}`);
    } else {
      throw error;
    }
  }
}

// Enhanced route extraction with better filtering
async function extractRoutes(): Promise<string[]> {
  try {
    const content = await Deno.readTextFile(ROUTES_FILE);
    
    // More comprehensive regex to extract routes
    const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
    const routes: string[] = [];
    let match;
    
    while ((match = routeRegex.exec(content)) !== null) {
      const route = match[1];
      
      // Filter out excluded routes
      const shouldExclude = EXCLUDED_ROUTES.some(excluded => {
        if (excluded === "*") return route.includes("*");
        if (excluded === ":id") return route.includes(":");
        return route.includes(excluded);
      });
      
      if (!shouldExclude && route !== "") {
        routes.push(route);
      }
    }
    
    // Remove duplicates and sort
    return [...new Set(routes)].sort();
  } catch (error) {
    console.warn(`⚠️  Could not read routes file: ${error.message}`);
    // Enhanced fallback routes
    return [
      "/",
      "/about", 
      "/theboat",
      "/location",
      "/faq", 
      "/careers",
      "/charters",
      "/gallery",
      "/reservations/book/time"
    ];
  }
}

// Enhanced metadata generation based on route
function getEnhancedPageMetadata(path: string): Omit<Page, 'path' | 'lastmod'> {
  const today = new Date().toISOString();
  
  // Find category for the route
  let category = null;
  for (const [categoryName, categoryData] of Object.entries(ROUTE_CATEGORIES)) {
    if (categoryData.paths.includes(path) || categoryData.paths.some(p => path.startsWith(p))) {
      category = { name: categoryName, ...categoryData };
      break;
    }
  }
  
  // Default category if not found
  if (!category) {
    category = {
      name: "default",
      priority: "0.6",
      changefreq: "monthly",
      keywords: ["Montana parasailing", "Flathead Lake"]
    };
  }
  
  // Generate page-specific metadata
  const pageMetadata: Record<string, any> = {
    "/": {
      title: "Montana Parasailing on Flathead Lake | Big Sky Parasail",
      description: "Experience the ultimate parasailing adventure on Montana's pristine Flathead Lake. Soar 400+ feet above crystal clear waters with breathtaking mountain views. Book your unforgettable adventure today!",
      keywords: ["Montana parasailing", "Flathead Lake parasailing", "Big Sky Parasail", "water sports Montana", "adventure tours", "scenic flights", "summer activities"]
    },
    "/about": {
      title: "About Our Parasailing Experience | Big Sky Parasail Montana",
      description: "Discover what makes Big Sky Parasail Montana's premier parasailing experience. Professional equipment, certified captains, and unmatched safety on beautiful Flathead Lake.",
      keywords: ["parasailing experience", "professional parasailing", "certified captains", "safety equipment", "Flathead Lake adventures"]
    },
    "/theboat": {
      title: "Our Parasailing Boat | Professional Equipment | Big Sky Parasail",
      description: "Meet our state-of-the-art parasailing vessel designed for safety and comfort. Learn about our professional equipment and experienced crew on Flathead Lake.",
      keywords: ["parasailing boat", "professional equipment", "safety vessel", "experienced crew", "marine equipment"]
    },
    "/location": {
      title: "Flathead Lake Location & Directions | Big Sky Parasail Montana",
      description: "Find Big Sky Parasail on beautiful Flathead Lake, Montana. Get directions, parking information, and discover why Flathead Lake is perfect for parasailing adventures.",
      keywords: ["Flathead Lake location", "Montana parasailing location", "directions", "parking", "lake access"]
    },
    "/faq": {
      title: "Parasailing FAQ | Common Questions | Big Sky Parasail Montana",
      description: "Get answers to frequently asked questions about parasailing on Flathead Lake. Learn about safety, weather policies, what to bring, and booking information.",
      keywords: ["parasailing FAQ", "safety questions", "weather policy", "booking information", "what to expect"]
    },
    "/careers": {
      title: "Careers | Join Our Team | Big Sky Parasail Montana",
      description: "Join the Big Sky Parasail team! Explore career opportunities in Montana's premier parasailing company on beautiful Flathead Lake.",
      keywords: ["parasailing careers", "Montana jobs", "marine jobs", "seasonal employment", "tourism jobs"]
    },
    "/charters": {
      title: "Private Charters & Group Bookings | Big Sky Parasail Montana",
      description: "Book private parasailing charters and group adventures on Flathead Lake. Perfect for celebrations, corporate events, and special occasions.",
      keywords: ["private charters", "group bookings", "corporate events", "celebrations", "special occasions"]
    },
    "/gallery": {
      title: "Parasailing Photos & Videos | Gallery | Big Sky Parasail Montana",
      description: "View stunning photos and videos of parasailing adventures on Flathead Lake. See the breathtaking mountain views and crystal clear waters from above.",
      keywords: ["parasailing photos", "Flathead Lake views", "adventure gallery", "mountain views", "aerial photography"]
    },
    "/reservations/book/time": {
      title: "Book Your Parasailing Adventure | Reservations | Big Sky Parasail",
      description: "Book your Flathead Lake parasailing adventure online. Choose your time, select add-ons, and secure your spot for an unforgettable Montana experience.",
      keywords: ["book parasailing", "online reservations", "schedule adventure", "Flathead Lake booking", "parasailing times"]
    }
  };
  
  // Get specific metadata or use defaults
  const specific = pageMetadata[path] || {
    title: `${path.split('/').filter(Boolean).join(' ').replace(/\b\w/g, l => l.toUpperCase())} | ${BUSINESS_NAME}`,
    description: `Explore ${path.split('/').filter(Boolean).join(' ')} at ${BUSINESS_NAME} on Flathead Lake, Montana.`,
    keywords: category.keywords
  };
  
  return {
    priority: category.priority,
    changefreq: category.changefreq,
    title: specific.title,
    description: specific.description,
    keywords: Array.isArray(specific.keywords) ? specific.keywords : category.keywords
  };
}

// Generate enhanced robots.txt
async function generateRobotsTxt() {
  const robotsContent = `# Robots.txt for ${BUSINESS_NAME}
# Generated on ${new Date().toISOString()}

User-agent: *
Allow: /

# Disallow admin and management areas
Disallow: /management-console/
Disallow: /management-console-login
Disallow: /admin/
Disallow: /wp-admin/
Disallow: /api/

# Disallow common non-public paths
Disallow: /private/
Disallow: /temp/
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /*?*debug*
Disallow: /*?*test*

# Allow specific important files
Allow: /sitemap.xml
Allow: /robots.txt
Allow: /favicon.ico
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.gif
Allow: /*.webp

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Additional sitemaps (if you create them)
# Sitemap: ${SITE_URL}/sitemap-images.xml
# Sitemap: ${SITE_URL}/sitemap-news.xml`;

  const robotsPath = join(PUBLIC_DIR, "robots.txt");
  await Deno.writeTextFile(robotsPath, robotsContent);
  console.log(`✅ Generated enhanced robots.txt`);
}

// Generate comprehensive sitemap.xml
async function generateSitemap() {
  const routes = await extractRoutes();
  const today = new Date().toISOString().split('T')[0];
  
  // Create enhanced page objects with metadata
  const pages: Page[] = routes.map(route => ({
    path: route,
    lastmod: today,
    ...getEnhancedPageMetadata(route)
  }));

  // Sort pages by priority (highest first)
  pages.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));
  
  // Generate sitemap XML with enhanced metadata
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
                            http://www.google.com/schemas/sitemap-image/1.1
                            http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
${pages.map(page => `
  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.path === '/' ? `
    <image:image>
      <image:loc>https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/FlatheadWithShadow.jpg</image:loc>
      <image:title>Parasailing on Flathead Lake Montana</image:title>
      <image:caption>Experience breathtaking parasailing adventures on pristine Flathead Lake</image:caption>
    </image:image>` : ''}
  </url>`).join('')}
</urlset>`;

  const sitemapPath = join(PUBLIC_DIR, "sitemap.xml");
  await Deno.writeTextFile(sitemapPath, sitemapContent);
  console.log(`✅ Generated comprehensive sitemap.xml with ${pages.length} pages`);
  
  // Log organized results
  console.log("\n📄 SEO-optimized pages by priority:");
  pages.forEach(page => {
    console.log(`  • ${page.path.padEnd(25)} (${page.priority}) - ${page.changefreq}`);
  });
  
  return pages;
}

// Generate manifest.json for PWA
async function generateManifest() {
  const manifestContent = {
    "name": `${BUSINESS_NAME} - Montana Parasailing`,
    "short_name": "Big Sky Parasail",
    "description": "Experience the ultimate parasailing adventure on Montana's pristine Flathead Lake",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#2563eb",
    "orientation": "portrait-primary",
    "categories": ["travel", "sports", "recreation"],
    "lang": "en-US",
    "scope": "/",
    "icons": [
      {
        "src": "/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icon-512x512.png", 
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ],
    "screenshots": [
      {
        "src": "https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images/FlatheadWithShadow.jpg",
        "sizes": "1280x720",
        "type": "image/jpeg",
        "form_factor": "wide",
        "label": "Parasailing on Flathead Lake"
      }
    ]
  };

  const manifestPath = join(PUBLIC_DIR, "manifest.json");
  await Deno.writeTextFile(manifestPath, JSON.stringify(manifestContent, null, 2));
  console.log(`✅ Generated PWA manifest.json`);
}

// Generate humans.txt
async function generateHumansTxt() {
  const humansContent = `/* TEAM */
Developer: Big Sky Parasail Development Team
Site: ${SITE_URL}
Location: Flathead Lake, Montana, USA

/* SITE */
Standards: HTML5, CSS3, JavaScript ES6+
Components: React, TypeScript, Tailwind CSS
Software: VS Code, Deno, Vite
Last update: ${new Date().toISOString().split('T')[0]}
Language: English
Doctype: HTML5
IDE: Visual Studio Code

/* THANKS */
Fonts: Inter, system fonts
Images: Professional photography of Flathead Lake
Hosting: Modern web hosting platform
Analytics: Privacy-focused analytics

                            .-""""""-.
                          .'          '.
                         /   O      O   \\
                        :           '    :
                        |                |
                        :    .------.    :
                         \\  '        '  /
                          '.          .'
                            '-.......-'
                     
            Thank you for visiting ${BUSINESS_NAME}!`;

  const humansPath = join(PUBLIC_DIR, "humans.txt");
  await Deno.writeTextFile(humansPath, humansContent);
  console.log(`✅ Generated humans.txt`);
}

// Generate security.txt
async function generateSecurityTxt() {
  const securityContent = `Contact: mailto:bigskyparasailing@gmail.com
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
Preferred-Languages: en
Canonical: ${SITE_URL}/.well-known/security.txt

# Security policy
# We take security seriously. Please report any security issues responsibly.`;

  // Create .well-known directory if it doesn't exist
  const wellKnownDir = join(PUBLIC_DIR, ".well-known");
  try {
    await Deno.stat(wellKnownDir);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.mkdir(wellKnownDir, { recursive: true });
    }
  }

  const securityPath = join(wellKnownDir, "security.txt");
  await Deno.writeTextFile(securityPath, securityContent);
  console.log(`✅ Generated security.txt`);
}

// Generate SEO report
async function generateSEOReport(pages: Page[]) {
  const report = {
    generated: new Date().toISOString(),
    site: SITE_URL,
    business: BUSINESS_NAME,
    totalPages: pages.length,
    highPriorityPages: pages.filter(p => parseFloat(p.priority) >= 0.8).length,
    excludedRoutes: EXCLUDED_ROUTES,
    statistics: {
      byPriority: {
        "1.0": pages.filter(p => p.priority === "1.0").length,
        "0.9": pages.filter(p => p.priority === "0.9").length,
        "0.8": pages.filter(p => p.priority === "0.8").length,
        "0.7": pages.filter(p => p.priority === "0.7").length,
        "0.6": pages.filter(p => p.priority === "0.6").length,
      },
      byChangeFreq: {
        daily: pages.filter(p => p.changefreq === "daily").length,
        weekly: pages.filter(p => p.changefreq === "weekly").length,
        monthly: pages.filter(p => p.changefreq === "monthly").length,
      }
    },
    pages: pages.map(p => ({
      path: p.path,
      title: p.title,
      description: p.description,
      priority: p.priority,
      changefreq: p.changefreq,
      keywordCount: p.keywords.length
    }))
  };

  const reportPath = join(PUBLIC_DIR, "seo-report.json");
  await Deno.writeTextFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`✅ Generated SEO report`);
  
  return report;
}

// Main function to run all SEO tasks
async function buildSEO() {
  console.log(`🚀 Starting enhanced SEO build for ${BUSINESS_NAME}...`);
  console.log(`📍 Site URL: ${SITE_URL}`);
  console.log(`📁 Output directory: ${PUBLIC_DIR}`);
  
  try {
    await ensurePublicDir();
    
    console.log("\n📝 Generating SEO files...");
    await generateRobotsTxt();
    const pages = await generateSitemap();
    await generateManifest();
    await generateHumansTxt();
    await generateSecurityTxt();
    
    console.log("\n📊 Generating SEO report...");
    const report = await generateSEOReport(pages);
    
    console.log("\n🎯 SEO Build Summary:");
    console.log(`  • Total pages: ${report.totalPages}`);
    console.log(`  • High priority pages: ${report.highPriorityPages}`);
    console.log(`  • Admin routes excluded: ${EXCLUDED_ROUTES.length}`);
    console.log(`  • Files generated: robots.txt, sitemap.xml, manifest.json, humans.txt, security.txt, seo-report.json`);
    
    console.log("\n✅ Enhanced SEO build completed successfully!");
    console.log(`📈 Your site is now optimized for search engines and ready for production!`);
    
  } catch (error) {
    console.error("❌ Error during SEO build:", error);
    Deno.exit(1);
  }
}

// Run the enhanced build
if (import.meta.main) {
  buildSEO();
}