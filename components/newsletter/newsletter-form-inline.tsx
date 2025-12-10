"use client";

import { useState, useTransition } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { firestore, missingFirebaseClientMessage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterFormInline() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

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
          source: "footer",
        });
        setEmail("");
        toast.success(t("success"));
      } catch (error) {
        console.error(error);
        toast.error(t("error"));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-2 shadow-soft">
      <Input
        type="email"
        placeholder={t("placeholder")}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="border-none bg-transparent px-0"
        required
        disabled={!firestore}
      />
      <Button
        type="submit"
        size="sm"
        disabled={isPending || !email || !firestore}
        className="rounded-full px-4"
      >
        {isPending ? "…" : t("submit")}
      </Button>
      {!firestore && (
        <span className="text-xs text-muted-foreground sm:ml-2">
          {missingFirebaseClientMessage}
        </span>
      )}
    </form>
  );
}
