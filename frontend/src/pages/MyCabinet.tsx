import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkAuth } from '../api/auth';
import Notification from '../components/Notification/Notification';
import { showNotification } from '../utils/notificationHelpers';
import { initialNotificationState, type NotificationState } from '../types/notification';
import './MyCabinet.css';
import '../styles/MyCabinetModal.css';

interface Medication {
  id: number;
  userId: number;
  name: string;
  dosage: string;
  notes: string;
}

const MyCabinetPage = () => {
    const nagivate = useNavigate();

    const [medications, setMedications] = useState<Medication[]>([]);

    const fetchMedications = async () => {
        const token = localStorage.getItem('token');

        const response = await fetch('api/medications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        setMedications(data);
    };

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
        fetchMedications();
    }, []);

    const [username, setUsername] = useState('User');

    const [notification, setNotification] = useState<NotificationState>(initialNotificationState);

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

    type ModalType = 'add-mdc' | 'add-appointment' | 'set-reminder' | 'medications-list' | 'appointments-list' | 'reminders-list' | null;
    const [modalType, setModalType] = useState<ModalType>(null);

    const [activities, setActivities] = useState<string[]>([]);

    const addActivity = (message: string) => {
        setActivities(prev => [message, ...prev]);
    };

    const [newMdc, setNewMdc] = useState({
        name: '',
        dosage: '',
        notes: ''
    });

    const handleSaveMedication = async () => {
        const token = localStorage.getItem('token');

        const response = await fetch('api/medications/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newMdc)
        });

        const text = await response.text();

        let data: any = null;

        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            throw new Error('Invalid server response!');
        }

        if (!response.ok) {
            showNotification(setNotification, data?.message || "Failed to add medication!", "error");
            setNewMdc({
                name: '',
                dosage: '',
                notes: ''
            })
            return;
        }

        showNotification(setNotification, data?.message || "Medication added!", "success");
        addActivity(`Added medication: ${newMdc.name}`);
        setNewMdc({
            name: '',
            dosage: '',
            notes: ''
        })
        
        await fetchMedications();
    };

    return (
        <div className="cabinet-page">
            {notification.show && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ ...notification, show: false })}
                />
            )}

            {modalType && (
            <div className="modal-overlay">
                <div className="modal">

                {modalType === 'add-mdc' && (
                    <>
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
                            <button onClick={handleSaveMedication}>Save</button>
                            <button onClick={() => setModalType(null)}>Cancel</button>
                        </div>
                    </>
                )}

                {modalType === 'medications-list' && (
                    <>
                    <h3>Your medications</h3>

                    {medications.length === 0 ? (
                        <p>No medications yet</p>
                    ) : (
                        <ul className="medication-list">
                            {medications.map(m => (
                                <li key={m.id} className="medication-item">
                                    <div className="medication-header">
                                        <span className="medication-name">{m.name}</span>
                                        <span className="medication-dosage">{m.dosage}</span>
                                    </div>

                                    {m.notes && (
                                        <div className="medication-notes">
                                        📝 {m.notes}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button onClick={() => setModalType(null)}>Close</button>
                    </>
                )}

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
                        <div
                        className="stat-card"
                        onClick={() => setModalType('medications-list')}
                        >
                            <span className="stat-number">{medications.length}</span>
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
                        <button className="action-btn" onClick={() => setModalType('add-mdc')}>💊 Add Medication</button>
                        <button className="action-btn">📅 Add Appointment</button>
                        <button className="action-btn">⏰ Set Reminder</button>
                    </div>

                <div className="recent-section">
                    <h3>Recent Activity</h3>
                    {activities.length == 0 ? (
                        <p className="empty-message">No recent activity yet</p>
                    ) : (
                        <ul>
                        {activities.map((act, i) => <li key={i}>{act}</li>)}
                        </ul>
                    )}
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