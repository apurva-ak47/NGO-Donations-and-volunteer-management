import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../state/AuthContext";
import { decodeJwt } from "../utils/jwt";
import { statusClass } from "../utils/format";

const STATUS_STEPS = ["Pending", "Approved", "In Transit", "Used"];
const stepIcons = { Pending: "P", Approved: "A", "In Transit": "T", Used: "U" };

function normalizeDonation(donation) {
  return {
    id: donation.id,
    date: donation.created_at || "N/A",
    status: donation.status || "Pending",
    usage: donation.usage || null,
    items: (donation.items || []).map((item) => ({
      id: item.id,
      name: item.item_name,
      quantity: item.quantity,
    })),
  };
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function Timeline({ donation }) {
  const activeIndex = STATUS_STEPS.indexOf(donation.status);

  return (
    <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-5">
      <div className="grid gap-4 lg:grid-cols-4">
        {STATUS_STEPS.map((step, index) => {
          const complete = index <= activeIndex;
          const current = index === activeIndex;
          return (
            <Motion.div key={step} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className={`relative overflow-hidden rounded-3xl border p-4 ${complete ? "border-emerald-200 bg-white shadow-sm" : "border-slate-200 bg-slate-100/80"}`}>
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 opacity-80" />
              <div className={`grid h-11 w-11 place-items-center rounded-full text-sm font-black ${complete ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                {complete ? "OK" : stepIcons[step]}
              </div>
              <p className={`mt-4 text-sm font-black uppercase tracking-[0.18em] ${current ? "text-blue-700" : "text-slate-600"}`}>{step}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                {step === "Used" && donation.usage ? `${donation.usage.location} ${donation.usage.description}` : current ? "Current donation stage" : complete ? "Completed" : "Awaiting update"}
              </p>
            </Motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function DonorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = token ? decodeJwt(token) : null;

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (decoded?.role !== "donor") {
      navigate("/", { replace: true });
      return;
    }

    const fetchDonations = async () => {
      setLoading(true);
      setError("");

      const response = await API.get("/donations");
      const donationList = (response.data || []).map(normalizeDonation);
      const usageResults = await Promise.all(
        donationList.map(async (donation) => {
          const usageResponse = await API.get(`/usage/${donation.id}`);
          return { ...donation, usage: usageResponse.data?.usage || donation.usage };
        }),
      );
      setDonations(usageResults);
      setLoading(false);
    };

    Promise.resolve()
      .then(fetchDonations)
      .catch((err) => {
        setError(err?.response?.data?.detail || "Unable to load your donations. Check backend auth and API availability.");
        setLoading(false);
      });
  }, [navigate, user?.email]);

  return (
    <main className="section-shell py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-600">Transparency dashboard</p>
          <h1 className="display-font mt-2 text-5xl font-black text-slate-950">My Donations</h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-600">Track each donation step by step and see exactly where it was used. Only your backend-filtered donor records are shown.</p>
        </div>
        <Link to="/donations" className="rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-3 text-center font-black text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5">
          Create Donation
        </Link>
      </div>

      {error ? <div className="mb-5 rounded-2xl bg-rose-50 px-5 py-3 text-sm font-black text-rose-700">{error}</div> : null}

      {loading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="mt-4 text-lg font-black text-slate-950">Loading your donations...</p>
        </div>
      ) : donations.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
          <h2 className="text-2xl font-black text-slate-950">No donations yet</h2>
          <p className="mt-2 text-slate-600">Your donation history will appear here once you submit your first contribution.</p>
        </div>
      ) : (
        <section className="grid gap-6 xl:grid-cols-2">
          {donations.map((donation, index) => (
            <Motion.article key={donation.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Donation ID</p>
                  <h2 className="mt-1 text-3xl font-black text-slate-950">#{donation.id}</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500">Date: {formatDate(donation.date)}</p>
                </div>
                <span className={`h-fit rounded-full px-3 py-1 text-sm font-black ring-1 ${statusClass(donation.status)}`}>{donation.status}</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {donation.items.map((item) => (
                  <div key={`${donation.id}-${item.id || item.name}`} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-black text-slate-950">{item.name}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Quantity: {item.quantity}</p>
                  </div>
                ))}
              </div>

              <Timeline donation={donation} />

              {donation.status === "Used" && donation.usage ? (
                <div className="mt-5 rounded-[1.75rem] border border-rose-100 bg-rose-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-700">Where your donation was used</p>
                  <p className="mt-3 text-xl font-black text-slate-950">{donation.usage.location}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{donation.usage.description}</p>
                </div>
              ) : null}
            </Motion.article>
          ))}
        </section>
      )}
    </main>
  );
}
