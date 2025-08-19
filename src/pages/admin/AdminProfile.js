// import React, { useState, useEffect } from 'react';
// import {
//   FaCamera,
//   FaSave,
//   FaEdit,
//   FaEnvelope,
//   FaBuilding,
//   FaUser,
// } from 'react-icons/fa';
// import Header from '../../components/common/Header';
// import AdminSidebar from '../../components/common/AdminSidebar';

// // Helper function to format date to DD/MMMM/YYYY
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return 'N/A';
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = date.toLocaleString('en-US', { month: 'long' });
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// };

// // Helper function to parse DD/MMMM/YYYY to ISO format (YYYY-MM-DD) for backend
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

// // Helper function to handle object rendering
// const renderObject = (obj) => {
//   if (!obj || typeof obj !== 'object') return obj;
//   return Object.entries(obj)
//     .map(([key, value]) => `${key}: ${value}`)
//     .join(', ');
// };

// const AdminProfile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [profileData, setProfileData] = useState({
//     firstName: '',
//     lastName: '',
//     gender: '',
//     officialDateOfBirth: '',
//     actualDateOfBirth: '',
//     dateOfJoining: '',
//     panNumber: '',
//     aadharNumber: '',
//     passportNumber: '',
//     maritalStatus: '',
//     primaryPhoneNumber: '',
//     secondaryPhoneNumber: '',
//     personalEmailId: '',
//     permanentResidentialAddress: '',
//     currentAddress: '',
//     bankName: '',
//     accountNumber: '',
//     ifscCode: '',
//     bankBranchName: '',
//     fathersName: '',
//     fathersContactNo: '',
//     mothersName: '',
//     mothersContactNo: '',
//     spouseName: '',
//     spouseContactNo: '',
//     siblings: '',
//     bloodGroup: '',
//     hasMedicalInsurance: '',
//     email: '',
//     phone: '',
//     address: '',
//     department: '',
//     position: '',
//     employeeId: '',
//     hireDate: '',
//     manager: '',
//     workLocation: '',
//     emergencyContact: '',
//     birthDate: '',
//     profileImage: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       fetchProfile();
//     }
//   }, []);

//   const fetchProfile = async () => {
//     setLoading(true);
//     setError('');
//     console.log("API Call: /profile");
//     try {
//       const response = await fetch(`${BASE_URL}/profile`, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
//       console.log("API Response: /profile", data);
//       setProfileData((prev) => ({
//         ...prev,
//         ...data,
//         siblings: typeof data.siblings === 'object' ? renderObject(data.siblings) : data.siblings || '',
//         officialDateOfBirth: data.officialDateOfBirth ? formatDate(data.officialDateOfBirth) : '',
//         actualDateOfBirth: data.actualDateOfBirth ? formatDate(data.actualDateOfBirth) : '',
//         dateOfJoining: data.dateOfJoining ? formatDate(data.dateOfJoining) : '',
//         hireDate: data.hireDate ? formatDate(data.hireDate) : '',
//       }));
//     } catch (err) {
//       setError(err.message || "Failed to fetch profile");
//       setTimeout(() => setError(""), 2000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProfile = async () => {
//     setLoading(true);
//     setError('');

//     // Validate date format (DD/MMMM/YYYY)
//     const dateRegex = /^\d{2}\/[A-Za-z]+\/\d{4}$/;
//     const dateFields = ['officialDateOfBirth', 'actualDateOfBirth', 'dateOfJoining', 'hireDate'];
//     for (const field of dateFields) {
//       if (profileData[field] && !dateRegex.test(profileData[field])) {
//         setError(`Invalid date format for ${field}. Use DD/MMMM/YYYY (e.g., 01/January/2025).`);
//         setLoading(false);
//         setTimeout(() => setError(""), 2000);
//         return;
//       }
//     }

//     console.log("API Call: /profile-edit", profileData);
//     const dataToSend = new FormData();
//     Object.keys(profileData).forEach((key) => {
//       if (key === 'profileImage' && profileData.profileImage instanceof File) {
//         dataToSend.append('profileImage', profileData.profileImage);
//       } else if (dateFields.includes(key)) {
//         dataToSend.append(key, profileData[key] ? parseDate(profileData[key]) : '');
//       } else if (key !== 'profileImage') {
//         dataToSend.append(key, profileData[key] || '');
//       }
//     });
//     try {
//       const response = await fetch(`${BASE_URL}/profile-edit`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         body: dataToSend,
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to update profile");
//       console.log("API Response: /profile-edit", data);
//       setProfileData((prev) => ({
//         ...prev,
//         ...data,
//         siblings: typeof data.siblings === 'object' ? renderObject(data.siblings) : data.siblings || '',
//         officialDateOfBirth: data.officialDateOfBirth ? formatDate(data.officialDateOfBirth) : '',
//         actualDateOfBirth: data.actualDateOfBirth ? formatDate(data.actualDateOfBirth) : '',
//         dateOfJoining: data.dateOfJoining ? formatDate(data.dateOfJoining) : '',
//         hireDate: data.hireDate ? formatDate(data.hireDate) : '',
//       }));
//       setIsEditing(false);
//     } catch (err) {
//       setError(err.message || "Failed to update profile");
//       setTimeout(() => setError(""), 2000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setProfileData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfileData((prev) => ({
//         ...prev,
//         profileImage: file,
//       }));
//     }
//   };

