import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Stats } from '@/components/Stats'
import { SectionDivider } from '@/components/SectionDivider'
import { VesselShowcase } from '@/components/VesselShowcase'
import { ExperienceGallery } from '@/components/ExperienceGallery'
import { Testimonials } from '@/components/Testimonials'
import { InstagramFeed } from '@/components/InstagramFeed'
import { LocationHighlights } from '@/components/LocationHighlights'
import { Footer } from '@/components/Footer'
import { ChatCTA } from '@/components/ChatCTA'
import { generatePageMetadata } from '@/config/seo'
import { generateBreadcrumbSchema, StructuredData } from '@/config/structured-data'

export const metadata = generatePageMetadata(
  'Big Sky Parasail | Soar Above Flathead Lake, Montana',
  'Experience the thrill of parasailing up to 400ft above Flathead Lake, Montana. Safety focused, family friendly, and top-rated adventures. Book your flight today!',
  '/'
)

export default function Home() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.montanaparasail.com/' }
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
      <Navbar />
      <Hero />
      <Stats />
      <SectionDivider spacing="md" />
      <VesselShowcase />
      <SectionDivider spacing="md" />
      <ExperienceGallery />
      <SectionDivider spacing="md" />
      <Testimonials />
      <SectionDivider spacing="md" />
      <InstagramFeed />
      <SectionDivider spacing="md" />
      <LocationHighlights />
      <Footer />
      <ChatCTA />
    </main>
  );
}
