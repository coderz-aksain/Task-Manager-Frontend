// import React, { useState, useEffect, useRef } from 'react';
// import { Plus, X, Upload } from 'lucide-react';
// import Header from '../../components/common/Header';
// import Sidebar from '../../components/common/Sidebar';
// import { useNavigate } from 'react-router-dom';

// function CreateTasksEmployee({ onSubmit, editTask, onCancel }) {
//   const [formData, setFormData] = useState({
//     taskName: editTask?.taskName || '',
//     description: editTask?.description || '',
//     dueDate: editTask?.dueDate || '',
//     priority: editTask?.priority || 'Medium',
//     taskType: editTask?.taskType || 'General',
//     remark: editTask?.remark || '',
//     attachments: editTask?.fileUrls?.map(url => url.split('/').pop()) || [],
//     assignedTo: '', // Hidden in UI but kept in state for reference
//   });

//   const [showSidebar, setShowSidebar] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isDragActive, setIsDragActive] = useState(false);
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
//   const dropZoneRef = useRef(null);
//   const dateInputRef = useRef(null);

//   // Set assignedTo from localStorage on mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     if (token) {
//       console.log('Token:', token);
//     }
//     if (user && (user.name || user.email)) {
//       const assignedTo = user.name || user.email;
//       console.log('Logged-in user (assignedTo):', assignedTo);
//       setFormData(prev => ({
//         ...prev,
//         assignedTo,
//       }));
//     }
//   }, []);

//   // Handle drag-and-drop events
//   useEffect(() => {
//     const dropZone = dropZoneRef.current;
//     if (!dropZone) return;

//     const handleDragOver = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       setIsDragActive(true);
//     };

//     const handleDragEnter = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       setIsDragActive(true);
//     };

//     const handleDragLeave = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       setIsDragActive(false);
//     };

//     const handleDrop = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       setIsDragActive(false);
//       const files = Array.from(e.dataTransfer.files);
//       if (files.length) {
//         handleAttachmentAdd(files);
//       }
//     };

//     dropZone.addEventListener('dragover', handleDragOver);
//     dropZone.addEventListener('dragenter', handleDragEnter);
//     dropZone.addEventListener('dragleave', handleDragLeave);
//     dropZone.addEventListener('drop', handleDrop);

