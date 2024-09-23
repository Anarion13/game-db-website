import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Header.css';

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  console.log('User:', user); // Add this line

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/');
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-title">Games Database</Link>
        {user && (
          <nav className="header-nav">
            <Link to="/backlog">Backlog</Link>
            <Link to="/in-progress">In Progress</Link>
            <Link to="/finished">Finished</Link>
          </nav>
        )}
      </div>
      <div className="auth-button" ref={menuRef}>
        {user ? (
          <>
            <button className="avatar-button" onClick={toggleMenu}>
              {getInitial(user.displayName || user.email)}
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </>
        ) : (
          <button onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    </header>
  );
}

export default Header;
