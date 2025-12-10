"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore, missingFirebaseClientMessage } from "@/lib/firebase";
import type { SiteSettings } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const settingsSchema = z.object({
  storeName: z.string().min(2),
  brandColor: z.string().min(4),
  accentColor: z.string().min(4),
  adminUids: z.string().optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      storeName: settings.storeName,
      brandColor: settings.brandColor,
      accentColor: settings.accentColor,
      adminUids: settings.adminUids.join(", "),
    },
  });

  useEffect(() => {
    reset({
      storeName: settings.storeName,
      brandColor: settings.brandColor,
      accentColor: settings.accentColor,
      adminUids: settings.adminUids.join(", "),
    });
  }, [settings, reset]);

  const onSubmit = async (values: SettingsValues) => {
    try {
      if (!firestore) {
        toast.error(missingFirebaseClientMessage);
        console.warn(missingFirebaseClientMessage);
        return;
      }

      const adminUids = values.adminUids
        ? values.adminUids.split(",").map((uid) => uid.trim()).filter(Boolean)
        : [];
      await setDoc(doc(firestore, "siteSettings", "singleton"), {
        storeName: values.storeName,
        brandColor: values.brandColor,
        accentColor: values.accentColor,
        adminUids,
        updatedAt: serverTimestamp(),
      });
      toast.success("Settings saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="storeName">Store name</Label>
          <Input id="storeName" {...register("storeName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brandColor">Brand colour</Label>
          <Input id="brandColor" type="color" {...register("brandColor")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accentColor">Accent colour</Label>
          <Input id="accentColor" type="color" {...register("accentColor")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="adminUids">Admin UIDs (comma separated)</Label>
          <Input id="adminUids" {...register("adminUids")} />
        </div>
      </div>
      <Button type="submit" className="rounded-full" disabled={isSubmitting || !firestore}>
        Save changes
      </Button>
    </form>
  );
}
