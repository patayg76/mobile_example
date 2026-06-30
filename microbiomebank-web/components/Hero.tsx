import { hero } from "@/lib/content";
import { Icons } from "./icons";
import { BioVisual } from "./BioVisual";

export function Hero() {
  return (
    <section
      id="top"
      className="grain relative isolate overflow-hidden bg-bg text-ink"
    >
      {/* aurora backdrop — drifting teal/green glows over a faint science grid */}
      <div className="absolute inset-0 -z-10">
        <span className="glow left-[58%] top-[-12%] h-[42rem] w-[42rem] bg-[color-mix(in_oklab,var(--color-lime)_38%,transparent)] opacity-60" />
        <span className="glow left-[68%] top-[18%] h-[30rem] w-[30rem] bg-[color-mix(in_oklab,var(--color-primary)_34%,transparent)] opacity-50 [animation-delay:4s]" />
        <span className="glow left-[-8%] top-[40%] h-[26rem] w-[26rem] bg-[color-mix(in_oklab,var(--color-accent)_24%,transparent)] opacity-40 [animation-delay:8s]" />
      </div>
      <div className="bio-grid absolute inset-0 -z-10 opacity-[0.45]" />
      {/* fade the backdrop into the next section */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-bg" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pb-36 lg:pt-44">
        <div>
          <span
            className="anim-enter eyebrow rounded-full border border-line bg-surface/70 px-3.5 py-2 backdrop-blur"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-lime [animation:pulse-ring_1.8s_ease-out_infinite]" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            {hero.eyebrow}
          </span>

          <h1
            className="anim-enter mt-7 max-w-[14ch] text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.035em] text-secondary sm:text-6xl lg:text-[4.6rem]"
            style={{ animationDelay: "0.12s" }}
          >
            {hero.titleLead}{" "}
            <span className="text-gradient">{hero.titleGradient}</span>.
          </h1>

          <p
            className="anim-enter mt-7 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl"
            style={{ animationDelay: "0.2s" }}
          >
            {hero.sub}
          </p>

          <div
            className="anim-enter mt-10 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.28s" }}
          >
            <a
              href={hero.ctaPrimary.href}
              className="shimmer group inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-4 font-medium text-white shadow-[0_18px_40px_-16px_rgba(20,48,42,0.8)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              {hero.ctaPrimary.label}
              <Icons.arrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface/70 px-7 py-4 font-medium text-ink backdrop-blur transition-colors duration-200 hover:bg-muted"
            >
              {hero.ctaSecondary.label}
            </a>
          </div>

          <ul
            className="anim-enter mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line/70 pt-6 font-mono text-sm text-ink-soft"
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

        {/* scientific microbiology visual — larger, with a soft ring frame */}
        <div
          className="anim-enter relative mx-auto hidden w-full max-w-xl lg:block"
          style={{ animationDelay: "0.22s" }}
        >
          <div className="absolute inset-6 -z-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-lime)_22%,transparent),transparent)]" />
          <BioVisual />
        </div>
      </div>
    </section>
  );
}
