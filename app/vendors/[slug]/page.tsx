"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  MapPin,
  Star,
  Phone,
  Mail,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { EnquiryForm } from "@/components/marketplace/enquiry-form";

type PackageItem = {
  name: string;
  price: number;
  description: string;
};

export default function VendorDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
 const [data, setData] = useState<any>(null);
const [error, setError] = useState("");

const [currentImage, setCurrentImage] = useState(0);
const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    params
      .then(({ slug }) =>
        fetch(`/api/vendors/${slug}`)
          .then(async (response) => {
            if (!response.ok) {
              throw new Error("Unable to load vendor");
            }

            return response.json();
          })
          .then(setData)
          .catch((err) => {
            console.error("Vendor detail error:", err);
            setError("Unable to load vendor.");
          }),
      )
      .catch(() => {
        setError("Unable to load vendor.");
      });
  }, [params]);

  if (error) {
    return (
      <div className="min-h-screen bg-ivory px-5 pt-40 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-ivory px-5 pt-40 text-center">
        <p>Loading vendor...</p>
      </div>
    );
  }

  const v = data.vendor;

  const portfolioImages = Array.isArray(v.portfolioImages)
    ? v.portfolioImages
    : [];

  const galleryImages = [
    ...(v.profileImage ? [v.profileImage] : []),
    ...portfolioImages,
  ].filter(Boolean);

  const packages: PackageItem[] = Array.isArray(v.packages)
    ? v.packages
    : [];

  return (
    <main className="bg-ivory pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* ========================= */}
        {/* VENDOR IMAGE GALLERY */}
        {/* ========================= */}

        {galleryImages.length > 0 && (
  <div className="space-y-4">
    <div
      className="group relative h-[320px] cursor-zoom-in overflow-hidden rounded-[2rem] bg-black sm:h-[450px] lg:h-[600px]"
      onClick={() => setLightboxOpen(true)}
    >
      <Image
        src={galleryImages[currentImage]}
        alt={`${v.name} portfolio image ${currentImage + 1}`}
        fill
        priority
        className="object-cover transition duration-500 group-hover:scale-[1.02]"
        sizes="100vw"
      />

      {galleryImages.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImage((current) =>
                current === 0
                  ? galleryImages.length - 1
                  : current - 1
              );
            }}
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImage((current) =>
                current === galleryImages.length - 1
                  ? 0
                  : current + 1
              );
            }}
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
            {currentImage + 1} / {galleryImages.length}
          </div>

          <div
            className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {galleryImages.map((_: string, index: number) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to image ${index + 1}`}
                onClick={() => setCurrentImage(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentImage
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>

    {galleryImages.length > 1 && (
      <div className="flex gap-3 overflow-x-auto pb-2">
        {galleryImages.map((img: string, index: number) => (
          <button
            key={`${img}-${index}`}
            type="button"
            onClick={() => setCurrentImage(index)}
            className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-32 ${
              index === currentImage
                ? "border-[#c8a45d] ring-2 ring-[#c8a45d]/20"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={img}
              alt={`${v.name} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="128px"
            />
          </button>
        ))}
      </div>
    )}
  </div>
)}

        {/* ========================= */}
        {/* VENDOR DETAILS */}
        {/* ========================= */}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {v.category}
            </p>

            <h1 className="mt-3 font-display text-5xl">
              {v.name}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-charcoal/55">
              <MapPin size={17} />
              {v.address || v.city}
              {v.address && v.city ? `, ${v.city}` : ""}
            </p>

            {/* Rating / Pricing */}

            <div className="mt-6 flex flex-wrap gap-5 text-sm">

              <span className="flex items-center gap-1">
                <Star
                  className="fill-gold text-gold"
                  size={17}
                />

                <strong>
                  {Number(v.rating || 0).toFixed(1)}
                </strong>

                ({v.reviewCount || 0})
              </span>

              <strong>
                ₹{Number(v.startingPrice || 0).toLocaleString("en-IN")}
                {v.pricingUnit === "per_plate"
                  ? "/plate"
                  : " starting"}
              </strong>
            </div>

            {/* Description */}

            <p className="mt-8 leading-8 text-charcoal/65">
              {v.description}
            </p>

            {/* ========================= */}
            {/* CONTACT */}
            {/* ========================= */}

            <section className="mt-10">
              <h2 className="font-display text-3xl">
                Contact
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                {v.phone && (
                  <a
                    href={`tel:${v.phone}`}
                    className="flex items-center gap-3 rounded-2xl bg-white p-4 transition hover:-translate-y-0.5"
                  >
                    <Phone size={18} className="text-gold" />

                    <div>
                      <p className="text-xs text-charcoal/45">
                        Phone
                      </p>

                      <p className="mt-1 font-medium">
                        {v.phone}
                      </p>
                    </div>
                  </a>
                )}

                {v.email && (
                  <a
                    href={`mailto:${v.email}`}
                    className="flex items-center gap-3 rounded-2xl bg-white p-4 transition hover:-translate-y-0.5"
                  >
                    <Mail size={18} className="text-gold" />

                    <div className="min-w-0">
                      <p className="text-xs text-charcoal/45">
                        Email
                      </p>

                      <p className="mt-1 truncate font-medium">
                        {v.email}
                      </p>
                    </div>
                  </a>
                )}

              </div>
            </section>

            {/* ========================= */}
            {/* PACKAGES */}
            {/* ========================= */}

            {packages.length > 0 && (
              <section className="mt-14">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                  Packages
                </p>

                <h2 className="mt-2 font-display text-3xl">
                  Choose your package
                </h2>

                <div className="mt-6 grid gap-4">
                  {packages.map(
                    (pkg: PackageItem, index: number) => (
                      <div
                        key={`${pkg.name}-${index}`}
                        className="rounded-3xl bg-white p-6"
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {pkg.name}
                            </h3>

                            <p className="mt-2 leading-7 text-charcoal/55">
                              {pkg.description}
                            </p>
                          </div>

                          <strong className="shrink-0 text-lg">
                            ₹
                            {Number(pkg.price || 0).toLocaleString(
                              "en-IN",
                            )}
                          </strong>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}

            {/* ========================= */}
            {/* REVIEWS */}
            {/* ========================= */}

            <section className="mt-14">
              <h2 className="font-display text-3xl">
                Reviews
              </h2>

              <div className="mt-5 space-y-4">
                {data.reviews?.length ? (
                  data.reviews.map((r: any) => (
                    <div
                      key={r._id}
                      className="rounded-2xl bg-white p-5"
                    >
                      <div className="flex justify-between gap-4">
                        <strong>
                          {r.userName}
                        </strong>

                        <span className="flex items-center gap-1 text-sm">
                          <Star
                            size={14}
                            className="fill-gold text-gold"
                          />

                          {r.rating}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-charcoal/60">
                        {r.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-charcoal/50">
                    No reviews yet.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* ========================= */}
          {/* ENQUIRY */}
          {/* ========================= */}

          <div>
            <EnquiryForm
              vendorId={v._id}
              title="Enquire with this vendor"
            />
          </div>

        </div>
      </div>
      {lightboxOpen && galleryImages.length > 0 && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
    onClick={() => setLightboxOpen(false)}
  >
    <button
      type="button"
      aria-label="Close gallery"
      onClick={() => setLightboxOpen(false)}
      className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
    >
      <X size={24} />
    </button>

    {galleryImages.length > 1 && (
      <button
        type="button"
        aria-label="Previous image"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentImage((current) =>
            current === 0
              ? galleryImages.length - 1
              : current - 1
          );
        }}
        className="absolute left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-8"
      >
        <ChevronLeft size={28} />
      </button>
    )}

    <div
      className="relative h-[75vh] w-full max-w-6xl"
      onClick={(e) => e.stopPropagation()}
    >
      <Image
        src={galleryImages[currentImage]}
        alt={`${v.name} portfolio ${currentImage + 1}`}
        fill
        className="object-contain"
        sizes="100vw"
      />
    </div>

    {galleryImages.length > 1 && (
      <button
        type="button"
        aria-label="Next image"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentImage((current) =>
            current === galleryImages.length - 1
              ? 0
              : current + 1
          );
        }}
        className="absolute right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-8"
      >
        <ChevronRight size={28} />
      </button>
    )}

    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-sm">
      {currentImage + 1} / {galleryImages.length}
    </div>
  </div>
)}
    </main>
  );
}