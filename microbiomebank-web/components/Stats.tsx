import { stats } from "@/lib/content";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";

export function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <Reveal className="card grid grid-cols-2 gap-y-10 px-6 py-10 sm:px-10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`relative px-2 text-center lg:px-6 ${
              i !== 0
                ? "lg:before:absolute lg:before:inset-y-1 lg:before:left-0 lg:before:w-px lg:before:bg-line"
                : ""
            }`}
          >
            <div className="font-display text-4xl font-semibold tracking-tight text-secondary sm:text-5xl">
              <span className="text-gradient">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </span>
            </div>
            <div className="mt-2 font-mono text-xs uppercase tracking-widest text-ink-soft">
              {s.label}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
