import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Upload, Calendar, Bell, Mail, Smartphone, Clock, Paperclip, ChevronDown, ChevronUp, Users, User, Clock3, Repeat, Star, Sparkles, PlusCircle, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/common/AdminSidebar';
import Header from '../../components/common/Header';
import { useNavigate } from 'react-router-dom';

const userOptions = [
  'Alice Smith', 'Bob Johnson', 'Charlie Brown', 'Diana Prince', 'Eve Adams',
  'Frank White', 'Grace Lee', 'Harry Potter', 'Ivy Green', 'Jack Black'
];

function CreateTasks({ onSubmit, editTask, onCancel }) {
  const [formData, setFormData] = useState({
    taskName: editTask?.taskName || '',
    description: editTask?.description || '',
    priority: editTask?.priority || 'Medium',
    dueDate: editTask?.dueDate || '',
    assignedTo: editTask?.assignedTo || [],
    attachments: editTask?.attachments || [],
    taskType: editTask?.taskType || 'General',
    remark: editTask?.remark || '',
    // Reminder-specific fields
    reminderMode: 'self',
    reminderType: 'one-time',
    dueTime: '',
    notificationEmail: true,
    notificationInApp: true,
    notificationAlarm: false,
    notificationStages: [],
  });
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const [recipientSearchTerm, setRecipientSearchTerm] = useState('');
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [showNotificationStages, setShowNotificationStages] = useState(false);
  const [showAttachmentSettings, setShowAttachmentSettings] = useState(false);
  const [notificationDraft, setNotificationDraft] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const recipientInputRef = useRef(null);
  const employeeDropdownRef = useRef(null);
  const token = localStorage.getItem('token') || '';
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://task-manager-backend-vqen.onrender.com/api/admin/allemployees', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        const validEmployees = Array.isArray(data) ? data.map(emp => ({
          id: emp.id || emp._id || '',
          name: emp.firstName || 'Unknown',
          email: emp.email || '',
          department: emp.department || 'Unknown',
          avatar: emp.profileImage || '',
        })) : [];
        setEmployees(validEmployees);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEmployees();
  }, [token]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('https://task-manager-backend-vqen.onrender.com/api/admin/currentuser', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch current user');
        const data = await response.json();
        setCurrentUser({
          id: data.id || data._id,
          name: data.firstName || 'Unknown',
          email: data.email,
          department: data.department || 'Unknown',
          avatar: data.profileImage || '',
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
    if (formData.taskType === 'Remainder' && formData.reminderMode === 'self' && currentUser) {
      setFormData(prev => ({
        ...prev,
        assignedTo: [{
          email: currentUser.email,
          name: currentUser.name,
          avatar: currentUser.avatar
        }]
      }));
    }
  }, [formData.reminderMode, formData.taskType, currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
        setShowEmployeeDropdown(false);
      }
    };

    if (showEmployeeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmployeeDropdown]);

  const filteredEmployees = employees.filter(emp =>
    (emp.name && typeof emp.name === 'string' && emp.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.department && typeof emp.department === 'string' && emp.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getFilteredUserOptions = (currentSelected) => {
    return userOptions.filter(user =>
      user.toLowerCase().includes(recipientSearchTerm.toLowerCase()) &&
      !currentSelected.includes(user)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmployeeSelect = (employee) => {
    if (!formData.assignedTo.find(emp => emp.email === employee.email)) {
      setFormData(prev => ({
        ...prev,
        assignedTo: [...prev.assignedTo, { email: employee.email, name: employee.name }]
      }));
    }
    setSearchTerm('');
    setShowEmployeeDropdown(false);
  };

  const handleEmployeeRemove = (email) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.filter(emp => emp.email !== email)
    }));
  };

  const handleAttachmentAdd = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
      e.target.value = '';
    }
  };

  const handleAttachmentRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDropActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
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

  const handleAddRecipient = (user) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: [...prev.assignedTo, { email: user, name: user }]
    }));
    setRecipientSearchTerm('');
    setShowRecipientDropdown(false);
    recipientInputRef.current.focus();
  };

  const handleRemoveRecipient = (userToRemove) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.filter(emp => emp.email !== userToRemove)
    }));
  };

  const addNotificationStage = () => {
    setFormData(prev => ({
      ...prev,
      notificationStages: [
        ...prev.notificationStages,
        {
          id: Date.now().toString(),
          triggerType: 'days_before',
          triggerValue: 7,
          recipients: [],
          notifyEmail: true,
          notifyInApp: true,
          notifyAlarm: false,
        }
      ]
    }));
    setShowNotificationStages(true);
  };

  const updateNotificationStage = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      notificationStages: prev.notificationStages.map(stage =>
        stage.id === id ? { ...stage, [field]: value } : stage
      )
    }));
  };

  const removeNotificationStage = (id) => {
    setFormData(prev => ({
      ...prev,
      notificationStages: prev.notificationStages.filter(stage => stage.id !== id)
    }));
  };

  const handleAddStageRecipient = (stageId, user) => {
    setFormData(prev => ({
      ...prev,
      notificationStages: prev.notificationStages.map(stage =>
        stage.id === stageId
          ? { ...stage, recipients: [...stage.recipients, user] }
          : stage
      )
    }));
    setRecipientSearchTerm('');
    setShowRecipientDropdown(false);
  };

  const handleRemoveStageRecipient = (stageId, userToRemove) => {
    setFormData(prev => ({
      ...prev,
      notificationStages: prev.notificationStages.map(stage =>
        stage.id === stageId
          ? { ...stage, recipients: stage.recipients.filter(user => user !== userToRemove) }
          : stage
      )
    }));
  };

  const generateNotificationDraft = async () => {
    setIsGeneratingDraft(true);
    setNotificationDraft('Generating draft...');
    let prompt = `Draft a concise and professional reminder notification message.
      Title: "${formData.taskName || 'No Title'}"
      Description: "${formData.description || 'No Description'}"
      Due Date: "${formData.dueDate || 'Not set'}"
      Due Time: "${formData.dueTime || 'Not set'}"
    `;
    if (formData.taskType === 'Remainder' && formData.reminderType === 'one-time') {
      const recipientsText = formData.reminderMode === 'team' && formData.assignedTo.length > 0
        ? `Assigned To: ${formData.assignedTo.map(emp => emp.name).join(', ')}`
        : `Assigned To: You`;
      prompt += `${recipientsText}\n`;
    } else if (formData.taskType === 'Remainder') {
      prompt += `This is an interval-based reminder with the following notification stages:\n`;
      formData.notificationStages.forEach((stage, index) => {
        prompt += `Stage ${index + 1}: Notify ${formatIntervalText(stage)}`;
        if (stage.recipients.length > 0) {
          prompt += ` to ${stage.recipients.join(', ')}`;
        } else {
          prompt += ` to no one specified`;
        }
        prompt += ` (Email: ${stage.notifyEmail ? 'Yes' : 'No'}, In-app: ${stage.notifyInApp ? 'Yes' : 'No'}, Alarm: ${stage.notifyAlarm ? 'Yes' : 'No'})\n`;
      });
    } else {
      prompt += `Assigned To: ${formData.assignedTo.length > 0 ? formData.assignedTo.map(emp => emp.name).join(', ') : 'No one assigned'}\n`;
    }
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
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.status === 429) {
          retries++;
          const delay = baseDelay * Math.pow(2, retries - 1);
          console.warn(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          setNotificationDraft(result.candidates[0].content.parts[0].text);
        } else {
          setNotificationDraft('Could not generate draft. Please try again.');
        }
        break;
      } catch (error) {
        console.error('Error generating notification draft:', error);
        setNotificationDraft('Error generating draft. Please check console.');
        break;
      } finally {
        setIsGeneratingDraft(false);
      }
    }
    if (retries === maxRetries) {
      setNotificationDraft('Failed to generate draft after multiple retries.');
      setIsGeneratingDraft(false);
    }
  };

  const formatIntervalText = (stage) => {
    if (stage.triggerType === 'on_due_date') {
      return 'On Due Date';
    }
    return `${stage.triggerValue} ${stage.triggerType.replace('_', ' ')} due date`;
  };

  const getPriorityColor = (prio) => {
    switch (prio.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.taskName || !formData.description || !formData.dueDate || formData.assignedTo.length === 0 || !formData.priority || !formData.taskType || !formData.remark) {
      setError('All fields (taskName, description, dueDate, assignedTo, priority, taskType, remark) are required');
      return;
    }
    if (formData.taskType === 'Remainder' && !formData.dueTime) {
      setError('Due time is required for Remainder tasks');
      return;
    }
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('taskName', formData.taskName);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('dueDate', formatDate(formData.dueDate));
    formDataToSend.append('assignedTo', JSON.stringify(formData.assignedTo.map(emp => emp.email)));
    formDataToSend.append('priority', formData.priority);
    formDataToSend.append('taskType', formData.taskType);
    formDataToSend.append('remark', formData.remark);
    if (formData.taskType === 'Remainder') {
      formDataToSend.append('reminderMode', formData.reminderMode);
      formDataToSend.append('reminderType', formData.reminderType);
      formDataToSend.append('dueTime', formData.dueTime);
      formDataToSend.append('notificationEmail', formData.notificationEmail);
      formDataToSend.append('notificationInApp', formData.notificationInApp);
      formDataToSend.append('notificationAlarm', formData.notificationAlarm);
      formDataToSend.append('notificationStages', JSON.stringify(formData.notificationStages));
      formDataToSend.append('notificationDraft', notificationDraft);
    }
    formData.attachments.forEach((file, index) => {
      if (file instanceof File) {
        formDataToSend.append('file', file);
      }
    });
    try {
      const response = await fetch('https://task-manager-backend-vqen.onrender.com/api/admin/createtask', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        throw new Error(errorData.message || 'Failed to create task');
      }
      const data = await response.json();
      if (typeof onSubmit === 'function') {
        onSubmit(data);
      }
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/admin/tasks');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  };

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative font-sans text-gray-800">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="sticky top-0 h-screen z-40">
        <AdminSidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={!!token} onToggleSidebar={toggleSidebar} />
        <div className="flex-1 p-6 overflow-auto">
          <div className={`max-w-8xl mx-auto bg-white rounded-xl shadow-lg p-6 ${formData.taskType !== 'Auction' ? 'flex flex-col lg:flex-row' : ''}`}>
            {/* Form Fields */}
            <div className={`${formData.taskType !== 'Auction' ? 'lg:w-1/2 p-4 border-r border-gray-200' : 'w-full p-4'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                {onCancel && (
                  <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Task Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Type *</label>
                  <select
                    name="taskType"
                    value={formData.taskType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="General">General</option>
                    <option value="Auction">Auction</option>
                    <option value="Remainder">Remainder</option>
                  </select>
                </div>
                {/* Task Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Name *</label>
                  <input
                    type="text"
                    name="taskName"
                    value={formData.taskName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter task name"
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter task description"
                  />
                  {/* {formData.taskType !== 'Auction' && (
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 flex items-center"
                      onClick={generateNotificationDraft}
                      disabled={isGeneratingDraft}
                    >
                      {isGeneratingDraft ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2" /> Generate Notification Draft
                        </>
                      )}
                    </button>
                  )} */}
                </div>
                {/* Priority and Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                {/* Reminder-Specific Fields */}
                {formData.taskType === 'Remainder' && (
                  <>
                    {/* Due Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Time *</label>
                      <div className="relative">
                        <input
                          type="time"
                          name="dueTime"
                          value={formData.dueTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md pr-3"
                        />
                        {/* <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /> */}
                      </div>
                    </div>
                    {/* Reminder Mode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reminder For</label>
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                          type="button"
                          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${formData.reminderMode === 'self' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                          onClick={() => setFormData(prev => ({ ...prev, reminderMode: 'self' }))}
                        >
                          <User className="inline-block mr-2" /> Self
                        </button>
                        <button
                          type="button"
                          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${formData.reminderMode === 'team' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                          onClick={() => setFormData(prev => ({ ...prev, reminderMode: 'team' }))}
                        >
                          <Users className="inline-block mr-2" /> Team
                        </button>
                      </div>
                    </div>
                    {/* Reminder Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Type</label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="reminderType"
                            value="one-time"
                            checked={formData.reminderType === 'one-time'}
                            onChange={() => setFormData(prev => ({ ...prev, reminderType: 'one-time', notificationStages: [] }))}
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">One-time</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="reminderType"
                            value="interval"
                            checked={formData.reminderType === 'interval'}
                            onChange={() => setFormData(prev => ({ ...prev, reminderType: 'interval' }))}
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">Interval-based</span>
                        </label>
                      </div>
                    </div>
                    {/* Notification Preferences for One-time */}
                    {formData.reminderType === 'one-time' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
                        <div className="flex flex-wrap gap-4">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.notificationEmail}
                              onChange={(e) => setFormData(prev => ({ ...prev, notificationEmail: e.target.checked }))}
                              className="form-checkbox h-4 w-4 text-blue-600 rounded"
                            />
                            <Mail className="ml-2 mr-1 w-4 h-4 text-purple-700" />
                            <span className="text-gray-700">Email</span>
                          </label>
                          {/* <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.notificationInApp}
                              onChange={(e) => setFormData(prev => ({ ...prev, notificationInApp: e.target.checked }))}
                              className="form-checkbox h-4 w-4 text-blue-600 rounded"
                            />
                            <Smartphone className="ml-2 mr-1" />
                            <span className="text-gray-700">In-app</span>
                          </label> */}
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.notificationAlarm}
                              onChange={(e) => setFormData(prev => ({ ...prev, notificationAlarm: e.target.checked }))}
                              className="form-checkbox h-4 w-4 text-blue-600 rounded"
                            />
                            <Bell className="ml-2 mr-1 w-4 h-4 text-red-800" />
                            <span className="text-gray-700">Alarm Alert</span>
                          </label>
                        </div>
                      </div>
                    )}
                    {/* Notification Stages for Interval-based */}
                    {formData.reminderType === 'interval' && (
                      <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                        <button
                          type="button"
                          className="flex justify-between items-center w-full text-left text-lg font-semibold text-gray-800"
                          onClick={() => setShowNotificationStages(!showNotificationStages)}
                        >
                          <span className="flex items-center"><Repeat className="mr-2" /> Notification Stages</span>
                          {showNotificationStages ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        {showNotificationStages && (
                          <div className="mt-4 space-y-6">
                            {formData.notificationStages.map((stage, index) => (
                              <div key={stage.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm relative">
                                <h4 className="text-md font-semibold text-gray-800 mb-3">Stage {index + 1}</h4>
                                <button
                                  type="button"
                                  onClick={() => removeNotificationStage(stage.id)}
                                  className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
                                  title="Remove stage"
                                >
                                  <Trash2 size={18} />
                                </button>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                  <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
                                    <select
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                      value={stage.triggerType}
                                      onChange={(e) => updateNotificationStage(stage.id, 'triggerType', e.target.value)}
                                    >
                                      <option value="days_before">Days before due date</option>
                                      <option value="weeks_before">Weeks before due date</option>
                                      <option value="months_before">Months before due date</option>
                                      <option value="on_due_date">On due date</option>
                                    </select>
                                  </div>
                                  {stage.triggerType !== 'on_due_date' && (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                      <input
                                        type="number"
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={stage.triggerValue}
                                        onChange={(e) => updateNotificationStage(stage.id, 'triggerValue', Math.max(1, parseInt(e.target.value) || 1))}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipients for this stage</label>
                                  <div className="relative">
                                    <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[40px]">
                                      {stage.recipients.map(recipient => (
                                        <span key={recipient} className="inline-flex items-center bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                          {recipient}
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveStageRecipient(stage.id, recipient)}
                                            className="ml-1 text-purple-600 hover:text-purple-800"
                                          >
                                            &times;
                                          </button>
                                        </span>
                                      ))}
                                      <input
                                        type="text"
                                        className="flex-grow min-w-[80px] bg-transparent outline-none py-0.5 text-sm"
                                        placeholder={stage.recipients.length === 0 ? "Add recipients..." : ""}
                                        value={recipientSearchTerm}
                                        onChange={(e) => {
                                          setRecipientSearchTerm(e.target.value);
                                          setShowRecipientDropdown(true);
                                        }}
                                        onFocus={() => setShowRecipientDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowRecipientDropdown(false), 100)}
                                      />
                                    </div>
                                    {showRecipientDropdown && getFilteredUserOptions(stage.recipients).length > 0 && (
                                      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                                        {getFilteredUserOptions(stage.recipients).map(user => (
                                          <div
                                            key={user}
                                            className="px-3 py-1.5 cursor-pointer hover:bg-gray-100 text-sm"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleAddStageRecipient(stage.id, user)}
                                          >
                                            {user}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Notification Types</label>
                                  <div className="flex flex-wrap gap-3">
                                    <label className="inline-flex items-center text-sm">
                                      <input
                                        type="checkbox"
                                        checked={stage.notifyEmail}
                                        onChange={(e) => updateNotificationStage(stage.id, 'notifyEmail', e.target.checked)}
                                        className="form-checkbox h-3.5 w-3.5 text-blue-600 rounded"
                                      />
                                      <Mail className="ml-1.5 mr-0.5" size={16} />
                                      <span className="text-gray-700">Email</span>
                                    </label>
                                    {/* <label className="inline-flex items-center text-sm">
                                      <input
                                        type="checkbox"
                                        checked={stage.notifyInApp}
                                        onChange={(e) => updateNotificationStage(stage.id, 'notifyInApp', e.target.checked)}
                                        className="form-checkbox h-3.5 w-3.5 text-blue-600 rounded"
                                      />
                                      <Smartphone className="ml-1.5 mr-0.5" size={16} />
                                      <span className="text-gray-700">In-app</span>
                                    </label> */}
                                    <label className="inline-flex items-center text-sm">
                                      <input
                                        type="checkbox"
                                        checked={stage.notifyAlarm}
                                        onChange={(e) => updateNotificationStage(stage.id, 'notifyAlarm', e.target.checked)}
                                        className="form-checkbox h-3.5 w-3.5 text-blue-600 rounded"
                                      />
                                      <Bell className="ml-1.5 mr-0.5" size={16} />
                                      <span className="text-gray-700">Alarm</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addNotificationStage}
                              className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium"
                            >
                              <PlusCircle className="mr-2" size={18} /> Add Notification Stage
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
                {/* Employees */}
                {(formData.taskType !== 'Remainder' || formData.reminderMode === 'team') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign Employees</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowEmployeeDropdown(true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Search employee by name or department"
                    />
                    {showEmployeeDropdown && (
                      <div ref={employeeDropdownRef} className="relative z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredEmployees.map((employee) => (
                          <button
                            key={employee.id}
                            type="button"
                            onClick={() => handleEmployeeSelect(employee)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                          >
                            <img src={employee.avatar || ''} alt={employee.name} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="font-medium">{employee.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{employee.department || 'Unknown'}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.assignedTo.map((emp) => (
                        <div key={emp.email} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          <img src={emp.avatar || ''} alt={emp.name} className="w-5 h-5 rounded-full mr-2" />
                          <span className="text-sm">{emp.name || 'Unknown'}</span>
                          <button
                            type="button"
                            onClick={() => handleEmployeeRemove(emp.email)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
                  <div
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md transition-colors ${
                      dropActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                    } min-h-[100px] cursor-pointer relative`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('attachment-input').click()}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('attachment-input').click(); }}
                  >
                    <input
                      id="attachment-input"
                      type="file"
                      multiple
                      onChange={handleAttachmentAdd}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-blue-400 mb-2" />
                    <span className="text-sm text-gray-600 mb-1">
                      Drag & drop files here, or <span className="text-blue-600 underline">click to select</span>
                    </span>
                    <span className="text-xs text-gray-400">(You can select multiple files)</span>
                  </div>
                  {formData.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {formData.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center space-x-2">
                            <Upload className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{attachment instanceof File ? attachment.name : attachment}</span>
                          </div>
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
                {/* Remark */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remark *</label>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter remark"
                  />
                </div>
                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4">
                  {onCancel && (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>{editTask ? 'Update Task' : 'Create Task'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            {/* Right Column: Preview (for General and Remainder) */}
            {formData.taskType !== 'Auction' && (
              <div className="lg:w-1/2 p-6 bg-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Task Preview</h2>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {formData.taskName || 'Untitled Task'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(formData.priority)}`}>
                      <Star className="inline-block w-3 h-3 mr-1 -mt-0.5" /> {formData.priority} Priority
                    </span>
                  </div>
                  {formData.description && (
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {formData.description}
                    </p>
                  )}
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>
                        Due: {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        }) : 'Not set'}
                        {formData.taskType === 'Remainder' && formData.dueTime && ` at ${formData.dueTime}`}
                      </span>
                    </div>
                    {formData.taskType === 'Remainder' && (
                      <>
                        <div className="flex items-center">
                          {formData.reminderType === 'one-time' ? (
                            <Clock3 className="w-4 h-4 mr-2 text-gray-500" />
                          ) : (
                            <Repeat className="w-4 h-4 mr-2 text-gray-500" />
                          )}
                          <span>Type: {formData.reminderType === 'one-time' ? 'One-time' : 'Interval-based'}</span>
                        </div>
                        <div className="flex items-center">
                          {formData.reminderMode === 'self' ? (
                            <>
                              <User className="w-4 h-4 mr-2 text-gray-500" />
                              <span>Assigned To: You</span>
                            </>
                          ) : (
                            <>
                              <Users className="w-4 h-4 mr-2 text-gray-500" />
                              <span>Assigned To: {formData.assignedTo.length > 0 ? formData.assignedTo.map(emp => emp.name).join(', ') : 'No one assigned'}</span>
                            </>
                          )}
                        </div>
                        {formData.reminderType === 'one-time' && (
                          <div className="flex items-center">
                            <Bell className="w-4 h-4 mr-2 text-gray-500" />
                            <span>Notifications:
                              {formData.notificationEmail && <span className="ml-1 inline-flex items-center"><Mail className="w-4 h-4 mr-0.5" /> Email</span>}
                              {/* {formData.notificationInApp && <span className="ml-1 inline-flex items-center"><Smartphone className="w-4 h-4 mr-0.5" /> In-app</span>} */}
                              {formData.notificationAlarm && <span className="ml-1 inline-flex items-center"><Bell className="w-4 h-4 mr-0.5" /> Alarm</span>}
                              {!formData.notificationEmail && !formData.notificationInApp && !formData.notificationAlarm && ' None'}
                            </span>
                          </div>
                        )}
                        {formData.reminderType === 'interval' && formData.notificationStages.length > 0 && (
                          <div className="space-y-2 mt-4">
                            <p className="font-semibold text-gray-800">Notification Stages:</p>
                            {formData.notificationStages.map((stage, index) => (
                              <div key={stage.id} className="ml-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <p className="font-medium text-gray-700 mb-1">Stage {index + 1}: {formatIntervalText(stage)}</p>
                                <p className="text-xs text-gray-600">Recipients: {stage.recipients.length > 0 ? stage.recipients.join(', ') : 'None'}</p>
                                <p className="text-xs text-gray-600">Notify:
                                  {stage.notifyEmail && <span className="ml-1 inline-flex items-center"><Mail className="w-3 h-3 mr-0.5" /> Email</span>}
                                  {/* {stage.notifyInApp && <span className="ml-1 inline-flex items-center"><Smartphone className="w-3 h-3 mr-0.5" /> In-app</span>} */}
                                  {stage.notifyAlarm && <span className="ml-1 inline-flex items-center"><Bell className="w-3 h-3 mr-0.5" /> Alarm</span>}
                                  {!stage.notifyEmail && !stage.notifyInApp && !stage.notifyAlarm && ' None'}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    {formData.taskType === 'General' && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Assigned To: {formData.assignedTo.length > 0 ? formData.assignedTo.map(emp => emp.name).join(', ') : 'No one assigned'}</span>
                      </div>
                    )}
                    {formData.attachments.length > 0 && (
                      <div className="flex items-start">
                        <Paperclip className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                        <div>
                          <p>Attachments:</p>
                          <ul className="list-disc list-inside ml-2">
                            {formData.attachments.map((file, index) => (
                              <li key={index}>{file instanceof File ? file.name : file}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* {notificationDraft && (
                  <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Sparkles className="mr-2 text-blue-600" /> Generated Notification Draft
                    </h3>
                    <textarea
                      readOnly
                      rows="6"
                      className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-800 resize-none"
                      value={notificationDraft}
                    ></textarea>
                  </div>
                )} */}
                {formData.taskType === 'Remainder' && (
                  <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Timeline Visualization</h3>
                    <div className="relative border-l-2 border-blue-300 pl-4 py-2">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                      <p className="text-sm text-gray-600">Reminder created: {new Date().toLocaleDateString()}</p>
                      <p className="font-medium text-gray-800">"{formData.taskName || 'Untitled Reminder'}"</p>
                      {formData.dueDate && (
                        <>
                          <div className="absolute -left-2 mt-4 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                          <p className="text-sm text-gray-600 mt-4">Due Date: {new Date(formData.dueDate).toLocaleDateString()}</p>
                        </>
                      )}
                      {formData.reminderType === 'interval' && formData.notificationStages.length > 0 && (
                        <>
                          {formData.notificationStages.sort((a, b) => {
                            if (a.triggerType === 'on_due_date') return 1;
                            if (b.triggerType === 'on_due_date') return -1;
                            return b.triggerValue - a.triggerValue;
                          }).map((stage, index) => (
                            <React.Fragment key={stage.id}>
                              <div className="absolute -left-2 mt-4 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                              <p className="text-sm text-gray-600 mt-4">Notification: {formatIntervalText(stage)}</p>
                              <p className="text-xs text-gray-600 ml-6">To: {stage.recipients.length > 0 ? stage.recipients.join(', ') : 'No one'}</p>
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg animate-fade-in-out z-50">
          Task created successfully!
        </div>
      )}
      {modalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{modalTitle}</h3>
            <p className="text-gray-700 mb-6">{modalMessage}</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
                onClick={hideModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateTasks;