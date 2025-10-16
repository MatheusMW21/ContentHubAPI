import React,  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Login;