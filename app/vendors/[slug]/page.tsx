"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
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

    // https://youtu.be/VIDEO_ID
    if (
      parsed.hostname === "youtu.be" ||
      parsed.hostname === "www.youtu.be"
    ) {
      const videoId = parsed.pathname.slice(1).split("/")[0];

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : "";
    }

    // https://youtube.com/watch?v=VIDEO_ID
    // https://www.youtube.com/watch?v=VIDEO_ID
    const videoId = parsed.searchParams.get("v");

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // https://youtube.com/shorts/VIDEO_ID
    if (parsed.pathname.startsWith("/shorts/")) {
      const videoId = parsed.pathname
        .split("/")[2]
        ?.split("/")[0];

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : "";
    }

    // Already an embed URL
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

  useEffect(() => {
    params
      .then(({ slug }) =>
        fetch(`/api/venues/${slug}`)
          .then((r) => (r.ok ? r.json() : null))
          .then(setData),
      );
  }, [params]);

  if (!data) {
    return (
      <div className="min-h-screen bg-ivory px-5 pt-40 text-center">
        <p>Loading venue...</p>
      </div>
    );
  }

  const v = data.venue;

  const youtubeVideos: YoutubeVideo[] =
    Array.isArray(v.youtubeVideos)
      ? v.youtubeVideos
      : [];

  return (
    <main className="bg-ivory pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* ========================= */}
        {/* VENUE IMAGE GALLERY */}
        {/* ========================= */}

        <div className="grid gap-3 md:grid-cols-3">
          {v.images.map(
            (img: string, i: number) => (
              <div
                key={`${img}-${i}`}
                className={`relative overflow-hidden rounded-3xl ${
                  i === 0
                    ? "md:col-span-2 md:row-span-2 md:min-h-[560px]"
                    : "min-h-[270px]"
                }`}
              >
                <Image
                  src={img}
                  alt={`${v.name} photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ),
          )}
        </div>

        {/* ========================= */}
        {/* VENUE DETAILS */}
        {/* ========================= */}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">

          <div>

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
                  {v.rating.toFixed(1)}
                </strong>

                ({v.reviewCount})
              </span>

              <span className="flex items-center gap-1">
                <Users size={17} />

                {v.capacity} guests
              </span>

              <strong>
                ₹{v.startingPrice.toLocaleString("en-IN")}{" "}
                starting
              </strong>
            </div>

            <p className="mt-8 leading-8 text-charcoal/65">
              {v.description}
            </p>

            {/* ========================= */}
            {/* AMENITIES */}
            {/* ========================= */}

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

            {/* ========================= */}
            {/* YOUTUBE EVENTS */}
            {/* ========================= */}

            {youtubeVideos.length > 0 && (
              <section className="mt-14">
                <div className="mb-6">
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
                </div>

                <div className="space-y-8">
                  {youtubeVideos.map(
                    (
                      video: YoutubeVideo,
                      index: number,
                    ) => {
                      const embedUrl =
                        getYoutubeEmbedUrl(video.url);

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

            {/* ========================= */}
            {/* REVIEWS */}
            {/* ========================= */}

            <h2 className="mt-14 font-display text-3xl">
              Reviews
            </h2>

            <div className="mt-5 space-y-4">
              {data.reviews.length ? (
                data.reviews.map(
                  (r: any) => (
                    <div
                      key={r._id}
                      className="rounded-2xl bg-white p-5"
                    >
                      <div className="flex justify-between">
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
                  ),
                )
              ) : (
                <p className="text-charcoal/50">
                  No reviews yet.
                </p>
              )}
            </div>

          </div>

          {/* ========================= */}
          {/* ENQUIRY */}
          {/* ========================= */}

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