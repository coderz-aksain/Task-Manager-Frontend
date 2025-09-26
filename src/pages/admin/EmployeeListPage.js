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
//   FaFilePdf,
//   FaSpinner,
//   FaEllipsisH,
//   FaSearch,
// } from 'react-icons/fa';
// import Header from '../../components/common/Header';
// import AdminSidebar from '../../components/common/AdminSidebar';
// import { useNavigate } from 'react-router-dom';

// // Base URL for API
// const BASE_URL = 'https://task-manager-backend-xs5s.onrender.com/api';

// // Initial employee fields
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
//   aadharFront: null,
//   aadharBack: null,
//   bankPassbook: null,
//   panCard: null,
// };

// // Helper functions
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return 'N/A';
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = date.toLocaleString('en-US', { month: 'long' });
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// };

// const parseDate = (dateString) => {
//   if (!dateString) return '';
//   const [day, month, year] = dateString.split('/');
//   const monthIndex = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ].indexOf(month);
//   if (monthIndex === -1 || !day || !year) return '';
//   return new Date(year, monthIndex, day).toISOString().split('T')[0];
// };

// const EmployeeListPage = () => {
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState('add');
//   const [modalEmployee, setModalEmployee] = useState(initialEmployee);
//   const [modalIndex, setModalIndex] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [deleteIndex, setDeleteIndex] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSearch, setShowSearch] = useState(false);
//   const [showActions, setShowActions] = useState(null);

//   const navigate = useNavigate();
//   const token = localStorage.getItem('token') || '';
//   const email = localStorage.getItem('userEmail') || '';

//   useEffect(() => {
//     if (!token) {
//       setError('Please log in to view employees.');
//       navigate('/login');
//     }
//   }, [token, email, navigate]);

//   // useEffect(() => {
//   //   const fetchEmployees = async () => {
//   //     if (!token) {
//   //       setError('No authentication token found. Please log in.');
//   //       setLoading(false);
//   //       navigate('/login');
//   //       return;
//   //     }
//   //     try {
//   //       setLoading(true);
//   //       const response = await axios.get(`${BASE_URL}/admin/allemployees`, {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       });
//   //       const employeesData = Array.isArray(response.data) ? response.data : response.data.employees || [];
//   //       setEmployees(employeesData);
//   //       setLoading(false);
//   //     } catch (err) {
//   //       if (err.response?.status === 401) {
//   //         setError('Session expired or unauthorized. Please log in again.');
//   //         localStorage.removeItem('token');
//   //         localStorage.removeItem('userEmail');
//   //         navigate('/login');
//   //       } else if (err.message.includes('Network Error')) {
//   //         setError('Failed to connect to the server. Please check your network or server configuration.');
//   //       } else {
//   //         setError(err.response?.data?.message || 'Failed to fetch employees');
//   //       }
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchEmployees();
//   // }, [token, navigate]);

//   useEffect(() => {
//   const fetchEmployees = async () => {
//     if (!token) {
//       setError('No authentication token found. Please log in.');
//       setLoading(false);
//       navigate('/login');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.get(`${BASE_URL}/admin/allemployees`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const employeesData = Array.isArray(response.data) ? response.data : response.data.employees || [];
//       setEmployees(employeesData.map(emp => ({
//         ...emp,
//         dateOfJoining: emp.dateOfJoining ? formatDate(emp.dateOfJoining) : '',
//         officialDateOfBirth: emp.officialDateOfBirth ? formatDate(emp.officialDateOfBirth) : '',
//         actualDateOfBirth: emp.actualDateOfBirth ? formatDate(emp.actualDateOfBirth) : '',
//         hireDate: emp.hireDate ? formatDate(emp.hireDate) : '',
//       })));
//       setLoading(false);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setError('Session expired or unauthorized. Please log in again.');
//         localStorage.removeItem('token');
//         localStorage.removeItem('userEmail');
//         navigate('/login');
//       } else if (err.message.includes('Network Error')) {
//         setError('Failed to connect to the server. Please check your network or server configuration.');
//       } else {
//         setError(err.response?.data?.message || 'Failed to fetch employees');
//       }
//       setLoading(false);
//     }
//   };
//   fetchEmployees();
// }, [token, navigate]);

// const handleSaveEmployee = async () => {
//   if (!token) {
//     setError('No authentication token found. Please log in.');
//     navigate('/login');
//     return;
//   }
//   const requiredFields = ['firstName', 'lastName', 'email', 'department', 'position', 'dateOfJoining', 'manager', 'role'];
//   const missingFields = requiredFields.filter((field) => !modalEmployee[field]);
//   if (missingFields.length > 0) {
//     setError(`Missing required fields: ${missingFields.join(', ')}`);
//     return;
//   }
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(modalEmployee.email)) {
//     setError('Invalid email format.');
//     return;
//   }
//   const dateRegex = /^\d{2}\/[A-Za-z]+\/\d{4}$/;
//   const dateFields = ['dateOfJoining', 'officialDateOfBirth', 'actualDateOfBirth', 'hireDate'];
//   for (const field of dateFields) {
//     if (modalEmployee[field] && !dateRegex.test(modalEmployee[field])) {
//       setError(`Invalid date format for ${field}. Use DD/MMMM/YYYY (e.g., 01/January/2025).`);
//       return;
//     }
//   }
//   try {
//     setSaving(true);
//     let response;
//     const employeeData = new FormData();
//     Object.entries({
//       firstName: modalEmployee.firstName,
//       lastName: modalEmployee.lastName,
//       email: modalEmployee.email,
//       department: modalEmployee.department,
//       position: modalEmployee.position,
//       dateOfJoining: modalEmployee.dateOfJoining ? parseDate(modalEmployee.dateOfJoining) : undefined,
//       manager: modalEmployee.manager,
//       role: modalEmployee.role,
//       workLocation: modalEmployee.workLocation || undefined,
//       profileImage: modalEmployee.profileImage instanceof File ? modalEmployee.profileImage : undefined,
//       officialDateOfBirth: modalEmployee.officialDateOfBirth ? parseDate(modalEmployee.officialDateOfBirth) : undefined,
//       actualDateOfBirth: modalEmployee.actualDateOfBirth ? parseDate(modalEmployee.actualDateOfBirth) : undefined,
//       primaryPhoneNumber: modalEmployee.primaryPhoneNumber || undefined,
//       secondaryPhoneNumber: modalEmployee.secondaryPhoneNumber || undefined,
//       personalEmailId: modalEmployee.personalEmailId || undefined,
//       permanentResidentialAddress: modalEmployee.permanentResidentialAddress || undefined,
//       currentAddress: modalEmployee.currentAddress || undefined,
//       bankName: modalEmployee.bankName || undefined,
//       accountNumber: modalEmployee.accountNumber || undefined,
//       ifscCode: modalEmployee.ifscCode || undefined,
//       bankBranchName: modalEmployee.bankBranchName || undefined,
//       fathersName: modalEmployee.fathersName || undefined,
//       fathersContactNo: modalEmployee.fathersContactNo || undefined,
//       mothersName: modalEmployee.mothersName || undefined,
//       mothersContactNo: modalEmployee.mothersContactNo || undefined,
//       spouseName: modalEmployee.spouseName || undefined,
//       spouseContactNo: modalEmployee.spouseContactNo || undefined,
//       siblings: modalEmployee.siblings || undefined,
//       bloodGroup: modalEmployee.bloodGroup || undefined,
//       hasMedicalInsurance: modalEmployee.hasMedicalInsurance || undefined,
//       hireDate: modalEmployee.hireDate ? parseDate(modalEmployee.hireDate) : undefined,
//       emergencyContact: modalEmployee.emergencyContact || undefined,
//       aadharFront: modalEmployee.aadharFront instanceof File ? modalEmployee.aadharFront : undefined,
//       aadharBack: modalEmployee.aadharBack instanceof File ? modalEmployee.aadharBack : undefined,
//       bankPassbook: modalEmployee.bankPassbook instanceof File ? modalEmployee.bankPassbook : undefined,
//       panCard: modalEmployee.panCard instanceof File ? modalEmployee.panCard : undefined,
//     }).forEach(([key, value]) => {
//       if (value !== undefined && value !== null && value !== '') {
//         employeeData.append(key, value);
//       }
//     });
//     if (modalType === 'add') {
//       response = await axios.post(`${BASE_URL}/admin/addemployees`, employeeData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setEmployees((prev) => [
//         ...prev,
//         {
//           ...response.data.user,
//           dateOfJoining: response.data.user.dateOfJoining ? formatDate(response.data.user.dateOfJoining) : '',
//           officialDateOfBirth: response.data.user.officialDateOfBirth ? formatDate(response.data.user.officialDateOfBirth) : '',
//           actualDateOfBirth: response.data.user.actualDateOfBirth ? formatDate(response.data.user.actualDateOfBirth) : '',
//           hireDate: response.data.user.hireDate ? formatDate(response.data.user.hireDate) : '',
//         },
//       ]);
//     } else {
//       response = await axios.put(
//         `${BASE_URL}/admin/editemployees/${modalEmployee._id}`,
//         employeeData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );
//       setEmployees((prev) =>
//         prev.map((emp, idx) =>
//           idx === modalIndex ? {
//             ...response.data.employee,
//             dateOfJoining: response.data.employee.dateOfJoining ? formatDate(response.data.employee.dateOfJoining) : '',
//             officialDateOfBirth: response.data.employee.officialDateOfBirth ? formatDate(response.data.employee.officialDateOfBirth) : '',
//             actualDateOfBirth: response.data.employee.actualDateOfBirth ? formatDate(response.data.employee.actualDateOfBirth) : '',
//             hireDate: response.data.employee.hireDate ? formatDate(response.data.employee.hireDate) : '',
//           } : emp
//         )
//       );
//     }
//     setModalOpen(false);
//     setModalEmployee(initialEmployee);
//     setModalIndex(null);
//     setIsEditing(false);
//     setError(null);
//     setSaving(false);
//   } catch (err) {
//     setSaving(false);
//     if (err.response?.status === 401) {
//       setError('Session expired or unauthorized. Please log in again.');
//       localStorage.removeItem('token');
//       localStorage.removeItem('userEmail');
//       navigate('/login');
//     } else if (err.response?.status === 403) {
//       setError('Unauthorized: Admin access required.');
//     } else if (err.response?.status === 400) {
//       setError(err.response.data.message || 'Invalid input data. Please check the provided fields.');
//     } else {
//       setError(err.response?.data?.message || `Failed to ${modalType === 'add' ? 'add' : 'edit'} employee`);
//     }
//   }
// };


//   const openModal = (type, employee = initialEmployee, index = null) => {
//     setModalType(type);
//     setModalEmployee({
//       ...initialEmployee,
//       ...employee,
//       email: employee.email || (type === 'add' ? '' : email),
//       role: employee.role || 'employee',
//       dateOfJoining: employee.dateOfJoining ? formatDate(employee.dateOfJoining) : '',
//       officialDateOfBirth: employee.officialDateOfBirth ? formatDate(employee.officialDateOfBirth) : '',
//       actualDateOfBirth: employee.actualDateOfBirth ? formatDate(employee.actualDateOfBirth) : '',
//       hireDate: employee.hireDate ? formatDate(employee.hireDate) : '',
//     });
//     setModalIndex(index);
//     setIsEditing(type === 'add');
//     setModalOpen(true);
//   };

//   const handleModalChange = (field, value) => {
//     setModalEmployee((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleModalImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setModalEmployee((prev) => ({
//         ...prev,
//         profileImage: file,
//       }));
//     }
//   };

//   const handleFileUpload = (field) => (event) => {
//     const file = event.target.files[0];
//     if (file && file.type === 'application/pdf') {
//       if (file.size > 20 * 1024 * 1024) {
//         setError('File size exceeds 20MB limit');
//         return;
//       }
//       setModalEmployee((prev) => ({
//         ...prev,
//         [field]: file,
//       }));
//     } else {
//       setError('Please upload a valid PDF file');
//     }
//   };
//   const handleDeleteEmployee = async () => {
//     if (!token) {
//       setError('No authentication token found. Please log in.');
//       navigate('/login');
//       return;
//     }
//     const employeeId = employees[deleteIndex]?._id;
//     if (!employeeId) {
//       setError('Employee ID (_id) is missing. Please try again.');
//       setDeleteIndex(null);
//       return;
//     }
//     try {
//       setSaving(true);
//       await axios.delete(`${BASE_URL}/admin/deleteemployees/${employeeId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEmployees((prev) => prev.filter((_, idx) => idx !== deleteIndex));
//       setDeleteIndex(null);
//       setError(null);
//       setSaving(false);
//     } catch (err) {
//       setSaving(false);
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

//   const tableColumns = [
//     { label: 'S.No.', key: 'serialNumber' },
//     { label: 'Image', key: 'profileImage' },
//     { label: 'Name', key: 'fullName' },
//     { label: 'Email', key: 'email' },
//     { label: 'Department', key: 'department' },
//     { label: 'Position', key: 'position' },
//     { label: 'Actions', key: 'actions' },
//   ];

//   const addFields = [
//     { label: 'First Name', key: 'firstName', type: 'text', required: true },
//     { label: 'Last Name', key: 'lastName', type: 'text', required: true },
//     { label: 'Email', key: 'email', type: 'email', required: true },
//     { label: 'Department', key: 'department', type: 'text', required: true },
//     { label: 'Position', key: 'position', type: 'text', required: true },
//     { label: 'Date of Joining', key: 'dateOfJoining', type: 'text', placeholder: 'DD/MMMM/YYYY', required: true },
//     { label: 'Manager', key: 'manager', type: 'text', required: true },
//     { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
//     { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
//   ];

//   const detailFields = {
//     personalInfo: [
//       { label: 'Employee ID', key: 'employeeId', type: 'text', readOnly: true },
//       { label: 'First Name', key: 'firstName', type: 'text', required: true },
//       { label: 'Last Name', key: 'lastName', type: 'text', required: true },
//       { label: 'Official DOB', key: 'officialDateOfBirth', type: 'text', placeholder: 'DD/MMMM/YYYY' },
//       { label: 'Actual DOB', key: 'actualDateOfBirth', type: 'text', placeholder: 'DD/MMMM/YYYY' },
//       { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
//       { label: 'Father’s Name', key: 'fathersName', type: 'text' },
//       { label: 'Mother’s Name', key: 'mothersName', type: 'text' },
//       { label: 'Spouse Name', key: 'spouseName', type: 'text' },
//       { label: 'Siblings', key: 'siblings', type: 'text' },
//       { label: 'Medical Insurance', key: 'hasMedicalInsurance', type: 'text' },
//     ],
//     contactInfo: [
//       { label: 'Email', key: 'email', type: 'email', required: true },
//       { label: 'Personal Email', key: 'personalEmailId', type: 'email' },
//       { label: 'Primary Phone', key: 'primaryPhoneNumber', type: 'text' },
//       { label: 'Secondary Phone', key: 'secondaryPhoneNumber', type: 'text' },
//       { label: 'Father’s Contact', key: 'fathersContactNo', type: 'text' },
//       { label: 'Mother’s Contact', key: 'mothersContactNo', type: 'text' },
//       { label: 'Spouse Contact', key: 'spouseContactNo', type: 'text' },
//       { label: 'Emergency Contact', key: 'emergencyContact', type: 'text' },
//       { label: 'Permanent Address', key: 'permanentResidentialAddress', type: 'text' },
//       { label: 'Current Address', key: 'currentAddress', type: 'text' },
//     ],
//     bankingInfo: [
//       { label: 'Bank Name', key: 'bankName', type: 'text' },
//       { label: 'Account Number', key: 'accountNumber', type: 'text' },
//       { label: 'IFSC Code', key: 'ifscCode', type: 'text' },
//       { label: 'Bank Branch', key: 'bankBranchName', type: 'text' },
//     ],
//     employmentInfo: [
//       { label: 'Department', key: 'department', type: 'text', required: true },
//       { label: 'Position', key: 'position', type: 'text', required: true },
//       { label: 'Date of Joining', key: 'dateOfJoining', type: 'text', placeholder: 'DD/MMMM/YYYY', required: true },
//       { label: 'Hire Date', key: 'hireDate', type: 'text', placeholder: 'DD/MMMM/YYYY' },
//       { label: 'Manager', key: 'manager', type: 'text', required: true },
//       { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
//       { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
//     ],
//   };

//   const filteredEmployees = employees.filter((emp) =>
//     `${emp.firstName || ''} ${emp.lastName || ''} ${emp.email || ''} ${emp.department || ''} ${emp.position || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showActions !== null && !e.target.closest(`[data-index="${showActions}"]`) && !e.target.closest('button')) {
//         setShowActions(null);
//       }
//       if (showSearch && !e.target.closest('.search-container') && !e.target.closest('.search-container button')) {
//         setShowSearch(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [showActions, showSearch]);

//   return (
//     <div className="flex min-h-screen bg-white">
//       <div className={`fixed inset-y-0 left-0 z-50 md:sticky md:z-10 w-64 md:w-auto transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
//         <AdminSidebar isOpen={showSidebar} toggleSidebar={() => setShowSidebar((prev) => !prev)} />
//       </div>
//       <div className="flex-1 flex flex-col min-h-screen">
//         <div className="sticky top-0 z-30">
//           <Header isLoggedIn={!!token} onToggleSidebar={() => setShowSidebar((prev) => !prev)} />
//         </div>
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
         
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//               <div className="flex items-center gap-2">
//                 <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">Employee List</h1>
//                 <div className="relative search-container">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       console.log('Search button clicked');
//                       setShowSearch(!showSearch);
//                     }}
//                     className="p-2 bg-blue-600 text-white rounded-full focus:outline-none touch-action-manipulation"
//                   >
//                     <FaSearch />
//                   </button>
//                   {showSearch && (
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder="Search by name, email, department, or position..."
//                       className="absolute top-0 left-full ml-2 w-0 transition-all duration-300 focus:w-[200px] sm:focus:w-[300px] pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base z-30"
//                       autoFocus
//                     />
//                   )}
//                 </div>
//               </div>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   console.log('Add Employee button clicked');
//                   openModal('add');
//                 }}
//                 className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm sm:text-base touch-action-manipulation pointer-events-auto"
//               >
//                 <FaPlus /> Add Employee
//               </button>
//             </div>
//             {error && (
//               <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
//                 {error}
//                 <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 touch-action-manipulation">
//                   <FaTimes size={16} />
//                 </button>
//               </div>
//             )}
//             {loading ? (
//               <div className="text-center text-blue-500 py-8 flex items-center justify-center gap-2">
//                 <FaSpinner className="animate-spin" size={24} />
//                 <span>Loading employees...</span>
//               </div>
//             ) : (
//               <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-4">
//                 {filteredEmployees.length === 0 ? (
//                   <div className="text-center text-blue-500 py-8">
//                     No employees found. Click to add one!
//                   </div>
//                 ) : (
//                   <>
//                     <div className="">
//                       <table className="min-w-full text-xs sm:text-sm">
//                         <thead>
//                           <tr className="bg-gray-200 text-black">
//                             {tableColumns.map((col) => (
//                               <th key={col.key} className="p-2 sm:p-3 text-left font-semibold whitespace-nowrap">
//                                 {col.label}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {filteredEmployees.map((emp, idx) => (
//                             <tr
//                               key={emp._id || `emp-${idx}`}
//                               className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-blue-50 transition cursor-pointer'}
//                             >
//                               <td className="p-2 sm:p-3">{idx + 1}</td>
//                               <td className="p-2 sm:p-3">
//                                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center">
//                                   {emp.profileImage ? (
//                                     <img src={emp.profileImage} alt="Profile" className="w-full h-full object-cover" />
//                                   ) : (
//                                     <FaUser size={16} className="text-blue-500" />
//                                   )}
//                                 </div>
//                               </td>
//                               <td className="p-2 sm:p-3 font-semibold">{emp.firstName} {emp.lastName}</td>
//                               <td className="p-2 sm:p-3 truncate max-w-[150px] sm:max-w-[200px]">{emp.email || 'N/A'}</td>
//                               <td className="p-2 sm:p-3">{emp.department || 'N/A'}</td>
//                               <td className="p-2 sm:p-3">{emp.position || 'N/A'}</td>
//                               <td className="p-2 sm:p-3 relative">
//                                 <button
//                                   data-index={idx}
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     console.log('Action menu toggled for employee:', idx);
//                                     setShowActions(showActions === idx ? null : idx);
//                                   }}
//                                   className="p-1 sm:p-2 rounded bg-gray-200 hover:bg-gray-300 text-blue-700 touch-action-manipulation pointer-events-auto"
//                                 >
//                                   <FaEllipsisH size={12} />
//                                 </button>
//                                 {showActions === idx && (
//                                   <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-30">
//                                     <button
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         console.log('View button clicked for employee:', idx);
//                                         openModal('view', emp, idx);
//                                         setShowActions(null);
//                                       }}
//                                       className="flex items-center w-full px-4 py-2 text-blue-700 hover:bg-blue-100 touch-action-manipulation"
//                                     >
//                                       <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                                         <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 010 5 2.5 2.5 0 010-5m0-2a4.5 4.5 0 110 9 4.5 4.5 0 010-9z"/>
//                                       </svg>
//                                       View
//                                     </button>
//                                     <button
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         console.log('Edit button clicked for employee:', idx);
//                                         openModal('view', emp, idx);
//                                         setIsEditing(true);
//                                         setShowActions(null);
//                                       }}
//                                       className="flex items-center w-full px-4 py-2 text-green-700 hover:bg-green-100 touch-action-manipulation"
//                                     >
//                                       <FaEdit size={12} className="mr-2" />
//                                       Edit
//                                     </button>
//                                     <button
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         console.log('Delete button clicked for employee:', idx);
//                                         setDeleteIndex(idx);
//                                         setShowActions(null);
//                                       }}
//                                       className="flex items-center w-full px-4 py-2 text-red-700 hover:bg-red-100 touch-action-manipulation"
//                                     >
//                                       <FaTrash size={12} className="mr-2" />
//                                       Delete
//                                     </button>
//                                   </div>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                     <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       {filteredEmployees.map((emp, idx) => (
//                         <div
//                           key={emp._id || `emp-${idx}`}
//                           className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
//                         >
//                           <div className="flex items-center gap-4 mb-4">
//                             <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center">
//                               {emp.profileImage ? (
//                                 <img src={emp.profileImage} alt="Profile" className="w-full h-full object-cover" />
//                               ) : (
//                                 <FaUser size={24} className="text-blue-500" />
//                               )}
//                             </div>
//                             <div>
//                               <h3 className="font-semibold text-blue-700">{emp.firstName} {emp.lastName}</h3>
//                               <p className="text-sm text-blue-600">{emp.position || 'N/A'}</p>
//                             </div>
//                           </div>
//                           <p className="text-sm text-blue-800 mb-2">Email: {emp.email || 'N/A'}</p>
//                           <p className="text-sm text-blue-800 mb-2">Dept: {emp.department || 'N/A'}</p>
//                           <div className="relative">
//                             <button
//                               data-index={idx}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 console.log('Mobile action menu toggled for employee:', idx);
//                                 setShowActions(showActions === idx ? null : idx);
//                               }}
//                               className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-blue-700 touch-action-manipulation pointer-events-auto"
//                             >
//                               <FaEllipsisH size={16} />
//                             </button>
//                             {showActions === idx && (
//                               <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-30">
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     console.log('Mobile View button clicked for employee:', idx);
//                                     openModal('view', emp, idx);
//                                     setShowActions(null);
//                                   }}
//                                   className="flex items-center w-full px-4 py-2 text-blue-700 hover:bg-blue-100 touch-action-manipulation"
//                                 >
//                                   <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                                     <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 010 5 2.5 2.5 0 010-5m0-2a4.5 4.5 0 110 9 4.5 4.5 0 010-9z"/>
//                                   </svg>
//                                   View
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     console.log('Mobile Edit button clicked for employee:', idx);
//                                     openModal('view', emp, idx);
//                                     setIsEditing(true);
//                                     setShowActions(null);
//                                   }}
//                                   className="flex items-center w-full px-4 py-2 text-green-700 hover:bg-green-100 touch-action-manipulation"
//                                 >
//                                   <FaEdit size={12} className="mr-2" />
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     console.log('Mobile Delete button clicked for employee:', idx);
//                                     setDeleteIndex(idx);
//                                     setShowActions(null);
//                                   }}
//                                   className="flex items-center w-full px-4 py-2 text-red-700 hover:bg-red-100 touch-action-manipulation"
//                                 >
//                                   <FaTrash size={12} className="mr-2" />
//                                   Delete
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}
       
