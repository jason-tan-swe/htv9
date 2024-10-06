"use client";

import React, { useState } from 'react';

const friends = [
  { name: 'Alice', pactInfo: 'You and Alice are currently working on a fitness pact.', isComplete: false },
  { name: 'Bob', pactInfo: 'You and Bob are collaborating on a study pact.', isComplete: false },
  { name: 'Charlie', pactInfo: 'You and Charlie have a pact to read a book a week.', isComplete: false },
  { name: 'David' },
  { name: 'Eve' },
  { name: 'Frank' },
  { name: 'George' },
  { name: 'Hannah' },
  { name: 'Irene' },
  { name: 'Albert' },
  { name: 'Dodd' },
  // Add more friends as needed
];

function HomePage() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendsList, setFriendsList] = useState(friends);

  const handleClick = (friend) => {
    setSelectedFriend(friend);
  };

  const closeModal = () => {
    setSelectedFriend(null);
  };

  const markAsComplete = async (friend) => {
    try {
      // Send a PATCH request to the endpoint to update the pact status
      const response = await fetch(`/pact/${friend.pactId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: friend.userId, // Replace with the actual userId from the friend object or context
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update pact status');
      }

      console.log("Call Successful");
  
      const updatedPact = await response.json();
  
      // Update the local state to reflect the completed pact
      const updatedFriends = friendsList.map((f) =>
        f.name === friend.name ? { ...f, isComplete: true } : f
      );
      setFriendsList(updatedFriends);
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
        {friendsList.slice(0, 3).map((friend, index) => (
          <button
            key={index}
            onClick={() => handleClick(friend)}
            className={`bg-gradient-to-r ${
              friend.isComplete
                ? 'from-gray-400 to-gray-500'
                : 'from-green-400 to-blue-500'
            } text-white p-4 rounded-lg shadow-md transform hover:scale-105 transition-transform`}
          >
            <h2 className="text-xl font-semibold">{friend.name}</h2>
            <p className="mt-2">
              {friend.isComplete ? 'Pact Complete' : 'Tap to view pact details'}
            </p>
          </button>
        ))}
      </div>

      {/* Previous Pacts - Scrollable */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Friends</h2>
        <div className="h-[60vh] overflow-y-auto bg-white p-4 rounded-lg shadow-sm">
          <ul className="space-y-3">
            {friendsList.slice(3).map((friend, index) => (
              <li
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center justify-between"
              >
                <div className="text-lg">{friend.name}</div>
                {friend.pactInfo && friend.isComplete && (
                  <span className="text-green-600 font-bold">✔️ Completed</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pact Details Modal */}
      {selectedFriend && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Pact with {selectedFriend.name}
            </h3>
            <p className="text-gray-700 mb-6">{selectedFriend.pactInfo}</p>
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
