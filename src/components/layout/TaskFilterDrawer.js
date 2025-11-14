

import React, { useEffect, useRef } from "react";

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
  filterTaskType,
  setFilterTaskType,
  taskTypes,
  clearAllFilters,
  isAuctionMode = false,
  ...rest
}) => {
  const drawerRef = useRef(null);

  // Dynamic status options based on mode
  const getStatusOptions = () => {
    if (isAuctionMode) {
      return [
        { value: "Open", label: "Open" },
        { value: "Complete", label: "Closed" },
        { value: "Hold", label: "Hold" }
      ];
    }
    return statusOptions;
  };

  // Dynamic task types
  const getTaskTypes = () => {
    if (isAuctionMode) {
      return ["Auctions", "General"];
    }
    return taskTypes;
  };
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ minWidth: 320 }}
        onClick={(e) => e.stopPropagation()}
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
            {getStatusOptions().map((opt) => (
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
        {!isAuctionMode && (
          <>
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
                {getTaskTypes().map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </>
        )}
        {/* Date Filter - Dynamic label */}
        <div>
          <label className="block text-sm font-medium mb-2  text-blue-600">
            {isAuctionMode ? "Auction Date" : "Due Date"}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDueDateFilter("none")}
              className={`px-3 py-1 rounded-full border text-xs font-medium relative ${
                dueDateFilter === "none"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              No Filter
              {/* {dueDateFilter === "none" && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              )} */}
            </button>
            <button
              onClick={() => setDueDateFilter("today")}
              className={`px-3 py-1 rounded-full border text-xs font-medium relative ${
                dueDateFilter === "today"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Today
             
            </button>
            <button
              onClick={() => setDueDateFilter("week")}
              className={`px-3 py-1 rounded-full border text-xs font-medium relative ${
                dueDateFilter === "week"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              This Week
             
            </button>
            <button
              onClick={() => setDueDateFilter("month")}
              className={`px-3 py-1 rounded-full border text-xs font-medium relative ${
                dueDateFilter === "month"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              This Month
             
            </button>
            <button
              onClick={() => setDueDateFilter("year")}
              className={`px-3 py-1 rounded-full border text-xs font-medium relative ${
                dueDateFilter === "year"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              This Year
              
            </button>
            <button
              onClick={() => setDueDateFilter("custom")}
              className={`px-3 py-1 rounded-full border text-xs font-medium relative ${
                dueDateFilter === "custom"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Custom Date
             
            </button>
          </div>
          {dueDateFilter === "custom" && (
            <div className="flex flex-col gap-2 mt-2">
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="px-2 py-1 border rounded text-sm"
                placeholder="Start date"
              />
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="px-2 py-1 border rounded text-sm"
                placeholder="End date"
              />
            </div>
          )}
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
</>
);
};

export default TaskFilterDrawer;
