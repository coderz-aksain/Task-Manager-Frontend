// // import React from 'react';
// // import { Routes, Route, Navigate } from 'react-router-dom';
// // import { useSelector } from 'react-redux';
// // import Login from '../src/pages/employee/Login';
// // import Dashboard from '../src/pages/employee/Dashboard';
// // import AttendancePage from '../src/pages/employee/AttendancePage';
// // import LeavePage from '../src/pages/employee/LeavePage';
// // import PerformancePage from '../src/pages/employee/PerformancePage';
// // import TaskPage from '../src/pages/employee/TaskPage';
// // import ChatPage from '../src/pages/employee/ChatPage';
// // import ProfilePage from './pages/employee/ProfilePage';
// // import AdmintaskPage from './pages/admin/AdmintaskPage';
// // import EmployeeListPage from './pages/admin/EmployeeListPage';
// // import AdminProfile from './pages/admin/AdminProfile';
// // // Protected Route Component
// // const ProtectedRoute = ({ children }) => {
// //   const { isAuthenticated } = useSelector((state) => state.auth);
// //   return isAuthenticated ? children : <Navigate to="/login" />;
// // };

// // const AppRoutes = () => {
// //   return (
// //     <Routes>

// //       {/* ========================COMMON ROUTES====================================== */}
// //       <Route path="/" element={<Login />} />
// //         {/* ========================EMPLOYEE PAGES ROUTES=============================== */}
// //       <Route path="/employee/dashboard" element={<Dashboard />} />
// //       <Route path="/employee/attendance" element={<AttendancePage />} />
// //       <Route path="/employee/chat" element={<ChatPage />} />
// //       <Route path="/employee/leave" element={<LeavePage />} />
// //       <Route path="/employee/profile" element={<ProfilePage />} />
// //       <Route path="/employee/tasks" element={<TaskPage />} />
// //       <Route path="/employee/performance" element={<PerformancePage />} />

// //       {/* ========================ADMIN PAGES ROUTES=============================== */}

// //       <Route path="/admin/tasks" element={<AdmintaskPage />} />
// //       <Route path="/admin/employeelist" element={<EmployeeListPage />} />
// //       <Route path="/admin/adminprofile" element={<AdminProfile />} />

// //       {/* <Route
// //         path="/dashboard"
// //         element={
// //           <ProtectedRoute>
// //             <Dashboard />
// //           </ProtectedRoute>
// //         }L
// //       /> */}
// //       {/* <Route
// //         path="/attendance"
// //         element={
// //           <ProtectedRoute>
// //             <AttendancePage />
// //           </ProtectedRoute>
// //         }
// //       /> */}
// //       {/* <Route
// //         path="/leave"
// //         element={
// //           <ProtectedRoute>
// //             <LeavePage />
// //           </ProtectedRoute>
// //         }
// //       /> */}
// //       <Route
// //         path="/performance"
// //         element={
// //           <ProtectedRoute>
// //             <PerformancePage />
// //           </ProtectedRoute>
// //         }
// //       />
// //       <Route
// //         path="/task"
// //         element={
// //           <ProtectedRoute>
// //             <TaskPage />
// //           </ProtectedRoute>
// //         }
// //       />
// //       <Route path="*" element={<Navigate to="/" />} />
// //     </Routes>
// //   );
// // };

// // export default AppRoutes;

// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Login from '../src/pages/employee/Login';
// import Dashboard from '../src/pages/employee/Dashboard';
// import AttendancePage from '../src/pages/employee/AttendancePage';
// import LeavePage from '../src/pages/employee/LeavePage';
// import PerformancePage from '../src/pages/employee/PerformancePage';
// import TaskPage from '../src/pages/employee/TaskPage';
// import ChatPage from '../src/pages/employee/ChatPage';
// import ProfilePage from './pages/employee/ProfilePage';
// import AdmintaskPage from './pages/admin/AdmintaskPage';
// import EmployeeListPage from './pages/admin/EmployeeListPage';
// import AdminProfile from './pages/admin/AdminProfile';

// // Protected Route Component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { isAuthenticated, role } = useSelector((state) => state.auth);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return <Navigate to={role === 'employee' ? '/employee/dashboard' : '/admin/tasks'} />;
//   }

//   return children;
// };

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Common Route */}
//       <Route path="/" element={<Login />} />

