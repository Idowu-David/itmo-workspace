import { Desk } from "@/app/page";
import api from "@/lib/api";
import { IBooking } from "@/types";
import axios from "axios";
import React, { Dispatch, SetStateAction } from "react";

interface ICheckoutModalProps {
  onCancel: () => void;
  desk: Desk | null;
  booking: IBooking | null;
  setActiveBooking: () => void;
}

const CheckoutModal = ({
  onCancel,
  desk,
  booking,
  setActiveBooking,
}: ICheckoutModalProps) => {
  if (!booking) return null;

  const handleConfirmCheckout = async () => {
    try {
      const response = await api.patch(`/booking/${booking._id}/checkout`);
      
      console.log("RESPONSE", response.data.data.status)
      if (response.data.data.status === "checked-out")setActiveBooking();
    } catch (error) {
      console.error("Checkin failed", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        console.log("status:", status);
        console.log("message:", message);
      }
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 w-full max-w-sm shadow-xl">
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold text-3xl text-center pb-4">
            Are you sure to Checkout?
          </p>
          <div className="flex gap-3 text-lg">
            <button
              onClick={handleConfirmCheckout}
              className="p-4 bg-blue-700 rounded-xl border-2 px-10 text-white"
            >
              Confirm
            </button>
            <button
              onClick={onCancel}
              className="p-4  bg-white rounded-xl border-2 border-black px-10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
