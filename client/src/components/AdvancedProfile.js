import React, { useState } from 'react';
import { FaCamera, FaEdit, FaQrcode, FaShare, FaCog, FaHeart, FaPhone, FaVideo } from 'react-icons/fa';
import './AdvancedProfile.css';

const AdvancedProfile = ({ user, isOwnProfile, onUpdateProfile, onCall, onVideoCall }) => {
  const [showQR, setShowQR] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(user.about || '');
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const statusOptions = [
    { emoji: '😊', text: 'Happy', color: '#10b981' },
    { emoji: '😴', text: 'Sleeping', color: '#6b7280' },
    { emoji: '🚗', text: 'Driving', color: '#ef4444' },
    { emoji: '💼', text: 'At work', color: '#3b82f6' },
    { emoji: '🎵', text: 'Listening to music', color: '#8b5cf6' },
    { emoji: '🍕', text: 'Eating', color: '#f59e0b' },
    { emoji: '📚', text: 'Studying', color: '#06b6d4' },
    { emoji: '🏃', text: 'Exercising', color: '#ef4444' },
    { emoji: '✈️', text: 'Traveling', color: '#0ea5e9' },
    { emoji: '🎮', text: 'Gaming', color: '#8b5cf6' }
  ];

  const handleStatusUpdate = (status) => {
    onUpdateProfile({ ...user, status: status.text, statusEmoji: status.emoji });
    setShowStatusOptions(false);
  };

  const handleAboutUpdate = () => {
    onUpdateProfile({ ...user, about: newStatus });
    setEditingStatus(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdateProfile({ ...user, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQRCode = () => {
    // Generate QR code for user profile
    return `https://thazema.app/user/${user.id}`;
  };

  return (
    <div className="advanced-profile">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img src={user.avatar} alt={user.username} className="profile-avatar-large" />
          {isOwnProfile && (
            <label className="avatar-edit-btn">
              <FaCamera />
              <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
            </label>
          )}
          <div className={`status-indicator-large ${user.status}`}></div>
        </div>
        
        <div className="profile-info">
          <h2 className="profile-name">{user.username}</h2>
          <p className="profile-phone">{user.phone}</p>
          <p className="profile-email">{user.email}</p>
        </div>

        {!isOwnProfile && (
          <div className="profile-actions">
            <button className="action-btn primary" onClick={() => onCall(user)}>
              <FaPhone /> Call
            </button>
            <button className="action-btn secondary" onClick={() => onVideoCall(user)}>
              <FaVideo /> Video
            </button>
          </div>
        )}
      </div>

      {/* Status Section */}
      <div className="status-section">
        <div className="section-header">
          <h3>Status</h3>
          {isOwnProfile && (
            <button 
              className="edit-btn"
              onClick={() => setShowStatusOptions(!showStatusOptions)}
            >
              <FaEdit />
            </button>
          )}
        </div>
        
        <div className="current-status">
          {user.statusEmoji && <span className="status-emoji">{user.statusEmoji}</span>}
          <span className="status-text">{user.status || 'Available'}</span>
        </div>

        {showStatusOptions && (
          <div className="status-options">
            {statusOptions.map((status, index) => (
              <button
                key={index}
                className="status-option"
                onClick={() => handleStatusUpdate(status)}
                style={{ borderColor: status.color }}
              >
                <span className="status-emoji">{status.emoji}</span>
                <span className="status-text">{status.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="about-section">
        <div className="section-header">
          <h3>About</h3>
          {isOwnProfile && (
            <button 
              className="edit-btn"
              onClick={() => setEditingStatus(!editingStatus)}
            >
              <FaEdit />
            </button>
          )}
        </div>
        
        {editingStatus ? (
          <div className="edit-about">
            <textarea
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="Write something about yourself..."
              maxLength={139}
              className="about-input"
            />
            <div className="edit-actions">
              <button onClick={handleAboutUpdate} className="save-btn">Save</button>
              <button onClick={() => setEditingStatus(false)} className="cancel-btn">Cancel</button>
            </div>
            <span className="char-count">{newStatus.length}/139</span>
          </div>
        ) : (
          <p className="about-text">{user.about || 'No status set'}</p>
        )}
      </div>

      {/* QR Code Section */}
      {isOwnProfile && (
        <div className="qr-section">
          <div className="section-header">
            <h3>My QR Code</h3>
            <button 
              className="qr-btn"
              onClick={() => setShowQR(!showQR)}
            >
              <FaQrcode />
            </button>
          </div>
          
          {showQR && (
            <div className="qr-code-container">
              <div className="qr-code">
                {/* QR Code would be generated here */}
                <div className="qr-placeholder">
                  <FaQrcode size={100} />
                  <p>QR Code</p>
                  <small>{generateQRCode()}</small>
                </div>
              </div>
              <div className="qr-actions">
                <button className="share-qr-btn">
                  <FaShare /> Share QR Code
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistics Section */}
      <div className="stats-section">
        <h3>Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{user.totalCalls || 0}</span>
            <span className="stat-label">Total Calls</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user.totalMessages || 0}</span>
            <span className="stat-label">Messages Sent</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user.storiesPosted || 0}</span>
            <span className="stat-label">Stories Posted</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user.friendsCount || 0}</span>
            <span className="stat-label">Friends</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {user.recentActivity?.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'call' && <FaPhone />}
                {activity.type === 'message' && <FaHeart />}
                {activity.type === 'story' && <FaCamera />}
              </div>
              <div className="activity-details">
                <span className="activity-text">{activity.description}</span>
                <span className="activity-time">{activity.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings (for own profile) */}
      {isOwnProfile && (
        <div className="profile-settings-section">
          <button className="settings-btn">
            <FaCog /> Profile Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedProfile;