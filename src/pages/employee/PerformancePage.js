import React, { useState } from 'react'
import { FaStar, FaCalendar, FaCheckCircle, FaHandshake, FaChartPie, FaChartLine, FaInfoCircle, FaChevronDown, FaArrowRight } from 'react-icons/fa'
import Header from '../../components/common/Header'
import Sidebar from '../../components/common/Sidebar'

const summaryData = [
  { label: 'Overall Rating', value: 4.2, icon: <FaStar />, color: 'bg-blue-100 text-blue-800' },
  { label: 'Last Review', value: '2025-06-15', icon: <FaCalendar />, color: 'bg-blue-100 text-blue-800' },
  { label: 'Projects Completed', value: 12, icon: <FaCheckCircle />, color: 'bg-blue-100 text-blue-800' },
  { label: 'Peer Rating', value: 4.5, icon: <FaHandshake />, color: 'bg-blue-100 text-blue-800' },
]

const performanceDataByYear = {
  2024: [
    { month: 'Jan', rating: 3.7, completion: 78 },
    { month: 'Feb', rating: 3.9, completion: 82 },
    { month: 'Mar', rating: 4.0, completion: 85 },
    { month: 'Apr', rating: 4.1, completion: 88 },
    { month: 'May', rating: 4.0, completion: 86 },
    { month: 'Jun', rating: 4.2, completion: 90 },
    { month: 'Jul', rating: 4.3, completion: 92 },
    { month: 'Aug', rating: 4.2, completion: 89 },
    { month: 'Sep', rating: 4.4, completion: 93 },
    { month: 'Oct', rating: 4.5, completion: 95 },
    { month: 'Nov', rating: 4.3, completion: 91 },
    { month: 'Dec', rating: 4.4, completion: 94 },
  ],
  2025: [
    { month: 'Jan', rating: 3.8, completion: 80 },
    { month: 'Feb', rating: 4.0, completion: 85 },
    { month: 'Mar', rating: 4.1, completion: 88 },
    { month: 'Apr', rating: 4.3, completion: 92 },
    { month: 'May', rating: 4.2, completion: 90 },
    { month: 'Jun', rating: 4.4, completion: 95 },
  ],
}

const taskTypeDataByYear = {
  2024: {
    'Jan': [
      { name: 'Reverse Auction', value: 7, color: 'bg-blue-500' },
      { name: 'Forward Auction', value: 4, color: 'bg-blue-300' },
      { name: 'RFx', value: 6, color: 'bg-blue-400' },
      { name: 'General Task', value: 9, color: 'bg-blue-200' },
    ],
    'Feb': [
      { name: 'Reverse Auction', value: 8, color: 'bg-blue-500' },
      { name: 'Forward Auction', value: 5, color: 'bg-blue-300' },
      { name: 'RFx', value: 7, color: 'bg-blue-400' },
      { name: 'General Task', value: 10, color: 'bg-blue-200' },
    ],
    // ...other months
  },
  2025: {
    'Jan': [
      { name: 'Reverse Auction', value: 6, color: 'bg-blue-500' },
      { name: 'Forward Auction', value: 3, color: 'bg-blue-300' },
      { name: 'RFx', value: 5, color: 'bg-blue-400' },
      { name: 'General Task', value: 8, color: 'bg-blue-200' },
    ],
    'Feb': [
      { name: 'Reverse Auction', value: 8, color: 'bg-blue-500' },
      { name: 'Forward Auction', value: 5, color: 'bg-blue-300' },
      { name: 'RFx', value: 7, color: 'bg-blue-400' },
      { name: 'General Task', value: 10, color: 'bg-blue-200' },
    ],
    // ...other months
    'Mar': [
      { name: 'Reverse Auction', value: 7, color: 'bg-blue-500' },
      { name: 'Forward Auction', value: 4, color: 'bg-blue-300' },
      { name: 'RFx', value: 6, color: 'bg-blue-400' },
      { name: 'General Task', value: 9, color: 'bg-blue-200' },
    ],
    'Apr': [
      { name: 'Reverse Auction', value: 6, color: 'bg-blue-500' },
      { name: 'Forward Auction', value: 3, color: 'bg-blue-300' },
      { name: 'RFx', value: 5, color: 'bg-blue-400' },
      { name: 'General Task', value: 8, color: 'bg-blue-200' },
    ],
    'May': [
      { name: 'Reverse Auction', value: 8, color: 'bg-blue-500' },
      { name: 'Forward Auction', value: 5, color: 'bg-blue-300' },
      { name: 'RFx', value: 7, color: 'bg-blue-400' },
      { name: 'General Task', value: 10, color: 'bg-blue-200' },
    ],
    'Jun': [
      { name: 'Reverse Auction', value: 7, color: 'bg-blue-500' },
      { name: 'Forward Auction', value: 4, color: 'bg-blue-300' },
      { name: 'RFx', value: 6, color: 'bg-blue-400' },
      { name: 'General Task', value: 9, color: 'bg-blue-200' },
    ],
  },
}

const goalData = { completed: 8, total: 10 }

