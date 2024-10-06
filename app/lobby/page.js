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
import { Category, Rocket } from "@mui/icons-material";
import { ContentCopy as CopyIcon } from "@mui/icons-material"; // Import Material-UI Copy Icon


export default function Lobby() {
  const { data: session } = useSession();
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const state = useGameStateStore((state) => state.current);
  const updateGameState = useGameStateStore((state) => state.updateGameState);

  console.log("Jason state = ", state);

  // Define two color palettes for cards and beams
  const palette1 = {
    firstColor: "#FFB885", // Peach
    secondColor: "#FFA96B", // Dark Peach
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

  const [beam1Colors, setBeam1Colors] = useState({
    start: palette1.firstColor,
    stop: palette1.secondColor,
  });

  const [beam2Colors, setBeam2Colors] = useState({
    start: palette1.firstColor,
    stop: palette1.secondColor,
  });

  const handleReadyUp = async () => {
    setIsReady(true);
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
  console.log(session);

  useEffect(() => {
    console.log(state?.isFirstPlayer);
    if (state?.isFirstPlayer) {
      toggleCard1Colors();
    } else {
      toggleCard2Colors();
    }
  }, [state, session]);

  useEffect(() => {
    const onPactJoin = (fields) => {
      updateGameState({
        ...fields,
      });
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
          toggleCard1Colors={toggleCard1Colors}
          toggleCard2Colors={toggleCard2Colors}
        />

        <div className="mt-14 flex flex-col gap-8">
        <button
          onClick={handleReadyUp}
          ref={buttonRef}
          className={`px-10 py-4 rounded-full text-xl text-white font-bold transition-transform transform-gpu duration-300 font-Expose ${
            isReady
              ? "bg-green-500 cursor-not-allowed opacity-80 font-Expose"
              : "bg-gradient-to-r from-peach to-darkpeach hover:from-orange-500 hover:to-orange-600 hover:scale-105 shadow-lg font-Expose"
          }`}
          disabled={isReady} // Disable the button after clicking
        >
          {isReady ? "Comitted" : "Confirm Pact"}
      </button>


      <div className="flex justify-center flex-col items-center">
        <div className="flex items-center mt-4">
          <img
            src="/our_kiwi.png"
            alt="Kiwi Logo"
            className="w-10 h-10 mr-4" // Adjust the size (w-10, h-10) as needed
          />
          <span className="text-1xl text-gray-700 mr-2 font-Expose">
            Lobby Code: {state.pactId ? state.pactId : "ID Not Available"}
          </span>
          <CopyToClipboard text={state.pactId} onCopy={handleCopy}>
            <button className="ml-2 text-gray-600 hover:text-gray-800 transition">
              <CopyIcon className="text-3xl" />
            </button>
          </CopyToClipboard>
          </div>

            {isCopied && (
              <div className="mt-2 text-green-500 font-semibold">Code Copied!</div>
            )}
          </div>
        </div>
      </AnimatedGrid>
    </div>
  );
}
