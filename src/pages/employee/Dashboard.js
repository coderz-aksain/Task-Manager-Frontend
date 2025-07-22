  // import React, { useState, useEffect } from 'react';
  // import Sidebar from '../../components/common/Sidebar';
  // import Header from '../../components/common/Header';
  // import { FaTasks, FaClock, FaCheckCircle, FaPlus, FaUserCheck, FaTimes, FaComments, FaUserPlus, FaPaperPlane } from 'react-icons/fa';

  // // Status chip function for colored chips
  // const getStatusChip = (status) => {
  //   switch (status) {
  //     case 'Completed':
  //       return (
  //         <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold inline-block">
  //           Completed
  //         </span>
  //       );
  //     case 'Active':
  //       return (
  //         <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold inline-block">
  //           Active
  //         </span>
  //       );
  //     case 'Rejected':
  //       return (
  //         <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-semibold inline-block">
  //           Rejected  
  //         </span>
  //       );
  //     default:
  //       return (
  //         <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-semibold inline-block">
  //           {status}
  //         </span>
  //       );
  //   }
  // };

  // const employees = ['John Doe', 'Mike Ross', 'Sarah Lee'];
  // const companyMembers = [
  //   { name: 'John Doe', email: 'john.doe@email.com' },
  //   { name: 'Mike Ross', email: 'mike.ross@email.com' },
  //   { name: 'Sarah Lee', email: 'sarah.lee@email.com' },
  // ];
  // const taskTypes = ['Reverse Auction', 'Forward Auction', 'RFx', 'General Task'];
  // const statuses = [ 'Not Started Yet','Scheduled', 'Completed', 'Hold', ];
  // const priorities = ['Low', 'Medium', 'High'];

  // // Example data for clients, divisions, users, and emails
  // const clientData = [
  //   {
  //     name: 'Client A',
  //     divisions: [
  //       {
  //         name: 'Division A1',
  //         users: [
  //           { name: 'John Doe', email: 'john.doe@email.com' },
  //           { name: 'Mike Ross', email: 'mike.ross@email.com' },
  //         ],
  //       },
  //       {
  //         name: 'Division A2',
  //         users: [
  //           { name: 'Sarah Lee', email: 'sarah.lee@email.com' },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     name: 'Client B',
  //     divisions: [
  //       {
  //         name: 'Division B1',
  //         users: [
  //           { name: 'Mike Ross', email: 'mike.ross@email.com' },
  //         ],
  //       },
  //     ],
  //   },
  // ];

  // const tasks = [
  //   { id: 1, title: 'Complete Project Proposal', client: 'Client A', user: 'John Doe', assignedDate: '2025-06-20', dueDate: '2025-06-25', status: 'Active' },
  //   { id: 2, title: 'Review Contract', client: 'Client B', user: 'Mike Ross', assignedDate: '2025-06-21', dueDate: '2025-06-26', status: 'Completed' },
  //   { id: 3, title: 'Update Dashboard Metrics', client: 'Client C', user: 'Mike Ross', assignedDate: '2025-06-23', dueDate: '2025-06-30', status: 'Active' },
  //   { id: 5, title: 'Client Feedback', client: 'Client E', user: 'John Doe', assignedDate: '2025-06-25', dueDate: '2025-07-01', status: 'Active' },
  //   { id: 6, title: 'Finalize Budget', client: 'Client F', user: 'Mike Ross', assignedDate: '2025-06-26', dueDate: '2025-07-03', status: 'Completed' },
  //   { id: 7, title: 'Finalize Budget', client: 'Client F', user: 'Mike Ross', assignedDate: '2025-06-26', dueDate: '2025-07-03', status: 'Completed' },
  //   { id: 8, title: 'Finalize Budget', client: 'Client F', user: 'Mike Ross', assignedDate: '2025-06-26', dueDate: '2025-07-03', status: 'Completed' },
  //   { id: 9, title: 'Finalize Budget', client: 'Client F', user: 'Mike Ross', assignedDate: '2025-06-26', dueDate: '2025-07-03', status: 'Completed' },
  //   { id: 10, title: 'Finalize Budget', client: 'Client F', user: 'Mike Ross', assignedDate: '2025-06-26', dueDate: '2025-07-03', status: 'Completed' },
  // ];

  // const initialChats = [
  //   {
  //     id: 1,
  //     name: 'Nitin Bansal',
  //     participants: ['John Doe', 'Mike Ross'],
  //     messages: [
  //       { sender: 'Mike Ross', text: 'Hey John, did you check the proposal?', time: '09:15 AM' },
  //       { sender: 'John Doe', text: 'Yes, I will update it today.', time: '09:17 AM' },
  //     ],
  //     lastMessage: 'Yes, I will update it today.',
  //     lastTime: '09:25 AM',
  //   },
  //   {
  //     id: 2,
  //     name: 'Simranjeet Singh',
  //     participants: ['John Doe', 'Sarah Lee'],
  //     messages: [
  //       { sender: 'Sarah Lee', text: 'Can you share the dashboard metrics?', time: '10:05 AM' },
  //       { sender: 'John Doe', text: 'Sure, sending now.', time: '10:06 AM' },
  //     ],
  //     lastMessage: 'Sure, sending now.',
  //     lastTime: '10:06 AM',
  //   },
  //   {
  //     id: 3,
  //     name: 'Khusboo ',
  //     participants: ['John Doe', 'Sarah Lee'],
  //     messages: [
  //       { sender: 'Sarah Lee', text: 'Can you share the dashboard metrics?', time: '10:05 AM' },
  //       { sender: 'John Doe', text: 'Sure, sending now.', time: '10:06 AM' },
  //     ],
  //     lastMessage: 'Sure, sending now.',
  //     lastTime: '10:06 AM',
  //   },
  //   {
  //     id: 5,
  //     name: 'Ashutosh Arora',
  //     participants: ['John Doe', 'Sarah Lee'],
  //     messages: [
  //       { sender: 'Sarah Lee', text: 'Can you share the dashboard metrics?', time: '10:05 AM' },
  //       { sender: 'John Doe', text: 'Sure, sending now.', time: '10:06 AM' },
  //     ],
  //     lastMessage: 'Sure, sending now.',
  //     lastTime: '10:06 AM',
  //   },
  //   {
  //     id: 6,
  //     name: 'Ankit pundir',
  //     participants: ['John Doe', 'Sarah Lee'],
  //     messages: [
  //       { sender: 'Sarah Lee', text: 'Can you share the dashboard metrics?', time: '10:05 AM' },
  //       { sender: 'John Doe', text: 'Sure, sending now.', time: '10:06 AM' },
  //     ],
  //     lastMessage: 'Sure, sending now.',
  //     lastTime: '10:06 AM',
  //   },
  //   {
  //     id: 7,
  //     name: 'Vidhi Tyagi',
  //     participants: ['John Doe', 'Sarah Lee'],
  //     messages: [
  //       { sender: 'Sarah Lee', text: 'Can you share the dashboard metrics?', time: '10:05 AM' },
  //       { sender: 'John Doe', text: 'Sure, sending now.', time: '10:06 AM' },
  //     ],
  //     lastMessage: 'Sure, sending now.',
  //     lastTime: '10:06 AM',
  //   },
  // ];

  // const Dashboard = () => {
  //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //   const [filter, setFilter] = useState('All');
  //   const [isCheckedIn, setIsCheckedIn] = useState(false);
  //   const [currentTime, setCurrentTime] = useState(new Date());
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [modalStep, setModalStep] = useState(0);
  //   const [formData, setFormData] = useState({
  //     taskType: '',
  //     taskName: '',
  //     assignedTo: '',
  //     assignedDateTime: '',
  //     dueDate: '',
  //     scheduledDateTime: '',
  //     closureDate: '',
  //     status: '',
  //     priority: '',
  //     clientName: '',
  //     division: '',
  //     userName: '',
  //     userEmail: '',
  //     remarks: '',
  //     eventId: '',
  //     preBidL1: '',
  //     postBidL1: '',
  //     savings: '',
  //     savingPercent: '',
  //     numberOfResponses: '',
  //     taskOutput: '',
  //     errors: {}
  //   });

  //   // For dynamic dropdowns
  //   const [selectedClient, setSelectedClient] = useState('');
  //   const [selectedDivision, setSelectedDivision] = useState('');
  //   const [selectedUser, setSelectedUser] = useState('');
  //   const [autoEmail, setAutoEmail] = useState('');

  //   // Chat state
  //   const [chats, setChats] = useState(initialChats);
  //   const [activeChat, setActiveChat] = useState(null);
  //   const [chatInput, setChatInput] = useState('');
  //   const [showAddParticipant, setShowAddParticipant] = useState(false);
  //   const [newParticipant, setNewParticipant] = useState('');
  //   const [chatSearch, setChatSearch] = useState('');

  //   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  //   useEffect(() => {
  //     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
  //     return () => clearInterval(timer);
  //   }, []);

  //   useEffect(() => {
  //     if (!isModalOpen) setModalStep(0);
  //   }, [isModalOpen]);

  //   const handleCheckInOut = () => {
  //     if (isCheckedIn) {
  //       alert('Checked out successfully!');
  //     } else {
  //       alert('Checked in successfully!');
  //     }
  //     setIsCheckedIn(!isCheckedIn);
  //   };

  //   // Filter logic for status (no Pending filter)
  //   const filteredTasks = tasks.filter(task => {
  //     if (filter === 'All') return true;
  //     if (filter === 'Active') return task.status === 'Active';
  //     if (filter === 'Completed') return task.status === 'Completed';
  //     if (filter === 'Rejected') return task.status === 'Rejected';
  //     return true;
  //   });

  //   const formattedDate = currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  //   const formattedDay = currentTime.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' });
  //   const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });

  //   const handleInputChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData(prev => ({ ...prev, [name]: value }));
  //   };

  //   // Dynamic dropdown handlers for Reverse Auction
  //   const handleClientChange = (e) => {
  //     const client = e.target.value;
  //     setSelectedClient(client);
  //     setSelectedDivision('');
  //     setSelectedUser('');
  //     setAutoEmail('');
  //     setFormData(prev => ({
  //       ...prev,
  //       clientName: client,
  //       division: '',
  //       userName: '',
  //       userEmail: '',
  //     }));
  //   };

  //   const handleDivisionChange = (e) => {
  //     const division = e.target.value;
  //     setSelectedDivision(division);
  //     setSelectedUser('');
  //     setAutoEmail('');
  //     setFormData(prev => ({
  //       ...prev,
  //       division: division,
  //       userName: '',
  //       userEmail: '',
  //     }));
  //   };

  //   const handleUserChange = (e) => {
  //     const user = e.target.value;
  //     setSelectedUser(user);
  //     // Find email for this user
  //     const client = clientData.find(c => c.name === selectedClient);
  //     const division = client?.divisions.find(d => d.name === selectedDivision);
  //     const userObj = division?.users.find(u => u.name === user);
  //     const email = userObj?.email || '';
  //     setAutoEmail(email);
  //     setFormData(prev => ({
  //       ...prev,
  //       userName: user,
  //       userEmail: email,
  //     }));
  //   };

  //   // Chat handlers
  //   const handleOpenChat = (chat) => {
  //     setActiveChat(chat);
  //     setShowAddParticipant(false);
  //     setChatInput('');
  //   };

  //   const handleSendMessage = (e) => {
  //     e.preventDefault();
  //     if (!chatInput.trim()) return;
  //     setChats((prevChats) =>
  //       prevChats.map((chat) =>
  //         chat.id === activeChat.id
  //           ? {
  //               ...chat,
  //               messages: [
  //                 ...chat.messages,
  //                 {
  //                   sender: 'John Doe',
  //                   text: chatInput,
  //                   time: new Date().toLocaleTimeString('en-US', {
  //                     hour: '2-digit',
  //                     minute: '2-digit',
  //                     hour12: true,
  //                     timeZone: 'Asia/Kolkata',
  //                   }),
  //                 },
  //               ],
  //               lastMessage: chatInput,
  //               lastTime: new Date().toLocaleTimeString('en-US', {
  //                 hour: '2-digit',
  //                 minute: '2-digit',
  //                 hour12: true,
  //                 timeZone: 'Asia/Kolkata',
  //               }),
  //             }
  //           : chat
  //       )
  //     );
  //     setActiveChat((prev) => ({
  //       ...prev,
  //       messages: [
  //         ...prev.messages,
  //         {
  //           sender: 'John Doe',
  //           text: chatInput,
  //           time: new Date().toLocaleTimeString('en-US', {
  //             hour: '2-digit',
  //             minute: '2-digit',
  //             hour12: true,
  //             timeZone: 'Asia/Kolkata',
  //           }),
  //         },
  //       ],
  //       lastMessage: chatInput,
  //       lastTime: new Date().toLocaleTimeString('en-US', {
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         hour12: true,
  //         timeZone: 'Asia/Kolkata',
  //       }),
  //     }));
  //     setChatInput('');
  //   };

  //   const handleAddParticipant = () => {
  //     if (!newParticipant.trim() || activeChat.participants.includes(newParticipant)) return;
  //     setChats((prevChats) =>
  //       prevChats.map((chat) =>
  //         chat.id === activeChat.id
  //           ? {
  //               ...chat,
  //               participants: [...chat.participants, newParticipant],
  //               messages: [
  //                 ...chat.messages,
  //                 {
  //                   sender: 'System',
  //                   text: `${newParticipant} was added to the chat.`,
  //                   time: new Date().toLocaleTimeString('en-US', {
  //                     hour: '2-digit',
  //                     minute: '2-digit',
  //                     hour12: true,
  //                     timeZone: 'Asia/Kolkata',
  //                   }),
  //                 },
  //               ],
  //             }
  //           : chat
  //       )
  //     );
  //     setActiveChat((prev) => ({
  //       ...prev,
  //       participants: [...prev.participants, newParticipant],
  //       messages: [
  //         ...prev.messages,
  //         {
  //           sender: 'System',
  //           text: `${newParticipant} was added to the chat.`,
  //           time: new Date().toLocaleTimeString('en-US', {
  //             hour: '2-digit',
  //             minute: '2-digit',
  //             hour12: true,
  //             timeZone: 'Asia/Kolkata',
  //           }),
  //         },
  //       ],
  //     }));
  //     setShowAddParticipant(false);
  //     setNewParticipant('');
  //   };

  //   const filteredChats = chats.filter(
  //     (chat) =>
  //       chat.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
  //       chat.participants.some((p) => p.toLowerCase().includes(chatSearch.toLowerCase()))
  //   );

  //   // --- Modal Steps ---
  //   const renderStepTaskType = () => (
  //     <div>
  //       <label className="block text-sm font-medium text-blue-700">Task Type</label>
  //       <select
  //         name="taskType"
  //         value={formData.taskType}
  //         onChange={handleInputChange}
  //         className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.taskType ? 'border-red-400' : ''}`}
  //       >
  //         <option value="">Select Task Type</option>
  //         {taskTypes.map((type) => (
  //           <option key={type} value={type}>{type}</option>
  //         ))}
  //       </select>
  //       {formData.errors.taskType && <p className="text-red-400 text-sm mt-1">{formData.errors.taskType}</p>}
  //     </div>
  //   );

  //   const renderStepClientDivisionUser = () => (
  //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //       {/* Client Name Dropdown */}
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Client Name</label>
  //         <select
  //           name="clientName"
  //           value={selectedClient}
  //           onChange={handleClientChange}
  //           className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.clientName ? 'border-red-400' : ''}`}
  //         >
  //           <option value="">Select Client</option>
  //           {clientData.map(client => (
  //             <option key={client.name} value={client.name}>{client.name}</option>
  //           ))}
  //         </select>
  //         {formData.errors.clientName && <p className="text-red-400 text-sm mt-1">{formData.errors.clientName}</p>}
  //       </div>
  //       {/* Division Dropdown */}
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Division</label>
  //         <select
  //           name="division"
  //           value={selectedDivision}
  //           onChange={handleDivisionChange}
  //           disabled={!selectedClient}
  //           className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.division ? 'border-red-400' : ''}`}
  //         >
  //           <option value="">Select Division</option>
  //           {selectedClient &&
  //             clientData
  //               .find(c => c.name === selectedClient)
  //               ?.divisions.map(division => (
  //                 <option key={division.name} value={division.name}>{division.name}</option>
  //               ))}
  //         </select>
  //         {formData.errors.division && <p className="text-red-400 text-sm mt-1">{formData.errors.division}</p>}
  //       </div>
  //       {/* User Name Dropdown */}
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">User Name</label>
  //         <select
  //           name="userName"
  //           value={selectedUser}
  //           onChange={handleUserChange}
  //           disabled={!selectedDivision}
  //           className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.userName ? 'border-red-400' : ''}`}
  //         >
  //           <option value="">Select User</option>
  //           {selectedClient && selectedDivision &&
  //             clientData
  //               .find(c => c.name === selectedClient)
  //               ?.divisions.find(d => d.name === selectedDivision)
  //               ?.users.map(user => (
  //                 <option key={user.name} value={user.name}>{user.name}</option>
  //               ))}
  //         </select>
  //         {formData.errors.userName && <p className="text-red-400 text-sm mt-1">{formData.errors.userName}</p>}
  //       </div>
  //       {/* User Email Auto-filled */}
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">User Email</label>
  //         <input
  //           type="email"
  //           name="userEmail"
  //           value={autoEmail}
  //           readOnly
  //           className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.userEmail ? 'border-red-400' : ''}`}
  //         />
  //         {formData.errors.userEmail && <p className="text-red-400 text-sm mt-1">{formData.errors.userEmail}</p>}
  //       </div>
  //     </div>
  //   );

  //   const renderStepTaskDetails = () => (
  //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Task Name</label>
  //         <input
  //           type="text"
  //           name="taskName"
  //           value={formData.taskName}
  //           onChange={handleInputChange}
  //           className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.taskName ? 'border-red-400' : ''}`}
  //         />
  //         {formData.errors.taskName && <p className="text-red-400 text-sm mt-1">{formData.errors.taskName}</p>}
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Assigned To</label>
  //         <select
  //           name="assignedTo"
  //           value={formData.assignedTo}
  //           onChange={handleInputChange}
  //           className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.assignedTo ? 'border-red-400' : ''}`}
  //         >
  //           <option value="">Select</option>
  //           {employees.map((emp) => (
  //             <option key={emp} value={emp}>{emp}</option>
  //           ))}
  //         </select>
  //         {formData.errors.assignedTo && <p className="text-red-400 text-sm mt-1">{formData.errors.assignedTo}</p>}
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Assigned Date/Time</label>
  //         <input
  //           type="datetime-local"
  //           name="assignedDateTime"
  //           value={formData.assignedDateTime}
  //           onChange={handleInputChange}
  //           className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.assignedDateTime ? 'border-red-400' : ''}`}
  //         />
  //         {formData.errors.assignedDateTime && <p className="text-red-400 text-sm mt-1">{formData.errors.assignedDateTime}</p>}
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Due Date</label>
  //         <input
  //           type="date"
  //           name="dueDate"
  //           value={formData.dueDate || ''}
  //           onChange={handleInputChange}
  //           className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Status</label>
  //         <select
  //           name="status"
  //           value={formData.status}
  //           onChange={handleInputChange}
  //           className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.status ? 'border-red-400' : ''}`}
  //         >
  //           <option value="">Select</option>
  //           {statuses.map((s) => (
  //             <option key={s} value={s}>{s}</option>
  //           ))}
  //         </select>
  //         {formData.errors.status && <p className="text-red-400 text-sm mt-1">{formData.errors.status}</p>}
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Priority</label>
  //         <select
  //           name="priority"
  //           value={formData.priority}
  //           onChange={handleInputChange}
  //           className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.priority ? 'border-red-400' : ''}`}
  //         >
  //           <option value="">Select</option>
  //           {priorities.map((p) => (
  //             <option key={p} value={p}>{p}</option>
  //           ))}
  //         </select>
  //         {formData.errors.priority && <p className="text-red-400 text-sm mt-1">{formData.errors.priority}</p>}
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Remarks</label>
  //         <input
  //           type="text"
  //           name="remarks"
  //           value={formData.remarks}
  //           onChange={handleInputChange}
  //           className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Event Id</label>
  //         <input
  //           type="text"
  //           name="eventId"
  //           value={formData.eventId}
  //           onChange={handleInputChange}
  //           className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Pre Bid L1</label>
  //         <input
  //           type="number"
  //           name="preBidL1"
  //           value={formData.preBidL1}
  //           onChange={handleInputChange}
  //           className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Post Bid L1</label>
  //         <input
  //           type="number"
  //           name="postBidL1"
  //           value={formData.postBidL1}
  //           onChange={handleInputChange}
  //           className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Savings</label>
  //         <input
  //           type="number"
  //           name="savings"
  //           value={formData.savings}
  //           onChange={handleInputChange}
  //           className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-blue-700">Saving %</label>
  //         <input
  //           type="number"
  //           name="savingPercent"
  //           value={formData.savingPercent}
  //           onChange={handleInputChange}
  //           className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
  //         />
  //       </div>
  //     </div>
  //   );

  //   // --- Modal Navigation ---
  //   const handleNext = (e) => {
  //     e.preventDefault();
  //     let errors = {};
  //     if (modalStep === 0) {
  //       if (!formData.taskType) errors.taskType = 'Task Type is required';
  //     }
  //     if (modalStep === 1) {
  //       if (!selectedClient) errors.clientName = 'Client Name is required';
  //       if (!selectedDivision) errors.division = 'Division is required';
  //       if (!selectedUser) errors.userName = 'User Name is required';
  //       if (!autoEmail) errors.userEmail = 'User Email is required';
  //     }
  //     setFormData(prev => ({ ...prev, errors }));
  //     if (Object.keys(errors).length === 0) setModalStep(modalStep + 1);
  //   };

  //   const handleBack = (e) => {
  //     e.preventDefault();
  //     setFormData(prev => ({ ...prev, errors: {} }));
  //     setModalStep(modalStep - 1);
  //   };

  //   // Validation logic for final step
  //   const validateForm = () => {
  //     const errors = {};
  //     if (!formData.taskType) errors.taskType = 'Task Type is required';
  //     if (!formData.taskName.trim()) errors.taskName = 'Task Name is required';
  //     if (!formData.assignedTo) errors.assignedTo = 'Assigned To is required';
  //     if (!formData.assignedDateTime) errors.assignedDateTime = 'Assigned Date and Time is required';
  //     if (!formData.status) errors.status = 'Status is required';
  //     if (!formData.priority) errors.priority = 'Priority is required';
  //     if (!selectedClient) errors.clientName = 'Client Name is required';
  //     if (!selectedDivision) errors.division = 'Division is required';
  //     if (!selectedUser) errors.userName = 'User Name is required';
  //     if (!autoEmail) errors.userEmail = 'User Email is required';
  //     return errors;
  //   };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     const errors = validateForm();
  //     if (Object.keys(errors).length === 0) {
  //       setIsModalOpen(false);
  //       setFormData({
  //         taskType: '',
  //         taskName: '',
  //         assignedTo: '',
  //         assignedDateTime: '',
  //         dueDate: '',
  //         scheduledDateTime: '',
  //         closureDate: '',
  //         status: '',
  //         priority: '',
  //         clientName: '',
  //         division: '',
  //         userName: '',
  //         userEmail: '',
  //         remarks: '',
  //         eventId: '',
  //         preBidL1: '',
  //         postBidL1: '',
  //         savings: '',
  //         savingPercent: '',
  //         numberOfResponses: '',
  //         taskOutput: '',
  //         errors: {}
  //       });
  //       setSelectedClient('');
  //       setSelectedDivision('');
  //       setSelectedUser('');
  //       setAutoEmail('');
  //       setModalStep(0);
  //     } else {
  //       setFormData(prev => ({ ...prev, errors }));
  //     }
  //   };

  //   return (
  //     <div className="flex w-full h-screen bg-gradient-to-br from-blue-50 to-blue-100">
  //       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
  //       <div className="flex-1 flex flex-col overflow-hidden">
  //         <Header isLoggedIn={true} onToggleSidebar={toggleSidebar} />
  //         <main className="p-4 sm:p-6 overflow-auto">
  //           {/* Cards Section */}
  //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
  //             {[
  //               { icon: <FaTasks className="w-8 h-8 text-blue-700" />, title: 'Active Projects', value: '125', bg: 'bg-white border border-blue-100 shadow-sm' },
  //               { icon: <FaClock className="w-8 h-8 text-yellow-600" />, title: 'Pending Projects', value: '8', bg: 'bg-white border border-yellow-100 shadow-sm' },
  //               { icon: <FaCheckCircle className="w-8 h-8 text-green-600" />, title: 'Closed Projects', value: '45', bg: 'bg-white border border-green-100 shadow-sm' },
  //               {
  //                 icon: <FaUserCheck className="w-8 h-8 text-indigo-600" />,
  //                 component: (
  //                   <div className="flex flex-col">
  //                     <h3 className="text-base sm:text-lg font-semibold text-gray-800">Attendance</h3>
  //                     <p className="text-sm text-gray-500">{formattedDate}</p>
  //                     <p className="text-sm text-gray-500">{formattedDay}</p>
  //                     <p className="text-sm text-gray-500">{formattedTime}</p>
  //                     <button
  //                       className="mt-2 bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded hover:bg-blue-200 border border-blue-200 transition"
  //                       onClick={handleCheckInOut}
  //                     >
  //                       {isCheckedIn ? 'Check Out' : 'Check In'}
  //                     </button>
  //                   </div>
  //                 ),
  //                 bg: 'bg-white border border-indigo-100 shadow-sm',
  //               },
  //             ].map((card, index) => (
  //               <div key={index} className={`${card.bg} rounded-lg p-4 sm:p-6 flex items-center w-full`}>
  //                 {card.icon && <div className="mr-4">{card.icon}</div>}
  //                 {card.component || (
  //                   <div>
  //                     <h3 className="text-base sm:text-lg font-semibold text-gray-800">{card.title}</h3>
  //                     <p className="text-xl sm:text-2xl text-gray-700">{card.value}</p>
  //                   </div>
  //                 )}
  //               </div>
  //             ))}
  //           </div>

  //           {/* Responsive Table + Chat Section */}
  //           <div className="flex flex-col lg:flex-row gap-6">
  //             {/* Task Table Section */}
  //             <div className="flex-1 min-w-0">
  //               <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-blue-100">
  //                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
  //                   <div className="flex flex-wrap gap-2">
  //                     <button
  //                       className={`px-3 py-1 rounded ${filter === 'All' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}
  //                       onClick={() => setFilter('All')}
  //                     >
  //                       All
  //                     </button>
  //                     <button
  //                       className={`px-3 py-1 rounded ${filter === 'Active' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}
  //                       onClick={() => setFilter('Active')}
  //                     >
  //                       Active
  //                     </button>
  //                     <button
  //                       className={`px-3 py-1 rounded ${filter === 'Completed' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}
  //                       onClick={() => setFilter('Completed')}
  //                     >
  //                       Completed
  //                     </button>
  //                   </div>
  //                   <button
  //                     className="bg-blue-100 text-blue-700 px-2 py-1 sm:px-4 sm:py-2 rounded flex items-center space-x-1 sm:space-x-2 hover:bg-blue-200 text-sm sm:text-base border border-blue-200"
  //                     title="Add Task"
  //                     onClick={() => setIsModalOpen(true)}
  //                   >
  //                     <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
  //                     <span className="hidden sm:inline">Add Task</span>
  //                   </button>
  //                 </div>
  //                 <div className="overflow-x-auto">
  //                   <div className="max-h-96 overflow-y-auto">
  //                     <table className="w-full border-collapse">
  //                       <thead className="bg-blue-50 sticky top-0 z-10">
  //                         <tr>
  //                           <th className="p-2 text-left border-b text-gray-700">Task ID</th>
  //                           <th className="p-2 text-left border-b text-gray-700">Task Name</th>
  //                           <th className="p-2 text-left border-b text-gray-700">Client</th>
  //                           <th className="p-2 text-left border-b text-gray-700">User</th>
  //                           <th className="p-2 text-left border-b text-gray-700">Assigned Date</th>
  //                           <th className="p-2 text-left border-b text-gray-700">Due Date</th>
  //                           <th className="p-2 text-left border-b text-gray-700">Status</th>
  //                         </tr>
  //                       </thead>
  //                       <tbody>
  //                         {filteredTasks.map((task) => (
  //                           <tr key={task.id} className="border-b hover:bg-blue-50 transition">
  //                             <td className="p-2">{task.id}</td>
  //                             <td className="p-2">{task.title}</td>
  //                             <td className="p-2">{task.client}</td>
  //                             <td className="p-2">{task.user}</td>
  //                             <td className="p-2">{task.assignedDate}</td>
  //                             <td className="p-2">{task.dueDate}</td>
  //                             <td className="p-2">
  //                               {getStatusChip(task.status)}
  //                             </td>
  //                           </tr>
  //                         ))}
  //                       </tbody>
  //                     </table>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //             {/* Recent Chat Card */}
  //             <div className="w-full lg:w-[340px] flex-shrink-0">
  //               <div className="bg-white border border-blue-100 shadow-sm rounded-lg p-4 sm:p-6 flex flex-col h-full">
  //                 <div className="flex items-center justify-between mb-2">
  //                   <div className="flex items-center gap-2">
  //                     <FaComments className="w-6 h-6 text-blue-700" />
  //                     <h3 className="text-base sm:text-lg font-semibold text-blue-800">Recent Chats</h3>
  //                   </div>
  //                   <button
  //                     className="text-blue-600 hover:text-blue-800 text-xs font-medium"
  //                     onClick={() => setActiveChat(null)}
  //                     style={{ display: activeChat ? 'block' : 'none' }}
  //                   >
  //                     Close
  //                   </button>
  //                 </div>
  //                 <input
  //                   type="text"
  //                   placeholder="Search chats..."
  //                   value={chatSearch}
  //                   onChange={(e) => setChatSearch(e.target.value)}
  //                   className="mb-2 px-2 py-1 border border-blue-100 rounded text-sm bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
  //                 />
  //                 <div className="flex-1 overflow-y-auto max-h-80">
  //                   {filteredChats.length === 0 ? (
  //                     <div className="text-blue-400 text-sm text-center py-4">No chats found.</div>
  //                   ) : (
  //                     filteredChats.map((chat) => (
  //                       <button
  //                         key={chat.id}
  //                         className={`w-full flex items-center justify-between px-2 py-2 rounded hover:bg-blue-50 transition mb-1 ${
  //                           activeChat && activeChat.id === chat.id ? 'bg-blue-100' : ''
  //                         }`}
  //                         onClick={() => handleOpenChat(chat)}
  //                       >
  //                         <div className="flex flex-col items-start">
  //                           <span className="font-semibold text-blue-900">{chat.name}</span>
  //                           <span className="text-xs text-blue-700 truncate max-w-[120px]">{chat.lastMessage}</span>
  //                         </div>
  //                         <span className="text-xs text-blue-500">{chat.lastTime}</span>
  //                       </button>
  //                     ))
  //                   )}
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //           {/* Chat Window Modal */}
  //           {activeChat && (
  //             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md p-4">
  //               <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-blue-200 max-h-[90vh] flex flex-col">
  //                 <div className="flex items-center justify-between px-4 py-3 border-b border-blue-100 bg-blue-50 rounded-t-xl">
  //                   <div>
  //                     <span className="font-bold text-blue-800">{activeChat.name}</span>
  //                     <span className="ml-2 text-xs text-blue-500">
  //                       ({activeChat.participants.length} participant{activeChat.participants.length > 1 ? 's' : ''})
  //                     </span>
  //                   </div>
  //                   <button
  //                     className="text-blue-700 hover:text-blue-900 text-xl"
  //                     onClick={() => setActiveChat(null)}
  //                   >
  //                     <FaTimes />
  //                   </button>
  //                 </div>
  //                 <div className="flex-1 overflow-y-auto px-4 py-3 bg-blue-50">
  //                   {activeChat.messages.map((msg, idx) => (
  //                     <div
  //                       key={idx}
  //                       className={`mb-2 flex ${msg.sender === 'John Doe' ? 'justify-end' : 'justify-start'}`}
  //                     >
  //                       <div
  //                         className={`rounded-lg px-3 py-2 max-w-xs text-sm ${
  //                           msg.sender === 'John Doe'
  //                             ? 'bg-blue-600 text-white'
  //                             : msg.sender === 'System'
  //                             ? 'bg-blue-200 text-blue-800 font-semibold'
  //                             : 'bg-white text-blue-900 border border-blue-100'
  //                         }`}
  //                       >
  //                         <span>{msg.text}</span>
  //                         <div className="text-[10px] text-blue-200 mt-1 text-right">{msg.time}</div>
  //                       </div>
  //                     </div>
  //                   ))}
  //                 </div>
  //                 <div className="px-4 py-3 border-t border-blue-100 bg-blue-50 rounded-b-xl flex flex-col gap-2">
  //                   <div className="flex flex-wrap gap-2 mb-1">
  //                     {activeChat.participants.map((p, i) => (
  //                       <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{p}</span>
  //                     ))}
  //                   </div>
  //                   <form className="flex gap-2" onSubmit={handleSendMessage}>
  //                     <input
  //                       type="text"
  //                       placeholder="Type a message..."
  //                       value={chatInput}
  //                       onChange={(e) => setChatInput(e.target.value)}
  //                       className="flex-1 px-3 py-2 rounded border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
  //                     />
  //                     <button
  //                       type="submit"
  //                       className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition flex items-center"
  //                     >
  //                       <FaPaperPlane />
  //                     </button>
  //                   </form>
  //                   {showAddParticipant && (
  //                     <div className="flex gap-2 mt-2">
  //                       <input
  //                         type="text"
  //                         placeholder="Employee name..."
  //                         value={newParticipant}
  //                         onChange={(e) => setNewParticipant(e.target.value)}
  //                         className="flex-1 px-3 py-2 rounded border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
  //                       />
  //                       <button
  //                         type="button"
  //                         className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition"
  //                         onClick={handleAddParticipant}
  //                       >
  //                         Add
  //                       </button>
  //                       <button
  //                         type="button"
  //                         className="bg-gray-200 hover:bg-gray-300 text-blue-700 px-3 py-2 rounded transition"
  //                         onClick={() => {
  //                           setShowAddParticipant(false);
  //                           setNewParticipant('');
  //                         }}
  //                       >
  //                         Cancel
  //                       </button>
  //                     </div>
  //                   )}
  //                 </div>
  //               </div>
  //             </div>
  //           )}
  //           {/* Add Participant Modal (if not in chat window) */}
  //           {showAddParticipant && !activeChat && (
  //             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md p-4">
  //               <div className="relative w-full max-w-xs bg-white rounded-xl shadow-2xl border border-blue-200 p-6">
  //                 <h3 className="text-lg font-bold text-blue-800 mb-4">Add Participant to New Chat</h3>
  //                 <select
  //                   value={newParticipant}
  //                   onChange={e => setNewParticipant(e.target.value)}
  //                   className="w-full px-3 py-2 rounded border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
  //                 >
  //                   <option value="">Select member...</option>
  //                   {companyMembers.map((member) => (
  //                     <option key={member.email} value={`${member.name} (${member.email})`}>
  //                       {member.name} ({member.email})
  //                     </option>
  //                   ))}
  //                 </select>
  //                 <div className="flex justify-end gap-2">
  //                   <button
  //                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
  //                     onClick={() => {
  //                       if (!newParticipant.trim()) return;
  //                       const chatName = newParticipant;
  //                       const newChat = {
  //                         id: chats.length + 1,
  //                         name: chatName,
  //                         participants: ['John Doe', chatName],
  //                         messages: [
  //                           {
  //                             sender: 'System',
  //                             text: `${chatName} was added to the chat.`,
  //                             time: new Date().toLocaleTimeString('en-US', {
  //                               hour: '2-digit',
  //                               minute: '2-digit',
  //                               hour12: true,
  //                               timeZone: 'Asia/Kolkata',
  //                             }),
  //                           },
  //                         ],
  //                         lastMessage: `${chatName} was added to the chat.`,
  //                         lastTime: new Date().toLocaleTimeString('en-US', {
  //                           hour: '2-digit',
  //                           minute: '2-digit',
  //                           hour12: true,
  //                           timeZone: 'Asia/Kolkata',
  //                         }),
  //                       };
  //                       setChats((prev) => [...prev, newChat]);
  //                       setActiveChat(newChat);
  //                       setShowAddParticipant(false);
  //                       setNewParticipant('');
  //                     }}
  //                   >
  //                     Add
  //                   </button>
  //                   <button
  //                     className="bg-gray-200 hover:bg-gray-300 text-blue-700 px-4 py-2 rounded transition"
  //                     onClick={() => {
  //                       setShowAddParticipant(false);
  //                       setNewParticipant('');
  //                     }}
  //                   >
  //                     Cancel
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>
  //           )}
  //         </main>
  //         {/* Modal */}
  //         {isModalOpen && (
  //           <div className="fixed inset-0 bg-blue-100 bg-opacity-80 flex items-center justify-center z-50">
  //             <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-200 relative">
  //               <button
  //                 className="absolute top-4 right-4 text-blue-700 hover:text-blue-900 text-2xl transition-colors"
  //                 onClick={() => setIsModalOpen(false)}
  //               >
  //                 <FaTimes />
  //               </button>
  //               <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Add New Task</h2>
  //               <form onSubmit={modalStep === 2 ? handleSubmit : handleNext} className="space-y-6">
  //                 {modalStep === 0 && renderStepTaskType()}
  //                 {modalStep === 1 && renderStepClientDivisionUser()}
  //                 {modalStep === 2 && renderStepTaskDetails()}
  //                 <div className="flex justify-end space-x-4">
  //                   <button
  //                     type="button"
  //                     className="bg-gray-200 text-blue-700 px-4 py-2 rounded hover:bg-blue-50 transition"
  //                     onClick={() => setIsModalOpen(false)}
  //                   >
  //                     Cancel
  //                   </button>
  //                   {modalStep > 0 && (
  //                     <button
  //                       type="button"
  //                       className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition"
  //                       onClick={handleBack}
  //                     >
  //                       Back
  //                     </button>
  //                   )}
  //                   {modalStep < 2 ? (
  //                     <button
  //                       type="button"
  //                       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
  //                       onClick={handleNext}
  //                     >
  //                       Next
  //                     </button>
  //                   ) : (
  //                     <button
  //                       type="submit"
  //                       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
  //                     >
  //                       Save
  //                     </button>
  //                   )}
  //                 </div>
  //               </form>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  // export default Dashboard;



  import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import { FaTasks, FaClock, FaCheckCircle, FaPlus, FaUserCheck, FaTimes, FaComments, FaUserPlus, FaPaperPlane } from 'react-icons/fa';

