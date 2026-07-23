"use client";
import { useState } from "react";
import api from "@/lib/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <p className="text-2xl font-bold mb-2">Check your email</p>
        <p className="text-gray-500">
          If an account exists with that email, a reset link has been sent.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Forgot password</h1>
        <p className="text-gray-500 mb-6">
          Enter your email and we'll send you a reset link
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 h-12 outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg h-12 font-medium"
          >
            Send reset link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
