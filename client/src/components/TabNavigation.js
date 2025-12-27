import React from 'react';
import { FaHome, FaCompass, FaPhone, FaUser, FaComments } from 'react-icons/fa';
import './TabNavigation.css';

const TabNavigation = ({ activeTab, onTabChange, unreadCount = 0, missedCalls = 0 }) => {
  const tabs = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: <FaHome />,
      badge: unreadCount > 0 ? unreadCount : null
    },
    { 
      id: 'discover', 
      label: 'Discover', 
      icon: <FaCompass />
    },
    { 
      id: 'chats', 
      label: 'Chats', 
      icon: <FaComments />,
      badge: unreadCount > 0 ? unreadCount : null
    },
    { 
      id: 'calls', 
      label: 'Calls', 
      icon: <FaPhone />,
      badge: missedCalls > 0 ? missedCalls : null
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: <FaUser />
    }
  ];

  return (
    <div className="tab-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <div className="tab-icon-container">
            <span className="tab-icon">{tab.icon}</span>
            {tab.badge && (
              <span className="tab-badge">{tab.badge > 99 ? '99+' : tab.badge}</span>
            )}
          </div>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;