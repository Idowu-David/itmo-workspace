"use client";

import { Desk } from "@/app/page";
import { IoClose } from "react-icons/io5";
import CountdownTimer from "./CountdownTimer";
import { IBooking } from "@/types";
import api from "@/lib/api";
import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";

interface IBookingModal {
  desk: Desk | null;
  onClose: () => void;
  booking: IBooking | null;
  setActiveBooking: Dispatch<SetStateAction<IBooking | null>>;
}

const CheckinModal = ({
  booking,
  desk,
  setActiveBooking,
  onClose,
}: IBookingModal) => {
  if (!booking) return null;
  const [bookingStep, setBookingStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCheckin();
  };

  const handleCheckin = async () => {
    try {
      await api.patch(`/booking/${booking._id}/checkin`, { pin });
      // setActiveBooking(null);
      onClose();
    } catch (error) {
      console.error("Checkin failed", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        console.log("status:", status);
        console.log("message:", message);

        if (status === 400) {
          setPinError(message || "Incorrect PIN");
        } else setPinError("Something went wrong, try again");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl relative">
        <button onClick={onClose} className=" absolute right-6">
          <IoClose size={24} />
        </button>
        <div className="flex flex-col items-center justify-center">
          <p className="text-3xl font-bold">Enter {desk?.deskNumber} Pin</p>
          <form onSubmit={handleFormSubmit} className="w-3/4 text-3xl">
            <input
              className="border w-full h-12 my-2 text-center rounded-lg"
              value={pin}
              type="text"
              onChange={(e) => {
                setPin(e.target.value);
                setPinError("");
              }}
            />
          </form>
          {pinError && (
            <p className="text-red-500 text-xl my-1 font-medium">{pinError}</p>
          )}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-gray-500 text-sm">Time Left:</span>
            <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <CountdownTimer approvedAt={booking.approvedAt!} />
            </div>
          </div>
          <div className="grid w-full my-3 space-y-3">
            <button
              type="button"
              onClick={handleCheckin}
              className="p-3 bg-[#2C5CC5] rounded-xl border-2 border-[#2C5CC5] px-10 text-white"
            >
              ENTER
            </button>
            <button
              type="button"
              onClick={handleCancelBooking}
              className="p-3 border-red-300  border-2 px-10 text-red-300 rounded-xl mb-6"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckinModal;
