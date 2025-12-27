import React from 'react';
import { FaUsers, FaMapMarkerAlt, FaStar, FaClock } from 'react-icons/fa';
import './FilterButtons.css';

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Users', icon: <FaUsers /> },
    { id: 'nearby', label: 'Nearby', icon: <FaMapMarkerAlt /> },
    { id: 'favorites', label: 'Favorites', icon: <FaStar /> },
    { id: 'recent', label: 'Recent', icon: <FaClock /> }
  ];

  return (
    <div className="filter-buttons">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          <span className="filter-icon">{filter.icon}</span>
          <span className="filter-label">{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
