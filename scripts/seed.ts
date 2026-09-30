import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import crypto from "node:crypto";
import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import {
  Admin,
  Enquiry,
  Review,
  User,
  Vendor,
  Venue,
  WeddingStory,
  MarketplaceSetting,
} from "../models";

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=85`;

const venueImages = [
  image("photo-1519167758481-83f550bb49b3"),
  image("photo-1519225421980-715cb0215aed"),
  image("photo-1464366400600-7168b8af9bc3"),
  image("photo-1507504031003-b417219a0fde"),
  image("photo-1519741497674-611481863552"),
  image("photo-1523438885200-e635ba2c371e"),
  image("photo-1511285560929-80b456fea0bc"),
  image("photo-1507504031003-b417219a0fde"),
];

const categoryImages: Record<string, string[]> = {
  "Photographer": [image("photo-1492684223066-81342ee5ff30"), image("photo-1507504031003-b417219a0fde"), image("photo-1511285560929-80b456fea0bc")],
  "Makeup Artist": [image("photo-1487412720507-e7ab37603c6f"), image("photo-1516975080664-ed2fc6a32937"), image("photo-1522335789203-aabd1fc54bc9")],
  "Decorator": [image("photo-1519167758481-83f550bb49b3"), image("photo-1519225421980-715cb0215aed"), image("photo-1464366400600-7168b8af9bc3")],
  "Caterer": [image("photo-1555244162-803834f70033"), image("photo-1547592180-85f173990554"), image("photo-1515003197210-e0cd71810b5f")],
  "Mehendi Artist": [image("photo-1519741497674-611481863552"), image("photo-1522673607200-164d1b6ce486"), image("photo-1511285560929-80b456fea0bc")],
  "DJ": [image("photo-1506157786151-b8491531f063"), image("photo-1492684223066-81342ee5ff30"), image("photo-1524368535928-5b5e00ddc76b")],
};

const cities = [
  "Delhi",
  "Mumbai",
  "Lucknow",
  "Kanpur",
  "Jaipur",
  "Agra",
  "Bangalore",
  "Hyderabad",
  "Chandigarh",
];

const amenities = [
  "Air Conditioning",
  "Parking",
  "Catering",
  "Power Backup",
  "Bridal Room",
  "DJ Setup",
  "Decor Allowed",
];

const venueBlueprints = [
  ["The Ivory Courtyard", "Delhi", "Mehrauli, New Delhi", "Banquet Hall", 185000, 450],
  ["Rajputana Greens", "Jaipur", "Amer Road, Jaipur", "Wedding Lawn", 125000, 700],
  ["The Marigold Palace", "Lucknow", "Gomti Nagar, Lucknow", "Palace", 225000, 600],
  ["Riverside Pearl Resort", "Agra", "Fatehabad Road, Agra", "Resort", 165000, 500],
  ["Lakeview Grande", "Bangalore", "Whitefield, Bengaluru", "Hotel", 210000, 550],
  ["The Royal Orchard", "Kanpur", "Civil Lines, Kanpur", "Farmhouse", 95000, 350],
  ["Saffron Courtyard", "Mumbai", "Powai, Mumbai", "Banquet Hall", 275000, 400],
  ["Nizam Heritage Lawn", "Hyderabad", "Banjara Hills, Hyderabad", "Wedding Lawn", 145000, 650],
  ["Rosewood Manor", "Chandigarh", "Sector 17, Chandigarh", "Farmhouse", 135000, 300],
  ["Amber Crown Hotel", "Jaipur", "C-Scheme, Jaipur", "Hotel", 240000, 500],
  ["Yamuna Vista", "Delhi", "Vasant Kunj, New Delhi", "Resort", 195000, 450],
  ["Gomti Garden Estate", "Lucknow", "Malhaur, Lucknow", "Wedding Lawn", 110000, 550],
] as const;

const vendorBlueprints = [
  ["Frame & Vow Studio", "Photographer", "Delhi", 85000],
  ["The Candid Chapter", "Photographer", "Mumbai", 110000],
  ["Lens & Laughter", "Photographer", "Lucknow", 65000],
  ["Aarohi Beauty Atelier", "Makeup Artist", "Delhi", 35000],
  ["Glow by Meera", "Makeup Artist", "Jaipur", 28000],
  ["Blush & Bloom", "Makeup Artist", "Bangalore", 42000],
  ["Petal & Pillar", "Decorator", "Delhi", 120000],
  ["Riwaaz Decor House", "Decorator", "Lucknow", 90000],
  ["The Marigold Muse", "Decorator", "Jaipur", 105000],
  ["Dawat & Dastaan", "Caterer", "Delhi", 95000],
  ["Swaad Sutra Catering", "Caterer", "Kanpur", 65000],
  ["Royal Rasoi Co.", "Caterer", "Hyderabad", 125000],
  ["Mehendi by Noor", "Mehendi Artist", "Delhi", 18000],
  ["Henna Stories", "Mehendi Artist", "Chandigarh", 15000],
  ["Rangrez Mehendi", "Mehendi Artist", "Jaipur", 22000],
  ["Beat Bazaar", "DJ", "Mumbai", 55000],
  ["Dhol & Disco", "DJ", "Delhi", 45000],
  ["The Wedding Sound Co.", "DJ", "Bangalore", 60000],
] as const;

const weddingBlueprints = [
  ["Aarav & Kiara", "Jaipur", "Royal Garden Soiree"],
  ["Rohan & Meera", "Delhi", "Contemporary Ivory"],
  ["Aditya & Naina", "Lucknow", "Nawabi Romance"],
  ["Kabir & Anaya", "Agra", "Pastel Heritage"],
  ["Arjun & Tara", "Mumbai", "Modern Coastal"],
  ["Dev & Riya", "Bangalore", "Botanical Minimal"],
  ["Vivaan & Ishita", "Hyderabad", "Regal Evening"],
  ["Kunal & Sana", "Chandigarh", "Classic Garden"],
] as const;

const reviewNames = [
  "Aditi Sharma",
  "Riya Kapoor",
  "Neha Verma",
  "Karan Malhotra",
  "Pooja Singh",
  "Ananya Rao",
  "Sakshi Jain",
  "Rahul Mehta",
  "Ishita Gupta",
  "Manav Bansal",
];

const reviewComments = [
  "The team was organised, warm and genuinely helpful throughout our wedding planning.",
  "Beautiful setup and smooth coordination. Everything looked even better than the reference pictures.",
  "The service was professional and the communication was excellent from the first call.",
  "We loved the attention to detail. Our families had a wonderful experience.",
  "The experience felt premium without making the planning stressful.",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail) {
    throw new Error(
      "ADMIN_EMAIL is required. Set it in .env.local.",
    );
  }

  if (!adminPassword) {
    throw new Error(
      "ADMIN_PASSWORD is required. Set it in .env.local.",
    );
  }

  await connectDB();

  console.log("Connected to MongoDB");

  await Promise.all([
    Admin.deleteMany({}),
    MarketplaceSetting.deleteMany({}),
    User.deleteMany({}),
    Vendor.deleteMany({}),
    Venue.deleteMany({}),
    Review.deleteMany({}),
    Enquiry.deleteMany({}),
    WeddingStory.deleteMany({}),
  ]);

  const venues = await Venue.insertMany(
    venueBlueprints.map(
      (
        [name, city, location, venueType, startingPrice, capacity],
        index,
      ) => ({
        name,
        slug: slugify(name),
        city,
        location,
        description: `${name} is a refined wedding destination designed for intimate ceremonies, grand celebrations and elegant receptions in ${city}.`,
        images: [
          venueImages[index % venueImages.length],
          venueImages[(index + 1) % venueImages.length],
          venueImages[(index + 2) % venueImages.length],
        ],
        startingPrice,
        capacity,
        venueType,
        amenities: amenities.slice(0, 4 + (index % 3)),
        rating: Number((4.2 + (index % 8) / 10).toFixed(1)),
        reviewCount: 18 + index * 7,
        featured: index < 6,
        status: "active",
      }),
    ),
  );

  const vendors = await Vendor.insertMany(
    vendorBlueprints.map(
      ([name, category, city, startingPrice], index) => {
        const catererPrice =
          [650, 850, 1100][index % 3];

        return {
          name,
          slug: slugify(name),
          category,
          city,
          description: `${name} is a trusted ${category.toLowerCase()} team serving modern Indian weddings with a polished, detail-first approach.`,
          profileImage: categoryImages[category][index % categoryImages[category].length],
          portfolioImages: [
            categoryImages[category][index % categoryImages[category].length],
            categoryImages[category][(index + 1) % categoryImages[category].length],
            categoryImages[category][(index + 2) % categoryImages[category].length],
          ],
          startingPrice:
            category === "Caterer"
              ? catererPrice
              : startingPrice,
          pricingUnit:
            category === "Caterer"
              ? "per_plate"
              : "package",
          packages: [
            {
              name: "Essential",
              price:
                category === "Caterer"
                  ? catererPrice
                  : startingPrice,
              description:
                category === "Caterer"
                  ? "Per-plate catering package for intimate celebrations."
                  : "A focused package for intimate celebrations.",
            },
            {
              name: "Signature",
              price:
                category === "Caterer"
                  ? Math.round(catererPrice * 1.45)
                  : Math.round(startingPrice * 1.45),
              description:
                category === "Caterer"
                  ? "Per-plate package with an expanded menu selection."
                  : "Our most requested package with expanded coverage.",
            },
            {
              name: "Luxe",
              price:
                category === "Caterer"
                  ? Math.round(catererPrice * 2.1)
                  : Math.round(startingPrice * 2.1),
              description:
                category === "Caterer"
                  ? "Premium per-plate menu with full-service options."
                  : "Full-service coverage for a premium wedding experience.",
            },
          ],
          rating: Number(
            (4.3 + (index % 6) / 10).toFixed(1),
          ),
          reviewCount: 12 + index * 5,
          phone: `+91 98${String(
            10000000 + index * 137641,
          ).slice(0, 8)}`,
          email: `hello@${slugify(name)}.example.com`,
          address: `${city} Wedding District, ${city}`,
          featured: index < 8,
          status: index === 17 ? "inactive" : "active",
        };
      },
    ),
  );

  const stories = await WeddingStory.insertMany(
    weddingBlueprints.map(
      ([coupleName, location, weddingStyle], index) => ({
        coupleName,
        location,
        weddingDate: new Date(
          Date.UTC(2025, index, 12 + index),
        ),
        story: `${coupleName} brought together family traditions and contemporary details for a celebration filled with thoughtful moments, warm portraits and joyful gatherings.`,
        coverImage:
          venueImages[index % venueImages.length],
        gallery: [
          venueImages[index % venueImages.length],
          venueImages[(index + 2) % venueImages.length],
          venueImages[(index + 4) % venueImages.length],
        ],
        weddingStyle,
        description: `A ${weddingStyle.toLowerCase()} wedding story from ${location}, curated by the Viwah editorial team.`,
      }),
    ),
  );

  await User.insertMany([
    {
      name: "Aditi Sharma",
      email: "aditi@example.com",
    },
    {
      name: "Riya Kapoor",
      email: "riya@example.com",
    },
    {
      name: "Neha Verma",
      email: "neha@example.com",
    },
  ]);

  const reviews = Array.from(
    { length: 50 },
    (_, index) => {
      const vendor = vendors[index % vendors.length];
      const venue = venues[index % venues.length];
      const approved = index < 40;

      return {
        userName:
          reviewNames[index % reviewNames.length],
        rating: 4 + (index % 2),
        comment:
          reviewComments[index % reviewComments.length],
        vendor:
          index % 2 === 0 ? vendor._id : null,
        venue:
          index % 2 === 1 ? venue._id : null,
        date: new Date(
          Date.UTC(
            2026,
            index % 9,
            2 + (index % 24),
          ),
        ),
        status: approved
          ? "approved"
          : index % 3 === 0
            ? "rejected"
            : "pending",
      };
    },
  );

  await Review.insertMany(reviews);

  await Enquiry.insertMany([
    {
      name: "Priya Kapoor",
      email: "priya@example.com",
      phone: "+919810000001",
      vendor: vendors[0]._id,
      eventDate: new Date("2027-02-14"),
      message:
        "Looking for complete photography coverage for a two-day wedding.",
      status: "new",
    },
    {
      name: "Rahul Arora",
      email: "rahul@example.com",
      phone: "+919810000002",
      venue: venues[0]._id,
      eventDate: new Date("2027-01-22"),
      message:
        "Would like to schedule a venue visit for around 350 guests.",
      status: "read",
    },
    {
      name: "Simran Kaur",
      email: "simran@example.com",
      phone: "+919810000003",
      vendor: vendors[6]._id,
      eventDate: new Date("2027-03-06"),
      message:
        "Please share decor options for a pastel garden theme.",
      status: "contacted",
    },
    {
      name: "Vikram Jain",
      email: "vikram@example.com",
      phone: "+919810000004",
      venue: venues[4]._id,
      eventDate: new Date("2027-04-18"),
      message:
        "Need availability and package details.",
      status: "new",
    },
    {
      name: "Shreya Rao",
      email: "shreya@example.com",
      phone: "+919810000005",
      vendor: vendors[15]._id,
      eventDate: new Date("2027-05-09"),
      message:
        "Interested in DJ and live dhol options.",
      status: "closed",
    },
  ]);

  await Admin.create({
    email: adminEmail,
    name: "Viwah Admin",
    passwordHash: hashPassword(adminPassword),
    role: "admin",
    active: true,
  });

  await MarketplaceSetting.create({
    key: "marketplace",

    venuePriceOptions: [
      { label: "Under ₹1L", value: 100000 },
      { label: "Under ₹2L", value: 200000 },
      { label: "Under ₹5L", value: 500000 },
      { label: "Under ₹10L", value: 1000000 },
    ],

    vendorPriceOptions: new Map([
      [
        "Photographer",
        [
          { label: "Under ₹50k", value: 50000 },
          { label: "Under ₹1L", value: 100000 },
          { label: "Under ₹2L", value: 200000 },
          { label: "Under ₹5L", value: 500000 },
        ],
      ],
      [
        "Makeup Artist",
        [
          { label: "Under ₹50k", value: 50000 },
          { label: "Under ₹1L", value: 100000 },
          { label: "Under ₹2L", value: 200000 },
          { label: "Under ₹5L", value: 500000 },
        ],
      ],
      [
        "Decorator",
        [
          { label: "Under ₹50k", value: 50000 },
          { label: "Under ₹1L", value: 100000 },
          { label: "Under ₹2L", value: 200000 },
          { label: "Under ₹5L", value: 500000 },
        ],
      ],
      [
        "Caterer",
        [
          {
            label: "Under ₹500 / plate",
            value: 500,
          },
          {
            label: "Under ₹750 / plate",
            value: 750,
          },
          {
            label: "Under ₹1,000 / plate",
            value: 1000,
          },
          {
            label: "Under ₹1,500 / plate",
            value: 1500,
          },
        ],
      ],
      [
        "Mehendi Artist",
        [
          { label: "Under ₹10k", value: 10000 },
          { label: "Under ₹20k", value: 20000 },
          { label: "Under ₹30k", value: 30000 },
          { label: "Under ₹50k", value: 50000 },
        ],
      ],
      [
        "DJ",
        [
          { label: "Under ₹50k", value: 50000 },
          { label: "Under ₹1L", value: 100000 },
          { label: "Under ₹2L", value: 200000 },
          { label: "Under ₹5L", value: 500000 },
        ],
      ],
    ]),
  });

  console.log(
    `Seed complete: ${venues.length} venues, ${vendors.length} vendors, ${stories.length} stories, 50 reviews, 5 enquiries.`,
  );

  console.log(
    `Admin account seeded: ${adminEmail}`,
  );
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });