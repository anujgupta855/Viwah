import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Venue } from "@/models";
import VenueDetail from "./venue-detail";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = "https://viwah.in";

type VenueSeoData = {
  slug: string;
  name: string;
  city: string;
  location: string;
  description: string;
  images: string[];
  startingPrice: number;
  capacity: number;
  venueType: string;
  amenities: string[];
  rating: number;
  reviewCount: number;
};

async function getVenueForSeo(
  slug: string,
): Promise<VenueSeoData | null> {
  await connectDB();

  const venue = await Venue.findOne({
    slug: slug.trim().toLowerCase(),
    status: "active",
  })
    .select(
      "slug name city location description images startingPrice capacity venueType amenities rating reviewCount",
    )
    .lean()
    .exec();

  if (!venue || Array.isArray(venue)) {
    return null;
  }

  return {
    slug: String(venue.slug),
    name: String(venue.name),
    city: String(venue.city),
    location: String(venue.location),
    description: String(venue.description || ""),
    images: Array.isArray(venue.images) ? venue.images : [],
    startingPrice: Number(venue.startingPrice || 0),
    capacity: Number(venue.capacity || 0),
    venueType: String(venue.venueType),
    amenities: Array.isArray(venue.amenities)
      ? venue.amenities
      : [],
    rating: Number(venue.rating || 0),
    reviewCount: Number(venue.reviewCount || 0),
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const venue = await getVenueForSeo(slug);

  if (!venue) {
    return {
      title: "Wedding Venue | Viwah",
      description:
        "Explore wedding venues, prices, photos, capacity and reviews on Viwah.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const canonical = `${SITE_URL}/venues/${venue.slug}`;

  const title = `${venue.name} | Wedding Venue in ${venue.location}, ${venue.city} | Viwah`;

  const description =
    `Explore ${venue.name}, a ${venue.venueType.toLowerCase()} in ` +
    `${venue.location}, ${venue.city}. Check starting price, capacity, ` +
    `photos, amenities and reviews on Viwah.`;

  const firstImage = venue.images.find(
    (image) =>
      typeof image === "string" &&
      image.trim().length > 0,
  );

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Viwah",
      type: "website",
      ...(firstImage
        ? {
            images: [
              {
                url: firstImage,
                alt: `${venue.name} wedding venue`,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(firstImage
        ? {
            images: [firstImage],
          }
        : {}),
    },
  };
}

export default async function Page({
  params,
}: PageProps) {
  const { slug } = await params;
  const venue = await getVenueForSeo(slug);

  const canonical = venue
    ? `${SITE_URL}/venues/${venue.slug}`
    : `${SITE_URL}/venues/${slug}`;

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Wedding Venues",
        item: `${SITE_URL}/venues`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: venue?.name || "Wedding Venue",
        item: canonical,
      },
    ],
  };

  const venueSchema = venue
    ? {
        "@type": ["LocalBusiness", "EventVenue"],
        name: venue.name,
        url: canonical,
        description: venue.description,
        image: venue.images,

        address: {
          "@type": "PostalAddress",
          addressLocality: venue.location,
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },

        ...(venue.capacity > 0
          ? {
              maximumAttendeeCapacity: venue.capacity,
            }
          : {}),

        ...(venue.startingPrice > 0
          ? {
              offers: {
                "@type": "Offer",
                price: venue.startingPrice,
                priceCurrency: "INR",
                availability:
                  "https://schema.org/InStock",
                url: canonical,
              },
            }
          : {}),

        ...(venue.rating > 0 &&
        venue.reviewCount > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: venue.rating,
                reviewCount: venue.reviewCount,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),

        ...(venue.amenities.length > 0
          ? {
              amenityFeature: venue.amenities.map(
                (amenity) => ({
                  "@type":
                    "LocationFeatureSpecification",
                  name: amenity,
                  value: true,
                }),
              ),
            }
          : {}),
      }
    : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema,
      ...(venueSchema ? [venueSchema] : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <VenueDetail
        params={Promise.resolve({ slug })}
      />
    </>
  );
}