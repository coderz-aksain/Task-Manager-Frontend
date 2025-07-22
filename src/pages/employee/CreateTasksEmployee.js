import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';

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

  const [newAttachment, setNewAttachment] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Set assignedTo from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttachmentAdd = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      console.log('Files captured in handleAttachmentAdd:', files);
      const fileNames = files.map(file => file.name);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileNames]
      }));
    } else if (newAttachment.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment.trim()]
      }));
      setNewAttachment('');
    }
  };

  const handleAttachmentRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
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

    const [year, month, day] = formData.dueDate.split('-');
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

      const response = await fetch('https://task-manager-backend-vqen.onrender.com/api/tasks', {
        method: 'POST',
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
        throw new Error(data.message || 'Failed to create task');
      }

      setToastMessage('Task created successfully!');
      setTimeout(() => setToastMessage(''), 3000);
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
      setNewAttachment('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Error creating task:', err.message);
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
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
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
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 mb-4">
                  <label className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-200 text-sm inline-flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Choose Files</span>
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleAttachmentAdd}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={newAttachment}
                    onChange={(e) => setNewAttachment(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter file name or URL"
                  />
                  <button
                    type="button"
                    onClick={() => handleAttachmentAdd({ target: { files: null } })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
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
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editTask ? 'Update Task' : 'Create Task'}</span>
                </button>
              </div>
            </form>

            {toastMessage && (
              <div className="fixed bottom-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-md shadow-md">
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