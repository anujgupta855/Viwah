"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "./admin-shell";

const categories = [
  "Photographer",
  "Makeup Artist",
  "Decorator",
  "Caterer",
  "Mehendi Artist",
  "DJ",
];

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

type UploadImage = {
  url: string;
  publicId?: string;
};

export default function VendorForm({
  initial,
  id,
}: {
  initial?: any;
  id?: string;
}) {
  const router = useRouter();

  const [f, setF] = useState({
    name: initial?.name || "",
    category: initial?.category || "Photographer",
    city: initial?.city || "Delhi",
    description: initial?.description || "",
    profileImage: initial?.profileImage || "",
    portfolioImages: initial?.portfolioImages || [],
    startingPrice: initial?.startingPrice ?? 50000,
    pricingUnit: initial?.pricingUnit || "package",
    phone: initial?.phone || "+91 9800000000",
    email: initial?.email || "hello@viwah.example.com",
    address: initial?.address || "Delhi Wedding District, Delhi",
    rating: initial?.rating ?? 4.5,
    reviewCount: initial?.reviewCount ?? 0,
    featured: initial?.featured ?? false,
    status: initial?.status || "active",
    packages: JSON.stringify(
      initial?.packages || [
        {
          name: "Essential",
          price: 50000,
          description:
            "Focused coverage for intimate celebrations.",
        },
      ],
      null,
      2,
    ),
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] =
    useState(false);

  const update = (key: string, value: any) => {
    setF((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const input =
    "mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#c8a45d]";

  async function uploadImage(
    file: File,
    type: "profile" | "portfolio",
  ) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed.");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Image must be smaller than 10MB.");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("type", "vendor");

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to upload image.",
      );
    }

    if (type === "profile") {
      update("profileImage", data.url);
    } else {
      update("portfolioImages", [
        ...f.portfolioImages,
        data.url,
      ]);
    }
  }

  async function handleProfileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploadingProfile(true);
    setError("");

    try {
      await uploadImage(file, "profile");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload image.",
      );
    } finally {
      setUploadingProfile(false);
      e.target.value = "";
    }
  }

  async function handlePortfolioUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setUploadingPortfolio(true);
    setError("");

    try {
      for (const file of files) {
        await uploadImage(file, "portfolio");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload image.",
      );
    } finally {
      setUploadingPortfolio(false);
      e.target.value = "";
    }
  }

  function removePortfolioImage(index: number) {
    update(
      "portfolioImages",
      f.portfolioImages.filter(
        (_: string, i: number) => i !== index,
      ),
    );
  }

  async function submit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      let packages = [];

      try {
        packages = JSON.parse(f.packages);
      } catch {
        throw new Error("Packages must be valid JSON.");
      }

      const payload = {
        ...f,
        startingPrice: Number(f.startingPrice),
        rating: Number(f.rating),
        reviewCount: Number(f.reviewCount),
        portfolioImages: f.portfolioImages,
        packages,
      };

      const response = await fetch(
        id
          ? `/api/admin/vendors/${id}`
          : "/api/admin/vendors",
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
          data.error || "Unable to save vendor",
        );
      }

      router.push("/admin/vendors");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save vendor",
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
        <h2 className="font-serif text-2xl">
          Vendor information
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium">
            Vendor name
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
            Category
            <select
              className={input}
              value={f.category}
              onChange={(e) =>
                update("category", e.target.value)
              }
            >
              {categories.map((category) => (
                <option key={category}>
                  {category}
                </option>
              ))}
            </select>
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
            Pricing unit
            <select
              className={input}
              value={f.pricingUnit}
              onChange={(e) =>
                update(
                  "pricingUnit",
                  e.target.value,
                )
              }
            >
              <option value="package">
                Package
              </option>
              <option value="per_plate">
                Per plate (caterer)
              </option>
            </select>
          </label>

          <label className="text-sm font-medium">
            Phone
            <input
              className={input}
              value={f.phone}
              onChange={(e) =>
                update("phone", e.target.value)
              }
              required
            />
          </label>

          <label className="text-sm font-medium">
            Email
            <input
              type="email"
              className={input}
              value={f.email}
              onChange={(e) =>
                update("email", e.target.value)
              }
              required
            />
          </label>

          <label className="text-sm font-medium">
            Address
            <input
              className={input}
              value={f.address}
              onChange={(e) =>
                update("address", e.target.value)
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

      <Card className="p-6">
        <h2 className="font-serif text-2xl">
          Vendor images
        </h2>

        <div className="mt-5">
          <p className="text-sm font-medium">
            Profile image
          </p>

          {f.profileImage && (
            <div className="mt-3 overflow-hidden rounded-2xl border bg-black/5">
              <img
                src={f.profileImage}
                alt="Vendor profile"
                className="h-56 w-full object-cover"
              />
            </div>
          )}

          <label className="mt-4 inline-flex cursor-pointer items-center rounded-xl border border-[#c8a45d] px-5 py-3 font-medium text-[#8d6c2d] hover:bg-[#c8a45d]/10">
            {uploadingProfile
              ? "Uploading..."
              : f.profileImage
                ? "Replace profile image"
                : "Upload profile image"}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileUpload}
              disabled={uploadingProfile}
            />
          </label>
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium">
            Portfolio images
          </p>

          <p className="mt-1 text-sm text-black/45">
            You can select multiple images at once.
          </p>

          {f.portfolioImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {f.portfolioImages.map(
                (image: string, index: number) => (
                  <div
                    key={`${image}-${index}`}
                    className="group relative overflow-hidden rounded-2xl border"
                  >
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="h-40 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removePortfolioImage(index)
                      }
                      className="absolute right-2 top-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Remove
                    </button>
                  </div>
                ),
              )}
            </div>
          )}

          <label className="mt-4 inline-flex cursor-pointer items-center rounded-xl border border-[#c8a45d] px-5 py-3 font-medium text-[#8d6c2d] hover:bg-[#c8a45d]/10">
            {uploadingPortfolio
              ? "Uploading..."
              : "Upload portfolio images"}

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePortfolioUpload}
              disabled={uploadingPortfolio}
            />
          </label>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-serif text-2xl">
          Packages & marketplace settings
        </h2>

        <label className="mt-4 block text-sm font-medium">
          Packages JSON
          <textarea
            className={input}
            rows={9}
            value={f.packages}
            onChange={(e) =>
              update("packages", e.target.value)
            }
          />
        </label>

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
          Featured vendor
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
          disabled={saving}
          className="rounded-xl bg-[#c8a45d] px-6 py-3 font-semibold text-white disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : id
              ? "Save changes"
              : "Create vendor"}
        </button>
      </div>
    </form>
  );
}