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



import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import DashboardDemo from './pages/DashboardDemo';

function App() {
  const [isVerified, setIsVerified] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    // No token verification, just set isVerified to true immediately
    setIsVerified(true);
    
    // Check if we should show the demo (you can remove this logic)
    const urlParams = new URLSearchParams(window.location.search);
    setShowDemo(urlParams.get('demo') === 'true');
  }, []);

  // Show demo dashboard if demo=true in URL
  if (showDemo) {
    return (
      <BrowserRouter>
        <DashboardDemo />
      </BrowserRouter>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes isVerified={isVerified} />
      </BrowserRouter>
    </div>
  );
}

export default App;