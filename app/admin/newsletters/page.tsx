import { getAdminDb } from "@/lib/firebase-admin";
import { NewsletterTable } from "@/components/admin/newsletter-table";
import type { NewsletterSignup } from "@/types/catalog";

export default async function AdminNewslettersPage() {
  const adminDb = getAdminDb();
  let signups: NewsletterSignup[] = [];

  if (adminDb) {
    const snapshot = await adminDb.collection("newsletters").orderBy("createdAt", "desc").get();
    signups = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...(data as NewsletterSignup),
        createdAt: data.createdAt?.toDate?.().toISOString?.() ?? data.createdAt,
      };
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Newsletter signups</h1>
        <p className="text-sm text-muted-foreground">Export opted-in customers for campaigns.</p>
      </div>
      <NewsletterTable signups={signups} />
    </div>
  );
}
