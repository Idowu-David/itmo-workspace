"use client";

import BookingModal from "@/components/BookingModal";
import BookingModalDetails from "@/components/BookingModalDetails";
import BookingModalReview from "@/components/BookingModalReview";
import DeskCard from "@/components/DeskCard";
import NavBar from "@/components/NavBar";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import ApprovedBookingModal from "@/components/ApprovedBookingModal";
import CheckinModal from "@/components/CheckinModal";
import { IBooking } from "@/types";

export interface Desk {
  id: string;
  status: string;
  deskNumber: string;
  available: number;
  pin?: string;
}

const App = () => {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [activeBooking, setActiveBooking] = useState<IBooking | null>(null);

  const totalDesks = desks.length;
  const availableDesks = desks.filter(
    (desk) => desk.status === "available",
  ).length;

  useEffect(() => {
    socket.connect();

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.id) {
          socket.emit("join", user.id);
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }

    socket.on("desk-update", ({ deskId, status }) => {
      setDesks((prev) =>
        prev.map((d) => (d.id === deskId ? { ...d, status } : d)),
      );

      // if (status === "available") {
      //   setActiveBooking((prev) => {
      //     if (prev?.deskId?.toString() === deskId) {
      //       setSelectedDesk(null);
      //       setIsModalOpen(false);
      //       setBookingStep(1);
      //       return null;
      //     }
      //     return prev;
      //   });
      // }
    });

    socket.on("booking-approved", ({ booking, desk }) => {
      setActiveBooking(booking);
      console.log("DESK:", desk);
      setSelectedDesk(desk);
    });

    socket.on("booking-rejected", ({ booking, deskId }) => {
      setActiveBooking(null);
      setSelectedDesk(null);
      setIsModalOpen(false);
      setBookingStep(1);

      setDesks((prev) =>
        prev.map((d) =>
          d.id === (deskId ?? booking?.deskId?.toString())
            ? { ...d, status: "available" }
            : d,
        ),
      );
    });

    socket.on("booking-update", (booking) => {
      setActiveBooking(booking);
    });

    const getUserBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const booking = await api.get("/booking/my-booking", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setActiveBooking(booking.data.data);
      } catch (error) {
        console.log("Error from fetch user booking", error);
      }
    };
    const fetchDesks = async () => {
      try {
        const response = await api.get("/desks");
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

    getUserBooking();
    fetchDesks();

    return () => {
      socket.off("desk-update");
      socket.off("booking-approved");
      socket.off("booking-rejected");
      socket.disconnect();
    };
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
    if (
      activeBooking?.status === "approved" ||
      activeBooking?.status === "checked-in"
    )
      return;

    setSelectedDesk(desk);
    if (activeBooking) {
      setIsModalOpen(true);
      setBookingStep(3);
      return;
    }
    if (desk.status !== "available") return;
    setIsModalOpen(true);
    setBookingStep(1);
  };

  const handleCloseModal = () => {
    if (activeBooking?.status === "approved") return;
    setIsModalOpen(false);
    setBookingStep(1);
  };

  const handleCheckIn = () => {
    setIsModalOpen(true);
    setBookingStep(4);
  };

  const handleCancelComplete = () => {
    setActiveBooking(null);
    setSelectedDesk(null);
    setIsModalOpen(false);
    setBookingStep(1);
  };

  return (
    <div className="flex flex-col items-center mb-10">
      <NavBar />

      <main className="flex flex-col px-4 max-w-3xl gap-6 lg: ">
        <p className="text-4xl text-center font-semibold leading-12.5 text-[#020617] mt-6">
          WELCOME TO ITMO WORKSPACE BOOKING PAGE!
        </p>

        <div className="w-full bg-white shadow-lg rounded-[30px] p-5">
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
              setActiveBooking={setActiveBooking}
              setDesks={setDesks}
            />
          )}

          {isModalOpen && selectedDesk && bookingStep === 3 && (
            <BookingModalReview
              desk={selectedDesk}
              onClose={handleCloseModal}
              booking={activeBooking}
              setActiveBooking={setActiveBooking}
              onCancelComplete={handleCancelComplete}
            />
          )}

          {bookingStep !== 4 && activeBooking?.status === "approved" && (
            <ApprovedBookingModal
              desk={selectedDesk}
              booking={activeBooking}
              onClose={handleCloseModal}
              setActiveBooking={setActiveBooking}
              onContinue={handleCheckIn}
            />
          )}

          {activeBooking?.status === "approved" &&
            isModalOpen &&
            selectedDesk &&
            bookingStep === 4 && (
              <CheckinModal
                booking={activeBooking}
                desk={selectedDesk}
                onClose={() => {
                  setIsModalOpen(false);
                  setBookingStep(1);
                }}
                setActiveBooking={setActiveBooking}
              />
            )}
          <div className="w-full max-w-2xl mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 place-items-center">
              {desks.map((desk) => (
                <DeskCard
                  key={desk.id}
                  desk={desk}
                  onClick={() => handleDeskClick(desk)}
                  activeBooking={activeBooking}
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
