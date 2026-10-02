import type { Metadata } from "next";
import { parseParams } from "@/lib/brand";
import { SiteProvider } from "@/components/SiteProvider";
import { ChatRoot } from "@/components/chat/ChatRoot";
import { Ribbon } from "@/components/landing/Ribbon";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Treatments } from "@/components/landing/Treatments";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Membership } from "@/components/landing/Membership";
import { Testimonials } from "@/components/landing/Testimonials";
import { Visit } from "@/components/landing/Visit";
import { Footer } from "@/components/landing/Footer";

export async function generateMetadata({ searchParams }: PageProps<"/">): Promise<Metadata> {
  const config = parseParams(await searchParams);
  if (config.isDefaultBrand) return {};
  const title = `${config.brand} · Miami Med Spa`;
  return { title, openGraph: { title }, twitter: { title } };
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const config = parseParams(await searchParams);

  return (
    <SiteProvider config={config}>
      <Ribbon />
      <Nav />
      <main>
        <Hero />
        <Treatments />
        <HowItWorks />
        <Membership />
        <Testimonials />
        <Visit />
      </main>
      <Footer />
      <ChatRoot />
    </SiteProvider>
  );
}
