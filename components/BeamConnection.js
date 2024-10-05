"use client";

import React, { useState, useRef } from "react";
import { NeonGradientCard } from "../components/ui/neon-gradient-card";
import { AnimatedBeam } from "../components/ui/animated-beam"; // Make sure to import this

export default function MagicBeamDemo() {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const containerRef = useRef(null);

  // Define two color palettes
  const palette1 = {
    firstColor: "#ff0000", // Red
    secondColor: "#ff8c00", // Orange
  };

  const palette2 = {
    firstColor: "#00ff00", // Green
    secondColor: "#0000ff", // Blue
  };

  // State for each card's colors
  const [card1Colors, setCard1Colors] = useState(palette1);
  const [card2Colors, setCard2Colors] = useState(palette1);

  // Function to toggle colors for card 1
  const toggleCard1Colors = () => {
    setCard1Colors((prevColors) =>
      prevColors.firstColor === palette1.firstColor ? palette2 : palette1
    );
  };

  // Function to toggle colors for card 2
  const toggleCard2Colors = () => {
    setCard2Colors((prevColors) =>
      prevColors.firstColor === palette1.firstColor ? palette2 : palette1
    );
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-64"
      ref={containerRef}
    >
      <div className="flex gap-16">
        {/* Neon Card 1 */}
        <NeonGradientCard
          className="w-80 h-20 items-center justify-center text-center"
          ref={box1Ref}
          borderSize={1}
          borderRadius={10}
          neonColors={card1Colors} // Using the state for card 1's colors
        >
          <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-4xl font-regular leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            Tom Higgins
          </span>
        </NeonGradientCard>

        {/* Neon Card 2 */}
        <NeonGradientCard
          ref={box2Ref}
          className="w-80 h-20 items-center justify-center text-center"
          borderSize={1}
          borderRadius={10}
          neonColors={card2Colors} // Using the state for card 2's colors
        >
          <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-4xl font-regular leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            Dan Smith
          </span>
        </NeonGradientCard>
      </div>

      {/* Render the Animated Beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={box1Ref}
        toRef={box2Ref}
        startYOffset={-30}
        endYOffset={-30}
        startXOffset={0}
        endXOffset={0}
        curvature={150}
        duration={4}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={box2Ref}
        toRef={box1Ref}
        startYOffset={30}
        endYOffset={30}
        startXOffset={0}
        endXOffset={0}
        curvature={-150}
        reverse={true}
        duration={4}
      />

      {/* Buttons to toggle colors for each card */}
      <div className="mt-4 flex gap-8">
        <button onClick={toggleCard1Colors} className="px-4 py-2 bg-blue-500 text-white rounded">
          Toggle Card 1 Colors
        </button>
        <button onClick={toggleCard2Colors} className="px-4 py-2 bg-blue-500 text-white rounded">
          Toggle Card 2 Colors
        </button>
      </div>
    </div>
  );
}