// Status chip function for colored chips
const getStatusChip = (status) => {
  switch (status) {
    case 'Completed':
      return (
        <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold inline-block">
          Completed
        </span>
      );
    case 'Active':
      return (
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold inline-block">
          Active
        </span>
      );
    case 'Rejected':
      return (
        <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-semibold inline-block">
          Rejected
        </span>
      );
    default:
      return (
        <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-semibold inline-block">
          {status}
        </span>
      );
  }
};

const employees = ['John Doe', 'Mike Ross', 'Sarah Lee'];
const companyMembers = [
  { name: 'John Doe', email: 'john.doe@email.com' },
  { name: 'Mike Ross', email: 'mike.ross@email.com' },
  { name: 'Sarah Lee', email: 'sarah.lee@email.com' },
];
const taskTypes = ['Reverse Auction', 'Forward Auction', 'RFx', 'General Task'];
const statuses = ['Not Started Yet', 'Scheduled', 'Completed', 'Hold'];
const priorities = ['Low', 'Medium', 'High'];

// Example data for clients, divisions, users, and emails
const clientData = [
  {
    name: 'Client A',
    divisions: [
      {
        name: 'Division A1',
        users: [
          { name: 'John Doe', email: 'john.doe@email.com' },
          { name: 'Mike Ross', email: 'mike.ross@email.com' },
        ],
      },
      {
        name: 'Division A2',
        users: [
          { name: 'Sarah Lee', email: 'sarah.lee@email.com' },
        ],
      },
    ],
  },
  {
    name: 'Client B',
    divisions: [
      {
        name: 'Division B1',
        users: [
          { name: 'Mike Ross', email: 'mike.ross@email.com' },
        ],
      },
    ],
  },
];

