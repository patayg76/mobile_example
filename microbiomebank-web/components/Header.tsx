"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";
import { Icons } from "./icons";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center">
        <span className="anim-breathe absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent" />
        <span className="absolute inset-0 rounded-full bg-glow/40 anim-spin-slow [mask:radial-gradient(circle,transparent_55%,#000_56%)]" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Microbiome<span className="text-primary">Bank</span>
      </span>
    </span>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/60 bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" aria-label={site.name}>
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-underline rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="shimmer inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            Get started
            <Icons.arrow className="h-4 w-4" />
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full text-ink md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <Icons.close className="h-6 w-6" /> : <Icons.menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={`overflow-hidden border-t border-line/60 bg-bg/95 backdrop-blur-md transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-ink-soft hover:bg-muted hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-base font-semibold text-white"
          >
            Get started
            <Icons.arrow className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
