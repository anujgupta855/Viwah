"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Building2, ClipboardList, LayoutDashboard, LogOut, MessageSquare, Settings, Store, Star, Menu, X } from "lucide-react";
import { useState } from "react";

const nav=[
  ["Dashboard","/admin",LayoutDashboard],
  ["Vendors","/admin/vendors",Store],
  ["Venues","/admin/venues",Building2],
  ["Reviews","/admin/reviews",Star],
  ["Enquiries","/admin/enquiries",MessageSquare],
  ["Settings","/admin/settings",Settings],
] as const;
export default function AdminShell({children}:{children:React.ReactNode}){
 const path=usePathname(); const router=useRouter(); const [open,setOpen]=useState(false);
 async function logout(){await fetch("/api/admin/logout",{method:"POST"});router.replace("/admin/login");router.refresh();}
 return <div className="min-h-screen bg-[#f6f4ef] text-[#222]">
  <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-black/10 bg-white p-5 transition-transform lg:translate-x-0 ${open?"translate-x-0":"-translate-x-full"}`}>
   <div className="flex items-center justify-between px-2 py-3"><Link href="/admin" className="font-serif text-3xl tracking-[.16em]">VIWAH</Link><button className="lg:hidden" onClick={()=>setOpen(false)}><X/></button></div>
   <p className="mb-7 px-2 text-xs uppercase tracking-[.2em] text-black/45">Admin Console</p>
   <nav className="space-y-1">{nav.map(([label,href,Icon])=><Link key={href} href={href} onClick={()=>setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${path===href|| (href!=="/admin"&&path.startsWith(href))?"bg-[#f1e6cf] text-[#8a6a2f]":"text-black/65 hover:bg-black/[.04]"}`}><Icon size={18}/>{label}</Link>)}</nav>
   <div className="absolute bottom-5 left-5 right-5 border-t pt-4"><button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 hover:bg-red-50"><LogOut size={18}/>Logout</button></div>
  </aside>
  <div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/90 px-5 backdrop-blur lg:px-8"><button className="lg:hidden" onClick={()=>setOpen(true)}><Menu/></button><div className="ml-auto flex items-center gap-3 text-sm"><span className="hidden text-black/50 sm:block">Viwah Admin</span><span className="grid h-9 w-9 place-items-center rounded-full bg-[#c8a45d] font-semibold text-white">V</span></div></header><main className="p-5 lg:p-8">{children}</main></div>
 </div>
}

export function PageHeader({title,description,action}:{title:string;description?:string;action?:React.ReactNode}){return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="font-serif text-4xl">{title}</h1>{description&&<p className="mt-2 max-w-2xl text-sm text-black/55">{description}</p>}</div>{action}</div>}
export function Card({children,className=""}:{children:React.ReactNode;className?:string}){return <div className={`rounded-2xl border border-black/8 bg-white shadow-[0_12px_40px_rgba(34,34,34,.05)] ${className}`}>{children}</div>}
