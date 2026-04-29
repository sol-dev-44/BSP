export interface FAQItem {
    question: string
    answer: string
    category?: string
}

export const PARASAILING_FAQS: FAQItem[] = [
    // Pricing & Booking
    {
        question: 'How much does parasailing cost on Flathead Lake?',
        answer: 'Parasailing on Flathead Lake starts at $99/person for our Early Bird flight (10 AM). Standard flights are $119/person, and our premium Sunset flight (last flight of the day) is $159/person. We also offer observer/boat rider passes for $49, photo packages for $40, GoPro video for $50, or save with our media combo (photos + video) for $75. View all our packages and pricing at montanaparasail.com/services',
        category: 'Pricing & Booking'
    },
    {
        question: 'How do I book a parasailing trip on Flathead Lake?',
        answer: 'You can book online at montanaparasail.com/book with instant confirmation and real-time availability. Simply select your preferred date and time slot during our operating season (May 16 - September 30). You can also call us at (406) 270-6256 or email bigskyparasailing@gmail.com.',
        category: 'Pricing & Booking'
    },
    {
        question: 'Can I book parasailing for a group on Flathead Lake?',
        answer: 'Yes! We love group adventures. Our boat, the Cloud Dancer (Ocean Pro 31), accommodates up to 10 passengers per trip. Standard flights are $119/person, with Early Bird (10 AM) at $99/person and Sunset (last flight) at $159/person. We can do tandem and triple flights, making it a great experience for families and friends.',
        category: 'Pricing & Booking'
    },
    {
        question: 'Is there a group discount for parasailing?',
        answer: 'Our best value is the Early Bird flight at 10 AM for just $99/person. Standard flights are $119/person, and our premium Sunset flight is $159/person. All pricing is per person regardless of group size.',
        category: 'Pricing & Booking'
    },

    // Safety & Requirements
    {
        question: 'Is parasailing safe on Flathead Lake?',
        answer: 'Absolutely! Safety is our top priority. We use Coast Guard certified equipment, conduct thorough safety briefings before every flight, and our experienced crew has completed over 25,000 safe flights across 20+ years of parasailing operations. Our parasailing equipment is regularly inspected and maintained to the highest standards.',
        category: 'Safety & Requirements'
    },
    {
        question: 'What are the age and weight requirements for parasailing?',
        answer: 'Parasailers must be at least 6 years old. For weight requirements, single flyers should weigh between 80-350 lbs. Tandem flights (doubles or triples) have combined weight limits. Children under 12 must be accompanied by an adult on the flight. Contact us if you have specific questions about weight requirements.',
        category: 'Safety & Requirements'
    },
    {
        question: 'Do I need to know how to swim to go parasailing?',
        answer: 'While swimming ability is helpful, it\'s not required. All parasailers wear Coast Guard approved life jackets throughout the entire experience. Our crew is trained in water safety and rescue procedures. Most flights involve dry takeoffs and landings directly from the boat.',
        category: 'Safety & Requirements'
    },
    {
        question: 'What are your captain\'s credentials and experience?',
        answer: 'Your safety is in expert hands! Our captain is a USCG Licensed Master Captain (100-Ton Near Coastal) with extensive parasailing experience and a perfect safety record. With expertise in high-altitude operations, lake navigation, and vessel command, our captain has successfully completed thousands of flights on Flathead Lake. We maintain rigorous Coast Guard certification standards and conduct regular safety training for all crew members.',
        category: 'Safety & Requirements'
    },

    // Experience Details
    {
        question: 'How high do you go parasailing on Flathead Lake?',
        answer: 'You can soar up to 400 feet above the crystal-clear waters of Flathead Lake! At this altitude, you\'ll enjoy breathtaking panoramic views of the Mission Mountains, Glacier National Park in the distance, the Flathead Valley, and the stunning blue-green waters of America\'s largest natural freshwater lake west of the Mississippi.',
        category: 'Experience Details'
    },
    {
        question: 'How long does a parasailing trip take?',
        answer: 'The total trip time is approximately 1-1.5 hours, which includes check-in, safety briefing, boat ride to the flight area, and your parasailing flight. Your actual time in the air is typically 10-15 minutes, giving you plenty of time to enjoy the incredible views and take photos.',
        category: 'Experience Details'
    },
    {
        question: 'What\'s the best time of day for parasailing on Flathead Lake?',
        answer: 'All times are great! Our Early Bird 10 AM flight offers the calmest waters at our best price of $99/person. Standard midday flights are $119/person with warm temperatures and beautiful light. Our premium Sunset flight (last flight of the day) is $159/person for a magical golden hour experience. We operate daily from 10:00 AM to 7:00 PM during our season (May 16 - September 30).',
        category: 'Experience Details'
    },
    {
        question: 'Can I take photos or videos while parasailing?',
        answer: 'Yes! We offer photo packages for $40 and GoPro video packages for $50. Save with our media combo (photos + video) for just $75 -- that is $15 off vs buying separately. Our photo package includes crew-shot HD photos from the boat, and our GoPro package captures immersive aerial footage of your flight over Flathead Lake. You can also bring your own waterproof camera or phone in a waterproof case.',
        category: 'Experience Details'
    },
    {
        question: 'What boat do you use for parasailing?',
        answer: 'We fly from the Cloud Dancer, an Ocean Pro 31 parasail boat. She holds up to 10 passengers and is purpose-built for parasailing with a hydraulic winch and spacious deck. The Cloud Dancer is Coast Guard inspected and certified for commercial parasailing operations.',
        category: 'Experience Details'
    },

    // Location & Logistics
    {
        question: 'Where is Big Sky Parasail located?',
        answer: 'We launch from Flathead Harbor Marina at 7090 US Hwy 93 S in Lakeside, Montana (59922). The marina is conveniently located on the west shore of Flathead Lake, easily accessible from Kalispell, Whitefish, Polson, and Bigfork. Get directions and details at montanaparasail.com/location',
        category: 'Location & Logistics'
    },
    {
        question: 'What should I wear for parasailing on Flathead Lake?',
        answer: 'Wear comfortable clothes you don\'t mind getting wet (athletic wear, shorts, t-shirt). Secure footwear like water shoes or sandals with straps is recommended. Bring sunscreen, sunglasses with a strap, and a hat. We provide life jackets. Leave valuables in your car or with observers on the boat. Montana lake water can be cool, so bring a light layer just in case.',
        category: 'Location & Logistics'
    },
    {
        question: 'When is parasailing season on Flathead Lake?',
        answer: 'We operate from May 16th through September 30th. This season offers the best weather conditions with warm temperatures, long daylight hours, and stunning views of the surrounding mountains. Our daily schedule runs from 10:00 AM to 7:00 PM.',
        category: 'Location & Logistics'
    },

    // Weather & Cancellations
    {
        question: 'What happens if the weather is bad?',
        answer: 'Safety comes first! If weather conditions are unsafe for parasailing (high winds, storms, poor visibility), we will reschedule your flight at no charge. We monitor weather closely and will contact you in advance if conditions look unfavorable. You can also reschedule for any reason with advance notice.',
        category: 'Weather & Cancellations'
    },
    {
        question: 'What is your cancellation policy?',
        answer: 'We offer flexible cancellation and rescheduling. If you need to cancel or reschedule, please contact us as soon as possible. Weather-related cancellations are always rescheduled at no charge. For other cancellations, please refer to our booking terms or contact us directly.',
        category: 'Weather & Cancellations'
    },

    // Additional Questions
    {
        question: 'Can observers ride along on the boat?',
        answer: 'Yes! Observer/boat rider passes are available for $49 per person. Observers get to ride along on the Cloud Dancer, watch their friends and family fly, and enjoy a scenic cruise on Flathead Lake without parasailing. Just add an observer pass when you book online or call (406) 270-6256.',
        category: 'Additional Questions'
    },
    {
        question: 'Is Flathead Lake a good place for parasailing?',
        answer: 'Flathead Lake is one of the best parasailing destinations in the entire country! As the largest natural freshwater lake west of the Mississippi, it offers crystal-clear waters, dramatic mountain backdrops including the Mission Mountains and views toward Glacier National Park, and reliable summer weather. The combination of pristine water, mountain scenery, and big Montana skies makes for an unforgettable parasailing experience.',
        category: 'Additional Questions'
    },
    {
        question: 'What is there to do near Big Sky Parasail?',
        answer: 'Flathead Lake and the surrounding area offer endless activities! Visit Glacier National Park (about an hour away), explore the charming towns of Whitefish, Kalispell, and Bigfork, go hiking in the Mission Mountains, enjoy water sports on the lake, visit Wild Horse Island State Park, or sample local food and craft beverages. The Flathead Valley is Montana\'s playground!',
        category: 'Additional Questions'
    },
]

// Group FAQs by category for display
export function getFAQsByCategory() {
    const categories = new Map<string, FAQItem[]>()

    PARASAILING_FAQS.forEach(faq => {
        const category = faq.category || 'General'
        if (!categories.has(category)) {
            categories.set(category, [])
        }
        categories.get(category)!.push(faq)
    })

    return categories
}
