"use client";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import Typography from "@mui/material/Typography";
import { VelocityScroll } from "../../components/ui/scroll-based-velocity.jsx";
import Lenis from "@studio-freight/lenis";
import localFont from "next/font/local";

gsap.registerPlugin(ScrollTrigger);
const satoshi = localFont({
  src: "../../fonts/Satoshi-Regular.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
export default function Home() {
  const spinnerRef = useRef();
  const mainContextRef = useRef();
  useEffect(() => {
    const gridItems = document.querySelectorAll(".grid-item");
    const lenis = new Lenis({
      duration: 1.2, // The duration of the smooth scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function for the scroll
      smooth: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    const t1 = gsap.timeline({
      scrollTrigger: {
        trigger: mainContextRef.current,
        start: "top top", // Start when the element hits the center of the viewport
        end: "bottom top", // End when the bottom of the element reaches the top of the viewport
        pin: true, // Pin the element in place during the animation
        scrub: true, // Smooth scrubbing for a better experience
        markers: true, // Enable markers to visualize where the animation starts and ends
      },
    });

    t1.fromTo(
      mainContextRef.current,
      { y: 0, scale: 0.5 }, // Starting values
      { y: 100, scale: 1, ease: "power1.out" } // Ending values
    );

    // GSAP Animation
    gsap.to(gridItems, {
      opacity: 1, // Start at fully visible
      y: 0, // No vertical offset initially
      scale: 1, // Full size initially
      ease: "power1.out",
      stagger: 0.05, // Add stagger to make it feel smoother
    });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Section 1: Header and Spinner */}
      <div className="relative flex flex-col items-center h-screen bg-white z-10">
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: { md: "6rem", sm: "6rem", lg: "8rem" },
          }}
        >
          header text
        </Typography>

        {/* Spinner at bottom */}
        <div ref={spinnerRef} className="absolute bottom-0 left-0 right-0">
          <VelocityScroll
            default_velocity={5}
            text="2dicks"
            className="font-display satoshi  mb-5 text-center text-4xl tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-4xl md:leading-[3.5rem]"
          />
        </div>
        {/* Section 2: Next Viewport Height */}
        <div
          ref={mainContextRef}
          className="h-screen w-screen justify-center bg-white items-center z-10"
        >
          <div className=" w-full h-full  rounded-lg shadow-lg flex items-center justify-center">
            <div className="flex flex-col">
              <button className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold">
                {" "}
                Dick1
              </button>
              <button className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold">
                Dick2
              </button>
              <button className="bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold">
                Dick3
              </button>

              <button className="mt-2 bg-yellow-500 text-white rounded-lg px-4 py-2 font-semibold">
                {" "}
                Dick1
              </button>
              <button className="bg-yellow-500 text-white rounded-lg px-4 py-2 font-semibold">
                Dick2
              </button>
              <button className="bg-yellow-500 text-white rounded-lg px-4 py-2 font-semibold">
                Dick3
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Additional content, similar to the phone section */}
      {/* <div className="flex justify-center h-[100vh] bg-blue-50">
        <div className="grid grid-cols-3 grid-rows-3 gap-6 p-6 auto-rows-auto">
          <div className="col-span-2 row-span-3 p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 grid-item">
            <h3 className="text-lg font-semibold text-gray-800">
              Save your files
            </h3>
            <p className="text-gray-500 mb-4">
              We automatically save your files as you type.
            </p>
            <a
              href="/"
              className="text-blue-500 hover:underline inline-flex items-center"
            >
              Learn more
            </a>
          </div>

          <div className="col-span-1 row-span-1 p-6 bg-red-50 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 grid-item">
            <h3 className="text-lg font-semibold text-gray-800">
              Notifications
            </h3>
            <p className="text-gray-500 mb-4">
              Get notified when someone shares a file or mentions you in a
              comment.
            </p>
            <a
              href="/"
              className="text-blue-500 hover:underline inline-flex items-center"
            >
              Learn more
            </a>
          </div>

          <div className="col-span-1 row-span-1 p-6 bg-blue-50 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 grid-item">
            <h3 className="text-lg font-semibold text-gray-800">Item 2</h3>
            <p className="text-gray-500 mb-4">
              Additional content for the second row of the right column.
            </p>
          </div>

          <div className="col-span-1 row-span-1 p-6 bg-yellow-50 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 grid-item">
            <h3 className="text-lg font-semibold text-gray-800">Item 3</h3>
            <p className="text-gray-500 mb-4">
              Additional content for the third row of the right column.
            </p>
          </div>
        </div>
      </div> */}
    </>
  );
}
