"use client";

import { Desk } from "@/app/page";
import { FileSearch2 } from "lucide-react";
import { IoClose } from "react-icons/io5";
import CountdownTimer from "./CountdownTimer";
import { IBooking } from "../../../backend/src/models/Booking";
import api from "@/lib/api";
import { Dispatch, SetStateAction, useState } from "react";
import CheckinModal from "./CheckinModal";

interface IBookingModal {
  desk: Desk | null;
  onClose: () => void;
  booking: IBooking | null;
  setActiveBooking: Dispatch<SetStateAction<IBooking | null>>;
  onContinue: () => void;
}

const SuccessIcon = () => (
  <svg
    width="140"
    height="140"
    viewBox="-5 0 110 115"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* gear-like polygon background */}
    <path
      d="M50 5
         L61 15 L75 12 L82 25 L95 30 L93 44 
         L100 55 L93 66 L95 80 L82 85 
         L75 98 L61 95 L50 105 L39 95 
         L25 98 L18 85 L5 80 L7 66 
         L0 55 L7 44 L5 30 L18 25 
         L25 12 L39 15 Z"
      fill="#bbf7d0"
      stroke="#16a34a"
      strokeWidth="2"
    />
    {/* checkmark */}
    <polyline
      points="30,52 44,66 70,38"
      stroke="#ffffff"
      strokeWidth="12"
      fill="none"
    />
  </svg>
);

const BookingApprovedModal = ({
  desk,
  onClose,
  booking,
  setActiveBooking,
  onContinue,
}: IBookingModal) => {
  console.log("SELECTED DESK FROM APPROVED", desk);

  if (!booking) return null;

  const handleCancelBooking = async () => {
    try {
      if (!booking) return;
      await api.patch(`/booking/${booking._id}/cancel`);

      setActiveBooking(null);
      onClose();
    } catch (error) {
      console.error("Cancel failed", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl relative">
        {/* <button onClick={onClose} className=" absolute right-6">
          <IoClose size={26} />
        </button> */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center pt-7 pb-2">
            <SuccessIcon />
          </div>
          <p className="text-3xl font-bold">Booking Successful</p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-gray-500 text-sm">Time Left:</span>
            <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <CountdownTimer approvedAt={booking.approvedAt!} />
            </div>
          </div>
          <div className="grid w-full my-3 space-y-3">
            <button
              onClick={onContinue}
              className="p-3 bg-[#2C5CC5] rounded-xl border-2 border-[#2C5CC5] px-10 text-white active:scale[0.95]"
            >
              Check in
            </button>
            <button
              onClick={handleCancelBooking}
              className="p-3 border-red-300  border-2 px-10 text-red-300 rounded-xl mb-6 active:scale[0.95]"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingApprovedModal;
