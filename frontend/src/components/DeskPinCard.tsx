import React from "react";

export interface IDeskPinProp {
  deskNumber: string;
  pin: string;
  status: string;
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

const DeskPinCard = ({ deskNumber, pin, status }: IDeskPinProp) => {
  console.log("status: ", status);
  return (
    <div className="">
      <div className={`p-2 rounded-xl ${getDeskStyles(status)}`}>
        <p>{deskNumber}</p>
        <p className="text-4xl font-semibold mt-2">{pin}</p>
      </div>
    </div>
  );
};

export default DeskPinCard;
