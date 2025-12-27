import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaUsers, FaExpand } from 'react-icons/fa';
import './GroupCall.css';

const GroupCall = ({ participants, onEndCall, callId }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeParticipant, setActiveParticipant] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({});

  useEffect(() => {
    // Initialize group call
    initializeGroupCall();
    return () => cleanup();
  }, []);

  const initializeGroupCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to get user media:', error);
    }
  };

  const cleanup = () => {
    // Clean up media streams
    if (localVideoRef.current?.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Implement actual mute functionality
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // Implement actual video toggle
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleEndCall = () => {
    cleanup();
    onEndCall();
  };

  return (
    <div className={`group-call ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="group-call-header">
        <div className="call-info">
          <FaUsers className="group-icon" />
          <span className="participant-count">{participants.length} participants</span>
        </div>
        <button className="fullscreen-btn" onClick={toggleFullscreen}>
          <FaExpand />
        </button>
      </div>

      <div className="video-grid">
        {/* Main video (active speaker) */}
        <div className="main-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="video-element"
          />
          <div className="participant-info">
            <span className="participant-name">You</span>
            {isMuted && <FaMicrophoneSlash className="muted-icon" />}
          </div>
        </div>

        {/* Participant videos */}
        <div className="participant-videos">
          {participants.map((participant, index) => (
            <div key={participant.id} className="participant-video">
              <video
                ref={el => remoteVideosRef.current[participant.id] = el}
                autoPlay
                playsInline
                className="video-element"
              />
              <div className="participant-info">
                <span className="participant-name">{participant.name}</span>
                {participant.isMuted && <FaMicrophoneSlash className="muted-icon" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call controls */}
      <div className="group-call-controls">
        <button 
          className={`control-btn ${isMuted ? 'muted' : ''}`}
          onClick={toggleMute}
        >
          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>

        <button 
          className={`control-btn ${isVideoOff ? 'video-off' : ''}`}
          onClick={toggleVideo}
        >
          {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
        </button>

        <button className="control-btn end-call" onClick={handleEndCall}>
          <FaPhoneSlash />
        </button>
      </div>

      {/* Participant list */}
      <div className="participant-list">
        <h4>Participants ({participants.length + 1})</h4>
        <div className="participant-item">
          <div className="participant-avatar">You</div>
          <span>You (Host)</span>
        </div>
        {participants.map(participant => (
          <div key={participant.id} className="participant-item">
            <div className="participant-avatar">{participant.name[0]}</div>
            <span>{participant.name}</span>
            {participant.isMuted && <FaMicrophoneSlash className="status-icon" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupCall;