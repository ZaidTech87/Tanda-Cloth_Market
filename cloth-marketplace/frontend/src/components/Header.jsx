import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaUser, FaComments, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">🧵</span>
            <span className="logo-text">ClothMarket</span>
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-item">
            <FaHome />
            <span>Feed</span>
          </Link>
          <Link to="/create-post" className="nav-item">
            <FaPlus />
            <span>Post</span>
          </Link>
          <Link to="/messages" className="nav-item">
            <FaComments />
            <span>Messages</span>
          </Link>
          <Link to={`/profile/${user?.userId}`} className="nav-item">
            <FaUser />
            <span>Profile</span>
          </Link>
        </nav>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-location">{user?.location}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
