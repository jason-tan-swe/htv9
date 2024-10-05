import { cn } from "../lib/utils";
import AnimatedGridPattern from "./ui/animated-grid-pattern";

export default function AnimatedGrid({ children }) {
  return (
    <div className="relative flex items-center justify-center h-screen w-full">
      {/* Animated Grid Pattern */}
      <AnimatedGridPattern
        numSquares={40}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
          "absolute inset-0 h-full w-full skew-y-12 opacity-60 z-0" // Set z-index to 0
        )}
      />

      {/* Content that is passed into AnimatedGrid (i.e., BeamConnection) */}
      <div className="relative z-10"> {/* Set z-index higher to make BeamConnection visible */}
        {children}
      </div>
    </div>
  );
}