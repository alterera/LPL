import "./globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon/favicon-96x96.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="font-custom antialiased">
        <Navbar />
        <main className="pt-24">
        <NextTopLoader color="#FF0000"/>
          {children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
