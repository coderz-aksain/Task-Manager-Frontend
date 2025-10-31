// import React, { useState, useEffect, useRef } from 'react';
// import { Trash2, Mail, X, Loader, Upload } from 'lucide-react';

// const AuctionTable = () => {
//   // Dummy data for tasks
//   const dummyTasks = [
//     { taskId: 'T001', eventId: 'E001', eventName: 'Laptop Procurement', auctionType: 'Reverse Auction', requestor: 'Anand Rawat', client: 'EKL', division: 'EKL', dateTime: '2025-11-01T10:00', category:'IT', status: 'Open', preBid: 500000, postBid: 450000, savings: 50000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T002', eventId: 'E002', eventName: 'Office Furniture Auction', auctionType: 'Forward Auction', requestor: 'Jane Smith', client: 'XYZ Ltd', division: 'Admin', dateTime: '2025-11-02T14:30',category:'IT', status: 'Closed', preBid: 200000, postBid: 180000, savings: 20000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T003', eventId: 'E003', eventName: 'Server Upgrade', auctionType: 'Reverse Auction', requestor: 'Alice Brown', client: 'Tech Solutions', division: 'IT', dateTime: '2025-11-03T09:00', category:'IT',status: 'In Progress', preBid: 1000000, postBid: 900000, savings: 100000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T004', eventId: 'E004', eventName: 'Stationery Supply', auctionType: 'Forward Auction', requestor: 'Bob Wilson', client: 'Global Inc', division: 'Procurement', dateTime: '2025-11-04T11:00',category:'IT', status: 'Open', preBid: 50000, postBid: 45000, savings: 5000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T005', eventId: 'E005', eventName: 'Cloud Services', auctionType: 'Reverse Auction', requestor: 'Emma Davis', client: 'Cloud Co', division: 'IT', dateTime: '2025-11-05T15:00',category:'IT', status: 'Closed', preBid: 750000, postBid: 700000, savings: 50000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T006', eventId: 'E006', eventName: 'Vehicle Lease', auctionType: 'Forward Auction', requestor: 'Michael Lee', client: 'Auto Corp', division: 'Logistics', dateTime: '2025-11-06T12:00',category:'IT', status: 'Open', preBid: 300000, postBid: 280000, savings: 20000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T007', eventId: 'E007', eventName: 'Software License', auctionType: 'Reverse Auction', requestor: 'Sarah Johnson', client: 'Tech Corp', division: 'IT', dateTime: '2025-11-07T10:30',category:'IT', status: 'In Progress', preBid: 400000, postBid: 360000, savings: 40000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T008', eventId: 'E008', eventName: 'Office Renovation', auctionType: 'Forward Auction', requestor: 'David Kim', client: 'Build Ltd', division: 'Admin', dateTime: '2025-11-08T13:00',category:'IT', status: 'Closed', preBid: 600000, postBid: 550000, savings: 50000, savingsPercent: 8.33, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T009', eventId: 'E009', eventName: 'Hardware Purchase', auctionType: 'Reverse Auction', requestor: 'Laura Martinez', client: 'Sys Co', division: 'IT', dateTime: '2025-11-09T11:30',category:'IT', status: 'Open', preBid: 250000, postBid: 230000, savings: 20000, savingsPercent: 8, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T010', eventId: 'E010', eventName: 'Consulting Services', auctionType: 'Forward Auction', requestor: 'Chris Taylor', client: 'Consult Inc', division: 'HR', dateTime: '2025-11-10T14:00',category:'IT', status: 'In Progress', preBid: 150000, postBid: 140000, savings: 10000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T007', eventId: 'E007', eventName: 'Software License', auctionType: 'Reverse Auction', requestor: 'Sarah Johnson', client: 'Tech Corp', division: 'IT', dateTime: '2025-11-07T10:30',category:'IT', status: 'In Progress', preBid: 400000, postBid: 360000, savings: 40000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T008', eventId: 'E008', eventName: 'Office Renovation', auctionType: 'Forward Auction', requestor: 'David Kim', client: 'Build Ltd', division: 'Admin', dateTime: '2025-11-08T13:00',category:'IT', status: 'Closed', preBid: 600000, postBid: 550000, savings: 50000, savingsPercent: 8.33, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T009', eventId: 'E009', eventName: 'Hardware Purchase', auctionType: 'Reverse Auction', requestor: 'Laura Martinez', client: 'Sys Co', division: 'IT', dateTime: '2025-11-09T11:30',category:'IT', status: 'Open', preBid: 250000, postBid: 230000, savings: 20000, savingsPercent: 8, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T010', eventId: 'E010', eventName: 'Consulting Services', auctionType: 'Forward Auction', requestor: 'Chris Taylor', client: 'Consult Inc', division: 'HR', dateTime: '2025-11-10T14:00', category:'IT',status: 'In Progress', preBid: 150000, postBid: 140000, savings: 10000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T007', eventId: 'E007', eventName: 'Software License', auctionType: 'Reverse Auction', requestor: 'Sarah Johnson', client: 'Tech Corp', division: 'IT', dateTime: '2025-11-07T10:30',category:'IT', status: 'In Progress', preBid: 400000, postBid: 360000, savings: 40000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T008', eventId: 'E008', eventName: 'Office Renovation', auctionType: 'Forward Auction', requestor: 'David Kim', client: 'Build Ltd', division: 'Admin', dateTime: '2025-11-08T13:00',category:'IT', status: 'Closed', preBid: 600000, postBid: 550000, savings: 50000, savingsPercent: 8.33, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T009', eventId: 'E009', eventName: 'Hardware Purchase', auctionType: 'Reverse Auction', requestor: 'Laura Martinez', client: 'Sys Co', division: 'IT', dateTime: '2025-11-09T11:30',category:'IT', status: 'Open', preBid: 250000, postBid: 230000, savings: 20000, savingsPercent: 8, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T010', eventId: 'E010', eventName: 'Consulting Services', auctionType: 'Forward Auction', requestor: 'Chris Taylor', client: 'Consult Inc', division: 'HR', dateTime: '2025-11-10T14:00',category:'IT', status: 'In Progress', preBid: 150000, postBid: 140000, savings: 10000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T007', eventId: 'E007', eventName: 'Software License', auctionType: 'Reverse Auction', requestor: 'Sarah Johnson', client: 'Tech Corp', division: 'IT', dateTime: '2025-11-07T10:30',category:'IT', status: 'In Progress', preBid: 400000, postBid: 360000, savings: 40000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T008', eventId: 'E008', eventName: 'Office Renovation', auctionType: 'Forward Auction', requestor: 'David Kim', client: 'Build Ltd', division: 'Admin', dateTime: '2025-11-08T13:00',category:'IT', status: 'Closed', preBid: 600000, postBid: 550000, savings: 50000, savingsPercent: 8.33, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T009', eventId: 'E009', eventName: 'Hardware Purchase', auctionType: 'Reverse Auction', requestor: 'Laura Martinez', client: 'Sys Co', division: 'IT', dateTime: '2025-11-09T11:30',category:'IT', status: 'Open', preBid: 250000, postBid: 230000, savings: 20000, savingsPercent: 8, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T010', eventId: 'E010', eventName: 'Consulting Services', auctionType: 'Forward Auction', requestor: 'Chris Taylor', client: 'Consult Inc', division: 'HR', dateTime: '2025-11-10T14:00',category:'IT', status: 'In Progress', preBid: 150000, postBid: 140000, savings: 10000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T007', eventId: 'E007', eventName: 'Software License', auctionType: 'Reverse Auction', requestor: 'Sarah Johnson', client: 'Tech Corp', division: 'IT', dateTime: '2025-11-07T10:30',category:'IT', status: 'In Progress', preBid: 400000, postBid: 360000, savings: 40000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T008', eventId: 'E008', eventName: 'Office Renovation', auctionType: 'Forward Auction', requestor: 'David Kim', client: 'Build Ltd', division: 'Admin', dateTime: '2025-11-08T13:00',category:'IT', status: 'Closed', preBid: 600000, postBid: 550000, savings: 50000, savingsPercent: 8.33, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T009', eventId: 'E009', eventName: 'Hardware Purchase', auctionType: 'Reverse Auction', requestor: 'Laura Martinez', client: 'Sys Co', division: 'IT', dateTime: '2025-11-09T11:30',category:'IT', status: 'Open', preBid: 250000, postBid: 230000, savings: 20000, savingsPercent: 8, assignedTo: [], fileUrls: [], remark: '' },
//     { taskId: 'T010', eventId: 'E010', eventName: 'Consulting Services', auctionType: 'Forward Auction', requestor: 'Chris Taylor', client: 'Consult Inc', division: 'HR', dateTime: '2025-11-10T14:00',category:'IT', status: 'In Progress', preBid: 150000, postBid: 140000, savings: 10000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
//   ];

