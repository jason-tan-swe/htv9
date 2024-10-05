"use client";

import { useState, useEffect } from "react"; // Import useState and useEffect
import { socket } from "../socket";
import AnimatedGrid from "../components/AnimatedGrid";
import BeamConnection from "../components/BeamConnection";
import Lenis from "@studio-freight/lenis";

export default function Home() {
  useEffect(() => {
    // Socket connection
    socket.on("connect", () => {
      console.log("Jason is connected");
    });
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div className="relative w-full h-screen">
      {" "}
      {/* Force full width and height */}
      <AnimatedGrid>
        <BeamConnection />
      </AnimatedGrid>
    </div>
  );
}
