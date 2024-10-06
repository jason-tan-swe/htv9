"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { gsap } from "gsap";

export default function Home() {
  useEffect(() => {
    // GSAP Animation for spinning the circular text continuously
    gsap.to(".circular-text", {
      rotate: 360,
      duration: 10, // Adjust the duration as needed for the speed of the spin
      ease: "linear",
      repeat: -1, // Infinite spinning
      transformOrigin: "center center", // Ensures the text rotates around the center of the circle
    });

    // Optional animation to scale up the kiwi on page load
    gsap.fromTo(
      ".kiwi-image",
      { scale: 0.8 },
      { scale: 1, duration: 1.5, ease: "power2.out" }
    );
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="h-[100vh] flex flex-col md:flex-row  items-center justify-between bg-kiwi relative p-6">
        {/* Hero Text on the left */}
        <div className="flex flex-col max-w-lg text-left">
          <h1 className="text-6xl font-black text-color-richblack pl-4 mb-6 leading-tight block-text text-Expose">
            Staying Accountable <br /> with{" "}
            <span className="text-darkpeach">Pacts</span>
          </h1>
          <p className="font-Expose pl-4 font-family-body text-xl mb-10">
            Achieve your goals by forming pacts with friends and mentors. Track
            progress, stay on track, and celebrate success together.
          </p>
          <button
            className="px-8 py-4 bg-darkpeach  text-white font-semibold rounded-full hover:bg-peach transition"
            onClick={async () => {
              await signIn("google", { callbackUrl: "/home" });
            }}
          >
            Get Started
          </button>
        </div>

        {/* Kiwi Image and SVG Circular Text */}
        <div className="relative flex items-center justify-center">
          {/* Kiwi Image */}
          <div className="absolute kiwi-image">
            <img
              src="our_kiwi.png"
              alt="Kiwi"
              className="w-52 h-52 mx-auto"
              style={{ clipPath: "circle(50%)" }}
            />
          </div>

          {/* SVG Text on a circular path */}
          <svg
            width="600"
            height="600"
            viewBox="0 0 600 600"
            xmlns="http://www.w3.org/2000/svg"
            className="circular-text"
          >
            <defs>
              <path
                id="circlePath"
                d="M 300, 300
                   m -200, 0
                   a 200,200 0 1,1 400,0
                   a 200,200 0 1,1 -400,0"
              />
            </defs>

            <text fill="#000" fontSize="24" fontWeight="bold">
              <textPath
                href="#circlePath"
                className="circular-text-path"
                startOffset="25%"
              >
                Stay Accountable with Pacts • Stay Accountable with Pacts • Stay
                Accountable with Pacts • Stay Accountable with Pacts
              </textPath>
            </text>
          </svg>
        </div>
      </div>
      {/* How It Works Section */}
      <div className="py-20 bg-kiwi text-richblack h-screen">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12 text-color-richblack">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-darkpeach text-2xl  text-richblack rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-richblack">
                Set a Goal
              </h3>
              <p className="text-xl">
                Define your goal, whether it's personal or professional, and
                make a pact with someone to stay accountable.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-darkpeach text-2xl  text-richblack rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-richblack">
                Keep the Pact
              </h3>
              <p className="text-xl">
                Hold friends accountable! With up to 3 pacts, stay focused
                without overcommitting.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-darkpeach text-2xl  text-richblack rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-richblack">
                Celebrate Success
              </h3>
              <p className="text-xl">
                Achieve your goals, and celebrate your progress with your
                accountability partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
