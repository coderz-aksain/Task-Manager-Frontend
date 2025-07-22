


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   FaUser,
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaSave,
//   FaCamera,
//   FaTimes,
//   FaPen,
// } from 'react-icons/fa';
// import Header from '../../components/common/Header';
// import AdminSidebar from '../../components/common/AdminSidebar';
// import { useNavigate } from 'react-router-dom';

// // Base URL for API
// const BASE_URL = 'https://task-manager-backend-vqen.onrender.com/api';

// // Initial employee fields (aligned with backend requirements)
// const initialEmployee = {
//   firstName: '',
//   lastName: '',
//   email: '',
//   department: '',
//   position: '',
//   dateOfJoining: '',
//   manager: '',
//   role: 'employee',
//   profileImage: null,
//   officialDateOfBirth: '',
//   actualDateOfBirth: '',
//   primaryPhoneNumber: '',
//   secondaryPhoneNumber: '',
//   personalEmailId: '',
//   permanentResidentialAddress: '',
//   currentAddress: '',
//   bankName: '',
//   accountNumber: '',
//   ifscCode: '',
//   bankBranchName: '',
//   fathersName: '',
//   fathersContactNo: '',
//   mothersName: '',
//   mothersContactNo: '',
//   spouseName: '',
//   spouseContactNo: '',
//   siblings: '',
//   bloodGroup: '',
//   hasMedicalInsurance: '',
//   employeeId: '',
//   hireDate: '',
//   workLocation: '',
//   emergencyContact: '',
// };

// const EmployeeListPage = () => {
//   // Sidebar state
//   const [showSidebar, setShowSidebar] = useState(false);
//   const toggleSidebar = () => setShowSidebar((prev) => !prev);

//   // Employees state
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState('add'); // 'add' or 'view'
//   const [modalEmployee, setModalEmployee] = useState(initialEmployee);
//   const [modalIndex, setModalIndex] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   // Delete confirmation
//   const [deleteIndex, setDeleteIndex] = useState(null);

//   // Navigation for redirect
//   const navigate = useNavigate();

//   // Retrieve token and email from localStorage
//   const token = localStorage.getItem('token') || '';
//   const email = localStorage.getItem('userEmail') || '';

//   // Log token and email for debugging
//   useEffect(() => {
//     console.log('Auth Token:', token);
//     console.log('User Email:', email);
//     if (!token) {
//       setError('Please log in to view employees.');
//       navigate('/login');
//     }
//   }, [token, email, navigate]);

