import { services } from "@/lib/content";
import { Icons, type IconName } from "./icons";
import { Reveal } from "./Reveal";

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24 sm:px-8 lg:py-28">
      <Reveal className="max-w-2xl">
        <span className="eyebrow">Kapszuláink</span>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-secondary sm:text-5xl">
          MTT kapszula-szolgáltatások
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Minden összetétel sarzsonként egyedi és megismételhetetlen — a
          felhasználás céljához és a kezelés várható tartamához igazítva.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Glyph = Icons[s.icon as IconName];
          return (
            <Reveal
              key={s.title}
              delay={i * 70}
              className="card group flex h-full flex-col p-7"
            >
              <span className="icon-tile h-12 w-12 transition-transform duration-300 group-hover:-translate-y-0.5">
                <Glyph className="h-6 w-6" />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-secondary">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                {s.body}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Részletek
                <Icons.arrow className="h-3.5 w-3.5" />
              </span>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
