
// import React, { useMemo, useState } from "react";
// import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

// const EmployeeCardsView = ({ 
//   employees = [], 
//   tasks = [], 
//   onViewTask, 
//   isLoading, 
//   dueDateFilter = 'none', 
//   setDueDateFilter, 
//   customDateRange, 
//   setCustomDateRange 
// }) => {
//   const [expandedEmployee, setExpandedEmployee] = useState(null);

//   // Today's date string
//   const todayStr = new Date().toISOString().slice(0, 10);

//   // Due date filter logic
//   const filterByDueDate = (task) => {
//     if (!dueDateFilter || dueDateFilter === 'none') return true;
//     const due = task.dueDate ? new Date(task.dueDate) : null;
//     if (!due) return false;

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (dueDateFilter === 'today') {
//       return due.toDateString() === today.toDateString();
//     }
//     if (dueDateFilter === 'week') {
//       const weekStart = new Date(today);
//       weekStart.setDate(today.getDate() - today.getDay());
//       const weekEnd = new Date(weekStart);
//       weekEnd.setDate(weekStart.getDate() + 6);
//       return due >= weekStart && due <= weekEnd;
//     }
//     if (dueDateFilter === 'month') {
//       return due.getMonth() === today.getMonth() && due.getFullYear() === today.getFullYear();
//     }
//     if (dueDateFilter === 'year') {
//       return due.getFullYear() === today.getFullYear();
//     }
//     if (dueDateFilter === 'custom' && customDateRange?.start && customDateRange?.end) {
//       const start = new Date(customDateRange.start);
//       const end = new Date(customDateRange.end);
//       return due >= start && due <= end;
//     }
//     return true;
//   };

//   // Group tasks by employee, filtered by due date
//   const tasksByEmployee = useMemo(() => {
//     const map = {};
//     (tasks || []).forEach((task) => {
//       if (!Array.isArray(task.assignedTo)) return;
//       if (!filterByDueDate(task)) return;
//       task.assignedTo.forEach((emp) => {
//         const key = emp.email || emp.id || emp.name || "unknown";
//         if (!map[key]) map[key] = [];
//         map[key].push(task);
//       });
//     });
//     return map;
//   }, [tasks, dueDateFilter, customDateRange]);

//   // Count: Today's tasks only (Open, Progress, Done) + Total (filtered tasks)
//   const getTaskCounts = (emp) => {
//     const allTasks = tasksByEmployee[emp.email] || [];
//     const todayTasks = allTasks.filter(t => t.dueDate && t.dueDate.slice(0, 10) === todayStr);

//     const open = todayTasks.filter(t => ["Open", "Pending"].includes(t.status)).length;
//     const inProgress = todayTasks.filter(t => t.status === "In Progress").length;
//     const completed = todayTasks.filter(t => ["Complete", "Completed"].includes(t.status)).length;

//     return {
//       open,
//       inProgress,
//       completed,
//       total: allTasks.length // All filtered tasks
//     };
//   };

//   // Helper to display current filter
//   const getFilterLabel = () => {
//     if (!dueDateFilter || dueDateFilter === 'none') return "No Filter";
//     if (dueDateFilter === 'today') return "Today";
//     if (dueDateFilter === 'week') return "This Week";
//     if (dueDateFilter === 'month') return "This Month";
//     if (dueDateFilter === 'year') return "This Year";
//     if (dueDateFilter === 'custom') {
//       const format = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?';
//       return `${format(customDateRange?.start)} – ${format(customDateRange?.end)}`;
//     }
//     return "Filtered";
//   };

//   return (
//     <div className="w-full">
//       {/* Current Filter Display */}
//       <div className="flex justify-end mb-4">
//         <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
//           <Calendar className="w-3.5 h-3.5" />
//           <span>{getFilterLabel()}</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//         {(employees || []).map((emp) => {
//           const counts = getTaskCounts(emp);
//           const isExpanded = expandedEmployee === emp.email;
//           const employeeTasks = tasksByEmployee[emp.email] || [];

//           return (
//             <div
//               key={emp.email || emp.id || emp.name}
//               className={`
//                 group relative bg-white/70 backdrop-blur-md border border-gray-200/40
//                 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300
//                 cursor-pointer overflow-hidden
//                 ${isExpanded ? 'ring-2 ring-blue-400/20 shadow-xl' : ''}
//               `}
//               onClick={(e) => {
//                 if (e.target.closest('.task-item')) return;
//                 setExpandedEmployee(prev => prev === emp.email ? null : emp.email);
//               }}
//             >
//               {/* Subtle Gradient Background */}
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//               {/* Header */}
//               <div className="relative flex items-center space-x-4 z-10">
//                 {/* Avatar */}
//                 {emp.avatar ? (
//                   <div className="relative">
//                     <img
//                       src={emp.avatar}
//                       alt={emp.name}
//                       className="w-14 h-14 rounded-full object-cover ring-4 ring-white/80 shadow-md"
//                     />
//                     <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 opacity-20 blur-xl scale-110 -z-10" />
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600
//                                     flex items-center justify-center text-white font-bold text-lg shadow-lg">
//                       {emp.name ? emp.name.split(" ").map(n => n[0]).slice(0, 2).join("") : "UN"}
//                     </div>
//                     <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 opacity-30 blur-xl scale-110 -z-10" />
//                   </div>
//                 )}

//                 {/* Name & Role */}
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-semibold text-gray-800 text-sm truncate">
//                     {emp.name || emp.email}
//                   </h3>
//                   <p className="text-xs text-gray-500 mt-0.5 tracking-wide">
//                     {emp.position || "Team Member"}
//                   </p>
//                 </div>

//                 {/* Total Tasks Badge */}
//                 <div className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-700/10 to-slate-500/10
//                                 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2.5 min-w-[70px]
//                                 shadow-inner">
//                   <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
//                     Total Tasks
//                   </span>
//                   <span className="text-xl font-medium text-black mt-1">
//                     {counts.total}
//                   </span>
//                 </div>
//               </div>

//               {/* Today's Summary Pills */}
//               <div className="mt-5 flex gap-2.5">
//                 <div className="flex-1">
//                   <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700
//                                   px-3 py-2 rounded-xl text-xs font-medium text-center shadow-sm
//                                   border border-gray-200/50">
//                     <span className="block opacity-80 text-xs">Today's Open</span>
//                     <span className="text-lg font-bold">{counts.open}</span>
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <div className="bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700
//                                   px-3 py-2 rounded-xl text-xs font-medium text-center shadow-sm
//                                   border border-amber-200/50">
//                     <span className="block opacity-80 text-xs">In Progress</span>
//                     <span className="text-lg font-bold">{counts.inProgress}</span>
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <div className="bg-gradient-to-r from-emerald-50 to-green-50 text-green-700
//                                   px-3 py-2 rounded-xl text-xs font-medium text-center shadow-sm
//                                   border border-green-200/50">
//                     <span className="block opacity-80 text-xs">Done Today</span>
//                     <span className="text-lg font-bold">{counts.completed}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Expandable Task List */}
//               <div
//                 className={`mt-4 overflow-hidden transition-all duration-500 ease-in-out ${
//                   isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//                 }`}
//               >
//                 <div className="border-t border-gray-200/60 pt-4">
//                   <div className="max-h-80 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
//                     {employeeTasks.length > 0 ? (
//                       employeeTasks.map((t) => (
//                         <div
//                           key={t._id || t.taskId}
//                           className="task-item group/task p-3 rounded-xl bg-white/70 backdrop-blur-sm
//                                      border border-gray-200/40 hover:border-indigo-300
//                                      hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50
//                                      transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             onViewTask?.(t);
//                           }}
//                         >
//                           <div className="flex justify-between items-start">
//                             <div className="flex-1 min-w-0">
//                               <h4 className="font-medium text-sm text-gray-800 truncate pr-2">
//                                 {t.taskName}
//                               </h4>
//                               <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
//                                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                                   t.status === 'Complete' || t.status === 'Completed'
//                                     ? 'bg-green-100 text-green-700'
//                                     : t.status === 'In Progress'
//                                     ? 'bg-amber-100 text-amber-700'
//                                     : 'bg-gray-100 text-gray-700'
//                                 }`}>
//                                   {t.status}
//                                 </span>
//                                 {t.priority && (
//                                   <>
//                                     <span>•</span>
//                                     <span className={`font-medium ${
//                                       t.priority === 'High' ? 'text-red-600' :
//                                       t.priority === 'Medium' ? 'text-amber-600' :
//                                       'text-gray-600'
//                                     }`}>
//                                       {t.priority}
//                                     </span>
//                                   </>
//                                 )}
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-2 ml-3 text-xs text-gray-500">
//                               {t.dueDate && (
//                                 <div className="flex items-center gap-1 whitespace-nowrap">
//                                   <Calendar className="w-3 h-3" />
//                                   <span>{new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-center py-6 text-sm text-gray-400 italic bg-gray-50/50 rounded-xl">
//                         No tasks in this period
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Expand/Collapse Indicator */}
//               <div className="absolute bottom-3 right-3 text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity">
//                 {isExpanded ? (
//                   <ChevronUp className="w-5 h-5 text-indigo-500" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5" />
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Empty State */}
//       {(employees || []).length === 0 && !isLoading && (
//         <div className="col-span-full text-center py-16">
//           <div className="bg-gray-100 border-2 border-dashed rounded-2xl w-28 h-28 mx-auto mb-5 opacity-50" />
//           <p className="text-gray-500 font-medium text-lg">No employees found</p>
//           <p className="text-sm text-gray-400 mt-1">Start by adding team members</p>
//         </div>
//       )}

