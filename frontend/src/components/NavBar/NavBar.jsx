//frontend/src / components / NavBar / NavBar.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import ProfileButton from './ProfileButton';
import './NavBar.css';
import logo from '../../../../images/airbnblogo.png';
import rightSide from '../../../../images/hamburg.png';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';  // Import the login modal component
import SignupFormPage from '../SignupFormModal';

const NavBar = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">
          <img src={logo} alt="Airbnb" className="navbar-logo" />
        </NavLink>
      </div>

      <div className="navbar-links">
        {sessionUser && (
          <div className={`createspotlink`}>
            <NavLink to="/spots/new" className={`create-spot-link`}>Create a New Spot</NavLink>
          </div>
        )}        <button className="navbar-brand navbar-button hamburger-button" onClick={handleMenuToggle}>
          {sessionUser && <ProfileButton user={sessionUser} />}
          <img src={rightSide} alt="Menu" className="navbar-logo" />
        </button>
        {menuOpen && (
          <div className="dropdown-menu" ref={menuRef}>
            {sessionUser ? (
              <>
                <NavLink to="/" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  Home
                </NavLink>
                <NavLink to="/listing" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  Listing
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  Home
                </NavLink>
                <OpenModalButton
                  modalComponent={<LoginFormModal />}
                  buttonText="Login"
                  className="dropdown-item"
                  onButtonClick={() => setMenuOpen(false)}
                />
                <OpenModalButton
                  modalComponent={<SignupFormPage />}
                  buttonText="Sign Up"
                  className="dropdown-item"
                  onButtonClick={() => setMenuOpen(false)}
                />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

////////////////////////////////////////////////////////////////////

// // import { NavLink } from 'react-router-dom';
// // import { useSelector } from 'react-redux';
// // import { useState, useEffect, useRef } from 'react';
// // import ProfileButton from './ProfileButton';
// // import './NavBar.css';
// // import logo from '../../../../images/airbnblogo.png';
// // import rightSide from '../../../../images/hamburg.png';
// // import OpenModalButton from '../OpenModalButton';

// // const NavBar = () => {
// //   //const dispatch = useDispatch();
// //   const sessionUser = useSelector((state) => state.session.user);
// //   const [menuOpen, setMenuOpen] = useState(false);
// //   const menuRef = useRef(null);

// //   // const handleLogout = (e) => {
// //   //   e.preventDefault();
// //   //   dispatch(sessionActions.logout());
// //   // };

// //   const handleMenuToggle = () => {
// //     setMenuOpen(!menuOpen);
// //   };

// //   const handleClickOutside = (event) => {
// //     if (menuRef.current && !menuRef.current.contains(event.target)) {
// //       setMenuOpen(false);
// //     }
// //   };

// //   useEffect(() => {
// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, []);

// //   return (
// //     <nav className="navbar">
// //       <div className="navbar-brand">
// //         <NavLink to="/">
// //           <img src={logo} alt="Airbnb" className="navbar-logo" />
// //         </NavLink>
// //       </div>
// //       <div className="navbar-links">

// //         <button className="navbar-brand navbar-button hamburger-button" onClick={handleMenuToggle}>
// //           {sessionUser && <ProfileButton user={sessionUser} />}
// //           <img src={rightSide} alt="Menu" className="navbar-logo" />
// //           {/* &#9776; */} {/* Unicode character for hamburger icon */}
// //         </button>
// //         {menuOpen && (
// //           <div className="dropdown-menu" ref={menuRef}>
// //             {sessionUser ? (
// //               <>
// //                 <NavLink to="/" className="dropdown-item" onClick={() => setMenuOpen(false)}>
// //                   Home
// //                 </NavLink>
// //                 <NavLink to="/listing" className="dropdown-item" onClick={() => setMenuOpen(false)}>
// //                   Listing
// //                 </NavLink>
// //                 {/* <NavLink to="/" onClick={handleLogout} className="dropdown-item">
// //                   Logout
// //                 </NavLink> */}
// //                 {/* <NavLink to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
// //                   Profile
// //                 </NavLink> */}
// //                 {/* <NavLink to="/bookings" className="dropdown-item" onClick={() => setMenuOpen(false)}>
// //                   Bookings
// //                 </NavLink> */}
// //               </>
// //             ) : (
// //               <>
// //                 <NavLink to="/" className="dropdown-item" onClick={() => setMenuOpen(false)}>
// //                   Home
// //                 </NavLink>
// //                 <OpenModalButton to="/login" className="dropdown-item" onClick={() => setMenuOpen(false)} />
// //                 Login
// //                 <NavLink to="/signup" className="dropdown-item" onClick={() => setMenuOpen(false)}>
// //                   Sign Up
// //                 </NavLink>
// //               </>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // };

// // export default NavBar;
