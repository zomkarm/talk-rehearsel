'use client'
import { useEffect, useState } from 'react'
import { Users, BookOpen, Layers } from 'lucide-react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, active: 0, subjects: 0, lessons: 0 })
  const [userGrowthData, setUserGrowthData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Users',
        data: [],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  })
  const [moduleUsageData, setModuleUsageData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Usage',
        data: [],
        backgroundColor: ['#14b8a6', '#6366f1', '#f59e0b'],
        borderWidth: 1,
      },
    ],
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard')
        const data = await res.json()

        if (data.stats) setStats(data.stats)

        if (Array.isArray(data.userGrowthData)) {
          setUserGrowthData(prev => ({
            ...prev,
            labels: data.userGrowthData.map(d => d.month),
            datasets: [
              {
                ...prev.datasets[0],
                data: data.userGrowthData.map(d => d.count),
              },
            ],
          }))
        }

        if (Array.isArray(data.moduleUsageData)) {
          setModuleUsageData(prev => ({
            ...prev,
            labels: data.moduleUsageData.map(m => m.label),
            datasets: [
              {
                ...prev.datasets[0],
                data: data.moduleUsageData.map(m => m.value),
              },
            ],
          }))
        }

        if (Array.isArray(data.recentActivity)) {
          setRecentActivity(data.recentActivity)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      }
    }
    fetchStats()
  }, [])

  return (
    <main className="flex-1 bg-white p-6 mt-2 rounded-tl-3xl overflow-y-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="h-6 w-6 text-indigo-600" />}
          label="Total Users"
          value={stats.users}
          color="from-indigo-500 to-indigo-600"
          trend="+12% this month"
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-green-600" />}
          label="Active Learners"
          value={stats.active}
          color="from-green-500 to-emerald-600"
          trend="+5% this week"
        />
        <StatCard
          icon={<BookOpen className="h-6 w-6 text-teal-600" />}
          label="Subjects"
          value={stats.subjects}
          color="from-teal-500 to-cyan-600"
          trend="Stable"
        />
        <StatCard
          icon={<Layers className="h-6 w-6 text-purple-600" />}
          label="Lessons"
          value={stats.lessons}
          color="from-purple-500 to-fuchsia-600"
          trend="+8 new"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-64">
            <Line
              data={userGrowthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        <div className="bg-gray-50 border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Module Usage</h3>
          <div className="h-64">
            <Doughnut
              data={moduleUsageData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <ul className="divide-y divide-gray-200 text-sm">
          {recentActivity.length > 0 ? (
            recentActivity.map((item, idx) => (
              <li key={idx} className="py-2 flex justify-between">
                <span>
                  {item.action}: <strong>{item.target}</strong> by {item.user}
                </span>
                <span className="text-gray-500">
                  {new Date(item.time).toLocaleString()}
                </span>
              </li>
            ))
          ) : (
            <li className="py-2 text-gray-500">No recent activity</li>
          )}
        </ul>
      </div>
    </main>
  )
}

function StatCard({ icon, label, value, color, trend }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full bg-gradient-to-br ${color} bg-opacity-10`}>
          <div className="bg-white p-2 rounded-full shadow-sm">{icon}</div>
        </div>
        <span className="text-xs font-medium text-green-600">{trend}</span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}
