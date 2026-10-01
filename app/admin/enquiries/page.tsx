"use client";

import { useEffect, useState } from "react";

import AdminShell, {
  Card,
  PageHeader,
} from "../../../components/admin/admin-shell";

import {
  Check,
  X,
  Trash2,
  Eye,
  Phone,
  Mail,
  CalendarDays,
  User,
  MessageSquare,
  XCircle,
} from "lucide-react";

type Enquiry = {
  _id: string;
  source: "contact" | "enquiry";
  name: string;
  email: string;
  phone: string;
  subject?: string | null;
  message: string;
  status: string;
  createdAt: string;
  eventDate?: string | null;
  vendor?: { name: string } | null;
  venue?: { name: string } | null;
};

const contactStatuses = [
  "new",
  "read",
  "accepted",
  "rejected",
  "replied",
  "closed",
];

const enquiryStatuses = [
  "new",
  "read",
  "accepted",
  "rejected",
  "contacted",
  "closed",
];

export default function Enquiries() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setLoading(true);

      const r = await fetch("/api/admin/enquiries", {
        cache: "no-store",
      });

      if (!r.ok) {
        throw new Error("Unable to load enquiries");
      }

      const data = await r.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Load enquiries:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(
    item: Enquiry,
    status: string
  ) {
    setBusy(true);

    try {
      const r = await fetch(
        `/api/admin/enquiries/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            source: item.source,
          }),
        }
      );

      if (!r.ok) {
        throw new Error("Unable to update status");
      }

      /*
       * Accepted / Rejected enquiries are no longer
       * active, so remove them from this page.
       */
      if (
        status === "accepted" ||
        status === "rejected"
      ) {
        setItems((current) =>
          current.filter(
            (x) =>
              !(
                x._id === item._id &&
                x.source === item.source
              )
          )
        );

        setSelected(null);
        return;
      }

      /*
       * Read / Contacted / Replied / Closed:
       * keep the enquiry in the list and update status.
       */
      setItems((current) =>
        current.map((x) =>
          x._id === item._id &&
          x.source === item.source
            ? { ...x, status }
            : x
        )
      );

      setSelected((current) =>
        current &&
        current._id === item._id &&
        current.source === item.source
          ? { ...current, status }
          : current
      );
    } catch (error) {
      console.error(
        "Unable to update enquiry status:",
        error
      );

      alert("Unable to update enquiry.");
    } finally {
      setBusy(false);
    }
  }

  async function openEnquiry(item: Enquiry) {
    setSelected(item);

    /*
     * First time opening a new enquiry:
     * automatically mark it as read.
     */
    if (item.status === "new") {
      await updateStatus(item, "read");
    }
  }

  async function deleteEnquiry(item: Enquiry) {
    const confirmed = window.confirm(
      `Delete this enquiry from ${item.name}? This cannot be undone.`
    );

    if (!confirmed) return;

    setBusy(true);

    try {
      const r = await fetch(
        `/api/admin/enquiries/${item._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: item.source,
          }),
        }
      );

      if (!r.ok) {
        throw new Error("Unable to delete");
      }

      setItems((current) =>
        current.filter(
          (x) =>
            !(
              x._id === item._id &&
              x.source === item.source
            )
        )
      );

      setSelected(null);
    } catch (error) {
      console.error("Delete enquiry:", error);
      alert("Unable to delete enquiry.");
    } finally {
      setBusy(false);
    }
  }

  function sourceLabel(item: Enquiry) {
    if (item.source === "contact") return "Contact";

    if (item.vendor?.name) return "Vendor";

    if (item.venue?.name) return "Venue";

    return "General";
  }

  function targetName(item: Enquiry) {
    return (
      item.vendor?.name ||
      item.venue?.name ||
      "General enquiry"
    );
  }

  function statusClass(status: string) {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "read":
        return "bg-blue-100 text-blue-700";

      case "contacted":
      case "replied":
        return "bg-purple-100 text-purple-700";

      case "closed":
        return "bg-black/10 text-black/55";

      default:
        return "bg-[#f1e6cf] text-[#8a6a2f]";
    }
  }

  return (
    <AdminShell>
      <PageHeader
        title="Enquiries"
        description="Manage incoming enquiries and contact messages from couples."
      />

      <div className="grid gap-4">
        {loading ? (
          <Card className="p-10 text-center text-black/45">
            Loading enquiries...
          </Card>
        ) : (
          <>
            {items.map((e) => (
              <div
                key={`${e.source}-${e._id}`}
                onClick={() => openEnquiry(e)}
                className="cursor-pointer"
              >
                <Card
                  className={`p-5 transition hover:-translate-y-[1px] hover:shadow-lg ${
                    e.status === "new"
                      ? "border-[#c8a45d]/40 bg-[#fffdf8]"
                      : ""
                  }`}
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-serif text-2xl">
                          {e.name}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs capitalize ${statusClass(
                            e.status
                          )}`}
                        >
                          {e.status || "new"}
                        </span>

                        <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/55">
                          {sourceLabel(e)}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/45">
                        <a
                          href={`mailto:${e.email}`}
                          onClick={(ev) =>
                            ev.stopPropagation()
                          }
                          className="hover:text-[#8a6a2f] hover:underline"
                        >
                          {e.email}
                        </a>

                        <a
                          href={`tel:${e.phone}`}
                          onClick={(ev) =>
                            ev.stopPropagation()
                          }
                          className="hover:text-[#8a6a2f] hover:underline"
                        >
                          {e.phone}
                        </a>
                      </div>

                      {e.subject && (
                        <p className="mt-4 text-sm font-semibold text-black/75">
                          Subject: {e.subject}
                        </p>
                      )}

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/70">
                        {e.message}
                      </p>

                      <p className="mt-3 text-xs text-black/40">
                        {targetName(e)}

                        {e.eventDate
                          ? ` · Event ${new Date(
                              e.eventDate
                            ).toLocaleDateString()}`
                          : ""}

                        {" · Received "}

                        {new Date(
                          e.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div
                      className="flex items-center gap-2"
                      onClick={(ev) =>
                        ev.stopPropagation()
                      }
                    >
                      <button
                        type="button"
                        onClick={() => openEnquiry(e)}
                        className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteEnquiry(e)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}

            {!items.length && (
              <Card className="p-10 text-center text-black/45">
                No enquiries yet.
              </Card>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/55">
                    {sourceLabel(selected)}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs capitalize ${statusClass(
                      selected.status
                    )}`}
                  >
                    {selected.status}
                  </span>
                </div>

                <h2 className="mt-3 font-serif text-3xl">
                  {selected.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full p-2 transition hover:bg-black/5"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Email + Phone */}
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-3 rounded-2xl border p-4 transition hover:border-[#c8a45d] hover:bg-[#fffaf0]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f1e6cf] text-[#8a6a2f]">
                    <Mail size={18} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs text-black/40">
                      Email
                    </p>

                    <p className="truncate text-sm font-medium">
                      {selected.email}
                    </p>
                  </div>
                </a>

                <a
                  href={`tel:${selected.phone}`}
                  className="flex items-center gap-3 rounded-2xl border p-4 transition hover:border-[#c8a45d] hover:bg-[#fffaf0]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f1e6cf] text-[#8a6a2f]">
                    <Phone size={18} />
                  </span>

                  <div>
                    <p className="text-xs text-black/40">
                      Phone
                    </p>

                    <p className="text-sm font-medium">
                      {selected.phone}
                    </p>
                  </div>
                </a>
              </div>

              {/* Subject */}
              {selected.subject && (
                <div className="rounded-2xl bg-[#faf8f3] p-5">
                  <p className="text-xs uppercase tracking-wider text-black/40">
                    Subject
                  </p>

                  <p className="mt-2 font-medium">
                    {selected.subject}
                  </p>
                </div>
              )}

              {/* Enquiry information */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#faf8f3] p-5">
                  <div className="flex items-center gap-2 text-black/40">
                    <User size={16} />

                    <span className="text-xs uppercase tracking-wider">
                      Enquiry For
                    </span>
                  </div>

                  <p className="mt-2 font-medium">
                    {targetName(selected)}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf8f3] p-5">
                  <div className="flex items-center gap-2 text-black/40">
                    <CalendarDays size={16} />

                    <span className="text-xs uppercase tracking-wider">
                      Received
                    </span>
                  </div>

                  <p className="mt-2 font-medium">
                    {new Date(
                      selected.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center gap-2">
                  <MessageSquare
                    size={18}
                    className="text-[#c8a45d]"
                  />

                  <h3 className="font-semibold">
                    Message
                  </h3>
                </div>

                <div className="mt-3 rounded-2xl border bg-white p-5 text-sm leading-7 text-black/70">
                  {selected.message}
                </div>
              </div>

              {/* Manage */}
              <div className="border-t pt-5">
                <p className="mb-3 text-xs uppercase tracking-wider text-black/40">
                  Manage enquiry
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      updateStatus(
                        selected,
                        "accepted"
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check size={17} />
                    Accept
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      updateStatus(
                        selected,
                        "rejected"
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    <X size={17} />
                    Reject
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      deleteEnquiry(selected)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="border-t pt-5">
                <label className="text-xs uppercase tracking-wider text-black/40">
                  Status
                </label>

                <select
                  value={selected.status}
                  disabled={busy}
                  onChange={(e) =>
                    updateStatus(
                      selected,
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                >
                  {(selected.source === "contact"
                    ? contactStatuses
                    : enquiryStatuses
                  ).map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}