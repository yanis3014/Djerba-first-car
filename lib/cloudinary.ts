export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
};

export function getCloudinaryUploadPreset() {
  return process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "djerbafirstcar_cars";
}
