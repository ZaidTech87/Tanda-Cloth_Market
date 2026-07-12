

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome,
  FaUser,
  FaComments,
  FaPlus,
  FaSignOutAlt
} from 'react-icons/fa';

import './Header.css';

const Header = () => {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFeedClick = (e) => {

    e.preventDefault();

    navigate("/", {
      state: {
        refreshFeed: Date.now()
      }
    });

  };

  return (

    <header className="header">

      <div className="header-container">

        <div className="header-left">

          <Link to="/" className="logo">

            <span className="logo-icon">
              🧵
            </span>

            <span className="logo-text">
              ClothMarket
            </span>

          </Link>

        </div>

        <nav className="header-nav">

          <Link
            to="/"
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
            onClick={handleFeedClick}
          >
            <FaHome />
            <span>Feed</span>
          </Link>

          <Link
            to="/create-post"
            className={`nav-item ${location.pathname === "/create-post" ? "active" : ""}`}
          >
            <FaPlus />
            <span>Post</span>
          </Link>

          <Link
            to="/messages"
            className={`nav-item ${location.pathname === "/messages" ? "active" : ""}`}
          >
            <FaComments />
            <span>Messages</span>
          </Link>

          <Link
            to={`/profile/${user?.userId}`}
            className={`nav-item ${location.pathname.includes("/profile") ? "active" : ""}`}
          >
            <FaUser />
            <span>Profile</span>
          </Link>

        </nav>

        <div className="header-right">

          <div className="user-info">

            <span className="user-name">
              {user?.name}
            </span>

            <span className="user-location">
              {user?.location}
            </span>

          </div>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            <FaSignOutAlt />
          </button>

        </div>

      </div>

    </header>

  );
};

export default Header;