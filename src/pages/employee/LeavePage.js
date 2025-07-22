

// import React, { useState } from 'react';
// import Header from '../../components/common/Header';
// import Sidebar from '../../components/common/Sidebar';

// // Dummy data for leaves with unique IDs
// const TOTAL_LEAVES = 30;
// const TAKEN_LEAVES = 12;
// const LEAVE_ENTRIES = [
//   {
//     id: 1,
//     name: 'Sick Leave',
//     type: 'Sick',
//     purpose: 'Fever and cold',
//     from: '2025-06-10',
//     to: '2025-06-12',
//     status: 'Approved',
//   },
//   {
//     id: 2,
//     name: 'Vacation',
//     type: 'Vacation',
//     purpose: 'Family trip',
//     from: '2025-05-01',
//     to: '2025-05-05',
//     status: 'Rejected',
//   },
//   {
//     id: 3,
//     name: 'Personal Leave',
//     type: 'Personal',
//     purpose: 'Bank work',
//     from: '2025-04-15',
//     to: '2025-04-15',
//     status: 'Pending',
//   },
//   {
//     id: 4,
//     name: 'Maternity Leave',
//     type: 'Maternity',
//     purpose: 'Child birth',
//     from: '2025-03-01',
//     to: '2025-06-01',
//     status: 'Approved',
//   },
// ];

// // Calculate grade based on leaves taken
// const calculateGrade = (taken, total) => {
//   const percentage = (taken / total) * 100;
//   if (percentage <= 20) return 'A';
//   if (percentage <= 50) return 'B';
//   return 'C';
// };

// const LeavePage = () => {
//   const [formData, setFormData] = useState({
//     leaveType: '',
//     startDate: '',
//     endDate: '',
//     reason: '',
//     file: null,
//   });
//   const [fileName, setFileName] = useState('No file chosen');
//   const [errors, setErrors] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const REMAINING_LEAVES = TOTAL_LEAVES - TAKEN_LEAVES;
//   const GRADE = calculateGrade(TAKEN_LEAVES, TOTAL_LEAVES);

//   // Validation logic
//   const validateForm = () => {
//     let newErrors = {};
//     if (!formData.leaveType) newErrors.leaveType = 'Please select a leave type.';
//     if (!formData.startDate) newErrors.startDate = 'Start date is required.';
//     if (!formData.endDate) newErrors.endDate = 'End date is required.';
//     if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
//       newErrors.endDate = 'End date cannot be before start date.';
//     }
//     if (!formData.reason.trim()) newErrors.reason = 'Please provide a reason.';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: undefined });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFormData({ ...formData, file });
//     setFileName(file ? file.name : 'No file chosen');
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     console.log('Form submitted:', formData);
//     alert('Leave application submitted successfully!');
//     setFormData({
//       leaveType: '',
//       startDate: '',
//       endDate: '',
//       reason: '',
//       file: null,
//     });
//     setFileName('No file chosen');
//     setShowModal(false);
//   };

//   // PDF Export with professional formatting
//   const handlePDFExport = async () => {
//     try {
//       const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm');
//       const doc = new jsPDF();
//       const pageWidth = doc.internal.pageSize.width;
//       const margin = 20;
//       const lineHeight = 7;
//       let yPosition = 20;

//       doc.setFontSize(20);
//       doc.setFont(undefined, 'bold');
//       doc.text('Leave Management Report', pageWidth / 2, yPosition, { align: 'center' });
//       yPosition += 15;

//       doc.setFontSize(10);
//       doc.setFont(undefined, 'normal');
//       doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
//       yPosition += 15;

//       doc.setFontSize(14);
//       doc.setFont(undefined, 'bold');
//       doc.text('Leave Summary', margin, yPosition);
//       yPosition += 10;

//       doc.setFontSize(10);
//       doc.setFont(undefined, 'normal');
//       doc.text(`Total Leaves: ${TOTAL_LEAVES}`, margin, yPosition);
//       yPosition += lineHeight;
//       doc.text(`Taken Leaves: ${TAKEN_LEAVES}`, margin, yPosition);
//       yPosition += lineHeight;
//       doc.text(`Remaining Leaves: ${REMAINING_LEAVES}`, margin, yPosition);
//       yPosition += lineHeight;
//       doc.text(`Employee Grade: ${GRADE}`, margin, yPosition);
//       yPosition += 15;

//       doc.setFontSize(14);
//       doc.setFont(undefined, 'bold');
//       doc.text('Leave Records', margin, yPosition);
//       yPosition += 10;

//       doc.setFontSize(9);
//       doc.setFont(undefined, 'bold');
//       const headers = ['S.No', 'Leave Name', 'Type', 'Purpose', 'From Date', 'To Date', 'Status'];
//       const colWidths = [15, 30, 25, 40, 25, 25, 20];
//       let xPosition = margin;

//       headers.forEach((header, index) => {
//         doc.text(header, xPosition, yPosition);
//         xPosition += colWidths[index];
//       });
//       yPosition += 8;

//       doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
//       yPosition += 3;

//       doc.setFont(undefined, 'normal');
//       filteredLeaves.forEach((entry, idx) => {
//         if (yPosition > 270) {
//           doc.addPage();
//           yPosition = 20;
//         }
//         xPosition = margin;
//         const rowData = [
//           (idx + 1).toString(),
//           entry.name,
//           entry.type,
//           entry.purpose,
//           entry.from,
//           entry.to,
//           entry.status,
//         ];
//         rowData.forEach((data, index) => {
//           const text = doc.splitTextToSize(data, colWidths[index] - 2);
//           doc.text(text, xPosition, yPosition);
//           xPosition += colWidths[index];
//         });
//         yPosition += lineHeight;
//       });

//       const totalPages = doc.internal.getNumberOfPages();
//       for (let i = 1; i <= totalPages; i++) {
//         doc.setPage(i);
//         doc.setFontSize(8);
//         doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, doc.internal.pageSize.height - 10, { align: 'right' });
//       }

//       doc.save('leave_records.pdf');
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('Error generating PDF. Please try again.');
//     }
//   };

