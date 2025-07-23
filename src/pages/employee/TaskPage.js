import React, { useState, useEffect } from "react";
import {
  Search,
  AlertCircle,
  Eye,
  Plus,
  X,
  Send,
  Loader2,
  Upload,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const taskTypes = ["Auctions", "General", "Remainder"];
const priorities = ["High", "Medium", "Low"];
const statusOptions = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Hold", label: "Hold" },
  { value: "Complete", label: "Complete" },
  { value: "Archive", label: "Archive" },
];

const initialForm = {
  _id: "",
  taskId: 0,
  taskName: "",
  description: "",
  dueDate: "",
  dueTime: "N/A",
  priority: "",
  status: "Open",
  assignedBy: "admin@company.com",
  assignedTo: [],
  taskType: "General",
  fileUrls: [],
  assignedDateTime: "",
  remark: "",
  errors: {},
};

const generateTaskId = (tasks) => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const todayCount = tasks.filter((t) =>
    t.assignedDateTime?.startsWith(todayStr)
  ).length;
  return todayCount + 1;
};

const isOverdue = (dueDate, status) => {
  return dueDate && new Date(dueDate) < new Date() && status !== "Complete";
};

const TaskPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [tasks, setTasks] = useState([]);
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
  const [showFullLog, setShowFullLog] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [activeTab, setActiveTab] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "https://task-manager-backend-vqen.onrender.com/api/admin/allemployees",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.statusText}`);
        }
        const data = await response.json();
        const validEmployees = Array.isArray(data)
          ? data.map((emp) => ({
              id: emp.id || emp._id || "",
              name: emp.firstName || emp.name || "Unknown",
              email: emp.email || "",
              department: emp.department || "Unknown",
              avatar: emp.profileImage || "",
            }))
          : [];
        setEmployees(validEmployees);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching employees:", err);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "https://task-manager-backend-vqen.onrender.com/api/tasks/mine",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }
        const data = await response.json();
        const validTasks = Array.isArray(data)
          ? data
              .map((task) => {
                const assignedTo = Array.isArray(task.assignedTo)
                  ? task.assignedTo.map((email) => {
                      const employee = employees.find((emp) => emp.email === email);
                      return {
                        email: email || "",
                        name: employee ? employee.name : email || "Unknown",
                        avatar: employee ? employee.avatar : "",
                      };
                    })
                  : [];

                return {
                  _id: task._id || "",
                  taskId: task.taskId || 0,
                  taskName: task.taskName || "",
                  description: task.description || "",
                  dueDate: task.dueDate
                    ? task.dueDate.split("/").reverse().join("-")
                    : "",
                  dueTime: task.dueTime || "N/A",
                  priority: task.priority || "Low",
                  status: task.status || "Open",
                  assignedBy: task.assignedBy || "admin@company.com",
                  assignedTo,
                  taskType: task.taskType || "General",
                  fileUrls: task.fileUrls || [],
                  assignedDateTime: task.assignedDateTime || "",
                  activityLogs: task.activityLogs || [],
                  comments: task.comments || [],
                  remark: task.remark || "",
                };
              })
              .filter((task) => {
                const isValid =
                  task._id &&
                  task.taskName &&
                  task.status &&
                  task.priority &&
                  task.taskType &&
                  task.dueDate;
                if (!isValid) {
                  console.warn("Invalid task filtered out:", task);
                }
                return isValid;
              })
          : [];
        setTasks(validTasks);
        localStorage.setItem("tasks_stepper", JSON.stringify(validTasks));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching tasks:", err);
      }
    };

    if (token) {
      fetchEmployees().then(() => fetchTasks());
    } else {
      setError("No authentication token found");
      console.error("No token found in localStorage");
    }
  }, [token, employees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: "" },
    }));
  };

  const handleEmployeeSelect = (employee) => {
    if (!formData.assignedTo.find((emp) => emp.email === employee.email)) {
      setFormData((prev) => ({
        ...prev,
        assignedTo: [
          ...prev.assignedTo,
          { email: employee.email, name: employee.name, avatar: employee.avatar },
        ],
        errors: { ...prev.errors, assignedTo: "" },
      }));
    }
    setEmployeeSearchTerm("");
    setShowEmployeeDropdown(false);
  };

  const handleEmployeeRemove = (email) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((emp) => emp.email !== email),
    }));
  };

  const handleAttachmentAdd = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    setFormData((prev) => ({
      ...prev,
      fileUrls: [...prev.fileUrls, ...files.map((file) => file.name)],
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
    if (!formData.taskName.trim()) errors.taskName = "Task name is required";
    if (!formData.assignedTo.length)
      errors.assignedTo = "At least one assignee is required";
    if (!formData.taskType) errors.taskType = "Task type is required";
    if (!formData.priority) errors.priority = "Priority is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";
    return errors;
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormData((prev) => ({ ...prev, errors }));
      return;
    }

    setIsLoading(true);
    const now = new Date();
    const assignedDateTime = now.toISOString();
    const formDataToSend = new FormData();
    formDataToSend.append("taskTitle", formData.taskName);
    formDataToSend.append("description", formData.description);
    const [year, month, day] = formData.dueDate.split("-");
    const formattedDueDate = `${day}-${month}-${year}`;
    formDataToSend.append("dueDate", formattedDueDate);
    formDataToSend.append("dueTime", formData.dueTime);
    formDataToSend.append("priority", formData.priority);
    formDataToSend.append("status", isDraft ? "Draft" : formData.status);
    formDataToSend.append("assignedBy", formData.assignedBy);
    formDataToSend.append(
      "assignedTo",
      JSON.stringify(formData.assignedTo.map((emp) => emp.email))
    );
    formDataToSend.append("taskType", formData.taskType);
    formDataToSend.append("remark", formData.remark || "");
    formDataToSend.append("assignedDateTime", assignedDateTime);
    selectedFiles.forEach((file, index) => {
      if (file instanceof File) {
        formDataToSend.append("file", file);
      } else {
        console.error(`Invalid file at index ${index}:`, file);
      }
    });
    if (editId && formData.fileUrls.length > 0) {
      formDataToSend.append("fileUrls", JSON.stringify(formData.fileUrls));
    }

    let taskToUpdate = null;
    if (editId) {
      taskToUpdate = tasks.find((task) => task._id === editId);
      if (!taskToUpdate) {
        setError("Task not found for the given editId");
        setIsLoading(false);
        return;
      }
    } else {
      formDataToSend.append("taskId", formData.taskId || generateTaskId(tasks));
    }

    try {
      const url = editId
        ? `https://task-manager-backend-vqen.onrender.com/api/tasks/update/${taskToUpdate?.taskId}`
        : "https://task-manager-backend-vqen.onrender.com/api/tasks/create";
      const method = editId ? "PATCH" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            (editId ? "Failed to update task" : "Failed to create task")
        );
      }
      const updatedTask = await response.json();
      if (editId) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === editId
              ? {
                  ...updatedTask.task,
                  fileUrls: updatedTask.task.fileUrls || [],
                  assignedTo: updatedTask.task.assignedTo.map((email) => ({
                    email,
                    name:
                      employees.find((emp) => emp.email === email)?.name ||
                      email ||
                      "Unknown",
                    avatar:
                      employees.find((emp) => emp.email === email)?.avatar || "",
                  })),
                }
              : task
          )
        );
      } else {
        setTasks((prev) => [
          ...prev,
          {
            ...updatedTask.task,
            fileUrls: updatedTask.task.fileUrls || [],
            assignedTo: updatedTask.task.assignedTo.map((email) => ({
              email,
              name:
                employees.find((emp) => emp.email === email)?.name ||
                email ||
                "Unknown",
              avatar:
                employees.find((emp) => emp.email === email)?.avatar || "",
            })),
          },
        ]);
      }
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setFormData(initialForm);
      setEditId(null);
      setSelectedFiles([]);
      setEmployeeSearchTerm("");
    } catch (err) {
      setError(err.message);
      console.error("Error submitting task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTask = (task) => {
    setViewTask({
      ...task,
      dueDate: task.dueDate.split("/").reverse().join("-"),
    });
    setIsViewModalOpen(true);
    setActiveTab("all");
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://task-manager-backend-vqen.onrender.com/api/tasks/${taskId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((task) =>
          task._id === updatedTask.task._id
            ? {
                ...updatedTask.task,
                fileUrls: updatedTask.task.fileUrls || [],
                assignedTo: updatedTask.task.assignedTo.map((email) => ({
                  email,
                  name:
                    employees.find((emp) => emp.email === email)?.name ||
                    email ||
                    "Unknown",
                  avatar:
                    employees.find((emp) => emp.email === email)?.avatar || "",
                })),
              }
            : task
        )
      );
      setViewTask((prev) => ({
        ...prev,
        status: updatedTask.task.status,
      }));
    } catch (err) {
      setError(err.message);
      console.error("Error updating task status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e, commentText = null) => {
    if (e) e.preventDefault();
    const text = commentText || (e?.target?.comment?.value?.trim() || "");
    if (!text) return;

    setIsLoading(true);
    const now = new Date();
    const newComment = {
      message: text,
      user: "ayush.sain@sevenprocure.com",
      userName: "Ayush Kumar Sain",
      profileImage:
        "https://res.cloudinary.com/dutbpnhha/image/upload/v1752042070/profile_images/pn237xkicwene7hhlc9y.jpg",
      timestamp: now.toISOString(),
    };

    try {
      const response = await fetch(
        `https://task-manager-backend-vqen.onrender.com/api/tasks/${viewTask.taskId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: text }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const data = await response.json();
      const updatedTask = data.task;
      setTasks((prev) =>
        prev.map((task) =>
          task._id === viewTask._id
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
      setIsLoading(false);
    }
  };

  const handleEditFromView = (task) => {
    setFormData({
      ...task,
      dueDate: task.dueDate.split("/").reverse().join("-"),
      assignedTo: task.assignedTo,
      errors: {},
    });
    setEditId(task._id);
    setIsEditModalOpen(true);
    setIsViewModalOpen(false);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (typeof task.taskName === "string"
        ? task.taskName.toLowerCase().includes(searchTerm.toLowerCase())
        : false) ||
      (typeof task.description === "string"
        ? task.description.toLowerCase().includes(searchTerm.toLowerCase())
        : false);
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesTaskType =
      filterTaskType === "all" || task.taskType === filterTaskType;
    return matchesSearch && matchesStatus && matchesPriority && matchesTaskType;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return (
          new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime()
        );
      case "priority":
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return (
          (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        );
      case "status":
        return (a.status || "").localeCompare(b.status || "");
      case "taskName":
        return (a.taskName || "").localeCompare(b.taskName || "");
      default:
        return 0;
    }
  });

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.name &&
        typeof emp.name === "string" &&
        emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase())) ||
      (emp.department &&
        typeof emp.department === "string" &&
        emp.department.toLowerCase().includes(employeeSearchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Hold":
        return "bg-yellow-100 text-yellow-800";
      case "Open":
        return "bg-orange-100 text-orange-800";
      case "Archive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskTypeColor = (taskType) => {
    switch (taskType) {
      case "Auctions":
        return "bg-purple-100 text-purple-800";
      case "General":
        return "bg-blue-100 text-blue-800";
      case "Remainder":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      tasks.map((task) => ({
        "Task ID": task.taskId,
        "Task Name": task.taskName,
        Description: task.description,
        "Due Date": task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "N/A",
        "Due Time": task.dueTime,
        Priority: task.priority,
        Status: task.status,
        "Assigned By": task.assignedBy,
        "Assigned To":
          Array.isArray(task.assignedTo) && task.assignedTo.length > 0
            ? task.assignedTo.map((emp) => emp.name).join(", ")
            : "Unassigned",
        "Task Type": task.taskType,
        "File URLs": task.fileUrls.join(", "),
        "Assigned DateTime": task.assignedDateTime
          ? new Date(task.assignedDateTime).toLocaleString()
          : "N/A",
        Remark: task.remark,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    XLSX.writeFile(wb, "tasks_export.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Task Report", 10, 10);

    const tableData = tasks.map((task) => [
      task.taskId,
      task.taskName,
      task.description,
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A",
      task.dueTime,
      task.priority,
      task.status,
      task.assignedBy,
      Array.isArray(task.assignedTo) && task.assignedTo.length > 0
        ? task.assignedTo.map((emp) => emp.name).join(", ")
        : "Unassigned",
      task.taskType,
      task.fileUrls.join(", "),
      task.assignedDateTime
        ? new Date(task.assignedDateTime).toLocaleString()
        : "N/A",
      task.remark,
    ]);

    doc.autoTable({
      head: [
        [
          "Task ID",
          "Task Name",
          "Description",
          "Due Date",
          "Due Time",
          "Priority",
          "Status",
          "Assigned By",
          "Assigned To",
          "Task Type",
          "File URLs",
          "Assigned DateTime",
          "Remark",
        ],
      ],
      body: tableData,
      startY: 20,
      margin: { top: 10 },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
    });

    doc.save("tasks_report.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="sticky top-0 h-screen z-40">
        <Sidebar
          isOpen={showSidebar}
          toggleSidebar={() => setShowSidebar((prev) => !prev)}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <Header
          isLoggedIn={!!token}
          onToggleSidebar={() => setShowSidebar((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
                {error}
              </div>
            )}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-600">
                    My Tasks
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link to="/employee/createtasks">
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setEditId(null);
                          setFormData({
                            ...initialForm,
                            taskType:
                              filterTaskType === "all" ? "General" : filterTaskType,
                          });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Task</span>
                      </button>
                    </Link>
                    <button
                      onClick={exportToExcel}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      <span>Export to Excel</span>
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      <span>Export to PDF</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setFilterTaskType("all")}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      filterTaskType === "all"
                        ? "bg-gray-200 text-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    disabled={isLoading}
                  >
                    All
                  </button>
                  {taskTypes.map((type) => (
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
                      disabled={isLoading}
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Search by name or description..."
                      disabled={isLoading}
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    <option value="all">All Status</option>
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    <option value="all">All Priorities</option>
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                    <option value="taskName">Task Name</option>
                  </select>
                </div>
              </div>

              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">
                        Task ID
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">
                        Assigned Date
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">
                        Task Name
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">
                        Due Date
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">
                        Assigned By
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">
                        Assigned To
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">
                        Task Type
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">
                        Priority
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTasks.map((task) => (
                      <tr
                        key={task._id}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          isOverdue(task.dueDate, task.status) ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="py-3 px-2 sm:px-4 text-gray-900">
                          {task.taskId}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-gray-600">
                          {task.assignedDateTime
                            ? new Date(task.assignedDateTime).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <div className="font-medium text-gray-900">
                            {task.taskName}
                          </div>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-gray-600">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "N/A"}
                          {task.dueTime !== "N/A" && ` ${task.dueTime}`}
                          {isOverdue(task.dueDate, task.status) && (
                            <AlertCircle className="inline ml-2 text-red-600 w-4 h-4" />
                          )}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-gray-600">
                          {task.assignedBy}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-gray-600">
                          {Array.isArray(task.assignedTo) &&
                          task.assignedTo.length > 0
                            ? task.assignedTo.map((emp) => emp.name).join(", ")
                            : "Unassigned"}
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(
                              task.taskType
                            )}`}
                          >
                            {task.taskType}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleViewTask(task)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="View Details"
                              disabled={isLoading}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden grid gap-4">
                {sortedTasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="mb-4">No tasks found matching your criteria</div>
                    <div className="text-sm text-gray-400">
                      Try adjusting your search or filters
                    </div>
                  </div>
                ) : (
                  sortedTasks.map((task) => (
                    <div
                      key={task._id}
                      className={`border rounded-lg p-4 shadow-md bg-white ${
                        isOverdue(task.dueDate, task.status)
                          ? "bg-red-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {task.taskName}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewTask(task)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            disabled={isLoading}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span className="font-semibold">Task ID:</span>{" "}
                          {task.taskId}
                        </div>
                        <div>
                          <span className="font-semibold">Assigned Date:</span>{" "}
                          {task.assignedDateTime
                            ? new Date(task.assignedDateTime).toLocaleDateString()
                            : "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span>
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
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "N/A"}{" "}
                          {task.dueTime !== "N/A" && task.dueTime}{" "}
                          {isOverdue(task.dueDate, task.status) && (
                            <AlertCircle className="inline ml-1 text-red-600 w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Assigned By:</span>{" "}
                          {task.assignedBy}
                        </div>
                        <div>
                          <span className="font-semibold">Assigned To:</span>{" "}
                          {Array.isArray(task.assignedTo) &&
                          task.assignedTo.length > 0
                            ? task.assignedTo.map((emp) => emp.name).join(", ")
                            : "Unassigned"}
                        </div>
                        <div>
                          <span className="font-semibold">Task Type:</span>{" "}
                          <span
                            className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(
                              task.taskType
                            )}`}
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
                        <div className="col-span-full">
                          <span className="font-semibold">Description:</span>{" "}
                          {task.description || "None"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {sortedTasks.length === 0 && (
                <div className="text-center py-12 hidden lg:block">
                  <div className="text-gray-500 mb-4">
                    No tasks found matching your criteria
                  </div>
                  <div className="text-sm text-gray-400">
                    Try adjusting your search or filters
                  </div>
                </div>
              )}

              {(isModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {editId ? "Edit Task" : "Create New Task"}
                      </h2>
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setIsEditModalOpen(false);
                          setFormData(initialForm);
                          setEditId(null);
                          setSelectedFiles([]);
                          setEmployeeSearchTerm("");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isLoading}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => handleSubmit(e, isEditModalOpen && false)}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Task Name *
                        </label>
                        <input
                          type="text"
                          name="taskName"
                          value={formData.taskName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Enter task name"
                          disabled={isLoading}
                        />
                        {formData.errors.taskName && (
                          <p className="text-red-500 text-xs mt-1">
                            {formData.errors.taskName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Enter task description"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assign Employees *
                        </label>
                        <input
                          type="text"
                          value={employeeSearchTerm}
                          onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                          onFocus={() => setShowEmployeeDropdown(true)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Search employee by name or department"
                          disabled={isLoading}
                        />
                        {showEmployeeDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredEmployees.map((employee) => (
                              <button
                                key={employee.id}
                                type="button"
                                onClick={() => handleEmployeeSelect(employee)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                                disabled={isLoading}
                              >
                                <img
                                  src={employee.avatar || ""}
                                  alt={employee.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <p className="font-medium">
                                    {employee.name || "Unknown"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {employee.email}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.assignedTo.map((emp) => (
                            <div
                              key={emp.email}
                              className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                            >
                              <img
                                src={emp.avatar || ""}
                                alt={emp.name}
                                className="w-5 h-5 rounded-full mr-2"
                              />
                              <span className="text-sm">
                                {emp.name || "Unknown"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleEmployeeRemove(emp.email)}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                                disabled={isLoading}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        {formData.errors.assignedTo && (
                          <p className="text-red-500 text-xs mt-1">
                            {formData.errors.assignedTo}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Type *
                          </label>
                          <select
                            name="taskType"
                            value={formData.taskType}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={isLoading}
                          >
                            <option value="General">General</option>
                            <option value="Auctions">Auctions</option>
                            <option value="Remainder">Remainder</option>
                          </select>
                          {formData.errors.taskType && (
                            <p className="text-red-500 text-xs mt-1">
                              {formData.errors.taskType}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority *
                          </label>
                          <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={isLoading}
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                          {formData.errors.priority && (
                            <p className="text-red-500 text-xs mt-1">
                              {formData.errors.priority}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date *
                          </label>
                          <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={isLoading}
                          />
                          {formData.errors.dueDate && (
                            <p className="text-red-500 text-xs mt-1">
                              {formData.errors.dueDate}
                            </p>
                          )}
                        </div>
                      </div>

                      {editId && (
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Status
                            </label>
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              disabled={isLoading}
                            >
                              <option value="Open">Open</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Hold">Hold</option>
                              <option value="Complete">Complete</option>
                              <option value="Archive">Archive</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          File Attachments
                        </label>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <label className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-200 text-sm inline-flex items-center space-x-2">
                            <Upload className="w-4 h-4" />
                            <span>Choose Files</span>
                            <input
                              type="file"
                              multiple
                              onChange={handleAttachmentAdd}
                              className="hidden"
                              disabled={isLoading}
                            />
                          </label>
                        </div>

                        {formData.fileUrls.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {formData.fileUrls.map((attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded"
                              >
                                <div className="flex items-center space-x-2">
                                  <Upload className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm truncate">
                                    {attachment}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleAttachmentRemove(index)}
                                  className="text-red-500 hover:text-red-700"
                                  disabled={isLoading}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Remark
                        </label>
                        <input
                          type="text"
                          name="remark"
                          value={formData.remark || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Enter remark"
                          disabled={isLoading}
                        />
                      </div>

                      {isLoading && (
                        <div className="flex justify-center">
                          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        </div>
                      )}

                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            setIsEditModalOpen(false);
                            setFormData(initialForm);
                            setEditId(null);
                            setSelectedFiles([]);
                            setEmployeeSearchTerm("");
                          }}
                          className="px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm"
                          disabled={isLoading}
                        >
                          <span>{editId ? "Update Task" : "Create Task"}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {isViewModalOpen && viewTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-2">
                        <h2 className="text-lg sm:text-xl font-semibold">
                          {viewTask.taskName}
                        </h2>
                        {isOverdue(viewTask.dueDate, viewTask.status) && (
                          <AlertCircle className="text-red-500 w-5 h-5" />
                        )}
                      </div>
                      <button
                        onClick={() => setIsViewModalOpen(false)}
                        disabled={isLoading}
                      >
                        <X className="w-6 h-6 text-gray-500 hover:text-black" />
                      </button>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-2">Description</p>
                      <p className="text-gray-800 text-sm">
                        {viewTask.description || "None"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Task Type</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(
                            viewTask.taskType
                          )}`}
                        >
                          {viewTask.taskType}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Status</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            viewTask.status
                          )}`}
                        >
                          {viewTask.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Priority</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            viewTask.priority
                          )}`}
                        >
                          {viewTask.priority}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Due Date</p>
                        <p className="text-sm">
                          {viewTask.dueDate
                            ? new Date(viewTask.dueDate).toLocaleDateString()
                            : "N/A"}
                          {viewTask.dueTime !== "N/A" && ` ${viewTask.dueTime}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Assigned To</p>
                        <p className="text-sm text-gray-800 break-words">
                          {Array.isArray(viewTask.assignedTo) &&
                          viewTask.assignedTo.length > 0
                            ? viewTask.assignedTo
                                .map((emp) => emp.name)
                                .join(", ")
                            : "Unassigned"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Assigned By</p>
                        <p className="text-sm text-gray-800">
                          {viewTask.assignedBy}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Task ID</p>
                        <p className="text-sm text-gray-800">{viewTask.taskId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          Assigned Date
                        </p>
                        <p className="text-sm text-gray-800">
                          {viewTask.assignedDateTime
                            ? new Date(viewTask.assignedDateTime).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-2">Attachments</p>
                      <div className="flex space-x-2 mb-4">
                        <button
                          onClick={() => setActiveTab("all")}
                          className={`px-4 py-2 rounded-t-md text-sm ${
                            activeTab === "all"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          disabled={isLoading}
                        >
                          All Attachments
                        </button>
                        <button
                          onClick={() => setActiveTab("recent")}
                          className={`px-4 py-2 rounded-t-md text-sm ${
                            activeTab === "recent"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          disabled={isLoading}
                        >
                          Recent Attachments
                        </button>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-b-md">
                        {activeTab === "all" && viewTask.fileUrls?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {viewTask.fileUrls.map((att, idx) => (
                              <a
                                key={idx}
                                href={att}
                                download
                                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                              >
                                {att.split("/").pop()}
                              </a>
                            ))}
                          </div>
                        ) : activeTab === "recent" && viewTask.fileUrls?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {viewTask.fileUrls.slice(-2).map((att, idx) => (
                              <a
                                key={idx}
                                href={att}
                                download
                                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                              >
                                {att.split("/").pop()}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">No attachments</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-2">Remark</p>
                      <p className="text-sm text-gray-800">
                        {viewTask.remark || "None"}
                      </p>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Status
                      </label>
                      <select
                        value={viewTask.status}
                        onChange={(e) => handleUpdateTaskStatus(viewTask.taskId, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={isLoading}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-2">Comments</p>
                      <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
                        <textarea
                          name="comment"
                          className="w-full p-2 border rounded bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add a comment..."
                          rows={2}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment(null, e.target.value);
                            }
                          }}
                          disabled={isLoading}
                        />
                        <button
                          type="submit"
                          className="px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          disabled={isLoading}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </form>
                      <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg shadow-sm">
                        {viewTask.comments.length > 0 ? (
                          [...viewTask.comments]
                            .sort(
                              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                            )
                            .map((comment, index) => (
                              <div
                                key={index}
                                className={`mb-3 pb-2 border-b border-gray-200 last:border-b-0 last:mb-0 ${
                                  index === 0 ? "bg-yellow-100 p-2 rounded" : ""
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <div>
                                    <p className="text-gray-800 text-sm">
                                      {comment.message || "No message"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {comment.userName || comment.user || "Unknown User"}{" "}
                                      • {new Date(comment.timestamp).toLocaleString()}
                                    </p>
                                    {comment.profileImage && (
                                      <img
                                        src={comment.profileImage}
                                        alt="User profile"
                                        className="w-8 h-8 rounded-full mt-1"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className="text-gray-400 text-sm">No comments yet.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Activity Log</p>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        {viewTask.activityLogs && viewTask.activityLogs.length > 0 ? (
                          viewTask.activityLogs
                            .slice(0, showFullLog ? viewTask.activityLogs.length : 1)
                            .map((log, index) => (
                              <div key={index} className="mb-2 last:mb-0">
                                <p className="text-gray-700">
                                  {log.message || "No message"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {log.user || "Unknown User"} •{" "}
                                  {new Date(log.timestamp || Date.now()).toLocaleString()}
                                </p>
                              </div>
                            ))
                        ) : (
                          <p className="text-gray-400 text-sm">
                            No activity logs yet.
                          </p>
                        )}
                        {viewTask.activityLogs &&
                          viewTask.activityLogs.length > 1 && (
                            <button
                              onClick={() => setShowFullLog(!showFullLog)}
                              className="mt-2 text-blue-600 text-sm hover:underline"
                              disabled={isLoading}
                            >
                              {showFullLog ? "Hide" : "Show More"}
                            </button>
                          )}
                      </div>
                    </div>

                    <div className="flex justify-end mt-6 space-x-4">
                      {/* <button
                        onClick={() => handleEditFromView(viewTask)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                        disabled={isLoading}
                      >
                        Edit
                      </button> */}
                      <button
                        onClick={() => setIsViewModalOpen(false)}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
                        disabled={isLoading}
                      >
                        Close
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