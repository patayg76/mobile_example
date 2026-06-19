import { platform } from "@/lib/content";
import { Icons } from "./icons";
import { Reveal } from "./Reveal";

export function Platform() {
  return (
    <section id="platform" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            {platform.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {platform.title}
          </h2>
          <p className="mt-4 text-lg text-ink-soft">{platform.body}</p>
          <ul className="mt-7 space-y-3">
            {platform.points.map((point, i) => (
              <li
                key={point}
                className="reveal is-in flex items-start gap-3"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-accent/12 text-accent">
                  <Icons.check className="h-4 w-4" />
                </span>
                <span className="text-ink">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* mock dashboard card */}
        <Reveal delay={120}>
          <div className="relative">
            <div className="anim-morph absolute -inset-6 -z-10 bg-gradient-to-br from-primary/15 to-accent/15 blur-xl" />
            <div className="overflow-hidden rounded-3xl border border-line/70 bg-surface shadow-[0_30px_70px_-30px_rgba(12,74,110,0.4)]">
              <div className="flex items-center gap-2 border-b border-line/70 bg-bg/60 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-line" />
                <span className="h-3 w-3 rounded-full bg-line" />
                <span className="h-3 w-3 rounded-full bg-line" />
                <span className="ml-3 font-mono text-xs text-ink-soft">
                  bank.microbiomebank.com
                </span>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs text-ink-soft">VIABILITY</div>
                    <div className="text-2xl font-bold text-gradient">99.99%</div>
                  </div>
                  <span className="rounded-full bg-accent/12 px-3 py-1 font-mono text-xs text-accent">
                    ● live
                  </span>
                </div>
                {/* animated equalizer bars */}
                <div className="flex h-24 items-end gap-1.5 rounded-xl bg-bg/70 p-3">
                  {[40, 62, 48, 75, 58, 88, 66, 95, 72, 84, 60, 78].map((h, i) => (
                    <span
                      key={i}
                      className="anim-bob flex-1 rounded-sm bg-gradient-to-t from-primary to-glow"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["Freezers", "24"],
                    ["Strains", "48K"],
                    ["Requests", "312"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-line/70 p-3">
                      <div className="font-mono text-[10px] uppercase text-ink-soft">
                        {k}
                      </div>
                      <div className="mt-1 text-lg font-semibold">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