//   // Dummy data for employees
//   const employees = [
//     { id: 1, name: 'John Doe', email: 'john.doe@example.com', position: 'Manager', avatar: '' },
//     { id: 2, name: 'Jane Roe', email: 'jane.roe@example.com', position: 'Developer', avatar: '' },
//     { id: 3, name: 'Alice Smith', email: 'alice.smith@example.com', position: 'Analyst', avatar: '' },
//   ];

//   const [tasks, setTasks] = useState(dummyTasks);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     taskId: '',
//     eventId: '',
//     eventName: '',
//     auctionType: '',
//     requestor: '',
//     client: '',
//     division: '',
//     dateTime: '',
//     category:'',
//     status: '',
//     preBid: '',
//     postBid: '',
//     savings: '',
//     savingsPercent: '',
//     assignedTo: [],
//     fileUrls: [],
//     remark: '',
//     errors: {},
//   });
//   const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
//   const [showModalEmployeeDropdown, setShowModalEmployeeDropdown] = useState(false);
//   const modalEmployeeDropdownRef = useRef(null);

//   // Initialize formData when modal opens
//   useEffect(() => {
//     if (modalVisible && selectedTask) {
//       setFormData({
//         taskId: selectedTask.taskId,
//         eventId: selectedTask.eventId,
//         eventName: selectedTask.eventName,
//         auctionType: selectedTask.auctionType,
//         requestor: selectedTask.requestor,
//         client: selectedTask.client,
//         division: selectedTask.division,
//         dateTime: selectedTask.dateTime,
//         category:selectedTask.category,
//         status: selectedTask.status,
//         preBid: selectedTask.preBid,
//         postBid: selectedTask.postBid,
//         savings: selectedTask.savings,
//         savingsPercent: selectedTask.savingsPercent,
//         assignedTo: selectedTask.assignedTo || [],
//         fileUrls: selectedTask.fileUrls || [],
//         remark: selectedTask.remark || '',
//         errors: {},
//       });
//       setEditId(selectedTask.taskId);
//     }
//   }, [modalVisible, selectedTask]);

//   // Handle row click to show modal
//   const handleRowClick = (task) => {
//     setSelectedTask(task);
//     setModalVisible(true);
//   };

//   // Handle delete action
//   const handleDelete = (taskId) => {
//     setTasks(tasks.filter((task) => task.taskId !== taskId));
//     if (selectedTask && selectedTask.taskId === taskId) {
//       setModalVisible(false);
//       setSelectedTask(null);
//       setEditId(null);
//     }
//   };

//   // Handle reminder email action
//   const handleReminderEmail = (task) => {
//     alert(`Sending reminder email for task: ${task.eventName}`);
//   };

