

// // // // import React, { useState, useRef, useEffect } from 'react';

// // // // // Since you're using react-icons, I'll use those instead of lucide-react
// // // // // You'll need to install these icon packages if not already installed:
// // // // // npm install react-icons

// // // // import { 
// // // //   AiOutlineSearch,
// // // //   AiOutlinePlus,
// // // //   AiOutlineSend,
// // // //   AiOutlinePaperClip,
// // // //   AiOutlineAudio,
// // // //   AiOutlineMore,
// // // //   AiOutlineBell,
// // // //   AiOutlineTeam,
// // // //   AiOutlineSetting,
// // // //   AiOutlineStar,
// // // //   AiOutlineInbox,
// // // //   AiOutlineDelete,
// // // //   AiOutlinePhone,
// // // //   AiOutlineVideoCamera,
// // // //   AiOutlineInfoCircle,
// // // //   AiOutlineSmile,
// // // //   AiOutlinePicture,
// // // //   AiOutlineFile,
// // // //   AiOutlineClose,
// // // //   AiOutlineCheck,
// // // //   AiOutlineSound,
// // // //   AiOutlineDownload,
// // // //   AiOutlinePlayCircle,
// // // //   AiOutlinePauseCircle
// // // // } from 'react-icons/ai';

// // // // import { BiHash, BiAt } from 'react-icons/bi';
// // // // import Sidebar from '../../components/common/Sidebar';
// // // // import Header from '../../components/common/Header';
// // // // const EmployeeChatApp = () => {
// // // //   const [selectedChat, setSelectedChat] = useState(0);
// // // //   const [message, setMessage] = useState('');
// // // //   const [showMentions, setShowMentions] = useState(false);
// // // //   const [mentionSearch, setMentionSearch] = useState('');
// // // //   const [showAddEmployee, setShowAddEmployee] = useState(false);
// // // //   const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
// // // //   const [isRecording, setIsRecording] = useState(false);
// // // //   const [showFileMenu, setShowFileMenu] = useState(false);
// // // //   const [selectedFiles, setSelectedFiles] = useState([]);
// // // //   const [audioPlaying, setAudioPlaying] = useState(null);
// // // //   const fileInputRef = useRef(null);
// // // //   const imageInputRef = useRef(null);
// // // //   const messageInputRef = useRef(null);

// // // //   // Mock data
// // // //   const [employees] = useState([
// // // //     { id: 1, name: 'Simranjeet Singh', email: 'simran@company.com', avatar: 'S', status: 'online' },
// // // //     { id: 2, name: 'Vidhi Tyagi', email: 'vidhi@company.com', avatar: 'V', status: 'away' },
// // // //     { id: 3, name: 'Nitin Bansal', email: 'nitin@company.com', avatar: 'N', status: 'online' },
// // // //     { id: 4, name: 'Khushboo Sharma', email: 'khushboo@company.com', avatar: 'K', status: 'offline' },
// // // //     { id: 5, name: 'Ashutosh Arora', email: 'ashutosh@company.com', avatar: 'A', status: 'online' }
// // // //   ]);

// // // //   const [chats, setChats] = useState([
// // // //     {
// // // //       id: 1,
// // // //       type: 'broadcast',
// // // //       name: 'Company Announcements',
// // // //       lastMessage: 'Welcome to the new quarter! Please review the updated policies.',
// // // //       time: '2 min ago',
// // // //       unread: 1,
// // // //       avatar: '#',
// // // //       participants: [],
// // // //       messages: [
// // // //         {
// // // //           id: 1,
// // // //           sender: 'HR Team',
// // // //           content: 'Welcome to the new quarter! Please review the updated policies.',
// // // //           time: '10:30 AM',
// // // //           type: 'broadcast',
// // // //           files: null
// // // //         }
// // // //       ]
// // // //     },
// // // //     {
// // // //       id: 2,
// // // //       type: 'direct',
// // // //       name: 'Simranjeet Singh',
// // // //       lastMessage: 'Good morning Sir. Kindly go through this for once...',
// // // //       time: '9:58 AM',
// // // //       unread: 0,
// // // //       avatar: 'S',
// // // //       participants: [employees[0]],
// // // //       messages: [
// // // //         {
// // // //           id: 1,
// // // //           sender: 'Simranjeet Singh',
// // // //           content: 'Good morning Sir. Kindly go through this for once, I added a seven procure AI agent in the landing page.',
// // // //           time: '9:58 AM',
// // // //           type: 'message',
// // // //           files: null
// // // //         },
// // // //         {
// // // //           id: 2,
// // // //           sender: 'You',
// // // //           content: 'Thanks for the update! I\'ll review it shortly.',
// // // //           time: '10:02 AM',
// // // //           type: 'message',
// // // //           files: null
// // // //         }
// // // //       ]
// // // //     },
// // // //     {
// // // //       id: 3,
// // // //       type: 'direct',
// // // //       name: 'Vidhi Tyagi',
// // // //       lastMessage: 'https://ip.sevenprocure.com/',
// // // //       time: '9:58 AM',
// // // //       unread: 0,
// // // //       avatar: 'V',
// // // //       participants: [employees[1]],
// // // //       messages: [
// // // //         {
// // // //           id: 1,
// // // //           sender: 'Vidhi Tyagi',
// // // //           content: 'https://ip.sevenprocure.com/',
// // // //           time: '9:58 AM',
// // // //           type: 'message',
// // // //           files: null
// // // //         }
// // // //       ]
// // // //     },
// // // //     {
// // // //       id: 4,
// // // //       type: 'group',
// // // //       name: 'Development Team',
// // // //       lastMessage: 'Let\'s schedule the sprint review for tomorrow',
// // // //       time: 'Yesterday',
// // // //       unread: 3,
// // // //       avatar: 'D',
// // // //       participants: [employees[0], employees[1], employees[2]],
// // // //       messages: [
// // // //         {
// // // //           id: 1,
// // // //           sender: 'Nitin Bansal',
// // // //           content: 'Let\'s schedule the sprint review for tomorrow',
// // // //           time: 'Yesterday 4:30 PM',
// // // //           type: 'message',
// // // //           files: null
// // // //         },
// // // //         {
// // // //           id: 2,
// // // //           sender: 'Simranjeet Singh',
// // // //           content: 'Sounds good! What time works for everyone?',
// // // //           time: 'Yesterday 4:35 PM',
// // // //           type: 'message',
// // // //           files: null
// // // //         },
// // // //         {
// // // //           id: 3,
// // // //           sender: 'You',
// // // //           content: 'I can do 2 PM or 4 PM',
// // // //           time: 'Yesterday 4:40 PM',
// // // //           type: 'message',
// // // //           files: null
// // // //         }
// // // //       ]
// // // //     }
// // // //   ]);

// // // //   const currentChat = chats[selectedChat];

// // // //   const handleSendMessage = () => {
// // // //     if (message.trim() || selectedFiles.length > 0) {
// // // //       const newMessage = {
// // // //         id: Date.now(),
// // // //         sender: 'You',
// // // //         content: message.trim(),
// // // //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// // // //         type: 'message',
// // // //         files: selectedFiles.length > 0 ? [...selectedFiles] : null
// // // //       };

// // // //       setChats(prev => prev.map((chat, index) => 
// // // //         index === selectedChat 
// // // //           ? { 
// // // //               ...chat, 
// // // //               messages: [...chat.messages, newMessage],
// // // //               lastMessage: message.trim() || 'File shared',
// // // //               time: 'now'
// // // //             }
// // // //           : chat
// // // //       ));

// // // //       setMessage('');
// // // //       setSelectedFiles([]);
// // // //     }
// // // //   };

// // // //   const handleKeyPress = (e) => {
// // // //     if (e.key === 'Enter' && !e.shiftKey) {
// // // //       e.preventDefault();
// // // //       handleSendMessage();
// // // //     }
// // // //   };

// // // //   const handleMention = (employee) => {
// // // //     const newMessage = message.replace(`@${mentionSearch}`, `@${employee.name} `);
// // // //     setMessage(newMessage);
// // // //     setShowMentions(false);
// // // //     setMentionSearch('');
// // // //     messageInputRef.current?.focus();
// // // //   };

// // // //   const handleMessageChange = (e) => {
// // // //     const value = e.target.value;
// // // //     setMessage(value);
    
// // // //     // Check for @ mentions
// // // //     const lastAtIndex = value.lastIndexOf('@');
// // // //     if (lastAtIndex >= 0) {
// // // //       const searchTerm = value.substring(lastAtIndex + 1);
// // // //       if (searchTerm.length >= 0 && !searchTerm.includes(' ')) {
// // // //         setMentionSearch(searchTerm);
// // // //         setShowMentions(true);
// // // //       } else {
// // // //         setShowMentions(false);
// // // //       }
// // // //     } else {
// // // //       setShowMentions(false);
// // // //     }
// // // //   };

// // // //   const filteredEmployees = employees.filter(emp => 
// // // //     emp.name.toLowerCase().includes(mentionSearch.toLowerCase())
// // // //   );

// // // //   const handleFileSelect = (e, type) => {
// // // //     const files = Array.from(e.target.files);
// // // //     const fileObjects = files.map(file => ({
// // // //       id: Date.now() + Math.random(),
// // // //       name: file.name,
// // // //       size: file.size,
// // // //       type: type,
// // // //       url: URL.createObjectURL(file)
// // // //     }));
// // // //     setSelectedFiles(prev => [...prev, ...fileObjects]);
// // // //     setShowFileMenu(false);
// // // //   };

// // // //   const removeFile = (fileId) => {
// // // //     setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
// // // //   };

// // // //   const formatFileSize = (bytes) => {
// // // //     if (bytes === 0) return '0 B';
// // // //     const k = 1024;
// // // //     const sizes = ['B', 'KB', 'MB', 'GB'];
// // // //     const i = Math.floor(Math.log(bytes) / Math.log(k));
// // // //     return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
// // // //   };

// // // //   const toggleAudio = (messageId) => {
// // // //     setAudioPlaying(audioPlaying === messageId ? null : messageId);
// // // //   };

// // // //   const addEmployeeToChat = () => {
// // // //     if (newEmployeeEmail.trim()) {
// // // //       // In a real app, you'd validate the email and add the employee
// // // //       console.log('Adding employee:', newEmployeeEmail);
// // // //       setNewEmployeeEmail('');
// // // //       setShowAddEmployee(false);
// // // //     }
// // // //   };

// // // //   // Close file menu when clicking outside
// // // //   useEffect(() => {
// // // //     const handleClickOutside = (event) => {
// // // //       if (showFileMenu && !event.target.closest('.file-menu-container')) {
// // // //         setShowFileMenu(false);
// // // //       }
// // // //     };

// // // //     document.addEventListener('mousedown', handleClickOutside);
// // // //     return () => {
// // // //       document.removeEventListener('mousedown', handleClickOutside);
// // // //     };
// // // //   }, [showFileMenu]);

// // // //   return (
// // // //     <div className="flex h-screen bg-gray-50">
// // // //       {/* Sidebar */}
// // // //       <Sidebar/>
// // // //       <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
// // // //         {/* Header */}
// // // //         <Header/>
// // // //         <div className="p-4 border-b border-gray-200">
// // // //           <div className="flex items-center justify-between mb-4">
// // // //             <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
// // // //             <button 
// // // //               onClick={() => setShowAddEmployee(true)}
// // // //               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// // // //             >
// // // //               <AiOutlinePlus className="w-5 h-5 text-gray-600" />
// // // //             </button>
// // // //           </div>
          
// // // //           {/* Search */}
// // // //           <div className="relative">
// // // //             <AiOutlineSearch className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
// // // //             <input
// // // //               type="text"
// // // //               placeholder="Search conversations"
// // // //               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
// // // //             />
// // // //           </div>
// // // //         </div>

// // // //         {/* Chat List */}
// // // //         <div className="flex-1 overflow-y-auto">
// // // //           {chats.map((chat, index) => (
// // // //             <div
// // // //               key={chat.id}
// // // //               onClick={() => setSelectedChat(index)}
// // // //               className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
// // // //                 selectedChat === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
// // // //               }`}
// // // //             >
// // // //               <div className="flex items-start space-x-3">
// // // //                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
// // // //                   chat.type === 'broadcast' ? 'bg-orange-500' :
// // // //                   chat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
// // // //                 }`}>
// // // //                   {chat.type === 'broadcast' ? (
// // // //                     <AiOutlineBell className="w-5 h-5" />
// // // //                   ) : chat.type === 'group' ? (
// // // //                     <AiOutlineTeam className="w-5 h-5" />
// // // //                   ) : (
// // // //                     <span>{chat.avatar}</span>
// // // //                   )}
// // // //                 </div>
// // // //                 <div className="flex-1 min-w-0">
// // // //                   <div className="flex items-center justify-between">
// // // //                     <h3 className="text-sm font-medium text-gray-900 truncate">
// // // //                       {chat.name}
// // // //                     </h3>
// // // //                     <span className="text-xs text-gray-500">{chat.time}</span>
// // // //                   </div>
// // // //                   <p className="text-sm text-gray-600 truncate mt-1">
// // // //                     {chat.lastMessage}
// // // //                   </p>
// // // //                   {chat.unread > 0 && (
// // // //                     <span className="inline-block bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
// // // //                       {chat.unread}
// // // //                     </span>
// // // //                   )}
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       </div>

// // // //       {/* Main Chat Area */}
// // // //       <div className="flex-1 flex flex-col">
// // // //         {/* Chat Header */}
// // // //         <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
// // // //           <div className="flex items-center space-x-3">
// // // //             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
// // // //               currentChat.type === 'broadcast' ? 'bg-orange-500' :
// // // //               currentChat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
// // // //             }`}>
// // // //               {currentChat.type === 'broadcast' ? (
// // // //                 <AiOutlineBell className="w-5 h-5" />
// // // //               ) : currentChat.type === 'group' ? (
// // // //                 <AiOutlineTeam className="w-5 h-5" />
// // // //               ) : (
// // // //                 <span>{currentChat.avatar}</span>
// // // //               )}
// // // //             </div>
// // // //             <div>
// // // //               <h2 className="text-lg font-medium text-gray-900">{currentChat.name}</h2>
// // // //               <p className="text-sm text-gray-500">
// // // //                 {currentChat.type === 'broadcast' ? 'Company-wide broadcast' :
// // // //                  currentChat.type === 'group' ? `${currentChat.participants.length} members` :
// // // //                  'Direct message'}
// // // //               </p>
// // // //             </div>
// // // //           </div>
// // // //           <div className="flex items-center space-x-2">
// // // //             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// // // //               <AiOutlinePhone className="w-5 h-5 text-gray-600" />
// // // //             </button>
// // // //             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// // // //               <AiOutlineVideoCamera className="w-5 h-5 text-gray-600" />
// // // //             </button>
// // // //             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// // // //               <AiOutlineInfoCircle className="w-5 h-5 text-gray-600" />
// // // //             </button>
// // // //             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// // // //               <AiOutlineMore className="w-5 h-5 text-gray-600" />
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         {/* Messages */}
// // // //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// // // //           {currentChat.messages.map((msg) => (
// // // //             <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
// // // //               <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
// // // //                 msg.sender === 'You' 
// // // //                   ? 'bg-blue-500 text-white' 
// // // //                   : msg.type === 'broadcast'
// // // //                   ? 'bg-orange-100 text-orange-900 border border-orange-200'
// // // //                   : 'bg-white text-gray-900 shadow-sm border border-gray-200'
// // // //               }`}>
// // // //                 {msg.sender !== 'You' && (
// // // //                   <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>
// // // //                 )}
// // // //                 <p className="text-sm">{msg.content}</p>
                
