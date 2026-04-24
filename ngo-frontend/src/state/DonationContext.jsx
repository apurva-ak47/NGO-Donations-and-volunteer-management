/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import { donations as initialDonations, inventory as baseInventory } from "../data/mockData";

const DonationContext = createContext(null);
export const STATUS_STEPS = ["Pending", "Approved", "In Transit", "Used"];

function appendTimeline(donation, status, usage) {
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const descriptions = {
    Approved: "Admin verified this donation and moved it into available inventory.",
    "In Transit": "Donation is being moved from NGO inventory to field volunteers.",
    Used: `${usage?.description || "Donation used in field work"}${usage?.location ? ` at ${usage.location}` : ""}.`,
  };

  return [
    ...donation.timeline,
    {
      title: status === "Used" ? "Used in field" : status,
      date,
      description: descriptions[status] || `Status changed to ${status}.`,
    },
  ];
}

function computeInventory(records) {
  const dynamicItems = records
    .filter((donation) => ["Approved", "In Transit"].includes(donation.status))
    .flatMap((donation) => donation.items)
    .reduce((acc, item) => {
      acc[item.name] = acc[item.name] || { item: item.name, quantity: 0, category: "Donated", reserved: 0, status: "Healthy" };
      acc[item.name].quantity += Number.parseFloat(item.quantity) || 0;
      return acc;
    }, {});

  const dynamicInventory = Object.values(dynamicItems).map((item) => ({
    ...item,
    quantity: `${item.quantity} units`,
    reserved: "Auto-tracked",
  }));

  return [...baseInventory, ...dynamicInventory];
}

export function DonationProvider({ children }) {
  const [records, setRecords] = useState(initialDonations);

  const addDonation = (donation) => setRecords((current) => [donation, ...current]);

  const updateDonationStatus = (id, status, usage) => {
    setRecords((current) =>
      current.map((donation) => {
        if (donation.id !== id) return donation;

        const usedDetails = status === "Used"
          ? {
              usedAt: usage.location,
              usageNote: `${donation.items[0]?.quantity || "Your donation"} ${donation.items[0]?.name || ""} was used in ${usage.location} ${usage.description}.`.trim(),
              usage: { location: usage.location, description: usage.description },
            }
          : {};

        return {
          ...donation,
          ...usedDetails,
          status,
          timeline: appendTimeline(donation, status, usage),
        };
      }),
    );
  };

  const value = useMemo(
    () => ({
      records,
      inventory: computeInventory(records),
      addDonation,
      updateDonationStatus,
      getDonorDonations: (email) => records.filter((donation) => donation.email === email),
    }),
    [records],
  );

  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
}

export function useDonations() {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonations must be used inside DonationProvider");
  }
  return context;
}
