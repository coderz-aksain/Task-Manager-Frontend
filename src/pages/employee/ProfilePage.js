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

// // Helper function to handle object rendering
// const renderObject = (obj) => {
//   if (!obj || typeof obj !== 'object') return obj;
//   return Object.entries(obj)
//     .map(([key, value]) => `${key}: ${value}`)
//     .join(', ');
// };

// const ProfilePage = () => {
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
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header isLoggedIn={!!localStorage.getItem('token')} onToggleSidebar={toggleSidebar} />
//         <main className="p-4 sm:p-6 overflow-auto">
//           <div className="max-w-7xl mx-auto">
//             {/* Page Header */}
//             <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">
//                   Employee Profile
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

// export default ProfilePage;


// import React, { useState, useEffect } from 'react';
// import {
//   FaCamera,
//   FaSave,
//   FaEdit,
//   FaEnvelope,
//   FaBuilding,
//   FaUser,
//   FaFilePdf,
// } from 'react-icons/fa';
// import Header from '../../components/common/Header';
// import Sidebar from '../../components/common/Sidebar';

// // Helper function to handle object rendering (e.g., for siblings)
// const renderObject = (obj) => {
//   if (!obj || typeof obj !== 'object') return obj || 'N/A';
//   return Object.entries(obj)
//     .map(([key, value]) => `${key}: ${value}`)
//     .join(', ');
// };

// const ProfilePage = () => {
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
//     department: '',
//     position: '',
//     employeeId: '',
//     hireDate: '',
//     manager: '',
//     workLocation: '',
//     emergencyContact: '',
//     profileImage: null,
//     bankPassbook: null,
//     panCard: null,
//     aadharFront: null,
//     aadharBack: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

//   // Fetch profile data on mount
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
//         manager: data.manager || '',
//         profileImage: data.profileImage || null,
//         bankPassbook: data.bankPassbook || null,
//         panCard: data.panCard || null,
//         aadharFront: data.aadharFront || null,
//         aadharBack: data.aadharBack || null,
//       }));
//     } catch (err) {
//       setError(err.message || "Failed to fetch profile");
//       setTimeout(() => setError(''), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProfile = async () => {
//     setLoading(true);
//     setError('');
//     console.log("API Call: /profile-edit", profileData);
//     const dataToSend = new FormData();
//     Object.entries(profileData).forEach(([key, value]) => {
//       if (
//         ['profileImage', 'bankPassbook', 'panCard', 'aadharFront', 'aadharBack'].includes(key) &&
//         value instanceof File
//       ) {
//         dataToSend.append(key, value);
//       } else if (
//         !['profileImage', 'bankPassbook', 'panCard', 'aadharFront', 'aadharBack'].includes(key) &&
//         value !== null &&
//         value !== undefined &&
//         value !== ''
//       ) {
//         dataToSend.append(key, value);
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
//       await fetchProfile(); // Refresh profile data after update
//     } catch (err) {
//       setError(err.message || "Failed to update profile");
//       setTimeout(() => setError(''), 3000);
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

//   const handleFileUpload = (field) => (event) => {
//     const file = event.target.files[0];
//     if (file && file.type === 'application/pdf') {
//       if (file.size > 5 * 1024 * 1024) { // Limit to 5MB
//         setError('File size exceeds 5MB limit');
//         setTimeout(() => setError(''), 3000);
//         return;
//       }
//       setProfileData((prev) => ({
//         ...prev,
//         [field]: file,
//       }));
//     } else {
//       setError('Please upload a valid PDF file');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       if (file.size > 2 * 1024 * 1024) { // Limit to 2MB
//         setError('Image size exceeds 2MB limit');
//         setTimeout(() => setError(''), 3000);
//         return;
//       }
//       setProfileData((prev) => ({
//         ...prev,
//         profileImage: file,
//       }));
//     } else {
//       setError('Please upload a valid image file (JPG, PNG)');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     event.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
//   };

//   const handleDragLeave = (event) => {
//     event.preventDefault();
//     event.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
//   };

