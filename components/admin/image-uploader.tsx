"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, missingFirebaseClientMessage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      if (!storage) {
        toast.error(missingFirebaseClientMessage);
        console.warn(missingFirebaseClientMessage);
        return;
      }

      const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file, {
        cacheControl: "public, max-age=31536000",
      });
      const downloadUrl = await getDownloadURL(snapshot.ref);
      onChange([...images, downloadUrl]);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    onChange(images.filter((image) => image !== url));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((url) => (
          <div key={url} className="relative h-28 w-28 overflow-hidden rounded-xl border">
            <Image src={url} alt="Product image" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
            >
              Remove
            </button>
          </div>
        ))}
        <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/40 text-sm text-muted-foreground transition hover:border-primary hover:text-primary">
          <Upload className="mb-2 h-5 w-5" />
          {uploading ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading || !storage}
          />
        </label>
      </div>
      {images.length === 0 && <p className="text-sm text-muted-foreground">Upload at least one image.</p>}
      {!storage && (
        <p className="text-sm text-muted-foreground">{missingFirebaseClientMessage}</p>
      )}
      <Button type="button" variant="outline" onClick={() => onChange([])} disabled={images.length === 0}>
        Clear images
      </Button>
    </div>
  );
}
