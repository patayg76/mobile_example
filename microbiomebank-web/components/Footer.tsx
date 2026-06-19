import { footer, site } from "@/lib/content";
import { Logo } from "./Header";

export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            {footer.blurb}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-block font-mono text-sm text-primary hover:underline"
          >
            {site.email}
          </a>
        </div>

        {footer.columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-ink/80 transition-colors hover:text-primary"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-ink-soft sm:flex-row sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-mono">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
