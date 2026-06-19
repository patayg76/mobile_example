import { cta } from "@/lib/content";
import { Icons } from "./icons";
import { MicrobeField } from "./MicrobeField";
import { Reveal } from "./Reveal";

export function CTA() {
  return (
    <section id="contact" className="scroll-mt-20 px-5 py-20 sm:px-8">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-deep px-6 py-16 text-center text-white sm:px-12 sm:py-20">
        <div className="anim-gradient absolute inset-0 -z-10 opacity-90 [background:radial-gradient(50%_60%_at_20%_20%,rgba(34,211,238,0.3),transparent),radial-gradient(50%_60%_at_80%_30%,rgba(16,185,129,0.25),transparent),linear-gradient(180deg,#0a3a5c,#041f33)]" />
        <MicrobeField className="-z-10 opacity-60" />

        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          {cta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{cta.body}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={cta.primary.href}
            className="shimmer inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-deep transition-transform duration-200 hover:-translate-y-0.5"
          >
            {cta.primary.label}
            <Icons.arrow className="h-4 w-4" />
          </a>
          <a
            href={cta.secondary.href}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-white/10"
          >
            {cta.secondary.label}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
