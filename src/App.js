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
import AppRoutes from './routes.js';

function App() {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // No token verification, just set isVerified to true immediately
    setIsVerified(true);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes isVerified={isVerified} />
      </BrowserRouter>
    </div>
  );
}

export default App;