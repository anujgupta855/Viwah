"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  ["Home", "/"],
  ["Venues", "/venues"],
  ["Vendors", "/vendors"],
  ["Real Weddings", "/real-weddings"],
  ["About", "/about"],
  ["Contact", "/contact"]
] as const;

export function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 shadow-sm backdrop-blur-xl" : "bg-black/10 backdrop-blur-md"}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className={`font-display text-2xl font-semibold tracking-[0.18em] ${scrolled ? "text-charcoal" : "text-white"}`}>VIWAH</Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={`text-sm font-medium transition hover:text-gold ${scrolled ? "text-charcoal/80" : "text-white/90"}`}>{label}</Link>
          ))}
        </nav>
        <Link href="/contact" className="hidden rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold/10 transition hover:-translate-y-0.5 hover:bg-[#b8944d] lg:inline-flex">Plan Your Wedding</Link>
        <button aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className={`rounded-full p-2 lg:hidden ${scrolled ? "text-charcoal" : "text-white"}`}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="border-t border-black/5 bg-white px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map(([label, href]) => <Link onClick={() => setOpen(false)} key={href} href={href} className="rounded-xl px-3 py-3 text-charcoal transition hover:bg-ivory hover:text-gold">{label}</Link>)}
            <Link onClick={() => setOpen(false)} href="/contact" className="mt-2 rounded-xl bg-gold px-4 py-3 text-center font-semibold text-white">Plan Your Wedding</Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