//   const handleDrop = (field) => (event) => {
//     event.preventDefault();
//     event.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
//     const file = event.dataTransfer.files[0];
//     if (file && file.type === 'application/pdf') {
//       if (file.size > 5 * 1024 * 1024) { // Limit to 5MB
//         setError('File size exceeds 5MB limit');
//         setTimeout(() => setError(''), 3000);
//         return;
//       }
//       setProfileData((prev) => ({
//         ...prev,
//         [field]: file,
//       }));
//     } else {
//       setError('Please drop a valid PDF file');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   const handleSave = () => {
//     // Basic validation before saving
//     if (isEditing) {
//       if (!profileData.firstName || !profileData.lastName) {
//         setError('First Name and Last Name are required');
//         setTimeout(() => setError(''), 3000);
//         return;
//       }
//       updateProfile();
//     }
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   return (
//     <div className="flex w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header isLoggedIn={!!localStorage.getItem('token')} onToggleSidebar={toggleSidebar} />
//         <main className="p-4 sm:p-6 overflow-auto">
//           <div className="max-w-7xl mx-auto">
//             {/* Page Header */}
//             <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">
//                   Employee Profile
//                 </h2>
//                 <button
//                   onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
//                   className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto disabled:opacity-50"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                   ) : isEditing ? (
//                     <FaSave size={20} />
//                   ) : (
//                     <FaEdit size={20} />
//                   )}
//                   <span>{loading ? 'Processing...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
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
//                           accept="image/jpeg,image/png"
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
//                         onChange={(e) => handleInputChange('firstName', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         required
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
//                         onChange={(e) => handleInputChange('lastName', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         required
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
//                         onChange={(e) => handleInputChange('gender', e.target.value)}
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
//                         onChange={(e) => handleInputChange('officialDateOfBirth', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.officialDateOfBirth ? new Date(profileData.officialDateOfBirth).toLocaleDateString() : 'N/A'}
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
//                         onChange={(e) => handleInputChange('actualDateOfBirth', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.actualDateOfBirth ? new Date(profileData.actualDateOfBirth).toLocaleDateString() : 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Date of Joining
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="date"
//                         value={profileData.dateOfJoining}
//                         onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.dateOfJoining ? new Date(profileData.dateOfJoining).toLocaleDateString() : 'N/A'}
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
//                         onChange={(e) => handleInputChange('panNumber', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
//                         title="PAN should be 10 characters (5 letters, 4 digits, 1 letter)"
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
//                         onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{12}"
//                         title="Aadhar number should be 12 digits"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.aadharNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Aadhar Card (Front)
//                     </label>
//                     {isEditing ? (
//                       <div
//                         className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop('aadharFront')}
//                       >
//                         {profileData.aadharFront ? (
//                           <div className="text-center">
//                             <p className="text-sm truncate max-w-[200px]">{profileData.aadharFront.name}</p>
//                             <button
//                               className="text-xs text-blue-600 hover:text-blue-800 mt-1"
//                               onClick={() => handleInputChange('aadharFront', null)}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                             <p className="text-sm">Drag & drop PDF or click to upload</p>
//                           </>
//                         )}
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           onChange={handleFileUpload('aadharFront')}
//                           className="absolute w-full h-full opacity-0 cursor-pointer"
//                         />
//                       </div>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.aadharFront ? 'Aadhar Front Uploaded' : 'Not uploaded'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Aadhar Card (Back)
//                     </label>
//                     {isEditing ? (
//                       <div
//                         className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop('aadharBack')}
//                       >
//                         {profileData.aadharBack ? (
//                           <div className="text-center">
//                             <p className="text-sm truncate max-w-[200px]">{profileData.aadharBack.name}</p>
//                             <button
//                               className="text-xs text-blue-600 hover:text-blue-800 mt-1"
//                               onClick={() => handleInputChange('aadharBack', null)}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                             <p className="text-sm">Drag & drop PDF or click to upload</p>
//                           </>
//                         )}
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           onChange={handleFileUpload('aadharBack')}
//                           className="absolute w-full h-full opacity-0 cursor-pointer"
//                         />
//                       </div>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.aadharBack ? 'Aadhar Back Uploaded' : 'Not uploaded'}
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
//                         onChange={(e) => handleInputChange('passportNumber', e.target.value)}
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
//                         onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
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
//                         onChange={(e) => handleInputChange('primaryPhoneNumber', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
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
//                         onChange={(e) => handleInputChange('secondaryPhoneNumber', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
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
//                         onChange={(e) => handleInputChange('personalEmailId', e.target.value)}
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
//                         onChange={(e) => handleInputChange('permanentResidentialAddress', e.target.value)}
//                         rows={3}
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
//                         onChange={(e) => handleInputChange('currentAddress', e.target.value)}
//                         rows={3}
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
//                         onChange={(e) => handleInputChange('bankName', e.target.value)}
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
//                         onChange={(e) => handleInputChange('accountNumber', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{9,18}"
//                         title="Account number should be 9-18 digits"
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
//                         onChange={(e) => handleInputChange('ifscCode', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="[A-Z]{4}0[A-Z0-9]{6}"
//                         title="IFSC code should be 11 characters (4 letters, 0, 6 alphanumeric)"
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
//                         onChange={(e) => handleInputChange('bankBranchName', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bankBranchName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Bank Passbook (PDF)
//                     </label>
//                     {isEditing ? (
//                       <div
//                         className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop('bankPassbook')}
//                       >
//                         {profileData.bankPassbook ? (
//                           <div className="text-center">
//                             <p className="text-sm truncate max-w-[200px]">{profileData.bankPassbook.name}</p>
//                             <button
//                               className="text-xs text-blue-600 hover:text-blue-800 mt-1"
//                               onClick={() => handleInputChange('bankPassbook', null)}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                             <p className="text-sm">Drag & drop PDF or click to upload</p>
//                           </>
//                         )}
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           onChange={handleFileUpload('bankPassbook')}
//                           className="absolute w-full h-full opacity-0 cursor-pointer"
//                         />
//                       </div>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bankPassbook ? 'Passbook Uploaded' : 'Not uploaded'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       PAN Card (PDF)
//                     </label>
//                     {isEditing ? (
//                       <div
//                         className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop('panCard')}
//                       >
//                         {profileData.panCard ? (
//                           <div className="text-center">
//                             <p className="text-sm truncate max-w-[200px]">{profileData.panCard.name}</p>
//                             <button
//                               className="text-xs text-blue-600 hover:text-blue-800 mt-1"
//                               onClick={() => handleInputChange('panCard', null)}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                             <p className="text-sm">Drag & drop PDF or click to upload</p>
//                           </>
//                         )}
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           onChange={handleFileUpload('panCard')}
//                           className="absolute w-full h-full opacity-0 cursor-pointer"
//                         />
//                       </div>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.panCard ? 'PAN Card Uploaded' : 'Not uploaded'}
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
//                         onChange={(e) => handleInputChange('fathersName', e.target.value)}
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
//                         type="tel"
//                         value={profileData.fathersContactNo}
//                         onChange={(e) => handleInputChange('fathersContactNo', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
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
//                         onChange={(e) => handleInputChange('mothersName', e.target.value)}
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
//                         type="tel"
//                         value={profileData.mothersContactNo}
//                         onChange={(e) => handleInputChange('mothersContactNo', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
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
//                         onChange={(e) => handleInputChange('spouseName', e.target.value)}
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
//                         type="tel"
//                         value={profileData.spouseContactNo}
//                         onChange={(e) => handleInputChange('spouseContactNo', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
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
//                         onChange={(e) => handleInputChange('siblings', e.target.value)}
//                         rows={3}
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
//                       <select
//                         value={profileData.bloodGroup}
//                         onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="A+">A+</option>
//                         <option value="A-">A-</option>
//                         <option value="B+">B+</option>
//                         <option value="B-">B-</option>
//                         <option value="AB+">AB+</option>
//                         <option value="AB-">AB-</option>
//                         <option value="O+">O+</option>
//                         <option value="O-">O-</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bloodGroup || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Medical Insurance
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.hasMedicalInsurance}
//                         onChange={(e) => handleInputChange('hasMedicalInsurance', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="Yes">Yes</option>
//                         <option value="No">No</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.hasMedicalInsurance || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Emergency Contact
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="tel"
//                         value={profileData.emergencyContact}
//                         onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.emergencyContact || 'N/A'}
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
//                         onChange={(e) => handleInputChange('department', e.target.value)}
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
//                         onChange={(e) => handleInputChange('position', e.target.value)}
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
//                       Employee ID
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.employeeId}
//                         onChange={(e) => handleInputChange('employeeId', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.employeeId || 'N/A'}
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
//                         onChange={(e) => handleInputChange('hireDate', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.hireDate ? new Date(profileData.hireDate).toLocaleDateString() : 'N/A'}
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
//                         onChange={(e) => handleInputChange('manager', e.target.value)}
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
//                         onChange={(e) => handleInputChange('workLocation', e.target.value)}
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
//                 <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-blue-100 shadow-lg z-50">
//                   <button
//                     onClick={handleSave}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                     ) : (
//                       <FaSave size={20} />
//                     )}
//                     <span>{loading ? 'Processing...' : 'Save Changes'}</span>
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

