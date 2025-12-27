import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1>About Thazema</h1>
        <p className="about-description">
          Thazema is a modern real-time video and audio calling application
          designed to connect people seamlessly across the globe.
        </p>

        <div className="admin-section">
          <h2>Administrator Contact</h2>
          <div className="admin-info">
            <div className="admin-avatar">A</div>
            <div className="admin-details">
              <h3>Abebe</h3>
              <div className="contact-item">
                <span className="label">Phone:</span>
                <a href="tel:+251914319513">+251 914 319 513</a>
              </div>
              <div className="contact-item">
                <span className="label">Email:</span>
                <a href="mailto:abebemesfin53@gmail.com">abebemesfin53@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2>Key Features</h2>
          <ul className="features-list">
            <li>High-quality video and audio calls</li>
            <li>Secure end-to-end communication</li>
            <li>Real-time connection status</li>
            <li>Easy-to-use interface</li>
            <li>Cross-platform compatibility</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
