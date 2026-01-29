import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkAuth } from '../api/auth';
import './MyCabinet.css';
import '../styles/MyCabinetModal.css';

const MyCabinetPage = () => {
    const nagivate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const user = await checkAuth();

                if (!user) {
                    nagivate('/auth');
                    return;
                }

                setUsername(user.username);
            } catch {
                nagivate('/');
            }
        };

        initAuth();
    }, []);

    const [username, setUsername] = useState('User');

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const [showModal, setShowModal] = useState(false);

    const [newMdc, setNewMdc] = useState({
        name: '',
        dosage: '',
        notes: ''
    });

    return (
        <div className="cabinet-page">
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                    <h3>Add medication</h3>

                    <input
                        placeholder="Name"
                        value={newMdc.name}
                        onChange={e => setNewMdc({ ...newMdc, name: e.target.value })}
                    />

                    <input
                        placeholder="Dosage"
                        value={newMdc.dosage}
                        onChange={e => setNewMdc({ ...newMdc, dosage: e.target.value })}
                    />

                    <textarea
                        placeholder="Notes"
                        value={newMdc.notes}
                        onChange={e => setNewMdc({ ...newMdc, notes: e.target.value })}
                    />

                    <div className="modal-actions">
                        <button>Save</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                    </div>
                </div>
            )}
            <div className="cabinet-container">
                <nav className="details-nav">
                    <Link to="/" className="back-btn">
                    ← Home Page
                    </Link>
                </nav>

                <header className="cabinet-header">
                    <h1>👨‍⚕️ {username}'s Medical Cabinet</h1>
                    <button className="theme-btn" onClick={toggleTheme}>
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </header>

                <main className="cabinet-main">
                    <div className="welcome-section">
                        <h2>Welcome to your health dashboard</h2>
                        <p>Track medications, appointments, and health metrics</p>
                    </div>

                    <div className="quick-stats">
                        <div className="stat-card">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Medications</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Appointments</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Reminders</span>
                        </div>
                    </div>

                    <div className="quick-actions">
                        <button className="action-btn" onClick={() => setShowModal(true)}>💊 Add Medication</button>
                        <button className="action-btn">📅 Add Appointment</button>
                        <button className="action-btn">⏰ Set Reminder</button>
                    </div>

                    <div className="recent-section">
                        <h3>Recent Activity</h3>
                        <p className="empty-message">No recent activity yet</p>
                    </div>
                </main>
            </div>

            <footer className="footer">
                <p>© 2026 SmartPharmacy</p>
            </footer>
        </div>
    );
};

export default MyCabinetPage;