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
  Table
} from "lucide-react";
import SevenProcure from "../layout/icon.png";
import api from "../../services/api";
import { useToast } from "../../hooks/useToast";
import AuctionCardsView from "./AuctionCardsView";
import TaskFilterDrawer from "./TaskFilterDrawer";
const AuctionTableEemployee = () => {
  const { success, error: toastError } = useToast();
  const token = localStorage.getItem('token') || '';
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
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("auctionViewMode") || "table");

  // Update viewMode with localStorage persistence
  const updateViewMode = (newMode) => {
    setViewMode(newMode);
    localStorage.setItem("auctionViewMode", newMode);
  };

  // Responsive viewMode based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const saved = localStorage.getItem("auctionViewMode");
      if (!saved) {
        setViewMode(window.innerWidth >= 1024 ? "table" : "cards");
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Date filter states
  const [dueDateFilter, setDueDateFilter] = useState("none");
  const [showDueDateFilterDropdown, setShowDueDateFilterDropdown] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });

  // Refs for dropdowns
  const statusDropdownRef = useRef(null);
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
    fileUrls: [],
    remark: "",
    expenditureType: "",
    numberOfParticipants: "",
    nameOfL1Vendor: "",
    errors: {},
  });
  // Removed employee handling for employee view
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
        savings: selectedTask.savings !== undefined && selectedTask.savings !== null ? selectedTask.savings : "",
        savingsPercent: selectedTask.savingsPercent !== undefined && selectedTask.savingsPercent !== null ? selectedTask.savingsPercent : "",
        fileUrls: selectedTask.fileUrls || [],
        remark: selectedTask.remark || "",
        expenditureType: selectedTask.expenditureType || "",
        numberOfParticipants: selectedTask.numberOfParticipants !== undefined && selectedTask.numberOfParticipants !== null ? selectedTask.numberOfParticipants : "",
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

    console.log('🗑️ Starting to delete auction task:', taskToDelete.taskId);
    try {
      await api.deleteAuctionTask(taskToDelete.taskId);
      console.log('✅ Successfully deleted auction task:', taskToDelete.taskId);
      setTasks(tasks.filter((task) => task.taskId !== taskToDelete.taskId));
      if (selectedTask?.taskId === taskToDelete.taskId) {
        closeModal();
      }
      setDeleteModalVisible(false);
      setTaskToDelete(null);
      success('Auction task deleted successfully');
    } catch (err) {
      console.error('❌ Error deleting auction task:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      toastError('Failed to delete auction task');
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
      fileUrls: [],
      remark: "",
      expenditureType: "",
      numberOfParticipants: "",
      nameOfL1Vendor: "",
      errors: {},
    });
    // Removed employee handling
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
        const preBidVal = parseFloat(name === "preBid" ? value : updated.preBid) || 0;
        const postBidVal = parseFloat(name === "postBid" ? value : updated.postBid) || 0;

        let savings = 0;
        let savingsPercent = 0;

        if ((updated.auctionType || prev.auctionType) === "Reverse Auction") {
          // Reverse Auction: Savings = Pre bid - Post bid, Savings % = (savings / prebid) * 100
          savings = preBidVal - postBidVal;
          savingsPercent = preBidVal > 0 ? (savings / preBidVal) * 100 : 0;
        } else if ((updated.auctionType || prev.auctionType) === "Forward Auction") {
          // Forward Auction: Earning = Post bid - benchmark, Earning % = (earning / benchmark) * 100
          savings = postBidVal - preBidVal; // This represents earning
          savingsPercent = preBidVal > 0 ? (savings / preBidVal) * 100 : 0; // benchmark is preBid
        }

        updated.savings = savings >= 0 ? Number(savings.toFixed(2)) : 0;
        updated.savingsPercent = savingsPercent >= 0 ? Number(savingsPercent.toFixed(2)) : 0;
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
    console.log('📝 Starting form submission for task update');
    setIsLoading(true);

    const errors = {};

    // Only validate required fields if status is "Complete"
    if (formData.status === "Complete") {
      const requiredFields = [
        "auctionType",
        "eventName",
        "requestor",
        "client",
        "division",
        "dateTime",
        "status",
        "expenditureType",
        "eventId",
        "category",
        "numberOfParticipants",
        "nameOfL1Vendor",
      ];

      requiredFields.forEach((field) => {
        if (formData[field] === undefined || formData[field] === null || formData[field] === "") {
          errors[field] = `Required when status is Complete`;
        }
      });

      // Auction-type specific required fields
      if (formData.auctionType === "Reverse Auction") {
        ["preBid", "postBid", "savings", "savingsPercent"].forEach((field) => {
          if (formData[field] === undefined || formData[field] === null || formData[field] === "") {
            errors[field] = `Required when Complete`;
          }
        });
      } else if (formData.auctionType === "Forward Auction") {
        if (formData.preBid === undefined || formData.preBid === null || formData.preBid === "") {
          errors.preBid = "Benchmark required when Complete";
        }
        if (formData.postBid === undefined || formData.postBid === null || formData.postBid === "") {
          errors.postBid = "Required when Complete";
        }
        if (formData.savings === undefined || formData.savings === null || formData.savings === "") {
          errors.savings = "Earning required when Complete";
        }
        if (formData.savingsPercent === undefined || formData.savingsPercent === null || formData.savingsPercent === "") {
          errors.savingsPercent = "Earning % required when Complete";
        }
      }

      // Numeric validation
      const numericFields = [];
      if (formData.auctionType === "Reverse Auction") {
        numericFields.push("preBid", "postBid", "savings", "savingsPercent");
      } else if (formData.auctionType === "Forward Auction") {
        numericFields.push("preBid", "postBid", "savings", "savingsPercent");
      }
      numericFields.push("numberOfParticipants");

      numericFields.forEach((field) => {
        const value = parseFloat(formData[field]);
        if (isNaN(value) || value < 0) {
          errors[field] = `${field} must be a non-negative number`;
        }
      });
    }

    // No assignedTo validation for employee

    if (Object.keys(errors).length > 0) {
      setFormData((prev) => ({ ...prev, errors }));
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for backend
      console.log('🔄 Preparing data for backend update...');
      const [auctionDate, auctionTime] = formData.dateTime.split('T');
      console.log('📅 Split date/time:', { auctionDate, auctionTime });

      const updateData = {
        taskType: "Auction",
        auctionType: formData.auctionType,
        eventId: formData.eventId,
        eventName: formData.eventName,
        requesterName: formData.requestor,
        client: formData.client,
        division: formData.division,
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
      if (updateData.auctionDate && /^\d{4}-\d{2}-\d{2}$/.test(updateData.auctionDate)) {
        const [year, month, day] = updateData.auctionDate.split("-");
        updateData.auctionDate = `${day}-${month}-${year}`;
      }

      console.log('📤 Data to send to backend:', updateData);
      console.log('📋 Complete data being sent to database:', JSON.stringify(updateData, null, 2));
      console.log(' Making API call to update task:', editId);
      const updateResponse = await fetch(`https://task-manager-backend-xs5s.onrender.com/api/employee/update/auction-tasks/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!updateResponse.ok) throw new Error('Failed to update auction task');
      console.log('✅ Successfully updated auction task:', editId);

      // Refresh data to update counts and ensure consistency
      await fetchTasks();

      closeModal();
      success('Auction task updated successfully');
    } catch (err) {
      console.error('❌ Error updating auction task:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      toastError('Failed to update auction task');
    } finally {
      setIsLoading(false);
      console.log('🏁 Form submission completed');
    }
  };

  // Removed employee handling for employee view

  // Category functions
  const fetchCategories = async (auctionType) => {
    if (!auctionType) return;

    const categoryType = auctionType === "Forward Auction"
      ? "Forward Auction Category"
      : "Reverse Auction Category";

    console.log('📂 Fetching categories for type:', categoryType);
    try {
      setCategoriesLoading(true);
      const response = await api.getCategories(categoryType);
      console.log('📂 Categories response:', response);
      setCategories(response.categories || []);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    console.log('📝 Creating new category...');

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
      console.log('✅ Category created:', response);

      // Add the new category to the list
      setCategories(prev => [...prev, response.category]);

      // Close modal and reset form
      setCategoryModalVisible(false);
      setCategoryFormData({ categoryName: "", categoryType: "" });
      setCategoryFormErrors({});

    } catch (error) {
      console.error('❌ Error creating category:', error);
      if (error.message?.includes('already exists')) {
        setCategoryFormErrors({ categoryName: "Category name already exists" });
      } else {
        alert('Failed to create category');
      }
    }
  };

  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({ ...prev, [name]: value }));
    setCategoryFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const openCategoryModal = () => {
    // Set category type based on current auction type
    const categoryType = formData.auctionType === "Forward Auction"
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
    console.log('🔄 Starting to fetch data...');

    try {
      // Fetch employees
      console.log('👥 Fetching employees...');
      setEmployeesLoading(true);
      const employeesResponse = await api.getEmployees();
      console.log('👥 Employees response:', employeesResponse);

      // Handle different employee response formats
      const employeesData = Array.isArray(employeesResponse) ? employeesResponse :
                            employeesResponse.employees || employeesResponse.data || [];
      console.log('👥 Processed employees data:', employeesData);

      // Transform employee data
      const transformedEmployees = employeesData.map(emp => ({
        id: emp._id || emp.id,
        name: emp.name || emp.fullName || `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
        email: emp.email,
        position: emp.position || emp.designation || emp.role || 'Employee',
        avatar: emp.avatar || emp.profileImage || '',
      }));
      console.log('✅ Transformed employees:', transformedEmployees);
      setEmployees(transformedEmployees);

    } catch (empErr) {
      console.error('❌ Error fetching employees:', empErr);
      // Continue with empty employees array
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }

    try {
      // Fetch auction tasks
      setLoading(true);
      console.log('📡 Making API call to get auction tasks...');
      const response = await fetch('https://task-manager-backend-xs5s.onrender.com/api/employee/get/auction-tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch auction tasks');
      const data = await response.json();
      console.log('📦 Raw API response:', data);

      // Handle API response structure
      const tasksData = data.tasks || data || [];
      console.log('📋 Processed tasks data:', tasksData);

      // Transform backend data to frontend format (basic transformation)
      const transformedTasks = tasksData.map(task => {
        console.log('🔄 Transforming task:', task);
        return {
          ...task,
          requestor: task.requesterName, // Map requesterName to requestor
          preBid: task.prebid,
          postBid: task.postbid,
          savingsPercent: task.savingsPercentage,
          dateTime: (task.auctionDate && task.auctionDate !== "-") ?
            `${task.auctionDate.split('-').reverse().join('-')}T${task.auctionTime || "00:00"}` :
            new Date().toISOString().split('T')[0] + "T00:00",
          remark: task.remarks,
          assignedTo: (task.assignedTo || []).map(email => {
            const employee = employees.find(emp => emp.email === email);
            return employee || { email, name: email.split('@')[0].replace('.', ' '), avatar: '', position: 'Employee' };
          }),
        };
      });
      console.log('✅ Transformed tasks:', transformedTasks);
      setTasks(transformedTasks);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching auction tasks:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      setError('Failed to load auction tasks');
    } finally {
      setLoading(false);
      setIsPageLoading(false);
      console.log('🏁 Fetch data completed');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update tasks with employee information when employees are loaded
  useEffect(() => {
    if (employees.length > 0 && tasks.length > 0) {
      console.log('🔄 Updating tasks with employee information...');
      const updatedTasks = tasks.map(task => ({
        ...task,
        assignedTo: task.assignedTo.map(assigned => {
          const employee = employees.find(emp => emp.email === assigned.email);
          return employee || assigned;
        })
      }));
      setTasks(updatedTasks);
      console.log('✅ Tasks updated with employee information');
    }
  }, [employees, tasks.length]);

  // Status options for filter
  const statusOptions = [
    { value: "Open", label: "Open" },
    { value: "Complete", label: "Complete" },
    { value: "Hold", label: "Hold" },
  ];

  // Removed employee filter for employee view

  // Filter functions
  const toggleStatus = (status) => {
    setFilterStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterStatus([]);
    setDueDateFilter("none");
    setCustomDateRange({ start: "", end: "" });
    setShowDueDateFilterDropdown(false);
  };

  const isFilterApplied = () => {
    return filterStatus.length > 0 || dueDateFilter !== "none";
  };

  // Date filtering function for auction tasks
  const filterByAuctionDate = (task) => {
    if (!dueDateFilter || dueDateFilter === 'none') return true;
    const auctionDate = task.auctionDate ? new Date(task.auctionDate.split('-').reverse().join('-')) : null;
    if (!auctionDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDateFilter === 'today') return auctionDate.toDateString() === today.toDateString();
    if (dueDateFilter === 'week') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return auctionDate >= weekStart && auctionDate <= weekEnd;
    }
    if (dueDateFilter === 'month') return auctionDate.getMonth() === today.getMonth() && auctionDate.getFullYear() === today.getFullYear();
    if (dueDateFilter === 'year') return auctionDate.getFullYear() === today.getFullYear();
    if (dueDateFilter === 'custom' && customDateRange?.start && customDateRange?.end) {
      const start = new Date(customDateRange.start);
      const end = new Date(customDateRange.end);
      return auctionDate >= start && auctionDate <= end;
    }
    return true;
  };

  // Export to Excel function
  const exportToExcel = () => {
    // Simple CSV export for now
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Event ID,Event Name,Requestor,Client,Division,Auction Type,Status,Pre Bid,Post Bid,Savings,Savings %\n"
      + filteredTasks.map(task =>
          `"${task.eventId}","${task.eventName}","${task.requestor}","${task.client}","${task.division}","${task.auctionType}","${task.status}","${task.preBid || ''}","${task.postBid || ''}","${task.savings || ''}","${task.savingsPercent || ''}%"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "auction_tasks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = searchTerm === "" ||
      task.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.eventId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.requestor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(task.status);

    const matchesDate = filterByAuctionDate(task);

    return matchesSearch && matchesStatus && matchesDate;
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
          {/* <div
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
                      <span key={status} className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800 border border-gray-300">
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
          </div> */}
          {/* {showStatusDropdown && (
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
          )} */}
        </div>
        {/* Removed employee filter for employee view */}
        {/* <div className="relative min-w-[180px] max-w-full sm:min-w-[220px] sm:max-w-[220px]">
          <div
            className="px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center justify-between w-full text-xs sm:text-sm"
            onClick={() => setShowDueDateFilterDropdown(!showDueDateFilterDropdown)}
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
                    {dueDateFilter === "today" ? "Today" :
                     dueDateFilter === "week" ? "This Week" :
                     dueDateFilter === "month" ? "This Month" :
                     dueDateFilter === "year" ? "This Year" :
                     dueDateFilter === "custom" ? "Custom Date" : dueDateFilter}
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
        </div> */}
      </div>

      {/* Action Buttons */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to="/employee/createtasks">
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
          {/* <button
            onClick={() => updateViewMode(viewMode === "table" ? "cards" : "table")}
            className="p-2 bg-orange-500 text-gray-800 rounded-md hover:bg-slate-900 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto h-10"
            title={viewMode === "table" ? "Switch to Cards view" : "Switch to Table view"}
          >
            {viewMode === "table" ?  <IdCard className="text-white size-6" />: <Table className="text-white size-6" /> }
          </button> */}
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
          employees={[]}
          showFilterDrawer={showFilterDrawer}
          setShowFilterDrawer={setShowFilterDrawer}
          filterEmployee={[]}
          setFilterEmployee={() => {}}
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
                      "Status",
                      "Actions",
                    ]
                      .filter(Boolean)
                      .map((h, i) => (
                        <th
                          key={i}
                          className={`px-2 sm:px-4 py-2 font-semibold text-center ${
                            h === "Event Name"
                              ? "w-[30%]"
                              : h === "Date & Time"
                              ? "w-[15%]"
                              : h === "Actions"
                              ? "w-[8%]"
                              : "w-[10%]"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-2 sm:px-4 py-8 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                          <p className="text-gray-600">Loading auction tasks...</p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="8" className="px-2 sm:px-4 py-8 text-center">
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
                      <td colSpan="8" className="px-2 sm:px-4 py-8 text-center">
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
                          <span className="line-clamp-2">{task.eventName}</span>

                          {/* Tooltip */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max max-w-xs hidden group-hover:block bg-red-900 text-white text-xs px-3 py-1 rounded-md shadow-lg z-20">
                            <span className="text-yellow-300">Event Name:</span> {task.eventName}
                          </div>
                        </td>

                        <td className="px-2 sm:px-4 py-2 text-center">
                          {task.requestor}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center">
                          {task.auctionDate && task.auctionDate !== "-"
                            ? (() => {
                                const date = new Date(task.dateTime);
                                const dateStr = date.toLocaleDateString("en-IN");
                                const timeStr = date.toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                });
                                return `${dateStr} | ${timeStr}`;
                              })()
                            : "-"}
                        </td>

                        {/* <td className="px-2 sm:px-4 py-2 text-center">
                          {task.savings ? formatCurrency(task.savings) : "-"}
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
                          {task.savingsPercent ? `${task.savingsPercent}%` : "-"}
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
                        
                        <td className="px-2 sm:px-4 py-2 text-center pl-4">
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
                              className="text-red-500 hover:text-red-700"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                      Event ID  <span className="text-red-600">*</span>
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
                      {field}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status  <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
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
                        Category  <span className="text-red-600">*</span>
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
                            <option key={category._id} value={category.categoryName}>
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
                        Expenditure Type  <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="expenditureType"
                        value={formData.expenditureType}
                        onChange={handleInputChange}
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
                        {isForwardAuction ? "Benchmark *" : <span>Pre Bid <span className="text-red-600">*</span></span>}
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

                {/* No Assign Employees for employee view */}

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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Auction Task
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete the task "{taskToDelete.eventName}"? This action cannot be undone.
              </p>
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
      {statusOptions && (
        <TaskFilterDrawer
          isOpen={showFilterDrawer}
          onClose={() => setShowFilterDrawer(false)}
          filterEmployee={[]}
          setFilterEmployee={() => {}}
          employees={[]}
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

export default AuctionTableEemployee;

