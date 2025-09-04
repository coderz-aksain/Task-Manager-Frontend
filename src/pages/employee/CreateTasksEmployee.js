
import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Upload, Calendar, Mail, Clock, User, Clock3, Bell } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';

// Yup validation schema
const validationSchema = Yup.object({
  taskName: Yup.string().required('Task Name is required'),
  dueDate: Yup.string().required('Due Date is required'),
  priority: Yup.string().when('taskType', {
    is: (value) => value === 'General' || value === 'Auction',
    then: (schema) => schema.required('Priority is required'),
    otherwise: (schema) => schema,
  }),
  taskType: Yup.string().required('Task Type is required'),
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
  const token = localStorage.getItem('token') || '';

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

  // Handle drag-and-drop events for General and Auction tasks
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
    taskName: editTask?.taskName || '',
    description: editTask?.description || '',
    dueDate: editTask?.dueDate || '',
    priority: editTask?.priority || 'Medium',
    taskType: editTask?.taskType || 'General',
    remark: editTask?.remark || '',
    attachments: editTask?.fileUrls?.map(url => url.split('/').pop()) || [],
    assignedTo: editTask?.assignedTo || (currentUser ? [{ email: currentUser.email, name: currentUser.name, avatar: currentUser.avatar }] : []),
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

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
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

              const [year, month, day] = values.dueDate.split('-') || ['', '', ''];
              const formattedDueDate = `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`; // DD-MM-YYYY

              try {
                setLoading(true);
                let response;
                if (values.taskType === 'Reminder') {
                  const notificationPreferences = [];
                  if (values.notificationEmail) notificationPreferences.push('Email');
                  if (values.notificationAlarm) notificationPreferences.push('Alarm');

                  const reminderData = {
                    taskName: values.taskName,
                    description: values.description,
                    reminderDate: formattedDueDate,
                    reminderTime: values.dueTime,
                    notificationPreferences,
                  };

                  response = await fetch('https://task-manager-backend-vqen.onrender.com/api/employee/createreminder', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(reminderData),
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
                    ? `https://task-manager-backend-vqen.onrender.com/api/tasks/update/${editTask.taskId}`
                    : 'https://task-manager-backend-vqen.onrender.com/api/tasks';
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

                setToastMessage(editTask ? 'Task updated successfully!' : 'Task Created successfully!');
                setTimeout(() => {
                  setToastMessage('');
                  navigate('/employee/tasks');
                }, 3000);
                if (onSubmit) onSubmit(data);
                if (onCancel) onCancel();

                resetForm({
                  values: {
                    taskName: '',
                    description: '',
                    dueDate: '',
                    priority: 'Medium',
                    taskType: 'General',
                    remark: '',
                    attachments: [],
                    assignedTo: currentUser ? [{ email: currentUser.email, name: currentUser.name, avatar: currentUser.avatar }] : [],
                    dueTime: '',
                    notificationEmail: true,
                    notificationInApp: true,
                    notificationAlarm: false,
                  }
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
            {({ values, setFieldValue, isSubmitting }) => (
              <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {editTask ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    {onCancel && (
                      <button onClick={onCancel} className="text-gray-500 hover:text-gray-700" disabled={isSubmitting}>
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
                  <Form className="space-y-6">
                    {/* Task Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Task Type <span className= "text-red-600">*</span></label>
                      <Field
                        as="select"
                        name="taskType"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        disabled={isSubmitting}
                      >
                        <option value="General">General</option>
                        <option value="Auction">Auction</option>
                        <option value="Reminder">Reminder</option>
                      </Field>
                      <ErrorMessage name="taskType" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    {/* Task Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Task Name <span className= "text-red-600">*</span> </label>
                      <Field
                        type="text"
                        name="taskName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter task name"
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="taskName" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <Field
                        as="textarea"
                        name="description"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter task description (optional)"
                        disabled={isSubmitting}
                      />
                    </div>
                    {/* Priority and Due Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {values.taskType !== 'Reminder' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Priority<span className= "text-red-600">*</span> </label>
                          <Field
                            as="select"
                            name="priority"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            disabled={isSubmitting}
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </Field>
                          <ErrorMessage name="priority" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      )}
                      <div onClick={handleDateClick}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date<span className= "text-red-600">*</span></label>
                        <Field
                          type="date"
                          name="dueDate"
                          innerRef={dateInputRef}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          disabled={isSubmitting}
                        />
                        <ErrorMessage name="dueDate" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    {/* Reminder-Specific Fields */}
                    {values.taskType === 'Reminder' && (
                      <>
                        {/* Due Time */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Due Time *</label>
                          <Field
                            type="time"
                            name="dueTime"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md pr-3"
                            disabled={isSubmitting}
                          />
                          <ErrorMessage name="dueTime" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        {/* Notification Preferences */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
                          <div className="flex flex-wrap gap-4">
                            <label className="inline-flex items-center">
                              <Field
                                type="checkbox"
                                name="notificationEmail"
                                className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                disabled={isSubmitting}
                              />
                              <Mail className="ml-2 mr-1 w-4 h-4 text-purple-700" />
                              <span className="text-gray-700">Email</span>
                            </label>
                            <label className="inline-flex items-center">
                              <Field
                                type="checkbox"
                                name="notificationAlarm"
                                className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                disabled={isSubmitting}
                              />
                              <Bell className="ml-2 mr-1 w-4 h-4 text-red-800" />
                              <span className="text-gray-700">Alarm Alert</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                    {/* File Attachments for General and Auction */}
                    {values.taskType !== 'Reminder' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
                        <div
                          ref={dropZoneRef}
                          onClick={handleDropZoneClick}
                          onDrop={(e) => handleDrop(e, setFieldValue, values)}
                          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
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
                                  <span className="text-sm">{attachment}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleAttachmentRemove(index, setFieldValue, values)}
                                  className="text-red-500 hover:text-red-700"
                                  disabled={isSubmitting}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Remark for General and Auction */}
                    {values.taskType !== 'Reminder' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                        <Field
                          as="textarea"
                          name="remark"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
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
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg z-50 text-sm max-w-sm text-center">
    {toastMessage}
  </div>
)}

        </div>
      </div>
    </div>
  );
}

export default CreateTasksEmployee;