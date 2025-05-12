// scripts/build-seo.ts

// Import necessary Deno modules
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

// Define constants
const PUBLIC_DIR = "./public";
const SITE_URL = "https://www.montanaparasail.com"; // Updated with correct domain

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

// Generate robots.txt
async function generateRobotsTxt() {
  const robotsContent = `# robots.txt for Big Sky Parasail
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
  // Define your pages - extend this as your site grows
  const pages = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/about", priority: "0.8", changefreq: "monthly" },
    { path: "/location", priority: "0.8", changefreq: "monthly" },
    { path: "/book", priority: "0.9", changefreq: "weekly" },
    { path: "/faq", priority: "0.8", changefreq: "monthly" }
  ];

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