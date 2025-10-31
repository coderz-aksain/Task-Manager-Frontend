

const TaskFilterDrawer = ({
  isOpen,
  onClose,
  filterEmployee,
  setFilterEmployee,
  employees,
  filterStatus,
  setFilterStatus,
  statusOptions,
  filterPriority,
  setFilterPriority,
  priorities,
  dueDateFilter,
  setDueDateFilter,
  showDueDateFilterDropdown,
  setShowDueDateFilterDropdown,
  customDateRange,
  setCustomDateRange,
  showCustomDateModal,
  setShowCustomDateModal,
  filterTaskType,
  setFilterTaskType,
  taskTypes,
  clearAllFilters,
  ...rest
}) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ minWidth: 320 }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-xl font-normal">Filters</h3>
        <button
          onClick={onClose}
          className="p-2 rounded hover:bg-gray-100"
          title="Close"
        >
          <span className="text-2xl">→</span>
        </button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        {/* Employee Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 text-blue-600">Employees</label>
          <div className="flex flex-wrap gap-2">
            {employees.map((emp) => (
              <button
                key={emp.email}
                onClick={() => setFilterEmployee((prev) => prev.includes(emp.email) ? prev.filter((e) => e !== emp.email) : [...prev, emp.email])}
                className={`px-3 py-1 rounded-full border text-xs font-medium ${
                  filterEmployee.includes(emp.email)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                {emp.name || emp.email}
              </button>
            ))}
          </div>
        </div>
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-2  text-blue-600">Status</label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus((prev) => prev.includes(opt.value) ? prev.filter((v) => v !== opt.value) : [...prev, opt.value])}
                className={`px-3 py-1 rounded-full border text-xs font-medium ${
                  filterStatus.includes(opt.value)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium mb-2  text-blue-600">Priority</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        {/* Task Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2  text-blue-600">Task Type</label>
          <select
            value={filterTaskType}
            onChange={(e) => setFilterTaskType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Types</option>
            {taskTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        {/* Due Date Filter */}
        <div>
          <label className="block text-sm font-medium mb-2  text-blue-600">Due Date</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="dueDateFilter"
                checked={dueDateFilter === "none"}
                onChange={() => setDueDateFilter("none")}
              />
              No Filter
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="dueDateFilter"
                checked={dueDateFilter === "today"}
                onChange={() => setDueDateFilter("today")}
              />
              Today
            </label>
            <label className="flex items-center gap-2 cursor-pointer ">
              <input
                type="radio"
                name="dueDateFilter"
                checked={dueDateFilter === "week"}
                onChange={() => setDueDateFilter("week")}
              />
              This Week
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="dueDateFilter"
                checked={dueDateFilter === "month"}
                onChange={() => setDueDateFilter("month")}
              />
              This Month
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="dueDateFilter"
                checked={dueDateFilter === "year"}
                onChange={() => setDueDateFilter("year")}
              />
              This Year
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="dueDateFilter"
                checked={dueDateFilter === "custom"}
                onChange={() => setShowCustomDateModal(true)}
              />
              Custom Date
            </label>
            {showCustomDateModal && (
              <div className="flex gap-2 mt-2">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange((prev) => ({ ...prev, start: e.target.value }))}
                  className="px-2 py-1 border rounded"
                />
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange((prev) => ({ ...prev, end: e.target.value }))}
                  className="px-2 py-1 border rounded"
                />
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => setDueDateFilter("custom")}
                >Apply</button>
              </div>
            )}
          </div>
        </div>
   <button
  className="relative w-full mt-6 py-2 bg-gradient-to-b from-red-600 to-red-700 
             text-white rounded-md hover:from-red-700 hover:to-red-800 
             transition-all duration-300 font-medium shadow-sm overflow-hidden
             group"
  onClick={clearAllFilters}
>
  {/* Button Text */}
  <span className="relative z-10">Clear All Filters</span>

  {/* Subtle Shine Overlay */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                    -translate-x-full group-hover:translate-x-full 
                    transition-transform duration-700 ease-out" />
  </div>
</button>
      </div>
    </div>
  );
};

export default TaskFilterDrawer;
