// frontend/src/App.js

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import * as sessionActions from './store/session';
// import SpotsBrowser from "./components/SpotsBrowser";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <NavBar isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1> //  element: <SpotsBrowser />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;


// import { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
// // import LoginFormPage from './components/LoginFormModal';
// // import SignupFormPage from './components/SignupFormModal';
// import NavBar from './components/NavBar';
// import * as sessionActions from './store/session';

// function Layout() {
//   const dispatch = useDispatch();
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     dispatch(sessionActions.restoreUser()).then(() => {
//       setIsLoaded(true);
//     });
//   }, [dispatch]);

//   return (
//     <>
//       <NavBar isLoaded={isLoaded} />
//       {isLoaded && <Outlet />}
//     </>
//   );
// }

// const router = createBrowserRouter([
//   {
//     element: <Layout />,
//     children: [
//       {
//         path: '/',
//         element: <h1>Welcome!</h1>, //add the users name
//       },
//       // {
//       //   path: '/login',
//       //   element: <LoginFormPage />,
//       // },
//       // {
//       //   path: "/signup",
//       //   element: <SignupFormPage />
//       // },
//     ],
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;
