import { process } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Process() {
  return (
    <section id="process" className="scroll-mt-20 bg-surface py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Four steps from sample to science
          </h2>
        </Reveal>

        <div className="relative mt-14">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-line via-primary/40 to-line lg:block" />
          <ol className="grid gap-8 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal as="li" key={p.step} delay={i * 110} className="relative">
                <div className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-line bg-bg font-mono text-sm font-semibold text-primary shadow-sm">
                  <span className="anim-breathe absolute inset-0 rounded-full bg-primary/10" />
                  <span className="relative">{p.step}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
