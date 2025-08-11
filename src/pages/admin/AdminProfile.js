


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
// import Sidebar from '../../components/common/Sidebar';
// import AdminSidebar from '../../components/common/AdminSidebar';

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
//     manager: ' ',
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

//  const fetchProfile = async () => {
//   setLoading(true);
//   setError('');
//   console.log("API Call: /profile");
//   try {
//     const response = await fetch(`${BASE_URL}/profile`, {
//       method: "GET",
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//     });
//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
//     console.log("API Response: /profile", data);
//     setProfileData((prev) => ({
//       ...prev,
//       ...data, // Use the root object directly
//       siblings: typeof data.siblings === 'object' ? renderObject(data.siblings) : data.siblings || '',
//     }));
//   } catch (err) {
//     setError(err.message || "Failed to fetch profile");
//     setTimeout(() => setError(""), 2000);
//   } finally {
//     setLoading(false);
//   }
// };

//   const updateProfile = async () => {
//     setLoading(true);
//     setError('');
//     console.log("API Call: /profile-edit", profileData);
//     const dataToSend = new FormData();
//     Object.keys(profileData).forEach((key) => {
//       if (key === 'profileImage' && profileData.profileImage instanceof File) {
//         dataToSend.append('profileImage', profileData.profileImage);
//       } else if (key !== 'profileImage') {
//         dataToSend.append(key, profileData[key]);
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
//           <div className="max-w-7xl mx-auto">
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
//                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                   ) : isEditing ? (
//                     <FaSave size={20} />
//                   ) : (
//                     <FaEdit size={20} />
//                   )}
//                   <span>{loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
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
//                         {profileData.firstName}
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
//                         {profileData.lastName}
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
//                         {profileData.gender}
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
//                         {profileData.officialDateOfBirth}
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
//                         {profileData.actualDateOfBirth}
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
//                         {profileData.dateOfJoining}
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
//                         {profileData.panNumber}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Adhar Number
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
//                         {profileData.aadharNumber}
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
//                         {profileData.passportNumber}
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
//                         <option value="Single">Single</option>
//                         <option value="Married">Married</option>
//                         <option value="Divorced">Divorced</option>
//                         <option value="Widowed">Widowed</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.maritalStatus}
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
//                         {profileData.primaryPhoneNumber}
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
//                         {profileData.secondaryPhoneNumber}
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
//                         {profileData.personalEmailId}
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
//                         {profileData.permanentResidentialAddress}
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
//                         {profileData.currentAddress}
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
//                         {profileData.bankName}
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
//                         {profileData.accountNumber}
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
//                         {profileData.ifscCode}
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
//                         {profileData.bankBranchName}
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
//                         {profileData.fathersName}
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
//                         {profileData.fathersContactNo}
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
//                         {profileData.mothersName}
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
//                         {profileData.mothersContactNo}
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
//                         {profileData.spouseName}
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
//                         {profileData.spouseContactNo}
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
//                         {profileData.siblings}
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
//                         {profileData.bloodGroup}
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
//                         <option value="No">No</option>
//                         <option value="Yes">Yes</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.hasMedicalInsurance}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Existing Job Information Section */}
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
//                         <option value="Engineering">Engineering</option>
//                         <option value="Marketing">Marketing</option>
//                         <option value="Sales">Sales</option>
//                         <option value="HR">Human Resources</option>
//                         <option value="Finance">Finance</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.department}
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
//                         {profileData.position}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Hire Date
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="date"
//                         value={profileData.hireDate}
//                         onChange={(e) =>
//                           handleInputChange('hireDate', e.target.value)
//                         }
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {new Date(profileData.hireDate).toLocaleDateString()}
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
//                         {profileData.manager}
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
//                         <option value="Remote">Remote</option>
//                         <option value="Office">Office</option>
//                         <option value="Hybrid">Hybrid</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.workLocation}
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
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                     ) : (
//                       <FaSave size={20} />
//                     )}
//                     <span>{loading ? 'Saving...' : 'Save Changes'}</span>
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
import Header from '../../components/common/Header';
import AdminSidebar from '../../components/common/AdminSidebar';

// Helper function to format date to DD/MMMM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to parse DD/MMMM/YYYY to ISO format (YYYY-MM-DD) for backend
const parseDate = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  const monthIndex = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ].indexOf(month);
  if (monthIndex === -1 || !day || !year) return '';
  return new Date(year, monthIndex, day).toISOString().split('T')[0];
};

