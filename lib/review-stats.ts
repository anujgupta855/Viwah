import Review from "@/models/review";
import { Venue, Vendor } from "@/models";

type TargetType = "venue" | "vendor";

export async function syncReviewStats(
  targetType: TargetType,
  targetId: string,
) {
  const field =
    targetType === "venue"
      ? "venue"
      : "vendor";

  const stats = await Review.aggregate([
    {
      $match: {
        [field]: targetId,
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        reviewCount: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const reviewCount = stats[0]?.reviewCount ?? 0;
  const averageRating = stats[0]?.averageRating ?? 0;

  const rating =
    reviewCount > 0
      ? Math.round(averageRating * 100) / 100
      : 0;

  if (targetType === "venue") {
    await Venue.findByIdAndUpdate(targetId, {
      rating,
      reviewCount,
    });
  } else {
    await Vendor.findByIdAndUpdate(targetId, {
      rating,
      reviewCount,
    });
  }

  return {
    rating,
    reviewCount,
  };
}