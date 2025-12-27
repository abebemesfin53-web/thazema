import React, { useState, useEffect, useRef } from 'react';
import { FaHeart, FaReply, FaShare, FaDownload, FaPlay, FaPause } from 'react-icons/fa';
import './StoryViewer.css';

const StoryViewer = ({ stories, currentStoryIndex, onClose, onNext, onPrevious }) => {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const [replyText, setReplyText] = useState('');
  const videoRef = useRef(null);
  const progressInterval = useRef(null);

  const currentStory = stories[currentStoryIndex];
  const currentMedia = currentStory?.segments[currentSegment];

  useEffect(() => {
    if (isPlaying && currentMedia) {
      startProgress();
    } else {
      stopProgress();
    }

    return () => stopProgress();
  }, [currentSegment, isPlaying, currentMedia]);

  const startProgress = () => {
    const duration = currentMedia?.type === 'video' ? 15000 : 5000; // 15s for video, 5s for image
    const interval = 50;
    let elapsed = 0;

    progressInterval.current = setInterval(() => {
      elapsed += interval;
      const newProgress = (elapsed / duration) * 100;
      setProgress(newProgress);

      if (newProgress >= 100) {
        handleNext();
      }
    }, interval);
  };

  const stopProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const handleNext = () => {
    if (currentSegment < currentStory.segments.length - 1) {
      setCurrentSegment(currentSegment + 1);
      setProgress(0);
    } else if (currentStoryIndex < stories.length - 1) {
      onNext();
      setCurrentSegment(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentSegment > 0) {
      setCurrentSegment(currentSegment - 1);
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      onPrevious();
      setCurrentSegment(0);
      setProgress(0);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleReaction = (emoji) => {
    // Send reaction to story
    console.log('Reaction sent:', emoji);
    setShowReactions(false);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      // Send reply to story
      console.log('Reply sent:', replyText);
      setReplyText('');
    }
  };

  const handleShare = () => {
    // Share story functionality
    console.log('Story shared');
  };

  const handleDownload = () => {
    // Download story media
    console.log('Story downloaded');
  };

  if (!currentStory || !currentMedia) return null;

  return (
    <div className="story-viewer">
      {/* Progress bars */}
      <div className="story-progress">
        {currentStory.segments.map((_, index) => (
          <div key={index} className="progress-bar">
            <div 
              className="progress-fill"
              style={{
                width: index < currentSegment ? '100%' : 
                       index === currentSegment ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Story header */}
      <div className="story-header">
        <div className="story-user-info">
          <img src={currentStory.user.avatar} alt={currentStory.user.name} className="story-avatar" />
          <div className="story-user-details">
            <span className="story-username">{currentStory.user.name}</span>
            <span className="story-time">{currentStory.timestamp}</span>
          </div>
        </div>
        <div className="story-actions">
          <button onClick={togglePlayPause} className="play-pause-btn">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={handleShare} className="action-btn">
            <FaShare />
          </button>
          <button onClick={handleDownload} className="action-btn">
            <FaDownload />
          </button>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
      </div>

      {/* Story content */}
      <div className="story-content" onClick={togglePlayPause}>
        {currentMedia.type === 'image' ? (
          <img src={currentMedia.url} alt="Story" className="story-media" />
        ) : (
          <video
            ref={videoRef}
            src={currentMedia.url}
            className="story-media"
            autoPlay
            muted
            loop={false}
            onEnded={handleNext}
          />
        )}

        {/* Story text overlay */}
        {currentMedia.text && (
          <div className="story-text-overlay">
            <p>{currentMedia.text}</p>
          </div>
        )}

        {/* Navigation areas */}
        <div className="story-nav-left" onClick={handlePrevious} />
        <div className="story-nav-right" onClick={handleNext} />
      </div>

      {/* Story interactions */}
      <div className="story-interactions">
        {/* Quick reactions */}
        <div className="quick-reactions">
          <button 
            className="reaction-btn"
            onClick={() => setShowReactions(!showReactions)}
          >
            <FaHeart />
          </button>
          
          {showReactions && (
            <div className="reactions-menu">
              {['❤️', '😂', '😮', '😢', '😡', '👍'].map(emoji => (
                <button 
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="emoji-reaction"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reply input */}
        <div className="story-reply">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply to story..."
            className="reply-input"
            onKeyPress={(e) => e.key === 'Enter' && handleReply()}
          />
          <button onClick={handleReply} className="reply-send-btn">
            <FaReply />
          </button>
        </div>
      </div>

      {/* Story viewers (for own stories) */}
      {currentStory.isOwn && (
        <div className="story-viewers">
          <div className="viewers-header">
            <FaHeart className="viewers-icon" />
            <span>{currentStory.views} views</span>
          </div>
          <div className="viewers-list">
            {currentStory.viewers?.map(viewer => (
              <div key={viewer.id} className="viewer-item">
                <img src={viewer.avatar} alt={viewer.name} />
                <span>{viewer.name}</span>
                <span className="view-time">{viewer.viewTime}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;