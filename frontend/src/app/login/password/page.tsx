"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";

const Details = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = localStorage.getItem("email");

    if (!email) {
      router.push("/register");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "admin") router.push("/admin");
      else router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401) {
          setError("Incorrect password. Please try again");
        } else if (status === 404) {
          setError("No account found with this email");
        } else {
          setError("Something went wrong, please try again");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col items-center md:justify-center pt-16 h-svh lg:w-full md:pt-0">
      <div className="py-4 flex flex-col items-center w-[90%] max-w-md">
        {/* add max-w */}
        <h1 className="text-[50px] font-medium text-center text-[#020617]">
          Enter Password
        </h1>
        <p className="text-gray-600 mt-4 text-[18px] mb-10">
          Please type your password to continue
        </p>

        <div className="w-full max-w-md">
          <label className="block text-sm font-semibold mb-2 text-gray-600">
            Password
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-1 -top-6 text-sm font-medium text-gray-600 hover:text-[#2C5CC5]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

            <form className="flex flex-col gap-8" onSubmit={handleLogin}>
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-4 py-3 border border-black rounded-md focus:outline-none focus:border-[#2C5CC5] focus:ring-1 focus:ring-[#2C5CC5] text-black/70"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1 font-medium">
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={!password || loading}
                className={clsx(
                  "w-full rounded-md py-3.5 text-white font-medium",
                  "bg-[#2C5CC5]",
                  "transition-all duration-200 ease-out",
                  "hover:bg-[#244da7] hover:shadow-lg hover:shadow-blue-500/20",
                  "active:scale-[0.98]",
                  "disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:shadow-none",
                  "flex items-center justify-center gap-2",
                )}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
              {/* <button
                disabled={!password}
                className={clsx(
                  "bg-[#2C5CC5] text-white rounded-md py-3.5 w-full disabled:bg-gray-400",
                )}
              >
                Login
              </button> */}
            </form>
          </div>
        </div>

        <div className="text-sm text-gray-500 hover:text-black flex w-full mt-2 items-center">
          <Link href="/login">← Back to email</Link>
        </div>
        <p className="text-[16px] mt-9 text-[#64748B]">
          Can’t remember your password?{" "}
          <Link href="/signup" className="text-[#2C5CC5] underline">
            {" "}
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Details;