// // // //                 {/* File attachments */}
// // // //                 {msg.files && msg.files.map((file) => (
// // // //                   <div key={file.id} className="mt-2 p-2 bg-black bg-opacity-10 rounded">
// // // //                     <div className="flex items-center space-x-2">
// // // //                       {file.type === 'image' ? (
// // // //                         <AiOutlinePicture className="w-4 h-4" />
// // // //                       ) : file.type === 'audio' ? (
// // // //                         <AiOutlineSound className="w-4 h-4" />
// // // //                       ) : (
// // // //                         <AiOutlineFile className="w-4 h-4" />
// // // //                       )}
// // // //                       <span className="text-xs">{file.name}</span>
// // // //                       <span className="text-xs opacity-75">({formatFileSize(file.size)})</span>
// // // //                     </div>
// // // //                     {file.type === 'audio' && (
// // // //                       <div className="flex items-center space-x-2 mt-1">
// // // //                         <button 
// // // //                           onClick={() => toggleAudio(msg.id)}
// // // //                           className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
// // // //                         >
// // // //                           {audioPlaying === msg.id ? (
// // // //                             <AiOutlinePauseCircle className="w-3 h-3" />
// // // //                           ) : (
// // // //                             <AiOutlinePlayCircle className="w-3 h-3" />
// // // //                           )}
// // // //                         </button>
// // // //                         <div className="flex-1 h-1 bg-black bg-opacity-20 rounded"></div>
// // // //                       </div>
// // // //                     )}
// // // //                   </div>
// // // //                 ))}
                
// // // //                 <p className="text-xs mt-1 opacity-75">{msg.time}</p>
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>

// // // //         {/* Selected Files Preview */}
// // // //         {selectedFiles.length > 0 && (
// // // //           <div className="border-t border-gray-200 p-4">
// // // //             <div className="flex flex-wrap gap-2">
// // // //               {selectedFiles.map((file) => (
// // // //                 <div key={file.id} className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
// // // //                   {file.type === 'image' ? (
// // // //                     <AiOutlinePicture className="w-4 h-4 text-gray-600" />
// // // //                   ) : file.type === 'audio' ? (
// // // //                     <AiOutlineSound className="w-4 h-4 text-gray-600" />
// // // //                   ) : (
// // // //                     <AiOutlineFile className="w-4 h-4 text-gray-600" />
// // // //                   )}
// // // //                   <span className="text-sm text-gray-700">{file.name}</span>
// // // //                   <button 
// // // //                     onClick={() => removeFile(file.id)} 
// // // //                     className="text-gray-500 hover:text-gray-700 transition-colors"
// // // //                   >
// // // //                     <AiOutlineClose className="w-4 h-4" />
// // // //                   </button>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* Mentions Dropdown */}
// // // //         {showMentions && (
// // // //           <div className="border-t border-gray-200 bg-white p-2">
// // // //             <div className="text-xs text-gray-500 mb-2">Mention someone:</div>
// // // //             <div className="max-h-32 overflow-y-auto">
// // // //               {filteredEmployees.map((emp) => (
// // // //                 <button
// // // //                   key={emp.id}
// // // //                   onClick={() => handleMention(emp)}
// // // //                   className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded text-left transition-colors"
// // // //                 >
// // // //                   <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
// // // //                     {emp.avatar}
// // // //                   </div>
// // // //                   <span className="text-sm">{emp.name}</span>
// // // //                 </button>
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* Message Input */}
// // // //         <div className="bg-white border-t border-gray-200 p-4">
// // // //           {currentChat.type !== 'broadcast' && (
// // // //             <div className="flex items-end space-x-2">
// // // //               <div className="flex-1">
// // // //                 <div className="flex items-center space-x-2 mb-2">
// // // //                   <div className="relative file-menu-container">
// // // //                     <button
// // // //                       onClick={() => setShowFileMenu(!showFileMenu)}
// // // //                       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// // // //                     >
// // // //                       <AiOutlinePaperClip className="w-5 h-5 text-gray-600" />
// // // //                     </button>
                    
// // // //                     {showFileMenu && (
// // // //                       <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px] z-10">
// // // //                         <button
// // // //                           onClick={() => imageInputRef.current?.click()}
// // // //                           className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
// // // //                         >
// // // //                           <AiOutlinePicture className="w-4 h-4 text-gray-600" />
// // // //                           <span className="text-sm">Image</span>
// // // //                         </button>
// // // //                         <button
// // // //                           onClick={() => fileInputRef.current?.click()}
// // // //                           className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
// // // //                         >
// // // //                           <AiOutlineFile className="w-4 h-4 text-gray-600" />
// // // //                           <span className="text-sm">File</span>
// // // //                         </button>
// // // //                       </div>
// // // //                     )}
// // // //                   </div>
                  
// // // //                   <button
// // // //                     onClick={() => setIsRecording(!isRecording)}
// // // //                     className={`p-2 rounded-full transition-colors ${
// // // //                       isRecording ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
// // // //                     }`}
// // // //                   >
// // // //                     <AiOutlineAudio className="w-5 h-5" />
// // // //                   </button>
// // // //                 </div>
                
// // // //                 <div className="flex items-end space-x-2">
// // // //                   <div className="flex-1 border border-gray-300 rounded-lg">
// // // //                     <textarea
// // // //                       ref={messageInputRef}
// // // //                       value={message}
// // // //                       onChange={handleMessageChange}
// // // //                       onKeyPress={handleKeyPress}
// // // //                       placeholder="Type a message..."
// // // //                       className="w-full p-3 resize-none focus:outline-none rounded-lg"
// // // //                       rows="1"
// // // //                       style={{ minHeight: '44px', maxHeight: '120px' }}
// // // //                     />
// // // //                   </div>
// // // //                   <button
// // // //                     onClick={handleSendMessage}
// // // //                     disabled={!message.trim() && selectedFiles.length === 0}
// // // //                     className={`p-3 rounded-lg transition-colors ${
// // // //                       message.trim() || selectedFiles.length > 0
// // // //                         ? 'bg-blue-500 text-white hover:bg-blue-600'
// // // //                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
// // // //                     }`}
// // // //                   >
// // // //                     <AiOutlineSend className="w-5 h-5" />
// // // //                   </button>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           )}
          
// // // //           {currentChat.type === 'broadcast' && (
// // // //             <div className="text-center text-gray-500 text-sm py-4">
// // // //               This is a broadcast channel. Only administrators can send messages.
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* Hidden file inputs */}
// // // //       <input
// // // //         ref={fileInputRef}
// // // //         type="file"
// // // //         multiple
// // // //         onChange={(e) => handleFileSelect(e, 'file')}
// // // //         className="hidden"
// // // //       />
// // // //       <input
// // // //         ref={imageInputRef}
// // // //         type="file"
// // // //         multiple
// // // //         accept="image/*"
// // // //         onChange={(e) => handleFileSelect(e, 'image')}
// // // //         className="hidden"
// // // //       />

// // // //       {/* Add Employee Modal */}
// // // //       {showAddEmployee && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // // //           <div className="bg-white rounded-lg p-6 w-96">
// // // //             <h3 className="text-lg font-medium mb-4">Add Employee to Chat</h3>
// // // //             <input
// // // //               type="email"
// // // //               value={newEmployeeEmail}
// // // //               onChange={(e) => setNewEmployeeEmail(e.target.value)}
// // // //               placeholder="Enter employee email"
// // // //               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition-all"
// // // //             />
// // // //             <div className="flex justify-end space-x-3">
// // // //               <button
// // // //                 onClick={() => setShowAddEmployee(false)}
// // // //                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
// // // //               >
// // // //                 Cancel
// // // //               </button>
// // // //               <button
// // // //                 onClick={addEmployeeToChat}
// // // //                 className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
// // // //               >
// // // //                 Add
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default EmployeeChatApp;


// // // import React, { useState, useRef, useEffect } from 'react';
// // // import { 
// // //   AiOutlineSearch,
// // //   AiOutlinePlus,
// // //   AiOutlineSend,
// // //   AiOutlinePaperClip,
// // //   AiOutlineAudio,
// // //   AiOutlineMore,
// // //   AiOutlineBell,
// // //   AiOutlineTeam,
// // //   AiOutlineSetting,
// // //   AiOutlineStar,
// // //   AiOutlineInbox,
// // //   AiOutlineDelete,
// // //   AiOutlinePhone,
// // //   AiOutlineVideoCamera,
// // //   AiOutlineInfoCircle,
// // //   AiOutlineSmile,
// // //   AiOutlinePicture,
// // //   AiOutlineFile,
// // //   AiOutlineClose,
// // //   AiOutlineCheck,
// // //   AiOutlineSound,
// // //   AiOutlineDownload,
// // //   AiOutlinePlayCircle,
// // //   AiOutlinePauseCircle
// // // } from 'react-icons/ai';
// // // import { BiHash, BiAt } from 'react-icons/bi';
// // // import Sidebar from '../../components/common/Sidebar';
// // // import Header from '../../components/common/Header';

// // // const ChatPage = () => {
// // //   const [selectedChat, setSelectedChat] = useState(0);
// // //   const [message, setMessage] = useState('');
// // //   const [showMentions, setShowMentions] = useState(false);
// // //   const [mentionSearch, setMentionSearch] = useState('');
// // //   const [showAddEmployee, setShowAddEmployee] = useState(false);
// // //   const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
// // //   const [isRecording, setIsRecording] = useState(false);
// // //   const [showFileMenu, setShowFileMenu] = useState(false);
// // //   const [selectedFiles, setSelectedFiles] = useState([]);
// // //   const [audioPlaying, setAudioPlaying] = useState(null);
// // //   const [showSidebar, setShowSidebar] = useState(false);
// // //   const fileInputRef = useRef(null);
// // //   const imageInputRef = useRef(null);
// // //   const messageInputRef = useRef(null);

// // //   // Mock data
// // //   const [employees] = useState([
// // //     { id: 1, name: 'Simranjeet Singh', email: 'simran@company.com', avatar: 'S', status: 'online' },
// // //     { id: 2, name: 'Vidhi Tyagi', email: 'vidhi@company.com', avatar: 'V', status: 'away' },
// // //     { id: 3, name: 'Nitin Bansal', email: 'nitin@company.com', avatar: 'N', status: 'online' },
// // //     { id: 4, name: 'Khushboo Sharma', email: 'khushboo@company.com', avatar: 'K', status: 'offline' },
// // //     { id: 5, name: 'Ashutosh Arora', email: 'ashutosh@company.com', avatar: 'A', status: 'online' }
// // //   ]);

// // //   const [chats, setChats] = useState([
// // //     {
// // //       id: 1,
// // //       type: 'broadcast',
// // //       name: 'Company Announcements',
// // //       lastMessage: 'Welcome to the new quarter! Please review the updated policies.',
// // //       time: '2 min ago',
// // //       unread: 1,
// // //       avatar: '#',
// // //       participants: [],
// // //       messages: [
// // //         {
// // //           id: 1,
// // //           sender: 'HR Team',
// // //           content: 'Welcome to the new quarter! Please review the updated policies.',
// // //           time: '10:30 AM',
// // //           type: 'broadcast',
// // //           files: null
// // //         }
// // //       ]
// // //     },
// // //     {
// // //       id: 2,
// // //       type: 'direct',
// // //       name: 'Simranjeet Singh',
// // //       lastMessage: 'Good morning Sir. Kindly go through this for once...',
// // //       time: '9:58 AM',
// // //       unread: 0,
// // //       avatar: 'S',
// // //       participants: [employees[0]],
// // //       messages: [
// // //         {
// // //           id: 1,
// // //           sender: 'Simranjeet Singh',
// // //           content: 'Good morning Sir. Kindly go through this for once, I added a seven procure AI agent in the landing page.',
// // //           time: '9:58 AM',
// // //           type: 'message',
// // //           files: null
// // //         },
// // //         {
// // //           id: 2,
// // //           sender: 'You',
// // //           content: 'Thanks for the update! I\'ll review it shortly.',
// // //           time: '10:02 AM',
// // //           type: 'message',
// // //           files: null
// // //         }
// // //       ]
// // //     },
// // //     {
// // //       id: 3,
// // //       type: 'direct',
// // //       name: 'Vidhi Tyagi',
// // //       lastMessage: 'https://ip.sevenprocure.com/',
// // //       time: '9:58 AM',
// // //       unread: 0,
// // //       avatar: 'V',
// // //       participants: [employees[1]],
// // //       messages: [
// // //         {
// // //           id: 1,
// // //           sender: 'Vidhi Tyagi',
// // //           content: 'https://ip.sevenprocure.com/',
// // //           time: '9:58 AM',
// // //           type: 'message',
// // //           files: null
// // //         }
// // //       ]
// // //     },
// // //     {
// // //       id: 4,
// // //       type: 'group',
// // //       name: 'Development Team',
// // //       lastMessage: 'Let\'s schedule the sprint review for tomorrow',
// // //       time: 'Yesterday',
// // //       unread: 3,
// // //       avatar: 'D',
// // //       participants: [employees[0], employees[1], employees[2]],
// // //       messages: [
// // //         {
// // //           id: 1,
// // //           sender: 'Nitin Bansal',
// // //           content: 'Let\'s schedule the sprint review for tomorrow',
// // //           time: 'Yesterday 4:30 PM',
// // //           type: 'message',
// // //           files: null
// // //         },
// // //         {
// // //           id: 2,
// // //           sender: 'Simranjeet Singh',
// // //           content: 'Sounds good! What time works for everyone?',
// // //           time: 'Yesterday 4:35 PM',
// // //           type: 'message',
// // //           files: null
// // //         },
// // //         {
// // //           id: 3,
// // //           sender: 'You',
// // //           content: 'I can do 2 PM or 4 PM',
// // //           time: 'Yesterday 4:40 PM',
// // //           type: 'message',
// // //           files: null
// // //         }
// // //       ]
// // //     }
// // //   ]);

// // //   const currentChat = chats[selectedChat];

// // //   const handleSendMessage = () => {
// // //     if (message.trim() || selectedFiles.length > 0) {
// // //       const newMessage = {
// // //         id: Date.now(),
// // //         sender: 'You',
// // //         content: message.trim(),
// // //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// // //         type: 'message',
// // //         files: selectedFiles.length > 0 ? [...selectedFiles] : null
// // //       };

// // //       setChats(prev => prev.map((chat, index) => 
// // //         index === selectedChat 
// // //           ? { 
// // //               ...chat, 
// // //               messages: [...chat.messages, newMessage],
// // //               lastMessage: message.trim() || 'File shared',
// // //               time: 'now'
// // //             }
// // //           : chat
// // //       ));

// // //       setMessage('');
// // //       setSelectedFiles([]);
// // //     }
// // //   };

// // //   const handleKeyPress = (e) => {
// // //     if (e.key === 'Enter' && !e.shiftKey) {
// // //       e.preventDefault();
// // //       handleSendMessage();
// // //     }
// // //   };

// // //   const handleMention = (employee) => {
// // //     const newMessage = message.replace(`@${mentionSearch}`, `@${employee.name} `);
// // //     setMessage(newMessage);
// // //     setShowMentions(false);
// // //     setMentionSearch('');
// // //     messageInputRef.current?.focus();
// // //   };

// // //   const handleMessageChange = (e) => {
// // //     const value = e.target.value;
// // //     setMessage(value);
    
// // //     // Check for @ mentions
// // //     const lastAtIndex = value.lastIndexOf('@');
// // //     if (lastAtIndex >= 0) {
// // //       const searchTerm = value.substring(lastAtIndex + 1);
// // //       if (searchTerm.length >= 0 && !searchTerm.includes(' ')) {
// // //         setMentionSearch(searchTerm);
// // //         setShowMentions(true);
// // //       } else {
// // //         setShowMentions(false);
// // //       }
// // //     } else {
// // //       setShowMentions(false);
// // //     }
// // //   };

// // //   const filteredEmployees = employees.filter(emp => 
// // //     emp.name.toLowerCase().includes(mentionSearch.toLowerCase())
// // //   );

// // //   const handleFileSelect = (e, type) => {
// // //     const files = Array.from(e.target.files);
// // //     const fileObjects = files.map(file => ({
// // //       id: Date.now() + Math.random(),
// // //       name: file.name,
// // //       size: file.size,
// // //       type: type,
// // //       url: URL.createObjectURL(file)
// // //     }));
// // //     setSelectedFiles(prev => [...prev, ...fileObjects]);
// // //     setShowFileMenu(false);
// // //   };

// // //   const removeFile = (fileId) => {
// // //     setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
// // //   };

// // //   const formatFileSize = (bytes) => {
// // //     if (bytes === 0) return '0 B';
// // //     const k = 1024;
// // //     const sizes = ['B', 'KB', 'MB', 'GB'];
// // //     const i = Math.floor(Math.log(bytes) / Math.log(k));
// // //     return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
// // //   };

// // //   const toggleAudio = (messageId) => {
// // //     setAudioPlaying(audioPlaying === messageId ? null : messageId);
// // //   };

// // //   const addEmployeeToChat = () => {
// // //     if (newEmployeeEmail.trim()) {
// // //       // In a real app, you'd validate the email and add the employee
// // //       console.log('Adding employee:', newEmployeeEmail);
// // //       setNewEmployeeEmail('');
// // //       setShowAddEmployee(false);
// // //     }
// // //   };

// // //   // Close file menu when clicking outside
// // //   useEffect(() => {
// // //     const handleClickOutside = (event) => {
// // //       if (showFileMenu && !event.target.closest('.file-menu-container')) {
// // //         setShowFileMenu(false);
// // //       }
// // //     };

// // //     document.addEventListener('mousedown', handleClickOutside);
// // //     return () => {
// // //       document.removeEventListener('mousedown', handleClickOutside);
// // //     };
// // //   }, [showFileMenu]);

// // //   return (
// // //     // <div className="flex flex-col h-screen bg-gray-50">
// // //     <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
// // //       {/* Header */}
// // //       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
// // //         <Header isLoggedIn={true} onToggleSidebar={toggleSidebar} />

      
// // //       <div className="flex flex-1 overflow-hidden">
// // //         {/* Sidebar - Hidden on mobile by default */}
// // //         <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
// // //           showSidebar ? 'translate-x-0' : '-translate-x-full'
// // //         }`}>
// // //         </div>

// // //         {/* Overlay for mobile sidebar */}
// // //         {showSidebar && (
// // //           <div 
// // //             className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
// // //             onClick={() => setShowSidebar(false)}
// // //           />
// // //         )}
        
// // //         {/* Chat List */}
// // //         <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
// // //           <div className="p-4 border-b border-gray-200">
// // //             <div className="flex items-center justify-between mb-4">
// // //               <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
// // //               <button 
// // //                 onClick={() => setShowAddEmployee(true)}
// // //                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// // //               >
// // //                 <AiOutlinePlus className="w-5 h-5 text-gray-600" />
// // //               </button>
// // //             </div>
            
// // //             {/* Search */}
// // //             <div className="relative">
// // //               <AiOutlineSearch className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
// // //               <input
// // //                 type="text"
// // //                 placeholder="Search conversations"
// // //                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
// // //               />
// // //             </div>
// // //           </div>

// // //           {/* Chat List */}
// // //           <div className="flex-1 overflow-y-auto">
// // //             {chats.map((chat, index) => (
// // //               <div
// // //                 key={chat.id}
// // //                 onClick={() => {
// // //                   setSelectedChat(index);
// // //                   if (window.innerWidth < 768) {
// // //                     // On mobile, hide the chat list when a chat is selected
// // //                     setShowSidebar(false);
// // //                   }
// // //                 }}
// // //                 className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
// // //                   selectedChat === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
// // //                 }`}
// // //               >
// // //                 <div className="flex items-start space-x-3">
// // //                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
// // //                     chat.type === 'broadcast' ? 'bg-orange-500' :
// // //                     chat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
// // //                   }`}>
// // //                     {chat.type === 'broadcast' ? (
// // //                       <AiOutlineBell className="w-5 h-5" />
// // //                     ) : chat.type === 'group' ? (
// // //                       <AiOutlineTeam className="w-5 h-5" />
// // //                     ) : (
// // //                       <span>{chat.avatar}</span>
// // //                     )}
// // //                   </div>
// // //                   <div className="flex-1 min-w-0">
// // //                     <div className="flex items-center justify-between">
// // //                       <h3 className="text-sm font-medium text-gray-900 truncate">
// // //                         {chat.name}
// // //                       </h3>
// // //                       <span className="text-xs text-gray-500">{chat.time}</span>
// // //                     </div>
// // //                     <p className="text-sm text-gray-600 truncate mt-1">
// // //                       {chat.lastMessage}
// // //                     </p>
// // //                     {chat.unread > 0 && (
// // //                       <span className="inline-block bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
// // //                         {chat.unread}
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>

// // //         {/* Main Chat Area */}
// // //         <div className={`flex-1 flex flex-col ${selectedChat === null ? 'hidden md:flex' : ''}`}>
// // //           {/* Chat Header */}
// // //           <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
// // //             <div className="flex items-center space-x-3">
// // //               <button 
// // //                 className="md:hidden p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
// // //                 onClick={() => setSelectedChat(null)}
// // //               >
// // //                 <AiOutlineClose className="w-5 h-5 text-gray-600" />
// // //               </button>
              
// // //               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
// // //                 currentChat.type === 'broadcast' ? 'bg-orange-500' :
// // //                 currentChat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
// // //               }`}>
// // //                 {currentChat.type === 'broadcast' ? (
// // //                   <AiOutlineBell className="w-5 h-5" />
// // //                 ) : currentChat.type === 'group' ? (
// // //                   <AiOutlineTeam className="w-5 h-5" />
// // //                 ) : (
// // //                   <span>{currentChat.avatar}</span>
// // //                 )}
// // //               </div>
// // //               <div>
// // //                 <h2 className="text-lg font-medium text-gray-900">{currentChat.name}</h2>
// // //                 <p className="text-sm text-gray-500">
// // //                   {currentChat.type === 'broadcast' ? 'Company-wide broadcast' :
// // //                   currentChat.type === 'group' ? `${currentChat.participants.length} members` :
// // //                   'Direct message'}
// // //                 </p>
// // //               </div>
// // //             </div>
// // //             <div className="flex items-center space-x-2">
// // //               <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// // //                 <AiOutlinePhone className="w-5 h-5 text-gray-600" />
// // //               </button>
// // //               <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// // //                 <AiOutlineVideoCamera className="w-5 h-5 text-gray-600" />
// // //               </button>
// // //               <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// // //                 <AiOutlineInfoCircle className="w-5 h-5 text-gray-600" />
// // //               </button>
// // //               <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// // //                 <AiOutlineMore className="w-5 h-5 text-gray-600" />
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* Messages */}
// // //           <div className="flex-1 overflow-y-auto p-4 space-y-4">
// // //             {currentChat.messages.map((msg) => (
// // //               <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
// // //                 <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
// // //                   msg.sender === 'You' 
// // //                     ? 'bg-blue-500 text-white' 
// // //                     : msg.type === 'broadcast'
// // //                     ? 'bg-orange-100 text-orange-900 border border-orange-200'
// // //                     : 'bg-white text-gray-900 shadow-sm border border-gray-200'
// // //                 }`}>
// // //                   {msg.sender !== 'You' && (
// // //                     <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>
// // //                   )}
// // //                   <p className="text-sm">{msg.content}</p>
                  
// // //                   {/* File attachments */}
// // //                   {msg.files && msg.files.map((file) => (
// // //                     <div key={file.id} className="mt-2 p-2 bg-black bg-opacity-10 rounded">
// // //                       <div className="flex items-center space-x-2">
// // //                         {file.type === 'image' ? (
// // //                           <AiOutlinePicture className="w-4 h-4" />
// // //                         ) : file.type === 'audio' ? (
// // //                           <AiOutlineSound className="w-4 h-4" />
// // //                         ) : (
// // //                           <AiOutlineFile className="w-4 h-4" />
// // //                         )}
// // //                         <span className="text-xs">{file.name}</span>
// // //                         <span className="text-xs opacity-75">({formatFileSize(file.size)})</span>
// // //                       </div>
// // //                       {file.type === 'audio' && (
// // //                         <div className="flex items-center space-x-2 mt-1">
// // //                           <button 
// // //                             onClick={() => toggleAudio(msg.id)}
// // //                             className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
// // //                           >
// // //                             {audioPlaying === msg.id ? (
// // //                               <AiOutlinePauseCircle className="w-3 h-3" />
// // //                             ) : (
// // //                               <AiOutlinePlayCircle className="w-3 h-3" />
// // //                             )}
// // //                           </button>
// // //                           <div className="flex-1 h-1 bg-black bg-opacity-20 rounded"></div>
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                   ))}
                  
// // //                   <p className="text-xs mt-1 opacity-75">{msg.time}</p>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>

// // //           {/* Selected Files Preview */}
// // //           {selectedFiles.length > 0 && (
// // //             <div className="border-t border-gray-200 p-4">
// // //               <div className="flex flex-wrap gap-2">
// // //                 {selectedFiles.map((file) => (
// // //                   <div key={file.id} className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
// // //                     {file.type === 'image' ? (
// // //                       <AiOutlinePicture className="w-4 h-4 text-gray-600" />
// // //                     ) : file.type === 'audio' ? (
// // //                       <AiOutlineSound className="w-4 h-4 text-gray-600" />
// // //                     ) : (
// // //                       <AiOutlineFile className="w-4 h-4 text-gray-600" />
// // //                     )}
// // //                     <span className="text-sm text-gray-700">{file.name}</span>
// // //                     <button 
// // //                       onClick={() => removeFile(file.id)} 
// // //                       className="text-gray-500 hover:text-gray-700 transition-colors"
// // //                     >
// // //                       <AiOutlineClose className="w-4 h-4" />
// // //                     </button>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Mentions Dropdown */}
// // //           {showMentions && (
// // //             <div className="border-t border-gray-200 bg-white p-2">
// // //               <div className="text-xs text-gray-500 mb-2">Mention someone:</div>
// // //               <div className="max-h-32 overflow-y-auto">
// // //                 {filteredEmployees.map((emp) => (
// // //                   <button
// // //                     key={emp.id}
// // //                     onClick={() => handleMention(emp)}
// // //                     className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded text-left transition-colors"
// // //                   >
// // //                     <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
// // //                       {emp.avatar}
// // //                     </div>
// // //                     <span className="text-sm">{emp.name}</span>
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Message Input */}
// // //           <div className="bg-white border-t border-gray-200 p-4">
// // //             {currentChat.type !== 'broadcast' && (
// // //               <div className="flex items-end space-x-2">
// // //                 <div className="flex-1">
// // //                   <div className="flex items-center space-x-2 mb-2">
// // //                     <div className="relative file-menu-container">
// // //                       <button
// // //                         onClick={() => setShowFileMenu(!showFileMenu)}
// // //                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// // //                       >
// // //                         <AiOutlinePaperClip className="w-5 h-5 text-gray-600" />
// // //                       </button>
                      
// // //                       {showFileMenu && (
// // //                         <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px] z-10">
// // //                           <button
// // //                             onClick={() => imageInputRef.current?.click()}
// // //                             className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
// // //                           >
// // //                             <AiOutlinePicture className="w-4 h-4 text-gray-600" />
// // //                             <span className="text-sm">Image</span>
// // //                           </button>
// // //                           <button
// // //                             onClick={() => fileInputRef.current?.click()}
// // //                             className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
// // //                           >
// // //                             <AiOutlineFile className="w-4 h-4 text-gray-600" />
// // //                             <span className="text-sm">File</span>
// // //                           </button>
// // //                         </div>
// // //                       )}
// // //                     </div>
                    
// // //                     <button
// // //                       onClick={() => setIsRecording(!isRecording)}
// // //                       className={`p-2 rounded-full transition-colors ${
// // //                         isRecording ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
// // //                       }`}
// // //                     >
// // //                       <AiOutlineAudio className="w-5 h-5" />
// // //                     </button>
// // //                   </div>
                  
// // //                   <div className="flex items-end space-x-2">
// // //                     <div className="flex-1 border border-gray-300 rounded-lg">
// // //                       <textarea
// // //                         ref={messageInputRef}
// // //                         value={message}
// // //                         onChange={handleMessageChange}
// // //                         onKeyPress={handleKeyPress}
// // //                         placeholder="Type a message..."
// // //                         className="w-full p-3 resize-none focus:outline-none rounded-lg"
// // //                         rows="1"
// // //                         style={{ minHeight: '44px', maxHeight: '120px' }}
// // //                       />
// // //                     </div>
// // //                     <button
// // //                       onClick={handleSendMessage}
// // //                       disabled={!message.trim() && selectedFiles.length === 0}
// // //                       className={`p-3 rounded-lg transition-colors ${
// // //                         message.trim() || selectedFiles.length > 0
// // //                           ? 'bg-blue-500 text-white hover:bg-blue-600'
// // //                           : 'bg-gray-300 text-gray-500 cursor-not-allowed'
// // //                       }`}
// // //                     >
// // //                       <AiOutlineSend className="w-5 h-5" />
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             )}
            
