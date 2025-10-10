"use client";

import { useMemo } from "react";
import { saveAs } from "file-saver";
import type { ColumnDef } from "@tanstack/react-table";
import type { NewsletterSignup } from "@/types/catalog";
import { AdminTable } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const columns: ColumnDef<NewsletterSignup>[] = [
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Subscribed",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.createdAt ? format(new Date(row.original.createdAt), "PPP p") : ""}
      </span>
    ),
  },
  {
    header: "Source",
    accessorKey: "source",
  },
];

export function NewsletterTable({ signups }: { signups: NewsletterSignup[] }) {
  const csvContent = useMemo(() => {
    const header = "email,createdAt,source";
    const rows = signups.map((signup) =>
      [signup.email, signup.createdAt, signup.source ?? "website"].join(",")
    );
    return [header, ...rows].join("\n");
  }, [signups]);

  const handleExport = () => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `newsletter-${new Date().toISOString()}.csv`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleExport} variant="outline" className="rounded-full">
          Export CSV
        </Button>
      </div>
      <AdminTable columns={columns} data={signups} />
    </div>
  );
}
