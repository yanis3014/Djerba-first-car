"use client";

import { CldUploadWidget } from "next-cloudinary";

type CloudinaryInfo = { secure_url?: string };

export function VehicleCloudinaryUpload({ onUploaded }: { onUploaded: (secureUrl: string) => void }) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return (
      <p className="text-xs text-[var(--color-muted)]">
        Upload Cloudinary : définissez <code className="rounded bg-[var(--color-bg-alt)] px-1">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> et{" "}
        <code className="rounded bg-[var(--color-bg-alt)] px-1">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> (preset non signé ou signature côté serveur).
      </p>
    );
  }

  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      options={{ sources: ["local", "url", "camera"], maxFiles: 10 }}
      onSuccess={(result) => {
        if (result.event !== "success") return;
        const info = result.info;
        if (!info || typeof info === "string") return;
        const url = (info as CloudinaryInfo).secure_url;
        if (url) onUploaded(url);
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Importer des images (Cloudinary)
        </button>
      )}
    </CldUploadWidget>
  );
}
