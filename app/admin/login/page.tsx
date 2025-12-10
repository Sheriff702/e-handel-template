"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { firebaseAuth, missingFirebaseClientMessage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations("admin.login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firebaseAuth) {
      toast.error(missingFirebaseClientMessage);
      console.warn(missingFirebaseClientMessage);
      return;
    }

    setLoading(true);
    try {
      const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const token = await credentials.user.getIdTokenResult(true);
      if (!token.claims.admin) {
        toast.error("You are not authorised to access the admin dashboard.");
        await firebaseAuth.signOut();
        return;
      }
      toast.success(t("success", { defaultValue: "Welcome back" }));
      router.replace("/admin");
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-md border-border/70">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={loading || !firebaseAuth}
            >
              {loading ? t("loading") : t("submit")}
            </Button>
          </form>
          {!firebaseAuth && (
            <p className="mt-4 text-sm text-muted-foreground">{missingFirebaseClientMessage}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