// // //             {currentChat.type === 'broadcast' && (
// // //               <div className="text-center text-gray-500 text-sm py-4">
// // //                 This is a broadcast channel. Only administrators can send messages.
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Hidden file inputs */}
// // //       <input
// // //         ref={fileInputRef}
// // //         type="file"
// // //         multiple
// // //         onChange={(e) => handleFileSelect(e, 'file')}
// // //         className="hidden"
// // //       />
// // //       <input
// // //         ref={imageInputRef}
// // //         type="file"
// // //         multiple
// // //         accept="image/*"
// // //         onChange={(e) => handleFileSelect(e, 'image')}
// // //         className="hidden"
// // //       />

// // //       {/* Add Employee Modal */}
// // //       {showAddEmployee && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // //           <div className="bg-white rounded-lg p-6 w-96">
// // //             <h3 className="text-lg font-medium mb-4">Add Employee to Chat</h3>
// // //             <input
// // //               type="email"
// // //               value={newEmployeeEmail}
// // //               onChange={(e) => setNewEmployeeEmail(e.target.value)}
// // //               placeholder="Enter employee email"
// // //               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition-all"
// // //             />
// // //             <div className="flex justify-end space-x-3">
// // //               <button
// // //                 onClick={() => setShowAddEmployee(false)}
// // //                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 onClick={addEmployeeToChat}
// // //                 className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
// // //               >
// // //                 Add
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default ChatPage;





// // import React, { useState, useRef, useEffect } from 'react';
// // import { 
// //   AiOutlineSearch,
// //   AiOutlinePlus,
// //   AiOutlineSend,
// //   AiOutlinePaperClip,
// //   AiOutlineAudio,
// //   AiOutlineMore,
// //   AiOutlineBell,
// //   AiOutlineTeam,
// //   AiOutlineSetting,
// //   AiOutlineStar,
// //   AiOutlineInbox,
// //   AiOutlineDelete,
// //   AiOutlinePhone,
// //   AiOutlineVideoCamera,
// //   AiOutlineInfoCircle,
// //   AiOutlineSmile,
// //   AiOutlinePicture,
// //   AiOutlineFile,
// //   AiOutlineClose,
// //   AiOutlineCheck,
// //   AiOutlineSound,
// //   AiOutlineDownload,
// //   AiOutlinePlayCircle,
// //   AiOutlinePauseCircle
// // } from 'react-icons/ai';
// // import { BiHash, BiAt } from 'react-icons/bi';
// // import Sidebar from '../../components/common/Sidebar';
// // import Header from '../../components/common/Header';

// // const ChatPage = () => {
// //   const [selectedChat, setSelectedChat] = useState(0);
// //   const [message, setMessage] = useState('');
// //   const [showMentions, setShowMentions] = useState(false);
// //   const [mentionSearch, setMentionSearch] = useState('');
// //   const [showAddEmployee, setShowAddEmployee] = useState(false);
// //   const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
// //   const [isRecording, setIsRecording] = useState(false);
// //   const [showFileMenu, setShowFileMenu] = useState(false);
// //   const [selectedFiles, setSelectedFiles] = useState([]);
// //   const [audioPlaying, setAudioPlaying] = useState(null);
// //   const [showSidebar, setShowSidebar] = useState(false); // <-- use showSidebar, not isSidebarOpen
// //   const fileInputRef = useRef(null);
// //   const imageInputRef = useRef(null);
// //   const messageInputRef = useRef(null);

// //   // Mock data
// //   const [employees] = useState([
// //     { id: 1, name: 'Simranjeet Singh', email: 'simran@company.com', avatar: 'S', status: 'online' },
// //     { id: 2, name: 'Vidhi Tyagi', email: 'vidhi@company.com', avatar: 'V', status: 'away' },
// //     { id: 3, name: 'Nitin Bansal', email: 'nitin@company.com', avatar: 'N', status: 'online' },
// //     { id: 4, name: 'Khushboo Sharma', email: 'khushboo@company.com', avatar: 'K', status: 'offline' },
// //     { id: 5, name: 'Ashutosh Arora', email: 'ashutosh@company.com', avatar: 'A', status: 'online' }
// //   ]);

// //   const [chats, setChats] = useState([
// //     {
// //       id: 1,
// //       type: 'broadcast',
// //       name: 'Company Announcements',
// //       lastMessage: 'Welcome to the new quarter! Please review the updated policies.',
// //       time: '2 min ago',
// //       unread: 1,
// //       avatar: '#',
// //       participants: [],
// //       messages: [
// //         {
// //           id: 1,
// //           sender: 'HR Team',
// //           content: 'Welcome to the new quarter! Please review the updated policies.',
// //           time: '10:30 AM',
// //           type: 'broadcast',
// //           files: null
// //         }
// //       ]
// //     },
// //     {
// //       id: 2,
// //       type: 'direct',
// //       name: 'Simranjeet Singh',
// //       lastMessage: 'Good morning Sir. Kindly go through this for once...',
// //       time: '9:58 AM',
// //       unread: 0,
// //       avatar: 'S',
// //       participants: [employees[0]],
// //       messages: [
// //         {
// //           id: 1,
// //           sender: 'Simranjeet Singh',
// //           content: 'Good morning Sir. Kindly go through this for once, I added a seven procure AI agent in the landing page.',
// //           time: '9:58 AM',
// //           type: 'message',
// //           files: null
// //         },
// //         {
// //           id: 2,
// //           sender: 'You',
// //           content: 'Thanks for the update! I\'ll review it shortly.',
// //           time: '10:02 AM',
// //           type: 'message',
// //           files: null
// //         }
// //       ]
// //     },
// //     {
// //       id: 3,
// //       type: 'direct',
// //       name: 'Vidhi Tyagi',
// //       lastMessage: 'https://ip.sevenprocure.com/',
// //       time: '9:58 AM',
// //       unread: 0,
// //       avatar: 'V',
// //       participants: [employees[1]],
// //       messages: [
// //         {
// //           id: 1,
// //           sender: 'Vidhi Tyagi',
// //           content: 'https://ip.sevenprocure.com/',
// //           time: '9:58 AM',
// //           type: 'message',
// //           files: null
// //         }
// //       ]
// //     },
// //     {
// //       id: 4,
// //       type: 'group',
// //       name: 'Development Team',
// //       lastMessage: 'Let\'s schedule the sprint review for tomorrow',
// //       time: 'Yesterday',
// //       unread: 3,
// //       avatar: 'D',
// //       participants: [employees[0], employees[1], employees[2]],
// //       messages: [
// //         {
// //           id: 1,
// //           sender: 'Nitin Bansal',
// //           content: 'Let\'s schedule the sprint review for tomorrow',
// //           time: 'Yesterday 4:30 PM',
// //           type: 'message',
// //           files: null
// //         },
// //         {
// //           id: 2,
// //           sender: 'Simranjeet Singh',
// //           content: 'Sounds good! What time works for everyone?',
// //           time: 'Yesterday 4:35 PM',
// //           type: 'message',
// //           files: null
// //         },
// //         {
// //           id: 3,
// //           sender: 'You',
// //           content: 'I can do 2 PM or 4 PM',
// //           time: 'Yesterday 4:40 PM',
// //           type: 'message',
// //           files: null
// //         }
// //       ]
// //     }
// //   ]);

// //   const currentChat = chats[selectedChat];

// //   const handleSendMessage = () => {
// //     if (message.trim() || selectedFiles.length > 0) {
// //       const newMessage = {
// //         id: Date.now(),
// //         sender: 'You',
// //         content: message.trim(),
// //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// //         type: 'message',
// //         files: selectedFiles.length > 0 ? [...selectedFiles] : null
// //       };

// //       setChats(prev => prev.map((chat, index) => 
// //         index === selectedChat 
// //           ? { 
// //               ...chat, 
// //               messages: [...chat.messages, newMessage],
// //               lastMessage: message.trim() || 'File shared',
// //               time: 'now'
// //             }
// //           : chat
// //       ));

// //       setMessage('');
// //       setSelectedFiles([]);
// //     }
// //   };

// //   const handleKeyPress = (e) => {
// //     if (e.key === 'Enter' && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSendMessage();
// //     }
// //   };

// //   const handleMention = (employee) => {
// //     const newMessage = message.replace(`@${mentionSearch}`, `@${employee.name} `);
// //     setMessage(newMessage);
// //     setShowMentions(false);
// //     setMentionSearch('');
// //     messageInputRef.current?.focus();
// //   };

// //   const handleMessageChange = (e) => {
// //     const value = e.target.value;
// //     setMessage(value);
    
// //     // Check for @ mentions
// //     const lastAtIndex = value.lastIndexOf('@');
// //     if (lastAtIndex >= 0) {
// //       const searchTerm = value.substring(lastAtIndex + 1);
// //       if (searchTerm.length >= 0 && !searchTerm.includes(' ')) {
// //         setMentionSearch(searchTerm);
// //         setShowMentions(true);
// //       } else {
// //         setShowMentions(false);
// //       }
// //     } else {
// //       setShowMentions(false);
// //     }
// //   };

// //   const filteredEmployees = employees.filter(emp => 
// //     emp.name.toLowerCase().includes(mentionSearch.toLowerCase())
// //   );

// //   const handleFileSelect = (e, type) => {
// //     const files = Array.from(e.target.files);
// //     const fileObjects = files.map(file => ({
// //       id: Date.now() + Math.random(),
// //       name: file.name,
// //       size: file.size,
// //       type: type,
// //       url: URL.createObjectURL(file)
// //     }));
// //     setSelectedFiles(prev => [...prev, ...fileObjects]);
// //     setShowFileMenu(false);
// //   };

// //   const removeFile = (fileId) => {
// //     setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
// //   };

// //   const formatFileSize = (bytes) => {
// //     if (bytes === 0) return '0 B';
// //     const k = 1024;
// //     const sizes = ['B', 'KB', 'MB', 'GB'];
// //     const i = Math.floor(Math.log(bytes) / Math.log(k));
// //     return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
// //   };

// //   const toggleAudio = (messageId) => {
// //     setAudioPlaying(audioPlaying === messageId ? null : messageId);
// //   };

// //   const addEmployeeToChat = () => {
// //     if (newEmployeeEmail.trim()) {
// //       // In a real app, you'd validate the email and add the employee
// //       console.log('Adding employee:', newEmployeeEmail);
// //       setNewEmployeeEmail('');
// //       setShowAddEmployee(false);
// //     }
// //   };

// //   // Sidebar toggle handler for mobile
// //   const toggleSidebar = () => setShowSidebar((prev) => !prev);

// //   // Close file menu when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (showFileMenu && !event.target.closest('.file-menu-container')) {
// //         setShowFileMenu(false);
// //       }
// //     };

// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, [showFileMenu]);

// //   return (
// //     <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
// //       {/* Sidebar */}
// //       <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />

// //       {/* Main Content */}
// //       <div className="flex-1 flex flex-col">
// //         {/* Header */}
// //         <Header isLoggedIn={true} onToggleSidebar={toggleSidebar} />

// //         <div className="flex flex-1 overflow-hidden">
// //           {/* Chat List Sidebar */}
// //           <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
// //             <div className="p-4 border-b border-gray-200">
// //               <div className="flex items-center justify-between mb-4">
// //                 <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
// //                 <button 
// //                   onClick={() => setShowAddEmployee(true)}
// //                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// //                 >
// //                   <AiOutlinePlus className="w-5 h-5 text-gray-600" />
// //                 </button>
// //               </div>
// //               {/* Search */}
// //               <div className="relative">
// //                 <AiOutlineSearch className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
// //                 <input
// //                   type="text"
// //                   placeholder="Search conversations"
// //                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
// //                 />
// //               </div>
// //             </div>
// //             {/* Chat List */}
// //             <div className="flex-1 overflow-y-auto">
// //               {chats.map((chat, index) => (
// //                 <div
// //                   key={chat.id}
// //                   onClick={() => setSelectedChat(index)}
// //                   className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
// //                     selectedChat === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
// //                   }`}
// //                 >
// //                   <div className="flex items-start space-x-3">
// //                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
// //                       chat.type === 'broadcast' ? 'bg-orange-500' :
// //                       chat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
// //                     }`}>
// //                       {chat.type === 'broadcast' ? (
// //                         <AiOutlineBell className="w-5 h-5" />
// //                       ) : chat.type === 'group' ? (
// //                         <AiOutlineTeam className="w-5 h-5" />
// //                       ) : (
// //                         <span>{chat.avatar}</span>
// //                       )}
// //                     </div>
// //                     <div className="flex-1 min-w-0">
// //                       <div className="flex items-center justify-between">
// //                         <h3 className="text-sm font-medium text-gray-900 truncate">
// //                           {chat.name}
// //                         </h3>
// //                         <span className="text-xs text-gray-500">{chat.time}</span>
// //                       </div>
// //                       <p className="text-sm text-gray-600 truncate mt-1">
// //                         {chat.lastMessage}
// //                       </p>
// //                       {chat.unread > 0 && (
// //                         <span className="inline-block bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
// //                           {chat.unread}
// //                         </span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Main Chat Area */}
// //           <div className="flex-1 flex flex-col">
// //             {/* Chat Header */}
// //             <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
// //               <div className="flex items-center space-x-3">
// //                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
// //                   currentChat.type === 'broadcast' ? 'bg-orange-500' :
// //                   currentChat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
// //                 }`}>
// //                   {currentChat.type === 'broadcast' ? (
// //                     <AiOutlineBell className="w-5 h-5" />
// //                   ) : currentChat.type === 'group' ? (
// //                     <AiOutlineTeam className="w-5 h-5" />
// //                   ) : (
// //                     <span>{currentChat.avatar}</span>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <h2 className="text-lg font-medium text-gray-900">{currentChat.name}</h2>
// //                   <p className="text-sm text-gray-500">
// //                     {currentChat.type === 'broadcast' ? 'Company-wide broadcast' :
// //                     currentChat.type === 'group' ? `${currentChat.participants.length} members` :
// //                     'Direct message'}
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="flex items-center space-x-2">
// //                 <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// //                   <AiOutlinePhone className="w-5 h-5 text-gray-600" />
// //                 </button>
// //                 <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// //                   <AiOutlineVideoCamera className="w-5 h-5 text-gray-600" />
// //                 </button>
// //                 <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// //                   <AiOutlineInfoCircle className="w-5 h-5 text-gray-600" />
// //                 </button>
// //                 <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// //                   <AiOutlineMore className="w-5 h-5 text-gray-600" />
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Messages */}
// //             <div className="flex-1 overflow-y-auto p-4 space-y-4">
// //               {currentChat.messages.map((msg) => (
// //                 <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
// //                   <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
// //                     msg.sender === 'You' 
// //                       ? 'bg-blue-500 text-white' 
// //                       : msg.type === 'broadcast'
// //                       ? 'bg-orange-100 text-orange-900 border border-orange-200'
// //                       : 'bg-white text-gray-900 shadow-sm border border-gray-200'
// //                   }`}>
// //                     {msg.sender !== 'You' && (
// //                       <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>
// //                     )}
// //                     <p className="text-sm">{msg.content}</p>
                    
