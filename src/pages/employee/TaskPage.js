// import React, { useState, useEffect } from "react";
// import { Search, AlertCircle, Eye, Plus, CheckCircle, X, Send, Download, FileText } from "lucide-react";
// import Sidebar from "../../components/common/Sidebar";
// import Header from "../../components/common/Header";
// import { Link } from "react-router-dom";
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import * as XLSX from 'xlsx';

// const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

// const TaskPage = () => {
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [tasks, setTasks] = useState([]);
//   const [loggedInUser, setLoggedInUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [filterPriority, setFilterPriority] = useState("all");
//   const [filterTaskType, setFilterTaskType] = useState("all");
//   const [sortBy, setSortBy] = useState("dueDate");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     dueDate: "",
//     priority: "",
//     taskType: "General",
//     assignedTo: "",
//     attachments: [],
//   });
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [viewTask, setViewTask] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [activityLog, setActivityLog] = useState([]);
//   const [showFullLog, setShowFullLog] = useState(false);
//   const [newAttachment, setNewAttachment] = useState("");
//   const [confirmModal, setConfirmModal] = useState({ open: false, action: "", taskId: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showAllComments, setShowAllComments] = useState(false);

//   const toggleSidebar = () => setShowSidebar((prev) => !prev);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user) setLoggedInUser(user);
//     fetchTasks();
//   }, []);

//   useEffect(() => {
//     const storedTaskId = localStorage.getItem("lastViewedTaskId");
//     if (storedTaskId && tasks.length > 0 && !isViewModalOpen) {
//       const task = tasks.find((t) => t.taskId === storedTaskId);
//       if (task) {
//         setViewTask(task);
//         setIsViewModalOpen(true);
//         setComments(task.comments || []);
//         setActivityLog(task.activityLogs || []);
//       }
//     }
//   }, [tasks, isViewModalOpen]);

