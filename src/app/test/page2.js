'use client'
import React ,{ useState,useEffect, useRef } from 'react'
import {
  Save,
  Code,
  Pencil,
  CodeXml,
  FileCode2,
  Monitor,
  FolderInput,
  BadgeQuestionMark,
  PanelLeftDashed,
  TableProperties
} from 'lucide-react'
import { useDesignerStore } from '@/store/designerStore'
import { useSearchParams } from 'next/navigation'

const htmlCategories = [
  { title: 'Structural', tags: ['div', 'section', 'article', 'header', 'footer', 'main', 'aside'] },
  { title: 'Text', tags: ['p', 'h1', 'h2', 'h3', 'span', 'strong', 'em', 'blockquote', 'pre', 'br', 'hr'] },
  { title: 'Lists', tags: ['ul', 'ol', 'li', 'dl', 'dt', 'dd'] },
  { title: 'Media', tags: ['img', 'video', 'audio', 'figure', 'figcaption'] },
  { title: 'Inline', tags: ['a', 'abbr', 'code', 'kbd', 'mark', 'sub', 'sup', 'time'] },
  { title: 'Forms', tags: ['form', 'input', 'textarea', 'select', 'option', 'button', 'label'] },
  { title: 'Tables', tags: ['table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th'] },
  { title: 'Interactive', tags: ['details', 'summary', 'dialog', 'nav'] }
]

const tailwindCategories = [
  {
    title: 'Layout',
    classes: [
      'block', 'inline-block', 'inline', 'flex', 'inline-flex',
      'grid', 'inline-grid', 'contents', 'hidden',
      'justify-start', 'justify-center', 'justify-between',
      'items-start', 'items-center', 'items-end',
      'gap-2', 'gap-4', 'space-x-2', 'space-y-2',
      'w-full', 'h-full', 'max-w-screen-md', 'min-h-screen'
    ],
  },
  {
    title: 'Spacing',
    classes: [
      'p-2', 'p-4', 'px-6', 'py-3',
      'm-2', 'm-4', 'mt-6', 'mb-6',
      'gap-2', 'space-x-2', 'space-y-2'
    ],
  },
  {
    title: 'Typography',
    classes: [
      'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
      'font-light', 'font-normal', 'font-semibold', 'font-bold',
      'text-left', 'text-center', 'text-right',
      'uppercase', 'lowercase', 'capitalize',
      'leading-tight', 'tracking-wide'
    ],
  },
  {
    title: 'Background',
    classes: [
      'bg-white', 'bg-gray-100', 'bg-blue-500', 'bg-red-500',
      'bg-gradient-to-r', 'from-purple-400', 'to-pink-600',
      'bg-cover', 'bg-center', 'bg-no-repeat'
    ],
  },
  {
    title: 'Border & Radius',
    classes: [
      'border', 'border-2', 'border-gray-300',
      'rounded', 'rounded-md', 'rounded-lg', 'rounded-full',
      'ring-2', 'ring-offset-2'
    ],
  },
  {
    title: 'Effects',
    classes: [
      'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg',
      'opacity-50', 'opacity-75', 'opacity-100',
      'transition', 'duration-300', 'ease-in-out',
      'hover:bg-blue-600', 'hover:shadow-lg'
    ],
  },
  {
    title: 'Positioning',
    classes: [
      'relative', 'absolute', 'fixed', 'sticky',
      'top-0', 'bottom-0', 'left-0', 'right-0',
      'z-0', 'z-10', 'z-50'
    ],
  },
  {
    title: 'Visibility',
    classes: [
      'visible', 'invisible', 'hidden',
      'opacity-0', 'opacity-50', 'opacity-100'
    ],
  },
  {
    title: 'Responsive',
    classes: [
      'sm:p-2', 'md:flex', 'lg:text-xl', 'xl:grid-cols-4',
      '2xl:gap-6'
    ],
  },
  {
    title: 'Miscellaneous',
    classes: [
      'cursor-pointer', 'pointer-events-none',
      'truncate', 'overflow-hidden', 'overflow-scroll',
      'select-none', 'select-text'
    ],
  },
]

