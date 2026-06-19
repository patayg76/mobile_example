import { services } from "@/lib/content";
import { Icons, type IconName } from "./icons";
import { Reveal } from "./Reveal";

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8">
      <Reveal className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          What we do
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          End-to-end care for living material
        </h2>
        <p className="mt-4 text-lg text-ink-soft">
          From intake to recovery, every step is instrumented, documented and
          built to keep your strains viable and citable.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => {
          const Glyph = Icons[s.icon as IconName];
          return (
            <Reveal
              key={s.title}
              delay={i * 80}
              className="group relative flex h-full flex-col rounded-2xl border border-line/70 bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_24px_50px_-24px_rgba(14,165,233,0.5)]"
            >
              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition-colors group-hover:from-primary group-hover:to-accent group-hover:text-white">
                <Glyph className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold leading-snug">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
