"use client";

import { useEffect, useState, useTransition } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { firestore, missingFirebaseClientMessage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const STORAGE_KEY = "aurora-newsletter-dismissed-at";
const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export function NewsletterPopup() {
  const t = useTranslations("newsletter");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timeout = setTimeout(() => setOpen(true), 2500);
      return () => clearTimeout(timeout);
    }
    const lastDismissed = Number(stored);
    if (Number.isFinite(lastDismissed) && Date.now() - lastDismissed > THIRTY_DAYS) {
      const timeout = setTimeout(() => setOpen(true), 2500);
      return () => clearTimeout(timeout);
    }
  }, []);

  const dismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    startTransition(async () => {
      try {
        if (!firestore) {
          toast.error(t("error"));
          console.warn(missingFirebaseClientMessage);
          return;
        }

        await addDoc(collection(firestore, "newsletters"), {
          email: trimmed.toLowerCase(),
          createdAt: serverTimestamp(),
          source: "popup",
        });
        toast.success(t("success"));
        setEmail("");
        dismiss();
      } catch (error) {
        console.error(error);
        toast.error(t("error"));
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          dismiss();
        }
      }}
    >
      <DialogContent className="max-w-xl bg-hero-grid">
        <div className="space-y-4">
          <h3 className="text-3xl font-semibold">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder={t("placeholder")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={!firestore}
            />
            <Button type="submit" className="sm:min-w-[140px]" disabled={isPending || !firestore}>
              {!firestore && <span className="sr-only">Newsletter sign up disabled</span>}
              {isPending ? "…" : t("submit")}
            </Button>
          </form>
          {!firestore && (
            <p className="text-xs text-muted-foreground">{missingFirebaseClientMessage}</p>
          )}
          <Button type="button" variant="ghost" onClick={dismiss} className="w-fit px-0 text-sm text-muted-foreground">
            {t("dismiss")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
