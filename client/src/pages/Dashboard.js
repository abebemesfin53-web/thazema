import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ContactList from '../components/ContactList';
import NearbyUsers from '../components/NearbyUsers';
import ChatList from '../components/ChatList';
import DiscoverFeed from '../components/DiscoverFeed';
import CallHistory from '../components/CallHistory';
import ProfileSettings from '../components/ProfileSettings';
import CallScreen from '../components/CallScreen';
import IncomingCall from '../components/IncomingCall';
import TabNavigation from '../components/TabNavigation';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [contacts, setContacts] = useState([]);
  const [inCall, setInCall] = useState(false);
  const [callData, setCallData] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubTab, setActiveSubTab] = useState('contacts');

  useEffect(() => {
    if (socket) {
      socket.on('call:incoming', (data) => {
        setIncomingCall(data);
      });

      socket.on('call:rejected', () => {
        alert('Call was rejected');
        setInCall(false);
        setCallData(null);
      });

      socket.on('call:ended', () => {
        setInCall(false);
        setCallData(null);
      });

      return () => {
        socket.off('call:incoming');
        socket.off('call:rejected');
        socket.off('call:ended');
      };
    }
  }, [socket]);

  const handleStartCall = (contact, type) => {
    setCallData({
      contact,
      type,
      isCaller: true
    });
    setInCall(true);
  };

  const handleAcceptCall = () => {
    setCallData({
      ...incomingCall,
      isCaller: false
    });
    setInCall(true);
    setIncomingCall(null);
  };

  const handleRejectCall = () => {
    if (socket && incomingCall) {
      socket.emit('call:reject', {
        callId: incomingCall.callId,
        callerId: incomingCall.callerId
      });
    }
    setIncomingCall(null);
  };

  const handleEndCall = () => {
    setInCall(false);
    setCallData(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="home-content">
            <div className="dashboard-header">
              <h1>Thazema</h1>
              <div className="user-info">
                <span>{user?.username}</span>
                <button onClick={() => window.location.href = '/admin'} className="admin-btn">Admin</button>
                <button onClick={() => window.location.href = '/about'} className="about-btn">About</button>
                <button onClick={logout} className="logout-btn">Logout</button>
              </div>
            </div>
            <div className="dashboard-tabs">
              <button 
                className={`tab-btn ${activeSubTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('contacts')}
              >
                All Contacts
              </button>
              <button 
                className={`tab-btn ${activeSubTab === 'nearby' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('nearby')}
              >
                Nearby Users
              </button>
            </div>
            {activeSubTab === 'contacts' ? (
              <ContactList onStartCall={handleStartCall} />
            ) : (
              <NearbyUsers onStartCall={handleStartCall} />
            )}
          </div>
        );
      case 'chats':
        return (
          <div className="chats-content">
            <ChatList onChatSelect={(chat) => console.log('Selected chat:', chat)} />
          </div>
        );
      case 'calls':
        return (
          <div className="calls-content">
            <CallHistory onStartCall={handleStartCall} />
          </div>
        );
      case 'discover':
        return (
          <div className="discover-content">
            <DiscoverFeed />
          </div>
        );
      case 'profile':
        return (
          <div className="profile-content">
            <ProfileSettings user={user} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {inCall ? (
        <CallScreen callData={callData} onEndCall={handleEndCall} />
      ) : (
        <>
          {renderContent()}
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            unreadCount={0}
            missedCalls={0}
          />
        </>
      )}

      {incomingCall && (
        <IncomingCall
          callData={incomingCall}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
    </div>
  );
};

export default Dashboard;
