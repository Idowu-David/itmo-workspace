"use client";

import { Desk } from "@/app/page";
import { useState } from "react";
import DeskCard from "./DeskCard";

interface IBookingModal {
  desk: Desk;
  onConfirm: () => void;
  onClose: () => void;
}

const BookingModal = ({ desk, onClose, onConfirm }: IBookingModal) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 mb-8 flex items-center justify-center">
            <DeskCard desk={desk}/>
          </div>
          <p className="text-2xl font-bold">Make a Booking</p>
          <p className="text-center text-xl my-6">
            Note: You must arrive within 15 minutes after successful
            booking{" "}
          </p>
          <div className="flex space-x-4 items-center justify-between">
            <button
              onClick={onClose}
              className="p-4 border-red-300  border-2 px-10 text-red-300 rounded-2xl"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="p-4 bg-blue-700 rounded-2xl border-2 px-10 text-white"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
