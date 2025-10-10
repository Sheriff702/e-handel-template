"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/types/catalog";
import { AdminTable } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const columns: ColumnDef<Product>[] = [
  {
    header: "Product",
    accessorKey: "title",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{row.original.title}</span>
        <span className="text-xs text-muted-foreground">{row.original.slug}</span>
      </div>
    ),
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: ({ row }) => <span>{row.original.price} SEK</span>,
  },
  {
    header: "Stock",
    accessorKey: "stock",
  },
  {
    header: "Updated",
    accessorKey: "updatedAt",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.updatedAt ? format(new Date(row.original.updatedAt), "PPP") : ""}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "active",
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${row.original.active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
        {row.original.active ? "Published" : "Draft"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button asChild size="sm" variant="outline" className="rounded-full">
        <Link href={`/admin/products/${row.original.id}`}>Edit</Link>
      </Button>
    ),
  },
];

export function ProductsTable({ products }: { products: Product[] }) {
  return <AdminTable columns={columns} data={products} />;
}
