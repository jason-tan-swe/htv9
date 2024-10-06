"use client";
import { useEffect, useRef, useState, forwardRef } from "react";

import { cn } from "../../lib/utils";

const NeonGradientCard = forwardRef(
  (
    {
      className,
      children,
      borderSize = 2,
      borderRadius = 20,
      neonColors = {
        firstColor: "#FFA96B", // Peach color for the first part of the gradient
        secondColor: "#00C853", // Kiwi green for the second part of the gradient
      },
      ...props
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const { offsetWidth, offsetHeight } = containerRef.current;
          setDimensions({ width: offsetWidth, height: offsetHeight });
        }
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);

      return () => {
        window.removeEventListener("resize", updateDimensions);
      };
    }, []);

    useEffect(() => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    }, [children]);

    return (
      <div
        ref={(el) => {
          containerRef.current = el;
          if (ref) ref.current = el;
        }}
        style={{
          "--border-size": `${borderSize}px`,
          "--border-radius": `${borderRadius}px`,
          "--neon-first-color": "#00C853",
          "--neon-second-color": "#00C853",
          "--card-width": `${dimensions.width}px`,
          "--card-height": `${dimensions.height}px`,
          "--card-content-radius": `${borderRadius - borderSize}px`,
          "--pseudo-element-background-image": `linear-gradient(0deg, ${neonColors.firstColor}, ${neonColors.secondColor})`,
          "--pseudo-element-width": `${dimensions.width + borderSize * 2}px`,
          "--pseudo-element-height": `${dimensions.height + borderSize * 2}px`,
          "--after-blur": `${dimensions.width / 3}px`,
        }}
        className={cn(
          "relative z-10 size-full rounded-[var(--border-radius)]",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "relative size-full min-h-[inherit] rounded-[var(--card-content-radius)] bg-gray-100 p-6",
            "before:absolute before:-left-[var(--border-size)] before:-top-[var(--border-size)] before:-z-10 before:block",
            "before:h-[var(--pseudo-element-height)] before:w-[var(--pseudo-element-width)] before:rounded-[var(--border-radius)] before:content-['']",
            "before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] before:bg-[length:100%_200%]",
            "before:animate-background-position-spin",
            "after:absolute after:-left-[var(--border-size)] after:-top-[var(--border-size)] after:-z-10 after:block",
            "after:h-[var(--pseudo-element-height)] after:w-[var(--pseudo-element-width)] after:rounded-[var(--border-radius)] after:blur-[var(--after-blur)] after:content-['']",
            "after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] after:bg-[length:100%_200%] after:opacity-80",
            "after:animate-background-position-spin",
            "dark:bg-neutral-900"
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

NeonGradientCard.displayName = "NeonGradientCard";
export { NeonGradientCard };
