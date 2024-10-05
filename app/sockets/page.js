"use client"

import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const SocketPage = () => {
  const {data:session} = useSession()
  const [pactId, setPactId] = useState("")
  const [players, setPlayers] = useState([])
  const [hasPlayerOneConfirmed, setHasPlayerOneConfirmed] = useState(false)
  const [hasPlayerTwoConfirmed, setHasPlayerTwoConfirmed] = useState(false)
  console.log(session)

  useEffect(() => {
    const onPactJoin = (args) => {
      console.log(args)
      const { players, pactId, hasPlayerOneConfirmed, hasPlayerTwoConfirmed } = args
      setPlayers(players)
      setHasPlayerOneConfirmed(hasPlayerOneConfirmed)
      setHasPlayerTwoConfirmed(hasPlayerTwoConfirmed)
      setPactId(pactId)
    }


    socket.on("pact:join", onPactJoin)
    socket.on("pact:ready", onPactJoin)
  }, [])

  if (!session) {
    return <>
      <p>You&apos;re not signed in! </p>
      <button onClick={async () => await signIn("google", {callbackUrl: "/"})}>Sign In</button>
    </>
  }

  const handleJoinRoom = () => {
    socket.emit("pact:join", { email: session.user.email, pactId }) 
  }
  const handleCreateRoom = () => {
    socket.emit("pact:create", { email: session.user.email }) 
  }
  const handleReadyRoom = () => {
    socket.emit("pact:ready", { email: session.user.email, pactId })
  }

  return (
    <div className="flex flex-col p-2 gap-4">
      <input className="border border-green-300 b-2 " type="text" value={pactId} onChange={(e) => setPactId(e.target.value)}/>
      <button className="bg-green-300 px-4 py-2" onClick={handleJoinRoom}>Join Room</button>
      <button className="bg-green-300 px-4 py-2" onClick={handleCreateRoom}>Create Room</button>
      <button className="bg-green-300 px-4 py-2" onClick={handleReadyRoom}>Ready</button>
      {players.map((player, index) => <p key={player._id}>{player.email} {index === 0 ? `Hello ${hasPlayerOneConfirmed}` : `Hello 2${hasPlayerTwoConfirmed}`} </p>)}
    </div>
  )
}

export default SocketPage