export const cssProperties = {
  display: [
    "block", "inline", "inline-block", "flex", "inline-flex",
    "grid", "inline-grid", "contents", "list-item", "none"
  ],
  position: [
    "static", "relative", "absolute", "fixed", "sticky"
  ],
  float: [
    "none", "left", "right", "inline-start", "inline-end"
  ],
  clear: [
    "none", "left", "right", "both", "inline-start", "inline-end"
  ],
  overflow: [
    "visible", "hidden", "scroll", "auto", "clip"
  ],
  "text-align": [
    "left", "right", "center", "justify", "start", "end"
  ],
  "font-weight": [
    "normal", "bold", "lighter", "bolder",
    "100", "200", "300", "400", "500", "600", "700", "800", "900"
  ],
  "text-transform": [
    "none", "capitalize", "uppercase", "lowercase"
  ],
  "text-decoration": [
    "none", "underline", "overline", "line-through"
  ],
  "vertical-align": [
    "baseline", "top", "middle", "bottom", "text-top", "text-bottom"
  ],
  "white-space": [
    "normal", "nowrap", "pre", "pre-wrap", "pre-line", "break-spaces"
  ],
  "background-repeat": [
    "repeat", "repeat-x", "repeat-y", "no-repeat", "space", "round"
  ],
  "background-size": [
    "auto", "cover", "contain"
  ],
  "background-attachment": [
    "scroll", "fixed", "local"
  ],
  "border-style": [
    "none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"
  ],
  "box-sizing": [
    "content-box", "border-box"
  ],
  "justify-content": [
    "flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"
  ],
  "align-items": [
    "stretch", "flex-start", "flex-end", "center", "baseline"
  ],
  "align-content": [
    "stretch", "flex-start", "flex-end", "center", "space-between", "space-around"
  ],
  "flex-direction": [
    "row", "row-reverse", "column", "column-reverse"
  ],
  "flex-wrap": [
    "nowrap", "wrap", "wrap-reverse"
  ],
  "grid-auto-flow": [
    "row", "column", "row dense", "column dense"
  ],
  "object-fit": [
    "fill", "contain", "cover", "none", "scale-down"
  ],
  cursor: [
    "auto", "default", "pointer", "wait", "text", "move", "not-allowed", "crosshair", "help", "progress"
  ],
  visibility: [
    "visible", "hidden", "collapse"
  ],
  "list-style-type": [
    "disc", "circle", "square", "decimal", "decimal-leading-zero",
    "lower-roman", "upper-roman", "lower-alpha", "upper-alpha", "none"
  ]
}



