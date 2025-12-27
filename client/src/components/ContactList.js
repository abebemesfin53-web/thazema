import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaVideo, FaPhone } from 'react-icons/fa';
import './ContactList.css';

const ContactList = ({ onStartCall }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading contacts...</div>;
  }

  return (
    <div className="contact-list-container">
      <h2>Contacts</h2>
      <div className="contact-list">
        {users.map((user) => (
          <div key={user._id} className="contact-card">
            <div className="contact-info">
              <div className="contact-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{user.username}</h3>
                <span className={`status ${user.status}`}>{user.status}</span>
              </div>
            </div>
            <div className="contact-actions">
              <button
                onClick={() => onStartCall(user, 'audio')}
                className="call-btn audio"
                title="Audio call"
              >
                <FaPhone />
              </button>
              <button
                onClick={() => onStartCall(user, 'video')}
                className="call-btn video"
                title="Video call"
              >
                <FaVideo />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
