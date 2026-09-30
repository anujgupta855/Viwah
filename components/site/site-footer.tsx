import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-charcoal/10 bg-charcoal text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-3xl tracking-[0.16em]">VIWAH</div>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/65">A refined wedding marketplace helping couples discover venues and trusted wedding professionals for celebrations worth remembering.</p>
        </div>
        <div><h3 className="mb-4 font-semibold">Explore</h3><div className="flex flex-col gap-3 text-sm text-white/65"><Link href="/venues">Venues</Link><Link href="/vendors">Vendors</Link><Link href="/real-weddings">Real Weddings</Link></div></div>
        <div><h3 className="mb-4 font-semibold">Company</h3><div className="flex flex-col gap-3 text-sm text-white/65"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/admin/login">Partner Login</Link></div></div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/45">© {new Date().getFullYear()} VIWAH. All rights reserved.</div>
    </footer>
  );
}
