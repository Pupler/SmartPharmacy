import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = `http://localhost:5171/api/auth/login?username=${username}&password=${password}`;
            const response = await fetch(url);

            if (response.ok) {
                localStorage.setItem('username', username);
                window.alert("Login successfull!");
                navigate('/');
            }
            else {
                window.alert("ERROR SUKA!");
            }

        } catch (err: any) {
            setError(err.message || 'Failed to authenticate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>{isLogin ? 'Login' : 'Register'}</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </button>
                </form>
                
                <div className="auth-switch">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                    type="button" 
                    onClick={() => setIsLogin(!isLogin)}
                    className="switch-btn"
                >
                    {isLogin ? 'Register' : 'Login'}
                </button>
                </div>
                
                {/* Кнопка назад */}
                <button 
                onClick={() => navigate('/')}
                className="back-btn"
                >
                ← Back to Home
                </button>
            </div>
        </div>
    );
}

export default AuthPage;