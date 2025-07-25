import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Calendar } from 'lucide-react';
import AdminSidebar from '../../components/common/AdminSidebar';
import Header from '../../components/common/Header';
import { useNavigate } from 'react-router-dom';

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
  });

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [newAttachment, setNewAttachment] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state
  const [showToast, setShowToast] = useState(false); // Custom toast state
  const [dropActive, setDropActive] = useState(false); // Dropzone highlight state
  const token = localStorage.getItem('token') || '';
  const navigate = useNavigate();

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
        console.log('Fetched employees:', data);
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

  const filteredEmployees = employees.filter(emp =>
    (emp.name && typeof emp.name === 'string' && emp.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.department && typeof emp.department === 'string' && emp.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  // Dropzone handlers
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

  const handleAttachmentInput = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.taskName || !formData.description || !formData.dueDate || formData.assignedTo.length === 0 || !formData.priority || !formData.taskType || !formData.remark) {
      setError('All fields (taskName, description, dueDate, assignedTo, priority, taskType, remark) are required');
      return;
    }

    setLoading(true); // Start loader
    const formDataToSend = new FormData();
    formDataToSend.append('taskName', formData.taskName);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('dueDate', formatDate(formData.dueDate));
    formDataToSend.append('assignedTo', JSON.stringify(formData.assignedTo.map(emp => emp.email)));
    formDataToSend.append('priority', formData.priority);
    formDataToSend.append('taskType', formData.taskType);
    formDataToSend.append('remark', formData.remark);
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
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || 'Failed to create task');
      }
      const data = await response.json();
      console.log('Task created successfully, data:', data);
      if (typeof onSubmit === 'function') {
        onSubmit(data);
      } else {
        console.warn('onSubmit is not a function, skipping callback');
      }
      setShowToast(true); // Show custom toast
      setTimeout(() => {
        setShowToast(false); // Auto-close toast after 3 seconds
        navigate('/admin/tasks'); // Navigate after toast
      }, 3000);
    } catch (err) {
      setError(err.message);
      console.error('Submission error:', err);
    } finally {
      setLoading(false); // Stop loader
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
    <div className="flex min-h-screen bg-gray-100 relative">
      <div className="sticky top-0 h-screen z-40">
        <AdminSidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={!!token} onToggleSidebar={toggleSidebar} />
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
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
              </div>

              {/* Priority, Due Date, Task Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* Employees */}
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
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
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

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
                <div
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md transition-colors duration-200
                    ${dropActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
                    min-h-[100px] cursor-pointer relative`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById('attachment-input').click()}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('attachment-input').click(); }}
                  style={{ outline: 'none' }}
                >
                  <input
                    id="attachment-input"
                    type="file"
                    multiple
                    onChange={handleAttachmentInput}
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

              {/* Submit */}
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
        </div>
      </div>
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg animate-fade-in-out z-50">
          Task created successfully!
        </div>
      )}
    </div>
  );
}

export default CreateTasks;