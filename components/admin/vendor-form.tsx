"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
    startingPrice: initial?.startingPrice ?? 150000,
    capacity: initial?.capacity ?? 300,
    venueType: initial?.venueType || "Banquet Hall",
    amenities: initial?.amenities || [],
    rating: initial?.rating ?? 4.5,
    reviewCount: initial?.reviewCount ?? 0,
    featured: initial?.featured ?? false,
    status: initial?.status || "active",
    youtubeVideos: initial?.youtubeVideos || [],
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

  async function uploadImages(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to upload image.");
        }

        uploadedUrls.push(data.url);
      }

      update("images", [...f.images, ...uploadedUrls]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload image."
      );
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    update(
      "images",
      f.images.filter((_: string, i: number) => i !== index)
    );
  }

  function addYoutubeVideo() {
    update("youtubeVideos", [
      ...f.youtubeVideos,
      {
        title: "",
        url: "",
      },
    ]);
  }

  function updateYoutubeVideo(
    index: number,
    key: keyof YoutubeVideo,
    value: string
  ) {
    const updated = [...f.youtubeVideos];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    update("youtubeVideos", updated);
  }

  function removeYoutubeVideo(index: number) {
    update(
      "youtubeVideos",
      f.youtubeVideos.filter(
        (_: YoutubeVideo, i: number) => i !== index
      )
    );
  }

  function getYoutubeEmbedUrl(url: string) {
    try {
      const parsed = new URL(url);

      if (parsed.hostname === "youtu.be") {
        const id = parsed.pathname.slice(1);

        if (id) {
          return `https://www.youtube.com/embed/${id}`;
        }
      }

      if (
        parsed.hostname.includes("youtube.com") &&
        parsed.searchParams.get("v")
      ) {
        return `https://www.youtube.com/embed/${parsed.searchParams.get(
          "v"
        )}`;
      }

      if (
        parsed.hostname.includes("youtube.com") &&
        parsed.pathname.startsWith("/embed/")
      ) {
        return url;
      }

      return "";
    } catch {
      return "";
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const youtubeVideos = f.youtubeVideos
        .map((video: YoutubeVideo) => ({
          title: video.title.trim(),
          url: video.url.trim(),
        }))
        .filter(
          (video: YoutubeVideo) =>
            video.title && video.url
        );

      for (const video of youtubeVideos) {
        if (!getYoutubeEmbedUrl(video.url)) {
          throw new Error(
            `Invalid YouTube URL for "${video.title}".`
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
        youtubeVideos,
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
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to save venue"
        );
      }

      router.push("/admin/venues");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save venue"
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
      <Card className="p-6">
        <div className="grid gap-5 md:grid-cols-2">
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
              className={input}
              value={f.startingPrice}
              onChange={(e) =>
                update(
                  "startingPrice",
                  e.target.value
                )
              }
              required
            />
          </label>

          <label className="text-sm font-medium">
            Capacity

            <input
              type="number"
              className={input}
              value={f.capacity}
              onChange={(e) =>
                update(
                  "capacity",
                  e.target.value
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
                  e.target.value
                )
              }
              required
            />
          </label>
        </div>
      </Card>

      {/* IMAGE UPLOAD */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">
              Venue photos
            </h2>

            <p className="mt-1 text-sm text-black/50">
              Upload venue photos directly to Cloudinary.
            </p>
          </div>

          <label className="cursor-pointer rounded-xl bg-[#c8a45d] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            {uploading
              ? "Uploading..."
              : "Upload images"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                uploadImages(e.target.files);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>

        {f.images.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {f.images.map(
              (image: string, index: number) => (
                <div
                  key={`${image}-${index}`}
                  className="group relative overflow-hidden rounded-2xl border border-black/10 bg-black/5"
                >
                  <img
                    src={image}
                    alt={`Venue ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-black/15 p-10 text-center text-sm text-black/45">
            No venue photos uploaded yet.
          </div>
        )}
      </Card>

      {/* YOUTUBE VIDEOS */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">
              Wedding videos & highlights
            </h2>

            <p className="mt-1 text-sm text-black/50">
              Add YouTube videos showing weddings,
              parties, decor or venue highlights.
            </p>
          </div>

          <button
            type="button"
            onClick={addYoutubeVideo}
            className="rounded-xl border border-[#c8a45d] px-4 py-2.5 text-sm font-semibold text-[#a47f36] transition hover:bg-[#c8a45d] hover:text-white"
          >
            + Add video
          </button>
        </div>

        {f.youtubeVideos.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-black/15 p-8 text-center text-sm text-black/45">
            No YouTube videos added yet.
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {f.youtubeVideos.map(
              (
                video: YoutubeVideo,
                index: number
              ) => {
                const embedUrl =
                  getYoutubeEmbedUrl(
                    video.url
                  );

                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-black/10 bg-white p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold">
                        Video {index + 1}
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          removeYoutubeVideo(index)
                        }
                        className="text-sm font-medium text-red-600"
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
                              e.target.value
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
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>

                    {embedUrl && (
                      <div className="mt-5 overflow-hidden rounded-2xl bg-black">
                        <div className="aspect-video">
                          <iframe
                            src={embedUrl}
                            title={
                              video.title ||
                              `YouTube video ${index + 1}`
                            }
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </Card>

      {/* VENUE SETTINGS */}
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
                  e.target.value
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
                  amenity
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
                          (item: string) =>
                            item !== amenity
                        )
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
                e.target.checked
              )
            }
          />

          Featured venue
        </label>
      </Card>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

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
          className="rounded-xl bg-[#c8a45d] px-6 py-3 font-semibold text-white disabled:opacity-60"
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