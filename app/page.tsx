"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ExternalLink } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<{
    fileId: string | null
    webViewLink: string | null
    modifiedTime: string | null
  } | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadText() {
      if (session) {
        setIsLoading(true)
        setError(null)
        try {
          const response = await fetch("/api/google-drive")
          if (!response.ok) throw new Error("Failed to load text")
          const data = await response.json()
          setText(data.text)
          setFileInfo({
            fileId: data.fileId,
            webViewLink: data.webViewLink,
            modifiedTime: data.modifiedTime,
          })
        } catch (err) {
          setError("Failed to load text from Google Drive. Please try again.")
          console.error(err)
        } finally {
          setIsLoading(false)
        }
      }
    }
    loadText()
  }, [session])

  const handleSave = async () => {
    if (session) {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/google-drive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        })
        if (!response.ok) throw new Error("Failed to save text")
        const data = await response.json()
        setFileInfo({
          fileId: data.fileId,
          webViewLink: data.webViewLink,
          modifiedTime: data.modifiedTime,
        })
        alert("Text saved successfully to Google Drive!")
      } catch (err) {
        setError("Failed to save text to Google Drive. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl space-y-4">
        {fileInfo && fileInfo.fileId && (
          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <h2 className="font-semibold mb-2">Google Drive File Information:</h2>
            <p>File ID: {fileInfo.fileId}</p>
            {fileInfo.modifiedTime && <p>Last Modified: {new Date(fileInfo.modifiedTime).toLocaleString()}</p>}
            {fileInfo.webViewLink && (
              <a
                href={fileInfo.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
              >
                View in Google Drive <ExternalLink size={16} />
              </a>
            )}
          </div>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 p-2 text-lg border rounded-md resize-none"
          placeholder="Enter your text here..."
          disabled={isLoading}
        />
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save to Google Drive"}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              Sign Out
            </button>
          </div>
        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  )
}

