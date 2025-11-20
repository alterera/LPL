import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#FCF8F1] via-white to-[#FFE8C7] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,_rgba(253,230,138,0.45),_transparent)] lg:block" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="pt-20 md:pt-30">
            <div className="group relative flex items-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] w-fit">
              <span
                className={cn(
                  "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                )}
                style={{
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box",
                }}
              />
              🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
              <AnimatedGradientText className="text-sm font-medium">
                Registration Open for 2025
              </AnimatedGradientText>
              <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </div>
            <div className="mt-6">
              <AnimatedGradientText
                speed={2}
                colorFrom="#FF512F"
                colorTo="#DD2476"
                className="text-4xl font-semibold tracking-tight"
              >
                Laharighat Premier League
              </AnimatedGradientText>
            </div>
            <p className="mt-6 text-lg text-slate-700">
              Register, compete, and celebrate the spirit of cricket with the
              region's most anticipated league. Secure slots for your team,
              manage payments, and stay updated with fixtures in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#register"
                className="inline-flex items-center rounded-full bg-[#CD0D08] px-8 py-3 text-base font-semibold text-white transition hover:bg-[#041F47] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                Register Now
                <svg
                  className="ml-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="#schedule"
                className="inline-flex items-center rounded-full border border-[#CD0D08] px-8 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-900"
              >
                Details
              </Link>
            </div>

            {/* <dl className="mt-10 grid grid-cols-2 gap-6 text-left text-slate-900 sm:max-w-md">
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-5 shadow-sm backdrop-blur">
                <dt className="text-sm font-medium text-slate-500">
                  Teams registered
                </dt>
                <dd className="mt-2 text-3xl font-bold">40+</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-5 shadow-sm backdrop-blur">
                <dt className="text-sm font-medium text-slate-500">
                  Prize pool
                </dt>
                <dd className="mt-2 text-3xl font-bold">₹5L+</dd>
              </div>
            </dl> */}
          </div>

          <div className="relative">
            <div className="rounded-[32px] bg-white/80 p-4 shadow-2xl shadow-amber-100 backdrop-blur">
              <img
                className="w-full rounded-3xl object-cover"
                src="/hero.png"
                alt="Cricket players celebrating a wicket"
                loading="lazy"
              />
            </div>
            <div className="absolute -left-6 -bottom-8 hidden rounded-2xl border border-amber-200 bg-white/90 px-5 py-4 text-sm font-semibold text-slate-900 shadow-lg lg:flex lg:flex-col">
              <span>Match Day</span>
              <span className="text-2xl">November 28</span>
              <span className="text-xs text-slate-500">Group stage opener</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