//   const fetchTasks = async () => {
//     setLoading(true);
//     setError("");
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("No token found");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/tasks/mine`, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch tasks");
//       setTasks(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error fetching tasks:", err.message);
//       setError(err.message || "Failed to fetch tasks");
//       setTimeout(() => setError(""), 2000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAttachmentAdd = () => {
//     if (newAttachment.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         attachments: [...(prev.attachments || []), newAttachment.trim()],
//       }));
//       setNewAttachment("");
//     }
//   };

//   const handleAttachmentRemove = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       attachments: prev.attachments.filter((_, i) => i !== index),
//     }));
//   };

//   const filteredTasks = tasks.filter((task) => {
//     const matchesSearch =
//       task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === "all" || task.status === filterStatus;
//     const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
//     const matchesTaskType = filterTaskType === "all" || task.taskType === filterTaskType;
//     return matchesSearch && matchesStatus && matchesPriority && matchesTaskType;
//   });

//   const sortedTasks = [...filteredTasks].sort((a, b) => {
//     switch (sortBy) {
//       case "dueDate":
//         return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
//       case "priority":
//         const priorityOrder = { High: 3, Medium: 2, Low: 1 };
//         return priorityOrder[b.priority] - priorityOrder[a.priority];
//       case "status":
//         return a.status.localeCompare(b.status);
//       case "title":
//         return a.taskName.localeCompare(b.taskName);
//       default:
//         return 0;
//     }
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Complete": return "bg-green-100 text-green-800";
//       case "Open": return "bg-blue-100 text-blue-800";
//       case "Hold": return "bg-yellow-100 text-yellow-800";
//       case "In Progress": return "bg-orange-100 text-orange-800";
//       case "Archive": return "bg-gray-100 text-gray-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "High": return "bg-red-100 text-red-800";
//       case "Medium": return "bg-yellow-100 text-yellow-800";
//       case "Low": return "bg-green-100 text-green-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(`${BASE_URL}/tasks`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify({
//           taskName: formData.title,
//           description: formData.description,
//           dueDate: formData.dueDate,
//           priority: formData.priority,
//           taskType: formData.taskType,
//           assignedTo: formData.assignedTo ? [formData.assignedTo] : [],
//           assignedBy: loggedInUser?.email || "admin@company.com",
//           fileUrls: formData.attachments || [],
//         }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to create task");
//       setTasks((prev) => [...prev, data.task]);
//       setIsModalOpen(false);
//       setFormData({ title: "", description: "", dueDate: "", priority: "", taskType: "General", assignedTo: "", attachments: [] });
//       setNewAttachment("");
//     } catch (err) {
//       console.error("Error creating task:", err.message);
//       setError(err.message || "Failed to create task");
//       setTimeout(() => setError(""), 2000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewTask = (task) => {
//     localStorage.setItem("lastViewedTaskId", task.taskId);
//     setViewTask(task);
//     setIsViewModalOpen(true);
//     setComments(task.comments || []);
//     setActivityLog(task.activityLogs || []);
//   };

//   const handleUpdateTaskStatus = async (taskId, status) => {
//     setLoading(true);
//     setError("");
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${BASE_URL}/tasks/${taskId}/status`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify({ status }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to update task status");
//       setTasks((prev) =>
//         prev.map((task) =>
//           task.taskId === taskId ? { ...task, status: data.task.status } : task
//         )
//       );
//       setViewTask((prev) => (prev && prev.taskId === taskId ? { ...prev, status: data.task.status } : prev));
//       setActivityLog((prev) => [
//         ...prev,
//         { message: `Task status changed to '${data.task.status}'`, timestamp: new Date().toISOString(), user: loggedInUser?.email || "Admin User" },
//       ]);
//     } catch (err) {
//       console.error("Error updating status:", err.message);
//       setError(err.message || "Failed to update task status");
//       setTimeout(() => setError(""), 2000);
//     } finally {
//       setLoading(false);
//       setConfirmModal({ open: false, action: "", taskId: "" });
//     }
//   };

//   const handleAddComment = async (e, commentText = null) => {
//     if (e) e.preventDefault();
//     const text = commentText || (e?.target?.comment?.value?.trim() || "");
//     if (!text) return;

//     setLoading(true);
//     const now = new Date();
//     const newComment = {
//       message: text,
//       user: "ayush.sain@sevenprocure.com",
//       userName: "Ayush Kumar Sain",
//       profileImage:
//         "https://res.cloudinary.com/dutbpnhha/image/upload/v1752042070/profile_images/pn237xkicwene7hhlc9y.jpg",
//       timestamp: now.toISOString(),
//     };

//     try {
//       const response = await fetch(
//         `${BASE_URL}/tasks/${viewTask.taskId}/comments`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify({ message: text }),
//         }
//       );
//       if (!response.ok) throw new Error("Failed to add comment");
//       const data = await response.json();
//       const updatedTask = data.task;
//       setTasks((prev) =>
//         prev.map((task) =>
//           task.taskId === viewTask.taskId
//             ? { ...task, comments: updatedTask.comments }
//             : task
//         )
//       );
//       setViewTask((prev) => ({
//         ...prev,
//         comments: updatedTask.comments,
//       }));
//       if (e) e.target.reset();
//     } catch (err) {
//       setError(err.message);
//       console.error("Error adding comment:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isOverdue = (dueDate, status) => {
//     if (status === "Complete") return false;
//     return new Date(dueDate).getTime() < new Date().getTime();
//   };

//   const exportToPDF = () => {
//     const input = document.getElementById('tasks-table');
//     html2canvas(input).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({
//         orientation: 'landscape',
//         unit: 'mm',
//         format: 'a4'
//       });
//       const width = pdf.internal.pageSize.getWidth();
//       const height = (canvas.height * width) / canvas.width;
//       pdf.addImage(imgData, 'PNG', 0, 0, width, height);
//       pdf.save(`Tasks_${new Date().toLocaleDateString()}.pdf`);
//     });
//   };

//   const exportToExcel = () => {
//     const dataToExport = sortedTasks.map(task => ({
//       "Task ID": task.taskId,
//       "Task Name": task.taskName,
//       "Description": task.description || "N/A",
//       "Status": task.status,
//       "Due Date": new Date(task.dueDate.split('/').reverse().join('-')).toLocaleDateString(),
//       "Assigned By": task.assignedBy || "N/A",
//       "Assigned To": task.assignedTo?.join(", ") || "Not assigned",
//       "Task Type": task.taskType,
//       "Priority": task.priority,
//       "Assigned DateTime": task.assignedDateTime || "N/A",
//       "Remark": task.remark || "N/A",
//       "File URLs": task.fileUrls?.join(", ") || "No attachments",
//       "Comments": task.comments?.map(c => c.message).join(", ") || "No comments",
//       "Activity Log": task.activityLogs?.map(l => l.message).join(", ") || "No activity",
//     ));

//     const ws = XLSX.utils.json_to_sheet(dataToExport);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Tasks");
//     XLSX.writeFile(wb, `Tasks_${new Date().toLocaleDateString()}.xlsx`);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <div className="sticky top-0 h-screen z-40">
//         <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
//       </div>
//       <div className="flex-1 flex flex-col">
//         <Header isLoggedIn={!!localStorage.getItem("token")} onToggleSidebar={toggleSidebar} />
//         <main className="flex-1 p-4 sm:p-6 overflow-auto">
//           {loading && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//           )}
//           {error && (
//             <div className="fixed top-4 right-4 bg-red-100 text-red-700 p-4 rounded-md shadow-md">
//               {error}
//             </div>
//           )}
//           <div className="max-w-full mx-auto">
//             <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
//               <div className="mb-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
//                   <h2 className="text-xl sm:text-2xl font-bold text-blue-600">My Tasks</h2>
//                   <div className="flex gap-2">
//                     <Link to="/employee/createtasks">
//                       <button
//                         onClick={() => {
//                           setIsModalOpen(true);
//                           setFormData({
//                             title: "",
//                             description: "",
//                             dueDate: "",
//                             priority: "",
//                             taskType: filterTaskType === "all" ? "General" : filterTaskType,
//                             assignedTo: "",
//                             attachments: [],
//                           });
//                         }}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
//                         disabled={loading}
//                       >
//                         <Plus className="w-4 h-4" />
//                         <span>Create Task</span>
//                       </button>
//                     </Link>
//                     <button
//                       onClick={exportToPDF}
//                       className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm sm:text-base"
//                       disabled={loading}
//                     >
//                       <FileText className="w-4 h-4" />
//                       <span>Export to PDF</span>
//                     </button>
//                     <button
//                       onClick={exportToExcel}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
//                       disabled={loading}
//                     >
//                       <Download className="w-4 h-4" />
//                       <span>Export to Excel</span>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-2 mb-4">
//                   <button
//                     onClick={() => setFilterTaskType("all")}
//                     className={`px-4 py-2 rounded-md text-sm font-medium ${
//                       filterTaskType === "all" ? "bg-gray-200 text-gray-800" : "text-gray-600 hover:bg-gray-100"
//                     }`}
//                     disabled={loading}
//                   >
//                     All
//                   </button>
//                   {["Auctions", "General", "Remainder"].map((type) => (
//                     <button
//                       key={type}
//                       onClick={() => setFilterTaskType(type)}
//                       className={`px-4 py-2 rounded-md text-sm font-medium ${
//                         filterTaskType === type
//                           ? type === "Auctions"
//                             ? "bg-purple-100 text-purple-800"
//                             : type === "General"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-orange-100 text-orange-800"
//                           : "text-gray-600 hover:bg-gray-100"
//                       }`}
//                       disabled={loading}
//                     >
//                       {type}
//                     </button>
//                   ))}
//                 </div>

//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 mb-4">
//                   <div className="flex-1 relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//                       placeholder="Search by name, type, or assigned to..."
//                       disabled={loading}
//                     />
//                   </div>
//                   <select
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//                     disabled={loading}
//                   >
//                     <option value="all">All Status</option>
//                     {["Open", "In Progress", "Complete", "Hold", "Archive"].map((opt) => (
//                       <option key={opt} value={opt}>{opt}</option>
//                     ))}
//                   </select>
//                   <select
//                     value={filterPriority}
//                     onChange={(e) => setFilterPriority(e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//                     disabled={loading}
//                   >
//                     <option value="all">All Priorities</option>
//                     {["High", "Medium", "Low"].map((p) => (
//                       <option key={p} value={p}>{p}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <span className="text-sm text-gray-600">Sort by:</span>
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//                     disabled={loading}
//                   >
//                     <option value="dueDate">Due Date</option>
//                     <option value="priority">Priority</option>
//                     <option value="status">Status</option>
//                     <option value="title">Task Name</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <div id="tasks-table">
//                   <table className="w-full min-w-[600px] text-sm">
//                     <thead className="bg-gray-50 sticky top-0 z-10">
//                       <tr className="border-b border-gray-200">
//                         <th className="text-left py-3 px-4 font-medium text-gray-700">Done</th>
//                         <th className="text-left py-3 px-4 font-medium text-gray-700">Task ID</th>
//                         <th className="text-left py-3 px-4 font-medium text-gray-700">Task Name</th>
//                         <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
//                         <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
//                         <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned By</th>
//                         <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned To</th>
//                         <th className="text-left py-3 px-4 font-medium text-gray-700">Task Type</th>
//                         <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
//                         <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {sortedTasks.map((task) => (
//                         <tr
//                           key={task.taskId}
//                           className={`border-b border-gray-100 hover:bg-gray-50 ${
//                     <tbody>
//                       {sortedTasks.map((task) => (
//                         <tr
//                           key={task.taskId}
//                           className={`border-b border-gray-100 hover:bg-gray-50 ${
//                             isOverdue(task.dueDate, task.status) ? "bg-red-50" : ""
//                           }`}
//                         >
//                           <td className="py-3 px-4">
//                             <input
//                               type="checkbox"
//                               checked={task.status === "Complete"}
//                               onChange={() => setConfirmModal({ open: true, action: "Complete", taskId: task.taskId })}
//                               className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                               disabled={loading}
//                             />
//                           </td>
//                           <td className="py-3 px-4 text-gray-900">{task.taskId}</td>
//                           <td className="py-3 px-4">
//                             <div className="font-medium text-gray-900">{task.taskName}</div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(task.status)}`}>
//                               {task.status}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 text-gray-600">
//                             {new Date(task.dueDate.split('/').reverse().join('-')).toLocaleDateString()}
//                             {isOverdue(task.dueDate, task.status) && <AlertCircle className="inline ml-2 text-red-600 w-4 h-4" />}
//                           </td>
//                           <td className="py-3 px-4 text-gray-600">{task.assignedBy}</td>
//                           <td className="py-3 px-4 text-gray-600">{task.assignedTo?.join(", ") || "Not assigned"}</td>
//                           <td className="py-3 px-4">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               task.taskType === "Auctions" ? "bg-purple-100 text-purple-800" : task.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
//                             }`}>
//                               {task.taskType}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
//                               {task.priority}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="flex items-center space-x-1">
//                               <button
//                                 onClick={() => handleViewTask(task)}
//                                 className="p-1 text-blue-600 hover:bg-blue-50 rounded"
//                                 title="View Details"
//                                 disabled={loading}
//                               >
//                                 <Eye className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <div className="lg:hidden grid gap-4 mt-4">
//                 {sortedTasks.length === 0 ? (
//                   <div className="text-center py-12 text-gray-500">
//                     <div className="mb-4">No tasks found matching your criteria</div>
//                     <div className="text-sm text-gray-400">Try adjusting your search or filters</div>
//                   </div>
//                 ) : (
//                   sortedTasks.map((task) => (
//                     <div
//                       key={task.taskId}
//                       className={`border rounded-lg p-4 shadow-md bg-white ${
//                         isOverdue(task.dueDate, task.status) ? "bg-red-50" : "hover:bg-gray-50"
//                       }`}
//                     >
//                       <div className="flex justify-between items-start">
//                         <div className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             checked={task.status === "Complete"}
//                             onChange={() => setConfirmModal({ open: true, action: "Complete", taskId: task.taskId })}
//                             className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                             disabled={loading}
//                           />
//                           <span className="font-medium text-sm">{task.taskName}</span>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleViewTask(task)}
//                             className="p-1 text-blue-600 hover:bg-blue-50 rounded"
//                             disabled={loading}
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                       <div className="mt-2 text-xs grid grid-cols-2 gap-2">
//                         <div><span className="font-semibold">Task ID:</span> {task.taskId}</div>
//                         <div><span className="font-semibold">Status:</span> <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>{task.status}</span></div>
//                         <div><span className="font-semibold">Due Date:</span> {new Date(task.dueDate.split('/').reverse().join('-')).toLocaleDateString()}{isOverdue(task.dueDate, task.status) && <AlertCircle className="inline ml-1 text-red-600 w-4 h-4" />}</div>
//                         <div><span className="font-semibold">Assigned By:</span> {task.assignedBy}</div>
//                         <div><span className="font-semibold">Assigned To:</span> {task.assignedTo?.join(", ") || "Not assigned"}</div>
//                         <div><span className="font-semibold">Task Type:</span> <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${task.taskType === "Auctions" ? "bg-purple-100 text-purple-800" : task.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>{task.taskType}</span></div>
//                         <div><span className="font-semibold">Priority:</span> <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span></div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>

//               {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                   <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
//                     <div className="flex items-center justify-between mb-6">
//                       <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
//                       <button
//                         onClick={() => { setIsModalOpen(false); setFormData({ title: "", description: "", dueDate: "", priority: "", taskType: "General", assignedTo: "", attachments: [] }); setNewAttachment(""); }}
//                         className="text-gray-500 hover:text-gray-700"
//                         disabled={loading}
//                       >
//                         <X className="w-5 h-5" />
//                       </button>
//                     </div>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
//                         <input
//                           type="text"
//                           name="title"
//                           value={formData.title}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           placeholder="Enter task title"
//                           disabled={loading}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                         <textarea
//                           name="description"
//                           value={formData.description}
//                           onChange={handleInputChange}
//                           rows={3}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           placeholder="Enter task description"
//                           disabled={loading}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To (Email)</label>
//                         <input
//                           type="email"
//                           name="assignedTo"
//                           value={formData.assignedTo}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           placeholder="Enter assignee email"
//                           disabled={loading}
//                         />
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">Task Type *</label>
//                           <select
//                             name="taskType"
//                             value={formData.taskType}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             disabled={loading}
//                           >
//                             <option value="General">General</option>
//                             <option value="Auctions">Auctions</option>
//                             <option value="Remainder">Remainder</option>
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
//                           <select
//                             name="priority"
//                             value={formData.priority}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             disabled={loading}
//                           >
//                             <option value="">Select Priority</option>
//                             <option value="High">High</option>
//                             <option value="Medium">Medium</option>
//                             <option value="Low">Low</option>
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
//                           <input
//                             type="date"
//                             name="dueDate"
//                             value={formData.dueDate}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             disabled={loading}
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
//                         <div className="flex space-x-2">
//                           <input
//                             type="text"
//                             value={newAttachment}
//                             onChange={(e) => setNewAttachment(e.target.value)}
//                             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter file name or URL"
//                             disabled={loading}
//                           />
//                           <button
//                             type="button"
//                             onClick={handleAttachmentAdd}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
//                             disabled={loading}
//                           >
//                             <Plus className="w-4 h-4" />
//                             <span>Add</span>
//                           </button>
//                         </div>
//                         {formData.attachments?.length > 0 && (
//                           <div className="mt-2 space-y-2">
//                             {formData.attachments.map((attachment, index) => (
//                               <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
//                                 <div className="flex items-center space-x-2">
//                                   <span className="text-sm">{attachment}</span>
//                                 </div>
//                                 <button
//                                   type="button"
//                                   onClick={() => handleAttachmentRemove(index)}
//                                   className="text-red-500 hover:text-red-700"
//                                   disabled={loading}
//                                 >
//                                   <X className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex justify-end space-x-4">
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setIsModalOpen(false);
//                             setFormData({ title: "", description: "", dueDate: "", priority: "", taskType: "General", assignedTo: "", attachments: [] });
//                             setNewAttachment("");
//                           }}
//                           className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                           disabled={loading}
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           type="submit"
//                           className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
//                           disabled={loading}
//                         >
//                           <Plus className="w-4 h-4" />
//                           <span>Create Task</span>
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               )}