//   // Excel Export with formatting
//   const handleExcelExport = async () => {
//     try {
//       const XLSX = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
//       const summaryData = [
//         ['Leave Management Report'],
//         ['Generated on:', new Date().toLocaleDateString()],
//         [''],
//         ['Leave Summary'],
//         ['Total Leaves:', TOTAL_LEAVES],
//         ['Taken Leaves:', TAKEN_LEAVES],
//         ['Remaining Leaves:', REMAINING_LEAVES],
//         ['Employee Grade:', GRADE],
//         [''],
//         ['Leave Records'],
//       ];

//       const tableHeaders = [
//         ['S.No', 'Leave Name', 'Leave Type', 'Purpose', 'From Date', 'To Date', 'Status'],
//       ];

//       const tableData = filteredLeaves.map((entry, idx) => [
//         idx + 1,
//         entry.name,
//         entry.type,
//         entry.purpose,
//         entry.from,
//         entry.to,
//         entry.status,
//       ]);

//       const allData = [...summaryData, ...tableHeaders, ...tableData];
//       const worksheet = XLSX.utils.aoa_to_sheet(allData);

//       const colWidths = [
//         { wch: 8 },
//         { wch: 20 },
//         { wch: 15 },
//         { wch: 25 },
//         { wch: 12 },
//         { wch: 12 },
//         { wch: 10 },
//       ];
//       worksheet['!cols'] = colWidths;

//       const headerRowIndex = 10;
//       const range = XLSX.utils.decode_range(worksheet['!ref']);
//       for (let col = range.s.c; col <= range.e.c; col++) {
//         const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c: col });
//         if (!worksheet[cellRef]) continue;
//         worksheet[cellRef].s = {
//           font: { bold: true },
//           fill: { fgColor: { rgb: "EEEEEE" } },
//           border: {
//             top: { style: "thin" },
//             bottom: { style: "thin" },
//             left: { style: "thin" },
//             right: { style: "thin" }
//           }
//         };
//       }

//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave Records');
//       XLSX.writeFile(workbook, 'leave_records.xlsx');
//     } catch (error) {
//       console.error('Error generating Excel:', error);
//       alert('Error generating Excel file. Please try again.');
//     }
//   };

//   // Filtered table data
//   const filteredLeaves = LEAVE_ENTRIES.filter(
//     (entry) =>
//       (entry.name.toLowerCase().includes(search.toLowerCase()) ||
//         entry.type.toLowerCase().includes(search.toLowerCase()) ||
//         entry.purpose.toLowerCase().includes(search.toLowerCase())) &&
//       (statusFilter ? entry.status === statusFilter : true)
//   );

//   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="flex-1 flex flex-col">
//         <Header isLoggedIn={true} onToggleSidebar={toggleSidebar} />
//         <main className="p-4 sm:p-6 flex-1 overflow-auto">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
//             <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-blue-100 to-blue-200">
//               <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">Total Leaves</span>
//               <span className="text-xl sm:text-2xl font-bold text-blue-800">{TOTAL_LEAVES}</span>
//             </div>
//             <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-red-100 to-red-200">
//               <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">Taken Leaves</span>
//               <span className="text-xl sm:text-2xl font-bold text-red-800">{TAKEN_LEAVES}</span>
//             </div>
//             <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-green-100 to-green-200">
//               <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">Remaining</span>
//               <span className="text-xl sm:text-2xl font-bold text-green-800">{REMAINING_LEAVES}</span>
//             </div>
//             <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-purple-100 to-purple-200">
//               <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">Grade</span>
//               <span className="text-xl sm:text-2xl font-bold text-purple-800">{GRADE}</span>
//             </div>
//           </div>

//           {/* Filters and Actions */}
//           <div className="bg-white rounded-lg shadow-sm border border-blue-100 mb-6">
//             <div className="p-4 space-y-4">
//               {/* Search and Filter Row */}
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <input
//                   type="text"
//                   placeholder="Search by name, type, or purpose"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="flex-1 border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                 />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent sm:w-40"
//                 >
//                   <option value="">All Status</option>
//                   <option value="Approved">Approved</option>
//                   <option value="Rejected">Rejected</option>
//                   <option value="Pending">Pending</option>
//                 </select>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   onClick={handlePDFExport}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
//                 >
//                   PDF
//                 </button>
//                 <button
//                   onClick={handleExcelExport}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
//                 >
//                   Excel
//                 </button>
//                 <button
//                   onClick={() => window.print()}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
//                 >
//                   Print
//                 </button>
//                 <button
//                   onClick={() => setShowModal(true)}
//                   className="bg-blue-700 hover:bg-blue-800 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors ml-auto"
//                 >
//                   Apply Leave
//                 </button>
//               </div>
//             </div>

