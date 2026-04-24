export const campaigns = [
  {
    id: 1,
    title: "Nagpur Food Drive",
    location: "Nagpur, Maharashtra",
    raised: 415000,
    goal: 600000,
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
    tag: "Food security",
    summary: "Monthly ration kits for 1,800 families across urban settlements.",
  },
  {
    id: 2,
    title: "Back to School Kits",
    location: "Pune, Maharashtra",
    raised: 265000,
    goal: 350000,
    image:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80",
    tag: "Education",
    summary: "Books, uniforms, bags, and digital learning support for students.",
  },
  {
    id: 3,
    title: "Winter Relief Mission",
    location: "Delhi NCR",
    raised: 180000,
    goal: 300000,
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    tag: "Relief",
    summary: "Blankets, jackets, and hygiene kits for vulnerable communities.",
  },
];

export const impactStats = [
  { label: "Verified donations", value: 12750, suffix: "+" },
  { label: "Families supported", value: 8400, suffix: "+" },
  { label: "Traceable drives", value: 312, suffix: "" },
  { label: "Partner volunteers", value: 96, suffix: "" },
];

export const donations = [
  {
    id: "DON-2026-1048",
    donor: "Aarav Mehta",
    email: "aarav@example.com",
    date: "2026-04-18",
    status: "Used",
    items: [
      { name: "Rice", quantity: "10 kg" },
      { name: "Cooking oil", quantity: "4 L" },
    ],
    usedAt: "Nagpur Food Drive",
    usage: { location: "Nagpur Village", description: "Food Drive" },
    usageNote: "Your donation of 10kg rice was used in Nagpur food drive.",
    timeline: [
      { title: "Donation submitted", date: "Apr 18, 2026", description: "Items added to the donor queue." },
      { title: "Verified by admin", date: "Apr 19, 2026", description: "Quantity and packaging were approved." },
      { title: "Moved to inventory", date: "Apr 20, 2026", description: "Rice and oil were tagged for food relief." },
      { title: "Used in campaign", date: "Apr 22, 2026", description: "Distributed in Nagpur food drive." },
    ],
  },
  {
    id: "DON-2026-1032",
    donor: "Aarav Mehta",
    email: "aarav@example.com",
    date: "2026-04-12",
    status: "Approved",
    items: [
      { name: "School notebooks", quantity: "120 pcs" },
      { name: "Pens", quantity: "240 pcs" },
    ],
    usedAt: "Awaiting allocation",
    usage: null,
    usageNote: "Your school supplies are approved and reserved for the Pune kit drive.",
    timeline: [
      { title: "Donation submitted", date: "Apr 12, 2026", description: "Education materials received." },
      { title: "Verified by admin", date: "Apr 13, 2026", description: "Items approved for student kits." },
      { title: "Allocation pending", date: "Apr 23, 2026", description: "Waiting for the next school distribution batch." },
    ],
  },
  {
    id: "DON-2026-1021",
    donor: "Priya Shah",
    email: "priya@example.com",
    date: "2026-04-09",
    status: "Pending",
    items: [
      { name: "Blankets", quantity: "35 pcs" },
    ],
    usedAt: "Not assigned",
    usage: null,
    usageNote: "Your donation is pending verification by the operations team.",
    timeline: [
      { title: "Donation submitted", date: "Apr 09, 2026", description: "Blankets logged for review." },
      { title: "Admin verification", date: "In progress", description: "Operations team will confirm quantity." },
    ],
  },
];

export const inventory = [
  { item: "Rice", quantity: "420 kg", category: "Food", reserved: "180 kg", status: "Healthy" },
  { item: "Cooking oil", quantity: "96 L", category: "Food", reserved: "35 L", status: "Healthy" },
  { item: "Blankets", quantity: "82 pcs", category: "Relief", reserved: "50 pcs", status: "Low" },
  { item: "School notebooks", quantity: "680 pcs", category: "Education", reserved: "420 pcs", status: "Healthy" },
  { item: "Hygiene kits", quantity: "145 kits", category: "Health", reserved: "90 kits", status: "Medium" },
];

export const donors = [
  { id: 1, name: "Aarav Mehta", email: "aarav@example.com", donated: "14 donations", total: "Rs. 84,500" },
  { id: 2, name: "Priya Shah", email: "priya@example.com", donated: "9 donations", total: "Rs. 47,200" },
  { id: 3, name: "Kabir Khan", email: "kabir@example.com", donated: "6 donations", total: "Rs. 31,800" },
  { id: 4, name: "Neha Rao", email: "neha@example.com", donated: "11 donations", total: "Rs. 66,400" },
];

export const activity = [
  "DON-2026-1048 marked Used for Nagpur Food Drive",
  "New donation request received from Priya Shah",
  "School notebooks reserved for Pune distribution",
  "Inventory alert: blankets below monthly target",
];

export const usageRecords = [
  { donationId: "DON-2026-1048", item: "Rice", quantity: "10 kg", usedIn: "Nagpur Food Drive", date: "2026-04-22" },
  { donationId: "DON-2026-1048", item: "Cooking oil", quantity: "4 L", usedIn: "Nagpur Food Drive", date: "2026-04-22" },
  { donationId: "DON-2026-0988", item: "Blankets", quantity: "42 pcs", usedIn: "Delhi Winter Relief", date: "2026-04-14" },
];
