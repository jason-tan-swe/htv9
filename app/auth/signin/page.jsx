"use client"

import { signIn } from "next-auth/react"

export default () => (
  <button onClick={async () => {
    await signIn("google", {callbackUrl: "/"})
  }}>Sign in with Google</button>
)