import { BUSINESS_INFO, getFullAddress } from './business'

// Generate LocalBusiness JSON-LD structured data
export function generateLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': BUSINESS_INFO.url,
        name: BUSINESS_INFO.name,
        legalName: BUSINESS_INFO.legalName,
        description: BUSINESS_INFO.description,
        url: BUSINESS_INFO.url,
        telephone: BUSINESS_INFO.phone,
        email: BUSINESS_INFO.email,
        priceRange: BUSINESS_INFO.priceRange,
        address: {
            '@type': 'PostalAddress',
            streetAddress: BUSINESS_INFO.address.street,
            addressLocality: BUSINESS_INFO.address.city,
            addressRegion: BUSINESS_INFO.address.stateCode,
            postalCode: BUSINESS_INFO.address.zip,
            addressCountry: BUSINESS_INFO.address.countryCode,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: BUSINESS_INFO.geo.latitude,
            longitude: BUSINESS_INFO.geo.longitude,
        },
        openingHoursSpecification: BUSINESS_INFO.openingHours.map((hours) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: hours.split(' ')[0],
            opens: hours.split(' ')[1].split('-')[0],
            closes: hours.split(' ')[1].split('-')[1],
        })),
        sameAs: [
            BUSINESS_INFO.social.facebook,
            BUSINESS_INFO.social.instagram,
            BUSINESS_INFO.social.yelp,
            BUSINESS_INFO.social.tripadvisor,
        ].filter(Boolean),
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: BUSINESS_INFO.stats.rating,
            reviewCount: BUSINESS_INFO.stats.reviewCount,
            bestRating: '5',
            worstRating: '1',
        },
        image: `${BUSINESS_INFO.url}/colorfulChute.jpg`,
    }
}

// Generate Service schema for each offering
export function generateServiceSchema(service: typeof BUSINESS_INFO.services[0]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: service.name,
        name: service.name,
        description: service.description,
        provider: {
            '@type': 'LocalBusiness',
            name: BUSINESS_INFO.name,
            url: BUSINESS_INFO.url,
        },
        areaServed: {
            '@type': 'City',
            name: BUSINESS_INFO.address.city,
            '@id': `https://en.wikipedia.org/wiki/${BUSINESS_INFO.address.city.replace(' ', '_')}`,
        },
        offers: {
            '@type': 'Offer',
            price: service.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${BUSINESS_INFO.url}/services`,
            priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
        },
    }
}

// Generate TouristAttraction schema
export function generateTouristAttractionSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: `${BUSINESS_INFO.name} - Flathead Lake Parasailing`,
        description: 'Experience breathtaking parasailing adventures up to 400 feet above Flathead Lake with stunning views of the Mission Mountains, Glacier National Park, and the Flathead Valley.',
        image: `${BUSINESS_INFO.url}/colorfulChute.jpg`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: BUSINESS_INFO.address.street,
            addressLocality: BUSINESS_INFO.address.city,
            addressRegion: BUSINESS_INFO.address.stateCode,
            postalCode: BUSINESS_INFO.address.zip,
            addressCountry: BUSINESS_INFO.address.countryCode,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: BUSINESS_INFO.geo.latitude,
            longitude: BUSINESS_INFO.geo.longitude,
        },
        touristType: ['Families', 'Adventure Seekers', 'Tourists', 'Groups'],
        availableLanguage: ['English'],
    }
}

// Generate Organization schema
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: BUSINESS_INFO.name,
        legalName: BUSINESS_INFO.legalName,
        url: BUSINESS_INFO.url,
        logo: `${BUSINESS_INFO.url}/JerryBearLogo.png`,
        description: BUSINESS_INFO.description,
        telephone: BUSINESS_INFO.phone,
        email: BUSINESS_INFO.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: BUSINESS_INFO.address.street,
            addressLocality: BUSINESS_INFO.address.city,
            addressRegion: BUSINESS_INFO.address.stateCode,
            postalCode: BUSINESS_INFO.address.zip,
            addressCountry: BUSINESS_INFO.address.countryCode,
        },
        sameAs: [
            BUSINESS_INFO.social.facebook,
            BUSINESS_INFO.social.instagram,
            BUSINESS_INFO.social.yelp,
            BUSINESS_INFO.social.tripadvisor,
        ].filter(Boolean),
        foundingDate: new Date().getFullYear() - BUSINESS_INFO.stats.yearsInBusiness,
    }
}

// Generate BreadcrumbList schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }
}

// Generate Article schema for blog posts
export function generateArticleSchema(article: {
    headline: string
    description: string
    datePublished: string
    dateModified: string
    author: string
    url: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.headline,
        description: article.description,
        image: `${BUSINESS_INFO.url}/colorfulChute.jpg`,
        datePublished: article.datePublished,
        dateModified: article.dateModified,
        author: {
            '@type': 'Organization',
            name: article.author,
            url: BUSINESS_INFO.url,
        },
        publisher: {
            '@type': 'Organization',
            name: BUSINESS_INFO.name,
            logo: {
                '@type': 'ImageObject',
                url: `${BUSINESS_INFO.url}/JerryBearLogo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': article.url,
        },
    }
}

// Generate FAQPage schema
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    }
}

// Helper component to render JSON-LD
export function StructuredData({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    )
}
