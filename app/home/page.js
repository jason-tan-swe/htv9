"use client";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

import "./page.css";
gsap.registerPlugin(ScrollTrigger);
export default function Home() {
  useEffect(() => {
    const gridItems = document.querySelectorAll(".grid-item");

    // GSAP Animation
    gsap.to(gridItems, {
      opacity: 1, // Start at fully visible
      y: 0, // No vertical offset initially
      scale: 1, // Full size initially

      ease: "power1.out",
      stagger: 0.05, // Add stagger to make it feel smoother
    });

    // Floating animation for bubble effect
    gridItems.forEach((item) => {
      gsap.to(item, {
        y: "+=2", // Float up
        repeat: -1, // Infinite repeat
        yoyo: true, // Reverse on repeat
        ease: "sine.inOut", // Smooth, wave-like effect
        duration: 2,
        delay: 1, // Randomize the start time
      });
    });
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
        <div className="">Parallax</div>
      </div>

      <div className="flex justify-center h-[100vh] bg-blue-50">
        <div className="grid grid-cols-3 grid-rows-3 gap-6 p-6 auto-rows-auto">
          {/* Save your files (Spans left column, across both rows) */}
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

          {/* Notifications (Occupies the first row of the right column) */}
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

          {/* Additional items (Second row, right column) */}
          <div className="col-span-1 row-span-1 p-6 bg-blue-50 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 grid-item">
            <h3 className="text-lg font-semibold text-gray-800">Item 2</h3>
            <p className="text-gray-500 mb-4">
              Additional content for the second row of the right column.
            </p>
          </div>

          {/* Additional items (Third row, right column) */}
          <div className="col-span-1 row-span-1 p-6 bg-yellow-50 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 grid-item">
            <h3 className="text-lg font-semibold text-gray-800">Item 3</h3>
            <p className="text-gray-500 mb-4">
              Additional content for the third row of the right column.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