//   const handleSave = () => {
//     updateProfile();
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   return (
//     <div className="flex w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
//       <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header isLoggedIn={!!localStorage.getItem('token')} onToggleSidebar={toggleSidebar} />
//         <main className="p-4 sm:p-6 overflow-auto">
//           <div className="max-w-8xl mx-auto">
//             {/* Page Header */}
//             <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">
//                   Admin Profile
//                 </h2>
//                 <button
//                   onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
//                   className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                       <span>Saving...</span>
//                     </>
//                   ) : isEditing ? (
//                     <>
//                       <FaSave size={20} />
//                       <span>Save Changes</span>
//                     </>
//                   ) : (
//                     <>
//                       <FaEdit size={20} />
//                       <span>Edit Profile</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//               {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//             </div>

//             {/* Scrollable Form Section */}
//             <div className="max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
//               {/* Profile Picture Section */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
//                   <div className="relative">
//                     <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full overflow-hidden">
//                       {profileData.profileImage ? (
//                         <img
//                           src={profileData.profileImage instanceof File ? URL.createObjectURL(profileData.profileImage) : profileData.profileImage}
//                           alt="Profile"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <FaUser size={48} className="text-blue-400" />
//                         </div>
//                       )}
//                     </div>
//                     {isEditing && (
//                       <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
//                         <FaCamera size={16} />
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageUpload}
//                           className="hidden"
//                         />
//                       </label>
//                     )}
//                   </div>
//                   <div className="text-center sm:text-left">
//                     <h3 className="text-xl sm:text-2xl font-semibold text-blue-800">
//                       {profileData.firstName} {profileData.lastName}
//                     </h3>
//                     <p className="text-blue-700 text-sm sm:text-base">
//                       {profileData.position}
//                     </p>
//                     <p className="text-blue-500 text-sm sm:text-base">
//                       {profileData.department}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Personal Information */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Personal Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       First Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.firstName}
//                         onChange={(e) =>
//                           handleInputChange('firstName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.firstName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Last Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.lastName}
//                         onChange={(e) =>
//                           handleInputChange('lastName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.lastName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Gender
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.gender}
//                         onChange={(e) =>
//                           handleInputChange('gender', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.gender || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Official Date of Birth
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.officialDateOfBirth}
//                         onChange={(e) =>
//                           handleInputChange('officialDateOfBirth', e.target.value)
//                         }
//                         placeholder="DD/MMMM/YYYY"
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {formatDate(profileData.officialDateOfBirth)}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Actual Date of Birth
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.actualDateOfBirth}
//                         onChange={(e) =>
//                           handleInputChange('actualDateOfBirth', e.target.value)
//                         }
//                         placeholder="DD/MMMM/YYYY"
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {formatDate(profileData.actualDateOfBirth)}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Date of Joining Seven Procure
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.dateOfJoining}
//                         onChange={(e) =>
//                           handleInputChange('dateOfJoining', e.target.value)
//                         }
//                         placeholder="DD/MMMM/YYYY"
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {formatDate(profileData.dateOfJoining)}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       PAN Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.panNumber}
//                         onChange={(e) =>
//                           handleInputChange('panNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.panNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Aadhar Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.aadharNumber}
//                         onChange={(e) =>
//                           handleInputChange('aadharNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.aadharNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Passport Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.passportNumber}
//                         onChange={(e) =>
//                           handleInputChange('passportNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.passportNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Marital Status
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.maritalStatus}
//                         onChange={(e) =>
//                           handleInputChange('maritalStatus', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Single">Single</option>
//                         <option value="Married">Married</option>
//                         <option value="Divorced">Divorced</option>
//                         <option value="Widowed">Widowed</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.maritalStatus || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Contact Information */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 flex items-center">
//                   <FaEnvelope className="mr-2" size={18} />
//                   Contact Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Primary Phone Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="tel"
//                         value={profileData.primaryPhoneNumber}
//                         onChange={(e) =>
//                           handleInputChange('primaryPhoneNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.primaryPhoneNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Secondary Phone Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="tel"
//                         value={profileData.secondaryPhoneNumber}
//                         onChange={(e) =>
//                           handleInputChange('secondaryPhoneNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.secondaryPhoneNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Personal Email ID
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="email"
//                         value={profileData.personalEmailId}
//                         onChange={(e) =>
//                           handleInputChange('personalEmailId', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.personalEmailId || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Permanent Residential Address
//                     </label>
//                     {isEditing ? (
//                       <textarea
//                         value={profileData.permanentResidentialAddress}
//                         onChange={(e) =>
//                           handleInputChange('permanentResidentialAddress', e.target.value)
//                         }
//                         rows={2}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.permanentResidentialAddress || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Current Address
//                     </label>
//                     {isEditing ? (
//                       <textarea
//                         value={profileData.currentAddress}
//                         onChange={(e) =>
//                           handleInputChange('currentAddress', e.target.value)
//                         }
//                         rows={2}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.currentAddress || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Bank Details */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Bank Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Bank Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.bankName}
//                         onChange={(e) =>
//                           handleInputChange('bankName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bankName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Account Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.accountNumber}
//                         onChange={(e) =>
//                           handleInputChange('accountNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.accountNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       IFSC Code
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.ifscCode}
//                         onChange={(e) =>
//                           handleInputChange('ifscCode', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.ifscCode || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Bank Branch Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.bankBranchName}
//                         onChange={(e) =>
//                           handleInputChange('bankBranchName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bankBranchName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Family Details */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Family Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Father's Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.fathersName}
//                         onChange={(e) =>
//                           handleInputChange('fathersName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.fathersName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Father's Contact No.
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.fathersContactNo}
//                         onChange={(e) =>
//                           handleInputChange('fathersContactNo', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.fathersContactNo || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Mother's Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.mothersName}
//                         onChange={(e) =>
//                           handleInputChange('mothersName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.mothersName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Mother's Contact No.
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.mothersContactNo}
//                         onChange={(e) =>
//                           handleInputChange('mothersContactNo', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.mothersContactNo || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Spouse Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.spouseName}
//                         onChange={(e) =>
//                           handleInputChange('spouseName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.spouseName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Spouse Contact No.
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.spouseContactNo}
//                         onChange={(e) =>
//                           handleInputChange('spouseContactNo', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.spouseContactNo || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Siblings (Name and Contact Details)
//                     </label>
//                     {isEditing ? (
//                       <textarea
//                         value={profileData.siblings}
//                         onChange={(e) =>
//                           handleInputChange('siblings', e.target.value)
//                         }
//                         rows={2}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.siblings || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Medical & Other Details */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Medical & Other Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Blood Group
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.bloodGroup}
//                         onChange={(e) =>
//                           handleInputChange('bloodGroup', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bloodGroup || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Do you have any medical insurance?
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.hasMedicalInsurance}
//                         onChange={(e) =>
//                           handleInputChange('hasMedicalInsurance', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="No">No</option>
//                         <option value="Yes">Yes</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.hasMedicalInsurance || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Job Information */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 flex items-center">
//                   <FaBuilding className="mr-2" size={18} />
//                   Job Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Department
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.department}
//                         onChange={(e) =>
//                           handleInputChange('department', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Engineering">Engineering</option>
//                         <option value="Marketing">Marketing</option>
//                         <option value="Sales">Sales</option>
//                         <option value="HR">Human Resources</option>
//                         <option value="Finance">Finance</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.department || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Position
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.position}
//                         onChange={(e) =>
//                           handleInputChange('position', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.position || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Hire Date
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.hireDate}
//                         onChange={(e) =>
//                           handleInputChange('hireDate', e.target.value)
//                         }
//                         placeholder="DD/MMMM/YYYY"
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {formatDate(profileData.hireDate)}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Manager
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.manager}
//                         onChange={(e) =>
//                           handleInputChange('manager', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.manager || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Work Location
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.workLocation}
//                         onChange={(e) =>
//                           handleInputChange('workLocation', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Remote">Remote</option>
//                         <option value="Office">Office</option>
//                         <option value="Hybrid">Hybrid</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.workLocation || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Save Button for Mobile */}
//               {isEditing && (
//                 <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-blue-100 z-50">
//                   <button
//                     onClick={handleSave}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                         <span>Saving...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FaSave size={20} />
//                         <span>Save Changes</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminProfile;




