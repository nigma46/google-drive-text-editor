"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthError() {
  const router = useRouter()

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error")
    console.error("Authentication error:", error)

    // Redirect to home page after 5 seconds
    const timer = setTimeout(() => {
      router.push("/")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p className="mb-4">There was an error during the authentication process. Please try again.</p>
      <p>You will be redirected to the home page in 5 seconds...</p>
    </div>
  )
}

