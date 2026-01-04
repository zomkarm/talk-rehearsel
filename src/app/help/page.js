'use client'
import { useState } from 'react'
import { Menu, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'

const helpSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    articles: [
      {
        slug: 'intro',
        title: 'What is TalkRehearsel?',
        content: `
TalkRehearsel is a clarity-first learning and builder platform. 
It helps you learn frontend structure while building real projects. 
In this guide, you'll understand the basics and how to get started quickly.
        `,
      },
      {
        slug: 'first-project',
        title: 'Creating Your First Project',
        content: `
To create your first project:
1. Go to the Dashboard
2. Click "New Project"
3. Choose a template or start from scratch
4. Save and start editing in the Designer
        `,
      },
      {
        slug: 'navigating-dashboard',
        title: 'Navigating the Dashboard',
        content: `
  The dashboard is your central hub. From here you can:
  - View all your projects
  - Access the Learners Space
  - Manage your account and subscription
  - Restore drafts or start new work
        `,
      },
      {
        slug: 'using-templates',
        title: 'Using Templates',
        content: `
  TalkRehearsel provides starter templates to help you move faster.
  - Choose a template when creating a new project
  - Customize it in the Designer
  - Export or extend it as needed
  Templates save time and help you learn by example.
        `,
      },
      {
        slug: 'saving-progress',
        title: 'Saving Your Progress',
        content: `
  Your work is auto-saved as you go. 
  - Drafts are stored locally if you are not logged in
  - Logged-in users have their projects synced to the cloud
  - You can restore unsaved drafts from the header if needed
        `,
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & Profile',
    articles: [
      {
        slug: 'update-profile',
        title: 'Updating Your Profile',
        content: `
You can update your name, email, and profile picture from the Settings page. 
Changes are saved instantly and reflected in your dashboard header.
        `,
      },
      {
        slug: 'profile-picture',
        title: 'Uploading a Profile Picture',
        content: `
Profile pictures are optional. If you don't upload one, a default avatar is shown. 
When you upload a new picture, the old one is automatically removed.
        `,
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & Plans',
    articles: [
      {
        slug: 'free-vs-pro',
        title: 'Free vs Pro Features',
        content: `
The Free plan includes basic project creation and learning resources. 
The Pro plan unlocks unlimited projects, export options, and premium templates.
        `,
      },
    ],
  },
  {
    id: 'faq',
    title: 'FAQ & Troubleshooting',
    articles: [
      {
        slug: 'draft-recovery',
        title: 'Recovering Unsaved Drafts',
        content: `
If you close the browser without saving, TalkRehearsel stores a temporary draft. 
When you log back in, you'll see a "Restore Draft" option in the header.
        `,
      },
    ],
  },
]

export default function HelpPage() {
  const [openSection, setOpenSection] = useState('getting-started')
  const [search, setSearch] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredArticles = helpSections.flatMap(section =>
    section.articles
      .filter(article =>
        article.title.toLowerCase().includes(search.toLowerCase())
      )
      .map(article => ({
        ...article,
        sectionTitle: section.title,
      }))
  )

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block w-64 sm:w-72 bg-white border-r shadow-lg p-6">
        <Sidebar
          helpSections={helpSections}
          openSection={openSection}
          setOpenSection={setOpenSection}
          setSelectedArticle={setSelectedArticle}
        />
      </aside>

      {/* Sidebar (mobile drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="relative w-64 bg-white border-r shadow-lg p-6">
            <Sidebar
              helpSections={helpSections}
              openSection={openSection}
              setOpenSection={setOpenSection}
              setSelectedArticle={(a) => {
                setSelectedArticle(a)
                setSidebarOpen(false)
              }}
            />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Mobile topbar */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h2 className="text-lg font-bold text-indigo-700">Help Center</h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md border text-gray-600 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search help articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>

          {/* Results or Article */}
          {search ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {filteredArticles.length === 0 ? (
                <li className="text-sm text-gray-500">No articles found.</li>
              ) : (
                filteredArticles.map(article => (
                  <li key={article.slug}>
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="w-full text-left p-5 rounded-xl border bg-white shadow-sm hover:shadow-md hover:border-indigo-200 transition"
                    >
                      <p className="font-semibold text-indigo-700">{article.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{article.sectionTitle}</p>
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : selectedArticle ? (
            <article className="bg-white rounded-xl shadow-md border overflow-hidden">
              {/* Article header */}
              <div className="bg-gradient-to-r from-indigo-600 to-teal-600 px-6 py-8 text-white">
                <h1 className="text-2xl md:text-3xl font-bold">{selectedArticle.title}</h1>
              </div>

              {/* Article body */}
              <div className="p-6 md:p-10 prose prose-indigo max-w-none text-gray-700">
                {selectedArticle.content.split('\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-10 text-center border">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to the Help Center
              </h2>
              <p className="text-gray-500 text-sm">
                Select a topic from the sidebar or search for help articles.
              </p>
            </div>
          )}
        </div>
      </main>

    </div>
  )
}

function Sidebar({ helpSections, openSection, setOpenSection, setSelectedArticle }) {
  return (
    <nav className="h-full flex flex-col">
      <h2 className="text-lg font-bold text-indigo-700 mb-6 flex items-center gap-2">
        <BookOpen size={18} className="text-indigo-600" />
        Help Topics
      </h2>

      <ul className="space-y-3 text-gray-800 flex-1 overflow-y-auto pr-1
        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
        {helpSections.map(section => {
          const isOpen = openSection === section.id
          return (
            <li key={section.id} className="border rounded-lg overflow-hidden shadow-sm">
              {/* Category Header */}
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className={`w-full flex justify-between items-center px-4 py-2 text-sm font-semibold transition
                  ${isOpen ? 'bg-indigo-50 text-indigo-700' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
              >
                <span>{section.title}</span>
                {isOpen ? (
                  <ChevronUp size={16} className="text-indigo-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </button>

              {/* Articles */}
              {isOpen && (
                <ul className="bg-white border-t divide-y">
                  {section.articles.map(article => (
                    <li key={article.slug}>
                      <button
                        onClick={() => setSelectedArticle(article)}
                        className="w-full text-left px-5 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition"
                      >
                        {article.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}