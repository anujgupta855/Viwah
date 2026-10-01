"use client";

import { useEffect, useState } from "react";
import AdminShell, {
  Card,
  PageHeader,
} from "../../../components/admin/admin-shell";

const statuses = ["new", "read", "contacted", "closed"];

export default function Enquiries() {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const r = await fetch("/api/admin/enquiries", {
      cache: "no-store",
    });

    if (r.ok) {
      setItems((await r.json()).items);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function update(id: string, status: string, source?: string) {
    // ContactMessage currently has no status-update API.
    // Only update normal Enquiry records.
    if (source === "contact") return;

    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    load();
  }

  return (
    <AdminShell>
      <PageHeader
        title="Enquiries"
        description="Track incoming enquiries and contact messages from couples."
      />

      <div className="grid gap-4">
        {items.map((e) => (
          <Card key={`${e.source || "enquiry"}-${e._id}`} className="p-5">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-serif text-2xl">{e.name}</h2>

                  <span className="rounded-full bg-[#f1e6cf] px-3 py-1 text-xs capitalize text-[#8a6a2f]">
                    {e.status || "new"}
                  </span>

                  <span className="rounded-full border border-black/10 px-3 py-1 text-xs capitalize text-black/55">
                    {e.source === "contact"
                      ? "Contact"
                      : e.vendor?.name
                        ? "Vendor"
                        : e.venue?.name
                          ? "Venue"
                          : "General"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-black/45">
                  {e.email} · {e.phone}
                </p>

                {e.subject && (
                  <p className="mt-4 text-sm font-semibold text-black/75">
                    Subject: {e.subject}
                  </p>
                )}

                <p className="mt-3 text-sm leading-6 text-black/70">
                  {e.message}
                </p>

                <p className="mt-3 text-xs text-black/40">
                  {e.vendor?.name ||
                    e.venue?.name ||
                    "General enquiry"}

                  {e.eventDate
                    ? ` · Event ${new Date(
                        e.eventDate
                      ).toLocaleDateString()}`
                    : ""}

                  {" · Received "}
                  {new Date(e.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {e.source === "contact" ? (
                  <span className="rounded-xl border border-black/10 px-3 py-2 text-sm text-black/45">
                    Contact message
                  </span>
                ) : (
                  <select
                    value={e.status || "new"}
                    onChange={(ev) =>
                      update(
                        e._id,
                        ev.target.value,
                        e.source
                      )
                    }
                    className="rounded-xl border px-3 py-2 text-sm"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </Card>
        ))}

        {!items.length && (
          <Card className="p-10 text-center text-black/45">
            No enquiries yet.
          </Card>
        )}
      </div>
    </AdminShell>
  );
}