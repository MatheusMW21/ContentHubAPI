import React from 'react';

interface HeaderProps {
  onLogout: () => void;
}

function Header({ onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <h1 className="app-title">ContentHub</h1>
      <button onClick={onLogout} className="logout">Sair</button>
    </header>
  );
}

export default Header;