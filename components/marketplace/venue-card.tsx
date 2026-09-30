import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Users, Star } from "lucide-react";

type Venue = { slug: string; name: string; city: string; location: string; images: string[]; startingPrice: number; capacity: number; rating: number; reviewCount: number; venueType: string };

export function VenueCard({ venue }: { venue: Venue }) {
  return <article className="group overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-luxury">
    <div className="relative aspect-[4/3] overflow-hidden">
      <Image src={venue.images[0]} alt={venue.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4"><span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold backdrop-blur">{venue.venueType}</span><button aria-label={`Save ${venue.name}`} className="rounded-full bg-white/90 p-2 text-charcoal backdrop-blur transition hover:text-gold"><Heart size={17}/></button></div>
    </div>
    <div className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-2xl">{venue.name}</h3><p className="mt-1 flex items-center gap-1 text-sm text-charcoal/55"><MapPin size={14}/> {venue.city}</p></div><div className="flex items-center gap-1 text-sm font-semibold"><Star size={15} className="fill-gold text-gold"/>{venue.rating.toFixed(1)}</div></div><div className="mt-5 flex items-center justify-between border-t border-charcoal/10 pt-4 text-sm"><span><strong>₹{venue.startingPrice.toLocaleString("en-IN")}</strong> <span className="text-charcoal/45">starting</span></span><span className="flex items-center gap-1 text-charcoal/55"><Users size={15}/> {venue.capacity}</span></div><Link href={`/venues/${venue.slug}`} className="mt-5 block rounded-full border border-gold/40 px-4 py-2.5 text-center text-sm font-semibold text-gold transition hover:bg-gold hover:text-white">View details</Link></div>
  </article>;
}