// Helper function to handle object rendering
const renderObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
};

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
    hireDate: '',
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
        officialDateOfBirth: data.officialDateOfBirth ? formatDate(data.officialDateOfBirth) : '',
        actualDateOfBirth: data.actualDateOfBirth ? formatDate(data.actualDateOfBirth) : '',
        dateOfJoining: data.dateOfJoining ? formatDate(data.dateOfJoining) : '',
        hireDate: data.hireDate ? formatDate(data.hireDate) : '',
      }));
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
      setTimeout(() => setError(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    setError('');

    // Validate date format (DD/MMMM/YYYY)
    const dateRegex = /^\d{2}\/[A-Za-z]+\/\d{4}$/;
    const dateFields = ['officialDateOfBirth', 'actualDateOfBirth', 'dateOfJoining', 'hireDate'];
    for (const field of dateFields) {
      if (profileData[field] && !dateRegex.test(profileData[field])) {
        setError(`Invalid date format for ${field}. Use DD/MMMM/YYYY (e.g., 01/January/2025).`);
        setLoading(false);
        setTimeout(() => setError(""), 2000);
        return;
      }
    }

    console.log("API Call: /profile-edit", profileData);
    const dataToSend = new FormData();
    Object.keys(profileData).forEach((key) => {
      if (key === 'profileImage' && profileData.profileImage instanceof File) {
        dataToSend.append('profileImage', profileData.profileImage);
      } else if (dateFields.includes(key)) {
        dataToSend.append(key, profileData[key] ? parseDate(profileData[key]) : '');
      } else if (key !== 'profileImage') {
        dataToSend.append(key, profileData[key] || '');
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
      setProfileData((prev) => ({
        ...prev,
        ...data,
        siblings: typeof data.siblings === 'object' ? renderObject(data.siblings) : data.siblings || '',
        officialDateOfBirth: data.officialDateOfBirth ? formatDate(data.officialDateOfBirth) : '',
        actualDateOfBirth: data.actualDateOfBirth ? formatDate(data.actualDateOfBirth) : '',
        dateOfJoining: data.dateOfJoining ? formatDate(data.dateOfJoining) : '',
        hireDate: data.hireDate ? formatDate(data.hireDate) : '',
      }));
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
      setTimeout(() => setError(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const handleSave = () => {
    updateProfile();
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
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
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
                      <FaSave size={20} />
                      <span>Save Changes</span>
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

            {/* Scrollable Form Section */}
            <div className="max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
              {/* Profile Picture Section */}
              <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full overflow-hidden">
                      {profileData.profileImage ? (
                        <img
                          src={profileData.profileImage instanceof File ? URL.createObjectURL(profileData.profileImage) : profileData.profileImage}
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
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-semibold text-blue-800">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-blue-700 text-sm sm:text-base">
                      {profileData.position}
                    </p>
                    <p className="text-blue-500 text-sm sm:text-base">
                      {profileData.department}
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
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) =>
                          handleInputChange('firstName', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.firstName || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) =>
                          handleInputChange('lastName', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.lastName || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.gender}
                        onChange={(e) =>
                          handleInputChange('gender', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.gender || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Official Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.officialDateOfBirth}
                        onChange={(e) =>
                          handleInputChange('officialDateOfBirth', e.target.value)
                        }
                        placeholder="DD/MMMM/YYYY"
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {formatDate(profileData.officialDateOfBirth)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Actual Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.actualDateOfBirth}
                        onChange={(e) =>
                          handleInputChange('actualDateOfBirth', e.target.value)
                        }
                        placeholder="DD/MMMM/YYYY"
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {formatDate(profileData.actualDateOfBirth)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Date of Joining Seven Procure
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.dateOfJoining}
                        onChange={(e) =>
                          handleInputChange('dateOfJoining', e.target.value)
                        }
                        placeholder="DD/MMMM/YYYY"
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {formatDate(profileData.dateOfJoining)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      PAN Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.panNumber}
                        onChange={(e) =>
                          handleInputChange('panNumber', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.panNumber || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Aadhar Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.aadharNumber}
                        onChange={(e) =>
                          handleInputChange('aadharNumber', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.aadharNumber || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Passport Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.passportNumber}
                        onChange={(e) =>
                          handleInputChange('passportNumber', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.passportNumber || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Marital Status
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.maritalStatus}
                        onChange={(e) =>
                          handleInputChange('maritalStatus', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.maritalStatus || 'N/A'}
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
                      <input
                        type="tel"
                        value={profileData.primaryPhoneNumber}
                        onChange={(e) =>
                          handleInputChange('primaryPhoneNumber', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.primaryPhoneNumber || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Secondary Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.secondaryPhoneNumber}
                        onChange={(e) =>
                          handleInputChange('secondaryPhoneNumber', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.secondaryPhoneNumber || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Personal Email ID
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.personalEmailId}
                        onChange={(e) =>
                          handleInputChange('personalEmailId', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.personalEmailId || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Permanent Residential Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.permanentResidentialAddress}
                        onChange={(e) =>
                          handleInputChange('permanentResidentialAddress', e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.permanentResidentialAddress || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Current Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.currentAddress}
                        onChange={(e) =>
                          handleInputChange('currentAddress', e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.currentAddress || 'N/A'}
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
                      <input
                        type="text"
                        value={profileData.bankName}
                        onChange={(e) =>
                          handleInputChange('bankName', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.bankName || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Account Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.accountNumber}
                        onChange={(e) =>
                          handleInputChange('accountNumber', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.accountNumber || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      IFSC Code
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.ifscCode}
                        onChange={(e) =>
                          handleInputChange('ifscCode', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.ifscCode || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Bank Branch Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.bankBranchName}
                        onChange={(e) =>
                          handleInputChange('bankBranchName', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.bankBranchName || 'N/A'}
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
                      <input
                        type="text"
                        value={profileData.fathersName}
                        onChange={(e) =>
                          handleInputChange('fathersName', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.fathersName || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Father's Contact No.
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.fathersContactNo}
                        onChange={(e) =>
                          handleInputChange('fathersContactNo', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.fathersContactNo || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Mother's Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.mothersName}
                        onChange={(e) =>
                          handleInputChange('mothersName', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.mothersName || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Mother's Contact No.
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.mothersContactNo}
                        onChange={(e) =>
                          handleInputChange('mothersContactNo', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.mothersContactNo || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Spouse Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.spouseName}
                        onChange={(e) =>
                          handleInputChange('spouseName', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.spouseName || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Spouse Contact No.
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.spouseContactNo}
                        onChange={(e) =>
                          handleInputChange('spouseContactNo', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.spouseContactNo || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Siblings (Name and Contact Details)
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.siblings}
                        onChange={(e) =>
                          handleInputChange('siblings', e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.siblings || 'N/A'}
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
                      <input
                        type="text"
                        value={profileData.bloodGroup}
                        onChange={(e) =>
                          handleInputChange('bloodGroup', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.bloodGroup || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Do you have any medical insurance?
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.hasMedicalInsurance}
                        onChange={(e) =>
                          handleInputChange('hasMedicalInsurance', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      >
                        <option value="">Select</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.hasMedicalInsurance || 'N/A'}
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
                      <select
                        value={profileData.department}
                        onChange={(e) =>
                          handleInputChange('department', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      >
                        <option value="">Select</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="HR">Human Resources</option>
                        <option value="Finance">Finance</option>
                      </select>
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.department || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Position
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.position}
                        onChange={(e) =>
                          handleInputChange('position', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.position || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Hire Date
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.hireDate}
                        onChange={(e) =>
                          handleInputChange('hireDate', e.target.value)
                        }
                        placeholder="DD/MMMM/YYYY"
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {formatDate(profileData.hireDate)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Manager
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.manager}
                        onChange={(e) =>
                          handleInputChange('manager', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.manager || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Work Location
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.workLocation}
                        onChange={(e) =>
                          handleInputChange('workLocation', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      >
                        <option value="">Select</option>
                        <option value="Remote">Remote</option>
                        <option value="Office">Office</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.workLocation || 'N/A'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Button for Mobile */}
              {isEditing && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-blue-100 z-50">
                  <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave size={20} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;