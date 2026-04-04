"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Camera, GripVertical, Loader2, Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { deleteCarImage } from "@/app/actions/cars";
import { extractPublicIdFromCloudinaryUrl } from "@/lib/cloudinary-public-id";
import { cn } from "@/lib/cn";

type CloudinaryInfo = { secure_url?: string; public_id?: string };

const MAX_FILES = 10;
const FOLDER = "djerba-first-car/cars";

interface ImageUploaderProps {
  images: string[];
  coverImage: string;
  onChange: (images: string[]) => void;
  onCoverChange: (url: string) => void;
  /** Message d’erreur de validation (ex. Zod) affiché sous la zone */
  errorMessage?: string;
}

function reorderList<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const next = [...list];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
}

async function uploadFileToCloudinary(
  file: File,
  cloudName: string,
  uploadPreset: string,
): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", uploadPreset);
  body.append("folder", FOLDER);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(errText || `Échec de l’envoi (${res.status})`);
  }
  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) throw new Error("Réponse Cloudinary invalide.");
  return data.secure_url;
}

export function ImageUploader({
  images,
  coverImage,
  onChange,
  onCoverChange,
  errorMessage,
}: ImageUploaderProps) {
  const [removingUrl, setRemovingUrl] = useState<string | null>(null);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [isUploadingDrop, setIsUploadingDrop] = useState(false);
  const dragImageIndex = useRef<number | null>(null);
  const imagesRef = useRef(images);
  const coverRef = useRef(coverImage);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    imagesRef.current = images;
    coverRef.current = coverImage;
  }, [images, coverImage]);

  const appendUploadedUrls = useCallback(
    (urls: string[]) => {
      if (urls.length === 0) return;
      const current = imagesRef.current;
      const remaining = MAX_FILES - current.length;
      if (remaining <= 0) {
        toast.warning("Limite de photos atteinte", {
          description: `Vous ne pouvez pas ajouter plus de ${MAX_FILES} photos.`,
        });
        return;
      }
      const slice = urls.slice(0, remaining);
      const next = [...current, ...slice];
      imagesRef.current = next;
      onChange(next);
      if (!coverRef.current && slice[0]) {
        coverRef.current = slice[0];
        onCoverChange(slice[0]);
      }
      if (urls.length > remaining) {
        toast.warning("Limite partielle", {
          description: `Seules ${remaining} photo(s) supplémentaire(s) ont été ajoutées (limite ${MAX_FILES}).`,
        });
      }
    },
    [onChange, onCoverChange],
  );

  const handleWidgetSuccess = useCallback(
    (result: { event?: string; info?: unknown }) => {
      if (result.event !== "success") return;
      const info = result.info;
      if (!info || typeof info === "string") return;
      const secureUrl = (info as CloudinaryInfo).secure_url;
      if (!secureUrl) return;
      appendUploadedUrls([secureUrl]);
    },
    [appendUploadedUrls],
  );

  const handleFileDrop = useCallback(
    async (fileList: FileList | File[]) => {
      if (!cloudName || !uploadPreset) return;
      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      if (files.length === 0) {
        toast.error("Fichiers non pris en charge", {
          description: "Déposez uniquement des fichiers image (JPG, PNG, WebP…).",
        });
        return;
      }
      setIsUploadingDrop(true);
      const urls: string[] = [];
      try {
        const remaining = MAX_FILES - imagesRef.current.length;
        if (remaining <= 0) {
          toast.warning("Limite de photos atteinte", {
            description: `Vous avez déjà ${MAX_FILES} photos.`,
          });
          return;
        }
        const toUpload = files.slice(0, remaining);
        for (const file of toUpload) {
          const url = await uploadFileToCloudinary(file, cloudName, uploadPreset);
          urls.push(url);
        }
        appendUploadedUrls(urls);
        if (files.length > remaining) {
          toast.warning("Certains fichiers ont été ignorés", {
            description: `${files.length - remaining} fichier(s) en trop (limite ${MAX_FILES} photos).`,
          });
        }
      } catch (e) {
        toast.error("Envoi des images impossible", {
          description: e instanceof Error ? e.message : "Erreur lors de l’envoi des images.",
        });
      } finally {
        setIsUploadingDrop(false);
      }
    },
    [cloudName, uploadPreset, appendUploadedUrls],
  );

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
      toast.success("Image supprimée");
    } catch (e) {
      toast.error("Suppression impossible", {
        description: e instanceof Error ? e.message : "Erreur inattendue.",
      });
    } finally {
      setRemovingUrl(null);
    }
  }

  function onReorderDragStart(e: React.DragEvent, index: number) {
    if (!(e.target as HTMLElement).closest("[data-reorder-handle]")) {
      e.preventDefault();
      return;
    }
    dragImageIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  }

  function onReorderDragEnd() {
    dragImageIndex.current = null;
  }

  function onReorderDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function onReorderDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    if (e.dataTransfer.types.includes("Files") && e.dataTransfer.files.length > 0) {
      return;
    }
    const from = dragImageIndex.current;
    dragImageIndex.current = null;
    if (from === null || from === dropIndex) return;
    onChange(reorderList(images, from, dropIndex));
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
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.types.includes("Files")) setIsDraggingFiles(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.types.includes("Files")) {
            e.dataTransfer.dropEffect = "copy";
            setIsDraggingFiles(true);
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const related = e.relatedTarget as Node | null;
          if (related && e.currentTarget.contains(related)) return;
          setIsDraggingFiles(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingFiles(false);
          if (e.dataTransfer.files?.length) void handleFileDrop(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-xl border-2 border-dashed transition-colors",
          isDraggingFiles ? "border-red-500 bg-red-950/20" : "border-[#333]",
        )}
      >
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{
            sources: ["local", "url", "camera"],
            multiple: true,
            maxFiles: MAX_FILES,
            folder: FOLDER,
          }}
          onSuccess={handleWidgetSuccess}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              disabled={isUploadingDrop}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-2 rounded-[10px] bg-[#111] px-6 py-10 text-neutral-400 transition hover:border-neutral-500 hover:text-neutral-200 disabled:cursor-wait disabled:opacity-70",
              )}
            >
              {isUploadingDrop ? (
                <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
              ) : (
                <Upload className="h-8 w-8" aria-hidden />
              )}
              <span className="text-sm font-medium">
                {isUploadingDrop ? "Envoi en cours…" : "Glissez-déposez des images ici ou cliquez pour parcourir"}
              </span>
              <span className="text-xs text-neutral-500">Jusqu’à {MAX_FILES} photos · JPG, PNG, WebP…</span>
            </button>
          )}
        </CldUploadWidget>
      </div>

      {errorMessage ? (
        <p className="text-sm font-medium text-red-500" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <p className="text-xs text-neutral-500">
        Glissez les vignettes avec l’icône <GripVertical className="inline h-3.5 w-3.5 align-text-bottom" /> pour
        l’ordre d’affichage. L’étoile définit la <strong className="text-neutral-400">miniature principale</strong> sur
        le site.
      </p>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] py-12 text-neutral-500">
          <Camera className="h-10 w-10" aria-hidden />
          <p className="text-sm">Aucune photo pour l’instant</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, index) => {
            const isCover = coverImage === url;
            return (
              <li
                key={url}
                draggable
                onDragStart={(e) => onReorderDragStart(e, index)}
                onDragEnd={onReorderDragEnd}
                onDragOver={(e) => onReorderDragOver(e, index)}
                onDrop={(e) => onReorderDrop(e, index)}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#333] bg-black"
              >
                <Image src={url} alt="" fill className="pointer-events-none object-cover" sizes="(max-width: 640px) 50vw, 200px" />
                <div
                  data-reorder-handle
                  className="absolute left-1 top-1 flex h-8 w-8 cursor-grab items-center justify-center rounded-md bg-black/75 text-neutral-300 shadow-md active:cursor-grabbing"
                  title="Glisser pour réorganiser"
                  role="button"
                  tabIndex={0}
                  aria-label="Réorganiser l’image"
                >
                  <GripVertical className="h-4 w-4" aria-hidden />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleRemove(url);
                  }}
                  disabled={removingUrl === url}
                  className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-500 disabled:opacity-50"
                  aria-label="Supprimer l’image"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCoverChange(url);
                  }}
                  title={isCover ? "Image principale" : "Définir comme image principale"}
                  className={`absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition ${
                    isCover ? "bg-amber-400 text-black" : "bg-black/70 text-neutral-400 hover:text-amber-300"
                  }`}
                  aria-label={isCover ? "Image principale" : "Définir comme image principale"}
                >
                  <Star className={`h-4 w-4 ${isCover ? "fill-current" : ""}`} />
                </button>
                {index === 0 ? (
                  <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-neutral-300">
                    1er
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
