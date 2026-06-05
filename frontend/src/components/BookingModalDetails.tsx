"use client";

import { Desk } from "@/app/page";
import api from "@/lib/api";
import { Dispatch, SetStateAction, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import axios from "axios";
import clsx from "clsx";
import { IBooking } from "../../../backend/src/models/Booking";

interface IBookingModal {
  desk: Desk;
  onClose: () => void;
  onContinue: () => void;
  setActiveBooking: Dispatch<SetStateAction<IBooking | null>>;
  setDesks: Dispatch<SetStateAction<Desk[]>>;
}

const BookingModalDetails = ({
  desk,
  onClose,
  onContinue,
  setActiveBooking,
  setDesks,
}: IBookingModal) => {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proof) {
      setError("Please upload before continuing");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("purpose", purpose);
    formData.append("phoneNumber", phoneNumber);
    formData.append("deskId", desk.id);
    formData.append("proofOfWork", proof);

    const token = localStorage.getItem("token");

    try {
      setError("");
      setLoading(true);

      const response = await api.post("/booking", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDesks((prev) =>
        prev.map((d) => (d.id === desk.id ? { ...d, status: "pending" } : d)),
      );
      setActiveBooking(response.data.data);

      onContinue();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProof(e.target.files[0]);
      setError("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center z-50 justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <div className="flex flex-col items-center">
          <div className="w-full bg-[#8AA8E9] py-4 pl-4 rounded-xl mb-4 text-xl text-white relative flex justify-between pr-4">
            <h1>Please fill this form</h1>
            <button onClick={onClose}>
              <IoClose size={24} />
            </button>
          </div>
          <p className="font-semibold mb-3">
            Upon review of information provided on this form, your space shall
            be booked successfully
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <div>
              <p className="mb-2">Name</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                placeholder="Enter your full name"
                className="h-13 rounded-md border w-full pl-3"
              />
            </div>
            <div>
              <p className="mb-2">Phone number</p>
              <input
                value={phoneNumber}
                required
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="text"
                placeholder="Enter your phone number"
                className="h-13 rounded-md border w-full pl-3"
              />
            </div>
            <div>
              <p className="mb-2">Purpose of visit</p>
              <textarea
                value={purpose}
                required
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Enter purpose of visit"
                className="py-2 rounded-md border w-full pl-3 pt-3 pb-5 align-top"
              />
            </div>

            <div>
              <p className="mb-2">Proof of work</p>

              <label className="border rounded-md px-4 py-3 flex items-center gap-2 cursor-pointer w-fit text-blue-300">
                <FiUpload size={20} />
                Upload File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {proof && (
                <p className="text-sm text-gray-500 mt-2">{proof.name}</p>
              )}

              {error && <p className="text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className={clsx(
                "w-full mt-6 rounded-xl py-4 text-white font-medium",
                "bg-blue-700",
                "transition-all duration-200 ease-out",
                "hover:bg-[#244da7] hover:shadow-lg hover:shadow-blue-500/20",
                "active:scale-[0.95]",
                "flex items-center justify-center gap-2",
              )}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Please wait...
                </>
              ) : (
                "Confirm"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModalDetails;
