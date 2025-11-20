import "./globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "Laharighat Premier League",
    template: "%s | Laharighat Premier League",
  },
  description:
    "Laharighat Premier League - The premier cricket tournament in Assam. Register your team, track fixtures, and celebrate the spirit of cricket with the region's most anticipated league.",
  keywords: [
    "Laharighat Premier League",
    "LPL",
    "cricket tournament",
    "Assam cricket",
    "Laharighat",
    "cricket league",
    "sports tournament",
  ],
  authors: [{ name: "Laharighat Premier League" }],
  creator: "Laharighat Premier League",
  publisher: "Laharighat Premier League",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://laharighatpremierleague.in",
    title: "Laharighat Premier League",
    description:
      "The premier cricket tournament in Assam. Register your team and be part of the region's most anticipated league.",
    siteName: "Laharighat Premier League",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laharighat Premier League",
    description:
      "The premier cricket tournament in Assam. Register your team and be part of the region's most anticipated league.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-custom antialiased">
        <NextTopLoader color="#FF0000" />
        <Navbar />
        <main className="">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}