// import React, { useState, useEffect } from 'react';
// import {
//   FaCamera,
//   FaSave,
//   FaEdit,
//   FaEnvelope,
//   FaBuilding,
//   FaUser,
// } from 'react-icons/fa';
// import Header from '../../components/common/Header';
// import AdminSidebar from '../../components/common/AdminSidebar';

// // Helper function to format date to "02 Jan 2025"
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return 'N/A';
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = date.toLocaleString('en-US', { month: 'short' });
//   const year = date.getFullYear();
//   return `${day} ${month} ${year}`;
// };

// // Helper function to parse date from YYYY-MM-DD to display format
// const parseDateToInputFormat = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return '';
//   return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD for input type="date"
// };

// // Helper function to handle object rendering
// const renderObject = (obj) => {
//   if (!obj || typeof obj !== 'object') return obj;
//   return Object.entries(obj)
//     .map(([key, value]) => `${key}: ${value}`)
//     .join(', ');
// };

// const AdminProfile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [profileData, setProfileData] = useState({
//     firstName: '',
//     lastName: '',
//     gender: '',
//     officialDateOfBirth: '',
//     actualDateOfBirth: '',
//     dateOfJoining: '',
//     panNumber: '',
//     aadharNumber: '',
//     passportNumber: '',
//     maritalStatus: '',
//     primaryPhoneNumber: '',
//     secondaryPhoneNumber: '',
//     personalEmailId: '',
//     permanentResidentialAddress: '',
//     currentAddress: '',
//     bankName: '',
//     accountNumber: '',
//     ifscCode: '',
//     bankBranchName: '',
//     fathersName: '',
//     fathersContactNo: '',
//     mothersName: '',
//     mothersContactNo: '',
//     spouseName: '',
//     spouseContactNo: '',
//     siblings: '',
//     bloodGroup: '',
//     hasMedicalInsurance: '',
//     email: '',
//     phone: '',
//     address: '',
//     department: '',
//     position: '',
//     employeeId: '',
//     manager: '',
//     workLocation: '',
//     emergencyContact: '',
//     birthDate: '',
//     profileImage: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       fetchProfile();
//     }
//   }, []);

//   const fetchProfile = async () => {
//     setLoading(true);
//     setError('');
//     console.log("API Call: /profile");
//     try {
//       const response = await fetch(`${BASE_URL}/profile`, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
//       console.log("API Response: /profile", data);
//       setProfileData((prev) => ({
//         ...prev,
//         ...data,
//         siblings: typeof data.siblings === 'object' ? renderObject(data.siblings) : data.siblings || '',
//         officialDateOfBirth: parseDateToInputFormat(data.officialDateOfBirth),
//         actualDateOfBirth: parseDateToInputFormat(data.actualDateOfBirth),
//         dateOfJoining: parseDateToInputFormat(data.dateOfJoining),
//       }));
//     } catch (err) {
//       setError(err.message || "Failed to fetch profile");
//       setTimeout(() => setError(""), 2000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProfile = async () => {
//     setLoading(true);
//     setError('');

//     console.log("API Call: /profile-edit", profileData);
//     const dataToSend = new FormData();
//     Object.keys(profileData).forEach((key) => {
//       if (key === 'profileImage' && profileData.profileImage instanceof File) {
//         dataToSend.append('profileImage', profileData.profileImage);
//       } else if (key !== 'profileImage') {
//         dataToSend.append(key, profileData[key] || '');
//       }
//     });
//     try {
//       const response = await fetch(`${BASE_URL}/profile-edit`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         body: dataToSend,
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to update profile");
//       console.log("API Response: /profile-edit", data);
//       setProfileData((prev) => ({
//         ...prev,
//         ...data,
//         siblings: typeof data.siblings === 'object' ? renderObject(data.siblings) : data.siblings || '',
//         officialDateOfBirth: parseDateToInputFormat(data.officialDateOfBirth),
//         actualDateOfBirth: parseDateToInputFormat(data.actualDateOfBirth),
//         dateOfJoining: parseDateToInputFormat(data.dateOfJoining),
//       }));
//       setIsEditing(false);
//     } catch (err) {
//       setError(err.message || "Failed to update profile");
//       setTimeout(() => setError(""), 2000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setProfileData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfileData((prev) => ({
//         ...prev,
//         profileImage: file,
//       }));
//     }
//   };

