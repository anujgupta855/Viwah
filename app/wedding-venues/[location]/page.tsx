import type { Metadata } from "next";



import Link from "next/link";



import { notFound } from "next/navigation";



import { connectDB } from "@/lib/db";



import { Venue } from "@/models";



import { VenueCard } from "@/components/marketplace/venue-card";



type PageProps = {

  params: Promise<{

    location: string;

  }>;

};



type LocationConfig = {

  city: string;

  name: string;

  locality?: string;

  aliases?: string[];

  title: string;

  description: string;

  intro: string;

};

type VenueCardData = {

  _id: string;

  slug: string;

  name: string;

  city: string;

  location: string;

  images: string[];

  startingPrice: number;

  capacity: number;

  rating: number;

  reviewCount: number;

  venueType: string;

};



const locationConfig: Record<string, LocationConfig> = {
  lucknow: {
    city: "Lucknow",
    name: "Lucknow",
    title: "Wedding Venues in Lucknow | Best Wedding Venues & Lawns",
    description:
      "Explore wedding venues in Lucknow including banquet halls, wedding lawns, resorts, hotels and farmhouses. Compare venues by price, capacity, type and location on Viwah.",
    intro:
      "Discover wedding venues across Lucknow for intimate ceremonies, large weddings and celebrations of every style. Explore real venue listings with pricing, capacity, venue type, photos and details.",
  },

  "gomti-nagar-lucknow": {
    city: "Lucknow",
    name: "Gomti Nagar",
    locality: "Gomti Nagar",
    aliases: ["Gomti Nagar"],
    title: "Wedding Venues in Gomti Nagar, Lucknow | Viwah",
    description:
      "Find wedding venues in Gomti Nagar, Lucknow including banquet halls, lawns, hotels and premium wedding spaces. Explore venue details, prices, capacity and more on Viwah.",
    intro:
      "Explore wedding venues in Gomti Nagar, one of Lucknow's popular areas for weddings and celebrations. Compare available venues based on style, capacity, pricing and venue type.",
  },

  "golf-city-lucknow": {
    city: "Lucknow",
    name: "Golf City",
    locality: "Golf City",
    aliases: ["Golf City", "Sushant Golf City"],
    title: "Wedding Venues in Golf City, Lucknow | Viwah",
    description:
      "Discover wedding venues in Golf City, Lucknow including wedding lawns, resorts, banquet halls and hotels. Explore venue prices, capacity, photos and details on Viwah.",
    intro:
      "Find wedding venues around Golf City, Lucknow for weddings, receptions and other celebrations. Explore venue options and compare important details before making your shortlist.",
  },

  "arjunganj-lucknow": {
    city: "Lucknow",
    name: "Arjunganj",
    locality: "Arjunganj",
    aliases: ["Arjunganj", "Arjunganj Road"],
    title: "Wedding Venues in Arjunganj, Lucknow | Viwah",
    description:
      "Explore wedding venues in Arjunganj, Lucknow including lawns, resorts, banquet halls and other wedding spaces. Compare venue details, pricing and capacity on Viwah.",
    intro:
      "Discover wedding venues in and around Arjunganj, Lucknow. Browse available venues and compare their capacity, starting prices, venue types and other important details.",
  },

  "sultanpur-road-lucknow": {
    city: "Lucknow",
    name: "Sultanpur Road",
    locality: "Sultanpur Road",
    aliases: ["Sultanpur Road", "Sultanpur Rd"],
    title: "Wedding Venues on Sultanpur Road, Lucknow | Viwah",
    description:
      "Find wedding venues on Sultanpur Road, Lucknow including lawns, resorts, banquet halls and wedding spaces. Explore venue prices, capacity and details on Viwah.",
    intro:
      "Explore wedding venues around Sultanpur Road in Lucknow. Find options for weddings, receptions and celebrations and compare venues using pricing, capacity and venue type.",
  },

  "sitapur-road-lucknow": {
    city: "Lucknow",
    name: "Sitapur Road",
    locality: "Sitapur Road",
    aliases: ["Sitapur Road", "Sitapur Rd"],
    title: "Wedding Venues on Sitapur Road, Lucknow | Viwah",
    description:
      "Discover wedding venues on Sitapur Road, Lucknow including wedding lawns, banquet halls and other celebration spaces. Explore prices, capacity, ratings and venue details on Viwah.",
    intro:
      "Browse wedding venues around Sitapur Road, Lucknow and compare available options based on venue type, capacity, pricing and ratings.",
  },

  "indira-nagar-lucknow": {
    city: "Lucknow",
    name: "Indira Nagar",
    locality: "Indira Nagar",
    aliases: ["Indira Nagar"],
    title: "Wedding Venues in Indira Nagar, Lucknow | Viwah",
    description:
      "Explore wedding venues in Indira Nagar, Lucknow including banquet halls, lawns, resorts and other wedding spaces.",
    intro:
      "Discover wedding venues in Indira Nagar, Lucknow and compare available options by venue type, pricing, capacity and ratings.",
  },

  "alambagh-lucknow": {
    city: "Lucknow",
    name: "Alambagh",
    locality: "Alambagh",
    aliases: ["Alambagh"],
    title: "Wedding Venues in Alambagh, Lucknow | Viwah",
    description:
      "Find wedding venues in Alambagh, Lucknow including wedding lawns, banquet halls and celebration spaces.",
    intro:
      "Explore wedding venues in Alambagh, Lucknow for weddings, receptions and other celebrations.",
  },

  "hazratganj-lucknow": {
    city: "Lucknow",
    name: "Hazratganj",
    locality: "Hazratganj",
    aliases: ["Hazratganj"],
    title: "Wedding Venues in Hazratganj, Lucknow | Viwah",
    description:
      "Discover wedding venues in Hazratganj, Lucknow including banquet halls, hotels, lawns and wedding spaces.",
    intro:
      "Browse wedding venues in Hazratganj, Lucknow and compare pricing, capacity, ratings and venue types.",
  },

  "rajajipuram-lucknow": {
    city: "Lucknow",
    name: "Rajajipuram",
    locality: "Rajajipuram",
    aliases: ["Rajajipuram"],
    title: "Wedding Venues in Rajajipuram, Lucknow | Viwah",
    description:
      "Explore wedding venues in Rajajipuram, Lucknow including lawns, banquet halls and other wedding spaces.",
    intro:
      "Find wedding venues in Rajajipuram, Lucknow for weddings, receptions and family celebrations.",
  },

  "jankipuram-lucknow": {
    city: "Lucknow",
    name: "Jankipuram",
    locality: "Jankipuram",
    aliases: ["Jankipuram"],
    title: "Wedding Venues in Jankipuram, Lucknow | Viwah",
    description:
      "Find wedding venues in Jankipuram, Lucknow including lawns, banquet halls and celebration spaces.",
    intro:
      "Explore wedding venues in Jankipuram, Lucknow and compare available options.",
  },

  "ashiyana-lucknow": {
    city: "Lucknow",
    name: "Ashiyana",
    locality: "Ashiyana",
    aliases: ["Ashiyana"],
    title: "Wedding Venues in Ashiyana, Lucknow | Viwah",
    description:
      "Discover wedding venues in Ashiyana, Lucknow including banquet halls, lawns and wedding spaces.",
    intro:
      "Browse wedding venues in Ashiyana, Lucknow for weddings, receptions and celebrations.",
  },

  "aliganj-lucknow": {
    city: "Lucknow",
    name: "Aliganj",
    locality: "Aliganj",
    aliases: ["Aliganj"],
    title: "Wedding Venues in Aliganj, Lucknow | Viwah",
    description:
      "Explore wedding venues in Aliganj, Lucknow including banquet halls, lawns and other celebration spaces.",
    intro:
      "Find wedding venues in Aliganj, Lucknow and compare pricing, capacity and venue types.",
  },

  "charbagh-lucknow": {
    city: "Lucknow",
    name: "Charbagh",
    locality: "Charbagh",
    aliases: ["Charbagh"],
    title: "Wedding Venues in Charbagh, Lucknow | Viwah",
    description:
      "Find wedding venues in Charbagh, Lucknow including banquet halls, hotels and wedding spaces.",
    intro:
      "Explore wedding venues around Charbagh, Lucknow for weddings and celebrations.",
  },

  "kanpur-road-lucknow": {
    city: "Lucknow",
    name: "Kanpur Road",
    locality: "Kanpur Road",
    aliases: ["Kanpur Road", "Kanpur Rd"],
    title: "Wedding Venues on Kanpur Road, Lucknow | Viwah",
    description:
      "Discover wedding venues on Kanpur Road, Lucknow including lawns, banquet halls, hotels and resorts.",
    intro:
      "Browse wedding venues around Kanpur Road, Lucknow and compare available options.",
  },

  "vikas-nagar-lucknow": {
    city: "Lucknow",
    name: "Vikas Nagar",
    locality: "Vikas Nagar",
    aliases: ["Vikas Nagar"],
    title: "Wedding Venues in Vikas Nagar, Lucknow | Viwah",
    description:
      "Explore wedding venues in Vikas Nagar, Lucknow including lawns, banquet halls and wedding spaces.",
    intro:
      "Find wedding venues in Vikas Nagar, Lucknow for weddings, receptions and celebrations.",
  },

  "faizabad-road-lucknow": {
    city: "Lucknow",
    name: "Faizabad Road",
    locality: "Faizabad Road",
    aliases: ["Faizabad Road", "Faizabad Rd"],
    title: "Wedding Venues on Faizabad Road, Lucknow | Viwah",
    description:
      "Discover wedding venues on Faizabad Road, Lucknow including lawns, resorts, hotels and banquet halls.",
    intro:
      "Explore wedding venues around Faizabad Road, Lucknow and compare pricing, capacity and ratings.",
  },

  "kursi-road-lucknow": {
    city: "Lucknow",
    name: "Kursi Road",
    locality: "Kursi Road",
    aliases: ["Kursi Road", "Kursi Rd"],
    title: "Wedding Venues on Kursi Road, Lucknow | Viwah",
    description:
      "Find wedding venues on Kursi Road, Lucknow including lawns, banquet halls and celebration spaces.",
    intro:
      "Browse wedding venues around Kursi Road, Lucknow for weddings and receptions.",
  },

  "mahanagar-lucknow": {
    city: "Lucknow",
    name: "Mahanagar",
    locality: "Mahanagar",
    aliases: ["Mahanagar"],
    title: "Wedding Venues in Mahanagar, Lucknow | Viwah",
    description:
      "Explore wedding venues in Mahanagar, Lucknow including banquet halls, lawns and wedding spaces.",
    intro:
      "Discover wedding venues in Mahanagar, Lucknow and compare available options.",
  },

  "chinhat-lucknow": {
    city: "Lucknow",
    name: "Chinhat",
    locality: "Chinhat",
    aliases: ["Chinhat"],
    title: "Wedding Venues in Chinhat, Lucknow | Viwah",
    description:
      "Discover wedding venues in Chinhat, Lucknow including lawns, banquet halls, resorts and celebration spaces.",
    intro:
      "Explore wedding venues in Chinhat, Lucknow for weddings, receptions and other celebrations.",
  },

  "aminabad-lucknow": {
    city: "Lucknow",
    name: "Aminabad",
    locality: "Aminabad",
    aliases: ["Aminabad"],
    title: "Wedding Venues in Aminabad, Lucknow | Viwah",
    description:
      "Find wedding venues in Aminabad, Lucknow including banquet halls and wedding spaces.",
    intro:
      "Browse wedding venues in Aminabad, Lucknow and compare available options.",
  },

  "vrindavan-colony-lucknow": {
    city: "Lucknow",
    name: "Vrindavan Colony",
    locality: "Vrindavan Colony",
    aliases: ["Vrindavan Colony"],
    title: "Wedding Venues in Vrindavan Colony, Lucknow | Viwah",
    description:
      "Explore wedding venues in Vrindavan Colony, Lucknow including lawns, banquet halls and celebration spaces.",
    intro:
      "Discover wedding venues around Vrindavan Colony, Lucknow.",
  },

  "deva-road-lucknow": {
    city: "Lucknow",
    name: "Deva Road",
    locality: "Deva Road",
    aliases: ["Deva Road", "Deva Rd"],
    title: "Wedding Venues on Deva Road, Lucknow | Viwah",
    description:
      "Find wedding venues on Deva Road, Lucknow including lawns, resorts and banquet halls.",
    intro:
      "Explore wedding venues around Deva Road, Lucknow for weddings and celebrations.",
  },

  "sarojini-nagar-lucknow": {
    city: "Lucknow",
    name: "Sarojini Nagar",
    locality: "Sarojini Nagar",
    aliases: ["Sarojini Nagar"],
    title: "Wedding Venues in Sarojini Nagar, Lucknow | Viwah",
    description:
      "Discover wedding venues in Sarojini Nagar, Lucknow including lawns, banquet halls and wedding spaces.",
    intro:
      "Browse wedding venues in Sarojini Nagar, Lucknow and compare available options.",
  },

  "mohanlalganj-lucknow": {
    city: "Lucknow",
    name: "Mohanlalganj",
    locality: "Mohanlalganj",
    aliases: ["Mohanlalganj"],
    title: "Wedding Venues in Mohanlalganj, Lucknow | Viwah",
    description:
      "Explore wedding venues in Mohanlalganj, Lucknow including lawns, farms and wedding spaces.",
    intro:
      "Find wedding venues around Mohanlalganj, Lucknow for weddings and celebrations.",
  },

  "iim-road-lucknow": {
    city: "Lucknow",
    name: "IIM Road",
    locality: "IIM Road",
    aliases: ["IIM Road", "IIM Rd"],
    title: "Wedding Venues on IIM Road, Lucknow | Viwah",
    description:
      "Discover wedding venues around IIM Road, Lucknow including lawns, banquet halls and celebration spaces.",
    intro:
      "Explore wedding venues around IIM Road, Lucknow and compare available options.",
  },

  "triveni-nagar-lucknow": {
    city: "Lucknow",
    name: "Triveni Nagar",
    locality: "Triveni Nagar",
    aliases: ["Triveni Nagar"],
    title: "Wedding Venues in Triveni Nagar, Lucknow | Viwah",
    description:
      "Find wedding venues in Triveni Nagar, Lucknow including banquet halls, lawns and wedding spaces.",
    intro:
      "Explore wedding venues in Triveni Nagar, Lucknow and compare available options.",
  },

  "telibagh-lucknow": {
    city: "Lucknow",
    name: "Telibagh",
    locality: "Telibagh",
    aliases: ["Telibagh"],
    title: "Wedding Venues in Telibagh, Lucknow | Viwah",
    description:
      "Discover wedding venues in Telibagh, Lucknow including lawns, banquet halls and celebration spaces.",
    intro:
      "Browse wedding venues in Telibagh, Lucknow for weddings, receptions and celebrations.",
  },

  "chowk-lucknow": {
    city: "Lucknow",
    name: "Chowk",
    locality: "Chowk",
    aliases: ["Chowk"],
    title: "Wedding Venues in Chowk, Lucknow | Viwah",
    description:
      "Explore wedding venues in Chowk, Lucknow including banquet halls and other wedding spaces.",
    intro:
      "Find wedding venues around Chowk, Lucknow and compare available options.",
  },

  "nirala-nagar-lucknow": {
    city: "Lucknow",
    name: "Nirala Nagar",
    locality: "Nirala Nagar",
    aliases: ["Nirala Nagar"],
    title: "Wedding Venues in Nirala Nagar, Lucknow | Viwah",
    description:
      "Find wedding venues in Nirala Nagar, Lucknow including banquet halls, lawns and wedding spaces.",
    intro:
      "Explore wedding venues in Nirala Nagar, Lucknow for weddings and celebrations.",
  },
};

