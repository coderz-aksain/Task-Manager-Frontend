

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAppContext } from "./contexts/AppContext";
// import Login from "./pages/employee/Login";
// import TaskPage from "./pages/employee/TaskPage";
// import ProfilePage from "./pages/employee/ProfilePage";
// import AdmintaskPage from "./pages/admin/AdmintaskPage";
// import EmployeeListPage from "./pages/admin/EmployeeListPage";
// import AdminProfile from "./pages/admin/AdminProfile";
// import CreateTasks from "./pages/admin/CreateTasks";
// import CreateTasksEmployee from "./pages/employee/CreateTasksEmployee";
// import LoadingSpinner from "./components/ui/LoadingSpinner";

// // Protected Route Component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { state } = useAppContext();
//   const { isAuthenticated, role, loading } = state;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner size="lg" text="Loading..." />
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return (
//       <Navigate
//         to={role === "employee" ? "/employee/tasks" : "/admin/tasks"}
//         replace
//       />
//     );
//   }

//   return children;
// };

// const AppRoutes = () => {
//   const { state } = useAppContext();
//   const { isAuthenticated, role, loading } = state;

//   // Debug log to check state
//   console.log("AppRoutes State:", { isAuthenticated, role, loading });

//   // Only show loading spinner if loading is true or role is not yet determined
//   // if (loading || !role) {
//   //   return (
//   //     <div className="min-h-screen flex items-center justify-center">
//   //       <LoadingSpinner size="lg" text="Loading..." />
//   //     </div>
//   //   );
//   // }

//   return (
//     <Routes>
//       {/* Common Route - Login Page */}
//       <Route
//         path="/"
//         element={
//           !isAuthenticated ? (
//             <Login />
//           ) : (
//             <Navigate
//               to={role === "admin" ? "/admin/tasks" : "/employee/tasks"}
//               replace
//             />
//           )
//         }
//       />

//       {/* Employee Pages Routes */}
//       <Route
//         path="/employee/createtasks"
//         element={
//           <ProtectedRoute allowedRoles={["employee"]}>
//             <CreateTasksEmployee />
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
//         path="/admin/createtasks"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <CreateTasks />
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






import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppContext } from "./contexts/AppContext";
import Login from "./pages/employee/Login";
import TaskPage from "./pages/employee/TaskPage";
import ProfilePage from "./pages/employee/ProfilePage";
import AdmintaskPage from "./pages/admin/AdmintaskPage";
import EmployeeListPage from "./pages/admin/EmployeeListPage";
import AdminProfile from "./pages/admin/AdminProfile";
import CreateTasks from "./pages/admin/CreateTasks";
import CreateTasksEmployee from "./pages/employee/CreateTasksEmployee";
import ResetPassword from "./pages/common/ResetPassword"; // Import the ResetPassword component
import LoadingSpinner from "./components/ui/LoadingSpinner";
import CreateRemainder from "./pages/admin/CreateRemainder";
import DashboardDemo from "./pages/DashboardDemo"
// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { state } = useAppContext();
  const { isAuthenticated, role, loading } = state;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
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

const AppRoutes = () => {
  const { state } = useAppContext();
  const { isAuthenticated, role, loading } = state;

  // Debug log to check state
  console.log("AppRoutes State:", { isAuthenticated, role, loading });

  return (
    <Routes>
      {/* Common Routes */}
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate
              to={role === "admin" ? "/admin/tasks" : "/employee/tasks"}
              replace
            />
          )
        }
      />
      <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* New Reset Password Route */}

      {/* Employee Pages Routes */}
      <Route
        path="/employee/createtasks"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <CreateTasksEmployee />
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
        path="/employee/createtask"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <CreateTasksEmployee />
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
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardDemo />
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
        path="/admin/createremainder"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateRemainder />
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