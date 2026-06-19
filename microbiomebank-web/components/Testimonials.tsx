import { testimonials } from "@/lib/content";
import { Icons } from "./icons";
import { Reveal } from "./Reveal";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal
            key={t.name}
            delay={i * 120}
            className="relative overflow-hidden rounded-3xl border border-line/70 bg-surface p-8"
          >
            <Icons.quote className="h-9 w-9 text-primary/30" />
            <p className="mt-4 text-lg leading-relaxed text-ink">{t.quote}</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="anim-breathe grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-semibold text-white">
                {t.name.split(" ").slice(-1)[0][0]}
              </span>
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-ink-soft">{t.role}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
