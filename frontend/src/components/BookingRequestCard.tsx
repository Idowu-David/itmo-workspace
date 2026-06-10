import { Check, X } from "lucide-react";
import React from "react";

interface IBookingRequestCardProps {
  name: string;
  deskNumber: string;
  purpose: string;
  status: string;
  onReject: () => void;
  onApprove: () => void;
}

const BookingRequestCard = ({
  name,
  deskNumber,
  purpose,
  status,
  onReject,
  onApprove,
}: IBookingRequestCardProps) => {
  return (
    <div className=" p-4 flex items-center flex-col border-b">
      <div className="flex items-center w-full">
        <div className="flex-1 mx-4 min-w-0">
          <p className="font-bold text-xl">{name}</p>
          <div className="">
            <p className="line-clamp-3 wrap-break-word">
              {deskNumber} · {purpose}
            </p>
          </div>
        </div>
        <div className="px-3 py-0.5 text-xs rounded-2xl bg-amber-300">{status}</div>
      </div>
      <div className="flex items-center w-full gap-4 mt-4">
        <button
          onClick={onApprove}
          className="flex gap-3 items-center justify-center py-3 rounded-xl bg-green-200 w-1/2 font-semibold text-xl active:scale-[0.95]"
        >
          <Check />
          <p className="">Approve</p>
        </button>
        <button
          onClick={onReject}
          className="flex gap-3 items-center justify-center py-3 rounded-xl bg-red-200 w-1/2 text-center font-semibold text-xl active:scale-[0.95]"
        >
          <X />
          Reject
        </button>
      </div>
    </div>
  );
};

export default BookingRequestCard;
