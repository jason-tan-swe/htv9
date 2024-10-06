"use client";

import { useEffect } from "react"; // Import useState and useEffect
import { socket } from "../socket";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-600 text-white overflow-y-auto">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Stay Accountable with <span className="text-yellow-400">Pacts</span>
        </h1>
        <p className="text-xl max-w-2xl mb-10">
          Achieve your goals by forming pacts with friends and mentors. Track progress, stay on track, and celebrate success together.
        </p>
        <button
          className="px-8 py-4 bg-yellow-400 text-purple-800 font-semibold rounded-full hover:bg-yellow-500 transition"
          onClick={async () => {
            await signIn("google", { callbackUrl: "/home" });
          }}
        >
          Get Started
        </button>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-100 text-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4">Set a Goal</h3>
              <p>Define your goal, whether it's personal or professional, and make a pact with someone to stay accountable.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4">Keep the Pact</h3>
              <p>Hold friends accountable! With up to 3 pacts, stay focused without overcommitting.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4">Celebrate Success</h3>
              <p>Achieve your goals, and celebrate your progress with your accountability partners.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Real-Time Tracking</h3>
              <p>Monitor progress in real-time with simple yet powerful tools that keep you on track.</p>
            </div>
            <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Collaborative Pacts</h3>
              <p>Create pacts with friends, family, or mentors to stay accountable and motivated.</p>
            </div>
            <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Custom Reminders</h3>
              <p>Set reminders for deadlines or check-ins to ensure you never fall behind.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-100 text-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">What People Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="mb-4">
                &quot;The best app to keep me accountable! I&apos;ve hit every goal I&apos;ve set.&quot;
              </p>
              <span className="font-semibold">- Alex Johnson</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="mb-4">
                &quot;Forming pacts with my team has made our projects more successful than ever.&quot;
              </p>
              <span className="font-semibold">- Maria Lopez</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="mb-4">
                &quot;Finally, a way to stay motivated with the help of my friends!&quot;
              </p>
              <span className="font-semibold">- Brian Lee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to Stay Accountable?</h2>
        <p className="text-xl mb-10">Join now and start making pacts with your friends and colleagues today.</p>
        <button className="px-8 py-4 bg-yellow-400 text-purple-800 font-semibold rounded-full hover:bg-yellow-500 transition">
          Sign Up for Free
        </button>
      </div>
    </div>
  );
}
