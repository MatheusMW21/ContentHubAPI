import React, { type JSX } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('jwt_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const token = localStorage.getItem('jwt_token');

  return (
    <div>
      <h1>Meu Hub de Conteúdo</h1>
      <Routes>
        <Route 
          path="/login" 
          element={token ? <Navigate to="/" replace /> : <Login />} 
        />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;