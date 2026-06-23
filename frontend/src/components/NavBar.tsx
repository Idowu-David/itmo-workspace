"use client";

import { useEffect, useState } from "react";

interface NavBarProps {
  text?: string;
}

const NavBar = ({ text }: NavBarProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setName(user.name || "");

    console.log("USER", user);
  }, []);

  return (
    <nav className="w-full h-16 bg-white flex justify-between px-8 items-center shadow-md">
      <div className="flex items-center gap-3 text-2xl font-bold">
        <div className="bg-[#1E3A5F] h-10 w-10 rounded-full grid grid-cols-2 justify-items-center place-items-center p-2 shadow-xl">
          <div className="w-2.5 h-2.5 border-white border-3 "></div>
          <div className="w-2.5 h-2.5 border-white border-3"></div>
          <div className="w-2.5 h-2.5 border-white border-3"></div>
          <div className="w-2.5 h-2.5 border-white border-3"></div>
        </div>
        <p>{text}</p>
      </div>
      <div className="flex gap-3 items-center">
        {/* <Image
          width={30}
          height={30}
          alt="Profile picture"
          src="/images/image.png"
          className="rounded-full"
          priority
        /> */}
        <p className="text-xl font-semibold tracking-wider">{name}</p>
      </div>
    </nav>
  );
};

export default NavBar;
