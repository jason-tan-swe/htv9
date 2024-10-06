"use client";

import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, Button, TextField, Typography } from "@mui/material";
import { socket } from "../../socket/index";
import { useSession } from "next-auth/react";
import { useGameStateStore } from "../../stores/game";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HeartIcon, HomeIcon, Pencil1Icon, RocketIcon } from "@radix-ui/react-icons"; // Example of importing Radix icon

export default function Category() {
  const { data: session } = useSession();
  const router = useRouter();
  const state = useGameStateStore((state) => state.current);
  const updateGameState = useGameStateStore((state) => state.updateGameState);

  const [roomCode, setRoomCode] = useState("");
  const [promptModal, setPromptModal] = useState(false);
  const [category, setCategory] = useState("");
  const [prompt, setPrompt] = useState("");

  const categoryIconMap = {
    "Skill Development": RocketIcon,
    "Creativity": Pencil1Icon,
    "Friendship & Family": HomeIcon,
    "Lifestyle": HeartIcon
  };


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

  const handleOpenModal = (c) => {
    setPromptModal(true);
    setCategory(c);
  };

  const handleCreatePact = async () => {
    try {
      await socket.emit("pact:create", {
        email: session.user.email,
        pactMessage: prompt,
        category: category,
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
        category: category,
      });
      router.push("/lobby");
    } catch (err) {
      console.error(err);
    }
  };

  if (!session) {
    return null;
  }

  const CategoryIcon = categoryIconMap[category]; // Get the corresponding icon for the category

  return (
    <>
      <div className="flex flex-col h-screen p-6 space-y-6">
        {/* First row */}
        <div className="flex-1 flex space-x-6">
          <button
            onClick={() => handleOpenModal("Skill Development")}
            className="flex-1 h-full bg-blue-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer"
          >
            Skill Development
          </button>
          <button
            onClick={() => handleOpenModal("Creativity")}
            className="flex-1 h-full bg-green-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer"
          >
            Creativity
          </button>
        </div>

        {/* Second row */}
        <div className="flex-1 flex space-x-6">
          <button
            onClick={() => handleOpenModal("Friendship & Family")}
            className="flex-1 h-full bg-red-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer"
          >
            Friendship & Family
          </button>
          <button
            onClick={() => handleOpenModal("Lifestyle")}
            className="flex-1 h-full bg-yellow-500 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center text-white text-2xl rounded-lg shadow-lg cursor-pointer"
          >
            Lifestyle
          </button>
        </div>

      </div>

      <Modal
        open={promptModal}
        onClose={() => setPromptModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="flex items-center justify-center"
      >
        <Box
          className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full space-y-6" // Uniform padding and space between elements
          style={{ borderRadius: "12px" }} // Updated to smoother corner radius
        >
        <Typography
          variant="h5"
          id="modal-title"
          className="text-gray-900 font-bold mb-6 text-center" // Centered and bold title
        >
          {CategoryIcon && (
            <CategoryIcon
              style={{ fontSize: "8px", width: "25px", height: "25px" }} // Explicitly set the size of the icon
              className="inline-block mb-2"
            />
          )} {/* Increased icon size explicitly */}
          <span>{category ? `Create a Pact for ${category}` : "Create a Pact"}</span>
        </Typography>
          <div className="space-y-6"> {/* Adjusted spacing for cleaner look */}
            <TextField
              label="Your Task"
              fullWidth
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              variant="outlined"
              className="rounded-lg" // Added rounded corners to text field
            />

            <TextField
              label="Room Code (optional)"
              fullWidth
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              variant="outlined"
              className="rounded-lg" // Added rounded corners to text field
            />
          </div>

          <div className="flex justify-between mt-8 space-x-4"> {/* Increased spacing between buttons */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleJoinPact}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 transition-transform transform hover:scale-105"
              style={{ borderRadius: "10px" }}
            >
              Join Pact
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={handleCreatePact}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 transition-transform transform hover:scale-105"
              style={{ borderRadius: "10px" }}
            >
              Create Pact
            </Button>
          </div>
        </Box>
      </Modal>

      {/* ToastContainer to show notifications */}
      <ToastContainer 
      limit={2}
      />
    </>
  );
}
