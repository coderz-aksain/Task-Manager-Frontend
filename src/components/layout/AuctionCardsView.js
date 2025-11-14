import React, { useState } from "react";
import { Calendar, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import TaskFilterDrawer from "./TaskFilterDrawer";

const AuctionCardsView = ({
  tasks = [], // filtered tasks
  allTasks = [], // all tasks for counts
  loading,
  error,
  onTaskClick,
  onDeleteClick,
  onReminderClick,
  employees = [],
  showFilterDrawer,
  setShowFilterDrawer,
  filterEmployee = [],
  setFilterEmployee = () => {},
  filterStatus = [],
  setFilterStatus = () => {},
  clearAllFilters = () => {},
}) => {
  const [expandedCards, setExpandedCards] = useState({});

  // Get today's date in DD-MM-YYYY format
  const today = new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .split("/")
    .join("-");

  // Calculate today's open and closed tasks for each employee
  const employeeStats = employees.map((employee) => {
    const employeeAllTasks = allTasks.filter(
      (task) =>
        Array.isArray(task.assignedTo) &&
        task.assignedTo.some((assigned) => assigned.email === employee.email)
    );

    const todaysTasks = employeeAllTasks.filter(
      (task) => task.auctionDate === today
    );
    const todaysOpen = todaysTasks.filter(
      (task) => task.status === "Open"
    ).length;
    const todaysClosed = todaysTasks.filter(
      (task) => task.status === "Complete"
    ).length;
    const totalTasks = employeeAllTasks.length;

    const filteredEmployeeTasks = tasks.filter(
      (task) =>
        Array.isArray(task.assignedTo) &&
        task.assignedTo.some((assigned) => assigned.email === employee.email)
    );

    return {
      employee,
      todaysOpen,
      todaysClosed,
      totalTasks,
      tasks: filteredEmployeeTasks,
    };
  });

  // Filter employees based on selected filterEmployee
  const filteredEmployeeStats = employeeStats.filter(
    (stat) =>
      filterEmployee.length === 0 ||
      filterEmployee.includes(stat.employee.email)
  );

  return (
    <div className="w-full">
      {/* Employee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployeeStats.map(
          ({
            employee,
            todaysOpen,
            todaysClosed,
            totalTasks,
            tasks: employeeTasks,
          }) => {
            const isExpanded = expandedCards[employee.email] || false;
            const toggleExpand = () => {
              setExpandedCards((prev) => ({
                ...prev,
                [employee.email]: !prev[employee.email],
              }));
            };

            return (
              <div
                key={employee.email}
                className={`
                  group relative bg-white/80 backdrop-blur-xl border border-white/30
                  rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500
                  cursor-pointer overflow-hidden transform hover:-translate-y-1
                  ${isExpanded ? 'ring-2 ring-indigo-500/30 shadow-2xl scale-[1.02]' : ''}
                `}
                onClick={(e) => {
                  if (e.target.closest('.task-item')) return;
                  toggleExpand();
                }}
              >
                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/20
                                opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Floating Glow Ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-zinc-700/20 to-slate-700/20
                                rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

                {/* Header */}
                <div className="relative flex items-center space-x-4 z-10">
                  {/* Avatar with Premium Ring */}
                  {employee.avatar ? (
                    <div className="relative">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-white/90 shadow-xl
                                   transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400
                                      opacity-30 blur-xl scale-125 -z-10 animate-pulse" />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
                                      flex items-center justify-center text-white font-bold text-xl shadow-2xl
                                      transition-transform duration-300 group-hover:scale-105">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400
                                      opacity-40 blur-xl scale-125 -z-10 animate-pulse" />
                    </div>
                  )}

                  {/* Name & Role */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base truncate">
                      {employee.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 font-medium tracking-wide">
                      {employee.position}
                    </p>
                  </div>

                  {/* Premium Total Tasks Badge */}
                  <div className="relative flex flex-col items-center justify-center
                      bg-gradient-to-br from-slate-600 to-slate-800
                      text-white rounded-xl px-5 py-3 min-w-[80px]
                      shadow-xl border border-white/20 overflow-hidden">

    {/* Content — above glass */}
    <div className="relative z-10 flex flex-col items-center">
      <Sparkles className="w-4 h-4 mb-1 text-yellow-400 animate-pulse" />
      <span className="text-xs font-semibold uppercase tracking-widest">
        Total
      </span>
      <span className="text-2xl font-bold mt-0.5">
        {totalTasks}
      </span>
    </div>
  </div>
                </div>

                {/* Today's Summary Pills */}
                <div className="mt-6 flex gap-3">
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-700
                                    px-4 py-2.5 rounded-xl text-xs font-semibold text-center shadow-md
                                    border border-emerald-200/50 backdrop-blur-sm">
                      <span className="block opacity-80">Today's Open</span>
                      <span className="text-xl font-bold">{todaysOpen}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-700
                                    px-4 py-2.5 rounded-xl text-xs font-semibold text-center shadow-md
                                    border border-blue-200/50 backdrop-blur-sm">
                      <span className="block opacity-80">Today's Closed</span>
                      <span className="text-xl font-bold">{todaysClosed}</span>
                    </div>
                  </div>
                </div>

                {/* Expandable Task List */}
                <div
                  className={`mt-5 overflow-hidden transition-all duration-700 ease-out ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-white/30 pt-5">
                    <div className="max-h-80 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      {employeeTasks.length > 0 ? (
                        employeeTasks.map((task) => (
                          <div
                            key={task.taskId}
                            className="task-item group/task p-4 rounded-xl bg-white/70 backdrop-blur-md
                                       border border-white/40 hover:border-indigo-300
                                       hover:bg-gradient-to-r hover:from-indigo-50/70 hover:to-purple-50/70
                                       transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer
                                       transform hover:scale-[1.02]"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskClick?.(task);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 truncate">
                                  {task.eventName}
                                </h4>
                                <div className="flex items-center gap-2 mt-1.5 text-xs">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    task.status === "Open"
                                      ? "bg-green-100 text-green-700"
                                      : task.status === "Complete"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}>
                                    {task.status}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="font-medium text-gray-500">
                                    {task.auctionType}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-3 text-xs text-gray-600 font-medium">
                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{task.auctionDate} {task.auctionTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-sm text-gray-500 italic bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-gray-300">
                          No tasks assigned
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expand Indicator */}
                <div className="absolute bottom-4 right-4 text-gray-500 opacity-70 group-hover:opacity-100 transition-all duration-300">
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 group-hover:text-indigo-600 transition-colors" />
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Empty State */}
      {(employees || []).length === 0 && !loading && (
        <div className="col-span-full text-center py-20">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed rounded-3xl w-32 h-32 mx-auto mb-6 opacity-60" />
          <p className="text-gray-700 font-bold text-xl">No employees found</p>
          <p className="text-sm text-gray-500 mt-2">Add team members to get started</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 animate-pulse shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-36" />
                  <div className="h-4 bg-gray-200 rounded w-24 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overlay for closing drawer on outside click */}
      {showFilterDrawer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowFilterDrawer(false)}
        />
      )}

      {/* Task Filter Drawer */}
      <TaskFilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        filterEmployee={filterEmployee}
        setFilterEmployee={setFilterEmployee}
        employees={employees}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        statusOptions={[
          { value: "Open", label: "Open" },
          { value: "Complete", label: "Closed" },
          { value: "Hold", label: "Hold" },
        ]}
        filterPriority="all"
        setFilterPriority={() => {}}
        priorities={[]}
        dueDateFilter="none"
        setDueDateFilter={() => {}}
        showDueDateFilterDropdown={false}
        setShowDueDateFilterDropdown={() => {}}
        customDateRange={{ start: "", end: "" }}
        setCustomDateRange={() => {}}
        filterTaskType="all"
        setFilterTaskType={() => {}}
        taskTypes={[]}
        clearAllFilters={clearAllFilters}
        isAuctionMode={true}
      />

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #c8c8c8, #a0a0a0);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a0a0a0, #808080);
          background-clip: content-box;
        }
      `}</style>
    </div>
  );
};

export default AuctionCardsView;