//             {/* Table - Desktop View */}
//             <div className="hidden md:block">
//               <div className="overflow-x-auto max-h-96">
//                 <table className="w-full text-sm text-blue-900">
//                   <thead className="bg-blue-50 sticky top-0 z-10">
//                     <tr>
//                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">S.No</th>
//                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Leave Name</th>
//                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Type</th>
//                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Purpose</th>
//                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">From</th>
//                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">To</th>
//                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-blue-100">
//                     {filteredLeaves.length === 0 ? (
//                       <tr>
//                         <td colSpan={7} className="text-center py-8 text-blue-400">
//                           No records found.
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredLeaves.map((entry, idx) => (
//                         <tr key={entry.id} className="hover:bg-blue-50 transition-colors">
//                           <td className="px-4 py-3 whitespace-nowrap">{idx + 1}</td>
//                           <td className="px-4 py-3 font-medium">{entry.name}</td>
//                           <td className="px-4 py-3">{entry.type}</td>
//                           <td className="px-4 py-3">{entry.purpose}</td>
//                           <td className="px-4 py-3 whitespace-nowrap">{entry.from}</td>
//                           <td className="px-4 py-3 whitespace-nowrap">{entry.to}</td>
//                           <td className="px-4 py-3">
//                             <span
//                               className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
//                                 ${entry.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                                   entry.status === 'Rejected' ? 'bg-red-100 text-red-800' :
//                                   'bg-yellow-100 text-yellow-800'}
//                               `}
//                             >
//                               {entry.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Card View - Mobile */}
//             <div className="md:hidden p-4 space-y-3">
//               {filteredLeaves.length === 0 ? (
//                 <div className="text-center py-8 text-blue-400">
//                   No records found.
//                 </div>
//               ) : (
//                 filteredLeaves.map((entry, idx) => (
//                   <div key={entry.id} className="bg-blue-50 rounded-lg p-4 space-y-2">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-semibold text-blue-900">{entry.name}</h3>
//                         <p className="text-sm text-blue-700">{entry.type}</p>
//                       </div>
//                       <span
//                         className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
//                           ${entry.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                             entry.status === 'Rejected' ? 'bg-red-100 text-red-800' :
//                             'bg-yellow-100 text-yellow-800'}
//                         `}
//                       >
//                         {entry.status}
//                       </span>
//                     </div>
//                     <p className="text-sm text-blue-800">{entry.purpose}</p>
//                     <div className="flex justify-between text-xs text-blue-500">
//                       <span>From: {entry.from}</span>
//                       <span>To: {entry.to}</span>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Modal for Apply Leave */}
//           {showModal && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md p-4">
//               <div className="relative w-full max-w-lg bg-white bg-opacity-90 rounded-lg shadow-xl border border-blue-100 max-h-[90vh] overflow-y-auto">
//                 <div className="sticky top-0 bg-blue-50 p-4 sm:p-6 border-b border-blue-100 rounded-t-lg">
//                   <div className="flex justify-between items-center">
//                     <h2 className="text-lg sm:text-xl font-bold text-blue-800">Apply for Leave</h2>
//                     <button
//                       className="text-blue-400 hover:text-red-500 text-2xl font-bold transition-colors"
//                       onClick={() => setShowModal(false)}
//                       aria-label="Close"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="p-4 sm:p-6 space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-blue-800 mb-1">Leave Type *</label>
//                     <select
//                       name="leaveType"
//                       value={formData.leaveType}
//                       onChange={handleInputChange}
//                       className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.leaveType ? 'border-red-500' : 'border-blue-200'}`}
//                     >
//                       <option value="">Select Leave Type</option>
//                       <option value="sick">Sick Leave</option>
//                       <option value="vacation">Vacation Leave</option>
//                       <option value="personal">Personal Leave</option>
//                       <option value="maternity">Maternity/Paternity Leave</option>
//                     </select>
//                     {errors.leaveType && <p className="text-red-500 text-xs mt-1">{errors.leaveType}</p>}
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-blue-800 mb-1">Start Date *</label>
//                       <input
//                         type="date"
//                         name="startDate"
//                         value={formData.startDate}
//                         onChange={handleInputChange}
//                         className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.startDate ? 'border-red-500' : 'border-blue-200'}`}
//                       />
//                       {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-blue-800 mb-1">End Date *</label>
//                       <input
//                         type="date"
//                         name="endDate"
//                         value={formData.endDate}
//                         onChange={handleInputChange}
//                         className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.endDate ? 'border-red-500' : 'border-blue-200'}`}
//                       />
//                       {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-blue-800 mb-1">Reason *</label>
//                     <textarea
//                       name="reason"
//                       value={formData.reason}
//                       onChange={handleInputChange}
//                       className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none ${errors.reason ? 'border-red-500' : 'border-blue-200'}`}
//                       rows="4"
//                       placeholder="Enter the reason for your leave"
//                     ></textarea>
//                     {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-blue-800 mb-1">
//                       Upload File <span className="text-xs text-red-500">(Optional)</span>
//                     </label>
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//                       <input
//                         type="file"
//                         onChange={handleFileChange}
//                         className="hidden"
//                         id="file-upload"
//                         accept=".pdf,.doc,.docx"
//                       />
//                       <label
//                         htmlFor="file-upload"
//                         className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
//                       >
//                         Choose File
//                       </label>
//                       <span className="text-sm text-blue-700 break-all">{fileName}</span>
//                     </div>
//                   </div>

//                   <div className="pt-4">
//                     <button
//                       type="submit"
//                       onClick={handleSubmit}
//                       className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 text-sm font-semibold transition-colors"
//                     >
//                       Submit Application
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default LeavePage;

  // import React, { useState } from 'react';
  // import Header from '../../components/common/Header';
  // import Sidebar from '../../components/common/Sidebar';

  // // Dummy data for leaves with unique IDs
  // const TOTAL_LEAVES = 30;
  // const TAKEN_LEAVES = 12;
  // const LEAVE_ENTRIES = [
  //   {
  //     id: 1,
  //     name: 'Sick Leave',
  //     type: 'Sick',
  //     purpose: 'Fever and cold',
  //     from: '2025-06-10',
  //     to: '2025-06-12',
  //     status: 'Approved',
  //   },
  //   {
  //     id: 2,
  //     name: 'Vacation',
  //     type: 'Vacation',
  //     purpose: 'Family trip',
  //     from: '2025-05-01',
  //     to: '2025-05-05',
  //     status: 'Rejected',
  //   },
  //   {
  //     id: 3,
  //     name: 'Personal Leave',
  //     type: 'Personal',
  //     purpose: 'Bank work',
  //     from: '2025-04-15',
  //     to: '2025-04-15',
  //     status: 'Pending',
  //   },
  //   {
  //     id: 4,
  //     name: 'Maternity Leave',
  //     type: 'Maternity',
  //     purpose: 'Child birth',
  //     from: '2025-03-01',
  //     to: '2025-06-01',
  //     status: 'Approved',
  //   },
  // ];

  // // Dummy data for upcoming public holidays
  // const UPCOMING_PUBLIC_LEAVES = [
  //   { name: 'Independence Day', date: '2025-08-15' },
  //   { name: 'Gandhi Jayanti', date: '2025-10-02' },
  //   { name: 'Diwali', date: '2025-10-20' },
  //   { name: 'Christmas', date: '2025-12-25' },
  //   { name: 'Republic Day', date: '2026-01-26' },
  // ];

  // // Calculate grade based on leaves taken
  // const calculateGrade = (taken, total) => {
  //   const percentage = (taken / total) * 100;
  //   if (percentage <= 20) return 'A';
  //   if (percentage <= 50) return 'B';
  //   return 'C';
  // };

  // const LeavePage = () => {
  //   const [formData, setFormData] = useState({
  //     leaveType: '',
  //     startDate: '',
  //     endDate: '',
  //     reason: '',
  //     file: null,
  //   });
  //   const [fileName, setFileName] = useState('No file chosen');
  //   const [errors, setErrors] = useState({});
  //   const [showModal, setShowModal] = useState(false);
  //   const [search, setSearch] = useState('');
  //   const [statusFilter, setStatusFilter] = useState('');
  //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //   const [showAllPublicLeaves, setShowAllPublicLeaves] = useState(false);

  //   const REMAINING_LEAVES = TOTAL_LEAVES - TAKEN_LEAVES;
  //   const GRADE = calculateGrade(TAKEN_LEAVES, TOTAL_LEAVES);

  //   // Validation logic
  //   const validateForm = () => {
  //     let newErrors = {};
  //     if (!formData.leaveType) newErrors.leaveType = 'Please select a leave type.';
  //     if (!formData.startDate) newErrors.startDate = 'Start date is required.';
  //     if (!formData.endDate) newErrors.endDate = 'End date is required.';
  //     if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
  //       newErrors.endDate = 'End date cannot be before start date.';
  //     }
  //     if (!formData.reason.trim()) newErrors.reason = 'Please provide a reason.';
  //     setErrors(newErrors);
  //     return Object.keys(newErrors).length === 0;
  //   };

  //   const handleInputChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({ ...formData, [name]: value });
  //     setErrors({ ...errors, [name]: undefined });
  //   };

  //   const handleFileChange = (e) => {
  //     const file = e.target.files[0];
  //     setFormData({ ...formData, file });
  //     setFileName(file ? file.name : 'No file chosen');
  //   };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     if (!validateForm()) return;
  //     console.log('Form submitted:', formData);
  //     alert('Leave application submitted successfully!');
  //     setFormData({
  //       leaveType: '',
  //       startDate: '',
  //       endDate: '',
  //       reason: '',
  //       file: null,
  //     });
  //     setFileName('No file chosen');
  //     setShowModal(false);
  //   };

  //   // PDF Export with professional formatting
  //   const handlePDFExport = async () => {
  //     try {
  //       const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm');
  //       const doc = new jsPDF();
  //       const pageWidth = doc.internal.pageSize.width;
  //       const margin = 20;
  //       const lineHeight = 7;
  //       let yPosition = 20;

  //       doc.setFontSize(20);
  //       doc.setFont(undefined, 'bold');
  //       doc.text('Leave Management Report', pageWidth / 2, yPosition, { align: 'center' });
  //       yPosition += 15;

  //       doc.setFontSize(10);
  //       doc.setFont(undefined, 'normal');
  //       doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  //       yPosition += 15;

  //       doc.setFontSize(14);
  //       doc.setFont(undefined, 'bold');
  //       doc.text('Leave Summary', margin, yPosition);
  //       yPosition += 10;

  //       doc.setFontSize(10);
  //       doc.setFont(undefined, 'normal');
  //       doc.text(`Total Leaves: ${TOTAL_LEAVES}`, margin, yPosition);
  //       yPosition += lineHeight;
  //       doc.text(`Taken Leaves: ${TAKEN_LEAVES}`, margin, yPosition);
  //       yPosition += lineHeight;
  //       doc.text(`Remaining Leaves: ${REMAINING_LEAVES}`, margin, yPosition);
  //       yPosition += lineHeight;
  //       doc.text(`Employee Grade: ${GRADE}`, margin, yPosition);
  //       yPosition += 15;

  //       doc.setFontSize(14);
  //       doc.setFont(undefined, 'bold');
  //       doc.text('Leave Records', margin, yPosition);
  //       yPosition += 10;

  //       doc.setFontSize(9);
  //       doc.setFont(undefined, 'bold');
  //       const headers = ['S.No', 'Leave Name', 'Type', 'Purpose', 'From Date', 'To Date', 'Status'];
  //       const colWidths = [15, 30, 25, 40, 25, 25, 20];
  //       let xPosition = margin;

  //       headers.forEach((header, index) => {
  //         doc.text(header, xPosition, yPosition);
  //         xPosition += colWidths[index];
  //       });
  //       yPosition += 8;

  //       doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
  //       yPosition += 3;

  //       doc.setFont(undefined, 'normal');
  //       filteredLeaves.forEach((entry, idx) => {
  //         if (yPosition > 270) {
  //           doc.addPage();
  //           yPosition = 20;
  //         }
  //         xPosition = margin;
  //         const rowData = [
  //           (idx + 1).toString(),
  //           entry.name,
  //           entry.type,
  //           entry.purpose,
  //           entry.from,
  //           entry.to,
  //           entry.status,
  //         ];
  //         rowData.forEach((data, index) => {
  //           const text = doc.splitTextToSize(data, colWidths[index] - 2);
  //           doc.text(text, xPosition, yPosition);
  //           xPosition += colWidths[index];
  //         });
  //         yPosition += lineHeight;
  //       });

  //       const totalPages = doc.internal.getNumberOfPages();
  //       for (let i = 1; i <= totalPages; i++) {
  //         doc.setPage(i);
  //         doc.setFontSize(8);
  //         doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, doc.internal.pageSize.height - 10, { align: 'right' });
  //       }

  //       doc.save('leave_records.pdf');
  //     } catch (error) {
  //       console.error('Error generating PDF:', error);
  //       alert('Error generating PDF. Please try again.');
  //     }
  //   };

  //   // Excel Export with formatting
  //   const handleExcelExport = async () => {
  //     try {
  //       const XLSX = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
  //       const summaryData = [
  //         ['Leave Management Report'],
  //         ['Generated on:', new Date().toLocaleDateString()],
  //         [''],
  //         ['Leave Summary'],
  //         ['Total Leaves:', TOTAL_LEAVES],
  //         ['Taken Leaves:', TAKEN_LEAVES],
  //         ['Remaining Leaves:', REMAINING_LEAVES],
  //         ['Employee Grade:', GRADE],
  //         [''],
  //         ['Leave Records'],
  //       ];

  //       const tableHeaders = [
  //         ['S.No', 'Leave Name', 'Leave Type', 'Purpose', 'From Date', 'To Date', 'Status'],
  //       ];

  //       const tableData = filteredLeaves.map((entry, idx) => [
  //         idx + 1,
  //         entry.name,
  //         entry.type,
  //         entry.purpose,
  //         entry.from,
  //         entry.to,
  //         entry.status,
  //       ]);

  //       const allData = [...summaryData, ...tableHeaders, ...tableData];
  //       const worksheet = XLSX.utils.aoa_to_sheet(allData);

  //       const colWidths = [
  //         { wch: 8 },
  //         { wch: 20 },
  //         { wch: 15 },
  //         { wch: 25 },
  //         { wch: 12 },
  //         { wch: 12 },
  //         { wch: 10 },
  //       ];
  //       worksheet['!cols'] = colWidths;

  //       const headerRowIndex = 10;
  //       const range = XLSX.utils.decode_range(worksheet['!ref']);
  //       for (let col = range.s.c; col <= range.e.c; col++) {
  //         const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c: col });
  //         if (!worksheet[cellRef]) continue;
  //         worksheet[cellRef].s = {
  //           font: { bold: true },
  //           fill: { fgColor: { rgb: "EEEEEE" } },
  //           border: {
  //             top: { style: "thin" },
  //             bottom: { style: "thin" },
  //             left: { style: "thin" },
  //             right: { style: "thin" }
  //           }
  //         };
  //       }

  //       const workbook = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave Records');
  //       XLSX.writeFile(workbook, 'leave_records.xlsx');
  //     } catch (error) {
  //       console.error('Error generating Excel:', error);
  //       alert('Error generating Excel file. Please try again.');
  //     }
  //   };

  //   // Filtered table data
  //   const filteredLeaves = LEAVE_ENTRIES.filter(
  //     (entry) =>
  //       (entry.name.toLowerCase().includes(search.toLowerCase()) ||
  //         entry.type.toLowerCase().includes(search.toLowerCase()) ||
  //         entry.purpose.toLowerCase().includes(search.toLowerCase())) &&
  //       (statusFilter ? entry.status === statusFilter : true)
  //   );

  //   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  //   // Helper for formatted date
  //   const formatDate = (dateStr) => {
  //     const date = new Date(dateStr);
  //     return date.toLocaleDateString('en-IN', {
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric',
  //       weekday: 'long',
  //       timeZone: 'Asia/Kolkata',
  //     });
  //   };

  //   return (
  //     <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
  //       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
  //       <div className="flex-1 flex flex-col">
  //         <Header isLoggedIn={true} onToggleSidebar={toggleSidebar} />
  //         <main className="p-4 sm:p-6 flex-1 overflow-auto">
  //           {/* Stats Cards */}
  //           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
  //             <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-blue-100 to-blue-200">
  //               <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">Total Leaves</span>
  //               <span className="text-xl sm:text-2xl font-bold text-blue-800">{TOTAL_LEAVES}</span>
  //             </div>
  //             <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-red-100 to-red-200">
  //               <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">Taken Leaves</span>
  //               <span className="text-xl sm:text-2xl font-bold text-red-800">{TAKEN_LEAVES}</span>
  //             </div>
  //             <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-green-100 to-green-200">
  //               <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">Remaining</span>
  //               <span className="text-xl sm:text-2xl font-bold text-green-800">{REMAINING_LEAVES}</span>
  //             </div>
  //             {/* Upcoming Public Leaves Card */}
  //             <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-purple-100 to-purple-200 w-full">
  //               <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">
  //                 Upcoming Public Leaves
  //               </span>
  //               <div className="w-full">
  //                 {(showAllPublicLeaves ? UPCOMING_PUBLIC_LEAVES : UPCOMING_PUBLIC_LEAVES.slice(0, 1)).map((leave, idx) => (
  //                   <div key={idx} className="text-xs text-blue-700 text-center mb-1">
  //                     <span className="font-semibold">{leave.name}</span> - {formatDate(leave.date)}
  //                   </div>
  //                 ))}
  //                 {UPCOMING_PUBLIC_LEAVES.length > 1 && (
  //                   <button
  //                     onClick={() => setShowAllPublicLeaves((prev) => !prev)}
  //                     className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors w-full"
  //                   >
  //                     {showAllPublicLeaves ? "Show Less" : "Show All"}
  //                   </button>
  //                 )}
  //               </div>
  //             </div>
  //           </div>

  //           {/* Filters and Actions */}
  //           <div className="bg-white rounded-lg shadow-sm border border-blue-100 mb-6">
  //             <div className="p-4 space-y-4">
  //               {/* Search and Filter Row */}
  //               <div className="flex flex-col sm:flex-row gap-3">
  //                 <input
  //                   type="text"
  //                   placeholder="Search by name, type, or purpose"
  //                   value={search}
  //                   onChange={(e) => setSearch(e.target.value)}
  //                   className="flex-1 border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
  //                 />
  //                 <select
  //                   value={statusFilter}
  //                   onChange={(e) => setStatusFilter(e.target.value)}
  //                   className="border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent sm:w-40"
  //                 >
  //                   <option value="">All Status</option>
  //                   <option value="Approved">Approved</option>
  //                   <option value="Rejected">Rejected</option>
  //                   <option value="Pending">Pending</option>
  //                 </select>
  //               </div>

  //               {/* Action Buttons */}
  //               <div className="flex flex-wrap gap-2">
  //                 <button
  //                   onClick={handlePDFExport}
  //                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
  //                 >
  //                   PDF
  //                 </button>
  //                 <button
  //                   onClick={handleExcelExport}
  //                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
  //                 >
  //                   Excel
  //                 </button>
  //                 <button
  //                   onClick={() => window.print()}
  //                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
  //                 >
  //                   Print
  //                 </button>
  //                 <button
  //                   onClick={() => setShowModal(true)}
  //                   className="bg-blue-700 hover:bg-blue-800 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors ml-auto"
  //                 >
  //                   Apply Leave
  //                 </button>
  //               </div>
  //             </div>

  //             {/* Table - Desktop View */}
  //             <div className="hidden md:block">
  //               <div className="overflow-x-auto max-h-96">
  //                 <table className="w-full text-sm text-blue-900">
  //                   <thead className="bg-blue-50 sticky top-0 z-10">
  //                     <tr>
  //                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">S.No</th>
  //                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Leave Name</th>
  //                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Type</th>
  //                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Purpose</th>
  //                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">From</th>
  //                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">To</th>
  //                       <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Status</th>
  //                     </tr>
  //                   </thead>
  //                   <tbody className="bg-white divide-y divide-blue-100">
  //                     {filteredLeaves.length === 0 ? (
  //                       <tr>
  //                         <td colSpan={7} className="text-center py-8 text-blue-400">
  //                           No records found.
  //                         </td>
  //                       </tr>
  //                     ) : (
  //                       filteredLeaves.map((entry, idx) => (
  //                         <tr key={entry.id} className="hover:bg-blue-50 transition-colors">
  //                           <td className="px-4 py-3 whitespace-nowrap">{idx + 1}</td>
  //                           <td className="px-4 py-3 font-medium">{entry.name}</td>
  //                           <td className="px-4 py-3">{entry.type}</td>
  //                           <td className="px-4 py-3">{entry.purpose}</td>
  //                           <td className="px-4 py-3 whitespace-nowrap">{entry.from}</td>
  //                           <td className="px-4 py-3 whitespace-nowrap">{entry.to}</td>
  //                           <td className="px-4 py-3">
  //                             <span
  //                               className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
  //                                 ${entry.status === 'Approved' ? 'bg-green-100 text-green-800' :
  //                                   entry.status === 'Rejected' ? 'bg-red-100 text-red-800' :
  //                                   'bg-yellow-100 text-yellow-800'}
  //                               `}
  //                             >
  //                               {entry.status}
  //                             </span>
  //                           </td>
  //                         </tr>
  //                       ))
  //                     )}
  //                   </tbody>
  //                 </table>
  //               </div>
  //             </div>

  //             {/* Card View - Mobile */}
  //             <div className="md:hidden p-4 space-y-3">
  //               {filteredLeaves.length === 0 ? (
  //                 <div className="text-center py-8 text-blue-400">
  //                   No records found.
  //                 </div>
  //               ) : (
  //                 filteredLeaves.map((entry, idx) => (
  //                   <div key={entry.id} className="bg-blue-50 rounded-lg p-4 space-y-2">
  //                     <div className="flex justify-between items-start">
  //                       <div>
  //                         <h3 className="font-semibold text-blue-900">{entry.name}</h3>
  //                         <p className="text-sm text-blue-700">{entry.type}</p>
  //                       </div>
  //                       <span
  //                         className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
  //                           ${entry.status === 'Approved' ? 'bg-green-100 text-green-800' :
  //                             entry.status === 'Rejected' ? 'bg-red-100 text-red-800' :
  //                             'bg-yellow-100 text-yellow-800'}
  //                         `}
  //                       >
  //                         {entry.status}
  //                       </span>
  //                     </div>
  //                     <p className="text-sm text-blue-800">{entry.purpose}</p>
  //                     <div className="flex justify-between text-xs text-blue-500">
  //                       <span>From: {entry.from}</span>
  //                       <span>To: {entry.to}</span>
  //                     </div>
  //                   </div>
  //                 ))
  //               )}
  //             </div>
  //           </div>

  //           {/* Modal for Apply Leave */}
  //           {showModal && (
  //             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md p-4">
  //               <div className="relative w-full max-w-lg bg-white bg-opacity-90 rounded-lg shadow-xl border border-blue-100 max-h-[90vh] overflow-y-auto">
  //                 <div className="sticky top-0 bg-blue-50 p-4 sm:p-6 border-b border-blue-100 rounded-t-lg">
  //                   <div className="flex justify-between items-center">
  //                     <h2 className="text-lg sm:text-xl font-bold text-blue-800">Apply for Leave</h2>
  //                     <button
  //                       className="text-blue-400 hover:text-red-500 text-2xl font-bold transition-colors"
  //                       onClick={() => setShowModal(false)}
  //                       aria-label="Close"
  //                     >
  //                       ×
  //                     </button>
  //                   </div>
  //                 </div>
                  
  //                 <div className="p-4 sm:p-6 space-y-4">
  //                   <div>
  //                     <label className="block text-sm font-medium text-blue-800 mb-1">Leave Type *</label>
  //                     <select
  //                       name="leaveType"
  //                       value={formData.leaveType}
  //                       onChange={handleInputChange}
  //                       className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.leaveType ? 'border-red-500' : 'border-blue-200'}`}
  //                     >
  //                       <option value="">Select Leave Type</option>
  //                       <option value="sick">Sick Leave</option>
  //                       <option value="vacation">Vacation Leave</option>
  //                       <option value="personal">Personal Leave</option>
  //                       <option value="maternity">Maternity/Paternity Leave</option>
  //                     </select>
  //                     {errors.leaveType && <p className="text-red-500 text-xs mt-1">{errors.leaveType}</p>}
  //                   </div>

  //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //                     <div>
  //                       <label className="block text-sm font-medium text-blue-800 mb-1">Start Date *</label>
  //                       <input
  //                         type="date"
  //                         name="startDate"
  //                         value={formData.startDate}
  //                         onChange={handleInputChange}
  //                         className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.startDate ? 'border-red-500' : 'border-blue-200'}`}
  //                       />
  //                       {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
  //                     </div>
  //                     <div>
  //                       <label className="block text-sm font-medium text-blue-800 mb-1">End Date *</label>
  //                       <input
  //                         type="date"
  //                         name="endDate"
  //                         value={formData.endDate}
  //                         onChange={handleInputChange}
  //                         className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.endDate ? 'border-red-500' : 'border-blue-200'}`}
  //                       />
  //                       {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
  //                     </div>
  //                   </div>

  //                   <div>
  //                     <label className="block text-sm font-medium text-blue-800 mb-1">Reason *</label>
  //                     <textarea
  //                       name="reason"
  //                       value={formData.reason}
  //                       onChange={handleInputChange}
  //                       className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none ${errors.reason ? 'border-red-500' : 'border-blue-200'}`}
  //                       rows="4"
  //                       placeholder="Enter the reason for your leave"
  //                     ></textarea>
  //                     {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
  //                   </div>

  //                   <div>
  //                     <label className="block text-sm font-medium text-blue-800 mb-1">
  //                       Upload File <span className="text-xs text-red-500">(Optional)</span>
  //                     </label>
  //                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
  //                       <input
  //                         type="file"
  //                         onChange={handleFileChange}
  //                         className="hidden"
  //                         id="file-upload"
  //                         accept=".pdf,.doc,.docx"
  //                       />
  //                       <label
  //                         htmlFor="file-upload"
  //                         className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
  //                       >
  //                         Choose File
  //                       </label>
  //                       <span className="text-sm text-blue-700 break-all">{fileName}</span>
  //                     </div>
  //                   </div>

  //                   <div className="pt-4">
  //                     <button
  //                       type="submit"
  //                       onClick={handleSubmit}
  //                       className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 text-sm font-semibold transition-colors"
  //                     >
  //                       Submit Application
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           )}
  //         </main>
  //       </div>
  //     </div>
  //   );
  // };

  // export default LeavePage;


  import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';

