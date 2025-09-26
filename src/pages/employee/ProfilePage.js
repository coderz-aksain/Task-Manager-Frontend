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

//   const BASE_URL = "https://task-manager-backend-xs5s.onrender.com/api";

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
//                   <div className="relative">
//                     <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full overflow-hidden">
//                       {profileData.profileImage ? (
//                         <a
//                           href={profileData.profileImage instanceof File ? URL.createObjectURL(profileData.profileImage) : profileData.profileImage}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <img
//                             src={profileData.profileImage instanceof File ? URL.createObjectURL(profileData.profileImage) : profileData.profileImage}
//                             alt="Profile"
//                             className="w-full h-full object-cover"
//                           />
//                         </a>
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
//                       <div>
//                         {profileData.aadharFront ? (
//                           <a
//                             href={profileData.aadharFront}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center space-x-2"
//                           >
//                             <FaFilePdf size={24} className="text-blue-400" />
//                             <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                               Aadhar Front
//                             </p>
//                           </a>
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
//                       <div>
//                         {profileData.aadharBack ? (
//                           <a
//                             href={profileData.aadharBack}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center space-x-2"
//                           >
//                             <FaFilePdf size={24} className="text-blue-400" />
//                             <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                               Aadhar Back
//                             </p>
//                           </a>
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
//                       <div>
//                         {profileData.bankPassbook ? (
//                           <a
//                             href={profileData.bankPassbook}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center space-x-2"
//                           >
//                             <FaFilePdf size={24} className="text-blue-400" />
//                             <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                               Bank Passbook
//                             </p>
//                           </a>
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
//                       <div>
//                         {profileData.panCard ? (
//                           <a
//                             href={profileData.panCard}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center space-x-2"
//                           >
//                             <FaFilePdf size={24} className="text-blue-400" />
//                             <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                               PAN Card
//                             </p>
//                           </a>
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

// // Helper function to format date to "02 Jan 2025" format
// const formatDateToLongFormat = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   if (isNaN(date)) return dateString; // Return original if invalid
//   const day = String(date.getDate()).padStart(2, '0');
//   const monthShort = date.toLocaleString('en-GB', { month: 'short' });
//   const year = date.getFullYear();
//   return `${day} ${monthShort} ${year}`;
// };

// // Helper function to format date to DD/MM/YYYY (for API)
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

//   const BASE_URL = "https://task-manager-backend-xs5s.onrender.com/api";

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
//                   <div className="relative">
//                     <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full overflow-hidden">
//                       {profileData.profileImage ? (
//                         <a
//                           href={profileData.profileImage instanceof File ? URL.createObjectURL(profileData.profileImage) : profileData.profileImage}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <img
//                             src={profileData.profileImage instanceof File ? URL.createObjectURL(profileData.profileImage) : profileData.profileImage}
//                             alt="Profile"
//                             className="w-full h-full object-cover"
//                           />
//                         </a>
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
//                     {isEditing ? 
//                     (
//                       <input
//                         type="text"
//                         value={profileData.lastName}
//                         onChange={(e) => handleInputChange('lastName', e.target.value)}
//                         className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
//                         required
//                       />
//                     ) : 
//                     (
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
//                         {profileData.officialDateOfBirth ? formatDateToLongFormat(profileData.officialDateOfBirth) : 'N/A'}
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
//                         {profileData.actualDateOfBirth ? formatDateToLongFormat(profileData.actualDateOfBirth) : 'N/A'}
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
//                         {profileData.dateOfJoining ? formatDateToLongFormat(profileData.dateOfJoining) : 'N/A'}
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
//                       <div>
//                         {profileData.aadharFront ? (
//                           <a
//                             href={profileData.aadharFront}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center space-x-2"
//                           >
//                             <FaFilePdf size={24} className="text-blue-400" />
//                             <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                               Aadhar Front
//                             </p>
//                           </a>
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
//                       <div>
//                         {profileData.aadharBack ? (
//                           <a
//                             href={profileData.aadharBack}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center space-x-2"
//                           >
//                             <FaFilePdf size={24} className="text-blue-400" />
//                             <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                               Aadhar Back
//                             </p>
//                           </a>
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
//                       <div>
//                         {profileData.bankPassbook ? (
//                           <a
//                             href={profileData.bankPassbook}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center space-x-2"
//                           >
//                             <FaFilePdf size={24} className="text-blue-400" />
//                             <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                               Bank Passbook
//                             </p>
//                           </a>
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
//                       <div>
//                         {profileData.panCard ? (
//                           <a
//                             href={profileData.panCard}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center space-x-2"
//                           >
//                             <FaFilePdf size={24} className="text-blue-400" />
//                             <p className="text-gray-500 text-sm sm:text-base truncate max-w-[200px]">
//                               PAN Card
//                             </p>
//                           </a>
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
//                         {profileData.hireDate ? formatDateToLongFormat(profileData.hireDate) : 'N/A'}
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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';

