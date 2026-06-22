import { IBooking } from "@/app/admin/page";
import { Check, X } from "lucide-react";
import { IoClose, IoDocumentTextOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";

// TODO: Make Request card clickable for details modal
// Render password for all desks

interface IBookingRequestCardProps {
  booking: IBooking | null;
  onReject: () => void;
  onApprove: () => void;
}

const BookingRequestCard = ({
  booking,
  onReject,
  onApprove,
}: IBookingRequestCardProps) => {
  const [openModal, setOpenModal] = useState(false);

  if (!booking) return;

  const date = new Date(booking.createdAt).toLocaleString("en-NG", {
    dateStyle: "medium",
    // timeStyle: "short",
  });
  const time = new Date(booking.createdAt).toLocaleTimeString();
  const fileLink = `${process.env.NEXT_PUBLIC_API_URL}/uploads`;

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="p-4 flex items-center flex-col border-b">
      <div
        className="flex items-center w-full"
        onClick={() => setOpenModal(true)}
      >
        <div className="flex-1 mx-4 min-w-0">
          <p className="font-bold text-xl">{booking.name}</p>
          <div className="">
            <p className="line-clamp-3 wrap-break-word">
              {booking.deskId?.deskNumber} · {booking.purpose}
            </p>
          </div>
        </div>
        <div className="px-3 py-0.5 text-xs rounded-2xl bg-amber-300">
          {booking.status}
        </div>
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

      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-4 pb-6 max-h-[90vh] overflow-y-auto">
            <div className="pb-4  flex items-center justify-between">
              <p className="text-2xl font-semibold">BOOKING REQUEST</p>
              <button onClick={() => handleCloseModal()} className="">
                <IoClose size={36} />
              </button>
            </div>

            <div className="flex items-center pb-4 justify-between">
              <p className="text-2xl font-bold">NAME: {booking.name}</p>
              <div className="px-3 py-0.5 text-xs rounded-2xl bg-amber-300">
                {booking.status}
              </div>
            </div>
            <div className=" grid grid-cols-2 gap-3">
              <div className="bg-gray-300 flex items-center justify-center rounded-lg text-xl font-bold">
                {booking.deskId?.deskNumber}
              </div>
              <div className="bg-gray-300 rounded-lg p-3 text-lg">
                DATE:
                <p className="font-bold text-xl">{date}</p>
              </div>
              <div className="bg-gray-300 rounded-lg p-3 text-lg">
                TIME:
                <p className="font-bold text-xl"> {time}</p>
              </div>
              <div className="bg-gray-300 rounded-lg p-3 text-lg">
                PHONE:{" "}
                <p className="font-bold text-xl">{booking.phoneNumber}</p>
              </div>
            </div>
            <div>
              <p className="my-4">BOOKING PURPOSE</p>
              <p className="p-3 bg-gray-300 rounded-lg">{booking.purpose}</p>
            </div>
            <div className="w-full">
              <p className="my-3">PROOF OF WORK</p>
              <div className="w-full">
                <a href={`${fileLink}/${booking.proofOfWork}`} target="_blank">
                  <button className="bg-slate-200 pt-4 border-t-2 border-b-2 flex items-center flex-col w-full">
                    <IoDocumentTextOutline size={50} className="" />
                    <p className="w-full break-all  bg-gray-200 px-2 my-2 text-">
                      {booking.proofOfWork}
                    </p>
                    <p className="text-xl tracking-wider bg-gray-400 w-full py-1 mt-3">
                      View Document
                    </p>
                  </button>
                </a>
              </div>
            </div>
            <div className="flex gap-3 my-4">
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
            <button
              onClick={() => handleCloseModal()}
              className="flex gap-3 items-center justify-center py-3 rounded-xl bg-gray-200 font-medium active:scale-[0.95] w-full border"
            >
              Close without action
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingRequestCard;
