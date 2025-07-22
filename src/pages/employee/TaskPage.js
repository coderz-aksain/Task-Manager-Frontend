// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Search,
// // //   AlertCircle,
// // //   Eye,
// // //   Plus,
// // //   CheckCircle,
// // //   X,
// // //   Send,
// // // } from "lucide-react";
// // // import Sidebar from "../../components/common/Sidebar";
// // // import Header from "../../components/common/Header";
// // // import { Link } from "react-router-dom";

// // // const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

// // // const TaskPage = () => {
// // //   const [showSidebar, setShowSidebar] = useState(false);
// // //   const [tasks, setTasks] = useState([]);
// // //   const [loggedInUser, setLoggedInUser] = useState(null);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [filterStatus, setFilterStatus] = useState("all");
// // //   const [filterPriority, setFilterPriority] = useState("all");
// // //   const [filterTaskType, setFilterTaskType] = useState("all");
// // //   const [sortBy, setSortBy] = useState("dueDate");
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [formData, setFormData] = useState({
// // //     title: "",
// // //     description: "",
// // //     dueDate: "",
// // //     priority: "",
// // //     taskType: "General",
// // //     assignedTo: "",
// // //   });
// // //   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
// // //   const [viewTask, setViewTask] = useState(null);
// // //   const [comments, setComments] = useState([]);
// // //   const [activityLog, setActivityLog] = useState([]);
// // //   const [showFullLog, setShowFullLog] = useState(false);
// // //   const [newAttachment, setNewAttachment] = useState("");
// // //   const [confirmModal, setConfirmModal] = useState({
// // //     open: false,
// // //     action: "",
// // //     taskId: "",
// // //   });
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [showAllComments, setShowAllComments] = useState(false);

// // //   const toggleSidebar = () => setShowSidebar((prev) => !prev);

// // //   useEffect(() => {
// // //     const user = JSON.parse(localStorage.getItem("user"));
// // //     if (user) {
// // //       setLoggedInUser(user);
// // //     }
// // //     fetchTasks();
// // //   }, []); // Empty dependency array to run only on mount

// // //   useEffect(() => {
// // //     // Auto-open modal after tasks are loaded and a stored task ID exists
// // //     const storedTaskId = localStorage.getItem("lastViewedTaskId");
// // //     if (storedTaskId && tasks.length > 0 && !isViewModalOpen) {
// // //       const task = tasks.find((t) => t.taskId === storedTaskId);
// // //       if (task) {
// // //         setViewTask(task);
// // //         setIsViewModalOpen(true);
// // //         setComments(task.comments || []);
// // //       }
// // //     }
// // //   }, [tasks, isViewModalOpen]); // Depend on tasks and isViewModalOpen to avoid infinite loops

// // //   const fetchTasks = async () => {
// // //     setLoading(true);
// // //     setError("");
// // //     const token = localStorage.getItem("token");
// // //     console.log("Fetched token:", token);

// // //     if (!token) {
// // //       setError("No token found");
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     try {
// // //       const response = await fetch(`${BASE_URL}/tasks/mine`, {
// // //         method: "GET",
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           "Content-Type": "application/json",
// // //         },
// // //       });

// // //       const data = await response.json();
// // //       console.log("API Response: /tasks/mine", data);

// // //       if (!response.ok) {
// // //         throw new Error(data.message || "Failed to fetch tasks");
// // //       }

// // //       setTasks(Array.isArray(data) ? data : []);
// // //     } catch (err) {
// // //       console.error("Error fetching tasks:", err.message);
// // //       setError(err.message || "Failed to fetch tasks");
// // //       setTimeout(() => setError(""), 2000);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleAttachmentAdd = () => {
// // //     if (newAttachment.trim()) {
// // //       setFormData((prev) => ({
// // //         ...prev,
// // //         attachments: [...(prev.attachments || []), newAttachment.trim()],
// // //       }));
// // //       setNewAttachment("");
// // //     }
// // //   };

// // //   const handleAttachmentRemove = (index) => {
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       attachments: prev.attachments.filter((_, i) => i !== index),
// // //     }));
// // //   };

// // //   const filteredTasks = tasks.filter((task) => {
// // //     const matchesSearch =
// // //       task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       task.description.toLowerCase().includes(searchTerm.toLowerCase());
// // //     const matchesStatus =
// // //       filterStatus === "all" || task.status === filterStatus;
// // //     const matchesPriority =
// // //       filterPriority === "all" || task.priority === filterPriority;
// // //     const matchesTaskType =
// // //       filterTaskType === "all" || task.taskType === filterTaskType;
// // //     return matchesSearch && matchesStatus && matchesPriority && matchesTaskType;
// // //   });

// // //   const sortedTasks = [...filteredTasks].sort((a, b) => {
// // //     switch (sortBy) {
// // //       case "dueDate":
// // //         return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
// // //       case "priority":
// // //         const priorityOrder = { High: 3, Medium: 2, Low: 1 };
// // //         return priorityOrder[b.priority] - priorityOrder[a.priority];
// // //       case "status":
// // //         return a.status.localeCompare(b.status);
// // //       case "title":
// // //         return a.taskName.localeCompare(b.taskName);
// // //       default:
// // //         return 0;
// // //     }
// // //   });

// // //   const getStatusColor = (status) => {
// // //     switch (status) {
// // //       case "Complete":
// // //         return "bg-green-100 text-green-800";
// // //       case "Open":
// // //         return "bg-blue-100 text-blue-800";
// // //       case "Hold":
// // //         return "bg-yellow-100 text-yellow-800";
// // //       case "In Progress":
// // //         return "bg-orange-100 text-orange-800";
// // //       case "Archive":
// // //         return "bg-gray-100 text-gray-800";
// // //       default:
// // //         return "bg-gray-100 text-gray-800";
// // //     }
// // //   };

// // //   const getPriorityColor = (priority) => {
// // //     switch (priority) {
// // //       case "High":
// // //         return "bg-red-100 text-red-800";
// // //       case "Medium":
// // //         return "bg-yellow-100 text-yellow-800";
// // //       case "Low":
// // //         return "bg-green-100 text-green-800";
// // //       default:
// // //         return "bg-gray-100 text-gray-800";
// // //     }
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError("");
// // //     const token = localStorage.getItem("token");

// // //     try {
// // //       const response = await fetch(`${BASE_URL}/tasks`, {
// // //         method: "POST",
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({
// // //           taskName: formData.title,
// // //           description: formData.description,
// // //           dueDate: formData.dueDate,
// // //           priority: formData.priority,
// // //           taskType: formData.taskType,
// // //           assignedTo: formData.assignedTo ? [formData.assignedTo] : [],
// // //           assignedBy: loggedInUser?.email || "admin@company.com",
// // //         }),
// // //       });

// // //       const data = await response.json();
// // //       console.log("API Response: /tasks", data);

// // //       if (!response.ok) {
// // //         throw new Error(data.message || "Failed to create task");
// // //       }

// // //       setTasks((prev) => [...prev, data.task]);
// // //       setIsModalOpen(false);
// // //       setFormData({
// // //         title: "",
// // //         description: "",
// // //         dueDate: "",
// // //         priority: "",
// // //         taskType: "General",
// // //         assignedTo: "",
// // //         attachments: [],
// // //       });
// // //       setNewAttachment("");
// // //     } catch (err) {
// // //       console.error("Error creating task:", err.message);
// // //       setError(err.message || "Failed to create task");
// // //       setTimeout(() => setError(""), 2000);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleViewTask = (task) => {
// // //     localStorage.setItem("lastViewedTaskId", task.taskId);
// // //     setViewTask(task);
// // //     setIsViewModalOpen(true);
// // //     setComments(task.comments || []);
// // //     setActivityLog(task.activityLogs || []);
// // //   };

// // //   const handleUpdateTaskStatus = (taskId, status) => {
// // //     setConfirmModal({ open: true, action: status, taskId });
// // //   };

// // //   const confirmStatusChange = async () => {
// // //     if (confirmModal.open) {
// // //       setLoading(true);
// // //       setError("");
// // //       try {
// // //         const token = localStorage.getItem("token");
// // //         const response = await fetch(`${BASE_URL}/tasks/${confirmModal.taskId}/status`, {
// // //           method: "PUT",
// // //           headers: {
// // //             Authorization: `Bearer ${token}`,
// // //             "Content-Type": "application/json",
// // //           },
// // //           body: JSON.stringify({ status: confirmModal.action }),
// // //         });
// // //         console.log("API URL is:", `${BASE_URL}/tasks/${confirmModal.taskId}/status`);
// // //         const data = await response.json();
// // //         console.log("API Response: /tasks/:id/status", data);

// // //         if (!response.ok) {
// // //           throw new Error(data.message || "Failed to update task status");
// // //         }

// // //         setTasks((prev) =>
// // //           prev.map((task) =>
// // //             task.taskId === confirmModal.taskId
// // //               ? { ...task, status: confirmModal.action }
// // //               : task
// // //           )
// // //         );
// // //         setActivityLog((prev) => [
// // //           ...prev,
// // //           {
// // //             message: `Task status changed to '${confirmModal.action}'`,
// // //             timestamp: new Date().toLocaleString(),
// // //             user: loggedInUser?.email || "Admin User",
// // //           },
// // //         ]);

// // //         // Reload the entire page and close the modal
// // //         setIsViewModalOpen(false);
// // //         window.location.reload();
// // //       } catch (err) {
// // //         console.error("Error updating status:", err.message);
// // //         setError(err.message || "Failed to update task status");
// // //         setTimeout(() => setError(""), 2000);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     }
// // //     setConfirmModal({ open: false, action: "", taskId: "" });
// // //   };

// // //   const cancelStatusChange = () => {
// // //     setConfirmModal({ open: false, action: "", taskId: "" });
// // //   };

// // //   const handleAddComment = async (commentText) => {
// // //     if (commentText.trim()) {
// // //       setLoading(true);
// // //       setError("");
// // //       try {
// // //         const token = localStorage.getItem("token");
// // //         const response = await fetch(`${BASE_URL}/tasks/${viewTask.taskId}/comments`, {
// // //           method: "POST",
// // //           headers: {
// // //             Authorization: `Bearer ${token}`,
// // //             "Content-Type": "application/json",
// // //           },
// // //           body: JSON.stringify({ message: commentText.trim() }),
// // //         });

// // //         const data = await response.json();
// // //         console.log("API Response: /tasks/:id/comments", data);

// // //         if (!response.ok) {
// // //           throw new Error(data.message || "Failed to add comment");
// // //         }

// // //         // Assuming the API returns the new comment
// // //         const newComment = {
// // //           message: commentText.trim(),
// // //           user: loggedInUser?.email || "Anonymous",
// // //           userName: loggedInUser?.name || "Anonymous User",
// // //           profileImage: loggedInUser?.profileImage || "", // Add profile image from loggedInUser
// // //           timestamp: new Date().toISOString(),
// // //           ...data, // Merge with API response fields like _id
// // //         };
// // //         setComments((prev) => [newComment, ...prev]); // Add new comment to the top

// // //         // Reload page and reopen modal
// // //         localStorage.setItem("lastViewedTaskId", viewTask.taskId);
// // //         window.location.reload();
// // //         setTimeout(() => {
// // //           const task = tasks.find((t) => t.taskId === viewTask.taskId);
// // //           if (task) {
// // //             setViewTask(task);
// // //             setIsViewModalOpen(true);
// // //             setComments(task.comments || []);
// // //           }
// // //         }, 100); // Small delay to ensure reload completes
// // //       } catch (err) {
// // //         console.error("Error adding comment:", err.message);
// // //         setError(err.message || "Failed to add comment");
// // //         setTimeout(() => setError(""), 2000);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     }
// // //   };

// // //   const handleCommentKeyPress = (e) => {
// // //     if (e.key === "Enter" && !e.shiftKey) {
// // //       e.preventDefault();
// // //       const commentText = e.target.value;
// // //       handleAddComment(commentText);
// // //       e.target.value = ""; // Clear the input after submission
// // //     }
// // //   };

// // //   const handleCommentSubmit = (e) => {
// // //     e.preventDefault();
// // //     const commentText = e.target.comment.value;
// // //     handleAddComment(commentText);
// // //     e.target.reset(); // Clear the form after submission
// // //   };

// // //   const isOverdue = (dueDate, status) => {
// // //     if (status === "Complete") return false;
// // //     return new Date(dueDate).getTime() < new Date().getTime();
// // //   };

// // //   return (
// // //     <div className="flex min-h-screen bg-gray-100">
// // //       <div className="sticky top-0 h-screen z-40">
// // //         <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
// // //       </div>
// // //       <div className="flex-1 flex flex-col">
// // //         <Header
// // //           isLoggedIn={!!localStorage.getItem("token")}
// // //           onToggleSidebar={toggleSidebar}
// // //         />
// // //         <main className="flex-1 p-4 sm:p-6 overflow-auto">
// // //           {loading && (
// // //             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // //               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// // //             </div>
// // //           )}
// // //           {error && (
// // //             <div className="fixed top-4 right-4 bg-red-100 text-red-700 p-4 rounded-md shadow-md">
// // //               {error}
// // //             </div>
// // //           )}
// // //           <div className="max-w-full mx-auto">
// // //             <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
// // //               <div className="mb-6">
// // //                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
// // //                   <h2 className="text-xl sm:text-2xl font-bold text-blue-600">
// // //                     My Tasks
// // //                   </h2>
// // //                   <Link to="/employee/createtasks">
// // //                     <button
// // //                       onClick={() => {
// // //                         setIsModalOpen(true);
// // //                         setFormData({
// // //                           title: "",
// // //                           description: "",
// // //                           dueDate: "",
// // //                           priority: "",
// // //                           taskType:
// // //                             filterTaskType === "all"
// // //                               ? "General"
// // //                               : filterTaskType,
// // //                           assignedTo: "",
// // //                           attachments: [],
// // //                         });
// // //                       }}
// // //                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
// // //                     >
// // //                       <Plus className="w-4 h-4" />
// // //                       <span>Create Task</span>
// // //                     </button>
// // //                   </Link>
// // //                 </div>

// // //                 <div className="flex flex-wrap gap-2 mb-4">
// // //                   <button
// // //                     onClick={() => setFilterTaskType("all")}
// // //                     className={`px-4 py-2 rounded-md text-sm font-medium ${
// // //                       filterTaskType === "all"
// // //                         ? "bg-gray-200 text-gray-800"
// // //                         : "text-gray-600 hover:bg-gray-100"
// // //                     }`}
// // //                   >
// // //                     All
// // //                   </button>
// // //                   {["Auctions", "General", "Remainder"].map((type) => (
// // //                     <button
// // //                       key={type}
// // //                       onClick={() => setFilterTaskType(type)}
// // //                       className={`px-4 py-2 rounded-md text-sm font-medium ${
// // //                         filterTaskType === type
// // //                           ? type === "Auctions"
// // //                             ? "bg-purple-100 text-purple-800"
// // //                             : type === "General"
// // //                             ? "bg-blue-100 text-blue-800"
// // //                             : "bg-orange-100 text-orange-800"
// // //                           : "text-gray-600 hover:bg-gray-100"
// // //                       }`}
// // //                     >
// // //                       {type}
// // //                     </button>
// // //                   ))}
// // //                 </div>

// // //                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 mb-4">
// // //                   <div className="flex-1 relative">
// // //                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// // //                     <input
// // //                       type="text"
// // //                       value={searchTerm}
// // //                       onChange={(e) => setSearchTerm(e.target.value)}
// // //                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
// // //                       placeholder="Search by name, type, or assigned to..."
// // //                     />
// // //                   </div>
// // //                   <select
// // //                     value={filterStatus}
// // //                     onChange={(e) => setFilterStatus(e.target.value)}
// // //                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
// // //                   >
// // //                     <option value="all">All Status</option>
// // //                     {["Open", "In Progress", "Complete", "Hold", "Archive"].map(
// // //                       (opt) => (
// // //                         <option key={opt} value={opt}>
// // //                           {opt}
// // //                         </option>
// // //                       )
// // //                     )}
// // //                   </select>
// // //                   <select
// // //                     value={filterPriority}
// // //                     onChange={(e) => setFilterPriority(e.target.value)}
// // //                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
// // //                   >
// // //                     <option value="all">All Priorities</option>
// // //                     {["High", "Medium", "Low"].map((p) => (
// // //                       <option key={p} value={p}>
// // //                         {p}
// // //                       </option>
// // //                     ))}
// // //                   </select>
// // //                 </div>

// // //                 <div className="flex items-center gap-4">
// // //                   <span className="text-sm text-gray-600">Sort by:</span>
// // //                   <select
// // //                     value={sortBy}
// // //                     onChange={(e) => setSortBy(e.target.value)}
// // //                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
// // //                   >
// // //                     <option value="dueDate">Due Date</option>
// // //                     <option value="priority">Priority</option>
// // //                     <option value="status">Status</option>
// // //                     <option value="title">Task Name</option>
// // //                   </select>
// // //                 </div>
// // //               </div>

// // //               <div className="hidden lg:block overflow-x-auto">
// // //                 <table className="w-full text-sm">
// // //                   <thead>
// // //                     <tr className="border-b border-gray-200">
// // //                       <th className="text-left py-3 px-4 font-medium text-gray-700">
// // //                         Done
// // //                       </th>
// // //                       <th className="text-left py-3 px-4 font-medium text-gray-700">
// // //                         Task ID
// // //                       </th>
// // //                       <th className="text-left py-3 px-4 font-medium text-gray-700">
// // //                         Task Name
// // //                       </th>
// // //                       <th className="text-left py-3 px-4 font-medium text-gray-700">
// // //                         Status
// // //                       </th>
// // //                       <th className="text-left py-3 px-4 font-medium text-gray-700">
// // //                         Due Date
// // //                       </th>
// // //                       <th className="text-left py-3 px-4 font-medium text-gray-700">
// // //                         Assigned By
// // //                       </th>
// // //                       <th className="text-left py-3 px-4 font-medium text-gray-700">
// // //                         Assigned To
// // //                       </th>
// // //                       <th className="text-left py-3 px-4 font-medium text-gray-700">
// // //                         Task Type
// // //                       </th>
// // //                       <th className="text-left py-3 px-4 font-medium text-gray-700">
// // //                         Priority
// // //                       </th>
// // //                       <th className="text-left py-3 px-4 font-medium text-gray-700">
// // //                         Actions
// // //                       </th>
// // //                     </tr>
// // //                   </thead>
// // //                   <tbody>
// // //                     {sortedTasks.map((task) => (
// // //                       <tr
// // //                         key={task.taskId}
// // //                         className={`border-b border-gray-100 hover:bg-gray-50 ${
// // //                           isOverdue(task.dueDate, task.status) ? "bg-red-50" : ""
// // //                         }`}
// // //                       >
// // //                         <td className="py-3 px-4">
// // //                           <input
// // //                             type="checkbox"
// // //                             checked={task.status === "Complete"}
// // //                             onChange={() =>
// // //                               handleUpdateTaskStatus(task.taskId, "Complete")
// // //                             }
// // //                             className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
// // //                           />
// // //                         </td>
// // //                         <td className="py-3 px-4 text-gray-900">{task.taskId}</td>
// // //                         <td className="py-3 px-4">
// // //                           <div className="font-medium text-gray-900">{task.taskName}</div>
// // //                         </td>
// // //                         <td className="py-3 px-4">
// // //                           <span
// // //                             className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(
// // //                               task.status
// // //                             )}`}
// // //                           >
// // //                             {task.status}
// // //                           </span>
// // //                         </td>
// // //                         <td className="py-3 px-4 text-gray-600">
// // //                           {new Date(task.dueDate.split('/').reverse().join('-')).toLocaleDateString()}
// // //                           {isOverdue(task.dueDate, task.status) && (
// // //                             <AlertCircle className="inline ml-2 text-red-600 w-4 h-4" />
// // //                           )}
// // //                         </td>
// // //                         <td className="py-3 px-4 text-gray-600">{task.assignedBy}</td>
// // //                         <td className="py-3 px-4 text-gray-600">{task.assignedTo?.join(", ") || "Not assigned"}</td>
// // //                         <td className="py-3 px-4">
// // //                           <span
// // //                             className={`px-2 py-1 rounded-full text-xs font-medium ${
// // //                               task.taskType === "Auction"
// // //                                 ? "bg-purple-100 text-purple-800"
// // //                                 : task.taskType === "General"
// // //                                 ? "bg-blue-100 text-blue-800"
// // //                                 : "bg-orange-100 text-orange-800"
// // //                             }`}
// // //                           >
// // //                             {task.taskType}
// // //                           </span>
// // //                         </td>
// // //                         <td className="py-3 px-4">
// // //                           <span
// // //                             className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
// // //                               task.priority
// // //                             )}`}
// // //                           >
// // //                             {task.priority}
// // //                           </span>
// // //                         </td>
// // //                         <td className="py-3 px-4">
// // //                           <div className="flex items-center space-x-1">
// // //                             <button
// // //                               onClick={() => handleViewTask(task)}
// // //                               className="p-1 text-blue-600 hover:bg-blue-50 rounded"
// // //                               title="View Details"
// // //                             >
// // //                               <Eye className="w-4 h-4" />
// // //                             </button>
// // //                           </div>
// // //                         </td>
// // //                       </tr>
// // //                     ))}
// // //                   </tbody>
// // //                 </table>
// // //               </div>

// // //               {/* Mobile View */}
// // //               <div className="lg:hidden grid gap-4">
// // //                 {sortedTasks.length === 0 ? (
// // //                   <div className="text-center py-12 text-gray-500">
// // //                     <div className="mb-4">
// // //                       No tasks found matching your criteria
// // //                     </div>
// // //                     <div className="text-sm text-gray-400">
// // //                       Try adjusting your search or filters
// // //                     </div>
// // //                   </div>
// // //                 ) : (
// // //                   sortedTasks.map((task) => (
// // //                     <div
// // //                       key={task.taskId}
// // //                       className={`border rounded-lg p-4 shadow-md bg-white ${
// // //                         isOverdue(task.dueDate, task.status)
// // //                           ? "bg-red-50"
// // //                           : "hover:bg-gray-50"
// // //                       }`}
// // //                     >
// // //                       <div className="flex justify-between items-start">
// // //                         <div className="flex items-center gap-2">
// // //                           <input
// // //                             type="checkbox"
// // //                             checked={task.status === "Complete"}
// // //                             onChange={() =>
// // //                               handleUpdateTaskStatus(task.taskId, "Complete")
// // //                             }
// // //                             className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
// // //                           />
// // //                           <span className="font-medium text-sm">
// // //                             {task.taskName}
// // //                           </span>
// // //                         </div>
// // //                         <div className="flex gap-2">
// // //                           <button
// // //                             onClick={() => handleViewTask(task)}
// // //                             className="p-1 text-blue-600 hover:bg-blue-50 rounded"
// // //                           >
// // //                             <Eye className="w-4 h-4" />
// // //                           </button>
// // //                         </div>
// // //                       </div>
// // //                       <div className="mt-2 text-xs grid grid-cols-2 gap-2">
// // //                         <div>
// // //                           <span className="font-semibold">Task ID:</span>{" "}
// // //                           {task.taskId}
// // //                         </div>
// // //                         <div>
// // //                           <span className="font-semibold">Status:</span>{" "}
// // //                           <span
// // //                             className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
// // //                               task.status
// // //                             )}`}
// // //                           >
// // //                             {task.status}
// // //                           </span>
// // //                         </div>
// // //                         <div>
// // //                           <span className="font-semibold">Due Date:</span>{" "}
// // //                           {new Date(task.dueDate.split('/').reverse().join('-')).toLocaleDateString()}
// // //                           {isOverdue(task.dueDate, task.status) && (
// // //                             <AlertCircle className="inline ml-1 text-red-600 w-4 h-4" />
// // //                           )}
// // //                         </div>
// // //                         <div>
// // //                           <span className="font-semibold">Assigned By:</span>{" "}
// // //                           {task.assignedBy}
// // //                         </div>
// // //                         <div>
// // //                           <span className="font-semibold">Assigned To:</span>{" "}
// // //                           {task.assignedTo?.join(", ") || "Not assigned"}
// // //                         </div>
// // //                         <div>
// // //                           <span className="font-semibold">Task Type:</span>{" "}
// // //                           <span
// // //                             className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
// // //                               task.taskType === "Auction"
// // //                                 ? "bg-purple-100 text-purple-800"
// // //                                 : task.taskType === "General"
// // //                                 ? "bg-blue-100 text-blue-800"
// // //                                 : "bg-orange-100 text-orange-800"
// // //                             }`}
// // //                           >
// // //                             {task.taskType}
// // //                           </span>
// // //                         </div>
// // //                         <div>
// // //                           <span className="font-semibold">Priority:</span>{" "}
// // //                           <span
// // //                             className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
// // //                               task.priority
// // //                             )}`}
// // //                           >
// // //                             {task.priority}
// // //                           </span>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   ))
// // //                 )}
// // //               </div>

// // //               {isModalOpen && (
// // //                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // //                   <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
// // //                     <div className="flex items-center justify-between mb-6">
// // //                       <h2 className="text-xl font-semibold text-gray-900">
// // //                         Create New Task
// // //                       </h2>
// // //                       <button
// // //                         onClick={() => {
// // //                           setIsModalOpen(false);
// // //                           setFormData({
// // //                             title: "",
// // //                             description: "",
// // //                             dueDate: "",
// // //                             priority: "",
// // //                             taskType: "General",
// // //                             assignedTo: "",
// // //                             attachments: [],
// // //                           });
// // //                           setNewAttachment("");
// // //                         }}
// // //                         className="text-gray-500 hover:text-gray-700"
// // //                       >
// // //                         <X className="w-5 h-5" />
// // //                       </button>
// // //                     </div>

// // //                     <form onSubmit={handleSubmit} className="space-y-6">
// // //                       <div>
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Task Title *
// // //                         </label>
// // //                         <input
// // //                           type="text"
// // //                           name="title"
// // //                           value={formData.title}
// // //                           onChange={handleInputChange}
// // //                           required
// // //                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                           placeholder="Enter task title"
// // //                         />
// // //                       </div>

// // //                       <div>
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Description
// // //                         </label>
// // //                         <textarea
// // //                           name="description"
// // //                           value={formData.description}
// // //                           onChange={handleInputChange}
// // //                           rows={3}
// // //                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                           placeholder="Enter task description"
// // //                         />
// // //                       </div>

// // //                       <div>
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           Assigned To (Email)
// // //                         </label>
// // //                         <input
// // //                           type="email"
// // //                           name="assignedTo"
// // //                           value={formData.assignedTo}
// // //                           onChange={handleInputChange}
// // //                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                           placeholder="Enter assignee email"
// // //                         />
// // //                       </div>

// // //                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                         <div>
// // //                           <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                             Task Type *
// // //                           </label>
// // //                           <select
// // //                             name="taskType"
// // //                             value={formData.taskType}
// // //                             onChange={handleInputChange}
// // //                             required
// // //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                           >
// // //                             <option value="General">General</option>
// // //                             <option value="Auction">Auction</option>
// // //                             <option value="Remainder">Remainder</option>
// // //                           </select>
// // //                         </div>

// // //                         <div>
// // //                           <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                             Priority *
// // //                           </label>
// // //                           <select
// // //                             name="priority"
// // //                             value={formData.priority}
// // //                             onChange={handleInputChange}
// // //                             required
// // //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                           >
// // //                             <option value="">Select Priority</option>
// // //                             <option value="High">High</option>
// // //                             <option value="Medium">Medium</option>
// // //                             <option value="Low">Low</option>
// // //                           </select>
// // //                         </div>

// // //                         <div>
// // //                           <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                             Due Date *
// // //                           </label>
// // //                           <input
// // //                             type="date"
// // //                             name="dueDate"
// // //                             value={formData.dueDate}
// // //                             onChange={handleInputChange}
// // //                             required
// // //                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                           />
// // //                         </div>
// // //                       </div>

// // //                       <div>
// // //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                           File Attachments
// // //                         </label>
// // //                         <div className="flex space-x-2">
// // //                           <input
// // //                             type="text"
// // //                             value={newAttachment}
// // //                             onChange={(e) => setNewAttachment(e.target.value)}
// // //                             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                             placeholder="Enter file name or URL"
// // //                           />
// // //                           <button
// // //                             type="button"
// // //                             onClick={handleAttachmentAdd}
// // //                             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
// // //                           >
// // //                             <Plus className="w-4 h-4" />
// // //                             <span>Add</span>
// // //                           </button>
// // //                         </div>

// // //                         {formData.attachments?.length > 0 && (
// // //                           <div className="mt-2 space-y-2">
// // //                             {formData.attachments.map((attachment, index) => (
// // //                               <div
// // //                                 key={index}
// // //                                 className="flex items-center justify-between bg-gray-50 p-2 rounded"
// // //                               >
// // //                                 <div className="flex items-center space-x-2">
// // //                                   <span className="text-sm">{attachment}</span>
// // //                                 </div>
// // //                                 <button
// // //                                   type="button"
// // //                                   onClick={() => handleAttachmentRemove(index)}
// // //                                   className="text-red-500 hover:text-red-700"
// // //                                 >
// // //                                   <X className="w-4 h-4" />
// // //                                 </button>
// // //                               </div>
// // //                             ))}
// // //                           </div>
// // //                         )}
// // //                       </div>

// // //                       <div className="flex justify-end space-x-4">
// // //                         <button
// // //                           type="button"
// // //                           onClick={() => {
// // //                             setIsModalOpen(false);
// // //                             setFormData({
// // //                               title: "",
// // //                               description: "",
// // //                               dueDate: "",
// // //                               priority: "",
// // //                               taskType: "General",
// // //                               assignedTo: "",
// // //                               attachments: [],
// // //                             });
// // //                             setNewAttachment("");
// // //                           }}
// // //                           className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
// // //                         >
// // //                           Cancel
// // //                         </button>
// // //                         <button
// // //                           type="submit"
// // //                           className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
// // //                         >
// // //                           <Plus className="w-4 h-4" />
// // //                           <span>Create Task</span>
// // //                         </button>
// // //                       </div>
// // //                     </form>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {isViewModalOpen && viewTask && (
// // //                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // //                   <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
// // //                     <div className="flex justify-between items-start mb-4">
// // //                       <div className="flex items-center space-x-2">
// // //                         <h2 className="text-xl font-semibold">
// // //                           {viewTask.taskName}
// // //                         </h2>
// // //                         {isOverdue(viewTask.dueDate, viewTask.status) && (
// // //                           <AlertCircle className="text-red-500 w-5 h-5" />
// // //                         )}
// // //                       </div>
// // //                       <button
// // //                         onClick={() => setIsViewModalOpen(false)}
// // //                         className="text-gray-500 hover:text-gray-700"
// // //                       >
// // //                         <X className="w-6 h-6" />
// // //                       </button>
// // //                     </div>

// // //                     <div className="mb-4">
// // //                       <p className="text-sm text-gray-500 mb-1">Description</p>
// // //                       <p className="text-gray-800">{viewTask.description || "No description provided"}</p>
// // //                     </div>

// // //                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
// // //                       <div>
// // //                         <p className="text-sm text-gray-500">Task Type</p>
// // //                         <span
// // //                           className={`px-2 py-1 rounded-full text-xs font-medium ${
// // //                             viewTask.taskType === "Auction"
// // //                               ? "bg-purple-100 text-purple-800"
// // //                               : viewTask.taskType === "General"
// // //                               ? "bg-blue-100 text-blue-800"
// // //                               : "bg-orange-100 text-orange-800"
// // //                           }`}
// // //                         >
// // //                           {viewTask.taskType}
// // //                         </span>
// // //                       </div>
// // //                       <div>
// // //                         <p className="text-sm text-gray-500">Status</p>
// // //                         <span
// // //                           className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
// // //                             viewTask.status
// // //                           )}`}
// // //                         >
// // //                           {viewTask.status}
// // //                         </span>
// // //                       </div>
// // //                       <div>
// // //                         <p className="text-sm text-gray-500">Priority</p>
// // //                         <span
// // //                           className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
// // //                             viewTask.priority
// // //                           )}`}
// // //                         >
// // //                           {viewTask.priority}
// // //                         </span>
// // //                       </div>
// // //                       <div>
// // //                         <p className="text-sm text-gray-500">Due Date</p>
// // //                         <p>{new Date(viewTask.dueDate.split('/').reverse().join('-')).toLocaleDateString()}</p>
// // //                       </div>
// // //                     </div>

// // //                     <div className="mb-4">
// // //                       <p className="text-sm text-gray-500 mb-1">Assigned To</p>
// // //                       <p className="text-gray-800">{viewTask.assignedTo?.join(", ") || "Not assigned"}</p>
// // //                     </div>

// // //                     <div className="mb-4">
// // //                       <p className="text-sm text-gray-500 mb-1">Attachments</p>
// // //                       {viewTask.fileUrls?.length > 0 ? (
// // //                         <div className="space-y-2">
// // //                           {viewTask.fileUrls.map((attachment, index) => (
// // //                             <button
// // //                               key={index}
// // //                               onClick={() => window.open(attachment, "_blank")}
// // //                               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // //                             >
// // //                               View Attachment {index + 1}
// // //                             </button>
// // //                           ))}
// // //                         </div>
// // //                       ) : (
// // //                         <p className="text-gray-800">No attachments</p>
// // //                       )}
// // //                     </div>

// // //                     <div className="mb-4">
// // //                       <p className="text-sm text-gray-500 mb-1">Update Status</p>
// // //                       <div className="flex gap-2 flex-wrap">
// // //                         {["Open", "In Progress", "Complete", "Hold", "Archive"].map(
// // //                           (status) => (
// // //                             <button
// // //                               key={status}
// // //                               onClick={() => handleUpdateTaskStatus(viewTask.taskId, status)}
// // //                               className={`px-4 py-2 rounded-md text-sm font-medium ${
// // //                                 viewTask.status === status
// // //                                   ? getStatusColor(status)
// // //                                   : "bg-gray-100 text-gray-600 hover:bg-gray-200"
// // //                               }`}
// // //                             >
// // //                               {status}
// // //                             </button>
// // //                           )
// // //                         )}
// // //                       </div>
// // //                     </div>

// // //                     <div className="mb-4">
// // //                       <p className="text-sm text-gray-500 mb-1">Comments</p>
// // //                       <form onSubmit={handleCommentSubmit} className="mb-4">
// // //                         <div className="flex space-x-2">
// // //                           <input
// // //                             type="text"
// // //                             name="comment"
// // //                             onKeyPress={handleCommentKeyPress}
// // //                             className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                             placeholder="Add a comment..."
// // //                             autoFocus
// // //                           />
// // //                           <button
// // //                             type="submit"
// // //                             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
// // //                           >
// // //                             <Send className="w-4 h-4" />
// // //                             <span>Comment</span>
// // //                           </button>
// // //                         </div>
// // //                       </form>
// // //                       {comments.length > 0 ? (
// // //                         <div className="space-y-2">
// // //                           {(showAllComments ? [...comments].reverse() : [...comments].slice(0, 3).reverse()).map((comment, index) => (
// // //                             <div
// // //                               key={index}
// // //                               className={`bg-gray-50 p-3 rounded-md flex flex-col ${
// // //                                 index === 0 ? "bg-yellow-100 border-2 border-yellow-400" : ""
// // //                               }`}
// // //                             >
// // //                               {comment.profileImage && (
// // //                                 <img
// // //                                   src={comment.profileImage}
// // //                                   alt={`${comment.userName || comment.user}'s profile`}
// // //                                   className="w-8 h-8 rounded-full mb-2"
// // //                                 />
// // //                               )}
// // //                               <p className="text-sm text-gray-800">{comment.message}</p>
// // //                               <p className="text-xs text-gray-500 mt-1 opacity-60">
// // //                                 {comment.userName || comment.user}
// // //                               </p>
// // //                               <p className="text-xs text-gray-400 mt-1">
// // //                                 {new Date(comment.timestamp).toLocaleString()}
// // //                               </p>
// // //                             </div>
// // //                           ))}
// // //                           {comments.length > 3 && (
// // //                             <button
// // //                               onClick={() => setShowAllComments(!showAllComments)}
// // //                               className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
// // //                             >
// // //                               {showAllComments ? "Hide" : "Show More"}
// // //                             </button>
// // //                           )}
// // //                         </div>
// // //                       ) : (
// // //                         <p className="text-gray-800">No comments yet</p>
// // //                       )}
// // //                     </div>

// // //                     <div>
// // //                       <p className="text-sm text-gray-500 mb-1">Activity Log</p>
// // //                       <div className="space-y-2">
// // //                         {(showFullLog ? activityLog : activityLog.slice(0, 3)).map(
// // //                           (log, index) => (
// // //                             <div
// // //                               key={index}
// // //                               className="bg-gray-50 p-3 rounded-md"
// // //                             >
// // //                               <p className="text-sm text-gray-800">{log.message}</p>
// // //                               <p className="text-xs text-gray-500 mt-1">
// // //                                 {log.user} - {new Date(log.timestamp).toLocaleString()}
// // //                               </p>
// // //                             </div>
// // //                           )
// // //                         )}
// // //                       </div>
// // //                       {activityLog.length > 3 && (
// // //                         <button
// // //                           onClick={() => setShowFullLog(!showFullLog)}
// // //                           className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
// // //                         >
// // //                           {showFullLog ? "Show Less" : "Show More"}
// // //                         </button>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {confirmModal.open && (
// // //                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // //                   <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
// // //                     <h2 className="text-xl font-semibold text-gray-900 mb-4">
// // //                       Confirm Status Change
// // //                     </h2>
// // //                     <p className="text-gray-700 mb-6">
// // //                       Are you sure you want to change the task status to{" "}
// // //                       <span className="font-semibold">{confirmModal.action}</span>?
// // //                     </p>
// // //                     <div className="flex justify-end space-x-4">
// // //                       <button
// // //                         onClick={cancelStatusChange}
// // //                         className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
// // //                       >
// // //                         Cancel
// // //                       </button>
// // //                       <button
// // //                         onClick={confirmStatusChange}
// // //                         className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // //                       >
// // //                         Confirm
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </main>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default TaskPage;



// // import React, { useState, useEffect } from "react";
// // import { Search, AlertCircle, Eye, Plus, CheckCircle, X, Send, Download, FileText } from "lucide-react";
// // import Sidebar from "../../components/common/Sidebar";
// // import Header from "../../components/common/Header";
// // import { Link } from "react-router-dom";
// // import jsPDF from 'jspdf';
// // import html2canvas from 'html2canvas';

// // const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

// // const TaskPage = () => {
// //   const [showSidebar, setShowSidebar] = useState(false);
// //   const [tasks, setTasks] = useState([]);
// //   const [loggedInUser, setLoggedInUser] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filterStatus, setFilterStatus] = useState("all");
// //   const [filterPriority, setFilterPriority] = useState("all");
// //   const [filterTaskType, setFilterTaskType] = useState("all");
// //   const [sortBy, setSortBy] = useState("dueDate");
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     dueDate: "",
// //     priority: "",
// //     taskType: "General",
// //     assignedTo: "",
// //   });
// //   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
// //   const [viewTask, setViewTask] = useState(null);
// //   const [comments, setComments] = useState([]);
// //   const [activityLog, setActivityLog] = useState([]);
// //   const [showFullLog, setShowFullLog] = useState(false);
// //   const [newAttachment, setNewAttachment] = useState("");
// //   const [confirmModal, setConfirmModal] = useState({ open: false, action: "", taskId: "" });
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [showAllComments, setShowAllComments] = useState(false);

// //   const toggleSidebar = () => setShowSidebar((prev) => !prev);

// //   useEffect(() => {
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     if (user) setLoggedInUser(user);
// //     fetchTasks();
// //   }, []);

// //   useEffect(() => {
// //     const storedTaskId = localStorage.getItem("lastViewedTaskId");
// //     if (storedTaskId && tasks.length > 0 && !isViewModalOpen) {
// //       const task = tasks.find((t) => t.taskId === storedTaskId);
// //       if (task) {
// //         setViewTask(task);
// //         setIsViewModalOpen(true);
// //         setComments(task.comments || []);
// //       }
// //     }
// //   }, [tasks, isViewModalOpen]);

// //   const fetchTasks = async () => {
// //     setLoading(true);
// //     setError("");
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       setError("No token found");
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       const response = await fetch(`${BASE_URL}/tasks/mine`, {
// //         method: "GET",
// //         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
// //       });
// //       const data = await response.json();
// //       if (!response.ok) throw new Error(data.message || "Failed to fetch tasks");
// //       setTasks(Array.isArray(data) ? data : []);
// //     } catch (err) {
// //       console.error("Error fetching tasks:", err.message);
// //       setError(err.message || "Failed to fetch tasks");
// //       setTimeout(() => setError(""), 2000);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleAttachmentAdd = () => {
// //     if (newAttachment.trim()) {
// //       setFormData((prev) => ({
// //         ...prev,
// //         attachments: [...(prev.attachments || []), newAttachment.trim()],
// //       }));
// //       setNewAttachment("");
// //     }
// //   };

// //   const handleAttachmentRemove = (index) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       attachments: prev.attachments.filter((_, i) => i !== index),
// //     }));
// //   };

// //   const filteredTasks = tasks.filter((task) => {
// //     const matchesSearch =
// //       task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       task.description.toLowerCase().includes(searchTerm.toLowerCase());
// //     const matchesStatus = filterStatus === "all" || task.status === filterStatus;
// //     const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
// //     const matchesTaskType = filterTaskType === "all" || task.taskType === filterTaskType;
// //     return matchesSearch && matchesStatus && matchesPriority && matchesTaskType;
// //   });

// //   const sortedTasks = [...filteredTasks].sort((a, b) => {
// //     switch (sortBy) {
// //       case "dueDate":
// //         return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
// //       case "priority":
// //         const priorityOrder = { High: 3, Medium: 2, Low: 1 };
// //         return priorityOrder[b.priority] - priorityOrder[a.priority];
// //       case "status":
// //         return a.status.localeCompare(b.status);
// //       case "title":
// //         return a.taskName.localeCompare(b.taskName);
// //       default:
// //         return 0;
// //     }
// //   });

// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case "Complete": return "bg-green-100 text-green-800";
// //       case "Open": return "bg-blue-100 text-blue-800";
// //       case "Hold": return "bg-yellow-100 text-yellow-800";
// //       case "In Progress": return "bg-orange-100 text-orange-800";
// //       case "Archive": return "bg-gray-100 text-gray-800";
// //       default: return "bg-gray-100 text-gray-800";
// //     }
// //   };

// //   const getPriorityColor = (priority) => {
// //     switch (priority) {
// //       case "High": return "bg-red-100 text-red-800";
// //       case "Medium": return "bg-yellow-100 text-yellow-800";
// //       case "Low": return "bg-green-100 text-green-800";
// //       default: return "bg-gray-100 text-gray-800";
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");
// //     const token = localStorage.getItem("token");
// //     try {
// //       const response = await fetch(`${BASE_URL}/tasks`, {
// //         method: "POST",
// //         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           taskName: formData.title,
// //           description: formData.description,
// //           dueDate: formData.dueDate,
// //           priority: formData.priority,
// //           taskType: formData.taskType,
// //           assignedTo: formData.assignedTo ? [formData.assignedTo] : [],
// //           assignedBy: loggedInUser?.email || "admin@company.com",
// //         }),
// //       });
// //       const data = await response.json();
// //       if (!response.ok) throw new Error(data.message || "Failed to create task");
// //       setTasks((prev) => [...prev, data.task]);
// //       setIsModalOpen(false);
// //       setFormData({ title: "", description: "", dueDate: "", priority: "", taskType: "General", assignedTo: "", attachments: [] });
// //       setNewAttachment("");
// //     } catch (err) {
// //       console.error("Error creating task:", err.message);
// //       setError(err.message || "Failed to create task");
// //       setTimeout(() => setError(""), 2000);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleViewTask = (task) => {
// //     localStorage.setItem("lastViewedTaskId", task.taskId);
// //     setViewTask(task);
// //     setIsViewModalOpen(true);
// //     setComments(task.comments || []);
// //     setActivityLog(task.activityLogs || []);
// //   };

// //   const handleUpdateTaskStatus = (taskId, status) => {
// //     setConfirmModal({ open: true, action: status, taskId });
// //   };

// //   const confirmStatusChange = async () => {
// //     if (confirmModal.open) {
// //       setLoading(true);
// //       setError("");
// //       try {
// //         const token = localStorage.getItem("token");
// //         const response = await fetch(`${BASE_URL}/tasks/${confirmModal.taskId}/status`, {
// //           method: "PUT",
// //           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
// //           body: JSON.stringify({ status: confirmModal.action }),
// //         });
// //         const data = await response.json();
// //         if (!response.ok) throw new Error(data.message || "Failed to update task status");
// //         setTasks((prev) =>
// //           prev.map((task) =>
// //             task.taskId === confirmModal.taskId ? { ...task, status: confirmModal.action } : task
// //           )
// //         );
// //         setActivityLog((prev) => [
// //           ...prev,
// //           { message: `Task status changed to '${confirmModal.action}'`, timestamp: new Date().toLocaleString(), user: loggedInUser?.email || "Admin User" },
// //         ]);
// //         setIsViewModalOpen(false);
// //         window.location.reload();
// //       } catch (err) {
// //         console.error("Error updating status:", err.message);
// //         setError(err.message || "Failed to update task status");
// //         setTimeout(() => setError(""), 2000);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     setConfirmModal({ open: false, action: "", taskId: "" });
// //   };

// //   const cancelStatusChange = () => setConfirmModal({ open: false, action: "", taskId: "" });

// //   const handleAddComment = async (commentText) => {
// //     if (commentText.trim()) {
// //       setLoading(true);
// //       setError("");
// //       try {
// //         const token = localStorage.getItem("token");
// //         const response = await fetch(`${BASE_URL}/tasks/${viewTask.taskId}/comments`, {
// //           method: "POST",
// //           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
// //           body: JSON.stringify({ message: commentText.trim() }),
// //         });
// //         const data = await response.json();
// //         if (!response.ok) throw new Error(data.message || "Failed to add comment");
// //         const newComment = { message: commentText.trim(), user: loggedInUser?.email || "Anonymous", userName: loggedInUser?.name || "Anonymous User", profileImage: loggedInUser?.profileImage || "", timestamp: new Date().toISOString(), ...data };
// //         setComments((prev) => [newComment, ...prev]);
// //         localStorage.setItem("lastViewedTaskId", viewTask.taskId);
// //         window.location.reload();
// //         setTimeout(() => {
// //           const task = tasks.find((t) => t.taskId === viewTask.taskId);
// //           if (task) { setViewTask(task); setIsViewModalOpen(true); setComments(task.comments || []); }
// //         }, 100);
// //       } catch (err) {
// //         console.error("Error adding comment:", err.message);
// //         setError(err.message || "Failed to add comment");
// //         setTimeout(() => setError(""), 2000);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //   };

// //   const handleCommentKeyPress = (e) => {
// //     if (e.key === "Enter" && !e.shiftKey) {
// //       e.preventDefault();
// //       handleAddComment(e.target.value);
// //       e.target.value = "";
// //     }
// //   };

// //   const handleCommentSubmit = (e) => {
// //     e.preventDefault();
// //     handleAddComment(e.target.comment.value);
// //     e.target.reset();
// //   };

// //   const isOverdue = (dueDate, status) => {
// //     if (status === "Complete") return false;
// //     return new Date(dueDate).getTime() < new Date().getTime();
// //   };

// //   const exportToPDF = () => {
// //     const input = document.getElementById('tasks-table');
// //     html2canvas(input).then((canvas) => {
// //       const imgData = canvas.toDataURL('image/png');
// //       const pdf = new jsPDF({
// //         orientation: 'landscape',
// //         unit: 'mm',
// //         format: 'a4'
// //       });
// //       const width = pdf.internal.pageSize.getWidth();
// //       const height = (canvas.height * width) / canvas.width;
// //       pdf.addImage(imgData, 'PNG', 0, 0, width, height);
// //       pdf.save(`Tasks_${new Date().toLocaleDateString()}.pdf`);
// //     });
// //   };

// //   return (
// //     <div className="flex flex-col min-h-screen bg-gray-100">
// //       <div className="sticky top-0 z-50 bg-white shadow-md">
// //         <Header isLoggedIn={!!localStorage.getItem("token")} onToggleSidebar={toggleSidebar} />
// //       </div>
// //       <div className="flex flex-1">
// //         <div className="sticky top-16 z-40 h-screen">
// //           <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
// //         </div>
// //         <main className="flex-1 p-4 sm:p-6 overflow-auto">
// //           {loading && (
// //             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// //             </div>
// //           )}
// //           {error && (
// //             <div className="fixed top-4 right-4 bg-red-100 text-red-700 p-4 rounded-md shadow-md">
// //               {error}
// //             </div>
// //           )}
// //           <div className="max-w-full mx-auto">
// //             <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
// //               <div className="mb-6">
// //                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
// //                   <h2 className="text-xl sm:text-2xl font-bold text-blue-600">My Tasks</h2>
// //                   <div className="flex gap-2">
// //                     <Link to="/employee/createtasks">
// //                       <button
// //                         onClick={() => {
// //                           setIsModalOpen(true);
// //                           setFormData({
// //                             title: "",
// //                             description: "",
// //                             dueDate: "",
// //                             priority: "",
// //                             taskType: filterTaskType === "all" ? "General" : filterTaskType,
// //                             assignedTo: "",
// //                             attachments: [],
// //                           });
// //                         }}
// //                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
// //                       >
// //                         <Plus className="w-4 h-4" />
// //                         <span>Create Task</span>
// //                       </button>
// //                     </Link>
// //                     <button
// //                       onClick={exportToPDF}
// //                       className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm sm:text-base"
// //                     >
// //                       <FileText className="w-4 h-4" />
// //                       <span>Export to PDF</span>
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <div className="flex flex-wrap gap-2 mb-4">
// //                   <button
// //                     onClick={() => setFilterTaskType("all")}
// //                     className={`px-4 py-2 rounded-md text-sm font-medium ${
// //                       filterTaskType === "all" ? "bg-gray-200 text-gray-800" : "text-gray-600 hover:bg-gray-100"
// //                     }`}
// //                   >
// //                     All
// //                   </button>
// //                   {["Auctions", "General", "Remainder"].map((type) => (
// //                     <button
// //                       key={type}
// //                       onClick={() => setFilterTaskType(type)}
// //                       className={`px-4 py-2 rounded-md text-sm font-medium ${
// //                         filterTaskType === type
// //                           ? type === "Auctions"
// //                             ? "bg-purple-100 text-purple-800"
// //                             : type === "General"
// //                             ? "bg-blue-100 text-blue-800"
// //                             : "bg-orange-100 text-orange-800"
// //                           : "text-gray-600 hover:bg-gray-100"
// //                       }`}
// //                     >
// //                       {type}
// //                     </button>
// //                   ))}
// //                 </div>

// //                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 mb-4">
// //                   <div className="flex-1 relative">
// //                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// //                     <input
// //                       type="text"
// //                       value={searchTerm}
// //                       onChange={(e) => setSearchTerm(e.target.value)}
// //                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
// //                       placeholder="Search by name, type, or assigned to..."
// //                     />
// //                   </div>
// //                   <select
// //                     value={filterStatus}
// //                     onChange={(e) => setFilterStatus(e.target.value)}
// //                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
// //                   >
// //                     <option value="all">All Status</option>
// //                     {["Open", "In Progress", "Complete", "Hold", "Archive"].map((opt) => (
// //                       <option key={opt} value={opt}>{opt}</option>
// //                     ))}
// //                   </select>
// //                   <select
// //                     value={filterPriority}
// //                     onChange={(e) => setFilterPriority(e.target.value)}
// //                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
// //                   >
// //                     <option value="all">All Priorities</option>
// //                     {["High", "Medium", "Low"].map((p) => (
// //                       <option key={p} value={p}>{p}</option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 <div className="flex items-center gap-4">
// //                   <span className="text-sm text-gray-600">Sort by:</span>
// //                   <select
// //                     value={sortBy}
// //                     onChange={(e) => setSortBy(e.target.value)}
// //                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
// //                   >
// //                     <option value="dueDate">Due Date</option>
// //                     <option value="priority">Priority</option>
// //                     <option value="status">Status</option>
// //                     <option value="title">Task Name</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               <div className="overflow-x-auto">
// //                 <div id="tasks-table">
// //                   <table className="w-full min-w-[600px] text-sm">
// //                     <thead className="bg-gray-50 sticky top-0 z-10">
// //                       <tr className="border-b border-gray-200">
// //                         <th className="text-left py-3 px-4 font-medium text-gray-700">Done</th>
// //                         <th className="text-left py-3 px-4 font-medium text-gray-700">Task ID</th>
// //                         <th className="text-left py-3 px-4 font-medium text-gray-700">Task Name</th>
// //                         <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
// //                         <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
// //                         <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned By</th>
// //                         <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned To</th>
// //                         <th className="text-left py-3 px-4 font-medium text-gray-700">Task Type</th>
// //                         <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
// //                         <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {sortedTasks.map((task) => (
// //                         <tr
// //                           key={task.taskId}
// //                           className={`border-b border-gray-100 hover:bg-gray-50 ${
// //                             isOverdue(task.dueDate, task.status) ? "bg-red-50" : ""
// //                           }`}
// //                         >
// //                           <td className="py-3 px-4">
// //                             <input
// //                               type="checkbox"
// //                               checked={task.status === "Complete"}
// //                               onChange={() => handleUpdateTaskStatus(task.taskId, "Complete")}
// //                               className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
// //                             />
// //                           </td>
// //                           <td className="py-3 px-4 text-gray-900">{task.taskId}</td>
// //                           <td className="py-3 px-4">
// //                             <div className="font-medium text-gray-900">{task.taskName}</div>
// //                           </td>
// //                           <td className="py-3 px-4">
// //                             <span className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(task.status)}`}>
// //                               {task.status}
// //                             </span>
// //                           </td>
// //                           <td className="py-3 px-4 text-gray-600">
// //                             {new Date(task.dueDate.split('/').reverse().join('-')).toLocaleDateString()}
// //                             {isOverdue(task.dueDate, task.status) && <AlertCircle className="inline ml-2 text-red-600 w-4 h-4" />}
// //                           </td>
// //                           <td className="py-3 px-4 text-gray-600">{task.assignedBy}</td>
// //                           <td className="py-3 px-4 text-gray-600">{task.assignedTo?.join(", ") || "Not assigned"}</td>
// //                           <td className="py-3 px-4">
// //                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
// //                               task.taskType === "Auction" ? "bg-purple-100 text-purple-800" : task.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
// //                             }`}>
// //                               {task.taskType}
// //                             </span>
// //                           </td>
// //                           <td className="py-3 px-4">
// //                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
// //                               {task.priority}
// //                             </span>
// //                           </td>
// //                           <td className="py-3 px-4">
// //                             <div className="flex items-center space-x-1">
// //                               <button
// //                                 onClick={() => handleViewTask(task)}
// //                                 className="p-1 text-blue-600 hover:bg-blue-50 rounded"
// //                                 title="View Details"
// //                               >
// //                                 <Eye className="w-4 h-4" />
// //                               </button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </div>

// //               <div className="lg:hidden grid gap-4 mt-4">
// //                 {sortedTasks.length === 0 ? (
// //                   <div className="text-center py-12 text-gray-500">
// //                     <div className="mb-4">No tasks found matching your criteria</div>
// //                     <div className="text-sm text-gray-400">Try adjusting your search or filters</div>
// //                   </div>
// //                 ) : (
// //                   sortedTasks.map((task) => (
// //                     <div
// //                       key={task.taskId}
// //                       className={`border rounded-lg p-4 shadow-md bg-white ${
// //                         isOverdue(task.dueDate, task.status) ? "bg-red-50" : "hover:bg-gray-50"
// //                       }`}
// //                     >
// //                       <div className="flex justify-between items-start">
// //                         <div className="flex items-center gap-2">
// //                           <input
// //                             type="checkbox"
// //                             checked={task.status === "Complete"}
// //                             onChange={() => handleUpdateTaskStatus(task.taskId, "Complete")}
// //                             className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
// //                           />
// //                           <span className="font-medium text-sm">{task.taskName}</span>
// //                         </div>
// //                         <div className="flex gap-2">
// //                           <button
// //                             onClick={() => handleViewTask(task)}
// //                             className="p-1 text-blue-600 hover:bg-blue-50 rounded"
// //                           >
// //                             <Eye className="w-4 h-4" />
// //                           </button>
// //                         </div>
// //                       </div>
// //                       <div className="mt-2 text-xs grid grid-cols-2 gap-2">
// //                         <div><span className="font-semibold">Task ID:</span> {task.taskId}</div>
// //                         <div><span className="font-semibold">Status:</span> <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>{task.status}</span></div>
// //                         <div><span className="font-semibold">Due Date:</span> {new Date(task.dueDate.split('/').reverse().join('-')).toLocaleDateString()}{isOverdue(task.dueDate, task.status) && <AlertCircle className="inline ml-1 text-red-600 w-4 h-4" />}</div>
// //                         <div><span className="font-semibold">Assigned By:</span> {task.assignedBy}</div>
// //                         <div><span className="font-semibold">Assigned To:</span> {task.assignedTo?.join(", ") || "Not assigned"}</div>
// //                         <div><span className="font-semibold">Task Type:</span> <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${task.taskType === "Auction" ? "bg-purple-100 text-purple-800" : task.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>{task.taskType}</span></div>
// //                         <div><span className="font-semibold">Priority:</span> <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span></div>
// //                       </div>
// //                     </div>
// //                   ))
// //                 )}
// //               </div>

// //               {isModalOpen && (
// //                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //                   <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
// //                     <div className="flex items-center justify-between mb-6">
// //                       <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
// //                       <button
// //                         onClick={() => { setIsModalOpen(false); setFormData({ title: "", description: "", dueDate: "", priority: "", taskType: "General", assignedTo: "", attachments: [] }); setNewAttachment(""); }}
// //                         className="text-gray-500 hover:text-gray-700"
// //                       >
// //                         <X className="w-5 h-5" />
// //                       </button>
// //                     </div>
// //                     <form onSubmit={handleSubmit} className="space-y-6">
// //                       <div><label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter task title" /></div>
// //                       <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter task description" /></div>
// //                       <div><label className="block text-sm font-medium text-gray-700 mb-2">Assigned To (Email)</label><input type="email" name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter assignee email" /></div>
// //                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Task Type *</label><select name="taskType" value={formData.taskType} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="General">General</option><option value="Auction">Auction</option><option value="Remainder">Remainder</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label><select name="priority" value={formData.priority} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="">Select Priority</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label><input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
// //                       <div><label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label><div className="flex space-x-2"><input type="text" value={newAttachment} onChange={(e) => setNewAttachment(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter file name or URL" /><button type="button" onClick={handleAttachmentAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Add</span></button></div>{formData.attachments?.length > 0 && <div className="mt-2 space-y-2">{formData.attachments.map((attachment, index) => (<div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded"><div className="flex items-center space-x-2"><span className="text-sm">{attachment}</span></div><button type="button" onClick={() => handleAttachmentRemove(index)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button></div>))}</div>}</div>
// //                       <div className="flex justify-end space-x-4"><button type="button" onClick={() => { setIsModalOpen(false); setFormData({ title: "", description: "", dueDate: "", priority: "", taskType: "General", assignedTo: "", attachments: [] }); setNewAttachment(""); }} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button><button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Create Task</span></button></div>
// //                     </form>
// //                   </div>
// //                 </div>
// //               )}

// //               {isViewModalOpen && viewTask && (
// //                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //                   <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
// //                     <div className="flex justify-between items-start mb-4">
// //                       <div className="flex items-center space-x-2">
// //                         <h2 className="text-xl font-semibold">{viewTask.taskName}</h2>
// //                         {isOverdue(viewTask.dueDate, viewTask.status) && <AlertCircle className="text-red-500 w-5 h-5" />}
// //                       </div>
// //                       <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
// //                     </div>
// //                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Description</p><p className="text-gray-800">{viewTask.description || "No description provided"}</p></div>
// //                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4"><div><p className="text-sm text-gray-500">Task Type</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${viewTask.taskType === "Auction" ? "bg-purple-100 text-purple-800" : viewTask.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>{viewTask.taskType}</span></div><div><p className="text-sm text-gray-500">Status</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewTask.status)}`}>{viewTask.status}</span></div><div><p className="text-sm text-gray-500">Priority</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(viewTask.priority)}`}>{viewTask.priority}</span></div><div><p className="text-sm text-gray-500">Due Date</p><p>{new Date(viewTask.dueDate.split('/').reverse().join('-')).toLocaleDateString()}</p></div></div>
// //                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Assigned To</p><p className="text-gray-800">{viewTask.assignedTo?.join(", ") || "Not assigned"}</p></div>
// //                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Attachments</p>{viewTask.fileUrls?.length > 0 ? <div className="space-y-2">{viewTask.fileUrls.map((attachment, index) => (<button key={index} onClick={() => window.open(attachment, "_blank")} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">View Attachment {index + 1}</button>))}</div> : <p className="text-gray-800">No attachments</p>}</div>
// //                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Update Status</p><div className="flex gap-2 flex-wrap">{["Open", "In Progress", "Complete", "Hold", "Archive"].map((status) => (<button key={status} onClick={() => handleUpdateTaskStatus(viewTask.taskId, status)} className={`px-4 py-2 rounded-md text-sm font-medium ${viewTask.status === status ? getStatusColor(status) : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{status}</button>))}</div></div>
// //                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Comments</p><form onSubmit={handleCommentSubmit} className="mb-4"><div className="flex space-x-2"><input type="text" name="comment" onKeyPress={handleCommentKeyPress} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a comment..." autoFocus /><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Send className="w-4 h-4" /><span>Comment</span></button></div></form>{comments.length > 0 ? <div className="space-y-2">{(showAllComments ? [...comments].reverse() : [...comments].slice(0, 3).reverse()).map((comment, index) => (<div key={index} className={`bg-gray-50 p-3 rounded-md flex flex-col ${index === 0 ? "bg-yellow-100 border-2 border-yellow-400" : ""}`}><p className="text-sm text-gray-800">{comment.message}</p><p className="text-xs text-gray-500 mt-1 opacity-60">{comment.userName || comment.user}</p><p className="text-xs text-gray-400 mt-1">{new Date(comment.timestamp).toLocaleString()}</p></div>))}{comments.length > 3 && <button onClick={() => setShowAllComments(!showAllComments)} className="mt-2 text-blue-600 hover:text-blue-800 text-sm">{showAllComments ? "Hide" : "Show More"}</button>}</div> : <p className="text-gray-800">No comments yet</p>}</div>
// //                     <div><p className="text-sm text-gray-500 mb-1">Activity Log</p><div className="space-y-2">{(showFullLog ? activityLog : activityLog.slice(0, 3)).map((log, index) => (<div key={index} className="bg-gray-50 p-3 rounded-md"><p className="text-sm text-gray-800">{log.message}</p><p className="text-xs text-gray-500 mt-1">{log.user} - {new Date(log.timestamp).toLocaleString()}</p></div>))}{activityLog.length > 3 && <button onClick={() => setShowFullLog(!showFullLog)} className="mt-2 text-blue-600 hover:text-blue-800 text-sm">{showFullLog ? "Show Less" : "Show More"}</button>}</div></div>
// //                   </div>
// //                 </div>
// //               )}

// //               {confirmModal.open && (
// //                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //                   <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
// //                     <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Status Change</h2>
// //                     <p className="text-gray-700 mb-6">Are you sure you want to change the task status to <span className="font-semibold">{confirmModal.action}</span>?</p>
// //                     <div className="flex justify-end space-x-4"><button onClick={cancelStatusChange} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button><button onClick={confirmStatusChange} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm</button></div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TaskPage;



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

//   const handleUpdateTaskStatus = (taskId, status) => {
//     setConfirmModal({ open: true, action: status, taskId });
//   };

//   const confirmStatusChange = async () => {
//     if (confirmModal.open) {
//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${BASE_URL}/tasks/${confirmModal.taskId}/status`, {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//           body: JSON.stringify({ status: confirmModal.action }),
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to update task status");
//         setTasks((prev) =>
//           prev.map((task) =>
//             task.taskId === confirmModal.taskId ? { ...task, status: confirmModal.action } : task
//           )
//         );
//         setActivityLog((prev) => [
//           ...prev,
//           { message: `Task status changed to '${confirmModal.action}'`, timestamp: new Date().toLocaleString(), user: loggedInUser?.email || "Admin User" },
//         ]);
//         setIsViewModalOpen(false);
//         window.location.reload();
//       } catch (err) {
//         console.error("Error updating status:", err.message);
//         setError(err.message || "Failed to update task status");
//         setTimeout(() => setError(""), 2000);
//       } finally {
//         setLoading(false);
//       }
//     }
//     setConfirmModal({ open: false, action: "", taskId: "" });
//   };

//   const cancelStatusChange = () => setConfirmModal({ open: false, action: "", taskId: "" });

//   const handleAddComment = async (commentText) => {
//     if (commentText.trim()) {
//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${BASE_URL}/tasks/${viewTask.taskId}/comments`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//           body: JSON.stringify({ message: commentText.trim() }),
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to add comment");
//         const newComment = { message: commentText.trim(), user: loggedInUser?.email || "Anonymous", userName: loggedInUser?.name || "Anonymous User", profileImage: loggedInUser?.profileImage || "", timestamp: new Date().toISOString(), ...data };
//         setComments((prev) => [newComment, ...prev]);
//         localStorage.setItem("lastViewedTaskId", viewTask.taskId);
//         window.location.reload();
//         setTimeout(() => {
//           const task = tasks.find((t) => t.taskId === viewTask.taskId);
//           if (task) { setViewTask(task); setIsViewModalOpen(true); setComments(task.comments || []); }
//         }, 100);
//       } catch (err) {
//         console.error("Error adding comment:", err.message);
//         setError(err.message || "Failed to add comment");
//         setTimeout(() => setError(""), 2000);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleCommentKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleAddComment(e.target.value);
//       e.target.value = "";
//     }
//   };

//   const handleCommentSubmit = (e) => {
//     e.preventDefault();
//     handleAddComment(e.target.comment.value);
//     e.target.reset();
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
//     }));

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
//       <div className="flex flex-1 flex-col">
//         <Header isLoggedIn={!!localStorage.getItem("token")} onToggleSidebar={toggleSidebar} />
//         </div>
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
//                       >
//                         <Plus className="w-4 h-4" />
//                         <span>Create Task</span>
//                       </button>
//                     </Link>
//                     <button
//                       onClick={exportToPDF}
//                       className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm sm:text-base"
//                     >
//                       <FileText className="w-4 h-4" />
//                       <span>Export to PDF</span>
//                     </button>
//                     <button
//                       onClick={exportToExcel}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
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
//                     />
//                   </div>
//                   <select
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
//                             isOverdue(task.dueDate, task.status) ? "bg-red-50" : ""
//                           }`}
//                         >
//                           <td className="py-3 px-4">
//                             <input
//                               type="checkbox"
//                               checked={task.status === "Complete"}
//                               onChange={() => handleUpdateTaskStatus(task.taskId, "Complete")}
//                               className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
//                               task.taskType === "Auction" ? "bg-purple-100 text-purple-800" : task.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
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
//                             onChange={() => handleUpdateTaskStatus(task.taskId, "Complete")}
//                             className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                           />
//                           <span className="font-medium text-sm">{task.taskName}</span>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleViewTask(task)}
//                             className="p-1 text-blue-600 hover:bg-blue-50 rounded"
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
//                         <div><span className="font-semibold">Task Type:</span> <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${task.taskType === "Auction" ? "bg-purple-100 text-purple-800" : task.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>{task.taskType}</span></div>
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
//                       >
//                         <X className="w-5 h-5" />
//                       </button>
//                     </div>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                       <div><label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter task title" /></div>
//                       <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter task description" /></div>
//                       <div><label className="block text-sm font-medium text-gray-700 mb-2">Assigned To (Email)</label><input type="email" name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter assignee email" /></div>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Task Type *</label><select name="taskType" value={formData.taskType} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="General">General</option><option value="Auction">Auction</option><option value="Remainder">Remainder</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label><select name="priority" value={formData.priority} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="">Select Priority</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label><input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
//                       <div><label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label><div className="flex space-x-2"><input type="text" value={newAttachment} onChange={(e) => setNewAttachment(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter file name or URL" /><button type="button" onClick={handleAttachmentAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Add</span></button></div>{formData.attachments?.length > 0 && <div className="mt-2 space-y-2">{formData.attachments.map((attachment, index) => (<div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded"><div className="flex items-center space-x-2"><span className="text-sm">{attachment}</span></div><button type="button" onClick={() => handleAttachmentRemove(index)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button></div>))}</div>}</div>
//                       <div className="flex justify-end space-x-4"><button type="button" onClick={() => { setIsModalOpen(false); setFormData({ title: "", description: "", dueDate: "", priority: "", taskType: "General", assignedTo: "", attachments: [] }); setNewAttachment(""); }} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button><button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Create Task</span></button></div>
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
//                       <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
//                     </div>
//                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Description</p><p className="text-gray-800">{viewTask.description || "No description provided"}</p></div>
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4"><div><p className="text-sm text-gray-500">Task Type</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${viewTask.taskType === "Auction" ? "bg-purple-100 text-purple-800" : viewTask.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>{viewTask.taskType}</span></div><div><p className="text-sm text-gray-500">Status</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewTask.status)}`}>{viewTask.status}</span></div><div><p className="text-sm text-gray-500">Priority</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(viewTask.priority)}`}>{viewTask.priority}</span></div><div><p className="text-sm text-gray-500">Due Date</p><p>{new Date(viewTask.dueDate.split('/').reverse().join('-')).toLocaleDateString()}</p></div></div>
//                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Assigned To</p><p className="text-gray-800">{viewTask.assignedTo?.join(", ") || "Not assigned"}</p></div>
//                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Attachments</p>{viewTask.fileUrls?.length > 0 ? <div className="space-y-2">{viewTask.fileUrls.map((attachment, index) => (<button key={index} onClick={() => window.open(attachment, "_blank")} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">View Attachment {index + 1}</button>))}</div> : <p className="text-gray-800">No attachments</p>}</div>
//                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Update Status</p><div className="flex gap-2 flex-wrap">{["Open", "In Progress", "Complete", "Hold", "Archive"].map((status) => (<button key={status} onClick={() => handleUpdateTaskStatus(viewTask.taskId, status)} className={`px-4 py-2 rounded-md text-sm font-medium ${viewTask.status === status ? getStatusColor(status) : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{status}</button>))}</div></div>
//                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Comments</p><form onSubmit={handleCommentSubmit} className="mb-4"><div className="flex space-x-2"><input type="text" name="comment" onKeyPress={handleCommentKeyPress} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a comment..." autoFocus /><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Send className="w-4 h-4" /><span>Comment</span></button></div></form>{comments.length > 0 ? <div className="space-y-2">{(showAllComments ? [...comments].reverse() : [...comments].slice(0, 3).reverse()).map((comment, index) => (<div key={index} className={`bg-gray-50 p-3 rounded-md flex flex-col ${index === 0 ? "bg-yellow-100 border-2 border-yellow-400" : ""}`}><p className="text-sm text-gray-800">{comment.message}</p><p className="text-xs text-gray-500 mt-1 opacity-60">{comment.userName || comment.user}</p><p className="text-xs text-gray-400 mt-1">{new Date(comment.timestamp).toLocaleString()}</p></div>))}{comments.length > 3 && <button onClick={() => setShowAllComments(!showAllComments)} className="mt-2 text-blue-600 hover:text-blue-800 text-sm">{showAllComments ? "Hide" : "Show More"}</button>}</div> : <p className="text-gray-800">No comments yet</p>}</div>
//                     <div><p className="text-sm text-gray-500 mb-1">Activity Log</p><div className="space-y-2">{(showFullLog ? activityLog : activityLog.slice(0, 3)).map((log, index) => (<div key={index} className="bg-gray-50 p-3 rounded-md"><p className="text-sm text-gray-800">{log.message}</p><p className="text-xs text-gray-500 mt-1">{log.user} - {new Date(log.timestamp).toLocaleString()}</p></div>))}{activityLog.length > 3 && <button onClick={() => setShowFullLog(!showFullLog)} className="mt-2 text-blue-600 hover:text-blue-800 text-sm">{showFullLog ? "Show Less" : "Show More"}</button>}</div></div>
//                   </div>
//                 </div>
//               )}

//               {confirmModal.open && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                   <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
//                     <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Status Change</h2>
//                     <p className="text-gray-700 mb-6">Are you sure you want to change the task status to <span className="font-semibold">{confirmModal.action}</span>?</p>
//                     <div className="flex justify-end space-x-4"><button onClick={cancelStatusChange} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button><button onClick={confirmStatusChange} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm</button></div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
    
//   );
// };

// export default TaskPage;


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

//   const handleUpdateTaskStatus = (taskId, status) => {
//     setConfirmModal({ open: true, action: status, taskId });
//   };

//   const confirmStatusChange = async () => {
//     if (confirmModal.open) {
//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${BASE_URL}/tasks/${confirmModal.taskId}/status`, {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//           body: JSON.stringify({ status: confirmModal.action }),
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to update task status");
//         setTasks((prev) =>
//           prev.map((task) =>
//             task.taskId === confirmModal.taskId ? { ...task, status: confirmModal.action } : task
//           )
//         );
//         setActivityLog((prev) => [
//           ...prev,
//           { message: `Task status changed to '${confirmModal.action}'`, timestamp: new Date().toLocaleString(), user: loggedInUser?.email || "Admin User" },
//         ]);
//         setIsViewModalOpen(false);
//         window.location.reload();
//       } catch (err) {
//         console.error("Error updating status:", err.message);
//         setError(err.message || "Failed to update task status");
//         setTimeout(() => setError(""), 2000);
//       } finally {
//         setLoading(false);
//       }
//     }
//     setConfirmModal({ open: false, action: "", taskId: "" });
//   };

//   const cancelStatusChange = () => setConfirmModal({ open: false, action: "", taskId: "" });

//   const handleAddComment = async (commentText) => {
//     if (commentText.trim()) {
//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${BASE_URL}/tasks/${viewTask.taskId}/comments`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//           body: JSON.stringify({ message: commentText.trim() }),
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to add comment");
//         const newComment = { message: commentText.trim(), user: loggedInUser?.email || "Anonymous", userName: loggedInUser?.name || "Anonymous User", profileImage: loggedInUser?.profileImage || "", timestamp: new Date().toISOString(), ...data };
//         setComments((prev) => [newComment, ...prev]);
//         localStorage.setItem("lastViewedTaskId", viewTask.taskId);
//         window.location.reload();
//         setTimeout(() => {
//           const task = tasks.find((t) => t.taskId === viewTask.taskId);
//           if (task) { setViewTask(task); setIsViewModalOpen(true); setComments(task.comments || []); }
//         }, 100);
//       } catch (err) {
//         console.error("Error adding comment:", err.message);
//         setError(err.message || "Failed to add comment");
//         setTimeout(() => setError(""), 2000);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleCommentKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleAddComment(e.target.value);
//       e.target.value = "";
//     }
//   };

//   const handleCommentSubmit = (e) => {
//     e.preventDefault();
//     handleAddComment(e.target.comment.value);
//     e.target.reset();
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
//     }));

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
//                       >
//                         <Plus className="w-4 h-4" />
//                         <span>Create Task</span>
//                       </button>
//                     </Link>
//                     <button
//                       onClick={exportToPDF}
//                       className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm sm:text-base"
//                     >
//                       <FileText className="w-4 h-4" />
//                       <span>Export to PDF</span>
//                     </button>
//                     <button
//                       onClick={exportToExcel}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
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
//                     />
//                   </div>
//                   <select
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
//                             isOverdue(task.dueDate, task.status) ? "bg-red-50" : ""
//                           }`}
//                         >
//                           <td className="py-3 px-4">
//                             <input
//                               type="checkbox"
//                               checked={task.status === "Complete"}
//                               onChange={() => handleUpdateTaskStatus(task.taskId, "Complete")}
//                               className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
//                               task.taskType === "Auction" ? "bg-purple-100 text-purple-800" : task.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
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
//                             onChange={() => handleUpdateTaskStatus(task.taskId, "Complete")}
//                             className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                           />
//                           <span className="font-medium text-sm">{task.taskName}</span>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleViewTask(task)}
//                             className="p-1 text-blue-600 hover:bg-blue-50 rounded"
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
//                         <div><span className="font-semibold">Task Type:</span> <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${task.taskType === "Auction" ? "bg-purple-100 text-purple-800" : task.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>{task.taskType}</span></div>
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
//                       >
//                         <X className="w-5 h-5" />
//                       </button>
//                     </div>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                       <div><label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter task title" /></div>
//                       <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter task description" /></div>
//                       <div><label className="block text-sm font-medium text-gray-700 mb-2">Assigned To (Email)</label><input type="email" name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter assignee email" /></div>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Task Type *</label><select name="taskType" value={formData.taskType} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="General">General</option><option value="Auction">Auction</option><option value="Remainder">Remainder</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label><select name="priority" value={formData.priority} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="">Select Priority</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label><input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
//                       <div><label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label><div className="flex space-x-2"><input type="text" value={newAttachment} onChange={(e) => setNewAttachment(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter file name or URL" /><button type="button" onClick={handleAttachmentAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Add</span></button></div>{formData.attachments?.length > 0 && <div className="mt-2 space-y-2">{formData.attachments.map((attachment, index) => (<div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded"><div className="flex items-center space-x-2"><span className="text-sm">{attachment}</span></div><button type="button" onClick={() => handleAttachmentRemove(index)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button></div>))}</div>}</div>
//                       <div className="flex justify-end space-x-4"><button type="button" onClick={() => { setIsModalOpen(false); setFormData({ title: "", description: "", dueDate: "", priority: "", taskType: "General", assignedTo: "", attachments: [] }); setNewAttachment(""); }} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button><button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Create Task</span></button></div>
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
//                       <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
//                     </div>
//                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Description</p><p className="text-gray-800">{viewTask.description || "No description provided"}</p></div>
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4"><div><p className="text-sm text-gray-500">Task Type</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${viewTask.taskType === "Auction" ? "bg-purple-100 text-purple-800" : viewTask.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>{viewTask.taskType}</span></div><div><p className="text-sm text-gray-500">Status</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewTask.status)}`}>{viewTask.status}</span></div><div><p className="text-sm text-gray-500">Priority</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(viewTask.priority)}`}>{viewTask.priority}</span></div><div><p className="text-sm text-gray-500">Due Date</p><p>{new Date(viewTask.dueDate.split('/').reverse().join('-')).toLocaleDateString()}</p></div></div>
//                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Assigned To</p><p className="text-gray-800">{viewTask.assignedTo?.join(", ") || "Not assigned"}</p></div>
//                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Attachments</p>{viewTask.fileUrls?.length > 0 ? <div className="space-y-2">{viewTask.fileUrls.map((attachment, index) => (<button key={index} onClick={() => window.open(attachment, "_blank")} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">View Attachment {index + 1}</button>))}</div> : <p className="text-gray-800">No attachments</p>}</div>
//                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Update Status</p><div className="flex gap-2 flex-wrap">{["Open", "In Progress", "Complete", "Hold", "Archive"].map((status) => (<button key={status} onClick={() => handleUpdateTaskStatus(viewTask.taskId, status)} className={`px-4 py-2 rounded-md text-sm font-medium ${viewTask.status === status ? getStatusColor(status) : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{status}</button>))}</div></div>
//                     <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Comments</p><form onSubmit={handleCommentSubmit} className="mb-4"><div className="flex space-x-2"><input type="text" name="comment" onKeyPress={handleCommentKeyPress} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a comment..." autoFocus /><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Send className="w-4 h-4" /><span>Comment</span></button></div></form>{comments.length > 0 ? <div className="space-y-2">{(showAllComments ? [...comments].reverse() : [...comments].slice(0, 3).reverse()).map((comment, index) => (<div key={index} className={`bg-gray-50 p-3 rounded-md flex flex-col ${index === 0 ? "bg-yellow-100 border-2 border-yellow-400" : ""}`}><p className="text-sm text-gray-800">{comment.message}</p><p className="text-xs text-gray-500 mt-1 opacity-60">{comment.userName || comment.user}</p><p className="text-xs text-gray-400 mt-1">{new Date(comment.timestamp).toLocaleString()}</p></div>))}{comments.length > 3 && <button onClick={() => setShowAllComments(!showAllComments)} className="mt-2 text-blue-600 hover:text-blue-800 text-sm">{showAllComments ? "Hide" : "Show More"}</button>}</div> : <p className="text-gray-800">No comments yet</p>}</div>
//                     <div><p className="text-sm text-gray-500 mb-1">Activity Log</p><div className="space-y-2">{(showFullLog ? activityLog : activityLog.slice(0, 3)).map((log, index) => (<div key={index} className="bg-gray-50 p-3 rounded-md"><p className="text-sm text-gray-800">{log.message}</p><p className="text-xs text-gray-500 mt-1">{log.user} - {new Date(log.timestamp).toLocaleString()}</p></div>))}{activityLog.length > 3 && <button onClick={() => setShowFullLog(!showFullLog)} className="mt-2 text-blue-600 hover:text-blue-800 text-sm">{showFullLog ? "Show Less" : "Show More"}</button>}</div></div>
//                   </div>
//                 </div>
//               )}

//               {confirmModal.open && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                   <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
//                     <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Status Change</h2>
//                     <p className="text-gray-700 mb-6">Are you sure you want to change the task status to <span className="font-semibold">{confirmModal.action}</span>?</p>
//                     <div className="flex justify-end space-x-4"><button onClick={cancelStatusChange} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button><button onClick={confirmStatusChange} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm</button></div>
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
import { Search, AlertCircle, Eye, Plus, CheckCircle, X, Send, Download, FileText, Edit } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

const initialForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "",
  taskType: "General",
  assignedTo: "",
  fileUrls: [],
  errors: {},
};

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
  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [showFullLog, setShowFullLog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
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
      const validTasks = Array.isArray(data)
        ? data.map((task) => ({
            ...task,
            fileUrls: task.fileUrls || [],
            assignedTo: Array.isArray(task.assignedTo) ? task.assignedTo : task.assignedTo ? [task.assignedTo] : [],
            comments: task.comments || [],
            activityLogs: task.activityLogs || [],
          }))
        : [];
      setTasks(validTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: "" },
    }));
  };

  const handleAttachmentAdd = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    setFormData((prev) => ({
      ...prev,
      fileUrls: [...prev.fileUrls, ...files.map((file) => file.name)],
      errors: { ...prev.errors, fileUrls: "" },
    }));
    e.target.value = null;
  };

  const handleAttachmentRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      fileUrls: prev.fileUrls.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Task title is required";
    if (!formData.assignedTo.trim()) errors.assignedTo = "Assignee email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.assignedTo)) errors.assignedTo = "Valid email is required";
    if (!formData.taskType) errors.taskType = "Task type is required";
    if (!formData.priority) errors.priority = "Priority is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormData((prev) => ({ ...prev, errors }));
      return;
    }

    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    formDataToSend.append("taskName", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("dueDate", formData.dueDate.split("-").reverse().join("/"));
    formDataToSend.append("priority", formData.priority);
    formDataToSend.append("taskType", formData.taskType);
    formDataToSend.append("assignedTo", JSON.stringify([formData.assignedTo]));
    formDataToSend.append("assignedBy", loggedInUser?.email || "admin@company.com");
    selectedFiles.forEach((file) => {
      if (file instanceof File) {
        formDataToSend.append("files", file);
      }
    });

    try {
      const url = editId ? `${BASE_URL}/tasks/${editId}` : `${BASE_URL}/tasks`;
      const method = editId ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || editId ? "Failed to update task" : "Failed to create task");

      if (editId) {
        setTasks((prev) =>
          prev.map((task) =>
            task.taskId === data.task.taskId
              ? { ...data.task, fileUrls: data.task.fileUrls || [], assignedTo: data.task.assignedTo || [] }
              : task
          )
        );
      } else {
        setTasks((prev) => [...prev, { ...data.task, fileUrls: data.task.fileUrls || [], assignedTo: data.task.assignedTo || [] }]);
      }
      setIsModalOpen(false);
      setFormData(initialForm);
      setEditId(null);
      setSelectedFiles([]);
    } catch (err) {
      console.error("Error submitting task:", err.message);
      setError(err.message || "Failed to submit task");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setFormData({
      title: task.taskName,
      description: task.description || "",
      dueDate: task.dueDate.split("/").reverse().join("-"),
      priority: task.priority,
      taskType: task.taskType,
      assignedTo: task.assignedTo?.[0] || "",
      fileUrls: task.fileUrls || [],
      errors: {},
    });
    setEditId(task.taskId);
    setSelectedFiles([]);
    setIsModalOpen(true);
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
          task.taskId === taskId
            ? { ...task, status, activityLogs: [...(task.activityLogs || []), { message: `Task status changed to '${status}'`, timestamp: new Date().toISOString(), user: loggedInUser?.email || "Admin User" }] }
            : task
        )
      );
      if (viewTask && viewTask.taskId === taskId) {
        setViewTask((prev) => ({ ...prev, status, activityLogs: [...(prev.activityLogs || []), { message: `Task status changed to '${status}'`, timestamp: new Date().toISOString(), user: loggedInUser?.email || "Admin User" }] }));
        setActivityLog((prev) => [...prev, { message: `Task status changed to '${status}'`, timestamp: new Date().toISOString(), user: loggedInUser?.email || "Admin User" }]);
      }
      setConfirmModal({ open: false, action: "", taskId: "" });
    } catch (err) {
      console.error("Error updating status:", err.message);
      setError(err.message || "Failed to update task status");
    } finally {
      setLoading(false);
    }
  };

  // const handleAddComment = async (commentText) => {
  //   if (!commentText.trim()) return;
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(`${BASE_URL}/tasks/${viewTask.taskId}/comments`, {
  //       method: "POST",
  //       headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  //       body: JSON.stringify({ message: commentText.trim() }),
  //     });
  //     const data = await response.json();
  //     if (!response.ok) throw new Error(data.message || "Failed to add comment");
  //     const newComment = {
  //       message: commentText.trim(),
  //       user: loggedInUser?.email || "Anonymous",
  //       userName: loggedInUser?.name || "Anonymous User",
  //       profileImage: loggedInUser?.profileImage || "",
  //       timestamp: new Date().toISOString(),
  //       ...data,
  //     };
  //     setComments((prev) => [newComment, ...prev]);
  //     setTasks((prev) =>
  //       prev.map((task) =>
  //         task.taskId === viewTask.taskId
  //           ? { ...task, comments: [newComment, ...(task.comments || [])] }
  //           : task
  //       )
  //     );
  //     setViewTask((prev) => ({ ...prev, comments: [newComment, ...(prev.comments || [])] }));
  //   } catch (err) {
  //     console.error("Error adding comment:", err.message);
  //     setError(err.message || "Failed to add comment");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAddComment = async (commentText) => {
  if (!commentText.trim()) return;
  setLoading(true);
  setError("");
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/tasks/${viewTask.taskId}/comments`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ message: commentText.trim() }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to add comment");

    // Temporarily update comments locally to avoid UI delay
    const newComment = {
      message: commentText.trim(),
      user: loggedInUser?.email || "Anonymous",
      userName: loggedInUser?.name || "Anonymous User",
      profileImage: loggedInUser?.profileImage || "",
      timestamp: new Date().toISOString(),
      ...data,
    };
    setComments((prev) => [newComment, ...prev]);

    // Refresh tasks from server
    await fetchTasks();

    // Update viewTask and comments with fresh server data
    const updatedTask = tasks.find((task) => task.taskId === viewTask.taskId);
    if (updatedTask) {
      setViewTask({
        ...updatedTask,
        fileUrls: updatedTask.fileUrls || [],
        assignedTo: updatedTask.assignedTo || [],
        comments: updatedTask.comments || [],
        activityLogs: updatedTask.activityLogs || [],
      });
      setComments(updatedTask.comments || []);
      setActivityLog(updatedTask.activityLogs || []);
    }
  } catch (err) {
    console.error("Error adding comment:", err.message);
    setError(err.message || "Failed to add comment");
  } finally {
    setLoading(false);
  }
};
  const handleCommentKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment(e.target.value);
      e.target.value = "";
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    handleAddComment(e.target.comment.value);
    e.target.reset();
  };

  const isOverdue = (dueDate, status) => {
    if (status === "Complete") return false;
    return new Date(dueDate.split("/").reverse().join("-")).getTime() < new Date().getTime();
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesTaskType = filterTaskType === "all" || task.taskType === filterTaskType;
    return matchesSearch && matchesStatus && matchesPriority && matchesTaskType;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate.split("/").reverse().join("-")).getTime() - new Date(b.dueDate.split("/").reverse().join("-")).getTime();
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

  const exportToPDF = () => {
    const input = document.getElementById('tasks-table');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`Tasks_${new Date().toLocaleDateString()}.pdf`);
    });
  };

  const exportToExcel = () => {
    const dataToExport = sortedTasks.map(task => ({
      "Task ID": task.taskId,
      "Task Name": task.taskName,
      "Description": task.description || "N/A",
      "Status": task.status,
      "Due Date": new Date(task.dueDate.split('/').reverse().join('-')).toLocaleDateString(),
      "Assigned By": task.assignedBy || "N/A",
      "Assigned To": task.assignedTo?.join(", ") || "Not assigned",
      "Task Type": task.taskType,
      "Priority": task.priority,
      "Assigned DateTime": task.assignedDateTime || "N/A",
      "Remark": task.remark || "N/A",
      "File URLs": task.fileUrls?.join(", ") || "No attachments",
      "Comments": task.comments?.map(c => c.message).join(", ") || "No comments",
      "Activity Log": task.activityLogs?.map(l => l.message).join(", ") || "No activity",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    XLSX.writeFile(wb, `Tasks_${new Date().toLocaleDateString()}.xlsx`);
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
            <div className="fixed top-4 right-4 bg-red-100 text-red-700 p-4 rounded-md shadow-md">
              {error}
              <button onClick={() => setError("")} className="ml-4 text-red-900">Dismiss</button>
            </div>
          )}
          <div className="max-w-full mx-auto">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-600">My Tasks</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setFormData(initialForm);
                        setEditId(null);
                        setSelectedFiles([]);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Task</span>
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm sm:text-base"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Export to PDF</span>
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base"
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
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
                      {sortedTasks.map((task) => (
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
                              onChange={() => setConfirmModal({ open: true, action: "Complete", taskId: task.taskId })}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-3 px-4 text-gray-900">{task.taskId}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{task.taskName}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(task.dueDate.split('/').reverse().join('-')).toLocaleDateString()}
                            {isOverdue(task.dueDate, task.status) && <AlertCircle className="inline ml-2 text-red-600 w-4 h-4" />}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{task.assignedBy}</td>
                          <td className="py-3 px-4 text-gray-600">{task.assignedTo?.join(", ") || "Not assigned"}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.taskType === "Auction" ? "bg-purple-100 text-purple-800" : task.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                            }`}>
                              {task.taskType}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleViewTask(task)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {task.assignedTo.includes(loggedInUser?.email) && (
                                <button
                                  onClick={() => handleEditTask(task)}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="Edit Task"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
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
                            onChange={() => setConfirmModal({ open: true, action: "Complete", taskId: task.taskId })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="font-medium text-sm">{task.taskName}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewTask(task)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {task.assignedTo.includes(loggedInUser?.email) && (
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-xs grid grid-cols-2 gap-2">
                        <div><span className="font-semibold">Task ID:</span> {task.taskId}</div>
                        <div><span className="font-semibold">Status:</span> <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>{task.status}</span></div>
                        <div><span className="font-semibold">Due Date:</span> {new Date(task.dueDate.split('/').reverse().join('-')).toLocaleDateString()}{isOverdue(task.dueDate, task.status) && <AlertCircle className="inline ml-1 text-red-600 w-4 h-4" />}</div>
                        <div><span className="font-semibold">Assigned By:</span> {task.assignedBy}</div>
                        <div><span className="font-semibold">Assigned To:</span> {task.assignedTo?.join(", ") || "Not assigned"}</div>
                        <div><span className="font-semibold">Task Type:</span> <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${task.taskType === "Auction" ? "bg-purple-100 text-purple-800" : task.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>{task.taskType}</span></div>
                        <div><span className="font-semibold">Priority:</span> <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span></div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">{editId ? "Edit Task" : "Create New Task"}</h2>
                      <button
                        onClick={() => { setIsModalOpen(false); setFormData(initialForm); setEditId(null); setSelectedFiles([]); }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter task title"
                        />
                        {formData.errors.title && <p className="text-red-500 text-xs mt-1">{formData.errors.title}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter task description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To (Email) *</label>
                        <input
                          type="email"
                          name="assignedTo"
                          value={formData.assignedTo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter assignee email"
                        />
                        {formData.errors.assignedTo && <p className="text-red-500 text-xs mt-1">{formData.errors.assignedTo}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Task Type *</label>
                          <select
                            name="taskType"
                            value={formData.taskType}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="General">General</option>
                            <option value="Auction">Auction</option>
                            <option value="Remainder">Remainder</option>
                          </select>
                          {formData.errors.taskType && <p className="text-red-500 text-xs mt-1">{formData.errors.taskType}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                          <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                          {formData.errors.priority && <p className="text-red-500 text-xs mt-1">{formData.errors.priority}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                          <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {formData.errors.dueDate && <p className="text-red-500 text-xs mt-1">{formData.errors.dueDate}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
                        <input
                          type="file"
                          multiple
                          onChange={handleAttachmentAdd}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formData.fileUrls.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {formData.fileUrls.map((attachment, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm">{attachment}</span>
                                <button
                                  type="button"
                                  onClick={() => handleAttachmentRemove(index)}
                                  className="text-red-500 hover:text-red-700"
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
                          onClick={() => { setIsModalOpen(false); setFormData(initialForm); setEditId(null); setSelectedFiles([]); }}
                          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{editId ? "Update Task" : "Create Task"}</span>
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
                        {isOverdue(viewTask.dueDate, viewTask.status) && <AlertCircle className="text-red-500 w-5 h-5" />}
                      </div>
                      <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Description</p><p className="text-gray-800">{viewTask.description || "No description provided"}</p></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div><p className="text-sm text-gray-500">Task Type</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${viewTask.taskType === "Auction" ? "bg-purple-100 text-purple-800" : viewTask.taskType === "General" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>{viewTask.taskType}</span></div>
                      <div><p className="text-sm text-gray-500">Status</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewTask.status)}`}>{viewTask.status}</span></div>
                      <div><p className="text-sm text-gray-500">Priority</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(viewTask.priority)}`}>{viewTask.priority}</span></div>
                      <div><p className="text-sm text-gray-500">Due Date</p><p>{new Date(viewTask.dueDate.split('/').reverse().join('-')).toLocaleDateString()}</p></div>
                    </div>
                    <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Assigned To</p><p className="text-gray-800">{viewTask.assignedTo?.join(", ") || "Not assigned"}</p></div>
                    <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Attachments</p>{viewTask.fileUrls?.length > 0 ? <div className="space-y-2">{viewTask.fileUrls.map((attachment, index) => (<a key={index} href={attachment} download className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block">{attachment.split("/").pop()}</a>))}</div> : <p className="text-gray-800">No attachments</p>}</div>
                    <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Update Status</p><div className="flex gap-2 flex-wrap">{["Open", "In Progress", "Complete", "Hold", "Archive"].map((status) => (<button key={status} onClick={() => setConfirmModal({ open: true, action: status, taskId: viewTask.taskId })} className={`px-4 py-2 rounded-md text-sm font-medium ${viewTask.status === status ? getStatusColor(status) : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{status}</button>))}</div></div>
                    <div className="mb-4"><p className="text-sm text-gray-500 mb-1">Comments</p><form onSubmit={handleCommentSubmit} className="mb-4"><div className="flex space-x-2"><input type="text" name="comment" onKeyPress={handleCommentKeyPress} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a comment..." autoFocus /><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Send className="w-4 h-4" /><span>Comment</span></button></div></form>{comments.length > 0 ? <div className="space-y-2">{(showAllComments ? [...comments].reverse() : [...comments].slice(0, 3).reverse()).map((comment, index) => (<div key={index} className={`bg-gray-50 p-3 rounded-md flex flex-col ${index === 0 ? "bg-yellow-100 border-2 border-yellow-400" : ""}`}><p className="text-sm text-gray-800">{comment.message}</p><p className="text-xs text-gray-500 mt-1 opacity-60">{comment.userName || comment.user}</p><p className="text-xs text-gray-400 mt-1">{new Date(comment.timestamp).toLocaleString()}</p></div>))}{comments.length > 3 && <button onClick={() => setShowAllComments(!showAllComments)} className="mt-2 text-blue-600 hover:text-blue-800 text-sm">{showAllComments ? "Hide" : "Show More"}</button>}</div> : <p className="text-gray-800">No comments yet</p>}</div>
                    <div><p className="text-sm text-gray-500 mb-1">Activity Log</p><div className="space-y-2">{(showFullLog ? activityLog : activityLog.slice(0, 3)).map((log, index) => (<div key={index} className="bg-gray-50 p-3 rounded-md"><p className="text-sm text-gray-800">{log.message}</p><p className="text-xs text-gray-500 mt-1">{log.user} - {new Date(log.timestamp).toLocaleString()}</p></div>))}{activityLog.length > 3 && <button onClick={() => setShowFullLog(!showFullLog)} className="mt-2 text-blue-600 hover:text-blue-800 text-sm">{showFullLog ? "Show Less" : "Show More"}</button>}</div></div>
                  </div>
                </div>
              )}

              {confirmModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Status Change</h2>
                    <p className="text-gray-700 mb-6">Are you sure you want to change the task status to <span className="font-semibold">{confirmModal.action}</span>?</p>
                    <div className="flex justify-end space-x-4">
                      <button onClick={() => setConfirmModal({ open: false, action: "", taskId: "" })} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                      <button onClick={() => handleUpdateTaskStatus(confirmModal.taskId, confirmModal.action)} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm</button>
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