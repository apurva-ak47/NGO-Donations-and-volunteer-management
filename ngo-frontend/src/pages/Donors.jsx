import { useEffect, useState } from "react";
import API from "../services/api";

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.resolve()
      .then(() => API.get("/donors"))
      .then((response) => {
        setDonors(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data?.detail || "Unable to load donors.");
        setLoading(false);
      });
  }, []);

  return (
    <main className="section-shell py-10">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-600">Donor CRM</p>
        <h1 className="display-font mt-2 text-5xl font-black text-slate-950">Donors</h1>
      </div>
      {error ? <div className="mb-5 rounded-2xl bg-rose-50 px-5 py-3 text-sm font-black text-rose-700">{error}</div> : null}
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
        <div className="grid grid-cols-4 gap-4 bg-slate-950 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white/70">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Address</span>
        </div>
        {loading ? (
          <div className="px-6 py-8 font-black text-slate-500">Loading donors...</div>
        ) : donors.map((donor) => (
          <div key={donor.id} className="grid grid-cols-1 gap-3 border-t border-slate-100 px-6 py-5 font-semibold text-slate-700 md:grid-cols-4">
            <span className="font-black text-slate-950">{donor.name}</span>
            <span>{donor.email}</span>
            <span>{donor.phone || "N/A"}</span>
            <span>{donor.address || "N/A"}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
