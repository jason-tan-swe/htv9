"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { RocketIcon, Pencil1Icon, HomeIcon, HeartIcon } from '@radix-ui/react-icons'; // Import Radix icons
import { socket } from "../../socket/index";
import { usePactStore } from "../../stores/pact";

function HomePage() {
  const { data: session } = useSession();
  const { activePacts, addPact, updatePact, setPact, removePact } = usePactStore();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const maxPacts = 3; // Maximum number of pacts to display in the active section

  const categoryIconMap = {
    "Skill Development": RocketIcon,
    "Creativity": Pencil1Icon,
    "Friendship & Family": HomeIcon,
    "Lifestyle": HeartIcon,
  };

  useEffect(() => {
    if (!session) {
      return;
    }

    const onPactUpdate = async (payload) => {
      const { updatedPact } = payload;
      updatePact(updatedPact);
    };
    const onPactClose = async (payload) => {
      const { removedPactId } = payload;
      removePact(removedPactId);
    };
    const onPactJoinedActive = async (payload) => {
      const { activePacts } = payload;
      setPact(activePacts);
    };

    // Emit event to join all active pacts
    socket.emit("pact:join-active", { email: session?.user?.email });
    socket.on("pact:update", onPactUpdate);
    socket.on("pact:close", onPactClose);
    socket.on("pact:joined-active", onPactJoinedActive);
  }, [session]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:8080'}/user/${session.user.email}/friends`
          );
          const data = await response.json();
          setFriends(data.friends);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }
    };

    fetchFriends();
  }, [session]);

  const handleClick = (pact) => {
    setSelectedFriend(pact);
  };

  const closeModal = () => {
    setSelectedFriend(null);
  };

  const markAsComplete = async (pact) => {
    try {
      // Emit event
      await socket.emit("pact:complete", { email: session?.user?.email, pactId: pact._id });
      closeModal();
    } catch (error) {
      console.error("Error marking pact as complete:", error);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Active Pacts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {activePacts.slice(0, maxPacts).map((pact, index) => {
          const friend = pact.players.find(
            (player) => player.email !== session?.user?.email
          );
          const isCurrentUserFirstPlayer =
            pact.players[0].email === session?.user?.email;
          const currentUserTaskCompleted = isCurrentUserFirstPlayer
            ? pact.playerOneTaskCompleted
            : pact.playerTwoTaskCompleted;
          const otherPlayerTaskIncomplete = isCurrentUserFirstPlayer
            ? !pact.playerTwoTaskCompleted
            : !pact.playerOneTaskCompleted;
          const gradientClass =
            currentUserTaskCompleted && otherPlayerTaskIncomplete
              ? "from-peach to-darkpeach"
              : pact.isComplete
              ? "from-gray-400 to-gray-500"
              : "from-green-400 to-blue-500";

          return (
            <button
              key={index}
              onClick={() => handleClick(pact)}
              className={`bg-gradient-to-r ${gradientClass} text-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform`}
            >
              <h2 className="text-xl font-semibold">
                Pact with {friend?.name || "Unknown"}
              </h2>
              <p className="mt-2">
                {pact.isComplete ? "Pact Complete" : "Tap to view pact details"}
              </p>
            </button>
          );
        })}

        {Array.from({ length: maxPacts - activePacts.length }).map(
          (_, index) => (
            <Link href="/category" key={index}>
              <div className="bg-gray-200 text-gray-500 p-4 rounded-lg shadow-md flex justify-center items-center hover:bg-gray-300 transition-colors cursor-pointer">
                <span className="text-4xl">+</span>
              </div>
            </Link>
          )
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Friends List</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend._id}
              className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{friend.name}</h3>
                <p className="text-gray-500 font-Expose">{friend.email}</p>
                <div className="mt-2">
                  <span className="text-sm text-gray-600 font-Expose">
                    Relationship Score:{" "}
                  </span >
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-darkpeach h-2 rounded-full"
                      style={{
                        width: `${friend.score ? Math.min(friend.score, 100) : 0}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {friend.score ? Math.min(friend.score, 100) : 0} / 100
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No friends found</p>
        )}
      </div>

      {selectedFriend && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Pact with{" "}
              {
                selectedFriend.players.find(
                  (player) => player.email !== session?.user?.email
                )?.name
              }
            </h3>
            <p className="text-gray-700 mb-6">
              {selectedFriend.playerOneMsg} - {selectedFriend.playerTwoMsg}
            </p>

            {/* Display pact categories inline */}
            <h4 className="text-xl font-bold mb-4">Pact Category</h4>
            <div className="flex items-center space-x-3 p-3 rounded-lg shadow-md bg-gray-100 mb-6">
              {selectedFriend.category && (
                <>
                  {categoryIconMap[selectedFriend.category] &&
                    React.createElement(categoryIconMap[selectedFriend.category], { className: "text-2xl" })}
                  <span className="text-lg font-semibold">
                    {selectedFriend.category}
                  </span>
                </>
              )}
            </div>

            {/* Determine if the user has already marked the pact as complete */}
            <button
              onClick={() => markAsComplete(selectedFriend)}
              disabled={
                (selectedFriend.players[0].email === session?.user?.email &&
                  selectedFriend.playerOneTaskCompleted) ||
                (selectedFriend.players[1].email === session?.user?.email &&
                  selectedFriend.playerTwoTaskCompleted)
              }
              className={`w-full py-2 rounded-lg transition-colors mb-4 font-Expose ${
                (selectedFriend.players[0].email === session?.user?.email &&
                  selectedFriend.playerOneTaskCompleted) ||
                (selectedFriend.players[1].email === session?.user?.email &&
                  selectedFriend.playerTwoTaskCompleted)
                  ? "bg-darkestkiwi text-white cursor-not-allowed"
                  : "bg-peach text-white hover:bg-darkpeach"
              }`}
            >
              {(selectedFriend.players[0].email === session?.user?.email &&
                selectedFriend.playerOneTaskCompleted) ||
              (selectedFriend.players[1].email === session?.user?.email &&
                selectedFriend.playerTwoTaskCompleted)
                ? "Completed"
                : "Mark as Complete"}
            </button>

            <button
              onClick={closeModal}
              className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors font-Expose"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
