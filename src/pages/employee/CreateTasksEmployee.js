

import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';

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

const validationSchema = Yup.object({
  taskType: Yup.string().required('Task Type is required'),
  auctionType: Yup.string().when('taskType', {
    is: 'Auction',
    then: (schema) => schema.required('Auction Type is required'),
    otherwise: (schema) => schema,
  }),
  taskName: Yup.string().when('taskType', {
    is: 'Auction',
    then: (schema) => schema.required('Event Name is required'),
    otherwise: (schema) => schema,
  }),
  requestorName: Yup.string().when('taskType', {
    is: 'Auction',
    then: (schema) => schema.required('Requestor Name is required'),
    otherwise: (schema) => schema,
  }),
  client: Yup.string().when('taskType', {
    is: 'Auction',
    then: (schema) => schema.required('Client is required'),
    otherwise: (schema) => schema,
  }),
  division: Yup.string().when('taskType', {
    is: 'Auction',
    then: (schema) => schema.required('Division is required'),
    otherwise: (schema) => schema,
  }),
  dueDate: Yup.string().when('taskType', {
    is: 'General',
    then: (schema) => schema.required('Due Date is required'),
    otherwise: (schema) => schema,
  }),
  priority: Yup.string().when('taskType', {
    is: 'General',
    then: (schema) => schema.required('Priority is required'),
    otherwise: (schema) => schema,
  }),
  dueTime: Yup.string().when('taskType', {
    is: 'Reminder',
    then: (schema) => schema.required('Due Time is required for Reminder tasks'),
    otherwise: (schema) => schema,
  }),
});