// //                     {/* File attachments */}
// //                     {msg.files && msg.files.map((file) => (
// //                       <div key={file.id} className="mt-2 p-2 bg-black bg-opacity-10 rounded">
// //                         <div className="flex items-center space-x-2">
// //                           {file.type === 'image' ? (
// //                             <AiOutlinePicture className="w-4 h-4" />
// //                           ) : file.type === 'audio' ? (
// //                             <AiOutlineSound className="w-4 h-4" />
// //                           ) : (
// //                             <AiOutlineFile className="w-4 h-4" />
// //                           )}
// //                           <span className="text-xs">{file.name}</span>
// //                           <span className="text-xs opacity-75">({formatFileSize(file.size)})</span>
// //                         </div>
// //                         {file.type === 'audio' && (
// //                           <div className="flex items-center space-x-2 mt-1">
// //                             <button 
// //                               onClick={() => toggleAudio(msg.id)}
// //                               className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
// //                             >
// //                               {audioPlaying === msg.id ? (
// //                                 <AiOutlinePauseCircle className="w-3 h-3" />
// //                               ) : (
// //                                 <AiOutlinePlayCircle className="w-3 h-3" />
// //                               )}
// //                             </button>
// //                             <div className="flex-1 h-1 bg-black bg-opacity-20 rounded"></div>
// //                           </div>
// //                         )}
// //                       </div>
// //                     ))}
                    
// //                     <p className="text-xs mt-1 opacity-75">{msg.time}</p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Selected Files Preview */}
// //             {selectedFiles.length > 0 && (
// //               <div className="border-t border-gray-200 p-4">
// //                 <div className="flex flex-wrap gap-2">
// //                   {selectedFiles.map((file) => (
// //                     <div key={file.id} className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
// //                       {file.type === 'image' ? (
// //                         <AiOutlinePicture className="w-4 h-4 text-gray-600" />
// //                       ) : file.type === 'audio' ? (
// //                         <AiOutlineSound className="w-4 h-4 text-gray-600" />
// //                       ) : (
// //                         <AiOutlineFile className="w-4 h-4 text-gray-600" />
// //                       )}
// //                       <span className="text-sm text-gray-700">{file.name}</span>
// //                       <button 
// //                         onClick={() => removeFile(file.id)} 
// //                         className="text-gray-500 hover:text-gray-700 transition-colors"
// //                       >
// //                         <AiOutlineClose className="w-4 h-4" />
// //                       </button>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Mentions Dropdown */}
// //             {showMentions && (
// //               <div className="border-t border-gray-200 bg-white p-2">
// //                 <div className="text-xs text-gray-500 mb-2">Mention someone:</div>
// //                 <div className="max-h-32 overflow-y-auto">
// //                   {filteredEmployees.map((emp) => (
// //                     <button
// //                       key={emp.id}
// //                       onClick={() => handleMention(emp)}
// //                       className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded text-left transition-colors"
// //                     >
// //                       <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
// //                         {emp.avatar}
// //                       </div>
// //                       <span className="text-sm">{emp.name}</span>
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Message Input */}
// //             <div className="bg-white border-t border-gray-200 p-4">
// //               {currentChat.type !== 'broadcast' && (
// //                 <div className="flex items-end space-x-2">
// //                   <div className="flex-1">
// //                     <div className="flex items-center space-x-2 mb-2">
// //                       <div className="relative file-menu-container">
// //                         <button
// //                           onClick={() => setShowFileMenu(!showFileMenu)}
// //                           className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// //                         >
// //                           <AiOutlinePaperClip className="w-5 h-5 text-gray-600" />
// //                         </button>
                        
// //                         {showFileMenu && (
// //                           <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px] z-10">
// //                             <button
// //                               onClick={() => imageInputRef.current?.click()}
// //                               className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
// //                             >
// //                               <AiOutlinePicture className="w-4 h-4 text-gray-600" />
// //                               <span className="text-sm">Image</span>
// //                             </button>
// //                             <button
// //                               onClick={() => fileInputRef.current?.click()}
// //                               className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
// //                             >
// //                               <AiOutlineFile className="w-4 h-4 text-gray-600" />
// //                               <span className="text-sm">File</span>
// //                             </button>
// //                           </div>
// //                         )}
// //                       </div>
                      
// //                       <button
// //                         onClick={() => setIsRecording(!isRecording)}
// //                         className={`p-2 rounded-full transition-colors ${
// //                           isRecording ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
// //                         }`}
// //                       >
// //                         <AiOutlineAudio className="w-5 h-5" />
// //                       </button>
// //                     </div>
                    
// //                     <div className="flex items-end space-x-2">
// //                       <div className="flex-1 border border-gray-300 rounded-lg">
// //                         <textarea
// //                           ref={messageInputRef}
// //                           value={message}
// //                           onChange={handleMessageChange}
// //                           onKeyPress={handleKeyPress}
// //                           placeholder="Type a message..."
// //                           className="w-full p-3 resize-none focus:outline-none rounded-lg"
// //                           rows="1"
// //                           style={{ minHeight: '44px', maxHeight: '120px' }}
// //                         />
// //                       </div>
// //                       <button
// //                         onClick={handleSendMessage}
// //                         disabled={!message.trim() && selectedFiles.length === 0}
// //                         className={`p-3 rounded-lg transition-colors ${
// //                           message.trim() || selectedFiles.length > 0
// //                             ? 'bg-blue-500 text-white hover:bg-blue-600'
// //                             : 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                         }`}
// //                       >
// //                         <AiOutlineSend className="w-5 h-5" />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
              
// //               {currentChat.type === 'broadcast' && (
// //                 <div className="text-center text-gray-500 text-sm py-4">
// //                   This is a broadcast channel. Only administrators can send messages.
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Hidden file inputs */}
// //       <input
// //         ref={fileInputRef}
// //         type="file"
// //         multiple
// //         onChange={(e) => handleFileSelect(e, 'file')}
// //         className="hidden"
// //       />
// //       <input
// //         ref={imageInputRef}
// //         type="file"
// //         multiple
// //         accept="image/*"
// //         onChange={(e) => handleFileSelect(e, 'image')}
// //         className="hidden"
// //       />

// //       {/* Add Employee Modal */}
// //       {showAddEmployee && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg p-6 w-96">
// //             <h3 className="text-lg font-medium mb-4">Add Employee to Chat</h3>
// //             <input
// //               type="email"
// //               value={newEmployeeEmail}
// //               onChange={(e) => setNewEmployeeEmail(e.target.value)}
// //               placeholder="Enter employee email"
// //               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition-all"
// //             />
// //             <div className="flex justify-end space-x-3">
// //               <button
// //                 onClick={() => setShowAddEmployee(false)}
// //                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={addEmployeeToChat}
// //                 className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
// //               >
// //                 Add
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatPage;

// // import React, { useState, useRef, useEffect } from 'react';
// // import {
// //   AiOutlineSearch,
// //   AiOutlinePlus,
// //   AiOutlineSend,
// //   AiOutlinePaperClip,
// //   AiOutlineAudio,
// //   AiOutlineMore,
// //   AiOutlineBell,
// //   AiOutlineTeam,
// //   AiOutlinePhone,
// //   AiOutlineVideoCamera,
// //   AiOutlineInfoCircle,
// //   AiOutlinePicture,
// //   AiOutlineFile,
// //   AiOutlineClose,
// //   AiOutlineSound,
// //   AiOutlinePlayCircle,
// //   AiOutlinePauseCircle
// // } from 'react-icons/ai';
// // import Sidebar from '../../components/common/Sidebar';
// // import Header from '../../components/common/Header';

// // const ChatPage = () => {
// //   const [selectedChat, setSelectedChat] = useState(null); // null means chat list is shown on mobile
// //   const [message, setMessage] = useState('');
// //   const [showMentions, setShowMentions] = useState(false);
// //   const [mentionSearch, setMentionSearch] = useState('');
// //   const [showAddEmployee, setShowAddEmployee] = useState(false);
// //   const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
// //   const [isRecording, setIsRecording] = useState(false);
// //   const [showFileMenu, setShowFileMenu] = useState(false);
// //   const [selectedFiles, setSelectedFiles] = useState([]);
// //   const [audioPlaying, setAudioPlaying] = useState(null);
// //   const [showSidebar, setShowSidebar] = useState(false);
// //   const fileInputRef = useRef(null);
// //   const imageInputRef = useRef(null);
// //   const messageInputRef = useRef(null);

// //   // Mock data
// //   const [employees] = useState([
// //     { id: 1, name: 'Simranjeet Singh', email: 'simran@company.com', avatar: 'S', status: 'online' },
// //     { id: 2, name: 'Vidhi Tyagi', email: 'vidhi@company.com', avatar: 'V', status: 'away' },
// //     { id: 3, name: 'Nitin Bansal', email: 'nitin@company.com', avatar: 'N', status: 'online' },
// //     { id: 4, name: 'Khushboo Sharma', email: 'khushboo@company.com', avatar: 'K', status: 'offline' },
// //     { id: 5, name: 'Ashutosh Arora', email: 'ashutosh@company.com', avatar: 'A', status: 'online' }
// //   ]);

// //   const [chats, setChats] = useState([
// //     {
// //       id: 1,
// //       type: 'broadcast',
// //       name: 'Company Announcements',
// //       lastMessage: 'Welcome to the new quarter! Please review the updated policies.',
// //       time: '2 min ago',
// //       unread: 1,
// //       avatar: '#',
// //       participants: [],
// //       messages: [
// //         {
// //           id: 1,
// //           sender: 'HR Team',
// //           content: 'Welcome to the new quarter! Please review the updated policies.',
// //           time: '10:30 AM',
// //           type: 'broadcast',
// //           files: null
// //         }
// //       ]
// //     },
// //     {
// //       id: 2,
// //       type: 'direct',
// //       name: 'Simranjeet Singh',
// //       lastMessage: 'Good morning Sir. Kindly go through this for once...',
// //       time: '9:58 AM',
// //       unread: 0,
// //       avatar: 'S',
// //       participants: [employees[0]],
// //       messages: [
// //         {
// //           id: 1,
// //           sender: 'Simranjeet Singh',
// //           content: 'Good morning Sir. Kindly go through this for once, I added a seven procure AI agent in the landing page.',
// //           time: '9:58 AM',
// //           type: 'message',
// //           files: null
// //         },
// //         {
// //           id: 2,
// //           sender: 'You',
// //           content: 'Thanks for the update! I\'ll review it shortly.',
// //           time: '10:02 AM',
// //           type: 'message',
// //           files: null
// //         }
// //       ]
// //     },
// //     {
// //       id: 3,
// //       type: 'direct',
// //       name: 'Vidhi Tyagi',
// //       lastMessage: 'https://ip.sevenprocure.com/',
// //       time: '9:58 AM',
// //       unread: 0,
// //       avatar: 'V',
// //       participants: [employees[1]],
// //       messages: [
// //         {
// //           id: 1,
// //           sender: 'Vidhi Tyagi',
// //           content: 'https://ip.sevenprocure.com/',
// //           time: '9:58 AM',
// //           type: 'message',
// //           files: null
// //         }
// //       ]
// //     },
// //     {
// //       id: 4,
// //       type: 'group',
// //       name: 'Development Team',
// //       lastMessage: 'Let\'s schedule the sprint review for tomorrow',
// //       time: 'Yesterday',
// //       unread: 3,
// //       avatar: 'D',
// //       participants: [employees[0], employees[1], employees[2]],
// //       messages: [
// //         {
// //           id: 1,
// //           sender: 'Nitin Bansal',
// //           content: 'Let\'s schedule the sprint review for tomorrow',
// //           time: 'Yesterday 4:30 PM',
// //           type: 'message',
// //           files: null
// //         },
// //         {
// //           id: 2,
// //           sender: 'Simranjeet Singh',
// //           content: 'Sounds good! What time works for everyone?',
// //           time: 'Yesterday 4:35 PM',
// //           type: 'message',
// //           files: null
// //         },
// //         {
// //           id: 3,
// //           sender: 'You',
// //           content: 'I can do 2 PM or 4 PM',
// //           time: 'Yesterday 4:40 PM',
// //           type: 'message',
// //           files: null
// //         }
// //       ]
// //     }
// //   ]);

// //   const currentChat = selectedChat !== null ? chats[selectedChat] : null;

// //   const handleSendMessage = () => {
// //     if (message.trim() || selectedFiles.length > 0) {
// //       const newMessage = {
// //         id: Date.now(),
// //         sender: 'You',
// //         content: message.trim(),
// //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// //         type: 'message',
// //         files: selectedFiles.length > 0 ? [...selectedFiles] : null
// //       };

// //       setChats(prev => prev.map((chat, index) =>
// //         index === selectedChat
// //           ? {
// //             ...chat,
// //             messages: [...chat.messages, newMessage],
// //             lastMessage: message.trim() || 'File shared',
// //             time: 'now'
// //           }
// //           : chat
// //       ));

// //       setMessage('');
// //       setSelectedFiles([]);
// //     }
// //   };

// //   const handleKeyPress = (e) => {
// //     if (e.key === 'Enter' && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSendMessage();
// //     }
// //   };

// //   const handleMention = (employee) => {
// //     const newMessage = message.replace(`@${mentionSearch}`, `@${employee.name} `);
// //     setMessage(newMessage);
// //     setShowMentions(false);
// //     setMentionSearch('');
// //     messageInputRef.current?.focus();
// //   };

// //   const handleMessageChange = (e) => {
// //     const value = e.target.value;
// //     setMessage(value);

// //     // Check for @ mentions
// //     const lastAtIndex = value.lastIndexOf('@');
// //     if (lastAtIndex >= 0) {
// //       const searchTerm = value.substring(lastAtIndex + 1);
// //       if (searchTerm.length >= 0 && !searchTerm.includes(' ')) {
// //         setMentionSearch(searchTerm);
// //         setShowMentions(true);
// //       } else {
// //         setShowMentions(false);
// //       }
// //     } else {
// //       setShowMentions(false);
// //     }
// //   };

// //   const filteredEmployees = employees.filter(emp =>
// //     emp.name.toLowerCase().includes(mentionSearch.toLowerCase())
// //   );

// //   const handleFileSelect = (e, type) => {
// //     const files = Array.from(e.target.files);
// //     const fileObjects = files.map(file => ({
// //       id: Date.now() + Math.random(),
// //       name: file.name,
// //       size: file.size,
// //       type: type,
// //       url: URL.createObjectURL(file)
// //     }));
// //     setSelectedFiles(prev => [...prev, ...fileObjects]);
// //     setShowFileMenu(false);
// //   };