const tasks = [
  { id: 1, title: 'Complete Project Proposal', client: 'Client A', user: 'John Doe', assignedDate: '2025-06-20', dueDate: '2025-06-25', status: 'Active' },
  { id: 2, title: 'Review Contract', client: 'Client B', user: 'Mike Ross', assignedDate: '2025-06-21', dueDate: '2025-06-26', status: 'Completed' },
  { id: 3, title: 'Update Dashboard Metrics', client: 'Client C', user: 'Mike Ross', assignedDate: '2025-06-23', dueDate: '2025-06-30', status: 'Active' },
  { id: 5, title: 'Client Feedback', client: 'Client E', user: 'John Doe', assignedDate: '2025-06-25', dueDate: '2025-07-01', status: 'Active' },
  { id: 6, title: 'Finalize Budget', client: 'Client F', user: 'Mike Ross', assignedDate: '2025-06-26', dueDate: '2025-07-03', status: 'Completed' },
  { id: 7, title: 'Finalize Budget', client: 'Client F', user: 'Mike Ross', assignedDate: '2025-06-26', dueDate: '2025-07-03', status: 'Completed' },
  { id: 8, title: 'Finalize Budget', client: 'Client F', user: 'Mike Ross', assignedDate: '2025-06-26', dueDate: '2025-07-03', status: 'Completed' },
  { id: 9, title: 'Finalize Budget', client: 'Client F', user: 'Mike Ross', assignedDate: '2025-06-26', dueDate: '2025-07-03', status: 'Completed' },
  { id: 10, title: 'Finalize Budget', client: 'Client F', user: 'Mike Ross', assignedDate: '2025-06-26', dueDate: '2025-07-03', status: 'Completed' },
];

