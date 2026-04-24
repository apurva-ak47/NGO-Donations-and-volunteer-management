import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { decodeJwt } from "../utils/jwt";

const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  Approved: "bg-green-50 text-green-700 ring-green-200",
  "In Transit": "bg-blue-50 text-blue-700 ring-blue-200",
  Used: "bg-red-50 text-red-700 ring-red-200",
};

function normalizeDonation(donation) {
  const items = donation.items || [];
  return {
    id: donation.id,
    donorId: donation.donor_id || "N/A",
    donorName: donation.donor_name || "Unknown donor",
    donorEmail: donation.donor_email || "",
    items: items.map((item) => item.item_name).filter(Boolean),
    quantities: items.map((item) => item.quantity).filter(Boolean),
    date: donation.created_at || "",
    status: donation.status || "Pending",
  };
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function AdminActions({ donation, processingId, onApprove, onTransit, onUsed }) {
  const [usage, setUsage] = useState({ location: "", description: "" });
  const isBusy = processingId === donation.id;

  if (donation.status === "Pending") {
    return (
      <button disabled={isBusy} onClick={() => onApprove(donation.id)} className="rounded-full bg-green-600 px-4 py-2 text-xs font-black text-white transition hover:bg-green-700 disabled:opacity-60">
        {isBusy ? "Approving..." : "Approve"}
      </button>
    );
  }

  if (donation.status === "Approved") {
    return (
      <button disabled={isBusy} onClick={() => onTransit(donation.id)} className="rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white transition hover:bg-blue-700 disabled:opacity-60">
        {isBusy ? "Updating..." : "Mark In Transit"}
      </button>
    );
  }

  if (donation.status === "In Transit") {
    return (
      <div className="min-w-72 space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <input value={usage.location} onChange={(event) => setUsage({ ...usage, location: event.target.value })} placeholder="Location" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
          <input value={usage.description} onChange={(event) => setUsage({ ...usage, description: event.target.value })} placeholder="Description" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
        </div>
        <button disabled={isBusy || !usage.location.trim() || !usage.description.trim()} onClick={() => onUsed(donation.id, usage)} className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white transition hover:bg-red-700 disabled:opacity-60">
          {isBusy ? "Saving..." : "Mark Used"}
        </button>
      </div>
    );
  }

  return <span className="text-sm font-bold text-slate-400">Lifecycle complete</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [donorCount, setDonorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const normalizedDonations = useMemo(() => donations.map(normalizeDonation), [donations]);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    const [donationRes, donorRes, inventoryRes] = await Promise.all([
      API.get("/donations"),
      API.get("/donors"),
      API.get("/inventory"),
    ]);

    setDonations(donationRes.data || []);
    setDonorCount(Array.isArray(donorRes.data) ? donorRes.data.length : 0);
    setInventoryCount(Array.isArray(inventoryRes.data) ? inventoryRes.data.length : 0);
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = token ? decodeJwt(token) : null;

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (decoded?.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    Promise.resolve()
      .then(fetchDashboard)
      .catch((err) => {
        setError(err?.response?.data?.detail || "Unable to load admin dashboard. Check backend auth and API availability.");
        setLoading(false);
      });
  }, [navigate]);

  const runAction = async (id, action) => {
    setProcessingId(id);
    setError("");
    setMessage("");
    try {
      await action();
      setMessage("Donation updated successfully.");
      await fetchDashboard();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to update donation.");
    } finally {
      setProcessingId(null);
    }
  };

  const cards = [
    { label: "Total Donors", value: donorCount, hint: "Registered donor profiles", color: "from-blue-600 to-blue-400" },
    { label: "Total Donations", value: normalizedDonations.length, hint: "All donation records", color: "from-green-600 to-green-400" },
    { label: "Inventory Count", value: inventoryCount, hint: "Backend-managed items", color: "from-slate-900 to-slate-600" },
  ];

  return (
    <main className="section-shell py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">NGO operations</p>
          <h1 className="display-font mt-2 text-5xl font-black text-slate-950">Admin Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-600">Connected to the live FastAPI backend for donation lifecycle and inventory control.</p>
        </div>
        <button onClick={() => fetchDashboard().catch((err) => setError(err?.response?.data?.detail || "Refresh failed."))} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50">
          Refresh Data
        </button>
      </div>

      {message ? <div className="mb-5 rounded-2xl bg-green-50 px-5 py-3 text-sm font-black text-green-700">{message}</div> : null}
      {error ? <div className="mb-5 rounded-2xl bg-rose-50 px-5 py-3 text-sm font-black text-rose-700">{error}</div> : null}

      <section className="grid gap-6 md:grid-cols-3">
        {cards.map((card, index) => (
          <Motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <div className={`mb-6 h-2 w-20 rounded-full bg-gradient-to-r ${card.color}`} />
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
            <p className="mt-3 text-4xl font-black text-slate-950">{loading ? "..." : card.value}</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">{card.hint}</p>
          </Motion.div>
        ))}
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-950">Donation Lifecycle Control</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Pending {"->"} Approved {"->"} In Transit {"->"} Used</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-separate border-spacing-y-3 text-left">
            <thead>
              <tr className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                <th className="px-4">Donation ID</th>
                <th className="px-4">Donor ID / Name</th>
                <th className="px-4">Items</th>
                <th className="px-4">Quantity</th>
                <th className="px-4">Date</th>
                <th className="px-4">Status</th>
                <th className="px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="rounded-3xl bg-slate-50 px-4 py-10 text-center font-black text-slate-500">Loading donations...</td></tr>
              ) : normalizedDonations.length === 0 ? (
                <tr><td colSpan="7" className="rounded-3xl bg-slate-50 px-4 py-10 text-center font-black text-slate-500">No donations found.</td></tr>
              ) : (
                normalizedDonations.map((donation) => (
                  <tr key={donation.id} className="rounded-3xl bg-slate-50 align-top shadow-sm transition hover:bg-blue-50/50">
                    <td className="rounded-l-3xl px-4 py-5 font-black text-slate-950">#{donation.id}</td>
                    <td className="px-4 py-5">
                      <p className="font-black text-slate-950">{donation.donorId} / {donation.donorName}</p>
                      {donation.donorEmail ? <p className="text-xs font-semibold text-slate-500">{donation.donorEmail}</p> : null}
                    </td>
                    <td className="px-4 py-5 font-semibold text-slate-700">{donation.items.join(", ") || "N/A"}</td>
                    <td className="px-4 py-5 font-semibold text-slate-700">{donation.quantities.join(", ") || "N/A"}</td>
                    <td className="px-4 py-5 font-semibold text-slate-700">{formatDate(donation.date)}</td>
                    <td className="px-4 py-5">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusStyles[donation.status] || "bg-slate-50 text-slate-700 ring-slate-200"}`}>{donation.status}</span>
                    </td>
                    <td className="rounded-r-3xl px-4 py-5">
                      <AdminActions
                        donation={donation}
                        processingId={processingId}
                        onApprove={(id) => runAction(id, () => API.put(`/donation/${id}/approve`))}
                        onTransit={(id) => runAction(id, () => API.put(`/donation/${id}/transit`))}
                        onUsed={(id, usage) => runAction(id, () => API.put(`/donation/${id}/used`, usage))}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
