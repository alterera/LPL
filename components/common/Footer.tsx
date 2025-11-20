import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const primaryLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Why LPL", href: "/#why-us" },
  { name: "Gallery", href: "/#gallery" },
];

const supportLinks = [
  { name: "Register", href: "/register" },
  { name: "Fixtures", href: "/#schedule" },
  { name: "Contact", href: "/contact" },
  { name: "Code of conduct", href: "/docs/code-of-conduct.pdf" },
];

const contactDetails = [
  {
    type: "Email",
    value: "info@laharighatpremierleague.in",
    href: "mailto:info@laharighatpremierleague.in",
    icon: Mail,
  },
  {
    type: "Phone",
    value: "+91 91017 95134",
    href: "tel:+919101795134",
    icon: Phone,
  },
  {
    type: "Address",
    value: "Block Stadium, Laharighat, Assam 782127",
    href: "https://maps.google.com/?q=Laharighat+Block+Stadium",
    icon: MapPin,
  },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: Facebook },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl py-16 px-4 md:px-0">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <Link href="/" className="inline-flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Laharighat Premier League"
                width={56}
                height={56}
                className="rounded-2xl bg-white p-2 shadow-lg shadow-amber-200/20"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-400">
                  LPL 2025
                </p>
                <h3 className="text-xl font-semibold text-white">
                  Laharighat Premier League
                </h3>
              </div>
            </Link>
            <p className="text-base text-slate-300">
              A modern tournament experience for Assam’s cricket community.
              Register teams, track fixtures, and relive the best moments with studio-grade coverage.
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Stay updated
              </p>
              <p className="mt-2 text-slate-200">
                Get fixtures, ticket windows, and behind-the-scenes stories straight to your inbox.
              </p>
              <form className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none"
                />
                <Button className="rounded-full bg-amber-400 px-6 font-semibold text-slate-900 hover:bg-amber-300">
                  Subscribe
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-amber-300 hover:text-amber-300"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Navigate
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                {primaryLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 rounded-full py-1 transition hover:text-white"
                    >
                      <span className="h-1 w-1 rounded-full bg-amber-400" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Support
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 rounded-full py-1 transition hover:text-white"
                    >
                      <span className="h-1 w-1 rounded-full bg-amber-400" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Visit us
              </p>
              <div className="mt-5 space-y-4">
                {contactDetails.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <a
                      key={contact.type}
                      href={contact.href}
                      target={contact.type === "Address" ? "_blank" : undefined}
                      rel={
                        contact.type === "Address"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="flex items-start gap-3 text-sm text-slate-300 transition hover:border-amber-300 hover:text-white"
                    >
                      <Icon className="mt-1 h-4 w-4 text-amber-300" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          {contact.type}
                        </p>
                        <p className="mt-1 font-semibold text-white">
                          {contact.value}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Laharighat Premier League. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wide">
            <Link href="/legal/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/legal/terms" className="transition hover:text-white">
              Terms
            </Link>
            <span>•</span>
            <Link href="/legal/cookies" className="transition hover:text-white">
              Cookies
            </Link>
            <span className="hidden sm:inline">•</span>
            <span className="text-slate-500">
              Built by{" "}
              <Link href="https://alterera.net" className="hover:text-white" target="_blank" rel="noopener noreferrer">
                Alterera Networks
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
