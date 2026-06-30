import { logos } from "@/lib/content";

export function LogoMarquee() {
  const row = [...logos, ...logos];
  return (
    <section aria-label="Alkalmazási területek" className="border-y border-line/60 bg-surface py-8">
      <p className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-ink-soft">
        Alkalmazási területek
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max gap-12 [animation:marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
          {row.map((name, i) => (
            <span
              key={i}
              className="flex items-center gap-2 whitespace-nowrap text-lg font-semibold text-ink/45 transition-colors hover:text-ink"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-primary to-accent" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
