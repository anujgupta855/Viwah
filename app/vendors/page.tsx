"use client";

import { useEffect, useMemo, useState } from "react";
import { VendorCard } from "@/components/marketplace/vendor-card";

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

const categories = [
  "Photographer",
  "Makeup Artist",
  "Decorator",
  "Caterer",
  "Mehendi Artist",
  "DJ",
];

type Option = {
  label: string;
  value: number;
};

const fallback: Record<string, Option[]> = {
  "Mehendi Artist": [
    { label: "Under ₹10k", value: 10000 },
    { label: "Under ₹20k", value: 20000 },
    { label: "Under ₹30k", value: 30000 },
    { label: "Under ₹50k", value: 50000 },
  ],

  Caterer: [
    { label: "Under ₹500 / plate", value: 500 },
    { label: "Under ₹750 / plate", value: 750 },
    { label: "Under ₹1,000 / plate", value: 1000 },
    { label: "Under ₹1,500 / plate", value: 1500 },
  ],
};

const categoryMap: Record<string, string> = {
  photographer: "Photographer",
  makeup: "Makeup Artist",
  "makeup artist": "Makeup Artist",
  decor: "Decorator",
  decorator: "Decorator",
  catering: "Caterer",
  caterer: "Caterer",
  mehendi: "Mehendi Artist",
  "mehendi artist": "Mehendi Artist",
  dj: "DJ",
};

export default function VendorsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [priceOptions, setPriceOptions] =
    useState<Record<string, Option[]>>(fallback);

  // URL params are initialized only on the client
  // to avoid hydration mismatch.
  const [params, setParams] =
    useState<URLSearchParams | null>(null);

  const [hydrated, setHydrated] = useState(false);

  /*
   * Read the actual browser URL.
   *
   * This ensures:
   * /vendors?category=mehendi
   *
   * directly loads Mehendi Artist vendors
   * without requiring a page refresh.
   */
  useEffect(() => {
    const currentParams = new URLSearchParams(
      window.location.search
    );

    const rawCategory = currentParams.get("category");

    if (rawCategory) {
      const normalizedCategory =
        categoryMap[rawCategory.trim().toLowerCase()] ||
        rawCategory.trim();

      currentParams.set("category", normalizedCategory);
    }

    setParams(currentParams);
    setHydrated(true);
  }, []);

  /*
   * Load pricing configuration from admin settings.
   */
  useEffect(() => {
    fetch("/api/config", {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.vendorPriceOptions) {
          setPriceOptions(data.vendorPriceOptions);
        }
      })
      .catch(() => {
        // Keep fallback pricing if config request fails.
      });
  }, []);

  /*
   * Fetch vendors whenever filters change.
   */
  useEffect(() => {
    if (!hydrated || !params) return;

    // Important:
    // Store the narrowed non-null value in a constant.
    // This fixes the TypeScript build error.
    const currentParams = params;

    let cancelled = false;

    async function loadVendors() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/vendors?${currentParams.toString()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load vendors");
        }

        const data = await response.json();

        if (!cancelled) {
          setItems(data.items || []);
        }
      } catch (error) {
        console.error("Failed to load vendors:", error);

        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVendors();

    return () => {
      cancelled = true;
    };
  }, [hydrated, params?.toString()]);

  /*
   * Update one filter.
   */
  const setFilter = (key: string, value: string) => {
    if (!params) return;

    const next = new URLSearchParams(params);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    // Keep browser URL synchronized.
    const query = next.toString();

    window.history.replaceState(
      null,
      "",
      query
        ? `${window.location.pathname}?${query}`
        : window.location.pathname
    );

    setParams(next);
  };

  /*
   * Category change.
   *
   * Price ranges are category-specific,
   * so reset price filters when category changes.
   */
  const changeCategory = (value: string) => {
    if (!params) return;

    const next = new URLSearchParams(params);

    if (value) {
      next.set("category", value);
    } else {
      next.delete("category");
    }

    next.delete("minPrice");
    next.delete("maxPrice");

    const query = next.toString();

    window.history.replaceState(
      null,
      "",
      query
        ? `${window.location.pathname}?${query}`
        : window.location.pathname
    );

    setParams(next);
  };

  /*
   * Current selected category.
   */
  const category = params?.get("category") || "";

  /*
   * Category-specific pricing options.
   */
  const options = useMemo(() => {
    return priceOptions[category] || [];
  }, [category, priceOptions]);

  /*
   * Prevent rendering filters/cards until
   * the browser URL has been read.
   */
  if (!hydrated || !params) {
    return (
      <main className="min-h-screen bg-ivory px-5 pb-24 pt-32 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-5 w-40 animate-pulse rounded bg-white" />

          <div className="mt-4 h-16 w-full max-w-4xl animate-pulse rounded bg-white" />

          <div className="mt-10 h-24 animate-pulse rounded-[2rem] bg-white" />

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-[2rem] bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-5 pb-24 pt-32 sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page heading */}
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Meet the experts
        </p>

        <h1 className="mt-3 font-display text-5xl sm:text-6xl">
          Wedding professionals you can trust.
        </h1>

        <p className="mt-5 max-w-3xl text-charcoal/60">
          Discover photographers, beauty teams, decorators,
          caterers, mehendi artists and DJs from the live Viwah
          marketplace.
        </p>

        {/* Filters */}
        <div className="mt-10 rounded-[2rem] border border-charcoal/10 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">

            {/* Search */}
            <input
              className="field"
              placeholder="Search vendors..."
              value={params.get("q") || ""}
              onChange={(event) =>
                setFilter("q", event.target.value)
              }
            />

            {/* Category */}
            <select
              className="field"
              value={category}
              onChange={(event) =>
                changeCategory(event.target.value)
              }
            >
              <option value="">All categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* City */}
            <select
              className="field"
              value={params.get("city") || ""}
              onChange={(event) =>
                setFilter("city", event.target.value)
              }
            >
              <option value="">All cities</option>

              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Rating */}
            <select
              className="field"
              value={params.get("minRating") || ""}
              onChange={(event) =>
                setFilter("minRating", event.target.value)
              }
            >
              <option value="">Any rating</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>

            {/* Price */}
            <select
              className="field"
              value={params.get("maxPrice") || ""}
              onChange={(event) =>
                setFilter("maxPrice", event.target.value)
              }
            >
              <option value="">
                {category === "Caterer"
                  ? "Any rate"
                  : "Any budget"}
              </option>

              {options.map((option) => (
                <option
                  value={option.value}
                  key={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="field"
              value={params.get("sort") || "featured"}
              onChange={(event) =>
                setFilter("sort", event.target.value)
              }
            >
              <option value="featured">
                Featured
              </option>

              <option value="price_asc">
                Price: low to high
              </option>

              <option value="price_desc">
                Price: high to low
              </option>

              <option value="rating">
                Top rated
              </option>

              <option value="popular">
                Most reviewed
              </option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-[2rem] bg-white"
              />
            ))}
          </div>

        ) : items.length ? (

          /* Vendor cards */
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((vendor) => (
              <VendorCard
                key={vendor._id}
                vendor={vendor}
              />
            ))}
          </div>

        ) : (

          /* Empty state */
          <div className="mt-8 rounded-[2rem] bg-white p-12 text-center">
            <h2 className="font-display text-3xl">
              No vendors found
            </h2>

            <p className="mt-2 text-charcoal/55">
              Try a different category, city, price range
              or search.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}