// export default ProfilePage;


// import React, { useState, useEffect } from 'react';
// import {
//   FaCamera,
//   FaSave,
//   FaEdit,
//   FaEnvelope,
//   FaBuilding,
//   FaUser,
//   FaFilePdf,
//   FaDownload,
//   FaEye,
// } from 'react-icons/fa';
// import Header from '../../components/common/Header';
// import Sidebar from '../../components/common/Sidebar';

// // Helper function to handle object rendering (e.g., for siblings)
// const renderObject = (obj) => {
//   if (!obj || typeof obj !== 'object') return obj || 'N/A';
//   return Object.entries(obj)
//     .map(([key, value]) => `${key}: ${value}`)
//     .join(', ');
// };

// // Helper function to format date to DD/MM/YYYY
// const formatDateToDDMMYYYY = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   if (isNaN(date)) return dateString; // Return original if invalid
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// };

// // Helper function to parse DD/MM/YYYY to YYYY-MM-DD for input type="date"
// const parseDateToInputFormat = (dateString) => {
//   if (!dateString) return '';
//   const ddmmyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateString);
//   if (ddmmyyyy) {
//     const [_, day, month, year] = ddmmyyyy;
//     return `${year}-${month}-${day}`;
//   }
//   return dateString; // Return original if already in YYYY-MM-DD
// };

// // Custom Toast Component
// const CustomToast = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div
//       className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white transform transition-transform duration-300 ease-in-out ${
//         type === 'success' ? 'bg-green-500' : 'bg-red-500'
//       } translate-x-0 z-50`}
//     >
//       {message}
//     </div>
//   );
// };

// const ProfilePage = () => {
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
//     department: '',
//     position: '',
//     employeeId: '',
//     hireDate: '',
//     manager: '',
//     workLocation: '',
//     emergencyContact: '',
//     profileImage: null,
//     bankPassbook: null,
//     panCard: null,
//     aadharFront: null,
//     aadharBack: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [toast, setToast] = useState({ show: false, message: '', type: '' });

//   const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

//   // Fetch profile data on mount
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
//         officialDateOfBirth: parseDateToInputFormat(data.officialDateOfBirth),
//         actualDateOfBirth: parseDateToInputFormat(data.actualDateOfBirth),
//         dateOfJoining: parseDateToInputFormat(data.dateOfJoining),
//         hireDate: parseDateToInputFormat(data.hireDate),
//         siblings: typeof data.siblings === 'object' ? renderObject(data.siblings) : data.siblings || '',
//         manager: data.manager || '',
//         profileImage: data.profileImage || null,
//         bankPassbook: data.bankPassbook || null,
//         panCard: data.panCard || null,
//         aadharFront: data.aadharFront || null,
//         aadharBack: data.aadharBack || null,
//       }));
//     } catch (err) {
//       setError(err.message || "Failed to fetch profile");
//       setTimeout(() => setError(''), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProfile = async () => {
//     setLoading(true);
//     setError('');
//     const dataToSend = new FormData();
//     Object.entries(profileData).forEach(([key, value]) => {
//       if (
//         ['profileImage', 'bankPassbook', 'panCard', 'aadharFront', 'aadharBack'].includes(key) &&
//         value instanceof File
//       ) {
//         dataToSend.append(key, value);
//       } else if (
//         !['profileImage', 'bankPassbook', 'panCard', 'aadharFront', 'aadharBack'].includes(key) &&
//         value !== null &&
//         value !== undefined &&
//         value !== ''
//       ) {
//         // Format dates to DD/MM/YYYY before sending
//         if (['officialDateOfBirth', 'actualDateOfBirth', 'dateOfJoining', 'hireDate'].includes(key)) {
//           dataToSend.append(key, formatDateToDDMMYYYY(value));
//         } else {
//           dataToSend.append(key, value);
//         }
//       }
//     });
//     console.log("API Call: /profile-edit", Object.fromEntries(dataToSend));
//     try {
//       const response = await fetch(`${BASE_URL}/profile-edit`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         body: dataToSend,
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to update profile");
//       console.log("API Response: /profile-edit", data);
//       setToast({
//         show: true,
//         message: 'Profile updated successfully!',
//         type: 'success',
//       });
//       setIsEditing(false);
//       await fetchProfile(); // Refresh profile data after update
//     } catch (err) {
//       setError(err.message || "Failed to update profile");
//       setTimeout(() => setError(''), 3000);
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

