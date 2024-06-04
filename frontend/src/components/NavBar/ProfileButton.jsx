// frontend/src/components/Navigation/ProfileButton.jsx

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import './NavBar.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Unique state for profile dropdown

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const openMenu = (e) => {
    e.stopPropagation(); // Prevent event propagation to parent elements
    if (showProfileMenu) return;
    setShowProfileMenu(true);
  };

  const closeMenu = () => {
    if (!showProfileMenu) return;
    setShowProfileMenu(false);
  };

  return (
    <div className="profile-button-container" onMouseLeave={closeMenu}>
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
