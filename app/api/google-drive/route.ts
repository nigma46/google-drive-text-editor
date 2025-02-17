import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { saveTextToDrive, loadTextFromDrive } from "@/utils/googleDrive"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { text } = await req.json()
    const result = await saveTextToDrive(text, session.accessToken as string)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error saving to Google Drive:", error)
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const result = await loadTextFromDrive(session.accessToken as string)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error loading from Google Drive:", error)
    return NextResponse.json({ error: "Failed to load file" }, { status: 500 })
  }
}

