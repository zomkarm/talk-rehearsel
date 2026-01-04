import prisma from '@/lib/prisma/client'

export async function SettingSeeder() {
  try {
    await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE
          "setting"
        RESTART IDENTITY CASCADE
      `);
    
    await prisma.setting.createMany({
      data: [
        { key: 'APP_NAME', value: 'TalkRehearsel', description: 'Application name' },
        { key: 'APP_URL', value: 'http://localhost:3000', description: 'Base URL' },
        { key: 'APP_ENV', value: 'development', description: 'Environment' },
        { key: 'TEST_MODE', value: 'true', description: 'Glbal Test Mode' },
        { key: 'PLATFORM_LOGO_URL', value: '', description: 'Platform logo URL' },
        { key: 'PLATFORM_FAVICON_URL', value: '', description: 'Favicon URL' },
        { key: 'PRIMARY_COLOR', value: '#2563eb', description: 'Primary brand color' },
        { key: 'SECONDARY_COLOR', value: '#64748b', description: 'Secondary brand color' },
        { key: 'SUPPORT_EMAIL', value: 'support@test.com', description: 'Support email' },
        { key: 'SUPPORT_PHONE', value: '', description: 'Support phone number' },
        { key: 'DEFAULT_LANGUAGE', value: 'en', description: 'Default language' },
        { key: 'DEFAULT_TIMEZONE', value: 'UTC', description: 'Default timezone' },

        // Payments selector
        { key: 'PAYMENT_PROVIDER', value: 'lemonsqueezy', description: 'Active payment provider' },
        { key: 'PAYMENT_PROVIDERS_ENABLED', value: 'lemonsqueezy,stripe,razorpay', description: 'Allowed providers in this environment' },

        // Optional mode toggles
        { key: 'LEMONSQUEEZY_MODE', value: 'test', description: 'Lemon Squeezy environment mode' },
        { key: 'STRIPE_MODE', value: 'test', description: 'Stripe environment mode' },
        { key: 'RAZORPAY_MODE', value: 'test', description: 'Razorpay environment mode' },
        { key: 'PAYPAL_MODE', value: 'test', description: 'PayPal environment mode' },

        // Payments & Billing
        { key: 'DEFAULT_CURRENCY', value: 'USD', description: 'Default currency' },
        { key: 'SUPPORTED_CURRENCIES', value: 'USD,INR,EUR', description: 'Supported currencies' },
        { key: 'BILLING_ADDRESS_REQUIRED', value: 'false', description: 'Require billing address' },
        { key: 'INVOICE_FOOTER_TEXT', value: 'Thanks for using TalkRehearsel!', description: 'Invoice footer' },

        // Lemon Squeezy
        { key: 'LEMONSQUEEZY_API_KEY', value: '', description: 'Lemon Squeezy API key' },
        { key: 'LEMONSQUEEZY_STORE_ID', value: '', description: 'Lemon Squeezy store ID' },
        { key: 'LEMONSQUEEZY_SIGNING_SECRET', value: '', description: 'Lemon Squeezy webhook secret' },

        // Stripe
        { key: 'STRIPE_SECRET_KEY', value: '', description: 'Stripe secret key' },
        { key: 'STRIPE_PUBLISHABLE_KEY', value: '', description: 'Stripe publishable key' },
        { key: 'STRIPE_WEBHOOK_SECRET', value: '', description: 'Stripe webhook secret' },

        // Razorpay
        { key: 'RAZORPAY_KEY_ID', value: '', description: 'Razorpay key ID' },
        { key: 'RAZORPAY_KEY_SECRET', value: '', description: 'Razorpay key secret' },
        { key: 'RAZORPAY_WEBHOOK_SECRET', value: '', description: 'Razorpay webhook secret' },

        // PayPal
        { key: 'PAYPAL_CLIENT_ID', value: '', description: 'PayPal client ID' },
        { key: 'PAYPAL_CLIENT_SECRET', value: '', description: 'PayPal client secret' },
        { key: 'PAYPAL_WEBHOOK_ID', value: '', description: 'PayPal webhook ID' },

        // Email & Notifications
        { key: 'SMTP_HOST', value: 'smtp.mailgun.org', description: 'SMTP host' },
        { key: 'SMTP_PORT', value: '587', description: 'SMTP port' },
        { key: 'SMTP_USER', value: '', description: 'SMTP username' },
        { key: 'SMTP_PASS', value: '', description: 'SMTP password' },
        { key: 'EMAIL_FROM', value: 'no-reply@test.com', description: 'Default sender email' },
        { key: 'EMAIL_FROM_NAME', value: 'TalkRehearsel', description: 'Sender name' },
        { key: 'EMAIL_REPLY_TO', value: '', description: 'Reply-to email' },
        { key: 'SENDGRID_API_KEY', value: '', description: 'SendGrid API key' },
        { key: 'MAILGUN_API_KEY', value: '', description: 'Mailgun API key' },
        { key: 'NOTIFICATION_PROVIDER', value: 'smtp', description: 'Notification provider' },

        // Storage & File Handling
        { key: 'STORAGE_PROVIDER', value: 'local', description: 'Storage provider' },
        { key: 'AWS_S3_BUCKET', value: '', description: 'AWS S3 bucket' },
        { key: 'AWS_ACCESS_KEY_ID', value: '', description: 'AWS access key' },
        { key: 'AWS_SECRET_ACCESS_KEY', value: '', description: 'AWS secret key' },
        { key: 'GCS_BUCKET', value: '', description: 'Google Cloud bucket' },
        { key: 'MAX_UPLOAD_SIZE_MB', value: '10', description: 'Max upload size in MB' },

        // Analytics & Monitoring
        { key: 'POSTHOG_API_KEY', value: '', description: 'PostHog API key' },
        { key: 'GA_TRACKING_ID', value: '', description: 'Google Analytics tracking ID' },
        { key: 'PLAUSIBLE_DOMAIN', value: '', description: 'Plausible analytics domain' },
        { key: 'SENTRY_DSN', value: '', description: 'Sentry DSN' },
        { key: 'LOG_LEVEL', value: 'info', description: 'Log level' },

        // Security
        { key: 'JWT_SECRET', value: '', description: 'JWT secret key' },
        { key: 'SESSION_EXPIRY_HOURS', value: '24', description: 'Session expiry in hours' },
        { key: 'PASSWORD_RESET_EXPIRY_MINUTES', value: '30', description: 'Password reset expiry' },
        { key: 'RATE_LIMIT_REQUESTS_PER_MINUTE', value: '60', description: 'Rate limit' },
        { key: 'CORS_ALLOWED_ORIGINS', value: '*', description: 'Allowed CORS origins' },
        
        // Feature Flags
        { key: 'ENABLE_SIGNUP', value: 'true', description: 'Allow new signups' },
        { key: 'ENABLE_REFERRALS', value: 'false', description: 'Enable referrals' },
        { key: 'ENABLE_BETA_FEATURES', value: 'false', description: 'Enable beta features' },
        { key: 'MAINTENANCE_MODE', value: 'false', description: 'Enable maintenance mode' },
        { key: 'ALLOW_SOCIAL_LOGIN', value: 'true', description: 'Allow social login' },

        // Integrations
        { key: 'SLACK_WEBHOOK_URL', value: '', description: 'Slack webhook URL' },
        { key: 'DISCORD_WEBHOOK_URL', value: '', description: 'Discord webhook URL' },
        { key: 'ZAPIER_HOOK_URL', value: '', description: 'Zapier hook URL' },
        { key: 'WEBHOOK_RETRY_LIMIT', value: '3', description: 'Webhook retry limit' },
        { key: 'GOOGLE_CLIENT_ID', value: '*', description: 'Google auth client id for signup/signin' },
        { key: 'GOOGLE_SECRET_KEY', value: '*', description: 'Google auth secret key for signup/sigin' },


        // Localization
        { key: 'SUPPORTED_LANGUAGES', value: 'en,hi,es', description: 'Supported languages' },
        { key: 'DEFAULT_DATE_FORMAT', value: 'YYYY-MM-DD', description: 'Default date format' },
        { key: 'DEFAULT_NUMBER_FORMAT', value: '1,234.56', description: 'Default number format' },
      ]
    })

    console.log('Added Settings successfully')
  } catch (err) {
    console.error('Failure while adding Settings:', err)
  }
}
