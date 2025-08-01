import React, { useState, useEffect } from "react";
import {
  Search,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Plus,
  X,
  Send,
  Loader2,
  Upload,
  Download,
  Mail,
  MessageCircle,
} from "lucide-react";
import { FaEllipsisH } from "react-icons/fa";
import AdminSidebar from "../../components/common/AdminSidebar";
import Header from "../../components/common/Header";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { useRef } from "react";
// Helper to format date as DD/MMMM/YYYY (e.g., 01/January/2025)
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date)) return "N/A";
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const taskTypes = ["Auctions", "General", "Remainder"];
const priorities = ["High", "Medium", "Low"];
const statusOptions = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Hold", label: "Hold" },
  { value: "Complete", label: "Complete" },
  { value: "Archived", label: "Archived" },
  { value: "Pending", label: "Pending" },
];

// Helper to get display status (Pending if overdue and not complete)
const getDisplayStatus = (task) => {
  if (isOverdue(task.dueDate, task.status) && task.status !== "Complete") {
    return "Pending";
  }
  return task.status;
};

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

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "UN";
  const nameParts = name.trim().split(" ");
  return nameParts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const ADMIN_EMAIL = "admin@company.com"; // Change if your admin email is different

const AdmintaskPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterTaskType, setFilterTaskType] = useState("all");
  const [filterEmployee, setFilterEmployee] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [showFullComments, setShowFullComments] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [activeTab, setActiveTab] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [showReminderConfirm, setShowReminderConfirm] = useState(false);
  const [taskToRemind, setTaskToRemind] = useState(null);
  // const [confirmDelete, setConfirmDelete] = useState(false);
  // Remainder Email Modal State
  const [showRemainderEmailModal, setShowRemainderEmailModal] = useState(false);
  const [remainderEmailTask, setRemainderEmailTask] = useState(null);
  const [remainderEmailBody, setRemainderEmailBody] = useState("");
  const [isSendingRemainderEmail, setIsSendingRemainderEmail] = useState(false);
  const [adminEmail, setAdminEmail] = useState(ADMIN_EMAIL);
  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  // Unseen comments state: { [taskId]: true }
  const [unseenComments, setUnseenComments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("unseen_comments_admin") || "{}");
    } catch {
      return {};
    }
  });

  // Toast helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper to update unseen comments in localStorage
  const updateUnseenComments = (newState) => {
    setUnseenComments(newState);
    localStorage.setItem("unseen_comments_admin", JSON.stringify(newState));
  };

  // Detect new comments not by admin (logged-in user)
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;
    const newUnseen = { ...unseenComments };
    tasks.forEach((task) => {
      if (!task.comments || !Array.isArray(task.comments)) return;
      // Only comments not by admin (logged-in user)
      const hasUnseen = task.comments.some(
        (c) =>
          c.user &&
          c.user !== adminEmail &&
          (!unseenComments[task._id] ||
            !unseenComments[task._id].includes(c.timestamp))
      );
      if (hasUnseen) {
        const unseenTimestamps = task.comments
          .filter(
            (c) =>
              c.user &&
              c.user !== adminEmail &&
              (!unseenComments[task._id] ||
                !unseenComments[task._id].includes(c.timestamp))
          )
          .map((c) => c.timestamp);
        newUnseen[task._id] = [
          ...(unseenComments[task._id] || []),
          ...unseenTimestamps,
        ];
      }
    });
    updateUnseenComments(newUnseen);
    // eslint-disable-next-line
  }, [tasks, adminEmail]);

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
        console.log("Fetched employees:", data);
        const validEmployees = Array.isArray(data)
          ? data.map((emp) => ({
              id: emp.id || emp._id || "",
              name: emp.firstName || emp.name || "Unknown",
              email: emp.email || "",
              department: emp.department || "Unknown",
              position: emp.position || "Employee",
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
          "https://task-manager-backend-vqen.onrender.com/api/admin/gettasks",
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
        console.log("Fetched tasks:", data);
        const validTasks = Array.isArray(data)
          ? data
              .map((task) => {
                const assignedTo = Array.isArray(task.assignedTo)
                  ? task.assignedTo.map((email) => {
                      const employee = employees.find(
                        (emp) => emp.email === email
                      );
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
          {
            email: employee.email,
            name: employee.name,
            avatar: employee.avatar,
          },
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
  const confirmDelete = (task) => {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
    setOpenDropdown(null); // Close dropdown here as well
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

    // Additional validation for overdue tasks
    const isEditing = !!editId;
    const wasPending =
      isEditing &&
      isOverdue(formData.dueDate, formData.status) &&
      getDisplayStatus(formData) === "Pending";
    const statusChanged =
      isEditing &&
      formData.status !== "Pending" &&
      formData.status !== getDisplayStatus(formData);

    if (
      wasPending &&
      statusChanged &&
      (!formData.dueDate || new Date(formData.dueDate) <= new Date())
    ) {
      errors.dueDate =
        "To update the status of an overdue task, please select a new future due date.";
    }
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
        ? `https://task-manager-backend-vqen.onrender.com/api/admin/updatetask/${taskToUpdate?.taskId}`
        : "https://task-manager-backend-vqen.onrender.com/api/admin/createtask";
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
                      employees.find((emp) => emp.email === email)?.avatar ||
                      "",
                  })),
                }
              : task
          )
        );
        showToast("Task updated successfully", "success");
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
        showToast("Task created successfully", "success");
      }
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      setFormData(initialForm);
      setEditId(null);
      setSelectedFiles([]);
      setEmployeeSearchTerm("");
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to submit task", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setFormData({
      ...task,
      dueDate: task.dueDate.split("/").reverse().join("-"),
      assignedTo: task.assignedTo,
      errors: {},
      fileUrls: task.fileUrls.filter(
        (url) => typeof url === "string" && url.startsWith("http")
      ),
    });
    setEditId(task._id);
    setIsModalOpen(true);
    setOpenDropdown(null); // Close dropdown after click
  };

  const handleDeleteTask = async (taskId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://task-manager-backend-vqen.onrender.com/api/admin/deletetask/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
      showToast("Task deleted successfully", "success");
      // Remove unseen comments for deleted task
      const newUnseen = { ...unseenComments };
      Object.keys(newUnseen).forEach((tid) => {
        if (tasks.find((t) => t.taskId === taskId && t._id === tid)) {
          delete newUnseen[tid];
        }
      });
      updateUnseenComments(newUnseen);
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to delete task", "error");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  };

  const handleViewTask = (task) => {
    setViewTask({
      ...task,
      dueDate: task.dueDate.split("/").reverse().join("-"),
    });
    setIsViewModalOpen(true);
    setActiveTab("all");
    if (unseenComments[task._id]) {
      const newUnseen = { ...unseenComments };
      delete newUnseen[task._id];
      updateUnseenComments(newUnseen);
    }
    setOpenDropdown(null); // Close dropdown upon action
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://task-manager-backend-vqen.onrender.com/api/admin/updatetask/${taskId}`,
        {
          method: "PATCH",
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
          task._id === taskId
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
    } catch (err) {
      setError(err.message);
      console.error("Error updating task status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e, commentText = null) => {
    if (e) e.preventDefault();
    const text = commentText || e?.target?.comment?.value?.trim() || "";
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

  const handleReminderConfirm = (task) => {
    setTaskToRemind(task);
    setShowReminderConfirm(true);
  };

  const handleSendReminder = async (task) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://task-manager-backend-vqen.onrender.com/api/admin/sendreminder/${task.taskId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            assignedTo: task.assignedTo.map((emp) => emp.email),
            taskName: task.taskName,
            dueDate: task.dueDate,
            dueTime: task.dueTime,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send reminder email");
      }
      // setError("Reminder email sent successfully");
    } catch (err) {
      setError(err.message);
      console.error("Error sending reminder:", err);
    } finally {
      setIsLoading(false);
      setShowReminderConfirm(false);
      setTaskToRemind(null);
    }
  };

  // Remainder Email Modal handlers
  const handleOpenRemainderEmailModal = (task) => {
    setRemainderEmailTask(task);
    setRemainderEmailBody(
      `Hi,this is a reminder to complete the task before due date which is on ${
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"
      }${
        task.dueTime !== "N/A" ? " at " + task.dueTime : ""
      }.\n\nPlease ensure timely completion.`
    );
    setShowRemainderEmailModal(true);
    setOpenDropdown(null); // Close dropdown after opening modal
  };

  const handleSendRemainderEmail = async () => {
    if (!remainderEmailTask) return;
    setIsSendingRemainderEmail(true);
    setError(null);
    try {
      const response = await fetch(
        "https://task-manager-backend-vqen.onrender.com/api/admin/remainderemail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            taskId: remainderEmailTask.taskId,
            assignedTo: remainderEmailTask.assignedTo.map((emp) => emp.email),
            taskName: remainderEmailTask.taskName,
            dueDate: remainderEmailTask.dueDate,
            dueTime: remainderEmailTask.dueTime,
            emailBody: remainderEmailBody,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send remainder email");
      }
      setShowRemainderEmailModal(false);
      setRemainderEmailTask(null);
      setRemainderEmailBody("");
      showToast("Remainder email sent successfully", "success");
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to send email", "error");
    } finally {
      setIsSendingRemainderEmail(false);
    }
  };
  const dropdownRef = useRef(null);

  const filteredTasks = tasks.filter((task) => {
    const displayStatus = getDisplayStatus(task);
    const matchesSearch =
      (typeof task.taskName === "string"
        ? task.taskName.toLowerCase().includes(searchTerm.toLowerCase())
        : false) ||
      (typeof task.description === "string"
        ? task.description.toLowerCase().includes(searchTerm.toLowerCase())
        : false);
    const matchesStatus =
      filterStatus === "all" || displayStatus === filterStatus;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesTaskType =
      filterTaskType === "all" || task.taskType === filterTaskType;
    const matchesEmployee =
      filterEmployee === "all" ||
      task.assignedTo.some((emp) => emp.email === filterEmployee);
    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesTaskType &&
      matchesEmployee
    );
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return (
          new Date(a.dueDate || 0).getTime() -
          new Date(b.dueDate || 0).getTime()
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
      case "Archived":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-red-100 text-red-800";
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
        "Due Date": formatDisplayDate(task.dueDate),
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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
  <div className="flex min-h-screen bg-gray-100 relative">
      
       <div className="sticky top-0 h-screen z-40">
         <AdminSidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
       </div>
        <div className="flex-1 flex flex-col">
          <Header isLoggedIn={!!token} onToggleSidebar={toggleSidebar} />

          <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
            <div className="max-w-8xl mx-auto">
              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
                  {error}
                </div>
              )}
              <div className="bg-white rounded-lg shadow-md p-2 sm:p-2 md:p-1 lg:p-10">
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                    <h2 className="text-lg sm:text-xl md:text-4xl font-bold text-blue-600">
                      My Tasks
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link to="/admin/createtasks">
                        <button
                          onClick={() => {
                            setIsModalOpen(true);
                            setEditId(null);
                            setFormData({
                              ...initialForm,
                              taskType:
                                filterTaskType === "all"
                                  ? "General"
                                  : filterTaskType,
                            });
                          }}
                          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base w-full sm:w-10 h-10"
                          title="Create Task"
                          disabled={isLoading}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </Link>
                      <button
                        onClick={exportToExcel}
                        className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center text-sm sm:text-base w-full sm:w-10 h-10"
                        title="Export to Excel"
                        disabled={isLoading}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => setFilterTaskType("all")}
                      className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium ${
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
                        className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium ${
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

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                        placeholder="Search by name or description..."
                        disabled={isLoading}
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm w-full sm:w-auto"
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
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      <option value="all">All Priorities</option>
                      {priorities.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    {/* <select
                      value={filterEmployee}
                      onChange={(e) => setFilterEmployee(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      <option value="all">All Employees</option>
                      {employees.map((emp) => (
                        <option key={emp.email} value={emp.email}>
                         {emp.profileImage} {emp.name} ({emp.position}) 
                        </option>
                      ))}
                    </select> */}

                    <div className="relative w-full sm:w-56">
                      {/* Trigger Button */}
                      <div
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center space-x-2"
                        onClick={() =>
                          setShowEmployeeDropdown(!showEmployeeDropdown)
                        }
                      >
                        {filterEmployee !== "all" &&
                        employees.find((emp) => emp.email === filterEmployee)
                          ?.avatar ? (
                          <img
                            src={
                              employees.find(
                                (emp) => emp.email === filterEmployee
                              )?.avatar
                            }
                            alt="Profile"
                            className="w-5 h-5 rounded-full"
                          />
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                            {filterEmployee === "all"
                              ? "All"
                              : getInitials(
                                  employees.find(
                                    (emp) => emp.email === filterEmployee
                                  )?.name || "U"
                                )}
                          </span>
                        )}
                        <div className="flex flex-col">
                          <span className="text-gray-700 text-sm leading-tight truncate w-40">
                            {filterEmployee === "all"
                              ? "All Employees"
                              : employees.find(
                                  (emp) => emp.email === filterEmployee
                                )?.name || "Unknown"}
                          </span>
                          {filterEmployee !== "all" && (
                            <span className="text-gray-400 text-xs leading-tight truncate w-40">
                              {employees.find(
                                (emp) => emp.email === filterEmployee
                              )?.position || ""}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dropdown */}
                      {showEmployeeDropdown && (
                        <div className="absolute z-20 mt-1 w-full sm:w-56 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
                          <div
                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFilterEmployee("all");
                              setShowEmployeeDropdown(false);
                            }}
                          >
                            <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 mr-2">
                              All
                            </span>
                            <div>
                              <span className="text-sm text-gray-900">
                                All Employees
                              </span>
                            </div>
                          </div>
                          {filteredEmployees.map((emp) => (
                            <div
                              key={emp.email}
                              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setFilterEmployee(emp.email);
                                setShowEmployeeDropdown(false);
                              }}
                            >
                              {emp.avatar ? (
                                <img
                                  src={emp.avatar}
                                  alt={emp.name}
                                  className="w-5 h-5 rounded-full mr-2"
                                />
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 mr-2">
                                  {getInitials(emp.name || "Unknown")}
                                </span>
                              )}
                              <div>
                                <span className="text-sm text-gray-900">
                                  {emp.name || "Unknown"}
                                </span>
                                <span className="block text-xs text-gray-500">
                                  {emp.position || "Unknown"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="w-full overflow-x-auto">
                    <div className="overflow-y-auto">
                      <table className="w-full text-xs sm:text-sm table-fixed">
                        <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
                          <tr>
                            <th className="w-20 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap">
                              Task ID
                            </th>
                            <th className="w-48 text-center py-3 px-2 sm:px-4 font-medium text-gray-700">
                              Task Name
                            </th>
                            <th className="w-28 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap">
                              Task Type
                            </th>
                            <th className="w-28 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap">
                              Priority
                            </th>
                            <th className="w-28 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap">
                              Status
                            </th>
                            <th className="w-32 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap">
                              Assigned To
                            </th>
                            <th className="w-32 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap">
                              Assigned By
                            </th>
                            <th className="w-32 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap">
                              Due Date
                            </th>
                            <th className="w-40 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedTasks.map((task) => (
                            <tr
                              key={task._id}
                              className={`border-b border-gray-100 hover:bg-gray-50 ${
                                isOverdue(task.dueDate, task.status)
                                  ? "bg-red-50"
                                  : ""
                              }`}
                            >
                              <td className="py-4 px-2 sm:px-4 text-gray-900 text-center truncate">
                                {task.taskId}
                              </td>
                              <td className="py-4 px-2 sm:px-4 text-start truncate">
                                {task.taskName}
                              </td>
                              <td className="py-4 px-2 sm:px-4 text-center">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(
                                    task.taskType
                                  )}`}
                                >
                                  {task.taskType}
                                </span>
                              </td>
                              <td className="py-4 px-2 sm:px-4 text-center">
                                <span
                                  className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                              </td>
                              <td className="py-4 px-2 sm:px-4 text-center">
                                <span
                                  className={`px-2 py-1 min-w-[90px] text-center whitespace-nowrap rounded-full text-xs font-medium ${getStatusColor(
                                    getDisplayStatus(task)
                                  )}`}
                                >
                                  {getDisplayStatus(task)}
                                </span>
                              </td>
                              <td className="py-4 px-2 sm:px-4 text-gray-600 text-center">
                                <span className="flex -space-x-1 justify-center">
                                  {Array.isArray(task.assignedTo) &&
                                  task.assignedTo.length > 0 ? (
                                    task.assignedTo.map((emp) => (
                                      <div
                                        key={emp.email}
                                        className="relative group"
                                      >
                                        <div className="relative group">
                                          {emp.avatar ? (
                                            <img
                                              src={emp.avatar}
                                              alt={emp.name || emp.email}
                                              className="inline-block w-7 h-7 rounded-full border border-gray-300"
                                            />
                                          ) : (
                                            <span className="inline-flex w-7 h-7 bg-gray-200 rounded-full items-center justify-center text-gray-600 text-xs font-medium">
                                              {getInitials(
                                                emp.name || emp.email
                                              )}
                                            </span>
                                          )}
                                          <span className="absolute left-1/2 transform -translate-x-1/2 top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                                            {emp.name || emp.email}
                                          </span>
                                        </div>

                                        <span className="absolute left-1/2 transform -translate-x-1/2 top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                          {emp.name}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="relative group">
                                      <span className="inline-flex w-6 h-6 bg-gray-100 rounded-full items-center justify-center text-gray-600 text-xs font-medium">
                                        UN
                                      </span>
                                      <span className="absolute left-1/2 transform -translate-x-1/2 top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        Unassigned
                                      </span>
                                    </div>
                                  )}
                                </span>
                              </td>
                              <td className="py-4 px-2 sm:px-4 text-gray-600 text-center">
                                <div className="relative group">
                                  <span
                                    className="inline-flex w-6 h-6 bg-blue-100 rounded-full items-center justify-center text-blue-600 text-xs font-medium"
                                    title={task.assignedBy}
                                  >
                                    {getInitials(task.assignedBy)}
                                  </span>
                                  <span className="absolute left-1/2 transform -translate-x-1/2 top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    {task.assignedBy}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-2 sm:px-4 text-gray-600 text-center truncate">
                                {formatDisplayDate(task.dueDate)}
                                {task.dueTime !== "N/A" && ` ${task.dueTime}`}
                                {isOverdue(task.dueDate, task.status) && (
                                  <AlertCircle className="inline ml-2 text-red-600 w-4 h-4" />
                                )}
                              </td>

                              {/* <td className="py-4 px-2 sm:px-4 text-center relative">
                                <div className="relative inline-block text-left">
                                  <button
                                    onClick={() =>
                                      setOpenDropdown((prev) =>
                                        prev === task._id ? null : task._id
                                      )
                                    }
                                    className="p-2 text-blue-600 hover:bg-gray-100 rounded"
                                    title="Actions"
                                    disabled={isLoading}
                                  >
                                    <FaEllipsisH size={14} />
                                  </button>

                                  {openDropdown === task._id && (
                                    <div className="absolute right-0 z-20 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg">
                                      <button
                                        onClick={() => handleViewTask(task)}
                                        className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 text-sm flex items-center gap-2"
                                      >
                                        <Eye className="w-4 h-4" /> View Details
                                      </button>
                                      <button
                                        onClick={() => handleEditTask(task)}
                                        className="w-full px-4 py-2 text-left text-green-600 hover:bg-green-50 text-sm flex items-center gap-2"
                                      >
                                        <Edit className="w-4 h-4" /> Edit Task
                                      </button>
                                      <button
                                        onClick={() => confirmDelete(task)}
                                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 text-sm flex items-center gap-2"
                                      >
                                        <Trash2 className="w-4 h-4" /> Delete
                                        Task
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleOpenRemainderEmailModal(task)
                                        }
                                        className="w-full px-4 py-2 text-left text-purple-600 hover:bg-purple-50 text-sm flex items-center gap-2"
                                      >
                                        <Mail className="w-4 h-4" /> Send
                                        Reminder
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td> */}

                              {/* NEW TD */}

                              <td className="py-4 px-2 sm:px-4 text-center relative">
                                <div className="relative inline-block text-left">
                                  <button
                                    onClick={() =>
                                      setOpenDropdown((prev) =>
                                        prev === task._id ? null : task._id
                                      )
                                    }
                                    className="p-2 text-blue-600 hover:bg-gray-100 rounded"
                                    title="Actions"
                                    disabled={isLoading}
                                  >
                                    <FaEllipsisH size={14} />
                                  </button>

                                  {openDropdown === task._id && (
                                    <div className="absolute right-0 z-20 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg">
                                      <button
                                        onClick={() => handleViewTask(task)}
                                        className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 text-sm flex items-center gap-2"
                                      >
                                        <Eye className="w-4 h-4" /> View Details
                                      </button>
                                      <button
                                        onClick={() => handleEditTask(task)}
                                        className="w-full px-4 py-2 text-left text-green-600 hover:bg-green-50 text-sm flex items-center gap-2"
                                      >
                                        <Edit className="w-4 h-4" /> Edit Task
                                      </button>
                                      <button
                                        onClick={() => confirmDelete(task)}
                                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 text-sm flex items-center gap-2"
                                      >
                                        <Trash2 className="w-4 h-4" /> Delete
                                        Task
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleOpenRemainderEmailModal(task)
                                        }
                                        className="w-full px-4 py-2 text-left text-purple-600 hover:bg-purple-50 text-sm flex items-center gap-2"
                                      >
                                        <Mail className="w-4 h-4" /> Send
                                        Reminder
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Responsive Card List for small screens */}
                <div className="lg:hidden grid gap-4">
                  {sortedTasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="mb-4">
                        No tasks found matching your criteria
                      </div>
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
                            {unseenComments[task._id] &&
                              unseenComments[task._id].length > 0 && (
                                <MessageCircle
                                  className="w-4 h-4 text-orange-500 animate-bounce"
                                  title="New comment"
                                />
                              )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewTask(task)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              disabled={isLoading}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              disabled={isLoading}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDelete(task)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {/* <button
                              onClick={() => handleReminderConfirm(task)}
                              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                              disabled={isLoading}
                            > */}
                            <button
                              onClick={() =>
                                handleOpenRemainderEmailModal(task)
                              }
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                              title="Send Remainder Email"
                              disabled={isLoading}
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="text-center">
                            <span className="font-semibold">Task ID:</span>{" "}
                            {task.taskId}
                          </div>
                          <div className="text-center">
                            <span className="font-semibold">
                              Assigned Date:
                            </span>{" "}
                            {formatDisplayDate(task.assignedDateTime)}
                          </div>
                          <div className="text-center">
                            <span className="font-semibold">Status:</span>
                            <span
                              className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                getDisplayStatus(task)
                              )}`}
                            >
                              {getDisplayStatus(task)}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="font-semibold">Due Date:</span>{" "}
                            {formatDisplayDate(task.dueDate)}{" "}
                            {task.dueTime !== "N/A" && task.dueTime}{" "}
                            {isOverdue(task.dueDate, task.status) && (
                              <AlertCircle className="inline ml-1 text-red-600 w-4 h-4" />
                            )}
                          </div>
                          <div className="text-center">
                            <span className="font-semibold">Assigned By:</span>{" "}
                            <div className="relative group inline-block">
                              <span
                                className="inline-flex w-6 h-6 bg-blue-100 rounded-full items-center justify-center text-blue-600 text-xs font-medium"
                                title={task.assignedBy}
                              >
                                {getInitials(task.assignedBy)}
                              </span>
                              <span className="absolute left-1/2 transform -translate-x-1/2 top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                {task.assignedBy}
                              </span>
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="font-semibold">Assigned To:</span>{" "}
                            <span className="flex -space-x-1 justify-center">
                              {Array.isArray(task.assignedTo) &&
                              task.assignedTo.length > 0 ? (
                                task.assignedTo.map((emp) => (
                                  <div
                                    key={emp.email}
                                    className="relative group"
                                  >
                                    <div className="relative group">
                                      {emp.avatar ? (
                                        <img
                                          src={emp.avatar}
                                          alt={emp.name || emp.email}
                                          className="inline-block w-7 h-7 rounded-full border border-gray-300"
                                        />
                                      ) : (
                                        <span className="inline-flex w-7 h-7 bg-gray-200 rounded-full items-center justify-center text-gray-600 text-xs font-medium">
                                          {getInitials(emp.name || emp.email)}
                                        </span>
                                      )}
                                      <span className="absolute left-1/2 transform -translate-x-1/2 top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                                        {emp.name || emp.email}
                                      </span>
                                    </div>

                                    <span className="absolute left-1/2 transform -translate-x-1/2 top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                      {emp.name}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="relative group">
                                  <span className="inline-flex w-6 h-6 bg-gray-100 rounded-full items-center justify-center text-gray-600 text-xs font-medium">
                                    UN
                                  </span>
                                  <span className="absolute left-1/2 transform -translate-x-1/2 top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    Unassigned
                                  </span>
                                </div>
                              )}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="font-semibold">Task Type:</span>{" "}
                            <span
                              className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(
                                task.taskType
                              )}`}
                            >
                              {task.taskType}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="font-semibold">Priority:</span>{" "}
                            <span
                              className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <div className="col-span-full text-center">
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

                {/* Modal: Create/Edit Task */}

                {/* NEW MODAL  */}

                {(isModalOpen || isEditModalOpen) && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditModalOpen(false);
                      setFormData(initialForm);
                      setEditId(null);
                      setSelectedFiles([]);
                      setEmployeeSearchTerm("");
                    }}
                  >
                    <div
                      className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-4 max-h-[90vh] overflow-y-auto relative"
                      onClick={(e) => e.stopPropagation()} // <-- Add this!
                    >
                      {/* Sticky Close Button */}
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setIsEditModalOpen(false);
                          setFormData(initialForm);
                          setEditId(null);
                          setSelectedFiles([]);
                          setEmployeeSearchTerm("");
                        }}
                        className="text-gray-500 hover:text-gray-700 absolute top-2 right-2 z-50"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <form
                        onSubmit={(e) =>
                          handleSubmit(e, isEditModalOpen && false)
                        }
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
                            onChange={(e) =>
                              setEmployeeSearchTerm(e.target.value)
                            }
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
                                    <p className="text-sm text-gray-500">
                                      {employee.position}
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
                                  onClick={() =>
                                    handleEmployeeRemove(emp.email)
                                  }
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
                              {/* Show badge for computed status (including Pending) */}
                              <span
                                className={`mb-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  getDisplayStatus(formData)
                                )}`}
                              >
                                {getDisplayStatus(formData)}
                              </span>
                              {/* Only allow changing to editable statuses, not Pending */}
                              <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mt-2"
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
                                    onClick={() =>
                                      handleAttachmentRemove(index)
                                    }
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
                            <span>
                              {editId ? "Update Task" : "Create Task"}
                            </span>
                          </button>
                        </div>
                      </form>
                      {/* Modal content */}
                    </div>
                  </div>
                )}

                {/* Modal: View Task */}
                {isViewModalOpen && viewTask && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
                    onClick={() => setIsViewModalOpen(false)} // Close when clicking outside
                    aria-modal="true"
                    role="dialog"
                  >
                    <div
                      className="bg-white rounded-lg shadow-xl w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-6xl p-2 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto relative"
                      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                      {/* Sticky Close Button */}
                      <button
                        onClick={() => setIsViewModalOpen(false)}
                        disabled={isLoading}
                        className="text-gray-500 hover:text-black absolute top-2 right-2 z-50"
                        aria-label="Close modal"
                      >
                        <X className="w-6 h-6" />
                      </button>

                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-2">
                          <h2 className="text-lg sm:text-xl font-semibold">
                            {viewTask.taskName}
                          </h2>
                          {isOverdue(viewTask.dueDate, viewTask.status) && (
                            <AlertCircle className="text-red-500 w-5 h-5" />
                          )}
                        </div>
                        {/* The close button above replaces the original */}
                      </div>

                      <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2">
                          Description
                        </p>
                        <p className="text-gray-800 text-sm">
                          {viewTask.description || "None"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">
                            Task Type
                          </p>
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
                              getDisplayStatus(viewTask)
                            )}`}
                          >
                            {getDisplayStatus(viewTask)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Priority</p>
                          <span
                            className={`px-1 py-1 rounded-full text-xs font-medium ${getPriorityColor(
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
                            {viewTask.dueTime !== "N/A" &&
                              ` ${viewTask.dueTime}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">
                            Assigned To
                          </p>
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
                          <p className="text-sm text-gray-500 mb-2">
                            Assigned By
                          </p>
                          <p className="text-sm text-gray-800">
                            {viewTask.assignedBy}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Task ID</p>
                          <p className="text-sm text-gray-800">
                            {viewTask.taskId}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">
                            Assigned Date
                          </p>
                          <p className="text-sm text-gray-800">
                            {viewTask.assignedDateTime
                              ? new Date(
                                  viewTask.assignedDateTime
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2">
                          Attachments
                        </p>
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
                          {/* You can add other tabs if needed */}
                        </div>
                        <div className="p-4 bg-gray-50 rounded-b-md">
                          {activeTab === "all" &&
                          viewTask.fileUrls?.length > 0 ? (
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
                          ) : (
                            <p className="text-sm text-gray-400">
                              No attachments
                            </p>
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
                        <p className="text-sm text-gray-500 mb-2">Comments</p>
                        <form
                          onSubmit={handleAddComment}
                          className="flex gap-2 mb-4"
                        >
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
                            aria-label="Submit comment"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </form>
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          {viewTask.comments.length > 0 ? (
                            [...viewTask.comments]
                              .sort(
                                (a, b) =>
                                  new Date(b.timestamp) - new Date(a.timestamp)
                              )
                              .slice(
                                0,
                                showFullComments ? viewTask.comments.length : 1
                              )
                              .map((comment, index) => (
                                <div
                                  key={index}
                                  className={`mb-3 pb-2 border-b border-gray-200 last:border-b-0 last:mb-0 ${
                                    index === 0
                                      ? "bg-yellow-100 p-2 rounded"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div>
                                      <p className="text-gray-800 text-sm">
                                        {comment.message || "No message"}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {comment.userName ||
                                          comment.user ||
                                          "Unknown User"}{" "}
                                        •{" "}
                                        {new Date(
                                          comment.timestamp
                                        ).toLocaleString()}
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
                            <p className="text-gray-400 text-sm">
                              No comments yet.
                            </p>
                          )}
                          {viewTask.comments &&
                            viewTask.comments.length > 1 && (
                              <button
                                onClick={() =>
                                  setShowFullComments(!showFullComments)
                                }
                                className="mt-2 text-blue-600 text-sm hover:underline"
                                disabled={isLoading}
                              >
                                {showFullComments ? "Hide" : "Show More"}
                              </button>
                            )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2">
                          Activity Log
                        </p>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          {viewTask.activityLogs &&
                          viewTask.activityLogs.length > 0 ? (
                            viewTask.activityLogs
                              .slice(
                                0,
                                showFullComments
                                  ? viewTask.activityLogs.length
                                  : 1
                              )
                              .map((log, index) => (
                                <div key={index} className="mb-2 last:mb-0">
                                  <p className="text-gray-700">
                                    {log.message || "No message"}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {log.user || "Unknown User"} •{" "}
                                    {new Date(
                                      log.timestamp || Date.now()
                                    ).toLocaleString()}
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
                                onClick={() =>
                                  setShowFullComments(!showFullComments)
                                }
                                className="mt-2 text-blue-600 text-sm hover:underline"
                                disabled={isLoading}
                              >
                                {showFullComments ? "Hide" : "Show More"}
                              </button>
                            )}
                        </div>
                      </div>

                      <div className="flex justify-end mt-6 space-x-4">
                        <button
                          onClick={() => handleEditFromView(viewTask)}
                          className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          title="Edit Task"
                          disabled={isLoading}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
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

                {/* Modal: Confirm Delete */}
                {showDeleteConfirm && taskToDelete && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setTaskToDelete(null);
                    }}
                    aria-modal="true"
                    role="dialog"
                  >
                    <div
                      className="bg-white rounded-lg shadow-xl w-full max-w-md p-2 sm:p-4 md:p-6 relative"
                      onClick={(e) => e.stopPropagation()} // Stop propagation to prevent overlay close
                    >
                      {/* Sticky Close Button */}
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setTaskToDelete(null);
                        }}
                        className="text-gray-500 hover:text-gray-700 absolute top-2 right-2 z-50"
                        disabled={isLoading}
                        aria-label="Close modal"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Confirm Deletion
                        </h2>
                      </div>
                      <p className="text-gray-700 mb-4 text-sm">
                        Are you sure you want to delete the task "
                        {taskToDelete.taskName}" (Task ID: {taskToDelete.taskId}
                        )? This action cannot be undone.
                      </p>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setTaskToDelete(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteTask(taskToDelete.taskId)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal: Remainder Email */}
                {showRemainderEmailModal && remainderEmailTask && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
                    onClick={() => {
                      setShowRemainderEmailModal(false);
                      setRemainderEmailTask(null);
                      setRemainderEmailBody("");
                    }}
                    aria-modal="true"
                    role="dialog"
                  >
                    <div
                      className="bg-white rounded-lg shadow-xl w-full max-w-lg p-2 sm:p-6 relative"
                      onClick={(e) => e.stopPropagation()} // Stop propagation to prevent overlay close
                    >
                      {/* Sticky Close Button */}
                      <button
                        onClick={() => {
                          setShowRemainderEmailModal(false);
                          setRemainderEmailTask(null);
                          setRemainderEmailBody("");
                        }}
                        className="text-gray-500 hover:text-gray-700 absolute top-2 right-2 z-50"
                        disabled={isSendingRemainderEmail}
                        aria-label="Close modal"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Send Reminder Email
                        </h2>
                      </div>

                      <div className="mb-4">
                        <div className="mb-2 text-sm text-gray-700">
                          <span className="font-semibold">To:</span>{" "}
                          {remainderEmailTask.assignedTo
                            .map((emp) => emp.email)
                            .join(", ")}
                        </div>
                        <div className="mb-2 text-sm text-gray-700">
                          <span className="font-semibold">Task:</span>{" "}
                          {remainderEmailTask.taskName}
                        </div>
                        <div className="mb-2 text-sm text-gray-700">
                          <span className="font-semibold">Due:</span>{" "}
                          {remainderEmailTask.dueDate
                            ? new Date(
                                remainderEmailTask.dueDate
                              ).toLocaleDateString()
                            : "N/A"}{" "}
                          {remainderEmailTask.dueTime !== "N/A" &&
                            remainderEmailTask.dueTime}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Body
                        </label>
                        <textarea
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={7}
                          value={remainderEmailBody}
                          onChange={(e) =>
                            setRemainderEmailBody(e.target.value)
                          }
                          disabled={isSendingRemainderEmail}
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => {
                            setShowRemainderEmailModal(false);
                            setRemainderEmailTask(null);
                            setRemainderEmailBody("");
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                          disabled={isSendingRemainderEmail}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSendRemainderEmail}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
                          disabled={isSendingRemainderEmail}
                          aria-label="Send reminder email"
                        >
                          {isSendingRemainderEmail ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          Send Email
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

export default AdmintaskPage;