//               {isViewModalOpen && viewTask && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                   <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="flex items-center space-x-2">
//                         <h2 className="text-xl font-semibold">{viewTask.taskName}</h2>
//                         {isOverdue(viewTask.dueDate, viewTask.status) && <AlertCircle className="text-red-500 w-5 h-5" />}
//                       </div>
//                       <button
//                         onClick={() => setIsViewModalOpen(false)}
//                         className="text-gray-500 hover:text-gray-700"
//                         disabled={loading}
//                       >
//                         <X className="w-6 h-6" />
//                       </button>
//                     </div>
//                     <div className="mb-4">
//                       <p className="text-sm text-gray-500 mb-1">Description</p>
//                       <p className="text-gray-800">{viewTask.description || "No description provided"}</p>
//                     </div>
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
//                       <div>
//                         <p className="text-sm text-gray-500">Task Type</p>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           viewTask.taskType === "Auctions" ? "bg-purple-100 text-purple-800" : viewTask.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
//                         }`}>{viewTask.taskType}</span>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Status</p>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewTask.status)}`}>{viewTask.status}</span>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Priority</p>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(viewTask.priority)}`}>{viewTask.priority}</span>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Due Date</p>
//                         <p>{new Date(viewTask.dueDate.split('/').reverse().join('-')).toLocaleDateString()}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Assigned To</p>
//                         <p className="text-gray-800">{viewTask.assignedTo?.join(", ") || "Not assigned"}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Assigned By</p>
//                         <p className="text-gray-800">{viewTask.assignedBy}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Task ID</p>
//                         <p className="text-gray-800">{viewTask.taskId}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Assigned Date</p>
//                         <p className="text-gray-800">{viewTask.assignedDateTime ? new Date(viewTask.assignedDateTime).toLocaleDateString() : "N/A"}</p>
//                       </div>
//                     </div>
//                     <div className="mb-4">
//                       <p className="text-sm text-gray-500 mb-1">Attachments</p>
//                       {viewTask.fileUrls?.length > 0 ? (
//                         <div className="space-y-2">
//                           {viewTask.fileUrls.map((attachment, index) => (
//                             <button
//                               key={index}
//                               onClick={() => window.open(attachment, "_blank")}
//                               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                               disabled={loading}
//                             >
//                               View Attachment {index + 1}
//                             </button>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-gray-800">No attachments</p>
//                       )}
//                     </div>
//                     <div className="mb-4">
//                       <p className="text-sm text-gray-500 mb-1">Update Status</p>
//                       <div className="flex gap-2 flex-wrap">
//                         {["Open", "In Progress", "Complete", "Hold", "Archive"].map((status) => (
//                           <button
//                             key={status}
//                             onClick={() => setConfirmModal({ open: true, action: status, taskId: viewTask.taskId })}
//                             className={`px-4 py-2 rounded-md text-sm font-medium ${
//                               viewTask.status === status ? getStatusColor(status) : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                             }`}
//                             disabled={loading}
//                           >
//                             {status}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="mb-4">
//                       <p className="text-sm text-gray-500 mb-2">Comments</p>
//                       <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
//                         <textarea
//                           name="comment"
//                           className="w-full p-2 border rounded bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           placeholder="Add a comment..."
//                           rows={2}
//                           onKeyDown={handleCommentKeyPress}
//                           disabled={loading}
//                         />
//                         <button
//                           type="submit"
//                           className="px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                           disabled={loading}
//                         >
//                           <Send className="w-5 h-5" />
//                         </button>
//                       </form>
//                       <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg shadow-sm">
//                         {comments.length > 0 ? (
//                           (showAllComments ? [...comments] : [...comments].slice(0, 3))
//                             .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
//                             .map((comment, index) => (
//                               <div
//                                 key={index}
//                                 className={`mb-3 pb-2 border-b border-gray-200 last:border-b-0 last:mb-0 ${
//                                   index === 0 ? "bg-yellow-100 p-2 rounded" : ""
//                                 }`}
//                               >
//                                 <div className="flex items-start gap-2">
//                                   <div>
//                                     <p className="text-gray-800 text-sm">{comment.message || "No message"}</p>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                       {comment.userName || comment.user || "Unknown User"} •{" "}
//                                       {new Date(comment.timestamp).toLocaleString()}
//                                     </p>
//                                     {comment.profileImage && (
//                                       <img
//                                         src={comment.profileImage}
//                                         alt="User profile"
//                                         className="w-8 h-8 rounded-full mt-1"
//                                       />
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             ))
//                         ) : (
//                           <p className="text-gray-400 text-sm">No comments yet.</p>
//                         )}
//                         {comments.length > 3 && (
//                           <button
//                             onClick={() => setShowAllComments(!showAllComments)}
//                             className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
//                             disabled={loading}
//                           >
//                             {showAllComments ? "Hide" : "Show More"}
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500 mb-1">Activity Log</p>
//                       <div className="space-y-2">
//                         {(showFullLog ? activityLog : activityLog.slice(0, 3)).map((log, index) => (
//                           <div key={index} className="bg-gray-50 p-3 rounded-md">
//                             <p className="text-sm text-gray-800">{log.message}</p>
//                             <p className="text-xs text-gray-500 mt-1">
//                               {log.user} - {new Date(log.timestamp).toLocaleString()}
//                             </p>
//                           </div>
//                         ))}
//                         {activityLog.length > 3 && (
//                           <button
//                             onClick={() => setShowFullLog(!showFullLog)}
//                             className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
//                             disabled={loading}
//                           >
//                             {showFullLog ? "Show Less" : "Show More"}
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {confirmModal.open && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                   <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
//                     <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Status Change</h2>
//                     <p className="text-gray-700 mb-6">
//                       Are you sure you want to change the task status to <span className="font-semibold">{confirmModal.action}</span>?
//                     </p>
//                     <div className="flex justify-end space-x-4">
//                       <button
//                         onClick={() => setConfirmModal({ open: false, action: "", taskId: "" })}
//                         className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                         disabled={loading}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={() => handleUpdateTaskStatus(confirmModal.taskId, confirmModal.action)}
//                         className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                         disabled={loading}
//                       >
//                         Confirm
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default TaskPage;


import React, { useState, useEffect } from "react";
import { Search, AlertCircle, Eye, Plus, CheckCircle, X, Send, Download, FileText } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

const TaskPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterTaskType, setFilterTaskType] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    taskType: "General",
    assignedTo: "",
    attachments: [],
  });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [showFullLog, setShowFullLog] = useState(false);
  const [newAttachment, setNewAttachment] = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, action: "", taskId: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setLoggedInUser(user);
    fetchTasks();
  }, []);

  useEffect(() => {
    const storedTaskId = localStorage.getItem("lastViewedTaskId");
    if (storedTaskId && tasks.length > 0 && !isViewModalOpen) {
      const task = tasks.find((t) => t.taskId === storedTaskId);
      if (task) {
        setViewTask(task);
        setIsViewModalOpen(true);
        setComments(task.comments || []);
        setActivityLog(task.activityLogs || []);
      }
    }
  }, [tasks, isViewModalOpen]);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/tasks/mine`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch tasks");
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
      setError(err.message || "Failed to fetch tasks");
      setTimeout(() => setError(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAttachmentAdd = () => {
    if (newAttachment.trim()) {
      if (!isValidUrl(newAttachment.trim())) {
        setError("Invalid URL for attachment");
        setTimeout(() => setError(""), 2000);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), newAttachment.trim()],
      }));
      setNewAttachment("");
    }
  };

  const handleAttachmentRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesTaskType = filterTaskType === "all" || task.taskType === filterTaskType;
    return matchesSearch && matchesStatus && matchesPriority && matchesTaskType;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "priority":
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "status":
        return a.status.localeCompare(b.status);
      case "title":
        return a.taskName.localeCompare(b.taskName);
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Complete": return "bg-green-100 text-green-800";
      case "Open": return "bg-blue-100 text-blue-800";
      case "Hold": return "bg-yellow-100 text-yellow-800";
      case "In Progress": return "bg-orange-100 text-orange-800";
      case "Archive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          taskName: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          priority: formData.priority,
          taskType: formData.taskType,
          assignedTo: formData.assignedTo ? [formData.assignedTo] : [],
          assignedBy: loggedInUser?.email || "admin@company.com",
          fileUrls: formData.attachments || [],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create task");
      setTasks((prev) => [...prev, data.task]);
      setIsModalOpen(false);
      setFormData({ title: "", description: "", dueDate: "", priority: "", taskType: "General", assignedTo: "", attachments: [] });
      setNewAttachment("");
    } catch (err) {
      console.error("Error creating task:", err.message);
      setError(err.message || "Failed to create task");
      setTimeout(() => setError(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTask = (task) => {
    localStorage.setItem("lastViewedTaskId", task.taskId);
    setViewTask(task);
    setIsViewModalOpen(true);
    setComments(task.comments || []);
    setActivityLog(task.activityLogs || []);
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/tasks/${taskId}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update task status");
      setTasks((prev) =>
        prev.map((task) =>
          task.taskId === taskId ? { ...task, status: data.task.status } : task
        )
      );
      setViewTask((prev) => (prev && prev.taskId === taskId ? { ...prev, status: data.task.status } : prev));
      setActivityLog((prev) => [
        ...prev,
        { message: `Task status changed to '${data.task.status}'`, timestamp: new Date().toISOString(), user: loggedInUser?.email || "Admin User" },
      ]);
    } catch (err) {
      console.error("Error updating status:", err.message);
      setError(err.message || "Failed to update task status");
      setTimeout(() => setError(""), 2000);
    } finally {
      setLoading(false);
      setConfirmModal({ open: false, action: "", taskId: "" });
    }
  };

  const handleCommentKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment(e);
    }
  };

  const handleAddComment = async (e, commentText = null) => {
    if (e) e.preventDefault();
    const text = commentText || (e?.target?.comment?.value?.trim() || "");
    if (!text) return;

    setLoading(true);
    const now = new Date();
    const newComment = {
      message: text,
      user: loggedInUser?.email || "ayush.sain@sevenprocure.com",
      userName: loggedInUser?.name || "Ayush Kumar Sain",
      profileImage: loggedInUser?.profileImage || "https://res.cloudinary.com/dutbpnhha/image/upload/v1752042070/profile_images/pn237xkicwene7hhlc9y.jpg",
      timestamp: now.toISOString(),
    };

    try {
      const response = await fetch(`${BASE_URL}/tasks/${viewTask.taskId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      const data = await response.json();
      const updatedTask = data.task;
      setTasks((prev) =>
        prev.map((task) =>
          task.taskId === viewTask.taskId
            ? { ...task, comments: updatedTask.comments }
            : task
        )
      );
      setViewTask((prev) => ({
        ...prev,
        comments: updatedTask.comments,
      }));
      if (e) e.target.reset();
    } catch (err) {
      setError(err.message);
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = (dueDate, status) => {
    if (status === "Complete") return false;
    try {
      return new Date(dueDate).getTime() < new Date().getTime();
    } catch {
      return false; // Handle invalid date gracefully
    }
  };

  const exportToPDF = () => {
    const input = document.getElementById("tasks-table");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`Tasks_${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}.pdf`);
    });
  };

  const exportToExcel = () => {
    const dataToExport = sortedTasks.map((task) => ({
      "Task ID": task.taskId,
      "Task Name": task.taskName,
      Description: task.description || "N/A",
      Status: task.status,
      "Due Date": task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A",
      "Assigned By": task.assignedBy || "N/A",
      "Assigned To": task.assignedTo?.join(", ") || "Not assigned",
      "Task Type": task.taskType,
      Priority: task.priority,
      "Assigned DateTime": task.assignedDateTime ? new Date(task.assignedDateTime).toLocaleDateString() : "N/A",
      Remark: task.remark || "N/A",
      "File URLs": task.fileUrls?.join(", ") || "No attachments",
      Comments: task.comments?.map((c) => c.message).join(", ") || "No comments",
      "Activity Log": task.activityLogs?.map((l) => l.message).join(", ") || "No activity",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    XLSX.writeFile(wb, `Tasks_${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}.xlsx`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="sticky top-0 h-screen z-40">
        <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={!!localStorage.getItem("token")} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}
          {error && (
            <div
              className="fixed top-4 right-4 bg-red-100 text-red-700 p-4 rounded-md shadow-md"
              role="alert"
            >
              {error}
            </div>
          )}
          <div className="max-w-full mx-auto">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-600">My Tasks</h2>
                  <div className="flex gap-2">
                    <Link to="/employee/createtasks">
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setFormData({
                            title: "",
                            description: "",
                            dueDate: "",
                            priority: "",
                            taskType: filterTaskType === "all" ? "General" : filterTaskType,
                            assignedTo: "",
                            attachments: [],
                          });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
                        disabled={loading}
                        aria-label="Create new task"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Task</span>
                      </button>
                    </Link>
                    <button
                      onClick={exportToPDF}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm sm:text-base"
                      disabled={loading}
                      aria-label="Export tasks to PDF"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Export to PDF</span>
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
                      disabled={loading}
                      aria-label="Export tasks to Excel"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export to Excel</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setFilterTaskType("all")}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      filterTaskType === "all" ? "bg-gray-200 text-gray-800" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    disabled={loading}
                    aria-label="Filter by all task types"
                  >
                    All
                  </button>
                  {["Auctions", "General", "Remainder"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterTaskType(type)}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        filterTaskType === type
                          ? type === "Auctions"
                            ? "bg-purple-100 text-purple-800"
                            : type === "General"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      disabled={loading}
                      aria-label={`Filter by ${type} tasks`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Search by name, type, or assigned to..."
                      disabled={loading}
                      aria-label="Search tasks"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    disabled={loading}
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    {["Open", "In Progress", "Complete", "Hold", "Archive"].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    disabled={loading}
                    aria-label="Filter by priority"
                  >
                    <option value="all">All Priorities</option>
                    {["High", "Medium", "Low"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    disabled={loading}
                    aria-label="Sort tasks"
                  >
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                    <option value="title">Task Name</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div id="tasks-table">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Done</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Task ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Task Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned By</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned To</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Task Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTasks.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center py-12 text-gray-500">
                            <div className="mb-4">No tasks found matching your criteria</div>
                            <div className="text-sm text-gray-400">Try adjusting your search or filters</div>
                          </td>
                        </tr>
                      ) : (
                        sortedTasks.map((task) => (
                          <tr
                            key={task.taskId}
                            className={`border-b border-gray-100 hover:bg-gray-50 ${
                              isOverdue(task.dueDate, task.status) ? "bg-red-50" : ""
                            }`}
                          >
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={task.status === "Complete"}
                                onChange={() =>
                                  setConfirmModal({ open: true, action: "Complete", taskId: task.taskId })
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                disabled={loading}
                                aria-label={`Mark task ${task.taskName} as complete`}
                              />
                            </td>
                            <td className="py-3 px-4 text-gray-900">{task.taskId}</td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{task.taskName}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(
                                  task.status
                                )}`}
                              >
                                {task.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                              {isOverdue(task.dueDate, task.status) && (
                                <AlertCircle className="inline ml-2 text-red-600 w-4 h-4" />
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-600">{task.assignedBy || "N/A"}</td>
                            <td className="py-3 px-4 text-gray-600">
                              {task.assignedTo?.join(", ") || "Not assigned"}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  task.taskType === "Auctions"
                                    ? "bg-purple-100 text-purple-800"
                                    : task.taskType === "General"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {task.taskType}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleViewTask(task)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="View Details"
                                  disabled={loading}
                                  aria-label={`View details for task ${task.taskName}`}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:hidden grid gap-4 mt-4">
                {sortedTasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="mb-4">No tasks found matching your criteria</div>
                    <div className="text-sm text-gray-400">Try adjusting your search or filters</div>
                  </div>
                ) : (
                  sortedTasks.map((task) => (
                    <div
                      key={task.taskId}
                      className={`border rounded-lg p-4 shadow-md bg-white ${
                        isOverdue(task.dueDate, task.status) ? "bg-red-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={task.status === "Complete"}
                            onChange={() =>
                              setConfirmModal({ open: true, action: "Complete", taskId: task.taskId })
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            disabled={loading}
                            aria-label={`Mark task ${task.taskName} as complete`}
                          />
                          <span className="font-medium text-sm">{task.taskName}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewTask(task)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            disabled={loading}
                            aria-label={`View details for task ${task.taskName}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-semibold">Task ID:</span> {task.taskId}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span>{" "}
                          <span
                            className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold">Due Date:</span>{" "}
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                          {isOverdue(task.dueDate, task.status) && (
                            <AlertCircle className="inline ml-1 text-red-600 w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Assigned By:</span> {task.assignedBy || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold">Assigned To:</span>{" "}
                          {task.assignedTo?.join(", ") || "Not assigned"}
                        </div>
                        <div>
                          <span className="font-semibold">Task Type:</span>{" "}
                          <span
                            className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                              task.taskType === "Auctions"
                                ? "bg-purple-100 text-purple-800"
                                : task.taskType === "General"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {task.taskType}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold">Priority:</span>{" "}
                          <span
                            className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setFormData({
                            title: "",
                            description: "",
                            dueDate: "",
                            priority: "",
                            taskType: "General",
                            assignedTo: "",
                            attachments: [],
                          });
                          setNewAttachment("");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={loading}
                        aria-label="Close create task modal"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Task Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter task title"
                          disabled={loading}
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter task description"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="assignedTo"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Assigned To (Email)
                        </label>
                        <input
                          type="email"
                          id="assignedTo"
                          name="assignedTo"
                          value={formData.assignedTo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter assignee email"
                          disabled={loading}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="taskType"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Task Type *
                          </label>
                          <select
                            id="taskType"
                            name="taskType"
                            value={formData.taskType}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                            aria-required="true"
                          >
                            <option value="General">General</option>
                            <option value="Auctions">Auctions</option>
                            <option value="Remainder">Remainder</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="priority"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Priority *
                          </label>
                          <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                            aria-required="true"
                          >
                            <option value="">Select Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="dueDate"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Due Date *
                          </label>
                          <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                            aria-required="true"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="attachment"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          File Attachments
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            id="attachment"
                            value={newAttachment}
                            onChange={(e) => setNewAttachment(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter file URL"
                            disabled={loading}
                            aria-label="Enter file attachment URL"
                          />
                          <button
                            type="button"
                            onClick={handleAttachmentAdd}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                            disabled={loading}
                            aria-label="Add attachment"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                          </button>
                        </div>
                        {formData.attachments?.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {formData.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm truncate">{attachment}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleAttachmentRemove(index)}
                                  className="text-red-500 hover:text-red-700"
                                  disabled={loading}
                                  aria-label={`Remove attachment ${attachment}`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            setFormData({
                              title: "",
                              description: "",
                              dueDate: "",
                              priority: "",
                              taskType: "General",
                              assignedTo: "",
                              attachments: [],
                            });
                            setNewAttachment("");
                          }}
                          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          disabled={loading}
                          aria-label="Cancel task creation"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                          disabled={loading}
                          aria-label="Create task"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create Task</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {isViewModalOpen && viewTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-semibold">{viewTask.taskName}</h2>
                        {isOverdue(viewTask.dueDate, viewTask.status) && (
                          <AlertCircle className="text-red-500 w-5 h-5" aria-label="Task overdue" />
                        )}
                      </div>
                      <button
                        onClick={() => setIsViewModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={loading}
                        aria-label="Close task details modal"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Description</p>
                      <p className="text-gray-800">{viewTask.description || "No description provided"}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Task Type</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            viewTask.taskType === "Auctions"
                              ? "bg-purple-100 text-purple-800"
                              : viewTask.taskType === "General"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {viewTask.taskType}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            viewTask.status
                          )}`}
                        >
                          {viewTask.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Priority</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            viewTask.priority
                          )}`}
                        >
                          {viewTask.priority}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p>{viewTask.dueDate ? new Date(viewTask.dueDate).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Assigned To</p>
                        <p className="text-gray-800">
                          {viewTask.assignedTo?.join(", ") || "Not assigned"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Assigned By</p>
                        <p className="text-gray-800">{viewTask.assignedBy || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Task ID</p>
                        <p className="text-gray-800">{viewTask.taskId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Assigned Date</p>
                        <p className="text-gray-800">
                          {viewTask.assignedDateTime
                            ? new Date(viewTask.assignedDateTime).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Attachments</p>
                      {viewTask.fileUrls?.length > 0 ? (
                        <div className="space-y-2">
                          {viewTask.fileUrls.map((attachment, index) => (
                            <button
                              key={index}
                              onClick={() => window.open(attachment, "_blank")}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              disabled={loading}
                              aria-label={`View attachment ${index + 1}`}
                            >
                              View Attachment {index + 1}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-800">No attachments</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Update Status</p>
                      <div className="flex gap-2 flex-wrap">
                        {["Open", "In Progress", "Complete", "Hold", "Archive"].map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              setConfirmModal({ open: true, action: status, taskId: viewTask.taskId })
                            }
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                              viewTask.status === status
                                ? getStatusColor(status)
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            disabled={loading}
                            aria-label={`Change status to ${status}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Comments</p>
                      <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
                        <textarea
                          name="comment"
                          className="w-full p-2 border rounded bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add a comment..."
                          rows={2}
                          onKeyDown={handleCommentKeyPress}
                          disabled={loading}
                          aria-label="Add a comment"
                        />
                        <button
                          type="submit"
                          className="px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          disabled={loading}
                          aria-label="Submit comment"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </form>
                      <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg shadow-sm">
                        {comments.length > 0 ? (
                          (showAllComments ? [...comments] : [...comments].slice(0, 3))
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                            .map((comment, index) => (
                              <div
                                key={index}
                                className={`mb-3 pb-2 border-b border-gray-200 last:border-b-0 last:mb-0 ${
                                  index === 0 ? "bg-yellow-100 p-2 rounded" : ""
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <div>
                                    <p className="text-gray-800 text-sm">{comment.message || "No message"}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {comment.userName || comment.user || "Unknown User"} •{" "}
                                      {new Date(comment.timestamp).toLocaleString()}
                                    </p>
                                    {comment.profileImage && (
                                      <img
                                        src={comment.profileImage}
                                        alt={`${comment.userName || comment.user}'s profile`}
                                        className="w-8 h-8 rounded-full mt-1"
                                        loading="lazy"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className="text-gray-400 text-sm">No comments yet.</p>
                        )}
                        {comments.length > 3 && (
                          <button
                            onClick={() => setShowAllComments(!showAllComments)}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                            disabled={loading}
                            aria-label={showAllComments ? "Hide comments" : "Show more comments"}
                          >
                            {showAllComments ? "Hide" : "Show More"}
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Activity Log</p>
                      <div className="space-y-2">
                        {(showFullLog ? activityLog : activityLog.slice(0, 3)).map((log, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-800">{log.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {log.user} - {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                        {activityLog.length > 3 && (
                          <button
                            onClick={() => setShowFullLog(!showFullLog)}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                            disabled={loading}
                            aria-label={showFullLog ? "Show less activity" : "Show more activity"}
                          >
                            {showFullLog ? "Show Less" : "Show More"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {confirmModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Status Change</h2>
                    <p className="text-gray-700 mb-6">
                      Are you sure you want to change the task status to{" "}
                      <span className="font-semibold">{confirmModal.action}</span>?
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setConfirmModal({ open: false, action: "", taskId: "" })}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                        aria-label="Cancel status change"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateTaskStatus(confirmModal.taskId, confirmModal.action)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        disabled={loading}
                        aria-label={`Confirm status change to ${confirmModal.action}`}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskPage;