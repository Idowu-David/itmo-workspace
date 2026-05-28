"use client";

import DeskCard from "@/components/DeskCard";
import NavBar from "@/components/NavBar";
import { DeskStatus } from "@/types";
import { useState } from "react";

interface Desk {
  id: string;
  label: string;
  status: DeskStatus;
}

const App = () => {
  const [desks, setDesks] = useState<Desk[]>([
    { id: "1", label: "Desk 1", status: "available" },
    { id: "2", label: "Desk 2", status: "booked" },
    { id: "3", label: "Desk 3", status: "available" },
    { id: "4", label: "Desk 4", status: "available" },
    { id: "5", label: "Desk 1", status: "available" },
    { id: "6", label: "Desk 2", status: "booked" },
    { id: "7", label: "Desk 3", status: "available" },
    { id: "8", label: "Desk 4", status: "available" },
    // ... add more desks
  ]);

  const handleDeskClick = (clickedId: string) => {
    const foundDesk = desks.find((d) => d.id === clickedId);
    if (foundDesk) {
      // setSelectedDesk(foundDesk); // This opens the modal
      return
    }
  };

  return (
    <div className="flex flex-col items-center mb-10">
      <NavBar />

      <main className="flex flex-col px-4 max-w-3xl gap-6 lg: ">
        <p className="text-4xl text-center font-semibold leading-12.5 text-[#020617] mt-10">
          WELCOME TO ITMO WORKSPACE BOOKING PAGE!
        </p>

        <div className="w-full bg-black/30 border rounded-[30px] p-5">
          <div className="flex flex-col justify-center font-bold text-xl mb-5 gap-2">
            <div className="flex gap-3">
              <p className="w-10.5 h-7 bg-[#16A34A33] rounded-md text-center">
                3
              </p>
              Workspaces available
            </div>
            <div className="flex gap-3">
              <p className="w-10.5 h-7 bg-[#EDD0D0] rounded-md text-center">
                5
              </p>
              Workspaces unavailable
            </div>
          </div>

          <div className="w-full max-w-2xl mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 place-items-center">
              {desks.map((desk) => (
                <DeskCard
                  key={desk.id}
                  id={desk.id}
                  label={desk.label}
                  status={desk.status}
                  onClick={handleDeskClick}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
