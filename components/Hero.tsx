import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FCF8F1] via-white to-[#FFE8C7] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,_rgba(253,230,138,0.45),_transparent)] lg:block" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="pt-30">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
              Season 2025
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Laharighat Premier League
            </h1>
            <p className="mt-6 text-lg text-slate-700">
              Register, compete, and celebrate the spirit of cricket with the
              region’s most anticipated league. Secure slots for your team,
              manage payments, and stay updated with fixtures in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#register"
                className="inline-flex items-center rounded-full bg-amber-500 px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                Register your team
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
                className="inline-flex items-center rounded-full border border-slate-300 px-8 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-900"
              >
                View schedule
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-6 text-left text-slate-900 sm:max-w-md">
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
            </dl>
          </div>

          <div className="relative">
            <div className="rounded-[32px] bg-white/80 p-4 shadow-2xl shadow-amber-100 backdrop-blur">
              <img
                className="w-full rounded-3xl object-cover"
                src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=900&q=80"
                alt="Cricket players celebrating a wicket"
                loading="lazy"
              />
            </div>
            <div className="absolute -left-6 -bottom-8 hidden rounded-2xl border border-amber-200 bg-white/90 px-5 py-4 text-sm font-semibold text-slate-900 shadow-lg lg:flex lg:flex-col">
              <span>Match Day</span>
              <span className="text-2xl">April 12</span>
              <span className="text-xs text-slate-500">Group stage opener</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
