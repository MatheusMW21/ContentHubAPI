import React,  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginResponse {
    token: string;
}

function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const apiUrl = 'https://localhost:7014/api/Auth/login';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Credenciais inválidas. Tente novamente.');
            }

            const data = await response.json() as LoginResponse;

            localStorage.setItem('jwt_token', data.token);
            navigate('/'); 
            window.location.reload();
        } catch (err: any) {
            setError(err.message);
        }
    };

return (
    <div>
      <h2>Login</h2>
      {/* Adicione a className ao formulário */}
      <form onSubmit={handleLogin} className="login-form">
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
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
      <p style={{ marginTop: '1rem' }}>
        Não tem uma conta? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Registe-se aqui</Link>
      </p>
    </div>
  );
}

export default Login;