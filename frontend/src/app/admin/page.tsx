"use client";

import BookingRequestCard from "@/components/BookingRequestCard";
import NavBar from "@/components/NavBar";
import api from "@/lib/api";
import socket from "@/lib/socket";
import { useEffect, useState } from "react";
import { Desk } from "../page";
import { useRouter } from "next/navigation";
import DeskPinCard from "@/components/DeskPinCard";

export interface IBooking {
  _id: string;
  deskId?: {
    _id: string;
    deskNumber: string;
  };
  name: string;
  purpose: string;
  phoneNumber: string;
  proofOfWork: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "checked-in"
    | "expired"
    | "cancelled";
  createdAt: string;
}

const AdminPage = () => {
  const router = useRouter();

  const [desks, setDesks] = useState<Desk[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [deskPins, setDeskPins] = useState<Desk[]>([]);

  const totalDesks = desks.length;

  const availableDesks = desks.filter(
    (desk) => desk.status === "available",
  ).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  const updateBookingStatus = (id: string, status: IBooking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status } : b)),
    );
  };

  const handleApprove = async (id: string) => {
    updateBookingStatus(id, "approved");
    try {
      const token = localStorage.getItem("token");
      await api.patch(`/booking/${id}/approve`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error at handleApprove:", error);
      updateBookingStatus(id, "pending");
    }
  };

  const handleReject = async (id: string) => {
    updateBookingStatus(id, "rejected");
    try {
      const token = localStorage.getItem("token");
      await api.patch(`/booking/${id}/reject`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error at handleReject:", error);
      updateBookingStatus(id, "pending");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user || user.role !== "admin") {
      setIsAuthorized(false);
      router.push("/");
    } else setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;

    socket.connect();

    socket.on("desk-update", ({ deskId, status }) => {
      console.log("desk-update received", deskId, status);

      setDesks((prev) =>
        prev.map((d) => (d.id === deskId ? { ...d, status } : d)),
      );
    });

    socket.on("new-booking", ({ booking }) => {
      setBookings((prev) => [booking, ...prev]);
    });

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
        console.error("Error while fetching desks:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/booking", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(response.data.data);
      } catch (error) {
        console.error("Error while fetching bookings:", error);
      }
    };

    const fetchDeskPins = async () => {
      try {
        const response = await api.get("/desks/pins");

        setDeskPins(
          response.data.data.map((desk: any) => ({
            id: desk._id,
            status: desk.status,
            deskNumber: desk.deskNumber,
            pin: desk.pin,
          })),
        );
      } catch (error) {
        console.error("Error while fetching desk pins:", error);
      }
    };

    fetchBookings();
    fetchDesks();
    fetchDeskPins();

    return () => {
      socket.off("new-booking");
      socket.off("desk-update");
      socket.disconnect();
    };
  }, [isAuthorized]);

  if (isAuthorized === null || isAuthorized == false) return null;

  // console.log("DESK: ", deskPins);

  return (
    <div className="min-h-screen overflow-y-auto mb-10">
      <NavBar text="ITMO Admin" />
      <main className="px-2">
        <p className="py-6 text-4xl font-semibold tracking-wide">Dashboard</p>
        <div className="grid grid-cols-2 w-full gap-4">
          <div className="p-4 bg-green-300 rounded-xl text-xl font-medium pl-6">
            Available
            <p className="text-5xl mt-2">{availableDesks}</p>
          </div>
          <div className="p-4 bg-red-300 rounded-xl text-xl font-medium pl-6">
            Unavailable
            <p className="text-5xl mt-2">{totalDesks - availableDesks}</p>
          </div>
          <div className="p-4 bg-yellow-300 rounded-xl text-xl font-medium pl-6">
            Pending
            <p className="text-5xl mt-2">{pendingBookings}</p>
          </div>
          <div className="p-4 bg-blue-300 rounded-xl text-xl font-medium pl-6">
            Total Desks
            <p className="text-5xl mt-2">{totalDesks}</p>
          </div>
        </div>

        <p className="py-8 text-4xl font-semibold tracking-wide">
          Booking Requests
        </p>

        <div className="border rounded-t-4xl border-b-0 shadow-xl">
          {bookings
            .filter((booking) => booking.status === "pending")
            .map((booking) => (
              <BookingRequestCard
                key={booking._id}
                booking={booking}
                onApprove={() => handleApprove(booking._id)}
                onReject={() => handleReject(booking._id)}
              />
            ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-2xl mt-10">
          {deskPins.map((desk) => (
            <DeskPinCard
              key={desk.deskNumber}
              deskNumber={desk.deskNumber}
              pin={desk.pin!}
              status={desk.status}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
