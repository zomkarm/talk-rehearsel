'use client'
import {useState,useEffect} from 'react';
import { useRouter } from 'next/navigation'
import ProjectModal from '../elements/ProjectModal';
import { Grid2x2, Search, Rows4} from 'lucide-react'
import ProjectOptions from '../elements/ProjectOptions'
import { useGlobalStore } from '@/store/globalStore'

export default function MainPanel(){
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, ProjectId: null })
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // toggle grid/large
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const router = useRouter()
  const showLoader = useGlobalStore(s => s.showLoader)
  const hideLoader = useGlobalStore(s => s.hideLoader)
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProjects,setFilteredProjects] = useState([])
  
  useEffect(() => {
    	getProjects()
  }, [refreshKey])

  useEffect(() => {
	  if (Array.isArray(projects)) {
	    setFilteredProjects(
	      projects.filter(p =>
	        (p?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
	      )
	    )
	  } else {
	    setFilteredProjects([]);
	  }
	}, [projects, searchQuery]);


  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false })
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [contextMenu])

  const getProjects = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/project', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data) setProjects(data)
    } catch (err) {
      console.error('Error fetching projects:', err)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
	  setSelectedIndex(null);
	  setSelectedProjectId(null);
	}, [viewMode]);

	useEffect(() => {
    const fetchPref = async () => {
      try {
        const res = await fetch('/api/preferences/viewMode', { credentials: 'include' })
        if (res.ok) {
          const pref = await res.json()
          if (pref?.value) setViewMode(pref.value)
        }
      } catch (err) {
        console.error('Error fetching viewMode preference:', err)
      }
    }
    fetchPref()
  }, [])

  const handleViewToggle = async (mode) => {
    setViewMode(mode)
    try {
      await fetch(`/api/preferences/viewMode`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: mode }),
      })
    } catch (err) {
      console.error('Error saving viewMode preference:', err)
    }
  }

  const getCols = () => {
	  if (viewMode === 'list') return 2;
	  if (viewMode === 'grid') return 4; // adjust to your breakpoints
	  return 1;
	};


  const handleOpen = (id) => {
    showLoader("Opening Project...")
    router.push(`/project/${id}`)
  }

  return (
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto">
      {/* Top Bar */}
		<div className="mb-4">
		  {/* First row: actions */}
		  <div className="flex items-center gap-2 sm:gap-3">
		    {/* Search toggle (mobile) */}
		    <div className="sm:hidden">
		      <button
		        onClick={() => setShowMobileSearch(prev => !prev)}
		        className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100"
		        aria-label="Search"
		      >
		        <Search size={18} />
		      </button>
		    </div>

		    {/* Desktop search input */}
		    <div className="flex-1 hidden sm:block">
		      <input
		        type="text"
		        value={searchQuery}
		        onChange={(e) => setSearchQuery(e.target.value)}
		        placeholder="Search in TalkRehearsel..."
		        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm shadow-sm 
		                   focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-gray-400"
		      />
		    </div>

		    {/* View toggle: always visible */}
		    <div className="flex items-center gap-1">
		      <button
		        onClick={() => handleViewToggle('grid')}
		        title="Folder View"
		        className={`px-2 py-2 rounded-md border text-xs transition ${
		          viewMode === 'grid'
		            ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
		            : 'border-gray-200 text-gray-600 hover:bg-gray-100'
		        }`}
		      >
		        <Grid2x2 size={16} />
		      </button>
		      <button
		        onClick={() => handleViewToggle('list')}
		        title="Tiles View"
		        className={`px-2 py-2 rounded-md border text-xs transition ${
		          viewMode === 'list'
		            ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
		            : 'border-gray-200 text-gray-600 hover:bg-gray-100'
		        }`}
		      >
		        <Rows4 size={16} />
		      </button>
		    </div>

		    {/* New Project button */}
		    <button 
		      onClick={() => setIsProjectModalOpen(true)} 
		      className="shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-lg shadow-sm 
		                 bg-gradient-to-r from-teal-500 to-indigo-600 hover:opacity-90 transition"
		    >
		      + New Project
		    </button>

		    {isProjectModalOpen && (
		      <ProjectModal 
		        isOpen={isProjectModalOpen}
		        onClose={() => setIsProjectModalOpen(false)}
		        triggerRefresh={() => setRefreshKey(prev => prev + 1)}
		      />
		    )}
		  </div>

		  {/* Second row: mobile search input */}
		  {showMobileSearch && (
		    <div className="mt-2 sm:hidden">
		      <input
		        type="text"
		        value={searchQuery}
		        onChange={(e) => setSearchQuery(e.target.value)}
		        placeholder="Search in TalkRehearsel..."
		        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm shadow-sm 
		                   focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-gray-400"
		      />
		    </div>
		  )}
		</div>


    {/* Project/File Grid */}
		<div
		  className={
		    viewMode === 'list'
		      ? "grid grid-cols-1 sm:grid-cols-2 gap-3 p-4" // list view = 2 columns on sm+
		      : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 p-4"
		  }
		  tabIndex={0} // make the whole grid focusable
		  onKeyDown={(e) => {
		    if (selectedIndex === null) return;
		    const cols = getCols();
		    let nextIndex = selectedIndex;

		    if (e.key === 'ArrowRight' && selectedIndex < projects.length - 1) {
		      nextIndex = selectedIndex + 1;
		    }
		    if (e.key === 'ArrowLeft' && selectedIndex > 0) {
		      nextIndex = selectedIndex - 1;
		    }
		    if (e.key === 'ArrowDown') {
		      const down = selectedIndex + cols;
		      if (down < projects.length) nextIndex = down;
		    }
		    if (e.key === 'ArrowUp') {
		      const up = selectedIndex - cols;
		      if (up >= 0) nextIndex = up;
		    }
		    if (e.key === 'Enter' || e.key === ' ') {
				  if (selectedIndex !== null) {
				    handleOpen(projects[selectedIndex].id);
				    e.preventDefault();
				  }
				}

		    if (nextIndex >= 0 && nextIndex < projects.length) {
				  setSelectedIndex(nextIndex);
				  setSelectedProjectId(projects[nextIndex].id);
				}


		    if (nextIndex !== selectedIndex) {
		      setSelectedIndex(nextIndex);
		      setSelectedProjectId(projects[nextIndex].id);
		      e.preventDefault();
		    }
		  }}
		>
		  {isLoading ? (
		    <div className="col-span-full flex flex-col items-center justify-center py-20">
		      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid mb-4"></div>
		      <p className="text-gray-600 text-lg font-medium">Loading projects, please wait...</p>
		    </div>
		  ) : filteredProjects.length > 0 ? (
		    filteredProjects.map((project,index) => (
		      <div
		        key={project.id}
		        tabIndex={0}
		        onDoubleClick={() => handleOpen(project.id)}
		        onClick={() => {
        setSelectedIndex(index);
        setSelectedProjectId(project.id);
      }}
		        onContextMenu={(e) => {
		          e.preventDefault()
		          setContextMenu({ visible: true, x: e.pageX, y: e.pageY, projectId: project.id })
		        }}
		        className={`cursor-pointer group rounded-xl border transition bg-white 
		          ${selectedProjectId === project.id 
		            ? 'border-indigo-600 ring-2 ring-indigo-100' 
		            : 'border-gray-200 hover:border-indigo-300 hover:shadow-lg'}`}
		      >
		        {viewMode === 'list' ? (
		          /* --- LIST TILE (2‑col) --- */
		          <div className="flex items-center justify-between px-4 py-3">
		            <div className="flex items-center gap-3 min-w-0">
		              {/* Folder icon */}
		              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-br from-indigo-100 to-purple-200">
		                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h5l2 2h11v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
		                </svg>
		              </div>
		              <div className="truncate">
		                <div className="text-sm font-medium text-gray-800 truncate">{project.title}</div>
		                <div className="text-xs text-gray-500">Last edited recently</div>
		              </div>
		            </div>
		            <div className="text-[11px] text-gray-400 hidden sm:block">Double‑click to open</div>
		          </div>
		        ) : (
		          /* --- FOLDER CARD --- */
		          <div className="flex flex-col shadow-lg">
		            <div className="relative w-full h-28 sm:h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-t-xl flex items-center justify-center">
		              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400 group-hover:text-indigo-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h5l2 2h11v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
		              </svg>
		            </div>
		            <div className="px-3 py-2 text-center">
		              <div className="text-xs sm:text-sm font-medium text-gray-800 truncate">
		                {project.title}
		              </div>
		              <div className="text-[11px] sm:text-xs text-gray-500">
		                Last edited recently
		              </div>
		            </div>
		          </div>
		        )}
		      </div>
		    ))
		  ) : (
		    <div className="col-span-full flex items-center justify-center py-20 text-gray-500">
		      No projects found.
		    </div>
		  )}
		</div>


      {contextMenu.visible && (
        <ProjectOptions
          x={contextMenu.x}
          y={contextMenu.y}
          projectId={contextMenu.projectId}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
          onOpen={() => {
            setContextMenu({ ...contextMenu, visible: false })
            handleOpen(contextMenu.projectId)
          }}
        />
      )}
    </main>
  )
}