// //   const removeFile = (fileId) => {
// //     setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
// //   };

// //   const formatFileSize = (bytes) => {
// //     if (bytes === 0) return '0 B';
// //     const k = 1024;
// //     const sizes = ['B', 'KB', 'MB', 'GB'];
// //     const i = Math.floor(Math.log(bytes) / Math.log(k));
// //     return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
// //   };

// //   const toggleAudio = (messageId) => {
// //     setAudioPlaying(audioPlaying === messageId ? null : messageId);
// //   };

// //   const addEmployeeToChat = () => {
// //     if (newEmployeeEmail.trim()) {
// //       // In a real app, you'd validate the email and add the employee
// //       console.log('Adding employee:', newEmployeeEmail);
// //       setNewEmployeeEmail('');
// //       setShowAddEmployee(false);
// //     }
// //   };

// //   // Sidebar toggle handler for mobile
// //   const toggleSidebar = () => setShowSidebar((prev) => !prev);

// //   // Close file menu when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (showFileMenu && !event.target.closest('.file-menu-container')) {
// //         setShowFileMenu(false);
// //       }
// //     };

// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, [showFileMenu]);

// //   // Responsive: scroll to bottom when chat changes or message sent
// //   const messagesEndRef = useRef(null);
// //   useEffect(() => {
// //     if (messagesEndRef.current) {
// //       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
// //     }
// //   }, [selectedChat, chats, showSidebar]);

// //   return (
// //     <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
// //       {/* Sidebar (main app sidebar, not chat list) */}
// //       <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />

// //       {/* Main Content */}
// //       <div className="flex-1 flex flex-col">
// //         {/* Header */}
// //         <Header isLoggedIn={true} onToggleSidebar={toggleSidebar} />

// //         <div className="flex flex-1 overflow-hidden">
// //           {/* Chat List Sidebar */}
// //           <div
// //             className={`
// //               bg-white border-r border-gray-200 flex flex-col
// //               w-full max-w-full
// //               md:w-80 md:max-w-xs
// //               transition-all duration-300
// //               ${selectedChat !== null ? 'hidden' : 'flex'}
// //               md:flex
// //             `}
// //           >
// //             <div className="p-4 border-b border-gray-200">
// //               <div className="flex items-center justify-between mb-4">
// //                 <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
// //                 <button
// //                   onClick={() => setShowAddEmployee(true)}
// //                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// //                 >
// //                   <AiOutlinePlus className="w-5 h-5 text-gray-600" />
// //                 </button>
// //               </div>
// //               {/* Search */}
// //               <div className="relative">
// //                 <AiOutlineSearch className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
// //                 <input
// //                   type="text"
// //                   placeholder="Search conversations"
// //                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
// //                 />
// //               </div>
// //             </div>
// //             {/* Chat List */}
// //             <div className="flex-1 overflow-y-auto">
// //               {chats.map((chat, index) => (
// //                 <div
// //                   key={chat.id}
// //                   onClick={() => setSelectedChat(index)}
// //                   className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
// //                     selectedChat === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
// //                   }`}
// //                 >
// //                   <div className="flex items-start space-x-3">
// //                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
// //                       chat.type === 'broadcast' ? 'bg-orange-500' :
// //                       chat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
// //                     }`}>
// //                       {chat.type === 'broadcast' ? (
// //                         <AiOutlineBell className="w-5 h-5" />
// //                       ) : chat.type === 'group' ? (
// //                         <AiOutlineTeam className="w-5 h-5" />
// //                       ) : (
// //                         <span>{chat.avatar}</span>
// //                       )}
// //                     </div>
// //                     <div className="flex-1 min-w-0">
// //                       <div className="flex items-center justify-between">
// //                         <h3 className="text-sm font-medium text-gray-900 truncate">
// //                           {chat.name}
// //                         </h3>
// //                         <span className="text-xs text-gray-500">{chat.time}</span>
// //                       </div>
// //                       <p className="text-sm text-gray-600 truncate mt-1">
// //                         {chat.lastMessage}
// //                       </p>
// //                       {chat.unread > 0 && (
// //                         <span className="inline-block bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
// //                           {chat.unread}
// //                         </span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Main Chat Area */}
// //           <div
// //             className={`
// //               flex-1 flex flex-col
// //               w-full
// //               ${selectedChat === null ? 'hidden' : 'flex'}
// //               md:flex
// //             `}
// //           >
// //             {selectedChat !== null && (
// //               <>
// //                 {/* Chat Header */}
// //                 <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
// //                   <div className="flex items-center space-x-3">
// //                     {/* Back button for mobile */}
// //                     <button
// //                       className="md:hidden p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
// //                       onClick={() => setSelectedChat(null)}
// //                     >
// //                       <AiOutlineClose className="w-5 h-5 text-gray-600" />
// //                     </button>
// //                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
// //                       currentChat.type === 'broadcast' ? 'bg-orange-500' :
// //                       currentChat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
// //                     }`}>
// //                       {currentChat.type === 'broadcast' ? (
// //                         <AiOutlineBell className="w-5 h-5" />
// //                       ) : currentChat.type === 'group' ? (
// //                         <AiOutlineTeam className="w-5 h-5" />
// //                       ) : (
// //                         <span>{currentChat.avatar}</span>
// //                       )}
// //                     </div>
// //                     <div>
// //                       <h2 className="text-lg font-medium text-gray-900">{currentChat.name}</h2>
// //                       <p className="text-sm text-gray-500">
// //                         {currentChat.type === 'broadcast' ? 'Company-wide broadcast' :
// //                         currentChat.type === 'group' ? `${currentChat.participants.length} members` :
// //                         'Direct message'}
// //                       </p>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// //                       <AiOutlinePhone className="w-5 h-5 text-gray-600" />
// //                     </button>
// //                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// //                       <AiOutlineVideoCamera className="w-5 h-5 text-gray-600" />
// //                     </button>
// //                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// //                       <AiOutlineInfoCircle className="w-5 h-5 text-gray-600" />
// //                     </button>
// //                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// //                       <AiOutlineMore className="w-5 h-5 text-gray-600" />
// //                     </button>
// //                   </div>
// //                 </div>

// //                 {/* Messages */}
// //                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
// //                   {currentChat.messages.map((msg) => (
// //                     <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
// //                       <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
// //                         msg.sender === 'You'
// //                           ? 'bg-blue-500 text-white'
// //                           : msg.type === 'broadcast'
// //                           ? 'bg-orange-100 text-orange-900 border border-orange-200'
// //                           : 'bg-white text-gray-900 shadow-sm border border-gray-200'
// //                       }`}>
// //                         {msg.sender !== 'You' && (
// //                           <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>
// //                         )}
// //                         <p className="text-sm">{msg.content}</p>

// //                         {/* File attachments */}
// //                         {msg.files && msg.files.map((file) => (
// //                           <div key={file.id} className="mt-2 p-2 bg-black bg-opacity-10 rounded">
// //                             <div className="flex items-center space-x-2">
// //                               {file.type === 'image' ? (
// //                                 <AiOutlinePicture className="w-4 h-4" />
// //                               ) : file.type === 'audio' ? (
// //                                 <AiOutlineSound className="w-4 h-4" />
// //                               ) : (
// //                                 <AiOutlineFile className="w-4 h-4" />
// //                               )}
// //                               <span className="text-xs">{file.name}</span>
// //                               <span className="text-xs opacity-75">({formatFileSize(file.size)})</span>
// //                             </div>
// //                             {file.type === 'audio' && (
// //                               <div className="flex items-center space-x-2 mt-1">
// //                                 <button
// //                                   onClick={() => toggleAudio(msg.id)}
// //                                   className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
// //                                 >
// //                                   {audioPlaying === msg.id ? (
// //                                     <AiOutlinePauseCircle className="w-3 h-3" />
// //                                   ) : (
// //                                     <AiOutlinePlayCircle className="w-3 h-3" />
// //                                   )}
// //                                 </button>
// //                                 <div className="flex-1 h-1 bg-black bg-opacity-20 rounded"></div>
// //                               </div>
// //                             )}
// //                           </div>
// //                         ))}

// //                         <p className="text-xs mt-1 opacity-75">{msg.time}</p>
// //                       </div>
// //                     </div>
// //                   ))}
// //                   <div ref={messagesEndRef} />
// //                 </div>

// //                 {/* Selected Files Preview */}
// //                 {selectedFiles.length > 0 && (
// //                   <div className="border-t border-gray-200 p-4">
// //                     <div className="flex flex-wrap gap-2">
// //                       {selectedFiles.map((file) => (
// //                         <div key={file.id} className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
// //                           {file.type === 'image' ? (
// //                             <AiOutlinePicture className="w-4 h-4 text-gray-600" />
// //                           ) : file.type === 'audio' ? (
// //                             <AiOutlineSound className="w-4 h-4 text-gray-600" />
// //                           ) : (
// //                             <AiOutlineFile className="w-4 h-4 text-gray-600" />
// //                           )}
// //                           <span className="text-sm text-gray-700">{file.name}</span>
// //                           <button
// //                             onClick={() => removeFile(file.id)}
// //                             className="text-gray-500 hover:text-gray-700 transition-colors"
// //                           >
// //                             <AiOutlineClose className="w-4 h-4" />
// //                           </button>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Mentions Dropdown */}
// //                 {showMentions && (
// //                   <div className="border-t border-gray-200 bg-white p-2">
// //                     <div className="text-xs text-gray-500 mb-2">Mention someone:</div>
// //                     <div className="max-h-32 overflow-y-auto">
// //                       {filteredEmployees.map((emp) => (
// //                         <button
// //                           key={emp.id}
// //                           onClick={() => handleMention(emp)}
// //                           className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded text-left transition-colors"
// //                         >
// //                           <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
// //                             {emp.avatar}
// //                           </div>
// //                           <span className="text-sm">{emp.name}</span>
// //                         </button>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Message Input */}
// //                 <div className="bg-white border-t border-gray-200 p-4">
// //                   {currentChat.type !== 'broadcast' && (
// //                     <div className="flex items-end space-x-2">
// //                       <div className="flex-1">
// //                         <div className="flex items-center space-x-2 mb-2">
// //                           <div className="relative file-menu-container">
// //                             <button
// //                               onClick={() => setShowFileMenu(!showFileMenu)}
// //                               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// //                             >
// //                               <AiOutlinePaperClip className="w-5 h-5 text-gray-600" />
// //                             </button>

// //                             {showFileMenu && (
// //                               <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px] z-10">
// //                                 <button
// //                                   onClick={() => imageInputRef.current?.click()}
// //                                   className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
// //                                 >
// //                                   <AiOutlinePicture className="w-4 h-4 text-gray-600" />
// //                                   <span className="text-sm">Image</span>
// //                                 </button>
// //                                 <button
// //                                   onClick={() => fileInputRef.current?.click()}
// //                                   className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
// //                                 >
// //                                   <AiOutlineFile className="w-4 h-4 text-gray-600" />
// //                                   <span className="text-sm">File</span>
// //                                 </button>
// //                               </div>
// //                             )}
// //                           </div>

// //                           <button
// //                             onClick={() => setIsRecording(!isRecording)}
// //                             className={`p-2 rounded-full transition-colors ${
// //                               isRecording ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
// //                             }`}
// //                           >
// //                             <AiOutlineAudio className="w-5 h-5" />
// //                           </button>
// //                         </div>

// //                         <div className="flex items-end space-x-2">
// //                           <div className="flex-1 border border-gray-300 rounded-lg">
// //                             <textarea
// //                               ref={messageInputRef}
// //                               value={message}
// //                               onChange={handleMessageChange}
// //                               onKeyPress={handleKeyPress}
// //                               placeholder="Type a message..."
// //                               className="w-full p-3 resize-none focus:outline-none rounded-lg"
// //                               rows="1"
// //                               style={{ minHeight: '44px', maxHeight: '120px' }}
// //                             />
// //                           </div>
// //                           <button
// //                             onClick={handleSendMessage}
// //                             disabled={!message.trim() && selectedFiles.length === 0}
// //                             className={`p-3 rounded-lg transition-colors ${
// //                               message.trim() || selectedFiles.length > 0
// //                                 ? 'bg-blue-500 text-white hover:bg-blue-600'
// //                                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                             }`}
// //                           >
// //                             <AiOutlineSend className="w-5 h-5" />
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}

// //                   {currentChat.type === 'broadcast' && (
// //                     <div className="text-center text-gray-500 text-sm py-4">
// //                       This is a broadcast channel. Only administrators can send messages.
// //                     </div>
// //                   )}
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //         </div>

// //         {/* Hidden file inputs */}
// //         <input
// //           ref={fileInputRef}
// //           type="file"
// //           multiple
// //           onChange={(e) => handleFileSelect(e, 'file')}
// //           className="hidden"
// //         />
// //         <input
// //           ref={imageInputRef}
// //           type="file"
// //           multiple
// //           accept="image/*"
// //           onChange={(e) => handleFileSelect(e, 'image')}
// //           className="hidden"
// //         />

// //         {/* Add Employee Modal */}
// //         {showAddEmployee && (
// //           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //             <div className="bg-white rounded-lg p-6 w-96">
// //               <h3 className="text-lg font-medium mb-4">Add Employee to Chat</h3>
// //               <input
// //                 type="email"
// //                 value={newEmployeeEmail}
// //                 onChange={(e) => setNewEmployeeEmail(e.target.value)}
// //                 placeholder="Enter employee email"
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition-all"
// //               />
// //               <div className="flex justify-end space-x-3">
// //                 <button
// //                   onClick={() => setShowAddEmployee(false)}
// //                   className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   onClick={addEmployeeToChat}
// //                   className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
// //                 >
// //                   Add
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ChatPage;


// import React, { useState, useRef, useEffect } from 'react';
// import {
//   AiOutlineSearch,
//   AiOutlinePlus,
//   AiOutlineSend,
//   AiOutlinePaperClip,
//   AiOutlineAudio,
//   AiOutlineMore,
//   AiOutlineBell,
//   AiOutlineTeam,
//   AiOutlinePhone,
//   AiOutlineVideoCamera,
//   AiOutlineInfoCircle,
//   AiOutlinePicture,
//   AiOutlineFile,
//   AiOutlineClose,
//   AiOutlineSound,
//   AiOutlinePlayCircle,
//   AiOutlinePauseCircle
// } from 'react-icons/ai';
// import Sidebar from '../../components/common/Sidebar';
// import Header from '../../components/common/Header';

// const ChatPage = () => {
//   const [selectedChat, setSelectedChat] = useState(null); // null means chat list is shown on mobile
//   const [message, setMessage] = useState('');
//   const [showMentions, setShowMentions] = useState(false);
//   const [mentionSearch, setMentionSearch] = useState('');
//   const [showAddEmployee, setShowAddEmployee] = useState(false);
//   const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [showFileMenu, setShowFileMenu] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [audioPlaying, setAudioPlaying] = useState(null);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const fileInputRef = useRef(null);
//   const imageInputRef = useRef(null);
//   const messageInputRef = useRef(null);

