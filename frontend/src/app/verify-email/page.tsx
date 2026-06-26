"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    const verify = async () => {
      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message);
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed");
      }
    };

    if (token) verify();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && (
        <>
          <p className="text-2xl font-bold mb-2">Email Verified!</p>
          <p className="text-gray-500 mb-6">{message}</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Go to Login
          </button>
        </>
      )}
      {status === "error" && <p className="text-red-500">{message}</p>}
    </div>
  );
};

export default VerifyEmailPage;
