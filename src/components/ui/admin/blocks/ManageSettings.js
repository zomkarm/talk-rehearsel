'use client'
import { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import { toast } from 'sonner'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ManageSettings() {
  const [settings, setSettings] = useState([])
  const [formValues, setFormValues] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/setting')
      const data = await res.json()
      setSettings(data.settings || [])

      // initialize form values
      const initial = {}
      data.settings.forEach((s) => {
        initial[s.key] = s.value
      })
      setFormValues(initial)
    } catch (err) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSaveCategory = async (fields) => {
    try {
      for (const field of fields) {
        const key = field.key
        const value = formValues[key] ?? ''
        const setting = settings.find((s) => s.key === key)
        const method = setting ? 'PUT' : 'POST'
        const url = '/api/admin/setting' + (setting ? `?id=${setting.id}` : '')

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
        if (!res.ok) throw new Error(`Failed to save ${key}`)
      }
      toast.success('Settings saved')
      fetchSettings()
    } catch (err) {
      toast.error(err.message)
    }
  }
  // Categories
  const categories = {
    'Branding & Identity': [
      { key: 'APP_NAME', label: 'App Name', type: 'text' },
      { key: 'APP_URL', label: 'App URL', type: 'url' },
      { key: 'APP_ENV', label: 'Environment', type: 'text' },
      { key: 'TEST_MODE', label: 'Test Mode', type: 'select', options: ['true','false'] },
      { key: 'PLATFORM_LOGO_URL', label: 'Logo URL', type: 'url' },
      { key: 'PLATFORM_FAVICON_URL', label: 'Favicon URL', type: 'url' },
      { key: 'PRIMARY_COLOR', label: 'Primary Color', type: 'color' },
      { key: 'SECONDARY_COLOR', label: 'Secondary Color', type: 'color' },
      { key: 'SUPPORT_EMAIL', label: 'Support Email', type: 'email' },
      { key: 'SUPPORT_PHONE', label: 'Support Phone', type: 'text' },
      { key: 'DEFAULT_LANGUAGE', label: 'Default Language', type: 'text' },
      { key: 'DEFAULT_TIMEZONE', label: 'Default Timezone', type: 'text' },
    ],

    Payments: [
      { key: 'PAYMENT_PROVIDER', label: 'Active Provider', type: 'select', options: ['lemonsqueezy','stripe','razorpay','paypal','None'] },
      { key: 'PAYMENT_PROVIDERS_ENABLED', label: 'Enabled Providers', type: 'text' },
      { key: 'LEMONSQUEEZY_MODE', label: 'Lemon Squeezy Mode', type: 'select', options: ['test','live'] },
      { key: 'STRIPE_MODE', label: 'Stripe Mode', type: 'select', options: ['test','live'] },
      { key: 'RAZORPAY_MODE', label: 'Razorpay Mode', type: 'select', options: ['test','live'] },
      { key: 'PAYPAL_MODE', label: 'PayPal Mode', type: 'select', options: ['test','live'] },

      { key: 'DEFAULT_CURRENCY', label: 'Default Currency', type: 'text' },
      { key: 'SUPPORTED_CURRENCIES', label: 'Supported Currencies', type: 'text' },
      { key: 'BILLING_ADDRESS_REQUIRED', label: 'Require Billing Address', type: 'checkbox' },
      { key: 'INVOICE_FOOTER_TEXT', label: 'Invoice Footer Text', type: 'text' },

      { key: 'LEMONSQUEEZY_API_KEY', label: 'Lemon Squeezy API Key', type: 'password' },
      { key: 'LEMONSQUEEZY_STORE_ID', label: 'Lemon Squeezy Store ID', type: 'text' },
      { key: 'LEMONSQUEEZY_SIGNING_SECRET', label: 'Lemon Squeezy Webhook Secret', type: 'password' },

      { key: 'STRIPE_SECRET_KEY', label: 'Stripe Secret Key', type: 'password' },
      { key: 'STRIPE_PUBLISHABLE_KEY', label: 'Stripe Publishable Key', type: 'text' },
      { key: 'STRIPE_WEBHOOK_SECRET', label: 'Stripe Webhook Secret', type: 'password' },

      { key: 'RAZORPAY_KEY_ID', label: 'Razorpay Key ID', type: 'text' },
      { key: 'RAZORPAY_KEY_SECRET', label: 'Razorpay Key Secret', type: 'password' },
      { key: 'RAZORPAY_WEBHOOK_SECRET', label: 'Razorpay Webhook Secret', type: 'password' },

      { key: 'PAYPAL_CLIENT_ID', label: 'PayPal Client ID', type: 'text' },
      { key: 'PAYPAL_CLIENT_SECRET', label: 'PayPal Client Secret', type: 'password' },
      { key: 'PAYPAL_WEBHOOK_ID', label: 'PayPal Webhook ID', type: 'text' },
    ],

    'Email & Notifications': [
      { key: 'SMTP_HOST', label: 'SMTP Host', type: 'text' },
      { key: 'SMTP_PORT', label: 'SMTP Port', type: 'number' },
      { key: 'SMTP_USER', label: 'SMTP User', type: 'text' },
      { key: 'SMTP_PASS', label: 'SMTP Password', type: 'password' },
      { key: 'EMAIL_FROM', label: 'From Email', type: 'email' },
      { key: 'EMAIL_FROM_NAME', label: 'From Name', type: 'text' },
      { key: 'EMAIL_REPLY_TO', label: 'Reply-To Email', type: 'email' },
      { key: 'SENDGRID_API_KEY', label: 'SendGrid API Key', type: 'password' },
      { key: 'MAILGUN_API_KEY', label: 'Mailgun API Key', type: 'password' },
      { key: 'NOTIFICATION_PROVIDER', label: 'Notification Provider', type: 'select', options: ['smtp','sendgrid','mailgun'] },
    ],

    'Storage & File Handling': [
      { key: 'STORAGE_PROVIDER', label: 'Storage Provider', type: 'select', options: ['local','s3','gcs'] },
      { key: 'AWS_S3_BUCKET', label: 'AWS S3 Bucket', type: 'text' },
      { key: 'AWS_ACCESS_KEY_ID', label: 'AWS Access Key ID', type: 'text' },
      { key: 'AWS_SECRET_ACCESS_KEY', label: 'AWS Secret Access Key', type: 'password' },
      { key: 'GCS_BUCKET', label: 'Google Cloud Bucket', type: 'text' },
      { key: 'MAX_UPLOAD_SIZE_MB', label: 'Max Upload Size (MB)', type: 'number' },
    ],

    'Analytics & Monitoring': [
      { key: 'POSTHOG_API_KEY', label: 'Posthog API Key', type: 'password' },
      { key: 'GA_TRACKING_ID', label: 'Google Analytics Tracking ID', type: 'text' },
      { key: 'PLAUSIBLE_DOMAIN', label: 'Plausible Domain', type: 'text' },
      { key: 'SENTRY_DSN', label: 'Sentry DSN', type: 'text' },
      { key: 'LOG_LEVEL', label: 'Log Level', type: 'select', options: ['debug','info','warn','error'] },
    ],

    Security: [
      { key: 'JWT_SECRET', label: 'JWT Secret', type: 'password' },
      { key: 'SESSION_EXPIRY_HOURS', label: 'Session Expiry (hours)', type: 'number' },
      { key: 'PASSWORD_RESET_EXPIRY_MINUTES', label: 'Password Reset Expiry (minutes)', type: 'number' },
      { key: 'RATE_LIMIT_REQUESTS_PER_MINUTE', label: 'Rate Limit (per minute)', type: 'number' },
      { key: 'CORS_ALLOWED_ORIGINS', label: 'CORS Allowed Origins', type: 'text' },
    ],

    'Feature Flags': [
      { key: 'ENABLE_SIGNUP', label: 'Enable Signup', type: 'checkbox' },
      { key: 'ENABLE_REFERRALS', label: 'Enable Referrals', type: 'checkbox' },
      { key: 'ENABLE_BETA_FEATURES', label: 'Enable Beta Features', type: 'checkbox' },
      { key: 'MAINTENANCE_MODE', label: 'Maintenance Mode', type: 'checkbox' },
      { key: 'ALLOW_SOCIAL_LOGIN', label: 'Allow Social Login', type: 'checkbox' },
    ],

    Integrations: [
      { key: 'SLACK_WEBHOOK_URL', label: 'Slack Webhook URL', type: 'url' },
      { key: 'DISCORD_WEBHOOK_URL', label: 'Discord Webhook URL', type: 'url' },
      { key: 'ZAPIER_HOOK_URL', label: 'Zapier Hook URL', type: 'url' },
      { key: 'WEBHOOK_RETRY_LIMIT', label: 'Webhook Retry Limit', type: 'number' },
      { key: 'GOOGLE_CLIENT_ID', label: 'Google Client Id', type: 'text' },
      { key: 'GOOGLE_SECRET_KEY', label: 'Google Secret Key', type: 'text' },

    ],

    Localization: [
      { key: 'SUPPORTED_LANGUAGES', label: 'Supported Languages', type: 'text' },
      { key: 'DEFAULT_DATE_FORMAT', label: 'Default Date Format', type: 'text' },
      { key: 'DEFAULT_NUMBER_FORMAT', label: 'Default Number Format', type: 'text' },
      { key: 'PROJECT_LIMIT', label: 'Set Project limit', type: 'number' },
      { key: 'PAGE_LIMIT', label: 'Set Page limit', type: 'number' },
    ],
  }


   return (
    <main className="flex-1 bg-white p-6 mt-2 rounded-tl-3xl overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Platform Settings</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b mb-6">
          {Object.keys(categories).map((cat) => (
            <Tab
              key={cat}
              className={({ selected }) =>
                classNames(
                  'px-4 py-2 text-sm font-medium rounded-t-md',
                  selected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )
              }
            >
              {cat}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {Object.entries(categories).map(([cat, fields]) => (
            <Tab.Panel key={cat} className="space-y-6">
              {fields.map((field) => (
                <div key={field.key} className="flex items-center gap-4">
                  <label className="w-48 text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={formValues[field.key] === 'true'}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          [field.key]: e.target.checked.toString(),
                        })
                      }
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formValues[field.key] || ''}
                      onChange={(e) =>
                        setFormValues({ ...formValues, [field.key]: e.target.value })
                      }
                      className="px-3 py-2 border rounded-lg"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formValues[field.key] || ''}
                      onChange={(e) =>
                        setFormValues({ ...formValues, [field.key]: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  )}
                </div>
              ))}

              <div className="pt-4">
                <button
                  onClick={() => handleSaveCategory(fields)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Save {cat}
                </button>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </main>
  )
}