import { Desk } from "@/app/page";
import Image from "next/image";

export type DeskStatus = "available" | "booked" | "hold";

interface DeskCardProps {
  label: string;
  status: string;
  onClick?: () => void;
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

const DeskCard: React.FC<DeskCardProps> = ({ label, status, onClick }) => {
  return (
    <button
      type="button"
      disabled={status !== "available"}
      onClick={onClick}
      className={`
        w-9/10 rounded-2xl flex flex-col items-center justify-center py-3 ${getDeskStyles(status)}
        `}
    >
      <div className="rounded-full bg-white flex items-center border justify-center relative w-20 h-20">
        <Image fill alt={"Desk"} src="/images/desk.png" className="object-contain p-3"/>
      </div>
      <span className="text-xl font-semibold mt-1">
        {status === "pending" ? "UNDER REVIEW" : label}
      </span>
    </button>
  );
};

export default DeskCard;
