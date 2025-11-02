import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function Register() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== passwordConfirmation) {
      setError("As senhas não correspondem.");
      return;
    }

    if (username.length < 3) {
      setError("O nome de usuário deve ter pelo menos 3 caracteres.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    const hasSpaces = /\s/.test(username);
    if (hasSpaces) {
      setError("O nome de utilizador não pode conter espaços.");
      return;
    }

    try {
      await registerUser(username, password, passwordConfirmation);
      setSuccess('Registo bem-sucedido! A redirecionar para o login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    }
  };

return (
    <div className="container">
      <h2>Registar Nova Conta</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Username:</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Senha:</label>
          <div className="password-input-container">
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <span 
              className="password-toggle-icon" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Confirmar Senha:</label>
          <div className="password-input-container">
            <input 
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordConfirmation} 
              onChange={(e) => setPasswordConfirmation(e.target.value)} 
              required 
            />
            <span 
              className="password-toggle-icon" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
        </div>
        
        <button type="submit">Registar</button>
      </form>
      {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      <p style={{ marginTop: '1rem' }}>
        Já tem uma conta? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Faça o login</Link>
      </p>
    </div>
  );
}
export default Register;