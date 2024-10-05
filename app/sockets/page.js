"use client"

import { useEffect } from "react";
import { socket } from "../../socket";

const SocketPage = () => {
  useEffect(() => {
    socket.on('connect', () => {
      
    })
  }, [])

  const handleJoinRoom = () => {
    socket.emit("pact:join") 
  }
  const handleCreateRoom = () => {
    socket.emit("pact:create") 
  }

  return (
    <div className="flex flex-col p-2 gap-4">
      <button className="bg-green-300 px-4 py-2" onClick={handleJoinRoom}>Join Room</button>
      <button className="bg-green-300 px-4 py-2" onClick={handleCreateRoom}>Create Room</button>
    </div>
  )
}

export default SocketPage