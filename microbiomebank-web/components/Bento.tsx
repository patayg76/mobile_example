import { bento } from "@/lib/content";
import { Icons, type IconName } from "./icons";
import { Reveal } from "./Reveal";

export function Bento() {
  return (
    <section id="why" className="scroll-mt-20 bg-surface py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            Why MicrobiomeBank
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Infrastructure you can trust your collection to
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {bento.map((b, i) => {
            const Glyph = Icons[b.icon as IconName];
            return (
              <Reveal
                key={b.title}
                delay={i * 80}
                className={`group relative overflow-hidden rounded-3xl border border-line/70 bg-bg p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 ${b.span}`}
              >
                <div className="anim-morph absolute -right-10 -top-10 h-32 w-32 bg-gradient-to-br from-primary/10 to-accent/10 transition-opacity duration-300 group-hover:opacity-80" />
                <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20">
                  <Glyph className="h-6 w-6" />
                </span>
                <h3 className="relative mt-5 text-xl font-semibold">{b.title}</h3>
                <p className="relative mt-2 max-w-md text-ink-soft">{b.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
