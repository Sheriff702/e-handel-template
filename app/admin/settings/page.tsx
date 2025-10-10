import { getSiteSettings } from "@/lib/storefront";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Store settings</h1>
        <p className="text-sm text-muted-foreground">Control branding, colours, and admin access.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
