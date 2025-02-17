import { google } from "googleapis"

const FILE_NAME = "MyTextFile.txt"

export async function saveTextToDrive(text: string, accessToken: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const drive = google.drive({ version: "v3", auth })

  try {
    const response = await drive.files.list({
      q: `name='${FILE_NAME}' and mimeType='text/plain'`,
      spaces: "drive",
      fields: "files(id, name, webViewLink, modifiedTime)",
    })

    const files = response.data.files
    let fileId: string
    let webViewLink: string
    let modifiedTime: string

    if (files && files.length > 0) {
      // Update existing file
      fileId = files[0].id!
      const update = await drive.files.update({
        fileId: fileId,
        media: {
          mimeType: "text/plain",
          body: text,
        },
        fields: "id, name, webViewLink, modifiedTime",
      })
      webViewLink = update.data.webViewLink!
      modifiedTime = update.data.modifiedTime!
    } else {
      // Create new file
      const create = await drive.files.create({
        requestBody: {
          name: FILE_NAME,
          mimeType: "text/plain",
        },
        media: {
          mimeType: "text/plain",
          body: text,
        },
        fields: "id, name, webViewLink, modifiedTime",
      })
      fileId = create.data.id!
      webViewLink = create.data.webViewLink!
      modifiedTime = create.data.modifiedTime!
    }

    return {
      fileId,
      webViewLink,
      modifiedTime,
    }
  } catch (error) {
    console.error("Error saving file to Google Drive:", error)
    throw error
  }
}

export async function loadTextFromDrive(accessToken: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const drive = google.drive({ version: "v3", auth })

  try {
    const response = await drive.files.list({
      q: `name='${FILE_NAME}' and mimeType='text/plain'`,
      spaces: "drive",
      fields: "files(id, name, webViewLink, modifiedTime)",
    })

    const files = response.data.files
    if (files && files.length > 0) {
      const fileId = files[0].id!
      const result = await drive.files.get({
        fileId: fileId,
        alt: "media",
      })
      return {
        text: result.data as string,
        fileId: fileId,
        webViewLink: files[0].webViewLink,
        modifiedTime: files[0].modifiedTime,
      }
    } else {
      return {
        text: "",
        fileId: null,
        webViewLink: null,
        modifiedTime: null,
      }
    }
  } catch (error) {
    console.error("Error loading file from Google Drive:", error)
    throw error
  }
}

