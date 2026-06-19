import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LogoMarquee } from "@/components/LogoMarquee";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Platform } from "@/components/Platform";
import { Bento } from "@/components/Bento";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <Stats />
        <Services />
        <Process />
        <Platform />
        <Bento />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
