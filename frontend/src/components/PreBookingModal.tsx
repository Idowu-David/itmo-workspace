"use client";

import { Desk } from "@/app/page";
import { useState } from "react";
import DeskCard from "./DeskCard";
import { IBooking } from "../../../backend/src/models/Booking";

interface IBookingModal {
  onConfirm: () => void;
  onClose: () => void;
}

const PreBookingModal = ({ onClose, onConfirm }: IBookingModal) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 flex items-center justify-center"></div>
          <p className="text-2xl font-bold py-4 text-center">
            Are you a Founder or an Innovator?
          </p>

          <div className="flex space-x-4 items-center justify-between">
            <button
              onClick={onConfirm}
              className="p-4 bg-blue-700 rounded-2xl border-2 px-10 text-white"
            >
              YES
            </button>

            <button
              onClick={onClose}
              className="p-4 bg-red-500 border-2 px-10 rounded-2xl text-white"
            >
              NO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreBookingModal;