//   const handleFileUpload = (field) => (event) => {
//     const file = event.target.files[0];
//     if (file && file.type === 'application/pdf') {
//       if (file.size > 20 * 1024 * 1024) { // Align with backend 20MB limit
//         setError('File size exceeds 20MB limit');
//         setTimeout(() => setError(''), 3000);
//         return;
//       }
//       setProfileData((prev) => ({
//         ...prev,
//         [field]: file,
//       }));
//     } else {
//       setError('Please upload a valid PDF file');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       if (file.size > 20 * 1024 * 1024) { // Align with backend 20MB limit
//         setError('Image size exceeds 20MB limit');
//         setTimeout(() => setError(''), 3000);
//         return;
//       }
//       setProfileData((prev) => ({
//         ...prev,
//         profileImage: file,
//       }));
//     } else {
//       setError('Please upload a valid image file (JPG, PNG)');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     event.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
//   };

//   const handleDragLeave = (event) => {
//     event.preventDefault();
//     event.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
//   };

//   const handleDrop = (field) => (event) => {
//     event.preventDefault();
//     event.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
//     const file = event.dataTransfer.files[0];
//     if (file && file.type === 'application/pdf') {
//       if (file.size > 20 * 1024 * 1024) { // Align with backend 20MB limit
//         setError('File size exceeds 20MB limit');
//         setTimeout(() => setError(''), 3000);
//         return;
//       }
//       setProfileData((prev) => ({
//         ...prev,
//         [field]: file,
//       }));
//     } else {
//       setError('Please drop a valid PDF file');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   const handleSave = () => {
//     if (isEditing) {
//       if (!profileData.firstName || !profileData.lastName) {
//         setError('First Name and Last Name are required');
//         setTimeout(() => setError(''), 3000);
//         return;
//       }
//       updateProfile();
//     }
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   // Handle file download
//   const handleDownload = (url, filename) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = filename || 'document';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Handle file view
//   const handleView = (url) => {
//     window.open(url, '_blank');
//   };

//   // Close toast
//   const closeToast = () => {
//     setToast({ show: false, message: '', type: '' });
//   };

//   return (
//     <div className="flex w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header isLoggedIn={!!localStorage.getItem('token')} onToggleSidebar={toggleSidebar} />
//         <main className="p-4 sm:p-6 overflow-auto">
//           {toast.show && (
//             <CustomToast
//               message={toast.message}
//               type={toast.type}
//               onClose={closeToast}
//             />
//           )}
//           <div className="max-w-7xl mx-auto">
//             {/* Page Header */}
//             <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">
//                   Employee Profile
//                 </h2>
//                 <button
//                   onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
//                   className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto disabled:opacity-50"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                   ) : isEditing ? (
//                     <FaSave size={20} />
//                   ) : (
//                     <FaEdit size={20} />
//                   )}
//                   <span>{loading ? 'Processing...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
//                 </button>
//               </div>
//               {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//             </div>

