import type { SiteConfig } from "@core/web/types"

export const config: SiteConfig = {
  business: {
    name: "OCD Cleaners",
    tagline: "Sparkling Clean Homes, Every Time.",
    phone: "(210) 730-8067",
    phoneHref: "tel:+12107308067",
    email: "marissamunizocdcleaners@gmail.com",
    address: "123 Main St",
    city: "San Antonio",
    serviceAreas: ["San Antonio", "Helotes", "Boerne", "New Braunfels", "Schertz"],
    license: "Licensed & Insured",
    since: "2010",
    google_rating: "4.9",
    review_count: "200",
    emergency: false,
    theme: "navy",
    niche: "cleaning",
  },

  services: [
    { icon: "home", title: "House Cleaning Services", desc: "Keep your home spotless with our detailed and reliable house cleaning.", urgent: false },
    { icon: "briefcase", title: "Commercial Cleaning", desc: "Maintain a pristine and professional environment for your business.", urgent: false },
    { icon: "sparkles", title: "Residential Cleaning", desc: "Tailored cleaning plans for all types of residential properties.", urgent: false },
    { icon: "scissors", title: "Hoarding Services", desc: "Compassionate and discreet assistance for hoarding cleanouts.", urgent: true },
    { icon: "droplets", title: "Window Cleaning", desc: "Achieve streak-free, crystal-clear windows for a brighter view.", urgent: false }
  ],

  testimonials: [
    { name: "Sarah L.", location: "San Antonio", stars: 5, text: "OCD Cleaners transformed my home! After a deep clean last month, it felt brand new. The team was incredibly thorough, focusing on every detail from baseboards to ceiling fans. I'm so happy with the results and have already scheduled my next service." },
    { name: "Mark T.", location: "Helotes", stars: 5, text: "We hired OCD Cleaners for our office space, and they consistently deliver exceptional results. Their commercial cleaning service is top-notch, always leaving our workplace immaculate and fresh. It's a huge relief knowing our office is in such capable hands." },
    { name: "Jessica R.", location: "Boerne", stars: 5, text: "I was overwhelmed with clutter, and OCD Cleaners provided amazing hoarding services. They were so understanding and professional, helping me reclaim my space without judgment. The transformation was incredible, and I can't thank them enough for their support." }
  ],

  trustBadges: [
    "Licensed & Insured", "Custom Cleaning Plans", "5-Star Rated", "Professional & Trusted", "Free Assessments"
  ],

  stats: [
    { value: 4.9, label: "Google Rating", suffix: "★", decimals: 1 },
    { value: 1000, label: "Homes Cleaned", suffix: "+", decimals: 0 },
    { value: 10, label: "Yrs Experience", suffix: "+", decimals: 0 }
  ],

  reasons: [
    { icon: "clock", title: "Fast Response", desc: "We respond quickly to your cleaning needs, ensuring timely service." },
    { icon: "dollar-sign", title: "Upfront Pricing", desc: "Clear, transparent pricing with no hidden fees, ever." },
    { icon: "award", title: "Certified Pros", desc: "Our team consists of highly trained and certified cleaning specialists." },
    { icon: "thumbs-up", title: "Satisfaction Guarantee", desc: "We stand by our work; your satisfaction is our top priority." },
    { icon: "phone", title: "Real Humans Answer", desc: "Speak directly with a friendly team member, not an automated system." },
    { icon: "truck", title: "Fully Equipped", desc: "Our crews arrive with all the necessary tools and eco-friendly products." }
  ],

  formServiceOptions: ["House Cleaning Services", "Commercial Cleaning Services", "Residential Cleaning Services", "Hoarding Services", "Window Cleaning"]
}

// Backward-compat re-exports
export const BUSINESS = config.business
export const SERVICES = config.services!
export const TESTIMONIALS = config.testimonials!
export const TRUST_BADGES = config.trustBadges!