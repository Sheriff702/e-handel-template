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
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Product } from "@/types/catalog";
import { toast } from "sonner";

const productSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  price: z.coerce.number().min(0),
  compareAtPrice: z
    .preprocess((value) => (value === "" || value === null ? undefined : value), z.number().min(0).optional())
    .optional(),
  description: z.string().min(10),
  categoryId: z.string().min(2),
  stock: z.coerce.number().min(0),
  images: z.array(z.string().url()).min(1),
  active: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm({ initialData }: { initialData?: Product & { id?: string } }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      slug: "",
      price: 0,
      compareAtPrice: undefined,
      description: "",
      categoryId: "",
      stock: 0,
      images: [],
      active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        slug: initialData.slug,
        price: initialData.price,
        compareAtPrice: initialData.compareAtPrice ?? undefined,
        description: initialData.description,
        categoryId: initialData.categoryId,
        stock: initialData.stock,
        images: initialData.images ?? [],
        active: initialData.active,
      });
    }
  }, [initialData, reset]);

  const images = watch("images");

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (!firestore) {
        toast.error(missingFirebaseClientMessage);
        console.warn(missingFirebaseClientMessage);
        return;
      }

      if (initialData?.id) {
        await updateDoc(doc(firestore, "products", initialData.id), {
          ...values,
          updatedAt: serverTimestamp(),
        });
        toast.success("Product updated");
      } else {
        await addDoc(collection(firestore, "products"), {
          ...values,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success("Product created");
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="compareAtPrice">Compare at price</Label>
          <Input id="compareAtPrice" type="number" step="0.01" {...register("compareAtPrice")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Input id="categoryId" {...register("categoryId")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={5} {...register("description")} />
      </div>
      <div className="space-y-2">
        <Label>Images</Label>
        <ImageUploader images={images ?? []} onChange={(urls) => setValue("images", urls, { shouldDirty: true })} />
      </div>
      <Button type="submit" size="lg" className="rounded-full" disabled={isSubmitting || !firestore}>
        {initialData ? "Update product" : "Create product"}
      </Button>
    </form>
  );
}
