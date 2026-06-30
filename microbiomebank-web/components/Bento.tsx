import { bento } from "@/lib/content";
import { Icons, type IconName } from "./icons";
import { Reveal } from "./Reveal";

export function Bento() {
  return (
    <section id="why" className="scroll-mt-20 bg-surface py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">Miért a MicroBiome Bank</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-secondary sm:text-5xl">
            Amire bízhatja az egészségét
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {bento.map((b, i) => {
            const Glyph = Icons[b.icon as IconName];
            const featured = b.span.includes("col-span-2");
            return (
              <Reveal
                key={b.title}
                delay={i * 80}
                className={`group relative overflow-hidden rounded-[1.25rem] p-8 transition-all duration-500 hover:-translate-y-1 ${b.span} ${
                  featured
                    ? "text-white [background:radial-gradient(120%_140%_at_0%_0%,#1e3d2a,#14302a)] shadow-[0_30px_70px_-40px_rgba(20,48,42,0.9)]"
                    : "card"
                }`}
              >
                {featured && (
                  <span className="anim-breathe absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-lime)_55%,transparent),transparent)] opacity-40" />
                )}
                <span
                  className={`relative grid h-12 w-12 place-items-center rounded-xl ${
                    featured
                      ? "border border-white/15 bg-white/10 text-lime"
                      : "icon-tile"
                  }`}
                >
                  <Glyph className="h-6 w-6" />
                </span>
                <h3
                  className={`relative mt-6 font-display text-xl font-semibold tracking-tight ${
                    featured ? "text-white" : "text-secondary"
                  }`}
                >
                  {b.title}
                </h3>
                <p
                  className={`relative mt-2.5 max-w-md leading-relaxed ${
                    featured ? "text-white/70" : "text-ink-soft"
                  }`}
                >
                  {b.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
