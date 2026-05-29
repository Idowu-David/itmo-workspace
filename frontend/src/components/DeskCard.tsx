import Image from "next/image";

export type DeskStatus = "available" | "booked" | "hold";

interface DeskCardProps {
  id: string;
  label: string;
  status: string;
  onClick: (id: string) => void;
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

const DeskCard: React.FC<DeskCardProps> = ({ id, label, status, onClick }) => {
  return (
    <button
      type="button"
      disabled={status !== "available"}
      onClick={() => onClick(id)}
      className={`
        w-9/10 rounded-2xl flex flex-col items-center justify-center py-3 ${getDeskStyles(status)}
        `}
    >
      <div className="rounded-full p-3 flex items-center border justify-center">
        <Image
          height={50}
          width={50}
          alt={"Desk"}
          src="/images/desk.png"
          className=""
        />
      </div>
      <span className="text-xl font-semibold mt-1">{status === "pending" ? "UNDER REVIEW" : label}</span>
    </button>
  );

  // <div className="flex flex-col gap-4">
  //   <div className="bg-green-300 w-[124px] h-[96px] rounded-2xl flex flex-col items-center justify-center">
  //     <div className="h-14 w-14 bg-white rounded-full border border-black flex flex-col items-center justify-center">
  //       <img src={desk} alt="Desk" className="w-8" />
  //     </div>
  //   </div>
  // </div>
};

export default DeskCard;
