"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Star,
  Users,
  Play,
} from "lucide-react";

import { EnquiryForm } from "@/components/marketplace/enquiry-form";

type YoutubeVideo = {
  title: string;
  url: string;
};

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (
      parsed.hostname === "youtu.be" ||
      parsed.hostname === "www.youtu.be"
    ) {
      const videoId = parsed.pathname.slice(1).split("/")[0];

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : "";
    }

    const videoId = parsed.searchParams.get("v");

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (parsed.pathname.startsWith("/shorts/")) {
      const videoId = parsed.pathname
        .split("/")[2]
        ?.split("/")[0];

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : "";
    }

    if (parsed.pathname.startsWith("/embed/")) {
      return `https://www.youtube.com${parsed.pathname}`;
    }

    return "";
  } catch {
    return "";
  }
}

export default function VenueDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [data, setData] = useState<any>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    params.then(({ slug }) =>
      fetch(`/api/venues/${slug}`, {
        cache: "no-store",
      })
        .then((r) => (r.ok ? r.json() : null))
        .then(setData)
        .catch(() => setData(null)),
    );
  }, [params]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (!data) {
    return (
      <div className="min-h-screen bg-ivory px-5 pt-40 text-center">
        <p>Loading venue...</p>
      </div>
    );
  }

  const v = data.venue;

  const images: string[] =
    Array.isArray(v.images) && v.images.length
      ? v.images
      : [];

  const reviews: any[] =
    Array.isArray(data.reviews)
      ? data.reviews
      : [];

  const youtubeVideos: YoutubeVideo[] =
    Array.isArray(v.youtubeVideos)
      ? v.youtubeVideos
      : [];

  const safeActiveImage =
    images.length > 0
      ? Math.min(activeImage, images.length - 1)
      : 0;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) => sum + Number(review.rating || 0),
          0,
        ) / reviews.length
      : Number(v.rating || 0);

  function nextImage() {
    if (!images.length) return;

    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  function previousImage() {
    if (!images.length) return;

    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function openLightbox(index: number) {
    setActiveImage(index);
    setLightboxOpen(true);
  }

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!reviewName.trim()) {
      setReviewMessage("Please enter your name.");
      return;
    }

    if (!reviewRating) {
      setReviewMessage("Please select a rating.");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewMessage("Please write your review.");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewMessage("");

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
          venue: v._id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to submit review.",
        );
      }

      setReviewName("");
      setReviewComment("");
      setReviewRating(0);
      setHoverRating(0);

      setData((current: any) => ({
        ...current,
        reviews: [
          result.review,
          ...(current.reviews || []),
        ],
      }));

      setReviewMessage(
        "Thank you! Your review is now live.",
      );
    } catch (error) {
      console.error("Review submission error:", error);

      setReviewMessage(
        error instanceof Error
          ? error.message
          : "Could not submit your review.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <main className="bg-ivory pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* IMAGE CAROUSEL */}
        <section className="relative">
          <div className="relative h-[300px] overflow-hidden rounded-3xl bg-black sm:h-[450px] lg:h-[560px]">
            {images.length > 0 ? (
              <button
                type="button"
                onClick={() => openLightbox(safeActiveImage)}
                className="relative h-full w-full cursor-zoom-in"
                aria-label="Open venue image fullscreen"
              >
                <Image
                  src={images[safeActiveImage]}
                  alt={`${v.name} photo ${
                    safeActiveImage + 1
                  }`}
                  fill
                  priority
                  className="object-cover transition duration-500"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </button>
            ) : (
              <div className="flex h-full items-center justify-center text-white/60">
                No venue images available
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
                >
                  <ChevronLeft size={23} />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
                >
                  <ChevronRight size={23} />
                </button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 backdrop-blur">
                  {images.map(
                    (_: string, index: number) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        aria-label={`Go to image ${
                          index + 1
                        }`}
                        className={`h-2 rounded-full transition-all ${
                          index === safeActiveImage
                            ? "w-6 bg-white"
                            : "w-2 bg-white/50"
                        }`}
                      />
                    ),
                  )}
                </div>
              </>
            )}
          </div>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map(
                (img: string, index: number) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-32 ${
                      index === safeActiveImage
                        ? "border-gold"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${v.name} thumbnail ${
                        index + 1
                      }`}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </button>
                ),
              )}
            </div>
          )}
        </section>

        {/* FULLSCREEN LIGHTBOX */}
        {lightboxOpen && images.length > 0 && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close fullscreen image"
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <X size={24} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    previousImage();
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:left-8"
                >
                  <ChevronLeft size={28} />
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:right-8"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <div
              className="relative h-[80vh] w-full max-w-6xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <Image
                src={images[safeActiveImage]}
                alt={`${v.name} fullscreen photo ${
                  safeActiveImage + 1
                }`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur">
              {safeActiveImage + 1} / {images.length}
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">

          <div>

            {/* BASIC INFO */}

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {v.venueType}
            </p>

            <h1 className="mt-3 font-display text-5xl">
              {v.name}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-charcoal/55">
              <MapPin size={17} />
              {v.location}, {v.city}
            </p>

            <div className="mt-6 flex flex-wrap gap-5 text-sm">

              <span className="flex items-center gap-1">
                <Star
                  className="fill-gold text-gold"
                  size={17}
                />

                <strong>
                  {averageRating
                    ? averageRating.toFixed(1)
                    : "0.0"}
                </strong>

                ({reviews.length})
              </span>

              <span className="flex items-center gap-1">
                <Users size={17} />

                {v.capacity} guests
              </span>

              <strong>
                ₹
                {v.startingPrice.toLocaleString(
                  "en-IN",
                )}{" "}
                starting
              </strong>

            </div>

            <p className="mt-8 leading-8 text-charcoal/65">
              {v.description}
            </p>

            {/* AMENITIES */}

            <h2 className="mt-10 font-display text-3xl">
              Amenities
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {v.amenities.map(
                (a: string) => (
                  <span
                    key={a}
                    className="rounded-full bg-white px-4 py-2 text-sm"
                  >
                    {a}
                  </span>
                ),
              )}
            </div>

            {/* YOUTUBE VIDEOS */}

            {youtubeVideos.length > 0 && (
              <section className="mt-14">

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                  Wedding Events & Highlights
                </p>

                <h2 className="mt-2 font-display text-3xl">
                  See this venue in action
                </h2>

                <p className="mt-2 max-w-2xl leading-7 text-charcoal/55">
                  Watch real wedding celebrations,
                  receptions, sangeet nights and other
                  events hosted at this venue.
                </p>

                <div className="mt-7 space-y-8">

                  {youtubeVideos.map(
                    (
                      video: YoutubeVideo,
                      index: number,
                    ) => {
                      const embedUrl =
                        getYoutubeEmbedUrl(
                          video.url,
                        );

                      if (!embedUrl) {
                        return null;
                      }

                      return (
                        <div
                          key={`${video.url}-${index}`}
                          className="overflow-hidden rounded-3xl bg-white shadow-sm"
                        >

                          <div className="aspect-video bg-black">
                            <iframe
                              src={embedUrl}
                              title={video.title}
                              className="h-full w-full"
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>

                          <div className="flex items-center gap-3 px-5 py-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c8a45d]/15">
                              <Play
                                size={17}
                                className="fill-[#c8a45d] text-[#c8a45d]"
                              />
                            </div>

                            <div>
                              <h3 className="font-semibold">
                                {video.title}
                              </h3>

                              <p className="mt-0.5 text-xs text-charcoal/45">
                                Wedding event highlight
                              </p>
                            </div>

                          </div>

                        </div>
                      );
                    },
                  )}

                </div>
              </section>
            )}

            {/* REVIEWS */}

            <section className="mt-14">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                    Guest Experiences
                  </p>

                  <h2 className="mt-2 font-display text-3xl">
                    Reviews
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Star
                    size={17}
                    className="fill-gold text-gold"
                  />

                  <strong>
                    {averageRating
                      ? averageRating.toFixed(1)
                      : "0.0"}
                  </strong>

                  <span className="text-charcoal/45">
                    ({reviews.length} reviews)
                  </span>
                </div>

              </div>

              <div className="mt-5 space-y-4">

                {reviews.length ? (
                  reviews.map((r: any) => (
                    <div
                      key={r._id}
                      className="rounded-2xl bg-white p-5"
                    >
                      <div className="flex items-start justify-between gap-4">

                        <strong>
                          {r.userName}
                        </strong>

                        <span className="flex shrink-0 items-center gap-1 text-sm text-gold">
                          <Star
                            size={14}
                            className="fill-gold"
                          />

                          {r.rating}
                        </span>

                      </div>

                      <div className="mt-2 text-sm text-gold">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(
                          5 - r.rating,
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-charcoal/60">
                        {r.comment}
                      </p>

                      <p className="mt-2 text-xs text-charcoal/35">
                        {new Date(
                          r.createdAt || r.date,
                        ).toLocaleDateString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-white p-5 text-charcoal/50">
                    No reviews yet. Be the first to
                    share your experience.
                  </p>
                )}

              </div>

              {/* REVIEW FORM */}

              <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                  Share your experience
                </p>

                <h3 className="mt-2 font-display text-2xl">
                  Leave a review
                </h3>

                <form
                  onSubmit={submitReview}
                  className="mt-6 space-y-5"
                >

                  <div>
                    <label
                      htmlFor="review-name"
                      className="mb-2 block text-sm font-medium"
                    >
                      Your name
                    </label>

                    <input
                      id="review-name"
                      type="text"
                      value={reviewName}
                      onChange={(e) =>
                        setReviewName(e.target.value)
                      }
                      placeholder="Enter your name"
                      maxLength={100}
                      className="w-full rounded-xl border border-black/10 bg-ivory px-4 py-3 text-sm outline-none transition focus:border-[#c8a45d]"
                    />
                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Your rating
                    </label>

                    <div className="flex gap-1">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() =>
                              setHoverRating(star)
                            }
                            onMouseLeave={() =>
                              setHoverRating(0)
                            }
                            onClick={() =>
                              setReviewRating(star)
                            }
                            aria-label={`${star} star`}
                            className="p-1"
                          >
                            <Star
                              size={26}
                              className={`transition ${
                                star <=
                                (hoverRating ||
                                  reviewRating)
                                  ? "fill-[#c8a45d] text-[#c8a45d]"
                                  : "text-black/20"
                              }`}
                            />
                          </button>
                        ),
                      )}

                    </div>

                  </div>

                  <div>
                    <label
                      htmlFor="review-comment"
                      className="mb-2 block text-sm font-medium"
                    >
                      Your review
                    </label>

                    <textarea
                      id="review-comment"
                      value={reviewComment}
                      onChange={(e) =>
                        setReviewComment(
                          e.target.value,
                        )
                      }
                      placeholder="Tell us about your experience..."
                      maxLength={2000}
                      rows={5}
                      className="w-full resize-none rounded-xl border border-black/10 bg-ivory px-4 py-3 text-sm outline-none transition focus:border-[#c8a45d]"
                    />
                  </div>

                  {reviewMessage && (
                    <p
                      className={`text-sm ${
                        reviewMessage.includes(
                          "successfully",
                        ) ||
                        reviewMessage.includes(
                          "now live",
                        )
                          ? "text-green-700"
                          : "text-red-600"
                      }`}
                    >
                      {reviewMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {reviewSubmitting
                      ? "Submitting..."
                      : "Submit review"}
                  </button>

                </form>
              </div>

            </section>

          </div>

          {/* ENQUIRY FORM */}

          <div>
            <EnquiryForm
              venueId={v._id}
              title="Book a venue visit"
            />
          </div>

        </div>
      </div>
    </main>
  );
}
