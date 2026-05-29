"use client";

import DeskCard from "@/components/DeskCard";
import NavBar from "@/components/NavBar";
import api from "@/lib/api";
import fetchDesks from "@/lib/fetchDesk";
import { DeskStatus } from "@/types";
import { useEffect, useState } from "react";

interface Desk {
  id: string;
  status: string;
  deskNumber: string;
  available: Number;
}

const App = () => {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [totalDesks, setTotalDesks] = useState(0);
  const [availableDesks, setAvailableDesks] = useState(0);

  useEffect(() => {
    const fetchDesks = async () => {
      try {
        const response = await api.get("/desks");
       setTotalDesks(response.data.data.desks.length);
       setAvailableDesks(response.data.data.availableDesks);
        setDesks(
          response.data.data.desks.map((desk: any) => ({
            id: desk._id,
            status: desk.status,
            deskNumber: desk.deskNumber,
          })),
        );
      } catch (error) {
        console.error("Error while fetching from frontend", error);
      }
    };

    fetchDesks();
  }, []);
  const handleDeskClick = (clickedId: string) => {
    const foundDesk = desks.find((d) => d.id === clickedId);
    if (foundDesk) {
      // setSelectedDesk(foundDesk); // This opens the modal

      return;
    }
  };

  return (
    <div className="flex flex-col items-center mb-10">
      <NavBar />

      <main className="flex flex-col px-4 max-w-3xl gap-6 lg: ">
        <p className="text-4xl text-center font-semibold leading-12.5 text-[#020617] mt-10">
          WELCOME TO ITMO WORKSPACE BOOKING PAGE!
        </p>

        <div className="w-full bg-white shadow-md border rounded-[30px] p-5">
          <div className="flex flex-col justify-center font-bold text-xl mb-5 gap-2">
            <div className="flex gap-3">
              <p className="w-10.5 h-7 bg-[#16A34A33] rounded-md text-center">
                {availableDesks}
              </p>
              Workspaces available
            </div>
            <div className="flex gap-3">
              <p className="w-10.5 h-7 bg-[#EDD0D0] rounded-md text-center">
                {totalDesks - availableDesks}
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
                  label={desk.deskNumber}
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
