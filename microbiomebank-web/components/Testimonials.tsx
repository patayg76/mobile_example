import { testimonials } from "@/lib/content";
import { Icons } from "./icons";
import { Reveal } from "./Reveal";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
      <Reveal className="max-w-2xl">
        <span className="eyebrow">Csapatunk</span>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-secondary sm:text-5xl">
          Orvosi szakértelem minden lépésnél
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 120} className="card flex flex-col p-9">
            <Icons.quote className="h-9 w-9 text-primary/25" />
            <p className="mt-5 flex-1 text-lg leading-relaxed text-ink">{t.quote}</p>
            <div className="mt-8 flex items-center gap-3.5 border-t border-line/70 pt-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary font-display font-semibold text-white">
                {t.name.split(" ").slice(-1)[0][0]}
              </span>
              <div>
                <div className="font-display font-semibold text-secondary">{t.name}</div>
                <div className="text-sm text-ink-soft">{t.role}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
