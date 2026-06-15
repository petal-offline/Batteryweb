import type { Metadata } from "next";
import { IBM_Plex_Sans, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kcel.pages.dev";

const displayFont = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KULDEEP COMMUNICATION & ELECTRONICS (KCEL)",
    template: "%s | KCEL"
  },
  description:
    "KCEL is a New Delhi based wholesaler and supplier of lithium-ion, NMC, and LFP battery cells for industrial and commercial buyers.",
  openGraph: {
    title: "KULDEEP COMMUNICATION & ELECTRONICS (KCEL)",
    description:
      "Industrial battery cell supply for lithium-ion, NMC, and LFP requirements.",
    url: siteUrl,
    siteName: "KCEL",
    images: [
      {
        url: "/images/battery-cells-lab.png",
        width: 1728,
        height: 864,
        alt: "Industrial battery cells arranged on a laboratory workbench"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