//             {/* Scrollable Form Section */}
//             <div className="max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
//               {/* Profile Picture Section */}
//               <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
//                 <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
//                   <div className="relative group">
//                     <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full overflow-hidden">
//                       {profileData.profileImage ? (
//                         <>
//                           <img
//                             src={profileData.profileImage instanceof File ? URL.createObjectURL(profileData.profileImage) : profileData.profileImage}
//                             alt="Profile"
//                             className="w-full h-full object-cover"
//                           />
//                           <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                             <button
//                               onClick={() => handleDownload(profileData.profileImage, 'profile-image.jpg')}
//                               className="text-white mx-2"
//                               title="Download"
//                             >
//                               <FaDownload size={20} />
//                             </button>
//                             <button
//                               onClick={() => handleView(profileData.profileImage)}
//                               className="text-white mx-2"
//                               title="View"
//                             >
//                               <FaEye size={20} />
//                             </button>
//                           </div>
//                         </>
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
//                           accept="image/jpeg,image/png"
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
//                         onChange={(e) => handleInputChange('firstName', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         required
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
//                         onChange={(e) => handleInputChange('lastName', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         required
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
//                         onChange={(e) => handleInputChange('gender', e.target.value)}
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
//                         onChange={(e) => handleInputChange('officialDateOfBirth', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.officialDateOfBirth ? new Date(profileData.officialDateOfBirth).toLocaleDateString('en-GB') : 'N/A'}
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
//                         onChange={(e) => handleInputChange('actualDateOfBirth', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.actualDateOfBirth ? new Date(profileData.actualDateOfBirth).toLocaleDateString('en-GB') : 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Date of Joining
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="date"
//                         value={profileData.dateOfJoining}
//                         onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.dateOfJoining ? new Date(profileData.dateOfJoining).toLocaleDateString('en-GB') : 'N/A'}
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
//                         onChange={(e) => handleInputChange('panNumber', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
//                         title="PAN should be 10 characters (5 letters, 4 digits, 1 letter)"
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
//                         onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{12}"
//                         title="Aadhar number should be 12 digits"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.aadharNumber || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Aadhar Card (Front)
//                     </label>
//                     {isEditing ? (
//                       <div
//                         className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop('aadharFront')}
//                       >
//                         {profileData.aadharFront ? (
//                           <div className="text-center">
//                             <p className="text-sm truncate max-w-[200px]">{profileData.aadharFront.name || 'Aadhar Front'}</p>
//                             <button
//                               className="text-xs text-blue-600 hover:text-blue-800 mt-1"
//                               onClick={() => handleInputChange('aadharFront', null)}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                             <p className="text-sm">Drag & drop PDF or click to upload</p>
//                           </>
//                         )}
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           onChange={handleFileUpload('aadharFront')}
//                           className="absolute w-full h-full opacity-0 cursor-pointer"
//                         />
//                       </div>
//                     ) : (
//                       <div className="relative group">
//                         {profileData.aadharFront ? (
//                           <>
//                             <div className="flex  items-center space-x-2">
//                               <FaFilePdf size={24} className="text-blue-400" />
//                               <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                                 Aadhar Front
//                               </p>
//                             </div>
//                             <div className="absolute  inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                               <button
//                                 onClick={() => handleDownload(profileData.aadharFront, 'aadhar-front.pdf')}
//                                 className="text-white mx-2"
//                                 title="Download"
//                               >
//                                 <FaDownload size={20} />
//                               </button>
//                               <button
//                                 onClick={() => handleView(profileData.aadharFront)}
//                                 className="text-white mx-2"
//                                 title="View"
//                               >
//                                 <FaEye size={20} />
//                               </button>
//                             </div>
//                           </>
//                         ) : (
//                           <p className="text-gray-500 text-sm sm:text-base">Not uploaded</p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Aadhar Card (Back)
//                     </label>
//                     {isEditing ? (
//                       <div
//                         className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop('aadharBack')}
//                       >
//                         {profileData.aadharBack ? (
//                           <div className="text-center">
//                             <p className="text-sm truncate max-w-[200px]">{profileData.aadharBack.name || 'Aadhar Back'}</p>
//                             <button
//                               className="text-xs text-blue-600 hover:text-blue-800 mt-1"
//                               onClick={() => handleInputChange('aadharBack', null)}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                             <p className="text-sm">Drag & drop PDF or click to upload</p>
//                           </>
//                         )}
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           onChange={handleFileUpload('aadharBack')}
//                           className="absolute w-full h-full opacity-0 cursor-pointer"
//                         />
//                       </div>
//                     ) : (
//                       <div className="relative group">
//                         {profileData.aadharBack ? (
//                           <>
//                             <div className="flex items-center space-x-2">
//                               <FaFilePdf size={24} className="text-blue-400" />
//                               <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                                 Aadhar Back
//                               </p>
//                             </div>
//                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                               <button
//                                 onClick={() => handleDownload(profileData.aadharBack, 'aadhar-back.pdf')}
//                                 className="text-white mx-2"
//                                 title="Download"
//                               >
//                                 <FaDownload size={20} />
//                               </button>
//                               <button
//                                 onClick={() => handleView(profileData.aadharBack)}
//                                 className="text-white mx-2"
//                                 title="View"
//                               >
//                                 <FaEye size={20} />
//                               </button>
//                             </div>
//                           </>
//                         ) : (
//                           <p className="text-gray-500 text-sm sm:text-base">Not uploaded</p>
//                         )}
//                       </div>
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
//                         onChange={(e) => handleInputChange('passportNumber', e.target.value)}
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
//                         onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
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
//                         onChange={(e) => handleInputChange('primaryPhoneNumber', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
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
//                         onChange={(e) => handleInputChange('secondaryPhoneNumber', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
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
//                         onChange={(e) => handleInputChange('personalEmailId', e.target.value)}
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
//                         onChange={(e) => handleInputChange('permanentResidentialAddress', e.target.value)}
//                         rows={3}
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
//                         onChange={(e) => handleInputChange('currentAddress', e.target.value)}
//                         rows={3}
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
//                         onChange={(e) => handleInputChange('bankName', e.target.value)}
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
//                         onChange={(e) => handleInputChange('accountNumber', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{9,18}"
//                         title="Account number should be 9-18 digits"
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
//                         onChange={(e) => handleInputChange('ifscCode', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="[A-Z]{4}0[A-Z0-9]{6}"
//                         title="IFSC code should be 11 characters (4 letters, 0, 6 alphanumeric)"
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
//                         onChange={(e) => handleInputChange('bankBranchName', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bankBranchName || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Bank Passbook (PDF)
//                     </label>
//                     {isEditing ? (
//                       <div
//                         className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop('bankPassbook')}
//                       >
//                         {profileData.bankPassbook ? (
//                           <div className="text-center">
//                             <p className="text-sm truncate max-w-[200px]">{profileData.bankPassbook.name || 'Bank Passbook'}</p>
//                             <button
//                               className="text-xs text-blue-600 hover:text-blue-800 mt-1"
//                               onClick={() => handleInputChange('bankPassbook', null)}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                             <p className="text-sm">Drag & drop PDF or click to upload</p>
//                           </>
//                         )}
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           onChange={handleFileUpload('bankPassbook')}
//                           className="absolute w-full h-full opacity-0 cursor-pointer"
//                         />
//                       </div>
//                     ) : (
//                       <div className="relative group">
//                         {profileData.bankPassbook ? (
//                           <>
//                             <div className="flex items-center space-x-2">
//                               <FaFilePdf size={24} className="text-blue-400" />
//                               <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                                 Bank Passbook
//                               </p>
//                             </div>
//                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                               <button
//                                 onClick={() => handleDownload(profileData.bankPassbook, 'bank-passbook.pdf')}
//                                 className="text-white mx-2"
//                                 title="Download"
//                               >
//                                 <FaDownload size={20} />
//                               </button>
//                               <button
//                                 onClick={() => handleView(profileData.bankPassbook)}
//                                 className="text-white mx-2"
//                                 title="View"
//                               >
//                                 <FaEye size={20} />
//                               </button>
//                             </div>
//                           </>
//                         ) : (
//                           <p className="text-gray-500 text-sm sm:text-base">Not uploaded</p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       PAN Card (PDF)
//                     </label>
//                     {isEditing ? (
//                       <div
//                         className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
//                         onDragOver={handleDragOver}
//                         onDragLeave={handleDragLeave}
//                         onDrop={handleDrop('panCard')}
//                       >
//                         {profileData.panCard ? (
//                           <div className="text-center">
//                             <p className="text-sm truncate max-w-[200px]">{profileData.panCard.name || 'PAN Card'}</p>
//                             <button
//                               className="text-xs text-blue-600 hover:text-blue-800 mt-1"
//                               onClick={() => handleInputChange('panCard', null)}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <FaFilePdf size={24} className="text-blue-400 mb-2" />
//                             <p className="text-sm">Drag & drop PDF or click to upload</p>
//                           </>
//                         )}
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           onChange={handleFileUpload('panCard')}
//                           className="absolute w-full h-full opacity-0 cursor-pointer"
//                         />
//                       </div>
//                     ) : (
//                       <div className="relative group">
//                         {profileData.panCard ? (
//                           <>
//                             <div className="flex items-center space-x-2">
//                               <FaFilePdf size={24} className="text-blue-400" />
//                               <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                                 PAN Card
//                               </p>
//                             </div>
//                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                               <button
//                                 onClick={() => handleDownload(profileData.panCard, 'pan-card.pdf')}
//                                 className="text-white mx-2"
//                                 title="Download"
//                               >
//                                 <FaDownload size={20} />
//                               </button>
//                               <button
//                                 onClick={() => handleView(profileData.panCard)}
//                                 className="text-white mx-2"
//                                 title="View"
//                               >
//                                 <FaEye size={20} />
//                               </button>
//                             </div>
//                           </>
//                         ) : (
//                           <p className="text-gray-500 text-sm sm:text-base">Not uploaded</p>
//                         )}
//                       </div>
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
//                         onChange={(e) => handleInputChange('fathersName', e.target.value)}
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
//                         type="tel"
//                         value={profileData.fathersContactNo}
//                         onChange={(e) => handleInputChange('fathersContactNo', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
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
//                         onChange={(e) => handleInputChange('mothersName', e.target.value)}
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
//                         type="tel"
//                         value={profileData.mothersContactNo}
//                         onChange={(e) => handleInputChange('mothersContactNo', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
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
//                         onChange={(e) => handleInputChange('spouseName', e.target.value)}
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
//                         type="tel"
//                         value={profileData.spouseContactNo}
//                         onChange={(e) => handleInputChange('spouseContactNo', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
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
//                         onChange={(e) => handleInputChange('siblings', e.target.value)}
//                         rows={3}
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
//                       <select
//                         value={profileData.bloodGroup}
//                         onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="A+">A+</option>
//                         <option value="A-">A-</option>
//                         <option value="B+">B+</option>
//                         <option value="B-">B-</option>
//                         <option value="AB+">AB+</option>
//                         <option value="AB-">AB-</option>
//                         <option value="O+">O+</option>
//                         <option value="O-">O-</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.bloodGroup || 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Medical Insurance
//                     </label>
//                     {isEditing ? (
//                       <select
//                         value={profileData.hasMedicalInsurance}
//                         onChange={(e) => handleInputChange('hasMedicalInsurance', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       >
//                         <option value="">Select</option>
//                         <option value="true">Yes</option>
//                         <option value="false">No</option>
//                       </select>
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.hasMedicalInsurance ? 'Yes' : profileData.hasMedicalInsurance === false ? 'No' : 'N/A'}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Emergency Contact
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="tel"
//                         value={profileData.emergencyContact}
//                         onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         pattern="\d{10}"
//                         title="Phone number should be 10 digits"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.emergencyContact || 'N/A'}
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
//                         onChange={(e) => handleInputChange('department', e.target.value)}
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
//                         onChange={(e) => handleInputChange('position', e.target.value)}
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
//                       Employee ID
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={profileData.employeeId}
//                         onChange={(e) => handleInputChange('employeeId', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.employeeId || 'N/A'}
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
//                         onChange={(e) => handleInputChange('hireDate', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                       />
//                     ) : (
//                       <p className="text-gray-500 text-sm sm:text-base">
//                         {profileData.hireDate ? new Date(profileData.hireDate).toLocaleDateString('en-GB') : 'N/A'}
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
//                         onChange={(e) => handleInputChange('manager', e.target.value)}
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
//                         onChange={(e) => handleInputChange('workLocation', e.target.value)}
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
//                 <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-blue-100 shadow-lg z-50">
//                   <button
//                     onClick={handleSave}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                     ) : (
//                       <FaSave size={20} />
//                     )}
//                     <span>{loading ? 'Processing...' : 'Save Changes'}</span>
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