// Dummy data for leaves with unique IDs
const TOTAL_LEAVES = 30;
const TAKEN_LEAVES = 12;
const LEAVE_ENTRIES = [
  {
    id: 1,
    name: 'Sick Leave',
    type: 'Sick',
    purpose: 'Fever and cold',
    from: '2025-06-10',
    to: '2025-06-12',
    status: 'Approved',
  },
  {
    id: 2,
    name: 'Vacation',
    type: 'Vacation',
    purpose: 'Family trip',
    from: '2025-05-01',
    to: '2025-05-05',
    status: 'Rejected',
  },
  {
    id: 3,
    name: 'Personal Leave',
    type: 'Personal',
    purpose: 'Bank work',
    from: '2025-04-15',
    to: '2025-04-15',
    status: 'Pending',
  },
  {
    id: 4,
    name: 'Maternity Leave',
    type: 'Maternity',
    purpose: 'Child birth',
    from: '2025-03-01',
    to: '2025-06-01',
    status: 'Approved',
  },
];

// Dummy data for upcoming public holidays
const UPCOMING_PUBLIC_LEAVES = [
  { name: 'Independence Day', date: '2025-08-15' },
  { name: 'Gandhi Jayanti', date: '2025-10-02' },
  { name: 'Diwali', date: '2025-10-20' },
  { name: 'Christmas', date: '2025-12-25' },
  { name: 'Republic Day', date: '2026-01-26' },
];

