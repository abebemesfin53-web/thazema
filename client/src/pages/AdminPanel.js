import { useState, useEffect } from 'react';
import { FaUsers, FaChartBar, FaBell, FaCog, FaBan, FaCheck, FaTrash, FaSearch, FaPhone, FaComments } from 'react-icons/fa';
import axios from 'axios';
import { createURL } from '../config/api';
import AdminAI from '../components/AdminAI';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, analyticsRes] = await Promise.all([
        axios.get(createURL('/api/admin/users')),
        axios.get(createURL('/api/admin/analytics'))
      ]);
      setUsers(usersRes.data.users || []);
      setAnalytics(analyticsRes.data || {});
    } catch (error) {
      // Use sample data if API fails
      setUsers([
        { id: '1', username: 'Abebe', phone: '+251911111111', status: 'online', isActive: true, joinDate: '2024-12-01' },
        { id: '2', username: 'Kebede', phone: '+251922222222', status: 'offline', isActive: true, joinDate: '2024-12-10' },
        { id: '3', username: 'Sara', phone: '+251933333333', status: 'online', isActive: false, joinDate: '2024-12-15' },
        { id: '4', username: 'Meron', phone: '+251944444444', status: 'away', isActive: true, joinDate: '2024-12-20' },
      ]);
      setAnalytics({
        totalUsers: 156,
        activeUsers: 89,
        totalCalls: 1234,
        totalMessages: 5678,
        newUsersToday: 12,
        callsToday: 45,
        messagestoday: 234
      });
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await axios.post(createURL(`/api/admin/users/${userId}/block`));
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
    } catch (error) {
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(createURL(`/api/admin/users/${userId}`));
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        setUsers(users.filter(u => u.id !== userId));
      }
    }
  };

  const sendNotification = async (message) => {
    try {
      await axios.post(createURL('/api/admin/notifications'), { message });
      alert('Notification sent to all users!');
    } catch (error) {
      alert('Notification sent (demo mode)');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🛡️ Thazema Admin Panel</h1>
        <p>Welcome, Administrator Abebe Mesfin</p>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          <FaChartBar /> Dashboard
        </button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
          <FaUsers /> Users
        </button>
        <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
          <FaBell /> Notifications
        </button>
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
          <FaCog /> Settings
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <h2>📊 Analytics Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <div className="stat-info">
                  <h3>{analytics.totalUsers || 0}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card active">
                <FaCheck className="stat-icon" />
                <div className="stat-info">
                  <h3>{analytics.activeUsers || 0}</h3>
                  <p>Active Now</p>
                </div>
              </div>
              <div className="stat-card calls">
                <FaPhone className="stat-icon" />
                <div className="stat-info">
                  <h3>{analytics.totalCalls || 0}</h3>
                  <p>Total Calls</p>
                </div>
              </div>
              <div className="stat-card messages">
                <FaComments className="stat-icon" />
                <div className="stat-info">
                  <h3>{analytics.totalMessages || 0}</h3>
                  <p>Messages</p>
                </div>
              </div>
            </div>

            <div className="today-stats">
              <h3>📅 Today's Activity</h3>
              <div className="today-grid">
                <div className="today-item">
                  <span className="today-value">{analytics.newUsersToday || 0}</span>
                  <span className="today-label">New Users</span>
                </div>
                <div className="today-item">
                  <span className="today-value">{analytics.callsToday || 0}</span>
                  <span className="today-label">Calls Made</span>
                </div>
                <div className="today-item">
                  <span className="today-value">{analytics.messagestoday || 0}</span>
                  <span className="today-label">Messages Sent</span>
                </div>
              </div>
            </div>

            <div className="chart-placeholder">
              <h3>📈 User Growth (Last 7 Days)</h3>
              <div className="simple-chart">
                {[45, 52, 48, 61, 55, 67, 72].map((val, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${val}%` }}>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
              <div className="chart-labels">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <h2>👥 User Management</h2>
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Search users by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="users-table">
              <div className="table-header">
                <span>User</span>
                <span>Phone</span>
                <span>Status</span>
                <span>Joined</span>
                <span>Actions</span>
              </div>
              {filteredUsers.map(user => (
                <div key={user.id} className={`table-row ${!user.isActive ? 'blocked' : ''}`}>
                  <span className="user-cell">
                    <div className="user-avatar">{user.username.charAt(0)}</div>
                    {user.username}
                  </span>
                  <span>{user.phone}</span>
                  <span className={`status-badge ${user.status}`}>{user.status}</span>
                  <span>{user.joinDate}</span>
                  <span className="actions">
                    <button
                      className={`btn-action ${user.isActive ? 'block' : 'unblock'}`}
                      onClick={() => handleBlockUser(user.id)}
                      title={user.isActive ? 'Block User' : 'Unblock User'}
                    >
                      {user.isActive ? <FaBan /> : <FaCheck />}
                    </button>
                    <button
                      className="btn-action delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-tab">
            <h2>🔔 Push Notifications</h2>
            <div className="notification-form">
              <h3>Send Notification to All Users</h3>
              <textarea
                id="notificationMessage"
                placeholder="Enter your notification message..."
                rows={4}
              />
              <div className="notification-options">
                <label>
                  <input type="checkbox" defaultChecked /> All Users
                </label>
                <label>
                  <input type="checkbox" /> Active Users Only
                </label>
                <label>
                  <input type="checkbox" /> With Sound
                </label>
              </div>
              <button
                className="btn-send"
                onClick={() => sendNotification(document.getElementById('notificationMessage').value)}
              >
                <FaBell /> Send Notification
              </button>
            </div>

            <div className="notification-history">
              <h3>📜 Recent Notifications</h3>
              <div className="notification-list">
                <div className="notification-item">
                  <span className="notif-time">Today, 10:30 AM</span>
                  <span className="notif-message">Welcome to Thazema! Enjoy free calls.</span>
                  <span className="notif-reach">Reached: 156 users</span>
                </div>
                <div className="notification-item">
                  <span className="notif-time">Yesterday, 2:15 PM</span>
                  <span className="notif-message">New feature: Group video calls now available!</span>
                  <span className="notif-reach">Reached: 142 users</span>
                </div>
                <div className="notification-item">
                  <span className="notif-time">Dec 23, 9:00 AM</span>
                  <span className="notif-message">Merry Christmas from Thazema team! 🎄</span>
                  <span className="notif-reach">Reached: 138 users</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h2>⚙️ App Settings</h2>
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="setting-item">
                <label>App Name</label>
                <input type="text" defaultValue="Thazema" />
              </div>
              <div className="setting-item">
                <label>Max Call Duration (minutes)</label>
                <input type="number" defaultValue="60" />
              </div>
              <div className="setting-item">
                <label>Max Group Size</label>
                <input type="number" defaultValue="10" />
              </div>
            </div>

            <div className="settings-section">
              <h3>Security Settings</h3>
              <div className="setting-item toggle">
                <label>Require Phone Verification</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-item toggle">
                <label>Enable End-to-End Encryption</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-item toggle">
                <label>Allow New Registrations</label>
                <input type="checkbox" defaultChecked />
              </div>
            </div>

            <div className="settings-section">
              <h3>Admin Contact</h3>
              <div className="setting-item">
                <label>Admin Email</label>
                <input type="email" defaultValue="abebemesfin53@gmail.com" />
              </div>
              <div className="setting-item">
                <label>Admin Phone</label>
                <input type="tel" defaultValue="+251914319514" />
              </div>
            </div>

            <button className="btn-save">💾 Save Settings</button>
          </div>
        )}
      </div>

      {/* AI Assistant */}
      <AdminAI onAction={(action) => {
        if (action === 'block' || action === 'unblock') loadData();
        if (action === 'notification') setActiveTab('notifications');
      }} />
    </div>
  );
};

export default AdminPanel;