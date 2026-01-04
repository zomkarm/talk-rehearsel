import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'
import crypto from 'crypto'
import { getSetting } from '@/lib/settings'
import { sendEmail } from '@/lib/email'

function generateToken() {
  return crypto.randomBytes(32).toString('hex') // raw token
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export async function POST(req) {
  try {
    const { email } = await req.json()

    // Always return success to avoid user enumeration
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      //console.log("USER 111")
      return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' })
    }

    // Invalidate old tokens
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    })

    const rawToken = generateToken()
    const tokenHash = hashToken(rawToken)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30) // 30 min expiry

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    })

    // Build reset URL
    const baseUrl = await getSetting("APP_URL")
    const test_mode = await getSetting("TEST_MODE") 
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`

    //console.log(`raw token - ${rawToken}   ,,  token hash  - ${tokenHash}  ,,  baseUrl  - ${baseUrl}   ,,  resetUrl - ${resetUrl}`)
    
    if(test_mode === 'true'){
      //console.log("aaaaaaaaaaaaaaa")
      return NextResponse.json({ message: 'If this email exists, a reset link has been sent.', resetUrl: resetUrl })
    }else{
      await sendEmail({
          to: user.email,
          subject: 'TalkRehearsel – Reset Your Password',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color:#2d6cdf;">TalkRehearsel Password Reset</h2>
              <p>Hello ${user.name || 'there'},</p>
              <p>We received a request to reset your password. If you made this request, please click the button below:</p>
              <p style="margin:20px 0;">
                <a href="${resetUrl}" 
                   style="background-color:#2d6cdf; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px;">
                  Reset Password
                </a>
              </p>
              <p>If you didn’t request this, you can safely ignore this email. Your password will remain unchanged.</p>
              <p><strong>Note:</strong> This link will expire in 30 minutes.</p>
              <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />
              <p style="font-size:12px; color:#888;">
                This email was sent by TalkRehearsel. Please do not reply directly to this message.
              </p>
            </div>
          `,
          text: `
        TalkRehearsel Password Reset

        Hello ${user.name || 'there'},

        We received a request to reset your password. If you made this request, use the link below:

        ${resetUrl}

        If you didn’t request this, you can safely ignore this email. Your password will remain unchanged.

        Note: This link will expire in 30 minutes.

        -- TalkRehearsel
          `,
        })

      return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' })
    }
    
    //console.log('Password reset link:', resetUrl)
    
  } catch (err) {
    console.error('forgot-password error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