//   const handleSave = () => {
//     updateProfile();
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   return (
//     <div className="flex w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
//       <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header isLoggedIn={!!localStorage.getItem('token')} onToggleSidebar={toggleSidebar} />
//         <main className="p-4 sm:p-6 overflow-auto">
//           <div className="max-w-8xl mx-auto">
//             {/* Page Header */}
//             <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">
//                   Admin Profile
//                 </h2>
//                 <button
//                   onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
//                   className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                       <span>Saving...</span>
//                     </>
//                   ) : isEditing ? (
//                     <>
//                       <FaSave size={20} />
//                       <span>Save Changes</span>
//                     </>
//                   ) : (
//                     <>
//                       <FaEdit size={20} />
//                       <span>Edit Profile</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//               {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//             </div>

//             {/* Scrollable Form Section */}
//             <div className="max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
//               {/* Profile Picture Section */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
//                   <div className="relative">
//                     <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full overflow-hidden">
//                       {profileData.profileImage ? (
//                         <img
//                           src={profileData.profileImage instanceof File ? URL.createObjectURL(profileData.profileImage) : profileData.profileImage}
//                           alt="Profile"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <FaUser size={48} className="text-blue-400" />
//                         </div>
//                       )}
//                     </div>
//                     {isEditing && (
//                       <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
//                         <FaCamera size={16} />
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageUpload}
//                           className="hidden"
//                         />
//                       </label>
//                     )}
//                   </div>
//                   <div className="text-center sm:text-left">
//                     <h3 className="text-xl sm:text-2xl font-semibold text-blue-800">
//                       {profileData.firstName} {profileData.lastName}
//                     </h3>
//                     <p className="text-blue-700 text-sm sm:text-base">
//                       {profileData.position}
//                     </p>
//                     <p className="text-blue-500 text-sm sm:text-base">
//                       {profileData.department}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Personal Information */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Personal Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       First Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.firstName}
//                         onChange={(e) =>
//                           handleInputChange('firstName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.firstName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Last Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.lastName}
//                         onChange={(e) =>
//                           handleInputChange('lastName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.lastName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Gender
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.gender}
//                         onChange={(e) =>
//                           handleInputChange('gender', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.gender || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Official Date of Birth
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="date"
//                         value={profileData.officialDateOfBirth}
//                         onChange={(e) =>
//                           handleInputChange('officialDateOfBirth', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {formatDate(profileData.officialDateOfBirth)}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Actual Date of Birth
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="date"
//                         value={profileData.actualDateOfBirth}
//                         onChange={(e) =>
//                           handleInputChange('actualDateOfBirth', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {formatDate(profileData.actualDateOfBirth)}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Date of Joining Seven Procure
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="date"
//                         value={profileData.dateOfJoining}
//                         onChange={(e) =>
//                           handleInputChange('dateOfJoining', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {formatDate(profileData.dateOfJoining)}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       PAN Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.panNumber}
//                         onChange={(e) =>
//                           handleInputChange('panNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.panNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Aadhar Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.aadharNumber}
//                         onChange={(e) =>
//                           handleInputChange('aadharNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.aadharNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Passport Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.passportNumber}
//                         onChange={(e) =>
//                           handleInputChange('passportNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.passportNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Marital Status
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.maritalStatus}
//                         onChange={(e) =>
//                           handleInputChange('maritalStatus', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Single">Single</option>
//                         <option value="Married">Married</option>
//                         <option value="Divorced">Divorced</option>
//                         <option value="Widowed">Widowed</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.maritalStatus || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Contact Information */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 flex items-center">
//                   <FaEnvelope className="mr-2" size={18} />
//                   Contact Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Primary Phone Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="tel"
//                         value={profileData.primaryPhoneNumber}
//                         onChange={(e) =>
//                           handleInputChange('primaryPhoneNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.primaryPhoneNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Secondary Phone Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="tel"
//                         value={profileData.secondaryPhoneNumber}
//                         onChange={(e) =>
//                           handleInputChange('secondaryPhoneNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.secondaryPhoneNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Personal Email ID
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="email"
//                         value={profileData.personalEmailId}
//                         onChange={(e) =>
//                           handleInputChange('personalEmailId', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.personalEmailId || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Permanent Residential Address
//                     </label>
//                     {isEditing ? (
//                       <textarea
//                         value={profileData.permanentResidentialAddress}
//                         onChange={(e) =>
//                           handleInputChange('permanentResidentialAddress', e.target.value)
//                         }
//                         rows={2}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.permanentResidentialAddress || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Current Address
//                     </label>
//                     {isEditing ? (
//                       <textarea
//                         value={profileData.currentAddress}
//                         onChange={(e) =>
//                           handleInputChange('currentAddress', e.target.value)
//                         }
//                         rows={2}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.currentAddress || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Bank Details */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Bank Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Bank Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.bankName}
//                         onChange={(e) =>
//                           handleInputChange('bankName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bankName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Account Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.accountNumber}
//                         onChange={(e) =>
//                           handleInputChange('accountNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.accountNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       IFSC Code
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.ifscCode}
//                         onChange={(e) =>
//                           handleInputChange('ifscCode', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.ifscCode || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Bank Branch Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.bankBranchName}
//                         onChange={(e) =>
//                           handleInputChange('bankBranchName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bankBranchName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Family Details */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Family Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Father's Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.fathersName}
//                         onChange={(e) =>
//                           handleInputChange('fathersName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.fathersName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Father's Contact No.
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.fathersContactNo}
//                         onChange={(e) =>
//                           handleInputChange('fathersContactNo', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.fathersContactNo || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Mother's Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.mothersName}
//                         onChange={(e) =>
//                           handleInputChange('mothersName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.mothersName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Mother's Contact No.
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.mothersContactNo}
//                         onChange={(e) =>
//                           handleInputChange('mothersContactNo', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.mothersContactNo || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Spouse Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.spouseName}
//                         onChange={(e) =>
//                           handleInputChange('spouseName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.spouseName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Spouse Contact No.
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.spouseContactNo}
//                         onChange={(e) =>
//                           handleInputChange('spouseContactNo', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.spouseContactNo || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Siblings (Name and Contact Details)
//                     </label>
//                     {isEditing ? (
//                       <textarea
//                         value={profileData.siblings}
//                         onChange={(e) =>
//                           handleInputChange('siblings', e.target.value)
//                         }
//                         rows={2}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.siblings || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Medical & Other Details */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Medical & Other Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Blood Group
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.bloodGroup}
//                         onChange={(e) =>
//                           handleInputChange('bloodGroup', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bloodGroup || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Do you have any medical insurance?
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.hasMedicalInsurance}
//                         onChange={(e) =>
//                           handleInputChange('hasMedicalInsurance', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="No">No</option>
//                         <option value="Yes">Yes</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.hasMedicalInsurance || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Job Information */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 flex items-center">
//                   <FaBuilding className="mr-2" size={18} />
//                   Job Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Department
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.department}
//                         onChange={(e) =>
//                           handleInputChange('department', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Engineering">Engineering</option>
//                         <option value="Marketing">Marketing</option>
//                         <option value="Sales">Sales</option>
//                         <option value="HR">Human Resources</option>
//                         <option value="Finance">Finance</option>
//                         <option value="Procurement">Procurement</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.department || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Position
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.position}
//                         onChange={(e) =>
//                           handleInputChange('position', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.position || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Manager
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.manager}
//                         onChange={(e) =>
//                           handleInputChange('manager', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.manager || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Work Location
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.workLocation}
//                         onChange={(e) =>
//                           handleInputChange('workLocation', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Remote">Remote</option>
//                         <option value="Office">Office</option>
//                         <option value="Hybrid">Hybrid</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.workLocation || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Save Button for Mobile */}
//               {isEditing && (
//                 <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-blue-100 z-50">
//                   <button
//                     onClick={handleSave}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                         <span>Saving...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FaSave size={20} />
//                         <span>Save Changes</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminProfile;




