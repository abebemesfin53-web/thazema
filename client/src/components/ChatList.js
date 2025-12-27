import React, { useState, useEffect } from 'react';
import { FaCircle, FaCheck, FaCheckDouble } from 'react-icons/fa';
import './ChatList.css';

const ChatList = ({ onChatSelect }) => {
  const [chats, setChats] = useState([
    {
      id: 1,
      user: {
        id: 'john_doe',
        username: 'John Doe',
        avatar: 'J',
        status: 'online',
        hasStory: true
      },
      lastMessage: {
        text: 'Hey! How are you doing?',
        time: '2 min ago',
        unread: 2,
        status: 'delivered', // sent, delivered, read
        isOwn: false
      }
    },
    {
      id: 2,
      user: {
        id: 'jane_smith',
        username: 'Jane Smith',
        avatar: 'J',
        status: 'online',
        hasStory: false
      },
      lastMessage: {
        text: 'Thanks for the call yesterday!',
        time: '1 hour ago',
        unread: 0,
        status: 'read',
        isOwn: true
      }
    },
    {
      id: 3,
      user: {
        id: 'mike_wilson',
        username: 'Mike Wilson',
        avatar: 'M',
        status: 'away',
        hasStory: true
      },
      lastMessage: {
        text: 'Can we schedule a meeting?',
        time: '3 hours ago',
        unread: 1,
        status: 'sent',
        isOwn: false
      }
    },
    {
      id: 4,
      user: {
        id: 'sarah_jones',
        username: 'Sarah Jones',
        avatar: 'S',
        status: 'busy',
        hasStory: false
      },
      lastMessage: {
        text: 'Working on the project now',
        time: 'Yesterday',
        unread: 0,
        status: 'read',
        isOwn: true
      }
    }
  ]);

  const getMessageStatusIcon = (status, isOwn) => {
    if (!isOwn) return null;
    
    switch (status) {
      case 'sent':
        return <FaCheck className="message-status sent" />;
      case 'delivered':
        return <FaCheckDouble className="message-status delivered" />;
      case 'read':
        return <FaCheckDouble className="message-status read" />;
      default:
        return null;
    }
  };

  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <h2>Chats</h2>
        <div className="chat-actions">
          <button className="new-chat-btn">+</button>
        </div>
      </div>

      <div className="stories-section">
        <div className="story-item my-story">
          <div className="story-avatar">
            <div className="avatar-circle">You</div>
            <div className="add-story">+</div>
          </div>
          <span>My Story</span>
        </div>
        
        {chats.filter(chat => chat.user.hasStory).map(chat => (
          <div key={`story-${chat.id}`} className="story-item">
            <div className="story-avatar has-story">
              <div className="avatar-circle">{chat.user.avatar}</div>
            </div>
            <span>{chat.user.username.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      <div className="chat-list">
        {chats.map(chat => (
          <div 
            key={chat.id} 
            className="chat-item"
            onClick={() => onChatSelect(chat)}
          >
            <div className="chat-avatar-container">
              <div className="chat-avatar">
                {chat.user.avatar}
              </div>
              <div className={`status-indicator ${chat.user.status}`}>
                <FaCircle />
              </div>
            </div>

            <div className="chat-content">
              <div className="chat-header">
                <h3 className="chat-username">{chat.user.username}</h3>
                <span className="chat-time">{chat.lastMessage.time}</span>
              </div>
              
              <div className="chat-preview">
                <div className="last-message">
                  {getMessageStatusIcon(chat.lastMessage.status, chat.lastMessage.isOwn)}
                  <span className={chat.lastMessage.unread > 0 ? 'unread' : ''}>
                    {chat.lastMessage.text}
                  </span>
                </div>
                
                {chat.lastMessage.unread > 0 && (
                  <div className="unread-badge">
                    {chat.lastMessage.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;