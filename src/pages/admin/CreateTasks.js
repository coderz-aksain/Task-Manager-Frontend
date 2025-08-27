

// import React, { useState, useEffect, useRef } from 'react';
// import { Plus, X, Upload, Calendar, Bell, Mail, Smartphone, Clock, Paperclip, ChevronDown, ChevronUp, Users, User, Clock3, Repeat, Star, Sparkles, PlusCircle, Trash2 } from 'lucide-react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import AdminSidebar from '../../components/common/AdminSidebar';
// import Header from '../../components/common/Header';
// import { useNavigate } from 'react-router-dom';

// const userOptions = [
//   'Alice Smith', 'Bob Johnson', 'Charlie Brown', 'Diana Prince', 'Eve Adams',
//   'Frank White', 'Grace Lee', 'Harry Potter', 'Ivy Green', 'Jack Black'
// ];

// function CreateTasks({ onSubmit, editTask, onCancel }) {
//   const [reminders, setReminders] = useState([{
//     id: Date.now().toString(),
//     taskName: editTask?.taskName || '',
//     description: editTask?.description || '',
//     dueDate: editTask?.dueDate || '',
//     dueTime: editTask?.dueTime || '',
//     assignedTo: editTask?.assignedTo || [],
//     notificationEmail: editTask?.notificationEmail ?? true,
//     notificationInApp: editTask?.notificationInApp ?? true,
//     notificationAlarm: editTask?.notificationAlarm ?? false,
//   }]);
//   const [employees, setEmployees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
//   const [toast, setToast] = useState({ visible: false, message: '', type: '' });
//   const [dropActive, setDropActive] = useState(false);
//   const [recipientSearchTerm, setRecipientSearchTerm] = useState('');
//   const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
//   const [notificationDraft, setNotificationDraft] = useState('');
//   const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalTitle, setModalTitle] = useState('');
//   const [modalMessage, setModalMessage] = useState('');
//   const [currentUser, setCurrentUser] = useState(null);
//   const recipientInputRef = useRef(null);
//   const employeeDropdownRef = useRef(null);
//   const token = localStorage.getItem('token') || '';
//   const navigate = useNavigate();
//   const [showSidebar, setShowSidebar] = useState(false);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await fetch('https://task-manager-backend-vqen.onrender.com/api/admin/allemployees', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) throw new Error('Failed to fetch employees');
//         const data = await response.json();
//         const validEmployees = Array.isArray(data) ? data.map(emp => ({
//           id: emp.id || emp._id || '',
//           name: emp.firstName || 'Unknown',
//           email: emp.email || '',
//           department: emp.department || 'Unknown',
//           avatar: emp.profileImage || '',
//         })) : [];
//         setEmployees(validEmployees);
//       } catch (err) {
//         formik.setErrors({ api: err.message });
//         showToast(err.message, 'error');
//       }
//     };
//     fetchEmployees();
//   }, [token]);

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const response = await fetch('https://task-manager-backend-vqen.onrender.com/api/admin/currentuser', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           }
//         });
//         if (!response.ok) throw new Error('Failed to fetch current user');
//         const data = await response.json();
//         setCurrentUser({
//           id: data.id || data._id,
//           name: data.firstName || 'Unknown',
//           email: data.email,
//           department: data.department || 'Unknown',
//           avatar: data.profileImage || '',
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     if (token) {
//       fetchCurrentUser();
//     }
//   }, [token]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
//         setShowEmployeeDropdown(false);
//       }
//     };

//     if (showEmployeeDropdown) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showEmployeeDropdown]);

//   const filteredEmployees = employees.filter(emp =>
//     (emp.name && typeof emp.name === 'string' && emp.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (emp.department && typeof emp.department === 'string' && emp.department.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const getFilteredUserOptions = (currentSelected) => {
//     return userOptions.filter(user =>
//       user.toLowerCase().includes(recipientSearchTerm.toLowerCase()) &&
//       !currentSelected.includes(user)
//     );
//   };

//   const showToast = (message, type) => {
//     setToast({ visible: true, message, type });
//     setTimeout(() => setToast({ visible: false, message: '', type: '' }), 5000);
//   };

//   const validationSchema = Yup.object({
//     taskType: Yup.string().required('Task Type is required'),
//     taskName: Yup.string().required('Task Name is required'),
//     priority: Yup.string().required('Priority is required'),
//     dueDate: Yup.string().required('Due Date is required'),
//     assignedTo: Yup.array().min(1, 'At least one employee must be assigned'),
//   });

//   const reminderValidationSchema = Yup.object({
//     taskName: Yup.string().required('Reminder Name is required'),
//     dueDate: Yup.string().required('Reminder Date is required'),
//     assignedTo: Yup.array().min(1, 'At least one employee must be assigned'),
//   });

//   const formik = useFormik({
//     initialValues: {
//       taskType: editTask?.taskType || 'General',
//       taskName: editTask?.taskName || '',
//       description: editTask?.description || '',
//       priority: editTask?.priority || 'Medium',
//       dueDate: editTask?.dueDate || '',
//       assignedTo: editTask?.assignedTo || [],
//       attachments: editTask?.attachments || [],
//       remark: editTask?.remark || '',
//     },
//     validationSchema,
//     onSubmit: async (values, { setSubmitting, setErrors }) => {
//       if (values.taskType === 'Reminder') {
//         try {
//           for (const reminder of reminders) {
//             await reminderValidationSchema.validate(reminder, { abortEarly: false });
//           }
//         } catch (err) {
//           setErrors({ api: 'All reminder fields (Reminder Name, Reminder Date, Assign Employee) are required' });
//           showToast('All reminder fields are required', 'error');
//           setSubmitting(false);
//           return;
//         }
//         setSubmitting(true);
//         try {
//           for (const reminder of reminders) {
//             const formDataToSend = new FormData();
//             formDataToSend.append('taskName', reminder.taskName);
//             formDataToSend.append('description', reminder.description);
//             formDataToSend.append('dueDate', formatDate(reminder.dueDate));
//             formDataToSend.append('assignedTo', JSON.stringify(reminder.assignedTo.map(emp => emp.email)));
//             formDataToSend.append('priority', values.priority);
//             formDataToSend.append('taskType', values.taskType);
//             formDataToSend.append('remark', values.remark);
//             formDataToSend.append('notificationEmail', reminder.notificationEmail);
//             formDataToSend.append('notificationInApp', reminder.notificationInApp);
//             formDataToSend.append('notificationAlarm', reminder.notificationAlarm);
//             formDataToSend.append('notificationDraft', notificationDraft);
//             values.attachments.forEach((file, index) => {
//               if (file instanceof File) {
//                 formDataToSend.append('file', file);
//               }
//             });
//             const response = await fetch('https://task-manager-backend-vqen.onrender.com/api/admin/createtask', {
//               method: 'POST',
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//               },
//               body: formDataToSend,
//             });
//             if (!response.ok) {
//               const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
//               throw new Error(errorData.message || 'Failed to create task');
//             }
//             const data = await response.json();
//             if (typeof onSubmit === 'function') {
//               onSubmit(data);
//             }
//           }
//           showToast('Reminders created successfully!', 'success');
//           setTimeout(() => navigate('/admin/tasks'), 3000);
//         } catch (err) {
//           setErrors({ api: err.message });
//           showToast(err.message || 'Failed to create reminders', 'error');
//         } finally {
//           setSubmitting(false);
//         }
//       } else {
//         setSubmitting(true);
//         const formDataToSend = new FormData();
//         formDataToSend.append('taskName', values.taskName);
//         formDataToSend.append('description', values.description);
//         formDataToSend.append('dueDate', formatDate(values.dueDate));
//         formDataToSend.append('assignedTo', JSON.stringify(values.assignedTo.map(emp => emp.email)));
//         formDataToSend.append('priority', values.priority);
//         formDataToSend.append('taskType', values.taskType);
//         formDataToSend.append('remark', values.remark);
//         values.attachments.forEach((file, index) => {
//           if (file instanceof File) {
//             formDataToSend.append('file', file);
//           }
//         });
//         try {
//           const response = await fetch('https://task-manager-backend-vqen.onrender.com/api/admin/createtask', {
//             method: 'POST',
//             headers: {
//               'Authorization': `Bearer ${token}`,
//             },
//             body: formDataToSend,
//           });
//           if (!response.ok) {
//             const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
//             throw new Error(errorData.message || 'Failed to create task');
//           }
//           const data = await response.json();
//           if (typeof onSubmit === 'function') {
//             onSubmit(data);
//           }
//           showToast('Task created successfully!', 'success');
//           setTimeout(() => navigate('/admin/tasks'), 3000);
//         } catch (err) {
//           setErrors({ api: err.message });
//           showToast(err.message || 'Failed to create task', 'error');
//         } finally {
//           setSubmitting(false);
//         }
//       }
//     },
//   });

//   const handleReminderInputChange = (e, reminderId) => {
//     const { name, value } = e.target;
//     setReminders(prev => prev.map(reminder =>
//       reminder.id === reminderId ? { ...reminder, [name]: value } : reminder
//     ));
//   };

//   const handleEmployeeSelect = (employee, reminderId) => {
//     if (formik.values.taskType === 'Reminder' && reminderId) {
//       setReminders(prev => prev.map(reminder =>
//         reminder.id === reminderId && !reminder.assignedTo.find(emp => emp.email === employee.email) ?
//         { ...reminder, assignedTo: [...reminder.assignedTo, { email: employee.email, name: employee.name, avatar: employee.avatar }] } :
//         reminder
//       ));
//     } else {
//       if (!formik.values.assignedTo.find(emp => emp.email === employee.email)) {
//         formik.setFieldValue('assignedTo', [...formik.values.assignedTo, { email: employee.email, name: employee.name, avatar: employee.avatar }]);
//       }
//     }
//     setSearchTerm('');
//     setShowEmployeeDropdown(false);
//   };

//   const handleEmployeeRemove = (email, reminderId) => {
//     if (formik.values.taskType === 'Reminder' && reminderId) {
//       setReminders(prev => prev.map(reminder =>
//         reminder.id === reminderId ?
//         { ...reminder, assignedTo: reminder.assignedTo.filter(emp => emp.email !== email) } :
//         reminder
//       ));
//     } else {
//       formik.setFieldValue('assignedTo', formik.values.assignedTo.filter(emp => emp.email !== email));
//     }
//   };

//   const handleAttachmentAdd = (e) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       formik.setFieldValue('attachments', [...formik.values.attachments, ...files]);
//       e.target.value = '';
//     }
//   };

//   const handleAttachmentRemove = (index) => {
//     formik.setFieldValue('attachments', formik.values.attachments.filter((_, i) => i !== index));
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDropActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const files = Array.from(e.dataTransfer.files);
//       formik.setFieldValue('attachments', [...formik.values.attachments, ...files]);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setDropActive(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setDropActive(false);
//   };

//   const generateNotificationDraft = async (reminder) => {
//     setIsGeneratingDraft(true);
//     setNotificationDraft('Generating draft...');
//     let prompt = `Draft a concise and professional reminder notification message.
//       Title: "${reminder.taskName || 'No Title'}"
//       Description: "${reminder.description || 'No Description'}"
//       Due Date: "${reminder.dueDate || 'Not set'}"
//       Due Time: "${reminder.dueTime || 'Not set'}"
//       Assigned To: ${reminder.assignedTo.length > 0 ? reminder.assignedTo.map(emp => emp.name).join(', ') : 'No one assigned'}
//     `;
//     prompt += `The message should be suitable for an email or in-app notification. Focus on clarity and brevity.`;
//     let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
//     const payload = { contents: chatHistory };
//     const apiKey = "";
//     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
//     let retries = 0;
//     const maxRetries = 5;
//     const baseDelay = 1000;
//     while (retries < maxRetries) {
//       try {
//         const response = await fetch(apiUrl, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         });
//         if (response.status === 429) {
//           retries++;
//           const delay = baseDelay * Math.pow(2, retries - 1);
//           console.warn(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
//           await new Promise(resolve => setTimeout(resolve, delay));
//           continue;
//         }
//         const result = await response.json();
//         if (result.candidates && result.candidates.length > 0 &&
//             result.candidates[0].content && result.candidates[0].content.parts &&
//             result.candidates[0].content.parts.length > 0) {
//           setNotificationDraft(result.candidates[0].content.parts[0].text);
//         } else {
//           setNotificationDraft('Could not generate draft. Please try again.');
//         }
//         break;
//       } catch (error) {
//         console.error('Error generating notification draft:', error);
//         setNotificationDraft('Error generating draft. Please check console.');
//         break;
//       } finally {
//         setIsGeneratingDraft(false);
//       }
//     }
//     if (retries === maxRetries) {
//       setNotificationDraft('Failed to generate draft after multiple retries.');
//       setIsGeneratingDraft(false);
//     }
//   };

//   const showModal = (title, message) => {
//     setModalTitle(title);
//     setModalMessage(message);
//     setModalVisible(true);
//   };

//   const hideModal = () => {
//     setModalVisible(false);
//   };

//   const addReminder = () => {
//     setReminders(prev => [
//       ...prev,
//       {
//         id: Date.now().toString(),
//         taskName: '',
//         description: '',
//         dueDate: '',
//         dueTime: '',
//         assignedTo: [],
//         notificationEmail: true,
//         notificationInApp: true,
//         notificationAlarm: false,
//       }
//     ]);
//   };

//   const removeReminder = (reminderId) => {
//     setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
//   };

//   const formatDate = (dateStr) => {
//     const [year, month, day] = dateStr.split('-');
//     return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
//   };

//   const toggleSidebar = () => {
//     setShowSidebar(prev => !prev);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50 relative font-sans text-gray-800">
//       <script src="https://cdn.tailwindcss.com"></script>
//       <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
//       <div className="sticky top-0 h-screen z-40">
//         <AdminSidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
//       </div>
//       <div className="flex-1 flex flex-col">
//         <Header isLoggedIn={!!token} onToggleSidebar={toggleSidebar} />
//         <div className="flex-1 p-4 sm:p-6 overflow-auto">
//           <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6">
//             <div className="w-full">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
//                   {editTask ? 'Edit Task' : 'Create New Task'}
//                 </h2>
//                 {onCancel && (
//                   <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
//                     <X className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>
//               {formik.errors.api && <div className="text-red-500 mb-4 text-sm">{formik.errors.api}</div>}
//               <form onSubmit={formik.handleSubmit} className="space-y-6">
//                 {/* Task Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Task Type <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="taskType"
//                     value={formik.values.taskType}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full px-3 py-2 border rounded-md ${formik.touched.taskType && formik.errors.taskType ? 'border-red-500' : 'border-gray-300'}`}
//                   >
//                     <option value="General">General</option>
//                     <option value="Auction">Auction</option>
//                     <option value="Reminder">Reminder</option>
//                   </select>
//                   {formik.touched.taskType && formik.errors.taskType && (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.taskType}</div>
//                   )}
//                 </div>
//                 {formik.values.taskType === 'Reminder' ? (
//                   <>
//                     {reminders.map((reminder, index) => (
//                       <div key={reminder.id} className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50 relative">
//                         <h3 className="text-md font-semibold text-gray-800 mb-3">Reminder {index + 1}</h3>
//                         {/* Reminder Name */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Reminder Name <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             name="taskName"
//                             value={reminder.taskName}
//                             onChange={(e) => handleReminderInputChange(e, reminder.id)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                             placeholder="Enter reminder name"
//                           />
//                         </div>
//                         {/* Description */}
//                         <div className="mt-4">
//                           <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                           <textarea
//                             name="description"
//                             value={reminder.description}
//                             onChange={(e) => handleReminderInputChange(e, reminder.id)}
//                             rows={3}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                             placeholder="Enter reminder description"
//                           />
//                         </div>
//                         {/* Reminder Date and Time */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               Reminder Date <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                               type="date"
//                               name="dueDate"
//                               value={reminder.dueDate}
//                               onChange={(e) => handleReminderInputChange(e, reminder.id)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Time</label>
//                             <input
//                               type="time"
//                               name="dueTime"
//                               value={reminder.dueTime}
//                               onChange={(e) => handleReminderInputChange(e, reminder.id)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                             />
//                           </div>
//                         </div>
//                         {/* Assign Employees */}
//                         <div className="mt-4">
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Assign Employees <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             onFocus={() => setShowEmployeeDropdown(true)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                             placeholder="Search employee by name or department"
//                           />
//                           {showEmployeeDropdown && (
//                             <div ref={employeeDropdownRef} className="relative z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                               {filteredEmployees.map((employee) => (
//                                 <button
//                                   key={employee.id}
//                                   type="button"
//                                   onClick={() => handleEmployeeSelect(employee, reminder.id)}
//                                   className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
//                                 >
//                                   <img src={employee.avatar || ''} alt={employee.name} className="w-8 h-8 rounded-full" />
//                                   <div>
//                                     <p className="font-medium">{employee.name || 'Unknown'}</p>
//                                     <p className="text-sm text-gray-500">{employee.department || 'Unknown'}</p>
//                                   </div>
//                                 </button>
//                               ))}
//                             </div>
//                           )}
//                           <div className="mt-2 flex flex-wrap gap-2">
//                             {reminder.assignedTo.map((emp) => (
//                               <div key={emp.email} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
//                                 <img src={emp.avatar || ''} alt={emp.name} className="w-5 h-5 rounded-full mr-2" />
//                                 <span className="text-sm">{emp.name || 'Unknown'}</span>
//                                 <button
//                                   type="button"
//                                   onClick={() => handleEmployeeRemove(emp.email, reminder.id)}
//                                   className="ml-2 text-blue-500 hover:text-blue-700"
//                                 >
//                                   <X className="w-3 h-3" />
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                         {/* Notification Preferences */}
//                         <div className="mt-4">
//                           <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
//                           <div className="flex flex-wrap gap-4">
//                             <label className="inline-flex items-center">
//                               <input
//                                 type="checkbox"
//                                 checked={reminder.notificationEmail}
//                                 onChange={(e) => setReminders(prev => prev.map(r =>
//                                   r.id === reminder.id ? { ...r, notificationEmail: e.target.checked } : r
//                                 ))}
//                                 className="form-checkbox h-4 w-4 text-blue-600 rounded"
//                               />
//                               <Mail className="ml-2 mr-1 w-4 h-4 text-purple-700" />
//                               <span className="text-gray-700">Email</span>
//                             </label>
//                             <label className="inline-flex items-center">
//                               <input
//                                 type="checkbox"
//                                 checked={reminder.notificationInApp}
//                                 onChange={(e) => setReminders(prev => prev.map(r =>
//                                   r.id === reminder.id ? { ...r, notificationInApp: e.target.checked } : r
//                                 ))}
//                                 className="form-checkbox h-4 w-4 text-blue-600 rounded"
//                               />
//                               <Smartphone className="ml-2 mr-1 w-4 h-4" />
//                               <span className="text-gray-700">In-app</span>
//                             </label>
//                             <label className="inline-flex items-center">
//                               <input
//                                 type="checkbox"
//                                 checked={reminder.notificationAlarm}
//                                 onChange={(e) => setReminders(prev => prev.map(r =>
//                                   r.id === reminder.id ? { ...r, notificationAlarm: e.target.checked } : r
//                                 ))}
//                                 className="form-checkbox h-4 w-4 text-blue-600 rounded"
//                               />
//                               <Bell className="ml-2 mr-1 w-4 h-4 text-red-800" />
//                               <span className="text-gray-700">Alarm Alert</span>
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                     <button
//                       type="button"
//                       onClick={addReminder}
//                       className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium mt-4"
//                     >
//                       <PlusCircle className="mr-2" size={18} /> Add Reminder
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     {/* Task Name */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Task Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="taskName"
//                         value={formik.values.taskName}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         className={`w-full px-3 py-2 border rounded-md ${formik.touched.taskName && formik.errors.taskName ? 'border-red-500' : 'border-gray-300'}`}
//                         placeholder="Enter task name"
//                       />
//                       {formik.touched.taskName && formik.errors.taskName && (
//                         <div className="text-red-500 text-sm mt-1">{formik.errors.taskName}</div>
//                       )}
//                     </div>
//                     {/* Description */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                       <textarea
//                         name="description"
//                         value={formik.values.description}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         rows={3}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                         placeholder="Enter task description"
//                       />
//                     </div>
//                     {/* Priority and Due Date */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Priority <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                           name="priority"
//                           value={formik.values.priority}
//                           onChange={formik.handleChange}
//                           onBlur={formik.handleBlur}
//                           className={`w-full px-3 py-2 border rounded-md ${formik.touched.priority && formik.errors.priority ? 'border-red-500' : 'border-gray-300'}`}
//                         >
//                           <option value="High">High</option>
//                           <option value="Medium">Medium</option>
//                           <option value="Low">Low</option>
//                         </select>
//                         {formik.touched.priority && formik.errors.priority && (
//                           <div className="text-red-500 text-sm mt-1">{formik.errors.priority}</div>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Due Date <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="date"
//                           name="dueDate"
//                           value={formik.values.dueDate}
//                           onChange={formik.handleChange}
//                           onBlur={formik.handleBlur}
//                           className={`w-full px-3 py-2 border rounded-md ${formik.touched.dueDate && formik.errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
//                         />
//                         {formik.touched.dueDate && formik.errors.dueDate && (
//                           <div className="text-red-500 text-sm mt-1">{formik.errors.dueDate}</div>
//                         )}
//                       </div>
//                     </div>
//                     {/* Assign Employees */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Assign Employees <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         onFocus={() => setShowEmployeeDropdown(true)}
//                         className={`w-full px-3 py-2 border rounded-md ${formik.touched.assignedTo && formik.errors.assignedTo ? 'border-red-500' : 'border-gray-300'}`}
//                         placeholder="Search employee by name or department"
//                       />
//                       {showEmployeeDropdown && (
//                         <div ref={employeeDropdownRef} className="relative z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                           {filteredEmployees.map((employee) => (
//                             <button
//                               key={employee.id}
//                               type="button"
//                               onClick={() => handleEmployeeSelect(employee)}
//                               className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
//                             >
//                               <img src={employee.avatar || ''} alt={employee.name} className="w-8 h-8 rounded-full" />
//                               <div>
//                                 <p className="font-medium">{employee.name || 'Unknown'}</p>
//                                 <p className="text-sm text-gray-500">{employee.department || 'Unknown'}</p>
//                               </div>
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {formik.values.assignedTo.map((emp) => (
//                           <div key={emp.email} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
//                             <img src={emp.avatar || ''} alt={emp.name} className="w-5 h-5 rounded-full mr-2" />
//                             <span className="text-sm">{emp.name || 'Unknown'}</span>
//                             <button
//                               type="button"
//                               onClick={() => handleEmployeeRemove(emp.email)}
//                               className="ml-2 text-blue-500 hover:text-blue-700"
//                             >
//                               <X className="w-3 h-3" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                       {formik.touched.assignedTo && formik.errors.assignedTo && (
//                         <div className="text-red-500 text-sm mt-1">{formik.errors.assignedTo}</div>
//                       )}
//                     </div>
//                     {/* File Attachments */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
//                       <div
//                         className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md transition-colors ${
//                           dropActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
//                         } min-h-[100px] cursor-pointer relative`}
//                         onDrop={handleDrop}
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onClick={() => document.getElementById('attachment-input').click()}
//                         tabIndex={0}
//                         onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('attachment-input').click(); }}
//                       >
//                         <input
//                           id="attachment-input"
//                           type="file"
//                           multiple
//                           onChange={handleAttachmentAdd}
//                           className="hidden"
//                         />
//                         <Upload className="w-8 h-8 text-blue-400 mb-2" />
//                         <span className="text-sm text-gray-600 mb-1">
//                           Drag & drop files here, or <span className="text-blue-600 underline">click to select</span>
//                         </span>
//                         <span className="text-xs text-gray-400">(You can select multiple files)</span>
//                       </div>
//                       {formik.values.attachments.length > 0 && (
//                         <div className="mt-2 space-y-2">
//                           {formik.values.attachments.map((attachment, index) => (
//                             <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
//                               <div className="flex items-center space-x-2">
//                                 <Upload className="w-4 h-4 text-gray-500" />
//                                 <span className="text-sm">{attachment instanceof File ? attachment.name : attachment}</span>
//                               </div>
//                               <button
//                                 type="button"
//                                 onClick={() => handleAttachmentRemove(index)}
//                                 className="text-red-500 hover:text-red-700"
//                               >
//                                 <X className="w-4 h-4" />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     {/* Remark */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
//                       <textarea
//                         name="remark"
//                         value={formik.values.remark}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         rows={2}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                         placeholder="Enter remark"
//                       />
//                     </div>
//                   </>
//                 )}
//                 {/* Submit Buttons */}
//                 <div className="flex justify-end space-x-4">
//                   {onCancel && (
//                     <button
//                       type="button"
//                       onClick={onCancel}
//                       className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                     >
//                       Cancel
//                     </button>
//                   )}
//                   <button
//                     type="submit"
//                     className={`px-6 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
//                     disabled={formik.isSubmitting}
//                   >
//                     {formik.isSubmitting ? (
//                       <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                     ) : (
//                       <>
//                         <Plus className="w-4 h-4" />
//                         <span>{editTask ? 'Update Task' : formik.values.taskType === 'Reminder' ? 'Save Reminder' : 'Create Task'}</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//       {toast.visible && (
//         <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg animate-fade-in-out z-50 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
//           {toast.message}
//         </div>
//       )}
//       {modalVisible && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
//             <h3 className="text-xl font-semibold text-gray-900 mb-3">{modalTitle}</h3>
//             <p className="text-gray-700 mb-6">{modalMessage}</p>
//             <div className="flex justify-end">
//               <button
//                 type="button"
//                 className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
//                 onClick={hideModal}
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CreateTasks;

import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Upload, Calendar, Bell, Mail, Smartphone, Clock, Paperclip, ChevronDown, ChevronUp, Users, User, Clock3, Repeat, Star, Sparkles, PlusCircle, Trash2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AdminSidebar from '../../components/common/AdminSidebar';
import Header from '../../components/common/Header';
import { useNavigate } from 'react-router-dom';

const userOptions = [
  'Alice Smith', 'Bob Johnson', 'Charlie Brown', 'Diana Prince', 'Eve Adams',
  'Frank White', 'Grace Lee', 'Harry Potter', 'Ivy Green', 'Jack Black'
];

function CreateTasks({ onSubmit, editTask, onCancel }) {
  const [reminders, setReminders] = useState([{
    id: Date.now().toString(),
    taskName: editTask?.taskName || '',
    description: editTask?.description || '',
    dueDate: editTask?.dueDate || '',
    dueTime: editTask?.dueTime || '',
    assignedTo: editTask?.assignedTo || [],
    notificationEmail: editTask?.notificationEmail ?? true,
    notificationInApp: editTask?.notificationInApp ?? true,
    notificationAlarm: editTask?.notificationAlarm ?? false,
  }]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [dropActive, setDropActive] = useState(false);
  const [recipientSearchTerm, setRecipientSearchTerm] = useState('');
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
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
        formik.setErrors({ api: err.message });
        showToast(err.message, 'error');
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

  const showToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: '' }), 5000);
  };

  const validationSchema = Yup.object({
    taskType: Yup.string().required('Task Type is required'),
    taskName: Yup.string().required('Task Name is required'),
    priority: Yup.string().required('Priority is required'),
    dueDate: Yup.string().required('Due Date is required'),
    description: Yup.string(),
    assignedTo: Yup.array(),
    attachments: Yup.array(),
    remark: Yup.string(),
  });

  const reminderValidationSchema = Yup.object({
    taskName: Yup.string().required('Reminder Name is required'),
    dueDate: Yup.string().required('Reminder Date is required'),
    description: Yup.string(),
    dueTime: Yup.string(),
    assignedTo: Yup.array(),
    notificationEmail: Yup.boolean(),
    notificationInApp: Yup.boolean(),
    notificationAlarm: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      taskType: editTask?.taskType || 'General',
      taskName: editTask?.taskName || '',
      description: editTask?.description || '',
      priority: editTask?.priority || 'Medium',
      dueDate: editTask?.dueDate || '',
      assignedTo: editTask?.assignedTo || [],
      attachments: editTask?.attachments || [],
      remark: editTask?.remark || '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (values.taskType === 'Reminder') {
        try {
          for (const reminder of reminders) {
            await reminderValidationSchema.validate(reminder, { abortEarly: false });
          }
        } catch (err) {
          setErrors({ api: 'All reminder fields (Reminder Name, Reminder Date) are required' });
          showToast('All reminder fields (Reminder Name, Reminder Date) are required', 'error');
          setSubmitting(false);
          return;
        }
        setSubmitting(true);
        try {
          for (const reminder of reminders) {
            const formDataToSend = new FormData();
            formDataToSend.append('taskName', reminder.taskName);
            formDataToSend.append('description', reminder.description);
            formDataToSend.append('dueDate', formatDate(reminder.dueDate));
            formDataToSend.append('assignedTo', JSON.stringify(reminder.assignedTo.map(emp => emp.email)));
            formDataToSend.append('priority', values.priority);
            formDataToSend.append('taskType', values.taskType);
            formDataToSend.append('remark', values.remark);
            formDataToSend.append('notificationEmail', reminder.notificationEmail);
            formDataToSend.append('notificationInApp', reminder.notificationInApp);
            formDataToSend.append('notificationAlarm', reminder.notificationAlarm);
            formDataToSend.append('notificationDraft', notificationDraft);
            values.attachments.forEach((file, index) => {
              if (file instanceof File) {
                formDataToSend.append('file', file);
              }
            });
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
          }
          showToast('Reminders created successfully!', 'success');
          setTimeout(() => navigate('/admin/tasks'), 3000);
        } catch (err) {
          setErrors({ api: err.message });
          showToast(err.message || 'Failed to create reminders', 'error');
        } finally {
          setSubmitting(false);
        }
      } else {
        setSubmitting(true);
        const formDataToSend = new FormData();
        formDataToSend.append('taskName', values.taskName);
        formDataToSend.append('description', values.description);
        formDataToSend.append('dueDate', formatDate(values.dueDate));
        formDataToSend.append('assignedTo', JSON.stringify(values.assignedTo.map(emp => emp.email)));
        formDataToSend.append('priority', values.priority);
        formDataToSend.append('taskType', values.taskType);
        formDataToSend.append('remark', values.remark);
        values.attachments.forEach((file, index) => {
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
          showToast('Task created successfully!', 'success');
          setTimeout(() => navigate('/admin/tasks'), 3000);
        } catch (err) {
          setErrors({ api: err.message });
          showToast(err.message || 'Failed to create task', 'error');
        } finally {
          setSubmitting(false);
        }
      }
    },
  });

  const handleReminderInputChange = (e, reminderId) => {
    const { name, value } = e.target;
    setReminders(prev => prev.map(reminder =>
      reminder.id === reminderId ? { ...reminder, [name]: value } : reminder
    ));
  };

  const handleEmployeeSelect = (employee, reminderId) => {
    if (formik.values.taskType === 'Reminder' && reminderId) {
      setReminders(prev => prev.map(reminder =>
        reminder.id === reminderId && !reminder.assignedTo.find(emp => emp.email === employee.email) ?
        { ...reminder, assignedTo: [...reminder.assignedTo, { email: employee.email, name: employee.name, avatar: employee.avatar }] } :
        reminder
      ));
    } else {
      if (!formik.values.assignedTo.find(emp => emp.email === employee.email)) {
        formik.setFieldValue('assignedTo', [...formik.values.assignedTo, { email: employee.email, name: employee.name, avatar: employee.avatar }]);
      }
    }
    setSearchTerm('');
    setShowEmployeeDropdown(false);
  };

  const handleEmployeeRemove = (email, reminderId) => {
    if (formik.values.taskType === 'Reminder' && reminderId) {
      setReminders(prev => prev.map(reminder =>
        reminder.id === reminderId ?
        { ...reminder, assignedTo: reminder.assignedTo.filter(emp => emp.email !== email) } :
        reminder
      ));
    } else {
      formik.setFieldValue('assignedTo', formik.values.assignedTo.filter(emp => emp.email !== email));
    }
  };

  const handleAttachmentAdd = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      formik.setFieldValue('attachments', [...formik.values.attachments, ...files]);
      e.target.value = '';
    }
  };

  const handleAttachmentRemove = (index) => {
    formik.setFieldValue('attachments', formik.values.attachments.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDropActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      formik.setFieldValue('attachments', [...formik.values.attachments, ...files]);
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
    setNotificationDraft('Generating draft...');
    let prompt = `Draft a concise and professional reminder notification message.
      Title: "${reminder.taskName || 'No Title'}"
      Description: "${reminder.description || 'No Description'}"
      Due Date: "${reminder.dueDate || 'Not set'}"
      Due Time: "${reminder.dueTime || 'Not set'}"
      Assigned To: ${reminder.assignedTo.length > 0 ? reminder.assignedTo.map(emp => emp.name).join(', ') : 'No one assigned'}
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

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const addReminder = () => {
    setReminders(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        taskName: '',
        description: '',
        dueDate: '',
        dueTime: '',
        assignedTo: [],
        notificationEmail: true,
        notificationInApp: true,
        notificationAlarm: false,
      }
    ]);
  };

  const removeReminder = (reminderId) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
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
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {editTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                {onCancel && (
                  <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {formik.errors.api && <div className="text-red-500 mb-4 text-sm">{formik.errors.api}</div>}
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Task Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="taskType"
                    value={formik.values.taskType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border rounded-md ${formik.touched.taskType && formik.errors.taskType ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="General">General</option>
                    <option value="Auction">Auction</option>
                    <option value="Reminder">Reminder</option>
                  </select>
                  {formik.touched.taskType && formik.errors.taskType && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.taskType}</div>
                  )}
                </div>
                {formik.values.taskType === 'Reminder' ? (
                  <>
                    {reminders.map((reminder, index) => (
                      <div key={reminder.id} className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50 relative">
                        <h3 className="text-md font-semibold text-gray-800 mb-3">Reminder {index + 1}</h3>
                        {reminders.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReminder(reminder.id)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                        {/* Reminder Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reminder Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="taskName"
                            value={reminder.taskName}
                            onChange={(e) => handleReminderInputChange(e, reminder.id)}
                            className={`w-full px-3 py-2 border rounded-md ${reminder.taskName === '' && formik.submitCount > 0 ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter reminder name"
                          />
                          {reminder.taskName === '' && formik.submitCount > 0 && (
                            <div className="text-red-500 text-sm mt-1">Reminder Name is required</div>
                          )}
                        </div>
                        {/* Description */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            name="description"
                            value={reminder.description}
                            onChange={(e) => handleReminderInputChange(e, reminder.id)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Enter reminder description"
                          />
                        </div>
                        {/* Reminder Date and Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Reminder Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              name="dueDate"
                              value={reminder.dueDate}
                              onChange={(e) => handleReminderInputChange(e, reminder.id)}
                              className={`w-full px-3 py-2 border rounded-md ${reminder.dueDate === '' && formik.submitCount > 0 ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {reminder.dueDate === '' && formik.submitCount > 0 && (
                              <div className="text-red-500 text-sm mt-1">Reminder Date is required</div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Time</label>
                            <input
                              type="time"
                              name="dueTime"
                              value={reminder.dueTime}
                              onChange={(e) => handleReminderInputChange(e, reminder.id)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        {/* Assign Employees */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign Employees <span className= "text-red-700">*</span>
                          </label>
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
                                  onClick={() => handleEmployeeSelect(employee, reminder.id)}
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
                            {reminder.assignedTo.map((emp) => (
                              <div key={emp.email} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                <img src={emp.avatar || ''} alt={emp.name} className="w-5 h-5 rounded-full mr-2" />
                                <span className="text-sm">{emp.name || 'Unknown'}</span>
                                <button
                                  type="button"
                                  onClick={() => handleEmployeeRemove(emp.email, reminder.id)}
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Notification Preferences */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
                          <div className="flex flex-wrap gap-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={reminder.notificationEmail}
                                onChange={(e) => setReminders(prev => prev.map(r =>
                                  r.id === reminder.id ? { ...r, notificationEmail: e.target.checked } : r
                                ))}
                                className="form-checkbox h-4 w-4 text-blue-600 rounded"
                              />
                              <Mail className="ml-2 mr-1 w-4 h-4 text-purple-700" />
                              <span className="text-gray-700">Email</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={reminder.notificationInApp}
                                onChange={(e) => setReminders(prev => prev.map(r =>
                                  r.id === reminder.id ? { ...r, notificationInApp: e.target.checked } : r
                                ))}
                                className="form-checkbox h-4 w-4 text-blue-600 rounded"
                              />
                              <Smartphone className="ml-2 mr-1 w-4 h-4" />
                              <span className="text-gray-700">In-app</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={reminder.notificationAlarm}
                                onChange={(e) => setReminders(prev => prev.map(r =>
                                  r.id === reminder.id ? { ...r, notificationAlarm: e.target.checked } : r
                                ))}
                                className="form-checkbox h-4 w-4 text-blue-600 rounded"
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
                      className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium mt-4"
                    >
                      <PlusCircle className="mr-2" size={18} /> Add Reminder
                    </button>
                  </>
                ) : (
                  <>
                    {/* Task Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="taskName"
                        value={formik.values.taskName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 border rounded-md ${formik.touched.taskName && formik.errors.taskName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter task name"
                      />
                      {formik.touched.taskName && formik.errors.taskName && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.taskName}</div>
                      )}
                    </div>
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter task description"
                      />
                    </div>
                    {/* Priority and Due Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="priority"
                          value={formik.values.priority}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-3 py-2 border rounded-md ${formik.touched.priority && formik.errors.priority ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                        {formik.touched.priority && formik.errors.priority && (
                          <div className="text-red-500 text-sm mt-1">{formik.errors.priority}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Due Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          value={formik.values.dueDate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-3 py-2 border rounded-md ${formik.touched.dueDate && formik.errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formik.touched.dueDate && formik.errors.dueDate && (
                          <div className="text-red-500 text-sm mt-1">{formik.errors.dueDate}</div>
                        )}
                      </div>
                    </div>
                    {/* Assign Employees */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign Employees  <span className= "text-red-700">*</span>
                      </label>
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
                        {formik.values.assignedTo.map((emp) => (
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
                      {formik.values.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {formik.values.attachments.map((attachment, index) => (
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                      <textarea
                        name="remark"
                        value={formik.values.remark}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter remark"
                      />
                    </div>
                  </>
                )}
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
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>{editTask ? 'Update Task' : formik.values.taskType === 'Reminder' ? 'Save Reminder' : 'Create Task'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {toast.visible && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg animate-fade-in-out z-50 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
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