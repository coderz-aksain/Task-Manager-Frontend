import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  X,
  Upload,
  Calendar,
  Bell,
  Mail,
  Smartphone,
  Clock,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Users,
  User,
  Clock3,
  Repeat,
  Star,
  Sparkles,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AdminSidebar from "../../components/common/AdminSidebar";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";
import { requestorsData } from "../employee/requestorsData";

// Placeholder categories (replace with actual categories if available)
const categories = [
  "Logistics",
  "Plant & Equipment",
  "Tools & Fixtures",
  "Civil & Interior",
  "Marketing",
  "IT",
  "Packaging",
  "MRO",
  "Facility Management Services",
  "Admin & Security",
  "Consultancy Services",
];

const forwardCategories = [
  "Category A",
  "Category B",
  "Category C",
  "Category D",
  "Category E",
  "Category F",
];

function CreateTasks({ onSubmit, editTask, onCancel }) {
  const [reminders, setReminders] = useState([
    {
      id: Date.now().toString(),
      taskName: editTask?.taskName || "",
      description: editTask?.description || "",
      dueDate: editTask?.dueDate || "",
      dueTime: editTask?.dueTime || "",
      assignedTo: editTask?.assignedTo || [],
      notificationEmail: editTask?.notificationEmail ?? true,
      notificationInApp: editTask?.notificationInApp ?? true,
      notificationAlarm: editTask?.notificationAlarm ?? false,
    },
  ]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const [dropActive, setDropActive] = useState(false);
  const [notificationDraft, setNotificationDraft] = useState("");
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const employeeDropdownRef = useRef(null);
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  // Local editable lists and UI state for adding new requestors/categories
  const [localRequestors, setLocalRequestors] = useState([]);
  const [showAddRequestor, setShowAddRequestor] = useState(false);
  const [newRequestor, setNewRequestor] = useState({
    name: "",
    client: "",
    division: "",
  });

  const [localCategories, setLocalCategories] = useState(() =>
    typeof categories !== "undefined" ? categories : []
  );
  const [localForwardCategories, setLocalForwardCategories] = useState(() =>
    typeof forwardCategories !== "undefined" ? forwardCategories : []
  );
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [requestorQuery, setRequestorQuery] = useState("");
  const [showRequestorSuggestions, setShowRequestorSuggestions] =
    useState(false);
  const filteredRequestors = localRequestors.filter((r) =>
    (r.requestorName || "")
      .toLowerCase()
      .includes((requestorQuery || "").toLowerCase())
  );
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "https://task-manager-backend-xs5s.onrender.com/api/admin/allemployees",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        const validEmployees = Array.isArray(data)
          ? data.map((emp) => ({
              id: emp.id || emp._id || "",
              name: emp.firstName || "Unknown",
              email: emp.email || "",
              department: emp.department || "Unknown",
              avatar: emp.profileImage || "",
            }))
          : [];
        setEmployees(validEmployees);
      } catch (err) {
        formik.setErrors({ api: err.message });
        showToast(err.message, "error");
      }
    };
    fetchEmployees();
  }, [token]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          "https://task-manager-backend-xs5s.onrender.com/api/admin/currentuser",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch current user");
        const data = await response.json();
        setCurrentUser({
          id: data.id || data._id,
          name: data.firstName || "Unknown",
          email: data.email,
          department: data.department || "Unknown",
          avatar: data.profileImage || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        employeeDropdownRef.current &&
        !employeeDropdownRef.current.contains(event.target)
      ) {
        setShowEmployeeDropdown(false);
      }
    };
    if (showEmployeeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmployeeDropdown]);

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.name &&
        typeof emp.name === "string" &&
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (emp.department &&
        typeof emp.department === "string" &&
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const showToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "" }), 5000);
  };

  const validationSchema = Yup.object({
    taskType: Yup.string().required("Task Type is required"),
    auctionType: Yup.string().when("taskType", {
      is: "Auction",
      then: (schema) => schema.required("Auction Type is required"),
      otherwise: (schema) => schema,
    }),
    taskName: Yup.string().when("taskType", {
      is: "Auction",
      then: (schema) => schema.required("Event Name is required"),
      otherwise: (schema) => schema,
    }),
    requestorName: Yup.string().when("taskType", {
      is: "Auction",
      then: (schema) => schema.required("Requestor Name is required"),
      otherwise: (schema) => schema,
    }),
    client: Yup.string().when("taskType", {
      is: "Auction",
      then: (schema) => schema.required("Client is required"),
      otherwise: (schema) => schema,
    }),
    division: Yup.string().when("taskType", {
      is: "Auction",
      then: (schema) => schema.required("Division is required"),
      otherwise: (schema) => schema,
    }),
    assignedTo: Yup.array().when("taskType", {
      is: "Auction",
      then: (schema) => schema.min(1, "At least one employee must be assigned"),
      otherwise: (schema) => schema,
    }),
  });

  const reminderValidationSchema = Yup.object({
    taskName: Yup.string().required("Reminder Name is required"),
    dueDate: Yup.string().required("Reminder Date is required"),
    description: Yup.string(),
    dueTime: Yup.string(),
    assignedTo: Yup.array().min(1, "At least one employee must be assigned"),
    notificationEmail: Yup.boolean(),
    notificationInApp: Yup.boolean(),
    notificationAlarm: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      taskType: editTask?.taskType || "Auction",
      taskName: editTask?.taskName || "",
      description: editTask?.description || "",
      priority: editTask?.priority || "Medium",
      dueDate: editTask?.dueDate || "",
      assignedTo: editTask?.assignedTo || [],
      attachments: editTask?.attachments || [],
      remark: editTask?.remark || "",
      requestorName: editTask?.requestorName || "",
      client: editTask?.client || "",
      division: editTask?.division || "",
      expenditureType: editTask?.expenditureType || "",
      category: editTask?.category || "",
      auctionDate: editTask?.auctionDate || "",
      auctionTime: editTask?.auctionTime || "",
      auctionType: editTask?.auctionType || "",
      preBid: editTask?.preBid || "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (values.taskType === "Reminder") {
        try {
          for (const reminder of reminders) {
            await reminderValidationSchema.validate(reminder, {
              abortEarly: false,
            });
          }
        } catch (err) {
          setErrors({
            api: "All reminder fields (Reminder Name, Reminder Date, Assigned Employees) are required",
          });
          showToast(
            "All reminder fields (Reminder Name, Reminder Date, Assigned Employees) are required",
            "error"
          );
          setSubmitting(false);
          return;
        }
        setSubmitting(true);
        try {
          for (const reminder of reminders) {
            const formDataToSend = new FormData();
            formDataToSend.append("taskName", reminder.taskName);
            formDataToSend.append("description", reminder.description);
            formDataToSend.append("dueDate", formatDate(reminder.dueDate));
            formDataToSend.append("dueTime", reminder.dueTime);
            formDataToSend.append(
              "assignedTo",
              JSON.stringify(reminder.assignedTo.map((emp) => emp.email))
            );
            formDataToSend.append("taskType", values.taskType);
            formDataToSend.append(
              "notificationEmail",
              reminder.notificationEmail
            );
            formDataToSend.append(
              "notificationInApp",
              reminder.notificationInApp
            );
            formDataToSend.append(
              "notificationAlarm",
              reminder.notificationAlarm
            );
            formDataToSend.append("notificationDraft", notificationDraft);
            values.attachments.forEach((file) => {
              if (file instanceof File) {
                formDataToSend.append("file", file);
              }
            });
            const response = await fetch(
              "https://task-manager-backend-xs5s.onrender.com/api/admin/createtask",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
              }
            );
            if (!response.ok) {
              const errorData = await response
                .json()
                .catch(() => ({ message: "Unknown server error" }));
              throw new Error(errorData.message || "Failed to create reminder");
            }
            const data = await response.json();
            if (typeof onSubmit === "function") {
              onSubmit(data);
            }
          }
          showToast("Reminders created successfully!", "success");
          setTimeout(() => navigate("/admin/tasks"), 3000);
        } catch (err) {
          setErrors({ api: err.message });
          showToast(err.message || "Failed to create reminders", "error");
        } finally {
          setSubmitting(false);
        }
      } else if (values.taskType === "Auction") {
        setSubmitting(true);
        try {
          let formattedAuctionDate = '';
          if (values.auctionDate) {
            const [aYear, aMonth, aDay] = values.auctionDate.split('-');
            formattedAuctionDate = `${aDay.padStart(2, '0')}-${aMonth.padStart(2, '0')}-${aYear}`;
          }
          const auctionData = {
            taskType: values.taskType,
            auctionType: values.auctionType,
            eventName: values.taskName,
            requesterName: values.requestorName,
            client: values.client,
            division: values.division,
            assignEmployees: Array.isArray(values.assignedTo) && values.assignedTo.length > 0
              ? values.assignedTo.map((emp) => emp.email)
              : [],
            auctionDate: formattedAuctionDate,
            auctionTime: values.auctionTime,
            category: values.category,
            [values.auctionType === 'Forward Auction' ? 'benchmark' : 'prebid']: values.preBid,
          };
          console.log("🚀 Sending Auction Task Data to Backend:", auctionData);
          const response = await fetch('https://task-manager-backend-xs5s.onrender.com/api/auction-tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(auctionData),
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
            throw new Error(errorData.message || 'Failed to create auction task');
          }
          const data = await response.json();
          if (typeof onSubmit === "function") {
            onSubmit(data);
          }
          showToast("Auction task created successfully!", "success");
          setTimeout(() => navigate("/admin/tasks?tab=Auctions"), 3000);
        } catch (err) {
          setErrors({ api: err.message });
          showToast(err.message || "Failed to create auction task", "error");
        } finally {
          setSubmitting(false);
        }
      } else {
        setSubmitting(true);
        const formDataToSend = new FormData();
        formDataToSend.append("taskName", values.taskName);
        formDataToSend.append("description", values.description);
        formDataToSend.append("dueDate", formatDate(values.dueDate));
        formDataToSend.append(
          "assignedTo",
          JSON.stringify(values.assignedTo.map((emp) => emp.email))
        );
        formDataToSend.append("priority", values.priority);
        formDataToSend.append("taskType", values.taskType);
        formDataToSend.append("remark", values.remark);
        if (values.taskType === "Auction") {
          formDataToSend.append("requestorName", values.requestorName);
          formDataToSend.append("client", values.client);
          formDataToSend.append("division", values.division);
          formDataToSend.append("expenditureType", values.expenditureType);
          formDataToSend.append("category", values.category);
          formDataToSend.append("auctionDate", formatDate(values.auctionDate));
          formDataToSend.append("auctionTime", values.auctionTime);
          formDataToSend.append("auctionType", values.auctionType);
          formDataToSend.append("preBid", values.preBid);
        }
        values.attachments.forEach((file) => {
          if (file instanceof File) {
            formDataToSend.append("file", file);
          }
        });
        console.log("🚀 Sending General Task Data to Backend:", Object.fromEntries(formDataToSend.entries()));
        try {
          const response = await fetch(
            editTask
              ? `https://task-manager-backend-xs5s.onrender.com/api/admin/createtask/${editTask.taskId}`
              : "https://task-manager-backend-xs5s.onrender.com/api/admin/createtask",
            {
              method: editTask ? "PATCH" : "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formDataToSend,
            }
          );
          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ message: "Unknown server error" }));
            throw new Error(errorData.message || "Failed to create task");
          }
          const data = await response.json();
          if (typeof onSubmit === "function") {
            onSubmit(data);
          }
          showToast(
            editTask
              ? "Task updated successfully!"
              : "Task created successfully!",
            "success"
          );
          setTimeout(() => navigate("/admin/tasks"), 3000);
        } catch (err) {
          setErrors({ api: err.message });
          showToast(err.message || "Failed to create task", "error");
        } finally {
          setSubmitting(false);
        }
      }
    },
  });

  // keep requestorQuery in sync with formik value (useful for edit)
  useEffect(() => {
    setRequestorQuery(formik.values.requestorName || "");
  }, [formik.values.requestorName]);

  const handleReminderInputChange = (e, reminderId) => {
    const { name, value } = e.target;
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === reminderId ? { ...reminder, [name]: value } : reminder
      )
    );
  };

  const handleEmployeeSelect = (employee, reminderId) => {
    if (formik.values.taskType === "Reminder" && reminderId) {
      setReminders((prev) =>
        prev.map((reminder) =>
          reminder.id === reminderId &&
          !reminder.assignedTo.find((emp) => emp.email === employee.email)
            ? {
                ...reminder,
                assignedTo: [
                  ...reminder.assignedTo,
                  {
                    email: employee.email,
                    name: employee.name,
                    avatar: employee.avatar,
                  },
                ],
              }
            : reminder
        )
      );
    } else {
      if (
        !formik.values.assignedTo.find((emp) => emp.email === employee.email)
      ) {
        formik.setFieldValue("assignedTo", [
          ...formik.values.assignedTo,
          {
            email: employee.email,
            name: employee.name,
            avatar: employee.avatar,
          },
        ]);
      }
    }
    setSearchTerm("");
    setShowEmployeeDropdown(false);
  };

  const handleEmployeeRemove = (email, reminderId) => {
    if (formik.values.taskType === "Reminder" && reminderId) {
      setReminders((prev) =>
        prev.map((reminder) =>
          reminder.id === reminderId
            ? {
                ...reminder,
                assignedTo: reminder.assignedTo.filter(
                  (emp) => emp.email !== email
                ),
              }
            : reminder
        )
      );
    } else {
      formik.setFieldValue(
        "assignedTo",
        formik.values.assignedTo.filter((emp) => emp.email !== email)
      );
    }
  };

  const handleAttachmentAdd = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      formik.setFieldValue("attachments", [
        ...formik.values.attachments,
        ...files,
      ]);
      e.target.value = "";
    }
  };

  const handleAttachmentRemove = (index) => {
    formik.setFieldValue(
      "attachments",
      formik.values.attachments.filter((_, i) => i !== index)
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDropActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      formik.setFieldValue("attachments", [
        ...formik.values.attachments,
        ...files,
      ]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDropActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDropActive(false);
  };

  const generateNotificationDraft = async (reminder) => {
    setIsGeneratingDraft(true);
    setNotificationDraft("Generating draft...");
    let prompt = `Draft a concise and professional reminder notification message.
      Title: "${reminder.taskName || "No Title"}"
      Description: "${reminder.description || "No Description"}"
      Due Date: "${reminder.dueDate || "Not set"}"
      Due Time: "${reminder.dueTime || "Not set"}"
      Assigned To: ${
        reminder.assignedTo.length > 0
          ? reminder.assignedTo.map((emp) => emp.name).join(", ")
          : "No one assigned"
      }
    `;
    prompt += `The message should be suitable for an email or in-app notification. Focus on clarity and brevity.`;
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1000;
    while (retries < maxRetries) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.status === 429) {
          retries++;
          const delay = baseDelay * Math.pow(2, retries - 1);
          console.warn(
            `Rate limit hit. Retrying in ${delay / 1000} seconds...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        const result = await response.json();
        if (
          result.candidates &&
          result.candidates.length > 0 &&
          result.candidates[0].content &&
          result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0
        ) {
          setNotificationDraft(result.candidates[0].content.parts[0].text);
        } else {
          setNotificationDraft("Could not generate draft. Please try again.");
        }
        break;
      } catch (error) {
        console.error("Error generating notification draft:", error);
        setNotificationDraft("Error generating draft. Please check console.");
        break;
      } finally {
        setIsGeneratingDraft(false);
      }
    }
    if (retries === maxRetries) {
      setNotificationDraft("Failed to generate draft after multiple retries.");
      setIsGeneratingDraft(false);
    }
  };

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const addReminder = () => {
    setReminders((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        taskName: "",
        description: "",
        dueDate: "",
        dueTime: "",
        assignedTo: [],
        notificationEmail: true,
        notificationInApp: true,
        notificationAlarm: false,
      },
    ]);
  };

  const removeReminder = (reminderId) => {
    setReminders((prev) =>
      prev.filter((reminder) => reminder.id !== reminderId)
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
  };

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const handleSelectAllEmployees = (checked, reminderId = null) => {
    if (formik.values.taskType === "Reminder" && reminderId) {
      setReminders((prev) =>
        prev.map((reminder) =>
          reminder.id === reminderId
            ? {
                ...reminder,
                assignedTo: checked
                  ? filteredEmployees.map((emp) => ({
                      email: emp.email,
                      name: emp.name,
                      avatar: emp.avatar,
                    }))
                  : [],
              }
            : reminder
        )
      );
    } else {
      formik.setFieldValue(
        "assignedTo",
        checked
          ? filteredEmployees.map((emp) => ({
              email: emp.email,
              name: emp.name,
              avatar: emp.avatar,
            }))
          : []
      );
    }
  };

  // Loader state for requestor actions
  const [requestorLoading, setRequestorLoading] = useState(false);

 // Fetch all requestors
const fetchRequestors = async () => {
  console.log("Fetching requestors...");
  setRequestorLoading(true);
  const token = localStorage.getItem("token") || ""; // Retrieve token from localStorage
  try {
    const response = await fetch(
      "https://task-manager-backend-xs5s.onrender.com/api/get/requestors",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch requestors");
    const data = await response.json();
    console.log("Fetched requestors are as follows:", data);
    console.log("Requestors fetched successfully");
    setLocalRequestors(Array.isArray(data) ? data : []);
  } catch (err) {
    console.log("Error fetching requestors:", err);
    showToast(err.message, "error"); // Display error to user
  } finally {
    setRequestorLoading(false);
  }
};

// Add new requestor
const addRequestor = async (requestorData) => {
  console.log("Adding requestor:", requestorData);
  setRequestorLoading(true);
  const token = localStorage.getItem("token") || ""; // Retrieve token from localStorage
  try {
    const response = await fetch(
      "https://task-manager-backend-xs5s.onrender.com/api/create/requestors",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
        body: JSON.stringify(requestorData),
      }
    );
    if (!response.ok) throw new Error("Failed to create requestor");
    console.log("Requestor added successfully");
    showToast("Requestor created successfully!", "success");
    await fetchRequestors(); // Refetch after save
  } catch (err) {
    console.log("Error adding requestor:", err);
    showToast(err.message, "error");
  } finally {
    setRequestorLoading(false);
  }
};

  // Call fetchRequestors on mount
  useEffect(() => {
    fetchRequestors();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter text-gray-800">
      <script src="https://cdn.tailwindcss.com"></script>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="sticky top-0 h-screen z-40">
        <AdminSidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={!!token} onToggleSidebar={toggleSidebar} />
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {editTask ? "Edit Task" : "Create New Task"}
                </h2>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
              {formik.errors.api && (
                <div className="text-red-500 mb-4 text-sm">
                  {formik.errors.api}
                </div>
              )}
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Task Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="taskType"
                    value={formik.values.taskType}
                    onChange={(e) => {
                      formik.handleChange(e);
                      if (e.target.value !== "Auction") {
                        formik.setFieldValue("requestorName", "");
                        formik.setFieldValue("client", "");
                        formik.setFieldValue("division", "");
                        formik.setFieldValue("expenditureType", "");
                        formik.setFieldValue("category", "");
                        formik.setFieldValue("auctionDate", "");
                        formik.setFieldValue("auctionTime", "");
                        formik.setFieldValue("auctionType", "");
                        formik.setFieldValue("preBid", "");
                      }
                    }}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      formik.touched.taskType && formik.errors.taskType
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="General">General</option>
                    <option value="Auction">Auction</option>
                    <option value="Reminder">Reminder</option>
                  </select>
                  {formik.touched.taskType && formik.errors.taskType && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.taskType}
                    </div>
                  )}
                </div>

                {/* Move Auction Type directly under Task Type when Auction is selected */}
                {formik.values.taskType === "Auction" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auction Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="auctionType"
                      value={formik.values.auctionType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        formik.touched.auctionType && formik.errors.auctionType
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Auction Type</option>
                      <option value="Reverse Auction">Reverse Auction</option>
                      <option value="Forward Auction">Forward Auction</option>
                    </select>
                    {formik.touched.auctionType &&
                      formik.errors.auctionType && (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.auctionType}
                        </div>
                      )}
                  </div>
                )}

                {formik.values.taskType === "Reminder" ? (
                  <>
                    {reminders.map((reminder, index) => (
                      <div
                        key={reminder.id}
                        className="border border-gray-200 rounded-lg p-5 mb-4 bg-gray-50 relative"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Reminder {index + 1}
                        </h3>
                        {reminders.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReminder(reminder.id)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors"
                            aria-label={`Remove Reminder ${index + 1}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                        {/* Reminder Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reminder Name{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="taskName"
                            value={reminder.taskName}
                            onChange={(e) =>
                              handleReminderInputChange(e, reminder.id)
                            }
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              reminder.taskName === "" && formik.submitCount > 0
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter reminder name"
                          />
                          {reminder.taskName === "" &&
                            formik.submitCount > 0 && (
                              <div className="text-red-500 text-sm mt-1">
                                Reminder Name is required
                              </div>
                            )}
                        </div>
                        {/* Description */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={reminder.description}
                            onChange={(e) =>
                              handleReminderInputChange(e, reminder.id)
                            }
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter reminder description"
                          />
                        </div>
                        {/* Reminder Date and Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Reminder Date{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                              <input
                                type="date"
                                name="dueDate"
                                value={reminder.dueDate}
                                onChange={(e) =>
                                  handleReminderInputChange(e, reminder.id)
                                }
                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                  reminder.dueDate === "" &&
                                  formik.submitCount > 0
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>
                            {reminder.dueDate === "" &&
                              formik.submitCount > 0 && (
                                <div className="text-red-500 text-sm mt-1">
                                  Reminder Date is required
                                </div>
                              )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Reminder Time
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                              <input
                                type="time"
                                name="dueTime"
                                value={reminder.dueTime}
                                onChange={(e) =>
                                  handleReminderInputChange(e, reminder.id)
                                }
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                        {/* Assign Employees */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign Employees{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onFocus={() => setShowEmployeeDropdown(true)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Search employee by name or department"
                            />
                          </div>
                          {showEmployeeDropdown && (
                            <div
                              ref={employeeDropdownRef}
                              className="relative z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                            >
                              <label className="flex items-center px-4 py-2 bg-gray-50 sticky top-0 border-b border-gray-200">
                                <input
                                  type="checkbox"
                                  checked={
                                    filteredEmployees.length > 0 &&
                                    filteredEmployees.every((emp) =>
                                      reminder.assignedTo.some(
                                        (a) => a.email === emp.email
                                      )
                                    )
                                  }
                                  onChange={(e) =>
                                    handleSelectAllEmployees(
                                      e.target.checked,
                                      reminder.id
                                    )
                                  }
                                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="font-medium text-sm text-gray-700">
                                  Select All
                                </span>
                              </label>
                              {filteredEmployees.map((employee) => (
                                <label
                                  key={employee.id}
                                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={reminder.assignedTo.some(
                                      (emp) => emp.email === employee.email
                                    )}
                                    onChange={() =>
                                      handleEmployeeSelect(
                                        employee,
                                        reminder.id
                                      )
                                    }
                                    className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                  <img
                                    src={employee.avatar || ""}
                                    alt={employee.name}
                                    className="w-8 h-8 rounded-full mr-2"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {employee.name || "Unknown"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {employee.department || "Unknown"}
                                    </p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}
                          {reminder.assignedTo.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {reminder.assignedTo.map((emp) => (
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
                                      handleEmployeeRemove(
                                        emp.email,
                                        reminder.id
                                      )
                                    }
                                    className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                                    aria-label={`Remove ${emp.name}`}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          {formik.submitCount > 0 &&
                            reminder.assignedTo.length === 0 && (
                              <div className="text-red-500 text-sm mt-1">
                                At least one employee must be assigned
                              </div>
                            )}
                        </div>
                        {/* Notification Preferences */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notification Preferences
                          </label>
                          <div className="flex flex-wrap gap-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={reminder.notificationEmail}
                                onChange={(e) =>
                                  setReminders((prev) =>
                                    prev.map((r) =>
                                      r.id === reminder.id
                                        ? {
                                            ...r,
                                            notificationEmail: e.target.checked,
                                          }
                                        : r
                                    )
                                  )
                                }
                                className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <Mail className="ml-2 mr-1 w-4 h-4 text-purple-700" />
                              <span className="text-gray-700">Email</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={reminder.notificationInApp}
                                onChange={(e) =>
                                  setReminders((prev) =>
                                    prev.map((r) =>
                                      r.id === reminder.id
                                        ? {
                                            ...r,
                                            notificationInApp: e.target.checked,
                                          }
                                        : r
                                    )
                                  )
                                }
                                className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <Smartphone className="ml-2 mr-1 w-4 h-4 text-blue-600" />
                              <span className="text-gray-700">In-app</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={reminder.notificationAlarm}
                                onChange={(e) =>
                                  setReminders((prev) =>
                                    prev.map((r) =>
                                      r.id === reminder.id
                                        ? {
                                            ...r,
                                            notificationAlarm: e.target.checked,
                                          }
                                        : r
                                    )
                                  )
                                }
                                className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <Bell className="ml-2 mr-1 w-4 h-4 text-red-800" />
                              <span className="text-gray-700">Alarm Alert</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addReminder}
                      className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors text-sm font-medium mt-4"
                      aria-label="Add New Reminder"
                    >
                      <PlusCircle className="mr-2 w-5 h-5" /> Add Reminder
                    </button>
                  </>
                ) : (
                  <>
                    {/* Task Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="taskName"
                          value={formik.values.taskName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            formik.touched.taskName && formik.errors.taskName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter task name"
                        />
                      </div>
                      {formik.touched.taskName && formik.errors.taskName && (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.taskName}
                        </div>
                      )}
                    </div>
                    {/* Auction-Specific Fields */}
                    {formik.values.taskType === "Auction" && (
                      <>
                        {/* Requestor Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Requestor Name{" "} <span className="text-red-500">*</span>
                            {/* <span className="text-red-500">*</span> */}
                          </label>
                          {/* Searchable Requestor input with suggestions */}
                          <div className="relative">
                            <input
                              type="text"
                              name="requestorName"
                              value={
                                requestorQuery ?? formik.values.requestorName
                              }
                              onChange={(e) => {
                                const v = e.target.value;
                                setRequestorQuery(v);
                                formik.setFieldValue("requestorName", v);
                                setShowRequestorSuggestions(true);
                              }}
                              onFocus={() => setShowRequestorSuggestions(true)}
                              onBlur={() =>
                                setTimeout(
                                  () => setShowRequestorSuggestions(false),
                                  150
                                )
                              }
                              placeholder="Type or select requestor"
                              className={`w-full px-4 py-3 pr-10 border rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out ${
                                formik.touched.requestorName &&
                                formik.errors.requestorName
                                  ? "border-red-500"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            />

                            {/* Suggestions dropdown */}
                            {showRequestorSuggestions && (
                              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-auto">
                                {filteredRequestors.length > 0 ? (
                                  filteredRequestors.map((r, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onMouseDown={(e) => e.preventDefault()}
                                      onClick={() => {
                                        const name = r.requestorName;
                                        setRequestorQuery(name);
                                        formik.setFieldValue(
                                          "requestorName",
                                          name
                                        );
                                        formik.setFieldValue(
                                          "client",
                                          r.client || ""
                                        );
                                        formik.setFieldValue(
                                          "division",
                                          r.division || ""
                                        );
                                        setShowRequestorSuggestions(false);
                                      }}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                    >
                                      {r.requestorName}
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-4 py-3 text-sm text-gray-500">
                                    No results
                                  </div>
                                )}
                                <div className="border-t border-gray-100 p-2">
                                  <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                      setShowAddRequestor(true);
                                      setNewRequestor((prev) => ({
                                        ...prev,
                                        name:
                                          requestorQuery ||
                                          formik.values.requestorName,
                                      }));
                                      setShowRequestorSuggestions(false);
                                    }}
                                    className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm"
                                  >
                                    + Add Requestor
                                  </button>
                                </div>
                              </div>
                            )}
                            <div className="mt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddRequestor(true);
                                  setNewRequestor((prev) => ({
                                    ...prev,
                                    name:
                                      requestorQuery ||
                                      formik.values.requestorName,
                                  }));
                                }}
                                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                              >
                                Add Requestor
                              </button>
                            </div>
                          </div>
                          {formik.touched.requestorName &&
                            formik.errors.requestorName && (
                              <div className="text-red-500 text-sm mt-1">
                                {formik.errors.requestorName}
                              </div>
                            )}

                          {/* Inline Add Requestor form */}
                          {showAddRequestor && (
                            <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Requestor Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newRequestor.name}
                                onChange={(e) =>
                                  setNewRequestor((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border rounded-md mb-2"
                                placeholder="Enter requestor name"
                              />
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client
                              </label>
                              <input
                                type="text"
                                value={newRequestor.client}
                                onChange={(e) =>
                                  setNewRequestor((prev) => ({
                                    ...prev,
                                    client: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border rounded-md mb-2"
                                placeholder="Enter client"
                              />
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Division
                              </label>
                              <input
                                type="text"
                                value={newRequestor.division}
                                onChange={(e) =>
                                  setNewRequestor((prev) => ({
                                    ...prev,
                                    division: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border rounded-md mb-3"
                                placeholder="Enter division"
                              />
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!newRequestor.name) {
                                      showToast(
                                        "Requestor name is required",
                                        "error"
                                      );
                                      return;
                                    }
                                    const obj = {
                                      requestorName: newRequestor.name,
                                      client: newRequestor.client,
                                      division: newRequestor.division,
                                    };
                                    await addRequestor(obj);
                                    formik.setFieldValue(
                                      "requestorName",
                                      newRequestor.name
                                    );
                                    formik.setFieldValue(
                                      "client",
                                      newRequestor.client
                                    );
                                    formik.setFieldValue(
                                      "division",
                                      newRequestor.division
                                    );
                                    setNewRequestor({
                                      name: "",
                                      client: "",
                                      division: "",
                                    });
                                    setShowAddRequestor(false);
                                  }}
                                  disabled={requestorLoading}
                                  className={`px-3 py-1 bg-blue-600 text-white rounded-md flex items-center justify-center ${
                                    requestorLoading
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  {requestorLoading ? (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewRequestor({
                                      name: "",
                                      client: "",
                                      division: "",
                                    });
                                    setShowAddRequestor(false);
                                  }}
                                  className="px-3 py-1 border rounded-md"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Client and Division */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Client
                              {/* <span className="text-red-500">*</span> */}
                            </label>
                            <input
                              type="text"
                              name="client"
                              value={formik.values.client}
                              readOnly={!showAddRequestor}
                              onChange={
                                showAddRequestor
                                  ? (e) =>
                                      formik.setFieldValue(
                                        "client",
                                        e.target.value
                                      )
                                  : undefined
                              }
                              className={`w-full px-4 py-2 border border-gray-300 rounded-md ${
                                showAddRequestor ? "" : "bg-gray-50"
                              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                              placeholder="Client (auto-filled)"
                            />
                            {formik.touched.client && formik.errors.client && (
                              <div className="text-red-500 text-sm mt-1">
                                {formik.errors.client}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Division
                              {/* <span className="text-red-500">*</span> */}
                            </label>
                            <input
                              type="text"
                              name="division"
                              value={formik.values.division}
                              readOnly={!showAddRequestor}
                              onChange={
                                showAddRequestor
                                  ? (e) =>
                                      formik.setFieldValue(
                                        "division",
                                        e.target.value
                                      )
                                  : undefined
                              }
                              className={`w-full px-4 py-2 border border-gray-300 rounded-md ${
                                showAddRequestor ? "" : "bg-gray-50"
                              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                              placeholder="Division (auto-filled)"
                            />
                            {formik.touched.division &&
                              formik.errors.division && (
                                <div className="text-red-500 text-sm mt-1">
                                  {formik.errors.division}
                                </div>
                              )}
                          </div>
                        </div>
                     
                        {/* Auction Date and Auction Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Auction Date{" "}
                              {/* <span className="text-red-500">*</span> */}
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                              <input
                                type="date"
                                name="auctionDate"
                                value={formik.values.auctionDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                  formik.touched.auctionDate &&
                                  formik.errors.auctionDate
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>
                            {formik.touched.auctionDate &&
                              formik.errors.auctionDate && (
                                <div className="text-red-500 text-sm mt-1">
                                  {formik.errors.auctionDate}
                                </div>
                              )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Auction Time{" "}
                              {/* <span className="text-red-500">*</span> */}
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                              <input
                                type="time"
                                name="auctionTime"
                                value={formik.values.auctionTime}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                  formik.touched.auctionTime &&
                                  formik.errors.auctionTime
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>
                            {formik.touched.auctionTime &&
                              formik.errors.auctionTime && (
                                <div className="text-red-500 text-sm mt-1">
                                  {formik.errors.auctionTime}
                                </div>
                              )}
                          </div>
                        </div>
                        {/* Auction Type and Pre Bid */}
                    
                      </>
                    )}

                    {/* Assign Employees - Moved here */}
                    {formik.values.taskType !== "Reminder" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assign Employees{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowEmployeeDropdown(true)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Search employee by name or department"
                          />
                        </div>
                        {showEmployeeDropdown && (
                          <div
                            ref={employeeDropdownRef}
                            className="relative z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                          >
                            <label className="flex items-center px-4 py-2 bg-gray-50 sticky top-0 border-b border-gray-200">
                              <input
                                type="checkbox"
                                checked={
                                  filteredEmployees.length > 0 &&
                                  filteredEmployees.every((emp) =>
                                    formik.values.assignedTo.some(
                                      (a) => a.email === emp.email
                                    )
                                  )
                                }
                                onChange={(e) =>
                                  handleSelectAllEmployees(e.target.checked)
                                }
                                className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="font-medium text-sm text-gray-700">
                                Select All
                              </span>
                            </label>
                            {filteredEmployees.map((employee) => (
                              <label
                                key={employee.id}
                                className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={formik.values.assignedTo.some(
                                    (emp) => emp.email === employee.email
                                  )}
                                  onChange={() =>
                                    handleEmployeeSelect(employee)
                                  }
                                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <img
                                  src={employee.avatar || ""}
                                  alt={employee.name}
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {employee.name || "Unknown"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {employee.department || "Unknown"}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                        {formik.values.assignedTo.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {formik.values.assignedTo.map((emp) => (
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
                                  className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                                  aria-label={`Remove ${emp.name}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {formik.touched.assignedTo &&
                          formik.errors.assignedTo && (
                            <div className="text-red-500 text-sm mt-1">
                              {formik.errors.assignedTo}
                            </div>
                          )}
                      </div>
                    )}

                    {/* Description */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter task description (optional)"
                      />
                    </div> */}

                    {/* Priority and Due Date */}
                    {formik.values.taskType !== "Auction" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="priority"
                            value={formik.values.priority}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              formik.touched.priority && formik.errors.priority
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                          {formik.touched.priority &&
                            formik.errors.priority && (
                              <div className="text-red-500 text-sm mt-1">
                                {formik.errors.priority}
                              </div>
                            )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                              type="date"
                              name="dueDate"
                              value={formik.values.dueDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                formik.touched.dueDate && formik.errors.dueDate
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>
                          {formik.touched.dueDate && formik.errors.dueDate && (
                            <div className="text-red-500 text-sm mt-1">
                              {formik.errors.dueDate}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {/* File Attachments */}
                    {formik.values.taskType !== "Auction" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          File Attachments
                        </label>
                        <div
                          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 transition-colors ${
                            dropActive
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                          }`}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onClick={() =>
                            document.getElementById("attachment-input").click()
                          }
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              document
                                .getElementById("attachment-input")
                                .click();
                          }}
                        >
                          <input
                            id="attachment-input"
                            type="file"
                            multiple
                            onChange={handleAttachmentAdd}
                            className="hidden"
                          />
                          <Upload className="w-8 h-8 text-blue-500 mb-2" />
                          <span className="text-sm text-gray-600 mb-1">
                            Drag & drop files here, or{" "}
                            <span className="text-blue-600 underline hover:text-blue-700">
                              click to select
                            </span>
                          </span>
                          <span className="text-xs text-gray-500">
                            (You can select multiple files)
                          </span>
                        </div>
                        {formik.values.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {formik.values.attachments.map(
                              (attachment, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-200"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Paperclip className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 truncate">
                                      {attachment instanceof File
                                        ? attachment.name
                                        : attachment}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAttachmentRemove(index)
                                    }
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    aria-label={`Remove ${
                                      attachment instanceof File
                                        ? attachment.name
                                        : attachment
                                    }`}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Remark */}
                    {formik.values.taskType !== "Reminder" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Remarks
                        </label>
                        <textarea
                          name="remark"
                          value={formik.values.remark}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter remarks (optional)"
                        />
                      </div>
                    )}
                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4">
                      {onCancel && (
                        <button
                          type="button"
                          onClick={onCancel}
                          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                          disabled={formik.isSubmitting}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className={`px-6 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 hover:bg-blue-700 transition-colors ${
                          formik.isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={formik.isSubmitting}
                      >
                        {formik.isSubmitting ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>
                              {editTask
                                ? "Update Task"
                                : formik.values.taskType === "Reminder"
                                ? "Save Reminder"
                                : "Create Task"}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      {toast.visible && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg animate-slide-in z-50 ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          } max-w-sm text-sm`}
        >
          {toast.message}
        </div>
      )}
      {modalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {modalTitle}
            </h3>
            <p className="text-gray-600 mb-6">{modalMessage}</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                onClick={hideModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default CreateTasks;
