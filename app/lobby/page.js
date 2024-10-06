"use client";
import "./lobby.css";
import { useState, useEffect, useRef } from "react";
import { socket } from "../../socket";
import gsap from "gsap";
import AnimatedGrid from "../../components/AnimatedGrid";
import BeamConnection from "../../components/BeamConnection";
import PactVersus from "../../components/PactVersus";
import {
  HeartIcon,
  HomeIcon,
  Pencil1Icon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGameStateStore } from "../../stores/game";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Category, Rocket } from "@mui/icons-material";

export default function Lobby() {
  const { data: session } = useSession();
  const router = useRouter();
  const state = useGameStateStore((state) => state.current);
  const updateGameState = useGameStateStore((state) => state.updateGameState);

  const buttonRef = useRef(null); // Ref for the "Ready Up" button
  const kiwiRef = useRef(null); // Ref for the kiwi image (for any future animations)

  const categoryIconMap = {
    "Skill Development": RocketIcon,
    Creativity: Pencil1Icon,
    "Friendship & Family": HomeIcon,
    Lifestyle: HeartIcon,
  };

  const palette1 = {
    firstColor: "#ff0000", // Red
    secondColor: "#DC143C", // Crimson
  };

  const palette2 = {
    firstColor: "#00C853", // Strong Green
    secondColor: "#00FF00", // Light Green
  };

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
    gsap.to(buttonRef.current, {
      scale: 1.1,
      yoyo: true,
      repeat: 1,
      ease: "bounce.out",
      duration: 0.05, // Animation duration
    });

    await socket.emit("pact:ready", {
      email: session.user.email,
      pactId: state.pactId,
    });
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleCard1Colors = () => {
    const newCard1Colors =
      card1Colors.firstColor === palette1.firstColor ? palette2 : palette1;
    setCard1Colors(newCard1Colors);
    setBeam1Colors({
      start: newCard1Colors.firstColor,
      stop: newCard1Colors.secondColor,
    });
  };

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
    if (shouldUpdate) {
      if (state.isFirstPlayer) {
        toggleCard1Colors();
      } else {
        toggleCard2Colors();
      }
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);

  useEffect(() => {
    const onPactJoin = (fields) => {
      updateGameState({
        ...fields,
      });
      if (!fields.hasPlayerJoined) {
        setShouldUpdate(true);
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
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-kiwi text-richblack">
      {/* Flexbox to center vertically and horizontally */}
      <AnimatedGrid>
        <PactVersus
          pact1={state.playerOneMsg}
          pact2={state.playerTwoMsg}
          Icon={categoryIconMap[state.category]} // Pass the Radix Icon here
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
        <div className="relative w-full flex justify-center">
          {/* Add the Kiwi Image Between the Players */}
          <img
            ref={kiwiRef}
            src="/our_kiwi.png"
            alt="Kiwi"
            className="w-32 h-32 absolute top-1/2 transform -translate-y-1/2"
          />
        </div>

        <div className="mt-6 flex flex-col gap-8">
          <button
            ref={buttonRef} // Attach the ref for GSAP animation
            onClick={handleReadyUp}
            className="px-4 py-2 bg-richblack text-peach font-semibold rounded-lg hover:bg-richblack/90 transition duration-300"
          >
            Ready Up
          </button>

          <div className="flex justify-center flex-col">
            <div className="flex flex-col">
              <CopyToClipboard text={state.pactId} onCopy={handleCopy}>
                <div className="flex justify-center">
                  <button className="px-4 justify-center w-1/2 flex py-2 bg-richblack text-peach rounded-lg hover:bg-richblack/90 transition duration-300">
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

            <div className="mt-4 text-richblack text-lg">
              Lobby Code: {state.pactId ? state.pactId : "ID Not Available"}
            </div>
          </div>
        </div>
      </AnimatedGrid>
    </div>
  );
}
