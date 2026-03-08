// Centralized business information
// Update these values once when you have real data

export const BUSINESS_INFO = {
    name: 'Big Sky Parasail',
    legalName: 'Big Sky Parasail LLC',
    description: "Experience Montana's premier parasailing adventure on Flathead Lake. Soar up to 400 feet above America's largest natural freshwater lake with breathtaking mountain views.",

    // Contact Information
    phone: '406-270-6256',
    displayPhone: '(406) 270-6256',
    email: 'bigskyparasailing@gmail.com',

    // Address
    address: {
        name: 'Flathead Harbor Marina - Slip E4',
        street: '7007 US Highway 93 S',
        city: 'Lakeside',
        state: 'Montana',
        stateCode: 'MT',
        zip: '59922',
        country: 'United States',
        countryCode: 'US',
    },

    // Geographic Coordinates (Flathead Harbor Marina)
    geo: {
        latitude: 48.0411,
        longitude: -114.2298,
    },

    // Season Dates
    season: {
        startMonth: 5, // May
        startDay: 1,
        endMonth: 9, // September
        endDay: 30,
        text: 'May 1st - September 30th',
    },

    // Business Hours (9 AM - 7 PM daily)
    hours: {
        monday: '9:00 AM - 7:00 PM',
        tuesday: '9:00 AM - 7:00 PM',
        wednesday: '9:00 AM - 7:00 PM',
        thursday: '9:00 AM - 7:00 PM',
        friday: '9:00 AM - 7:00 PM',
        saturday: '9:00 AM - 7:00 PM',
        sunday: '9:00 AM - 7:00 PM',
    },

    // Schema.org format for hours
    openingHours: [
        'Mo-Su 09:00-19:00',
    ],

    // Social Media
    social: {
        facebook: 'https://www.facebook.com/bigskyparasail',
        instagram: 'https://www.instagram.com/bigskyparasail/',
        yelp: 'https://www.yelp.com/biz/big-sky-parasail-lakeside',
        tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g45275-d26456090-Reviews-Big_Sky_Parasail-Lakeside_Montana.html',
        google: 'https://www.google.com/maps/place/Big+Sky+Parasail+Co./@48.023707,-114.228428,795m/data=!3m2!1e3!4b1!4m6!3m5!1s0xfe4f7653a52c97:0xa7eb4a92583459e9!8m2!3d48.023707!4d-114.2258531!16s%2Fg%2F11t9mpnt0d?entry=ttu&g_ep=EgoyMDI2MDMwNC4xIKXMDSoASAFQAw%3D%3D',
    },

    // Website
    url: 'https://www.montanaparasail.com',

    // Sister Site
    sisterSite: {
        name: 'Havasu Parasail',
        url: 'https://www.havasuparasail.com',
    },

    // Pricing Constants
    priceRange: '$$',
    pricing: {
        parasail: 119,
        earlyBird: 99,
        sunsetCruise: 159,
        observer: 49,
        combo: 75,
        photos: 40,
        gopro: 50,
    },

    // Services
    services: [
        {
            id: 'earlybird',
            name: 'Early Bird Special',
            price: 99,
            image: 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//WhiteFishSmiles.jpg',
            tagline: 'Start your day soaring over Flathead Lake',
            description: 'Catch the calm morning waters on Flathead Lake with our 9 AM flight. Enjoy smooth conditions and serene mountain views before the afternoon winds pick up.',
            features: [
                '9 AM or 10 AM departure',
                'Calm morning waters',
                'Lower wind conditions',
                'Stunning morning light',
                'Best value flight',
            ],
            highlight: 'BEST VALUE',
        },
        {
            id: 'parasail',
            name: 'Parasailing Adventure',
            price: 119,
            image: 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//colorfulChute.jpg',
            tagline: 'Soar 400+ feet above Flathead Lake',
            description: 'Soar over 400 feet above Flathead Lake with breathtaking views of the Mission Mountains, Glacier National Park, and the Flathead Valley. An unforgettable Montana adventure.',
            features: [
                '400+ feet altitude',
                'Panoramic mountain views',
                'USCG certified equipment',
                'Expert crew',
                'Safety briefing included',
            ],
            popular: true,
        },
        {
            id: 'sunset',
            name: 'Sunset Cruise',
            price: 159,
            image: 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//wfSunset.JPG',
            tagline: 'Golden hour over the mountains',
            description: 'Experience the magic of a Montana sunset from the water. Enjoy a relaxing cruise on Flathead Lake during golden hour with a complimentary drink and appetizer included.',
            features: [
                'Golden hour cruise',
                'Drink included',
                'Appetizer included',
                'Stunning sunset views',
                'Perfect for couples',
            ],
            highlight: 'PREMIUM',
        },
        {
            id: 'combo',
            name: 'Media Combo Package',
            price: 75,
            image: 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//FlatheadAerial.jpg',
            tagline: 'Photos + Video - Save $15',
            description: 'Get the best of both worlds with our combo media package. Includes professional HD photos and GoPro video of your flight over Flathead Lake. Save $15 versus buying separately.',
            features: [
                'HD photo package',
                'GoPro video included',
                'Save $15 vs separate',
                'Keep the SD card',
                'Social media ready',
            ],
            highlight: 'SAVE $15',
        },
        {
            id: 'gopro',
            name: 'GoPro 360 Experience',
            price: 50,
            image: 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//HighAerial.jpeg',
            tagline: 'Immersive 360 flight footage',
            description: 'Capture your flight in immersive 360 video with stunning aerial footage over Flathead Lake and the surrounding Montana mountains.',
            features: [
                'GoPro 360 video capture',
                'Aerial lake & mountain views',
                'Superior stabilization',
                'Keep the SD card',
                'Social media ready',
            ],
        },
        {
            id: 'photos',
            name: 'HD Photo Package',
            price: 40,
            image: 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//threeKids.jpg',
            tagline: 'Professional HD crew photos',
            description: 'Professional HD photos captured by our crew from the boat. Take home stunning memories of your Flathead Lake parasailing adventure.',
            features: [
                'HD photos from boat',
                'Multiple angles',
                'Keep the SD card',
                'No equipment needed',
                'Perfect memories',
            ],
        },
        {
            id: 'observer',
            name: 'Observer Pass',
            price: 49,
            image: 'https://yginjzlfezyalgosdjtl.supabase.co/storage/v1/object/public/bsp-images//leroyDock.jpg',
            tagline: 'Ride along without flying',
            description: 'Ride along on the boat without flying. Enjoy the cruise on Flathead Lake and watch your friends and family soar above the water with mountain views all around.',
            features: [
                'Ride along on boat',
                'Watch friends fly',
                'No flying required',
                'Scenic lake cruise',
                'Great for all ages',
            ],
        },
    ],

    // Charter Services
    charters: [
        {
            id: 'tubing',
            name: 'Private Tubing',
            price: 500,
            priceUnit: 'per hour',
            minimumHours: 3,
            maxGuests: 12,
            tagline: 'Private tubing adventure on Flathead Lake',
            description: 'Enjoy a private tubing experience on Flathead Lake. Perfect for groups and families looking for high-energy fun on the water. 3-hour minimum with up to 12 guests.',
            features: [
                '$500/hour (3-hour minimum)',
                'Up to 12 guests',
                'Private boat & crew',
                'Tubing equipment included',
                'Flathead Lake adventure',
            ],
        },
        {
            id: 'wild-horse-island',
            name: 'Wild Horse Island Adventure',
            price: 2000,
            priceUnit: 'flat rate',
            duration: '4 hours',
            maxGuests: 12,
            tagline: 'Explore Wild Horse Island by boat',
            description: 'Embark on a 4-hour guided boat adventure to Wild Horse Island, one of Flathead Lake\'s most iconic destinations. Explore the island\'s wild horses, bighorn sheep, and stunning scenery with up to 12 guests.',
            features: [
                '$2,000 flat rate',
                '4-hour adventure',
                'Up to 12 guests',
                'Wild Horse Island exploration',
                'Wildlife viewing opportunities',
            ],
        },
        {
            id: 'fireworks',
            name: '4th of July Fireworks Charter',
            price: 4000,
            priceUnit: 'flat rate',
            duration: '4 hours',
            maxGuests: 10,
            tagline: 'Watch fireworks from the water',
            description: 'Celebrate the 4th of July from the best seat in the house. Enjoy a private 4-hour charter on Flathead Lake with front-row views of the fireworks display. Up to 10 guests.',
            features: [
                '$4,000 flat rate',
                '4-hour charter',
                'Up to 10 guests',
                'Front-row fireworks views',
                'Unforgettable celebration',
            ],
        },
    ],

    // Business Stats
    stats: {
        yearsInBusiness: 20,
        flightsCompleted: 25000,
        rating: 5.0,
        reviewCount: 100,
    },

    // Keywords for SEO
    keywords: [
        'parasailing Montana',
        'Flathead Lake parasailing',
        'Big Sky Parasail',
        'Montana parasailing',
        'Flathead Lake water sports',
        'parasailing near Glacier National Park',
        'Lakeside Montana parasailing',
        'adventure tourism Montana',
        'parasailing near me',
        'Flathead Lake activities',
    ],
}

// Helper function to get full address string
export function getFullAddress() {
    const { street, city, state, zip } = BUSINESS_INFO.address
    return `${street}, ${city}, ${state} ${zip}`
}

// Helper function to get formatted phone
export function getFormattedPhone() {
    return BUSINESS_INFO.displayPhone
}

// Helper function to get phone link (tel:)
export function getPhoneLink() {
    return `tel:406-270-6256`
}

// Helper function to get email link
export function getEmailLink() {
    return `mailto:${BUSINESS_INFO.email}`
}

// Helper function to get Google Maps link
export function getMapLink() {
    return 'https://www.google.com/maps/place/Flathead+Harbor+Marina/@48.0237004,-114.2284145,17z/data=!4m14!1m7!3m6!1s0x5367ab5d58967335:0xb96203ac02aea1f4!2sFlathead+Harbor+Marina!8m2!3d48.0237004!4d-114.2258396!16s%2Fg%2F11q8cbvqc6!3m5!1s0x5367ab5d58967335:0xb96203ac02aea1f4!8m2!3d48.0237004!4d-114.2258396!16s%2Fg%2F11q8cbvqc6'
}
