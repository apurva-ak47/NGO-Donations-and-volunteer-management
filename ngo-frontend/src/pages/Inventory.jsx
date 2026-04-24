import { useEffect, useState } from "react";
import API from "../services/api";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.resolve()
      .then(() => API.get("/inventory"))
      .then((response) => {
        setInventory(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data?.detail || "Unable to load inventory.");
        setLoading(false);
      });
  }, []);

  return (
    <main className="section-shell py-10">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-600">Quantity tracking</p>
        <h1 className="display-font mt-2 text-5xl font-black text-slate-950">Inventory</h1>
      </div>
      {error ? <div className="mb-5 rounded-2xl bg-rose-50 px-5 py-3 text-sm font-black text-rose-700">{error}</div> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 font-black text-slate-500 shadow-sm">Loading inventory...</div>
        ) : inventory.map((item) => (
          <article key={item.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">Inventory Item</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">{item.item_name}</h2>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Available</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{item.quantity}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
