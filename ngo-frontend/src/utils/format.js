export function currency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function statusClass(status) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "In Transit": "bg-blue-50 text-blue-700 ring-blue-200",
    Used: "bg-rose-50 text-rose-700 ring-rose-200",
    Healthy: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Medium: "bg-blue-50 text-blue-700 ring-blue-200",
    Low: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return styles[status] || "bg-slate-50 text-slate-700 ring-slate-200";
}
