"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroSection() {
  const t = useTranslations("hero");
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });
      timeline
        .fromTo(
          ".hero-eyebrow",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1 }
        )
        .fromTo(
          ".hero-title",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1 },
          "<0.1"
        )
        .fromTo(
          ".hero-subtitle",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1 },
          "<"
        )
        .fromTo(
          ".hero-cta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1 },
          "<"
        );

      ScrollTrigger.batch(".product-spotlight", {
        start: "top 80%",
        once: true,
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.15,
          });
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden rounded-3xl border border-border/80 bg-hero-grid px-6 py-20 sm:px-12 md:px-20">
      <div className="grid gap-14 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div className="space-y-8">
          <span className="hero-eyebrow inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-primary">
            {t("eyebrow")}
          </span>
          <h1 className="hero-title text-balance text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
          <p className="hero-subtitle max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {t("subtitle")}
          </p>
          <div className="flex flex-col items-start gap-3 sm:flex-row">
            <Button size="lg" className="hero-cta rounded-full px-8 text-base">
              {t("ctaPrimary")}
            </Button>
            <Button size="lg" variant="outline" className="hero-cta rounded-full px-8 text-base">
              {t("ctaSecondary")}
            </Button>
          </div>
        </div>
        <div className="relative">
          <motion.div
            className="product-spotlight pointer-events-none relative mx-auto flex h-[360px] w-[360px] items-center justify-center rounded-full bg-background/70 shadow-soft backdrop-blur"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="relative h-[260px] w-[200px] overflow-hidden rounded-3xl border border-border/60 shadow-2xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
                alt="Floating coat"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              className="absolute -right-10 bottom-10 hidden h-[200px] w-[160px] overflow-hidden rounded-3xl border border-border/60 shadow-xl md:block"
              animate={{ y: [0, 14, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80"
                alt="Accessory"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              className="absolute -left-12 top-6 hidden h-[160px] w-[130px] overflow-hidden rounded-2xl border border-border/60 shadow-lg md:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.8 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=600&q=80"
                alt="Minimalist bag"
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" aria-hidden />
    </section>
  );
}