//       {/* Loading State */}
//       {isLoading && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="bg-white/70 backdrop-blur-md rounded-2xl p-5 animate-pulse">
//               <div className="flex items-center space-x-4">
//                 <div className="w-14 h-14 bg-gray-200 rounded-full" />
//                 <div className="flex-1">
//                   <div className="h-4 bg-gray-200 rounded w-32" />
//                   <div className="h-3 bg-gray-200 rounded w-20 mt-2" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Custom Scrollbar */}
//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(156, 163, 175, 0.3);
//           border-radius: 3px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(156, 163, 175, 0.5);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default EmployeeCardsView;




import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Calendar, Sparkles } from 'lucide-react';

const EmployeeCardsView = ({ 
  employees = [], 
  tasks = [], 
  onViewTask, 
  isLoading, 
  dueDateFilter = 'none', 
  setDueDateFilter, 
  customDateRange, 
  setCustomDateRange 
}) => {
  const [expandedEmployee, setExpandedEmployee] = useState(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  const filterByDueDate = (task) => {
    if (!dueDateFilter || dueDateFilter === 'none') return true;
    const due = task.dueDate ? new Date(task.dueDate) : null;
    if (!due) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDateFilter === 'today') return due.toDateString() === today.toDateString();
    if (dueDateFilter === 'week') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return due >= weekStart && due <= weekEnd;
    }
    if (dueDateFilter === 'month') return due.getMonth() === today.getMonth() && due.getFullYear() === today.getFullYear();
    if (dueDateFilter === 'year') return due.getFullYear() === today.getFullYear();
    if (dueDateFilter === 'custom' && customDateRange?.start && customDateRange?.end) {
      const start = new Date(customDateRange.start);
      const end = new Date(customDateRange.end);
      return due >= start && due <= end;
    }
    return true;
  };

  const tasksByEmployee = useMemo(() => {
    const map = {};
    (tasks || []).forEach((task) => {
      if (!Array.isArray(task.assignedTo)) return;
      if (!filterByDueDate(task)) return;
      task.assignedTo.forEach((emp) => {
        const key = emp.email || emp.id || emp.name || "unknown";
        if (!map[key]) map[key] = [];
        map[key].push(task);
      });
    });
    return map;
  }, [tasks, dueDateFilter, customDateRange]);

  const getTaskCounts = (emp) => {
    const allTasks = tasksByEmployee[emp.email] || [];
    const todayTasks = allTasks.filter(t => t.dueDate && t.dueDate.slice(0, 10) === todayStr);

    const open = todayTasks.filter(t => ["Open", "Pending"].includes(t.status)).length;
    const inProgress = todayTasks.filter(t => t.status === "In Progress").length;
    const completed = todayTasks.filter(t => ["Complete", "Completed"].includes(t.status)).length;

    return { open, inProgress, completed, total: allTasks.length };
  };

  const getFilterLabel = () => {
    if (!dueDateFilter || dueDateFilter === 'none') return "No Filter";
    if (dueDateFilter === 'today') return "Today";
    if (dueDateFilter === 'week') return "This Week";
    if (dueDateFilter === 'month') return "This Month";
    if (dueDateFilter === 'year') return "This Year";
    if (dueDateFilter === 'custom') {
      const format = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?';
      return `${format(customDateRange?.start)} – ${format(customDateRange?.end)}`;
    }
    return "Filtered";
  };

  return (
    <div className="w-full">
      {/* Filter Badge */}
      <div className="flex justify-end mb-5">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 
                        border border-blue-200/50 rounded-full text-xs font-semibold text-blue-700 
                        shadow-sm backdrop-blur-sm">
          <Calendar className="w-4 h-4" />
          <span>{getFilterLabel()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(employees || []).map((emp) => {
          const counts = getTaskCounts(emp);
          const isExpanded = expandedEmployee === emp.email;
          const employeeTasks = tasksByEmployee[emp.email] || [];

          return (
            <div
              key={emp.email || emp.id || emp.name}
              className={`
                group relative bg-white/80 backdrop-blur-xl border border-white/30 
                rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 
                cursor-pointer overflow-hidden transform hover:-translate-y-1
                ${isExpanded ? 'ring-2 ring-indigo-500/30 shadow-2xl scale-[1.02]' : ''}
              `}
              onClick={(e) => {
                if (e.target.closest('.task-item')) return;
                setExpandedEmployee(prev => prev === emp.email ? null : emp.email);
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
                {emp.avatar ? (
                  <div className="relative">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
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
                      {emp.name ? emp.name.split(" ").map(n => n[0]).slice(0, 2).join("") : "UN"}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 
                                    opacity-40 blur-xl scale-125 -z-10 animate-pulse" />
                  </div>
                )}

                {/* Name & Role */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base truncate">
                    {emp.name || emp.email}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium tracking-wide">
                    {emp.position || "Team Member"}
                  </p>
                </div>

                {/* Premium Total Tasks Badge */}
           <div className="relative flex flex-col items-center justify-center 
                bg-gradient-to-br from-slate-600 to-slate-800 
                text-white rounded-xl px-5 py-3 min-w-[80px] 
                shadow-xl border border-white/20 overflow-hidden">
  
  {/* Glass overlay — behind content */}
  {/* <div className="absolute inset-0 bg-white/5 backdrop-blur-sm pointer-events-none" /> */}
  
  {/* Content — above glass */}
  <div className="relative z-10 flex flex-col items-center">
    <Sparkles className="w-4 h-4 mb-1 text-yellow-400 animate-pulse" />
    <span className="text-xs font-semibold uppercase tracking-widest">
      Total
    </span>
    <span className="text-2xl font-bold mt-0.5">
      {counts.total}
    </span>
  </div>
</div>
              </div>

              {/* Today's Summary Pills */}
              <div className="mt-6 flex gap-3">
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 
                                  px-4 py-2.5 rounded-xl text-xs font-semibold text-center shadow-md 
                                  border border-gray-200/50 backdrop-blur-sm">
                    <span className="block opacity-80">Today's Open</span>
                    <span className="text-xl font-bold">{counts.open}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 
                                  px-4 py-2.5 rounded-xl text-xs font-semibold text-center shadow-md 
                                  border border-amber-200/50 backdrop-blur-sm">
                    <span className="block opacity-80">Today's Progress</span>
                    <span className="text-xl font-bold">{counts.inProgress}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 text-green-700 
                                  px-4 py-2.5 rounded-xl text-xs font-semibold text-center shadow-md 
                                  border border-green-200/50 backdrop-blur-sm">
                    <span className="block opacity-80">Topday's Done</span>
                    <span className="text-xl font-bold">{counts.completed}</span>
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
                      employeeTasks.map((t) => (
                        <div
                          key={t._id || t.taskId}
                          className="task-item group/task p-4 rounded-xl bg-white/70 backdrop-blur-md
                                     border border-white/40 hover:border-indigo-300
                                     hover:bg-gradient-to-r hover:from-indigo-50/70 hover:to-purple-50/70
                                     transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer
                                     transform hover:scale-[1.02]"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewTask?.(t);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {t.taskName}
                              </h4>
                              <div className="flex items-center gap-2 mt-1.5 text-xs">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  t.status === 'Complete' || t.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : t.status === 'In Progress'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {t.status}
                                </span>
                                {t.priority && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className={`font-bold ${
                                      t.priority === 'High' ? 'text-red-600' :
                                      t.priority === 'Medium' ? 'text-amber-600' :
                                      'text-gray-600'
                                    }`}>
                                      {t.priority}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-3 text-xs text-gray-600 font-medium">
                              {t.dueDate && (
                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-sm text-gray-500 italic bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-gray-300">
                        No tasks in this period
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
        })}
      </div>

      {/* Empty State */}
      {(employees || []).length === 0 && !isLoading && (
        <div className="col-span-full text-center py-20">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed rounded-3xl w-32 h-32 mx-auto mb-6 opacity-60" />
          <p className="text-gray-700 font-bold text-xl">No employees found</p>
          <p className="text-sm text-gray-500 mt-2">Add team members to get started</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
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

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
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

export default EmployeeCardsView;