//         </main>

//    {modalOpen && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4 sm:p-6" onClick={() => setModalOpen(false)}>
//     <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-6xl max-h-[80vh] overflow-y-auto p-4 sm:p-6 relative" onClick={(e) => e.stopPropagation()}>
//       {saving && (
//         <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
//           <div className="flex items-center gap-2 text-blue-500">
//             <FaSpinner className="animate-spin" size={24} />
//             <span>Saving...</span>
//           </div>
//         </div>
//       )}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg sm:text-xl font-bold text-blue-700">
//           {modalType === 'add' ? 'Add Employee' : isEditing ? 'Edit Employee' : 'Employee Details'}
//         </h2>
//         <div className="flex gap-2">
//           {modalType !== 'add' && !isEditing && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 console.log('Edit button in modal clicked');
//                 setIsEditing(true);
//               }}
//               className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-semibold text-sm touch-action-manipulation"
//             >
//               <FaPen size={12} /> Edit
//             </button>
//           )}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               console.log('Close modal button clicked');
//               setModalOpen(false);
//               setModalEmployee(initialEmployee);
//               setModalIndex(null);
//               setIsEditing(false);
//               setError(null);
//             }}
//             className="text-blue-600 hover:text-blue-800 text-lg touch-action-manipulation"
//           >
//             <FaTimes size={16} />
//           </button>
//         </div>
//       </div>
//       <div className="flex items-center gap-4 mb-6">
//         <div className="relative">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
//             {modalEmployee.profileImage ? (
//               <a
//                 href={modalEmployee.profileImage instanceof File ? URL.createObjectURL(modalEmployee.profileImage) : modalEmployee.profileImage}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <img
//                   src={modalEmployee.profileImage instanceof File ? URL.createObjectURL(modalEmployee.profileImage) : modalEmployee.profileImage}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               </a>
//             ) : (
//               <FaUser size={32} className="text-blue-500" />
//             )}
//           </div>
//           {isEditing && (
//             <label className="absolute bottom-0 right-0 bg-blue-700 hover:bg-blue-800 text-white p-1 sm:p-2 rounded-full cursor-pointer transition-colors touch-action-manipulation">
//               <FaCamera size={12} />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleModalImage}
//                 className="hidden"
//               />
//             </label>
//           )}
//         </div>
//         <div>
//           <div className="font-semibold text-base sm:text-lg text-blue-700">
//             {modalEmployee.firstName} {modalEmployee.lastName}
//           </div>
//           <div className="text-blue-600 text-xs sm:text-sm">{modalEmployee.position || 'N/A'}</div>
//           <div className="text-blue-500 text-xs">{modalEmployee.department || 'N/A'}</div>
//         </div>
//       </div>
//       {modalType === 'add' ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {[
//             { label: 'First Name', key: 'firstName', type: 'text', required: true },
//             { label: 'Last Name', key: 'lastName', type: 'text', required: true },
//             { label: 'Email', key: 'email', type: 'email', required: true },
//             { label: 'Department', key: 'department', type: 'select', options: ['', 'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Procurement'], required: true },
//             { label: 'Position', key: 'position', type: 'text', required: true },
//             { label: 'Date of Joining', key: 'dateOfJoining', type: 'text', placeholder: 'DD/MMMM/YYYY', required: true },
//             { label: 'Manager', key: 'manager', type: 'text', required: true },
//             { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
//             { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
//           ].map((field) => (
//             <div key={field.key}>
//               <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                 {field.label}
//                 {field.required && '*'}
//               </label>
//               {field.type === 'select' ? (
//                 <select
//                   value={modalEmployee[field.key] || ''}
//                   onChange={(e) => handleModalChange(field.key, e.target.value)}
//                   className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                 >
//                   {field.options.map((option) => (
//                     <option key={option} value={option}>
//                       {option.charAt(0).toUpperCase() + option.slice(1)}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   type={field.type}
//                   value={modalEmployee[field.key] || ''}
//                   onChange={(e) => handleModalChange(field.key, e.target.value)}
//                   placeholder={field.placeholder || ''}
//                   className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div>
//             <h3 className="text-base font-semibold text-red-700 mb-3">Documents</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {['aadharFront', 'aadharBack', 'bankPassbook', 'panCard'].map((field) => (
//                 <div key={field}>
//                   <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                     {field === 'aadharFront' && 'Aadhar Card (Front)'}
//                     {field === 'aadharBack' && 'Aadhar Card (Back)'}
//                     {field === 'bankPassbook' && 'Bank Passbook (PDF)'}
//                     {field === 'panCard' && 'PAN Card (PDF)'}
//                   </label>
//                   {isEditing ? (
//                     <div className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors">
//                       {modalEmployee[field] ? (
//                         <div className="text-center">
//                           <p className="text-sm truncate max-w-[200px]">{modalEmployee[field].name || field}</p>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               console.log(`Remove ${field} button clicked`);
//                               handleModalChange(field, null);
//                             }}
//                             className="text-xs text-blue-600 hover:text-blue-800 mt-1 touch-action-manipulation"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       ) : (
//                         <>
//                           <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                           <p className="text-sm">Drag & drop PDF or click to upload</p>
//                         </>
//                       )}
//                       <input
//                         type="file"
//                         accept="application/pdf"
//                         onChange={handleFileUpload(field)}
//                         className="absolute w-full h-full opacity-0 cursor-pointer touch-action-manipulation"
//                       />
//                     </div>
//                   ) : (
//                     <div>
//                       {modalEmployee[field] ? (
//                         <a
//                           href={modalEmployee[field] instanceof File ? URL.createObjectURL(modalEmployee[field]) : modalEmployee[field]}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center space-x-2"
//                         >
//                           <FaFilePdf size={24} className="text-blue-400" />
//                           <p className="text-blue-800 text-sm sm:text-base truncate max-w-[200px]">
//                             {field}
//                           </p>
//                         </a>
//                       ) : (
//                         <p className="text-blue-800 text-sm sm:text-base">Not uploaded</p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//           {Object.entries(detailFields).map(([section, fields]) => (
//             <div key={section}>
//               <h3 className="text-base font-semibold text-red-700 mb-3">
//                 {section === 'personalInfo' && 'Personal Information'}
//                 {section === 'contactInfo' && 'Contact Information'}
//                 {section === 'bankingInfo' && 'Banking Information'}
//                 {section === 'employmentInfo' && 'Employment Information'}
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {fields.map((field) => (
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
//                         placeholder={field.placeholder || ''}
//                         className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                       />
//                     ) : isEditing && field.type === 'select' ? (
//                       <select
//                         value={modalEmployee[field.key] || ''}
//                         onChange={(e) => handleModalChange(field.key, e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                       >
//                         {field.options.map((option) => (
//                           <option key={option} value={option}>
//                             {option.charAt(0).toUpperCase() + option.slice(1)}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <div className="text-sm text-blue-800">
//                         {field.type === 'text' && field.placeholder === 'DD/MMMM/YYYY' ? formatDate(modalEmployee[field.key]) : modalEmployee[field.key] || 'N/A'}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       {isEditing && (
//         <div className="flex justify-end mt-4 sm:mt-6 gap-2">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               console.log('Cancel button in modal clicked');
//               if (modalType === 'add') {
//                 setModalOpen(false);
//                 setModalEmployee(initialEmployee);
//                 setModalIndex(null);
//               } else {
//                 setIsEditing(false);
//               }
//               setError(null);
//             }}
//             className="px-4 py-2 bg-blue-200 text-blue-700 rounded-md font-semibold text-sm sm:text-base hover:bg-blue-300 touch-action-manipulation"
//             disabled={saving}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               console.log('Save button in modal clicked');
//               handleSaveEmployee();
//             }}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm sm:text-base touch-action-manipulation"
//             disabled={saving}
//           >
//             {saving ? (
//               <>
//                 <FaSpinner className="animate-spin" size={12} />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <FaSave /> Save
//               </>
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
// )}

//         {deleteIndex !== null && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4" onClick={() => setDeleteIndex(null)}>
//             <div className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm p-4 sm:p-6 relative" onClick={(e) => e.stopPropagation()}>
//               {saving && (
//                 <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
//                   <div className="flex items-center gap-2 text-blue-500">
//                     <FaSpinner className="animate-spin" size={24} />
//                     <span>Deleting...</span>
//                   </div>
//                 </div>
//               )}
//               <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-4">Delete Employee</h2>
//               <p className="mb-4 sm:mb-6 text-sm sm:text-base">
//                 Are you sure you want to delete{' '}
//                 <span className="font-semibold text-blue-700">
//                   {employees[deleteIndex]?.firstName || ''} {employees[deleteIndex]?.lastName || ''}
//                 </span>
//                 ?
//               </p>
//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     console.log('Cancel delete button clicked');
//                     setDeleteIndex(null);
//                   }}
//                   className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-blue-200 text-blue-700 font-semibold text-sm sm:text-base hover:bg-blue-300 touch-action-manipulation"
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     console.log('Confirm delete button clicked');
//                     handleDeleteEmployee();
//                   }}
//                   className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-red-600 text-white font-semibold text-sm sm:text-base hover:bg-red-700 touch-action-manipulation"
//                   disabled={saving}
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



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   FaUser,
//   FaEdit,
  
//   FaPlus,
//   FaSave,
//   FaCamera,
//   FaTimes,
//   FaPen,
//   FaFilePdf,
//   FaSpinner,
//   FaSearch,
//   FaEye,
// } from 'react-icons/fa';

// import { Trash2,Eye,Edit } from 'lucide-react';
// import Header from '../../components/common/Header';
// import AdminSidebar from '../../components/common/AdminSidebar';
// import { useNavigate } from 'react-router-dom';

// // Base URL for API
// const BASE_URL = 'https://task-manager-backend-xs5s.onrender.com/api';

// // Initial employee fields
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
//   aadharFront: null,
//   aadharBack: null,
//   bankPassbook: null,
//   panCard: null,
// };

// // Helper functions
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return 'N/A';
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = date.toLocaleString('en-US', { month: 'long' });
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// };

// const parseDate = (dateString) => {
//   if (!dateString) return '';
//   const [day, month, year] = dateString.split('/');
//   const monthIndex = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ].indexOf(month);
//   if (monthIndex === -1 || !day || !year) return '';
//   return new Date(year, monthIndex, day).toISOString().split('T')[0];
// };

// const EmployeeListPage = () => {
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState('add');
//   const [modalEmployee, setModalEmployee] = useState(initialEmployee);
//   const [modalIndex, setModalIndex] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [deleteIndex, setDeleteIndex] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSearch, setShowSearch] = useState(false);

//   const navigate = useNavigate();
//   const token = localStorage.getItem('token') || '';
//   const email = localStorage.getItem('userEmail') || '';

//   useEffect(() => {
//     if (!token) {
//       setError('Please log in to view employees.');
//       navigate('/login');
//     }
//   }, [token, email, navigate]);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       if (!token) {
//         setError('No authentication token found. Please log in.');
//         setLoading(false);
//         navigate('/login');
//         return;
//       }
//       try {
//         setLoading(true);
//         const response = await axios.get(`${BASE_URL}/admin/allemployees`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const employeesData = Array.isArray(response.data) ? response.data : response.data.employees || [];
//         setEmployees(employeesData.map(emp => ({
//           ...emp,
//           dateOfJoining: emp.dateOfJoining ? formatDate(emp.dateOfJoining) : '',
//           officialDateOfBirth: emp.officialDateOfBirth ? formatDate(emp.officialDateOfBirth) : '',
//           actualDateOfBirth: emp.actualDateOfBirth ? formatDate(emp.actualDateOfBirth) : '',
//           hireDate: emp.hireDate ? formatDate(emp.hireDate) : '',
//         })));
//         setLoading(false);
//       } catch (err) {
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

//   const handleSaveEmployee = async () => {
//     if (!token) {
//       setError('No authentication token found. Please log in.');
//       navigate('/login');
//       return;
//     }
//     const requiredFields = ['firstName', 'lastName', 'email', 'department', 'position', 'dateOfJoining', 'manager', 'role'];
//     const missingFields = requiredFields.filter((field) => !modalEmployee[field]);
//     if (missingFields.length > 0) {
//       setError(`Missing required fields: ${missingFields.join(', ')}`);
//       return;
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(modalEmployee.email)) {
//       setError('Invalid email format.');
//       return;
//     }
//     const dateRegex = /^\d{2}\/[A-Za-z]+\/\d{4}$/;
//     const dateFields = ['dateOfJoining', 'officialDateOfBirth', 'actualDateOfBirth', 'hireDate'];
//     for (const field of dateFields) {
//       if (modalEmployee[field] && !dateRegex.test(modalEmployee[field])) {
//         setError(`Invalid date format for ${field}. Use DD/MMMM/YYYY (e.g., 01/January/2025).`);
//         return;
//       }
//     }
//     try {
//       setSaving(true);
//       let response;
//       const employeeData = new FormData();
//       Object.entries({
//         firstName: modalEmployee.firstName,
//         lastName: modalEmployee.lastName,
//         email: modalEmployee.email,
//         department: modalEmployee.department,
//         position: modalEmployee.position,
//         dateOfJoining: modalEmployee.dateOfJoining ? parseDate(modalEmployee.dateOfJoining) : undefined,
//         manager: modalEmployee.manager,
//         role: modalEmployee.role,
//         workLocation: modalEmployee.workLocation || undefined,
//         profileImage: modalEmployee.profileImage instanceof File ? modalEmployee.profileImage : undefined,
//         officialDateOfBirth: modalEmployee.officialDateOfBirth ? parseDate(modalEmployee.officialDateOfBirth) : undefined,
//         actualDateOfBirth: modalEmployee.actualDateOfBirth ? parseDate(modalEmployee.actualDateOfBirth) : undefined,
//         primaryPhoneNumber: modalEmployee.primaryPhoneNumber || undefined,
//         secondaryPhoneNumber: modalEmployee.secondaryPhoneNumber || undefined,
//         personalEmailId: modalEmployee.personalEmailId || undefined,
//         permanentResidentialAddress: modalEmployee.permanentResidentialAddress || undefined,
//         currentAddress: modalEmployee.currentAddress || undefined,
//         bankName: modalEmployee.bankName || undefined,
//         accountNumber: modalEmployee.accountNumber || undefined,
//         ifscCode: modalEmployee.ifscCode || undefined,
//         bankBranchName: modalEmployee.bankBranchName || undefined,
//         fathersName: modalEmployee.fathersName || undefined,
//         fathersContactNo: modalEmployee.fathersContactNo || undefined,
//         mothersName: modalEmployee.mothersName || undefined,
//         mothersContactNo: modalEmployee.mothersContactNo || undefined,
//         spouseName: modalEmployee.spouseName || undefined,
//         spouseContactNo: modalEmployee.spouseContactNo || undefined,
//         siblings: modalEmployee.siblings || undefined,
//         bloodGroup: modalEmployee.bloodGroup || undefined,
//         hasMedicalInsurance: modalEmployee.hasMedicalInsurance || undefined,
//         hireDate: modalEmployee.hireDate ? parseDate(modalEmployee.hireDate) : undefined,
//         emergencyContact: modalEmployee.emergencyContact || undefined,
//         aadharFront: modalEmployee.aadharFront instanceof File ? modalEmployee.aadharFront : undefined,
//         aadharBack: modalEmployee.aadharBack instanceof File ? modalEmployee.aadharBack : undefined,
//         bankPassbook: modalEmployee.bankPassbook instanceof File ? modalEmployee.bankPassbook : undefined,
//         panCard: modalEmployee.panCard instanceof File ? modalEmployee.panCard : undefined,
//       }).forEach(([key, value]) => {
//         if (value !== undefined && value !== null && value !== '') {
//           employeeData.append(key, value);
//         }
//       });
//       if (modalType === 'add') {
//         response = await axios.post(`${BASE_URL}/admin/addemployees`, employeeData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         setEmployees((prev) => [
//           ...prev,
//           {
//             ...response.data.user,
//             dateOfJoining: response.data.user.dateOfJoining ? formatDate(response.data.user.dateOfJoining) : '',
//             officialDateOfBirth: response.data.user.officialDateOfBirth ? formatDate(response.data.user.officialDateOfBirth) : '',
//             actualDateOfBirth: response.data.user.actualDateOfBirth ? formatDate(response.data.user.actualDateOfBirth) : '',
//             hireDate: response.data.user.hireDate ? formatDate(response.data.user.hireDate) : '',
//           },
//         ]);
//       } else {
//         response = await axios.put(
//           `${BASE_URL}/admin/editemployees/${modalEmployee._id}`,
//           employeeData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
//         setEmployees((prev) =>
//           prev.map((emp, idx) =>
//             idx === modalIndex ? {
//               ...response.data.employee,
//               dateOfJoining: response.data.employee.dateOfJoining ? formatDate(response.data.employee.dateOfJoining) : '',
//               officialDateOfBirth: response.data.employee.officialDateOfBirth ? formatDate(response.data.employee.officialDateOfBirth) : '',
//               actualDateOfBirth: response.data.employee.actualDateOfBirth ? formatDate(response.data.employee.actualDateOfBirth) : '',
//               hireDate: response.data.employee.hireDate ? formatDate(response.data.employee.hireDate) : '',
//             } : emp
//           )
//         );
//       }
//       setModalOpen(false);
//       setModalEmployee(initialEmployee);
//       setModalIndex(null);
//       setIsEditing(false);
//       setError(null);
//       setSaving(false);
//     } catch (err) {
//       setSaving(false);
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

//   const openModal = (type, employee = initialEmployee, index = null) => {
//     setModalType(type);
//     setModalEmployee({
//       ...initialEmployee,
//       ...employee,
//       email: employee.email || (type === 'add' ? '' : email),
//       role: employee.role || 'employee',
//       dateOfJoining: employee.dateOfJoining ? formatDate(employee.dateOfJoining) : '',
//       officialDateOfBirth: employee.officialDateOfBirth ? formatDate(employee.officialDateOfBirth) : '',
//       actualDateOfBirth: employee.actualDateOfBirth ? formatDate(employee.actualDateOfBirth) : '',
//       hireDate: employee.hireDate ? formatDate(employee.hireDate) : '',
//     });
//     setModalIndex(index);
//     setIsEditing(type === 'add');
//     setModalOpen(true);
//   };

//   const handleModalChange = (field, value) => {
//     setModalEmployee((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleModalImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setModalEmployee((prev) => ({
//         ...prev,
//         profileImage: file,
//       }));
//     }
//   };

//   const handleFileUpload = (field) => (event) => {
//     const file = event.target.files[0];
//     if (file && file.type === 'application/pdf') {
//       if (file.size > 20 * 1024 * 1024) {
//         setError('File size exceeds 20MB limit');
//         return;
//       }
//       setModalEmployee((prev) => ({
//         ...prev,
//         [field]: file,
//       }));
//     } else {
//       setError('Please upload a valid PDF file');
//     }
//   };

//   const handleDeleteEmployee = async () => {
//     if (!token) {
//       setError('No authentication token found. Please log in.');
//       navigate('/login');
//       return;
//     }
//     const employeeId = employees[deleteIndex]?._id;
//     if (!employeeId) {
//       setError('Employee ID (_id) is missing. Please try again.');
//       setDeleteIndex(null);
//       return;
//     }
//     try {
//       setSaving(true);
//       await axios.delete(`${BASE_URL}/admin/deleteemployees/${employeeId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEmployees((prev) => prev.filter((_, idx) => idx !== deleteIndex));
//       setDeleteIndex(null);
//       setError(null);
//       setSaving(false);
//     } catch (err) {
//       setSaving(false);
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

//   const tableColumns = [
//     { label: 'S.No.', key: 'serialNumber' },
//     { label: 'Image', key: 'profileImage' },
//     { label: 'Name', key: 'fullName' },
//     { label: 'Email', key: 'email' },
//     { label: 'Department', key: 'department' },
//     { label: 'Position', key: 'position' },
//     { label: 'Actions', key: 'actions' },
//   ];

//   const addFields = [
//     { label: 'First Name', key: 'firstName', type: 'text', required: true },
//     { label: 'Last Name', key: 'lastName', type: 'text', required: true },
//     { label: 'Email', key: 'email', type: 'email', required: true },
//     { label: 'Department', key: 'department', type: 'text', required: true },
//     { label: 'Position', key: 'position', type: 'text', required: true },
//     { label: 'Date of Joining', key: 'dateOfJoining', type: 'text', placeholder: 'DD/MMMM/YYYY', required: true },
//     { label: 'Manager', key: 'manager', type: 'text', required: true },
//     { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
//     { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
//   ];

//   const detailFields = {
//     personalInfo: [
//       { label: 'Employee ID', key: 'employeeId', type: 'text', readOnly: true },
//       { label: 'First Name', key: 'firstName', type: 'text', required: true },
//       { label: 'Last Name', key: 'lastName', type: 'text', required: true },
//       { label: 'Official DOB', key: 'officialDateOfBirth', type: 'text', placeholder: 'DD/MMMM/YYYY' },
//       { label: 'Actual DOB', key: 'actualDateOfBirth', type: 'text', placeholder: 'DD/MMMM/YYYY' },
//       { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
//       { label: 'Father’s Name', key: 'fathersName', type: 'text' },
//       { label: 'Mother’s Name', key: 'mothersName', type: 'text' },
//       { label: 'Spouse Name', key: 'spouseName', type: 'text' },
//       { label: 'Siblings', key: 'siblings', type: 'text' },
//       { label: 'Medical Insurance', key: 'hasMedicalInsurance', type: 'text' },
//     ],
//     contactInfo: [
//       { label: 'Email', key: 'email', type: 'email', required: true },
//       { label: 'Personal Email', key: 'personalEmailId', type: 'email' },
//       { label: 'Primary Phone', key: 'primaryPhoneNumber', type: 'text' },
//       { label: 'Secondary Phone', key: 'secondaryPhoneNumber', type: 'text' },
//       { label: 'Father’s Contact', key: 'fathersContactNo', type: 'text' },
//       { label: 'Mother’s Contact', key: 'mothersContactNo', type: 'text' },
//       { label: 'Spouse Contact', key: 'spouseContactNo', type: 'text' },
//       { label: 'Emergency Contact', key: 'emergencyContact', type: 'text' },
//       { label: 'Permanent Address', key: 'permanentResidentialAddress', type: 'text' },
//       { label: 'Current Address', key: 'currentAddress', type: 'text' },
//     ],
//     bankingInfo: [
//       { label: 'Bank Name', key: 'bankName', type: 'text' },
//       { label: 'Account Number', key: 'accountNumber', type: 'text' },
//       { label: 'IFSC Code', key: 'ifscCode', type: 'text' },
//       { label: 'Bank Branch', key: 'bankBranchName', type: 'text' },
//     ],
//     employmentInfo: [
//       { label: 'Department', key: 'department', type: 'text', required: true },
//       { label: 'Position', key: 'position', type: 'text', required: true },
//       { label: 'Date of Joining', key: 'dateOfJoining', type: 'text', placeholder: 'DD/MMMM/YYYY', required: true },
//       { label: 'Hire Date', key: 'hireDate', type: 'text', placeholder: 'DD/MMMM/YYYY' },
//       { label: 'Manager', key: 'manager', type: 'text', required: true },
//       { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
//       { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
//     ],
//   };

//   const filteredEmployees = employees.filter((emp) =>
//     `${emp.firstName || ''} ${emp.lastName || ''} ${emp.email || ''} ${emp.department || ''} ${emp.position || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showSearch && !e.target.closest('.search-container') && !e.target.closest('.search-container button')) {
//         setShowSearch(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [showSearch]);

//   return (
//     <div className="flex min-h-screen bg-white">
//       <script src="https://cdn.tailwindcss.com"></script>
//       <div className={`fixed inset-y-0 left-0 z-50 md:sticky md:z-10 w-64 md:w-auto transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
//         <AdminSidebar isOpen={showSidebar} toggleSidebar={() => setShowSidebar((prev) => !prev)} />
//       </div>
//       <div className="flex-1 flex flex-col min-h-screen">
//         <div className="sticky top-0 z-30">
//           <Header isLoggedIn={!!token} onToggleSidebar={() => setShowSidebar((prev) => !prev)} />
//         </div>
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//             <div className="flex items-center gap-2">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">Employee List</h1>
//               <div className="relative search-container">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setShowSearch(!showSearch);
//                   }}
//                   className="p-2 bg-blue-600 text-white rounded-full focus:outline-none touch-action-manipulation"
//                 >
//                   <FaSearch />
//                 </button>
//                 {showSearch && (
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search by name, email, department, or position..."
//                     className="absolute top-0 left-full ml-2 w-0 transition-all duration-300 focus:w-[200px] sm:focus:w-[300px] pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base z-30"
//                     autoFocus
//                   />
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 openModal('add');
//               }}
//               className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm sm:text-base touch-action-manipulation pointer-events-auto"
//             >
//               <FaPlus /> Add Employee
//             </button>
//           </div>
//           {error && (
//             <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
//               {error}
//               <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 touch-action-manipulation">
//                 <FaTimes size={16} />
//               </button>
//             </div>
//           )}
//           {loading ? (
//             <div className="text-center text-blue-500 py-8 flex items-center justify-center gap-2">
//               <FaSpinner className="animate-spin" size={24} />
//               <span>Loading employees...</span>
//             </div>
//           ) : (
//             <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-4">
//               {filteredEmployees.length === 0 ? (
//                 <div className="text-center text-blue-500 py-8">
//                   No employees found. Click to add one!
//                 </div>
//               ) : (
//                 <>
//                   <div className="hidden lg:block">
//                     <table className="min-w-full text-xs sm:text-sm">
//                       <thead>
//                         <tr className="bg-gray-200 text-black">
//                           {tableColumns.map((col) => (
//                             <th key={col.key} className="p-2 sm:p-3 text-left font-semibold whitespace-nowrap">
//                               {col.label}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredEmployees.map((emp, idx) => (
//                           <tr
//                             key={emp._id || `emp-${idx}`}
//                             className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-blue-50 transition cursor-pointer'}
//                             onClick={() => {
//                               console.log('Row clicked for employee:', idx);
//                               openModal('view', emp, idx);
//                             }}
//                           >
//                             <td className="p-2 sm:p-3">{idx + 1}</td>
//                             <td className="p-2 sm:p-3">
//                               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center">
//                                 {emp.profileImage ? (
//                                   <img src={emp.profileImage} alt="Profile" className="w-full h-full object-cover" />
//                                 ) : (
//                                   <FaUser size={16} className="text-blue-500" />
//                                 )}
//                               </div>
//                             </td>
//                             <td className="p-2 sm:p-3 font-semibold">{emp.firstName} {emp.lastName}</td>
//                             <td className="p-2 sm:p-3 truncate max-w-[150px] sm:max-w-[200px]">{emp.email || 'N/A'}</td>
//                             <td className="p-2 sm:p-3">{emp.department || 'N/A'}</td>
//                             <td className="p-2 sm:p-3">{emp.position || 'N/A'}</td>
//                             <td className="p-2 sm:p-3">
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     console.log('View button clicked for employee:', idx);
//                                     openModal('view', emp, idx);
//                                   }}
//                                   className="p-1 sm:p-2 rounded bg-blue-200 hover:bg-blue-300 text-blue-700 touch-action-manipulation"
//                                   title="View"
//                                 >
//                                   <Eye size={12} />
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     console.log('Edit button clicked for employee:', idx);
//                                     openModal('view', emp, idx);
//                                     setIsEditing(true);
//                                   }}
//                                   className="p-1 sm:p-2 rounded bg-green-200 hover:bg-green-300 text-green-700 touch-action-manipulation"
//                                   title="Edit"
//                                 >
//                                   <Edit size={12} />
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     console.log('Delete button clicked for employee:', idx);
//                                     setDeleteIndex(idx);
//                                   }}
//                                   className="p-1 sm:p-2 rounded bg-red-200 hover:bg-red-300 text-red-700 touch-action-manipulation"
//                                   title="Delete"
//                                 >
//                                   <Trash2 size={12} />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                   <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {filteredEmployees.map((emp, idx) => (
//                       <div
//                         key={emp._id || `emp-${idx}`}
//                         className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 relative"
//                         onClick={() => {
//                           console.log('Card clicked for employee:', idx);
//                           openModal('view', emp, idx);
//                         }}
//                       >
//                         <div className="flex items-center gap-4 mb-4">
//                           <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center">
//                             {emp.profileImage ? (
//                               <img src={emp.profileImage} alt="Profile" className="w-full h-full object-cover" />
//                             ) : (
//                               <FaUser size={24} className="text-blue-500" />
//                             )}
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-blue-700">{emp.firstName} {emp.lastName}</h3>
//                             <p className="text-sm text-blue-600">{emp.position || 'N/A'}</p>
//                           </div>
//                         </div>
//                         <p className="text-sm text-blue-800 mb-2">Email: {emp.email || 'N/A'}</p>
//                         <p className="text-sm text-blue-800 mb-2">Dept: {emp.department || 'N/A'}</p>
//                         <div className="flex gap-2 absolute top-4 right-4">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               console.log('View button clicked for employee:', idx);
//                               openModal('view', emp, idx);
//                             }}
//                             className="p-2 rounded bg-blue-200 hover:bg-blue-300 text-blue-700 touch-action-manipulation"
//                             title="View"
//                           >
//                             <FaEye size={16} />
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               console.log('Edit button clicked for employee:', idx);
//                               openModal('view', emp, idx);
//                               setIsEditing(true);
//                             }}
//                             className="p-2 rounded bg-green-200 hover:bg-green-300 text-green-700 touch-action-manipulation"
//                             title="Edit"
//                           >
//                             <FaEdit size={16} />
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               console.log('Delete button clicked for employee:', idx);
//                               setDeleteIndex(idx);
//                             }}
//                             className="p-2 rounded bg-red-200 hover:bg-red-300 text-red-700 touch-action-manipulation"
//                             title="Delete"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//           {modalOpen && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4 sm:p-6" onClick={() => setModalOpen(false)}>
//               <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-6xl max-h-[80vh] overflow-y-auto p-4 sm:p-6 relative" onClick={(e) => e.stopPropagation()}>
//                 {saving && (
//                   <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
//                     <div className="flex items-center gap-2 text-blue-500">
//                       <FaSpinner className="animate-spin" size={24} />
//                       <span>Saving...</span>
//                     </div>
//                   </div>
//                 )}
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg sm:text-xl font-bold text-blue-700">
//                     {modalType === 'add' ? 'Add Employee' : isEditing ? 'Edit Employee' : 'Employee Details'}
//                   </h2>
//                   <div className="flex gap-2">
//                     {modalType !== 'add' && !isEditing && (
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           console.log('Edit button in modal clicked');
//                           setIsEditing(true);
//                         }}
//                         className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-semibold text-sm touch-action-manipulation"
//                       >
//                         <FaPen size={12} /> Edit
//                       </button>
//                     )}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         console.log('Close modal button clicked');
//                         setModalOpen(false);
//                         setModalEmployee(initialEmployee);
//                         setModalIndex(null);
//                         setIsEditing(false);
//                         setError(null);
//                       }}
//                       className="text-blue-600 hover:text-blue-800 text-lg touch-action-manipulation"
//                     >
//                       <FaTimes size={16} />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="relative">
//                     <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
//                       {modalEmployee.profileImage ? (
//                         <a
//                           href={modalEmployee.profileImage instanceof File ? URL.createObjectURL(modalEmployee.profileImage) : modalEmployee.profileImage}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <img
//                             src={modalEmployee.profileImage instanceof File ? URL.createObjectURL(modalEmployee.profileImage) : modalEmployee.profileImage}
//                             alt="Profile"
//                             className="w-full h-full object-cover"
//                           />
//                         </a>
//                       ) : (
//                         <FaUser size={32} className="text-blue-500" />
//                       )}
//                     </div>
//                     {isEditing && (
//                       <label className="absolute bottom-0 right-0 bg-blue-700 hover:bg-blue-800 text-white p-1 sm:p-2 rounded-full cursor-pointer transition-colors touch-action-manipulation">
//                         <FaCamera size={12} />
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleModalImage}
//                           className="hidden"
//                         />
//                       </label>
//                     )}
//                   </div>
//                   <div>
//                     <div className="font-semibold text-base sm:text-lg text-blue-700">
//                       {modalEmployee.firstName} {modalEmployee.lastName}
//                     </div>
//                     <div className="text-blue-600 text-xs sm:text-sm">{modalEmployee.position || 'N/A'}</div>
//                     <div className="text-blue-500 text-xs">{modalEmployee.department || 'N/A'}</div>
//                   </div>
//                 </div>
//                 {modalType === 'add' ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {[
//                       { label: 'First Name', key: 'firstName', type: 'text', required: true },
//                       { label: 'Last Name', key: 'lastName', type: 'text', required: true },
//                       { label: 'Email', key: 'email', type: 'email', required: true },
//                       { label: 'Department', key: 'department', type: 'select', options: ['', 'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Procurement'], required: true },
//                       { label: 'Position', key: 'position', type: 'text', required: true },
//                       { label: 'Date of Joining', key: 'dateOfJoining', type: 'date', placeholder: 'DD/MMMM/YYYY', required: true },
//                       { label: 'Manager', key: 'manager', type: 'text', required: true },
//                       { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
//                       { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
//                     ].map((field) => (
//                       <div key={field.key}>
//                         <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                           {field.label}
//                           {field.required && '*'}
//                         </label>
//                         {field.type === 'select' ? (
//                           <select
//                             value={modalEmployee[field.key] || ''}
//                             onChange={(e) => handleModalChange(field.key, e.target.value)}
//                             className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                           >
//                             {field.options.map((option) => (
//                               <option key={option} value={option}>
//                                 {option.charAt(0).toUpperCase() + option.slice(1)}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <input
//                             type={field.type}
//                             value={modalEmployee[field.key] || ''}
//                             onChange={(e) => handleModalChange(field.key, e.target.value)}
//                             placeholder={field.placeholder || ''}
//                             className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                           />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-base font-semibold text-red-700 mb-3">Documents</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {['aadharFront', 'aadharBack', 'bankPassbook', 'panCard'].map((field) => (
//                           <div key={field}>
//                             <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                               {field === 'aadharFront' && 'Aadhar Card (Front)'}
//                               {field === 'aadharBack' && 'Aadhar Card (Back)'}
//                               {field === 'bankPassbook' && 'Bank Passbook (PDF)'}
//                               {field === 'panCard' && 'PAN Card (PDF)'}
//                             </label>
//                             {isEditing ? (
//                               <div className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors">
//                                 {modalEmployee[field] ? (
//                                   <div className="text-center">
//                                     <p className="text-sm truncate max-w-[200px]">{modalEmployee[field].name || field}</p>
//                                     <button
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         console.log(`Remove ${field} button clicked`);
//                                         handleModalChange(field, null);
//                                       }}
//                                       className="text-xs text-blue-600 hover:text-blue-800 mt-1 touch-action-manipulation"
//                                     >
//                                       Remove
//                                     </button>
//                                   </div>
//                                 ) : (
//                                   <>
//                                     <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                                     <p className="text-sm">Drag & drop PDF or click to upload</p>
//                                   </>
//                                 )}
//                                 <input
//                                   type="file"
//                                   accept="application/pdf"
//                                   onChange={handleFileUpload(field)}
//                                   className="absolute w-full h-full opacity-0 cursor-pointer touch-action-manipulation"
//                                 />
//                               </div>
//                             ) : (
//                               <div>
//                                 {modalEmployee[field] ? (
//                                   <a
//                                     href={modalEmployee[field] instanceof File ? URL.createObjectURL(modalEmployee[field]) : modalEmployee[field]}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="flex items-center space-x-2"
//                                   >
//                                     <FaFilePdf size={24} className="text-blue-400" />
//                                     <p className="text-blue-800 text-sm sm:text-base truncate max-w-[200px]">
//                                       {field}
//                                     </p>
//                                   </a>
//                                 ) : (
//                                   <p className="text-blue-800 text-sm sm:text-base">Not uploaded</p>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     {Object.entries(detailFields).map(([section, fields]) => (
//                       <div key={section}>
//                         <h3 className="text-base font-semibold text-red-700 mb-3">
//                           {section === 'personalInfo' && 'Personal Information'}
//                           {section === 'contactInfo' && 'Contact Information'}
//                           {section === 'bankingInfo' && 'Banking Information'}
//                           {section === 'employmentInfo' && 'Employment Information'}
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           {fields.map((field) => (
//                             <div key={field.key}>
//                               <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                                 {field.label}
//                                 {field.required && '*'}
//                               </label>
//                               {isEditing && field.type !== 'select' && !field.readOnly ? (
//                                 <input
//                                   type={field.type}
//                                   value={modalEmployee[field.key] || ''}
//                                   onChange={(e) => handleModalChange(field.key, e.target.value)}
//                                   placeholder={field.placeholder || ''}
//                                   className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                                 />
//                               ) : isEditing && field.type === 'select' ? (
//                                 <select
//                                   value={modalEmployee[field.key] || ''}
//                                   onChange={(e) => handleModalChange(field.key, e.target.value)}
//                                   className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                                 >
//                                   {field.options.map((option) => (
//                                     <option key={option} value={option}>
//                                       {option.charAt(0).toUpperCase() + option.slice(1)}
//                                     </option>
//                                   ))}
//                                 </select>
//                               ) : (
//                                 <div className="text-sm text-blue-800">
//                                   {field.type === 'text' && field.placeholder === 'DD/MMMM/YYYY' ? formatDate(modalEmployee[field.key]) : modalEmployee[field.key] || 'N/A'}
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {isEditing && (
//                   <div className="flex justify-end mt-4 sm:mt-6 gap-2">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         console.log('Cancel button in modal clicked');
//                         if (modalType === 'add') {
//                           setModalOpen(false);
//                           setModalEmployee(initialEmployee);
//                           setModalIndex(null);
//                         } else {
//                           setIsEditing(false);
//                         }
//                         setError(null);
//                       }}
//                       className="px-4 py-2 bg-blue-200 text-blue-700 rounded-md font-semibold text-sm sm:text-base hover:bg-blue-300 touch-action-manipulation"
//                       disabled={saving}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         console.log('Save button in modal clicked');
//                         handleSaveEmployee();
//                       }}
//                       className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm sm:text-base touch-action-manipulation"
//                       disabled={saving}
//                     >
//                       {saving ? (
//                         <>
//                           <FaSpinner className="animate-spin" size={12} />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <FaSave /> Save
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//           {deleteIndex !== null && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4" onClick={() => setDeleteIndex(null)}>
//               <div className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm p-4 sm:p-6 relative" onClick={(e) => e.stopPropagation()}>
//                 {saving && (
//                   <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
//                     <div className="flex items-center gap-2 text-blue-500">
//                       <FaSpinner className="animate-spin" size={24} />
//                       <span>Deleting...</span>
//                     </div>
//                   </div>
//                 )}
//                 <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-4">Delete Employee</h2>
//                 <p className="mb-4 sm:mb-6 text-sm sm:text-base">
//                   Are you sure you want to delete{' '}
//                   <span className="font-semibold text-blue-700">
//                     {employees[deleteIndex]?.firstName || ''} {employees[deleteIndex]?.lastName || ''}
//                   </span>
//                   ?
//                 </p>
//                 <div className="flex justify-end gap-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       console.log('Cancel delete button clicked');
//                       setDeleteIndex(null);
//                     }}
//                     className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-blue-200 text-blue-700 font-semibold text-sm sm:text-base hover:bg-blue-300 touch-action-manipulation"
//                     disabled={saving}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       console.log('Confirm delete button clicked');
//                       handleDeleteEmployee();
//                     }}
//                     className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-red-600 text-white font-semibold text-sm sm:text-base hover:bg-red-700 touch-action-manipulation"
//                     disabled={saving}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default EmployeeListPage;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   FaUser,
//   FaEdit,
//   FaPlus,
//   FaSave,
//   FaCamera,
//   FaTimes,
//   FaPen,
//   FaFilePdf,
//   FaSpinner,
//   FaSearch,
//   FaEye,
// } from 'react-icons/fa';
// import { Trash2, Eye, Edit } from 'lucide-react';
// import Header from '../../components/common/Header';
// import AdminSidebar from '../../components/common/AdminSidebar';
// import { useNavigate } from 'react-router-dom';

// // Base URL for API
// const BASE_URL = 'https://task-manager-backend-xs5s.onrender.com/api';

// // Initial employee fields
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
//   aadharFront: null,
//   aadharBack: null,
//   bankPassbook: null,
//   panCard: null,
// };

// // Helper function to format date from YYYY-MM-DD to DD MMM YYYY
// const formatDateToDDMMMYYYY = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return '';
//   return date.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   }).replace(/ /g, ' ');
// };

// // Helper function to parse date from DD MMM YYYY to YYYY-MM-DD
// const parseDateToISO = (dateString) => {
//   if (!dateString) return '';
//   const dateRegex = /^(\d{2})\s([A-Za-z]{3})\s(\d{4})$/;
//   const match = dateRegex.exec(dateString);
//   if (!match) {
//     const date = new Date(dateString); // Try parsing as YYYY-MM-DD
//     if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
//     return '';
//   }
//   const [_, day, monthStr, year] = match;
//   const monthIndex = [
//     'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//   ].indexOf(monthStr);
//   if (monthIndex === -1) return '';
//   const date = new Date(year, monthIndex, day);
//   if (isNaN(date.getTime())) return '';
//   return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
// };

// // Validate date format (DD MMM YYYY or YYYY-MM-DD)
// const isValidDateFormat = (dateString) => {
//   if (!dateString) return true; // Allow empty for non-required fields
//   // Try YYYY-MM-DD (from input type="date")
//   let date = new Date(dateString);
//   if (!isNaN(date.getTime())) return true;
//   // Try DD MMM YYYY
//   const dateRegex = /^(\d{2})\s([A-Za-z]{3})\s(\d{4})$/;
//   if (!dateRegex.test(dateString)) return false;
//   const [_, day, monthStr, year] = dateRegex.exec(dateString);
//   const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthStr);
//   if (monthIndex === -1) return false;
//   date = new Date(year, monthIndex, day);
//   return !isNaN(date.getTime()) && date.getDate() === parseInt(day) && date.getMonth() === monthIndex && date.getFullYear() === parseInt(year);
// };

// const EmployeeListPage = () => {
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState('add');
//   const [modalEmployee, setModalEmployee] = useState(initialEmployee);
//   const [modalIndex, setModalIndex] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [deleteIndex, setDeleteIndex] = useState(null);
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const navigate = useNavigate();
//   const token = localStorage.getItem('token') || '';
//   const email = localStorage.getItem('userEmail') || '';

//   useEffect(() => {
//     if (!token) {
//       setError('Please log in to view employees.');
//       navigate('/login');
//     }
//   }, [token, email, navigate]);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       if (!token) {
//         setError('No authentication token found. Please log in.');
//         setLoading(false);
//         navigate('/login');
//         return;
//       }
//       try {
//         setLoading(true);
//         const response = await axios.get(`${BASE_URL}/admin/allemployees`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const employeesData = Array.isArray(response.data) ? response.data : response.data.employees || [];
//         setEmployees(employeesData.map(emp => ({
//           ...emp,
//           dateOfJoining: emp.dateOfJoining || '',
//           officialDateOfBirth: emp.officialDateOfBirth || '',
//           actualDateOfBirth: emp.actualDateOfBirth || '',
//           hireDate: emp.hireDate || '',
//         })));
//         setLoading(false);
//       } catch (err) {
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

//   const handleSaveEmployee = async () => {
//     if (!token) {
//       setError('No authentication token found. Please log in.');
//       navigate('/login');
//       return;
//     }
//     const requiredFields = ['firstName', 'lastName', 'email', 'department', 'position', 'dateOfJoining', 'manager', 'role', 'workLocation'];
//     const missingFields = requiredFields.filter((field) => !modalEmployee[field]);
//     if (missingFields.length > 0) {
//       setError(`Missing required fields: ${missingFields.join(', ')}`);
//       return;
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(modalEmployee.email)) {
//       setError('Invalid email format.');
//       return;
//     }
//     const dateFields = ['dateOfJoining', 'officialDateOfBirth', 'actualDateOfBirth', 'hireDate'];
//     for (const field of dateFields) {
//       if (modalEmployee[field] && !isValidDateFormat(modalEmployee[field])) {
//         setError(`Invalid date format for ${field}. Use a valid date.`);
//         return;
//       }
//     }
//     try {
//       setSaving(true);
//       let response;
//       const employeeData = new FormData();
//       Object.entries({
//         firstName: modalEmployee.firstName,
//         lastName: modalEmployee.lastName,
//         email: modalEmployee.email,
//         department: modalEmployee.department,
//         position: modalEmployee.position,
//         dateOfJoining: modalEmployee.dateOfJoining ? parseDateToISO(modalEmployee.dateOfJoining) : undefined,
//         manager: modalEmployee.manager,
//         role: modalEmployee.role,
//         workLocation: modalEmployee.workLocation || undefined,
//         profileImage: modalEmployee.profileImage instanceof File ? modalEmployee.profileImage : undefined,
//         officialDateOfBirth: modalEmployee.officialDateOfBirth ? parseDateToISO(modalEmployee.officialDateOfBirth) : undefined,
//         actualDateOfBirth: modalEmployee.actualDateOfBirth ? parseDateToISO(modalEmployee.actualDateOfBirth) : undefined,
//         primaryPhoneNumber: modalEmployee.primaryPhoneNumber || undefined,
//         secondaryPhoneNumber: modalEmployee.secondaryPhoneNumber || undefined,
//         personalEmailId: modalEmployee.personalEmailId || undefined,
//         permanentResidentialAddress: modalEmployee.permanentResidentialAddress || undefined,
//         currentAddress: modalEmployee.currentAddress || undefined,
//         bankName: modalEmployee.bankName || undefined,
//         accountNumber: modalEmployee.accountNumber || undefined,
//         ifscCode: modalEmployee.ifscCode || undefined,
//         bankBranchName: modalEmployee.bankBranchName || undefined,
//         fathersName: modalEmployee.fathersName || undefined,
//         fathersContactNo: modalEmployee.fathersContactNo || undefined,
//         mothersName: modalEmployee.mothersName || undefined,
//         mothersContactNo: modalEmployee.mothersContactNo || undefined,
//         spouseName: modalEmployee.spouseName || undefined,
//         spouseContactNo: modalEmployee.spouseContactNo || undefined,
//         siblings: modalEmployee.siblings || undefined,
//         bloodGroup: modalEmployee.bloodGroup || undefined,
//         hasMedicalInsurance: modalEmployee.hasMedicalInsurance || undefined,
//         hireDate: modalEmployee.hireDate ? parseDateToISO(modalEmployee.hireDate) : undefined,
//         emergencyContact: modalEmployee.emergencyContact || undefined,
//         aadharFront: modalEmployee.aadharFront instanceof File ? modalEmployee.aadharFront : undefined,
//         aadharBack: modalEmployee.aadharBack instanceof File ? modalEmployee.aadharBack : undefined,
//         bankPassbook: modalEmployee.bankPassbook instanceof File ? modalEmployee.bankPassbook : undefined,
//         panCard: modalEmployee.panCard instanceof File ? modalEmployee.panCard : undefined,
//       }).forEach(([key, value]) => {
//         if (value !== undefined && value !== null && value !== '') {
//           employeeData.append(key, value);
//         }
//       });
//       if (modalType === 'add') {
//         response = await axios.post(`${BASE_URL}/admin/addemployees`, employeeData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         setEmployees((prev) => [
//           ...prev,
//           {
//             ...response.data.user,
//             dateOfJoining: response.data.user.dateOfJoining || '',
//             officialDateOfBirth: response.data.user.officialDateOfBirth || '',
//             actualDateOfBirth: response.data.user.actualDateOfBirth || '',
//             hireDate: response.data.user.hireDate || '',
//           },
//         ]);
//       } else {
//         response = await axios.put(
//           `${BASE_URL}/admin/editemployees/${modalEmployee._id}`,
//           employeeData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
//         setEmployees((prev) =>
//           prev.map((emp, idx) =>
//             idx === modalIndex ? {
//               ...response.data.employee,
//               dateOfJoining: response.data.employee.dateOfJoining || '',
//               officialDateOfBirth: response.data.employee.officialDateOfBirth || '',
//               actualDateOfBirth: response.data.employee.actualDateOfBirth || '',
//               hireDate: response.data.employee.hireDate || '',
//             } : emp
//           )
//         );
//       }
//       setModalOpen(false);
//       setModalEmployee(initialEmployee);
//       setModalIndex(null);
//       setIsEditing(false);
//       setError(null);
//       setSaving(false);
//     } catch (err) {
//       setSaving(false);
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

//   const handleModalChange = (field, value) => {
//     setModalEmployee((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleModalImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!['image/jpeg', 'image/png'].includes(file.type)) {
//         setError('Only JPEG or PNG files are allowed for profile image.');
//         return;
//       }
//       if (file.size > 20 * 1024 * 1024) {
//         setError('Profile image size exceeds 20MB limit.');
//         return;
//       }
//       setModalEmployee((prev) => ({
//         ...prev,
//         profileImage: file,
//       }));
//     }
//   };

//   const handleFileUpload = (field) => (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.type !== 'application/pdf') {
//         setError('Please upload a valid PDF file.');
//         return;
//       }
//       if (file.size > 20 * 1024 * 1024) {
//         setError('File size exceeds 20MB limit.');
//         return;
//       }
//       setModalEmployee((prev) => ({
//         ...prev,
//         [field]: file,
//       }));
//     }
//   };

//   const handleDeleteEmployee = async () => {
//     if (!token) {
//       setError('No authentication token found. Please log in.');
//       navigate('/login');
//       return;
//     }
//     const employeeId = employees[deleteIndex]?._id;
//     if (!employeeId) {
//       setError('Employee ID (_id) is missing. Please try again.');
//       setDeleteIndex(null);
//       return;
//     }
//     try {
//       setSaving(true);
//       await axios.delete(`${BASE_URL}/admin/deleteemployees/${employeeId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEmployees((prev) => prev.filter((_, idx) => idx !== deleteIndex));
//       setDeleteIndex(null);
//       setError(null);
//       setSaving(false);
//     } catch (err) {
//       setSaving(false);
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

//   const openModal = (type, employee = initialEmployee, index = null) => {
//     setModalType(type);
//     setModalEmployee({
//       ...initialEmployee,
//       ...employee,
//       email: employee.email || (type === 'add' ? '' : email),
//       role: employee.role || 'employee',
//       dateOfJoining: employee.dateOfJoining ? parseDateToISO(employee.dateOfJoining) : '',
//       officialDateOfBirth: employee.officialDateOfBirth ? parseDateToISO(employee.officialDateOfBirth) : '',
//       actualDateOfBirth: employee.actualDateOfBirth ? parseDateToISO(employee.actualDateOfBirth) : '',
//       hireDate: employee.hireDate ? parseDateToISO(employee.hireDate) : '',
//     });
//     setModalIndex(index);
//     setIsEditing(type === 'add');
//     setModalOpen(true);
//   };

//   const tableColumns = [
//     { label: 'S.No.', key: 'serialNumber' },
//     { label: 'Image', key: 'profileImage' },
//     { label: 'Name', key: 'fullName' },
//     { label: 'Email', key: 'email' },
//     { label: 'Department', key: 'department' },
//     { label: 'Position', key: 'position' },
//     { label: 'Actions', key: 'actions' },
//   ];

//   const detailFields = {
//     personalInfo: [
//       { label: 'Employee ID', key: 'employeeId', type: 'text', readOnly: true },
//       { label: 'First Name', key: 'firstName', type: 'text', required: true },
//       { label: 'Last Name', key: 'lastName', type: 'text', required: true },
//       { label: 'Official DOB', key: 'officialDateOfBirth', type: 'date' },
//       { label: 'Actual DOB', key: 'actualDateOfBirth', type: 'date' },
//       { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
//       { label: 'Father’s Name', key: 'fathersName', type: 'text' },
//       { label: 'Mother’s Name', key: 'mothersName', type: 'text' },
//       { label: 'Spouse Name', key: 'spouseName', type: 'text' },
//       { label: 'Siblings', key: 'siblings', type: 'text' },
//       { label: 'Medical Insurance', key: 'hasMedicalInsurance', type: 'select', options: ['', 'true', 'false'] },
//     ],
//     contactInfo: [
//       { label: 'Email', key: 'email', type: 'email', required: true },
//       { label: 'Personal Email', key: 'personalEmailId', type: 'email' },
//       { label: 'Primary Phone', key: 'primaryPhoneNumber', type: 'text' },
//       { label: 'Secondary Phone', key: 'secondaryPhoneNumber', type: 'text' },
//       { label: 'Father’s Contact', key: 'fathersContactNo', type: 'text' },
//       { label: 'Mother’s Contact', key: 'mothersContactNo', type: 'text' },
//       { label: 'Spouse Contact', key: 'spouseContactNo', type: 'text' },
//       { label: 'Emergency Contact', key: 'emergencyContact', type: 'text' },
//       { label: 'Permanent Address', key: 'permanentResidentialAddress', type: 'text' },
//       { label: 'Current Address', key: 'currentAddress', type: 'text' },
//     ],
//     bankingInfo: [
//       { label: 'Bank Name', key: 'bankName', type: 'text' },
//       { label: 'Account Number', key: 'accountNumber', type: 'text' },
//       { label: 'IFSC Code', key: 'ifscCode', type: 'text' },
//       { label: 'Bank Branch', key: 'bankBranchName', type: 'text' },
//     ],
//     employmentInfo: [
//       { label: 'Department', key: 'department', type: 'select', options: ['', 'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Procurement'], required: true },
//       { label: 'Position', key: 'position', type: 'text', required: true },
//       { label: 'Date of Joining', key: 'dateOfJoining', type: 'date', required: true },
//       { label: 'Hire Date', key: 'hireDate', type: 'date' },
//       { label: 'Manager', key: 'manager', type: 'text', required: true },
//       { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
//       { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
//     ],
//   };

//   const filteredEmployees = employees.filter((emp) =>
//     `${emp.firstName || ''} ${emp.lastName || ''} ${emp.email || ''} ${emp.department || ''} ${emp.position || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showSearch && !e.target.closest('.search-container') && !e.target.closest('.search-container button')) {
//         setShowSearch(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [showSearch]);

//   return (
//     <div className="flex min-h-screen bg-white">
//       <script src="https://cdn.tailwindcss.com"></script>
//       <div className={`fixed inset-y-0 left-0 z-50 md:sticky md:z-10 w-64 md:w-auto transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
//         <AdminSidebar isOpen={showSidebar} toggleSidebar={() => setShowSidebar((prev) => !prev)} />
//       </div>
//       <div className="flex-1 flex flex-col min-h-screen">
//         <div className="sticky top-0 z-30">
//           <Header isLoggedIn={!!token} onToggleSidebar={() => setShowSidebar((prev) => !prev)} />
//         </div>
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//             <div className="flex items-center gap-2">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">Employee List</h1>
//               <div className="relative search-container">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setShowSearch(!showSearch);
//                   }}
//                   className="p-2 bg-blue-600 text-white rounded-full focus:outline-none touch-action-manipulation"
//                 >
//                   <FaSearch />
//                 </button>
//                 {showSearch && (
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search by name, email, department, or position..."
//                     className="absolute top-0 left-full ml-2 w-0 transition-all duration-300 focus:w-[200px] sm:focus:w-[300px] pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base z-30"
//                     autoFocus
//                   />
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 openModal('add');
//               }}
//               className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm sm:text-base touch-action-manipulation pointer-events-auto"
//             >
//               <FaPlus /> Add Employee
//             </button>
//           </div>
//           {error && (
//             <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
//               {error}
//               <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 touch-action-manipulation">
//                 <FaTimes size={16} />
//               </button>
//             </div>
//           )}
//           {loading ? (
//             <div className="text-center text-blue-500 py-8 flex items-center justify-center gap-2">
//               <FaSpinner className="animate-spin" size={24} />
//               <span>Loading employees...</span>
//             </div>
//           ) : (
//             <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-4">
//               {filteredEmployees.length === 0 ? (
//                 <div className="text-center text-blue-500 py-8">
//                   No employees found. Click to add one!
//                 </div>
//               ) : (
//                 <>
//                   <div className="hidden lg:block">
//                     <table className="min-w-full text-xs sm:text-sm">
//                       <thead>
//                         <tr className="bg-gray-200 text-black">
//                           {tableColumns.map((col) => (
//                             <th key={col.key} className="p-2 sm:p-3 text-left font-semibold whitespace-nowrap">
//                               {col.label}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredEmployees.map((emp, idx) => (
//                           <tr
//                             key={emp._id || `emp-${idx}`}
//                             className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-blue-50 transition cursor-pointer'}
//                             onClick={() => {
//                               console.log('Row clicked for employee:', idx);
//                               openModal('view', emp, idx);
//                             }}
//                           >
//                             <td className="p-2 sm:p-3">{idx + 1}</td>
//                             <td className="p-2 sm:p-3">
//                               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center">
//                                 {emp.profileImage ? (
//                                   <img src={emp.profileImage} alt="Profile" className="w-full h-full object-cover" />
//                                 ) : (
//                                   <FaUser size={16} className="text-blue-500" />
//                                 )}
//                               </div>
//                             </td>
//                             <td className="p-2 sm:p-3 font-semibold">{emp.firstName} {emp.lastName}</td>
//                             <td className="p-2 sm:p-3 truncate max-w-[150px] sm:max-w-[200px]">{emp.email || 'N/A'}</td>
//                             <td className="p-2 sm:p-3">{emp.department || 'N/A'}</td>
//                             <td className="p-2 sm:p-3">{emp.position || 'N/A'}</td>
//                             <td className="p-2 sm:p-3">
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     console.log('View button clicked for employee:', idx);
//                                     openModal('view', emp, idx);
//                                   }}
//                                   className="p-1 sm:p-2 rounded bg-blue-200 hover:bg-blue-300 text-blue-700 touch-action-manipulation"
//                                   title="View"
//                                 >
//                                   <Eye size={12} />
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     console.log('Edit button clicked for employee:', idx);
//                                     openModal('view', emp, idx);
//                                     setIsEditing(true);
//                                   }}
//                                   className="p-1 sm:p-2 rounded bg-green-200 hover:bg-green-300 text-green-700 touch-action-manipulation"
//                                   title="Edit"
//                                 >
//                                   <Edit size={12} />
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     console.log('Delete button clicked for employee:', idx);
//                                     setDeleteIndex(idx);
//                                   }}
//                                   className="p-1 sm:p-2 rounded bg-red-200 hover:bg-red-300 text-red-700 touch-action-manipulation"
//                                   title="Delete"
//                                 >
//                                   <Trash2 size={12} />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                   <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {filteredEmployees.map((emp, idx) => (
//                       <div
//                         key={emp._id || `emp-${idx}`}
//                         className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 relative"
//                         onClick={() => {
//                           console.log('Card clicked for employee:', idx);
//                           openModal('view', emp, idx);
//                         }}
//                       >
//                         <div className="flex items-center gap-4 mb-4">
//                           <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center">
//                             {emp.profileImage ? (
//                               <img src={emp.profileImage} alt="Profile" className="w-full h-full object-cover" />
//                             ) : (
//                               <FaUser size={24} className="text-blue-500" />
//                             )}
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-blue-700">{emp.firstName} {emp.lastName}</h3>
//                             <p className="text-sm text-blue-600">{emp.position || 'N/A'}</p>
//                           </div>
//                         </div>
//                         <p className="text-sm text-blue-800 mb-2">Email: {emp.email || 'N/A'}</p>
//                         <p className="text-sm text-blue-800 mb-2">Dept: {emp.department || 'N/A'}</p>
//                         <div className="flex gap-2 absolute top-4 right-4">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               console.log('View button clicked for employee:', idx);
//                               openModal('view', emp, idx);
//                             }}
//                             className="p-2 rounded bg-blue-200 hover:bg-blue-300 text-blue-700 touch-action-manipulation"
//                             title="View"
//                           >
//                             <FaEye size={16} />
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               console.log('Edit button clicked for employee:', idx);
//                               openModal('view', emp, idx);
//                               setIsEditing(true);
//                             }}
//                             className="p-2 rounded bg-green-200 hover:bg-green-300 text-green-700 touch-action-manipulation"
//                             title="Edit"
//                           >
//                             <FaEdit size={16} />
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               console.log('Delete button clicked for employee:', idx);
//                               setDeleteIndex(idx);
//                             }}
//                             className="p-2 rounded bg-red-200 hover:bg-red-300 text-red-700 touch-action-manipulation"
//                             title="Delete"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//           {modalOpen && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4 sm:p-6" onClick={() => setModalOpen(false)}>
//               <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-6xl max-h-[80vh] overflow-y-auto p-4 sm:p-6 relative" onClick={(e) => e.stopPropagation()}>
//                 {saving && (
//                   <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
//                     <div className="flex items-center gap-2 text-blue-500">
//                       <FaSpinner className="animate-spin" size={24} />
//                       <span>Saving...</span>
//                     </div>
//                   </div>
//                 )}
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg sm:text-xl font-bold text-blue-700">
//                     {modalType === 'add' ? 'Add Employee' : isEditing ? 'Edit Employee' : 'Employee Details'}
//                   </h2>
//                   <div className="flex gap-2">
//                     {modalType !== 'add' && !isEditing && (
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           console.log('Edit button in modal clicked');
//                           setIsEditing(true);
//                         }}
//                         className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-semibold text-sm touch-action-manipulation"
//                       >
//                         <FaPen size={12} /> Edit
//                       </button>
//                     )}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         console.log('Close modal button clicked');
//                         setModalOpen(false);
//                         setModalEmployee(initialEmployee);
//                         setModalIndex(null);
//                         setIsEditing(false);
//                         setError(null);
//                       }}
//                       className="text-blue-600 hover:text-blue-800 text-lg touch-action-manipulation"
//                     >
//                       <FaTimes size={16} />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="relative">
//                     <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
//                       {modalEmployee.profileImage ? (
//                         <a
//                           href={modalEmployee.profileImage instanceof File ? URL.createObjectURL(modalEmployee.profileImage) : modalEmployee.profileImage}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <img
//                             src={modalEmployee.profileImage instanceof File ? URL.createObjectURL(modalEmployee.profileImage) : modalEmployee.profileImage}
//                             alt="Profile"
//                             className="w-full h-full object-cover"
//                           />
//                         </a>
//                       ) : (
//                         <FaUser size={32} className="text-blue-500" />
//                       )}
//                     </div>
//                     {isEditing && (
//                       <label className="absolute bottom-0 right-0 bg-blue-700 hover:bg-blue-800 text-white p-1 sm:p-2 rounded-full cursor-pointer transition-colors touch-action-manipulation">
//                         <FaCamera size={12} />
//                         <input
//                           type="file"
//                           accept="image/jpeg,image/png"
//                           onChange={handleModalImage}
//                           className="hidden"
//                         />
//                       </label>
//                     )}
//                   </div>
//                   <div>
//                     <div className="font-semibold text-base sm:text-lg text-blue-700">
//                       {modalEmployee.firstName} {modalEmployee.lastName}
//                     </div>
//                     <div className="text-blue-600 text-xs sm:text-sm">{modalEmployee.position || 'N/A'}</div>
//                     <div className="text-blue-500 text-xs">{modalEmployee.department || 'N/A'}</div>
//                   </div>
//                 </div>
//                 {modalType === 'add' ? (
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-base font-semibold text-red-700 mb-3">Personal Information</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {[
//                           { label: 'First Name', key: 'firstName', type: 'text', required: true },
//                           { label: 'Last Name', key: 'lastName', type: 'text', required: true },
//                           { label: 'Official DOB', key: 'officialDateOfBirth', type: 'date' },
//                           { label: 'Actual DOB', key: 'actualDateOfBirth', type: 'date' },
//                           { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
//                           { label: 'Father’s Name', key: 'fathersName', type: 'text' },
//                           { label: 'Mother’s Name', key: 'mothersName', type: 'text' },
//                           { label: 'Spouse Name', key: 'spouseName', type: 'text' },
//                           { label: 'Siblings', key: 'siblings', type: 'text' },
//                           { label: 'Medical Insurance', key: 'hasMedicalInsurance', type: 'select', options: ['', 'true', 'false'] },
//                         ].map((field) => (
//                           <div key={field.key}>
//                             <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                               {field.label}
//                               {field.required && '*'}
//                             </label>
//                             {field.type === 'select' ? (
//                               <select
//                                 value={modalEmployee[field.key] || ''}
//                                 onChange={(e) => handleModalChange(field.key, e.target.value)}
//                                 className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                               >
//                                 {field.options.map((option) => (
//                                   <option key={option} value={option}>
//                                     {option === '' ? 'Select' : option === 'true' ? 'Yes' : option === 'false' ? 'No' : option}
//                                   </option>
//                                 ))}
//                               </select>
//                             ) : (
//                               <input
//                                 type={field.type}
//                                 value={modalEmployee[field.key] || ''}
//                                 onChange={(e) => handleModalChange(field.key, e.target.value)}
//                                 className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                               />
//                             )}
//                             {field.type === 'date' && (
//                               <p className="text-xs text-gray-500 mt-1">
//                                 Displayed as: {modalEmployee[field.key] ? formatDateToDDMMMYYYY(modalEmployee[field.key]) : 'N/A'}
//                               </p>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="text-base font-semibold text-red-700 mb-3">Contact Information</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {[
//                           { label: 'Email', key: 'email', type: 'email', required: true },
//                           { label: 'Personal Email', key: 'personalEmailId', type: 'email' },
//                           { label: 'Primary Phone', key: 'primaryPhoneNumber', type: 'text' },
//                           { label: 'Secondary Phone', key: 'secondaryPhoneNumber', type: 'text' },
//                           { label: 'Father’s Contact', key: 'fathersContactNo', type: 'text' },
//                           { label: 'Mother’s Contact', key: 'mothersContactNo', type: 'text' },
//                           { label: 'Spouse Contact', key: 'spouseContactNo', type: 'text' },
//                           { label: 'Emergency Contact', key: 'emergencyContact', type: 'text' },
//                           { label: 'Permanent Address', key: 'permanentResidentialAddress', type: 'text' },
//                           { label: 'Current Address', key: 'currentAddress', type: 'text' },
//                         ].map((field) => (
//                           <div key={field.key}>
//                             <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                               {field.label}
//                               {field.required && '*'}
//                             </label>
//                             <input
//                               type={field.type}
//                               value={modalEmployee[field.key] || ''}
//                               onChange={(e) => handleModalChange(field.key, e.target.value)}
//                               className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="text-base font-semibold text-red-700 mb-3">Banking Information</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {[
//                           { label: 'Bank Name', key: 'bankName', type: 'text' },
//                           { label: 'Account Number', key: 'accountNumber', type: 'text' },
//                           { label: 'IFSC Code', key: 'ifscCode', type: 'text' },
//                           { label: 'Bank Branch', key: 'bankBranchName', type: 'text' },
//                         ].map((field) => (
//                           <div key={field.key}>
//                             <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                               {field.label}
//                             </label>
//                             <input
//                               type={field.type}
//                               value={modalEmployee[field.key] || ''}
//                               onChange={(e) => handleModalChange(field.key, e.target.value)}
//                               className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="text-base font-semibold text-red-700 mb-3">Employment Information</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {[
//                           { label: 'Department', key: 'department', type: 'select', options: ['', 'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Procurement'], required: true },
//                           { label: 'Position', key: 'position', type: 'text', required: true },
//                           { label: 'Date of Joining', key: 'dateOfJoining', type: 'date', required: true },
//                           { label: 'Hire Date', key: 'hireDate', type: 'date' },
//                           { label: 'Manager', key: 'manager', type: 'text', required: true },
//                           { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
//                           { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
//                         ].map((field) => (
//                           <div key={field.key}>
//                             <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                               {field.label}
//                               {field.required && '*'}
//                             </label>
//                             {field.type === 'select' ? (
//                               <select
//                                 value={modalEmployee[field.key] || ''}
//                                 onChange={(e) => handleModalChange(field.key, e.target.value)}
//                                 className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                               >
//                                 {field.options.map((option) => (
//                                   <option key={option} value={option}>
//                                     {option === '' ? 'Select' : option.charAt(0).toUpperCase() + option.slice(1)}
//                                   </option>
//                                 ))}
//                               </select>
//                             ) : (
//                               <input
//                                 type={field.type}
//                                 value={modalEmployee[field.key] || ''}
//                                 onChange={(e) => handleModalChange(field.key, e.target.value)}
//                                 className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                               />
//                             )}
//                             {field.type === 'date' && (
//                               <p className="text-xs text-gray-500 mt-1">
//                                 Displayed as: {modalEmployee[field.key] ? formatDateToDDMMMYYYY(modalEmployee[field.key]) : 'N/A'}
//                               </p>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="text-base font-semibold text-red-700 mb-3">Documents</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {['aadharFront', 'aadharBack', 'bankPassbook', 'panCard'].map((field) => (
//                           <div key={field}>
//                             <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                               {field === 'aadharFront' ? 'Aadhar Card (Front)' : field === 'aadharBack' ? 'Aadhar Card (Back)' : field === 'bankPassbook' ? 'Bank Passbook (PDF)' : 'PAN Card (PDF)'}
//                             </label>
//                             <div className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors">
//                               {modalEmployee[field] ? (
//                                 <div className="text-center">
//                                   <p className="text-sm truncate max-w-[200px]">{modalEmployee[field].name || field}</p>
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       console.log(`Remove ${field} button clicked`);
//                                       handleModalChange(field, null);
//                                     }}
//                                     className="text-xs text-blue-600 hover:text-blue-800 mt-1 touch-action-manipulation"
//                                   >
//                                     Remove
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <>
//                                   <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                                   <p className="text-sm">Drag & drop PDF or click to upload</p>
//                                 </>
//                               )}
//                               <input
//                                 type="file"
//                                 accept="application/pdf"
//                                 onChange={handleFileUpload(field)}
//                                 className="absolute w-full h-full opacity-0 cursor-pointer touch-action-manipulation"
//                               />
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-base font-semibold text-red-700 mb-3">Documents</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {['aadharFront', 'aadharBack', 'bankPassbook', 'panCard'].map((field) => (
//                           <div key={field}>
//                             <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                               {field === 'aadharFront' ? 'Aadhar Card (Front)' : field === 'aadharBack' ? 'Aadhar Card (Back)' : field === 'bankPassbook' ? 'Bank Passbook (PDF)' : 'PAN Card (PDF)'}
//                             </label>
//                             {isEditing ? (
//                               <div className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors">
//                                 {modalEmployee[field] ? (
//                                   <div className="text-center">
//                                     <p className="text-sm truncate max-w-[200px]">{modalEmployee[field].name || field}</p>
//                                     <button
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         console.log(`Remove ${field} button clicked`);
//                                         handleModalChange(field, null);
//                                       }}
//                                       className="text-xs text-blue-600 hover:text-blue-800 mt-1 touch-action-manipulation"
//                                     >
//                                       Remove
//                                     </button>
//                                   </div>
//                                 ) : (
//                                   <>
//                                     <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                                     <p className="text-sm">Drag & drop PDF or click to upload</p>
//                                   </>
//                                 )}
//                                 <input
//                                   type="file"
//                                   accept="application/pdf"
//                                   onChange={handleFileUpload(field)}
//                                   className="absolute w-full h-full opacity-0 cursor-pointer touch-action-manipulation"
//                                 />
//                               </div>
//                             ) : (
//                               <div>
//                                 {modalEmployee[field] ? (
//                                   <a
//                                     href={modalEmployee[field] instanceof File ? URL.createObjectURL(modalEmployee[field]) : modalEmployee[field]}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="flex items-center space-x-2"
//                                   >
//                                     <FaFilePdf size={24} className="text-blue-400" />
//                                     <p className="text-blue-800 text-sm sm:text-base truncate max-w-[200px]">
//                                       {field}
//                                     </p>
//                                   </a>
//                                 ) : (
//                                   <p className="text-blue-800 text-sm sm:text-base">Not uploaded</p>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     {Object.entries(detailFields).map(([section, fields]) => (
//                       <div key={section}>
//                         <h3 className="text-base font-semibold text-red-700 mb-3">
//                           {section === 'personalInfo' ? 'Personal Information' : section === 'contactInfo' ? 'Contact Information' : section === 'bankingInfo' ? 'Banking Information' : 'Employment Information'}
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           {fields.map((field) => (
//                             <div key={field.key}>
//                               <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
//                                 {field.label}
//                                 {field.required && '*'}
//                               </label>
//                               {isEditing && field.type !== 'select' && !field.readOnly ? (
//                                 <input
//                                   type={field.type}
//                                   value={modalEmployee[field.key] || ''}
//                                   onChange={(e) => handleModalChange(field.key, e.target.value)}
//                                   className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                                 />
//                               ) : isEditing && field.type === 'select' ? (
//                                 <select
//                                   value={modalEmployee[field.key] || ''}
//                                   onChange={(e) => handleModalChange(field.key, e.target.value)}
//                                   className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
//                                 >
//                                   {field.options.map((option) => (
//                                     <option key={option} value={option}>
//                                       {option === '' ? 'Select' : option === 'true' ? 'Yes' : option === 'false' ? 'No' : option.charAt(0).toUpperCase() + option.slice(1)}
//                                     </option>
//                                   ))}
//                                 </select>
//                               ) : (
//                                 <div className="text-sm text-blue-800">
//                                   {field.type === 'date' ? (modalEmployee[field.key] ? formatDateToDDMMMYYYY(modalEmployee[field.key]) : 'N/A') : (modalEmployee[field.key] || 'N/A')}
//                                 </div>
//                               )}
//                               {isEditing && field.type === 'date' && (
//                                 <p className="text-xs text-gray-500 mt-1">
//                                   Displayed as: {modalEmployee[field.key] ? formatDateToDDMMMYYYY(modalEmployee[field.key]) : 'N/A'}
//                                 </p>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {isEditing && (
//                   <div className="flex justify-end mt-4 sm:mt-6 gap-2">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         console.log('Cancel button in modal clicked');
//                         if (modalType === 'add') {
//                           setModalOpen(false);
//                           setModalEmployee(initialEmployee);
//                           setModalIndex(null);
//                         } else {
//                           setIsEditing(false);
//                         }
//                         setError(null);
//                       }}
//                       className="px-4 py-2 bg-blue-200 text-blue-700 rounded-md font-semibold text-sm sm:text-base hover:bg-blue-300 touch-action-manipulation"
//                       disabled={saving}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         console.log('Save button in modal clicked');
//                         handleSaveEmployee();
//                       }}
//                       className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm sm:text-base touch-action-manipulation"
//                       disabled={saving}
//                     >
//                       {saving ? (
//                         <>
//                           <FaSpinner className="animate-spin" size={12} />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <FaSave /> Save
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//           {deleteIndex !== null && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4" onClick={() => setDeleteIndex(null)}>
//               <div className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm p-4 sm:p-6 relative" onClick={(e) => e.stopPropagation()}>
//                 {saving && (
//                   <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
//                     <div className="flex items-center gap-2 text-blue-500">
//                       <FaSpinner className="animate-spin" size={24} />
//                       <span>Deleting...</span>
//                     </div>
//                   </div>
//                 )}
//                 <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-4">Delete Employee</h2>
//                 <p className="mb-4 sm:mb-6 text-sm sm:text-base">
//                   Are you sure you want to delete{' '}
//                   <span className="font-semibold text-blue-700">
//                     {employees[deleteIndex]?.firstName || ''} {employees[deleteIndex]?.lastName || ''}
//                   </span>
//                   ?
//                 </p>
//                 <div className="flex justify-end gap-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       console.log('Cancel delete button clicked');
//                       setDeleteIndex(null);
//                     }}
//                     className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-blue-200 text-blue-700 font-semibold text-sm sm:text-base hover:bg-blue-300 touch-action-manipulation"
//                     disabled={saving}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       console.log('Confirm delete button clicked');
//                       handleDeleteEmployee();
//                     }}
//                     className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-red-600 text-white font-semibold text-sm sm:text-base hover:bg-red-700 touch-action-manipulation"
//                     disabled={saving}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default EmployeeListPage;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  FaUser,
  FaEdit,
  FaPlus,
  FaSave,
  FaCamera,
  FaTimes,
  FaPen,
  FaFilePdf,
  FaSpinner,
  FaSearch,
  FaEye,
} from 'react-icons/fa';
import { Trash2, Eye, Edit } from 'lucide-react';
import Header from '../../components/common/Header';
import AdminSidebar from '../../components/common/AdminSidebar';
import { useNavigate } from 'react-router-dom';

// Base URL for API
const BASE_URL = 'https://task-manager-backend-xs5s.onrender.com/api';

// Initial employee fields
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
  aadharFront: null,
  aadharBack: null,
  bankPassbook: null,
  panCard: null,
};

// Validation schema using Yup
const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  department: Yup.string().required('Department is required'),
  position: Yup.string().required('Position is required'),
  dateOfJoining: Yup.string()
    .required('Date of Joining is required')
    .test('valid-date', 'Invalid date format for Date of Joining', (value) =>
      isValidDateFormat(value)
    ),
  manager: Yup.string().required('Manager is required'),
  role: Yup.string().required('Role is required'),
  workLocation: Yup.string().required('Work Location is required'),
  officialDateOfBirth: Yup.string().test(
    'valid-date',
    'Invalid date format for Official DOB',
    (value) => !value || isValidDateFormat(value)
  ),
  actualDateOfBirth: Yup.string().test(
    'valid-date',
    'Invalid date format for Actual DOB',
    (value) => !value || isValidDateFormat(value)
  ),
  hireDate: Yup.string().test(
    'valid-date',
    'Invalid date format for Hire Date',
    (value) => !value || isValidDateFormat(value)
  ),
  primaryPhoneNumber: Yup.string().optional(),
  secondaryPhoneNumber: Yup.string().optional(),
  personalEmailId: Yup.string().email('Invalid personal email format').optional(),
  permanentResidentialAddress: Yup.string().optional(),
  currentAddress: Yup.string().optional(),
  bankName: Yup.string().optional(),
  accountNumber: Yup.string().optional(),
  ifscCode: Yup.string().optional(),
  bankBranchName: Yup.string().optional(),
  fathersName: Yup.string().optional(),
  fathersContactNo: Yup.string().optional(),
  mothersName: Yup.string().optional(),
  mothersContactNo: Yup.string().optional(),
  spouseName: Yup.string().optional(),
  spouseContactNo: Yup.string().optional(),
  siblings: Yup.string().optional(),
  bloodGroup: Yup.string().optional(),
  hasMedicalInsurance: Yup.string().optional(),
  emergencyContact: Yup.string().optional(),
});

// Helper function to format date from YYYY-MM-DD to DD MMM YYYY
const formatDateToDDMMMYYYY = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(/ /g, ' ');
};

// Helper function to parse date from DD MMM YYYY to YYYY-MM-DD
const parseDateToISO = (dateString) => {
  if (!dateString) return '';
  const dateRegex = /^(\d{2})\s([A-Za-z]{3})\s(\d{4})$/;
  const match = dateRegex.exec(dateString);
  if (!match) {
    const date = new Date(dateString); // Try parsing as YYYY-MM-DD
    if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
    return '';
  }
  const [_, day, monthStr, year] = match;
  const monthIndex = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ].indexOf(monthStr);
  if (monthIndex === -1) return '';
  const date = new Date(year, monthIndex, day);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

// Validate date format (DD MMM YYYY or YYYY-MM-DD)
const isValidDateFormat = (dateString) => {
  if (!dateString) return true; // Allow empty for non-required fields
  // Try YYYY-MM-DD (from input type="date")
  let date = new Date(dateString);
  if (!isNaN(date.getTime())) return true;
  // Try DD MMM YYYY
  const dateRegex = /^(\d{2})\s([A-Za-z]{3})\s(\d{4})$/;
  if (!dateRegex.test(dateString)) return false;
  const [_, day, monthStr, year] = dateRegex.exec(dateString);
  const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthStr);
  if (monthIndex === -1) return false;
  date = new Date(year, monthIndex, day);
  return !isNaN(date.getTime()) && date.getDate() === parseInt(day) && date.getMonth() === monthIndex && date.getFullYear() === parseInt(year);
};

const EmployeeListPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [modalEmployee, setModalEmployee] = useState(initialEmployee);
  const [modalIndex, setModalIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';
  const email = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    if (!token) {
      setError('Please log in to view employees.');
      navigate('/login');
    }
  }, [token, email, navigate]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/admin/allemployees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const employeesData = Array.isArray(response.data) ? response.data : response.data.employees || [];
        setEmployees(
          employeesData.map((emp) => ({
            ...emp,
            dateOfJoining: emp.dateOfJoining || '',
            officialDateOfBirth: emp.officialDateOfBirth || '',
            actualDateOfBirth: emp.actualDateOfBirth || '',
            hireDate: emp.hireDate || '',
          }))
        );
        setLoading(false);
      } catch (err) {
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

  const handleFileUpload = (setFieldValue, field) => (event) => {
    const file = event.target.files[0];
    if (file) {
      if (['aadharFront', 'aadharBack', 'bankPassbook', 'panCard'].includes(field)) {
        if (file.type !== 'application/pdf') {
          setError('Please upload a valid PDF file.');
          return;
        }
        if (file.size > 20 * 1024 * 1024) {
          setError('File size exceeds 20MB limit.');
          return;
        }
      } else if (field === 'profileImage') {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          setError('Only JPEG or PNG files are allowed for profile image.');
          return;
        }
        if (file.size > 20 * 1024 * 1024) {
          setError('Profile image size exceeds 20MB limit.');
          return;
        }
      }
      setFieldValue(field, file);
      setError(null);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!token) {
      setError('No authentication token found. Please log in.');
      navigate('/login');
      return;
    }
    const employeeId = employees[deleteIndex]?._id;
    if (!employeeId) {
      setError('Employee ID (_id) is missing. Please try again.');
      setDeleteIndex(null);
      return;
    }
    try {
      setSaving(true);
      await axios.delete(`${BASE_URL}/admin/deleteemployees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees((prev) => prev.filter((_, idx) => idx !== deleteIndex));
      setDeleteIndex(null);
      setError(null);
      setSaving(false);
    } catch (err) {
      setSaving(false);
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

  const openModal = (type, employee = initialEmployee, index = null) => {
    setModalType(type);
    setModalEmployee({
      ...initialEmployee,
      ...employee,
      email: employee.email || (type === 'add' ? '' : email),
      role: employee.role || 'employee',
      dateOfJoining: employee.dateOfJoining ? parseDateToISO(employee.dateOfJoining) : '',
      officialDateOfBirth: employee.officialDateOfBirth ? parseDateToISO(employee.officialDateOfBirth) : '',
      actualDateOfBirth: employee.actualDateOfBirth ? parseDateToISO(employee.actualDateOfBirth) : '',
      hireDate: employee.hireDate ? parseDateToISO(employee.hireDate) : '',
    });
    setModalIndex(index);
    setIsEditing(type === 'add');
    setModalOpen(true);
    setError(null);
  };

  const tableColumns = [
    { label: 'S.No.', key: 'serialNumber' },
    { label: 'Image', key: 'profileImage' },
    { label: 'Name', key: 'fullName' },
    { label: 'Email', key: 'email' },
    { label: 'Department', key: 'department' },
    { label: 'Position', key: 'position' },
    { label: 'Actions', key: 'actions' },
  ];

  const detailFields = {
    personalInfo: [
      { label: 'Employee ID', key: 'employeeId', type: 'text', readOnly: true },
      { label: 'First Name', key: 'firstName', type: 'text', required: true },
      { label: 'Last Name', key: 'lastName', type: 'text', required: true },
      { label: 'Official DOB', key: 'officialDateOfBirth', type: 'date' },
      { label: 'Actual DOB', key: 'actualDateOfBirth', type: 'date' },
      { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
      { label: 'Father’s Name', key: 'fathersName', type: 'text' },
      { label: 'Mother’s Name', key: 'mothersName', type: 'text' },
      { label: 'Spouse Name', key: 'spouseName', type: 'text' },
      { label: 'Siblings', key: 'siblings', type: 'text' },
      { label: 'Medical Insurance', key: 'hasMedicalInsurance', type: 'select', options: ['', 'true', 'false'] },
    ],
    contactInfo: [
      { label: 'Email', key: 'email', type: 'email', required: true },
      { label: 'Personal Email', key: 'personalEmailId', type: 'email' },
      { label: 'Primary Phone', key: 'primaryPhoneNumber', type: 'text' },
      { label: 'Secondary Phone', key: 'secondaryPhoneNumber', type: 'text' },
      { label: 'Father’s Contact', key: 'fathersContactNo', type: 'text' },
      { label: 'Mother’s Contact', key: 'mothersContactNo', type: 'text' },
      { label: 'Spouse Contact', key: 'spouseContactNo', type: 'text' },
      { label: 'Emergency Contact', key: 'emergencyContact', type: 'text' },
      { label: 'Permanent Address', key: 'permanentResidentialAddress', type: 'text' },
      { label: 'Current Address', key: 'currentAddress', type: 'text' },
    ],
    bankingInfo: [
      { label: 'Bank Name', key: 'bankName', type: 'text' },
      { label: 'Account Number', key: 'accountNumber', type: 'text' },
      { label: 'IFSC Code', key: 'ifscCode', type: 'text' },
      { label: 'Bank Branch', key: 'bankBranchName', type: 'text' },
    ],
    employmentInfo: [
      { label: 'Department', key: 'department', type: 'select', options: ['', 'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Procurement'], required: true },
      { label: 'Position', key: 'position', type: 'text', required: true },
      { label: 'Date of Joining', key: 'dateOfJoining', type: 'date', required: true },
      { label: 'Hire Date', key: 'hireDate', type: 'date' },
      { label: 'Manager', key: 'manager', type: 'text', required: true },
      { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
      { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
    ],
  };

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName || ''} ${emp.lastName || ''} ${emp.email || ''} ${emp.department || ''} ${emp.position || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSearch && !e.target.closest('.search-container') && !e.target.closest('.search-container button')) {
        setShowSearch(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSearch]);

  return (
    <div className="flex min-h-screen bg-white">
      <script src="https://cdn.tailwindcss.com"></script>
      <div
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:z-10 w-64 md:w-auto transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <AdminSidebar isOpen={showSidebar} toggleSidebar={() => setShowSidebar((prev) => !prev)} />
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="sticky top-0 z-30">
          <Header isLoggedIn={!!token} onToggleSidebar={() => setShowSidebar((prev) => !prev)} />
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">Employee List</h1>
              <div className="relative search-container">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSearch(!showSearch);
                  }}
                  className="p-2 bg-blue-600 text-white rounded-full focus:outline-none touch-action-manipulation"
                >
                  <FaSearch />
                </button>
                {showSearch && (
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, department, or position..."
                    className="absolute top-0 left-full ml-2 w-0 transition-all duration-300 focus:w-[200px] sm:focus:w-[300px] pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base z-30"
                    autoFocus
                  />
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal('add');
              }}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm sm:text-base touch-action-manipulation pointer-events-auto"
            >
              <FaPlus /> Add Employee
            </button>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
              {error}
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900 touch-action-manipulation"
              >
                <FaTimes size={16} />
              </button>
            </div>
          )}
          {loading ? (
            <div className="text-center text-blue-500 py-8 flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" size={24} />
              <span>Loading employees...</span>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-4">
              {filteredEmployees.length === 0 ? (
                <div className="text-center text-blue-500 py-8">No employees found. Click to add one!</div>
              ) : (
                <>
                  <div className="hidden lg:block">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-gray-200 text-black">
                          {tableColumns.map((col) => (
                            <th key={col.key} className="p-2 sm:p-3 text-left font-semibold whitespace-nowrap">
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.map((emp, idx) => (
                          <tr
                            key={emp._id || `emp-${idx}`}
                            className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-blue-50 transition cursor-pointer'}
                            onClick={() => {
                              console.log('Row clicked for employee:', idx);
                              openModal('view', emp, idx);
                            }}
                          >
                            <td className="p-2 sm:p-3">{idx + 1}</td>
                            <td className="p-2 sm:p-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center">
                                {emp.profileImage ? (
                                  <img src={emp.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <FaUser size={16} className="text-blue-500" />
                                )}
                              </div>
                            </td>
                            <td className="p-2 sm:p-3 font-semibold">
                              {emp.firstName} {emp.lastName}
                            </td>
                            <td className="p-2 sm:p-3 truncate max-w-[150px] sm:max-w-[200px]">
                              {emp.email || 'N/A'}
                            </td>
                            <td className="p-2 sm:p-3">{emp.department || 'N/A'}</td>
                            <td className="p-2 sm:p-3">{emp.position || 'N/A'}</td>
                            <td className="p-2 sm:p-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('View button clicked for employee:', idx);
                                    openModal('view', emp, idx);
                                  }}
                                  className="p-1 sm:p-2 rounded bg-blue-200 hover:bg-blue-300 text-blue-700 touch-action-manipulation"
                                  title="View"
                                >
                                  <Eye size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Edit button clicked for employee:', idx);
                                    openModal('view', emp, idx);
                                    setIsEditing(true);
                                  }}
                                  className="p-1 sm:p-2 rounded bg-green-200 hover:bg-green-300 text-green-700 touch-action-manipulation"
                                  title="Edit"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Delete button clicked for employee:', idx);
                                    setDeleteIndex(idx);
                                  }}
                                  className="p-1 sm:p-2 rounded bg-red-200 hover:bg-red-300 text-red-700 touch-action-manipulation"
                                  title="Delete"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredEmployees.map((emp, idx) => (
                      <div
                        key={emp._id || `emp-${idx}`}
                        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 relative"
                        onClick={() => {
                          console.log('Card clicked for employee:', idx);
                          openModal('view', emp, idx);
                        }}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center">
                            {emp.profileImage ? (
                              <img src={emp.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <FaUser size={24} className="text-blue-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-700">
                              {emp.firstName} {emp.lastName}
                            </h3>
                            <p className="text-sm text-blue-600">{emp.position || 'N/A'}</p>
                          </div>
                        </div>
                        <p className="text-sm text-blue-800 mb-2">Email: {emp.email || 'N/A'}</p>
                        <p className="text-sm text-blue-800 mb-2">Dept: {emp.department || 'N/A'}</p>
                        <div className="flex gap-2 absolute top-4 right-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('View button clicked for employee:', idx);
                              openModal('view', emp, idx);
                            }}
                            className="p-2 rounded bg-blue-200 hover:bg-blue-300 text-blue-700 touch-action-manipulation"
                            title="View"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Edit button clicked for employee:', idx);
                              openModal('view', emp, idx);
                              setIsEditing(true);
                            }}
                            className="p-2 rounded bg-green-200 hover:bg-green-300 text-green-700 touch-action-manipulation"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Delete button clicked for employee:', idx);
                              setDeleteIndex(idx);
                            }}
                            className="p-2 rounded bg-red-200 hover:bg-red-300 text-red-700 touch-action-manipulation"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {modalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4 sm:p-6"
              onClick={() => setModalOpen(false)}
            >
              <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-6xl max-h-[80vh] overflow-y-auto p-4 sm:p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {saving && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-blue-500">
                      <FaSpinner className="animate-spin" size={24} />
                      <span>Saving...</span>
                    </div>
                  </div>
                )}
                <Formik
                  initialValues={modalEmployee}
                  validationSchema={validationSchema}
                  enableReinitialize
                  onSubmit={async (values, { setSubmitting }) => {
                    if (!token) {
                      setError('No authentication token found. Please log in.');
                      navigate('/login');
                      setSubmitting(false);
                      return;
                    }
                    try {
                      setSaving(true);
                      let response;
                      const employeeData = new FormData();
                      Object.entries({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        department: values.department,
                        position: values.position,
                        dateOfJoining: values.dateOfJoining ? parseDateToISO(values.dateOfJoining) : undefined,
                        manager: values.manager,
                        role: values.role,
                        workLocation: values.workLocation || undefined,
                        profileImage: values.profileImage instanceof File ? values.profileImage : undefined,
                        officialDateOfBirth: values.officialDateOfBirth
                          ? parseDateToISO(values.officialDateOfBirth)
                          : undefined,
                        actualDateOfBirth: values.actualDateOfBirth
                          ? parseDateToISO(values.actualDateOfBirth)
                          : undefined,
                        primaryPhoneNumber: values.primaryPhoneNumber || undefined,
                        secondaryPhoneNumber: values.secondaryPhoneNumber || undefined,
                        personalEmailId: values.personalEmailId || undefined,
                        permanentResidentialAddress: values.permanentResidentialAddress || undefined,
                        currentAddress: values.currentAddress || undefined,
                        bankName: values.bankName || undefined,
                        accountNumber: values.accountNumber || undefined,
                        ifscCode: values.ifscCode || undefined,
                        bankBranchName: values.bankBranchName || undefined,
                        fathersName: values.fathersName || undefined,
                        fathersContactNo: values.fathersContactNo || undefined,
                        mothersName: values.mothersName || undefined,
                        mothersContactNo: values.mothersContactNo || undefined,
                        spouseName: values.spouseName || undefined,
                        spouseContactNo: values.spouseContactNo || undefined,
                        siblings: values.siblings || undefined,
                        bloodGroup: values.bloodGroup || undefined,
                        hasMedicalInsurance: values.hasMedicalInsurance || undefined,
                        hireDate: values.hireDate ? parseDateToISO(values.hireDate) : undefined,
                        emergencyContact: values.emergencyContact || undefined,
                        aadharFront: values.aadharFront instanceof File ? values.aadharFront : undefined,
                        aadharBack: values.aadharBack instanceof File ? values.aadharBack : undefined,
                        bankPassbook: values.bankPassbook instanceof File ? values.bankPassbook : undefined,
                        panCard: values.panCard instanceof File ? values.panCard : undefined,
                      }).forEach(([key, value]) => {
                        if (value !== undefined && value !== null && value !== '') {
                          employeeData.append(key, value);
                        }
                      });
                      if (modalType === 'add') {
                        response = await axios.post(`${BASE_URL}/admin/addemployees`, employeeData, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                          },
                        });
                        setEmployees((prev) => [
                          ...prev,
                          {
                            ...response.data.user,
                            dateOfJoining: response.data.user.dateOfJoining || '',
                            officialDateOfBirth: response.data.user.officialDateOfBirth || '',
                            actualDateOfBirth: response.data.user.actualDateOfBirth || '',
                            hireDate: response.data.user.hireDate || '',
                          },
                        ]);
                      } else {
                        response = await axios.put(
                          `${BASE_URL}/admin/editemployees/${values._id}`,
                          employeeData,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              'Content-Type': 'multipart/form-data',
                            },
                          }
                        );
                        setEmployees((prev) =>
                          prev.map((emp, idx) =>
                            idx === modalIndex
                              ? {
                                  ...response.data.employee,
                                  dateOfJoining: response.data.employee.dateOfJoining || '',
                                  officialDateOfBirth: response.data.employee.officialDateOfBirth || '',
                                  actualDateOfBirth: response.data.employee.actualDateOfBirth || '',
                                  hireDate: response.data.employee.hireDate || '',
                                }
                              : emp
                          )
                        );
                      }
                      setModalOpen(false);
                      setModalEmployee(initialEmployee);
                      setModalIndex(null);
                      setIsEditing(false);
                      setError(null);
                      setSaving(false);
                      setSubmitting(false);
                    } catch (err) {
                      setSaving(false);
                      setSubmitting(false);
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
                        setError(
                          err.response?.data?.message || `Failed to ${modalType === 'add' ? 'add' : 'edit'} employee`
                        );
                      }
                    }
                  }}
                >
                  {({ setFieldValue, values, errors, touched }) => (
                    <Form>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-blue-700">
                          {modalType === 'add' ? 'Add Employee' : isEditing ? 'Edit Employee' : 'Employee Details'}
                        </h2>
                        <div className="flex gap-2">
                          {modalType !== 'add' && !isEditing && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Edit button in modal clicked');
                                setIsEditing(true);
                              }}
                              className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-semibold text-sm touch-action-manipulation"
                            >
                              <FaPen size={12} /> Edit
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Close modal button clicked');
                              setModalOpen(false);
                              setModalEmployee(initialEmployee);
                              setModalIndex(null);
                              setIsEditing(false);
                              setError(null);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-lg touch-action-manipulation"
                          >
                            <FaTimes size={16} />
                          </button>
                        </div>
                      </div>
                      {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
                          {error}
                          <button
                            onClick={() => setError(null)}
                            className="text-red-700 hover:text-red-900 touch-action-manipulation"
                          >
                            <FaTimes size={16} />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
                            {values.profileImage ? (
                              <a
                                href={
                                  values.profileImage instanceof File
                                    ? URL.createObjectURL(values.profileImage)
                                    : values.profileImage
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={
                                    values.profileImage instanceof File
                                      ? URL.createObjectURL(values.profileImage)
                                      : values.profileImage
                                  }
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              </a>
                            ) : (
                              <FaUser size={32} className="text-blue-500" />
                            )}
                          </div>
                          {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-blue-700 hover:bg-blue-800 text-white p-1 sm:p-2 rounded-full cursor-pointer transition-colors touch-action-manipulation">
                              <FaCamera size={12} />
                              <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleFileUpload(setFieldValue, 'profileImage')}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-base sm:text-lg text-blue-700">
                            {values.firstName} {values.lastName}
                          </div>
                          <div className="text-blue-600 text-xs sm:text-sm">{values.position || 'N/A'}</div>
                          <div className="text-blue-500 text-xs">{values.department || 'N/A'}</div>
                        </div>
                      </div>
                      {modalType === 'add' || isEditing ? (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-base font-semibold text-red-700 mb-3">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { label: 'First Name', key: 'firstName', type: 'text', required: true },
                                { label: 'Last Name', key: 'lastName', type: 'text', required: true },
                                { label: 'Official DOB', key: 'officialDateOfBirth', type: 'date' },
                                { label: 'Actual DOB', key: 'actualDateOfBirth', type: 'date' },
                                { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
                                { label: 'Father’s Name', key: 'fathersName', type: 'text' },
                                { label: 'Mother’s Name', key: 'mothersName', type: 'text' },
                                { label: 'Spouse Name', key: 'spouseName', type: 'text' },
                                { label: 'Siblings', key: 'siblings', type: 'text' },
                                {
                                  label: 'Medical Insurance',
                                  key: 'hasMedicalInsurance',
                                  type: 'select',
                                  options: ['', 'true', 'false'],
                                },
                              ].map((field) => (
                                <div key={field.key}>
                                  <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
                                    {field.label}
                                    {field.required && <span className="text-red-500">*</span>}
                                  </label>
                                  {field.type === 'select' ? (
                                    <Field
                                      as="select"
                                      name={field.key}
                                      className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
                                    >
                                      {field.options.map((option) => (
                                        <option key={option} value={option}>
                                          {option === '' ? 'Select' : option === 'true' ? 'Yes' : option === 'false' ? 'No' : option}
                                        </option>
                                      ))}
                                    </Field>
                                  ) : (
                                    <Field
                                      type={field.type}
                                      name={field.key}
                                      className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
                                    />
                                  )}
                                  <ErrorMessage
                                    name={field.key}
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                  />
                                  {field.type === 'date' && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Displayed as: {values[field.key] ? formatDateToDDMMMYYYY(values[field.key]) : 'N/A'}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-red-700 mb-3">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { label: 'Email', key: 'email', type: 'email', required: true },
                                { label: 'Personal Email', key: 'personalEmailId', type: 'email' },
                                { label: 'Primary Phone', key: 'primaryPhoneNumber', type: 'text' },
                                { label: 'Secondary Phone', key: 'secondaryPhoneNumber', type: 'text' },
                                { label: 'Father’s Contact', key: 'fathersContactNo', type: 'text' },
                                { label: 'Mother’s Contact', key: 'mothersContactNo', type: 'text' },
                                { label: 'Spouse Contact', key: 'spouseContactNo', type: 'text' },
                                { label: 'Emergency Contact', key: 'emergencyContact', type: 'text' },
                                { label: 'Permanent Address', key: 'permanentResidentialAddress', type: 'text' },
                                { label: 'Current Address', key: 'currentAddress', type: 'text' },
                              ].map((field) => (
                                <div key={field.key}>
                                  <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
                                    {field.label}
                                    {field.required && <span className="text-red-500">*</span>}
                                  </label>
                                  <Field
                                    type={field.type}
                                    name={field.key}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
                                  />
                                  <ErrorMessage
                                    name={field.key}
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-red-700 mb-3">Banking Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { label: 'Bank Name', key: 'bankName', type: 'text' },
                                { label: 'Account Number', key: 'accountNumber', type: 'text' },
                                { label: 'IFSC Code', key: 'ifscCode', type: 'text' },
                                { label: 'Bank Branch', key: 'bankBranchName', type: 'text' },
                              ].map((field) => (
                                <div key={field.key}>
                                  <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
                                    {field.label}
                                  </label>
                                  <Field
                                    type={field.type}
                                    name={field.key}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
                                  />
                                  <ErrorMessage
                                    name={field.key}
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-red-700 mb-3">Employment Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                {
                                  label: 'Department',
                                  key: 'department',
                                  type: 'select',
                                  options: ['', 'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Procurement'],
                                  required: true,
                                },
                                { label: 'Position', key: 'position', type: 'text', required: true },
                                { label: 'Date of Joining', key: 'dateOfJoining', type: 'date', required: true },
                                { label: 'Hire Date', key: 'hireDate', type: 'date' },
                                { label: 'Manager', key: 'manager', type: 'text', required: true },
                                { label: 'Work Location', key: 'workLocation', type: 'text', required: true },
                                { label: 'Role', key: 'role', type: 'select', options: ['employee', 'admin'], required: true },
                              ].map((field) => (
                                <div key={field.key}>
                                  <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
                                    {field.label}
                                    {field.required && <span className="text-red-500">*</span>}
                                  </label>
                                  {field.type === 'select' ? (
                                    <Field
                                      as="select"
                                      name={field.key}
                                      className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
                                    >
                                      {field.options.map((option) => (
                                        <option key={option} value={option}>
                                          {option === '' ? 'Select' : option.charAt(0).toUpperCase() + option.slice(1)}
                                        </option>
                                      ))}
                                    </Field>
                                  ) : (
                                    <Field
                                      type={field.type}
                                      name={field.key}
                                      className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 touch-action-manipulation"
                                    />
                                  )}
                                  <ErrorMessage
                                    name={field.key}
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                  />
                                  {field.type === 'date' && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Displayed as: {values[field.key] ? formatDateToDDMMMYYYY(values[field.key]) : 'N/A'}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-red-700 mb-3">Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {['aadharFront', 'aadharBack', 'bankPassbook', 'panCard'].map((field) => (
                                <div key={field}>
                                  <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
                                    {field === 'aadharFront'
                                      ? 'Aadhar Card (Front)'
                                      : field === 'aadharBack'
                                      ? 'Aadhar Card (Back)'
                                      : field === 'bankPassbook'
                                      ? 'Bank Passbook (PDF)'
                                      : 'PAN Card (PDF)'}
                                  </label>
                                  <div className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors">
                                    {values[field] ? (
                                      <div className="text-center">
                                        <p className="text-sm truncate max-w-[200px]">
                                          {values[field].name || field}
                                        </p>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            console.log(`Remove ${field} button clicked`);
                                            setFieldValue(field, null);
                                          }}
                                          className="text-xs text-blue-600 hover:text-blue-800 mt-1 touch-action-manipulation"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <FaFilePdf size={24} className="text-blue-400 mb-2" />
                                        <p className="text-sm">Drag & drop PDF or click to upload</p>
                                      </>
                                    )}
                                    <input
                                      type="file"
                                      accept="application/pdf"
                                      onChange={handleFileUpload(setFieldValue, field)}
                                      className="absolute w-full h-full opacity-0 cursor-pointer touch-action-manipulation"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-base font-semibold text-red-700 mb-3">Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {['aadharFront', 'aadharBack', 'bankPassbook', 'panCard'].map((field) => (
                                <div key={field}>
                                  <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
                                    {field === 'aadharFront'
                                      ? 'Aadhar Card (Front)'
                                      : field === 'aadharBack'
                                      ? 'Aadhar Card (Back)'
                                      : field === 'bankPassbook'
                                      ? 'Bank Passbook (PDF)'
                                      : 'PAN Card (PDF)'}
                                  </label>
                                  {values[field] ? (
                                    <a
                                      href={
                                        values[field] instanceof File
                                          ? URL.createObjectURL(values[field])
                                          : values[field]
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-2"
                                    >
                                      <FaFilePdf size={24} className="text-blue-400" />
                                      <p className="text-blue-800 text-sm sm:text-base truncate max-w-[200px]">
                                        {field}
                                      </p>
                                    </a>
                                  ) : (
                                    <p className="text-blue-800 text-sm sm:text-base">Not uploaded</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          {Object.entries(detailFields).map(([section, fields]) => (
                            <div key={section}>
                              <h3 className="text-base font-semibold text-red-700 mb-3">
                                {section === 'personalInfo'
                                  ? 'Personal Information'
                                  : section === 'contactInfo'
                                  ? 'Contact Information'
                                  : section === 'bankingInfo'
                                  ? 'Banking Information'
                                  : 'Employment Information'}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {fields.map((field) => (
                                  <div key={field.key}>
                                    <label className="block text-xs sm:text-sm font-medium text-blue-700 mb-1">
                                      {field.label}
                                      {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className="text-sm text-blue-800">
                                      {field.type === 'date'
                                        ? values[field.key]
                                          ? formatDateToDDMMMYYYY(values[field.key])
                                          : 'N/A'
                                        : values[field.key] || 'N/A'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {(modalType === 'add' || isEditing) && (
                        <div className="flex justify-end mt-4 sm:mt-6 gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Cancel button in modal clicked');
                              if (modalType === 'add') {
                                setModalOpen(false);
                                setModalEmployee(initialEmployee);
                                setModalIndex(null);
                              } else {
                                setIsEditing(false);
                              }
                              setError(null);
                            }}
                            className="px-4 py-2 bg-blue-200 text-blue-700 rounded-md font-semibold text-sm sm:text-base hover:bg-blue-300 touch-action-manipulation"
                            disabled={saving}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm sm:text-base touch-action-manipulation"
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <FaSpinner className="animate-spin" size={12} />
                                Saving...
                              </>
                            ) : (
                              <>
                                <FaSave /> Save
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}
          {deleteIndex !== null && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4"
              onClick={() => setDeleteIndex(null)}
            >
              <div
                className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm p-4 sm:p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {saving && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-blue-500">
                      <FaSpinner className="animate-spin" size={24} />
                      <span>Deleting...</span>
                    </div>
                  </div>
                )}
                <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-4">Delete Employee</h2>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-blue-700">
                    {employees[deleteIndex]?.firstName || ''} {employees[deleteIndex]?.lastName || ''}
                  </span>
                  ?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Cancel delete button clicked');
                      setDeleteIndex(null);
                    }}
                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-blue-200 text-blue-700 font-semibold text-sm sm:text-base hover:bg-blue-300 touch-action-manipulation"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Confirm delete button clicked');
                      handleDeleteEmployee();
                    }}
                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-red-600 text-white font-semibold text-sm sm:text-base hover:bg-red-700 touch-action-manipulation"
                    disabled={saving}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeeListPage;