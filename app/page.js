"use client"

import AnimatedGrid from "../components/AnimatedGrid";
import BeamConnection from "../components/BeamConnection";

export default function Home() {

  return (
    <div className="relative w-full h-screen"> {/* Force full width and height */}
      <AnimatedGrid>
        <BeamConnection />
      </AnimatedGrid>
    </div>
  );
}
