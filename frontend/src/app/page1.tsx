"use client"

import React, { useState } from "react";
import { type DeskStatus } from "../components/DeskCard";
import DeskCard from "../components/DeskCard";

interface Desk {
  id: string;
  label: string;
  status: DeskStatus;
}

export default function Dashboard() {
  const [desks, setDesks] = useState<Desk[]>([
    { id: "1", label: "Desk 1", status: "available" },
    { id: "2", label: "Desk 2", status: "booked" },
    { id: "3", label: "Desk 3", status: "available" },
    { id: "4", label: "Desk 4", status: "available" },
    { id: "5", label: "Desk 1", status: "available" },
    { id: "6", label: "Desk 2", status: "booked" },
    { id: "7", label: "Desk 3", status: "available" },
    { id: "8", label: "Desk 4", status: "available" },
    // ... add more desks
  ]);

  // NEW: Track which desk is currently being booked
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);

  // 1. Handle Click: Just open the form, don't change status yet
  const handleDeskClick = (clickedId: string) => {
    const foundDesk = desks.find((d) => d.id === clickedId);
    if (foundDesk) {
      setSelectedDesk(foundDesk); // This opens the modal
    }
  };

  // 2. Handle Form Submit: NOW we change the status to 'hold'
  const handleBookingConfirm = (formData: any) => {
    if (!selectedDesk) return;

    console.log("Form Data Submitted:", formData);

    setDesks((current) =>
      current.map((desk) =>
        desk.id === selectedDesk.id ? { ...desk, status: "hold" } : desk,
      ),
    );

    // Close the modal
    setSelectedDesk(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 relative">
      {/* ... (Header and Stats Section remain the same) ... */}

      {/* The Grid */}
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {desks.map((desk) => (
            <DeskCard
              key={desk.id}
              id={desk.id}
              label={desk.label}
              status={desk.status}
              onClick={handleDeskClick}
            />
          ))}
        </div>
      </div>

      {/* NEW: The Booking Modal */}
      {/* Conditional Rendering: Only show if a desk is selected */}
      {selectedDesk && (
        <BookingModal
          desk={selectedDesk}
          onClose={() => setSelectedDesk(null)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
}

// --- Simple Booking Modal Component (Internal) ---
const BookingModal = ({ desk, onClose, onConfirm }: any) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the form data back to the parent
    onConfirm({ deskId: desk.id, userName: name });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-4">Book {desk.label}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>         
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg bg-gray-100 font-medium text-gray-600 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg bg-blue-600 font-medium text-white hover:bg-blue-700"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
