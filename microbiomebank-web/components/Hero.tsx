import { hero } from "@/lib/content";
import { Icons } from "./icons";
import { MicrobeField } from "./MicrobeField";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-deep text-white"
    >
      {/* animated gradient mesh */}
      <div className="anim-gradient absolute inset-0 -z-10 opacity-90 [background:radial-gradient(60%_50%_at_15%_10%,rgba(34,211,238,0.28),transparent),radial-gradient(55%_55%_at_85%_20%,rgba(16,185,129,0.22),transparent),radial-gradient(70%_60%_at_50%_100%,rgba(14,165,233,0.3),transparent),linear-gradient(180deg,#041f33,#0a3a5c)]" />
      {/* morphing blobs */}
      <div className="anim-morph anim-breathe absolute -left-24 top-24 -z-10 h-80 w-80 bg-glow/20 blur-2xl" />
      <div className="anim-morph absolute -right-16 bottom-0 -z-10 h-96 w-96 bg-accent/20 blur-2xl [animation-delay:3s]" />
      <MicrobeField className="-z-10 opacity-70" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pb-32 lg:pt-40">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-glow backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-lime [animation:pulse-ring_1.8s_ease-out_infinite]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            {hero.eyebrow}
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {hero.titleLead}{" "}
            <span className="text-gradient">{hero.titleGradient}</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            {hero.sub}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={hero.ctaPrimary.href}
              className="shimmer inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-deep transition-transform duration-200 hover:-translate-y-0.5"
            >
              {hero.ctaPrimary.label}
              <Icons.arrow className="h-4 w-4" />
            </a>
            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-white/10"
            >
              {hero.ctaSecondary.label}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm text-white/60">
            {hero.chips.map((chip, i) => (
              <li
                key={chip}
                className="anim-bob flex items-center gap-2"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <Icons.check className="h-4 w-4 text-lime" />
                {chip}
              </li>
            ))}
          </ul>
        </div>

        {/* orbiting cell visual */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-md place-items-center lg:grid">
          <div className="anim-morph anim-breathe absolute inset-8 bg-gradient-to-br from-primary/40 to-accent/30 blur-md" />
          <div className="absolute inset-0 anim-spin-slow">
            {[0, 72, 144, 216, 288].map((deg) => (
              <span
                key={deg}
                className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow shadow-[0_0_16px_4px_rgba(34,211,238,0.6)]"
                style={{
                  transform: `rotate(${deg}deg) translateX(170px) rotate(-${deg}deg)`,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 anim-spin-slow [animation-direction:reverse] [animation-duration:38s]">
            {[36, 108, 180, 252, 324].map((deg) => (
              <span
                key={deg}
                className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_14px_3px_rgba(16,185,129,0.6)]"
                style={{
                  transform: `rotate(${deg}deg) translateX(120px) rotate(-${deg}deg)`,
                }}
              />
            ))}
          </div>
          <div className="anim-breathe relative grid h-40 w-40 place-items-center rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_60px_-10px_rgba(34,211,238,0.8)]">
            <Icons.dna className="h-20 w-20 text-white/90" strokeWidth={1.3} />
          </div>
        </div>
      </div>

      {/* fade into light body */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-bg" />
    </section>
  );
}