const PerformancePage = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedMonth, setSelectedMonth] = useState('Jun')
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const goalPercent = Math.round((goalData.completed / goalData.total) * 100)

  const years = Object.keys(performanceDataByYear)
  const months = performanceDataByYear[selectedYear].map((d) => d.month)
  const performanceTrend = performanceDataByYear[selectedYear]
  const taskTypeDistribution = taskTypeDataByYear[selectedYear][selectedMonth] || []

  // Pie chart color mapping
  const getPieColor = (tailwindColor) => {
    switch (tailwindColor) {
      case 'bg-blue-500': return '#2563eb'
      case 'bg-blue-400': return '#60a5fa'
      case 'bg-blue-300': return '#93c5fd'
      case 'bg-blue-200': return '#bfdbfe'
      default: return '#2563eb'
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidebar isOpen={showSidebar} toggleSidebar={() => setShowSidebar((prev) => !prev)} />
      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={true} onToggleSidebar={() => setShowSidebar((prev) => !prev)} />
        <main className="flex-1 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-full lg:max-w-7xl mx-auto">
            {/* Year and Month Selectors */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div>
                <label className="text-blue-800 font-semibold mr-2">Year:</label>
                <select
                  className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value)
                    setSelectedMonth(performanceDataByYear[e.target.value][0].month)
                  }}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-blue-800 font-semibold mr-2">Month:</label>
                <select
                  className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 mb-6">
              {summaryData.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl shadow flex flex-col items-center justify-center p-3 xs:p-4 ${item.color}`}
                >
                  <span className="text-2xl xs:text-3xl mb-1">{item.icon}</span>
                  <span className="font-bold text-lg xs:text-xl">{item.value}</span>
                  <span className="text-xs xs:text-sm text-center">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Performance Trend */}
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-semibold text-blue-800 mb-2 text-base xs:text-lg flex items-center">
                  <FaChartLine className="mr-2" /> Monthly Performance Trend
                </h2>
                <div className="w-full h-48 flex items-end gap-2">
                  {performanceTrend.map((d) => (
                    <div key={d.month} className="flex flex-col items-center flex-1">
                      <div
                        className="w-5 sm:w-7 rounded-t bg-blue-400 relative"
                        style={{
                          height: `${d.completion * 0.9}px`,
                          minHeight: '10px',
                          transition: 'height 0.3s',
                        }}
                        title={`Completion: ${d.completion}%`}
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-blue-800 font-bold">
                          {d.completion}%
                        </span>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full bg-blue-600 mt-1"
                        style={{
                          marginBottom: `${(d.rating - 3.5) * 40}px`,
                        }}
                        title={`Rating: ${d.rating}`}
                      ></div>
                      <span className="text-xs mt-2">{d.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-blue-600">
                  <span>Rating (dot)</span>
                  <span>Completion % (bar)</span>
                </div>
              </div>

              {/* Task Type Distribution */}
              <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <h2 className="font-semibold text-blue-800 text-base xs:text-lg flex items-center">
                    <FaChartPie className="mr-2" /> Task Type Distribution
                  </h2>
                  <FaInfoCircle
                    className="w-4 h-4 text-blue-500 hover:text-blue-700 cursor-pointer ml-2"
                    onMouseEnter={() => setTooltipVisible(true)}
                    onMouseLeave={() => setTooltipVisible(false)}
                  />
                  {tooltipVisible && (
                    <div className="absolute z-10 mt-10 ml-2 bg-blue-50 border border-blue-200 rounded-lg shadow-xs w-72 p-3 text-sm text-blue-600">
                      <h3 className="font-semibold text-blue-800 mb-1">Task Distribution Breakdown</h3>
                      <p>
                        This chart displays the distribution of task types for the selected month and year. It shows the proportion of each task category, helping to understand workload patterns.
                      </p>
                      <h3 className="font-semibold text-blue-800 mt-2 mb-1">Calculation</h3>
                      <p>
                        The chart represents the count of tasks in each category for the selected period, calculated as a percentage of the total tasks completed.
                      </p>
                    </div>
                  )}
                </div>
                <div className="w-40 h-40 relative flex items-center justify-center">
                  <svg width="160" height="160" viewBox="0 0 32 32">
                    {(() => {
                      let total = taskTypeDistribution.reduce((a, b) => a + b.value, 0)
                      let acc = 0
                      return taskTypeDistribution.map((t, idx) => {
                        const start = acc / total
                        acc += t.value
                        const end = acc / total
                        const large = end - start > 0.5 ? 1 : 0
                        const a1 = 2 * Math.PI * start
                        const a2 = 2 * Math.PI * end
                        const x1 = 16 + 16 * Math.sin(a1)
                        const y1 = 16 - 16 * Math.cos(a1)
                        const x2 = 16 + 16 * Math.sin(a2)
                        const y2 = 16 - 16 * Math.cos(a2)
                        return (
                          <path
                            key={t.name}
                            d={`M16,16 L${x1},${y1} A16,16 0 ${large} 1 ${x2},${y2} Z`}
                            fill={getPieColor(t.color)}
                            opacity="0.9"
                          />
                        )
                      })
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-800">Tasks</span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center mt-4 gap-2">
                  {taskTypeDistribution.map((t) => (
                    <div key={t.name} className="flex items-center gap-1 text-xs">
                      <span className={`inline-block w-3 h-3 rounded-full ${t.color}`}></span>
                      <span>{t.name} ({t.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Goal Achievement Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
                <h2 className="font-semibold text-blue-800 mb-2 text-base xs:text-lg flex items-center">
                  <FaChartPie className="mr-2" /> Goal Achievement Rate
                </h2>
                <div className="relative flex items-center justify-center" style={{ height: 180 }}>
                  <svg width={140} height={140}>
                    <circle
                      cx={70}
                      cy={70}
                      r={60}
                      stroke="#e5e7eb"
                      strokeWidth={14}
                      fill="none"
                    />
                    <circle
                      cx={70}
                      cy={70}
                      r={60}
                      stroke="#2563eb"
                      strokeWidth={14}
                      fill="none"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 * (1 - goalPercent / 100)}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.5s' }}
                    />
                  </svg>
                  <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-blue-800">{goalPercent}%</span>
                    <span className="text-xs text-blue-600 mt-1">{goalData.completed} of {goalData.total} goals</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default PerformancePage