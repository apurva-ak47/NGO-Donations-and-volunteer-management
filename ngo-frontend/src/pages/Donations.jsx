import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import API from "../services/api";
import { useAuth } from "../state/AuthContext";
import { statusClass } from "../utils/format";

const STATUS_STEPS = ["Pending", "Approved", "In Transit", "Used"];

function normalizeDonation(donation) {
  return {
    id: donation.id,
    date: donation.created_at || "N/A",
    status: donation.status || "Pending",
    usage: donation.usage || null,
    items: (donation.items || []).map((item) => ({
      name: item.item_name,
      quantity: item.quantity,
    })),
  };
}

function TrackingBar({ status }) {
  const activeIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        {STATUS_STEPS.map((step, index) => {
          const active = index <= activeIndex;
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className={`grid h-10 w-10 place-items-center rounded-full text-sm font-black ring-4 ${active ? "bg-emerald-500 text-white ring-emerald-100" : "bg-slate-100 text-slate-400 ring-slate-50"}`}>
                {index + 1}
              </div>
              {index < STATUS_STEPS.length - 1 ? <div className={`h-1 flex-1 ${index < activeIndex ? "bg-emerald-500" : "bg-slate-100"}`} /> : null}
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {STATUS_STEPS.map((step) => <span key={step}>{step}</span>)}
      </div>
    </div>
  );
}

function DonationForm({ onCreated }) {
  const [items, setItems] = useState([{ name: "", quantity: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateItem = (index, key, value) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  };

  const addItem = () => setItems((current) => [...current, { name: "", quantity: "" }]);
  const removeItem = (index) => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cleanItems = items
        .filter((item) => item.name && item.quantity)
        .map((item) => ({ item_name: item.name, quantity: Number(item.quantity) }));

      await API.post("/donations", {
        items: cleanItems,
      });

      setItems([{ name: "", quantity: "" }]);
      await onCreated();
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Unable to submit donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-black text-slate-950">Create Donation</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Add one or more items and submit them to the live backend workflow.</p>
      {error ? <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">{error}</div> : null}
      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-3xl bg-slate-50 p-4 sm:grid-cols-[1fr_0.7fr_auto]">
            <input value={item.name} onChange={(e) => updateItem(index, "name", e.target.value)} placeholder="Item name, e.g. Rice" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
            <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} placeholder="Quantity" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
            <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1} className="rounded-2xl px-4 py-3 text-sm font-black text-rose-600 disabled:opacity-30">
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={addItem} className="rounded-full border border-slate-200 px-5 py-3 font-black text-slate-700">Add item</button>
        <button disabled={loading} className="rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-3 font-black text-white shadow-lg shadow-emerald-100 disabled:opacity-60">
          {loading ? "Submitting..." : "Submit donation"}
        </button>
      </div>
    </form>
  );
}

export default function Donations() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    const donationsRes = await API.get("/donations");
    setRecords((donationsRes.data || []).map(normalizeDonation));
    setLoading(false);
  };

  useEffect(() => {
    Promise.resolve()
      .then(fetchData)
      .catch((err) => {
        setError(err?.response?.data?.detail || "Unable to load your donations.");
        setLoading(false);
      });
  }, []);

  return (
    <main className="section-shell py-10">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">Donor-only module</p>
        <h1 className="display-font mt-2 text-5xl font-black text-slate-950">Create & Track Donations</h1>
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-600">This page is scoped to {user?.email}. Donors cannot view or modify anyone else's backend data.</p>
      </div>

      {error ? <div className="mb-5 rounded-2xl bg-rose-50 px-5 py-3 text-sm font-black text-rose-700">{error}</div> : null}

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <DonationForm onCreated={fetchData} />

        <section className="space-y-5">
          {loading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 font-black text-slate-500 shadow-sm">Loading donations...</div>
          ) : records.map((donation, index) => (
            <Motion.article key={donation.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Donation ID</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">#{donation.id}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">Date: {donation.date}</p>
                </div>
                <span className={`h-fit rounded-full px-3 py-1 text-sm font-black ring-1 ${statusClass(donation.status)}`}>{donation.status}</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {donation.items.map((item) => (
                  <div key={`${donation.id}-${item.name}`} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-black text-slate-950">{item.name}</p>
                    <p className="text-sm font-semibold text-slate-500">Quantity: {item.quantity}</p>
                  </div>
                ))}
              </div>

              <TrackingBar status={donation.status} />

              {donation.usage ? (
                <div className="mt-6 rounded-3xl bg-emerald-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Where your donation was used</p>
                  <p className="mt-2 font-bold text-slate-900">{donation.usage.description}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">Usage location: {donation.usage.location}</p>
                </div>
              ) : null}
            </Motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}
