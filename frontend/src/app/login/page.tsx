"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { useGoogleLogin } from "@react-oauth/google";
import api from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }
    try {
      localStorage.setItem("email", email);
      router.push(`/login/password`);
    } catch (error) {
      console.error("ERROR at Login", error);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);

        // Get user info from Google using the access token
        const googleUser = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        ).then((r) => r.json());

        // Send to your backend
        const response = await api.post("/auth/google", {
          idToken: tokenResponse.access_token,
          email: googleUser.email,
          given_name: googleUser.given_name,
          family_name: googleUser.family_name,
          googleId: googleUser.sub,
        });

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        router.push(user.role === "admin" ? "/admin" : "/");
      } catch (error) {
        console.error("Google login failed:", error);
        alert("Google login failed. Please try again.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      console.error("Google OAuth error");
      alert("Google login failed. Please try again.");
    },
  });

  return (
    <div className="bg-white flex flex-col items-center pt-10 h-svh lg:w-full md:justify-center">
      <div className="py-4 flex flex-col items-center w-[90%] max-w-md lg:max-w-200">
        <h1 className="text-[50px] font-medium text-center text-[#020617]">
          Welcome Back!
        </h1>
        <p className="text-gray-600 mt-4 text-[18px]">
          Please log in to continue
        </p>
        <div className="gap-5 w-full mt-14 flex flex-col items-center lg:flex-row lg:gap-6 lg:justify-center">
          <button
            onClick={() => handleGoogleLogin()}
            disabled={isGoogleLoading}
            className="bg-[#F1F5F9] py-3 w-full text-center rounded-md font-semibold flex gap-3 items-center justify-center transition-colors hover:bg-gray-300 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-xl" />
            <span className="font-medium text-[#0F172A]">
              {isGoogleLoading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>
          <button className="bg-[#F1F5F9] py-3 w-full text-center rounded-md font-semibold flex gap-3 items-center justify-center transition-colors hover:bg-gray-300 flex-1">
            <FaLinkedin className="text-xl text-[#0077B5]" />
            <span className="font-medium text-[#0F172A]">
              Continue with LinkedIn
            </span>
          </button>
        </div>
        <div className="flex items-center w-full my-6 max-w-md">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-4 text-gray-900 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-row gap-2 justify-center items-center w-full"
        >
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email address"
            className="pl-4 rounded-md h-12 border text-black/80 border-[#E2E8F0] flex-1 outline-none transition-all focus:border-[#2C5CC5] focus:ring-1 focus:ring-[#2C5CC5]"
          />
          <button
            disabled={!email}
            type="submit"
            className="bg-[#2C5CC5] text-white rounded-md h-12 px-4 active:scale-95 transition-transform disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>
        <p className="text-[16px] mt-8 text-[#64748B]">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#2C5CC5] underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
