import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';

function CreateTasksEmployee({ onSubmit, editTask, onCancel }) {
  const [formData, setFormData] = useState({
    taskName: editTask?.taskName || '',
    description: editTask?.description || '',
    dueDate: editTask?.dueDate || '',
    priority: editTask?.priority || 'Medium',
    taskType: editTask?.taskType || 'General',
    remark: editTask?.remark || '',
    attachments: editTask?.fileUrls?.map(url => url.split('/').pop()) || [],
    assignedTo: '', // Hidden in UI but kept in state for reference
  });

  const [showSidebar, setShowSidebar] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const dateInputRef = useRef(null);

  // Set assignedTo from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token) {
      console.log('Token:', token);
    }
    if (user && (user.name || user.email)) {
      const assignedTo = user.name || user.email;
      console.log('Logged-in user (assignedTo):', assignedTo);
      setFormData(prev => ({
        ...prev,
        assignedTo,
      }));
    }
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

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) {
        handleAttachmentAdd(files);
      }
    };

    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragenter', handleDragEnter);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttachmentAdd = (files) => {
    if (!files || !Array.isArray(files)) {
      console.warn('No valid files provided to handleAttachmentAdd');
      return;
    }
    const fileNames = files.map(file => file.name);
    console.log('Files captured in handleAttachmentAdd:', files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...fileNames]
    }));
    // Update fileInputRef for submission
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleAttachmentRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
    // Update fileInputRef to reflect removed files
    if (fileInputRef.current) {
      const remainingFiles = formData.attachments.filter((_, i) => i !== index);
      const dataTransfer = new DataTransfer();
      Array.from(fileInputRef.current.files || [])
        .filter(file => remainingFiles.includes(file.name))
        .forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      handleAttachmentAdd(files);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToastMessage('');
    const token = localStorage.getItem('token');
    if (!token) {
      setToastMessage('Authentication token not found');
      setLoading(false);
      return;
    }

    const [year, month, day] = formData.dueDate.split('-') || ['', '', ''];
    const formattedDueDate = `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`; // DD-MM-YYYY

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('taskName', formData.taskName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('dueDate', formattedDueDate);
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('taskType', formData.taskType);
      formDataToSend.append('remark', formData.remark);

      if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
        console.log('Files selected:', Array.from(fileInputRef.current.files));
        Array.from(fileInputRef.current.files).forEach(file => {
          formDataToSend.append('files', file);
        });
      } else {
        console.log('No files selected or file input not found');
      }

      console.log('FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      const url = editTask
        ? `https://task-manager-backend-vqen.onrender.com/api/tasks/update/${editTask.taskId}`
        : 'https://task-manager-backend-vqen.onrender.com/api/tasks';
      const method = editTask ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

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
        throw new Error(data.message || (editTask ? 'Failed to update task' : 'Failed to create task'));
      }

      setToastMessage(editTask ? 'Task updated successfully!' : 'Task created successfully!');
      setTimeout(() => {
        setToastMessage('');
        navigate('/employee/tasks');
      }, 3000);
      if (onSubmit) onSubmit(data);
      if (onCancel) onCancel();

      setFormData({
        taskName: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        taskType: 'General',
        remark: '',
        attachments: [],
        assignedTo: formData.assignedTo,
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Error processing task:', err.message);
      setToastMessage(`Error: ${err.message}`);
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="sticky top-0 h-screen z-40">
        <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={!!localStorage.getItem('token')} onToggleSidebar={toggleSidebar} />
        <div className="flex-1 p-6 overflow-auto">
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                {editTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              {onCancel && (
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700" disabled={loading}>
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter task description"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Type *</label>
                  <select
                    name="taskType"
                    value={formData.taskType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={loading}
                  >
                    <option value="General">General</option>
                    <option value="Auction">Auction</option>
                    <option value="Remainder">Remainder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={loading}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div onClick={handleDateClick}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    ref={dateInputRef}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remark *</label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  rows={2}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter remark"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
                <div
                  ref={dropZoneRef}
                  onClick={handleDropZoneClick}
                  className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {isDragActive
                      ? 'Drop the files here ...'
                      : 'Drag and drop files here, or click to select files'}
                  </p>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center space-x-2">
                          <Upload className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{attachment}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAttachmentRemove(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={loading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4" />
                  <span>{editTask ? 'Update Task' : 'Create Task'}</span>
                </button>
              </div>
            </form>

            {toastMessage && (
              <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg z-50 text-sm max-w-sm">
                {toastMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTasksEmployee;