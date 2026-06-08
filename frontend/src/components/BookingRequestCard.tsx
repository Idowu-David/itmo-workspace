import { Check, X } from "lucide-react";
import React from "react";

interface IBookingRequestCardProps {
  name: string;
  deskNumber: string;
  purpose: string;
  status: string;
}

const BookingRequestCard = ({
  name,
  deskNumber,
  purpose,
  status,
}: IBookingRequestCardProps) => {
  return (
    <div className=" p-6 flex items-center text-xl flex-col border-b-2">
      <div className="flex items-center w-full">
        <div className="w-14 h-14 bg-green-300 flex items-center justify-center font-medium rounded-full">
          AO
        </div>
        <div className="flex-1 mx-4 min-w-0">
          <p className="font-bold text-2xl">{name}</p>
          <div className="">
            <p className="line-clamp-3 wrap-break-word">
              {deskNumber} · {purpose}
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-2xl bg-amber-300">{status}</div>
      </div>
      <div className="flex items-center w-full gap-4 mt-4">
        <button className="flex gap-3 items-center justify-center py-4 rounded-xl bg-green-200 w-1/2 font-semibold text-2xl active:scale-[0.95]">
          <Check />
          <p className="">Approve</p>
        </button>
        <button className="flex gap-3 items-center justify-center py-4 rounded-xl bg-red-200 w-1/2 text-center font-semibold text-2xl active:scale-[0.95]">
          <X />
          Reject
        </button>
      </div>
    </div>
  );
};

export default BookingRequestCard;
