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

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: Facebook },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

const footerMenuColumn1 = [
  { name: "Home", href: "/" },
  { name: "Register", href: "/register" },
  { name: "About Us", href: "#" },
  { name: "Contact Us", href: "/contact" },
];

const contactDetails = [
  {
    type: "Email",
    value: "info@balidungacricketclub.com",
    href: "mailto:info@balidungacricketclub.com",
    icon: Mail,
  },
  {
    type: "Phone",
    value: "+91 7002808282",
    href: "tel:+917002808282",
    icon: Phone,
  },
  {
    type: "Address",
    value: "HAB Industry, Balidunga, Assam 782127, India",
    href: "https://maps.google.com/?q=Balidunga+Assam+India",
    icon: MapPin,
  },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-green-900/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo.png"
                alt="Laharighat Premier League"
                width={120}
                height={50}
              />
            </Link>

            <div className="space-y-3">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                Laharighat Premier League
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Bringing cricket excellence to Assam. Join us for thrilling
                matches, community spirit, and unforgettable sporting moments.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg border-b border-gray-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerMenuColumn1.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg border-b border-gray-700 pb-2">
              Get in Touch
            </h3>

            <div className="space-y-4">
              {contactDetails.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <div key={index} className="group">
                    <a
                      href={contact.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-start gap-3"
                      target={contact.type === "Address" ? "_blank" : undefined}
                      rel={
                        contact.type === "Address"
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      <IconComponent className="w-4 h-4 mt-0.5 text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0" />
                      <span className="leading-relaxed">{contact.value}</span>
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Social Media Icons */}
            <div className="pt-4">
              <h4 className="text-white font-medium mb-3 text-sm">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:rotate-3"
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800/50 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Left side - Copyright */}
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                
                <span>
                  &copy; {new Date().getFullYear()} Laharighat Premier League
                </span>
              </div>
            </div>
            

            {/* Right side - Developer credit */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Developed by</span>
              <a
                href="https://alterera.net"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                
                <span className="text-blue-400 hover:text-white hover:underline font-medium transition-colors">
                  Alterera Networks
                </span>
              </a>
            </div>
          </div>

          {/* Additional info bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/30">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>Privacy Policy</span>
                <span>•</span>
                <span>Terms of Service</span>
                <span>•</span>
                <span>Cookie Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
