"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

function HomePage() {
  const { data: session } = useSession();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [activePacts, setActivePacts] = useState([]);
  const maxPacts = 3; // Maximum number of pacts to display in the active section

  // Fetch the user's active pacts from the server
  useEffect(() => {
    const fetchActivePacts = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`http://localhost:8080/user/active-pacts/${session?.user?.email}`); // Correct template literal

          if (!response.ok) {
            throw new Error('Failed to fetch active pacts');
          }

          const data = await response.json();
          console.log(data);
          setActivePacts(data.activePacts);
        } catch (error) {
          console.error('Error fetching active pacts:', error);
        }
      }
    };

    fetchActivePacts();
  }, [session]);

  const handleClick = (pact) => {
    setSelectedFriend(pact);
  };

  const closeModal = () => {
    setSelectedFriend(null);
  };

  const markAsComplete = async (pact) => {
    try {
      const response = await fetch(`http://localhost:8080/pact/${pact._id}/complete`, { // Corrected the URL for patch request
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.email, // Replace with the actual userId from the context
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to update pact status');
      }

      const updatedPact = await response.json();

      // Update the local state to reflect the completed pact
      const updatedPacts = activePacts.map((p) =>
        p._id === pact._id ? { ...p, isComplete: true } : p
      );
      setActivePacts(updatedPacts);
      closeModal();
    } catch (error) {
      console.error('Error marking pact as complete:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Active Pacts</h1>

      {/* Active Pacts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {activePacts.slice(0, maxPacts).map((pact, index) => {
          // Find the friend in the pact (someone who is not the current user)
          const friend = pact.players.find(player => player.email !== session?.user?.email);
          const isCurrentUserFirstPlayer = pact.players[0].email === session?.user?.email;

          // Determine if the current user's task is complete and if the other player's task is incomplete
          const currentUserTaskCompleted = isCurrentUserFirstPlayer
            ? pact.playerOneTaskCompleted
            : pact.playerTwoTaskCompleted;
          const otherPlayerTaskIncomplete = isCurrentUserFirstPlayer
            ? !pact.playerTwoTaskCompleted
            : !pact.playerOneTaskCompleted;

          // Conditional gradient: yellow if current user completed and the other hasn't, otherwise regular gradients
          const gradientClass = currentUserTaskCompleted && otherPlayerTaskIncomplete
            ? 'from-yellow-400 to-yellow-500'
            : pact.isComplete
            ? 'from-gray-400 to-gray-500'
            : 'from-green-400 to-blue-500';

          return (
            <button
              key={index}
              onClick={() => handleClick(pact)}
              className={`bg-gradient-to-r ${gradientClass} text-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform`}
            >
              <h2 className="text-xl font-semibold">
                Pact with {friend?.name || 'Unknown'} {/* Display friend's name */}
              </h2>
              <p className="mt-2">
                {pact.isComplete ? 'Pact Complete' : 'Tap to view pact details'}
              </p>
            </button>
          );
        })}

        {/* Add placeholders for empty pact slots */}
        {Array.from({ length: maxPacts - activePacts.length }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 text-gray-500 p-4 rounded-lg shadow-md flex justify-center items-center"
          >
            <span className="text-4xl">+</span>
          </div>
        ))}
      </div>

      {/* Pact Details Modal */}
      {selectedFriend && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Pact with {selectedFriend.players.find(player => player.email !== session?.user?.email)?.name}
            </h3>
            <p className="text-gray-700 mb-6">{selectedFriend.playerOneMsg} - {selectedFriend.playerTwoMsg}</p>
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
