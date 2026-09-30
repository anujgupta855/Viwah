"use client";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

type Option = { label: string; value: number };
type Config = { venuePriceOptions: Option[]; vendorPriceOptions: Record<string, Option[]> };
const cities=["Delhi","Mumbai","Lucknow","Kanpur","Jaipur","Agra","Bangalore","Hyderabad","Chandigarh"];
const types=["Venues","Photographers","Makeup Artists","Decorators","Caterers","Mehendi Artists","DJs"];
const typeMap:Record<string,string>={Photographers:"Photographer","Makeup Artists":"Makeup Artist",Decorators:"Decorator",Caterers:"Caterer","Mehendi Artists":"Mehendi Artist",DJs:"DJ"};
const fallback:Config={venuePriceOptions:[{label:"Under ₹1L",value:100000},{label:"Under ₹2L",value:200000},{label:"Under ₹5L",value:500000},{label:"Under ₹10L",value:1000000}],vendorPriceOptions:{}};
export function SearchPanel(){
 const router=useRouter(); const [city,setCity]=useState(""); const [type,setType]=useState(""); const [budget,setBudget]=useState(""); const [config,setConfig]=useState<Config>(fallback);
 useEffect(()=>{fetch("/api/config",{cache:"no-store"}).then(r=>r.json()).then(setConfig).catch(()=>{})},[]);
 const category=typeMap[type]; const options=useMemo(()=>type==="Venues"||!type?config.venuePriceOptions:(config.vendorPriceOptions[category]||[]),[type,category,config]);
 const submit=()=>{const isVenue=type==="Venues"||!type;const p=new URLSearchParams();if(city)p.set("city",city);if(budget)p.set("maxPrice",budget);if(!isVenue&&category)p.set("category",category);router.push(`${isVenue?"/venues":"/vendors"}?${p.toString()}`)};
 return <div className="rounded-3xl border border-white/20 bg-white/95 p-3 shadow-2xl backdrop-blur-xl md:p-4"><div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
  <label className="rounded-2xl bg-ivory px-5 py-3"><span className="text-[11px] font-semibold uppercase tracking-widest text-charcoal/45">City</span><select value={city} onChange={e=>setCity(e.target.value)} className="mt-1 block w-full bg-transparent text-sm font-medium outline-none"><option value="">Choose a city</option>{cities.map(c=><option key={c}>{c}</option>)}</select></label>
  <label className="rounded-2xl bg-ivory px-5 py-3"><span className="text-[11px] font-semibold uppercase tracking-widest text-charcoal/45">Looking for</span><select value={type} onChange={e=>{setType(e.target.value);setBudget("")}} className="mt-1 block w-full bg-transparent text-sm font-medium outline-none"><option value="">Venue or professional</option>{types.map(t=><option key={t}>{t}</option>)}</select></label>
  <label className="rounded-2xl bg-ivory px-5 py-3"><span className="text-[11px] font-semibold uppercase tracking-widest text-charcoal/45">{type==="Caterers"?"Rate":"Budget"}</span><select value={budget} onChange={e=>setBudget(e.target.value)} className="mt-1 block w-full bg-transparent text-sm font-medium outline-none"><option value="">{type==="Caterers"?"Any rate":"Any budget"}</option>{options.map(o=><option value={o.value} key={`${o.value}-${o.label}`}>{o.label}</option>)}</select></label>
  <button onClick={submit} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gold px-7 font-semibold text-white transition hover:bg-[#b8944d]"><Search size={18}/>Search</button>
 </div></div>;
}
