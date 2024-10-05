"use client";

import React, { useState, useRef } from "react";
import { NeonGradientCard } from "../components/ui/neon-gradient-card";
import { AnimatedBeam } from "../components/ui/animated-beam"; 

export default function BeamConnection({
  title1,
  title2,
  card1Colors,
  card2Colors,
  beam1Colors,
  beam2Colors,
  toggleCard1Colors,
  toggleCard2Colors,
}) {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const containerRef = useRef(null);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-64" ref={containerRef}>
      <div className="flex gap-64">
        {/* Neon Card 1 */}
        <NeonGradientCard
          className="w-80 h-20 items-center justify-center text-center"
          ref={box1Ref}
          borderSize={1}
          borderRadius={10}
          neonColors={card1Colors} // Using the state for card 1's colors
        >
          <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#ff2975] from-35% to-[#00FFF1] bg-clip-text text-center text-4xl font-regular leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            {title1 ?? ''}
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
            {title2 ?? ''}
          </span>
        </NeonGradientCard>
      </div>

      {/* Render the Animated Beams with dynamic beam colors */}
      <AnimatedBeam
        key={`beam1-${beam1Colors.start}-${beam1Colors.stop}`} 
        containerRef={containerRef}
        fromRef={box1Ref}
        toRef={box2Ref}
        startYOffset={-30}
        endYOffset={-30}
        startXOffset={0}
        endXOffset={0}
        curvature={150}
        duration={4}
        gradientStartColor={beam1Colors.start} 
        gradientStopColor={beam1Colors.stop} 
      />

      <AnimatedBeam
        key={`beam2-${beam2Colors.start}-${beam2Colors.stop}`} 
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
        gradientStartColor={beam2Colors.start} 
        gradientStopColor={beam2Colors.stop} 
      />
    </div>
  );
}
