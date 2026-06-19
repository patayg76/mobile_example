import { stats } from "@/lib/content";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";

export function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line/70 bg-line/50 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 90}
            className="group relative bg-surface p-7 text-center sm:p-9"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-500 group-hover:scale-x-100" />
            <div className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              <span className="text-gradient">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </span>
            </div>
            <div className="mt-2 text-sm font-medium text-ink-soft">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
