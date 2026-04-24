import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import AnimatedCounter from "../components/AnimatedCounter";
import CampaignCard from "../components/CampaignCard";
import { campaigns, impactStats } from "../data/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20 soft-grid">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="section-shell relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <Motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.12 }}
            className="max-w-3xl"
          >
            <Motion.p
              variants={fadeUp}
              className="mb-5 inline-flex rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-700"
            >
              Every donation is tracked to impact
            </Motion.p>
            <Motion.h1
              variants={fadeUp}
              className="display-font text-5xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl"
            >
              Give with trust. Track every item to the community it serves.
            </Motion.h1>
            <Motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
            >
              A modern NGO donation platform inspired by give.do, built around
              transparency, verified inventory, campaign progress, and donor
              traceability.
            </Motion.p>
            <Motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/donations"
                className="rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-7 py-4 text-center font-black text-white shadow-xl shadow-emerald-200 transition hover:-translate-y-1"
              >
                Donate Now
              </Link>
              <Link
                to="/campaigns"
                className="rounded-full border border-slate-200 bg-white px-7 py-4 text-center font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50"
              >
                View Campaigns
              </Link>
            </Motion.div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="glass-card rounded-[2rem] p-4"
          >
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80"
              alt="Volunteers packing donation supplies"
              className="h-[430px] w-full rounded-[1.5rem] object-cover"
            />
            <div className="-mt-20 ml-auto mr-4 max-w-sm rounded-3xl bg-white p-5 shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                Live trace
              </p>
              <p className="mt-2 font-bold text-slate-950">
                10kg rice delivered to Nagpur Food Drive
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-500">
                {["Received", "Approved", "Used"].map((step) => (
                  <span
                    key={step}
                    className="rounded-full bg-emerald-50 px-2 py-2 text-emerald-700"
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </Motion.div>
        </div>
      </section>

      <section className="section-shell py-18">
        <div className="grid gap-6 rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft md:grid-cols-4">
          {impactStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-4xl font-black">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell grid gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-600">
            About NGO
          </p>
          <h2 className="display-font mt-3 text-4xl font-black text-slate-950">
            Designed for accountable giving.
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            "Verified donor records",
            "Item-level inventory tracking",
            "Usage proof for every campaign",
            "Admin approvals and status updates",
          ].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 h-2 w-16 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500" />
              <h3 className="text-xl font-black text-slate-950">{item}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Clear workflows help donors see how support moves from
                submission to field usage.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-18">
        <div className="section-shell">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                Active campaigns
              </p>
              <h2 className="display-font mt-3 text-4xl font-black text-slate-950">
                Fund urgent, verified needs.
              </h2>
            </div>
            <Link to="/campaigns" className="font-black text-emerald-700">
              See all campaigns
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {campaigns.map((campaign, index) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-18">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            [
              "A donor can finally see the exact drive where their ration support was used.",
              "Meera S.",
              "Monthly donor",
            ],
            [
              "The dashboard gives our team one clean view of inventory, approvals, and usage.",
              "Rohan P.",
              "Operations lead",
            ],
            [
              "Traceability has improved trust with our corporate partners and volunteers.",
              "Anika D.",
              "CSR partner",
            ],
          ].map(([quote, name, role]) => (
            <Motion.blockquote
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm"
            >
              <p className="text-lg font-bold leading-8 text-slate-800">
                "{quote}"
              </p>
              <footer className="mt-6 text-sm font-black text-emerald-700">
                {name}{" "}
                <span className="font-semibold text-slate-500">/ {role}</span>
              </footer>
            </Motion.blockquote>
          ))}
        </div>
      </section>

      <footer className="bg-slate-950 py-12 text-white">
        <div className="section-shell flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-2xl font-black">TraceAid</h2>
            <p className="mt-2 max-w-xl text-slate-300">
              Transparent donation management for NGOs, donors, campaigns, and
              field usage records.
            </p>
          </div>
          <div className="text-sm font-semibold text-slate-400">
            Built for trust, traceability, and measurable impact.
          </div>
        </div>
      </footer>
    </>
  );
}
