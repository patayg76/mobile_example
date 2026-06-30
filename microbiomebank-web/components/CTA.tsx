import { cta } from "@/lib/content";
import { Icons } from "./icons";
import { Reveal } from "./Reveal";

export function CTA() {
  return (
    <section id="contact" className="scroll-mt-20 px-5 py-20 sm:px-8 lg:py-24">
      <Reveal className="grain relative mx-auto max-w-6xl overflow-hidden rounded-[2.25rem] px-6 py-20 text-center text-white shadow-[0_40px_90px_-50px_rgba(20,48,42,0.9)] sm:px-12 sm:py-24">
        {/* layered deep-green gradient + drifting glows */}
        <div className="absolute inset-0 -z-10 [background:radial-gradient(120%_120%_at_15%_0%,#1f5040,transparent_60%),radial-gradient(120%_120%_at_100%_100%,#1e3d2a,transparent_55%),linear-gradient(160deg,#15332b,#102620)]" />
        <span className="glow left-[8%] top-[-20%] -z-10 h-72 w-72 bg-[color-mix(in_oklab,var(--color-lime)_55%,transparent)] opacity-30" />
        <span className="glow right-[6%] bottom-[-25%] -z-10 h-80 w-80 bg-[color-mix(in_oklab,var(--color-primary)_55%,transparent)] opacity-30 [animation-delay:6s]" />

        <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {cta.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">
          {cta.body}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={cta.primary.href}
            className="shimmer group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-deep transition-transform duration-200 hover:-translate-y-0.5"
          >
            {cta.primary.label}
            <Icons.arrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
          <a
            href={cta.secondary.href}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 font-mono text-sm text-white/90 transition-colors duration-200 hover:bg-white/10"
          >
            <Icons.arrow className="h-4 w-4 rotate-[-45deg]" />
            {cta.secondary.label}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
