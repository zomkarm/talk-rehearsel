import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.JWT_SECRET
if (!SECRET) throw new Error('JWT_SECRET not set')

export function createToken(user) {
  //console.log('JWT_SECRET (createToken):', SECRET)
  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' })
}

export async function setAuthCookie(token) {
  const cookieStore =await cookies() // Awaited
  cookieStore.set('admin_auth_token', token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge: 3600, // 1 hour
  })
}

export async function getUserFromToken() {
  const cookieStore = await cookies() // Awaited
  const token = cookieStore.get('admin_auth_token')?.value
  if (!token) return null
  try {
    //console.log("Token IS NOT EMPTY")
    const payload = jwt.verify(token, SECRET); 
    //console.log(payload);
    return payload;
  } catch {
    //console.log("Token extraction failed");
    return null
  }
}
