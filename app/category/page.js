"use client";

import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, Button, Input, TextField, Typography } from "@mui/material";
import { socket } from "../../socket/index";
import { useSession } from "next-auth/react";
import { useGameStateStore } from "../../stores/game";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Category() {
  const { data: session } = useSession();
  const router = useRouter();
  const state = useGameStateStore((state) => state.current);
  const updateGameState = useGameStateStore((state) => state.updateGameState);

  const [roomCode, setRoomCode] = useState("");
  const [promptModal, setPromptModal] = useState(false);
  const [category, setCategory] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const onPactJoin = (fields) => {
      updateGameState({
        ...fields,
      });
    };
    updateGameState({
      players: [],
      pactId: "",
      hasPlayerOneConfirmed: false,
      hasPlayerTwoConfirmed: false,
      playerOneMsg: "",
      playerTwoMsg: "",
      isFirstPlayer: false,
    });
    socket.on("pact:join", onPactJoin);
  }, []);

  console.log("Jason cat = ", state);

  const handleOpenModal = (c) => {
    setPromptModal(true);
    setCategory(c);
  };

  const handleCreatePact = async () => {
    try {
      // Send event to Socket server and update current state
      await socket.emit("pact:create", {
        email: session.user.email,
        pactMessage: prompt,
      });

      router.push("/lobby");
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinPact = async () => {
    if (!roomCode.trim()) {
      toast.error("Please enter a valid room code.", {
        position: "bottom-center",
      });
      return; // Stop execution if roomCode is invalid
    }
    try {
      await socket.emit("pact:join", {
        email: session.user.email,
        pactId: roomCode,
        pactMessage: prompt,
      });
      router.push("/lobby");
    } catch (err) {
      console.error(err);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col h-screen p-6 space-y-6">
        {/* First row */}
        <div className="flex-1 flex space-x-6">
          <button
            onClick={() => handleOpenModal("Category 1")}
            className="flex-1 h-full bg-blue-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer"
          >
            Category 1
          </button>
          <button
            onClick={() => handleOpenModal("Category 2")}
            className="flex-1 h-full bg-green-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer"
          >
            Category 2
          </button>
        </div>

        {/* Second row */}
        <div className="flex-1 flex space-x-6">
          <button
            onClick={() => handleOpenModal("Category 3")}
            className="flex-1 h-full bg-red-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer"
          >
            Category 3
          </button>
          <button
            onClick={() => handleOpenModal("Category 4")}
            className="flex-1 h-full bg-yellow-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer"
          >
            Category 4
          </button>
        </div>
      </div>

      <Modal open={promptModal} onClose={() => setPromptModal(false)}>
        <Box className="bg-red-200">
          <TextField
            placeholder="Your task"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <TextField
            placeholder="Room Code (optional)"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <Button variant="secondary" onClick={handleJoinPact}>
            Join
          </Button>
          <Button variant="secondary" onClick={handleCreatePact}>
            Create
          </Button>
        </Box>
      </Modal>

      {/* ToastContainer to show notifications */}
      <ToastContainer />
    </>
  );
}
