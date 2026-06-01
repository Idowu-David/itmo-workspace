"use client";

import { Desk } from "@/app/page";
import { FileSearch2 } from "lucide-react";
import { IoInformationCircle } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

interface IBookingModal {
  desk: Desk;
  onClose: () => void;
}

const BookingModalReview = ({ desk, onClose }: IBookingModal) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl relative">
        <button onClick={onClose} className=" absolute right-6">
          <IoClose size={24} />
        </button>
        <div className="flex flex-col items-center justify-center">
          <div className="mb-8 flex items-center justify-center bg-[#16A34A33] p-7 px-14 rounded-2xl border-[#16a34a] border">
            <FileSearch2 size={48} color="#16a34a" />
          </div>
          <p className="text-2xl font-bold">Under Review</p>
          <p className="text-xl text-center py-">
            Please exercise patience while we go through your form submission
          </p>
          <div className="grid w-full my-3 space-y-3">
            <button
              onClick={onClose}
              className="p-3 bg-blue-700 rounded-xl border-2 border-blue-700 px-10 text-white"
            >
              Back to Homepage
            </button>
            <button
              onClick={onClose}
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

export default BookingModalReview;
