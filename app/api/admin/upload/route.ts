import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAdminSession } from "../../../../lib/admin-auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 10MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<any>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: "viwah/venues",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      upload.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return NextResponse.json(
      { error: "Unable to upload image." },
      { status: 500 }
    );
  }
}