"use client";

import { useState, useEffect } from "react";
import { socket } from "../../socket";
import AnimatedGrid from "../../components/AnimatedGrid";
import BeamConnection from "../../components/BeamConnection";
import PactVersus from "../../components/PactVersus";
import { Crosshair2Icon, IconVersus } from "@radix-ui/react-icons"; // Example of importing Radix icon
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGameStateStore } from "../../stores/game";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Lobby() {
  const { data: session } = useSession();
  const router = useRouter();
  const state = useGameStateStore((state) => state.current);
  const updateGameState = useGameStateStore((state) => state.updateGameState);
  // Define two color palettes for cards and beams
  const palette1 = {
    firstColor: "#ff0000", // Red
    secondColor: "#DC143C", // Crimson
  };

  const palette2 = {
    firstColor: "#00C853", // Strong Green
    secondColor: "#00FF00", // Light Green
  };

  // State for each card's colors and beams
  const [card1Colors, setCard1Colors] = useState(
    state.hasPlayerOneConfirmed ? palette2 : palette1
  );
  const [card2Colors, setCard2Colors] = useState(
    state.hasPlayerTwoConfirmed ? palette2 : palette1
  );
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const [beam1Colors, setBeam1Colors] = useState({
    start: palette1.firstColor,
    stop: palette1.secondColor,
  });

  const [beam2Colors, setBeam2Colors] = useState({
    start: palette1.firstColor,
    stop: palette1.secondColor,
  });

  const handleReadyUp = async () => {
    await socket.emit("pact:ready", {
      email: session.user.email,
      pactId: state.pactId,
    });
  };
  const [isCopied, setIsCopied] = useState(false);

  // Handle copy logic and reset message after 2 seconds
  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Function to toggle colors for card 1 (including the beam)
  const toggleCard1Colors = () => {
    const newCard1Colors =
      card1Colors.firstColor === palette1.firstColor ? palette2 : palette1;
    setCard1Colors(newCard1Colors);
    setBeam1Colors({
      start: newCard1Colors.firstColor, // Use the full palette1 or palette2 for the beam
      stop: newCard1Colors.secondColor,
    });
  };

  // Function to toggle colors for card 2 (including the beam)
  const toggleCard2Colors = async () => {
    const newCard2Colors =
      card2Colors.firstColor === palette1.firstColor ? palette2 : palette1;
    setCard2Colors(newCard2Colors);
    setBeam2Colors({
      start: newCard2Colors.firstColor,
      stop: newCard2Colors.secondColor,
    });
  };

  useEffect(() => {
    const onPactJoin = (fields) => {
      updateGameState({
        ...fields,
      });
      if (!fields.hasPlayerJoined) {
        if (fields.isFirstPlayer) {
          toggleCard1Colors();
        } else {
          toggleCard2Colors();
        }
      }
    };
    const onPactCreated = (fields) => {
      router.push("/home");
    };

    socket.on("pact:ready", onPactJoin);
    socket.on("pact:inProgress", onPactCreated);
  }, []);

  if (!session) {
    return null;
  }

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center">
      {/* Flexbox to center vertically and horizontally */}
      <AnimatedGrid>
        <PactVersus
          pact1={state.playerOneMsg}
          pact2={state.playerTwoMsg}
          Icon={Crosshair2Icon} // Pass the Radix Icon here
        />
        <div className="mt-8"></div>
        <BeamConnection
          title1={state.players[0]?.name ?? "Looking..."}
          title2={state.players[1]?.name ?? "Looking..."}
          card1Colors={card1Colors}
          card2Colors={card2Colors}
          beam1Colors={beam1Colors}
          beam2Colors={beam2Colors}
          toggleCard1Colors={toggleCard1Colors} // Pass the toggle function as a prop
          toggleCard2Colors={toggleCard2Colors} // Pass the toggle function as a prop
        />
        {/* Buttons to toggle colors for each card */}
        <div className="mt-4 flex flex-col gap-8">
          <button
            onClick={handleReadyUp}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Ready Up
          </button>
          <div className="flex justify-center flex-col">
            <div className="flex flex-col">
              <CopyToClipboard text={state.pactId} onCopy={handleCopy}>
                <div className="flex justify-center">
                  <button className="px-4 justify-center w-1/2 flex py-2 width-50% bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 transform focus:ring-1 focus:ring-blue-300">
                    Copy Lobby Code
                  </button>
                </div>
              </CopyToClipboard>

              {isCopied && (
                <div className="absolute flex justify-center mt-2 text-green-500 font-semibold ">
                  Code Copied!
                </div>
              )}
            </div>

            <div className="mt-4 text-gray-700 text-lg">
              Lobby Code: {state.pactId ? state.pactId : "ID Not Available"}
            </div>
          </div>
        </div>
      </AnimatedGrid>
    </div>
  );
}
