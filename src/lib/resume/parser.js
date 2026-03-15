import { PdfReader } from "pdfreader"
import mammoth from "mammoth"

function parsePdf(buffer) {
  return new Promise((resolve, reject) => {
    let text = ""

    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err)
        return
      }

      if (!item) {
        resolve(text.replace(/\s+/g, " ").trim())
        return
      }

      if (item.text) {
        text += item.text + " "
      }
    })
  })
}

export async function parseResume(file) {
  const buffer = Buffer.from(await file.arrayBuffer())

  /* -------------------------
     PDF Resume
  -------------------------- */
  if (file.type === "application/pdf") {
    return await parsePdf(buffer)
  }

  /* -------------------------
     DOCX Resume
  -------------------------- */
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer })

    return result.value.replace(/\s+/g, " ").trim()
  }

  throw new Error("Unsupported file format")
}