//   // Fetch all employees on component mount
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       if (!token) {
//         setError('No authentication token found. Please log in.');
//         setLoading(false);
//         navigate('/login');
//         return;
//       }

//       try {
//         const response = await axios.get(`${BASE_URL}/admin/allemployees`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const employeesData = Array.isArray(response.data) ? response.data : response.data.employees || [];
//         console.log('Fetched employees:', employeesData); // Log fetched employees
//         setEmployees(employeesData);
//         setLoading(false);
//       } catch (err) {
//         console.error('Fetch Employees Error:', err.response?.data || err.message);
//         if (err.response?.status === 401) {
//           setError('Session expired or unauthorized. Please log in again.');
//           localStorage.removeItem('token');
//           localStorage.removeItem('userEmail');
//           navigate('/login');
//         } else if (err.message.includes('Network Error')) {
//           setError('Failed to connect to the server. Please check your network or server configuration.');
//         } else {
//           setError(err.response?.data?.message || 'Failed to fetch employees');
//         }
//         setLoading(false);
//       }
//     };
//     fetchEmployees();
//   }, [token, navigate]);

//   // Handle open modal for add or view
//   const openModal = (type, employee = initialEmployee, index = null) => {
//     setModalType(type);
//     setModalEmployee({
//       ...initialEmployee,
//       ...employee,
//       email: employee.email || (type === 'add' ? '' : email),
//       role: employee.role || 'employee',
//     });
//     setModalIndex(index);
//     setIsEditing(type === 'add');
//     setModalOpen(true);
//   };

//   // Handle input change in modal
//   const handleModalChange = (field, value) => {
//     setModalEmployee((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Handle image upload in modal
//   const handleModalImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => {
//         setModalEmployee((prev) => ({
//           ...prev,
//           profileImage: ev.target.result,
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Save employee (add or update)
//   const handleSaveEmployee = async () => {
//     if (!token) {
//       setError('No authentication token found. Please log in.');
//       navigate('/login');
//       return;
//     }

//     // Validate required fields
//     const requiredFields = ['firstName', 'lastName', 'email', 'department', 'position', 'dateOfJoining', 'manager', 'role'];
//     const missingFields = requiredFields.filter((field) => !modalEmployee[field]);
//     if (missingFields.length > 0) {
//       setError(`Missing required fields: ${missingFields.join(', ')}`);
//       return;
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(modalEmployee.email)) {
//       setError('Invalid email format.');
//       return;
//     }

//     try {
//       let response;
//       const employeeData = {
//         firstName: modalEmployee.firstName,
//         lastName: modalEmployee.lastName,
//         email: modalEmployee.email,
//         department: modalEmployee.department,
//         position: modalEmployee.position,
//         dateOfJoining: modalEmployee.dateOfJoining,
//         manager: modalEmployee.manager,
//         role: modalEmployee.role,
//         workLocation: modalEmployee.workLocation || undefined,
//         profileImage: modalEmployee.profileImage || undefined,
//         // Include optional fields for edit mode only
//         ...(modalType === 'view' && {
//           officialDateOfBirth: modalEmployee.officialDateOfBirth || undefined,
//           actualDateOfBirth: modalEmployee.actualDateOfBirth || undefined,
//           primaryPhoneNumber: modalEmployee.primaryPhoneNumber || undefined,
//           secondaryPhoneNumber: modalEmployee.secondaryPhoneNumber || undefined,
//           personalEmailId: modalEmployee.personalEmailId || undefined,
//           permanentResidentialAddress: modalEmployee.permanentResidentialAddress || undefined,
//           currentAddress: modalEmployee.currentAddress || undefined,
//           bankName: modalEmployee.bankName || undefined,
//           accountNumber: modalEmployee.accountNumber || undefined,
//           ifscCode: modalEmployee.ifscCode || undefined,
//           bankBranchName: modalEmployee.bankBranchName || undefined,
//           fathersName: modalEmployee.fathersName || undefined,
//           fathersContactNo: modalEmployee.fathersContactNo || undefined,
//           mothersName: modalEmployee.mothersName || undefined,
//           mothersContactNo: modalEmployee.mothersContactNo || undefined,
//           spouseName: modalEmployee.spouseName || undefined,
//           spouseContactNo: modalEmployee.spouseContactNo || undefined,
//           siblings: modalEmployee.siblings || undefined,
//           bloodGroup: modalEmployee.bloodGroup || undefined,
//           hasMedicalInsurance: modalEmployee.hasMedicalInsurance || undefined,
//           hireDate: modalEmployee.hireDate || undefined,
//           emergencyContact: modalEmployee.emergencyContact || undefined,
//         }),
//       };

//       console.log('Sending employee data:', employeeData); // Log payload for debugging

//       if (modalType === 'add') {
//         response = await axios.post(`${BASE_URL}/admin/addemployees`, employeeData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setEmployees((prev) => [...prev, response.data]);
//       } else {
//         response = await axios.put(
//           `${BASE_URL}/admin/editemployees/${modalEmployee._id}`,
//           employeeData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setEmployees((prev) =>
//           prev.map((emp, idx) => (idx === modalIndex ? response.data : emp))
//         );
//       }
//       setModalOpen(false);
//       setModalEmployee(initialEmployee);
//       setModalIndex(null);
//       setIsEditing(false);
//       setError(null);
//     } catch (err) {
//       console.error(`${modalType === 'add' ? 'Add' : 'Edit'} Employee Error:`, err.response?.data || err.message);
//       if (err.response?.status === 401) {
//         setError('Session expired or unauthorized. Please log in again.');
//         localStorage.removeItem('token');
//         localStorage.removeItem('userEmail');
//         navigate('/login');
//       } else if (err.response?.status === 403) {
//         setError('Unauthorized: Admin access required.');
//       } else if (err.response?.status === 400) {
//         setError(err.response.data.message || 'Invalid input data. Please check the provided fields.');
//       } else {
//         setError(err.response?.data?.message || `Failed to ${modalType === 'add' ? 'add' : 'edit'} employee`);
//       }
//     }
//   };

//   // Delete employee
//   const handleDeleteEmployee = async () => {
//     if (!token) {
//       setError('No authentication token found. Please log in.');
//       navigate('/login');
//       return;
//     }

//     const employeeId = employees[deleteIndex]?._id;
//     console.log('Attempting to delete employee with _id:', employeeId); // Log _id for debugging

//     if (!employeeId) {
//       setError('Employee ID (_id) is missing. Please try again.');
//       setDeleteIndex(null);
//       return;
//     }

//     try {
//       await axios.delete(`${BASE_URL}/admin/deleteemployees/${employeeId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setEmployees((prev) => prev.filter((_, idx) => idx !== deleteIndex));
//       setDeleteIndex(null);
//       setError(null);
//     } catch (err) {
//       console.error('Delete Employee Error:', err.response?.data || err.message);
//       if (err.response?.status === 401) {
//         setError('Session expired or unauthorized. Please log in again.');
//         localStorage.removeItem('token');
//         localStorage.removeItem('userEmail');
//         navigate('/login');
//       } else if (err.response?.status === 403) {
//         setError('Unauthorized: Admin access required.');
//       } else if (err.response?.status === 400) {
//         setError(err.response.data.message || 'Invalid employee ID.');
//       } else if (err.response?.status === 404) {
//         setError('Employee not found.');
//       } else {
//         setError(err.response?.data?.message || 'Failed to delete employee');
//       }
//       setDeleteIndex(null);
//     }
//   };

//   // Table columns to show
//   const tableColumns = [
//     { label: 'Image', key: 'profileImage' },
//     { label: 'Employee ID', key: 'employeeId' },
//     { label: 'Name', key: 'fullName' },
//     { label: 'Email', key: 'email' },
//     { label: 'Department', key: 'department' },
//     { label: 'Position', key: 'position' },
//     { label: 'Actions', key: 'actions' },
//   ];

//   // Fields for add modal
//   const addFields = [
//     { label: 'First Name', key: 'firstName', type: 'text', required: true },
//     { label: 'Last Name', key: 'lastName', type: 'text', required: true },
//     { label: 'Email', key: 'email', type: 'email', required: true },
//     { label: 'Department', key: 'department', type: 'text', required: true },
//     { label: 'Position', key: 'position', type: 'text', required: true },
//     { label: 'Date of Joining', key: 'dateOfJoining', type: 'date', required: true },
//     { label: 'Manager', key: 'manager', type: 'text', required: true },
//     { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
//     { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
//   ];

//   // All fields for view/edit modal
//   const detailFields = [
//     { label: 'Employee ID', key: 'employeeId', type: 'text', readOnly: true },
//     { label: 'First Name', key: 'firstName', type: 'text', required: true },
//     { label: 'Last Name', key: 'lastName', type: 'text', required: true },
//     { label: 'Email', key: 'email', type: 'email', required: true },
//     { label: 'Department', key: 'department', type: 'text', required: true },
//     { label: 'Position', key: 'position', type: 'text', required: true },
//     { label: 'Date of Joining', key: 'dateOfJoining', type: 'date', required: true },
//     { label: 'Manager', key: 'manager', type: 'text', required: true },
//     { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
//     { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
//     { label: 'Official DOB', key: 'officialDateOfBirth', type: 'date' },
//     { label: 'Actual DOB', key: 'actualDateOfBirth', type: 'date' },
//     { label: 'Primary Phone', key: 'primaryPhoneNumber', type: 'text' },
//     { label: 'Secondary Phone', key: 'secondaryPhoneNumber', type: 'text' },
//     { label: 'Personal Email', key: 'personalEmailId', type: 'email' },
//     { label: 'Permanent Address', key: 'permanentResidentialAddress', type: 'text' },
//     { label: 'Current Address', key: 'currentAddress', type: 'text' },
//     { label: 'Bank Name', key: 'bankName', type: 'text' },
//     { label: 'Account Number', key: 'accountNumber', type: 'text' },
//     { label: 'IFSC Code', key: 'ifscCode', type: 'text' },
//     { label: 'Bank Branch', key: 'bankBranchName', type: 'text' },
//     { label: 'Father’s Name', key: 'fathersName', type: 'text' },
//     { label: 'Father’s Contact', key: 'fathersContactNo', type: 'text' },
//     { label: 'Mother’s Name', key: 'mothersName', type: 'text' },
//     { label: 'Mother’s Contact', key: 'mothersContactNo', type: 'text' },
//     { label: 'Spouse Name', key: 'spouseName', type: 'text' },
//     { label: 'Spouse Contact', key: 'spouseContactNo', type: 'text' },
//     { label: 'Siblings', key: 'siblings', type: 'text' },
//     { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
//     { label: 'Medical Insurance', key: 'hasMedicalInsurance', type: 'text' },
//     { label: 'Hire Date', key: 'hireDate', type: 'date' },
//     { label: 'Emergency Contact', key: 'emergencyContact', type: 'text' },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
//       <div className="fixed inset-y-0 left-0 z-50 md:sticky md:z-40 w-64 md:w-auto">
//         <AdminSidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
//       </div>
//       <div className="flex-1 flex flex-col min-h-screen">
//         <div className="sticky top-0 z-30">
//           <Header isLoggedIn={!!token} onToggleSidebar={toggleSidebar} />
//         </div>
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//           <div className="max-w-full mx-auto">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-800">Employee List</h1>
//               <button
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow text-sm sm:text-base"
//                 onClick={() => openModal('add')}
//               >
//                 <FaPlus /> Add Employee
//               </button>
//             </div>
//             {error && (
//               <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
//                 {error}
//                 <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
//                   <FaTimes size={16} />
//                 </button>
//               </div>
//             )}
//             {loading ? (
//               <div className="text-center text-blue-400 py-8">Loading...</div>
//             ) : (
//               <div className="bg-white rounded-xl shadow border border-blue-100 overflow-x-auto">
//                 <table className="min-w-full text-xs sm:text-sm">
//                   <thead>
//                     <tr className="bg-blue-50 text-blue-800">
//                       {tableColumns.map((col) => (
//                         <th key={col.key} className="p-2 sm:p-3 text-left font-semibold whitespace-nowrap">
//                           {col.label}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {employees.length === 0 ? (
//                       <tr>
//                         <td colSpan={tableColumns.length} className="text-center text-blue-400 py-8">
//                           No employees found. Click "Add Employee" to add one!
//                         </td>
//                       </tr>
//                     ) : (
//                       employees.map((emp, idx) => (
//                         <tr
//                           key={emp._id || idx}
//                           className="border-b hover:bg-blue-50 transition cursor-pointer"
//                           onClick={() => openModal('view', emp, idx)}
//                         >
//                           <td className="p-2 sm:p-3">
//                             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center">
//                               {emp.profileImage ? (
//                                 <img src={emp.profileImage} alt="Profile" className="w-full h-full object-cover" />
//                               ) : (
//                                 <FaUser size={16} className="text-blue-400" />
//                               )}
//                             </div>
//                           </td>
//                           <td className="p-2 sm:p-3 font-mono">{emp.employeeId || 'N/A'}</td>
//                           <td className="p-2 sm:p-3 font-semibold">
//                             {emp.firstName} {emp.lastName}
//                           </td>
//                           <td className="p-2 sm:p-3 truncate max-w-[150px] sm:max-w-[200px]">{emp.email || 'N/A'}</td>
//                           <td className="p-2 sm:p-3">{emp.department || 'N/A'}</td>
//                           <td className="p-2 sm:p-3">{emp.position || 'N/A'}</td>
//                           <td className="p-2 sm:p-3 flex gap-1 sm:gap-2">
//                             <button
//                               className="p-1 sm:p-2 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
//                               title="Edit"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 openModal('view', emp, idx);
//                                 setIsEditing(true);
//                               }}
//                             >
//                               <FaEdit size={12} />
//                             </button>
//                             <button
//                               className="p-1 sm:p-2 rounded bg-red-100 text-red-800 hover:bg-red-200"
//                               title="Delete"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setDeleteIndex(idx);
//                               }}
//                             >
//                               <FaTrash size={12} />
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </main>

//         {/* Modal for Add/View/Edit */}
//         {modalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
//             <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg sm:text-xl font-bold text-blue-800">
//                   {modalType === 'add' ? 'Add Employee' : isEditing ? 'Edit Employee' : 'Employee Details'}
//                 </h2>
//                 <div className="flex gap-2">
//                   {modalType !== 'add' && !isEditing && (
//                     <button
//                       className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-sm"
//                       onClick={() => setIsEditing(true)}
//                     >
//                       <FaPen size={12} /> Edit
//                     </button>
//                   )}
//                   <button
//                     onClick={() => {
//                       setModalOpen(false);
//                       setModalEmployee(initialEmployee);
//                       setModalIndex(null);
//                       setIsEditing(false);
//                       setError(null);
//                     }}
//                     className="text-blue-600 hover:text-blue-800 text-lg"
//                   >
//                     <FaTimes size={16} />
//                   </button>
//                 </div>
//               </div>
//               {/* Profile Image */}
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="relative">
//                   <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
//                     {modalEmployee.profileImage ? (
//                       <img
//                         src={modalEmployee.profileImage}
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <FaUser size={32} className="text-blue-400" />
//                     )}
//                   </div>
//                   {isEditing && (
//                     <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1 sm:p-2 rounded-full cursor-pointer transition-colors">
//                       <FaCamera size={12} />
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleModalImage}
//                         className="hidden"
//                       />
//                     </label>
//                   )}
//                 </div>
//                 <div>
//                   <div className="font-semibold text-base sm:text-lg text-blue-800">
//                     {modalEmployee.firstName} {modalEmployee.lastName}
//                   </div>
//                   <div className="text-blue-600 text-xs sm:text-sm">{modalEmployee.position || 'N/A'}</div>
//                   <div className="text-blue-400 text-xs">{modalEmployee.department || 'N/A'}</div>
//                 </div>
//               </div>
//               {/* Form Fields */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {(modalType === 'add' ? addFields : detailFields).map((field) => (
//                   <div key={field.key}>
//                     <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                       {field.label}
//                       {field.required && '*'}
//                     </label>
//                     {isEditing && field.type !== 'select' && !field.readOnly ? (
//                       <input
//                         type={field.type}
//                         value={modalEmployee[field.key] || ''}
//                         onChange={(e) => handleModalChange(field.key, e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
//                       />
//                     ) : isEditing && field.type === 'select' ? (
//                       <select
//                         value={modalEmployee[field.key] || ''}
//                         onChange={(e) => handleModalChange(field.key, e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
//                       >
//                         {field.options.map((option) => (
//                           <option key={option} value={option}>
//                             {option.charAt(0).toUpperCase() + option.slice(1)}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="text-sm text-blue-800">
//                         {modalEmployee[field.key] || 'N/A'}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               {isEditing && (
//                 <div className="flex justify-end mt-4 sm:mt-6 gap-2">
//                   <button
//                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-300"
//                     onClick={() => {
//                       if (modalType === 'add') {
//                         setModalOpen(false);
//                         setModalEmployee(initialEmployee);
//                         setModalIndex(null);
//                       } else {
//                         setIsEditing(false);
//                       }
//                       setError(null);
//                     }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm sm:text-base"
//                     onClick={handleSaveEmployee}
//                   >
//                     <FaSave /> Save
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {deleteIndex !== null && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm p-4 sm:p-6">
//               <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-4">Delete Employee</h2>
//               <p className="mb-4 sm:mb-6 text-sm sm:text-base">
//                 Are you sure you want to delete{' '}
//                 <span className="font-semibold text-blue-800">
//                   {employees[deleteIndex]?.firstName} {employees[deleteIndex]?.lastName}
//                 </span>
//                 ?
//               </p>
//               <div className="flex justify-end gap-2">
//                 <button
//                   className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm sm:text-base hover:bg-gray-300"
//                   onClick={() => setDeleteIndex(null)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-sm sm:text-base hover:bg-red-700"
//                   onClick={handleDeleteEmployee}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeListPage;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaUser,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaCamera,
  FaTimes,
  FaPen,
} from 'react-icons/fa';
import Header from '../../components/common/Header';
import AdminSidebar from '../../components/common/AdminSidebar';
import { useNavigate } from 'react-router-dom';

