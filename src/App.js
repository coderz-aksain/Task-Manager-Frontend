// // import logo from './logo.svg';
// // import './App.css';

// // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;


// // import { BrowserRouter } from 'react-router-dom';
// // import AppRoutes from './routes';

// // function App() {
// //   return (
// //     <div className="App">
// //       <BrowserRouter>
// //         <AppRoutes />
// //       </BrowserRouter>
// //     </div>
// //   );
// // }

// // export default App;

// import React, { useEffect } from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import AppRoutes from './routes';
// import { useDispatch } from 'react-redux';
// import { verifyToken } from './redux/actions/authActions'; // Adjust the path as needed

// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(verifyToken());
//   }, [dispatch]);

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;



// import React, { useEffect } from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import AppRoutes from './routes';
// import { useDispatch } from 'react-redux';
// import { verifyToken } from './redux/actions/authActions';

// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(verifyToken());
//   }, [dispatch]);

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;



// import React from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import { AppProvider } from './contexts/AppContext';
// // import { useToast, ToastContainer } from './hooks/useToast';
// import AppRoutes from './routes';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function AppContent() {
//   const { toasts, removeToast } = useToast();

//   return (
//     <>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//       <ToastContainer toasts={toasts} removeToast={removeToast} />
//     </>
//   );
// }

// function App() {
//   return (
//     <AppProvider>
//       <AppContent />
//     </AppProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import AppRoutes from './routes';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
