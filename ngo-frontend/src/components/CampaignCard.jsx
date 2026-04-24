import { motion as Motion } from "framer-motion";
import { currency } from "../utils/format";

export default function CampaignCard({ campaign, index = 0 }) {
  const progress = Math.round((campaign.raised / campaign.goal) * 100);

  return (
    <Motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft"
    >
      <div className="relative h-56 overflow-hidden">
        <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
          {campaign.tag}
        </span>
      </div>
      <div className="space-y-5 p-6">
        <div>
          <p className="text-sm font-bold text-blue-600">{campaign.location}</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{campaign.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{campaign.summary}</p>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm font-bold text-slate-700">
            <span>{currency(campaign.raised)} raised</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <Motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
            />
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500">Goal: {currency(campaign.goal)}</p>
        </div>
      </div>
    </Motion.article>
  );
}
