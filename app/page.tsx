import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";

const reasons = [
  {
    title: "Transparent Processes",
    text: "Live tracking for fixtures, points tables, and player stats to keep teams informed.",
  },
  {
    title: "Digital Operations",
    text: "End-to-end online registration, payments, and verification with instant confirmations.",
  },
  {
    title: "Professional Broadcast",
    text: "High-quality highlights, social coverage, and on-ground MCs for a premium feel.",
  },
];

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=600&q=80",
    caption: "Under lights at LPL 2024",
  },
  {
    src: "https://images.unsplash.com/photo-1501436134208-0f242179561e?auto=format&fit=crop&w=600&q=80",
    caption: "Captains' meet",
  },
  {
    src: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=600&q=80",
    caption: "Community supporters",
  },
  {
    src: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=600&q=80",
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
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
                <Link href="#schedule">Download brochure</Link>
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
                Across senior, U-19, and women’s brackets
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
      <section
        id="why-us"
        className="border-t border-slate-100 bg-white py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
          <div className="sm:flex sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                Why choose us
              </p>
              <h2 className="mt-4 text-3xl font-bold">
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
                <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200 ring-offset-2" />
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
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                Our gallery
              </p>
              <h2 className="mt-4 text-3xl font-bold">Moments worth reliving.</h2>
            </div>
            <Link
              href="#"
              className="text-sm font-semibold text-amber-700 hover:underline"
            >
              Follow us on Instagram
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item) => (
              <figure
                key={item.caption}
                className="overflow-hidden rounded-3xl bg-white shadow-lg"
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  className="h-56 w-full object-cover transition duration-300 hover:scale-105"
                />
                <figcaption className="px-4 py-3 text-sm text-slate-600">
                  {item.caption}
                </figcaption>
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
            <Button size="lg" className="rounded-full bg-amber-400 text-slate-900">
              Start registration
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-white text-white hover:bg-white/10"
            >
              Download regulations
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
