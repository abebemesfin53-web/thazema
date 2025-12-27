import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';
import './CallScreen.css';

const CallScreen = ({ callData, onEndCall }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callData.type === 'audio');
  const [callDuration, setCallDuration] = useState(0);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const callStartTimeRef = useRef(null);

  useEffect(() => {
    initializeCall();
    callStartTimeRef.current = Date.now();
    
    const interval = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, []);

  const initializeCall = async () => {
    try {
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callData.type === 'video',
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };
      
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('ice:candidate', {
            targetUserId: callData.isCaller ? callData.contact._id : callData.callerId,
            candidate: event.candidate
          });
        }
      };

      // Setup socket listeners
      if (socket) {
        socket.on('ice:candidate', async ({ candidate }) => {
          try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        });

        if (callData.isCaller) {
          // Create and send offer
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          
          socket.emit('call:initiate', {
            callerId: user.id,
            receiverId: callData.contact._id,
            type: callData.type,
            offer
          });

          socket.on('call:answered', async ({ answer }) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          });
        } else {
          // Set remote description and create answer
          await peerConnection.setRemoteDescription(new RTCSessionDescription(callData.offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          
          socket.emit('call:answer', {
            callerId: callData.callerId,
            answer
          });
        }
      }
    } catch (error) {
      console.error('Error initializing call:', error);
      alert('Failed to access camera/microphone');
      onEndCall();
    }
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (socket) {
      socket.emit('call:end', {
        callId: callData.callId,
        otherUserId: callData.isCaller ? callData.contact._id : callData.callerId,
        duration: callDuration
      });
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleEndCall = () => {
    cleanup();
    onEndCall();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="call-screen">
      <div className="call-header">
        <h2>{callData.isCaller ? callData.contact.username : 'Incoming Call'}</h2>
        <span className="call-duration">{formatDuration(callDuration)}</span>
      </div>

      <div className="video-container">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="remote-video"
        />
        
        {callData.type === 'video' && (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="local-video"
          />
        )}
      </div>

      <div className="call-controls">
        <button
          onClick={toggleMute}
          className={`control-btn ${isMuted ? 'active' : ''}`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>

        {callData.type === 'video' && (
          <button
            onClick={toggleVideo}
            className={`control-btn ${isVideoOff ? 'active' : ''}`}
            title={isVideoOff ? 'Turn on video' : 'Turn off video'}
          >
            {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
          </button>
        )}

        <button
          onClick={handleEndCall}
          className="control-btn end-call"
          title="End call"
        >
          <FaPhoneSlash />
        </button>
      </div>
    </div>
  );
};

export default CallScreen;
