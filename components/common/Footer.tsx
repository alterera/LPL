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
    <footer className="text-slate-900">
      <div className="">
        <div className="bg-linear-to-br from-[#FCF8F1] via-white to-[#FFE8C7]/80 p-10 shadow-lg shadow-amber-100/50">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Laharighat Premier League"
                  width={56}
                  height={56}
                  className="rounded-2xl bg-white p-2 shadow"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-600">
                    LPL 2025
                  </p>
                  <h3 className="text-xl font-semibold">
                    Laharighat Premier League
                  </h3>
                </div>
              </Link>
              <p className="text-base text-slate-600">
                A modern tournament experience for Assam’s cricket community.
                Register teams, follow fixtures, and celebrate every match with
    dedicated coverage.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-amber-300 hover:text-amber-600"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                  Navigate
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {primaryLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 hover:text-slate-900"
                      >
                        <span className="h-1 w-1 rounded-full bg-amber-500" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                  Support
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {supportLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 hover:text-slate-900"
                      >
                        <span className="h-1 w-1 rounded-full bg-amber-500" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                  Contact
                </p>
                <div className="mt-4 space-y-4">
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
                        className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 shadow-sm transition hover:border-amber-200"
                      >
                        <Icon className="mt-1 h-4 w-4 text-amber-600" />
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            {contact.type}
                          </p>
                          <p className="mt-1 font-medium text-slate-900">
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

          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-500 shadow-inner sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()} Laharighat Premier League. All
              rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wide">
              <Link href="/legal/privacy" className="hover:text-slate-900">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/legal/terms" className="hover:text-slate-900">
                Terms
              </Link>
              <span>•</span>
              <Link href="/legal/cookies" className="hover:text-slate-900">
                Cookies
              </Link>
              <span className="hidden sm:inline">•</span>
              <span className="text-slate-400">Alterera Networks</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
