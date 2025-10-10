"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "@/types/catalog";
import { AdminTable } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<Category>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Slug",
    accessorKey: "slug",
  },
  {
    header: "Sort",
    accessorKey: "sort",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button asChild size="sm" variant="outline" className="rounded-full">
        <Link href={`/admin/categories/${row.original.id}`}>Edit</Link>
      </Button>
    ),
  },
];

export function CategoriesTable({ categories }: { categories: Category[] }) {
  return <AdminTable columns={columns} data={categories} />;
}