// import React, { useState, useEffect } from 'react';
// import {
//   FaCamera,
//   FaSave,
//   FaEdit,
//   FaEnvelope,
//   FaBuilding,
//   FaUser,
// } from 'react-icons/fa';
// import Header from '../../components/common/Header';
// import AdminSidebar from '../../components/common/AdminSidebar';

// // Helper function to format date to "02 Jan 2025"
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return 'N/A';
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = date.toLocaleString('en-US', { month: 'short' });
//   const year = date.getFullYear();
//   return `${day} ${month} ${year}`;
// };

// // Helper function to parse date from YYYY-MM-DD to display format
// const parseDateToInputFormat = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return '';
//   return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD for input type="date"
// };

// // Helper function to handle object rendering
// const renderObject = (obj) => {
//   if (!obj || typeof obj !== 'object') return obj;
//   return Object.entries(obj)
//     .map(([key, value]) => `${key}: ${value}`)
//     .join(', ');
// };

// const AdminProfile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [profileData, setProfileData] = useState({
//     firstName: '',
//     lastName: '',
//     gender: '',
//     officialDateOfBirth: '',
//     actualDateOfBirth: '',
//     dateOfJoining: '',
//     panNumber: '',
//     aadharNumber: '',
//     passportNumber: '',
//     maritalStatus: '',
//     primaryPhoneNumber: '',
//     secondaryPhoneNumber: '',
//     personalEmailId: '',
//     permanentResidentialAddress: '',
//     currentAddress: '',
//     bankName: '',
//     accountNumber: '',
//     ifscCode: '',
//     bankBranchName: '',
//     fathersName: '',
//     fathersContactNo: '',
//     mothersName: '',
//     mothersContactNo: '',
//     spouseName: '',
//     spouseContactNo: '',
//     siblings: '',
//     bloodGroup: '',
//     hasMedicalInsurance: '',
//     email: '',
//     phone: '',
//     address: '',
//     department: '',
//     position: '',
//     employeeId: '',
//     manager: '',
//     workLocation: '',
//     emergencyContact: '',
//     birthDate: '',
//     profileImage: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       fetchProfile();
//     }
//   }, []);

//   const fetchProfile = async () => {
//     setLoading(true);
//     setError('');
//     console.log("API Call: /profile");
//     try {
//       const response = await fetch(`${BASE_URL}/profile`, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
//       console.log("API Response: /profile", data);
//       setProfileData((prev) => ({
//         ...prev,
//         ...data,
//         siblings: typeof data.siblings === 'object' ? renderObject(data.siblings) : data.siblings || '',
//         officialDateOfBirth: parseDateToInputFormat(data.officialDateOfBirth),
//         actualDateOfBirth: parseDateToInputFormat(data.actualDateOfBirth),
//         dateOfJoining: parseDateToInputFormat(data.dateOfJoining),
//       }));
//     } catch (err) {
//       setError(err.message || "Failed to fetch profile");
//       setTimeout(() => setError(""), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProfile = async () => {
//     setLoading(true);
//     setError('');

//     console.log("API Call: /profile-edit", profileData);
//     const dataToSend = new FormData();
//     Object.keys(profileData).forEach((key) => {
//       if (key === 'profileImage' && profileData.profileImage instanceof File) {
//         dataToSend.append('profileImage', profileData.profileImage);
//       } else if (key !== 'profileImage') {
//         dataToSend.append(key, profileData[key] || '');
//       }
//     });
    
//     try {
//       const response = await fetch(`${BASE_URL}/profile-edit`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         body: dataToSend,
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to update profile");
//       console.log("API Response: /profile-edit", data);
      
//       // Instead of relying on API response, just exit editing mode
//       // The current profileData already has the updated values
//       setIsEditing(false);
      
//       // Optional: Refresh profile data from server to ensure consistency
//       // Uncomment the line below if you want to fetch fresh data after update
//       // await fetchProfile();
      
//     } catch (err) {
//       setError(err.message || "Failed to update profile");
//       setTimeout(() => setError(""), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setProfileData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfileData((prev) => ({
//         ...prev,
//         profileImage: file,
//       }));
//     }
//   };