// Helper function to handle object rendering (e.g., for siblings)
const renderObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj || 'N/A';
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
};

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
  emergencyContact: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  accountNumber: Yup.string()
    .matches(/^\d{9,18}$/, 'Account number should be 9-18 digits'),
  ifscCode: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'IFSC code should be 11 characters (4 letters, 0, 6 alphanumeric)'),
});

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

  const BASE_URL = "https://task-manager-backend-xs5s.onrender.com/api";

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

  const updateProfile = async (values) => {
    setLoading(true);
    setError('');
    const dataToSend = new FormData();
    
    Object.entries(values).forEach(([key, value]) => {
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
        dataToSend.append(key, value);
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
      // Update local state with the form values instead of refetching
      setProfileData(values);
    } catch (err) {
      setError(err.message || "Failed to update profile");
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (field, setFieldValue) => (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 20 * 1024 * 1024) {
        setError('File size exceeds 20MB limit');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setFieldValue(field, file);
    } else {
      setError('Please upload a valid PDF file');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleImageUpload = (setFieldValue) => (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 20 * 1024 * 1024) {
        setError('Image size exceeds 20MB limit');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setFieldValue('profileImage', file);
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

  const handleDrop = (field, setFieldValue) => (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 20 * 1024 * 1024) {
        setError('File size exceeds 20MB limit');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setFieldValue(field, file);
    } else {
      setError('Please drop a valid PDF file');
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

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
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : isEditing ? (
                    <FaEdit size={20} />
                  ) : (
                    <FaEdit size={20} />
                  )}
                  <span>{loading ? 'Processing...' : isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
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
                              <a
                                href={values.profileImage instanceof File ? URL.createObjectURL(values.profileImage) : values.profileImage}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={values.profileImage instanceof File ? URL.createObjectURL(values.profileImage) : values.profileImage}
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
                            Date of Joining
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
                        
                        {/* File Upload Fields */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Aadhar Card (Front)
                          </label>
                          {isEditing ? (
                            <div
                              className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop('aadharFront', setFieldValue)}
                            >
                              {values.aadharFront ? (
                                <div className="text-center">
                                  <p className="text-sm truncate max-w-[200px]">{values.aadharFront.name || 'Aadhar Front'}</p>
                                  <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                    onClick={() => setFieldValue('aadharFront', null)}
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
                                onChange={handleFileUpload('aadharFront', setFieldValue)}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          ) : (
                            <div>
                              {values.aadharFront ? (
                                <a
                                  href={values.aadharFront}
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
                              onDrop={handleDrop('aadharBack', setFieldValue)}
                            >
                              {values.aadharBack ? (
                                <div className="text-center">
                                  <p className="text-sm truncate max-w-[200px]">{values.aadharBack.name || 'Aadhar Back'}</p>
                                  <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                    onClick={() => setFieldValue('aadharBack', null)}
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
                                onChange={handleFileUpload('aadharBack', setFieldValue)}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          ) : (
                            <div>
                              {values.aadharBack ? (
                                <a
                                  href={values.aadharBack}
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
                              rows={3}
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
                              rows={3}
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

                        {/* Bank File Uploads */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Bank Passbook (PDF)
                          </label>
                          {isEditing ? (
                            <div
                              className="relative w-full h-32 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 transition-colors"
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop('bankPassbook', setFieldValue)}
                            >
                              {values.bankPassbook ? (
                                <div className="text-center">
                                  <p className="text-sm truncate max-w-[200px]">{values.bankPassbook.name || 'Bank Passbook'}</p>
                                  <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                    onClick={() => setFieldValue('bankPassbook', null)}
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
                                onChange={handleFileUpload('bankPassbook', setFieldValue)}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          ) : (
                            <div>
                              {values.bankPassbook ? (
                                <a
                                  href={values.bankPassbook}
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
                              onDrop={handleDrop('panCard', setFieldValue)}
                            >
                              {values.panCard ? (
                                <div className="text-center">
                                  <p className="text-sm truncate max-w-[200px]">{values.panCard.name || 'PAN Card'}</p>
                                  <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                    onClick={() => setFieldValue('panCard', null)}
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
                                onChange={handleFileUpload('panCard', setFieldValue)}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          ) : (
                            <div>
                              {values.panCard ? (
                                <a
                                  href={values.panCard}
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
                                type="tel"
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
                                type="tel"
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
                                type="tel"
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
                              rows={3}
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
                            Medical Insurance
                          </label>
                          {isEditing ? (
                            <Field
                              name="hasMedicalInsurance"
                              as="select"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            >
                              <option value="">Select</option>
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </Field>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.hasMedicalInsurance ? 'Yes' : values.hasMedicalInsurance === false ? 'No' : 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Emergency Contact
                          </label>
                          {isEditing ? (
                            <div>
                              <Field
                                name="emergencyContact"
                                type="tel"
                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                                placeholder="1234567890"
                              />
                              <ErrorMessage name="emergencyContact" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.emergencyContact || 'N/A'}
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
                            Employee ID
                          </label>
                          {isEditing ? (
                            <Field
                              name="employeeId"
                              type="text"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {values.employeeId || 'N/A'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Hire Date
                          </label>
                          {isEditing ? (
                            <Field
                              name="hireDate"
                              type="date"
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-50 text-gray-700"
                            />
                          ) : (
                            <p className="text-gray-500 text-sm sm:text-base">
                              {formatDate(values.hireDate)}
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
                          <span>{loading ? 'Processing...' : 'Save Changes'}</span>
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

export default ProfilePage;
