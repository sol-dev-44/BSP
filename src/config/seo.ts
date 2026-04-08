import { Metadata } from 'next'
import { BUSINESS_INFO } from './business'

// Base metadata configuration
export const BASE_METADATA: Metadata = {
    metadataBase: new URL(BUSINESS_INFO.url),
    title: {
        default: `${BUSINESS_INFO.name} | Soar Above Flathead Lake`,
        template: `%s | ${BUSINESS_INFO.name}`,
    },
    description: BUSINESS_INFO.description,
    keywords: BUSINESS_INFO.keywords,
    authors: [{ name: BUSINESS_INFO.name }],
    creator: BUSINESS_INFO.name,
    publisher: BUSINESS_INFO.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: BUSINESS_INFO.url,
        siteName: BUSINESS_INFO.name,
        title: `${BUSINESS_INFO.name} | Soar Above Flathead Lake`,
        description: BUSINESS_INFO.description,
        images: [
            {
                url: 'https://qcohcaavhwujvagmpbdp.supabase.co/storage/v1/object/public/bsp-images/FlatheadWithShadow.jpg',
                width: 1200,
                height: 630,
                alt: 'Parasailing above Flathead Lake, Montana - Big Sky Parasail',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${BUSINESS_INFO.name} | Soar Above Flathead Lake`,
        description: BUSINESS_INFO.description,
        images: ['https://qcohcaavhwujvagmpbdp.supabase.co/storage/v1/object/public/bsp-images/FlatheadWithShadow.jpg'],
        creator: '@bigskyparasail',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

// Page-specific metadata generators
export function generatePageMetadata(
    title: string,
    description?: string,
    path?: string
): Metadata {
    return {
        title,
        description: description || BUSINESS_INFO.description,
        alternates: {
            canonical: path ? `${BUSINESS_INFO.url}${path}` : BUSINESS_INFO.url,
        },
        openGraph: {
            title,
            description: description || BUSINESS_INFO.description,
            url: path ? `${BUSINESS_INFO.url}${path}` : BUSINESS_INFO.url,
        },
        twitter: {
            title,
            description: description || BUSINESS_INFO.description,
        },
    }
}
