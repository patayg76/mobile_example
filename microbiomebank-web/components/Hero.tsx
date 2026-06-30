import { hero } from "@/lib/content";
import { Icons } from "./icons";
import { BioVisual } from "./BioVisual";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-bg text-ink"
    >
      {/* whisper-soft background: one faint radial wash + a masked science grid */}
      <div className="absolute inset-0 -z-10 [background:radial-gradient(60%_50%_at_70%_8%,color-mix(in_oklab,var(--color-lime)_18%,transparent),transparent_70%)]" />
      <div className="bio-grid absolute inset-0 -z-10 opacity-[0.5]" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-32 lg:pt-40">
        <div>
          <span
            className="anim-enter inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-accent backdrop-blur"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-lime [animation:pulse-ring_1.8s_ease-out_infinite]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {hero.eyebrow}
          </span>

          <h1
            className="anim-enter mt-7 max-w-2xl text-[2.7rem] font-semibold leading-[1.04] tracking-[-0.02em] text-secondary sm:text-6xl lg:text-[4.1rem]"
            style={{ animationDelay: "0.12s" }}
          >
            {hero.titleLead}{" "}
            <span className="text-gradient">{hero.titleGradient}</span>.
          </h1>

          <p
            className="anim-enter mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
            style={{ animationDelay: "0.2s" }}
          >
            {hero.sub}
          </p>

          <div
            className="anim-enter mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.28s" }}
          >
            <a
              href={hero.ctaPrimary.href}
              className="shimmer inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 font-semibold text-white shadow-[0_10px_30px_-12px_rgba(31,81,48,0.7)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              {hero.ctaPrimary.label}
              <Icons.arrow className="h-4 w-4" />
            </a>
            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-7 py-3.5 font-semibold text-ink transition-colors duration-200 hover:bg-muted"
            >
              {hero.ctaSecondary.label}
            </a>
          </div>

          <ul
            className="anim-enter mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm text-ink-soft"
            style={{ animationDelay: "0.36s" }}
          >
            {hero.chips.map((chip) => (
              <li key={chip} className="flex items-center gap-2">
                <Icons.check className="h-4 w-4 text-primary" />
                {chip}
              </li>
            ))}
          </ul>
        </div>

        {/* scientific microbiology visual */}
        <div
          className="anim-enter relative mx-auto hidden w-full max-w-md lg:block"
          style={{ animationDelay: "0.24s" }}
        >
          <BioVisual />
        </div>
      </div>
    </section>
  );
}
