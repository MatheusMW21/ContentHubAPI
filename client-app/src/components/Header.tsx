import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

function Header({ isLoggedIn, onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <Link to={isLoggedIn ? "/dashboard" : "/"} className="app-title-link">
        <h1 className="app-title">ContentHub</h1>
      </Link>
      
      <nav className="main-nav">
        {isLoggedIn ? (
          <button onClick={onLogout} className="logout">Sair</button>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link btn-primary">Registar</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;