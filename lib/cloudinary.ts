import { v2 as cloudinary } from "cloudinary";

import { extractPublicIdFromCloudinaryUrl as extractPublicIdFromCloudinaryUrlImpl } from "@/lib/cloudinary-public-id";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
};

export function getCloudinaryUploadPreset() {
  return process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "djerbafirstcar_cars";
}

export const extractPublicIdFromCloudinaryUrl = extractPublicIdFromCloudinaryUrlImpl;

export async function deleteCloudinaryImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