const relatedLocations = Object.entries(locationConfig).map(
  ([slug, config]) => ({
    slug,
    name: config.name,
  })
);

const venueTypes = [

  "Banquet Hall",

  "Wedding Lawn",

  "Resort",

  "Hotel",

  "Farmhouse",

  "Palace",

];



function getConfig(slug: string) {

  return locationConfig[slug];

}



function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFilter(config: LocationConfig) {
  const filter: Record<string, unknown> = {
    city: config.city,
    status: "active",
  };

  const locationTerms = [
    config.locality,
    ...(config.aliases || []),
  ].filter(Boolean) as string[];

  if (locationTerms.length > 0) {
    filter.location = {
      $in: locationTerms.map(
        (term) => new RegExp(escapeRegex(term), "i")
      ),
    };
  }

  return filter;
}

export async function generateMetadata({

  params,

}: PageProps): Promise<Metadata> {

  const { location } = await params;



  const config = getConfig(location);



  if (!config) {

    return {

      title: "Wedding Venues | Viwah",

      description:

        "Explore wedding venues and wedding spaces on Viwah.",

    };

  }



  const canonical = `https://viwah.in/wedding-venues/${location}`;



  return {

    title: config.title,



    description: config.description,



    alternates: {

      canonical,

    },



    openGraph: {

      title: config.title,

      description: config.description,

      url: canonical,

      siteName: "Viwah",

      type: "website",

    },



    twitter: {

      card: "summary_large_image",

      title: config.title,

      description: config.description,

    },

  };

}