const initialChats = [
  {
    id: 1,
    name: 'Nitin Bansal',
    participants: ['John Doe', 'Mike Ross'],
    messages: [
      { sender: 'Mike Ross', text: 'Hey John, did you check the proposal?', time: '09:15 AM' },
      { sender: 'John Doe', text: 'Yes, I will update it today.', time: '09:17 AM' },
    ],
    lastMessage: 'Yes, I will update it today.',
    lastTime: '09:25 AM',
  },
  {
    id: 2,
    name: 'Simranjeet Singh',
    participants: ['John Doe', 'Sarah Lee'],
    messages: [
      { sender: 'Sarah Lee', text: 'Can you share the dashboard metrics?', time: '10:05 AM' },
      { sender: 'John Doe', text: 'Sure, sending now.', time: '10:06 AM' },
    ],
    lastMessage: 'Sure, sending now.',
    lastTime: '10:06 AM',
  },
  {
    id: 3,
    name: 'Khusboo ',
    participants: ['John Doe', 'Sarah Lee'],
    messages: [
      { sender: 'Sarah Lee', text: 'Can you share the dashboard metrics?', time: '10:05 AM' },
      { sender: 'John Doe', text: 'Sure, sending now.', time: '10:06 AM' },
    ],
    lastMessage: 'Sure, sending now.',
    lastTime: '10:06 AM',
  },
  {
    id: 5,
    name: 'Ashutosh Arora',
    participants: ['John Doe', 'Sarah Lee'],
    messages: [
      { sender: 'Sarah Lee', text: 'Can you share the dashboard metrics?', time: '10:05 AM' },
      { sender: 'John Doe', text: 'Sure, sending now.', time: '10:06 AM' },
    ],
    lastMessage: 'Sure, sending now.',
    lastTime: '10:06 AM',
  },
  {
    id: 6,
    name: 'Ankit pundir',
    participants: ['John Doe', 'Sarah Lee'],
    messages: [
      { sender: 'Sarah Lee', text: 'Can you share the dashboard metrics?', time: '10:05 AM' },
      { sender: 'John Doe', text: 'Sure, sending now.', time: '10:06 AM' },
    ],
    lastMessage: 'Sure, sending now.',
    lastTime: '10:06 AM',
  },
  {
    id: 7,
    name: 'Vidhi Tyagi',
    participants: ['John Doe', 'Sarah Lee'],
    messages: [
      { sender: 'Sarah Lee', text: 'Can you share the dashboard metrics?', time: '10:05 AM' },
      { sender: 'John Doe', text: 'Sure, sending now.', time: '10:06 AM' },
    ],
    lastMessage: 'Sure, sending now.',
    lastTime: '10:06 AM',
  },
];

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [formData, setFormData] = useState({
    taskType: '',
    taskName: '',
    assignedTo: '',
    assignedDateTime: '',
    dueDate: '',
    scheduledDateTime: '',
    closureDate: '',
    status: '',
    priority: '',
    clientName: '',
    division: '',
    userName: '',
    userEmail: '',
    remarks: '',
    eventId: '',
    preBidL1: '',
    postBidL1: '',
    savings: '',
    savingPercent: '',
    numberOfResponses: '',
    taskOutput: '',
    errors: {}
  });
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [autoEmail, setAutoEmail] = useState('');
  const [chats, setChats] = useState(initialChats);
  const [activeChat, setActiveChat] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newParticipant, setNewParticipant] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [checkInOutMessage, setCheckInOutMessage] = useState(''); // New state for check-in/out messages
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false); // New state for check-out confirmation modal
  const [taskMessage, setTaskMessage] = useState(''); // New state for task addition message

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isModalOpen) setModalStep(0);
  }, [isModalOpen]);

  const handleCheckInOut = () => {
    if (isCheckedIn) {
      setIsCheckOutModalOpen(true); // Show confirmation modal for check-out
    } else {
      setIsCheckedIn(true);
      setCheckInOutMessage('Checked in successfully!');
      setTimeout(() => setCheckInOutMessage(''), 2000);
    }
  };

  const confirmCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInOutMessage('Checked out successfully!');
    setIsCheckOutModalOpen(false);
    setTimeout(() => setCheckInOutMessage(''), 2000);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Active') return task.status === 'Active';
    if (filter === 'Completed') return task.status === 'Completed';
    if (filter === 'Rejected') return task.status === 'Rejected';
    return true;
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const formattedDay = currentTime.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' });
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClientChange = (e) => {
    const client = e.target.value;
    setSelectedClient(client);
    setSelectedDivision('');
    setSelectedUser('');
    setAutoEmail('');
    setFormData(prev => ({
      ...prev,
      clientName: client,
      division: '',
      userName: '',
      userEmail: '',
    }));
  };

  const handleDivisionChange = (e) => {
    const division = e.target.value;
    setSelectedDivision(division);
    setSelectedUser('');
    setAutoEmail('');
    setFormData(prev => ({
      ...prev,
      division: division,
      userName: '',
      userEmail: '',
    }));
  };

  const handleUserChange = (e) => {
    const user = e.target.value;
    setSelectedUser(user);
    const client = clientData.find(c => c.name === selectedClient);
    const division = client?.divisions.find(d => d.name === selectedDivision);
    const userObj = division?.users.find(u => u.name === user);
    const email = userObj?.email || '';
    setAutoEmail(email);
    setFormData(prev => ({
      ...prev,
      userName: user,
      userEmail: email,
    }));
  };

  const handleOpenChat = (chat) => {
    setActiveChat(chat);
    setShowAddParticipant(false);
    setChatInput('');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  sender: 'John Doe',
                  text: chatInput,
                  time: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Kolkata',
                  }),
                },
              ],
              lastMessage: chatInput,
              lastTime: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata',
              }),
            }
          : chat
      )
    );
    setActiveChat((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          sender: 'John Doe',
          text: chatInput,
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata',
          }),
        },
      ],
      lastMessage: chatInput,
      lastTime: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      }),
    }));
    setChatInput('');
  };

  const handleAddParticipant = () => {
    if (!newParticipant.trim() || activeChat.participants.includes(newParticipant)) return;
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              participants: [...chat.participants, newParticipant],
              messages: [
                ...chat.messages,
                {
                  sender: 'System',
                  text: `${newParticipant} was added to the chat.`,
                  time: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Kolkata',
                  }),
                },
              ],
            }
          : chat
      )
    );
    setActiveChat((prev) => ({
      ...prev,
      participants: [...prev.participants, newParticipant],
      messages: [
        ...prev.messages,
        {
          sender: 'System',
          text: `${newParticipant} was added to the chat.`,
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata',
          }),
        },
      ],
    }));
    setShowAddParticipant(false);
    setNewParticipant('');
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
      chat.participants.some((p) => p.toLowerCase().includes(chatSearch.toLowerCase()))
  );

  const renderStepTaskType = () => (
    <div>
      <label className="block text-sm font-medium text-blue-700">Task Type</label>
      <select
        name="taskType"
        value={formData.taskType}
        onChange={handleInputChange}
        className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.taskType ? 'border-red-400' : ''}`}
      >
        <option value="">Select Task Type</option>
        {taskTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      {formData.errors.taskType && <p className="text-red-400 text-sm mt-1">{formData.errors.taskType}</p>}
    </div>
  );

  const renderStepClientDivisionUser = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-blue-700">Client Name</label>
        <select
          name="clientName"
          value={selectedClient}
          onChange={handleClientChange}
          className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.clientName ? 'border-red-400' : ''}`}
        >
          <option value="">Select Client</option>
          {clientData.map(client => (
            <option key={client.name} value={client.name}>{client.name}</option>
          ))}
        </select>
        {formData.errors.clientName && <p className="text-red-400 text-sm mt-1">{formData.errors.clientName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Division</label>
        <select
          name="division"
          value={selectedDivision}
          onChange={handleDivisionChange}
          disabled={!selectedClient}
          className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.division ? 'border-red-400' : ''}`}
        >
          <option value="">Select Division</option>
          {selectedClient &&
            clientData
              .find(c => c.name === selectedClient)
              ?.divisions.map(division => (
                <option key={division.name} value={division.name}>{division.name}</option>
              ))}
        </select>
        {formData.errors.division && <p className="text-red-400 text-sm mt-1">{formData.errors.division}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">User Name</label>
        <select
          name="userName"
          value={selectedUser}
          onChange={handleUserChange}
          disabled={!selectedDivision}
          className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.userName ? 'border-red-400' : ''}`}
        >
          <option value="">Select User</option>
          {selectedClient && selectedDivision &&
            clientData
              .find(c => c.name === selectedClient)
              ?.divisions.find(d => d.name === selectedDivision)
              ?.users.map(user => (
                <option key={user.name} value={user.name}>{user.name}</option>
              ))}
        </select>
        {formData.errors.userName && <p className="text-red-400 text-sm mt-1">{formData.errors.userName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">User Email</label>
        <input
          type="email"
          name="userEmail"
          value={autoEmail}
          readOnly
          className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.userEmail ? 'border-red-400' : ''}`}
        />
        {formData.errors.userEmail && <p className="text-red-400 text-sm mt-1">{formData.errors.userEmail}</p>}
      </div>
    </div>
  );

  const renderStepTaskDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-blue-700">Task Name</label>
        <input
          type="text"
          name="taskName"
          value={formData.taskName}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.taskName ? 'border-red-400' : ''}`}
        />
        {formData.errors.taskName && <p className="text-red-400 text-sm mt-1">{formData.errors.taskName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Assigned To</label>
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.assignedTo ? 'border-red-400' : ''}`}
        >
          <option value="">Select</option>
          {employees.map((emp) => (
            <option key={emp} value={emp}>{emp}</option>
          ))}
        </select>
        {formData.errors.assignedTo && <p className="text-red-400 text-sm mt-1">{formData.errors.assignedTo}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Assigned Date/Time</label>
        <input
          type="datetime-local"
          name="assignedDateTime"
          value={formData.assignedDateTime}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.assignedDateTime ? 'border-red-400' : ''}`}
        />
        {formData.errors.assignedDateTime && <p className="text-red-400 text-sm mt-1">{formData.errors.assignedDateTime}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate || ''}
          onChange={handleInputChange}
          className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.status ? 'border-red-400' : ''}`}
        >
          <option value="">Select</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {formData.errors.status && <p className="text-red-400 text-sm mt-1">{formData.errors.status}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400 ${formData.errors.priority ? 'border-red-400' : ''}`}
        >
          <option value="">Select</option>
          {priorities.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {formData.errors.priority && <p className="text-red-400 text-sm mt-1">{formData.errors.priority}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Remarks</label>
        <input
          type="text"
          name="remarks"
          value={formData.remarks}
          onChange={handleInputChange}
          className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Event Id</label>
        <input
          type="text"
          name="eventId"
          value={formData.eventId}
          onChange={handleInputChange}
          className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Pre Bid L1</label>
        <input
          type="number"
          name="preBidL1"
          value={formData.preBidL1}
          onChange={handleInputChange}
          className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Post Bid L1</label>
        <input
          type="number"
          name="postBidL1"
          value={formData.postBidL1}
          onChange={handleInputChange}
          className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Savings</label>
        <input
          type="number"
          name="savings"
          value={formData.savings}
          onChange={handleInputChange}
          className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Saving %</label>
        <input
          type="number"
          name="savingPercent"
          value={formData.savingPercent}
          onChange={handleInputChange}
          className="w-full p-2 border rounded bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  );

  const validateForm = () => {
    const errors = {};
    if (!formData.taskType) errors.taskType = 'Task Type is required';
    if (!formData.taskName.trim()) errors.taskName = 'Task Name is required';
    if (!formData.assignedTo) errors.assignedTo = 'Assigned To is required';
    if (!formData.assignedDateTime) errors.assignedDateTime = 'Assigned Date and Time is required';
    if (!formData.status) errors.status = 'Status is required';
    if (!formData.priority) errors.priority = 'Priority is required';
    if (!selectedClient) errors.clientName = 'Client Name is required';
    if (!selectedDivision) errors.division = 'Division is required';
    if (!selectedUser) errors.userName = 'User Name is required';
    if (!autoEmail) errors.userEmail = 'User Email is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      setIsModalOpen(false);
      setTaskMessage('Task added successfully!'); // Show success message
      setTimeout(() => setTaskMessage(''), 2000); // Clear message after 2 seconds
      setFormData({
        taskType: '',
        taskName: '',
        assignedTo: '',
        assignedDateTime: '',
        dueDate: '',
        scheduledDateTime: '',
        closureDate: '',
        status: '',
        priority: '',
        clientName: '',
        division: '',
        userName: '',
        userEmail: '',
        remarks: '',
        eventId: '',
        preBidL1: '',
        postBidL1: '',
        savings: '',
        savingPercent: '',
        numberOfResponses: '',
        taskOutput: '',
        errors: {}
      });
      setSelectedClient('');
      setSelectedDivision('');
      setSelectedUser('');
      setAutoEmail('');
      setModalStep(0);
    } else {
      setFormData(prev => ({ ...prev, errors }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    let errors = {};
    if (modalStep === 0) {
      if (!formData.taskType) errors.taskType = 'Task Type is required';
    }
    if (modalStep === 1) {
      if (!selectedClient) errors.clientName = 'Client Name is required';
      if (!selectedDivision) errors.division = 'Division is required';
      if (!selectedUser) errors.userName = 'User Name is required';
      if (!autoEmail) errors.userEmail = 'User Email is required';
    }
    setFormData(prev => ({ ...prev, errors }));
    if (Object.keys(errors).length === 0) setModalStep(modalStep + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, errors: {} }));
    setModalStep(modalStep - 1);
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header isLoggedIn={true} onToggleSidebar={toggleSidebar} />
        <main className="p-4 sm:p-6 overflow-auto">
          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {[
              { icon: <FaTasks className="w-8 h-8 text-blue-700" />, title: 'Active Projects', value: '125', bg: 'bg-white border border-blue-100 shadow-sm' },
              { icon: <FaClock className="w-8 h-8 text-yellow-600" />, title: 'Pending Projects', value: '8', bg: 'bg-white border border-yellow-100 shadow-sm' },
              { icon: <FaCheckCircle className="w-8 h-8 text-green-600" />, title: 'Closed Projects', value: '45', bg: 'bg-white border border-green-100 shadow-sm' },
              {
                icon: <FaUserCheck className="w-8 h-8 text-indigo-600" />,
                component: (
                  <div className="flex flex-col">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Attendance</h3>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                    <p className="text-sm text-gray-500">{formattedDay}</p>
                    <p className="text-sm text-gray-500">{formattedTime}</p>
                    <button
                      className="mt-2 bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded hover:bg-blue-200 border border-blue-200 transition"
                      onClick={handleCheckInOut}
                    >
                      {isCheckedIn ? 'Check Out' : 'Check In'}
                    </button>
                    {checkInOutMessage && (
                      <p className="text-green-600 text-sm text-center mt-2 animate-fade-in">
                        {checkInOutMessage}
                      </p>
                    )}
                  </div>
                ),
                bg: 'bg-white border border-indigo-100 shadow-sm',
              },
            ].map((card, index) => (
              <div key={index} className={`${card.bg} rounded-lg p-4 sm:p-6 flex items-center w-full`}>
                {card.icon && <div className="mr-4">{card.icon}</div>}
                {card.component || (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">{card.title}</h3>
                    <p className="text-xl sm:text-2xl text-gray-700">{card.value}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Responsive Table + Chat Section */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-blue-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-3 py-1 rounded ${filter === 'All' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setFilter('All')}
                    >
                      All
                    </button>
                    <button
                      className={`px-3 py-1 rounded ${filter === 'Active' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setFilter('Active')}
                    >
                      Active
                    </button>
                    <button
                      className={`px-3 py-1 rounded ${filter === 'Completed' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setFilter('Completed')}
                    >
                      Completed
                    </button>
                  </div>
                  <button
                    className="bg-blue-100 text-blue-700 px-2 py-1 sm:px-4 sm:py-2 rounded flex items-center space-x-1 sm:space-x-2 hover:bg-blue-200 text-sm sm:text-base border border-blue-200"
                    title="Add Task"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Add Task</span>
                  </button>
                </div>
                {taskMessage && (
                  <p className="text-green-600 text-sm text-center mb-4 animate-fade-in">
                    {taskMessage}
                  </p>
                )}
                <div className="overflow-x-auto">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-blue-50 sticky top-0 z-10">
                        <tr>
                          <th className="p-2 text-left border-b text-gray-700">Task ID</th>
                          <th className="p-2 text-left border-b text-gray-700">Task Name</th>
                          <th className="p-2 text-left border-b text-gray-700">Client</th>
                          <th className="p-2 text-left border-b text-gray-700">User</th>
                          <th className="p-2 text-left border-b text-gray-700">Assigned Date</th>
                          <th className="p-2 text-left border-b text-gray-700">Due Date</th>
                          <th className="p-2 text-left border-b text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map((task) => (
                          <tr key={task.id} className="border-b hover:bg-blue-50 transition">
                            <td className="p-2">{task.id}</td>
                            <td className="p-2">{task.title}</td>
                            <td className="p-2">{task.client}</td>
                            <td className="p-2">{task.user}</td>
                            <td className="p-2">{task.assignedDate}</td>
                            <td className="p-2">{task.dueDate}</td>
                            <td className="p-2">
                              {getStatusChip(task.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[340px] flex-shrink-0">
              <div className="bg-white border border-blue-100 shadow-sm rounded-lg p-4 sm:p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FaComments className="w-6 h-6 text-blue-700" />
                    <h3 className="text-base sm:text-lg font-semibold text-blue-800">Recent Chats</h3>
                  </div>
                  <button
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    onClick={() => setActiveChat(null)}
                    style={{ display: activeChat ? 'block' : 'none' }}
                  >
                    Close
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  className="mb-2 px-2 py-1 border border-blue-100 rounded text-sm bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex-1 overflow-y-auto max-h-80">
                  {filteredChats.length === 0 ? (
                    <div className="text-blue-400 text-sm text-center py-4">No chats found.</div>
                  ) : (
                    filteredChats.map((chat) => (
                      <button
                        key={chat.id}
                        className={`w-full flex items-center justify-between px-2 py-2 rounded hover:bg-blue-50 transition mb-1 ${
                          activeChat && activeChat.id === chat.id ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => handleOpenChat(chat)}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-semibold text-blue-900">{chat.name}</span>
                          <span className="text-xs text-blue-700 truncate max-w-[120px]">{chat.lastMessage}</span>
                        </div>
                        <span className="text-xs text-blue-500">{chat.lastTime}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Check Out Confirmation Modal */}
          {isCheckOutModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md p-4">
              <div className="relative w-full max-w-xs bg-white rounded-xl shadow-2xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-4">Confirm Check Out</h3>
                <p className="text-sm text-blue-700 mb-4">Are you sure you want to check out?</p>
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-blue-700 px-4 py-2 rounded transition"
                    onClick={() => setIsCheckOutModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    onClick={confirmCheckOut}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Chat Window Modal */}
          {activeChat && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md p-4">
              <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-blue-200 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-blue-100 bg-blue-50 rounded-t-xl">
                  <div>
                    <span className="font-bold text-blue-800">{activeChat.name}</span>
                    <span className="ml-2 text-xs text-blue-500">
                      ({activeChat.participants.length} participant{activeChat.participants.length > 1 ? 's' : ''})
                    </span>
                  </div>
                  <button
                    className="text-blue-700 hover:text-blue-900 text-xl"
                    onClick={() => setActiveChat(null)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-3 bg-blue-50">
                  {activeChat.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-2 flex ${msg.sender === 'John Doe' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`rounded-lg px-3 py-2 max-w-xs text-sm ${
                          msg.sender === 'John Doe'
                            ? 'bg-blue-600 text-white'
                            : msg.sender === 'System'
                            ? 'bg-blue-200 text-blue-800 font-semibold'
                            : 'bg-white text-blue-900 border border-blue-100'
                        }`}
                      >
                        <span>{msg.text}</span>
                        <div className="text-[10px] text-blue-200 mt-1 text-right">{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-blue-100 bg-blue-50 rounded-b-xl flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2 mb-1">
                    {activeChat.participants.map((p, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{p}</span>
                    ))}
                  </div>
                  <form className="flex gap-2" onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition flex items-center"
                    >
                      <FaPaperPlane />
                    </button>
                  </form>
                  {showAddParticipant && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Employee name..."
                        value={newParticipant}
                        onChange={(e) => setNewParticipant(e.target.value)}
                        className="flex-1 px-3 py-2 rounded border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition"
                        onClick={handleAddParticipant}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-blue-700 px-3 py-2 rounded transition"
                        onClick={() => {
                          setShowAddParticipant(false);
                          setNewParticipant('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Add Participant Modal */}
          {showAddParticipant && !activeChat && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md p-4">
              <div className="relative w-full max-w-xs bg-white rounded-xl shadow-2xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-4">Add Participant to New Chat</h3>
                <select
                  value={newParticipant}
                  onChange={e => setNewParticipant(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
                >
                  <option value="">Select member...</option>
                  {companyMembers.map((member) => (
                    <option key={member.email} value={`${member.name} (${member.email})`}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    onClick={() => {
                      if (!newParticipant.trim()) return;
                      const chatName = newParticipant;
                      const newChat = {
                        id: chats.length + 1,
                        name: chatName,
                        participants: ['John Doe', chatName],
                        messages: [
                          {
                            sender: 'System',
                            text: `${chatName} was added to the chat.`,
                            time: new Date().toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                              timeZone: 'Asia/Kolkata',
                            }),
                          },
                        ],
                        lastMessage: `${chatName} was added to the chat.`,
                        lastTime: new Date().toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'Asia/Kolkata',
                        }),
                      };
                      setChats((prev) => [...prev, newChat]);
                      setActiveChat(newChat);
                      setShowAddParticipant(false);
                      setNewParticipant('');
                    }}
                  >
                    Add
                  </button>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-blue-700 px-4 py-2 rounded transition"
                    onClick={() => {
                      setShowAddParticipant(false);
                      setNewParticipant('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Add Task Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-blue-100 bg-opacity-80 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-200 relative">
                <button
                  className="absolute top-4 right-4 text-blue-700 hover:text-blue-900 text-2xl transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  <FaTimes />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Add New Task</h2>
                <form onSubmit={modalStep === 2 ? handleSubmit : handleNext} className="space-y-6">
                  {modalStep === 0 && renderStepTaskType()}
                  {modalStep === 1 && renderStepClientDivisionUser()}
                  {modalStep === 2 && renderStepTaskDetails()}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="bg-gray-200 text-blue-700 px-4 py-2 rounded hover:bg-blue-50 transition"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    {modalStep > 0 && (
                      <button
                        type="button"
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition"
                        onClick={handleBack}
                      >
                        Back
                      </button>
                    )}
                    {modalStep < 2 ? (
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        onClick={handleNext}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;