function CreateTasksEmployee({ onSubmit, editTask, onCancel }) {
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const dateInputRef = useRef(null);
  const auctionDateInputRef = useRef(null);
  const token = localStorage.getItem('token') || '';
  // Local editable lists and UI state for adding new requestors/categories
  const [localRequestors, setLocalRequestors] = useState([]);
  const [showAddRequestor, setShowAddRequestor] = useState(false);
  const [newRequestor, setNewRequestor] = useState({
    name: '',
    client: '',
    division: '',
  });

  const [requestorQuery, setRequestorQuery] = useState('');
  const [showRequestorSuggestions, setShowRequestorSuggestions] = useState(false);
  const filteredRequestors = localRequestors.filter((r) =>
    (r.requestorName || '').toLowerCase().includes((requestorQuery || '').toLowerCase())
  );
  const [requestorLoading, setRequestorLoading] = useState(false);

  // Set currentUser from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token) {
      console.log('Token:', token);
    }
    if (user && (user.firstName || user.email)) {
      const userData = {
        id: user.id || user._id || '',
        name: user.firstName || 'Unknown',
        email: user.email || '',
        department: user.department || 'Unknown',
        avatar: user.profileImage || '',
      };
      console.log('Logged-in user:', userData);
      setCurrentUser(userData);
    } else {
      setError('No user data found in localStorage');
    }
  }, [token]);

  // Fetch all requestors
  const fetchRequestors = async () => {
    console.log('Fetching requestors...');
    setRequestorLoading(true);
    try {
      const response = await fetch(
        'https://task-manager-backend-xs5s.onrender.com/api/get/requestors',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch requestors');
      const data = await response.json();
      console.log('Fetched requestors are as follows:', data);
      console.log('Requestors fetched successfully');
      setLocalRequestors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Error fetching requestors:', err);
      setToastMessage(err.message);
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setRequestorLoading(false);
    }
  };

  // Add new requestor
  const addRequestor = async (requestorData) => {
    console.log('Adding requestor:', requestorData);
    setRequestorLoading(true);
    try {
      const response = await fetch(
        'https://task-manager-backend-xs5s.onrender.com/api/create/requestors',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestorData),
        }
      );
      if (!response.ok) throw new Error('Failed to create requestor');
      console.log('Requestor added successfully');
      setToastMessage('Requestor created successfully!');
      setTimeout(() => setToastMessage(''), 3000);
      await fetchRequestors(); // Refetch after save
    } catch (err) {
      console.log('Error adding requestor:', err);
      setToastMessage(err.message);
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setRequestorLoading(false);
    }
  };

  // Call fetchRequestors on mount
  useEffect(() => {
    fetchRequestors();
  }, []);

  // Handle drag-and-drop events
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(true);
    };
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(true);
    };
    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
    };
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragleave', handleDragLeave);
    return () => {
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragenter', handleDragEnter);
      dropZone.removeEventListener('dragleave', handleDragLeave);
    };
  }, []);

  const initialValues = {
    taskType: editTask?.taskType || 'General',
    taskName: editTask?.taskName || '',
    description: editTask?.description || '',
    priority: editTask?.priority || 'Medium',
    dueDate: editTask?.dueDate || '',
    assignedTo: editTask?.assignedTo || (currentUser ? [{ email: currentUser.email, name: currentUser.name, avatar: currentUser.avatar }] : []),
    attachments: editTask?.attachments || [],
    remark: editTask?.remark || '',
    requestorName: editTask?.requestorName || '',
    client: editTask?.client || '',
    division: editTask?.division || '',
    expenditureType: editTask?.expenditureType || '',
    category: editTask?.category || '',
    auctionDate: editTask?.auctionDate || '',
    auctionTime: editTask?.auctionTime || '',
    auctionType: editTask?.auctionType || '',
    preBid: editTask?.preBid || '',
    dueTime: editTask?.dueTime || '',
    notificationEmail: editTask?.notificationEmail ?? true,
    notificationInApp: editTask?.notificationInApp ?? true,
    notificationAlarm: editTask?.notificationAlarm ?? false,
  };

  const handleAttachmentAdd = (files, setFieldValue, values) => {
    if (!files || !Array.isArray(files)) {
      console.warn('No valid files provided to handleAttachmentAdd');
      return;
    }
    const fileNames = files.map(file => file.name);
    console.log('Files captured in handleAttachmentAdd:', files);
    setFieldValue('attachments', [...values.attachments, ...fileNames]);
    if (fileInputRef.current) {
      const currentFiles = Array.from(fileInputRef.current.files || []);
      const dataTransfer = new DataTransfer();
      currentFiles.forEach(file => dataTransfer.items.add(file));
      files.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleAttachmentRemove = (index, setFieldValue, values) => {
    const removedName = values.attachments[index];
    setFieldValue('attachments', values.attachments.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      Array.from(fileInputRef.current.files || [])
        .filter(file => file.name !== removedName)
        .forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleFileInputChange = (e, setFieldValue, values) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      handleAttachmentAdd(files, setFieldValue, values);
    }
  };

  const handleDrop = (e, setFieldValue, values) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      handleAttachmentAdd(files, setFieldValue, values);
    }
  };

  const handleDropZoneClick = () => {
    if (fileInputRef.current && !loading) {
      fileInputRef.current.click();
    }
  };

  const handleDateClick = () => {
    if (dateInputRef.current && !loading) {
      dateInputRef.current.focus();
    }
  };

  const handleAuctionDateClick = () => {
    if (auctionDateInputRef.current && !loading) {
      auctionDateInputRef.current.focus();
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="sticky top-0 h-screen z-40">
        <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={!!localStorage.getItem('token')} onToggleSidebar={toggleSidebar} />
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              if (!token) {
                setToastMessage('Authentication token not found');
                setSubmitting(false);
                return;
              }
              let formattedDueDate = '';
              if (values.dueDate) {
                const [year, month, day] = values.dueDate.split('-');
                formattedDueDate = `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
              }
              
              let formattedAuctionDate = '';
              if (values.auctionDate) {
                const [aYear, aMonth, aDay] = values.auctionDate.split('-');
                formattedAuctionDate = `${aDay.padStart(2, '0')}-${aMonth.padStart(2, '0')}-${aYear}`;
              }
              try {
                setLoading(true);
                let response;
                if (values.taskType === 'Reminder') {
                  const notificationPreferences = [];
                  if (values.notificationEmail) notificationPreferences.push('Email');
                  if (values.notificationAlarm) notificationPreferences.push('Alarm');
                  const reminderData = {
                    taskName: values.taskName,
                    description: values.description, // Include description for Reminder tasks
                    reminderDate: formattedDueDate,
                    reminderTime: values.dueTime,
                    notificationPreferences,
                  };
                  response = await fetch('https://task-manager-backend-xs5s.onrender.com/api/employee/createreminder', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(reminderData),
                  });
                } else if (values.taskType === 'Auction') {
                  const auctionData = {
                    taskType: values.taskType,
                    auctionType: values.auctionType,
                    eventName: values.taskName,
                    requesterName: values.requestorName,
                    client: values.client,
                    division: values.division,
                    auctionDate: formattedAuctionDate,
                    auctionTime: values.auctionTime,
                    category: values.category,
                    [values.auctionType === 'Forward Auction' ? 'benchmark' : 'prebid']: values.preBid,
                  };
                  response = await fetch('https://task-manager-backend-xs5s.onrender.com/api/employee/create/auction-tasks', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(auctionData),
                  });
                } else {
                  const formDataToSend = new FormData();
                  formDataToSend.append('taskName', values.taskName);
                  formDataToSend.append('description', values.description);
                  formDataToSend.append('dueDate', formattedDueDate);
                  formDataToSend.append('assignedTo', JSON.stringify(values.assignedTo.map(emp => emp.email)));
                  formDataToSend.append('priority', values.priority);
                  formDataToSend.append('taskType', values.taskType);
                  formDataToSend.append('remark', values.remark);
                  if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
                    console.log('Files selected:', Array.from(fileInputRef.current.files));
                    Array.from(fileInputRef.current.files).forEach(file => {
                      formDataToSend.append('files', file);
                    });
                  } else {
                    console.log('No files selected or file input not found');
                  }
                  const url = editTask
                    ? `https://task-manager-backend-xs5s.onrender.com/api/tasks/update/${editTask.taskId}`
                    : 'https://task-manager-backend-xs5s.onrender.com/api/tasks';
                  const method = editTask ? 'PATCH' : 'POST';
                  response = await fetch(url, {
                    method,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    body: formDataToSend,
                  });
                }
                const text = await response.text();
                console.log('Raw response status:', response.status);
                console.log('Raw response:', text);
                let data;
                try {
                  data = JSON.parse(text);
                } catch (parseError) {
                  if (response.status === 500) {
                    throw new Error('Server error: Received HTML instead of JSON');
                  }
                  throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
                }
                if (!response.ok) {
                  throw new Error(data.message || (editTask ? 'Failed to update task' : 'Failed to create task/reminder'));
                }
                setToastMessage(editTask ? 'Task updated successfully!' : 'Task created successfully!');
                setTimeout(() => {
                  setToastMessage('');
                  navigate(values.taskType === 'Auction' ? '/employee/tasks?tab=Auctions' : '/employee/tasks');
                }, 3000);
                if (onSubmit) onSubmit(data);
                if (onCancel) onCancel();
                resetForm({
                  values: {
                    taskType: 'General',
                    taskName: '',
                    description: '',
                    priority: 'Medium',
                    dueDate: '',
                    assignedTo: currentUser ? [{ email: currentUser.email, name: currentUser.name, avatar: currentUser.avatar }] : [],
                    attachments: [],
                    remark: '',
                    requestorName: '',
                    client: '',
                    division: '',
                    category: '',
                    auctionDate: '',
                    auctionTime: '',
                    auctionType: '',
                    preBid: '',
                    dueTime: '',
                    notificationEmail: true,
                    notificationInApp: true,
                    notificationAlarm: false,
                  },
                });
                if (fileInputRef.current) fileInputRef.current.value = '';
              } catch (err) {
                console.error('Error processing task/reminder:', err.message);
                setToastMessage(`Error: ${err.message}`);
                setTimeout(() => setToastMessage(''), 3000);
              } finally {
                setSubmitting(false);
                setLoading(false);
              }
            }}
          >
            {({ values, setFieldValue, isSubmitting, touched, errors }) => (
              <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {editTask ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    {onCancel && (
                      <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={isSubmitting}
                        aria-label="Close"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                  {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
                  <Form className="space-y-6">
                    {/* Task Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Type <span className="text-red-600">*</span>
                      </label>
                      <Field
                        as="select"
                        name="taskType"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setFieldValue('taskType', e.target.value);
                          if (e.target.value !== 'Auction') {
                            setFieldValue('requestorName', '');
                            setFieldValue('client', '');
                            setFieldValue('division', '');
                            setFieldValue('expenditureType', '');
                            setFieldValue('category', '');
                            setFieldValue('auctionDate', '');
                            setFieldValue('auctionTime', '');
                            setFieldValue('auctionType', '');
                            setFieldValue('preBid', '');
                          }
                        }}
                      >
                        <option value="General">General</option>
                        <option value="Auction">Auction</option>
                        <option value="Reminder">Reminder</option>
                      </Field>
                      <ErrorMessage name="taskType" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    {/* Auction Type (Moved to just below Task Type) */}
                    {values.taskType === 'Auction' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Auction Type <span className="text-red-600">*</span>
                        </label>
                        <Field
                          as="select"
                          name="auctionType"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          disabled={isSubmitting}
                        >
                          <option value="">Select Auction Type</option>
                          <option value="Reverse Auction">Reverse Auction</option>
                          <option value="Forward Auction">Forward Auction</option>
                        </Field>
                        <ErrorMessage name="auctionType" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    )}
                    {/* Task Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {values.taskType === 'Auction' ? 'Event Name' : 'Task Name'} <span className="text-red-600">*</span>
                      </label>
                      <Field
                        type="text"
                        name="taskName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder={values.taskType === 'Auction' ? 'Enter event name' : 'Enter task name'}
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="taskName" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    {/* Description */}

                    {values.taskType === 'General' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <Field
                        as="textarea"
                        name="description"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter task description (optional)"
                        disabled={isSubmitting}
                      />
                    </div>
                     )}
                    {/* Auction-Specific Fields */}
                    {values.taskType === 'Auction' && (
                      <>
                        {/* Requestor Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Requestor Name <span className="text-red-600">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="requestorName"
                              value={requestorQuery ?? values.requestorName}
                              onChange={(e) => {
                                const v = e.target.value;
                                setRequestorQuery(v);
                                setFieldValue('requestorName', v);
                                setShowRequestorSuggestions(true);
                              }}
                              onFocus={() => setShowRequestorSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowRequestorSuggestions(false), 150)}
                              placeholder="Type or select requestor"
                              className={`w-full px-4 py-3 pr-10 border rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out ${
                                touched.requestorName && errors.requestorName
                                  ? 'border-red-500'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              disabled={isSubmitting}
                            />
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
                                        setFieldValue('requestorName', name);
                                        setFieldValue('client', r.client || '');
                                        setFieldValue('division', r.division || '');
                                        setShowRequestorSuggestions(false);
                                      }}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                    >
                                      {r.requestorName}
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-4 py-3 text-sm text-gray-500">No results</div>
                                )}
                                <div className="border-t border-gray-100 p-2">
                                  <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                      setShowAddRequestor(true);
                                      setNewRequestor((prev) => ({
                                        ...prev,
                                        name: requestorQuery || values.requestorName,
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
                                    name: requestorQuery || values.requestorName,
                                  }));
                                }}
                                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                                disabled={requestorLoading}
                              >
                                Add Requestor
                              </button>
                            </div>
                          </div>
                          {touched.requestorName && errors.requestorName && (
                            <div className="text-red-500 text-sm mt-1">{errors.requestorName}</div>
                          )}
                          {/* Inline Add Requestor form */}
                          {showAddRequestor && (
                            <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Requestor Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newRequestor.name}
                                onChange={(e) => setNewRequestor((prev) => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md mb-2"
                                placeholder="Enter requestor name"
                              />
                              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                              <input
                                type="text"
                                value={newRequestor.client}
                                onChange={(e) => setNewRequestor((prev) => ({ ...prev, client: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md mb-2"
                                placeholder="Enter client"
                              />
                              <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                              <input
                                type="text"
                                value={newRequestor.division}
                                onChange={(e) => setNewRequestor((prev) => ({ ...prev, division: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md mb-3"
                                placeholder="Enter division"
                              />
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!newRequestor.name) {
                                      setToastMessage('Requestor name is required');
                                      setTimeout(() => setToastMessage(''), 3000);
                                      return;
                                    }
                                    const obj = {
                                      requestorName: newRequestor.name,
                                      client: newRequestor.client,
                                      division: newRequestor.division,
                                    };
                                    await addRequestor(obj);
                                    setRequestorQuery(newRequestor.name);
                                    setFieldValue('requestorName', newRequestor.name);
                                    setFieldValue('client', newRequestor.client);
                                    setFieldValue('division', newRequestor.division);
                                    setNewRequestor({ name: '', client: '', division: '' });
                                    setShowAddRequestor(false);
                                  }}
                                  disabled={requestorLoading}
                                  className={`px-3 py-1 bg-blue-600 text-white rounded-md flex items-center justify-center ${
                                    requestorLoading ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  {requestorLoading ? (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                  ) : (
                                    'Save'
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewRequestor({ name: '', client: '', division: '' });
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
                              Client <span className="text-red-600">*</span>
                            </label>
                            <Field
                              type="text"
                              name="client"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Client (auto-filled)"
                              disabled
                            />
                            <ErrorMessage name="client" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Division <span className="text-red-600">*</span>
                            </label>
                            <Field
                              type="text"
                              name="division"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Division (auto-filled)"
                              disabled
                            />
                            <ErrorMessage name="division" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                        </div>
                        {/* Category */}
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <Field
                            as="select"
                            name="category"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={isSubmitting}
                          >
                            <option value="">Select Category</option>
                            {(values.auctionType === 'Forward Auction' ? forwardCategories : categories).map((cat, index) => (
                              <option key={index} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                        </div> */}
                        {/* Auction Date and Auction Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div onClick={handleAuctionDateClick}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Auction Date
                            </label>
                            <Field
                              type="date"
                              name="auctionDate"
                              innerRef={auctionDateInputRef}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                            <ErrorMessage name="auctionDate" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Auction Time
                            </label>
                            <Field
                              type="time"
                              name="auctionTime"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              disabled={isSubmitting}
                            />
                            <ErrorMessage name="auctionTime" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                        </div>
                        {/* Pre Bid (Dynamic Label) */}
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {values.auctionType === 'Forward Auction' ? 'Benchmark (INR)' : 'Pre Bid (INR)'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <Field
                              type="number"
                              name="preBid"
                              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder={values.auctionType === 'Forward Auction' ? 'Enter benchmark amount in INR' : 'Enter pre-bid amount in INR'}
                              disabled={isSubmitting}
                              step="0.01"
                            />
                          </div>
                          <ErrorMessage name="preBid" component="div" className="text-red-500 text-sm mt-1" />
                        </div> */}
                      </>
                    )}
                    {/* Priority and Due Date */}
                    {values.taskType === 'General' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority <span className="text-red-600">*</span>
                          </label>
                          <Field
                            as="select"
                            name="priority"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={isSubmitting}
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </Field>
                          <ErrorMessage name="priority" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div onClick={handleDateClick}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date <span className="text-red-600">*</span>
                          </label>
                          <Field
                            type="date"
                            name="dueDate"
                            innerRef={dateInputRef}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={isSubmitting}
                          />
                          <ErrorMessage name="dueDate" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>
                    )}
                    {/* Reminder-Specific Fields */}
                    {values.taskType === 'Reminder' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Time <span className="text-red-600">*</span>
                          </label>
                          <Field
                            type="time"
                            name="dueTime"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={isSubmitting}
                          />
                          <ErrorMessage name="dueTime" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
                          <div className="flex flex-wrap gap-4">
                            <label className="inline-flex items-center">
                              <Field
                                type="checkbox"
                                name="notificationEmail"
                                className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                disabled={isSubmitting}
                              />
                              <Mail className="ml-2 mr-1 w-4 h-4 text-purple-700" />
                              <span className="text-gray-700">Email</span>
                            </label>
                            <label className="inline-flex items-center">
                              <Field
                                type="checkbox"
                                name="notificationAlarm"
                                className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                disabled={isSubmitting}
                              />
                              <Bell className="ml-2 mr-1 w-4 h-4 text-red-800" />
                              <span className="text-gray-700">Alarm Alert</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                    {/* File Attachments */}
                    {values.taskType === 'General' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
                        <div
                          ref={dropZoneRef}
                          onClick={handleDropZoneClick}
                          onDrop={(e) => handleDrop(e, setFieldValue, values)}
                          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={(e) => handleFileInputChange(e, setFieldValue, values)}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                          <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            {isDragActive
                              ? 'Drop the files here ...'
                              : 'Drag and drop files here, or click to select files'}
                          </p>
                        </div>
                        {values.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {values.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <div className="flex items-center space-x-2">
                                  <Upload className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 truncate">{attachment}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleAttachmentRemove(index, setFieldValue, values)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  disabled={isSubmitting}
                                  aria-label={`Remove ${attachment}`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Remark */}
                    {values.taskType === 'General' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                        <Field
                          as="textarea"
                          name="remark"
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter remark (optional)"
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4">
                      {onCancel && (
                        <button
                          type="button"
                          onClick={onCancel}
                          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-blue-400"
                        disabled={isSubmitting}
                      >
                        <Plus className="w-4 h-4" />
                        <span>{editTask ? 'Update Task' : 'Create Task'}</span>
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            )}
          </Formik>
          {toastMessage && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg z-50 text-sm max-w-sm text-center animate-slide-in">
              {toastMessage}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default CreateTasksEmployee;