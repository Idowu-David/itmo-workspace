import { Desk } from "@/app/page";
import { FileSearch2 } from "lucide-react";
import Image from "next/image";
import { IBooking } from "../../../backend/src/models/Booking";

export type DeskStatus = "available" | "booked" | "hold";

interface DeskCardProps {
  desk: Desk;
  onClick?: () => void;
  activeBooking?: IBooking | null;
}

const getDeskStyles = (status: string) => {
  switch (status) {
    case "available":
      return "bg-[#16A34A33]";
    case "booked":
      return "bg-[#A3161633]";
    case "pending":
      return "bg-[#0000001A]";
  }
};

const DeskCard: React.FC<DeskCardProps> = ({
  desk,
  onClick,
  activeBooking,
}) => {
  const isMyDesk = activeBooking?.deskId?.toString() === desk?.id;
  const deskIcon = (
    <Image
      fill
      alt={"Desk"}
      src="/images/desk.png"
      className="object-contain p-3"
    />
  );

  const reviewIcon = <FileSearch2 size={42} color="#22222299" />;

  return (
    <button
      type="button"
      disabled={desk.status !== "available"}
      onClick={onClick}
      className={`
        w-full rounded-2xl flex flex-col items-center justify-center py-3 active:scale-[0.95] shadow-md ${getDeskStyles(desk.status)}
        ${isMyDesk ? "ring-2 ring-bg-[#22222299]" : ""}
        `}
    >
      <div className="rounded-full bg-white flex items-center justify-center relative w-16 h-16">
        {desk.status === "pending" ? reviewIcon : deskIcon}
      </div>
      <span className="text- font-semibold mt-1">
        {desk.status === "pending" ? "UNDER REVIEW" : desk.deskNumber}
      </span>
    </button>
  );
};

export default DeskCard;
