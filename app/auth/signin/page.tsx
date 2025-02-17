"use client"

import { signIn } from "next-auth/react"

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="rounded bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sign in with Google
      </button>
    </div>
  )
}

