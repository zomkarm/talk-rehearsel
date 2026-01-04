import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return new Response(JSON.stringify({ loggedIn: false }), { status: 200 })
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    return new Response(JSON.stringify({ loggedIn: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ loggedIn: false }), { status: 200 })
  }
}
