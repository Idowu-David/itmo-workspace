"use client";
import { useState, useEffect } from "react";

const CountdownTimer = ({ approvedAt }: { approvedAt: Date }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    

    const interval = setInterval(() => {
      const elapsed = Date.now() - new Date(approvedAt).getTime();
      const remaining = 15 * 60 * 1000 - elapsed;

      if (remaining <= 0) {
        setTimeLeft("00 : 00");
        clearInterval(interval);
        return;
      }

      const mins = Math.floor(remaining / 60000)
        .toString()
        .padStart(2, "0");
      const secs = Math.floor((remaining % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      setTimeLeft(`${mins} : ${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [approvedAt]);

  return <span>{timeLeft}</span>;
};

export default CountdownTimer;
