import React, { useState } from 'react';
import { FaUser, FaCog, FaQrcode, FaEdit, FaPhone, FaEnvelope, FaShieldAlt, FaBell, FaDatabase, FaEye, FaMicrophone, FaVideo, FaLanguage, FaPalette, FaQuestionCircle, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './ProfileSettings.css';

const ProfileSettings = ({ user }) => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: user?.username || '',
    about: user?.about || 'Hey there! I am using Thazema.',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const generateQRCode = () => {
    // In a real app, this would generate an actual QR code
    return `thazema://user/${user?.id}`;
  };

  const settingsMenu = [
    {
      category: 'Account Settings',
      items: [
        { id: 'change-number', label: 'Change Number', icon: <FaPhone />, description: 'Update phone number' },
        { id: 'privacy', label: 'Privacy', icon: <FaEye />, description: 'Last seen, profile photo, status' },
        { id: 'security', label: 'Security', icon: <FaShieldAlt />, description: 'Two-step verification, app lock' },
        { id: 'delete-account', label: 'Delete Account', icon: <FaSignOutAlt />, description: 'Permanent account deletion', danger: true }
      ]
    },
    {
      category: 'Chat Settings',
      items: [
        { id: 'chat-wallpaper', label: 'Chat Wallpaper', icon: <FaPalette />, description: 'Custom background for chats' },
        { id: 'chat-backup', label: 'Chat Backup', icon: <FaDatabase />, description: 'Backup to cloud/local storage' },
        { id: 'media-download', label: 'Media Auto-Download', icon: <FaDatabase />, description: 'Configure by network type' }
      ]
    },
    {
      category: 'Notifications',
      items: [
        { id: 'message-notifications', label: 'Message Notifications', icon: <FaBell />, description: 'Sound, vibration, popup' },
        { id: 'group-notifications', label: 'Group Notifications', icon: <FaBell />, description: 'Separate settings for groups' },
        { id: 'do-not-disturb', label: 'Do Not Disturb', icon: <FaBell />, description: 'Schedule quiet hours' }
      ]
    },
    {
      category: 'Voice and Video Calls',
      items: [
        { id: 'low-data-usage', label: 'Low Data Usage', icon: <FaDatabase />, description: 'Optimize for slow networks' },
        { id: 'noise-suppression', label: 'Noise Suppression', icon: <FaMicrophone />, description: 'Clear audio during calls' },
        { id: 'video-quality', label: 'Video Quality', icon: <FaVideo />, description: 'Adjust resolution' }
      ]
    },
    {
      category: 'Other Settings',
      items: [
        { id: 'language', label: 'Language', icon: <FaLanguage />, description: 'App interface language' },
        { id: 'theme', label: 'Theme', icon: <FaPalette />, description: 'Light/Dark mode' },
        { id: 'help-center', label: 'Help Center', icon: <FaQuestionCircle />, description: 'FAQ and support' },
        { id: 'invite-friends', label: 'Invite Friends', icon: <FaUserPlus />, description: 'Share Thazema with contacts' }
      ]
    }
  ];

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the user
    console.log('Saving profile:', editedUser);
    setIsEditing(false);
  };

  const renderProfileSection = () => (
    <div className="profile-section">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {user?.username?.charAt(0)?.toUpperCase()}
        </div>
        <div className="profile-info">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editedUser.username}
                onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                className="edit-input"
                placeholder="Username"
              />
              <textarea
                value={editedUser.about}
                onChange={(e) => setEditedUser({...editedUser, about: e.target.value})}
                className="edit-textarea"
                placeholder="About"
                maxLength={139}
              />
              <div className="edit-actions">
                <button onClick={handleSaveProfile} className="save-btn">Save</button>
                <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h2>{user?.username}</h2>
              <p className="about-text">{user?.about || 'Hey there! I am using Thazema.'}</p>
              <div className="contact-info">
                {user?.email && (
                  <div className="contact-item">
                    <FaEnvelope />
                    <span>{user.email}</span>
                  </div>
                )}
                {user?.phone && (
                  <div className="contact-item">
                    <FaPhone />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
              <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
                <FaEdit /> Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile-actions">
        <div className="action-card">
          <FaQrcode className="action-icon" />
          <div className="action-info">
            <h3>My QR Code</h3>
            <p>Share your code for adding friends</p>
          </div>
          <button className="action-btn">Show QR</button>
        </div>
        
        <div className="thazema-id">
          <h3>Thazema ID</h3>
          <p>@{user?.username}</p>
          <span className="id-description">Your unique Thazema identifier</span>
        </div>
      </div>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h2>Settings</h2>
      </div>
      
      {settingsMenu.map((category, categoryIndex) => (
        <div key={categoryIndex} className="settings-category">
          <h3 className="category-title">{category.category}</h3>
          <div className="settings-items">
            {category.items.map((item) => (
              <div 
                key={item.id} 
                className={`settings-item ${item.danger ? 'danger' : ''}`}
                onClick={() => console.log('Settings item clicked:', item.id)}
              >
                <div className="settings-item-icon">
                  {item.icon}
                </div>
                <div className="settings-item-content">
                  <h4>{item.label}</h4>
                  <p>{item.description}</p>
                </div>
                <div className="settings-item-arrow">›</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="logout-section">
        <button onClick={logout} className="logout-btn-full">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> }
  ];

  return (
    <div className="profile-settings-container">
      <div className="profile-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`profile-tab ${activeSection === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSection(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="profile-content-area">
        {activeSection === 'profile' ? renderProfileSection() : renderSettingsSection()}
      </div>
    </div>
  );
};

export default ProfileSettings;