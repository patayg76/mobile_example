import { process } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Process() {
  return (
    <section id="process" className="scroll-mt-20 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">A folyamat</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-secondary sm:text-5xl">
            Négy lépés a gyógyulásig
          </h2>
        </Reveal>

        <div className="relative mt-16">
          {/* connecting line with a gradient core */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-line lg:block" />
          <div className="absolute left-0 top-7 hidden h-px w-2/3 bg-gradient-to-r from-primary via-accent to-transparent lg:block" />
          <ol className="grid gap-10 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal as="li" key={p.step} delay={i * 110} className="relative">
                <div className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl border border-line bg-surface font-mono text-sm font-semibold text-primary shadow-[0_10px_24px_-14px_rgba(22,120,126,0.6)]">
                  <span className="anim-breathe absolute inset-0 rounded-2xl bg-primary/8" />
                  <span className="relative">{p.step}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-secondary">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                  {p.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
