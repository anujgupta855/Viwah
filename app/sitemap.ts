import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Vendor, Venue, WeddingStory } from "@/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
const base = "https://viwah.in";
const weddingVenueLocations = [
  "lucknow",
  "gomti-nagar-lucknow",
  "golf-city-lucknow",
  "arjunganj-lucknow",
  "sultanpur-road-lucknow",
  "sitapur-road-lucknow",
  "indira-nagar-lucknow",
  "alambagh-lucknow",
  "hazratganj-lucknow",
  "rajajipuram-lucknow",
  "jankipuram-lucknow",
  "ashiyana-lucknow",
  "aliganj-lucknow",
  "charbagh-lucknow",
  "kanpur-road-lucknow",
  "vikas-nagar-lucknow",
  "faizabad-road-lucknow",
  "kursi-road-lucknow",
  "mahanagar-lucknow",
  "chinhat-lucknow",
  "aminabad-lucknow",
  "vrindavan-colony-lucknow",
  "deva-road-lucknow",
  "sarojini-nagar-lucknow",
  "mohanlalganj-lucknow",
  "iim-road-lucknow",
  "triveni-nagar-lucknow",
  "telibagh-lucknow",
  "chowk-lucknow",
  "nirala-nagar-lucknow",
];

  try {
    await connectDB();

    const [vendors, venues, weddings] = await Promise.all([
      Vendor.find({ status: "active" })
        .select("slug updatedAt")
        .lean(),

      Venue.find({ status: "active" })
        .select("slug updatedAt")
        .lean(),

      WeddingStory.find({})
        .select("_id updatedAt")
        .lean(),
    ]);

    return [
      {
        url: base,
        lastModified: new Date(),
      },
      {
        url: `${base}/venues`,
        lastModified: new Date(),
      },
      {
        url: `${base}/vendors`,
        lastModified: new Date(),
      },
      {
        url: `${base}/real-weddings`,
        lastModified: new Date(),
      },
      {
        url: `${base}/about`,
        lastModified: new Date(),
      },
      {
        url: `${base}/contact`,
        lastModified: new Date(),
      },
       ...weddingVenueLocations.map((location) => ({
        url: `${base}/wedding-venues/${location}`,
        lastModified: new Date(),
      })),

      ...venues.map((v) => ({
        url: `${base}/venues/${v.slug}`,
        lastModified: v.updatedAt || new Date(),
      })),

      ...vendors.map((v) => ({
        url: `${base}/vendors/${v.slug}`,
        lastModified: v.updatedAt || new Date(),
      })),

      ...weddings.map((w) => ({
        url: `${base}/real-weddings/${w._id}`,
        lastModified: w.updatedAt || new Date(),
      })),
    ];
  } catch {
    return [
      { url: base },
      { url: `${base}/venues` },
      { url: `${base}/vendors` },
      { url: `${base}/real-weddings` },
      { url: `${base}/about` },
      { url: `${base}/contact` },
    ];
  }
}