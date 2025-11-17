import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  Mail,
  X,
  Loader,
  Upload,
  Search,
  AlertCircle,
  Edit,
  Eye,
  Plus,
  Send,
  Filter,
  FunnelX,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  IdCard,
  Table as TableIcon,
  Download,
  RefreshCw,
  Table,
} from "lucide-react";
import SevenProcure from "../layout/icon.png";
import api from "../../services/api";
import { useToast } from "../../hooks/useToast";
import AuctionCardsView from "./AuctionCardsView";
import TaskFilterDrawer from "./TaskFilterDrawer";
const AuctionTable = () => {
  const { success, error: toastError } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterEmployee, setFilterEmployee] = useState([]);
  const [filterEmployeeSearch, setFilterEmployeeSearch] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [viewMode, setViewMode] = useState("cards");

  // Update viewMode with localStorage persistence
  const updateViewMode = (newMode) => {
    setViewMode(newMode);
    localStorage.setItem("auctionViewMode", newMode);
  };
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Date filter states
  const [dueDateFilter, setDueDateFilter] = useState("none");
  const [showDueDateFilterDropdown, setShowDueDateFilterDropdown] =
    useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });
  const [showMISModal, setShowMISModal] = useState(false);
  const [misFormData, setMisFormData] = useState({
    client: "",
    fromDate: "",
    toDate: "",
    selectedDivisions: [],
    selectedFields: [],
  });
  const [misFormErrors, setMisFormErrors] = useState({});
  const [isDownloadingMIS, setIsDownloadingMIS] = useState(false);
  const [divisions, setDivisions] = useState([]);

  // Refs for dropdowns
  const statusDropdownRef = useRef(null);
  const employeeDropdownRef = useRef(null);
  const dueDateDropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    taskId: "",
    eventId: "",
    eventName: "",
    auctionType: "",
    requestor: "",
    client: "",
    division: "",
    dateTime: "",
    category: "",
    status: "",
    preBid: "",
    postBid: "",
    savings: "",
    savingsPercent: "",
    assignedTo: [],
    fileUrls: [],
    remark: "",
    expenditureType: "",
    numberOfParticipants: "",
    nameOfL1Vendor: "",
    errors: {},
  });
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [showModalEmployeeDropdown, setShowModalEmployeeDropdown] =
    useState(false);
  const modalEmployeeDropdownRef = useRef(null);
  const [categoryFormData, setCategoryFormData] = useState({
    categoryName: "",
    categoryType: "",
  });
  const [categoryFormErrors, setCategoryFormErrors] = useState({});

  // Initialize formData when modal opens
  useEffect(() => {
    if (modalVisible && selectedTask) {
      setFormData({
        taskId: selectedTask.taskId,
        eventId: selectedTask.eventId,
        eventName: selectedTask.eventName,
        auctionType: selectedTask.auctionType,
        requestor: selectedTask.requestor,
        client: selectedTask.client,
        division: selectedTask.division,
        dateTime: selectedTask.dateTime,
        category: selectedTask.category,
        status: selectedTask.status,
        preBid: selectedTask.preBid,
        postBid: selectedTask.postBid || "",
        savings: selectedTask.savings || "",
        savingsPercent: selectedTask.savingsPercent || "",
        assignedTo: selectedTask.assignedTo || [],
        fileUrls: selectedTask.fileUrls || [],
        remark: selectedTask.remark || "",
        expenditureType: selectedTask.expenditureType || "",
        numberOfParticipants: selectedTask.numberOfParticipants || "",
        nameOfL1Vendor: selectedTask.nameOfL1Vendor || "",
        errors: {},
      });
      setEditId(selectedTask.taskId);

      // Load categories for the selected auction type
      if (selectedTask.auctionType) {
        fetchCategories(selectedTask.auctionType);
      }
    }
  }, [modalVisible, selectedTask]);

  // Handle row click
  const handleRowClick = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  // Show delete confirmation
  const showDeleteConfirmation = (task) => {
    setTaskToDelete(task);
    setDeleteModalVisible(true);
  };

  // Delete task
  const handleDelete = async () => {
    if (!taskToDelete) return;

    console.log("🗑️ Starting to delete auction task:", taskToDelete.taskId);
    try {
      await api.deleteAuctionTask(taskToDelete.taskId);
      console.log("✅ Successfully deleted auction task:", taskToDelete.taskId);
      setTasks(tasks.filter((task) => task.taskId !== taskToDelete.taskId));
      if (selectedTask?.taskId === taskToDelete.taskId) {
        closeModal();
      }
      setDeleteModalVisible(false);
      setTaskToDelete(null);
      success("Auction task deleted successfully");
    } catch (err) {
      console.error("❌ Error deleting auction task:", err);
      console.error("❌ Error details:", {
        message: err.message,
        stack: err.stack,
        response: err.response,
      });
      toastError("Failed to delete auction task");
    }
  };

  // Reminder email
  const handleReminderEmail = (task) => {
    alert(`Sending reminder for: ${task.eventName}`);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
    setEditId(null);
    setFormData({
      taskId: "",
      eventId: "",
      eventName: "",
      auctionType: "",
      requestor: "",
      client: "",
      division: "",
      dateTime: "",
      category: "",
      status: "",
      preBid: "",
      postBid: "",
      savings: "",
      savingsPercent: "",
      assignedTo: [],
      fileUrls: [],
      remark: "",
      expenditureType: "",
      numberOfParticipants: "",
      nameOfL1Vendor: "",
      errors: {},
    });
    setEmployeeSearchTerm("");
    setShowModalEmployeeDropdown(false);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Handle input change with auto-calculation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
        errors: { ...prev.errors, [name]: "" },
      };

      // Auto-calculate savings/earning when preBid or postBid changes.
      if (name === "preBid" || name === "postBid" || name === "auctionType") {
        const preBidVal =
          parseFloat(name === "preBid" ? value : updated.preBid) || 0;
        const postBidVal =
          parseFloat(name === "postBid" ? value : updated.postBid) || 0;

        let savings = 0;
        let savingsPercent = 0;

        if ((updated.auctionType || prev.auctionType) === "Reverse Auction") {
          // Reverse Auction: Savings = Pre bid - Post bid, Savings % = (savings / prebid) * 100
          savings = preBidVal - postBidVal;
          savingsPercent = preBidVal > 0 ? (savings / preBidVal) * 100 : 0;
        } else if (
          (updated.auctionType || prev.auctionType) === "Forward Auction"
        ) {
          // Forward Auction: Earning = Post bid - benchmark, Earning % = (earning / benchmark) * 100
          savings = postBidVal - preBidVal; // This represents earning
          savingsPercent = preBidVal > 0 ? (savings / preBidVal) * 100 : 0; // benchmark is preBid
        }

        updated.savings = savings >= 0 ? Number(savings.toFixed(2)) : 0;
        updated.savingsPercent =
          savingsPercent >= 0 ? Number(savingsPercent.toFixed(2)) : 0;
      }

      // Fetch categories when auction type changes
      if (name === "auctionType") {
        fetchCategories(value);
      }

      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Starting form submission for task update");
    setIsLoading(true);

    const errors = {};

    // Base required fields for all statuses
    if (!formData.auctionType) errors.auctionType = "Required";
    if (!formData.eventName) errors.eventName = "Required";
    if (!formData.requestor) errors.requestor = "Required";
    if (!formData.client) errors.client = "Required";
    if (!formData.division) errors.division = "Required";
    if (!formData.status) errors.status = "Required";
    if (!formData.expenditureType) errors.expenditureType = "Required";

    // Status-specific validations
    if (formData.status === "Complete") {
      // Event ID and category are required when Complete
      if (!formData.eventId)
        errors.eventId = "Required when status is Complete";
      if (!formData.category)
        errors.category = "Required when status is Complete";
      if (!formData.numberOfParticipants)
        errors.numberOfParticipants = "Required when status is Complete";
      if (!formData.nameOfL1Vendor)
        errors.nameOfL1Vendor = "Required when status is Complete";

      // Auction-type specific validations
      if (formData.auctionType === "Reverse Auction") {
        if (
          formData.preBid === "" ||
          formData.preBid === null ||
          typeof formData.preBid === "undefined"
        )
          errors.preBid = "Required when Complete";
        if (
          formData.postBid === "" ||
          formData.postBid === null ||
          typeof formData.postBid === "undefined"
        )
          errors.postBid = "Required when Complete";
        if (
          formData.savings === "" ||
          formData.savings === null ||
          typeof formData.savings === "undefined"
        )
          errors.savings = "Required when Complete";
        if (
          formData.savingsPercent === "" ||
          formData.savingsPercent === null ||
          typeof formData.savingsPercent === "undefined"
        )
          errors.savingsPercent = "Required when Complete";

        // Validate non-negative numbers
        if (formData.preBid < 0) errors.preBid = "Must be non-negative";
        if (formData.postBid < 0) errors.postBid = "Must be non-negative";
        if (formData.savings < 0) errors.savings = "Must be non-negative";
        if (formData.savingsPercent < 0)
          errors.savingsPercent = "Must be non-negative";
      } else if (formData.auctionType === "Forward Auction") {
        if (
          formData.preBid === "" ||
          formData.preBid === null ||
          typeof formData.preBid === "undefined"
        )
          errors.preBid = "Benchmark required when Complete";
        if (
          formData.postBid === "" ||
          formData.postBid === null ||
          typeof formData.postBid === "undefined"
        )
          errors.postBid = "Required when Complete";
        if (
          formData.savings === "" ||
          formData.savings === null ||
          typeof formData.savings === "undefined"
        )
          errors.savings = "Earning required when Complete";
        if (
          formData.savingsPercent === "" ||
          formData.savingsPercent === null ||
          typeof formData.savingsPercent === "undefined"
        )
          errors.savingsPercent = "Earning % required when Complete";

        // Validate non-negative numbers
        if (formData.preBid < 0) errors.preBid = "Must be non-negative";
        if (formData.postBid < 0) errors.postBid = "Must be non-negative";
        if (formData.savings < 0) errors.savings = "Must be non-negative";
        if (formData.savingsPercent < 0)
          errors.savingsPercent = "Must be non-negative";
      }
    }

    if (formData.assignedTo.length === 0)
      errors.assignedTo = "At least one assignee is required";

    if (Object.keys(errors).length > 0) {
      setFormData((prev) => ({ ...prev, errors }));
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for backend
      console.log("🔄 Preparing data for backend update...");
      const [auctionDate, auctionTime] = formData.dateTime.split("T");
      console.log("📅 Split date/time:", { auctionDate, auctionTime });

      const updateData = {
        taskType: "Auction",
        auctionType: formData.auctionType,
        eventId: formData.eventId,
        eventName: formData.eventName,
        requesterName: formData.requestor,
        client: formData.client,
        division: formData.division,
        assignEmployees: formData.assignedTo.map((emp) => emp.email), // Convert to emails
        auctionDate,
        category: formData.category,
        auctionTime,
        remarks: formData.remark,
        status: formData.status,
        expenditureType: formData.expenditureType,
      };

      // Add status-specific fields
      if (formData.status === "Complete") {
        if (formData.auctionType === "Reverse Auction") {
          updateData.prebid = parseFloat(formData.preBid);
          updateData.postbid = parseFloat(formData.postBid);
          updateData.savings = parseFloat(formData.savings);
          updateData.savingsPercentage = parseFloat(formData.savingsPercent);
        } else if (formData.auctionType === "Forward Auction") {
          updateData.benchmark = parseFloat(formData.preBid);
          updateData.postbid = parseFloat(formData.postBid);
          updateData.earning = parseFloat(formData.savings);
          updateData.earningPercentage = parseFloat(formData.savingsPercent);
        }
        updateData.numberOfParticipants = parseInt(formData.numberOfParticipants);
        updateData.nameOfL1Vendor = formData.nameOfL1Vendor;
      }

      // Convert auctionDate from YYYY-MM-DD to DD-MM-YYYY format
      if (
        updateData.auctionDate &&
        /^\d{4}-\d{2}-\d{2}$/.test(updateData.auctionDate)
      ) {
        const [year, month, day] = updateData.auctionDate.split("-");
        updateData.auctionDate = `${day}-${month}-${year}`;
      }

      console.log("📤 Data to send to backend:", updateData);
      console.log(
        "📋 Complete data being sent to database:",
        JSON.stringify(updateData, null, 2)
      );
      console.log(" Making API call to update task:", editId);
      await api.updateAuctionTask(editId, updateData);
      console.log("✅ Successfully updated auction task:", editId);

      // Refresh data to update counts and ensure consistency
      await fetchTasks();

      closeModal();
      success("Auction task updated successfully");
    } catch (err) {
      console.error("❌ Error updating auction task:", err);
      console.error("❌ Error details:", {
        message: err.message,
        stack: err.stack,
        response: err.response,
      });
      toastError("Failed to update auction task");
    } finally {
      setIsLoading(false);
      console.log("🏁 Form submission completed");
    }
  };

  // Employee handling
  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "UN";

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        emp.position
          .toLowerCase()
          .includes(employeeSearchTerm.toLowerCase())) &&
      !formData.assignedTo.some((assigned) => assigned.email === emp.email) // Exclude already assigned employees
  );

  const handleEmployeeSelect = (emp) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: [...prev.assignedTo, emp],
      errors: { ...prev.errors, assignedTo: "" },
    }));
    setEmployeeSearchTerm("");
    setShowModalEmployeeDropdown(false);
  };

  const handleEmployeeRemove = (email) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((e) => e.email !== email),
    }));
  };

  // Category functions
  const fetchCategories = async (auctionType) => {
    if (!auctionType) return;

    const categoryType =
      auctionType === "Forward Auction"
        ? "Forward Auction Category"
        : "Reverse Auction Category";

    console.log("📂 Fetching categories for type:", categoryType);
    try {
      setCategoriesLoading(true);
      const response = await api.getCategories(categoryType);
      console.log("📂 Categories response:", response);
      setCategories(response.categories || []);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    console.log("📝 Creating new category...");

    const errors = {};
    if (!categoryFormData.categoryName.trim()) {
      errors.categoryName = "Category name is required";
    }
    if (!categoryFormData.categoryType.trim()) {
      errors.categoryType = "Category type is required";
    }

    if (Object.keys(errors).length > 0) {
      setCategoryFormErrors(errors);
      return;
    }

    try {
      const response = await api.createCategory(categoryFormData);
      console.log("✅ Category created:", response);

      // Add the new category to the list
      setCategories((prev) => [...prev, response.category]);

      // Close modal and reset form
      setCategoryModalVisible(false);
      setCategoryFormData({ categoryName: "", categoryType: "" });
      setCategoryFormErrors({});
    } catch (error) {
      console.error("❌ Error creating category:", error);
      if (error.message?.includes("already exists")) {
        setCategoryFormErrors({ categoryName: "Category name already exists" });
      } else {
        alert("Failed to create category");
      }
    }
  };

  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData((prev) => ({ ...prev, [name]: value }));
    setCategoryFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const openCategoryModal = () => {
    // Set category type based on current auction type
    const categoryType =
      formData.auctionType === "Forward Auction"
        ? "Forward Auction Category"
        : "Reverse Auction Category";

    setCategoryFormData({
      categoryName: "",
      categoryType: categoryType,
    });
    setCategoryModalVisible(true);
  };

  // File handling
  const handleAttachmentAdd = (e) => {
    const files = Array.from(e.target.files).map((f) => f.name);
    setFormData((prev) => ({
      ...prev,
      fileUrls: [...prev.fileUrls, ...files],
    }));
  };

  const handleAttachmentRemove = (idx) => {
    setFormData((prev) => ({
      ...prev,
      fileUrls: prev.fileUrls.filter((_, i) => i !== idx),
    }));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalEmployeeDropdownRef.current &&
        !modalEmployeeDropdownRef.current.contains(e.target)
      ) {
        setShowModalEmployeeDropdown(false);
      }
      if (
        dueDateDropdownRef.current &&
        !dueDateDropdownRef.current.contains(e.target)
      ) {
        setShowDueDateFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isForwardAuction = formData.auctionType === "Forward Auction";
  const isComplete = formData.status === "Complete";

  // Fetch auction tasks and employees on component mount
  const fetchTasks = async () => {
    console.log("🔄 Starting to fetch data...");

    try {
      // Fetch employees
      console.log("👥 Fetching employees...");
      setEmployeesLoading(true);
      const employeesResponse = await api.getEmployees();
      console.log("👥 Employees response:", employeesResponse);

      // Handle different employee response formats
      const employeesData = Array.isArray(employeesResponse)
        ? employeesResponse
        : employeesResponse.employees || employeesResponse.data || [];
      console.log("👥 Processed employees data:", employeesData);

      // Transform employee data
      const transformedEmployees = employeesData.map((emp) => ({
        id: emp._id || emp.id,
        name:
          emp.name ||
          emp.fullName ||
          `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
        email: emp.email,
        position: emp.position || emp.designation || emp.role || "Employee",
        avatar: emp.avatar || emp.profileImage || "",
      }));
      console.log("✅ Transformed employees:", transformedEmployees);
      setEmployees(transformedEmployees);

      // Set hardcoded divisions for EKL
      const divisions = ["EAM", "ECE", "KAI"];
      setDivisions(divisions);
    } catch (empErr) {
      console.error("❌ Error fetching employees:", empErr);
      // Continue with empty employees array
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }

    try {
      // Fetch auction tasks
      setLoading(true);
      console.log("📡 Making API call to get auction tasks...");
      const response = await api.getAuctionTasks();
      console.log("📦 Raw API response:", response);

      // Handle API response structure
      const tasksData = response.tasks || [];
      console.log("📋 Processed tasks data:", tasksData);

      // Transform backend data to frontend format (basic transformation)
      const transformedTasks = tasksData.map((task) => {
        console.log("🔄 Transforming task:", task);
        return {
          ...task,
          requestor: task.requesterName, // Map requesterName to requestor
          preBid: task.prebid,
          postBid: task.postbid,
          savingsPercent: task.savingsPercentage,
          dateTime:
            task.auctionDate && task.auctionDate !== "-"
              ? `${task.auctionDate.split("-").reverse().join("-")}T${
                  task.auctionTime || "00:00"
                }`
              : new Date().toISOString().split("T")[0] + "T00:00",
          remark: task.remarks,
          assignedTo: (task.assignedTo || []).map((email) => {
            const employee = employees.find((emp) => emp.email === email);
            return (
              employee || {
                email,
                name: email.split("@")[0].replace(".", " "),
                avatar: "",
                position: "Employee",
              }
            );
          }),
        };
      });
      console.log("✅ Transformed tasks:", transformedTasks);
      setTasks(transformedTasks);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching auction tasks:", err);
      console.error("❌ Error details:", {
        message: err.message,
        stack: err.stack,
        response: err.response,
      });
      setError("Failed to load auction tasks");
    } finally {
      setLoading(false);
      setIsPageLoading(false);
      console.log("🏁 Fetch data completed");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update tasks with employee information when employees are loaded
  useEffect(() => {
    if (employees.length > 0 && tasks.length > 0) {
      console.log("🔄 Updating tasks with employee information...");
      const updatedTasks = tasks.map((task) => ({
        ...task,
        assignedTo: task.assignedTo.map((assigned) => {
          const employee = employees.find(
            (emp) => emp.email === assigned.email
          );
          return employee || assigned;
        }),
      }));
      setTasks(updatedTasks);
      console.log("✅ Tasks updated with employee information");
    }
  }, [employees, tasks.length]);

  // Status options for filter
  const statusOptions = [
    { value: "Open", label: "Open" },
    { value: "Complete", label: "Complete" },
    { value: "Hold", label: "Hold" },
  ];

  // Filtered employees for filter dropdown
  const filteredEmployeesForFilter = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(filterEmployeeSearch.toLowerCase()) ||
      emp.email.toLowerCase().includes(filterEmployeeSearch.toLowerCase())
  );

  // Filter functions
  const toggleStatus = (status) => {
    setFilterStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleEmployee = (email) => {
    setFilterEmployee((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterStatus([]);
    setFilterEmployee([]);
    setFilterEmployeeSearch("");
    setDueDateFilter("none");
    setCustomDateRange({ start: "", end: "" });
    setShowDueDateFilterDropdown(false);
  };

  const isFilterApplied = () => {
    return (
      filterStatus.length > 0 ||
      filterEmployee.length > 0 ||
      dueDateFilter !== "none"
    );
  };

  // Date filtering function for auction tasks
  const filterByAuctionDate = (task) => {
    if (!dueDateFilter || dueDateFilter === "none") return true;
    const auctionDate = task.auctionDate
      ? new Date(task.auctionDate.split("-").reverse().join("-"))
      : null;
    if (!auctionDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDateFilter === "today")
      return auctionDate.toDateString() === today.toDateString();
    if (dueDateFilter === "week") {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return auctionDate >= weekStart && auctionDate <= weekEnd;
    }
    if (dueDateFilter === "month")
      return (
        auctionDate.getMonth() === today.getMonth() &&
        auctionDate.getFullYear() === today.getFullYear()
      );
    if (dueDateFilter === "year")
      return auctionDate.getFullYear() === today.getFullYear();
    if (
      dueDateFilter === "custom" &&
      customDateRange?.start &&
      customDateRange?.end
    ) {
      const start = new Date(customDateRange.start);
      const end = new Date(customDateRange.end);
      return auctionDate >= start && auctionDate <= end;
    }
    return true;
  };

  // Export to Excel function
  const exportToExcel = () => {
    setShowMISModal(true);
  };

  // Handle MIS Report Download
  const handleMISDownload = async () => {
    // Validate form
    const errors = {};
    if (!misFormData.client) errors.client = "Client is required";
    if (!misFormData.fromDate) errors.fromDate = "From Date is required";
    if (!misFormData.toDate) errors.toDate = "To Date is required";
    if (
      misFormData.client === "EKL" &&
      misFormData.selectedDivisions.length === 0
    )
      errors.selectedDivisions =
        "At least one division must be selected for EKL client";
    if (misFormData.selectedFields.length === 0)
      errors.selectedFields = "At least one field must be selected";

    if (Object.keys(errors).length > 0) {
      setMisFormErrors(errors);
      return;
    }

    setIsDownloadingMIS(true);
    setMisFormErrors({});

    try {
      // Helper to get month-year from date string
      const getMonthYear = (dateStr) => {
        if (!dateStr || dateStr === "-") return "";
        try {
          const [day, month, year] = dateStr.split("-");
          const date = new Date(`${year}-${month}-${day}`);
          const monthName = date.toLocaleString("default", { month: "long" });
          return `${monthName}-${year}`;
        } catch {
          return "";
        }
      };

      // Prepare data for API call
      const reportData = {
        client: misFormData.client,
        fromDate: misFormData.fromDate.split('-').reverse().join('-'), // Convert YYYY-MM-DD to DD-MM-YYYY
        toDate: misFormData.toDate.split('-').reverse().join('-'), // Convert YYYY-MM-DD to DD-MM-YYYY
        division: misFormData.selectedDivisions,
        selectedFields: misFormData.selectedFields,
      };

      // Make API call to download MIS report
      const response = await fetch(
        "https://task-manager-backend-xs5s.onrender.com/api/auction/download-mis-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(reportData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download MIS report");
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `MIS_Report_${misFormData.client}_${misFormData.fromDate}_to_${misFormData.toDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setShowMISModal(false);
      setMisFormData({
        client: "",
        fromDate: "",
        toDate: "",
        selectedDivisions: [],
        selectedFields: [],
      });
      success("MIS Report downloaded successfully");
    } catch (error) {
      console.error("Error downloading MIS report:", error);
      toastError("Failed to download MIS report");
    } finally {
      setIsDownloadingMIS(false);
    }
  };

  // Filtered tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm === "" ||
      task.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.eventId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.requestor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus.length === 0 || filterStatus.includes(task.status);

    const matchesEmployee =
      filterEmployee.length === 0 ||
      (Array.isArray(task.assignedTo) &&
        task.assignedTo.some((emp) => filterEmployee.includes(emp.email)));

    const matchesDate = filterByAuctionDate(task);

    return matchesSearch && matchesStatus && matchesEmployee && matchesDate;
  });

  return (
    <div className="h-3">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Search and Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
            placeholder="Search by event name, ID, requestor, or client..."
            disabled={loading}
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
                      <span
                        key={status}
                        className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 border border-gray-300"
                      >
                        {status[0]}
                      </span>
                    ))}
                    {filterStatus.length > 5 && (
                      <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 ml-1">
                        +{filterStatus.length - 5}
                      </span>
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
                  disabled={loading}
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
                    disabled={loading}
                  />
                  <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 mr-2 border border-gray-300">
                    {opt.label[0]}
                  </span>
                  {opt.label}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="relative min-w-[180px] max-w-full sm:min-w-[220px] sm:max-w-[220px]">
          <div
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center justify-between text-xs sm:text-sm"
            onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
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
                      const emp = employees.find((e) => e.email === email);
                      return emp?.avatar ? (
                        <img
                          key={email}
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-5 h-5 rounded-full border border-gray-300"
                        />
                      ) : (
                        <span
                          key={email}
                          className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600"
                        >
                          {getInitials(emp?.name || "U")}
                        </span>
                      );
                    })}
                    {filterEmployee.length > 5 && (
                      <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 ml-1">
                        +{filterEmployee.length - 5}
                      </span>
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
                onChange={(e) => setFilterEmployeeSearch(e.target.value)}
                className="w-full px-3 py-2 border-b border-gray-300 text-xs sm:text-sm"
                placeholder="Search by name "
                disabled={loading}
              />
              <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm">
                <input
                  type="checkbox"
                  checked={filterEmployee.length === 0}
                  onChange={() => setFilterEmployee([])}
                  className="mr-2"
                  disabled={loading}
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
                    disabled={loading}
                  />
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
        <div className="relative min-w-[180px] max-w-full sm:min-w-[220px] sm:max-w-[220px]">
          <div
            className="px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center justify-between w-full text-xs sm:text-sm"
            onClick={() =>
              setShowDueDateFilterDropdown(!showDueDateFilterDropdown)
            }
          >
            <span className="flex flex-wrap items-center gap-1">
              {dueDateFilter === "none" ? (
                <>
                  <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 mr-2">
                    All
                  </span>
                  All Dates
                </>
              ) : (
                <>
                  <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 border border-gray-300">
                    {dueDateFilter[0]?.toUpperCase()}
                  </span>
                  <span className="ml-2">
                    {dueDateFilter === "today"
                      ? "Today"
                      : dueDateFilter === "week"
                      ? "This Week"
                      : dueDateFilter === "month"
                      ? "This Month"
                      : dueDateFilter === "year"
                      ? "This Year"
                      : dueDateFilter === "custom"
                      ? "Custom Date"
                      : dueDateFilter}
                  </span>
                </>
              )}
            </span>
          </div>
          {showDueDateFilterDropdown && (
            <div
              ref={dueDateDropdownRef}
              className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg min-w-[180px] max-w-full sm:min-w-[220px] sm:max-w-[220px]"
            >
              <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm">
                <input
                  type="radio"
                  name="dueFilter"
                  checked={dueDateFilter === "none"}
                  onChange={() => setDueDateFilter("none")}
                  className="mr-2"
                  disabled={loading}
                />
                <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 mr-2">
                  All
                </span>
                <span>No Filter</span>
              </label>
              <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm">
                <input
                  type="radio"
                  name="dueFilter"
                  checked={dueDateFilter === "today"}
                  onChange={() => setDueDateFilter("today")}
                  className="mr-2"
                  disabled={loading}
                />
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 mr-2 border border-gray-300">
                  T
                </span>
                <span>Today</span>
              </label>
              <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm">
                <input
                  type="radio"
                  name="dueFilter"
                  checked={dueDateFilter === "week"}
                  onChange={() => setDueDateFilter("week")}
                  className="mr-2"
                  disabled={loading}
                />
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 mr-2 border border-gray-300">
                  W
                </span>
                <span>This Week</span>
              </label>
              <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm">
                <input
                  type="radio"
                  name="dueFilter"
                  checked={dueDateFilter === "month"}
                  onChange={() => setDueDateFilter("month")}
                  className="mr-2"
                  disabled={loading}
                />
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 mr-2 border border-gray-300">
                  M
                </span>
                <span>This Month</span>
              </label>
              <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm">
                <input
                  type="radio"
                  name="dueFilter"
                  checked={dueDateFilter === "year"}
                  onChange={() => setDueDateFilter("year")}
                  className="mr-2"
                  disabled={loading}
                />
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 mr-2 border border-gray-300">
                  Y
                </span>
                <span>This Year</span>
              </label>
              <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm">
                <input
                  type="radio"
                  name="dueFilter"
                  checked={dueDateFilter === "custom"}
                  onChange={() => setDueDateFilter("custom")}
                  className="mr-2"
                  disabled={loading}
                />
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 mr-2 border border-gray-300">
                  C
                </span>
                <span>Custom Date</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
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
            disabled={loading}
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIsPageLoading(true);
              fetchTasks();
            }}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center text-sm sm:text-base w-full sm:w-10 h-10 relative group"
            title="Refresh Tasks"
            disabled={loading}
          >
            <RefreshCw className="w-5 h-5" />
            <span className="absolute left-1/2 transform -translate-x-1/2 -top-7 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
              Refresh Tasks
            </span>
          </button>
          {isFilterApplied() && (
            <button
              onClick={clearAllFilters}
              className="p-2 bg-red-600 text-white rounded-md hover:bg-gray-700 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto h-10"
              title="Clear Filters"
              disabled={loading}
            >
              <FunnelX />
            </button>
          )}
          <button
            onClick={() =>
              updateViewMode(viewMode === "table" ? "cards" : "table")
            }
            className="p-2 bg-orange-500 text-gray-800 rounded-md hover:bg-slate-900 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto h-10"
            title={
              viewMode === "table"
                ? "Switch to Cards view"
                : "Switch to Table view"
            }
          >
            {viewMode === "table" ? (
              <IdCard className="text-white size-6" />
            ) : (
              <Table className="text-white size-6" />
            )}
          </button>
          {viewMode !== "cards" && (
            <button
              onClick={() => setShowFilterDrawer(true)}
              className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto h-10"
              title="Advanced Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "cards" ? (
        <AuctionCardsView
          tasks={filteredTasks}
          allTasks={tasks}
          loading={loading}
          error={error}
          onTaskClick={handleRowClick}
          onDeleteClick={showDeleteConfirmation}
          onReminderClick={handleReminderEmail}
          employees={employees}
          showFilterDrawer={showFilterDrawer}
          setShowFilterDrawer={setShowFilterDrawer}
          filterEmployee={filterEmployee}
          setFilterEmployee={setFilterEmployee}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          clearAllFilters={clearAllFilters}
        />
      ) : (
        /* Table */
        <div
          className="relative max-w-full mx-auto rounded-xl shadow-lg overflow-hidden w-auto bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${SevenProcure})`,
            backgroundSize: "30%",
          }}
        >
          {/* Glassy Overlay */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>

          {/* Content Layer */}
          <div className="relative z-10">
            <div className="overflow-x-auto max-h-[65vh] rounded-lg shadow-md bg-white/50 backdrop-blur-lg">
              <table className="w-full text-xs sm:text-sm text-left text-gray-800 table-fixed">
                <thead className="bg-gray-200 backdrop-blur-md text-black sticky top-0 z-10">
                  <tr>
                    {[
                      "Event Id",
                      "Event Name",
                      "Requestor",
                      "Date & Time",
                      "Savings",
                      "Savings %",
                      "Assigned To",
                      "Status",
                      "Actions",
                    ]
                      .filter(Boolean)
                      .map((h, i) => (
                        <th
                          key={i}
                          className="px-2 sm:px-4 py-2 font-semibold text-center w-[12.5%]"
                        >
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="px-2 sm:px-4 py-8 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                          <p className="text-gray-600">
                            Loading auction tasks...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="9" className="px-2 sm:px-4 py-8 text-center">
                        <div className="text-center">
                          <p className="text-red-500 mb-4">{error}</p>
                          <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Retry
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-2 sm:px-4 py-8 text-center">
                        <p className="text-gray-500">No auction tasks found.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr
                        key={task.taskId}
                        className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                        onClick={() => handleRowClick(task)}
                      >
                        <td className="px-2 sm:px-4 py-2 truncate text-center">
                          {task.eventId}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-start max-w-[140px] font-bold relative group cursor-pointer">
                          <span className="truncate block">
                            {task.eventName}
                          </span>

                          {/* Tooltip */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max max-w-xs hidden group-hover:block bg-red-900 text-white text-xs px-3 py-1 rounded-md shadow-lg z-20">
                            <span className="text-yellow-300">Event Name:</span>{" "}
                            {task.eventName}
                          </div>
                        </td>

                        <td className="px-2 sm:px-4 py-2 text-center">
                          {task.requestor}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center">
                          {task.auctionDate && task.auctionDate !== "-"
                            ? new Date(task.dateTime).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "-"}
                        </td>

                        {/* <td className="px-2 sm:px-4 py-2 text-center">
                          {task.savings !== "" ? formatCurrency(task.savings) : ""}
                        </td> */}

                        <td className="px-2 sm:px-4 py-2 text-center">
                          {task.savings === "" ||
                          task.savings === null ||
                          task.savings === undefined
                            ? "-" // blank → show "-"
                            : Number(task.savings) === 0
                            ? "₹0" // zero → show "₹0"
                            : formatCurrency(task.savings)}
                        </td>

                        {/* <td className="px-2 sm:px-4 py-2 text-center">
                          {task.savingsPercent !== "" ? `${task.savingsPercent}%` : "-"}
                        </td> */}

                        <td className="px-2 sm:px-4 py-2 text-center">
                          {task.savingsPercent === "" ||
                          task.savingsPercent === null ||
                          task.savingsPercent === undefined
                            ? "-" // blank → "-"
                            : Number(task.savingsPercent) === 0
                            ? "0%" // zero → "0%"
                            : `${task.savingsPercent}%`}
                        </td>

                        <td className="px-2 sm:px-4 py-2 text-center">
                          {Array.isArray(task.assignedTo)
                            ? task.assignedTo
                                .map((emp) => emp.name || emp.email || emp)
                                .join(", ")
                            : task.assignedTo}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              task.status === "Open"
                                ? "bg-green-200 text-black"
                                : task.status === "Complete"
                                ? "bg-red-200 text-black"
                                : task.status === "Hold"
                                ? "bg-gray-200 text-black"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showDeleteConfirmation(task);
                              }}
                              className="text-black hover:text-black bg-black/10 p-1 rounded-md hover:bg-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {/* <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReminderEmail(task);
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Mail className="w-4 h-4" />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalVisible && selectedTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-7xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 absolute top-2 right-2 z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                {editId ? "Edit Task" : "Task Details"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Task ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task ID
                  </label>
                  <input
                    type="text"
                    value={formData.taskId}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                </div>

                {/* Event ID - visible only when status is Complete */}
                {isComplete && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event ID <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="eventId"
                      value={formData.eventId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    {formData.errors.eventId && (
                      <p className="text-red-500 text-xs mt-1">
                        {formData.errors.eventId}
                      </p>
                    )}
                  </div>
                )}

                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {formData.errors.eventName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formData.errors.eventName}
                    </p>
                  )}
                </div>

                {/* Auction Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auction Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="auctionType"
                    value={formData.auctionType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="Forward Auction">Forward Auction</option>
                    <option value="Reverse Auction">Reverse Auction</option>
                  </select>
                </div>

                {/* Requestor, Client, Division, DateTime, Category, Status */}
                {["requestor", "client", "division"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field} <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    {formData.errors[field] && (
                      <p className="text-red-500 text-xs mt-1">
                        {formData.errors[field]}
                      </p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="Open">Open</option>
                    <option value="Complete">Complete</option>
                    <option value="Hold">Hold</option>
                  </select>
                </div>

                {/* Pre Bid / Benchmark - only when Complete */}
                {/* moved into the conditional block below so it's visible/editable when status is Complete */}

                {/* Conditional Fields when Complete */}
                {isComplete && (
                  <>
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-600">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option
                              key={category._id}
                              value={category.categoryName}
                            >
                              {category.categoryName}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={openCategoryModal}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm whitespace-nowrap"
                        >
                          Add Category
                        </button>
                      </div>
                      {formData.errors.category && (
                        <p className="text-red-500 text-xs mt-1">
                          {formData.errors.category}
                        </p>
                      )}
                    </div>

                    {/* Expenditure Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expenditure Type <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="expenditureType"
                        value={formData.expenditureType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Capex">Capex</option>
                        <option value="Opex">Opex</option>
                        <option value="Scrap">Scrap</option>
                      </select>
                      {formData.errors.expenditureType && (
                        <p className="text-red-500 text-xs mt-1">
                          {formData.errors.expenditureType}
                        </p>
                      )}
                    </div>

                    {/* Pre Bid / Benchmark (label depends on auctionType) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isForwardAuction ? "Benchmark *" : "Pre Bid *"}
                      </label>
                      <input
                        type="number"
                        name="preBid"
                        value={formData.preBid}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {formData.errors.preBid && (
                        <p className="text-red-500 text-xs mt-1">
                          {formData.errors.preBid}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Post Bid <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="postBid"
                        value={formData.postBid}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {formData.errors.postBid && (
                        <p className="text-red-500 text-xs mt-1">
                          {formData.errors.postBid}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isForwardAuction ? "Earning " : "Savings"}
                      </label>
                      <input
                        type="number"
                        value={formData.savings}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isForwardAuction ? "Earning%" : "Savings%"}
                      </label>
                      <input
                        type="text"
                        value={`${formData.savingsPercent}%`}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Participants <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="numberOfParticipants"
                        value={formData.numberOfParticipants}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {formData.errors.numberOfParticipants && (
                        <p className="text-red-500 text-xs mt-1">
                          {formData.errors.numberOfParticipants}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name of L1 Vendor <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="nameOfL1Vendor"
                        value={formData.nameOfL1Vendor}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {formData.errors.nameOfL1Vendor && (
                        <p className="text-red-500 text-xs mt-1">
                          {formData.errors.nameOfL1Vendor}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Assign Employees */}
                <div className="relative col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Employees <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={employeeSearchTerm}
                    onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                    onFocus={() => setShowModalEmployeeDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Search by name, email, or position"
                  />
                  {showModalEmployeeDropdown && (
                    <div
                      ref={modalEmployeeDropdownRef}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      {filteredEmployees.map((emp) => (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => handleEmployeeSelect(emp)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                        >
                          {emp.avatar ? (
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                              {getInitials(emp.name)}
                            </span>
                          )}
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-xs text-gray-500">
                              {emp.email} • {emp.position}
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
                        className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {emp.avatar ? (
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-5 h-5 rounded-full object-cover mr-1"
                          />
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs mr-1">
                            {getInitials(emp.name)}
                          </span>
                        )}
                        {emp.name}
                        <button
                          type="button"
                          onClick={() => handleEmployeeRemove(emp.email)}
                          className="ml-2"
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

                {/* File Attachments */}
                {/* <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </label>
                  <label className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-200 text-sm inline-flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Choose Files</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleAttachmentAdd}
                      className="hidden"
                    />
                  </label>
                  {formData.fileUrls.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.fileUrls.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                        >
                          <span className="flex items-center">
                            <Upload className="w-4 h-4 mr-2 text-gray-500" />
                            {file}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAttachmentRemove(i)}
                            className="text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div> */}

                {/* Remark */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remark
                  </label>
                  <input
                    type="text"
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm"
                  disabled={isLoading}
                >
                  {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                  <span>Update Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalVisible && taskToDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setDeleteModalVisible(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6 relative animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDeleteModalVisible(false)}
              className="text-gray-500 hover:text-gray-700 absolute top-2 right-2 z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-extrabold  text-gray-900 mb-2">
                Delete Auction Task
              </h3>
              <h3 className="text-lg font-semibold text-gray-500 mb-4">
                Are you sure you want to delete the task <br />{" "}
                <span className="text-black font-extrabold ">
                  "{taskToDelete.eventName}"{" "}
                </span>
                ? This action cannot be undone.
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setDeleteModalVisible(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {categoryModalVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setCategoryModalVisible(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl w-full max-w-md p-4 sm:p-6 relative animate-slide-in border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCategoryModalVisible(false)}
              className="text-gray-500 hover:text-gray-700 absolute top-2 right-2 z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Add New Category
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={categoryFormData.categoryName}
                  onChange={handleCategoryFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter category name"
                  required
                />
                {categoryFormErrors.categoryName && (
                  <p className="text-red-500 text-xs mt-1">
                    {categoryFormErrors.categoryName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Type *
                </label>
                <input
                  type="text"
                  name="categoryType"
                  value={categoryFormData.categoryType}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setCategoryModalVisible(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Filter Drawer */}
      {statusOptions && employees && (
        <TaskFilterDrawer
          isOpen={showFilterDrawer}
          onClose={() => setShowFilterDrawer(false)}
          filterEmployee={filterEmployee}
          setFilterEmployee={setFilterEmployee}
          employees={employees}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          statusOptions={statusOptions}
          filterPriority="all"
          setFilterPriority={() => {}}
          priorities={[]}
          dueDateFilter={dueDateFilter}
          setDueDateFilter={setDueDateFilter}
          showDueDateFilterDropdown={showDueDateFilterDropdown}
          setShowDueDateFilterDropdown={setShowDueDateFilterDropdown}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
          filterTaskType="all"
          setFilterTaskType={() => {}}
          taskTypes={[]}
          clearAllFilters={clearAllFilters}
          isAuctionMode={true}
        />
      )}

      {/* Sticky Filter Button for Cards View */}
      {viewMode === "cards" && (
        <button
          onClick={() => setShowFilterDrawer(true)}
          className="fixed top-1/2 right-4 z-40 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Advanced Filters"
        >
          <Filter className="w-6 h-6" />
        </button>
      )}

      {/* MIS Report Modal */}
      {showMISModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setShowMISModal(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl w-full max-w-md p-4 sm:p-6 relative animate-slide-in border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMISModal(false)}
              className="text-gray-500 hover:text-gray-700 absolute top-2 right-2 z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Download MIS Report
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client <span className="text-red-700">*</span>
                </label>
                <select
                  value={misFormData.client}
                  onChange={(e) =>
                    setMisFormData((prev) => ({
                      ...prev,
                      client: e.target.value,
                      division: "",
                      selectedFields: [],
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select Client</option>
                  <option value="EKL">EKL</option>
                  <option value="HT Media">HT Media</option>
                  <option value="TVTN">TVTN</option>

                  {/* <option value="Other">Other</option> */}
                </select>
                {misFormErrors.client && (
                  <p className="text-red-500 text-xs mt-1">
                    {misFormErrors.client}
                  </p>
                )}
              </div>

              {misFormData.client === "EKL" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Division<span className="text-red-700">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {divisions.map((division) => (
                        <label
                          key={division}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={misFormData.selectedDivisions.includes(
                              division
                            )}
                            onChange={(e) => {
                              const divisionName = division;
                              setMisFormData((prev) => ({
                                ...prev,
                                selectedDivisions: e.target.checked
                                  ? [...prev.selectedDivisions, divisionName]
                                  : prev.selectedDivisions.filter(
                                      (d) => d !== divisionName
                                    ),
                              }));
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{division}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {misFormErrors.selectedDivisions && (
                    <p className="text-red-500 text-xs mt-1">
                      {misFormErrors.selectedDivisions}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="date"
                    value={misFormData.fromDate}
                    onChange={(e) =>
                      setMisFormData((prev) => ({
                        ...prev,
                        fromDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {misFormErrors.fromDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {misFormErrors.fromDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="date"
                    value={misFormData.toDate}
                    onChange={(e) =>
                      setMisFormData((prev) => ({
                        ...prev,
                        toDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {misFormErrors.toDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {misFormErrors.toDate}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Fields to Include{" "}
                  <span className="text-red-700">*</span>
                </label>
                <div className="border border-gray-300 rounded-md p-3">
                  {(() => {
                    const allFields =
                      misFormData.client === "EKL"
                        ? [
                            "Client",
                            "Division",
                            "Event ID",
                            "Auction Date",
                            "Month-Year",
                            "Expenditure Type",
                            "Category",
                            "Event Name",
                            "Prebid",
                            "Post bid",
                            "Savings",
                            "Savings %",
                            "AssignedTo",
                            "Status",
                            "Auction Type",
                            "Requester Name",
                            "Auction Time",
                            "Benchmark",
                            "Earning",
                            "Earning %",
                            "Number of Participants",
                            "Name of L1 Vendor",
                            "Remarks",
                          ]
                        : [
                            "Client",
                            "Event ID",
                            "Auction Date",
                            "Month-Year",
                            "Expenditure Type",
                            "Category",
                            "Event Description",
                            "Prebid",
                            "Post bid",
                            "Savings",
                            "Savings %",
                            "AssignedTo",
                            "Status",
                            "Auction Type",
                            "Requester Name",
                            "Auction Time",
                            "Benchmark",
                            "Earning",
                            "Earning %",
                            "Number of Participants",
                            "Name of L1 Vendor",
                            "Remarks",
                          ];
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setMisFormData((prev) => ({
                              ...prev,
                              selectedFields:
                                allFields.length === prev.selectedFields.length
                                  ? []
                                  : [...allFields],
                            }))
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm mb-2"
                        >
                          {allFields.length ===
                          misFormData.selectedFields.length
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                          {allFields.map((field) => (
                            <label
                              key={field}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={misFormData.selectedFields.includes(
                                  field
                                )}
                                onChange={(e) => {
                                  const fieldName = field;
                                  setMisFormData((prev) => ({
                                    ...prev,
                                    selectedFields: e.target.checked
                                      ? [...prev.selectedFields, fieldName]
                                      : prev.selectedFields.filter(
                                          (f) => f !== fieldName
                                        ),
                                  }));
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span>{field}</span>
                            </label>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
                {misFormErrors.selectedFields && (
                  <p className="text-red-500 text-xs mt-1">
                    {misFormErrors.selectedFields}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowMISModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                  disabled={isDownloadingMIS}
                >
                  Cancel
                </button>
                <button
                  onClick={handleMISDownload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm"
                  disabled={isDownloadingMIS}
                >
                  {isDownloadingMIS && (
                    <Loader className="w-4 h-4 animate-spin" />
                  )}
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
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
};

export default AuctionTable;
