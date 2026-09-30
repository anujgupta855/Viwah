"use client";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export function EnquiryForm({ vendorId, venueId, title = "Tell us about your wedding" }: { vendorId?: string; venueId?: string; title?: string }) {
  const [loading, setLoading] = useState(false); const [message, setMessage] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setLoading(true); setMessage(""); const form = new FormData(e.currentTarget); const body = Object.fromEntries(form.entries());
    try { const res = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, vendorId, venueId }) }); const data = await res.json(); if (!res.ok) throw new Error(data.message || "Something went wrong"); setMessage(data.message); e.currentTarget.reset(); } catch (err) { setMessage(err instanceof Error ? err.message : "Unable to submit enquiry."); } finally { setLoading(false); }
  }
  return <form onSubmit={submit} className="rounded-[2rem] bg-ivory p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Enquire</p><h3 className="mt-2 font-display text-3xl">{title}</h3><div className="mt-6 grid gap-4 sm:grid-cols-2"><input name="name" required placeholder="Your name" className="field"/><input name="email" type="email" required placeholder="Email address" className="field"/><input name="phone" required placeholder="Phone number" className="field"/><input name="eventDate" type="date" className="field"/></div><textarea name="message" required minLength={10} placeholder="Tell us about your wedding, guest count, dates or what you need..." className="field mt-4 min-h-32 w-full resize-none"/><button disabled={loading} className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-white transition hover:bg-[#b8944d] disabled:opacity-60">{loading ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>} {loading ? "Sending..." : "Send enquiry"}</button>{message && <p className="mt-4 text-sm font-medium text-charcoal/70">{message}</p>}</form>;
}
