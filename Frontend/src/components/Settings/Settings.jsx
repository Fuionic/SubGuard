import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import './Settings.css';

const Settings = () => {
    const userId = localStorage.getItem('userId');
    const [settings, setSettings] = useState({
        name: '',
        notificationsEnabled: true,
        notificationEmail: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await apiClient.get(`/settings/${userId}`);
                if (response.data) {
                    setSettings({
                        name: response.data.name || '',
                        notificationsEnabled: response.data.notificationsEnabled !== false,
                        notificationEmail: response.data.notificationEmail || ''
                    });
                }
            } catch (err) {
                console.error("Error fetching settings:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) fetchSettings();
    }, [userId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            const response = await apiClient.put(`/settings/${userId}`, settings);
            setMessage({ text: response.data, type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setMessage({ text: 'Failed to update settings', type: 'error' });
        }
    };

    const handleWipeData = async () => {
        if (window.confirm("Are you absolutely sure? This will delete all your subscriptions and linked accounts forever!")) {
            try {
                const response = await apiClient.delete(`/settings/wipe-data/${userId}`);
                setMessage({ text: response.data, type: 'success' });
                // Optionally clear local state or show a more dramatic success message
            } catch (err) {
                setMessage({ text: 'Failed to wipe data', type: 'error' });
            }
        }
    };

    if (isLoading) return <div className="settings-container animate-fade-in">Loading settings...</div>;

    return (
        <div className="settings-container animate-fade-in">
            <header className="settings-header">
                <h2>Account Settings</h2>
                <p>Manage your profile and application preferences.</p>
            </header>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleUpdate}>
                <div className="settings-section">
                    <h2>Profile Information</h2>
                    <div className="form-group">
                        <label>Display Name</label>
                        <input 
                            type="text" 
                            value={settings.name}
                            onChange={(e) => setSettings({...settings, name: e.target.value})}
                            placeholder="Your Name"
                            required
                        />
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Notifications</h2>
                    <div className="form-group toggle-group">
                        <div>
                            <label style={{marginBottom: 0}}>Enable Notifications</label>
                            <p style={{fontSize: '0.85rem', color: '#a5a5a5', margin: 0}}>Get alerts for renewals and inactive accounts.</p>
                        </div>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={settings.notificationsEnabled}
                                onChange={(e) => setSettings({...settings, notificationsEnabled: e.target.checked})}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>Notification Email (Optional)</label>
                        <input 
                            type="email" 
                            value={settings.notificationEmail}
                            onChange={(e) => setSettings({...settings, notificationEmail: e.target.value})}
                            placeholder="Enter different email for alerts"
                        />
                    </div>
                </div>

                <button type="submit" className="save-btn">Save Changes</button>
            </form>

            <div className="settings-section danger-zone">
                <h2>Danger Zone</h2>
                <p style={{marginBottom: '1rem', color: '#a5a5a5'}}>These actions are permanent and cannot be undone.</p>
                <button onClick={handleWipeData} className="wipe-btn">Delete All App Data</button>
            </div>
        </div>
    );
};

export default Settings;