// Calculate grade based on leaves taken
const calculateGrade = (taken, total) => {
  const percentage = (taken / total) * 100;
  if (percentage <= 20) return 'A';
  if (percentage <= 50) return 'B';
  return 'C';
};

const LeavePage = () => {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    file: null,
  });
  const [fileName, setFileName] = useState('No file chosen');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAllPublicLeaves, setShowAllPublicLeaves] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const REMAINING_LEAVES = TOTAL_LEAVES - TAKEN_LEAVES;
  const GRADE = calculateGrade(TAKEN_LEAVES, TOTAL_LEAVES);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Validation logic
  const validateForm = () => {
    let newErrors = {};
    if (!formData.leaveType) newErrors.leaveType = 'Please select a leave type.';
    if (!formData.startDate) newErrors.startDate = 'Start date is required.';
    if (!formData.endDate) newErrors.endDate = 'End date is required.';
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date cannot be before start date.';
    }
    if (!formData.reason.trim()) newErrors.reason = 'Please provide a reason.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
    setFileName(file ? file.name : 'No file chosen');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fill out all required fields correctly.' });
      return;
    }
    console.log('Form submitted:', formData);
    setMessage({ type: 'success', text: 'Leave application submitted successfully!' });
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      file: null,
    });
    setFileName('No file chosen');
    setErrors({});
  };

  // PDF Export with professional formatting
  const handlePDFExport = async () => {
    try {
      const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const lineHeight = 7;
      let yPosition = 20;

      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('Leave Management Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Leave Summary', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Total Leaves: ${TOTAL_LEAVES}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Taken Leaves: ${TAKEN_LEAVES}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Remaining Leaves: ${REMAINING_LEAVES}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Employee Grade: ${GRADE}`, margin, yPosition);
      yPosition += 15;

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Leave Records', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      const headers = ['S.No', 'Leave Name', 'Type', 'Purpose', 'From Date', 'To Date', 'Status'];
      const colWidths = [15, 30, 25, 40, 25, 25, 20];
      let xPosition = margin;

      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition);
        xPosition += colWidths[index];
      });
      yPosition += 8;

      doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
      yPosition += 3;

      doc.setFont(undefined, 'normal');
      filteredLeaves.forEach((entry, idx) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        xPosition = margin;
        const rowData = [
          (idx + 1).toString(),
          entry.name,
          entry.type,
          entry.purpose,
          entry.from,
          entry.to,
          entry.status,
        ];
        rowData.forEach((data, index) => {
          const text = doc.splitTextToSize(data, colWidths[index] - 2);
          doc.text(text, xPosition, yPosition);
          xPosition += colWidths[index];
        });
        yPosition += lineHeight;
      });

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, doc.internal.pageSize.height - 10, { align: 'right' });
      }

      doc.save('leave_records.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Excel Export with formatting
  const handleExcelExport = async () => {
    try {
      const XLSX = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
      const summaryData = [
        ['Leave Management Report'],
        ['Generated on:', new Date().toLocaleDateString()],
        [''],
        ['Leave Summary'],
        ['Total Leaves:', TOTAL_LEAVES],
        ['Taken Leaves:', TAKEN_LEAVES],
        ['Remaining Leaves:', REMAINING_LEAVES],
        ['Employee Grade:', GRADE],
        [''],
        ['Leave Records'],
      ];

      const tableHeaders = [
        ['S.No', 'Leave Name', 'Leave Type', 'Purpose', 'From Date', 'To Date', 'Status'],
      ];

      const tableData = filteredLeaves.map((entry, idx) => [
        idx + 1,
        entry.name,
        entry.type,
        entry.purpose,
        entry.from,
        entry.to,
        entry.status,
      ]);

      const allData = [...summaryData, ...tableHeaders, ...tableData];
      const worksheet = XLSX.utils.aoa_to_sheet(allData);

      const colWidths = [
        { wch: 8 },
        { wch: 20 },
        { wch: 15 },
        { wch: 25 },
        { wch: 12 },
        { wch: 12 },
        { wch: 10 },
      ];
      worksheet['!cols'] = colWidths;

      const headerRowIndex = 10;
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c: col });
        if (!worksheet[cellRef]) continue;
        worksheet[cellRef].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "EEEEEE" } },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave Records');
      XLSX.writeFile(workbook, 'leave_records.xlsx');
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Error generating Excel file. Please try again.');
    }
  };

  // Filtered table data
  const filteredLeaves = LEAVE_ENTRIES.filter(
    (entry) =>
      (entry.name.toLowerCase().includes(search.toLowerCase()) ||
        entry.type.toLowerCase().includes(search.toLowerCase()) ||
        entry.purpose.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter ? entry.status === statusFilter : true)
  );

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Helper for formatted date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      timeZone: 'Asia/Kolkata',
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header isLoggedIn={true} onToggleSidebar={toggleSidebar} />
        <main className="p-4 sm:p-6 flex-1 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-blue-100 to-blue-200">
              <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">Total Leaves</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-800">{TOTAL_LEAVES}</span>
            </div>
            <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-red-100 to-red-200">
              <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">Taken Leaves</span>
              <span className="text-xl sm:text-2xl font-bold text-red-800">{TAKEN_LEAVES}</span>
            </div>
            <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-green-100 to-green-200">
              <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">Remaining</span>
              <span className="text-xl sm:text-2xl font-bold text-green-800">{REMAINING_LEAVES}</span>
            </div>
            {/* Upcoming Public Leaves Card */}
            <div className="rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 border border-blue-100 bg-gradient-to-br from-purple-100 to-purple-200 w-full">
              <span className="text-black text-xs sm:text-sm font-semibold mb-1 text-center">
                Upcoming Public Leaves
              </span>
              <div className="w-full">
                {(showAllPublicLeaves ? UPCOMING_PUBLIC_LEAVES : UPCOMING_PUBLIC_LEAVES.slice(0, 1)).map((leave, idx) => (
                  <div key={idx} className="text-xs text-blue-700 text-center mb-1">
                    <span className="font-semibold">{leave.name}</span> - {formatDate(leave.date)}
                  </div>
                ))}
                {UPCOMING_PUBLIC_LEAVES.length > 1 && (
                  <button
                    onClick={() => setShowAllPublicLeaves((prev) => !prev)}
                    className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors w-full"
                  >
                    {showAllPublicLeaves ? "Show Less" : "Show All"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 mb-6">
            <div className="p-4 space-y-4">
              {/* Search and Filter Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search by name, type, or purpose"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-blue-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent sm:w-40"
                >
                  <option value="">All Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handlePDFExport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
                >
                  PDF
                </button>
                <button
                  onClick={handleExcelExport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
                >
                  Excel
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
                >
                  Print
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors ml-auto"
                >
                  Apply Leave
                </button>
              </div>
            </div>

            {/* Table - Desktop View */}
            <div className="hidden md:block">
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm text-blue-900">
                  <thead className="bg-blue-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">S.No</th>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Leave Name</th>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Purpose</th>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">From</th>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">To</th>
                      <th className="px-4 py-3 font-semibold text-left text-xs uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-100">
                    {filteredLeaves.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-blue-400">
                          No records found.
                        </td>
                      </tr>
                    ) : (
                      filteredLeaves.map((entry, idx) => (
                        <tr key={entry.id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">{idx + 1}</td>
                          <td className="px-4 py-3 font-medium">{entry.name}</td>
                          <td className="px-4 py-3">{entry.type}</td>
                          <td className="px-4 py-3">{entry.purpose}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{entry.from}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{entry.to}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
                                ${entry.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                  entry.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'}
                              `}
                            >
                              {entry.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card View - Mobile */}
            <div className="md:hidden p-4 space-y-3">
              {filteredLeaves.length === 0 ? (
                <div className="text-center py-8 text-blue-400">
                  No records found.
                </div>
              ) : (
                filteredLeaves.map((entry, idx) => (
                  <div key={entry.id} className="bg-blue-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-blue-900">{entry.name}</h3>
                        <p className="text-sm text-blue-700">{entry.type}</p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
                          ${entry.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            entry.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}
                        `}
                      >
                        {entry.status}
                      </span>
                    </div>
                    <p className="text-sm text-blue-800">{entry.purpose}</p>
                    <div className="flex justify-between text-xs text-blue-500">
                      <span>From: {entry.from}</span>
                      <span>To: {entry.to}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Modal for Apply Leave */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md p-4">
              <div className="relative w-full max-w-lg bg-white bg-opacity-90 rounded-lg shadow-xl border border-blue-100 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-blue-50 p-4 sm:p-6 border-b border-blue-100 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-blue-800">Apply for Leave</h2>
                    <button
                      className="text-blue-400 hover:text-red-500 text-2xl font-bold transition-colors"
                      onClick={() => {
                        setShowModal(false);
                        setMessage({ type: '', text: '' });
                        setErrors({});
                      }}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Leave Type *</label>
                    <select
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.leaveType ? 'border-red-500' : 'border-blue-200'}`}
                    >
                      <option value="">Select Leave Type</option>
                      <option value="sick">Sick Leave</option>
                      <option value="vacation">Vacation Leave</option>
                      <option value="personal">Personal Leave</option>
                      <option value="maternity">Maternity/Paternity Leave</option>
                    </select>
                    {errors.leaveType && <p className="text-red-500 text-xs mt-1">{errors.leaveType}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">Start Date *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.startDate ? 'border-red-500' : 'border-blue-200'}`}
                      />
                      {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">End Date *</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${errors.endDate ? 'border-red-500' : 'border-blue-200'}`}
                      />
                      {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Reason *</label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none ${errors.reason ? 'border-red-500' : 'border-blue-200'}`}
                      rows="4"
                      placeholder="Enter the reason for your leave"
                    ></textarea>
                    {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Upload File <span className="text-xs text-red-500">(Optional)</span>
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                      >
                        Choose File
                      </label>
                      <span className="text-sm text-blue-700 break-all">{fileName}</span>
                    </div>
                  </div>

                  {message.text && (
                    <div
                      className={`p-3 rounded-md text-sm font-medium text-center ${
                        message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 text-sm font-semibold transition-colors"
                    >
                      Submit Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LeavePage;