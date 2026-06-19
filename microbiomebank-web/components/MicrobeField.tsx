/**
 * Decorative field of floating, breathing "microbes".
 * Pure CSS transforms (cheap on the GPU) + deterministic layout so it
 * renders identically on server and client. Marked aria-hidden.
 */
const cells = [
  { x: 8, y: 18, s: 130, d: 0, dur: 16, c: "var(--color-glow)" },
  { x: 78, y: 12, s: 90, d: 2, dur: 13, c: "var(--color-lime)" },
  { x: 62, y: 64, s: 170, d: 1, dur: 19, c: "var(--color-primary)" },
  { x: 22, y: 72, s: 110, d: 3, dur: 15, c: "var(--color-accent)" },
  { x: 90, y: 48, s: 70, d: 1.5, dur: 12, c: "var(--color-glow)" },
  { x: 44, y: 30, s: 60, d: 2.5, dur: 17, c: "var(--color-lime)" },
  { x: 33, y: 50, s: 48, d: 0.5, dur: 14, c: "var(--color-glow)" },
  { x: 70, y: 84, s: 80, d: 2, dur: 18, c: "var(--color-primary)" },
];

export function MicrobeField({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {cells.map((c, i) => (
        <span
          key={i}
          className="anim-float absolute block"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            animationDelay: `${c.d}s`,
            animationDuration: `${c.dur}s`,
          }}
        >
          <span
            className="anim-breathe block rounded-full"
            style={{
              width: c.s,
              height: c.s,
              background: `radial-gradient(circle at 35% 30%, ${c.c}, transparent 70%)`,
              opacity: 0.5,
              filter: "blur(2px)",
              animationDelay: `${c.d}s`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
