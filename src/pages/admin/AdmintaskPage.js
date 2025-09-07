// // // =============================================BELOW IS THE CODE FOR MULTIPLE FILTER SELECTION=================================================
// // // =============================================BELOW IS THE CODE FOR MULTIPLE FILTER SELECTION=================================================
// // // =============================================BELOW IS THE CODE FOR MULTIPLE FILTER SELECTION=================================================

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Plus,
  X,
  Send,
  Loader,
  Upload,
  Download,
  Mail,
  MessageCircle,
  Filter,
  FunnelX,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Lottie from "lottie-react";
import AdminSidebar from "../../components/common/AdminSidebar";
import Header from "../../components/common/Header";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import * as XLSX from "xlsx";
import loaderAnimation from "../../assets/animations/loader.json";

// Helper functions
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date)) return "N/A";
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const taskTypes = ["Auctions", "General", "Reminder"];
const priorities = ["High", "Medium", "Low"];
const statusOptions = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Hold", label: "Hold" },
  { value: "Complete", label: "Complete" },
  { value: "Archive", label: "Archive" },
  { value: "Pending", label: "Pending" },
];

const getDisplayStatus = (task) => {
  if (
    isOverdue(task.dueDate, task.dueTime, task.status) &&
    task.status !== "Complete"
  ) {
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

const isOverdue = (dueDate, dueTime, status) => {
  if (!dueDate) return false;
  if (status === "Complete" || status === "Archive" || status === "Hold")
    return false;
  let due;
  try {
    due = new Date(dueDate);
    if (isNaN(due)) {
      console.error(`Invalid dueDate format: ${dueDate}`);
      return false;
    }
  } catch (error) {
    console.error(`Error parsing dueDate: ${dueDate}`, error);
    return false;
  }

  if (typeof dueTime === "string" && dueTime !== "N/A") {
    const [hours, minutes] = dueTime.split(":").map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      due.setHours(hours, minutes, 0, 0);
    } else {
      due.setHours(23, 59, 59, 999);
    }
  } else {
    due.setHours(23, 59, 59, 999);
  }

  const now = new Date();
  return due < now && status !== "Complete";
};

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "UN";
  const nameParts = name.trim().split(" ");
  return nameParts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const ADMIN_EMAIL = "admin@company.com";

const AdmintaskPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterTaskType, setFilterTaskType] = useState("all");
  const [filterEmployee, setFilterEmployee] = useState([]);
  const [sortBy, setSortBy] = useState("taskId");
  const [dueDateSort, setDueDateSort] = useState("none");
  const [showDueDateSortDropdown, setShowDueDateSortDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [showFullComments, setShowFullComments] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [activeTab, setActiveTab] = useState("comments");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showModalEmployeeDropdown, setShowModalEmployeeDropdown] =
    useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [filterEmployeeSearch, setFilterEmployeeSearch] = useState("");
  const [showRemainderEmailModal, setShowRemainderEmailModal] = useState(false);
  const [remainderEmailTask, setRemainderEmailTask] = useState(null);
  const [remainderEmailBody, setRemainderEmailBody] = useState("");
  const [isSendingRemainderEmail, setIsSendingRemainderEmail] = useState(false);
  const [unseenComments, setUnseenComments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("unseen_comments_admin") || "{}");
    } catch {
      return {};
    }
  });

  const [isPageLoading, setIsPageLoading] = useState(false);

  // const [sort, setSort] = useState({ column: "taskId", direction: "desc" });
  const [sort, setSort] = useState({ column: null, direction: "asc" });

  const [dueDateFilter, setDueDateFilter] = useState("none");
  const [customDueDate, setCustomDueDate] = useState(null);
  const [showDueDateFilterDropdown, setShowDueDateFilterDropdown] =
    useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [currentStatusTab, setCurrentStatusTab] = useState("All");
  const [totalTasks, setTotalTasks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const history = useNavigate ();
  const queryParams = new URLSearchParams(location.search);
  const initialLimit = parseInt(queryParams.get("limit")) || 25;
  const initialPage = parseInt(queryParams.get("page")) || 1;
  const [pageSize, setPageSize] = useState(initialLimit);
  const employeeDropdownRef = useRef(null);
  const modalEmployeeDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const dueDateDropdownRef = useRef(null);
  const deleteModalRef = useRef(null);
  const reminderModalRef = useRef(null);
  const dueDateFilterRef = useRef(null);
  const customDateModalRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  const isFilterApplied = () => {
    return (
      searchTerm !== "" ||
      filterStatus.length > 0 ||
      filterPriority !== "all" ||
      filterTaskType !== "all" ||
      filterEmployee.length > 0 ||
      dueDateSort !== "none" ||
      dueDateFilter !== "none"
    );
  };

  const handleSort = (column) => {
    setSort((prev) => {
      if (prev.column === column) {
        return {
          ...prev,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return { column, direction: "asc" };
      }
    });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterStatus([]);
    setFilterPriority("all");
    setFilterTaskType("all");
    setFilterEmployee([]);
    setDueDateSort("none");
    setDueDateFilter("none");
    setCustomDueDate(null);
    setCustomDateRange({ start: "", end: "" });
    setCurrentStatusTab("All");
  };

  const updateUnseenComments = (newState) => {
    setUnseenComments(newState);
    localStorage.setItem("unseen_comments_admin", JSON.stringify(newState));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showEmployeeDropdown &&
        employeeDropdownRef.current &&
        !employeeDropdownRef.current.contains(event.target)
      ) {
        setShowEmployeeDropdown(false);
      }
      if (
        showModalEmployeeDropdown &&
        modalEmployeeDropdownRef.current &&
        !modalEmployeeDropdownRef.current.contains(event.target)
      ) {
        setShowModalEmployeeDropdown(false);
      }
      if (
        showStatusDropdown &&
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setShowStatusDropdown(false);
      }
      if (
        showDueDateSortDropdown &&
        dueDateDropdownRef.current &&
        !dueDateDropdownRef.current.contains(event.target)
      ) {
        setShowDueDateSortDropdown(false);
      }
      if (
        showDueDateFilterDropdown &&
        dueDateFilterRef.current &&
        !dueDateFilterRef.current.contains(event.target)
      ) {
        setShowDueDateFilterDropdown(false);
      }
      if (
        showCustomDateModal &&
        customDateModalRef.current &&
        !customDateModalRef.current.contains(event.target)
      ) {
        setShowCustomDateModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    showEmployeeDropdown,
    showModalEmployeeDropdown,
    showStatusDropdown,
    showDueDateSortDropdown,
    showDueDateFilterDropdown,
    showCustomDateModal,
  ]);

  useEffect(() => {
    if (!showRemainderEmailModal) return;
    function handleReminderOutside(event) {
      if (
        reminderModalRef.current &&
        !reminderModalRef.current.contains(event.target)
      ) {
        setShowRemainderEmailModal(false);
      }
    }
    document.addEventListener("mousedown", handleReminderOutside);
    return () =>
      document.removeEventListener("mousedown", handleReminderOutside);
  }, [showRemainderEmailModal]);

  useEffect(() => {
    if (!showDeleteConfirm) return;
    function handleDeleteOutside(event) {
      if (
        deleteModalRef.current &&
        !deleteModalRef.current.contains(event.target)
      ) {
        setShowDeleteConfirm(false);
      }
    }
    document.addEventListener("mousedown", handleDeleteOutside);
    return () => document.removeEventListener("mousedown", handleDeleteOutside);
  }, [showDeleteConfirm]);

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;
    const newUnseen = { ...unseenComments };
    tasks.forEach((task) => {
      if (!task.comments || !Array.isArray(task.comments)) return;
      const hasUnseen = task.comments.some(
        (c) =>
          c.user &&
          c.user !== ADMIN_EMAIL &&
          (!unseenComments[task._id] ||
            !unseenComments[task._id].includes(c.timestamp))
      );
      if (hasUnseen) {
        const unseenTimestamps = task.comments
          .filter(
            (c) =>
              c.user &&
              c.user !== ADMIN_EMAIL &&
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
  }, [tasks]);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await fetch(
//           "https://task-manager-backend-vqen.onrender.com/api/admin/allemployees",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!response.ok) {
//           throw new Error(`Failed to fetch employees: ${response.statusText}`);
//         }
//         const data = await response.json();
//         const validEmployees = Array.isArray(data)
//           ? data.map((emp) => ({
//               id: emp.id || emp._id || "",
//               name: emp.firstName || emp.name || "Unknown",
//               email: emp.email || "",
//               department: emp.department || "Unknown",
//               position: emp.position || "Employee",
//               avatar: emp.profileImage || "",
//             }))
//           : [];
//         setEmployees(validEmployees);
//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching employees:", err);
//       }
//     };

// const fetchTasks = async () => {
//   try {
//     const response = await fetch(
//       `https://task-manager-backend-vqen.onrender.com/api/admin/gettasks?limit=${pageSize}&page=${currentPage}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       throw new Error(`Failed to fetch tasks: ${response.statusText}`);
//     }
//     const data = await response.json();

//     console.log("Raw tasks data from API:", data);
//     const months = {
//       Jan: "01",
//       Feb: "02",
//       Mar: "03",
//       Apr: "04",
//       May: "05",
//       Jun: "06",
//       Jul: "07",
//       Aug: "08",
//       Sep: "09",
//       Oct: "10",
//       Nov: "11",
//       Dec: "12",
//     };
//     const validTasks = Array.isArray(data.tasks)
//       ? data.tasks.map((task) => {
//           let formattedDueDate = "";
//           if (task.dueDate) {
//             if (/^\d{2}\/\d{2}\/\d{4}$/.test(task.dueDate)) {
//               const [day, month, year] = task.dueDate.split("/");
//               formattedDueDate = `${year}-${month}-${day}`;
//               const testDate = new Date(formattedDueDate);
//               if (isNaN(testDate)) {
//                 console.warn(
//                   `Invalid dueDate for task ${task.taskId}: ${task.dueDate}`
//                 );
//                 formattedDueDate = "Invalid Date";
//               }
//             } else if (/^\d{2}\/[A-Za-z]{3}\/\d{4}$/.test(task.dueDate)) {
//               const [day, month, year] = task.dueDate.split("/");
//               if (months[month]) {
//                 formattedDueDate = `${year}-${months[month]}-${day}`;
//                 const testDate = new Date(formattedDueDate);
//                 if (isNaN(testDate)) {
//                   console.warn(
//                     `Invalid dueDate for task ${task.taskId}: ${task.dueDate}`
//                   );
//                   formattedDueDate = "Invalid Date";
//                 }
//               } else {
//                 console.warn(
//                   `Invalid month in dueDate for task ${task.taskId}: ${task.dueDate}`
//                 );
//                 formattedDueDate = "Invalid Date";
//               }
//             } else {
//               console.warn(
//                 `Unrecognized dueDate format for task ${task.taskId}: ${task.dueDate}`
//               );
//               formattedDueDate = "Invalid Date";
//             }
//           } else {
//             formattedDueDate = "N/A";
//           }

//           const assignedTo = Array.isArray(task.assignedTo)
//             ? task.assignedTo.map((email) => {
//                 const employee = employees.find((emp) => emp.email === email);
//                 return {
//                   email: email || "",
//                   name: employee ? employee.name : email || "Unknown",
//                   avatar: employee ? employee.avatar : "",
//                 };
//               })
//             : [];
//           return {
//             _id: task._id || "",
//             taskId: task.taskId || 0,
//             taskName: task.taskName || "",
//             description: task.description || "",
//             dueDate: formattedDueDate,
//             dueTime: task.dueTime || "N/A",
//             priority: task.priority || "Low",
//             status: task.status || "Open",
//             assignedBy: task.assignedBy || "admin@company.com",
//             assignedTo,
//             taskType: task.taskType || "General",
//             fileUrls: task.fileUrls || [],
//             assignedDateTime: task.assignedDateTime || "",
//             activityLogs: task.activityLogs || [],
//             comments: task.comments || [],
//             remark: task.remark || "",
//           };
//         })
//       : [];
//     console.log("valid tasks are here check this out:", validTasks);
//     setTasks(validTasks);
//     setTotalTasks(data.pagination.total || validTasks.length); // Use data.pagination.total
//     console.log("Total tasks from API:", data.pagination.total || validTasks.length);
//     localStorage.setItem("tasks_stepper", JSON.stringify(validTasks));
//     console.log("tasks from localStorage:", JSON.parse(localStorage.getItem("tasks_stepper")));
//   } catch (err) {
//     setError(err.message);
//     console.error("Error fetching tasks:", err);
//   } finally {
//     setIsInitialLoading(false);
//   }
// };
//     if (token) {
//       fetchEmployees().then(() => {
//         fetchTasks().then(() => {
//           setIsInitialLoading(false);
//         });
//       });
//     } else {
//       setError("No authentication token found");
//       console.error("No token found in localStorage");
//       setIsInitialLoading(false);
//     }
//   // }, [token, currentPage, pageSize]);
//   }, [token, employees, currentPage, pageSize]);

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
    setIsPageLoading(true); // Set page loading to true
    try {
      const response = await fetch(
        `https://task-manager-backend-vqen.onrender.com/api/admin/gettasks?limit=${pageSize}&page=${currentPage}`,
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

      console.log("Raw tasks data from API:", data);
      const months = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };
      const validTasks = Array.isArray(data.tasks)
        ? data.tasks.map((task) => {
            let formattedDueDate = "";
            if (task.dueDate) {
              if (/^\d{2}\/\d{2}\/\d{4}$/.test(task.dueDate)) {
                const [day, month, year] = task.dueDate.split("/");
                formattedDueDate = `${year}-${month}-${day}`;
                const testDate = new Date(formattedDueDate);
                if (isNaN(testDate)) {
                  console.warn(
                    `Invalid dueDate for task ${task.taskId}: ${task.dueDate}`
                  );
                  formattedDueDate = "Invalid Date";
                }
              } else if (/^\d{2}\/[A-Za-z]{3}\/\d{4}$/.test(task.dueDate)) {
                const [day, month, year] = task.dueDate.split("/");
                if (months[month]) {
                  formattedDueDate = `${year}-${months[month]}-${day}`;
                  const testDate = new Date(formattedDueDate);
                  if (isNaN(testDate)) {
                    console.warn(
                      `Invalid dueDate for task ${task.taskId}: ${task.dueDate}`
                    );
                    formattedDueDate = "Invalid Date";
                  }
                } else {
                  console.warn(
                    `Invalid month in dueDate for task ${task.taskId}: ${task.dueDate}`
                  );
                  formattedDueDate = "Invalid Date";
                }
              } else {
                console.warn(
                  `Unrecognized dueDate format for task ${task.taskId}: ${task.dueDate}`
                );
                formattedDueDate = "Invalid Date";
              }
            } else {
              formattedDueDate = "N/A";
            }

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
              dueDate: formattedDueDate,
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
        : [];
      console.log("Valid tasks:", validTasks);
      setTasks(validTasks);
      setTotalTasks(data.pagination.total || validTasks.length);
      console.log("Total tasks from API:", data.pagination.total || validTasks.length);
      localStorage.setItem("tasks_stepper", JSON.stringify(validTasks));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tasks:", err);
    } finally {
      setIsInitialLoading(false);
      setIsPageLoading(false); // Set page loading to false when data is received
    }
  };

  if (token) {
    fetchEmployees().then(() => {
      fetchTasks();
    });
  } else {
    setError("No authentication token found");
    console.error("No token found in localStorage");
    setIsInitialLoading(false);
    setIsPageLoading(false);
  }
}, [token, currentPage, pageSize]);

  useEffect(() => {
    tasks.forEach((task) => {
      if (
        isOverdue(task.dueDate, task.dueTime, task.status) &&
        (task.status === "Open" || task.status === "In Progress") &&
        task.status !== "Pending"
      ) {
        handleUpdateTaskStatus(task.taskId, "Pending");
      }
    });
  }, [tasks]);

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
    setShowModalEmployeeDropdown(false);
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

  // const handleSubmit = async (e, isDraft = false) => {
  //   e.preventDefault();
  //   const errors = validateForm();
  //   const isEditing = !!editId;
  //   const wasPending =
  //     isEditing &&
  //     isOverdue(formData.dueDate, formData.dueTime, formData.status) &&
  //     getDisplayStatus(formData) === "Pending";
  //   const statusChanged =
  //     isEditing &&
  //     formData.status !== "Pending" &&
  //     formData.status !== getDisplayStatus(formData);

  //   let formattedDueDate = "";
  //   if (formData.dueDate) {
  //     const date = new Date(formData.dueDate);
  //     if (!isNaN(date)) {
  //       const day = String(date.getDate()).padStart(2, "0");
  //       const month = String(date.getMonth() + 1).padStart(2, "0");
  //       const year = date.getFullYear();
  //       formattedDueDate = `${day}-${month}-${year}`;
  //     } else {
  //       errors.dueDate = "Invalid due date format";
  //     }
  //   }

  //   if (
  //     wasPending &&
  //     statusChanged &&
  //     (!formData.dueDate || new Date(formData.dueDate) <= new Date())
  //   ) {
  //     errors.dueDate =
  //       "To update the status of an overdue task, please select a new future due date.";
  //   }
  //   if (Object.keys(errors).length > 0) {
  //     setFormData((prev) => ({ ...prev, errors }));
  //     return;
  //   }
  //   setIsLoading(true);
  //   const now = new Date();
  //   const assignedDateTime = now.toISOString();
  //   const formDataToSend = new FormData();
  //   formDataToSend.append("taskTitle", formData.taskName);
  //   formDataToSend.append("description", formData.description);
  //   formDataToSend.append("dueDate", formattedDueDate);
  //   formDataToSend.append("dueTime", formData.dueTime);
  //   formDataToSend.append("priority", formData.priority);
  //   formDataToSend.append("status", isDraft ? "Draft" : formData.status);
  //   formDataToSend.append("assignedBy", formData.assignedBy);
  //   formDataToSend.append(
  //     "assignedTo",
  //     JSON.stringify(formData.assignedTo.map((emp) => emp.email))
  //   );
  //   formDataToSend.append("taskType", formData.taskType);
  //   formDataToSend.append("remark", formData.remark || "");
  //   formDataToSend.append("assignedDateTime", assignedDateTime);
  //   selectedFiles.forEach((file, index) => {
  //     if (file instanceof File) {
  //       formDataToSend.append("file", file);
  //     } else {
  //       console.error(`Invalid file at index ${index}:`, file);
  //     }
  //   });
  //   if (editId && formData.fileUrls.length > 0) {
  //     formDataToSend.append("fileUrls", JSON.stringify(formData.fileUrls));
  //   }
  //   let taskToUpdate = null;
  //   if (editId) {
  //     taskToUpdate = tasks.find((task) => task._id === editId);
  //     if (!taskToUpdate) {
  //       setError("Task not found for the given editId");
  //       setIsLoading(false);
  //       return;
  //     }
  //   } else {
  //     formDataToSend.append("taskId", formData.taskId || generateTaskId(tasks));
  //   }
  //   try {
  //     const url = editId
  //       ? `https://task-manager-backend-vqen.onrender.com/api/admin/updatetask/${taskToUpdate?.taskId}`
  //       : "https://task-manager-backend-vqen.onrender.com/api/admin/createtask";
  //     const method = editId ? "PATCH" : "POST";
  //     const response = await fetch(url, {
  //       method: method,
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formDataToSend,
  //     });
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(
  //         errorData.message ||
  //           (editId ? "Failed to update task" : "Failed to create task")
  //       );
  //     }
  //     const updatedTask = await response.json();
  //     if (editId) {
  //       setTasks((prev) =>
  //         prev.map((task) =>
  //           task._id === editId
  //             ? {
  //                 ...updatedTask.task,
  //                 fileUrls: updatedTask.task.fileUrls || [],
  //                 dueDate: updatedTask.task.dueDate
  //                   ? updatedTask.task.dueDate.split("/").reverse().join("-")
  //                   : "",
  //                 assignedTo: updatedTask.task.assignedTo.map((email) => ({
  //                   email,
  //                   name:
  //                     employees.find((emp) => emp.email === email)?.name ||
  //                     email ||
  //                     "Unknown",
  //                   avatar:
  //                     employees.find((emp) => emp.email === email)?.avatar ||
  //                     "",
  //                 })),
  //               }
  //             : task
  //         )
  //       );
  //       showToast("Task updated successfully", "success");
  //     } else {
  //       setTasks((prev) => [
  //         ...prev,
  //         {
  //           ...updatedTask.task,
  //           fileUrls: updatedTask.task.fileUrls || [],
  //           dueDate: updatedTask.task.dueDate
  //             ? updatedTask.task.dueDate.split("/").reverse().join("-")
  //             : "",
  //           assignedTo: updatedTask.task.assignedTo.map((email) => ({
  //             email,
  //             name:
  //               employees.find((emp) => emp.email === email)?.name ||
  //               email ||
  //               "Unknown",
  //             avatar:
  //               employees.find((emp) => emp.email === email)?.avatar || "",
  //           })),
  //         },
  //       ]);
  //       showToast("Task created successfully", "success");
  //     }
  //     setIsModalOpen(false);
  //     setIsEditModalOpen(false);
  //     setFormData(initialForm);
  //     setEditId(null);
  //     setSelectedFiles([]);
  //     setEmployeeSearchTerm("");
  //   } catch (err) {
  //     setError(err.message);
  //     showToast(err.message || "Failed to submit task", "error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleSubmit = async (e, isDraft = false) => {
  e.preventDefault();
  const errors = validateForm();
  const isEditing = !!editId;
  const wasPending =
    isEditing &&
    isOverdue(formData.dueDate, formData.dueTime, formData.status) &&
    getDisplayStatus(formData) === "Pending";
  const statusChanged =
    isEditing &&
    formData.status !== "Pending" &&
    formData.status !== getDisplayStatus(formData);

  let formattedDueDate = "";
  if (formData.dueDate) {
    const date = new Date(formData.dueDate);
    if (!isNaN(date)) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      formattedDueDate = `${day}-${month}-${year}`;
    } else {
      errors.dueDate = "Invalid due date format";
    }
  }

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

  // 🔍 Debug Logging
  console.log("---- Task Submission Debug ----");
  console.log("Raw Due Date (formData.dueDate):", formData.dueDate);
  console.log("Formatted Due Date (sent to API):", formattedDueDate);
  console.log("Complete Payload being sent:");
  for (let [key, value] of formDataToSend.entries()) {
    console.log(`${key}:`, value);
  }
  console.log("--------------------------------");

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
                dueDate: updatedTask.task.dueDate
                  ? updatedTask.task.dueDate.split("/").reverse().join("-")
                  : "",
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
      showToast("Task updated successfully", "success");
    } else {
      setTasks((prev) => [
        ...prev,
        {
          ...updatedTask.task,
          fileUrls: updatedTask.task.fileUrls || [],
          dueDate: updatedTask.task.dueDate
            ? updatedTask.task.dueDate.split("/").reverse().join("-")
            : "",
          assignedTo: updatedTask.task.assignedTo.map((email) => ({
            email,
            name:
              employees.find((emp) => emp.email === email)?.name ||
              email ||
              "Unknown",
            avatar: employees.find((emp) => emp.email === email)?.avatar || "",
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
    });
    setEditId(task._id);
    setIsModalOpen(true);
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
    setActiveTab("comments");
    if (unseenComments[task._id]) {
      const newUnseen = { ...unseenComments };
      delete newUnseen[task._id];
      updateUnseenComments(newUnseen);
    }
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

  const handleOpenRemainderEmailModal = (task) => {
    setRemainderEmailTask(task);
    setRemainderEmailBody(
      `Hi, this is a reminder to complete the task before due date which is on ${
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"
      }${
        task.dueTime !== "N/A" ? " at " + task.dueTime : ""
      }.\n\nPlease ensure timely completion.`
    );
    setShowRemainderEmailModal(true);
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

  const toggleStatus = (value) => {
    setFilterStatus((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleEmployee = (email) => {
    setFilterEmployee((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const filteredEmployeesForModal = employees.filter(
    (emp) =>
      (emp.name &&
        typeof emp.name === "string" &&
        emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase())) ||
      (emp.department &&
        typeof emp.department === "string" &&
        emp.department.toLowerCase().includes(employeeSearchTerm.toLowerCase()))
  );

  const filteredEmployeesForFilter = employees.filter(
    (emp) =>
      (emp.name &&
        typeof emp.name === "string" &&
        emp.name.toLowerCase().includes(filterEmployeeSearch.toLowerCase())) ||
      (emp.department &&
        typeof emp.department === "string" &&
        emp.department
          .toLowerCase()
          .includes(filterEmployeeSearch.toLowerCase()))
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
      case "Reminder":
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

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const assignedByEmployee =
    viewTask && employees.find((emp) => emp.email === viewTask.assignedBy);

  const Tooltip = ({ children, text }) => (
    <span className="relative group">
      {children}
      <span className="absolute left-1/2 transform -translate-x-1/2 -top-7 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
        {text}
      </span>
    </span>
  );

  const handleStatusTabClick = (tab) => {
    setCurrentStatusTab(tab);
    if (tab === "All") {
      setFilterStatus([]);
    } else if (tab === "Open") {
      setFilterStatus(["Open"]);
    } else if (tab === "Not Started") {
      setFilterStatus(["Pending", "Archive", "In Progress", "Hold"]);
    } else if (tab === "Closed") {
      setFilterStatus(["Complete"]);
    }
  };

  const handleCustomDateSubmit = () => {
    if (customDateRange.start && customDateRange.end) {
      setDueDateFilter("custom");
      setShowCustomDateModal(false);
      setShowDueDateFilterDropdown(false);
    } else {
      showToast("Please select both start and end dates", "error");
    }
  };

const navigate = useNavigate();

// const handlePageChange = (page) => {
//   if (page >= 1 && page <= totalPages) {
//     setCurrentPage(page);
//     const newSearch = new URLSearchParams(location.search);
//     newSearch.set("page", page);
//     newSearch.set("limit", pageSize);
//     navigate(`${location.pathname}?${newSearch.toString()}`);
//   }
// };

// const handleLimitChange = (newLimit) => {
//   setPageSize(newLimit);
//   setCurrentPage(1); // Reset to first page
//   const newSearch = new URLSearchParams(location.search);
//   newSearch.set("limit", newLimit);
//   newSearch.set("page", 1);
//   navigate(`${location.pathname}?${newSearch.toString()}`);
// };



const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    setIsPageLoading(true); // Set loading to true during page change
    setCurrentPage(page);
    const newSearch = new URLSearchParams(location.search);
    newSearch.set("page", page);
    newSearch.set("limit", pageSize);
    navigate(`${location.pathname}?${newSearch.toString()}`);
  }
};

const handleLimitChange = (newLimit) => {
  setIsPageLoading(true); // Set loading to true during limit change
  setPageSize(newLimit);
  setCurrentPage(1); // Reset to first page
  const newSearch = new URLSearchParams(location.search);
  newSearch.set("limit", newLimit);
  newSearch.set("page", 1);
  navigate(`${location.pathname}?${newSearch.toString()}`);
};



  const matchesDueDate = (task) => {
    if (dueDateFilter === "none") return true;
    if (
      !task.dueDate ||
      task.dueDate === "N/A" ||
      task.dueDate === "Invalid Date"
    )
      return false;
    let taskDate;
    try {
      taskDate = new Date(task.dueDate);
      if (isNaN(taskDate.getTime())) return false;
    } catch (e) {
      return false;
    }
    const now = new Date();
    let start = new Date();
    let end = new Date();
    switch (dueDateFilter) {
      case "today":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "week":
        const day = now.getDay();
        start.setDate(now.getDate() - day);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        end = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        break;
      case "year":
        start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      case "custom":
        if (!customDateRange.start || !customDateRange.end) return false;
        try {
          start = new Date(customDateRange.start);
          end = new Date(customDateRange.end);
          if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
        } catch (e) {
          return false;
        }
        break;
      default:
        return true;
    }
    return taskDate >= start && taskDate <= end;
  };

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
      filterStatus.length === 0 || filterStatus.includes(displayStatus);
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesTaskType =
      filterTaskType === "all" || task.taskType === filterTaskType;
    const matchesEmployee =
      filterEmployee.length === 0 ||
      task.assignedTo.some((emp) => filterEmployee.includes(emp.email));
    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesTaskType &&
      matchesEmployee &&
      matchesDueDate(task)
    );
  });

  // const sortedTasks = [...filteredTasks].sort((a, b) => {
  //   let valA, valB;
  //   switch (sort.column) {
  //     case "taskId":
  //       valA = a.taskId;
  //       valB = b.taskId;
  //       return sort.direction === "asc" ? valA - valB : valB - valA;
  //     case "taskName":
  //       return sort.direction === "asc"
  //         ? a.taskName.localeCompare(b.taskName)
  //         : b.taskName.localeCompare(a.taskName);
  //     case "priority":
  //       const priorityOrder = { High: 3, Medium: 2, Low: 1 };
  //       valA = priorityOrder[a.priority] || 0;
  //       valB = priorityOrder[b.priority] || 0;
  //       return sort.direction === "asc" ? valA - valB : valB - valA;
  //     case "status":
  //       const statusOrder = {
  //         Open: 1,
  //         "In Progress": 2,
  //         Hold: 3,
  //         Archive: 4,
  //         Pending: 5,
  //         Complete: 6,
  //       };
  //       valA = statusOrder[getDisplayStatus(a)] || 0;
  //       valB = statusOrder[getDisplayStatus(b)] || 0;
  //       return sort.direction === "asc" ? valA - valB : valB - valA;
  //     case "assignedTo":
  //       valA = a.assignedTo[0]?.name || "";
  //       valB = b.assignedTo[0]?.name || "";
  //       return sort.direction === "asc"
  //         ? valA.localeCompare(valB)
  //         : valB.localeCompare(valA);
  //     case "dueDate":
  //       valA = new Date(a.dueDate || "9999-12-31").getTime();
  //       valB = new Date(b.dueDate || "9999-12-31").getTime();
  //       return sort.direction === "asc" ? valA - valB : valB - valA;
  //     default:
  //       return 0;
  //   }
  // });


  const sortedTasks =
  sort.column === null
    ? filteredTasks // keep API order, no reshuffle
    : [...filteredTasks].sort((a, b) => {
        let valA, valB;
        switch (sort.column) {
          case "taskId":
            valA = a.taskId;
            valB = b.taskId;
            return sort.direction === "asc" ? valA - valB : valB - valA;
          case "taskName":
            return sort.direction === "asc"
              ? a.taskName.localeCompare(b.taskName)
              : b.taskName.localeCompare(a.taskName);
          case "priority":
            const priorityOrder = { High: 3, Medium: 2, Low: 1 };
            valA = priorityOrder[a.priority] || 0;
            valB = priorityOrder[b.priority] || 0;
            return sort.direction === "asc" ? valA - valB : valB - valA;
          case "status":
            const statusOrder = {
              Open: 1,
              "In Progress": 2,
              Hold: 3,
              Archive: 4,
              Pending: 5,
              Complete: 6,
            };
            valA = statusOrder[getDisplayStatus(a)] || 0;
            valB = statusOrder[getDisplayStatus(b)] || 0;
            return sort.direction === "asc" ? valA - valB : valB - valA;
          case "assignedTo":
            valA = a.assignedTo[0]?.name || "";
            valB = b.assignedTo[0]?.name || "";
            return sort.direction === "asc"
              ? valA.localeCompare(valB)
              : valB.localeCompare(valA);
          case "dueDate":
            valA = new Date(a.dueDate || "9999-12-31").getTime();
            valB = new Date(b.dueDate || "9999-12-31").getTime();
            return sort.direction === "asc" ? valA - valB : valB - valA;
          default:
            return 0;
        }
      });


const totalPages = Math.ceil(totalTasks / pageSize);
console.log("Calculated totalPages:", totalPages);  
// const paginatedTasks = sortedTasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);
const paginatedTasks = sortedTasks;


console.log("Filtered tasks:", filteredTasks);
console.log("Sorted tasks:", sortedTasks);
console.log("Paginated tasks:", paginatedTasks);

  return (
    <div className="flex min-h-screen bg-white relative">
      <div className="sticky top-0 h-screen z-40">
        <AdminSidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={!!token} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
          <div className="max-w-8xl mx-auto">
            <div className="mb-6">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <h2 className="text-lg sm:text-xl md:text-4xl font-bold text-blue-600">
                  My Tasks (Total: {totalTasks})
                </h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link to="/admin/createtasks">
                    <button
                      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base w-full sm:w-10 h-10"
                      title="Create Task"
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
                  {isFilterApplied() && (
                    <button
                      onClick={clearAllFilters}
                      className="p-2 bg-red-600 text-white rounded-md hover:bg-gray-700 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto h-10"
                      title="Clear Filters"
                      disabled={isLoading}
                    >
                      <FunnelX />
                    </button>
                  )}
                  <select
                    value={pageSize}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={isLoading}
                  >
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={75}>75 per page</option>
                    <option value={100}>100 per page</option>
                    <option value={500}>500 per page</option>
                  </select>
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
              <div className="flex overflow-x-auto gap-2 mb-4">
                <button
                  onClick={() => handleStatusTabClick("All")}
                  className={`px-4 py-2 rounded-md flex items-center text-sm font-medium ${
                    currentStatusTab === "All"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800"
                  }`}
                  disabled={isLoading}
                >
                  {/* <Filter className="w-4 h-4 mr-1" /> */}
                  All
                </button>
                <button
                  onClick={() => handleStatusTabClick("Open")}
                  className={`px-4 py-2 rounded-md flex items-center text-sm font-medium ${
                    currentStatusTab === "Open"
                      ? "bg-red-500 text-white"
                      : "bg-red-100 text-red-800"
                  }`}
                  disabled={isLoading}
                >
                  {/* <Filter className="w-4 h-4 mr-1" /> */}
                  New Tasks
                </button>
                <button
                  onClick={() => handleStatusTabClick("Not Started")}
                  className={`px-4 py-2 rounded-md flex items-center text-sm font-medium ${
                    currentStatusTab === "Not Started"
                      ? "bg-orange-400 text-white"
                      : "bg-orange-100 text-orange-800"
                  }`}
                  disabled={isLoading}
                >
                  {/* <Filter className="w-4 h-4 mr-1" /> */}
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusTabClick("Closed")}
                  className={`px-4 py-2 rounded-md flex items-center text-sm font-medium ${
                    currentStatusTab === "Closed"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-800"
                  }`}
                  disabled={isLoading}
                >
                  {/* <Filter className="w-4 h-4 mr-1" /> */}
                  Complete
                </button>
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
                <div className="relative min-w-[180px] max-w-full sm:min-w-[220px] sm:max-w-[220px]">
                  <div
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center justify-between w-full text-xs sm:text-sm"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <span className="flex flex-wrap items-center gap-1">
                      {filterStatus.length === 0 ? (
                        <>
                          <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 mr-2">
                            All
                          </span>
                          All Status
                        </>
                      ) : (
                        <>
                          <span className="flex flex-wrap gap-1">
                            {filterStatus.slice(0, 5).map((status, idx) => (
                              <Tooltip key={status} text={status}>
                                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 border border-gray-300">
                                  {status[0]}
                                </span>
                              </Tooltip>
                            ))}
                            {filterStatus.length > 5 && (
                              <Tooltip text={filterStatus.slice(5).join(", ")}>
                                <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 ml-1">
                                  +{filterStatus.length - 5}
                                </span>
                              </Tooltip>
                            )}
                          </span>
                          <span className="ml-2">Applied Status</span>
                        </>
                      )}
                    </span>
                  </div>
                  {showStatusDropdown && (
                    <div
                      ref={statusDropdownRef}
                      className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto min-w-[180px] max-w-full sm:min-w-[220px] sm:max-w-[220px]"
                    >
                      <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm">
                        <input
                          type="checkbox"
                          checked={filterStatus.length === 0}
                          onChange={() => setFilterStatus([])}
                          className="mr-2"
                          disabled={isLoading}
                        />
                        <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 mr-2">
                          All
                        </span>
                        <span>All Status</span>
                      </label>
                      {statusOptions.map((opt) => (
                        <label
                          key={opt.value}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={filterStatus.includes(opt.value)}
                            onChange={() => toggleStatus(opt.value)}
                            className="mr-2"
                            disabled={isLoading}
                          />
                          <Tooltip text={opt.label}>
                            <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 mr-2 border border-gray-300">
                              {opt.label[0]}
                            </span>
                          </Tooltip>
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
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
                <div className="relative min-w-[180px] max-w-full sm:min-w-[220px] sm:max-w-[220px]">
                  <div
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center justify-between text-xs sm:text-sm"
                    onClick={() =>
                      setShowEmployeeDropdown(!showEmployeeDropdown)
                    }
                  >
                    <span className="flex flex-wrap items-center gap-1">
                      {filterEmployee.length === 0 ? (
                        <>
                          <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 mr-2">
                            All
                          </span>
                          All Employees
                        </>
                      ) : (
                        <>
                          <span className="flex flex-wrap gap-1">
                            {filterEmployee.slice(0, 5).map((email, idx) => {
                              const emp = employees.find(
                                (e) => e.email === email
                              );
                              return (
                                <Tooltip key={email} text={emp?.name || email}>
                                  {emp?.avatar ? (
                                    <img
                                      src={emp.avatar}
                                      alt={emp.name}
                                      className="w-5 h-5 rounded-full border border-gray-300"
                                    />
                                  ) : (
                                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                                      {getInitials(emp?.name || "U")}
                                    </span>
                                  )}
                                </Tooltip>
                              );
                            })}
                            {filterEmployee.length > 5 && (
                              <Tooltip
                                text={filterEmployee
                                  .slice(5)
                                  .map((email) => {
                                    const emp = employees.find(
                                      (e) => e.email === email
                                    );
                                    return emp?.name || email;
                                  })
                                  .join(", ")}
                              >
                                <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 ml-1">
                                  +{filterEmployee.length - 5}
                                </span>
                              </Tooltip>
                            )}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                  {showEmployeeDropdown && (
                    <div
                      ref={employeeDropdownRef}
                      className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto min-w-[180px] max-w-full sm:min-w-[220px] sm:max-w-[220px]"
                    >
                      <input
                        type="text"
                        value={filterEmployeeSearch}
                        onChange={(e) =>
                          setFilterEmployeeSearch(e.target.value)
                        }
                        className="w-full px-3 py-2 border-b border-gray-300 text-xs sm:text-sm"
                        placeholder="Search by name "
                        disabled={isLoading}
                      />
                      <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm">
                        <input
                          type="checkbox"
                          checked={filterEmployee.length === 0}
                          onChange={() => setFilterEmployee([])}
                          className="mr-2"
                          disabled={isLoading}
                        />
                        <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 mr-2">
                          All
                        </span>
                        <span>All Employees</span>
                      </label>
                      {filteredEmployeesForFilter.map((emp) => (
                        <label
                          key={emp.email}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={filterEmployee.includes(emp.email)}
                            onChange={() => toggleEmployee(emp.email)}
                            className="mr-2"
                            disabled={isLoading}
                          />
                          <Tooltip text={emp.name || emp.email}>
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
                          </Tooltip>
                          <div>
                            <span className="text-gray-900">
                              {emp.name || "Unknown"}
                            </span>
                            <span className="block text-xs text-gray-500">
                              {emp.position || "Unknown"}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-full overflow-y-auto min-h-[65vh] max-h-[65vh]">
                <table className="w-full text-xs sm:text-sm table-fixed">
                  <thead className="bg-gray-100 border-gray-700 rounded-full sticky top-0 z-10 border-b border-gray-200">
                    <tr>
                      <th
                        className="w-20 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap cursor-pointer"
                        onClick={() => handleSort("taskId")}
                      >
                        <div className="flex items-center justify-center">
                          Task ID
                          {sort.column === "taskId" &&
                            (sort.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="w-1/3 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 cursor-pointer"
                        onClick={() => handleSort("taskName")}
                      >
                        <div className="flex items-center justify-center">
                          Task Name
                          {sort.column === "taskName" &&
                            (sort.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      {/* <th className="w-28 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap">
                        Task Type
                      </th> */}
                      {/* <th
                        className="w-28 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap cursor-pointer"
                        onClick={() => handleSort("priority")}
                      >
                        <div className="flex items-center justify-center">
                          Priority
                          {sort.column === "priority" &&
                            (sort.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th> */}
                        <th
                        className="w-32 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap cursor-pointer"
                        onClick={() => handleSort("assignedTo")}
                      >
                        <div className="flex items-center justify-center">
                          Assigned To
                          {sort.column === "assignedTo" &&
                            (sort.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                    
                    
                      <th
                        className="w-32 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap cursor-pointer relative"
                        onClick={() => handleSort("dueDate")}
                      >
                        <div className="flex items-center justify-center">
                          Due Date
                          {sort.column === "dueDate" &&
                            (sort.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                          <Filter
                            className="w-4 h-4 ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDueDateFilterDropdown(
                                !showDueDateFilterDropdown
                              );
                            }}
                          />
                        </div>
                        {showDueDateFilterDropdown && (
                          <div
                            ref={dueDateFilterRef}
                            className="absolute top-full left-0 z-20 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg"
                          >
                            <div className="py-1">
                              <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                                <input
                                  type="radio"
                                  name="dueFilter"
                                  checked={dueDateFilter === "none"}
                                  onChange={() => setDueDateFilter("none")}
                                  className="mr-2"
                                />
                                No Filter
                              </label>
                              <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                                <input
                                  type="radio"
                                  name="dueFilter"
                                  checked={dueDateFilter === "today"}
                                  onChange={() => setDueDateFilter("today")}
                                  className="mr-2"
                                />
                                Today
                              </label>
                              <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                                <input
                                  type="radio"
                                  name="dueFilter"
                                  checked={dueDateFilter === "week"}
                                  onChange={() => setDueDateFilter("week")}
                                  className="mr-2"
                                />
                                This Week
                              </label>
                              <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                                <input
                                  type="radio"
                                  name="dueFilter"
                                  checked={dueDateFilter === "month"}
                                  onChange={() => setDueDateFilter("month")}
                                  className="mr-2"
                                />
                                This Month
                              </label>
                              <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                                <input
                                  type="radio"
                                  name="dueFilter"
                                  checked={dueDateFilter === "year"}
                                  onChange={() => setDueDateFilter("year")}
                                  className="mr-2"
                                />
                                This Year
                              </label>
                              <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                                <input
                                  type="radio"
                                  name="dueFilter"
                                  checked={dueDateFilter === "custom"}
                                  onChange={() => {
                                    setDueDateFilter("custom");
                                    setShowCustomDateModal(true);
                                  }}
                                  className="mr-2"
                                />
                                Custom Date
                              </label>
                            </div>
                          </div>
                        )}
                      </th>
                        <th
                        className="w-28 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center justify-center">
                          Status
                          {sort.column === "status" &&
                            (sort.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th className="w-40 text-center py-3 px-2 sm:px-4 font-medium text-gray-700 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
            <tbody>
  {isInitialLoading || isPageLoading ? (
    <tr>
      <td colSpan="6" className="py-12 text-center">
        <Lottie
          animationData={loaderAnimation}
          loop={true}
          className="w-72 h-72 mx-auto"
        />
      </td>
    </tr>
  ) : paginatedTasks.length === 0 ? (
    <tr>
      <td colSpan="6" className="py-12 text-center text-gray-500">
        No tasks found matching your criteria <br />
        Try adjusting your filters
      </td>
    </tr>
  ) : (
    paginatedTasks.map((task) => (
      <tr
        key={task._id}
        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
          isOverdue(task.dueDate, task.dueTime, task.status) ? "bg-red-50" : ""
        }`}
        onClick={() => handleViewTask(task)}
      >
        <td className="py-4 px-2 sm:px-4 text-gray-900 text-center truncate">
          {task.taskId}
        </td>
        <td className="py-3 px-2 sm:px-4">
          <div className="relative group max-w-[500px]">
            <div className="font-medium text-gray-900 cursor-pointer">
              {task.taskName}
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-80 hidden group-hover:block bg-red-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50"
            >
              <span className="text-yellow-300">Task Name:</span> {task.taskName}
              <br />
              <span className="text-yellow-300">Task Description:</span>{" "}
              {task.description}
            </div>
          </div>
        </td>
        <td className="py-4 px-2 sm:px-4 text-gray-600 text-center">
          <span className="flex -space-x-1 justify-center">
            {Array.isArray(task.assignedTo) && task.assignedTo.length > 0 ? (
              task.assignedTo.map((emp) => (
                <div key={emp.email} className="relative group">
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
                  <span className="absolute left-1/2 transform -translate-x-1/2 top-8 bg-red-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                    {emp.email
                      .split("@")[0]
                      .replace(".", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
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
        <td className="py-4 px-2 sm:px-4 text-gray-600 text-center truncate">
          {formatDisplayDate(task.dueDate)}
          {/* {task.dueTime !== "N/A" && ` ${task.dueTime}`} */}
          {isOverdue(task.dueDate, task.dueTime, task.status) && (
            // <AlertCircle className="inline ml-2 text-red-600 w-4 h-4" />
            <span></span>
          )}
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
        <td className="py-4 px-2 sm:px-4 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleViewTask(task)}
              className="p-1 text-orange-600 hover:bg-orange-50 rounded relative"
              title="View Comments"
              disabled={isLoading}
            >
              <MessageCircle
                className={`w-4 h-4 ${
                  unseenComments[task._id] && unseenComments[task._id].length > 0
                    ? "text-orange-500 animate-pulse"
                    : "text-gray-600"
                }`}
              />
              {task.comments?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {task.comments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => confirmDelete(task)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Delete Task"
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
                </table>
                {/* {sortedTasks.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <div className="mb-4">
                        No tasks found matching your criteria
                      </div>
                      <div className="text-sm text-gray-400">
                        Try adjusting your search or filters
                      </div>
                    </div>
                  )} */}
              </div>
            </div>
         <div className="lg:hidden grid gap-4">
  {isInitialLoading ? (
    <div className="py-12 text-center">
      <Lottie
        animationData={loaderAnimation}
        loop={true}
        className="w-72 h-72 mx-auto"
      />
      {/* <span className="text-gray-500 animate-pulse">Loading Tasks...</span> */}
    </div>
  ) : paginatedTasks.length === 0 ? (
    <div className="text-center py-12 text-gray-500">
      <div className="mb-4">No tasks found matching your criteria </div>
      <div className="text-sm text-gray-400">
        Try adjusting your search or filters
      </div>
    </div>
  ) : (
    paginatedTasks.map((task) => (
      <div
        key={task._id}
        className={`border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-200 ${
          isOverdue(task.dueDate, task.dueTime, task.status) ? "bg-red-50" : ""
        }`}
        onClick={() => handleViewTask(task)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span
              className="font-bold text-sm sm:text-base"
              title={task.taskName}
            >
              {task.taskName}
            </span>
          </div>
          <div
            className="flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleViewTask(task)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              disabled={isLoading}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleOpenRemainderEmailModal(task)}
              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
              disabled={isLoading}
            >
              <Mail className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewTask(task)}
              className="p-1 text-orange-600 hover:bg-orange-50 rounded relative"
              disabled={isLoading}
            >
              <MessageCircle
                className={`w-4 h-4 ${
                  unseenComments[task._id] &&
                  unseenComments[task._id].length > 0
                    ? "text-orange-500 animate-pulse"
                    : "text-gray-600"
                }`}
              />
              {task.comments?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {task.comments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => confirmDelete(task)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task details */}
        <div className="mt-3 text-xs sm:text-sm grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-md">
          <div>
            <span className="font-semibold">Task ID:</span> {task.taskId}
          </div>
          <div>
            <span className="font-semibold">Assigned Date:</span>{" "}
            {formatDisplayDate(task.assignedDateTime)}
          </div>
          <div>
            <span className="font-semibold">Status:</span>
            <span
              className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                getDisplayStatus(task)
              )}`}
            >
              {getDisplayStatus(task)}
            </span>
          </div>
          <div>
            <span className="font-semibold">Due Date:</span>{" "}
            {formatDisplayDate(task.dueDate)}{" "}
            {task.dueTime !== "N/A" && ` ${task.dueTime}`}{" "}
            {isOverdue(task.dueDate, task.dueTime, task.status) && (
              <AlertCircle className="inline ml-1 text-red-600 w-4 h-4" />
            )}
          </div>
          <div>
            <span className="font-semibold">Assigned To:</span>{" "}
            <span className="flex -space-x-1 justify-start">
              {Array.isArray(task.assignedTo) && task.assignedTo.length > 0 ? (
                task.assignedTo.map((emp) => (
                  <div key={emp.email} className="relative group">
                    {emp.avatar ? (
                      <img
                        src={emp.avatar}
                        alt={emp.name || emp.email}
                        className="inline-block w-6 h-6 rounded-full border border-gray-300"
                      />
                    ) : (
                      <span className="inline-flex w-6 h-6 bg-gray-200 rounded-full items-center justify-center text-gray-600 text-xs font-medium">
                        {getInitials(emp.name || emp.email)}
                      </span>
                    )}
                    <span className="absolute left-1/2 transform -translate-x-1/2 top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                      {emp.name || emp.email}
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

            {/* Pagination */}
            {/* {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )} */}

                    {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0 sm:space-x-2">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, totalTasks)} of {totalTasks}{" "}
                  tasks
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}




            {/* Create/Edit Task Modal */}
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
                  setShowModalEmployeeDropdown(false); // Close modal dropdown
                }}
              >
                <div
                  className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-4 max-h-[90vh] overflow-y-auto relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditModalOpen(false);
                      setFormData(initialForm);
                      setEditId(null);
                      setSelectedFiles([]);
                      setEmployeeSearchTerm("");
                      setShowModalEmployeeDropdown(false); // Close modal dropdown
                    }}
                    className="text-gray-500 hover:text-gray-700 absolute top-2 right-2 z-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
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
                        onFocus={() => setShowModalEmployeeDropdown(true)} // Use modal-specific state
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Search employee by name or department"
                        disabled={isLoading}
                      />
                      {showModalEmployeeDropdown && ( // Use modal-specific state
                        <div
                          ref={modalEmployeeDropdownRef} // Use modal-specific ref
                          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                        >
                          {filteredEmployeesForFilter.map((employee) => (
                            <button
                              key={employee.id}
                              type="button"
                              onClick={() => handleEmployeeSelect(employee)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                              disabled={isLoading}
                            >
                              {employee.avatar ? (
                                <img
                                  src={employee.avatar}
                                  alt={employee.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                                  {getInitials(employee.name || "Unknown")}
                                </span>
                              )}
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
                            {emp.avatar ? (
                              <img
                                src={emp.avatar}
                                alt={emp.name}
                                className="w-5 h-5 rounded-full mr-2"
                              />
                            ) : (
                              <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs text-blue-700 mr-2">
                                {getInitials(emp.name || "Unknown")}
                              </span>
                            )}
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
                          <option value="Reminder">Reminder</option>
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
                          <span
                            className={`mb-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              getDisplayStatus(formData)
                            )}`}
                          >
                            {getDisplayStatus(formData)}
                          </span>
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
                        {/* <Loader2 className="w-6 h-6 text-blue-600 animate-spin" /> */}
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
                          setShowModalEmployeeDropdown(false); // Close modal dropdown
                        }}
                        className="px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      {/* <button
                        type="submit"
                        className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm"
                        disabled={isLoading}
                      >
                        <span>{editId ? "Update Task" : "Create Task"}</span>
                      </button> */}

                      <button
                        type="submit"
                        className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : null}
                        <span>{editId ? "Update Task" : "Create Task"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* View Task Modal */}
            {isViewModalOpen && viewTask && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
                onClick={() => setIsViewModalOpen(false)}
                aria-modal="true"
                role="dialog"
              >
                <div
                  className="bg-white rounded-lg shadow-xl w-full max-w-lg sm:max-w-2xl sm:max-w-3xl lg:max-w-6xl p-2 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto relative"
                  onClick={(e) => e.stopPropagation()}
                >
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
                      <h2 className="text-lg sm:text-xl font-bold">
                        {viewTask.taskName}
                      </h2>
                      {isOverdue(
                        viewTask.dueDate,
                        viewTask.dueTime,
                        viewTask.status
                      ) && <AlertCircle className="text-red-500 w-5 h-5" />}
                    </div>
                    <div className="flex space-x-2 mt-6">
                      <button
                        onClick={() => handleEditFromView(viewTask)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        disabled={isLoading}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleOpenRemainderEmailModal(viewTask)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                        disabled={isLoading}
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(viewTask)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">
                      {viewTask.description || "None"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                    {/* Added Assigned By */}
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Assigned By</p>
                      <div className="flex items-center space-x-2">
                        {assignedByEmployee?.avatar ? (
                          <img
                            src={assignedByEmployee.avatar}
                            alt={assignedByEmployee.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                            {getInitials(
                              assignedByEmployee?.name || viewTask.assignedBy
                            )}
                          </span>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-800">
                            {assignedByEmployee?.name || viewTask.assignedBy}
                          </span>
                          {assignedByEmployee?.email && (
                            <span className="text-xs text-gray-500">
                              {assignedByEmployee.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Added Task ID */}
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Task ID</p>
                      <p className="text-sm text-gray-800">{viewTask.taskId}</p>
                    </div>
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
                          ? new Date(viewTask.dueDate)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short", // gives "Aug"
                                year: "numeric",
                              })
                              .replace(/ /g, "/") // replaces spaces with "/"
                          : "N/A"}
                        {viewTask.dueTime !== "N/A" && ` ${viewTask.dueTime}`}
                      </p>
                    </div>

                    {/* <div>
                      <p className="text-sm text-gray-500 mb-2">Assigned To</p>
                      <p className="text-sm text-gray-800 break-words">
                        {Array.isArray(viewTask.assignedTo) &&
                        viewTask.assignedTo.length > 0
                          ? viewTask.assignedTo
                              .map((emp) => emp.name)
                              .join(", ")
                          : "Unassigned"}
                      </p>
                    </div> */}

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Assigned To</p>
                      <p className="text-sm text-gray-800 break-words">
                        {Array.isArray(viewTask.assignedTo) &&
                        viewTask.assignedTo.length > 0
                          ? viewTask.assignedTo
                              .map((emp) =>
                                emp.email
                                  .split("@")[0]
                                  .replace(".", " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())
                              )
                              .join(", ")
                          : "Unassigned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Assigned Date
                      </p>
                      <p className="text-sm">
                        {viewTask.assignedDateTime
                          ? new Date(viewTask.assignedDateTime)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short", // "Aug"
                                year: "numeric",
                              })
                              .replace(/ /g, "/") // 28/Aug/2025 format
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Remark</p>
                      <p className="text-sm text-gray-800">
                        {viewTask.remark || "None"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Attachments</p>
                    {viewTask.fileUrls && viewTask.fileUrls.length > 0 ? (
                      <div className="space-y-2">
                        {viewTask.fileUrls.map((url, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Upload className="w-4 h-4 text-gray-500" />
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline truncate"
                            >
                              {url.split("/").pop()}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-800">No attachments</p>
                    )}
                  </div>
                  <div className="mb-6">
                    <div className="flex border-b border-gray-200 mb-4">
                      <button
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === "all"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("all")}
                        disabled={isLoading}
                      >
                        Activity Logs
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === "comments"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("comments")}
                        disabled={isLoading}
                      >
                        Comments
                      </button>
                    </div>
                    {activeTab === "all" && (
                      <div className="space-y-4">
                        {/* {(viewTask.comments || [])
                          .concat(viewTask.activityLogs || []) */}

                        {(viewTask.activityLogs || [])
                          .sort(
                            (a, b) =>
                              new Date(b.timestamp) - new Date(a.timestamp)
                          )
                          .slice(0, showFullComments ? undefined : 3)
                          .map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3"
                            >
                              {/* Show image if available, else show avatar */}
                              {item.profileImage ? (
                                <img
                                  src={item.profileImage}
                                  alt={item.userName || item.user || "User"}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                                  {getInitials(
                                    item.userName || item.user || "Unknown"
                                  )}
                                </span>
                              )}
                              <div>
                                <p className="text-sm font-medium">
                                  {item.userName || item.user || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(item.timestamp).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-800">
                                  {item.message || item.action}
                                </p>
                              </div>
                            </div>
                          ))}
                        {viewTask.comments?.length +
                          viewTask.activityLogs?.length >
                          3 &&
                          !showFullComments && (
                            <button
                              onClick={() => setShowFullComments(true)}
                              className="text-blue-600 hover:underline text-sm"
                              disabled={isLoading}
                            >
                              Show more
                            </button>
                          )}
                      </div>
                    )}

                    {activeTab === "comments" && (
                      <div className="space-y-4">
                        <form
                          onSubmit={handleAddComment}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            name="comment"
                            placeholder="Add a comment..."
                            className="flex-1 h-10 px-3 py-2 border mb-4 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={isLoading}
                          />
                          <button
                            type="submit"
                            className="p-2  bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={isLoading}
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </form>
                        {(viewTask.comments || [])
                          .sort(
                            (a, b) =>
                              new Date(b.timestamp) - new Date(a.timestamp)
                          )
                          .slice(0, showFullComments ? undefined : 3)
                          .map((comment, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3"
                            >
                              <img
                                src={comment.profileImage || ""}
                                alt={comment.userName || "User"}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {comment.userName || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-800">
                                  {comment.message}
                                </p>
                              </div>
                            </div>
                          ))}
                        {viewTask.comments?.length > 3 && !showFullComments && (
                          <button
                            onClick={() => setShowFullComments(true)}
                            className="text-blue-600 hover:underline text-sm"
                            disabled={isLoading}
                          >
                            Show more
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && taskToDelete && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div
                  ref={deleteModalRef}
                  className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full"
                >
                  <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete the task "
                    {taskToDelete.taskName}"? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
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

            {/* Reminder Email Modal */}
            {showRemainderEmailModal && remainderEmailTask && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                <div
                  ref={reminderModalRef}
                  className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full relative"
                >
                  <button
                    onClick={() => setShowRemainderEmailModal(false)}
                    className="text-gray-500 hover:text-gray-700 absolute top-2 right-2"
                    disabled={isSendingRemainderEmail}
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-bold mb-4">
                    Send Reminder Email
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Sending reminder for task:{" "}
                    <strong>{remainderEmailTask.taskName}</strong>
                  </p>
                  <textarea
                    value={remainderEmailBody}
                    onChange={(e) => setRemainderEmailBody(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows="5"
                    placeholder="Enter reminder message"
                    disabled={isSendingRemainderEmail}
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-2">{error}</p>
                  )}
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      onClick={() => setShowRemainderEmailModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                      disabled={isSendingRemainderEmail}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendRemainderEmail}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm"
                      disabled={isSendingRemainderEmail}
                    >
                      {isSendingRemainderEmail ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Mail className="w-5 h-5" />
                      )}
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showCustomDateModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div
                  ref={customDateModalRef}
                  className="bg-white rounded-lg p-6 w-full max-w-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Select Date Range</h3>
                    <button
                      onClick={() => setShowCustomDateModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) =>
                        setCustomDateRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) =>
                        setCustomDateRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowCustomDateModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCustomDateSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {toast.show && (
              <div
                className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
                  toast.show ? "translate-y-4" : "-translate-y-full"
                }`}
              >
                <div
                  className={`p-4 rounded-md shadow-lg text-sm ${
                    toast.type === "success"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {toast.message}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdmintaskPage;