export default function Designer() {
  const [openEditorModal, setEditorModal] = useState(true)
  const [editor, setEditor] = useState('html')
  const [codePanel, setCodePanel] = useState(false)
  const selectBlock = useDesignerStore((s) => s.selectBlock)
  const [device, setDevice] = useState('desktop')
  const selectedBlockId = useDesignerStore((s) => s.selectedBlockId)
  const [showProperties, setShowProperties] = useState(false)
  const searchParams = useSearchParams()
  const pageId = searchParams.get('pageId') 
  console.log(`Page ID  -- ${pageId}`)

  const toggleSidebar = () => setEditorModal(prev => !prev)

  const openEditor = (mode) => {
    if (!openEditorModal) toggleSidebar()
    //selectBlock(null)
    setEditor(mode)
  }

  return (
    <div
      className="min-h-screen flex flex-col border"
      style={{
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '3px 3px',
      }}
    >
      {/* Header */}
      <header className="flex h-auto min-h-[3rem] mt-1 mb-1 justify-center px-2">
        <div
          className="flex flex-wrap gap-2 justify-center p-1 shadow-xl rounded-xl 
                     bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                     text-white text-[10px] sm:text-xs overflow-x-auto"
        >
          <a className="flex items-center gap-1 p-1 border border-transparent rounded 
                        bg-white/10 hover:bg-white/20 cursor-pointer">
            <Save size={14} className="shrink-0" />
            <span>Save</span>
          </a>
          <a
            onClick={toggleSidebar}
            className="flex items-center gap-1 p-1 border border-transparent rounded 
                       bg-white/10 hover:bg-white/20 cursor-pointer"
          >
            <PanelLeftDashed size={14} className="shrink-0" />
            <span>Editor</span>
          </a>
          <a
             onClick={() => openEditor('html')}
            className={`flex items-center gap-1 p-1 border border-transparent rounded 
                       bg-white/10 hover:bg-white/20 cursor-pointer
                       ${editor==="html" ? 'bg-black/20 text-white font-semibold' : ''}
                       `}
          >
            <Code size={14} className="shrink-0" />
            <span>Html</span>
          </a>
          <a
            onClick={() => setEditor('css')}
            className="flex items-center gap-1 p-1 border border-transparent rounded 
                       bg-white/10 hover:bg-white/20 cursor-pointer"
          >
            <Code size={14} className="shrink-0" />
            <span>CSS</span>
          </a>
          <a
            onClick={() => openEditor('tailwind')}
            className={`flex items-center gap-1 p-1 border border-transparent rounded 
                       bg-white/10 hover:bg-white/20 cursor-pointer
                      ${editor==="tailwind" ? 'bg-black/20 text-white font-semibold' : ''}
                      `}
          >
            <FileCode2 size={14} className="shrink-0" />
            <span>Tailwind</span>
          </a>
          { selectedBlockId &&
          <a
            onClick={() => setShowProperties(prev => !prev)}
            className={`flex items-center gap-1 p-1 border border-transparent rounded 
                       bg-white/10 hover:bg-white/20 cursor-pointer
                      ${showProperties && 'bg-black/20 text-white font-semibold'}
                      `}
          >
            <TableProperties size={14} className="shrink-0" />
            <span>Properties</span>
          </a>}
          <a className="flex items-center gap-1 p-1 border border-transparent rounded 
                        bg-white/10 hover:bg-white/20 cursor-pointer">
            <Pencil size={14} className="shrink-0" />
            <span>Sketch</span>
          </a>
          <div className="relative">
            <div
              className="flex h-full items-center gap-1 p-1 border border-transparent rounded 
                         bg-white/10 hover:bg-white/20 cursor-pointer text-white"
            >
              <Monitor size={14} className="shrink-0" />
              <select
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="bg-transparent text-white text-md "
              >
                <option className="bg-gray-800 text-white hover:bg-indigo-600" value="desktop">Desktop</option>
                <option className="bg-gray-800 text-white hover:bg-indigo-600" value="tablet">Tablet</option>
                <option className="bg-gray-800 text-white hover:bg-indigo-600" value="mobile">Mobile</option>
              </select>
            </div>
          </div>

          <a
            onClick={() => setCodePanel(prev => !prev)}
            className="flex items-center gap-1 p-1 border border-transparent rounded 
                       bg-white/10 hover:bg-white/20 cursor-pointer"
          >
            <CodeXml size={14} className="shrink-0" />
            <span>View Code</span>
          </a>
          <a className="flex items-center gap-1 p-1 border border-transparent rounded 
                        bg-white/10 hover:bg-white/20 cursor-pointer">
            <FolderInput size={14} className="shrink-0" />
            <span>Export</span>
          </a>
          <a className="flex items-center gap-1 p-1 border border-transparent rounded 
                        bg-white/10 hover:bg-white/20 cursor-pointer">
            <BadgeQuestionMark size={14} className="shrink-0" />
            <span>Help</span>
          </a>
        </div>
      </header>

      {/* Main content row */}
      <div className="flex h-[calc(100vh-3rem)] overflow-auto">
        {openEditorModal && (
          <Sidebar editor={editor} openEditorModal={openEditorModal} />
        )}
        <div className="flex flex-1 min-h-0">
          <Canvas device={device}/>
          {codePanel && <CodePanel open={codePanel} />}
          {showProperties && selectedBlockId && <Properties />}

        </div>
      </div>
    </div>
  )
}


function Sidebar({ editor, openEditorModal }) {
  const selectedBlockId = useDesignerStore((s) => s.selectedBlockId)
  return (
    <aside
      className={`
        bg-purple-50
        border-l border-gray-200 shadow-lg
        text-gray-900 rounded-lg
        p-1 flex flex-col
        h-full
        w-1/5 md:relative
        ${openEditorModal ? 'translate-x-0' : '-translate-x-full'}
        fixed left-0  z-50
        w-4/5 md:w-[30%] lg:static lg:w-1/5 lg:z-auto
        shadow-lg
        transition-[width] duration-300 ease-in-out
      `}

    >

        <div className="h-full rounded-xl overflow-auto">
          {editor === 'html' && <HtmlEditor />}
          {editor === 'css' && <CssEditor />}
          {editor === 'tailwind' && <TailwindEditor />}
        </div>
    </aside>
  )
}



