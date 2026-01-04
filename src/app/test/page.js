'use client'

import { useState } from 'react'
import { exportSketchToHTML } from '@/lib/sketchExport.js'

// Canonical test cases
const TEST_CASES = [
  {
    name: 'Left + Right children',
    blocks: [
      { id: 1, x: 0, y: 0, width: 1228, height: 158 },
      { id: 2, x: 39, y: 6, width: 83, height: 144 },
      { id: 3, x: 1102, y: 18, width: 104, height: 128 }
    ]
  },
  {
    name: 'Row of 4 evenly spaced',
    blocks: [
      { id: 1, x: 0, y: 0, width: 800, height: 200 },
      { id: 2, x: 40, y: 60, width: 100, height: 80 },
      { id: 3, x: 240, y: 60, width: 100, height: 80 },
      { id: 4, x: 440, y: 60, width: 100, height: 80 },
      { id: 5, x: 640, y: 60, width: 100, height: 80 }
    ]
  },
  {
    name: 'Two rows 3 + 2',
    blocks: [
      { id: 1, x: 0, y: 0, width: 900, height: 500 },
      { id: 2, x: 40, y: 60, width: 120, height: 80 },
      { id: 3, x: 220, y: 70, width: 120, height: 80 },
      { id: 4, x: 430, y: 65, width: 120, height: 80 },
      { id: 5, x: 100, y: 300, width: 140, height: 90 },
      { id: 6, x: 380, y: 310, width: 140, height: 90 }
    ]
  },
  {
    name: 'Wide gap → subgroups',
    blocks: [
      { id: 1, x: 0, y: 0, width: 1000, height: 200 },
      { id: 2, x: 40, y: 80, width: 120, height: 60 },
      { id: 3, x: 220, y: 80, width: 120, height: 60 },
      { id: 4, x: 760, y: 80, width: 120, height: 60 }
    ]
  },
  {
    name: 'Single child',
    blocks: [
      { id: 1, x: 0, y: 0, width: 600, height: 300 },
      { id: 2, x: 200, y: 120, width: 180, height: 60 }
    ]
  }
]

export default function LayoutTestPage() {
  const [selected, setSelected] = useState(TEST_CASES[0])
  const [output, setOutput] = useState('')

  const runTest = (tc) => {
    try {
      const htmlDoc = exportSketchToHTML(tc.blocks)
      setSelected(tc)
      console.log(htmlDoc)
      setOutput(htmlDoc)
    } catch (err) {
      setOutput(`Error: ${err.message}`)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Layout Engine Test Cases</h1>

      <div className="flex gap-2 flex-wrap">
        {TEST_CASES.map(tc => (
          <button
            key={tc.name}
            className={`px-3 py-2 rounded border ${
              selected.name === tc.name ? 'bg-black text-white' : 'bg-gray-100'
            }`}
            onClick={() => runTest(tc)}
          >
            {tc.name}
          </button>
        ))}
      </div>

      <h2 className="text-lg font-semibold">Rendered Preview</h2>
      <div className="p-4 bg-gray-50 rounded border">
        <div dangerouslySetInnerHTML={{ __html: output }} />
      </div>

      <h2 className="text-lg font-semibold">Raw HTML Output</h2>
      <pre className="p-3 bg-gray-900 text-gray-100 rounded overflow-auto text-sm">
        {output || '// Select a test case to run'}
      </pre>
    </div>
  )
}
