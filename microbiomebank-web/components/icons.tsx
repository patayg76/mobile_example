import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Icons = {
  vault: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 8.8v-1M12 16.2v-1M15.2 12h1M7.8 12h-1" />
    </svg>
  ),
  microscope: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M6 18h10M9 18v-3" />
      <path d="M9.5 15a4 4 0 0 0 6.5-3.1 4 4 0 0 0-2.3-3.6" />
      <path d="m10 6 3.2-2 2 3.2-3.2 2z" />
      <path d="m9 9 1.5 1.5" />
      <path d="M5 21h12" />
    </svg>
  ),
  dna: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M8 3c0 4 8 6 8 9s-8 5-8 9" />
      <path d="M16 3c0 4-8 6-8 9s8 5 8 9" />
      <path d="M9.5 6h5M9.5 18h5M8.4 9h7.2M8.4 15h7.2" />
    </svg>
  ),
  shield: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  badge: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="9" r="6" />
      <path d="m9 13-2 7 5-3 5 3-2-7" />
      <path d="m9.5 9 1.7 1.7L15 7.2" />
    </svg>
  ),
  snow: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 3v18M5 7l14 10M19 7 5 17" />
      <path d="M12 6 9.5 4M12 6l2.5-2M12 18l-2.5 2M12 18l2.5 2" />
    </svg>
  ),
  globe: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9c-2.5-2.4-4-5.6-4-9s1.5-6.6 4-9z" />
    </svg>
  ),
  code: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4M13 6l-2 12" />
    </svg>
  ),
  arrow: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  spark: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4z" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  ),
  menu: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  close: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  quote: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M10 11H6a2 2 0 0 1 2-4M18 11h-4a2 2 0 0 1 2-4" />
      <path d="M6 11v3a2 2 0 0 0 2 2M14 11v3a2 2 0 0 0 2 2" />
    </svg>
  ),
};

export type IconName = keyof typeof Icons;

export function Icon({ name, ...props }: { name: IconName } & IconProps) {
  const Cmp = Icons[name];
  return <Cmp {...props} />;
}