//   // Mock data
//   const [employees] = useState([
//     { id: 1, name: 'Simranjeet Singh', email: 'simran@company.com', avatar: 'S', status: 'online' },
//     { id: 2, name: 'Vidhi Tyagi', email: 'vidhi@company.com', avatar: 'V', status: 'away' },
//     { id: 3, name: 'Nitin Bansal', email: 'nitin@company.com', avatar: 'N', status: 'online' },
//     { id: 4, name: 'Khushboo Sharma', email: 'khushboo@company.com', avatar: 'K', status: 'offline' },
//     { id: 5, name: 'Ashutosh Arora', email: 'ashutosh@company.com', avatar: 'A', status: 'online' }
//   ]);

//   const [chats, setChats] = useState([
//     {
//       id: 1,
//       type: 'broadcast',
//       name: 'Company Announcements',
//       lastMessage: 'Welcome to the new quarter! Please review the updated policies.',
//       time: '2 min ago',
//       unread: 1,
//       avatar: '#',
//       participants: [],
//       messages: [
//         {
//           id: 1,
//           sender: 'HR Team',
//           content: 'Welcome to the new quarter! Please review the updated policies.',
//           time: '10:30 AM',
//           type: 'broadcast',
//           files: null
//         }
//       ]
//     },
//     {
//       id: 2,
//       type: 'direct',
//       name: 'Simranjeet Singh',
//       lastMessage: 'Good morning Sir. Kindly go through this for once...',
//       time: '9:58 AM',
//       unread: 0,
//       avatar: 'S',
//       participants: [employees[0]],
//       messages: [
//         {
//           id: 1,
//           sender: 'Simranjeet Singh',
//           content: 'Good morning Sir. Kindly go through this for once, I added a seven procure AI agent in the landing page.',
//           time: '9:58 AM',
//           type: 'message',
//           files: null
//         },
//         {
//           id: 2,
//           sender: 'You',
//           content: 'Thanks for the update! I\'ll review it shortly.',
//           time: '10:02 AM',
//           type: 'message',
//           files: null
//         }
//       ]
//     },
//     {
//       id: 3,
//       type: 'direct',
//       name: 'Vidhi Tyagi',
//       lastMessage: 'https://ip.sevenprocure.com/',
//       time: '9:58 AM',
//       unread: 0,
//       avatar: 'V',
//       participants: [employees[1]],
//       messages: [
//         {
//           id: 1,
//           sender: 'Vidhi Tyagi',
//           content: 'https://ip.sevenprocure.com/',
//           time: '9:58 AM',
//           type: 'message',
//           files: null
//         }
//       ]
//     },
//     {
//       id: 4,
//       type: 'group',
//       name: 'Development Team',
//       lastMessage: 'Let\'s schedule the sprint review for tomorrow',
//       time: 'Yesterday',
//       unread: 3,
//       avatar: 'D',
//       participants: [employees[0], employees[1], employees[2]],
//       messages: [
//         {
//           id: 1,
//           sender: 'Nitin Bansal',
//           content: 'Let\'s schedule the sprint review for tomorrow',
//           time: 'Yesterday 4:30 PM',
//           type: 'message',
//           files: null
//         },
//         {
//           id: 2,
//           sender: 'Simranjeet Singh',
//           content: 'Sounds good! What time works for everyone?',
//           time: 'Yesterday 4:35 PM',
//           type: 'message',
//           files: null
//         },
//         {
//           id: 3,
//           sender: 'You',
//           content: 'I can do 2 PM or 4 PM',
//           time: 'Yesterday 4:40 PM',
//           type: 'message',
//           files: null
//         }
//       ]
//     }
//   ]);

//   const currentChat = selectedChat !== null ? chats[selectedChat] : null;

//   const handleSendMessage = () => {
//     if (message.trim() || selectedFiles.length > 0) {
//       const newMessage = {
//         id: Date.now(),
//         sender: 'You',
//         content: message.trim(),
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         type: 'message',
//         files: selectedFiles.length > 0 ? [...selectedFiles] : null
//       };

//       setChats(prev => prev.map((chat, index) =>
//         index === selectedChat
//           ? {
//             ...chat,
//             messages: [...chat.messages, newMessage],
//             lastMessage: message.trim() || 'File shared',
//             time: 'now'
//           }
//           : chat
//       ));

//       setMessage('');
//       setSelectedFiles([]);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleMention = (employee) => {
//     const newMessage = message.replace(`@${mentionSearch}`, `@${employee.name} `);
//     setMessage(newMessage);
//     setShowMentions(false);
//     setMentionSearch('');
//     messageInputRef.current?.focus();
//   };

//   const handleMessageChange = (e) => {
//     const value = e.target.value;
//     setMessage(value);

//     // Check for @ mentions
//     const lastAtIndex = value.lastIndexOf('@');
//     if (lastAtIndex >= 0) {
//       const searchTerm = value.substring(lastAtIndex + 1);
//       if (searchTerm.length >= 0 && !searchTerm.includes(' ')) {
//         setMentionSearch(searchTerm);
//         setShowMentions(true);
//       } else {
//         setShowMentions(false);
//       }
//     } else {
//       setShowMentions(false);
//     }
//   };

//   const filteredEmployees = employees.filter(emp =>
//     emp.name.toLowerCase().includes(mentionSearch.toLowerCase())
//   );

//   const handleFileSelect = (e, type) => {
//     const files = Array.from(e.target.files);
//     const fileObjects = files.map(file => ({
//       id: Date.now() + Math.random(),
//       name: file.name,
//       size: file.size,
//       type: type,
//       url: URL.createObjectURL(file)
//     }));
//     setSelectedFiles(prev => [...prev, ...fileObjects]);
//     setShowFileMenu(false);
//   };

//   const removeFile = (fileId) => {
//     setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 B';
//     const k = 1024;
//     const sizes = ['B', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
//   };

//   const toggleAudio = (messageId) => {
//     setAudioPlaying(audioPlaying === messageId ? null : messageId);
//   };

//   const addEmployeeToChat = () => {
//     if (newEmployeeEmail.trim()) {
//       // In a real app, you'd validate the email and add the employee
//       console.log('Adding employee:', newEmployeeEmail);
//       setNewEmployeeEmail('');
//       setShowAddEmployee(false);
//     }
//   };

//   // Sidebar toggle handler for mobile
//   const toggleSidebar = () => setShowSidebar((prev) => !prev);

//   // Close file menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showFileMenu && !event.target.closest('.file-menu-container')) {
//         setShowFileMenu(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showFileMenu]);

//   // Responsive: scroll to bottom when chat changes or message sent
//   const messagesEndRef = useRef(null);
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [selectedChat, chats, showSidebar]);

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
//       {/* Sidebar (main app sidebar, not chat list) */}
//       <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <Header isLoggedIn={true} onToggleSidebar={toggleSidebar} />

//         <div className="flex flex-1 overflow-hidden">
//           {/* Chat List Sidebar */}
//           <div
//             className={`
//               bg-white border-r border-gray-200 flex flex-col
//               w-full max-w-full
//               sm:w-80 sm:max-w-xs
//               transition-all duration-300
//               ${selectedChat !== null ? 'hidden sm:flex' : 'flex'}
//             `}
//           >
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex items-center justify-between mb-4">
//                 <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
//                 <button
//                   onClick={() => setShowAddEmployee(true)}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <AiOutlinePlus className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>
//               {/* Search */}
//               <div className="relative">
//                 <AiOutlineSearch className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
//                 <input
//                   type="text"
//                   placeholder="Search conversations"
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 />
//               </div>
//             </div>
//             {/* Chat List */}
//             <div className="flex-1 overflow-y-auto">
//               {chats.map((chat, index) => (
//                 <div
//                   key={chat.id}
//                   onClick={() => setSelectedChat(index)}
//                   className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
//                     selectedChat === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
//                   }`}
//                 >
//                   <div className="flex items-start space-x-3">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
//                       chat.type === 'broadcast' ? 'bg-orange-500' :
//                       chat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
//                     }`}>
//                       {chat.type === 'broadcast' ? (
//                         <AiOutlineBell className="w-5 h-5" />
//                       ) : chat.type === 'group' ? (
//                         <AiOutlineTeam className="w-5 h-5" />
//                       ) : (
//                         <span>{chat.avatar}</span>
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-medium text-gray-900 truncate">
//                           {chat.name}
//                         </h3>
//                         <span className="text-xs text-gray-500">{chat.time}</span>
//                       </div>
//                       <p className="text-sm text-gray-600 truncate mt-1">
//                         {chat.lastMessage}
//                       </p>
//                       {chat.unread > 0 && (
//                         <span className="inline-block bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
//                           {chat.unread}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Main Chat Area */}
//           <div
//             className={`
//               flex-1 flex flex-col
//               w-full
//               ${selectedChat === null ? 'hidden sm:flex' : 'flex'}
//             `}
//           >
//             {selectedChat !== null ? (
//               <>
//                 {/* Chat Header */}
//                 <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     {/* Back button for mobile */}
//                     <button
//                       className="sm:hidden p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
//                       onClick={() => setSelectedChat(null)}
//                     >
//                       <AiOutlineClose className="w-5 h-5 text-gray-600" />
//                     </button>
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
//                       currentChat.type === 'broadcast' ? 'bg-orange-500' :
//                       currentChat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
//                     }`}>
//                       {currentChat.type === 'broadcast' ? (
//                         <AiOutlineBell className="w-5 h-5" />
//                       ) : currentChat.type === 'group' ? (
//                         <AiOutlineTeam className="w-5 h-5" />
//                       ) : (
//                         <span>{currentChat.avatar}</span>
//                       )}
//                     </div>
//                     <div>
//                       <h2 className="text-lg font-medium text-gray-900">{currentChat.name}</h2>
//                       <p className="text-sm text-gray-500">
//                         {currentChat.type === 'broadcast' ? 'Company-wide broadcast' :
//                         currentChat.type === 'group' ? `${currentChat.participants.length} members` :
//                         'Direct message'}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                       <AiOutlinePhone className="w-5 h-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                       <AiOutlineVideoCamera className="w-5 h-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                       <AiOutlineInfoCircle className="w-5 h-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                       <AiOutlineMore className="w-5 h-5 text-gray-600" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Messages */}
//                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                   {currentChat.messages.map((msg) => (
//                     <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
//                       <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
//                         msg.sender === 'You'
//                           ? 'bg-blue-500 text-white'
//                           : msg.type === 'broadcast'
//                           ? 'bg-orange-100 text-orange-900 border border-orange-200'
//                           : 'bg-white text-gray-900 shadow-sm border border-gray-200'
//                       }`}>
//                         {msg.sender !== 'You' && (
//                           <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>
//                         )}
//                         <p className="text-sm">{msg.content}</p>

//                         {/* File attachments */}
//                         {msg.files && msg.files.map((file) => (
//                           <div key={file.id} className="mt-2 p-2 bg-black bg-opacity-10 rounded">
//                             <div className="flex items-center space-x-2">
//                               {file.type === 'image' ? (
//                                 <AiOutlinePicture className="w-4 h-4" />
//                               ) : file.type === 'audio' ? (
//                                 <AiOutlineSound className="w-4 h-4" />
//                               ) : (
//                                 <AiOutlineFile className="w-4 h-4" />
//                               )}
//                               <span className="text-xs">{file.name}</span>
//                               <span className="text-xs opacity-75">({formatFileSize(file.size)})</span>
//                             </div>
//                             {file.type === 'audio' && (
//                               <div className="flex items-center space-x-2 mt-1">
//                                 <button
//                                   onClick={() => toggleAudio(msg.id)}
//                                   className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
//                                 >
//                                   {audioPlaying === msg.id ? (
//                                     <AiOutlinePauseCircle className="w-3 h-3" />
//                                   ) : (
//                                     <AiOutlinePlayCircle className="w-3 h-3" />
//                                   )}
//                                 </button>
//                                 <div className="flex-1 h-1 bg-black bg-opacity-20 rounded"></div>
//                               </div>
//                             )}
//                           </div>
//                         ))}

//                         <p className="text-xs mt-1 opacity-75">{msg.time}</p>
//                       </div>
//                     </div>
//                   ))}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 {/* Selected Files Preview */}
//                 {selectedFiles.length > 0 && (
//                   <div className="border-t border-gray-200 p-4">
//                     <div className="flex flex-wrap gap-2">
//                       {selectedFiles.map((file) => (
//                         <div key={file.id} className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
//                           {file.type === 'image' ? (
//                             <AiOutlinePicture className="w-4 h-4 text-gray-600" />
//                           ) : file.type === 'audio' ? (
//                             <AiOutlineSound className="w-4 h-4 text-gray-600" />
//                           ) : (
//                             <AiOutlineFile className="w-4 h-4 text-gray-600" />
//                           )}
//                           <span className="text-sm text-gray-700">{file.name}</span>
//                           <button
//                             onClick={() => removeFile(file.id)}
//                             className="text-gray-500 hover:text-gray-700 transition-colors"
//                           >
//                             <AiOutlineClose className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Mentions Dropdown */}
//                 {showMentions && (
//                   <div className="border-t border-gray-200 bg-white p-2">
//                     <div className="text-xs text-gray-500 mb-2">Mention someone:</div>
//                     <div className="max-h-32 overflow-y-auto">
//                       {filteredEmployees.map((emp) => (
//                         <button
//                           key={emp.id}
//                           onClick={() => handleMention(emp)}
//                           className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded text-left transition-colors"
//                         >
//                           <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
//                             {emp.avatar}
//                           </div>
//                           <span className="text-sm">{emp.name}</span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Message Input */}
//                 <div className="bg-white border-t border-gray-200 p-4">
//                   {currentChat.type !== 'broadcast' && (
//                     <div className="flex items-end space-x-2">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-2 mb-2">
//                           <div className="relative file-menu-container">
//                             <button
//                               onClick={() => setShowFileMenu(!showFileMenu)}
//                               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                             >
//                               <AiOutlinePaperClip className="w-5 h-5 text-gray-600" />
//                             </button>

//                             {showFileMenu && (
//                               <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px] z-10">
//                                 <button
//                                   onClick={() => imageInputRef.current?.click()}
//                                   className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
//                                 >
//                                   <AiOutlinePicture className="w-4 h-4 text-gray-600" />
//                                   <span className="text-sm">Image</span>
//                                 </button>
//                                 <button
//                                   onClick={() => fileInputRef.current?.click()}
//                                   className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
//                                 >
//                                   <AiOutlineFile className="w-4 h-4 text-gray-600" />
//                                   <span className="text-sm">File</span>
//                                 </button>
//                               </div>
//                             )}
//                           </div>

