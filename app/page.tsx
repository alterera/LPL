import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import Image from "next/image";

const reasons = [
  {
    title: "Transparent Processes",
    icon: "/icons/processing.svg",
    text: "Live tracking for fixtures, points tables, and player stats to keep teams informed.",
  },
  {
    title: "Digital Operations",
    icon: "/icons/impression.svg",
    text: "End-to-end online registration, payments, and verification with instant confirmations.",
  },
  {
    title: "Professional Broadcast",
    icon: "/icons/broadcast.svg",
    text: "High-quality highlights, social coverage, and on-ground MCs for a premium feel.",
  },
];

const gallery = [
  {
    src: "/gallery/gallery-4.png",
    caption: "Under lights at LPL 2024",
  },
  {
    src: "/gallery/gallery-1.jpg",
    caption: "Captains' meet",
  },
  {
    src: "/gallery/gallery-2.jpg",
    caption: "Community supporters",
  },
  {
    src: "/gallery/gallery-3.jpg",
    caption: "Trophy unveiling",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 text-slate-900">
      <Hero />

      {/* About Section */}
      <section
        id="about"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-12"
      >
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#CD0D08]">
              About us
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              The beating heart of cricket in Laharighat.
            </h2>
            <p className="mt-6 text-lg text-slate-600">
              Laharighat Premier League is a community-first tournament that
              connects players, franchises, and fans every summer. We simplify
              registrations, logistics, and storytelling so athletes can focus
              on the sport.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="#register">
                  Meet the organizers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                size="lg"
                className="rounded-full border-slate-300 px-8 text-slate-900"
              >
                <Link href="#schedule">Brochure</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-wide text-slate-500">
                Teams hosted
              </p>
              <p className="mt-4 text-4xl font-bold">80+</p>
              <p className="mt-2 text-sm text-slate-500">
                Across senior, U-19, and state level
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-wide text-slate-500">
                Live audience
              </p>
              <p className="mt-4 text-4xl font-bold">12K</p>
              <p className="mt-2 text-sm text-slate-500">
                In-stadium fans, 300K+ digital impressions
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-lg sm:col-span-2">
              <p className="text-sm uppercase tracking-wide text-slate-500">
                Impact initiatives
              </p>
              <p className="mt-4 text-2xl font-semibold">Coaching clinics</p>
              <p className="mt-2 text-sm text-slate-500">
                Free weekend nets and workshops by BCCI-accredited coaches for
                grassroots players.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="border-t border-slate-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
          <div className="sm:flex sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#CD0D08]">
                Why choose us
              </p>
              <h2 className="mt-4 text-3xl font-bold text-[#041F47]">
                Built for teams, fans, and partners.
              </h2>
            </div>
            <Button variant="ghost" asChild className="mt-6 sm:mt-0">
              <Link href="#contact" className="flex items-center gap-2">
                Talk to our team <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reasons.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-slate-100 bg-slate-50/60 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:bg-white"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200 ring-offset-2">
                  <Image
                    src={item.icon}
                    height={32}
                    width={32}
                    alt={`${item.title} icon`}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#CD0D08]">
                Our gallery
              </p>
              <h2 className="mt-4 text-3xl font-bold text-[#041F47]">
                Moments worth reliving.
              </h2>
            </div>
            <Link
              href="#"
              className="text-sm font-semibold text-[#CD0D08] hover:underline"
            >
              Follow us on Instagram
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item) => (
              <figure
                key={item.caption}
                className="overflow-hidden rounded-xl bg-white shadow-md"
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  className="h-56 w-full object-cover transition duration-300 hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="register"
        className="border-t border-slate-100 bg-slate-900 py-16 text-white"
      >
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            Join the league
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Ready to lock your squad for LPL 2025?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200">
            Early bird slots close on 5 January. Confirm your team, upload
            player documents, and manage payments from a single dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={"/register"}>
              <Button
                size="lg"
                className="rounded-full hover:bg-amber-400 bg-[#CD0D08] text-white"
              >
                Start registration
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
