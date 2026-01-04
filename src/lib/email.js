import nodemailer from 'nodemailer'
import { getSetting } from '@/lib/settings'

// Create a reusable transporter
async function createTransporter() {
  const host = await getSetting('SMTP_HOST')
  const port = parseInt(await getSetting('SMTP_PORT') || '587', 10)
  const user = await getSetting('SMTP_USER')
  const pass = await getSetting('SMTP_PASS')

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  })
}

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Plain text body (optional)
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    const transporter = await createTransporter()

    const from = await getSetting('SMTP_FROM') || 'no-reply@example.com'

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    })

    console.log('Email sent:', info.messageId)
    return info
  } catch (err) {
    console.error('Email send error:', err)
    throw err
  }
}
