import CampaignCard from "../components/CampaignCard";
import { campaigns } from "../data/mockData";

export default function Campaigns() {
  return (
    <main className="section-shell py-12">
      <div className="mb-10 rounded-[2rem] bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-white shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-white/80">Campaigns</p>
        <h1 className="display-font mt-3 text-5xl font-black">Support verified field work.</h1>
        <p className="mt-4 max-w-2xl text-white/85">Each campaign includes progress tracking and connects donations to real-world usage records.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {campaigns.map((campaign, index) => <CampaignCard key={campaign.id} campaign={campaign} index={index} />)}
      </div>
    </main>
  );
}
