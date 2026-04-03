"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Camera, Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { deleteCarImage } from "@/app/actions/cars";
import { extractPublicIdFromCloudinaryUrl } from "@/lib/cloudinary-public-id";

type CloudinaryInfo = { secure_url?: string; public_id?: string };

interface ImageUploaderProps {
  images: string[];
  coverImage: string;
  onChange: (images: string[]) => void;
  onCoverChange: (url: string) => void;
}

export function ImageUploader({ images, coverImage, onChange, onCoverChange }: ImageUploaderProps) {
  const [removingUrl, setRemovingUrl] = useState<string | null>(null);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  async function handleRemove(url: string) {
    const publicId = extractPublicIdFromCloudinaryUrl(url);
    setRemovingUrl(url);
    try {
      if (publicId) {
        await deleteCarImage(publicId);
      }
      const next = images.filter((u) => u !== url);
      onChange(next);
      if (coverImage === url) {
        onCoverChange(next[0] ?? "");
      }
    } finally {
      setRemovingUrl(null);
    }
  }

  if (!cloudName || !uploadPreset) {
    return (
      <p className="rounded-lg border border-dashed border-[#333] bg-[#111] p-4 text-sm text-neutral-400">
        Cloudinary : définissez <code className="text-neutral-200">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> et{" "}
        <code className="text-neutral-200">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code>.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <CldUploadWidget
        uploadPreset={uploadPreset}
        options={{
          sources: ["local", "url", "camera"],
          multiple: true,
          maxFiles: 10,
          folder: "djerba-first-car/cars",
        }}
        onSuccess={(result) => {
          if (result.event !== "success") return;
          const info = result.info;
          if (!info || typeof info === "string") return;
          const secureUrl = (info as CloudinaryInfo).secure_url;
          if (!secureUrl) return;
          const next = [...images, secureUrl];
          onChange(next);
          if (!coverImage) {
            onCoverChange(secureUrl);
          }
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#333] bg-[#111] px-6 py-10 text-neutral-400 transition hover:border-neutral-500 hover:text-neutral-200"
          >
            <Upload className="h-8 w-8" aria-hidden />
            <span className="text-sm font-medium">Cliquez pour ajouter des photos</span>
          </button>
        )}
      </CldUploadWidget>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] py-12 text-neutral-500">
          <Camera className="h-10 w-10" aria-hidden />
          <p className="text-sm">Aucune photo pour l’instant</p>
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-3">
          {images.map((url) => {
            const isCover = coverImage === url;
            return (
              <li key={url} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#333] bg-black">
                <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 768px) 33vw, 200px" />
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  disabled={removingUrl === url}
                  className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-500 disabled:opacity-50"
                  aria-label="Supprimer l’image"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onCoverChange(url)}
                  title={isCover ? undefined : "Définir comme image principale"}
                  className={`absolute bottom-1 left-1 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition ${
                    isCover ? "bg-amber-400 text-black" : "bg-black/70 text-neutral-400 hover:text-amber-300"
                  }`}
                  aria-label={isCover ? "Image principale" : "Définir comme image principale"}
                >
                  <Star className={`h-4 w-4 ${isCover ? "fill-current" : ""}`} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