export default async function WeddingVenuesLocationPage({

  params,

}: PageProps) {

  const { location } = await params;



  const config = getConfig(location);



  if (!config) {

    notFound();

  }



  await connectDB();



  const filter = buildFilter(config);



  const venueDocs = await Venue.find(filter)

    .sort({

      featured: -1,

      rating: -1,

      reviewCount: -1,

      createdAt: -1,

    })

    .limit(24)

    .lean();



  const venues: VenueCardData[] = venueDocs.map((venue) => {

    const v = venue as unknown as {

      _id: unknown;

      slug: string;

      name: string;

      city: string;

      location: string;

      images: string[];

      startingPrice: number;

      capacity: number;

      rating: number;

      reviewCount: number;

      venueType: string;

    };



    return {

      _id: String(v._id),

      slug: v.slug,

      name: v.name,

      city: v.city,

      location: v.location,

      images: v.images,

      startingPrice: v.startingPrice,

      capacity: v.capacity,

      rating: v.rating,

      reviewCount: v.reviewCount,

      venueType: v.venueType,

    };

  });



  const venueCount = venues.length;



  const pageName = config.locality

    ? `${config.locality}, ${config.city}`

    : config.city;



  const breadcrumbSchema = {

    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    itemListElement: [

      {

        "@type": "ListItem",

        position: 1,

        name: "Home",

        item: "https://viwah.in",

      },

      {

        "@type": "ListItem",

        position: 2,

        name: "Wedding Venues",

        item: "https://viwah.in/venues",

      },

      {

        "@type": "ListItem",

        position: 3,

        name: pageName,

        item: `https://viwah.in/wedding-venues/${location}`,

      },

    ],

  };



  const itemListSchema = {

    "@context": "https://schema.org",

    "@type": "ItemList",

    name: `Wedding Venues in ${pageName}`,

    numberOfItems: venueCount,



    itemListElement: venues.map((venue, index) => ({

      "@type": "ListItem",

      position: index + 1,

      name: venue.name,

      url: `https://viwah.in/venues/${venue.slug}`,

    })),

  };



  const faqItems = [

    {

      question: `How can I find wedding venues in ${pageName}?`,

      answer: `Viwah lets you explore wedding venues in ${pageName} and compare available options based on venue type, pricing, capacity, ratings and other listing details.`,

    },

    {

      question: `What types of wedding venues are available in ${pageName}?`,

      answer:

        "Depending on current listings, wedding venue options can include banquet halls, wedding lawns, resorts, hotels, farmhouses and palaces.",

    },

    {

      question: `How do I choose a wedding venue in ${pageName}?`,

      answer:

        `Start with your guest count, preferred venue type, wedding dates, location and budget. Then compare capacity, starting price, venue features, photos and other listing details before shortlisting venues.`,

    },

    {

      question: `Can I compare wedding venue prices in ${pageName}?`,

      answer:

        "Yes. Viwah listings can include starting prices, allowing couples to compare available venues before creating a shortlist.",

    },

    {

      question: `Which areas in ${config.city} have wedding venues?`,

      answer:

        `Viwah has dedicated venue pages for multiple areas and localities across ${config.city}. Use the locality links on this page to explore wedding venues in different parts of the city.`,

    },

    {

      question: `What should I check before booking a wedding venue in ${pageName}?`,

      answer:

        "Check the venue's guest capacity, starting price, location, venue type, available amenities, photos and the details provided in the listing. Couples should also confirm date availability and final package terms directly with the venue before booking.",

    },

  ];



  const faqSchema = {

    "@context": "https://schema.org",

    "@type": "FAQPage",



    mainEntity: faqItems.map((item) => ({

      "@type": "Question",

      name: item.question,



      acceptedAnswer: {

        "@type": "Answer",

        text: item.answer,

      },

    })),

  };



  return (

    <main className="min-h-screen bg-ivory px-5 pb-24 pt-32 sm:px-8">

      <script

        type="application/ld+json"

        dangerouslySetInnerHTML={{

          __html: JSON.stringify(breadcrumbSchema),

        }}

      />



      <script

        type="application/ld+json"

        dangerouslySetInnerHTML={{

          __html: JSON.stringify(itemListSchema),

        }}

      />



      <script

        type="application/ld+json"

        dangerouslySetInnerHTML={{

          __html: JSON.stringify(faqSchema),

        }}

      />



      <div className="mx-auto max-w-7xl">

        <nav

          aria-label="Breadcrumb"

          className="mb-8 text-sm text-charcoal/50"

        >

          <Link href="/" className="hover:text-gold">

            Home

          </Link>



          <span className="mx-2">/</span>



          <Link href="/venues" className="hover:text-gold">

            Wedding Venues

          </Link>



          <span className="mx-2">/</span>



          <span className="text-charcoal/70">

            {pageName}

          </span>

        </nav>



        <section className="max-w-4xl">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">

            Viwah Wedding Venues

          </p>



          <h1 className="mt-3 font-display text-5xl leading-[1.08] text-charcoal sm:text-6xl">

            Wedding Venues in {pageName}

          </h1>



          <p className="mt-6 max-w-3xl text-lg leading-8 text-charcoal/65">

            {config.intro}

          </p>

        </section>



        <section className="mt-16">

          <div className="flex flex-col justify-between gap-4 border-b border-charcoal/10 pb-6 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">

                Explore venues

              </p>



              <h2 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">

                Wedding venues in {pageName}

              </h2>

            </div>



            <p className="text-sm text-charcoal/50">

              {venueCount}{" "}

              {venueCount === 1 ? "venue" : "venues"} available

            </p>

          </div>



          {venues.length > 0 ? (

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {venues.map((venue) => (

                <VenueCard

                  key={venue._id}

                  venue={venue}

                />

              ))}

            </div>

          ) : (

            <div className="mt-8 rounded-[2rem] bg-white p-10 text-center sm:p-16">

              <h3 className="font-display text-3xl text-charcoal">

                No venues listed here yet

              </h3>



              <p className="mx-auto mt-3 max-w-xl text-charcoal/55">

                We are continuously adding wedding venues to Viwah. Explore

                other Lucknow locations to find currently available listings.

              </p>



              <Link

                href="/wedding-venues/lucknow"

                className="mt-7 inline-flex rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition hover:bg-gold"

              >

                Explore Lucknow venues

              </Link>

            </div>

          )}

        </section>



        <section className="mt-24 border-t border-charcoal/10 pt-16">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">

            Browse by venue type

          </p>



          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">

            Wedding venue types in {pageName}

          </h2>



          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {venueTypes.map((type) => (

              <Link

                key={type}

                href={`/venues?city=${encodeURIComponent(

                  config.city

                )}&venueType=${encodeURIComponent(type)}`}

                className="rounded-2xl border border-charcoal/10 bg-white p-5 transition hover:border-gold hover:shadow-sm"

              >

                <p className="font-medium text-charcoal">

                  {type}

                </p>



                <p className="mt-1 text-sm text-charcoal/50">

                  Explore {type.toLowerCase()} options

                </p>

              </Link>

            ))}

          </div>

        </section>



        <section className="mt-24 border-t border-charcoal/10 pt-16">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">

            Explore Lucknow

          </p>



          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">

            More wedding venues near Lucknow

          </h2>



          <div className="mt-8 flex flex-wrap gap-3">

            {relatedLocations

              .filter((item) => item.slug !== location)

              .map((item) => (

                <Link

                  key={item.slug}

                  href={`/wedding-venues/${item.slug}`}

                  className="rounded-full border border-charcoal/15 bg-white px-5 py-3 text-sm text-charcoal transition hover:border-gold hover:text-gold"

                >

                  Wedding Venues in {item.name}

                </Link>

              ))}

          </div>

        </section>



        <section className="mt-24 max-w-4xl border-t border-charcoal/10 pt-16">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">

            Wedding planning guide

          </p>



          <h2 className="mt-3 font-display text-3xl leading-tight text-charcoal sm:text-4xl">

            Finding the right wedding venue in {pageName}

          </h2>



          <div className="mt-7 space-y-5 text-base leading-8 text-charcoal/65 sm:text-lg">

            <p>

              Choosing a wedding venue is one of the most important decisions

              when planning a celebration. Start with your expected guest count,

              wedding format, preferred area and budget, then compare venues

              that can comfortably accommodate your plans.

            </p>



            <p>

              When comparing wedding venues in {pageName}, look beyond the

              headline price. Check the venue type, guest capacity, location,

              available amenities, photos and the starting price shown in the

              listing. For a final decision, confirm the wedding date, package

              inclusions and terms directly with the venue.

            </p>



            <p>

              Lucknow offers different kinds of wedding spaces, from banquet

              halls and wedding lawns to hotels, resorts, farmhouses and palaces.

              Couples can also explore nearby localities through the dedicated

              Viwah venue pages linked below, making it easier to compare options

              across the city.

            </p>



            <p>

              For couples searching for premium wedding venues, Viwah provides

              venue listings with key details in one place so they can discover

              suitable spaces, compare available information and build a

              practical shortlist before making enquiries.

            </p>

          </div>

        </section>



        <section className="mt-24 border-t border-charcoal/10 pt-16">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">

            Frequently asked questions

          </p>



          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">

            Wedding venues in {pageName}: FAQs

          </h2>



          <div className="mt-8 max-w-4xl space-y-4">

            {faqItems.map((item) => (

              <details

                key={item.question}

                className="group rounded-2xl border border-charcoal/10 bg-white px-6 py-5"

              >

                <summary className="cursor-pointer list-none font-medium text-charcoal">

                  {item.question}

                </summary>



                <p className="mt-4 leading-7 text-charcoal/60">

                  {item.answer}

                </p>

              </details>

            ))}

          </div>

        </section>

      </div>

    </main>

  );

}