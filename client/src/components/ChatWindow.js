import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaPaperclip, FaImage, FaFile, FaMicrophone, FaSmile, FaReply } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import './ChatWindow.css';

const ChatWindow = ({ chat, currentUser, onSendMessage, onBack }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: currentUser.id,
        timestamp: new Date(),
        replyTo: replyingTo,
        status: 'sent'
      };
      
      onSendMessage(newMessage);
      setMessage('');
      setReplyingTo(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newMessage = {
        id: Date.now(),
        type: 'file',
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        },
        sender: currentUser.id,
        timestamp: new Date(),
        status: 'sent'
      };
      
      onSendMessage(newMessage);
    }
    setShowAttachMenu(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newMessage = {
        id: Date.now(),
        type: 'image',
        image: {
          url: URL.createObjectURL(file),
          name: file.name
        },
        sender: currentUser.id,
        timestamp: new Date(),
        status: 'sent'
      };
      
      onSendMessage(newMessage);
    }
    setShowAttachMenu(false);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Implement voice recording
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // Implement voice recording stop and send
  };

  const handleReply = (messageToReply) => {
    setReplyingTo(messageToReply);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (msg) => {
    const isOwn = msg.sender === currentUser.id;
    
    return (
      <div key={msg.id} className={`message ${isOwn ? 'own' : 'other'}`}>
        {msg.replyTo && (
          <div className="reply-preview">
            <div className="reply-line"></div>
            <div className="reply-content">
              <span className="reply-sender">{msg.replyTo.sender === currentUser.id ? 'You' : chat.name}</span>
              <span className="reply-text">{msg.replyTo.text}</span>
            </div>
          </div>
        )}
        
        <div className="message-content">
          {msg.type === 'image' && (
            <div className="message-image">
              <img src={msg.image.url} alt={msg.image.name} />
            </div>
          )}
          
          {msg.type === 'file' && (
            <div className="message-file">
              <FaFile className="file-icon" />
              <div className="file-info">
                <span className="file-name">{msg.file.name}</span>
                <span className="file-size">{(msg.file.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          )}
          
          {msg.type === 'voice' && (
            <div className="message-voice">
              <button className="play-btn">▶️</button>
              <div className="voice-waveform"></div>
              <span className="voice-duration">{msg.duration}</span>
            </div>
          )}
          
          {(!msg.type || msg.type === 'text') && (
            <span className="message-text">{msg.text}</span>
          )}
        </div>
        
        <div className="message-footer">
          <span className="message-time">{formatTime(msg.timestamp)}</span>
          {isOwn && (
            <span className={`message-status ${msg.status}`}>
              {msg.status === 'sent' && '✓'}
              {msg.status === 'delivered' && '✓✓'}
              {msg.status === 'read' && '✓✓'}
            </span>
          )}
        </div>
        
        <button className="reply-btn" onClick={() => handleReply(msg)}>
          <FaReply />
        </button>
      </div>
    );
  };

  return (
    <div className="chat-window">
      {/* Chat header */}
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="chat-avatar">
          <img src={chat.avatar} alt={chat.name} />
          <div className={`status-indicator ${chat.status}`}></div>
        </div>
        <div className="chat-info">
          <h3>{chat.name}</h3>
          <span className="last-seen">
            {chat.status === 'online' ? 'Online' : `Last seen ${chat.lastSeen}`}
          </span>
        </div>
        <div className="chat-actions">
          <button className="action-btn">📞</button>
          <button className="action-btn">📹</button>
          <button className="action-btn">⋮</button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {chat.messages?.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply preview */}
      {replyingTo && (
        <div className="reply-preview-bar">
          <div className="reply-content">
            <span className="replying-to">Replying to {replyingTo.sender === currentUser.id ? 'yourself' : chat.name}</span>
            <span className="reply-text">{replyingTo.text}</span>
          </div>
          <button className="cancel-reply" onClick={() => setReplyingTo(null)}>✕</button>
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-area">
        <div className="input-container">
          <button 
            className="attach-btn"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
          >
            <FaPaperclip />
          </button>
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="message-input"
            rows="1"
          />
          
          <button 
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaSmile />
          </button>
          
          {message.trim() ? (
            <button className="send-btn" onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          ) : (
            <button 
              className={`voice-btn ${isRecording ? 'recording' : ''}`}
              onMouseDown={startVoiceRecording}
              onMouseUp={stopVoiceRecording}
              onTouchStart={startVoiceRecording}
              onTouchEnd={stopVoiceRecording}
            >
              <FaMicrophone />
            </button>
          )}
        </div>

        {/* Attachment menu */}
        {showAttachMenu && (
          <div className="attach-menu">
            <button onClick={() => imageInputRef.current?.click()}>
              <FaImage /> Photo
            </button>
            <button onClick={() => fileInputRef.current?.click()}>
              <FaFile /> Document
            </button>
          </div>
        )}

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ChatWindow;