// Base URL for API
const BASE_URL = 'https://task-manager-backend-vqen.onrender.com/api';

// Initial employee fields (aligned with backend requirements)
const initialEmployee = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  position: '',
  dateOfJoining: '',
  manager: '',
  role: 'employee',
  profileImage: null,
  officialDateOfBirth: '',
  actualDateOfBirth: '',
  primaryPhoneNumber: '',
  secondaryPhoneNumber: '',
  personalEmailId: '',
  permanentResidentialAddress: '',
  currentAddress: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  bankBranchName: '',
  fathersName: '',
  fathersContactNo: '',
  mothersName: '',
  mothersContactNo: '',
  spouseName: '',
  spouseContactNo: '',
  siblings: '',
  bloodGroup: '',
  hasMedicalInsurance: '',
  employeeId: '',
  hireDate: '',
  workLocation: '',
  emergencyContact: '',
};

const EmployeeListPage = () => {
  // Sidebar state
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  // Employees state
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'view'
  const [modalEmployee, setModalEmployee] = useState(initialEmployee);
  const [modalIndex, setModalIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Delete confirmation
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Navigation for redirect
  const navigate = useNavigate();

  // Retrieve token and email from localStorage
  const token = localStorage.getItem('token') || '';
  const email = localStorage.getItem('userEmail') || '';

  // Log token and email for debugging
  useEffect(() => {
    console.log('Auth Token:', token);
    console.log('User Email:', email);
    if (!token) {
      setError('Please log in to view employees.');
      navigate('/login');
    }
  }, [token, email, navigate]);

  // Fetch all employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/admin/allemployees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const employeesData = Array.isArray(response.data) ? response.data : response.data.employees || [];
        console.log('Fetched employees:', employeesData); // Log fetched employees
        setEmployees(employeesData);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Employees Error:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          setError('Session expired or unauthorized. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          navigate('/login');
        } else if (err.message.includes('Network Error')) {
          setError('Failed to connect to the server. Please check your network or server configuration.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch employees');
        }
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [token, navigate]);

  // Handle open modal for add or view
  const openModal = (type, employee = initialEmployee, index = null) => {
    setModalType(type);
    setModalEmployee({
      ...initialEmployee,
      ...employee,
      email: employee.email || (type === 'add' ? '' : email),
      role: employee.role || 'employee',
    });
    setModalIndex(index);
    setIsEditing(type === 'add');
    setModalOpen(true);
  };

  // Handle input change in modal
  const handleModalChange = (field, value) => {
    setModalEmployee((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image upload in modal
  const handleModalImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setModalEmployee((prev) => ({
          ...prev,
          profileImage: ev.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save employee (add or update)
  const handleSaveEmployee = async () => {
    if (!token) {
      setError('No authentication token found. Please log in.');
      navigate('/login');
      return;
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'department', 'position', 'dateOfJoining', 'manager', 'role'];
    const missingFields = requiredFields.filter((field) => !modalEmployee[field]);
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(modalEmployee.email)) {
      setError('Invalid email format.');
      return;
    }

    try {
      let response;
      const employeeData = {
        firstName: modalEmployee.firstName,
        lastName: modalEmployee.lastName,
        email: modalEmployee.email,
        department: modalEmployee.department,
        position: modalEmployee.position,
        dateOfJoining: modalEmployee.dateOfJoining,
        manager: modalEmployee.manager,
        role: modalEmployee.role,
        workLocation: modalEmployee.workLocation || undefined,
        profileImage: modalEmployee.profileImage || undefined,
        // Include optional fields for edit mode only
        ...(modalType === 'view' && {
          officialDateOfBirth: modalEmployee.officialDateOfBirth || undefined,
          actualDateOfBirth: modalEmployee.actualDateOfBirth || undefined,
          primaryPhoneNumber: modalEmployee.primaryPhoneNumber || undefined,
          secondaryPhoneNumber: modalEmployee.secondaryPhoneNumber || undefined,
          personalEmailId: modalEmployee.personalEmailId || undefined,
          permanentResidentialAddress: modalEmployee.permanentResidentialAddress || undefined,
          currentAddress: modalEmployee.currentAddress || undefined,
          bankName: modalEmployee.bankName || undefined,
          accountNumber: modalEmployee.accountNumber || undefined,
          ifscCode: modalEmployee.ifscCode || undefined,
          bankBranchName: modalEmployee.bankBranchName || undefined,
          fathersName: modalEmployee.fathersName || undefined,
          fathersContactNo: modalEmployee.fathersContactNo || undefined,
          mothersName: modalEmployee.mothersName || undefined,
          mothersContactNo: modalEmployee.mothersContactNo || undefined,
          spouseName: modalEmployee.spouseName || undefined,
          spouseContactNo: modalEmployee.spouseContactNo || undefined,
          siblings: modalEmployee.siblings || undefined,
          bloodGroup: modalEmployee.bloodGroup || undefined,
          hasMedicalInsurance: modalEmployee.hasMedicalInsurance || undefined,
          hireDate: modalEmployee.hireDate || undefined,
          emergencyContact: modalEmployee.emergencyContact || undefined,
        }),
      };

      console.log('Sending employee data:', employeeData); // Log payload for debugging

      if (modalType === 'add') {
        response = await axios.post(`${BASE_URL}/admin/addemployees`, employeeData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees((prev) => [...prev, response.data]);
      } else {
        response = await axios.put(
          `${BASE_URL}/admin/editemployees/${modalEmployee._id}`,
          employeeData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees((prev) =>
          prev.map((emp, idx) => (idx === modalIndex ? response.data : emp))
        );
      }
      setModalOpen(false);
      setModalEmployee(initialEmployee);
      setModalIndex(null);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error(`${modalType === 'add' ? 'Add' : 'Edit'} Employee Error:`, err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('Session expired or unauthorized. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('Unauthorized: Admin access required.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid input data. Please check the provided fields.');
      } else {
        setError(err.response?.data?.message || `Failed to ${modalType === 'add' ? 'add' : 'edit'} employee`);
      }
    }
  };

  // Delete employee
  const handleDeleteEmployee = async () => {
    if (!token) {
      setError('No authentication token found. Please log in.');
      navigate('/login');
      return;
    }

    const employeeId = employees[deleteIndex]?._id;
    console.log('Attempting to delete employee with _id:', employeeId); // Log _id for debugging

    if (!employeeId) {
      setError('Employee ID (_id) is missing. Please try again.');
      setDeleteIndex(null);
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/admin/deleteemployees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees((prev) => prev.filter((_, idx) => idx !== deleteIndex));
      setDeleteIndex(null);
      setError(null);
    } catch (err) {
      console.error('Delete Employee Error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('Session expired or unauthorized. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('Unauthorized: Admin access required.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid employee ID.');
      } else if (err.response?.status === 404) {
        setError('Employee not found.');
      } else {
        setError(err.response?.data?.message || 'Failed to delete employee');
      }
      setDeleteIndex(null);
    }
  };

  // Table columns to show
  const tableColumns = [
    { label: 'S.No.', key: 'serialNumber' },
    { label: 'Image', key: 'profileImage' },
    { label: 'Name', key: 'fullName' },
    { label: 'Email', key: 'email' },
    { label: 'Department', key: 'department' },
    { label: 'Position', key: 'position' },
    { label: 'Actions', key: 'actions' },
  ];

  // Fields for add modal
  const addFields = [
    { label: 'First Name', key: 'firstName', type: 'text', required: true },
    { label: 'Last Name', key: 'lastName', type: 'text', required: true },
    { label: 'Email', key: 'email', type: 'email', required: true },
    { label: 'Department', key: 'department', type: 'text', required: true },
    { label: 'Position', key: 'position', type: 'text', required: true },
    { label: 'Date of Joining', key: 'dateOfJoining', type: 'date', required: true },
    { label: 'Manager', key: 'manager', type: 'text', required: true },
    { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
    { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
  ];

  // All fields for view/edit modal
  const detailFields = [
    { label: 'Employee ID', key: 'employeeId', type: 'text', readOnly: true },
    { label: 'First Name', key: 'firstName', type: 'text', required: true },
    { label: 'Last Name', key: 'lastName', type: 'text', required: true },
    { label: 'Email', key: 'email', type: 'email', required: true },
    { label: 'Department', key: 'department', type: 'text', required: true },
    { label: 'Position', key: 'position', type: 'text', required: true },
    { label: 'Date of Joining', key: 'dateOfJoining', type: 'date', required: true },
    { label: 'Manager', key: 'manager', type: 'text', required: true },
    { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
    { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
    { label: 'Official DOB', key: 'officialDateOfBirth', type: 'date' },
    { label: 'Actual DOB', key: 'actualDateOfBirth', type: 'date' },
    { label: 'Primary Phone', key: 'primaryPhoneNumber', type: 'text' },
    { label: 'Secondary Phone', key: 'secondaryPhoneNumber', type: 'text' },
    { label: 'Personal Email', key: 'personalEmailId', type: 'email' },
    { label: 'Permanent Address', key: 'permanentResidentialAddress', type: 'text' },
    { label: 'Current Address', key: 'currentAddress', type: 'text' },
    { label: 'Bank Name', key: 'bankName', type: 'text' },
    { label: 'Account Number', key: 'accountNumber', type: 'text' },
    { label: 'IFSC Code', key: 'ifscCode', type: 'text' },
    { label: 'Bank Branch', key: 'bankBranchName', type: 'text' },
    { label: 'Father’s Name', key: 'fathersName', type: 'text' },
    { label: 'Father’s Contact', key: 'fathersContactNo', type: 'text' },
    { label: 'Mother’s Name', key: 'mothersName', type: 'text' },
    { label: 'Mother’s Contact', key: 'mothersContactNo', type: 'text' },
    { label: 'Spouse Name', key: 'spouseName', type: 'text' },
    { label: 'Spouse Contact', key: 'spouseContactNo', type: 'text' },
    { label: 'Siblings', key: 'siblings', type: 'text' },
    { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
    { label: 'Medical Insurance', key: 'hasMedicalInsurance', type: 'text' },
    { label: 'Hire Date', key: 'hireDate', type: 'date' },
    { label: 'Emergency Contact', key: 'emergencyContact', type: 'text' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="fixed inset-y-0 left-0 z-50 md:sticky md:z-40 w-64 md:w-auto">
        <AdminSidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="sticky top-0 z-30">
          <Header isLoggedIn={!!token} onToggleSidebar={toggleSidebar} />
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-800">Employee List</h1>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow text-sm sm:text-base"
                onClick={() => openModal('add')}
              >
                <FaPlus /> Add Employee
              </button>
            </div>
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
                {error}
                <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
                  <FaTimes size={16} />
                </button>
              </div>
            )}
            {loading ? (
              <div className="text-center text-blue-400 py-8">Loading...</div>
            ) : (
              <div className="bg-white rounded-xl shadow border border-blue-100 overflow-x-auto">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-blue-50 text-blue-800">
                      {tableColumns.map((col) => (
                        <th key={col.key} className="p-2 sm:p-3 text-left font-semibold whitespace-nowrap">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan={tableColumns.length} className="text-center text-blue-400 py-8">
                          No employees found. Click "Add Employee" to add one!
                        </td>
                      </tr>
                    ) : (
                      employees.map((emp, idx) => (
                        <tr
                          key={emp._id || idx}
                          className="border-b hover:bg-blue-50 transition cursor-pointer"
                          onClick={() => openModal('view', emp, idx)}
                        >
                          <td className="p-2 sm:p-3">{idx + 1}</td>
                          <td className="p-2 sm:p-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center">
                              {emp.profileImage ? (
                                <img src={emp.profileImage} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <FaUser size={16} className="text-blue-400" />
                              )}
                            </div>
                          </td>
                          <td className="p-2 sm:p-3 font-semibold">
                            {emp.firstName} {emp.lastName}
                          </td>
                          <td className="p-2 sm:p-3 truncate max-w-[150px] sm:max-w-[200px]">{emp.email || 'N/A'}</td>
                          <td className="p-2 sm:p-3">{emp.department || 'N/A'}</td>
                          <td className="p-2 sm:p-3">{emp.position || 'N/A'}</td>
                          <td className="p-2 sm:p-3 flex gap-1 sm:gap-2">
                            <button
                              className="p-1 sm:p-2 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              title="Edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal('view', emp, idx);
                                setIsEditing(true);
                              }}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              className="p-1 sm:p-2 rounded bg-red-100 text-red-800 hover:bg-red-200"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteIndex(idx);
                              }}
                            >
                              <FaTrash size={12} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Modal for Add/View/Edit */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-blue-800">
                  {modalType === 'add' ? 'Add Employee' : isEditing ? 'Edit Employee' : 'Employee Details'}
                </h2>
                <div className="flex gap-2">
                  {modalType !== 'add' && !isEditing && (
                    <button
                      className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <FaPen size={12} /> Edit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setModalEmployee(initialEmployee);
                      setModalIndex(null);
                      setIsEditing(false);
                      setError(null);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-lg"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>
              {/* Profile Image */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
                    {modalEmployee.profileImage ? (
                      <img
                        src={modalEmployee.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser size={32} className="text-blue-400" />
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1 sm:p-2 rounded-full cursor-pointer transition-colors">
                      <FaCamera size={12} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleModalImage}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-base sm:text-lg text-blue-800">
                    {modalEmployee.firstName} {modalEmployee.lastName}
                  </div>
                  <div className="text-blue-600 text-xs sm:text-sm">{modalEmployee.position || 'N/A'}</div>
                  <div className="text-blue-400 text-xs">{modalEmployee.department || 'N/A'}</div>
                </div>
              </div>
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(modalType === 'add' ? addFields : detailFields).map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
                      {field.label}
                      {field.required && '*'}
                    </label>
                    {isEditing && field.type !== 'select' && !field.readOnly ? (
                      <input
                        type={field.type}
                        value={modalEmployee[field.key] || ''}
                        onChange={(e) => handleModalChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                      />
                    ) : isEditing && field.type === 'select' ? (
                      <select
                        value={modalEmployee[field.key] || ''}
                        onChange={(e) => handleModalChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-sm text-blue-800">
                        {modalEmployee[field.key] || 'N/A'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="flex justify-end mt-4 sm:mt-6 gap-2">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-300"
                    onClick={() => {
                      if (modalType === 'add') {
                        setModalOpen(false);
                        setModalEmployee(initialEmployee);
                        setModalIndex(null);
                      } else {
                        setIsEditing(false);
                      }
                      setError(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    onClick={handleSaveEmployee}
                  >
                    <FaSave /> Save
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteIndex !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-4">Delete Employee</h2>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-blue-800">
                  {employees[deleteIndex]?.firstName} {employees[deleteIndex]?.lastName}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm sm:text-base hover:bg-gray-300"
                  onClick={() => setDeleteIndex(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-sm sm:text-base hover:bg-red-700"
                  onClick={handleDeleteEmployee}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeListPage;