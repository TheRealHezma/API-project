// frontend/src/components/Navigation/ProfileButton.jsx


// import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import { FaUserCircle } from 'react-icons/fa';
// import * as sessionActions from '../../store/session';
// import OpenModalButton from '../OpenModalButton';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../SignupFormModal';
// function ProfileButton({ user }) {
//   const dispatch = useDispatch();
//   const [showMenu, setShowMenu] = useState(false);
//   const ulRef = useRef();

//   const toggleMenu = (e) => {
//     e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
//     setShowMenu(!showMenu);
//   };

//   useEffect(() => {
//     if (!showMenu) return;

//     const closeMenu = (e) => {
//       if (!ulRef.current.contains(e.target)) {
//         setShowMenu(false);
//       }
//     };

//     document.addEventListener('click', closeMenu);

//     return () => document.removeEventListener("click", closeMenu);
//   }, [showMenu]);

//   const logout = (e) => {
//     e.preventDefault();
//     dispatch(sessionActions.logout());
//   };

//   const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

//   return (
//     <>
//       <button onClick={toggleMenu}>
//         <FaUserCircle />
//       </button>
//       <ul className={ulClassName} ref={ulRef}>
//         {user ? (
//           <>
//             <li>{user.username}</li>
//             <li>{user.firstName} {user.lastName}</li>
//             <li>{user.email}</li>
//             <li>
//               <button onClick={logout}>Log Out</button>
//             </li>
//           </>
//         ) : (
//           <>
//             <li>
//               <OpenModalButton
//                 buttonText="Log In"
//                 modalComponent={<LoginFormModal />}
//               />
//             </li>
//             <li>
//               <OpenModalButton
//                 buttonText="Sign Up"
//                 modalComponent={<SignupFormModal />}
//               />
//             </li>
//           </>
//         )}
//       </ul>
//     </>
//   );
// }

// export default ProfileButton;

///////////////////////////////////////////////////////////////
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import './NavBar.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowProfileMenu(false);  // Close the menu after logout
  };

  const openMenu = (e) => {
    e.stopPropagation();
    if (showProfileMenu) return;
    setShowProfileMenu(true);
  };

  const closeMenu = () => {
    if (!showProfileMenu) return;
    setShowProfileMenu(false);
  };

  useEffect(() => {
    if (showProfileMenu) {
      const closeMenuOnClickOutside = (e) => {
        if (!e.target.closest('.profile-button-container')) {
          setShowProfileMenu(false);
        }
      };
      document.addEventListener('mousedown', closeMenuOnClickOutside);
      return () => {
        document.removeEventListener('mousedown', closeMenuOnClickOutside);
      };
    }
  }, [showProfileMenu]);

  return (
    <div className="profile-button-container">
      <button onClick={openMenu} className="profile-button">
        <FaUserCircle />
      </button>
      {showProfileMenu && (
        <ul className="profile-dropdown">
          <li className="profile-info">
            <div>{user.username}</div>
            <div>{user.firstName} {user.lastName}</div>
            <div>{user.email}</div>
          </li>
          <li>
            <NavLink to="/profile" className="profile-dropdown-item" onClick={closeMenu}>
              Profile
            </NavLink>
          </li>
          <li>
            <button onClick={logout} className="profile-dropdown-item">Log Out</button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;

/////////////////////////////////////////////////////

// import { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { FaUserCircle } from 'react-icons/fa';
// import * as sessionActions from '../../store/session';
// import './NavBar.css';

// function ProfileButton({ user }) {
//   const dispatch = useDispatch();
//   const [showProfileMenu, setShowProfileMenu] = useState(false); // Unique state for profile dropdown

//   const logout = (e) => {
//     e.preventDefault();
//     dispatch(sessionActions.logout());
//   };

//   const openMenu = (e) => {
//     e.stopPropagation(); // Prevent event propagation to parent elements
//     if (showProfileMenu) return;
//     setShowProfileMenu(true);
//   };

//   const closeMenu = () => {
//     if (!showProfileMenu) return;
//     setShowProfileMenu(false);
//   };

//   return (
//     <div className="profile-button-container" onMouseLeave={closeMenu}>
//       <button onClick={openMenu} className="profile-button">
//         <FaUserCircle />
//       </button>
//       {showProfileMenu && (
//         <ul className="profile-dropdown">
//           <li className="profile-info">
//             <div>{user.username}</div>
//             <div>{user.firstName} {user.lastName}</div>
//             <div>{user.email}</div>
//           </li>
//           <li>
//             <NavLink to="/profile" className="profile-dropdown-item" onClick={closeMenu}>
//               Profile
//             </NavLink>
//           </li>
//           <li>
//             <button onClick={logout} className="profile-dropdown-item">Log Out</button>
//           </li>
//         </ul>
//       )}
//     </div>
//   );
// }

// export default ProfileButton;
