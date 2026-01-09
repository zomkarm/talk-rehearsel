'use client'

import { useEffect, useState } from 'react'

const LIMIT = 10

export default function ManageUnscriptedPractice() {
  const [questions, setQuestions] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    question: '',
    level: 'casual',
  })

  async function fetchQuestions(p = page) {
    setLoading(true)
    const res = await fetch(
      `/api/admin/unscripted-practice?page=${p}&limit=${LIMIT}`
    )
    const data = await res.json()

    setQuestions(data.questions)
    setTotalPages(data.totalPages)
    setPage(data.page)
    setLoading(false)
  }

  useEffect(() => {
    fetchQuestions(1)
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.question.trim()) return

    await fetch('/api/admin/unscripted-practice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setForm({ question: '', level: 'casual' })
    fetchQuestions(1)
  }

  async function toggleActive(q) {
    await fetch(`/api/admin/unscripted-practice?id=${q.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...q, isActive: !q.isActive }),
    })
    fetchQuestions(page)
  }

  async function deleteQuestion(id) {
    if (!confirm('Delete this question?')) return
    await fetch(`/api/admin/unscripted-practice?id=${id}`, {
      method: 'DELETE',
    })
    fetchQuestions(page)
  }

  return (
    <main className="flex-1 p-6 bg-white border-2 rounded-tl-xl">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Manage Unscripted Practice</h1>
          <p className="text-gray-600">
            Create and manage confidence-building speaking prompts.
          </p>
        </div>

        {/* Create */}
        <form
          onSubmit={handleCreate}
          className="bg-gray-50 border rounded-xl p-6 space-y-4"
        >
          <textarea
            value={form.question}
            onChange={(e) =>
              setForm({ ...form, question: e.target.value })
            }
            placeholder="Enter a speaking prompt..."
            className="w-full min-h-[80px] border rounded-lg p-3"
          />

          <div className="flex gap-4">
            <select
              value={form.level}
              onChange={(e) =>
                setForm({ ...form, level: e.target.value })
              }
              className="border rounded-lg px-3 py-2"
            >
              <option value="casual">Casual</option>
              <option value="social">Social</option>
              <option value="professional">Professional</option>
            </select>

            <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg">
              Add Question
            </button>
          </div>
        </form>

        {/* List */}
        <section className="space-y-4">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            questions.map((q) => (
              <div
                key={q.id}
                className="border rounded-lg p-4 flex justify-between"
              >
                <div>
                  <p className="text-xs uppercase text-gray-500">
                    {q.level}
                  </p>
                  <p>{q.question}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleActive(q)}
                    className={`text-sm px-3 py-1 rounded ${
                      q.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {q.isActive ? 'Active' : 'Inactive'}
                  </button>

                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Pagination */}
        <div className="flex justify-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => fetchQuestions(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => fetchQuestions(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>

      </div>
    </main>
  )
}