//   const handleSave = () => {
//     updateProfile();
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   return (
//     <div className="flex w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
//       <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header isLoggedIn={!!localStorage.getItem('token')} onToggleSidebar={toggleSidebar} />
//         <main className="p-4 sm:p-6 overflow-auto">
//           <div className="max-w-8xl mx-auto">
//             {/* Page Header */}
//             <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">
//                   Admin Profile
//                 </h2>
//                 <button
//                   onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
//                   className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                       <span>Saving...</span>
//                     </>
//                   ) : isEditing ? (
//                     <>
//                       <FaSave size={20} />
//                       <span>Save Changes</span>
//                     </>
//                   ) : (
//                     <>
//                       <FaEdit size={20} />
//                       <span>Edit Profile</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//               {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//             </div>

//             {/* Scrollable Form Section */}
//             <div className="max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
//               {/* Profile Picture Section */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
//                   <div className="relative">
//                     <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full overflow-hidden">
//                       {profileData.profileImage ? (
//                         <img
//                           src={profileData.profileImage instanceof File ? URL.createObjectURL(profileData.profileImage) : profileData.profileImage}
//                           alt="Profile"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <FaUser size={48} className="text-blue-400" />
//                         </div>
//                       )}
//                     </div>
//                     {isEditing && (
//                       <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
//                         <FaCamera size={16} />
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageUpload}
//                           className="hidden"
//                         />
//                       </label>
//                     )}
//                   </div>
//                   <div className="text-center sm:text-left">
//                     <h3 className="text-xl sm:text-2xl font-semibold text-blue-800">
//                       {profileData.firstName} {profileData.lastName}
//                     </h3>
//                     <p className="text-blue-700 text-sm sm:text-base">
//                       {profileData.position || 'N/A'}
//                     </p>
//                     <p className="text-blue-500 text-sm sm:text-base">
//                       {profileData.department || 'N/A'}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Personal Information */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Personal Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       First Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.firstName}
//                         onChange={(e) =>
//                           handleInputChange('firstName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.firstName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Last Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.lastName}
//                         onChange={(e) =>
//                           handleInputChange('lastName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.lastName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Gender
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.gender}
//                         onChange={(e) =>
//                           handleInputChange('gender', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.gender || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Official Date of Birth
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="date"
//                         value={profileData.officialDateOfBirth}
//                         onChange={(e) =>
//                           handleInputChange('officialDateOfBirth', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {formatDate(profileData.officialDateOfBirth)}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Actual Date of Birth
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="date"
//                         value={profileData.actualDateOfBirth}
//                         onChange={(e) =>
//                           handleInputChange('actualDateOfBirth', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {formatDate(profileData.actualDateOfBirth)}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Date of Joining Seven Procure
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="date"
//                         value={profileData.dateOfJoining}
//                         onChange={(e) =>
//                           handleInputChange('dateOfJoining', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {formatDate(profileData.dateOfJoining)}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       PAN Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.panNumber}
//                         onChange={(e) =>
//                           handleInputChange('panNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.panNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Aadhar Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.aadharNumber}
//                         onChange={(e) =>
//                           handleInputChange('aadharNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.aadharNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Passport Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.passportNumber}
//                         onChange={(e) =>
//                           handleInputChange('passportNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.passportNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Marital Status
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.maritalStatus}
//                         onChange={(e) =>
//                           handleInputChange('maritalStatus', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Single">Single</option>
//                         <option value="Married">Married</option>
//                         <option value="Divorced">Divorced</option>
//                         <option value="Widowed">Widowed</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.maritalStatus || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Contact Information */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 flex items-center">
//                   <FaEnvelope className="mr-2" size={18} />
//                   Contact Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Primary Phone Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="tel"
//                         value={profileData.primaryPhoneNumber}
//                         onChange={(e) =>
//                           handleInputChange('primaryPhoneNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.primaryPhoneNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Secondary Phone Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="tel"
//                         value={profileData.secondaryPhoneNumber}
//                         onChange={(e) =>
//                           handleInputChange('secondaryPhoneNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.secondaryPhoneNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Personal Email ID
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="email"
//                         value={profileData.personalEmailId}
//                         onChange={(e) =>
//                           handleInputChange('personalEmailId', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.personalEmailId || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Permanent Residential Address
//                     </label>
//                     {isEditing ? (
//                       <textarea
//                         value={profileData.permanentResidentialAddress}
//                         onChange={(e) =>
//                           handleInputChange('permanentResidentialAddress', e.target.value)
//                         }
//                         rows={2}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.permanentResidentialAddress || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Current Address
//                     </label>
//                     {isEditing ? (
//                       <textarea
//                         value={profileData.currentAddress}
//                         onChange={(e) =>
//                           handleInputChange('currentAddress', e.target.value)
//                         }
//                         rows={2}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.currentAddress || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Bank Details */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Bank Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Bank Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.bankName}
//                         onChange={(e) =>
//                           handleInputChange('bankName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bankName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Account Number
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.accountNumber}
//                         onChange={(e) =>
//                           handleInputChange('accountNumber', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.accountNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       IFSC Code
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.ifscCode}
//                         onChange={(e) =>
//                           handleInputChange('ifscCode', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.ifscCode || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Bank Branch Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.bankBranchName}
//                         onChange={(e) =>
//                           handleInputChange('bankBranchName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bankBranchName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Family Details */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Family Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Father's Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.fathersName}
//                         onChange={(e) =>
//                           handleInputChange('fathersName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.fathersName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Father's Contact No.
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.fathersContactNo}
//                         onChange={(e) =>
//                           handleInputChange('fathersContactNo', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.fathersContactNo || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Mother's Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.mothersName}
//                         onChange={(e) =>
//                           handleInputChange('mothersName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.mothersName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Mother's Contact No.
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.mothersContactNo}
//                         onChange={(e) =>
//                           handleInputChange('mothersContactNo', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.mothersContactNo || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Spouse Name
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.spouseName}
//                         onChange={(e) =>
//                           handleInputChange('spouseName', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.spouseName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Spouse Contact No.
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.spouseContactNo}
//                         onChange={(e) =>
//                           handleInputChange('spouseContactNo', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.spouseContactNo || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Siblings (Name and Contact Details)
//                     </label>
//                     {isEditing ? (
//                       <textarea
//                         value={profileData.siblings}
//                         onChange={(e) =>
//                           handleInputChange('siblings', e.target.value)
//                         }
//                         rows={2}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.siblings || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Medical & Other Details */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
//                   Medical & Other Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Blood Group
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.bloodGroup}
//                         onChange={(e) =>
//                           handleInputChange('bloodGroup', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bloodGroup || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Do you have any medical insurance?
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.hasMedicalInsurance}
//                         onChange={(e) =>
//                           handleInputChange('hasMedicalInsurance', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="No">No</option>
//                         <option value="Yes">Yes</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.hasMedicalInsurance || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Job Information */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 flex items-center">
//                   <FaBuilding className="mr-2" size={18} />
//                   Job Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Department
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.department}
//                         onChange={(e) =>
//                           handleInputChange('department', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Engineering">Engineering</option>
//                         <option value="Marketing">Marketing</option>
//                         <option value="Sales">Sales</option>
//                         <option value="HR">Human Resources</option>
//                         <option value="Finance">Finance</option>
//                         <option value="Procurement">Procurement</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.department || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Position
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.position}
//                         onChange={(e) =>
//                           handleInputChange('position', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.position || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Manager
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.manager}
//                         onChange={(e) =>
//                           handleInputChange('manager', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.manager || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Work Location
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.workLocation}
//                         onChange={(e) =>
//                           handleInputChange('workLocation', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Remote">Remote</option>
//                         <option value="Office">Office</option>
//                         <option value="Hybrid">Hybrid</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.workLocation || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Save Button for Mobile */}
//               {isEditing && (
//                 <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-blue-100 z-50">
//                   <button
//                     onClick={handleSave}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                         <span>Saving...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FaSave size={20} />
//                         <span>Save Changes</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminProfile;



