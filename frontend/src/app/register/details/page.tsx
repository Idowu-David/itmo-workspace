"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";

const Details = () => {
  const [password, setPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const checks = [
    {
      label: "Use upper and lower case letters (e.g. Aa)",
      passed: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
    },
    { label: "Use a number (e.g. 1234)", passed: /\d/.test(password) },
    {
      label: "Use a symbol (e.g. !@#$)",
      passed: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    { label: "Use 8 or more characters", passed: password.length >= 8 },
  ];

  const allChecksPassed = checks.every((c) => c.passed);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = localStorage.getItem("email");

    if (!email) {
      router.push("/register");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        email,
        firstName,
        lastName,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.removeItem("email");

      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400) {
          setError("Something went wrong, please try again");
        } else if (status === 404) {
          setError("Account creation unsuccessful");
        } else {
          setError("Something went wrong, please try again");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col items-center pt-10 h-svh lg:w-full text-black/70 md:justify-center">
      <div className="py-4 flex flex-col items-center w-[90%] max-w-md lg:max-w-199.5">
        <h1 className="text-[50px] font-medium text-center text-[#020617]">
          Create Password
        </h1>
        <p className="text-gray-600 mt-4 text-[18px] mb-12">
          Set a password to secure your account
        </p>

        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-5 justify-center items-center w-full"
        >
          <div className="w-full">
            <p className="mb-1 font-medium">First Name</p>
            <input
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              type="text"
              required
              placeholder="Enter your First Name"
              className="pl-4 rounded-md w-full h-12 border border-[#E2E8F0] flex-1 outline-none transition-all focus:border-[#2C5CC5] focus:ring-1 focus:ring-[#2C5CC5]"
            />
          </div>

          <div className="w-full">
            <p className="mb-1 font-medium">Last Name</p>
            <input
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              type="text"
              required
              placeholder="Enter your Last Name"
              className="pl-4 rounded-md w-full h-12 border border-[#E2E8F0] flex-1 outline-none transition-all focus:border-[#2C5CC5] focus:ring-1 focus:ring-[#2C5CC5]"
            />
          </div>

          <div className="relative w-full">
            <div className="flex justify-between">
              <p className="mb-1 font-medium">Password</p>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="font-medium text-gray-600 hover:text-[#2C5CC5]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="pl-4 rounded-md w-full h-12 border border-[#E2E8F0] flex-1 outline-none transition-all focus:border-[#2C5CC5] focus:ring-1 focus:ring-[#2C5CC5]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
              )}

              {/* Password checks */}
              {password.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1.5">
                  {checks.map((check) => (
                    <li key={check.label} className="flex items-center gap-2">
                      <span
                        className={
                          check.passed ? "text-green-500" : "text-gray-400"
                        }
                      >
                        {check.passed ? "✓" : "○"}
                      </span>
                      <span
                        className={
                          check.passed ? "text-green-500" : "text-gray-400"
                        }
                      >
                        {check.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!allChecksPassed || !firstName || !lastName || loading}
            className={clsx(
              "w-full mt-6 rounded-md py-3.5 text-white font-medium",
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
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Details;
