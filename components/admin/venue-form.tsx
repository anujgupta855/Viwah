"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Card } from "./admin-shell";

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

const types = [
  "Banquet Hall",
  "Wedding Lawn",
  "Resort",
  "Hotel",
  "Farmhouse",
  "Palace",
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

type YoutubeVideo = {
  title: string;
  url: string;
};

export default function VenueForm({
  initial,
  id,
}: {
  initial?: any;
  id?: string;
}) {
  const router = useRouter();

  const [f, setF] = useState({
    name: initial?.name || "",
    city: initial?.city || "Delhi",
    location: initial?.location || "Mehrauli, New Delhi",
    description: initial?.description || "",

    images: initial?.images || [],

    youtubeVideos:
      initial?.youtubeVideos || ([] as YoutubeVideo[]),

    startingPrice: initial?.startingPrice ?? 150000,
    capacity: initial?.capacity ?? 300,
    venueType: initial?.venueType || "Banquet Hall",

    amenities: initial?.amenities || [],

    rating: initial?.rating ?? 4.5,
    reviewCount: initial?.reviewCount ?? 0,
    featured: initial?.featured ?? false,
    status: initial?.status || "active",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const update = (key: string, value: any) => {
    setF((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const input =
    "mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#c8a45d]";

  // =========================
  // CLOUDINARY IMAGE UPLOAD
  // =========================

  async function uploadImages(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          throw new Error(
            `${file.name} is not an image file.`,
          );
        }

        if (file.size > 10 * 1024 * 1024) {
          throw new Error(
            `${file.name} is larger than 10MB.`,
          );
        }

        const formData = new FormData();

        formData.append("file", file);

        // IMPORTANT:
        // Tells API this upload belongs to a venue.
        formData.append("type", "venue");

        const response = await fetch(
          "/api/admin/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Image upload failed.",
          );
        }

        uploadedUrls.push(data.url);
      }

      setF((current) => ({
        ...current,
        images: [
          ...current.images,
          ...uploadedUrls,
        ],
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload image.",
      );
    } finally {
      setUploading(false);

      // Allows selecting the same file again later.
      event.target.value = "";
    }
  }

  function removeImage(index: number) {
    setF((current) => ({
      ...current,
      images: current.images.filter(
        (_: string, i: number) => i !== index,
      ),
    }));
  }

  // =========================
  // YOUTUBE VIDEOS
  // =========================

  function addYoutubeVideo() {
    setF((current) => ({
      ...current,
      youtubeVideos: [
        ...current.youtubeVideos,
        {
          title: "",
          url: "",
        },
      ],
    }));
  }

  function updateYoutubeVideo(
    index: number,
    key: keyof YoutubeVideo,
    value: string,
  ) {
    setF((current) => ({
      ...current,
      youtubeVideos: current.youtubeVideos.map(
        (video: YoutubeVideo, i: number) =>
          i === index
            ? {
                ...video,
                [key]: value,
              }
            : video,
      ),
    }));
  }

  function removeYoutubeVideo(index: number) {
    setF((current) => ({
      ...current,
      youtubeVideos:
        current.youtubeVideos.filter(
          (_: YoutubeVideo, i: number) =>
            i !== index,
        ),
    }));
  }

  function isValidYoutubeUrl(url: string) {
    if (!url.trim()) return false;

    try {
      const parsed = new URL(url);

      return (
        parsed.hostname === "youtube.com" ||
        parsed.hostname === "www.youtube.com" ||
        parsed.hostname === "youtu.be" ||
        parsed.hostname === "www.youtu.be"
      );
    } catch {
      return false;
    }
  }

  // =========================
  // SAVE VENUE
  // =========================

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      for (const video of f.youtubeVideos) {
        if (!video.title.trim()) {
          throw new Error(
            "Please enter a title for every YouTube video.",
          );
        }

        if (!isValidYoutubeUrl(video.url)) {
          throw new Error(
            `Invalid YouTube URL for "${video.title}".`,
          );
        }
      }

      const payload = {
        ...f,

        startingPrice: Number(f.startingPrice),
        capacity: Number(f.capacity),
        rating: Number(f.rating),
        reviewCount: Number(f.reviewCount),

        images: f.images.filter(Boolean),

        youtubeVideos: f.youtubeVideos
          .map((video: YoutubeVideo) => ({
            title: video.title.trim(),
            url: video.url.trim(),
          }))
          .filter(
            (video: YoutubeVideo) =>
              video.title && video.url,
          ),
      };

      const response = await fetch(
        id
          ? `/api/admin/venues/${id}`
          : "/api/admin/venues",
        {
          method: id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to save venue.",
        );
      }

      router.push("/admin/venues");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save venue.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-6"
    >
      {/* ================================
          BASIC VENUE INFORMATION
      ================================= */}

      <Card className="p-6">
        <h2 className="font-serif text-2xl">
          Venue information
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium">
            Venue name

            <input
              className={input}
              value={f.name}
              onChange={(e) =>
                update("name", e.target.value)
              }
              required
            />
          </label>

          <label className="text-sm font-medium">
            City

            <select
              className={input}
              value={f.city}
              onChange={(e) =>
                update("city", e.target.value)
              }
            >
              {cities.map((city) => (
                <option key={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium">
            Location

            <input
              className={input}
              value={f.location}
              onChange={(e) =>
                update("location", e.target.value)
              }
              required
            />
          </label>

          <label className="text-sm font-medium">
            Venue type

            <select
              className={input}
              value={f.venueType}
              onChange={(e) =>
                update("venueType", e.target.value)
              }
            >
              {types.map((type) => (
                <option key={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium">
            Starting price

            <input
              type="number"
              min="0"
              className={input}
              value={f.startingPrice}
              onChange={(e) =>
                update(
                  "startingPrice",
                  e.target.value,
                )
              }
              required
            />
          </label>

          <label className="text-sm font-medium">
            Capacity

            <input
              type="number"
              min="1"
              className={input}
              value={f.capacity}
              onChange={(e) =>
                update(
                  "capacity",
                  e.target.value,
                )
              }
              required
            />
          </label>

          <label className="text-sm font-medium md:col-span-2">
            Description

            <textarea
              className={input}
              rows={4}
              value={f.description}
              onChange={(e) =>
                update(
                  "description",
                  e.target.value,
                )
              }
              required
            />
          </label>
        </div>
      </Card>

      {/* ================================
          CLOUDINARY PHOTOS
      ================================= */}

      <Card className="p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl">
              Venue photos
            </h2>

            <p className="mt-1 text-sm text-black/50">
              Upload high-quality venue photos.
              Images are securely stored on
              Cloudinary.
            </p>
          </div>

          <label
            className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-5 py-3 font-semibold text-white transition ${
              uploading
                ? "cursor-not-allowed bg-black/30"
                : "bg-[#c8a45d] hover:opacity-90"
            }`}
          >
            {uploading
              ? "Uploading..."
              : "+ Upload photos"}

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={uploadImages}
            />
          </label>
        </div>

        {f.images.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {f.images.map(
              (image: string, index: number) => (
                <div
                  key={`${image}-${index}`}
                  className="group relative overflow-hidden rounded-2xl border bg-black/5"
                >
                  <img
                    src={image}
                    alt={`Venue photo ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="absolute right-2 top-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Remove
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black">
                      Cover photo
                    </span>
                  )}
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-black/[0.02] px-6 py-12 text-center">
            <p className="font-medium">
              No photos uploaded yet
            </p>

            <p className="mt-1 text-sm text-black/45">
              Click “Upload photos” to add venue
              images.
            </p>
          </div>
        )}
      </Card>

      {/* ================================
          YOUTUBE VIDEOS
      ================================= */}

      <Card className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl">
              Wedding Events & Highlights
            </h2>

            <p className="mt-1 text-sm text-black/50">
              Add YouTube videos of weddings,
              receptions, sangeet nights and
              other venue events.
            </p>
          </div>

          <button
            type="button"
            onClick={addYoutubeVideo}
            className="rounded-xl border border-[#c8a45d] px-5 py-3 font-semibold text-[#9d7b35] transition hover:bg-[#c8a45d]/10"
          >
            + Add video
          </button>
        </div>

        {f.youtubeVideos.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-black/[0.02] px-6 py-10 text-center">
            <p className="font-medium">
              No YouTube videos added
            </p>

            <p className="mt-1 text-sm text-black/45">
              Add videos to showcase real events
              hosted at this venue.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {f.youtubeVideos.map(
              (
                video: YoutubeVideo,
                index: number,
              ) => (
                <div
                  key={index}
                  className="rounded-2xl border border-black/10 bg-black/[0.02] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">
                      Video {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        removeYoutubeVideo(index)
                      }
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-medium">
                      Video title

                      <input
                        className={input}
                        placeholder="Wedding Reception Highlights"
                        value={video.title}
                        onChange={(e) =>
                          updateYoutubeVideo(
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                      />
                    </label>

                    <label className="text-sm font-medium">
                      YouTube URL

                      <input
                        type="url"
                        className={input}
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={video.url}
                        onChange={(e) =>
                          updateYoutubeVideo(
                            index,
                            "url",
                            e.target.value,
                          )
                        }
                      />
                    </label>
                  </div>

                  {video.url &&
                    isValidYoutubeUrl(video.url) && (
                      <div className="mt-5 overflow-hidden rounded-2xl bg-black">
                        <div className="aspect-video">
                          <iframe
                            src={getYoutubeEmbedUrl(
                              video.url,
                            )}
                            title={
                              video.title ||
                              `YouTube video ${
                                index + 1
                              }`
                            }
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                </div>
              ),
            )}
          </div>
        )}
      </Card>

      {/* ================================
          VENUE SETTINGS
      ================================= */}

      <Card className="p-6">
        <h2 className="font-serif text-2xl">
          Venue settings
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <label className="text-sm font-medium">
            Rating

            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              className={input}
              value={f.rating}
              onChange={(e) =>
                update("rating", e.target.value)
              }
            />
          </label>

          <label className="text-sm font-medium">
            Review count

            <input
              type="number"
              min="0"
              className={input}
              value={f.reviewCount}
              onChange={(e) =>
                update(
                  "reviewCount",
                  e.target.value,
                )
              }
            />
          </label>

          <label className="text-sm font-medium">
            Status

            <select
              className={input}
              value={f.status}
              onChange={(e) =>
                update("status", e.target.value)
              }
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {amenities.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={f.amenities.includes(
                  amenity,
                )}
                onChange={(e) =>
                  update(
                    "amenities",
                    e.target.checked
                      ? [
                          ...f.amenities,
                          amenity,
                        ]
                      : f.amenities.filter(
                          (x: string) =>
                            x !== amenity,
                        ),
                  )
                }
              />

              {amenity}
            </label>
          ))}
        </div>

        <label className="mt-5 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={f.featured}
            onChange={(e) =>
              update(
                "featured",
                e.target.checked,
              )
            }
          />

          Featured venue
        </label>
      </Card>

      {/* ================================
          ERROR
      ================================= */}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* ================================
          ACTIONS
      ================================= */}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border px-5 py-3"
        >
          Cancel
        </button>

        <button
          disabled={saving || uploading}
          className="rounded-xl bg-[#c8a45d] px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : id
              ? "Save changes"
              : "Create venue"}
        </button>
      </div>
    </form>
  );
}

// =================================
// YOUTUBE EMBED URL HELPER
// =================================

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);

    // youtu.be/VIDEO_ID
    if (
      parsed.hostname === "youtu.be" ||
      parsed.hostname === "www.youtu.be"
    ) {
      const videoId =
        parsed.pathname.slice(1);

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : "";
    }

    // youtube.com/watch?v=VIDEO_ID
    const videoId =
      parsed.searchParams.get("v");

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // youtube.com/shorts/VIDEO_ID
    if (
      parsed.pathname.startsWith("/shorts/")
    ) {
      const shortId = parsed.pathname
        .split("/")[2]
        ?.split("/")[0];

      return shortId
        ? `https://www.youtube.com/embed/${shortId}`
        : "";
    }

    // youtube.com/embed/VIDEO_ID
    if (
      parsed.pathname.startsWith("/embed/")
    ) {
      return `https://www.youtube.com${parsed.pathname}`;
    }

    return "";
  } catch {
    return "";
  }
}