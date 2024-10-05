"use client"

import { signIn } from "next-auth/react"

const SignIn = () => (
  <button onClick={async () => {
    await signIn("google", {callbackUrl: "/"})
  }}>Sign in with Google</button>
)

export default Signin