//   // Close modal
//   const closeModal = () => {
//     setModalVisible(false);
//     setSelectedTask(null);
//     setEditId(null);
//     setFormData({
//       taskId: '',
//       eventId: '',
//       eventName: '',
//       auctionType: '',
//       requestor: '',
//       client: '',
//       division: '',
//       dateTime: '',
//       category:'',
//       status: '',
//       preBid: '',
//       postBid: '',
//       savings: '',
//       savingsPercent: '',
//       assignedTo: [],
//       fileUrls: [],
//       remark: '',
//       errors: {},
//     });
//     setEmployeeSearchTerm('');
//     setShowModalEmployeeDropdown(false);
//   };

//   // Format currency for INR
//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);
//   };

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const updatedFormData = { ...prev, [name]: value, errors: { ...prev.errors, [name]: '' } };
//       // Calculate savings and savingsPercent if preBid or postBid changes
//       if (name === 'preBid' || name === 'postBid') {
//         const preBid = name === 'preBid' ? parseFloat(value) || 0 : parseFloat(updatedFormData.preBid) || 0;
//         const postBid = name === 'postBid' ? parseFloat(value) || 0 : parseFloat(updatedFormData.postBid) || 0;
//         const savings = preBid - postBid;
//         const savingsPercent = preBid > 0 ? ((savings / preBid) * 100).toFixed(2) : 0;
//         updatedFormData.savings = savings >= 0 ? savings : 0;
//         updatedFormData.savingsPercent = savingsPercent >= 0 ? savingsPercent : 0;
//       }
//       return updatedFormData;
//     });
//   };

//   // Handle form submission
//   const handleSubmit = (e, taskId) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Basic validation
//     const errors = {};
//     if (!formData.eventId) errors.eventId = 'Event ID is required';
//     if (!formData.eventName) errors.eventName = 'Event Name is required';
//     if (!formData.auctionType) errors.auctionType = 'Auction Type is required';
//     if (!formData.requestor) errors.requestor = 'Requestor is required';
//     if (!formData.client) errors.client = 'Client is required';
//     if (!formData.division) errors.division = 'Division is required';
//     if (!formData.dateTime) errors.dateTime = 'Date & Time is required';
//     if (!formData.status) errors.status = 'Status is required';
//     if (!formData.preBid) errors.preBid = 'Pre Bid is required';
//     if (!formData.postBid) errors.postBid = 'Post Bid is required';
//     if (!formData.savingsPercent) errors.savingsPercent = 'Savings % is required';
//     if (formData.assignedTo.length === 0) errors.assignedTo = 'At least one employee must be assigned';

//     if (Object.keys(errors).length > 0) {
//       setFormData((prev) => ({ ...prev, errors }));
//       setIsLoading(false);
//       return;
//     }

//     // Update task
//     setTasks((prevTasks) =>
//       prevTasks.map((task) =>
//         task.taskId === taskId
//           ? { ...task, ...formData, taskId: task.taskId } // Preserve taskId
//           : task
//       )
//     );

//     setTimeout(() => {
//       setIsLoading(false);
//       closeModal();
//     }, 500); // Simulate async update
//   };

//   // Employee handling
//   const getInitials = (name) => {
//     return name
//       ? name
//           .split(' ')
//           .map((n) => n[0])
//           .join('')
//           .toUpperCase()
//       : 'UN';
//   };

//   const filteredEmployeesForFilter = employees.filter(
//     (employee) =>
//       employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
//       employee.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
//       employee.position.toLowerCase().includes(employeeSearchTerm.toLowerCase())
//   );

//   const handleEmployeeSelect = (employee) => {
//     setFormData((prev) => ({
//       ...prev,
//       assignedTo: [...prev.assignedTo, employee],
//       errors: { ...prev.errors, assignedTo: '' },
//     }));
//     setEmployeeSearchTerm('');
//     setShowModalEmployeeDropdown(false);
//   };

//   const handleEmployeeRemove = (email) => {
//     setFormData((prev) => ({
//       ...prev,
//       assignedTo: prev.assignedTo.filter((emp) => emp.email !== email),
//     }));
//   };

//   // File attachment handling
//   const handleAttachmentAdd = (e) => {
//     const files = Array.from(e.target.files).map((file) => file.name); // Store file names
//     setFormData((prev) => ({
//       ...prev,
//       fileUrls: [...prev.fileUrls, ...files],
//     }));
//   };

