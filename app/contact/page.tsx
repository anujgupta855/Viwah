"use client";
import { useState } from "react";import { Mail,MapPin,Phone } from "lucide-react";
export default function ContactPage(){const [message,setMessage]=useState("");const [loading,setLoading]=useState(false);async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setMessage("");const body=Object.fromEntries(new FormData(e.currentTarget).entries());try{const r=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.message);setMessage(d.message);e.currentTarget.reset()}catch(err){setMessage(err instanceof Error?err.message:"Unable to send message.")}finally{setLoading(false)}}return <main className="min-h-screen bg-ivory px-5 pb-24 pt-32 sm:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Say hello</p><h1 className="mt-3 font-display text-5xl">Let's plan something beautiful.</h1><p className="mt-6 leading-8 text-charcoal/60">Have a question, need help choosing a vendor, or want to discuss your wedding? Our team would love to hear from you.</p>
<div className="mt-10 space-y-5">
  <p className="flex gap-3">
    <Mail className="text-gold" />
    hello@viwah.com
  </p>

  <p className="flex gap-3">
    <Phone className="text-gold" />
    +91 8840657276
  </p>

  <p className="flex gap-3">
    <Phone className="text-gold" />
    +91 9517689391
  </p>

  <p className="flex gap-3">
    <MapPin className="text-gold" />
    Lucknow, India
  </p>
</div>
</div><form onSubmit={submit} className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8"><div className="grid gap-4 sm:grid-cols-2"><input name="name" required placeholder="Name" className="field"/><input name="email" required type="email" placeholder="Email" className="field"/><input name="phone" required placeholder="Phone" className="field"/><input name="subject" required placeholder="Subject" className="field"/></div><textarea name="message" required minLength={10} placeholder="Your message" className="field mt-4 min-h-44 w-full resize-none"/><button disabled={loading} className="mt-4 rounded-full bg-gold px-7 py-3.5 font-semibold text-white disabled:opacity-60">{loading?"Sending...":"Send message"}</button>{message&&<p className="mt-4 text-sm text-charcoal/65">{message}</p>}</form></div></main>}
