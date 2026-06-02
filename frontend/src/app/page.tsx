"use client";

import BookingModal from "@/components/BookingModal";
import BookingModalDetails from "@/components/BookingModalDetails";
import BookingModal2 from "@/components/BookingModalDetails";
import BookingModalReview from "@/components/BookingModalReview";
import DeskCard from "@/components/DeskCard";
import NavBar from "@/components/NavBar";
import api from "@/lib/api";
import { DeskStatus } from "@/types";
import { useEffect, useState } from "react";

export interface Desk {
  id: string;
  status: string;
  deskNumber: string;
  available: number;
}

const App = () => {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalDesks, setTotalDesks] = useState(0);
  const [availableDesks, setAvailableDesks] = useState(0);
  const [bookingStep, setBookingStep] = useState(1);
  const [hasPendingBooking, setHasPendingBooking] = useState(false);

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

  // const desks: Desk[] = [
  //   {
  //     id: "1",
  //     status: "available",
  //     deskNumber: "1",
  //     available: 8,
  //   },
  //   {
  //     id: "2",
  //     status: "available",
  //     deskNumber: "2",
  //     available: 8,
  //   },
  //   {
  //     id: "3",
  //     status: "booked",
  //     deskNumber: "3",
  //     available: 8,
  //   },
  //   {
  //     id: "4",
  //     status: "available",
  //     deskNumber: "4",
  //     available: 8,
  //   },
  //   {
  //     id: "5",
  //     status: "available",
  //     deskNumber: "5",
  //     available: 8,
  //   },
  //   {
  //     id: "6",
  //     status: "available",
  //     deskNumber: "6",
  //     available: 8,
  //   },
  //   {
  //     id: "7",
  //     status: "available",
  //     deskNumber: "7",
  //     available: 8,
  //   },
  //   {
  //     id: "8",
  //     status: "available",
  //     deskNumber: "8",
  //     available: 8,
  //   },
  // ];

  const handleDeskClick = (desk: Desk) => {
    setSelectedDesk(desk);
    if (hasPendingBooking) setBookingStep(3);
    else setBookingStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDesk(null);
    setBookingStep(1);
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

          {isModalOpen && selectedDesk && bookingStep === 1 && (
            <BookingModal
              desk={selectedDesk}
              onConfirm={() => setBookingStep(2)}
              onClose={handleCloseModal}
            />
          )}

          {isModalOpen && selectedDesk && bookingStep === 2 && (
            <BookingModalDetails
              desk={selectedDesk}
              onClose={handleCloseModal}
              onContinue={() => setBookingStep(3)}
              setHasPendingBooking={setHasPendingBooking}
            />
          )}

          {isModalOpen && selectedDesk && bookingStep === 3 && (
            <BookingModalReview
              desk={selectedDesk}
              onClose={handleCloseModal}
              
            />
          )}

          <div className="w-full max-w-2xl mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 place-items-center">
              {desks.map((desk) => (
                <DeskCard
                  key={desk.id}
                  label={desk.deskNumber}
                  status={desk.status}
                  onClick={() => handleDeskClick(desk)}
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
