import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/AuthPage.css';
import Notification from "../components/Notification/Notification";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({ show: false, message: '', type: 'success' });

    const navigate = useNavigate();

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({
            show: true,
            message,
            type
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = (isLogin ? 'login' : 'register');
            const url = `http://localhost:5171/api/auth/${endpoint}?username=${username}&password=${password}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            localStorage.setItem('username', username);
            showNotification(data.message, 'success');
            setTimeout(() => navigate('/'), 1500);

        } catch (err: any) {
            showNotification(err.message || 'Failed to authenticate!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {notification.show && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({...notification, show: false})}
                />
            )}
            <div className="auth-container">
                <h1>{isLogin ? 'Login' : 'Register'}</h1>
                
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
                
                {/* Button back to home */}
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