import React, { useState, useEffect } from 'react';
import { FaBell, FaPhone, FaVideo, FaHeart, FaComment, FaUserPlus, FaTimes } from 'react-icons/fa';
import './NotificationCenter.css';

const NotificationCenter = ({ notifications, onMarkAsRead, onClearAll, onNotificationClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'call': return <FaPhone className="notification-icon call" />;
      case 'video_call': return <FaVideo className="notification-icon video" />;
      case 'message': return <FaComment className="notification-icon message" />;
      case 'like': return <FaHeart className="notification-icon like" />;
      case 'friend_request': return <FaUserPlus className="notification-icon friend" />;
      default: return <FaBell className="notification-icon default" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick(notification);
    setIsOpen(false);
  };

  const groupNotificationsByDate = (notifications) => {
    const groups = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    
    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <div className="notification-center">
      {/* Notification Bell */}
      <button 
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {notifications.length > 0 && (
                <button onClick={onClearAll} className="clear-all-btn">
                  Clear All
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="notification-content">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <FaBell size={48} />
                <p>No notifications yet</p>
                <small>You'll see notifications here when you get them</small>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
                <div key={date} className="notification-group">
                  <div className="notification-date">
                    {date === new Date().toDateString() ? 'Today' : 
                     date === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' : 
                     new Date(date).toLocaleDateString()}
                  </div>
                  
                  {dayNotifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-avatar">
                        {notification.avatar ? (
                          <img src={notification.avatar} alt={notification.sender} />
                        ) : (
                          getNotificationIcon(notification.type)
                        )}
                      </div>
                      
                      <div className="notification-details">
                        <div className="notification-text">
                          <strong>{notification.sender}</strong> {notification.message}
                        </div>
                        <div className="notification-time">
                          {formatTime(notification.timestamp)}
                        </div>
                      </div>
                      
                      {!notification.read && <div className="unread-dot"></div>}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {notifications
          .filter(n => n.showToast)
          .slice(0, 3)
          .map(notification => (
            <div key={notification.id} className="toast-notification">
              <div className="toast-content">
                {getNotificationIcon(notification.type)}
                <div className="toast-text">
                  <strong>{notification.sender}</strong>
                  <span>{notification.message}</span>
                </div>
              </div>
              <button 
                className="toast-close"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <FaTimes />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotificationCenter;