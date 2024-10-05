"use client";

import { useEffect } from "react"; // Import useState and useEffect
import { socket } from "../socket";

export default function Home() {
  useEffect(() => {
    // Socket connection
    socket.on("connect", () => {
      console.log("Jason is connected");
    });
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div className="relative w-full h-screen">
    </div>
  );
}
