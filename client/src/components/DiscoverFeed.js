import React, { useState } from 'react';
import { FaFire, FaMapMarkerAlt, FaUsers, FaHashtag, FaPlay, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import './DiscoverFeed.css';

const DiscoverFeed = () => {
  const [activeTab, setActiveTab] = useState('trending');

  const trendingChannels = [
    {
      id: 1,
      name: 'Tech News Ethiopia',
      subscribers: '12.5K',
      avatar: 'T',
      description: 'Latest technology news and updates',
      isFollowing: false
    },
    {
      id: 2,
      name: 'Addis Events',
      subscribers: '8.2K',
      avatar: 'A',
      description: 'Events and happenings in Addis Ababa',
      isFollowing: true
    },
    {
      id: 3,
      name: 'Ethiopian Music',
      subscribers: '25.1K',
      avatar: 'E',
      description: 'Traditional and modern Ethiopian music',
      isFollowing: false
    }
  ];

  const localEvents = [
    {
      id: 1,
      title: 'Coffee Festival 2024',
      location: 'Meskel Square',
      date: 'Dec 28, 2024',
      attendees: 245,
      image: '☕',
      distance: '2.1 km'
    },
    {
      id: 2,
      title: 'Tech Meetup Addis',
      location: 'Hyatt Regency',
      date: 'Dec 30, 2024',
      attendees: 89,
      image: '💻',
      distance: '5.3 km'
    },
    {
      id: 3,
      title: 'New Year Celebration',
      location: 'Unity Park',
      date: 'Jan 1, 2025',
      attendees: 1200,
      image: '🎉',
      distance: '3.7 km'
    }
  ];

  const suggestedFriends = [
    {
      id: 1,
      username: 'Alex Miller',
      mutualFriends: 5,
      avatar: 'A',
      reason: 'Works at TechCorp'
    },
    {
      id: 2,
      username: 'Emma Davis',
      mutualFriends: 3,
      avatar: 'E',
      reason: 'Lives nearby'
    },
    {
      id: 3,
      username: 'David Brown',
      mutualFriends: 8,
      avatar: 'D',
      reason: 'Mutual friends'
    }
  ];

  const hashtagTrends = [
    { tag: '#AddisAbaba', posts: '2.1K' },
    { tag: '#Ethiopia', posts: '5.8K' },
    { tag: '#Coffee', posts: '892' },
    { tag: '#TechNews', posts: '1.2K' },
    { tag: '#NewYear2025', posts: '3.4K' }
  ];

  const videoFeed = [
    {
      id: 1,
      creator: 'John Doe',
      avatar: 'J',
      title: 'Amazing Ethiopian Landscape',
      views: '12.5K',
      likes: 892,
      comments: 45,
      thumbnail: '🏔️',
      duration: '0:45'
    },
    {
      id: 2,
      creator: 'Jane Smith',
      avatar: 'J',
      title: 'Traditional Coffee Ceremony',
      views: '8.2K',
      likes: 654,
      comments: 32,
      thumbnail: '☕',
      duration: '1:20'
    }
  ];

  const renderTrendingChannels = () => (
    <div className="trending-channels">
      {trendingChannels.map(channel => (
        <div key={channel.id} className="channel-card">
          <div className="channel-avatar">{channel.avatar}</div>
          <div className="channel-info">
            <h3>{channel.name}</h3>
            <p>{channel.description}</p>
            <span className="subscribers">{channel.subscribers} subscribers</span>
          </div>
          <button className={`follow-btn ${channel.isFollowing ? 'following' : ''}`}>
            {channel.isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      ))}
    </div>
  );

  const renderLocalEvents = () => (
    <div className="local-events">
      {localEvents.map(event => (
        <div key={event.id} className="event-card">
          <div className="event-image">{event.image}</div>
          <div className="event-info">
            <h3>{event.title}</h3>
            <div className="event-details">
              <span><FaMapMarkerAlt /> {event.location}</span>
              <span>{event.date}</span>
              <span>{event.distance} away</span>
            </div>
            <div className="event-attendees">
              <FaUsers /> {event.attendees} attending
            </div>
          </div>
          <button className="interested-btn">Interested</button>
        </div>
      ))}
    </div>
  );

  const renderSuggestedFriends = () => (
    <div className="suggested-friends">
      {suggestedFriends.map(friend => (
        <div key={friend.id} className="friend-suggestion">
          <div className="friend-avatar">{friend.avatar}</div>
          <div className="friend-info">
            <h3>{friend.username}</h3>
            <p>{friend.mutualFriends} mutual friends</p>
            <span className="reason">{friend.reason}</span>
          </div>
          <div className="friend-actions">
            <button className="add-friend-btn">Add Friend</button>
            <button className="remove-btn">×</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHashtagTrends = () => (
    <div className="hashtag-trends">
      {hashtagTrends.map((trend, index) => (
        <div key={index} className="trend-item">
          <FaHashtag className="hashtag-icon" />
          <div className="trend-info">
            <span className="hashtag">{trend.tag}</span>
            <span className="post-count">{trend.posts} posts</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderVideoFeed = () => (
    <div className="video-feed">
      {videoFeed.map(video => (
        <div key={video.id} className="video-card">
          <div className="video-thumbnail">
            <span className="thumbnail-emoji">{video.thumbnail}</span>
            <div className="play-overlay">
              <FaPlay />
            </div>
            <span className="video-duration">{video.duration}</span>
          </div>
          <div className="video-info">
            <div className="creator-info">
              <div className="creator-avatar">{video.avatar}</div>
              <div>
                <h4>{video.title}</h4>
                <span className="creator-name">{video.creator}</span>
              </div>
            </div>
            <div className="video-stats">
              <span>{video.views} views</span>
              <div className="video-actions">
                <span><FaHeart /> {video.likes}</span>
                <span><FaComment /> {video.comments}</span>
                <span><FaShare /></span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const tabs = [
    { id: 'trending', label: 'Trending', icon: <FaFire /> },
    { id: 'events', label: 'Events', icon: <FaMapMarkerAlt /> },
    { id: 'friends', label: 'Friends', icon: <FaUsers /> },
    { id: 'hashtags', label: 'Trends', icon: <FaHashtag /> },
    { id: 'videos', label: 'Videos', icon: <FaPlay /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'trending':
        return renderTrendingChannels();
      case 'events':
        return renderLocalEvents();
      case 'friends':
        return renderSuggestedFriends();
      case 'hashtags':
        return renderHashtagTrends();
      case 'videos':
        return renderVideoFeed();
      default:
        return renderTrendingChannels();
    }
  };

  return (
    <div className="discover-container">
      <div className="discover-header">
        <h2>Discover</h2>
      </div>

      <div className="discover-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`discover-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="discover-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default DiscoverFeed;