//   const handleAttachmentRemove = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       fileUrls: prev.fileUrls.filter((_, i) => i !== index),
//     }));
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalEmployeeDropdownRef.current && !modalEmployeeDropdownRef.current.contains(event.target)) {
//         setShowModalEmployeeDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 font-inter text-gray-800 p-4 sm:p-6">
//       <script src="https://cdn.tailwindcss.com"></script>
//       <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

//       {/* Table Container */}
//       <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="p-4 sm:p-6">
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Auction Tasks</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full text-xs sm:text-sm text-left text-gray-700">
//               <thead className="bg-gray-100 text-gray-600 uppercase">
//                 <tr>
//                   {['Task Id', 'Event Id', 'Event Name', 'Requestor', 'Client', 'Division', 'Date & Time', 'Category',  'Status', 'PreBid', 'Post Bid', 'Savings', 'Savings %', 'Actions'].map((header) => (
//                     <th key={header} className="px-2 sm:px-4 py-2 font-medium">{header}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {tasks.map((task) => (
//                   <tr
//                     key={task.taskId}
//                     className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
//                     onClick={() => handleRowClick(task)}
//                   >
//                     <td className="px-2 sm:px-4 py-2">{task.taskId}</td>
//                     <td className="px-2 sm:px-4 py-2">{task.eventId}</td>
//                     <td className="px-2 sm:px-4 py-2 truncate max-w-[100px] sm:max-w-[150px]">{task.eventName}</td>
//                     <td className="px-2 sm:px-4 py-2">{task.requestor}</td>
//                     <td className="px-2 sm:px-4 py-2 truncate max-w-[100px] sm:max-w-[150px]">{task.client}</td>
//                     <td className="px-2 sm:px-4 py-2">{task.division}</td>
//                     <td className="px-2 sm:px-4 py-2">{task.dateTime}</td>
//                     <td className="px-2 sm:px-4 py-2">{task.category}</td>
//                     <td className="px-2 sm:px-4 py-2">
//                       <span
//                         className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
//                           task.status === 'Open' ? 'bg-green-100 text-green-800' :
//                           task.status === 'Closed' ? 'bg-red-100 text-red-800' :
//                           'bg-yellow-100 text-yellow-800'
//                         }`}
//                       >
//                         {task.status}
//                       </span>
//                     </td>
//                     <td className="px-2 sm:px-4 py-2">{formatCurrency(task.preBid)}</td>
//                     <td className="px-2 sm:px-4 py-2">{formatCurrency(task.postBid)}</td>
//                     <td className="px-2 sm:px-4 py-2">{formatCurrency(task.savings)}</td>
//                     <td className="px-2 sm:px-4 py-2">{task.savingsPercent}%</td>
//                     <td className="px-2 sm:px-4 py-2">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDelete(task.taskId);
//                           }}
//                           className="text-red-500 hover:text-red-700 transition-colors"
//                           title="Delete Task"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleReminderEmail(task);
//                           }}
//                           className="text-blue-500 hover:text-blue-700 transition-colors"
//                           title="Send Reminder Email"
//                         >
//                           <Mail className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal for Task Details */}
//       {modalVisible && selectedTask && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative animate-slide-in"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={closeModal}
//               className="text-gray-500 hover:text-gray-700 absolute top-2 right-2 z-50"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             <form onSubmit={(e) => handleSubmit(e, selectedTask.taskId)} className="space-y-6">
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
//                 {editId ? 'Edit Task' : 'Task Details'}
//               </h3>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                 {/* Task ID */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Task ID</label>
//                   <input
//                     type="text"
//                     name="taskId"
//                     value={formData.taskId}
//                     readOnly
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                     disabled={isLoading}
//                   />
//                 </div>

//                 {/* Event ID */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Event ID *</label>
//                   <input
//                     type="text"
//                     name="eventId"
//                     value={formData.eventId}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     placeholder="Enter event ID"
//                     disabled={isLoading}
//                   />
//                   {formData.errors.eventId && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.eventId}</p>
//                   )}
//                 </div>

//                 {/* Event Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
//                   <input
//                     type="text"
//                     name="eventName"
//                     value={formData.eventName}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     placeholder="Enter event name"
//                     disabled={isLoading}
//                   />
//                   {formData.errors.eventName && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.eventName}</p>
//                   )}
//                 </div>

//                 {/* Auction Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Auction Type *</label>
//                   <select
//                     name="auctionType"
//                     value={formData.auctionType}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     disabled={isLoading}
//                   >
//                     <option value="">Select auction type</option>
//                     <option value="Forward Auction">Forward Auction</option>
//                     <option value="Reverse Auction">Reverse Auction</option>
//                   </select>
//                   {formData.errors.auctionType && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.auctionType}</p>
//                   )}
//                 </div>

//                 {/* Requestor */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Requestor *</label>
//                   <input
//                     type="text"
//                     name="requestor"
//                     value={formData.requestor}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     placeholder="Enter requestor"
//                     disabled={isLoading}
//                   />
//                   {formData.errors.requestor && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.requestor}</p>
//                   )}
//                 </div>

//                 {/* Client */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
//                   <input
//                     type="text"
//                     name="client"
//                     value={formData.client}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     placeholder="Enter client"
//                     disabled={isLoading}
//                   />
//                   {formData.errors.client && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.client}</p>
//                   )}
//                 </div>

//                 {/* Division */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Division *</label>
//                   <input
//                     type="text"
//                     name="division"
//                     value={formData.division}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     placeholder="Enter division"
//                     disabled={isLoading}
//                   />
//                   {formData.errors.division && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.division}</p>
//                   )}
//                 </div>

//                 {/* Date & Time */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
//                   <input
//                     type="datetime-local"
//                     name="dateTime"
//                     value={formData.dateTime}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     disabled={isLoading}
//                   />
//                   {formData.errors.dateTime && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.dateTime}</p>
//                   )}
//                 </div>

//                 {/* Status */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     disabled={isLoading}
//                   >
//                     <option value="Open">Open</option>
//                     <option value="In Progress">In Progress</option>
//                     <option value="Hold">Hold</option>
//                     <option value="Complete">Complete</option>
//                     <option value="Archive">Archive</option>
//                   </select>
//                   {formData.errors.status && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.status}</p>
//                   )}
//                 </div>

//                 {/* Pre Bid */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Pre Bid *</label>
//                   <input
//                     type="number"
//                     name="preBid"
//                     value={formData.preBid}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     placeholder="Enter pre-bid amount"
//                     disabled={isLoading}
//                   />
//                   {formData.errors.preBid && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.preBid}</p>
//                   )}
//                 </div>

//                 {/* Post Bid */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Post Bid *</label>
//                   <input
//                     type="number"
//                     name="postBid"
//                     value={formData.postBid}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     placeholder="Enter post-bid amount"
//                     disabled={isLoading}
//                   />
//                   {formData.errors.postBid && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.postBid}</p>
//                   )}
//                 </div>

//                 {/* Savings */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Savings</label>
//                   <input
//                     type="number"
//                     name="savings"
//                     value={formData.savings}
//                     readOnly
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                     disabled={isLoading}
//                   />
//                 </div>

//                 {/* Savings Percent */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Savings % *</label>
//                   <input
//                     type="number"
//                     name="savingsPercent"
//                     value={formData.savingsPercent}
//                     readOnly
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
//                     disabled={isLoading}
//                   />
//                   {formData.errors.savingsPercent && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.savingsPercent}</p>
//                   )}
//                 </div>

//                 {/* Assign Employees */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Assign Employees *</label>
//                   <input
//                     type="text"
//                     value={employeeSearchTerm}
//                     onChange={(e) => setEmployeeSearchTerm(e.target.value)}
//                     onFocus={() => setShowModalEmployeeDropdown(true)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     placeholder="Search employee by name or department"
//                     disabled={isLoading}
//                   />
//                   {showModalEmployeeDropdown && (
//                     <div
//                       ref={modalEmployeeDropdownRef}
//                       className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
//                     >
//                       {filteredEmployeesForFilter.map((employee) => (
//                         <button
//                           key={employee.id}
//                           type="button"
//                           onClick={() => handleEmployeeSelect(employee)}
//                           className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
//                           disabled={isLoading}
//                         >
//                           {employee.avatar ? (
//                             <img src={employee.avatar} alt={employee.name} className="w-8 h-8 rounded-full" />
//                           ) : (
//                             <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
//                               {getInitials(employee.name)}
//                             </span>
//                           )}
//                           <div>
//                             <p className="font-medium">{employee.name}</p>
//                             <p className="text-sm text-gray-500">{employee.email}</p>
//                             <p className="text-sm text-gray-500">{employee.position}</p>
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {formData.assignedTo.map((emp) => (
//                       <div key={emp.email} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
//                         {emp.avatar ? (
//                           <img src={emp.avatar} alt={emp.name} className="w-5 h-5 rounded-full mr-2" />
//                         ) : (
//                           <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs text-blue-700 mr-2">
//                             {getInitials(emp.name)}
//                           </span>
//                         )}
//                         <span className="text-sm">{emp.name}</span>
//                         <button
//                           type="button"
//                           onClick={() => handleEmployeeRemove(emp.email)}
//                           className="ml-2 text-blue-500 hover:text-blue-700"
//                           disabled={isLoading}
//                         >
//                           <X className="w-3 h-3" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                   {formData.errors.assignedTo && (
//                     <p className="text-red-500 text-xs mt-1">{formData.errors.assignedTo}</p>
//                   )}
//                 </div>

//                 {/* File Attachments */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
//                   <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//                     <label className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-200 text-sm inline-flex items-center space-x-2">
//                       <Upload className="w-4 h-4" />
//                       <span>Choose Files</span>
//                       <input
//                         type="file"
//                         multiple
//                         onChange={handleAttachmentAdd}
//                         className="hidden"
//                         disabled={isLoading}
//                       />
//                     </label>
//                   </div>
//                   {formData.fileUrls.length > 0 && (
//                     <div className="mt-2 space-y-2">
//                       {formData.fileUrls.map((attachment, index) => (
//                         <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
//                           <div className="flex items-center space-x-2">
//                             <Upload className="w-4 h-4 text-gray-500" />
//                             <span className="text-sm truncate">{attachment}</span>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => handleAttachmentRemove(index)}
//                             className="text-red-500 hover:text-red-700"
//                             disabled={isLoading}
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Remark */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
//                   <input
//                     type="text"
//                     name="remark"
//                     value={formData.remark}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     placeholder="Enter remark"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               {/* Loading Indicator */}
//               {isLoading && (
//                 <div className="flex justify-center">
//                   <Loader className="w-6 h-6 text-blue-600 animate-spin" />
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex justify-end space-x-4">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm"
//                   disabled={isLoading}
//                 >
//                   {isLoading && <Loader className="w-4 h-4 animate-spin" />}
//                   <span>{editId ? 'Update Task' : 'Save Task'}</span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes slide-in {
//           0% {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AuctionTable;



import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Mail, X, Loader, Upload } from 'lucide-react';

const AuctionTable = () => {
  // Dummy data for tasks
  const dummyTasks = [
    { taskId: 'T001', eventId: 'E001', eventName: 'Laptop Procurement', auctionType: 'Reverse Auction', requestor: 'Anand Rawat', client: 'EKL', division: 'EKL', dateTime: '2025-11-01T10:00', category:'IT', status: 'Open', preBid: 500000, postBid: 450000, savings: 50000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T002', eventId: 'E002', eventName: 'Office Furniture Auction', auctionType: 'Forward Auction', requestor: 'Jane Smith', client: 'XYZ Ltd', division: 'Admin', dateTime: '2025-11-02T14:30',category:'IT', status: 'Closed', preBid: 200000, postBid: 180000, savings: 20000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T003', eventId: 'E003', eventName: 'Server Upgrade', auctionType: 'Reverse Auction', requestor: 'Alice Brown', client: 'Tech Solutions', division: 'IT', dateTime: '2025-11-03T09:00', category:'IT',status: 'In Progress', preBid: 1000000, postBid: 900000, savings: 100000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T004', eventId: 'E004', eventName: 'Stationery Supply', auctionType: 'Forward Auction', requestor: 'Bob Wilson', client: 'Global Inc', division: 'Procurement', dateTime: '2025-11-04T11:00',category:'IT', status: 'Open', preBid: 50000, postBid: 45000, savings: 5000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T005', eventId: 'E005', eventName: 'Cloud Services', auctionType: 'Reverse Auction', requestor: 'Emma Davis', client: 'Cloud Co', division: 'IT', dateTime: '2025-11-05T15:00',category:'IT', status: 'Closed', preBid: 750000, postBid: 700000, savings: 50000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T006', eventId: 'E006', eventName: 'Vehicle Lease', auctionType: 'Forward Auction', requestor: 'Michael Lee', client: 'Auto Corp', division: 'Logistics', dateTime: '2025-11-06T12:00',category:'IT', status: 'Open', preBid: 300000, postBid: 280000, savings: 20000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T007', eventId: 'E007', eventName: 'Software License', auctionType: 'Reverse Auction', requestor: 'Sarah Johnson', client: 'Tech Corp', division: 'IT', dateTime: '2025-11-07T10:30',category:'IT', status: 'In Progress', preBid: 400000, postBid: 360000, savings: 40000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T008', eventId: 'E008', eventName: 'Office Renovation', auctionType: 'Forward Auction', requestor: 'David Kim', client: 'Build Ltd', division: 'Admin', dateTime: '2025-11-08T13:00',category:'IT', status: 'Closed', preBid: 600000, postBid: 550000, savings: 50000, savingsPercent: 8.33, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T009', eventId: 'E009', eventName: 'Hardware Purchase', auctionType: 'Reverse Auction', requestor: 'Laura Martinez', client: 'Sys Co', division: 'IT', dateTime: '2025-11-09T11:30',category:'IT', status: 'Open', preBid: 250000, postBid: 230000, savings: 20000, savingsPercent: 8, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T010', eventId: 'E010', eventName: 'Consulting Services', auctionType: 'Forward Auction', requestor: 'Chris Taylor', client: 'Consult Inc', division: 'HR', dateTime: '2025-11-10T14:00',category:'IT', status: 'In Progress', preBid: 150000, postBid: 140000, savings: 10000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T007', eventId: 'E007', eventName: 'Software License', auctionType: 'Reverse Auction', requestor: 'Sarah Johnson', client: 'Tech Corp', division: 'IT', dateTime: '2025-11-07T10:30',category:'IT', status: 'In Progress', preBid: 400000, postBid: 360000, savings: 40000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T008', eventId: 'E008', eventName: 'Office Renovation', auctionType: 'Forward Auction', requestor: 'David Kim', client: 'Build Ltd', division: 'Admin', dateTime: '2025-11-08T13:00',category:'IT', status: 'Closed', preBid: 600000, postBid: 550000, savings: 50000, savingsPercent: 8.33, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T009', eventId: 'E009', eventName: 'Hardware Purchase', auctionType: 'Reverse Auction', requestor: 'Laura Martinez', client: 'Sys Co', division: 'IT', dateTime: '2025-11-09T11:30',category:'IT', status: 'Open', preBid: 250000, postBid: 230000, savings: 20000, savingsPercent: 8, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T010', eventId: 'E010', eventName: 'Consulting Services', auctionType: 'Forward Auction', requestor: 'Chris Taylor', client: 'Consult Inc', division: 'HR', dateTime: '2025-11-10T14:00', category:'IT',status: 'In Progress', preBid: 150000, postBid: 140000, savings: 10000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T007', eventId: 'E007', eventName: 'Software License', auctionType: 'Reverse Auction', requestor: 'Sarah Johnson', client: 'Tech Corp', division: 'IT', dateTime: '2025-11-07T10:30',category:'IT', status: 'In Progress', preBid: 400000, postBid: 360000, savings: 40000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T008', eventId: 'E008', eventName: 'Office Renovation', auctionType: 'Forward Auction', requestor: 'David Kim', client: 'Build Ltd', division: 'Admin', dateTime: '2025-11-08T13:00',category:'IT', status: 'Closed', preBid: 600000, postBid: 550000, savings: 50000, savingsPercent: 8.33, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T009', eventId: 'E009', eventName: 'Hardware Purchase', auctionType: 'Reverse Auction', requestor: 'Laura Martinez', client: 'Sys Co', division: 'IT', dateTime: '2025-11-09T11:30',category:'IT', status: 'Open', preBid: 250000, postBid: 230000, savings: 20000, savingsPercent: 8, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T010', eventId: 'E010', eventName: 'Consulting Services', auctionType: 'Forward Auction', requestor: 'Chris Taylor', client: 'Consult Inc', division: 'HR', dateTime: '2025-11-10T14:00',category:'IT', status: 'In Progress', preBid: 150000, postBid: 140000, savings: 10000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T007', eventId: 'E007', eventName: 'Software License', auctionType: 'Reverse Auction', requestor: 'Sarah Johnson', client: 'Tech Corp', division: 'IT', dateTime: '2025-11-07T10:30',category:'IT', status: 'In Progress', preBid: 400000, postBid: 360000, savings: 40000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T008', eventId: 'E008', eventName: 'Office Renovation', auctionType: 'Forward Auction', requestor: 'David Kim', client: 'Build Ltd', division: 'Admin', dateTime: '2025-11-08T13:00',category:'IT', status: 'Closed', preBid: 600000, postBid: 550000, savings: 50000, savingsPercent: 8.33, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T009', eventId: 'E009', eventName: 'Hardware Purchase', auctionType: 'Reverse Auction', requestor: 'Laura Martinez', client: 'Sys Co', division: 'IT', dateTime: '2025-11-09T11:30',category:'IT', status: 'Open', preBid: 250000, postBid: 230000, savings: 20000, savingsPercent: 8, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T010', eventId: 'E010', eventName: 'Consulting Services', auctionType: 'Forward Auction', requestor: 'Chris Taylor', client: 'Consult Inc', division: 'HR', dateTime: '2025-11-10T14:00',category:'IT', status: 'In Progress', preBid: 150000, postBid: 140000, savings: 10000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T007', eventId: 'E007', eventName: 'Software License', auctionType: 'Reverse Auction', requestor: 'Sarah Johnson', client: 'Tech Corp', division: 'IT', dateTime: '2025-11-07T10:30',category:'IT', status: 'In Progress', preBid: 400000, postBid: 360000, savings: 40000, savingsPercent: 10, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T008', eventId: 'E008', eventName: 'Office Renovation', auctionType: 'Forward Auction', requestor: 'David Kim', client: 'Build Ltd', division: 'Admin', dateTime: '2025-11-08T13:00',category:'IT', status: 'Closed', preBid: 600000, postBid: 550000, savings: 50000, savingsPercent: 8.33, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T009', eventId: 'E009', eventName: 'Hardware Purchase', auctionType: 'Reverse Auction', requestor: 'Laura Martinez', client: 'Sys Co', division: 'IT', dateTime: '2025-11-09T11:30',category:'IT', status: 'Open', preBid: 250000, postBid: 230000, savings: 20000, savingsPercent: 8, assignedTo: [], fileUrls: [], remark: '' },
    { taskId: 'T010', eventId: 'E010', eventName: 'Consulting Services', auctionType: 'Forward Auction', requestor: 'Chris Taylor', client: 'Consult Inc', division: 'HR', dateTime: '2025-11-10T14:00',category:'IT', status: 'In Progress', preBid: 150000, postBid: 140000, savings: 10000, savingsPercent: 6.67, assignedTo: [], fileUrls: [], remark: '' },
  ].map(task => ({
    ...task,
    participants: task.participants ?? 0,
    l1Vendor: task.l1Vendor ?? ''
  }));

  // Dummy employees
  const employees = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', position: 'Manager', avatar: '' },
    { id: 2, name: 'Jane Roe', email: 'jane.roe@example.com', position: 'Developer', avatar: '' },
    { id: 3, name: 'Alice Smith', email: 'alice.smith@example.com', position: 'Analyst', avatar: '' },
  ];

  const [tasks, setTasks] = useState(dummyTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    taskId: '',
    eventId: '',
    eventName: '',
    auctionType: '',
    requestor: '',
    client: '',
    division: '',
    dateTime: '',
    category: '',
    status: '',
    preBid: '',
    postBid: '',
    savings: '',
    savingsPercent: '',
    participants: '',
    l1Vendor: '',
    assignedTo: [],
    fileUrls: [],
    remark: '',
    errors: {},
  });
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [showModalEmployeeDropdown, setShowModalEmployeeDropdown] = useState(false);
  const modalEmployeeDropdownRef = useRef(null);

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
        postBid: selectedTask.postBid || '',
        savings: selectedTask.savings || '',
        savingsPercent: selectedTask.savingsPercent || '',
        participants: selectedTask.participants || '',
        l1Vendor: selectedTask.l1Vendor || '',
        assignedTo: selectedTask.assignedTo || [],
        fileUrls: selectedTask.fileUrls || [],
        remark: selectedTask.remark || '',
        errors: {},
      });
      setEditId(selectedTask.taskId);
    }
  }, [modalVisible, selectedTask]);

  // Handle row click
  const handleRowClick = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  // Delete task
  const handleDelete = (taskId) => {
    setTasks(tasks.filter((task) => task.taskId !== taskId));
    if (selectedTask?.taskId === taskId) {
      closeModal();
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
      taskId: '', eventId: '', eventName: '', auctionType: '', requestor: '', client: '', division: '',
      dateTime: '', category: '', status: '', preBid: '', postBid: '', savings: '', savingsPercent: '',
      participants: '', l1Vendor: '', assignedTo: [], fileUrls: [], remark: '', errors: {}
    });
    setEmployeeSearchTerm('');
    setShowModalEmployeeDropdown(false);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);
  };

  // Handle input change with auto-calculation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value, errors: { ...prev.errors, [name]: '' } };

      // Auto-calculate savings when preBid or postBid changes
      if (name === 'preBid' || name === 'postBid') {
        const preBid = name === 'preBid' ? parseFloat(value) || 0 : parseFloat(updated.preBid) || 0;
        const postBid = name === 'postBid' ? parseFloat(value) || 0 : parseFloat(updated.postBid) || 0;
        const savings = preBid - postBid;
        const savingsPercent = preBid > 0 ? ((savings / preBid) * 100).toFixed(2) : 0;

        updated.savings = savings >= 0 ? savings : 0;
        updated.savingsPercent = savingsPercent >= 0 ? savingsPercent : 0;
      }

      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = {};
    if (!formData.eventId) errors.eventId = 'Required';
    if (!formData.eventName) errors.eventName = 'Required';
    if (!formData.auctionType) errors.auctionType = 'Required';
    if (!formData.requestor) errors.requestor = 'Required';
    if (!formData.client) errors.client = 'Required';
    if (!formData.division) errors.division = 'Required';
    if (!formData.dateTime) errors.dateTime = 'Required';
    if (!formData.status) errors.status = 'Required';
    if (!formData.preBid) errors.preBid = 'Required';
    if (formData.status === 'Complete') {
      if (!formData.postBid) errors.postBid = 'Required when Complete';
      if (!formData.participants) errors.participants = 'Required when Complete';
      if (!formData.l1Vendor) errors.l1Vendor = 'Required when Complete';
    }
    if (formData.assignedTo.length === 0) errors.assignedTo = 'Assign at least one employee';

    if (Object.keys(errors).length > 0) {
      setFormData(prev => ({ ...prev, errors }));
      setIsLoading(false);
      return;
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.taskId === editId
          ? { ...task, ...formData, taskId: task.taskId }
          : task
      )
    );

    setTimeout(() => {
      setIsLoading(false);
      closeModal();
    }, 500);
  };

  // Employee handling
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'UN';

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  const handleEmployeeSelect = (emp) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: [...prev.assignedTo, emp],
      errors: { ...prev.errors, assignedTo: '' }
    }));
    setEmployeeSearchTerm('');
    setShowModalEmployeeDropdown(false);
  };

  const handleEmployeeRemove = (email) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.filter(e => e.email !== email)
    }));
  };

  // File handling
  const handleAttachmentAdd = (e) => {
    const files = Array.from(e.target.files).map(f => f.name);
    setFormData(prev => ({ ...prev, fileUrls: [...prev.fileUrls, ...files] }));
  };

  const handleAttachmentRemove = (idx) => {
    setFormData(prev => ({ ...prev, fileUrls: prev.fileUrls.filter((_, i) => i !== idx) }));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalEmployeeDropdownRef.current && !modalEmployeeDropdownRef.current.contains(e.target)) {
        setShowModalEmployeeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isForwardAuction = formData.auctionType === 'Forward Auction';
  const isComplete = formData.status === 'Complete';

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800 p-4 sm:p-6">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Table */}
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Auction Tasks</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  {['Task Id', 'Event Id', 'Event Name', 'Requestor', 'Client', 'Division', 'Date & Time', 'Category', 'Status', 
                    isForwardAuction ? 'Benchmark' : 'PreBid', 'Post Bid', 'Savings', 'Savings %', 'Actions'].map((h, i) => (
                    <th key={i} className="px-2 sm:px-4 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.taskId}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(task)}
                  >
                    <td className="px-2 sm:px-4 py-2">{task.taskId}</td>
                    <td className="px-2 sm:px-4 py-2">{task.eventId}</td>
                    <td className="px-2 sm:px-4 py-2 truncate max-w-[120px]">{task.eventName}</td>
                    <td className="px-2 sm:px-4 py-2">{task.requestor}</td>
                    <td className="px-2 sm:px-4 py-2">{task.client}</td>
                    <td className="px-2 sm:px-4 py-2">{task.division}</td>
                    <td className="px-2 sm:px-4 py-2">{new Date(task.dateTime).toLocaleString()}</td>
                    <td className="px-2 sm:px-4 py-2">{task.category}</td>
                    <td className="px-2 sm:px-4 py-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Open' ? 'bg-green-100 text-green-800' :
                        task.status === 'Complete' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'Closed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2">{formatCurrency(task.preBid)}</td>
                    <td className="px-2 sm:px-4 py-2">{formatCurrency(task.postBid)}</td>
                    <td className="px-2 sm:px-4 py-2">{formatCurrency(task.savings)}</td>
                    <td className="px-2 sm:px-4 py-2">{task.savingsPercent}%</td>
                    <td className="px-2 sm:px-4 py-2">
                      <div className="flex space-x-2">
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(task.taskId); }} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleReminderEmail(task); }} className="text-blue-500 hover:text-blue-700">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalVisible && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative animate-slide-in" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 absolute top-2 right-2 z-50">
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                {editId ? 'Edit Task' : 'Task Details'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Task ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task ID</label>
                  <input type="text" value={formData.taskId} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm" />
                </div>

                {/* Event ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event ID *</label>
                  <input type="text" name="eventId" value={formData.eventId} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" />
                  {formData.errors.eventId && <p className="text-red-500 text-xs mt-1">{formData.errors.eventId}</p>}
                </div>

                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                  <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" />
                  {formData.errors.eventName && <p className="text-red-500 text-xs mt-1">{formData.errors.eventName}</p>}
                </div>

                {/* Auction Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auction Type *</label>
                  <select name="auctionType" value={formData.auctionType} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">Select</option>
                    <option value="Forward Auction">Forward Auction</option>
                    <option value="Reverse Auction">Reverse Auction</option>
                  </select>
                </div>

                {/* Requestor, Client, Division, DateTime, Category, Status */}
                {['requestor', 'client', 'division'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field} *</label>
                    <input type="text" name={field} value={formData[field]} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" />
                    {formData.errors[field] && <p className="text-red-500 text-xs mt-1">{formData.errors[field]}</p>}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
                  <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">Select</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Pre Bid / Benchmark */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isForwardAuction ? 'Benchmark *' : 'Pre Bid *'}
                  </label>
                  <input type="number" name="preBid" value={formData.preBid} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" />
                  {formData.errors.preBid && <p className="text-red-500 text-xs mt-1">{formData.errors.preBid}</p>}
                </div>

                {/* Conditional Fields when Complete */}
                {isComplete && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Post Bid *</label>
                      <input type="number" name="postBid" value={formData.postBid} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" />
                      {formData.errors.postBid && <p className="text-red-500 text-xs mt-1">{formData.errors.postBid}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Savings</label>
                      <input type="number" value={formData.savings} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Savings %</label>
                      <input type="text" value={`${formData.savingsPercent}%`} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Participants *</label>
                      <input type="number" name="participants" value={formData.participants} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" />
                      {formData.errors.participants && <p className="text-red-500 text-xs mt-1">{formData.errors.participants}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name of L1 Vendor *</label>
                      <input type="text" name="l1Vendor" value={formData.l1Vendor} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" />
                      {formData.errors.l1Vendor && <p className="text-red-500 text-xs mt-1">{formData.errors.l1Vendor}</p>}
                    </div>
                  </>
                )}

                {/* Assign Employees */}
                <div className="relative col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Employees *</label>
                  <input
                    type="text"
                    value={employeeSearchTerm}
                    onChange={e => setEmployeeSearchTerm(e.target.value)}
                    onFocus={() => setShowModalEmployeeDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Search by name, email, or position"
                  />
                  {showModalEmployeeDropdown && (
                    <div ref={modalEmployeeDropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredEmployees.map(emp => (
                        <button key={emp.id} type="button" onClick={() => handleEmployeeSelect(emp)} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3">
                          <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">{getInitials(emp.name)}</span>
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.email} • {emp.position}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.assignedTo.map(emp => (
                      <div key={emp.email} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs mr-1">{getInitials(emp.name)}</span>
                        {emp.name}
                        <button type="button" onClick={() => handleEmployeeRemove(emp.email)} className="ml-2"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                  {formData.errors.assignedTo && <p className="text-red-500 text-xs mt-1">{formData.errors.assignedTo}</p>}
                </div>

                {/* File Attachments */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                  <label className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-200 text-sm inline-flex items-center space-x-2">
                    <Upload className="w-4 h-4" /><span>Choose Files</span>
                    <input type="file" multiple onChange={handleAttachmentAdd} className="hidden" />
                  </label>
                  {formData.fileUrls.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.fileUrls.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                          <span className="flex items-center"><Upload className="w-4 h-4 mr-2 text-gray-500" />{file}</span>
                          <button type="button" onClick={() => handleAttachmentRemove(i)} className="text-red-500"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remark */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                  <input type="text" name="remark" value={formData.remark} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={closeModal} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm" disabled={isLoading}>
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm" disabled={isLoading}>
                  {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                  <span>Update Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default AuctionTable;