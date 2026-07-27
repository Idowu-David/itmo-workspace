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
import CheckoutModal from "@/components/CheckoutModal";
import PreBookingModal from "@/components/PreBookingModal";

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
  const [bookingStep, setBookingStep] = useState(0);
  const [activeBooking, setActiveBooking] = useState<IBooking | null>(null);
  const [checkoutModal, setCheckoutModal] = useState(false);

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
    });

    socket.on("booking-approved", ({ booking, desk }) => {
      setActiveBooking(booking);
      setSelectedDesk(desk);
    });

    socket.on("booking-rejected", ({ booking, desk }) => {
      setActiveBooking(null);
      setSelectedDesk(null);
      setIsModalOpen(false);
      setBookingStep(1);

      const resolvedDeskId =
        desk?.id?.toString() || booking?.deskId?.toString();

      setDesks((prev) =>
        prev.map((d) =>
          d.id === resolvedDeskId ? { ...d, status: "available" } : d,
        ),
      );
    });

    socket.on("booking-update", (booking) => {
      console.log("BOOKING UPDATE HIT: ", booking);
      setActiveBooking(booking);
    });

    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          const deskRes = await api.get("/desks");
          setDesks(
            deskRes.data.data.desks.map((d: any) => ({
              id: d._id,
              status: d.status,
              deskNumber: d.deskNumber,
            })),
          );
          return;
        }

        // Fetch desks and user booking at the same time
        const [desksResponse, bookingResponse] = await Promise.all([
          api.get("/desks"),
          api
            .get("/booking/my-booking", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => ({ data: { data: null } })),
        ]);

        const fetchedDesks = desksResponse.data.data.desks.map((desk: any) => ({
          id: desk._id,
          status: desk.status,
          deskNumber: desk.deskNumber,
        }));
        setDesks(fetchedDesks);

        const currentBooking = bookingResponse?.data?.data;
        if (currentBooking) {
          setActiveBooking(currentBooking);

          const matchingDesk = fetchedDesks.find(
            (d: Desk) => d.id === currentBooking.deskId,
          );
          if (matchingDesk) setSelectedDesk(matchingDesk);
        }
      } catch (error) {
        console.error("Error fetching initial data", error);
      }
    };

    fetchInitialData();

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

    if (activeBooking) {
      setIsModalOpen(true);
      setBookingStep(3);
      return;
    }
    if (desk.status !== "available") return;
    setSelectedDesk(desk);

    setIsModalOpen(true);
    setBookingStep(0);
  };

  const handleCloseModal = () => {
    if (activeBooking?.status === "approved") return;
    setIsModalOpen(false);
    setBookingStep(1);
    if (!activeBooking) setSelectedDesk(null);
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

  const handleCheckoutModal = () => {
    setCheckoutModal(true);
  };

  console.log("SELECTED DESK : ", selectedDesk);

  return (
    <div className="flex flex-col items-center mb-10">
      <NavBar />

      <main className="flex flex-col px-4 max-w-3xl gap-6 ">
        <p className="text-4xl text-center font-semibold leading-12.5 text-[#020617] mt-6">
          WELCOME TO ITMO WORKSPACE BOOKING PAGE!
        </p>

        <div className="w-full bg-white shadow-lg rounded-[30px] p-5">
          <div className="space-y-3 md:flex md:justify-around font-bold text-xl mb-4 gap-2 ">
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

          {isModalOpen && selectedDesk && bookingStep === 0 && (
            <PreBookingModal
              onConfirm={() => setBookingStep(1)}
              onClose={handleCloseModal}
            />
          )}

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

        {activeBooking?.status === "checked-in" && (
          <button
            onClick={handleCheckoutModal}
            className="p-5 text-xl font-semibold bg-[#4338CA] text-white tracking-wider rounded-2xl active:scale-90"
          >
            CHECKOUT BOOKING
          </button>
        )}

        {checkoutModal && (
          <CheckoutModal
            onCancel={() => setCheckoutModal(false)}
            desk={selectedDesk}
            setActiveBooking={() => setActiveBooking(null)}
            booking={activeBooking}
          />
        )}
      </main>
    </div>
  );
};

export default App;
