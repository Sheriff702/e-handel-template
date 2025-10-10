"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, missingFirebaseClientMessage } from "@/lib/firebase";
import { AdminNav } from "@/components/admin/admin-nav";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    if (!firebaseAuth) {
      setStatus("unauthenticated");
      if (pathname !== "/admin/login") {
        console.warn(missingFirebaseClientMessage);
        router.replace("/admin/login");
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setStatus("unauthenticated");
        if (pathname !== "/admin/login") {
          router.replace("/admin/login");
        }
        return;
      }

      const token = await user.getIdTokenResult(true);
      if (token.claims.admin) {
        setStatus("authenticated");
        if (pathname === "/admin/login") {
          router.replace("/admin");
        }
      } else {
        setStatus("unauthenticated");
        await firebaseAuth.signOut();
        router.replace("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  if (!firebaseAuth && pathname !== "/admin/login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-semibold">Firebase configuration required</h2>
          <p className="text-sm text-muted-foreground">
            {missingFirebaseClientMessage}
          </p>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex w-full max-w-3xl flex-col gap-4 p-8">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminNav />
      <main className="mx-auto max-w-6xl space-y-12 px-6 py-10">{children}</main>
    </div>
  );
}
