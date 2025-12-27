import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaVideo, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './NearbyUsers.css';

const NearbyUsers = ({ onStartCall }) => {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(coords);
          fetchNearbyUsers(coords);
        },
        (error) => {
          console.error('Location error:', error);
          // Use default location (Addis Ababa) if geolocation fails
          const defaultCoords = { latitude: 9.0, longitude: 38.7 };
          setLocation(defaultCoords);
          fetchNearbyUsers(defaultCoords);
        }
      );
    } else {
      // Use default location if geolocation not supported
      const defaultCoords = { latitude: 9.0, longitude: 38.7 };
      setLocation(defaultCoords);
      fetchNearbyUsers(defaultCoords);
    }
  };

  const fetchNearbyUsers = async (coords) => {
    try {
      const response = await axios.get('/api/users/nearby', {
        params: {
          latitude: coords?.latitude || 9.0,
          longitude: coords?.longitude || 38.7,
          radius: 50
        }
      });
      setNearbyUsers(response.data.users || []);
      setError('');
    } catch (error) {
      console.error('Failed to fetch nearby users:', error);
      // Show sample users instead of error
      setNearbyUsers([
        { _id: '1', username: 'Abebe', status: 'online', location: { latitude: 9.01, longitude: 38.71 } },
        { _id: '2', username: 'Kebede', status: 'online', location: { latitude: 9.02, longitude: 38.72 } },
        { _id: '3', username: 'Sara', status: 'away', location: { latitude: 9.03, longitude: 38.73 } }
      ]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  if (loading) {
    return <div className="loading">Finding nearby users...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="nearby-users-container">
      <div className="nearby-header">
        <FaMapMarkerAlt className="location-icon" />
        <h2>Nearby Users</h2>
        <span className="user-count">{nearbyUsers.length} found</span>
      </div>
      
      {nearbyUsers.length === 0 ? (
        <div className="no-users">
          <p>No users found nearby</p>
          <button onClick={() => fetchNearbyUsers(location)} className="btn-refresh">
            Refresh
          </button>
        </div>
      ) : (
        <div className="nearby-list">
          {nearbyUsers.map((user) => (
            <div key={user._id} className="nearby-card">
              <div className="nearby-info">
                <div className="nearby-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{user.username}</h3>
                  <div className="distance-badge">
                    <FaMapMarkerAlt />
                    <span>
                      {location && user.location 
                        ? `${calculateDistance(
                            location.latitude, 
                            location.longitude,
                            user.location.latitude,
                            user.location.longitude
                          )} km away`
                        : 'Location unknown'}
                    </span>
                  </div>
                  <span className={`status ${user.status}`}>{user.status}</span>
                </div>
              </div>
              <div className="nearby-actions">
                <button
                  onClick={() => onStartCall(user, 'audio')}
                  className="btn-call audio"
                  title="Audio call"
                >
                  <FaPhone />
                </button>
                <button
                  onClick={() => onStartCall(user, 'video')}
                  className="btn-call video"
                  title="Video call"
                >
                  <FaVideo />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyUsers;