//     return () => {
//       dropZone.removeEventListener('dragover', handleDragOver);
//       dropZone.removeEventListener('dragenter', handleDragEnter);
//       dropZone.removeEventListener('dragleave', handleDragLeave);
//       dropZone.removeEventListener('drop', handleDrop);
//     };
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAttachmentAdd = (files) => {
//     if (!files || !Array.isArray(files)) {
//       console.warn('No valid files provided to handleAttachmentAdd');
//       return;
//     }
//     const fileNames = files.map(file => file.name);
//     console.log('Files captured in handleAttachmentAdd:', files);
//     setFormData(prev => ({
//       ...prev,
//       attachments: [...prev.attachments, ...fileNames]
//     }));
//     // Update fileInputRef for submission
//     if (fileInputRef.current) {
//       const dataTransfer = new DataTransfer();
//       files.forEach(file => dataTransfer.items.add(file));
//       fileInputRef.current.files = dataTransfer.files;
//     }
//   };

//   const handleAttachmentRemove = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       attachments: prev.attachments.filter((_, i) => i !== index)
//     }));
//     // Update fileInputRef to reflect removed files
//     if (fileInputRef.current) {
//       const remainingFiles = formData.attachments.filter((_, i) => i !== index);
//       const dataTransfer = new DataTransfer();
//       Array.from(fileInputRef.current.files || [])
//         .filter(file => remainingFiles.includes(file.name))
//         .forEach(file => dataTransfer.items.add(file));
//       fileInputRef.current.files = dataTransfer.files;
//     }
//   };

//   const handleFileInputChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length) {
//       handleAttachmentAdd(files);
//     }
//   };

//   const handleDropZoneClick = () => {
//     if (fileInputRef.current && !loading) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleDateClick = () => {
//     if (dateInputRef.current && !loading) {
//       dateInputRef.current.focus();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setToastMessage('');
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setToastMessage('Authentication token not found');
//       setLoading(false);
//       return;
//     }

//     const [year, month, day] = formData.dueDate.split('-') || ['', '', ''];
//     const formattedDueDate = `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`; // DD-MM-YYYY

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('taskName', formData.taskName);
//       formDataToSend.append('description', formData.description);
//       formDataToSend.append('dueDate', formattedDueDate);
//       formDataToSend.append('priority', formData.priority);
//       formDataToSend.append('taskType', formData.taskType);
//       formDataToSend.append('remark', formData.remark);

//       if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
//         console.log('Files selected:', Array.from(fileInputRef.current.files));
//         Array.from(fileInputRef.current.files).forEach(file => {
//           formDataToSend.append('files', file);
//         });
//       } else {
//         console.log('No files selected or file input not found');
//       }

//       console.log('FormData entries:');
//       for (let [key, value] of formDataToSend.entries()) {
//         console.log(`${key}: ${value instanceof File ? value.name : value}`);
//       }

//       const url = editTask
//         ? `https://task-manager-backend-vqen.onrender.com/api/tasks/update/${editTask.taskId}`
//         : 'https://task-manager-backend-vqen.onrender.com/api/tasks';
//       const method = editTask ? 'PATCH' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       const text = await response.text();
//       console.log('Raw response status:', response.status);
//       console.log('Raw response:', text);
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch (parseError) {
//         if (response.status === 500) {
//           throw new Error('Server error: Received HTML instead of JSON');
//         }
//         throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
//       }

//       if (!response.ok) {
//         throw new Error(data.message || (editTask ? 'Failed to update task' : 'Failed to create task'));
//       }

//       setToastMessage(editTask ? 'Task updated successfully!' : 'Task created successfully!');
//       setTimeout(() => {
//         setToastMessage('');
//         navigate('/employee/tasks');
//       }, 3000);
//       if (onSubmit) onSubmit(data);
//       if (onCancel) onCancel();

//       setFormData({
//         taskName: '',
//         description: '',
//         dueDate: '',
//         priority: 'Medium',
//         taskType: 'General',
//         remark: '',
//         attachments: [],
//         assignedTo: formData.assignedTo,
//       });
//       if (fileInputRef.current) fileInputRef.current.value = '';
//     } catch (err) {
//       console.error('Error processing task:', err.message);
//       setToastMessage(`Error: ${err.message}`);
//       setTimeout(() => setToastMessage(''), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleSidebar = () => {
//     setShowSidebar(prev => !prev);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <div className="sticky top-0 h-screen z-40">
//         <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
//       </div>
//       <div className="flex-1 flex flex-col">
//         <Header isLoggedIn={!!localStorage.getItem('token')} onToggleSidebar={toggleSidebar} />
//         <div className="flex-1 p-6 overflow-auto">
//           {loading && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//           )}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold text-gray-700">
//                 {editTask ? 'Edit Task' : 'Create New Task'}
//               </h2>
//               {onCancel && (
//                 <button onClick={onCancel} className="text-gray-500 hover:text-gray-700" disabled={loading}>
//                   <X className="w-5 h-5" />
//                 </button>
//               )}
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Task Name *</label>
//                 <input
//                   type="text"
//                   name="taskName"
//                   value={formData.taskName}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   placeholder="Enter task name"
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows={3}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   placeholder="Enter task description"
//                   disabled={loading}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Task Type *</label>
//                   <select
//                     name="taskType"
//                     value={formData.taskType}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     disabled={loading}
//                   >
//                     <option value="General">General</option>
//                     <option value="Auction">Auction</option>
//                     <option value="Remainder">Remainder</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
//                   <select
//                     name="priority"
//                     value={formData.priority}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     disabled={loading}
//                   >
//                     <option value="High">High</option>
//                     <option value="Medium">Medium</option>
//                     <option value="Low">Low</option>
//                   </select>
//                 </div>
//                 <div onClick={handleDateClick}>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
//                   <input
//                     type="date"
//                     name="dueDate"
//                     value={formData.dueDate}
//                     onChange={handleInputChange}
//                     required
//                     ref={dateInputRef}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Remark *</label>
//                 <textarea
//                   name="remark"
//                   value={formData.remark}
//                   onChange={handleInputChange}
//                   rows={2}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   placeholder="Enter remark"
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
//                 <div
//                   ref={dropZoneRef}
//                   onClick={handleDropZoneClick}
//                   className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
//                     isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
//                   }`}
//                 >
//                   <input
//                     type="file"
//                     multiple
//                     ref={fileInputRef}
//                     onChange={handleFileInputChange}
//                     className="hidden"
//                     disabled={loading}
//                   />
//                   <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
//                   <p className="text-sm text-gray-600">
//                     {isDragActive
//                       ? 'Drop the files here ...'
//                       : 'Drag and drop files here, or click to select files'}
//                   </p>
//                 </div>

//                 {formData.attachments.length > 0 && (
//                   <div className="mt-2 space-y-2">
//                     {formData.attachments.map((attachment, index) => (
//                       <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
//                         <div className="flex items-center space-x-2">
//                           <Upload className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm">{attachment}</span>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => handleAttachmentRemove(index)}
//                           className="text-red-500 hover:text-red-700"
//                           disabled={loading}
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-end space-x-4">
//                 {onCancel && (
//                   <button
//                     type="button"
//                     onClick={onCancel}
//                     className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   type="submit"
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
//                   disabled={loading}
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>{editTask ? 'Update Task' : 'Create Task'}</span>
//                 </button>
//               </div>
//             </form>

//             {toastMessage && (
//               <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg z-50 text-sm max-w-sm">
//                 {toastMessage}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateTasksEmployee;


import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Upload, Calendar, Bell, Mail, Clock, Paperclip, ChevronDown, ChevronUp, User, Clock3, Repeat, Star, PlusCircle, Trash2 } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';

// Yup validation schema
const validationSchema = Yup.object({
  taskName: Yup.string().required('Task Name is required'),
  dueDate: Yup.string().required('Due Date is required'),
  priority: Yup.string().required('Priority is required'),
  taskType: Yup.string().required('Task Type is required'),
  assignedTo: Yup.array()
    .min(1, 'At least one assignee is required')
    .required('Assigned To is required'),
  dueTime: Yup.string().when('taskType', {
    is: 'Remainder',
    then: (schema) => schema.required('Due Time is required for Remainder tasks'),
    otherwise: (schema) => schema,
  }),
});

function CreateTasksEmployee({ onSubmit, editTask, onCancel }) {
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [recipientSearchTerm, setRecipientSearchTerm] = useState('');
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [showNotificationStages, setShowNotificationStages] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const dateInputRef = useRef(null);
  const token = localStorage.getItem('token') || '';

  const userOptions = currentUser ? [currentUser.name] : [];

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
    taskName: editTask?.taskName || '',
    description: editTask?.description || '',
    dueDate: editTask?.dueDate || '',
    priority: editTask?.priority || 'Medium',
    taskType: editTask?.taskType || 'General',
    remark: editTask?.remark || '',
    attachments: editTask?.fileUrls?.map(url => url.split('/').pop()) || [],
    assignedTo: editTask?.assignedTo || (currentUser ? [{ email: currentUser.email, name: currentUser.name, avatar: currentUser.avatar }] : []),
    reminderMode: 'self',
    reminderType: 'one-time',
    dueTime: '',
    notificationEmail: true,
    notificationInApp: true,
    notificationAlarm: false,
    notificationStages: [],
  };

  const getFilteredUserOptions = (currentSelected) => {
    return userOptions.filter(user =>
      user.toLowerCase().includes(recipientSearchTerm.toLowerCase()) &&
      !currentSelected.includes(user)
    );
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

  const addNotificationStage = (setFieldValue, values) => {
    setFieldValue('notificationStages', [
      ...values.notificationStages,
      {
        id: Date.now().toString(),
        triggerType: 'days_before',
        triggerValue: 7,
        recipients: [],
        notifyEmail: true,
        notifyInApp: true,
        notifyAlarm: false,
      }
    ]);
    setShowNotificationStages(true);
  };

  const updateNotificationStage = (id, field, value, setFieldValue, values) => {
    setFieldValue('notificationStages', values.notificationStages.map(stage =>
      stage.id === id ? { ...stage, [field]: value } : stage
    ));
  };

  const removeNotificationStage = (id, setFieldValue, values) => {
    setFieldValue('notificationStages', values.notificationStages.filter(stage => stage.id !== id));
  };

  const handleAddStageRecipient = (stageId, user, setFieldValue, values) => {
    setFieldValue('notificationStages', values.notificationStages.map(stage =>
      stage.id === stageId
        ? { ...stage, recipients: [...stage.recipients, user] }
        : stage
    ));
    setRecipientSearchTerm('');
    setShowRecipientDropdown(false);
  };

  const handleRemoveStageRecipient = (stageId, userToRemove, setFieldValue, values) => {
    setFieldValue('notificationStages', values.notificationStages.map(stage =>
      stage.id === stageId
        ? { ...stage, recipients: stage.recipients.filter(user => user !== userToRemove) }
        : stage
    ));
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
                const formDataToSend = new FormData();
                formDataToSend.append('taskName', values.taskName);
                formDataToSend.append('description', values.description);
                formDataToSend.append('dueDate', formattedDueDate);
                formDataToSend.append('assignedTo', JSON.stringify(values.assignedTo.map(emp => emp.email)));
                formDataToSend.append('priority', values.priority);
                formDataToSend.append('taskType', values.taskType);
                formDataToSend.append('remark', values.remark);

                if (values.taskType === 'Remainder') {
                  formDataToSend.append('reminderMode', values.reminderMode);
                  formDataToSend.append('reminderType', values.reminderType);
                  formDataToSend.append('dueTime', values.dueTime);
                  formDataToSend.append('notificationEmail', values.notificationEmail);
                  formDataToSend.append('notificationInApp', values.notificationInApp);
                  formDataToSend.append('notificationAlarm', values.notificationAlarm);
                  formDataToSend.append('notificationStages', JSON.stringify(values.notificationStages));
                }

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
                    reminderMode: 'self',
                    reminderType: 'one-time',
                    dueTime: '',
                    notificationEmail: true,
                    notificationInApp: true,
                    notificationAlarm: false,
                    notificationStages: [],
                  }
                });
                if (fileInputRef.current) fileInputRef.current.value = '';
              } catch (err) {
                console.error('Error processing task:', err.message);
                setToastMessage(`Error: ${err.message}`);
                setTimeout(() => setToastMessage(''), 3000);
              } finally {
                setSubmitting(false);
                setLoading(false);
              }
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <div className={`max-w-8xl mx-auto bg-white rounded-xl shadow-lg p-6 ${values.taskType !== 'Auction' ? 'flex flex-col lg:flex-row' : ''}`}>
                <div className={`${values.taskType !== 'Auction' ? 'lg:w-1/2 p-4 border-r border-gray-200' : 'w-full p-4'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editTask ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    {onCancel && (
                      <button onClick={onCancel} className="text-gray-500 hover:text-gray-700" disabled={isSubmitting}>
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {error && <div className="text-red-500 mb-4">{error}</div>}
                  <Form className="space-y-6">
                    {/* Task Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Task Type *</label>
                      <Field
                        as="select"
                        name="taskType"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        disabled={isSubmitting}
                      >
                        <option value="General">General</option>
                        <option value="Auction">Auction</option>
                        <option value="Remainder">Remainder</option>
                      </Field>
                      <ErrorMessage name="taskType" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    {/* Task Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Task Name *</label>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
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
                      <div onClick={handleDateClick}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
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
                    {values.taskType === 'Remainder' && (
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
                        {/* Notification Preferences for One-time */}
                        {values.reminderType === 'one-time' && (
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
                        )}
                        {/* Reminder Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Type</label>
                          <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                              <Field
                                type="radio"
                                name="reminderType"
                                value="one-time"
                                className="form-radio h-4 w-4 text-blue-600"
                                disabled={isSubmitting}
                              />
                              <span className="ml-2 text-gray-700">One-time</span>
                            </label>
                            <label className="inline-flex items-center">
                              <Field
                                type="radio"
                                name="reminderType"
                                value="interval"
                                className="form-radio h-4 w-4 text-blue-600"
                                disabled={isSubmitting}
                              />
                              <span className="ml-2 text-gray-700">Interval-based</span>
                            </label>
                          </div>
                        </div>
                        {/* Notification Stages for Interval-based */}
                        {values.reminderType === 'interval' && (
                          <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                            <button
                              type="button"
                              className="flex justify-between items-center w-full text-left text-lg font-semibold text-gray-800"
                              onClick={() => setShowNotificationStages(!showNotificationStages)}
                              disabled={isSubmitting}
                            >
                              <span className="flex items-center"><Repeat className="mr-2" /> Notification Stages</span>
                              {showNotificationStages ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            {showNotificationStages && (
                              <div className="mt-4 space-y-6">
                                {values.notificationStages.map((stage, index) => (
                                  <div key={stage.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm relative">
                                    <h4 className="text-md font-semibold text-gray-800 mb-3">Stage {index + 1}</h4>
                                    <button
                                      type="button"
                                      onClick={() => removeNotificationStage(stage.id, setFieldValue, values)}
                                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
                                      title="Remove stage"
                                      disabled={isSubmitting}
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                      <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
                                        <select
                                          value={stage.triggerType}
                                          onChange={(e) => updateNotificationStage(stage.id, 'triggerType', e.target.value, setFieldValue, values)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                          disabled={isSubmitting}
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
                                            value={stage.triggerValue}
                                            onChange={(e) => updateNotificationStage(stage.id, 'triggerValue', Math.max(1, parseInt(e.target.value) || 1), setFieldValue, values)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            disabled={isSubmitting}
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
                                                onClick={() => handleRemoveStageRecipient(stage.id, recipient, setFieldValue, values)}
                                                className="ml-1 text-purple-600 hover:text-purple-800"
                                                disabled={isSubmitting}
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
                                            disabled={isSubmitting}
                                          />
                                        </div>
                                        {showRecipientDropdown && getFilteredUserOptions(stage.recipients).length > 0 && (
                                          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                                            {getFilteredUserOptions(stage.recipients).map(user => (
                                              <div
                                                key={user}
                                                className="px-3 py-1.5 cursor-pointer hover:bg-gray-100 text-sm"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleAddStageRecipient(stage.id, user, setFieldValue, values)}
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
                                            onChange={(e) => updateNotificationStage(stage.id, 'notifyEmail', e.target.checked, setFieldValue, values)}
                                            className="form-checkbox h-3.5 w-3.5 text-blue-600 rounded"
                                            disabled={isSubmitting}
                                          />
                                          <Mail className="ml-1.5 mr-0.5" size={16} />
                                          <span className="text-gray-700">Email</span>
                                        </label>
                                        <label className="inline-flex items-center text-sm">
                                          <input
                                            type="checkbox"
                                            checked={stage.notifyAlarm}
                                            onChange={(e) => updateNotificationStage(stage.id, 'notifyAlarm', e.target.checked, setFieldValue, values)}
                                            className="form-checkbox h-3.5 w-3.5 text-blue-600 rounded"
                                            disabled={isSubmitting}
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
                                  onClick={() => addNotificationStage(setFieldValue, values)}
                                  className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium"
                                  disabled={isSubmitting}
                                >
                                  <PlusCircle className="mr-2" size={18} /> Add Notification Stage
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    {/* File Attachments */}
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
                    {/* Remark */}
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
                {/* Right Column: Preview (for General and Remainder) */}
                {values.taskType !== 'Auction' && (
                  <div className="lg:w-1/2 p-6 bg-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Task Preview</h2>
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {values.taskName || 'Untitled Task'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(values.priority)}`}>
                          <Star className="inline-block w-3 h-3 mr-1 -mt-0.5" /> {values.priority} Priority
                        </span>
                      </div>
                      {values.description && (
                        <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                          {values.description}
                        </p>
                      )}
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          <span>
                            Due: {values.dueDate ? new Date(values.dueDate).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            }) : 'Not set'}
                            {values.taskType === 'Remainder' && values.dueTime && ` at ${values.dueTime}`}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Assigned To: {values.assignedTo.length > 0 ? values.assignedTo.map(emp => emp.name).join(', ') : 'You'}</span>
                        </div>
                        {values.taskType === 'Remainder' && (
                          <>
                            <div className="flex items-center">
                              {values.reminderType === 'one-time' ? (
                                <Clock3 className="w-4 h-4 mr-2 text-gray-500" />
                              ) : (
                                <Repeat className="w-4 h-4 mr-2 text-gray-500" />
                              )}
                              <span>Type: {values.reminderType === 'one-time' ? 'One-time' : 'Interval-based'}</span>
                            </div>
                            {values.reminderType === 'one-time' && (
                              <div className="flex items-center">
                                <Bell className="w-4 h-4 mr-2 text-gray-500" />
                                <span>Notifications:
                                  {values.notificationEmail && <span className="ml-1 inline-flex items-center"><Mail className="w-4 h-4 mr-0.5" /> Email</span>}
                                  {values.notificationAlarm && <span className="ml-1 inline-flex items-center"><Bell className="w-4 h-4 mr-0.5" /> Alarm</span>}
                                  {!values.notificationEmail && !values.notificationInApp && !values.notificationAlarm && ' None'}
                                </span>
                              </div>
                            )}
                            {values.reminderType === 'interval' && values.notificationStages.length > 0 && (
                              <div className="space-y-2 mt-4">
                                <p className="font-semibold text-gray-800">Notification Stages:</p>
                                {values.notificationStages.map((stage, index) => (
                                  <div key={stage.id} className="ml-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <p className="font-medium text-gray-700 mb-1">Stage {index + 1}: {formatIntervalText(stage)}</p>
                                    <p className="text-xs text-gray-600">Recipients: {stage.recipients.length > 0 ? stage.recipients.join(', ') : 'None'}</p>
                                    <p className="text-xs text-gray-600">Notify:
                                      {stage.notifyEmail && <span className="ml-1 inline-flex items-center"><Mail className="w-3 h-3 mr-0.5" /> Email</span>}
                                      {stage.notifyAlarm && <span className="ml-1 inline-flex items-center"><Bell className="w-3 h-3 mr-0.5" /> Alarm</span>}
                                      {!stage.notifyEmail && !stage.notifyInApp && !stage.notifyAlarm && ' None'}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                        {values.attachments.length > 0 && (
                          <div className="flex items-start">
                            <Paperclip className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                            <div>
                              <p>Attachments:</p>
                              <ul className="list-disc list-inside ml-2">
                                {values.attachments.map((file, index) => (
                                  <li key={index}>{file}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Formik>
          {toastMessage && (
            <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg z-50 text-sm max-w-sm">
              {toastMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateTasksEmployee;