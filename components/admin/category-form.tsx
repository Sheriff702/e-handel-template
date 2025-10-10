"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore, missingFirebaseClientMessage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types/catalog";
import { toast } from "sonner";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  sort: z
    .preprocess((value) => (value === "" || value === null ? undefined : value), z.number().int().optional())
    .optional(),
});

type CategoryValues = z.infer<typeof categorySchema>;

export function CategoryForm({ initialData }: { initialData?: Category & { id?: string } }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      sort: 1,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description ?? "",
        sort: initialData.sort ?? 1,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (values: CategoryValues) => {
    try {
      if (!firestore) {
        toast.error(missingFirebaseClientMessage);
        console.warn(missingFirebaseClientMessage);
        return;
      }

      if (initialData?.id) {
        await updateDoc(doc(firestore, "categories", initialData.id), {
          ...values,
          updatedAt: serverTimestamp(),
        });
        toast.success("Category updated");
      } else {
        await addDoc(collection(firestore, "categories"), {
          ...values,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success("Category created");
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sort">Sort order</Label>
        <Input id="sort" type="number" {...register("sort")} />
      </div>
      <Button type="submit" className="rounded-full" disabled={isSubmitting || !firestore}>
        {initialData ? "Update category" : "Create category"}
      </Button>
    </form>
  );
}
