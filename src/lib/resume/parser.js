import pdf from "pdf-parse"
import mammoth from "mammoth"

export async function parseResume(file){

  const buffer = Buffer.from(await file.arrayBuffer())

  if(file.type === "application/pdf"){
    const data = await pdf(buffer)
    return data.text.replace(/\s+/g, " ").trim()
  }

  if(
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ){
    const result = await mammoth.extractRawText({ buffer })
    return result.value.replace(/\s+/g, " ").trim()
  }

  throw new Error("Unsupported file format")
}