//                           <button
//                             onClick={() => setIsRecording(!isRecording)}
//                             className={`p-2 rounded-full transition-colors ${
//                               isRecording ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
//                             }`}
//                           >
//                             <AiOutlineAudio className="w-5 h-5" />
//                           </button>
//                         </div>

//                         <div className="flex items-end space-x-2">
//                           <div className="flex-1 border border-gray-300 rounded-lg">
//                             <textarea
//                               ref={messageInputRef}
//                               value={message}
//                               onChange={handleMessageChange}
//                               onKeyPress={handleKeyPress}
//                               placeholder="Type a message..."
//                               className="w-full p-3 resize-none focus:outline-none rounded-lg"
//                               rows="1"
//                               style={{ minHeight: '44px', maxHeight: '120px' }}
//                             />
//                           </div>
//                           <button
//                             onClick={handleSendMessage}
//                             disabled={!message.trim() && selectedFiles.length === 0}
//                             className={`p-3 rounded-lg transition-colors ${
//                               message.trim() || selectedFiles.length > 0
//                                 ? 'bg-blue-500 text-white hover:bg-blue-600'
//                                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                             }`}
//                           >
//                             <AiOutlineSend className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {currentChat.type === 'broadcast' && (
//                     <div className="text-center text-gray-500 text-sm py-4">
//                       This is a broadcast channel. Only administrators can send messages.
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="flex-1 flex items-center justify-center bg-gray-100 sm:hidden">
//                 <p className="text-gray-500 text-center">Select a chat to start messaging</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Hidden file inputs */}
//         <input
//           ref={fileInputRef}
//           type="file"
//           multiple
//           onChange={(e) => handleFileSelect(e, 'file')}
//           className="hidden"
//         />
//         <input
//           ref={imageInputRef}
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={(e) => handleFileSelect(e, 'image')}
//           className="hidden"
//         />

//         {/* Add Employee Modal */}
//         {showAddEmployee && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-96">
//               <h3 className="text-lg font-medium mb-4">Add Employee to Chat</h3>
//               <input
//                 type="email"
//                 value={newEmployeeEmail}
//                 onChange={(e) => setNewEmployeeEmail(e.target.value)}
//                 placeholder="Enter employee email"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition-all"
//               />
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setShowAddEmployee(false)}
//                   className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={addEmployeeToChat}
//                   className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;



import React, { useState, useRef, useEffect } from 'react';
import {
  AiOutlineSearch,
  AiOutlinePlus,
  AiOutlineSend,
  AiOutlinePaperClip,
  AiOutlineAudio,
  AiOutlineMore,
  AiOutlineBell,
  AiOutlineTeam,
  AiOutlinePhone,
  AiOutlineVideoCamera,
  AiOutlineInfoCircle,
  AiOutlinePicture,
  AiOutlineFile,
  AiOutlineClose,
  AiOutlineSound,
  AiOutlinePlayCircle,
  AiOutlinePauseCircle
} from 'react-icons/ai';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null); // null means chat list is shown on mobile
  const [message, setMessage] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [audioPlaying, setAudioPlaying] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const messageInputRef = useRef(null);

  // Mock data
  const [employees] = useState([
    { id: 1, name: 'Simranjeet Singh', email: 'simran@company.com', avatar: 'S', status: 'online' },
    { id: 2, name: 'Vidhi Tyagi', email: 'vidhi@company.com', avatar: 'V', status: 'away' },
    { id: 3, name: 'Nitin Bansal', email: 'nitin@company.com', avatar: 'N', status: 'online' },
    { id: 4, name: 'Khushboo Sharma', email: 'khushboo@company.com', avatar: 'K', status: 'offline' },
    { id: 5, name: 'Ashutosh Arora', email: 'ashutosh@company.com', avatar: 'A', status: 'online' }
  ]);

  const [chats, setChats] = useState([
    {
      id: 1,
      type: 'broadcast',
      name: 'Company Announcements',
      lastMessage: 'Welcome to the new quarter! Please review the updated policies.',
      time: '2 min ago',
      unread: 1,
      avatar: '#',
      participants: [],
      messages: [
        {
          id: 1,
          sender: 'HR Team',
          content: 'Welcome to the new quarter! Please review the updated policies.',
          time: '10:30 AM',
          type: 'broadcast',
          files: null
        }
      ]
    },
    {
      id: 2,
      type: 'direct',
      name: 'Simranjeet Singh',
      lastMessage: 'Good morning Sir. Kindly go through this for once...',
      time: '9:58 AM',
      unread: 0,
      avatar: 'S',
      participants: [employees[0]],
      messages: [
        {
          id: 1,
          sender: 'Simranjeet Singh',
          content: 'Good morning Sir. Kindly go through this for once, I added a seven procure AI agent in the landing page.',
          time: '9:58 AM',
          type: 'message',
          files: null
        },
        {
          id: 2,
          sender: 'You',
          content: 'Thanks for the update! I\'ll review it shortly.',
          time: '10:02 AM',
          type: 'message',
          files: null
        }
      ]
    },
    {
      id: 3,
      type: 'direct',
      name: 'Vidhi Tyagi',
      lastMessage: 'https://ip.sevenprocure.com/',
      time: '9:58 AM',
      unread: 0,
      avatar: 'V',
      participants: [employees[1]],
      messages: [
        {
          id: 1,
          sender: 'Vidhi Tyagi',
          content: 'https://ip.sevenprocure.com/',
          time: '9:58 AM',
          type: 'message',
          files: null
        }
      ]
    },
    {
      id: 4,
      type: 'group',
      name: 'Development Team',
      lastMessage: 'Let\'s schedule the sprint review for tomorrow',
      time: 'Yesterday',
      unread: 3,
      avatar: 'D',
      participants: [employees[0], employees[1], employees[2]],
      messages: [
        {
          id: 1,
          sender: 'Nitin Bansal',
          content: 'Let\'s schedule the sprint review for tomorrow',
          time: 'Yesterday 4:30 PM',
          type: 'message',
          files: null
        },
        {
          id: 2,
          sender: 'Simranjeet Singh',
          content: 'Sounds good! What time works for everyone?',
          time: 'Yesterday 4:35 PM',
          type: 'message',
          files: null
        },
        {
          id: 3,
          sender: 'You',
          content: 'I can do 2 PM or 4 PM',
          time: 'Yesterday 4:40 PM',
          type: 'message',
          files: null
        }
      ]
    }
  ]);

  const currentChat = selectedChat !== null ? chats[selectedChat] : null;

  const handleSendMessage = () => {
    if (message.trim() || selectedFiles.length > 0) {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        content: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'message',
        files: selectedFiles.length > 0 ? [...selectedFiles] : null
      };

      setChats(prev => prev.map((chat, index) =>
        index === selectedChat
          ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: message.trim() || 'File shared',
            time: 'now'
          }
          : chat
      ));

      setMessage('');
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMention = (employee) => {
    const newMessage = message.replace(`@${mentionSearch}`, `@${employee.name} `);
    setMessage(newMessage);
    setShowMentions(false);
    setMentionSearch('');
    messageInputRef.current?.focus();
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex >= 0) {
      const searchTerm = value.substring(lastAtIndex + 1);
      if (searchTerm.length >= 0 && !searchTerm.includes(' ')) {
        setMentionSearch(searchTerm);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files);
    const fileObjects = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: type,
      url: URL.createObjectURL(file)
    }));
    setSelectedFiles(prev => [...prev, ...fileObjects]);
    setShowFileMenu(false);
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const toggleAudio = (messageId) => {
    setAudioPlaying(audioPlaying === messageId ? null : messageId);
  };

  const addEmployeeToChat = () => {
    if (newEmployeeEmail.trim()) {
      // In a real app, you'd validate the email and add the employee
      console.log('Adding employee:', newEmployeeEmail);
      setNewEmployeeEmail('');
      setShowAddEmployee(false);
    }
  };

  // Sidebar toggle handler for mobile
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  // Close file menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFileMenu && !event.target.closest('.file-menu-container')) {
        setShowFileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFileMenu]);

  // Responsive: scroll to bottom when chat changes or message sent
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat, chats, showSidebar]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (main app sidebar, not chat list) */}
      <Sidebar isOpen={showSidebar} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header isLoggedIn={true} onToggleSidebar={toggleSidebar} />

        <div className="flex flex-1 overflow-hidden">
          {/* Chat List Sidebar */}
          <div
            className={`
              bg-white border-r border-gray-200 flex flex-col
              w-full max-w-full
              sm:w-80 sm:max-w-xs
              transition-all duration-300
              ${selectedChat !== null ? 'hidden sm:flex' : 'flex'}
            `}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
                <button
                  onClick={() => setShowAddEmployee(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <AiOutlinePlus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              {/* Search */}
              <div className="relative">
                <AiOutlineSearch className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search conversations"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat, index) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(index)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                    selectedChat === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                      chat.type === 'broadcast' ? 'bg-orange-500' :
                      chat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {chat.type === 'broadcast' ? (
                        <AiOutlineBell className="w-5 h-5" />
                      ) : chat.type === 'group' ? (
                        <AiOutlineTeam className="w-5 h-5" />
                      ) : (
                        <span>{chat.avatar}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="inline-block bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div
            className={`
              flex-1 flex flex-col
              w-full
              ${selectedChat === null ? 'hidden sm:flex' : 'flex'}
            `}
          >
            {selectedChat !== null ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Back button for mobile */}
                    <button
                      className="sm:hidden p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => setSelectedChat(null)}
                    >
                      <AiOutlineClose className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                      currentChat.type === 'broadcast' ? 'bg-orange-500' :
                      currentChat.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {currentChat.type === 'broadcast' ? (
                        <AiOutlineBell className="w-5 h-5" />
                      ) : currentChat.type === 'group' ? (
                        <AiOutlineTeam className="w-5 h-5" />
                      ) : (
                        <span>{currentChat.avatar}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">{currentChat.name}</h2>
                      <p className="text-sm text-gray-500">
                        {currentChat.type === 'broadcast' ? 'Company-wide broadcast' :
                        currentChat.type === 'group' ? `${currentChat.participants.length} members` :
                        'Direct message'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <AiOutlinePhone className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <AiOutlineVideoCamera className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <AiOutlineInfoCircle className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <AiOutlineMore className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-blue-50 to-blue-100">
                  {currentChat.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'You'
                          ? 'bg-blue-500 text-white'
                          : msg.type === 'broadcast'
                          ? 'bg-orange-100 text-orange-900 border border-orange-200'
                          : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      }`}>
                        {msg.sender !== 'You' && (
                          <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>
                        )}
                        <p className="text-sm">{msg.content}</p>

                        {/* File attachments */}
                        {msg.files && msg.files.map((file) => (
                          <div key={file.id} className="mt-2 p-2 bg-black bg-opacity-10 rounded">
                            <div className="flex items-center space-x-2">
                              {file.type === 'image' ? (
                                <AiOutlinePicture className="w-4 h-4" />
                              ) : file.type === 'audio' ? (
                                <AiOutlineSound className="w-4 h-4" />
                              ) : (
                                <AiOutlineFile className="w-4 h-4" />
                              )}
                              <span className="text-xs">{file.name}</span>
                              <span className="text-xs opacity-75">({formatFileSize(file.size)})</span>
                            </div>
                            {file.type === 'audio' && (
                              <div className="flex items-center space-x-2 mt-1">
                                <button
                                  onClick={() => toggleAudio(msg.id)}
                                  className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
                                >
                                  {audioPlaying === msg.id ? (
                                    <AiOutlinePauseCircle className="w-3 h-3" />
                                  ) : (
                                    <AiOutlinePlayCircle className="w-3 h-3" />
                                  )}
                                </button>
                                <div className="flex-1 h-1 bg-black bg-opacity-20 rounded"></div>
                              </div>
                            )}
                          </div>
                        ))}

                        <p className="text-xs mt-1 opacity-75">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <div className="flex flex-wrap gap-2">
                      {selectedFiles.map((file) => (
                        <div key={file.id} className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                          {file.type === 'image' ? (
                            <AiOutlinePicture className="w-4 h-4 text-gray-600" />
                          ) : file.type === 'audio' ? (
                            <AiOutlineSound className="w-4 h-4 text-gray-600" />
                          ) : (
                            <AiOutlineFile className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <AiOutlineClose className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mentions Dropdown */}
                {showMentions && (
                  <div className="border-t border-gray-200 bg-white p-2">
                    <div className="text-xs text-gray-500 mb-2">Mention someone:</div>
                    <div className="max-h-32 overflow-y-auto">
                      {filteredEmployees.map((emp) => (
                        <button
                          key={emp.id}
                          onClick={() => handleMention(emp)}
                          className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded text-left transition-colors"
                        >
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                            {emp.avatar}
                          </div>
                          <span className="text-sm">{emp.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  {currentChat.type !== 'broadcast' && (
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="relative file-menu-container">
                            <button
                              onClick={() => setShowFileMenu(!showFileMenu)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <AiOutlinePaperClip className="w-5 h-5 text-gray-600" />
                            </button>

                            {showFileMenu && (
                              <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[150px] z-10">
                                <button
                                  onClick={() => imageInputRef.current?.click()}
                                  className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
                                >
                                  <AiOutlinePicture className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm">Image</span>
                                </button>
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left transition-colors"
                                >
                                  <AiOutlineFile className="w-4 h-4 text-gray-600" />
                                  <span className="text-sm">File</span>
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => setIsRecording(!isRecording)}
                            className={`p-2 rounded-full transition-colors ${
                              isRecording ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
                            }`}
                          >
                            <AiOutlineAudio className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-end space-x-2">
                          <div className="flex-1 border border-gray-300 rounded-lg">
                            <textarea
                              ref={messageInputRef}
                              value={message}
                              onChange={handleMessageChange}
                              onKeyPress={handleKeyPress}
                              placeholder="Type a message..."
                              className="w-full p-3 resize-none focus:outline-none rounded-lg"
                              rows="1"
                              style={{ minHeight: '44px', maxHeight: '120px' }}
                            />
                          </div>
                          <button
                            onClick={handleSendMessage}
                            disabled={!message.trim() && selectedFiles.length === 0}
                            className={`p-3 rounded-lg transition-colors ${
                              message.trim() || selectedFiles.length > 0
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <AiOutlineSend className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentChat.type === 'broadcast' && (
                    <div className="text-center text-gray-500 text-sm py-4">
                      This is a broadcast channel. Only administrators can send messages.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 sm:hidden">
                <p className="text-gray-500 text-center">Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e, 'file')}
          className="hidden"
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e, 'image')}
          className="hidden"
        />

        {/* Add Employee Modal */}
        {showAddEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Add Employee to Chat</h3>
              <input
                type="email"
                value={newEmployeeEmail}
                onChange={(e) => setNewEmployeeEmail(e.target.value)}
                placeholder="Enter employee email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition-all"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddEmployee(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addEmployeeToChat}
                  className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;