// export default ProfilePage;


import React, { useState, useEffect } from 'react';
import {
  FaCamera,
  FaSave,
  FaEdit,
  FaEnvelope,
  FaBuilding,
  FaUser,
  FaFilePdf,
} from 'react-icons/fa';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';

// Helper function to handle object rendering (e.g., for siblings)
const renderObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj || 'N/A';
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
};

// Helper function to format date to DD/MM/YYYY
const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // Return original if invalid
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to parse DD/MM/YYYY to YYYY-MM-DD for input type="date"
const parseDateToInputFormat = (dateString) => {
  if (!dateString) return '';
  const ddmmyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateString);
  if (ddmmyyyy) {
    const [_, day, month, year] = ddmmyyyy;
    return `${year}-${month}-${day}`;
  }
  return dateString; // Return original if already in YYYY-MM-DD
};

// Custom Toast Component
const CustomToast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white transform transition-transform duration-300 ease-in-out ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } translate-x-0 z-50`}
    >
      {message}
    </div>
  );
};

const ProfilePage = () => {
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
    department: '',
    position: '',
    employeeId: '',
    hireDate: '',
    manager: '',
    workLocation: '',
    emergencyContact: '',
    profileImage: null,
    bankPassbook: null,
    panCard: null,
    aadharFront: null,
    aadharBack: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const BASE_URL = "https://task-manager-backend-vqen.onrender.com/api";

  // Fetch profile data on mount
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
        officialDateOfBirth: parseDateToInputFormat(data.officialDateOfBirth),
        actualDateOfBirth: parseDateToInputFormat(data.actualDateOfBirth),
        dateOfJoining: parseDateToInputFormat(data.dateOfJoining),
        hireDate: parseDateToInputFormat(data.hireDate),
        siblings: typeof data.siblings === 'object' ? renderObject(data.siblings) : data.siblings || '',
        manager: data.manager || '',
        profileImage: data.profileImage || null,
        bankPassbook: data.bankPassbook || null,
        panCard: data.panCard || null,
        aadharFront: data.aadharFront || null,
        aadharBack: data.aadharBack || null,
      }));
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    setError('');
    const dataToSend = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      if (
        ['profileImage', 'bankPassbook', 'panCard', 'aadharFront', 'aadharBack'].includes(key) &&
        value instanceof File
      ) {
        dataToSend.append(key, value);
      } else if (
        !['profileImage', 'bankPassbook', 'panCard', 'aadharFront', 'aadharBack'].includes(key) &&
        value !== null &&
        value !== undefined &&
        value !== ''
      ) {
        // Format dates to DD/MM/YYYY before sending
        if (['officialDateOfBirth', 'actualDateOfBirth', 'dateOfJoining', 'hireDate'].includes(key)) {
          dataToSend.append(key, formatDateToDDMMYYYY(value));
        } else {
          dataToSend.append(key, value);
        }
      }
    });
    console.log("API Call: /profile-edit", Object.fromEntries(dataToSend));
    try {
      const response = await fetch(`${BASE_URL}/profile-edit`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: dataToSend,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");
      console.log("API Response: /profile-edit", data);
      setToast({
        show: true,
        message: 'Profile updated successfully!',
        type: 'success',
      });
      setIsEditing(false);
      await fetchProfile(); // Refresh profile data after update
    } catch (err) {
      setError(err.message || "Failed to update profile");
      setTimeout(() => setError(''), 3000);
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

  const handleFileUpload = (field) => (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 20 * 1024 * 1024) { // Align with backend 20MB limit
        setError('File size exceeds 20MB limit');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setProfileData((prev) => ({
        ...prev,
        [field]: file,
      }));
    } else {
      setError('Please upload a valid PDF file');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 20 * 1024 * 1024) { // Align with backend 20MB limit
        setError('Image size exceeds 20MB limit');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setProfileData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    } else {
      setError('Please upload a valid image file (JPG, PNG)');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (field) => (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 20 * 1024 * 1024) { // Align with backend 20MB limit
        setError('File size exceeds 20MB limit');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setProfileData((prev) => ({
        ...prev,
        [field]: file,
      }));
    } else {
      setError('Please drop a valid PDF file');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSave = () => {
    if (isEditing) {
      if (!profileData.firstName || !profileData.lastName) {
        setError('First Name and Last Name are required');
        setTimeout(() => setError(''), 3000);
        return;
      }
      updateProfile();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Handle file view
  const handleView = (url) => {
    window.open(url, '_blank');
  };

  // Close toast
  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header isLoggedIn={!!localStorage.getItem('token')} onToggleSidebar={toggleSidebar} />
        <main className="p-4 sm:p-6 overflow-auto">
          {toast.show && (
            <CustomToast
              message={toast.message}
              type={toast.type}
              onClose={closeToast}
            />
          )}
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">
                  Employee Profile
                </h2>
                <button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : isEditing ? (
                    <FaSave size={20} />
                  ) : (
                    <FaEdit size={20} />
                  )}
                  <span>{loading ? 'Processing...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
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
                        <a
                          href={profileData.profileImage instanceof File ? URL.createObjectURL(profileData.profileImage) : profileData.profileImage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={profileData.profileImage instanceof File ? URL.createObjectURL(profileData.profileImage) : profileData.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </a>
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
                          accept="image/jpeg,image/png"
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
                      {profileData.position || 'N/A'}
                    </p>
                    <p className="text-blue-500 text-sm sm:text-base">
                      {profileData.department || 'N/A'}
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
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        required
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
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        required
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
                        onChange={(e) => handleInputChange('gender', e.target.value)}
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
                        type="date"
                        value={profileData.officialDateOfBirth}
                        onChange={(e) => handleInputChange('officialDateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.officialDateOfBirth ? new Date(profileData.officialDateOfBirth).toLocaleDateString('en-GB') : 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Actual Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profileData.actualDateOfBirth}
                        onChange={(e) => handleInputChange('actualDateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.actualDateOfBirth ? new Date(profileData.actualDateOfBirth).toLocaleDateString('en-GB') : 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Date of Joining
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profileData.dateOfJoining}
                        onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.dateOfJoining ? new Date(profileData.dateOfJoining).toLocaleDateString('en-GB') : 'N/A'}
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
                        onChange={(e) => handleInputChange('panNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        title="PAN should be 10 characters (5 letters, 4 digits, 1 letter)"
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
                        onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        pattern="\d{12}"
                        title="Aadhar number should be 12 digits"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.aadharNumber || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Aadhar Card (Front)
                    </label>
                    {isEditing ? (
                      <div
                        className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop('aadharFront')}
                      >
                        {profileData.aadharFront ? (
                          <div className="text-center">
                            <p className="text-sm truncate max-w-[200px]">{profileData.aadharFront.name || 'Aadhar Front'}</p>
                            <button
                              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                              onClick={() => handleInputChange('aadharFront', null)}
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
                          onChange={handleFileUpload('aadharFront')}
                          className="absolute w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div>
                        {profileData.aadharFront ? (
                          <a
                            href={profileData.aadharFront}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2"
                          >
                            <FaFilePdf size={24} className="text-blue-400" />
                            <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
                              Aadhar Front
                            </p>
                          </a>
                        ) : (
                          <p className="text-gray-500 text-sm sm:text-base">Not uploaded</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Aadhar Card (Back)
                    </label>
                    {isEditing ? (
                      <div
                        className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop('aadharBack')}
                      >
                        {profileData.aadharBack ? (
                          <div className="text-center">
                            <p className="text-sm truncate max-w-[200px]">{profileData.aadharBack.name || 'Aadhar Back'}</p>
                            <button
                              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                              onClick={() => handleInputChange('aadharBack', null)}
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
                          onChange={handleFileUpload('aadharBack')}
                          className="absolute w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div>
                        {profileData.aadharBack ? (
                          <a
                            href={profileData.aadharBack}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2"
                          >
                            <FaFilePdf size={24} className="text-blue-400" />
                            <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
                              Aadhar Back
                            </p>
                          </a>
                        ) : (
                          <p className="text-gray-500 text-sm sm:text-base">Not uploaded</p>
                        )}
                      </div>
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
                        onChange={(e) => handleInputChange('passportNumber', e.target.value)}
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
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
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
                        onChange={(e) => handleInputChange('primaryPhoneNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        pattern="\d{10}"
                        title="Phone number should be 10 digits"
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
                        onChange={(e) => handleInputChange('secondaryPhoneNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        pattern="\d{10}"
                        title="Phone number should be 10 digits"
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
                        onChange={(e) => handleInputChange('personalEmailId', e.target.value)}
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
                        onChange={(e) => handleInputChange('permanentResidentialAddress', e.target.value)}
                        rows={3}
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
                        onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                        rows={3}
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
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
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
                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        pattern="\d{9,18}"
                        title="Account number should be 9-18 digits"
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
                        onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        pattern="[A-Z]{4}0[A-Z0-9]{6}"
                        title="IFSC code should be 11 characters (4 letters, 0, 6 alphanumeric)"
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
                        onChange={(e) => handleInputChange('bankBranchName', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.bankBranchName || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Bank Passbook (PDF)
                    </label>
                    {isEditing ? (
                      <div
                        className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop('bankPassbook')}
                      >
                        {profileData.bankPassbook ? (
                          <div className="text-center">
                            <p className="text-sm truncate max-w-[200px]">{profileData.bankPassbook.name || 'Bank Passbook'}</p>
                            <button
                              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                              onClick={() => handleInputChange('bankPassbook', null)}
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
                          onChange={handleFileUpload('bankPassbook')}
                          className="absolute w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div>
                        {profileData.bankPassbook ? (
                          <a
                            href={profileData.bankPassbook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2"
                          >
                            <FaFilePdf size={24} className="text-blue-400" />
                            <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
                              Bank Passbook
                            </p>
                          </a>
                        ) : (
                          <p className="text-gray-500 text-sm sm:text-base">Not uploaded</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      PAN Card (PDF)
                    </label>
                    {isEditing ? (
                      <div
                        className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop('panCard')}
                      >
                        {profileData.panCard ? (
                          <div className="text-center">
                            <p className="text-sm truncate max-w-[200px]">{profileData.panCard.name || 'PAN Card'}</p>
                            <button
                              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                              onClick={() => handleInputChange('panCard', null)}
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
                          onChange={handleFileUpload('panCard')}
                          className="absolute w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div>
                        {profileData.panCard ? (
                          <a
                            href={profileData.panCard}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2"
                          >
                            <FaFilePdf size={24} className="text-blue-400" />
                            <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
                              PAN Card
                            </p>
                          </a>
                        ) : (
                          <p className="text-gray-500 text-sm sm:text-base">Not uploaded</p>
                        )}
                      </div>
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
                        onChange={(e) => handleInputChange('fathersName', e.target.value)}
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
                        type="tel"
                        value={profileData.fathersContactNo}
                        onChange={(e) => handleInputChange('fathersContactNo', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        pattern="\d{10}"
                        title="Phone number should be 10 digits"
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
                        onChange={(e) => handleInputChange('mothersName', e.target.value)}
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
                        type="tel"
                        value={profileData.mothersContactNo}
                        onChange={(e) => handleInputChange('mothersContactNo', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        pattern="\d{10}"
                        title="Phone number should be 10 digits"
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
                        onChange={(e) => handleInputChange('spouseName', e.target.value)}
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
                        type="tel"
                        value={profileData.spouseContactNo}
                        onChange={(e) => handleInputChange('spouseContactNo', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        pattern="\d{10}"
                        title="Phone number should be 10 digits"
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
                        onChange={(e) => handleInputChange('siblings', e.target.value)}
                        rows={3}
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
                      <select
                        value={profileData.bloodGroup}
                        onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
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
                      </select>
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.bloodGroup || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Medical Insurance
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.hasMedicalInsurance}
                        onChange={(e) => handleInputChange('hasMedicalInsurance', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.hasMedicalInsurance ? 'Yes' : profileData.hasMedicalInsurance === false ? 'No' : 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Emergency Contact
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                        pattern="\d{10}"
                        title="Phone number should be 10 digits"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.emergencyContact || 'N/A'}
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
                        onChange={(e) => handleInputChange('department', e.target.value)}
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
                        onChange={(e) => handleInputChange('position', e.target.value)}
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
                      Employee ID
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.employeeId}
                        onChange={(e) => handleInputChange('employeeId', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.employeeId || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Hire Date
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profileData.hireDate}
                        onChange={(e) => handleInputChange('hireDate', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        {profileData.hireDate ? new Date(profileData.hireDate).toLocaleDateString('en-GB') : 'N/A'}
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
                        onChange={(e) => handleInputChange('manager', e.target.value)}
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
                        onChange={(e) => handleInputChange('workLocation', e.target.value)}
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
                <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-blue-100 shadow-lg z-50">
                  <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <FaSave size={20} />
                    )}
                    <span>{loading ? 'Processing...' : 'Save Changes'}</span>
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

export default ProfilePage;