"use client"

import Image from "next/image";
import { useEffect } from "react";
import { socket } from "../socket";
import AnimatedGrid from "../components/AnimatedGrid";
import BeamConnection from "../components/BeamConnection";

export default function Home() {

  useEffect(() => {
    socket.on('connect', () => {
      console.log("Jason is connected")
    })
  }, [])

  return (
    <div className="relative w-full h-screen"> {/* Force full width and height */}
      <AnimatedGrid>
        <BeamConnection />
      </AnimatedGrid>
    </div>
  );
}
