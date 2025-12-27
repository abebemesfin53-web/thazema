import React, { useState, useEffect } from 'react';
import { FaPhone, FaVideo, FaPhoneSlash, FaSignal, FaInfoCircle } from 'react-icons/fa';
import { MdCallReceived, MdCallMade, MdCallMissed } from 'react-icons/md';
import './CallHistory.css';

const CallHistory = ({ onStartCall }) => {
  const [calls, setCalls] = useState([
    {
      id: 1,
      user: {
        id: 'john_doe',
        username: 'John Doe',
        avatar: 'J',
        phone: '+251911234567'
      },
      type: 'video', // 'audio' or 'video'
      direction: 'outgoing', // 'incoming', 'outgoing', 'missed'
      status: 'completed',
      duration: 320, // seconds
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      quality: 'excellent' // 'poor', 'fair', 'good', 'excellent'
    },
    {
      id: 2,
      user: {
        id: 'jane_smith',
        username: 'Jane Smith',
        avatar: 'J',
        phone: '+251922345678'
      },
      type: 'audio',
      direction: 'incoming',
      status: 'completed',
      duration: 180,
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      quality: 'good'
    },
    {
      id: 3,
      user: {
        id: 'mike_wilson',
        username: 'Mike Wilson',
        avatar: 'M',
        phone: '+251933456789'
      },
      type: 'video',
      direction: 'missed',
      status: 'missed',
      duration: 0,
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      quality: null
    },
    {
      id: 4,
      user: {
        id: 'sarah_jones',
        username: 'Sarah Jones',
        avatar: 'S',
        phone: '+251944567890'
      },
      type: 'audio',
      direction: 'outgoing',
      status: 'rejected',
      duration: 0,
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      quality: null
    },
    {
      id: 5,
      user: {
        id: 'david_brown',
        username: 'David Brown',
        avatar: 'D',
        phone: '+251955678901'
      },
      type: 'video',
      direction: 'incoming',
      status: 'completed',
      duration: 450,
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      quality: 'fair'
    }
  ]);

  const [filter, setFilter] = useState('all'); // 'all', 'missed', 'audio', 'video'

  const formatDuration = (seconds) => {
    if (seconds === 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const getCallIcon = (call) => {
    const iconProps = { className: `call-direction-icon ${call.direction}` };
    
    if (call.direction === 'missed') {
      return <MdCallMissed {...iconProps} />;
    } else if (call.direction === 'incoming') {
      return <MdCallReceived {...iconProps} />;
    } else {
      return <MdCallMade {...iconProps} />;
    }
  };

  const getQualityIcon = (quality) => {
    if (!quality) return null;
    
    const bars = {
      poor: 1,
      fair: 2,
      good: 3,
      excellent: 4
    };

    return (
      <div className={`signal-quality ${quality}`} title={`Call quality: ${quality}`}>
        <FaSignal />
        <span className="quality-bars">
          {Array.from({ length: 4 }, (_, i) => (
            <div 
              key={i} 
              className={`bar ${i < bars[quality] ? 'active' : ''}`}
            />
          ))}
        </span>
      </div>
    );
  };

  const filteredCalls = calls.filter(call => {
    switch (filter) {
      case 'missed':
        return call.direction === 'missed';
      case 'audio':
        return call.type === 'audio';
      case 'video':
        return call.type === 'video';
      default:
        return true;
    }
  });

  const filters = [
    { id: 'all', label: 'All Calls', count: calls.length },
    { id: 'missed', label: 'Missed', count: calls.filter(c => c.direction === 'missed').length },
    { id: 'audio', label: 'Audio', count: calls.filter(c => c.type === 'audio').length },
    { id: 'video', label: 'Video', count: calls.filter(c => c.type === 'video').length }
  ];

  return (
    <div className="call-history-container">
      <div className="call-history-header">
        <h2>Call History</h2>
        <button className="clear-history-btn">Clear All</button>
      </div>

      <div className="call-filters">
        {filters.map(filterItem => (
          <button
            key={filterItem.id}
            className={`filter-btn ${filter === filterItem.id ? 'active' : ''}`}
            onClick={() => setFilter(filterItem.id)}
          >
            {filterItem.label}
            {filterItem.count > 0 && (
              <span className="filter-count">{filterItem.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="call-list">
        {filteredCalls.length === 0 ? (
          <div className="no-calls">
            <FaPhone className="no-calls-icon" />
            <h3>No calls found</h3>
            <p>Your call history will appear here</p>
          </div>
        ) : (
          filteredCalls.map(call => (
            <div key={call.id} className="call-item">
              <div className="call-user-info">
                <div className="call-avatar">
                  {call.user.avatar}
                </div>
                <div className="call-details">
                  <div className="call-header">
                    <h3>{call.user.username}</h3>
                    <div className="call-meta">
                      {getCallIcon(call)}
                      {call.type === 'video' ? <FaVideo className="call-type-icon" /> : <FaPhone className="call-type-icon" />}
                    </div>
                  </div>
                  <div className="call-info">
                    <span className="call-timestamp">{formatTimestamp(call.timestamp)}</span>
                    {call.duration > 0 && (
                      <span className="call-duration">{formatDuration(call.duration)}</span>
                    )}
                    {call.status === 'missed' && (
                      <span className="call-status missed">Missed</span>
                    )}
                    {call.status === 'rejected' && (
                      <span className="call-status rejected">Declined</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="call-actions">
                {getQualityIcon(call.quality)}
                <button 
                  className="info-btn"
                  title="Call details"
                >
                  <FaInfoCircle />
                </button>
                <button
                  className="callback-btn audio"
                  onClick={() => onStartCall(call.user, 'audio')}
                  title="Audio call"
                >
                  <FaPhone />
                </button>
                <button
                  className="callback-btn video"
                  onClick={() => onStartCall(call.user, 'video')}
                  title="Video call"
                >
                  <FaVideo />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CallHistory;