//       {/* Employee Pages Routes */}
//       <Route
//         path="/employee/dashboard"
//         element={
//           <ProtectedRoute allowedRoles={['employee']}>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/attendance"
//         element={
//           <ProtectedRoute allowedRoles={['employee']}>
//             <AttendancePage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/chat"
//         element={
//           <ProtectedRoute allowedRoles={['employee']}>
//             <ChatPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/leave"
//         element={
//           <ProtectedRoute allowedRoles={['employee']}>
//             <LeavePage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/profile"
//         element={
//           <ProtectedRoute allowedRoles={['employee']}>
//             <ProfilePage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/tasks"
//         element={
//           <ProtectedRoute allowedRoles={['employee']}>
//             <TaskPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/performance"
//         element={
//           <ProtectedRoute allowedRoles={['employee']}>
//             <PerformancePage />
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin Pages Routes */}
//       <Route
//         path="/admin/tasks"
//         element={
//           <ProtectedRoute allowedRoles={['admin']}>
//             <AdmintaskPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/employeelist"
//         element={
//           <ProtectedRoute allowedRoles={['admin']}>
//             <EmployeeListPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/adminprofile"
//         element={
//           <ProtectedRoute allowedRoles={['admin']}>
//             <AdminProfile />
//           </ProtectedRoute>
//         }
//       />

//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// };

// export default AppRoutes;

// import React, { useEffect, useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import Login from "./pages/employee/Login";
// import Dashboard from "./pages/employee/Dashboard";
// import AttendancePage from "./pages/employee/AttendancePage";
// import LeavePage from "./pages/employee/LeavePage";
// import PerformancePage from "./pages/employee/PerformancePage";
// import TaskPage from "./pages/employee/TaskPage";
// import ChatPage from "./pages/employee/ChatPage";
// import ProfilePage from "./pages/employee/ProfilePage";
// import AdmintaskPage from "./pages/admin/AdmintaskPage";
// import EmployeeListPage from "./pages/admin/EmployeeListPage";
// import AdminProfile from "./pages/admin/AdminProfile";
// import { verifyToken } from "./redux/actions/authActions";

// // Protected Route Component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { isAuthenticated, role, loading } = useSelector((state) => state.auth);
//   const token = localStorage.getItem('token');

//   if (loading) return <div>Loading...</div>; // Prevent redirection during verification

//   if (!isAuthenticated || !token) {
//     return <Navigate to="/" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return <Navigate to={role === "employee" ? "/employee/tasks" : "/admin/tasks"} replace />;
//   }

//   return children;
// };

// const AppRoutes = () => {
//   const { isAuthenticated, role, loading } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const [isVerified, setIsVerified] = useState(false);

//   useEffect(() => {
//     dispatch(verifyToken()).then(() => setIsVerified(true));
//   }, [dispatch]);

//   if (!isVerified) return <div>Loading...</div>; // Wait for verification

//   return (
//     <Routes>
//       {/* Common Route - Login Page */}
//       <Route
//         path="/"
//         element={!isAuthenticated ? <Login /> : <Navigate to={role === "admin" ? "/admin/tasks" : "/employee/tasks"} replace />}
//       />

//       {/* Employee Pages Routes */}
//       <Route
//         path="/employee/dashboard"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/attendance"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <AttendancePage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/chat"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <ChatPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/leave"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <LeavePage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/profile"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <ProfilePage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/tasks"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <TaskPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/employee/performance"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <PerformancePage />
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin Pages Routes */}
//       <Route
//         path="/admin/tasks"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <AdmintaskPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/employeelist"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <EmployeeListPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin/profile"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <AdminProfile />
//           </ProtectedRoute>
//         }
//       />

//       {/* Catch-all Route */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// };

// export default AppRoutes;

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/employee/Login";
import Dashboard from "./pages/employee/Dashboard";
import AttendancePage from "./pages/employee/AttendancePage";
import LeavePage from "./pages/employee/LeavePage";
import PerformancePage from "./pages/employee/PerformancePage";
import TaskPage from "./pages/employee/TaskPage";
import ChatPage from "./pages/employee/ChatPage";
import ProfilePage from "./pages/employee/ProfilePage";
import AdmintaskPage from "./pages/admin/AdmintaskPage";
import EmployeeListPage from "./pages/admin/EmployeeListPage";
import AdminProfile from "./pages/admin/AdminProfile";
import CreateTasks from "./pages/admin/CreateTasks";
import CreateTasksEmployee from "./pages/employee/CreateTasksEmployee";
// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === "employee" ? "/employee/tasks" : "/admin/tasks"}
        replace
      />
    );
  }

  return children;
};

const AppRoutes = ({ isVerified }) => {
  if (!isVerified) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Common Route - Login Page */}
      <Route
        path="/"
        element={
          !localStorage.getItem("token") ? (
            <Login />
          ) : (
            <Navigate
              to={
                localStorage.getItem("role") === "admin"
                  ? "/admin/tasks"
                  : "/employee/tasks"
              }
              replace
            />
          )
        }
      />

      {/* Employee Pages Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/createtasks"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <CreateTasksEmployee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <AttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/chat"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/leave"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <LeavePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/tasks"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <TaskPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/performance"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <PerformancePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Pages Routes */}
      <Route
        path="/admin/tasks"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdmintaskPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/createtasks"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateTasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employeelist"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EmployeeListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
