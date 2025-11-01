import { type JSX } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header'; 
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage'; 
import HomePage from './pages/HomePage';     
import './App.css';

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
  const isLoggedIn = !!token; 
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;