function CodePanel({ open }) {
  return (
    <aside
      className={`
        bg-gray-900 text-white p-4 border-l overflow-auto
        transition-transform duration-300 ease-out
        h-full
        fixed md:static right-0 z-50 md:z-auto
        w-4/5 md:w-1/4
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <h3 className="text-sm font-semibold mb-2">Code Preview</h3>
      <pre className="text-xs whitespace-pre-wrap">
        {'<div class="bg-white p-4">Hello World</div>'}
      </pre>
    </aside>
  )
}


function HtmlEditor() {
  const [activeCategory, setActiveCategory] = useState('Structural')
  const [searchTerm, setSearchTerm] = useState('')
  const insert = useDesignerStore((s) => s.insertToTree)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const filteredCategories = htmlCategories
    .map((cat) => ({
      ...cat,
      tags: cat.tags.filter((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((cat) => cat.tags.length > 0)

  const categoriesToRender = searchTerm ? filteredCategories : htmlCategories
  const activeCat = categoriesToRender.find((c) => c.title === activeCategory)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search */}
      <div className="p-2">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search HTML tags [press / to focus]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-full text-xs 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
        />
      </div>

      {/* Two-pane layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: categories */}
        <div className="w-1/4 ">
          {categoriesToRender.map((cat) => (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(cat.title)}
              className={`w-full text-left px-3 py-2 text-[0.625rem] font-bold 
                          hover:bg-indigo-300 transition border-b border-gray-900 rounded-lg truncate
                          ${
                            activeCategory === cat.title && !searchTerm
                              ? 'bg-indigo-300 text-indigo-700'
                              : 'text-slate-700'
                          }`}
                          title={cat.title}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Right: tags */}
        <div className="flex-1 p-3 overflow-auto">
          {searchTerm ? (
            // Show all matching tags across categories
            <div className="flex flex-wrap gap-2">
              {filteredCategories.flatMap((cat) =>
                cat.tags.map((tag) => (
                  <button
                    key={cat.title + tag}
                    onClick={() => insert(tag)}
                    className="px-2 py-1 text-xs rounded 
                               hover:bg-indigo-300 transition border-2 border-slate-700"
                  >
                    &lt;{tag}&gt;
                  </button>
                ))
              )}
            </div>
          ) : activeCat ? (
            // Normal browsing: show tags of active category
            <div className="flex flex-wrap gap-2">
              {activeCat.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => insert(tag)}
                  className="px-2 py-1 text-xs rounded 
                             hover:bg-indigo-300 transition border-2 border-slate-700"
                >
                  &lt;{tag}&gt;
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500">No tags found</div>
          )}
        </div>
      </div>
    </div>
  )
}

function toCamelCase(prop) {
  return prop.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

function CssEditor() {
  const selectedBlockId = useDesignerStore(s => s.selectedBlockId)
  const tree = useDesignerStore(s => s.tree)
  const updateBlockProps = useDesignerStore(s => s.updateBlockProps) // you’ll need to add this in your store

  const [searchTerm, setSearchTerm] = useState('')
  const [activeProp, setActiveProp] = useState(null)
  const [customValue, setCustomValue] = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const filteredProps = Object.keys(cssProperties).filter(p =>
    p.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const applyCss = (prop, value) => {
    if (!selectedBlockId) return
    const camelProp = toCamelCase(prop)
    updateBlockProps(selectedBlockId, {
      style: {
        ...(tree.find(b => b.id === selectedBlockId)?.props?.style || {}),
        [camelProp]: value
      }
    })
  }


  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search */}
      <div className="p-2">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search CSS properties [press / to focus]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-full text-xs 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
        />
      </div>

      {/* Properties list */}
      <div className="flex-1 overflow-auto p-2">
        {filteredProps.map(prop => (
          <div key={prop} className="mb-3">
            <button
              onClick={() => setActiveProp(activeProp === prop ? null : prop)}
              className="w-full text-left px-2 py-1 text-xs font-semibold 
                         border-b border-gray-300 hover:bg-indigo-100 rounded"
            >
              {prop}
            </button>

            {activeProp === prop && (
              <div className="mt-1 ml-2 flex flex-wrap gap-1">
                {cssProperties[prop].length > 0 ? (
                  cssProperties[prop].map(val => (
                    <button
                      key={val}
                      onClick={() => applyCss(prop, val)}
                      className="px-2 py-1 text-xs border rounded hover:bg-indigo-200"
                    >
                      {val}
                    </button>
                  ))
                ) : (
                  <div className="flex gap-1 items-center">
                    <input
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      placeholder="Enter value"
                      className="px-2 py-1 border rounded text-xs"
                    />
                    <button
                      onClick={() => applyCss(prop, customValue)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TailwindEditor() {
  const selectedBlockId = useDesignerStore((s) => s.selectedBlockId)
  const applyClass = useDesignerStore((s) => s.applyClass)
  const [activeCategory, setActiveCategory] = useState('Layout')
  const [searchTerm, setSearchTerm] = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const filteredCategories = tailwindCategories
    .map((cat) => ({
      ...cat,
      classes: cat.classes.filter((cls) =>
        cls.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((cat) => cat.classes.length > 0)

  const categoriesToRender = searchTerm ? filteredCategories : tailwindCategories
  const activeCat = categoriesToRender.find((c) => c.title === activeCategory)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search */}
      <div className="p-2">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search Tailwind classes [press / to focus]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded text-xs 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg rounded-full"
        />
      </div>

      {/* Two-pane layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: categories */}
        <div className="w-1/4">
          {categoriesToRender.map((cat) => (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(cat.title)}
              className={`w-full text-left px-3 py-2 text-[0.625rem] font-bold 
                          hover:bg-indigo-300 transition border-b border-gray-900 rounded-lg truncate
                          ${
                            activeCategory === cat.title && !searchTerm
                              ? 'bg-indigo-300 text-indigo-700'
                              : 'text-slate-700'
                          }`}
              title={cat.title}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Right: classes */}
        <div className="flex-1 p-3 overflow-auto">
          {searchTerm ? (
            // Show all matching classes across categories
            <div className="flex flex-wrap gap-2">
              {filteredCategories.flatMap((cat) =>
                cat.classes.map((twClass) => (
                  <button
                    key={cat.title + twClass}
                    onClick={() =>
                      selectedBlockId && applyClass(selectedBlockId, twClass)
                    }
                    className="px-2 py-1 text-xs rounded 
                               hover:bg-indigo-300 transition border-2 border-slate-700"
                  >
                    {twClass}
                  </button>
                ))
              )}
            </div>
          ) : activeCat ? (
            // Normal browsing: show classes of active category
            <div className="flex flex-wrap gap-2">
              {activeCat.classes.map((twClass) => (
                <button
                  key={twClass}
                  onClick={() =>
                    selectedBlockId && applyClass(selectedBlockId, twClass)
                  }
                  className="px-2 py-1 text-xs rounded 
                             hover:bg-indigo-300 transition border-2 border-slate-700"
                >
                  {twClass}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500">No classes found</div>
          )}
        </div>
      </div>
    </div>
  )
}


function Properties() {
  const selectedBlockId = useDesignerStore((s) => s.selectedBlockId)
  const tree = useDesignerStore((s) => s.tree)
  const removeBlock = useDesignerStore((s) => s.removeBlock)
  const updateContent = useDesignerStore((s) => s.updateContent)
  const updateChildContent = useDesignerStore((s) => s.updateChildContent)
  const removeClass = useDesignerStore((s) => s.removeClass)

  const selectedBlock = tree.find(b => b.id === selectedBlockId)
  const [contentInput, setContentInput] = useState(selectedBlock?.content || '')

  useEffect(() => {
    setContentInput(selectedBlock?.content || '')
    if (selectedBlockId) {
      useDesignerStore.getState().cleanSegments(selectedBlockId)
    }
  }, [selectedBlockId])

  return (
  <aside
      className={`bg-purple-50
          border-l border-gray-200 shadow-lg
         p-4 border-l overflow-auto
        transition-transform duration-300 ease-out
        h-full
        fixed md:static right-0 z-50 md:z-auto
        w-4/5 md:w-1/4
        ${selectedBlockId ? 'translate-x-0' : 'translate-x-full'}
      `}
    >


    <div className="p-2">
      <div className="text-sm font-semibold mb-2">Block Properties</div>

      {selectedBlock ? (
        <div className="flex flex-col gap-2 text-xs">
          <div>
            <span className="font-semibold">Tag:</span> &lt;{selectedBlock.tag}&gt;
          </div>

          <div>
            <span className="font-semibold">Class:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(selectedBlock.props?.className || '')
                .split(' ')
                .filter(Boolean)
                .map((twClass) => (
                  <span
                    key={twClass}
                    className="px-2 py-1 bg-gray-200 rounded-full flex items-center gap-1"
                  >
                    {twClass}
                    <button
                      onClick={() => removeClass(selectedBlockId, twClass)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          </div>

          <div>
            <span className="font-semibold">Content:</span>

            {selectedBlock.segments && selectedBlock.segments.length > 0 ? (
              <div className="mt-2 flex flex-col gap-2">
                {selectedBlock.segments.map((seg, i) =>
                  seg.type === 'text' ? (
                    <input
                      key={i}
                      value={seg.value}
                      onChange={(e) =>
                        useDesignerStore.getState().updateSegment(selectedBlockId, i, e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded text-xs"
                      placeholder={`Text segment ${i + 1}`}
                    />
                  ) : (
                    <div key={i} className="border rounded p-2 bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold">
                          &lt;{tree.find(b => b.id === seg.ref)?.tag || 'unknown'}&gt;
                        </span>
                        <span className="text-xs text-gray-500">
                          {tree.find(b => b.id === seg.ref)?.props?.className || 'no classes'}
                        </span>
                      </div>
                      <input
                        value={tree.find(b => b.id === seg.ref)?.content || ''}
                        onChange={(e) =>
                          useDesignerStore.getState().updateChildContent(seg.ref, e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded text-xs"
                        placeholder="Edit inline content"
                      />
                    </div>
                  )
                )}

                {/* ✅ Always show add button */}
                <button
                  onClick={() =>
                    useDesignerStore.getState().insertSegment(
                      selectedBlockId,
                      selectedBlock.segments.length,
                      { type: 'text', value: '' }
                    )
                  }
                  className="text-xs px-2 py-1 border rounded bg-blue-50 hover:bg-blue-100"
                >
                  + Add Text Segment
                </button>
              </div>
            ) : (
              // Fallback: if no segments yet, but block has children, initialize segments
              tree.some(b => b.parentId === selectedBlockId) ? (
                <button
                  onClick={() => {
                    const children = tree.filter(b => b.parentId === selectedBlockId)
                    useDesignerStore.setState({
                      tree: tree.map(b =>
                        b.id === selectedBlockId
                          ? {
                              ...b,
                              segments: [
                                { type: 'text', value: b.content || '' },
                                ...children.map(c => ({ type: 'child', ref: c.id })),
                              ],
                              content: undefined, // migrate away from flat content
                            }
                          : b
                      ),
                    })
                  }}
                  className="text-xs px-2 py-1 border rounded bg-green-50 hover:bg-green-100"
                >
                  Convert to Segments
                </button>
              ) : (
                // Legacy simple content
                <input
                  value={contentInput}
                  onChange={(e) => {
                    setContentInput(e.target.value)
                    updateContent(selectedBlockId, e.target.value)
                  }}
                  placeholder="Edit direct content"
                  className="w-full mt-1 p-2 border rounded text-xs"
                />
              )
            )}
          </div>

          <div>
            <span className="font-semibold">Styles:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedBlock.props?.style &&
                Object.entries(selectedBlock.props.style).map(([prop, val]) => (
                  <span
                    key={prop}
                    className="px-2 py-1 bg-gray-200 rounded-full flex items-center gap-1"
                  >
                    {prop}: {val}
                    <button
                      onClick={() => {
                        // remove this style
                        const newStyle = { ...selectedBlock.props.style }
                        delete newStyle[prop]
                        useDesignerStore.getState().updateBlockProps(selectedBlockId, { style: newStyle })
                      }}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          </div>



          <button
            className="mt-2 p-2 rounded border text-white bg-red-700 hover:bg-red-800"
            onClick={() => {
              if (confirm('Are you sure you want to delete this block?')) {
                removeBlock(selectedBlockId)
              }
            }}
          >
            Remove Block
          </button>
        </div>
      ) : (
        <div className="text-xs text-gray-500 italic">No block selected</div>
      )}
    </div>

        </aside>

  )
}



function Canvas({ device }) {
  const tree = useDesignerStore((s) => s.tree)
  const selectBlock = useDesignerStore((s) => s.selectBlock)
  const selectedBlockId = useDesignerStore((s) => s.selectedBlockId)
  const renderBlock = useDesignerStore((s) => s.renderBlock)

  const rootBlocks = tree.filter(b => !b.parentId)

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  return (
    <main className="flex-1 min-h-0 overflow-auto flex justify-center items-start">
      <div
        onClick={() => selectBlock(null)}
        className="bg-white m-6 min-h-full border text-gray-400 shadow-md rounded-lg"
        style={{ width: deviceWidths[device] }}
      >
        {rootBlocks.map(block => renderBlock(block, tree, selectedBlockId, selectBlock))}
      </div>
    </main>
  )
}
