"use client"

import { useState } from "react";
import Link from "next/link";
import clsx from 'clsx';

const Details = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  // const navigate = useNavigate();

  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Clicked")
    // navigate("/dashboard")

    
    // Verification for the password and login navigation to the dashboard
    // navigate("/password", { state: { email: email } });
  };

  return (
    <div className="bg-white flex flex-col items-center justify-start pt-16 h-svh lg:w-full lg:justify-center md:pt-0">
      <div className="py-4 flex flex-col items-center w-[90%] max-w-md">
        {/* add max-w */}
        <h1 className="text-[50px] font-medium text-center text-[#020617]">
          Enter Password
        </h1>
        <p className="text-gray-600 mt-4 text-[18px] mb-10">
          Please type your password to continue
        </p>

        <div className="w-full max-w-md">
          <label className="block text-sm font-medium mb-1 text-gray-600">
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
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full pl-4 py-3 border border-black rounded-md focus:outline-none focus:border-[#2C5CC5] focus:ring-1 focus:ring-[#2C5CC5]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                disabled={!password}
                className={clsx(
                  "bg-[#2C5CC5] text-white rounded-md py-3.5 w-full disabled:bg-gray-400",
                )}
              >
                Login
              </button>
            </form>
          </div>
        </div>

        <div className="text-sm text-gray-500 hover:text-black flex w-full mt-2 items-center">
          <Link href="/">← Back to email</Link>
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
