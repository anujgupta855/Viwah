import Image from "next/image";
import { connectDB } from "@/lib/db";
import { Venue, Vendor } from "@/models";
import { VenueCard } from "@/components/marketplace/venue-card";
import { SearchPanel } from "@/components/marketplace/search-panel";
import Link from "next/link";
import { ArrowRight, Camera, ChefHat, Gem, Heart, Music2, Sparkles, Store, Users } from "lucide-react";

const categories = [
  { label: "Venues", icon: Store, href: "/venues" },
  { label: "Photographers", icon: Camera, href: "/vendors?category=photographer" },
  { label: "Makeup Artists", icon: Sparkles, href: "/vendors?category=makeup" },
  { label: "Decor", icon: Gem, href: "/vendors?category=decor" },
  { label: "Catering", icon: ChefHat, href: "/vendors?category=catering" },
  { label: "Mehendi", icon: Heart, href: "/vendors?category=mehendi" },
  { label: "DJs", icon: Music2, href: "/vendors?category=dj" }
];

export default async function HomePage() {
  const dbEnabled = Boolean(process.env.MONGODB_URI);
  let featuredVenues: any[] = [];
  let vendorCount = 0;
  if (dbEnabled) { try { await connectDB(); featuredVenues = await Venue.find({ status: "active", featured: true }).sort({ rating: -1 }).limit(3).lean(); vendorCount = await Vendor.countDocuments({ status: "active" }); } catch (error) { console.error("Home data load failed", error); } }
  return (
    <div>
      <section className="relative flex min-h-[780px] items-end overflow-hidden bg-charcoal pt-24">
        <Image src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85" alt="Elegant wedding celebration" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 md:pb-28">
          <div className="max-w-3xl text-white">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-gold">Your celebration, beautifully found</p>
            <h1 className="font-display text-5xl leading-[1.02] sm:text-6xl md:text-8xl">Find the people and places behind your perfect day.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-lg">Discover distinctive venues and trusted wedding professionals, curated to make planning feel effortless.</p>
          </div>
          <div className="mt-9"><SearchPanel /></div>
        </div>
      </section>

      <section className="bg-ivory px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Everything in one place</p><h2 className="mt-4 font-display text-4xl sm:text-5xl">Plan every detail with Viwah.</h2><p className="mt-5 text-charcoal/60">From the first venue visit to the final dance, discover the specialists who bring your celebration together.</p></div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">{categories.map(({ label, icon: Icon, href }) => <Link key={label} href={href} className="group rounded-3xl border border-charcoal/10 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-luxury"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ivory text-gold transition group-hover:bg-gold group-hover:text-white"><Icon size={20} /></div><div className="mt-4 text-sm font-medium">{label}</div></Link>)}</div>
        </div>
      </section>


      <section className="bg-ivory px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">From the marketplace</p><h2 className="mt-3 font-display text-4xl sm:text-5xl">Featured venues</h2></div><Link href="/venues" className="inline-flex items-center gap-2 font-semibold text-gold">View all venues <ArrowRight size={17}/></Link></div>
          {featuredVenues.length ? <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{featuredVenues.map((venue:any)=><VenueCard key={venue._id.toString()} venue={JSON.parse(JSON.stringify(venue))}/>)}</div> : <div className="mt-8 rounded-[2rem] bg-white p-10 text-center text-charcoal/55">Featured venues will appear here once the database is connected.</div>}
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]"><Image src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85" alt="Wedding couple" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" /></div>
          <div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Why Viwah</p><h2 className="mt-4 font-display text-4xl sm:text-5xl">A calmer way to plan a celebration that feels like you.</h2><p className="mt-6 leading-8 text-charcoal/65">Explore curated choices, compare what matters, connect with professionals and keep every important decision closer together.</p><div className="mt-8 grid grid-cols-2 gap-4"><div className="rounded-2xl bg-ivory p-5"><Users className="text-gold" size={22}/><div className="mt-3 font-semibold">Trusted pros</div><p className="mt-1 text-sm text-charcoal/55">Thoughtfully presented profiles.</p></div><div className="rounded-2xl bg-ivory p-5"><Sparkles className="text-gold" size={22}/><div className="mt-3 font-semibold">Curated discovery</div><p className="mt-1 text-sm text-charcoal/55">Beautiful options without the noise.</p></div></div><Link href="/about" className="mt-8 inline-flex items-center gap-2 font-semibold text-gold">Discover Viwah <ArrowRight size={18}/></Link></div>
        </div>
      </section>

      <section className="bg-charcoal px-5 py-20 text-white sm:px-8 md:py-24"><div className="mx-auto max-w-5xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Your wedding starts here</p><h2 className="mt-4 font-display text-4xl sm:text-6xl">Bring your vision together.</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-white/60">Find your venue, meet your dream team and start shaping a celebration worth remembering. {vendorCount > 0 ? `${vendorCount}+ professionals are ready to be discovered.` : "Explore the marketplace and find your team."}</p><Link href="/venues" className="mt-8 inline-flex rounded-full bg-gold px-7 py-3.5 font-semibold text-white transition hover:bg-[#b8944d]">Explore venues</Link></div></section>
    </div>
  );
}
