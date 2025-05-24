// scripts/build-seo.ts

// Import necessary Deno modules
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

// Define constants
const PUBLIC_DIR = "./public";
const ROUTES_FILE = "./src/RoutesIndex.tsx"; // Path to your routes file
const SITE_URL = "https://www.montanaparasail.com";

// Interface for page data
interface Page {
  path: string;
  priority: string;
  changefreq: string;
}

// Function to ensure the public directory exists
async function ensurePublicDir() {
  try {
    await Deno.stat(PUBLIC_DIR);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.mkdir(PUBLIC_DIR, { recursive: true });
      console.log(`Created directory: ${PUBLIC_DIR}`);
    } else {
      throw error;
    }
  }
}

// Function to extract routes from RoutesIndex.tsx
async function extractRoutes(): Promise<string[]> {
  try {
    const content = await Deno.readTextFile(ROUTES_FILE);
    
    // Extract route paths using regex
    const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
    const routes: string[] = [];
    let match;
    
    while ((match = routeRegex.exec(content)) !== null) {
      const route = match[1];
      // Exclude dynamic routes with params and redirect routes
      if (!route.includes("*") && route !== "") {
        routes.push(route);
      }
    }
    
    return [...new Set(routes)]; // Remove duplicates
  } catch (error) {
    console.error(`❌ Error reading routes file`);
    // Fallback to default routes if file can't be read
    return [
      "/",
      "/about",
      "/location", 
      "/faq",
      "/reservations",
      "/reservations/book/time",
      "/reservations/book/info",
      "/reservations/book/payment",
      "/reservations/book/confirmation"
    ];
  }
}

// Function to determine page priority and change frequency
function getPageMetadata(path: string): { priority: string; changefreq: string } {
  // Set priority and change frequency based on the page type
  if (path === "/") {
    return { priority: "1.0", changefreq: "weekly" };
  } else if (path.includes("/reservations")) {
    return { priority: "0.9", changefreq: "daily" };
  } else if (path === "/location" || path === "/faq") {
    return { priority: "0.8", changefreq: "monthly" };
  } else {
    return { priority: "0.7", changefreq: "monthly" };
  }
}

// Generate robots.txt
async function generateRobotsTxt() {
  const robotsContent = `# robots.txt for Montana Parasail
User-agent: *
Allow: /

# Disallow any potential admin areas
Disallow: /admin/
Disallow: /wp-admin/

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml`;

  const robotsPath = join(PUBLIC_DIR, "robots.txt");
  await Deno.writeTextFile(robotsPath, robotsContent);
  console.log(`✅ Generated robots.txt at ${robotsPath}`);
}

// Generate sitemap.xml
async function generateSitemap() {
  // Extract routes from React Router configuration
  const routes = await extractRoutes();
  
  // Create page objects with metadata
  const pages: Page[] = routes.map(route => ({
    path: route,
    ...getPageMetadata(route)
  }));

  // Generate timestamp for lastmod
  const today = new Date().toISOString().split('T')[0];
  
  // Create sitemap XML content
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(page => `
  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  const sitemapPath = join(PUBLIC_DIR, "sitemap.xml");
  await Deno.writeTextFile(sitemapPath, sitemapContent);
  console.log(`✅ Generated sitemap.xml at ${sitemapPath}`);
  
  // Log all detected routes
  console.log("\n📄 Pages detected and included in sitemap:");
  pages.forEach(page => {
    console.log(`  • ${page.path} (priority: ${page.priority}, changefreq: ${page.changefreq})`);
  });
}

// Main function to run all SEO tasks
async function buildSEO() {
  console.log("🚀 Starting SEO build process...");
  
  try {
    await ensurePublicDir();
    await generateRobotsTxt();
    await generateSitemap();
    
    console.log("✅ SEO build completed successfully!");
  } catch (error) {
    console.error("❌ Error during SEO build:", error);
    Deno.exit(1);
  }
}

// Run the build
buildSEO();