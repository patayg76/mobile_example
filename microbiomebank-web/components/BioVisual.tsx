/**
 * BioVisual — a scientifically-grounded microbiology graphic system.
 *
 * Pure inline SVG (no images, no 3D, no animation library). Renders a small,
 * curated set of *accurate* bacterial morphologies — coccus cluster, bacillus,
 * spirillum, flagellated rod — inside a soft culture field, plus a relative
 * abundance read-out. Motion is Linear-style and GPU-cheap: a one-time stroke
 * "draw-in", slow group drift, and a rotating guide ring. Fully decorative,
 * so it is marked aria-hidden and respects prefers-reduced-motion via globals.
 */
export function BioVisual({ className = "" }: { className?: string }) {
  const stroke = "var(--color-secondary)";
  const soft = "var(--color-primary)";

  return (
    <svg
      aria-hidden
      viewBox="0 0 440 440"
      className={`h-auto w-full ${className}`}
      fill="none"
    >
      {/* ---- soft culture field ---- */}
      <defs>
        <radialGradient id="bv-field" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="var(--color-lime)" stopOpacity="0.18" />
          <stop offset="60%" stopColor="var(--color-primary)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="220" cy="206" r="180" fill="url(#bv-field)" />

      {/* ---- rotating measurement / guide rings (slow) ---- */}
      <g
        className="anim-spin-slow"
        style={{ transformOrigin: "220px 206px" }}
        stroke={soft}
        strokeOpacity="0.28"
      >
        <circle cx="220" cy="206" r="168" strokeDasharray="2 9" strokeWidth="1.5" />
        <circle cx="220" cy="206" r="120" strokeDasharray="1 14" strokeWidth="1.5" />
      </g>

      {/* ===========================================================
          Accurate morphologies. Each group drifts gently + draws in.
          =========================================================== */}

      {/* Coccus cluster (staphylococcus) — top */}
      <g
        className="anim-drift"
        style={{ animationDelay: "0s" }}
        stroke={stroke}
        strokeWidth="2"
      >
        {[
          [206, 92],
          [228, 84],
          [246, 100],
          [222, 108],
          [240, 122],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="11" fill="var(--color-surface)" />
            <circle cx={cx} cy={cy} r="11" />
            <circle cx={cx} cy={cy} r="3" fill={soft} stroke="none" />
          </g>
        ))}
      </g>

      {/* Bacillus (rod) with internal nucleoid — right */}
      <g
        className="anim-drift"
        style={{ animationDelay: "1.1s" }}
        stroke={stroke}
        strokeWidth="2"
      >
        <rect x="296" y="176" width="86" height="34" rx="17" fill="var(--color-surface)" />
        <rect x="296" y="176" width="86" height="34" rx="17" />
        <path
          d="M312 193h54"
          stroke={soft}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="2 8"
        />
      </g>

      {/* Spirillum (spiral) — left */}
      <g
        className="anim-drift"
        style={{ animationDelay: "0.5s" }}
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <path
          className="anim-draw"
          style={{ strokeDasharray: 220, strokeDashoffset: 220 }}
          d="M58 250c14-20 30 4 44-14s30 4 44-14 30 4 44-14"
        />
      </g>

      {/* Flagellated rod (motile bacterium) — bottom */}
      <g
        className="anim-drift"
        style={{ animationDelay: "1.6s" }}
        stroke={stroke}
        strokeWidth="2"
      >
        <ellipse cx="196" cy="318" rx="30" ry="15" fill="var(--color-surface)" />
        <ellipse cx="196" cy="318" rx="30" ry="15" />
        <path
          className="anim-draw"
          style={{ strokeDasharray: 90, strokeDashoffset: 90, animationDelay: "0.4s" }}
          d="M226 318c12 0 10 9 20 9s10-9 20-9 9 8 18 8"
          strokeLinecap="round"
        />
      </g>

      {/* Central helix node — sequencing motif (anchor element) */}
      <g stroke={stroke} strokeWidth="2.2" strokeLinecap="round">
        <circle cx="220" cy="212" r="34" fill="var(--color-surface)" />
        <circle cx="220" cy="212" r="34" stroke={soft} strokeOpacity="0.5" />
        <path d="M209 196c0 8 22 10 22 18s-22 10-22 18" stroke={soft} />
        <path d="M231 196c0 8-22 10-22 18s22 10 22 18" stroke={soft} />
        <path d="M211 201h18M210 212h20M211 223h18" strokeWidth="1.6" strokeOpacity="0.7" />
      </g>

      {/* ---- relative abundance read-out (microbiome diversity) ---- */}
      <g transform="translate(132 372)">
        {[34, 22, 46, 16, 30].map((w, i) => {
          const x = [0, 40, 70, 122, 144][i];
          const greens = [
            "var(--color-secondary)",
            "var(--color-primary)",
            "var(--color-accent)",
            "var(--color-lime)",
            "var(--color-glow)",
          ];
          return (
            <rect
              key={i}
              x={x}
              y="0"
              width={w}
              height="8"
              rx="4"
              fill={greens[i]}
            />
          );
        })}
        <text
          x="0"
          y="-12"
          fontSize="11"
          fontFamily="var(--font-mono)"
          letterSpacing="0.12em"
          fill="var(--color-ink-soft)"
        >
          STRAIN DIVERSITY
        </text>
      </g>
    </svg>
  );
}
