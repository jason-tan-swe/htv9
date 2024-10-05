"use client";

import { useState, useEffect } from "react"; // Import useState and useEffect
import { socket } from "../socket";

export default function Home() {

    useEffect(() => {
      socket.on('connect', () => {
        console.log("Jason is connected")
      });
    }, []);

  return (
    <div className="relative w-full h-screen"> {/* Force full width and height */}
    </div>
  );
}
