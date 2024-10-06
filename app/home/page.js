"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link"; // Import Link from next
import { RocketIcon, Pencil1Icon, HomeIcon, HeartIcon } from '@radix-ui/react-icons'; // Import Radix icons
import { socket } from "../../socket/index";
import { usePactStore } from "../../stores/pact";

function HomePage() {
  const { data: session } = useSession();
  const { activePacts, addPact, updatePact, setPact, removePact } = usePactStore()
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [categories, setCategories] = useState([]); // Add state for categories
  const maxPacts = 3; // Maximum number of pacts to display in the active section

  // Category Icon Mapping
  const categoryIconMap = {
    "Skill Development": RocketIcon,
    "Creativity": Pencil1Icon,
    "Friendship & Family": HomeIcon,
    "Lifestyle": HeartIcon
  };

  useEffect(() => {
    if (!session) {
      return
    }

    const onPactUpdate = async (payload) => {
      const { updatedPact } = payload
      updatePact(updatedPact)
    }
    const onPactClose = async (payload) => {
      const { removedPactId } = payload
      removePact(removedPactId)
    }
    const onPactJoinedActive = async (payload) => {
      const { activePacts } = payload
      setPact(activePacts)
    }

    // Emit event to join all active pacts
    socket.emit("pact:join-active", { email: session?.user?.email })
    socket.on("pact:update", onPactUpdate)
    socket.on("pact:close", onPactClose)
    socket.on("pact:joined-active", onPactJoinedActive)
  }, [session])
  console.log("Jason session = ", activePacts)
  // Fetch the user's friends list from the server
  useEffect(() => {
    const fetchFriends = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:8080'}/user/${session.user.email}/friends`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch friends list");
          }

          const data = await response.json();
          setFriends(data.friends);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }
    };

    fetchFriends();
  }, [session]);

  // Fetch pact categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:8080'}/pact/categories`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (pact) => {
    setSelectedFriend(pact);
  };

  const closeModal = () => {
    setSelectedFriend(null);
  };

  const markAsComplete = async (pact) => {
    try {
      // Emit event
      await socket.emit("pact:complete", {email: session?.user?.email, pactId: pact._id})
      closeModal();
    } catch (error) {
      console.error("Error marking pact as complete:", error);
    }
  };

  if (!session) {
    return null
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
              ? "from-yellow-400 to-yellow-500"
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
                <p className="text-gray-500">{friend.email}</p>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">
                    Relationship Score:{" "}
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          friend.relationshipScore
                            ? friend.relationshipScore
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {friend.relationshipScore ? friend.relationshipScore : 0} /
                    100
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
            <h4 className="text-xl font-bold mb-4">Pact Categories</h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {categories.length > 0 ? (
                categories.map((category) => {
                  const IconComponent = categoryIconMap[category.name]; // Get the corresponding icon

                  return (
                    <div
                      key={category._id}
                      className="flex items-center space-x-3 p-3 rounded-lg shadow-md bg-gray-100"
                    >
                      {IconComponent && <IconComponent className="text-2xl" />} {/* Render the icon */}
                      <span className="text-lg font-semibold">
                        {category.name}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p>No categories available</p>
              )}
            </div>

            <button
              onClick={() => markAsComplete(selectedFriend)}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors mb-4"
            >
              Mark as Complete
            </button>
            <button
              onClick={closeModal}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
