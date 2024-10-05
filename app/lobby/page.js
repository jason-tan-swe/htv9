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

export default function Lobby() {
  const { data: session } = useSession()
  const router = useRouter()
  const state = useGameStateStore(state => state.current)
  const updateGameState = useGameStateStore(state => state.updateGameState)

  useEffect(() => {
    const onPactJoin = (fields) => {
      updateGameState({
        ...fields
      })
    }
    socket.on("pact:ready", onPactJoin)
  }, [])

  console.log("Jason state = ", state)

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
    const [card1Colors, setCard1Colors] = useState(state.hasPlayerOneConfirmed ? palette2 : palette1);
    const [card2Colors, setCard2Colors] = useState(state.hasPlayerTwoConfirmed ? palette2 : palette1);

    const [beam1Colors, setBeam1Colors] = useState({
      start: palette1.firstColor,
      stop: palette1.secondColor,
    });
  
    const [beam2Colors, setBeam2Colors] = useState({
      start: palette1.firstColor,
      stop: palette1.secondColor,
    });

    // Function to toggle colors for card 1 (including the beam)
    const toggleCard1Colors = async () => {
      await socket.emit("pact:ready", { email: session.user.email, pactId: state.pactId })
      const newCard1Colors = card1Colors.firstColor === palette1.firstColor ? palette2 : palette1;
      setCard1Colors(newCard1Colors);
      setBeam1Colors({
        start: newCard1Colors.firstColor,  // Use the full palette1 or palette2 for the beam
        stop: newCard1Colors.secondColor, 
      });
      console.log("Email and id = ", session.user.email, state.pactId)
    };

    // Function to toggle colors for card 2 (including the beam)
    const toggleCard2Colors = async () => {
      const newCard2Colors = card2Colors.firstColor === palette1.firstColor ? palette2 : palette1;
      setCard2Colors(newCard2Colors);
      setBeam2Colors({
        start: newCard2Colors.firstColor,  
        stop: newCard2Colors.secondColor, 
      });
    };

  if (!session) {
    return null;
  }

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center"> {/* Flexbox to center vertically and horizontally */}
      <AnimatedGrid>
        <PactVersus 
          pact1={state.playerOneMsg}
          pact2={state.playerTwoMsg} 
          Icon={Crosshair2Icon}  // Pass the Radix Icon here
        />
        <div className="mt-8"></div>
        <BeamConnection
        title1={state.players[0]?.name ?? 'Looking...'}
        title2={state.players[1]?.name ?? 'Looking...'}
          card1Colors={card1Colors}
          card2Colors={card2Colors}
          beam1Colors={beam1Colors}
          beam2Colors={beam2Colors}
          toggleCard1Colors={toggleCard1Colors} // Pass the toggle function as a prop
          toggleCard2Colors={toggleCard2Colors} // Pass the toggle function as a prop
        />
        {/* Buttons to toggle colors for each card */}
        <div className="mt-4 flex gap-8">
          <button onClick={toggleCard1Colors} className="px-4 py-2 bg-blue-500 text-white rounded">
            Ready Up
          </button>
        </div>
      </AnimatedGrid>
    </div>
  );
}
