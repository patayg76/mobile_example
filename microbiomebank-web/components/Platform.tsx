import { platform } from "@/lib/content";
import { Icons } from "./icons";
import { Reveal } from "./Reveal";

export function Platform() {
  return (
    <section id="platform" className="scroll-mt-20 bg-surface py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <span className="eyebrow">{platform.eyebrow}</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-secondary sm:text-5xl">
            {platform.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{platform.body}</p>
          <ul className="mt-8 space-y-4">
            {platform.points.map((point, i) => (
              <li
                key={point}
                className="reveal is-in flex items-start gap-3.5"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-primary/12 text-primary">
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
            <span className="glow left-[10%] top-[6%] -z-10 h-64 w-64 bg-[color-mix(in_oklab,var(--color-primary)_45%,transparent)] opacity-25" />
            <div className="card overflow-hidden p-0">
              <div className="flex items-center gap-2 border-b border-line/70 bg-bg/50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-line" />
                <span className="h-3 w-3 rounded-full bg-line" />
                <span className="h-3 w-3 rounded-full bg-line" />
                <span className="ml-3 font-mono text-xs text-ink-soft">
                  microbiomebank.com
                </span>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-ink-soft">
                      Diverzitás-index
                    </div>
                    <div className="mt-1 font-display text-3xl font-semibold text-gradient">
                      magas
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> élő
                  </span>
                </div>
                {/* animated diversity bars */}
                <div className="flex h-28 items-end gap-1.5 rounded-2xl bg-bg/60 p-3">
                  {[40, 62, 48, 75, 58, 88, 66, 95, 72, 84, 60, 78].map((h, i) => (
                    <span
                      key={i}
                      className="anim-bob flex-1 rounded-sm bg-gradient-to-t from-primary to-lime"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["Törzsek", "1200+"],
                    ["Sarzs", "egyedi"],
                    ["Kiszállítás", "72 ó"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-line/70 bg-surface p-3">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                        {k}
                      </div>
                      <div className="mt-1 font-display text-lg font-semibold text-secondary">
                        {v}
                      </div>
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
