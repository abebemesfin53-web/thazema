import React, { useState, useEffect } from 'react';
import { FaPhone, FaPhoneSlash } from 'react-icons/fa';
import './IncomingCall.css';

const IncomingCall = ({ callData, onAccept, onReject }) => {
  const [caller, setCaller] = useState(null);

  useEffect(() => {
    // Fetch caller info if needed
    // For now, using callerId
  }, [callData]);

  return (
    <div className="incoming-call-overlay">
      <div className="incoming-call-modal">
        <div className="caller-avatar">
          {callData.callerId?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        
        <h2>Incoming {callData.type} call</h2>
        <p className="caller-name">{callData.callerId}</p>
        
        <div className="incoming-call-actions">
          <button onClick={onReject} className="reject-btn">
            <FaPhoneSlash />
            <span>Decline</span>
          </button>
          <button onClick={onAccept} className="accept-btn">
            <FaPhone />
            <span>Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