import React, { useState, useEffect } from 'react';
import {
  FaCamera,
  FaSave,
  FaEdit,
  FaEnvelope,
  FaBuilding,
  FaUser,
} from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from '../../components/common/Header';
import AdminSidebar from '../../components/common/AdminSidebar';

// Helper function to format date to "02 Jan 2025"
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Helper function to parse date from YYYY-MM-DD to display format
const parseDateToInputFormat = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD for input type="date"
};

// Helper function to handle object rendering
const renderObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
};

// Validation Schema
const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  primaryPhoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Primary phone number is required'),
  personalEmailId: Yup.string()
    .email('Invalid email address')
    .required('Personal email is required'),
  panNumber: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN should be 10 characters (5 letters, 4 digits, 1 letter)'),
  aadharNumber: Yup.string()
    .matches(/^\d{12}$/, 'Aadhar number should be 12 digits'),
  secondaryPhoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  fathersContactNo: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  mothersContactNo: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  spouseContactNo: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  accountNumber: Yup.string()
    .matches(/^\d{9,18}$/, 'Account number should be 9-18 digits'),
  ifscCode: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'IFSC code should be 11 characters (4 letters, 0, 6 alphanumeric)'),
});

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    officialDateOfBirth: '',
    actualDateOfBirth: '',
    dateOfJoining: '',
    panNumber: '',
    aadharNumber: '',
    passportNumber: '',
    maritalStatus: '',
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
    email: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    employeeId: '',
    manager: '',
    workLocation: '',
    emergencyContact: '',
    birthDate: '',
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    console.log("API Call: /profile");
    try {
      const response = await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
      console.log("API Response: /profile", data);
      setProfileData((prev) => ({
        ...prev,
        ...data,
        siblings: typeof data.siblings === 'object' ? renderObject(data.siblings) : data.siblings || '',
        officialDateOfBirth: parseDateToInputFormat(data.officialDateOfBirth),
        actualDateOfBirth: parseDateToInputFormat(data.actualDateOfBirth),
        dateOfJoining: parseDateToInputFormat(data.dateOfJoining),
      }));
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (values) => {
    setLoading(true);
    setError('');

    console.log("API Call: /profile-edit", values);
    const dataToSend = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === 'profileImage' && values.profileImage instanceof File) {
        dataToSend.append('profileImage', values.profileImage);
      } else if (key !== 'profileImage') {
        dataToSend.append(key, values[key] || '');
      }
    });
    
    try {
      const response = await fetch(`${BASE_URL}/profile-edit`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: dataToSend,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");
      console.log("API Response: /profile-edit", data);
      
      // Update local state with form values and exit editing mode
      setProfileData(values);
      setIsEditing(false);
      
    } catch (err) {
      setError(err.message || "Failed to update profile");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (setFieldValue) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('profileImage', file);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header isLoggedIn={!!localStorage.getItem('token')} onToggleSidebar={toggleSidebar} />
        <main className="p-4 sm:p-6 overflow-auto">
          <div className="max-w-8xl mx-auto">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">
                  Admin Profile
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : isEditing ? (
                    <>
                      <FaEdit size={20} />
                      <span>Cancel Edit</span>
                    </>
                  ) : (
                    <>
                      <FaEdit size={20} />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <Formik
              initialValues={profileData}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={(values) => {
                updateProfile(values);
              }}
            >
              {({ values, setFieldValue, errors, touched }) => (
                <Form>
                  {/* Scrollable Form Section */}
                  <div className="max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
                    {/* Profile Picture Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
                      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full overflow-hidden">
                            {values.profileImage ? (
                              <img
                                src={values.profileImage instanceof File ? URL.createObjectURL(values.profileImage) : values.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaUser size={48} className="text-blue-400" />
                              </div>
                            )}
                          </div>
                          {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                              <FaCamera size={16} />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload(setFieldValue)}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                        <div className="text-center sm:text-left">
                          <h3 className="text-xl sm:text-2xl font-semibold text-blue-800">
                            {values.firstName} {values.lastName}
                          </h3>
                          <p className="text-blue-700 text-sm sm:text-base">
                            {values.position || 'N/A'}
                          </p>
                          <p className="text-blue-500 text-sm sm:text-base">
                            {values.department || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            First Name
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="firstName"
                                type="text"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                              />
                              <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.firstName || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Last Name
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="lastName"
                                type="text"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                              />
                              <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.lastName || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Gender
                          </label>
                          {isEditing ? (
                            <Field
                              name="gender"
                              as="select"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </Field>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.gender || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Official Date of Birth
                          </label>
                          {isEditing ? (
                            <Field
                              name="officialDateOfBirth"
                              type="date"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {formatDate(values.officialDateOfBirth)}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Actual Date of Birth
                          </label>
                          {isEditing ? (
                            <Field
                              name="actualDateOfBirth"
                              type="date"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {formatDate(values.actualDateOfBirth)}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Date of Joining Seven Procure
                          </label>
                          {isEditing ? (
                            <Field
                              name="dateOfJoining"
                              type="date"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {formatDate(values.dateOfJoining)}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            PAN Number
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="panNumber"
                                type="text"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                                placeholder="ABCDE1234F"
                              />
                              <ErrorMessage name="panNumber" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.panNumber || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Aadhar Number
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="aadharNumber"
                                type="text"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                                placeholder="123456789012"
                              />
                              <ErrorMessage name="aadharNumber" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.aadharNumber || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Passport Number
                          </label>
                          {isEditing ? (
                            <Field
                              name="passportNumber"
                              type="text"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.passportNumber || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Marital Status
                          </label>
                          {isEditing ? (
                            <Field
                              name="maritalStatus"
                              as="select"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            >
                              <option value="">Select</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Divorced">Divorced</option>
                              <option value="Widowed">Widowed</option>
                            </Field>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.maritalStatus || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 flex items-center">
                        <FaEnvelope className="mr-2" size={18} />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Primary Phone Number
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="primaryPhoneNumber"
                                type="tel"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                                placeholder="1234567890"
                              />
                              <ErrorMessage name="primaryPhoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.primaryPhoneNumber || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Secondary Phone Number
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="secondaryPhoneNumber"
                                type="tel"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                                placeholder="1234567890"
                              />
                              <ErrorMessage name="secondaryPhoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.secondaryPhoneNumber || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Personal Email ID
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="personalEmailId"
                                type="email"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                                placeholder="example@email.com"
                              />
                              <ErrorMessage name="personalEmailId" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.personalEmailId || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Permanent Residential Address
                          </label>
                          {isEditing ? (
                            <Field
                              name="permanentResidentialAddress"
                              as="textarea"
                              rows={2}
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.permanentResidentialAddress || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Current Address
                          </label>
                          {isEditing ? (
                            <Field
                              name="currentAddress"
                              as="textarea"
                              rows={2}
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.currentAddress || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
                        Bank Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Bank Name
                          </label>
                          {isEditing ? (
                            <Field
                              name="bankName"
                              type="text"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.bankName || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Account Number
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="accountNumber"
                                type="text"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                                placeholder="123456789012345"
                              />
                              <ErrorMessage name="accountNumber" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.accountNumber || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            IFSC Code
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="ifscCode"
                                type="text"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                                placeholder="ABCD0123456"
                              />
                              <ErrorMessage name="ifscCode" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.ifscCode || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Bank Branch Name
                          </label>
                          {isEditing ? (
                            <Field
                              name="bankBranchName"
                              type="text"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.bankBranchName || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Family Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
                        Family Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Father's Name
                          </label>
                          {isEditing ? (
                            <Field
                              name="fathersName"
                              type="text"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.fathersName || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Father's Contact No.
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="fathersContactNo"
                                type="text"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                                placeholder="1234567890"
                              />
                              <ErrorMessage name="fathersContactNo" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.fathersContactNo || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Mother's Name
                          </label>
                          {isEditing ? (
                            <Field
                              name="mothersName"
                              type="text"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.mothersName || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Mother's Contact No.
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="mothersContactNo"
                                type="text"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                                placeholder="1234567890"
                              />
                              <ErrorMessage name="mothersContactNo" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.mothersContactNo || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Spouse Name
                          </label>
                          {isEditing ? (
                            <Field
                              name="spouseName"
                              type="text"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.spouseName || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Spouse Contact No.
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="spouseContactNo"
                                type="text"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                                placeholder="1234567890"
                              />
                              <ErrorMessage name="spouseContactNo" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.spouseContactNo || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Siblings (Name and Contact Details)
                          </label>
                          {isEditing ? (
                            <Field
                              name="siblings"
                              as="textarea"
                              rows={2}
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.siblings || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Medical & Other Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4">
                        Medical & Other Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Blood Group
                          </label>
                          {isEditing ? (
                            <Field
                              name="bloodGroup"
                              as="select"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            >
                              <option value="">Select</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </Field>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.bloodGroup || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Do you have any medical insurance?
                          </label>
                          {isEditing ? (
                            <Field
                              name="hasMedicalInsurance"
                              as="select"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            >
                              <option value="">Select</option>
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </Field>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.hasMedicalInsurance || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Job Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 flex items-center">
                        <FaBuilding className="mr-2" size={18} />
                        Job Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Department
                          </label>
                          {isEditing ? (
                            <Field
                              name="department"
                              as="select"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            >
                              <option value="">Select</option>
                              <option value="Engineering">Engineering</option>
                              <option value="Marketing">Marketing</option>
                              <option value="Sales">Sales</option>
                              <option value="HR">Human Resources</option>
                              <option value="Finance">Finance</option>
                              <option value="Procurement">Procurement</option>
                            </Field>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.department || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Position
                          </label>
                          {isEditing ? (
                            <Field
                              name="position"
                              type="text"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.position || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Manager
                          </label>
                          {isEditing ? (
                            <Field
                              name="manager"
                              type="text"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.manager || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Work Location
                          </label>
                          {isEditing ? (
                            <Field
                              name="workLocation"
                              as="select"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            >
                              <option value="">Select</option>
                              <option value="Remote">Remote</option>
                              <option value="Office">Office</option>
                              <option value="Hybrid">Hybrid</option>
                            </Field>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.workLocation || 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Save Button for Mobile and Desktop */}
                    {isEditing && (
                      <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
                        <button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          ) : (
                            <FaSave size={20} />
                          )}
                          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
