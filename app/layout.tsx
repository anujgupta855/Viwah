import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNavbar } from "@/components/site/site-navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "VIWAH | Wedding Planning Marketplace",
  description: "Discover beautiful venues and trusted wedding professionals with VIWAH.",
  openGraph: {
    title: "VIWAH | Wedding Planning Marketplace",
    description: "A premium wedding planning marketplace for modern couples."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <SiteNavbar />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
